// src/App.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Character, 
  LogEntry, 
  GameEvent, 
  EventChoice, 
  GameSpeed, 
  ThemeMode, 
  BattleState, 
  AdvancedSettings,
  ReincarnationConfig
} from './types';
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
import { AdvancedSettingsModal } from './components/AdvancedSettingsModal';
import { ReincarnationModal } from './components/ReincarnationModal';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReincarnationOpen, setIsReincarnationOpen] = useState(false);

  // 시간 및 설정
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<GameSpeed>(() => storage.loadSpeed());
  const [isAutoChoiceEnabled, setIsAutoChoiceEnabled] = useState<boolean>(() => storage.loadAutoChoice());
  const [autoChoicePendingId, setAutoChoicePendingId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => storage.loadTheme());
  const [isMuted, setIsMuted] = useState<boolean>(() => storage.loadMuted());
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>(() => storage.loadAdvancedSettings());
  const [yearProgress, setYearProgress] = useState<number>(0);

  const handleChangeSpeed = (nextSpeed: GameSpeed) => {
    setSpeed(nextSpeed);
    storage.saveSpeed(nextSpeed);
  };

  const handleChangeFocusStance = (stance: any) => {
    setCharacter(prev => ({ ...prev, focusStance: stance }));
  };

  const handleUpdateSettings = (next: AdvancedSettings) => {
    setAdvancedSettings(next);
    storage.saveAdvancedSettings(next);
  };

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
      storage.saveActiveCharacter(null);
      storage.saveMemorial(character.deathRecord);
    }
  }, [character]);

  // 1년 진행 로직
  const handleAdvanceYear = useCallback(() => {
    if (!character.isAlive || currentEvent || battleState?.isActive) return;

    sound.playVitalPulse();
    const result = GameEngine.advanceOneYear(character, addLog, {
      autoManageApAndShop: isAutoChoiceEnabled && advancedSettings.autoUseApAndShop,
      aiStrategy: advancedSettings.aiStrategy
    });
    const nextChar = result.updatedChar;
    setCharacter(nextChar);

    // 위기 감지 자동 브레이크 검사
    if (nextChar.isAlive) {
      if (advancedSettings.pauseOnLowHp && nextChar.stats.health <= nextChar.stats.maxHealth * 0.25) {
        setIsPlaying(false);
      }
      if (advancedSettings.pauseOnOripathyCrisis && nextChar.oripathy.isInfected && nextChar.oripathy.crystallizationRate >= 70) {
        setIsPlaying(false);
      }
    }

    if (result.triggeredEvent) {
      setCurrentEvent(result.triggeredEvent);
      const isRareMilestone = 
        result.triggeredEvent.id.startsWith('career_special_') ||
        result.triggeredEvent.category === 'fateful';

      if (!isAutoChoiceEnabled || (advancedSettings.pauseOnRareEvent && isRareMilestone)) {
        setIsPlaying(false);
      }
    }
  }, [character, currentEvent, battleState, addLog, isAutoChoiceEnabled, advancedSettings]);

  // 다음 선택지(사건)가 발생할 때까지 즉시 건너뛰기
  const handleSkipToNextEvent = useCallback(() => {
    if (!character.isAlive || currentEvent || battleState?.isActive) return;

    sound.playVitalPulse();
    let currentChar = character;
    let foundEvent: GameEvent | undefined = undefined;

    for (let i = 0; i < 40; i++) {
      const result = GameEngine.advanceOneYear(currentChar, addLog, {
        autoManageApAndShop: isAutoChoiceEnabled && advancedSettings.autoUseApAndShop,
        aiStrategy: advancedSettings.aiStrategy
      });
      currentChar = result.updatedChar;

      if (!currentChar.isAlive) {
        break;
      }

      if (result.triggeredEvent) {
        foundEvent = result.triggeredEvent;
        break;
      }

      if (advancedSettings.pauseOnLowHp && currentChar.stats.health <= currentChar.stats.maxHealth * 0.25) {
        break;
      }
    }

    setCharacter(currentChar);
    if (foundEvent) {
      setCurrentEvent(foundEvent);
      setIsPlaying(false);
    }
  }, [character, currentEvent, battleState, addLog, isAutoChoiceEnabled, advancedSettings]);

  // 자동 진행 타이머
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isPlaying && character.isAlive && !currentEvent && !battleState) {
      const speedIntervalMap: Record<GameSpeed, number> = {
        1: 2400,
        2: 1600,
        4: 1050,
        8: 700,
        16: 480,
        32: 350
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
      const chosen = GameEngine.selectAutoChoice(character, currentEvent, advancedSettings.aiStrategy);
      setAutoChoicePendingId(chosen.id);

      const speedDelay: Record<GameSpeed, number> = {
        1: 2000,
        2: 1300,
        4: 900,
        8: 600,
        16: 420,
        32: 300
      };
      const delay = speedDelay[speed] || 1000;

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
  }, [isPlaying, currentEvent, character, speed, isAutoChoiceEnabled, advancedSettings.aiStrategy]);

  // 자동 진행 시 턴제 전투 자동 진행
  useEffect(() => {
    if (isPlaying && battleState && character.isAlive && isAutoChoiceEnabled) {
      if (battleState.result) {
        const closeTimer = setTimeout(() => {
          setBattleState(undefined);
        }, Math.max(350, Math.floor(900 / speed)));
        return () => clearTimeout(closeTimer);
      }

      if (battleState.isActive && battleState.isPlayerTurn) {
        const speedDelay: Record<GameSpeed, number> = {
          1: 1600,
          2: 1050,
          4: 720,
          8: 480,
          16: 340,
          32: 240
        };
        const delay = speedDelay[speed] || 750;

        const battleTimer = setTimeout(() => {
          const { command, itemId } = GameEngine.selectAutoBattleCommand(character, battleState);
          handleBattleCommand(command, itemId);
        }, delay);

        return () => clearTimeout(battleTimer);
      }
    }
  }, [isPlaying, battleState, character, speed, isAutoChoiceEnabled]);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

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
      } else if (e.key === '6' || e.key === '0') {
        setSpeed(16);
      } else if (e.key === '3' || e.key === '5') {
        setSpeed(32);
      } else if (e.key === '[') {
        const list: GameSpeed[] = [1, 2, 4, 8, 16, 32];
        setSpeed(prev => {
          const idx = list.indexOf(prev);
          return idx > 0 ? list[idx - 1] : prev;
        });
      } else if (e.key === ']') {
        const list: GameSpeed[] = [1, 2, 4, 8, 16, 32];
        setSpeed(prev => {
          const idx = list.indexOf(prev);
          return idx < list.length - 1 ? list[idx + 1] : prev;
        });
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

    if (result.battleEnemy && result.updatedChar.isAlive) {
      const newBattle = GameEngine.startBattle(result.battleEnemy);
      setBattleState(newBattle);
      if (!isAutoChoiceEnabled) {
        setIsPlaying(false);
      }
    }
  };

  // 연간 자율 행동 실행
  const handleAnnualAction = (
    actionType: 'cultivate_arts' | 'train_combat' | 'take_suppressant' | 'faction_bounty' | 'recreation' | 'study_lore'
  ) => {
    const updated = GameEngine.executeAnnualAction(character, actionType, addLog);
    setCharacter(updated);
  };

  // 무기고 및 암시장 아이템 구매 / 장착
  const handleBuyOrEquipItem = (itemId: string) => {
    const updated = GameEngine.buyOrEquipItem(character, itemId, addLog);
    setCharacter(updated);
  };

  // 인벤토리 소모품 즉시 사용
  const handleUseInventoryItem = (itemId: string) => {
    const updated = GameEngine.useInventoryItem(character, itemId, addLog);
    setCharacter(updated);
  };

  // 특수 직군 임관 신청
  const handlePromoteCareer = (careerId: string) => {
    const updated = GameEngine.promoteToSpecialCareer(character, careerId, addLog);
    setCharacter(updated);
  };

  // 전투 커맨드 실행
  const handleBattleCommand = (command: 'attack' | 'arts' | 'defend' | 'item' | 'flee', itemId?: string) => {
    if (!battleState) return;
    const { updatedChar, updatedBattle } = GameEngine.executeBattleCommand(character, battleState, command, itemId, addLog);
    setCharacter(updatedChar);
    if (!updatedChar.isAlive) {
      setBattleState(undefined);
    } else {
      setBattleState(updatedBattle);
    }
  };

  // 새로운 캐릭터로 환생 시작 (무작위 또는 커스텀 설정 반영)
  const handleStartReincarnation = (config?: ReincarnationConfig) => {
    sound.playBeep(600, 0.1, 'sine');
    const newChar = GameEngine.createRandomCharacter(config);
    setCharacter(newChar);
    setCurrentEvent(undefined);
    setAutoChoicePendingId(null);
    setBattleState(undefined);
    setIsPlaying(true);

    const perkBadges = newChar.reincarnationPerks && newChar.reincarnationPerks.length > 0
      ? [`환생 특전 ${newChar.reincarnationPerks.length}개 적용`]
      : undefined;

    const initialLog: LogEntry = {
      id: 'init_' + Date.now(),
      year: newChar.year,
      age: 0,
      title: '【새로운 생애】 테라의 대지에 다시 태어나다',
      text: `${newChar.nation}의 [${newChar.environment}]에서 ${newChar.race}${newChar.subRace ? `(${newChar.subRace})` : ''}의 아이 "${newChar.name}"(으)로 새로운 생애를 시작합니다.`,
      type: 'general',
      effectBadges: perkBadges,
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
          onChangeSpeed={handleChangeSpeed}
          yearProgress={yearProgress}
          currentSeason={GameEngine.pickSeason(character)}
          onChangeFocusStance={handleChangeFocusStance}
          onNextYear={handleAdvanceYear}
          onSkipToNextEvent={handleSkipToNextEvent}
          isAutoChoiceEnabled={isAutoChoiceEnabled}
          onToggleAutoChoice={handleToggleAutoChoice}
          autoChoicePendingId={autoChoicePendingId}
          onOpenActions={() => setIsActionsOpen(true)}
          onOpenHallOfFame={() => setIsHallOfFameOpen(true)}
          onOpenAchievementBook={() => setIsAchievementBookOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenReincarnation={() => setIsReincarnationOpen(true)}
          crtEffect={advancedSettings.crtEffect}
          onRestart={() => handleStartReincarnation()}
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
          onChangeSpeed={handleChangeSpeed}
          onNextYear={handleAdvanceYear}
          onSkipToNextEvent={handleSkipToNextEvent}
          isAutoChoiceEnabled={isAutoChoiceEnabled}
          onToggleAutoChoice={handleToggleAutoChoice}
          autoChoicePendingId={autoChoicePendingId}
          onOpenActions={() => setIsActionsOpen(true)}
          onOpenHallOfFame={() => setIsHallOfFameOpen(true)}
          onOpenAchievementBook={() => setIsAchievementBookOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenReincarnation={() => setIsReincarnationOpen(true)}
          onRestart={() => handleStartReincarnation()}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onSwitchTheme={handleSwitchTheme}
          theme={theme}
        />
      )}

      {/* Annual Actions, Armory & Career Center Modal */}
      <AnnualActionsModal
        character={character}
        isOpen={isActionsOpen}
        onClose={() => setIsActionsOpen(false)}
        onAction={handleAnnualAction}
        onBuyOrEquipItem={handleBuyOrEquipItem}
        onUseInventoryItem={handleUseInventoryItem}
        onPromoteCareer={handlePromoteCareer}
        theme={theme}
      />

      {/* Combat Modal (Fixed: remains open until closed so victory/flee result screen is visible) */}
      {battleState && (
        <CombatModal
          character={character}
          battle={battleState}
          isOpen={!!battleState}
          onExecuteCommand={handleBattleCommand}
          onClose={() => setBattleState(undefined)}
          theme={theme}
        />
      )}

      {/* Memorial Modal on Death */}
      {character.deathRecord && !character.isAlive && (
        <MemorialModal
          record={character.deathRecord}
          isOpen={!character.isAlive && !isReincarnationOpen}
          onRestart={() => handleStartReincarnation()}
          onOpenReincarnation={() => setIsReincarnationOpen(true)}
          onOpenHallOfFame={() => setIsHallOfFameOpen(true)}
          onOpenAchievementBook={() => setIsAchievementBookOpen(true)}
          theme={theme}
        />
      )}

      {/* Reincarnation & Destiny Setup Modal */}
      <ReincarnationModal
        isOpen={isReincarnationOpen}
        onClose={() => setIsReincarnationOpen(false)}
        onStartReincarnation={handleStartReincarnation}
        theme={theme}
      />

      {/* Advanced Simulation & AI Settings Modal */}
      <AdvancedSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={advancedSettings}
        onUpdateSettings={handleUpdateSettings}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        theme={theme}
        onSwitchTheme={handleSwitchTheme}
      />

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
