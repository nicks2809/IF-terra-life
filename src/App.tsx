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
  const [theme, setTheme] = useState<ThemeMode>(() => storage.loadTheme());
  const [isMuted, setIsMuted] = useState<boolean>(() => storage.loadMuted());

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
      setIsPlaying(false); // 이벤트 발생 시 일시정지하여 유저 선택 대기
    }
  }, [character, currentEvent, battleState, addLog]);

  // 자동 진행 타이머
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isPlaying && character.isAlive && !currentEvent && !battleState?.isActive) {
      const intervalMs = Math.max(1500, Math.floor(16000 / speed));
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

  // 선택지 선택
  const handleSelectChoice = (choice: EventChoice) => {
    const result = GameEngine.resolveChoice(character, choice, addLog);
    setCharacter(result.updatedChar);
    setCurrentEvent(undefined);

    if (result.battleEnemy) {
      const newBattle = GameEngine.startBattle(result.battleEnemy);
      setBattleState(newBattle);
      setIsPlaying(false);
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
