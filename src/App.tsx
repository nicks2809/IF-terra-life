// src/App.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Character, 
  LogEntry, 
  GameEvent, 
  EventChoice, 
  GameSpeed, 
  ThemeMode, 
  BattleState, 
  AdvancedSettings,
  ReincarnationConfig,
  NationThemeId,
  Season,
  ScheduledAnnualItem
} from './types';
import { resolveNationId } from './utils/themeResolver';
import { GameEngine } from './engine/gameEngine';
import { getRoutineLifeLine } from './data/routineLife';
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
import { LandingScreen } from './components/LandingScreen';
import { ACHIEVEMENTS_DATA } from './data/achievements';

export const BASE_YEAR_MS = 60000;
export const VALID_SPEEDS: GameSpeed[] = [1, 2, 4, 8, 16, 32];
export const TIMER_TICK_MS = 50;

export const clampSpeed = (s: number): GameSpeed => {
  return VALID_SPEEDS.includes(s as GameSpeed) ? (s as GameSpeed) : 1;
};

export const clampProgress = (v: number): number => Math.max(0, Math.min(100, v));

export const getSeasonFromProgress = (progress: number): Season => {
  const p = clampProgress(progress);
  if (p < 25) return '봄';
  if (p < 50) return '여름';
  if (p < 75) return '가을';
  return '겨울';
};

export const App: React.FC = () => {
  // --- 화면 모드 상태 머신 ('landing' | 'simulation') ---
  const [screenMode, setScreenMode] = useState<'landing' | 'simulation'>('landing');

  // --- 상태 관리 ---
  const [character, setCharacter] = useState<Character>(() => {
    const saved = storage.loadActiveCharacter();
    if (saved && saved.isAlive) return GameEngine.ensureCharacterDefaults(saved);
    return GameEngine.createRandomCharacter();
  });

  // 활성 캐릭터 세이브 존재 여부 실시간 동기화 (사망/화면전환 시 최신화)
  const hasActiveSave = useMemo(() => {
    if (!character.isAlive) return false;
    const saved = storage.loadActiveCharacter();
    return Boolean(saved && typeof saved === 'object' && saved.isAlive);
  }, [character.isAlive, screenMode]);

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
  const [minorTimeoutRemainingSec, setMinorTimeoutRemainingSec] = useState<number | null>(null);

  // 이전 재생 상태 보존 (중요 결정 해결 후 원래 상태 안전 복원)
  const wasPlayingBeforeEventRef = useRef<boolean>(true);

  // 단일 정밀 델타 타임 루프 누적 시간 및 직전 프레임 타임스탬프
  const accumulatedMsRef = useRef<number>(0);
  const lastTickRef = useRef<number>(performance.now());

  // 사계절 연간 순차 분산 큐 관리
  const seasonalQueueRef = useRef<ScheduledAnnualItem[]>([]);
  const executedSeasonalIdsRef = useRef<Set<string>>(new Set());

  // 연간 진행도 기반 실시간 사계절 동기화 (F8-4, B8-3 준수)
  const currentSeason = useMemo<Season>(() => {
    return getSeasonFromProgress(yearProgress);
  }, [yearProgress]);

  const [toastQueue, setToastQueue] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newToast: ToastMessage = { ...toast, id };
    setToastQueue(prev => [...prev.slice(-4), newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToastQueue(prev => prev.filter(t => t.id !== id));
  }, []);

  // 시뮬레이션 배속 변경 및 로컬 스토리지 동기화 (안전 클램핑)
  const handleChangeSpeed = useCallback((nextSpeed: GameSpeed | number) => {
    const safeSpeed = clampSpeed(nextSpeed);
    setSpeed(safeSpeed);
    storage.saveSpeed(safeSpeed);
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

  // 실시간 타이머 기반 1년 경과 (로그 버퍼링 및 사계절 지터 큐 배출)
  const advanceYearByTimer = useCallback(() => {
    if (!isPlaying) return;
    if (screenMode !== 'simulation' || !character.isAlive || currentEvent || battleState?.isActive || isAnyModalOpen) return;

    setYearProgress(0);
    accumulatedMsRef.current = 0;
    sound.playVitalPulse();
    const prevAchIds = new Set(character.unlockedAchievements || []);

    const bufferedLogs: Array<Omit<LogEntry, 'id' | 'timestamp'>> = [];
    const bufferCollector = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
      bufferedLogs.push(entry);
    };

    const result = GameEngine.advanceOneYear(character, bufferCollector, {
      autoManageApAndShop: isAutoChoiceEnabled && advancedSettings.autoUseApAndShop,
      aiStrategy: advancedSettings.aiStrategy
    });
    const nextChar = result.updatedChar;
    setCharacter(nextChar);

    // 사망 시 버퍼링 로그 즉각 배출 및 영면 모달 연결
    if (!nextChar.isAlive) {
      bufferedLogs.forEach(entry => addLog(entry));
      seasonalQueueRef.current = [];
      executedSeasonalIdsRef.current.clear();
      return;
    }

    // 생존 시 사계절 랜덤 시차 지터 큐 장착 (Area 1: 0% 폭발 해소)
    seasonalQueueRef.current = GameEngine.buildRandomizedYearlyQueue(nextChar, bufferedLogs, result.triggeredEvent);
    executedSeasonalIdsRef.current.clear();

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
        wasPlayingBeforeEventRef.current = isPlaying;
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
        wasPlayingBeforeEventRef.current = isPlaying;
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
  }, [isPlaying, screenMode, character, currentEvent, battleState, addLog, isAutoChoiceEnabled, advancedSettings, addToast, isAnyModalOpen]);

  // 수동 +1년 진행 핸들러 (Area 2: 일시정지 중 N 키 및 버튼 작동)
  const handleManualAdvanceYear = useCallback(() => {
    if (screenMode !== 'simulation' || !character.isAlive || currentEvent || battleState?.isActive || isAnyModalOpen) return;

    // 미배출 잔여 큐가 남아있을 경우 누락 없이 즉각 비움
    if (seasonalQueueRef.current.length > 0) {
      for (const item of seasonalQueueRef.current) {
        if (!executedSeasonalIdsRef.current.has(item.id)) {
          executedSeasonalIdsRef.current.add(item.id);
          item.execute(character, addLog);
        }
      }
      seasonalQueueRef.current = [];
      executedSeasonalIdsRef.current.clear();
    }

    setYearProgress(0);
    accumulatedMsRef.current = 0;
    sound.playVitalPulse();
    const prevAchIds = new Set(character.unlockedAchievements || []);
    const result = GameEngine.advanceOneYear(character, addLog, {
      autoManageApAndShop: isAutoChoiceEnabled && advancedSettings.autoUseApAndShop,
      aiStrategy: advancedSettings.aiStrategy
    });
    const nextChar = result.updatedChar;
    setCharacter(nextChar);
    seasonalQueueRef.current = [];
    executedSeasonalIdsRef.current.clear();

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

    if (result.triggeredEvent) {
      setCurrentEvent(result.triggeredEvent);
      const isRareMilestone =
        result.triggeredEvent.id.startsWith('career_special_') ||
        result.triggeredEvent.category === 'fateful';

      if (result.triggeredEvent.isMajor || !isAutoChoiceEnabled || (advancedSettings.pauseOnRareEvent && isRareMilestone)) {
        wasPlayingBeforeEventRef.current = isPlaying;
        setIsPlaying(false);
        setMinorTimeoutRemainingSec(null);
      } else {
        if (isPlaying && advancedSettings.minorEventAutoTimeout) {
          const countdown = Math.max(3, Math.floor(10 / Math.sqrt(speed)));
          setMinorTimeoutRemainingSec(countdown);
        } else {
          setMinorTimeoutRemainingSec(null);
        }
      }
    }
  }, [screenMode, character, currentEvent, battleState, addLog, isAutoChoiceEnabled, advancedSettings, addToast, isAnyModalOpen, isPlaying, speed]);

  const handleAdvanceYear = handleManualAdvanceYear;

  // 다음 선택지(사건)가 발생할 때까지 즉시 건너뛰기
  const handleSkipToNextEvent = useCallback(() => {
    if (screenMode !== 'simulation' || !character.isAlive || currentEvent || battleState?.isActive || isAnyModalOpen) return;

    if (seasonalQueueRef.current.length > 0) {
      for (const item of seasonalQueueRef.current) {
        if (!executedSeasonalIdsRef.current.has(item.id)) {
          executedSeasonalIdsRef.current.add(item.id);
          item.execute(character, addLog);
        }
      }
      seasonalQueueRef.current = [];
      executedSeasonalIdsRef.current.clear();
    }
    setYearProgress(0);
    accumulatedMsRef.current = 0;

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
  }, [screenMode, character, currentEvent, battleState, addLog, isAutoChoiceEnabled, advancedSettings, isAnyModalOpen]);

  // UI 재생/일시정지 토글 버튼 핸들러 (중요 사건 대기 중 우회 차단 가드)
  const handleTogglePlay = useCallback(() => {
    if (currentEvent?.isMajor) {
      sound.playBeep(300, 0.08, 'sawtooth');
      addToast({
        type: 'info',
        title: '【중요 결정 대기 중】',
        description: '운명을 결정하는 중요한 갈림길입니다. 선택지를 먼저 결정해야 시간이 재개됩니다.',
        icon: '⏸️',
        duration: 3000
      });
      return;
    }
    setIsPlaying(prev => !prev);
  }, [currentEvent, addToast]);

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
    setMinorTimeoutRemainingSec(null);
    setAutoChoicePendingId(null);

    if (result.battleEnemy && result.updatedChar.isAlive) {
      const newBattle = GameEngine.startBattle(result.battleEnemy, result.battleAmbushed);
      setBattleState(newBattle);
      if (!isAutoChoiceEnabled) {
        setIsPlaying(false);
      }
      return;
    }

    // 중요 사건으로 정지되었던 경우, 이전 플레이 상태로 안전 복원 (F9-5, P4-2)
    if (result.updatedChar.isAlive && wasPlayingBeforeEventRef.current) {
      setIsPlaying(true);
    }
  }, [character, addLog, isAutoChoiceEnabled, addToast]);

  // 사건을 시간의 흐름에 맡겨 흘려보내기 (단축키 0 및 UI 버튼 대응)
  const handleFlowThroughEvent = useCallback(() => {
    if (!currentEvent) return;
    if (currentEvent.isMajor) {
      sound.playBeep(300, 0.08, 'sawtooth');
      addToast({
        type: 'info',
        title: '【중대 사건 고지】',
        description: '운명을 가르는 중대한 선택은 흘려보낼 수 없습니다 (1~4번으로 직접 선택하십시오)',
        icon: '⚠️',
        duration: 3500
      });
      return;
    }

    const autoChoice = GameEngine.selectAutoChoice(character, currentEvent, 'survival');
    addToast({
      type: 'info',
      title: '【시간의 흐름】',
      description: `사건을 흘려보냈습니다: "${autoChoice.label}"`,
      icon: '⏳',
      duration: 3000
    });
    handleSelectChoice(autoChoice);
  }, [currentEvent, character, addToast, handleSelectChoice]);

  // 사망 후 새로고침 없는 시작 화면(LandingScreen) 복귀 핸들러
  const handleReturnToLanding = useCallback(() => {
    storage.saveActiveCharacter(null);
    const freshChar = GameEngine.createRandomCharacter();
    setCharacter(freshChar);
    setCurrentEvent(undefined);
    setAutoChoicePendingId(null);
    setBattleState(undefined);
    setYearProgress(0);
    accumulatedMsRef.current = 0;
    seasonalQueueRef.current = [];
    executedSeasonalIdsRef.current.clear();
    setIsPlaying(false);
    setScreenMode('landing');
  }, []);

  // 경미한 사건(minor event) 타임아웃 자동 선택 카운트다운
  useEffect(() => {
    if (screenMode !== 'simulation' || !isPlaying || !currentEvent || currentEvent.isMajor || minorTimeoutRemainingSec === null) {
      return;
    }

    if (minorTimeoutRemainingSec <= 0) {
      const autoPick = GameEngine.selectAutoChoice(character, currentEvent, advancedSettings.aiStrategy);
      addToast({
        type: 'info',
        title: '【시간 경과】',
        description: `선택 시간이 지나 자동으로 진행되었습니다: "${autoPick.label}"`,
        icon: '⏳',
        duration: 3000
      });
      handleSelectChoice(autoPick);
      return;
    }

    const timer = setInterval(() => {
      setMinorTimeoutRemainingSec(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [screenMode, isPlaying, currentEvent, minorTimeoutRemainingSec, character, advancedSettings.aiStrategy, addToast, handleSelectChoice]);

  // 단일 고정밀 델타 타임 루프 (1년 = 60,000ms 기준 선형 배속 제어 및 사계절 분산 큐)
  useEffect(() => {
    if (screenMode === 'simulation' && isPlaying && character.isAlive && !currentEvent && !battleState && !isAnyModalOpen) {
      lastTickRef.current = performance.now();

      const intervalId = setInterval(() => {
        if (!isPlaying) return;
        const now = performance.now();
        const rawDelta = now - lastTickRef.current;
        lastTickRef.current = now;

        // B6-3: 브라우저 백그라운드 탭 복귀 시 단일 틱 최대 델타 캡 (최대 1000ms 방어)
        const deltaMs = Math.min(rawDelta, 1000);
        const effectiveDelta = deltaMs * speed;
        accumulatedMsRef.current += effectiveDelta;

        if (accumulatedMsRef.current >= BASE_YEAR_MS) {
          accumulatedMsRef.current = accumulatedMsRef.current % BASE_YEAR_MS;
          setYearProgress(0);
          advanceYearByTimer();
        } else {
          const currentP = clampProgress((accumulatedMsRef.current / BASE_YEAR_MS) * 100);
          setYearProgress(currentP);

          // 사계절 연간 순차 분산 큐 격발 검사 (Area 1: 순차적 배출 및 사건 출현)
          if (seasonalQueueRef.current.length > 0) {
            for (const item of seasonalQueueRef.current) {
              if (!executedSeasonalIdsRef.current.has(item.id) && currentP >= item.triggerProgress * 100) {
                executedSeasonalIdsRef.current.add(item.id);
                const execResult = item.execute(character, addLog);
                if (execResult?.triggeredEvent) {
                  const ev = execResult.triggeredEvent;
                  setCurrentEvent(ev);
                  const isRareMilestone = ev.id.startsWith('career_special_') || ev.category === 'fateful';
                  if (ev.isMajor || !isAutoChoiceEnabled || (advancedSettings.pauseOnRareEvent && isRareMilestone)) {
                    wasPlayingBeforeEventRef.current = isPlaying;
                    setIsPlaying(false);
                    setMinorTimeoutRemainingSec(null);
                  } else {
                    if (isPlaying && advancedSettings.minorEventAutoTimeout) {
                      const countdown = Math.max(3, Math.floor(10 / Math.sqrt(speed)));
                      setMinorTimeoutRemainingSec(countdown);
                    } else {
                      setMinorTimeoutRemainingSec(null);
                    }
                  }
                }
              }
            }
          }
        }
      }, TIMER_TICK_MS);

      return () => clearInterval(intervalId);
    } else {
      lastTickRef.current = performance.now();
    }
  }, [
    screenMode,
    isPlaying,
    speed,
    character,
    currentEvent,
    battleState,
    isAnyModalOpen,
    advanceYearByTimer,
    handleAdvanceYear,
    addLog,
    isAutoChoiceEnabled,
    advancedSettings
  ]);

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
      // [가드 1] 랜딩 모드 격리: 시뮬레이션 화면이 아닐 때 모든 단축키 즉각 차단
      if (screenMode !== 'simulation') return;

      // [가드 2] 텍스트 인풋 포커스 상태 시 단축키 차단 (tagName === 'INPUT' 정적 매칭)
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') return;

      // [가드 3] 모달/오버레이 활성화 시 모든 단축키 차단
      if (isAnyModalOpen) return;

      // 사건 활성화 상태 시 숫자키 1~4는 선택지 선택, 0은 흘려보내기 처리
      if (currentEvent) {
        if (currentEvent.choices && currentEvent.choices.length > 0 && ['1', '2', '3', '4'].includes(e.key)) {
          const choiceIdx = parseInt(e.key, 10) - 1;
          if (choiceIdx >= 0 && choiceIdx < currentEvent.choices.length) {
            e.preventDefault();
            handleSelectChoice(currentEvent.choices[choiceIdx]);
          }
          return;
        }
        if (e.key === '0') {
          e.preventDefault();
          handleFlowThroughEvent();
          return;
        }
      }

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (currentEvent?.isMajor) {
          sound.playBeep(300, 0.08, 'sawtooth');
          addToast({
            type: 'info',
            title: '【중요 결정 대기 중】',
            description: '운명을 결정하는 중요한 갈림길입니다. 선택지를 먼저 결정해야 시간이 재개됩니다.',
            icon: '⏸️',
            duration: 3000
          });
          return;
        }
        if (character.isAlive && !currentEvent && !battleState?.isActive) {
          setIsPlaying(prev => !prev);
        }
      } else if (e.key === 'n' || e.key === 'N') {
        handleAdvanceYear();
      } else if (e.key === 's' || e.key === 'S') {
        handleSkipToNextEvent();
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
      } else if (!currentEvent && !battleState?.isActive) {
        if (e.key === '1') {
          handleChangeSpeed(1);
        } else if (e.key === '2') {
          handleChangeSpeed(2);
        } else if (e.key === '4') {
          handleChangeSpeed(4);
        } else if (e.key === '8') {
          handleChangeSpeed(8);
        } else if (e.key === '6') {
          handleChangeSpeed(16);
        } else if (e.key === '3' || e.key === '5') {
          handleChangeSpeed(32);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    screenMode,
    character.isAlive,
    currentEvent,
    battleState,
    speed,
    isAnyModalOpen,
    handleAdvanceYear,
    handleSkipToNextEvent,
    handleSelectChoice,
    handleFlowThroughEvent,
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

  // 생애 시작 ("태어나기" 클릭 시 새로운 캐릭터 생성 및 시뮬레이션 진입)
  const handleStartLife = useCallback((config?: ReincarnationConfig) => {
    sound.playBeep(600, 0.1, 'sine');
    const newChar = GameEngine.createRandomCharacter(config);
    setCharacter(newChar);
    setCurrentEvent(undefined);
    setAutoChoicePendingId(null);
    setBattleState(undefined);
    setYearProgress(0);
    accumulatedMsRef.current = 0;
    setIsPlaying(true);
    setScreenMode('simulation');

    const routineLog = getRoutineLifeLine(newChar, '여름');
    seasonalQueueRef.current = [
      {
        id: `sched_${newChar.year}_infant_routine`,
        triggerProgress: 0.45,
        season: '여름' as Season,
        month: 6,
        category: 'routine' as const,
        execute: (c: Character, logCb) => {
          if (logCb) {
            logCb({
              year: c.year,
              age: c.age,
              season: '여름',
              title: '【테라의 일상】 유아기의 여명',
              text: routineLog || `${c.nation}의 땅에서 울려 퍼진 갓난아이의 첫 울음소리. 거친 대지 위에서 새로운 생명이 첫 해를 살아갑니다.`,
              type: 'general'
            });
          }
          return { updatedChar: c };
        }
      }
    ];
    executedSeasonalIdsRef.current.clear();

    const perkBadges = newChar.reincarnationPerks && newChar.reincarnationPerks.length > 0
      ? [`환생 특전 ${newChar.reincarnationPerks.length}개 적용`]
      : undefined;

    const initialLog: LogEntry = {
      id: 'init_' + Date.now(),
      year: newChar.year,
      age: 0,
      season: '봄',
      title: '【생애의 시작】 테라의 대지에 태어나다',
      text: `${newChar.nation}의 [${newChar.environment}]에서 ${newChar.race}${newChar.subRace ? `(${newChar.subRace})` : ''}의 아이 "${newChar.name}"(으)로 생애를 시작합니다.`,
      type: 'general',
      effectBadges: perkBadges,
      timestamp: new Date().toISOString()
    };
    setLogs([initialLog]);
    storage.saveLogs([initialLog]);
    storage.saveActiveCharacter(newChar);
  }, []);

  // 이전 생애 이어하기 ("이어하기" 클릭 시 기존 활성 세이브 복원 및 시뮬레이션 진입)
  const handleResumeLife = useCallback(() => {
    const saved = storage.loadActiveCharacter();
    if (saved && saved.isAlive) {
      sound.playBeep(700, 0.08, 'sine');
      setCharacter(GameEngine.ensureCharacterDefaults(saved));
      const loadedLogs = storage.loadLogs();
      if (loadedLogs.length > 0) setLogs(loadedLogs);
      setIsPlaying(false);
      setScreenMode('simulation');
    }
  }, []);

  // 새로운 캐릭터로 환생 시작 (무작위 또는 커스텀 설정 반영)
  const handleStartReincarnation = (config?: ReincarnationConfig) => {
    handleStartLife(config);
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

  const currentNationId: NationThemeId = useMemo(() => {
    return resolveNationId(character?.nation);
  }, [character?.nation]);

  return (
    <div data-nation={currentNationId} className="w-full h-screen overflow-hidden">
      {screenMode === 'landing' ? (
        <LandingScreen
          onStartLife={handleStartLife}
          onStart={handleStartLife}
          onResumeLife={handleResumeLife}
          onResume={handleResumeLife}
          hasActiveSave={hasActiveSave}
          activeCharacterSummary={hasActiveSave && character.isAlive ? {
            name: character.name,
            age: character.age,
            nation: character.nation,
            gender: character.gender
          } : null}
          activeCharacterInfo={hasActiveSave && character.isAlive ? {
            name: character.name,
            age: character.age,
            nation: character.nation
          } : null}
          currentTheme={theme}
          theme={theme}
          onToggleTheme={handleSwitchTheme}
          onSwitchTheme={handleSwitchTheme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenHallOfFame={() => setIsHallOfFameOpen(true)}
          onOpenAchievementBook={() => setIsAchievementBookOpen(true)}
        />
      ) : (
        <>
          {/* Primary UI (PRTS vs Tome) */}
          {theme === 'prts' ? (
            <PRTSTerminal
              character={character}
              nationId={currentNationId}
              logs={logs}
              currentEvent={currentEvent}
              onSelectChoice={handleSelectChoice}
              onFlowThroughEvent={handleFlowThroughEvent}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              speed={speed}
              onChangeSpeed={handleChangeSpeed}
              yearProgress={yearProgress}
              currentSeason={currentSeason}
              minorTimeoutRemainingSec={minorTimeoutRemainingSec}
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
              onRestart={() => handleStartLife()}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onSwitchTheme={handleSwitchTheme}
              theme={theme}
            />
          ) : (
            <HistoryTome
              character={character}
              nationId={currentNationId}
              logs={logs}
              currentEvent={currentEvent}
              onSelectChoice={handleSelectChoice}
              onFlowThroughEvent={handleFlowThroughEvent}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              speed={speed}
              onChangeSpeed={handleChangeSpeed}
              yearProgress={yearProgress}
              currentSeason={currentSeason}
              minorTimeoutRemainingSec={minorTimeoutRemainingSec}
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
              onRestart={() => handleStartLife()}
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

          {/* Combat Modal */}
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
              onRestart={() => handleStartLife()}
              onReturnToLanding={handleReturnToLanding}
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
            onStartReincarnation={handleStartLife}
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
        </>
      )}

      {/* Hall of Fame Archive Modal (랜딩/인게임 공통 오버레이) */}
      <HallOfFameModal
        isOpen={isHallOfFameOpen}
        onClose={() => setIsHallOfFameOpen(false)}
        records={storage.loadHallOfFame()}
        theme={theme}
      />

      {/* Achievement Collection Book Modal (랜딩/인게임 공통 오버레이) */}
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
