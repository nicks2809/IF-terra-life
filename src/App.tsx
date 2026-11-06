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
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import { ACHIEVEMENTS_DATA } from './data/achievements';

export const App: React.FC = () => {
  // --- 상태 관리 ---
  const [character, setCharacter] = useState<Character>(() => {
    const saved = storage.loadActiveCharacter();
    if (saved && saved.isAlive) return GameEngine.ensureCharacterDefaults(saved);
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
  const [toastQueue, setToastQueue] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newToast: ToastMessage = { ...toast, id };
    setToastQueue(prev => [...prev.slice(-4), newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToastQueue(prev => prev.filter(t => t.id !== id));
  }, []);

  // 시뮬레이션 배속 변경 및 로컬 스토리지 동기화
  const handleChangeSpeed = useCallback((nextSpeed: GameSpeed) => {
    setSpeed(nextSpeed);
    storage.saveSpeed(nextSpeed);
  }, []);

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

  // 모달/오버레이 활성화 및 사망 상태 통합 감지
  const isAnyModalOpen =
    isActionsOpen ||
    isHallOfFameOpen ||
    isAchievementBookOpen ||
    isSettingsOpen ||
    isReincarnationOpen ||
    Boolean(battleState) ||
    !character.isAlive;

  // 1년 진행 로직
  const handleAdvanceYear = useCallback(() => {
    if (!character.isAlive || currentEvent || battleState?.isActive || isAnyModalOpen) return;

    setYearProgress(0);
    sound.playVitalPulse();
    const prevAchIds = new Set(character.unlockedAchievements || []);
    const result = GameEngine.advanceOneYear(character, addLog, {
      autoManageApAndShop: isAutoChoiceEnabled && advancedSettings.autoUseApAndShop,
      aiStrategy: advancedSettings.aiStrategy
    });
    const nextChar = result.updatedChar;
    setCharacter(nextChar);

    // 신규 업적 해금 토스트 알림
    const newlyUnlocked = (nextChar.unlockedAchievements || []).filter(id => !prevAchIds.has(id));
    newlyUnlocked.forEach(id => {
      const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
      addToast({
        type: 'achievement',
        title: '【업적 해금】',
        description: ach ? `${ach.title}: ${ach.description}` : `신규 업적 달성: ${id}`,
        icon: '🏆',
        duration: 4000
      });
    });

    // 생애 목표 달성 토스트 알림
    if (!character.goalAchieved && nextChar.goalAchieved) {
      addToast({
        type: 'goal',
        title: '【생애 목표 달성】',
        description: `생애 숙원 [${nextChar.lifeGoal?.title || '생애 숙원'}] 목표를 완수하였습니다!`,
        icon: '⭐',
        duration: 5000
      });
    }

    // 직급 승급 토스트 알림
    const prevTier = character.careerTier || 1;
    const nextTier = nextChar.careerTier || 1;
    if (nextTier > prevTier || (nextChar.career !== character.career && character.age >= 15)) {
      addToast({
        type: 'promotion',
        title: '【직급 승급 / 이직】',
        description: `[T${nextTier}] ${nextChar.career}(으)로 승급되었습니다.`,
        icon: '🎖️',
        duration: 4500
      });
    }

    // 위기 감지 자동 브레이크 검사
    if (nextChar.isAlive) {
      if (advancedSettings.pauseOnLowHp && nextChar.stats.health <= nextChar.stats.maxHealth * 0.25) {
        setIsPlaying(false);
        addToast({
          type: 'crisis',
          title: '【생명 징후 위급】',
          description: `체력이 25% 이하(${nextChar.stats.health}/${nextChar.stats.maxHealth})로 급감하여 자동 정지합니다.`,
          icon: '⚠️',
          duration: 5000
        });
      }
      if (advancedSettings.pauseOnOripathyCrisis && nextChar.oripathy.isInfected && nextChar.oripathy.crystallizationRate >= 70) {
        setIsPlaying(false);
        addToast({
          type: 'crisis',
          title: '【광석병 위기 경보】',
          description: `체세포 결정화율이 ${nextChar.oripathy.crystallizationRate.toFixed(1)}%로 임계치를 초과하여 자동 정지합니다.`,
          icon: '☣️',
          duration: 5000
        });
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
  }, [character, currentEvent, battleState, addLog, isAutoChoiceEnabled, advancedSettings, addToast, isAnyModalOpen]);

  // 다음 선택지(사건)가 발생할 때까지 즉시 건너뛰기
  const handleSkipToNextEvent = useCallback(() => {
    if (!character.isAlive || currentEvent || battleState?.isActive || isAnyModalOpen) return;

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
  }, [character, currentEvent, battleState, addLog, isAutoChoiceEnabled, advancedSettings, isAnyModalOpen]);

  // 자동 진행 타이머
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isPlaying && character.isAlive && !currentEvent && !battleState && !isAnyModalOpen) {
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
  }, [isPlaying, speed, character.isAlive, currentEvent, battleState, isAnyModalOpen, handleAdvanceYear]);

  // 선택지 선택
  const handleSelectChoice = useCallback((choice: EventChoice) => {
    // 요구 조건 검증 가드 (미충족 시 사건 임의 해제 방지)
    const reqCheck = GameEngine.checkChoiceRequirements(character, choice);
    if (!reqCheck.allowed) {
      sound.playBeep(300, 0.08, 'sawtooth');
      addToast({
        type: 'info',
        title: '【선택 불가】',
        description: reqCheck.reason ? `요구 조건 미달: ${reqCheck.reason}` : '해당 선택지의 조건을 만족하지 못했습니다.',
        icon: '🔒',
        duration: 3500
      });
      return;
    }

    const result = GameEngine.resolveChoice(character, choice, addLog);
    setCharacter(result.updatedChar);
    setCurrentEvent(undefined);
    setAutoChoicePendingId(null);

    if (result.battleEnemy && result.updatedChar.isAlive) {
      const newBattle = GameEngine.startBattle(result.battleEnemy, result.battleAmbushed);
      setBattleState(newBattle);
      if (!isAutoChoiceEnabled) {
        setIsPlaying(false);
      }
    }
  }, [character, addLog, isAutoChoiceEnabled, addToast]);

  // 1년 진행 게이지 부드러운 인터벌 애니메이션
  useEffect(() => {
    if (isPlaying && character.isAlive && !currentEvent && !battleState && !isAnyModalOpen) {
      const speedIntervalMap: Record<GameSpeed, number> = {
        1: 2400,
        2: 1600,
        4: 1050,
        8: 700,
        16: 480,
        32: 350
      };
      const totalMs = speedIntervalMap[speed] || 450;
      const stepMs = 50;
      const increment = (stepMs / totalMs) * 100;

      const progressInterval = setInterval(() => {
        setYearProgress(prev => {
          if (prev >= 100) return 0;
          return Math.min(100, prev + increment);
        });
      }, stepMs);

      return () => clearInterval(progressInterval);
    } else {
      setYearProgress(0);
    }
  }, [isPlaying, speed, character.isAlive, currentEvent, battleState, isAnyModalOpen]);

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
  }, [isPlaying, currentEvent, character, speed, isAutoChoiceEnabled, advancedSettings.aiStrategy, handleSelectChoice]);

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

      // 모달/오버레이 활성화 시 모든 단축키 차단
      if (isAnyModalOpen) return;

      // 사건 활성화 상태 시 숫자키 1~4는 선택지 선택 우선 처리
      if (currentEvent && currentEvent.choices && currentEvent.choices.length > 0) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const choiceIdx = parseInt(e.key, 10) - 1;
          if (choiceIdx >= 0 && choiceIdx < currentEvent.choices.length) {
            e.preventDefault();
            handleSelectChoice(currentEvent.choices[choiceIdx]);
          }
          return;
        }
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (character.isAlive && !currentEvent && !battleState?.isActive) {
          setIsPlaying(prev => !prev);
        }
      } else if (e.key === 'n' || e.key === 'N') {
        handleAdvanceYear();
      } else if (e.key === 's' || e.key === 'S') {
        handleSkipToNextEvent();
      } else if (!currentEvent && !battleState?.isActive) {
        if (e.key === '1') {
          handleChangeSpeed(1);
        } else if (e.key === '2') {
          handleChangeSpeed(2);
        } else if (e.key === '4') {
          handleChangeSpeed(4);
        } else if (e.key === '8') {
          handleChangeSpeed(8);
        } else if (e.key === '6' || e.key === '0') {
          handleChangeSpeed(16);
        } else if (e.key === '3' || e.key === '5') {
          handleChangeSpeed(32);
        } else if (e.key === '[') {
          const list: GameSpeed[] = [1, 2, 4, 8, 16, 32];
          const idx = list.indexOf(speed);
          if (idx > 0) {
            handleChangeSpeed(list[idx - 1]);
          }
        } else if (e.key === ']') {
          const list: GameSpeed[] = [1, 2, 4, 8, 16, 32];
          const idx = list.indexOf(speed);
          if (idx < list.length - 1) {
            handleChangeSpeed(list[idx + 1]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    character.isAlive,
    currentEvent,
    battleState,
    speed,
    isAnyModalOpen,
    handleAdvanceYear,
    handleSkipToNextEvent,
    handleSelectChoice,
    handleChangeSpeed
  ]);

  // 연간 자율 행동 실행 (동기적으로 갱신된 Character 반환)
  const handleAnnualAction = (
    actionType: 'cultivate_arts' | 'train_combat' | 'take_suppressant' | 'faction_bounty' | 'recreation' | 'study_lore'
  ): Character => {
    const updated = GameEngine.executeAnnualAction(character, actionType, addLog);
    setCharacter(updated);
    return updated;
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
    if (!battleState || !battleState.isActive || !battleState.isPlayerTurn) return;
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
        isAlive={character.isAlive}
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

      {/* 글로벌 플로팅 토스트 알림 컨테이너 */}
      <ToastContainer toasts={toastQueue} onDismiss={removeToast} />
    </div>
  );
};

export default App;
