// src/App.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Character, LogEntry, GameEvent, EventChoice, GameSpeed, ThemeMode, BattleState } from './types';
import { GameEngine } from './engine/gameEngine';
import { storage } from './services/storage';
import { sound } from './services/sound';
import { PRTSTerminal } from './components/PRTSTerminal';
import { HistoryTome } from './components/HistoryTome';
import { AnnualActionsModal } from './components/AnnualActionsModal';
import { CombatModal } from './components/CombatModal';
import { MemorialModal } from './components/MemorialModal';
import { HallOfFameModal } from './components/HallOfFameModal';
import { AchievementBookModal } from './components/AchievementBookModal';

export const App: React.FC = () => {
  // --- 상태 관리 ---
  const [character, setCharacter] = useState<Character>(() => {
    const saved = storage.loadActiveCharacter();
    if (saved && saved.isAlive) return saved;
    return GameEngine.createRandomCharacter();
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const savedLogs = storage.loadLogs();
    if (savedLogs.length > 0) return savedLogs;
    return [
      {
        id: 'init_log',
        year: 1085,
        age: 0,
        title: '【생애의 시작】 테라의 대지에 태어나다',
        text: '혼돈과 재앙이 휩쓰는 테라의 하늘 아래, 하나의 새로운 생명이 첫 울음을 터뜨렸습니다.',
        type: 'general',
        timestamp: new Date().toISOString()
      }
    ];
  });

  const [currentEvent, setCurrentEvent] = useState<GameEvent | undefined>(undefined);
  const [battleState, setBattleState] = useState<BattleState | undefined>(undefined);
  
  // 모달 제어
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isHallOfFameOpen, setIsHallOfFameOpen] = useState(false);
  const [isAchievementBookOpen, setIsAchievementBookOpen] = useState(false);

  // 시간 및 설정
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<GameSpeed>(1);
  const [isAutoChoiceEnabled, setIsAutoChoiceEnabled] = useState<boolean>(() => storage.loadAutoChoice());
  const [autoChoicePendingId, setAutoChoicePendingId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => storage.loadTheme());
  const [isMuted, setIsMuted] = useState<boolean>(() => storage.loadMuted());

  const handleToggleAutoChoice = () => {
    const next = !isAutoChoiceEnabled;
    setIsAutoChoiceEnabled(next);
    storage.saveAutoChoice(next);
  };

  // 사운드 초기 설정
  useEffect(() => {
    sound.setMuted(isMuted);
  }, [isMuted]);

  // 로그 추가 헬퍼
  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...entry,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString()
    };
    setLogs(prev => {
      const updated = [...prev, newLog];
      storage.saveLogs(updated);
      return updated;
    });
  }, []);

  // 상태 자동 저장
  useEffect(() => {
    if (character.isAlive) {
      storage.saveActiveCharacter(character);
    } else if (character.deathRecord) {
      storage.saveActiveCharacter(null); // 사망 시 활성 캐릭터 클리어
      storage.saveMemorial(character.deathRecord);
    }
  }, [character]);

  // 1년 진행 로직
  const handleAdvanceYear = useCallback(() => {
    if (!character.isAlive || currentEvent || battleState?.isActive) return;

    sound.playVitalPulse();
    const result = GameEngine.advanceOneYear(character, addLog);
    setCharacter(result.updatedChar);

    if (result.triggeredEvent) {
      setCurrentEvent(result.triggeredEvent);
      if (!isAutoChoiceEnabled) {
        setIsPlaying(false); // 사건 자동 선택이 꺼져있을 때만 일시정지
      }
    }
  }, [character, currentEvent, battleState, addLog, isAutoChoiceEnabled]);

  // 다음 선택지(사건)가 발생할 때까지 즉시 건너뛰기
  const handleSkipToNextEvent = useCallback(() => {
    if (!character.isAlive || currentEvent || battleState?.isActive) return;

    sound.playVitalPulse();
    let currentChar = character;
    let foundEvent: GameEvent | undefined = undefined;

    // 최대 40년 또는 사건/전투/사망 발생 시까지 루프로 고속 진행
    for (let i = 0; i < 40; i++) {
      const result = GameEngine.advanceOneYear(currentChar, addLog);
      currentChar = result.updatedChar;

      if (!currentChar.isAlive) {
        break;
      }

      if (result.triggeredEvent) {
        foundEvent = result.triggeredEvent;
        break;
      }
    }

    setCharacter(currentChar);
    if (foundEvent) {
      setCurrentEvent(foundEvent);
      setIsPlaying(false); // 건너뛰기는 항상 수동 선택을 위해 일시정지
    }
  }, [character, currentEvent, battleState, addLog]);

  // 자동 진행 타이머
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isPlaying && character.isAlive && !currentEvent && !battleState?.isActive) {
      const speedIntervalMap: Record<GameSpeed, number> = {
        1: 900,  // 1x: 0.9초에 1년
        2: 450,  // 2x: 0.45초에 1년
        4: 200,  // 4x: 0.2초에 1년
        8: 80,   // 8x: 0.08초에 1년
        16: 40,  // 16x: 0.04초에 1년
        32: 20,  // 32x: 0.02초에 1년
        64: 10,  // 64x: 0.01초에 1년 (초광속 스킵)
      };
      const intervalMs = speedIntervalMap[speed] || 450;
      timerRef.current = setInterval(() => {
        handleAdvanceYear();
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, character.isAlive, currentEvent, battleState, handleAdvanceYear]);

  // 자동 진행 시 스토리 사건 자동 선택
  useEffect(() => {
    if (isPlaying && currentEvent && character.isAlive && isAutoChoiceEnabled) {
      const chosen = GameEngine.selectAutoChoice(character, currentEvent);
      setAutoChoicePendingId(chosen.id);

      const speedDelay: Record<GameSpeed, number> = {
        1: 900,
        2: 450,
        4: 200,
        8: 80,
        16: 40,
        32: 20,
        64: 10
      };
      const delay = speedDelay[speed] || 450;

      const eventTimer = setTimeout(() => {
        handleSelectChoice(chosen);
        setAutoChoicePendingId(null);
      }, delay);

      return () => {
        clearTimeout(eventTimer);
        setAutoChoicePendingId(null);
      };
    } else {
      setAutoChoicePendingId(null);
    }
  }, [isPlaying, currentEvent, character, speed, isAutoChoiceEnabled]);

  // 자동 진행 시 턴제 전투 자동 진행
  useEffect(() => {
    if (isPlaying && battleState && character.isAlive && isAutoChoiceEnabled) {
      // 전투가 끝난 상태면 잠시 후 닫기
      if (battleState.result) {
        const closeTimer = setTimeout(() => {
          setBattleState(undefined);
        }, Math.max(200, Math.floor(600 / speed)));
        return () => clearTimeout(closeTimer);
      }

      // 전투 진행 중이면 커맨드 자동 실행
      if (battleState.isActive && battleState.isPlayerTurn) {
        const speedDelay: Record<GameSpeed, number> = {
          1: 800,
          2: 400,
          4: 180,
          8: 70,
          16: 35,
          32: 18,
          64: 10
        };
        const delay = speedDelay[speed] || 400;

        const battleTimer = setTimeout(() => {
          const { command, itemId } = GameEngine.selectAutoBattleCommand(character, battleState);
          handleBattleCommand(command, itemId);
        }, delay);

        return () => clearTimeout(battleTimer);
      }
    }
  }, [isPlaying, battleState, character, speed, isAutoChoiceEnabled]);

  // 키보드 단축키 (Space: 일시정지/재생, N: 다음 해, S: 사건까지 건너뛰기, 1/2/4/8: 배속)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (character.isAlive && !currentEvent && !battleState?.isActive) {
          setIsPlaying(prev => !prev);
        }
      } else if (e.key === 'n' || e.key === 'N') {
        handleAdvanceYear();
      } else if (e.key === 's' || e.key === 'S') {
        handleSkipToNextEvent();
      } else if (e.key === '1') {
        setSpeed(1);
      } else if (e.key === '2') {
        setSpeed(2);
      } else if (e.key === '4') {
        setSpeed(4);
      } else if (e.key === '8') {
        setSpeed(8);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [character.isAlive, currentEvent, battleState, handleAdvanceYear, handleSkipToNextEvent]);

  // 선택지 선택
  const handleSelectChoice = (choice: EventChoice) => {
    const result = GameEngine.resolveChoice(character, choice, addLog);
    setCharacter(result.updatedChar);
    setCurrentEvent(undefined);
    setAutoChoicePendingId(null);

    if (result.battleEnemy) {
      const newBattle = GameEngine.startBattle(result.battleEnemy);
      setBattleState(newBattle);
      if (!isAutoChoiceEnabled) {
        setIsPlaying(false);
      }
    }
  };

  // 연간 자율 행동 실행
  const handleAnnualAction = (actionType: 'cultivate_arts' | 'train_combat' | 'take_suppressant' | 'faction_bounty' | 'recreation') => {
    const updated = GameEngine.executeAnnualAction(character, actionType, addLog);
    setCharacter(updated);
  };

  // 전투 커맨드 실행
  const handleBattleCommand = (command: 'attack' | 'arts' | 'defend' | 'item' | 'flee', itemId?: string) => {
    if (!battleState) return;
    const { updatedChar, updatedBattle } = GameEngine.executeBattleCommand(character, battleState, command, itemId);
    setCharacter(updatedChar);
    setBattleState(updatedBattle);
  };

  // 새로운 캐릭터로 재시작
  const handleRestart = () => {
    sound.playBeep(600, 0.1, 'sine');
    const newChar = GameEngine.createRandomCharacter();
    setCharacter(newChar);
    setCurrentEvent(undefined);
    setAutoChoicePendingId(null);
    setBattleState(undefined);
    setIsPlaying(false);
    const initialLog: LogEntry = {
      id: 'init_' + Date.now(),
      year: newChar.year,
      age: 0,
      title: '【새로운 생애】 테라의 대지에 다시 태어나다',
      text: `${newChar.nation}에서 ${newChar.race}의 아이로 새로운 생애를 시작합니다.`,
      type: 'general',
      timestamp: new Date().toISOString()
    };
    setLogs([initialLog]);
    storage.saveLogs([initialLog]);
    storage.saveActiveCharacter(newChar);
  };

  // 테마 전환
  const handleSwitchTheme = () => {
    sound.playBeep(750, 0.05, 'triangle');
    const nextTheme: ThemeMode = theme === 'prts' ? 'tome' : 'prts';
    setTheme(nextTheme);
    storage.saveTheme(nextTheme);
  };

  // 음소거 토글
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
    storage.saveMuted(nextMuted);
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Primary UI (PRTS vs Tome) */}
      {theme === 'prts' ? (
        <PRTSTerminal
          character={character}
          logs={logs}
          currentEvent={currentEvent}
          onSelectChoice={handleSelectChoice}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          speed={speed}
          onChangeSpeed={setSpeed}
          onNextYear={handleAdvanceYear}
          onSkipToNextEvent={handleSkipToNextEvent}
          isAutoChoiceEnabled={isAutoChoiceEnabled}
          onToggleAutoChoice={handleToggleAutoChoice}
          autoChoicePendingId={autoChoicePendingId}
          onOpenActions={() => setIsActionsOpen(true)}
          onOpenHallOfFame={() => setIsHallOfFameOpen(true)}
          onOpenAchievementBook={() => setIsAchievementBookOpen(true)}
          onRestart={handleRestart}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onSwitchTheme={handleSwitchTheme}
          theme={theme}
        />
      ) : (
        <HistoryTome
          character={character}
          logs={logs}
          currentEvent={currentEvent}
          onSelectChoice={handleSelectChoice}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          speed={speed}
          onChangeSpeed={setSpeed}
          onNextYear={handleAdvanceYear}
          onSkipToNextEvent={handleSkipToNextEvent}
          isAutoChoiceEnabled={isAutoChoiceEnabled}
          onToggleAutoChoice={handleToggleAutoChoice}
          autoChoicePendingId={autoChoicePendingId}
          onOpenActions={() => setIsActionsOpen(true)}
          onOpenHallOfFame={() => setIsHallOfFameOpen(true)}
          onOpenAchievementBook={() => setIsAchievementBookOpen(true)}
          onRestart={handleRestart}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onSwitchTheme={handleSwitchTheme}
          theme={theme}
        />
      )}

      {/* Annual Actions Modal */}
      <AnnualActionsModal
        character={character}
        isOpen={isActionsOpen}
        onClose={() => setIsActionsOpen(false)}
        onAction={handleAnnualAction}
        theme={theme}
      />

      {/* Combat Modal */}
      {battleState && (
        <CombatModal
          character={character}
          battle={battleState}
          isOpen={battleState.isActive}
          onExecuteCommand={handleBattleCommand}
          onClose={() => setBattleState(undefined)}
          theme={theme}
        />
      )}

      {/* Memorial Modal on Death */}
      {character.deathRecord && !character.isAlive && (
        <MemorialModal
          record={character.deathRecord}
          isOpen={!character.isAlive}
          onRestart={handleRestart}
          onOpenHallOfFame={() => setIsHallOfFameOpen(true)}
          onOpenAchievementBook={() => setIsAchievementBookOpen(true)}
          theme={theme}
        />
      )}

      {/* Hall of Fame Archive Modal */}
      <HallOfFameModal
        isOpen={isHallOfFameOpen}
        onClose={() => setIsHallOfFameOpen(false)}
        records={storage.loadHallOfFame()}
        theme={theme}
      />

      {/* Achievement Collection Book Modal */}
      <AchievementBookModal
        isOpen={isAchievementBookOpen}
        onClose={() => setIsAchievementBookOpen(false)}
        theme={theme}
      />
    </div>
  );
};

export default App;
