import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Character, LogEntry, GameEvent, EventChoice, GameSpeed, ThemeMode, FocusStance, Season, NationThemeId } from '../types';
import { GameEngine } from '../engine/gameEngine';
import { evaluateLifeGoal, FOCUS_STANCES } from '../data/traits';
import { EventLogPanel } from './EventLogPanel';
import { NationInsignia } from './NationInsignia';
import { resolveNationId, getNationVisualIdentity } from '../utils/themeResolver';
import {
  Heart,
  Brain,
  Coins,
  Sparkles,
  Play,
  Pause,
  FastForward,
  SkipForward,
  Volume2,
  VolumeX,
  BookOpen,
  Award,
  Trophy,
  RotateCcw,
  Activity,
  Bot,
  Settings,
  ShoppingBag,
  Target,
  Zap,
  Users,
  Copy,
  Check
} from 'lucide-react';

interface Props {
  character: Character;
  nationId?: NationThemeId;
  logs: LogEntry[];
  currentEvent?: GameEvent;
  onSelectChoice: (choice: EventChoice) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: GameSpeed;
  onChangeSpeed: (speed: GameSpeed) => void;
  yearProgress?: number;
  currentSeason?: Season;
  season?: Season;
  minorTimeoutRemainingSec?: number | null;
  onChangeFocusStance?: (stance: FocusStance) => void;
  onNextYear: () => void;
  onSkipToNextEvent?: () => void;
  onFlowThroughEvent?: () => void;
  isAutoChoiceEnabled: boolean;
  onToggleAutoChoice: () => void;
  autoChoicePendingId?: string | null;
  onOpenActions: () => void;
  onOpenHallOfFame: () => void;
  onOpenAchievementBook?: () => void;
  onOpenSettings?: () => void;
  onOpenReincarnation?: () => void;
  crtEffect?: boolean;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onSwitchTheme: () => void;
  theme: ThemeMode;
}

export const evaluateSpecialtyMetric = (
  widgetId: string,
  char: Character
): { value: string; hint: string; tone: string } => {
  switch (widgetId) {
    case 'victoria-steam':
    case 'victoria-parliament-dial': {
      const rep = char.factions['빅토리아 귀족원'] ?? (char.factions['빅토리아'] ?? 0);
      const steamPsi = Math.min(120, Math.max(10, Math.round(50 + (char.stats.combat * 0.35) + (rep * 0.4))));
      return {
        value: `${steamPsi} PSI (${rep >= 0 ? '+' : ''}${rep} 議席)`,
        hint: steamPsi >= 90 ? '초과열 고압 가동' : steamPsi >= 55 ? '황실 정격 순항' : '증기압 저하 감시',
        tone: steamPsi >= 90 ? 'text-amber-400' : steamPsi >= 55 ? 'text-cyan-300' : 'text-rose-400'
      };
    }
    case 'yan-tianji':
    case 'yan-astrology-gauge': {
      const balance = Math.round((char.stats.sanity * 0.5) + (char.stats.intellect * 0.5));
      return {
        value: `陰陽調和 ${balance}%`,
        hint: balance >= 75 ? '大吉 (천기 순풍)' : balance >= 45 ? '平 (음양 화평)' : '大凶 (수이 요동)',
        tone: balance >= 75 ? 'text-emerald-400' : balance >= 45 ? 'text-amber-400' : 'text-rose-400'
      };
    }
    case 'ursus-cold-command':
    case 'ursus-purge-risk-index': {
      const healthPct = char.stats.maxHealth > 0 ? (char.stats.health / char.stats.maxHealth) * 100 : 50;
      const frostEndurance = Math.min(100, Math.max(10, Math.round((healthPct * 0.6) + (char.stats.combat * 0.4))));
      const purgeRisk = Math.max(0, Math.min(100, Math.round(100 - healthPct - Math.min(40, char.stats.wealth / 250))));
      return {
        value: `혹한 내구 ${frostEndurance}% (영하 ${Math.round(20 + (100 - frostEndurance) * 0.3)}°C)`,
        hint: purgeRisk >= 60 ? '비밀경찰 주시' : frostEndurance >= 70 ? '동토 진군 사기 고양' : '혹한 전선 경계',
        tone: purgeRisk >= 60 ? 'text-red-400' : frostEndurance >= 70 ? 'text-amber-300' : 'text-cyan-300'
      };
    }
    case 'kazimierz-odds':
    case 'kazimierz-honor-purse': {
      const prestige = Math.round((char.stats.combat * 0.6) + (char.stats.wealth * 0.002) + (char.stats.luck * 0.3));
      const odds = Math.max(1.05, Number((12.5 - Math.min(11.3, prestige * 0.11)).toFixed(2)));
      return {
        value: `1:${odds.toFixed(2)} (${prestige} pt)`,
        hint: prestige >= 75 ? '메이저 챔피언 유력' : prestige >= 40 ? '본선 리그 시드권' : '지하 투기장 무명',
        tone: prestige >= 75 ? 'text-amber-300' : prestige >= 40 ? 'text-yellow-400' : 'text-slate-400'
      };
    }
    case 'columbia-telemetry':
    case 'columbia-credit-rating': {
      const score = Math.min(850, 450 + Math.floor(char.stats.wealth / 100) + char.stats.intellect * 2);
      const grade = score >= 800 ? 'AAA' : score >= 730 ? 'AA' : score >= 660 ? 'A' : 'BBB';
      return {
        value: `${grade} (${score}점)`,
        hint: score >= 750 ? '트라이마운츠 개척 특례' : score >= 650 ? '표준 신용 거래' : '투자 담보 한도 경고',
        tone: score >= 750 ? 'text-emerald-300' : score >= 650 ? 'text-cyan-300' : 'text-amber-400'
      };
    }
    case 'iberia-astrolabe':
    case 'iberia-aegir-tide-sensor': {
      const maxSan = Math.max(1, char.stats.maxSanity);
      const abyssalPressure = Math.max(0, Math.min(100, Math.round(100 - (char.stats.sanity / maxSan) * 100)));
      return {
        value: `海嗣 潮汐 ${abyssalPressure}%`,
        hint: abyssalPressure >= 60 ? '대침묵 심해 침식' : abyssalPressure >= 30 ? '등대 황금광 관측' : '성당 아스트롤라베 안정',
        tone: abyssalPressure >= 60 ? 'text-rose-400' : abyssalPressure >= 30 ? 'text-amber-300' : 'text-cyan-300'
      };
    }
    case 'laterano-halo':
    case 'laterano-notarial-dispensation': {
      const normArts = char.stats.artsAptitude > 5 ? 0.6 + char.stats.artsAptitude / 45 : char.stats.artsAptitude;
      const haloResonance = Math.min(100, Math.max(20, Math.round((char.stats.sanity * 0.5) + (normArts * 25))));
      const lawFaith = Math.min(100, Math.round((char.stats.sanity * 0.6) + (char.stats.combat * 0.4)));
      return {
        value: `${haloResonance}% (${(140 + haloResonance * 0.2).toFixed(1)} MHz)`,
        hint: lawFaith >= 75 ? '수호총 축성 및 교령 공명' : lawFaith >= 45 ? '성율 준수 신민' : '공증소 심문 대상',
        tone: lawFaith >= 75 ? 'text-yellow-300' : lawFaith >= 45 ? 'text-amber-200' : 'text-rose-400'
      };
    }
    case 'leithanien-cadence':
    case 'leithanien-harmonic-tuner': {
      const art = char.stats.artsAptitude > 5 ? 0.6 + char.stats.artsAptitude / 45 : char.stats.artsAptitude;
      const harmony = Math.min(100, Math.round(art * 40 + char.stats.intellect * 0.3));
      return {
        value: `${art.toFixed(1)} Octave (${harmony}%)`,
        hint: art >= 1.6 ? '쌍둥이 첨탑 황금 협주' : art >= 1.0 ? '궁정 화음 정격 안착' : '음유 불협화음 감쇄',
        tone: art >= 1.6 ? 'text-yellow-300' : art >= 1.0 ? 'text-purple-300' : 'text-slate-400'
      };
    }
    case 'sami-collapse':
    case 'sami-snow-corruption-totem': {
      const maxSan = Math.max(1, char.stats.maxSanity);
      const sanityLoss = Math.max(0, maxSan - char.stats.sanity);
      const collapseRate = Math.min(100, Math.round((sanityLoss / maxSan) * 100));
      const auraPurity = Math.max(0, 100 - collapseRate);
      return {
        value: `靈氣 ${auraPurity}% (붕괴 ${collapseRate}%)`,
        hint: collapseRate >= 50 ? '붕괴 침식 경계' : collapseRate >= 20 ? '은빛 서리 성림 조율' : '빙원 정령 비호',
        tone: collapseRate >= 50 ? 'text-purple-400' : collapseRate >= 20 ? 'text-teal-300' : 'text-emerald-300'
      };
    }
    case 'siracusa-omerta':
    case 'siracusa-vendetta-gauge': {
      const familyRep = char.factions['시라쿠사 패밀리'] ?? (char.factions['시라쿠사'] ?? 10);
      const omertaBond = Math.min(100, Math.max(0, Math.round(50 + familyRep * 0.5 + char.stats.intellect * 0.2)));
      const vendetta = Math.max(0, 100 - omertaBond);
      return {
        value: `결속 ${omertaBond}% · 복수 ${vendetta}目`,
        hint: omertaBond >= 75 ? '패밀리 핵심 간부 신뢰' : omertaBond >= 45 ? '침묵 서약 준수' : '오메르타 파기 암살 표적',
        tone: omertaBond >= 75 ? 'text-rose-400' : omertaBond >= 45 ? 'text-amber-400' : 'text-red-500'
      };
    }
    case 'sargon-tribute':
    case 'sargon-sand-tribute-ledger': {
      const tribute = Math.round(char.stats.combat * 8 + char.stats.wealth * 0.04);
      const maxHp = Math.max(1, char.stats.maxHealth);
      const climateTolerance = Math.min(100, Math.round((char.stats.health / maxHp) * 60 + char.stats.combat * 0.4));
      return {
        value: `열사 적응 ${climateTolerance}% (${tribute} 萬)`,
        hint: tribute >= 450 ? '파디샤 친위 영예 공납' : climateTolerance >= 60 ? '오아시스 상단 번영' : '사막 열풍 조난 경계',
        tone: tribute >= 450 ? 'text-yellow-400' : climateTolerance >= 60 ? 'text-amber-300' : 'text-orange-500'
      };
    }
    case 'rim-billiton-depth':
    case 'rim-billiton-mining-depth': {
      const depth = 300 + Math.floor(char.stats.wealth / 50) + char.stats.health * 5;
      return {
        value: `지하 ${depth}m 갱도`,
        hint: depth >= 1100 ? '심도 고순도 원암 광맥' : depth >= 600 ? '중층 리그 굴착 순항' : '표층 오리지늄 탐사',
        tone: depth >= 1100 ? 'text-amber-400' : depth >= 600 ? 'text-yellow-500' : 'text-slate-400'
      };
    }
    case 'lungmen-lgd': {
      const rep = char.factions['용문근위국'] ?? (char.factions['용문'] ?? 0);
      const security = Math.min(100, Math.max(15, Math.round(55 + rep * 0.4 + char.stats.combat * 0.2 + char.stats.intellect * 0.15)));
      const fxRate = (1.0 + Math.min(0.35, (char.stats.wealth / 50000) * 0.15 + (char.stats.intellect / 100) * 0.1)).toFixed(2);
      return {
        value: `치안 ${security}% · 1 LMD : ${fxRate}`,
        hint: security >= 80 ? '특별행정구 최고 안전령' : security >= 50 ? '근위국 통상 순찰망' : '외곽 슬럼가 소요 경계',
        tone: security >= 80 ? 'text-emerald-300' : security >= 50 ? 'text-amber-300' : 'text-rose-400'
      };
    }
    case 'kazdel-souls': {
      const rep = char.factions['카즈델 군사위원회'] ?? (char.factions['카즈델'] ?? (char.factions['바벨'] ?? 0));
      const cryst = char.oripathy?.crystallizationRate ?? 0;
      const normArts = char.stats.artsAptitude > 5 ? 0.6 + char.stats.artsAptitude / 45 : char.stats.artsAptitude;
      const resonance = Math.min(100, Math.max(10, Math.round(normArts * 35 + (cryst * 0.4) + (char.stats.combat * 0.2))));
      const bulwark = Math.min(100, Math.max(10, Math.round(40 + rep * 0.5 + char.stats.combat * 0.3)));
      return {
        value: `萬魂 공명 ${resonance}% · 방어선 ${bulwark}%`,
        hint: resonance >= 75 ? '고대 살카즈 원혼 합일' : bulwark >= 60 ? '폐허 결계선 견고' : '원혼의 통곡 잠식 경계',
        tone: resonance >= 75 ? 'text-rose-400' : bulwark >= 60 ? 'text-purple-300' : 'text-amber-400'
      };
    }
    case 'kjerag-bell':
    case 'kjerag-prayer-mantle': {
      const faith = Math.min(100, Math.max(20, Math.round((char.stats.sanity * 0.7) + (char.stats.intellect * 0.3))));
      const purity = Math.min(100, Math.max(30, Math.round(faith * 0.8 + 20)));
      return {
        value: `순도 ${purity}% (종소리 공명)`,
        hint: purity >= 85 ? '카를란 만년설 성산 가호' : purity >= 60 ? '카를란 무역연합 평온' : '성산 설봉 한파 경계',
        tone: purity >= 85 ? 'text-sky-300' : purity >= 60 ? 'text-cyan-400' : 'text-slate-400'
      };
    }
    case 'rhodes-prts':
    case 'rhodes-medical-chart': {
      const stage = char.oripathy?.stage ?? 'Clean';
      const density = (char.oripathy?.originiumBloodDensity ?? 0).toFixed(2);
      const doseLeft = char.oripathy?.suppressantDoseLeft ?? 0;
      const maxSan = Math.max(1, char.stats.maxSanity);
      const syncRate = Math.min(100, Math.max(10, Math.round((char.stats.sanity / maxSan) * 60 + char.stats.intellect * 0.4)));
      return {
        value: `동기화 ${syncRate}% · ${density}u/L`,
        hint: doseLeft > 0 
          ? `억제제 잔여 ${doseLeft}회 (PRTS 안정)` 
          : stage === 'Terminal' 
          ? '생체 신호 위험 임계' 
          : '신경망 동기화 순항',
        tone: stage === 'Terminal' ? 'text-rose-400' : stage === 'Severe' ? 'text-orange-400' : syncRate >= 80 ? 'text-cyan-300' : 'text-amber-300'
      };
    }
    case 'higashi-blade-oath-seal': {
      const honor = Math.round(char.stats.combat * 0.8 + char.stats.luck * 0.2);
      return {
        value: `無雙 拔刀 ${honor} 階`,
        hint: honor >= 70 ? '가문의 명검 전수' : '도장 수련 방랑',
        tone: honor >= 70 ? 'text-rose-400' : 'text-slate-300'
      };
    }
    case 'minos-pantheon-hymn': {
      const heroism = Math.round((char.stats.combat + char.stats.health) / 2);
      return {
        value: `英雄 詩篇 ${heroism} 頌`,
        hint: heroism >= 75 ? '아테나 판테온 헌정' : '아크로폴리스 음유',
        tone: heroism >= 75 ? 'text-yellow-400' : 'text-amber-200'
      };
    }
    default:
      return {
        value: '시스템 정상',
        hint: '표준 PRTS 연동',
        tone: 'text-cyan-300'
      };
  }
};

export const PRTSTerminal: React.FC<Props> = ({
  character,
  nationId,
  logs,
  currentEvent,
  onSelectChoice,
  isPlaying,
  onTogglePlay,
  speed,
  onChangeSpeed,
  yearProgress = 0,
  currentSeason = '봄',
  minorTimeoutRemainingSec,
  onChangeFocusStance,
  onNextYear,
  onSkipToNextEvent,
  onFlowThroughEvent,
  isAutoChoiceEnabled,
  onToggleAutoChoice,
  autoChoicePendingId,
  onOpenActions,
  onOpenHallOfFame,
  onOpenAchievementBook,
  onOpenSettings,
  onOpenReincarnation,
  crtEffect = true,
  onRestart,
  isMuted,
  onToggleMute,
  onSwitchTheme,
  theme
}) => {
  const activeNationId = useMemo(() => {
    return nationId || resolveNationId(character?.nation);
  }, [nationId, character?.nation]);

  const nationIdentity = useMemo(() => {
    return getNationVisualIdentity(activeNationId);
  }, [activeNationId]);

  const isRightSidebar = nationIdentity.sidebarPosition === 'right';

  const cornerClass = useMemo(() => {
    switch (nationIdentity.atmosphericDetails?.cornerStyle) {
      case 'sharp': return 'rounded-none';
      case 'round': return 'rounded-xl';
      case 'chamfer': return 'rounded-md';
      case 'filigree': return 'rounded-lg';
      default: return 'rounded-lg';
    }
  }, [nationIdentity.atmosphericDetails?.cornerStyle]);

  const specialtyMetric = useMemo(() => {
    if (!nationIdentity.specialtyWidget) return null;
    return evaluateSpecialtyMetric(nationIdentity.specialtyWidget.id, character);
  }, [nationIdentity.specialtyWidget, character]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seedCopied, setSeedCopied] = useState(false);

  // 심전도(ECG) 펄스 애니메이션
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let step = 0;
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      ctx.fillStyle = 'rgba(11, 13, 17, 0.2)';
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1.5;
      const isLowHp = character.stats.health < 30;
      ctx.strokeStyle = isLowHp ? '#ef4444' : nationIdentity.colors.primary;
      ctx.shadowBlur = 4;
      ctx.shadowColor = isLowHp ? '#ef4444' : nationIdentity.colors.primaryGlow;

      ctx.beginPath();
      const x = step % width;
      let y = height / 2;

      const cycle = step % 80;
      if (cycle === 10) y -= 12;
      else if (cycle === 14) y += 18;
      else if (cycle === 18) y -= 6;

      ctx.moveTo(x - 2, height / 2);
      ctx.lineTo(x, y);
      ctx.stroke();

      step += character.isAlive ? 2 : 0;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [character.stats.health, character.isAlive, nationIdentity.colors.primary, nationIdentity.colors.primaryGlow]);

  const [mobileTab, setMobileTab] = useState<'profile' | 'log'>('log');

  useEffect(() => {
    if (currentEvent) {
      setMobileTab('log');
    }
  }, [currentEvent]);

  const lifespanProfile = useMemo(() => {
    return GameEngine.getCharacterLifespanProfile(character);
  }, [character.race, character.subRace, character.oripathy.crystallizationRate, character.oripathy.suppressantDoseLeft]);

  const goalEval = useMemo(() => evaluateLifeGoal(character), [character]);
  const nextPromo = useMemo(() => GameEngine.getNextPromotionThreshold(character), [character]);
  const promoCheck = useMemo(() => GameEngine.checkTierPromotionEligibility(character), [character]);
  const activeStance = FOCUS_STANCES.find(s => s.id === (character.focusStance || 'survival')) || FOCUS_STANCES[0];

  const handleCopySeed = () => {
    if (!character.seed) return;
    navigator.clipboard?.writeText(character.seed).catch(() => {});
    setSeedCopied(true);
    setTimeout(() => setSeedCopied(false), 1500);
  };

  const oripathyBadge = {
    Clean: { label: '비감염 (CLEAN)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    Early: { label: '초기 감염 (STAGE I)', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
    Mid: { label: '중기 침식 (STAGE II)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    Severe: { label: '중증 침식 (STAGE III)', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
    Terminal: { label: '말기 한계 (TERMINAL)', color: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' },
    Crystallized: { label: '결정화 파열 (CRITICAL)', color: 'bg-rose-900 text-rose-200 border-rose-500' },
  }[character.oripathy.stage];

  return (
    <div 
      className="flex flex-col h-screen bg-[#0b0d11] text-slate-100 font-mono select-none overflow-hidden relative"
      style={{ backgroundColor: nationIdentity.colors.surface }}
    >
      {/* Subtle CRT Scanline Overlay */}
      {crtEffect && (
        <div
          className="pointer-events-none fixed inset-0 z-40 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00e5ff 3px)'
          }}
        />
      )}

      {/* Top Bar Header */}
      <header 
        className="h-12 border-b px-3 sm:px-4 flex items-center justify-between shrink-0 transition-colors"
        style={{ 
          backgroundColor: nationIdentity.colors.card, 
          borderColor: nationIdentity.colors.border 
        }}
      >
        <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
          <div 
            className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
            style={{ backgroundColor: nationIdentity.colors.primary }}
          />
          <span 
            className="text-xs font-bold tracking-widest uppercase shrink-0"
            style={{ color: nationIdentity.colors.primary }}
            title={nationIdentity.terminalHeader ? `${nationIdentity.terminalHeader.subtitle} (${nationIdentity.terminalHeader.inspiration})` : undefined}
          >
            {nationIdentity.terminalHeader?.title || nationIdentity.interfaceTitle || 'PRTS VITAL // TERRA OS'}
          </span>
          <span className="text-[11px] text-slate-300 hidden sm:inline shrink-0">
            [테라력 {character.year}년 {currentSeason} · {character.age}세]
          </span>

          {/* 헤더 인시그니아 및 모토 반응형 노출 터치포인트 */}
          <div className="flex items-center space-x-1.5 pl-2 border-l border-white/10 shrink-0 min-w-0">
            <NationInsignia 
              nationId={activeNationId} 
              className="w-4 h-4 shrink-0" 
              style={{ color: nationIdentity.colors.primary }} 
            />
            <span 
              className="text-xs font-bold tracking-wide shrink-0"
              style={{ color: nationIdentity.colors.badgeText }}
            >
              {nationIdentity.nameKo}
            </span>
            <span 
              className="hidden xl:inline text-[10px] text-slate-400 italic max-w-[200px] 2xl:max-w-[280px] truncate" 
              title={nationIdentity.motto}
            >
              "{nationIdentity.motto}"
            </span>
          </div>
        </div>

        {/* Global Action Icons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-all"
              title="전술 AI 성향, 자동 넘김 및 백업 설정"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden md:inline">고급 설정</span>
            </button>
          )}

          <button
            onClick={onSwitchTheme}
            className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all"
            title="고서적 테마로 전환"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">역사서 뷰</span>
          </button>

          {onOpenAchievementBook && (
            <button
              onClick={onOpenAchievementBook}
              className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 transition-all"
              title="테라 업적 도감"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">업적 도감</span>
            </button>
          )}

          <button
            onClick={onOpenHallOfFame}
            className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="지난 생애 추모실"
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">추모실</span>
          </button>

          <button
            onClick={() => {
              if (character.isAlive) {
                const confirmed = window.confirm("진행 중인 생애가 종료됩니다. 계속하시겠습니까?");
                if (!confirmed) return;
              }
              if (onOpenReincarnation) onOpenReincarnation();
              else onRestart();
            }}
            className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 transition-all"
            title="운명 설계 및 새로운 생애 환생"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">환생 설계</span>
          </button>
        </div>
      </header>

      {/* Vital & Medical Status Ribbon */}
      <section 
        className={`h-16 border-b px-4 py-2 grid grid-cols-2 ${
          nationIdentity.specialtyWidget?.position === 'header-ribbon' ? 'md:grid-cols-6' : 'md:grid-cols-5'
        } gap-3 shrink-0 items-center transition-colors`}
        style={{ 
          backgroundColor: nationIdentity.colors.card, 
          borderColor: nationIdentity.colors.border 
        }}
      >
        {/* ECG Canvas */}
        <div className="hidden md:flex items-center space-x-2 col-span-1 bg-black/40 rounded px-2 py-1 border border-cyan-500/20">
          <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
          <canvas ref={canvasRef} width={120} height={32} className="w-full h-8" />
        </div>

        {/* HP Bar */}
        <div className="space-y-1" title="체력 (HP): 생명력 및 신체 활력 지표">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
              <Heart className="w-3.5 h-3.5" />
              <span>체력 (HP)</span>
            </span>
            <span>{character.stats.health} / {character.stats.maxHealth}</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-emerald-900/40">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, (character.stats.health / character.stats.maxHealth) * 100))}%` }}
            />
          </div>
        </div>

        {/* SAN Bar */}
        <div className="space-y-1" title="이성 (SAN): 정신적 안정도 및 아츠 영창 집중도">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center space-x-1 text-blue-400 font-bold">
              <Brain className="w-3.5 h-3.5" />
              <span>이성 (SAN)</span>
            </span>
            <span>{character.stats.sanity} / {character.stats.maxSanity}</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-blue-900/40">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, (character.stats.sanity / character.stats.maxSanity) * 100))}%` }}
            />
          </div>
        </div>

        {/* LMD & Upkeep */}
        <div className="hidden md:flex items-center space-x-2 text-xs" title="용문폐(LMD): 보유 화폐 및 연간 생계비">
          <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">
              보유 자산 {character.age >= 15 && <span className="text-slate-500">(세금 -{GameEngine.getAnnualLivingExpense(character)}/년)</span>}
            </div>
            <div className="font-bold text-yellow-300">{character.stats.wealth.toLocaleString()} LMD</div>
          </div>
        </div>

        {/* Oripathy Badge & Originium Blood Density */}
        <div className="text-right" title={`광석병 병리 지표 · 혈중 오리지늄 농도: ${(character.oripathy.originiumBloodDensity || 0).toFixed(2)} u/L`}>
          <div className="text-[10px] text-slate-400">
            광석병 병리 {character.oripathy.isInfected && character.oripathy.lesionSite !== '없음' ? `[${character.oripathy.lesionSite}]` : '지표'}
          </div>
          <div className="flex items-center justify-end space-x-1.5 mt-0.5">
            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${oripathyBadge.color}`}>
              {oripathyBadge.label}
            </span>
            <span className="text-xs font-bold text-red-400">
              {character.oripathy.crystallizationRate}%
            </span>
            <span className="text-[10px] text-amber-300 font-mono">
              ({(character.oripathy.originiumBloodDensity || 0).toFixed(2)} u/L)
            </span>
          </div>
        </div>

        {/* Regional Specialty Widget: Header Ribbon */}
        {nationIdentity.specialtyWidget?.position === 'header-ribbon' && specialtyMetric && (
          <div 
            className="hidden md:flex flex-col justify-center px-2.5 py-1 rounded border text-xs shrink-0"
            style={{ 
              borderColor: nationIdentity.colors.border, 
              backgroundColor: nationIdentity.colors.surface 
            }}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] uppercase tracking-wider font-bold truncate" style={{ color: nationIdentity.colors.badgeText }}>
                {nationIdentity.specialtyWidget.title}
              </span>
              <span className="text-[9px] text-slate-400 shrink-0">({specialtyMetric.hint})</span>
            </div>
            <div className={`font-mono font-bold text-xs truncate ${specialtyMetric.tone}`}>
              {specialtyMetric.value}
            </div>
          </div>
        )}
      </section>

      {/* Mobile Screen Tab Switcher */}
      <div className="md:hidden flex border-b border-cyan-500/20 bg-[#0e121a] text-xs font-bold shrink-0">
        <button
          onClick={() => setMobileTab('log')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-all flex items-center justify-center space-x-1.5 ${
            mobileTab === 'log'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>사건 일지 & 선택</span>
          {currentEvent && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px] animate-pulse">!</span>
          )}
        </button>
        <button
          onClick={() => setMobileTab('profile')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-all flex items-center justify-center space-x-1.5 ${
            mobileTab === 'profile'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>신상 · 목표 · 태세</span>
        </button>
      </div>

      {/* Main Grid: Left Profile & Right Logs */}
      <main className="grow grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Character Sheet (4 cols) */}
        <aside className={`md:col-span-4 ${
          isRightSidebar ? 'md:order-2 md:border-l' : 'md:order-1 md:border-r'
        } border-cyan-500/20 bg-[#0e1219] p-3.5 flex-col overflow-y-auto space-y-3 ${
          mobileTab === 'profile' ? 'flex' : 'hidden md:flex'
        }`}
        style={{ 
          backgroundColor: nationIdentity.colors.surface, 
          borderColor: nationIdentity.colors.border 
        }}>
          {/* Identity Box */}
          <div 
            className={`p-3.5 ${cornerClass} border bg-slate-900/60 relative overflow-hidden transition-colors`}
            style={{ 
              borderColor: nationIdentity.colors.border,
              boxShadow: `0 0 14px ${nationIdentity.colors.scanlineTint}`
            }}
          >
            {/* 아크나이츠풍 배경 인시그니아 워터마크 */}
            <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.08] translate-x-3 translate-y-3">
              <NationInsignia 
                nationId={activeNationId} 
                className="w-28 h-28" 
                style={{ color: nationIdentity.colors.primary }} 
              />
            </div>

            <div className="flex items-center justify-between mb-1 gap-2 relative z-10">
              <span 
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: nationIdentity.colors.badgeText }}
              >
                SUBJECT DOSSIER
              </span>
              {character.seed && (
                <button
                  onClick={handleCopySeed}
                  className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-700 hover:border-cyan-400 text-[10px] text-slate-300 transition-colors"
                  title="운명 시드 코드 복사 (환생 설계에서 동일 운명 재현 가능)"
                >
                  <span>{character.seed}</span>
                  {seedCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 opacity-70" />}
                </button>
              )}
            </div>

            <div className="flex items-baseline justify-between gap-2 relative z-10">
              <h2 className="text-lg font-bold tracking-wider text-slate-100">
                {character.name}
              </h2>
              <span className="text-[11px] text-slate-400">
                {character.gender} · {character.race}{character.subRace ? ` (${character.subRace})` : ''}
              </span>
            </div>

            {/* 소속 국가 & 뱃지 */}
            <div className="text-xs text-slate-300 mt-1 flex items-center justify-between relative z-10">
              <span className="flex items-center space-x-1.5">
                <span>소속:</span>
                <span 
                  className="font-bold flex items-center space-x-1"
                  style={{ color: nationIdentity.colors.badgeText }}
                >
                  <NationInsignia nationId={activeNationId} className="w-3.5 h-3.5 inline" />
                  <span>{character.nation}</span>
                </span>
              </span>
              <span className="text-[11px] text-slate-400">{character.environment}</span>
            </div>

            {/* 공식 국가 모토 */}
            <div 
              className="text-[10px] text-slate-400 italic pl-2 my-1.5 line-clamp-1 border-l-2 relative z-10"
              style={{ borderColor: nationIdentity.colors.primary }}
              title={nationIdentity.motto}
            >
              "{nationIdentity.motto}"
            </div>

            <div className="text-xs text-slate-300 mt-1 flex items-center justify-between relative z-10">
              <span>
                직위: <span className="text-cyan-300 font-bold">{character.career}</span>
                <span className="text-slate-400"> · {character.careerRank}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[10px] font-extrabold">
                T{character.careerTier ?? 0}
              </span>
            </div>

            {/* Career Promotion Progress Bar */}
            {character.age >= 15 && !character.specialCareerId && nextPromo && (
              <div className="mt-2 pt-1.5 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-slate-400">승급 공적 (EXP): {character.careerExp || 0} / {nextPromo.reqExp}</span>
                  {promoCheck.eligible ? (
                    <button
                      onClick={onOpenActions}
                      className="text-amber-300 font-extrabold hover:underline animate-pulse"
                    >
                      승급 심사 가능 →
                    </button>
                  ) : (
                    <span className="text-slate-500">목표 T{nextPromo.targetTier}</span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all"
                    style={{ width: `${Math.min(100, Math.round(((character.careerExp || 0) / nextPromo.reqExp) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between border-t border-cyan-500/20 pt-1.5">
              <span>기대 수명: <span className="text-cyan-300 font-bold">{lifespanProfile.baseLifespan}세</span> (한계 {lifespanProfile.effectiveMaxLifespan}세)</span>
              {character.oripathy.isInfected && (
                <span className="text-[10px] text-amber-400">억제 {character.oripathy.suppressantDoseLeft}년</span>
              )}
            </div>

            {/* Innate Traits (Talent & Flaw) */}
            {character.innateTraits && character.innateTraits.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 pt-1.5 border-t border-white/5">
                {character.innateTraits.map(trait => (
                  <span
                    key={trait.id}
                    title={trait.description}
                    className={`text-[10px] px-2 py-0.5 rounded border font-bold cursor-help ${
                      trait.type === 'talent'
                        ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {trait.type === 'talent' ? '✦ ' : '✧ '}{trait.name} ({trait.badge})
                  </span>
                ))}
              </div>
            )}

            {/* Titles */}
            {character.titles.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {character.titles.map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Regional Specialty Widget: Dossier Crest */}
            {nationIdentity.specialtyWidget?.position === 'dossier-crest' && specialtyMetric && (
              <div 
                className="mt-2 pt-2 border-t text-xs flex items-center justify-between relative z-10"
                style={{ borderColor: nationIdentity.colors.border }}
              >
                <div className="flex items-center space-x-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: nationIdentity.colors.primary }} />
                  <span className="text-[10px] font-bold truncate" style={{ color: nationIdentity.colors.badgeText }}>
                    {nationIdentity.specialtyWidget.title}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className={`font-bold font-mono ${specialtyMetric.tone}`}>{specialtyMetric.value}</span>
                  <span className="text-[10px] text-slate-400 ml-1">[{specialtyMetric.hint}]</span>
                </div>
              </div>
            )}
          </div>

          {/* Life Goal (/goal) & Focus Boost (/boost) Clean Panel */}
          <div className="p-3 rounded-lg border border-cyan-500/25 bg-slate-900/50 space-y-2.5 text-xs">
            {/* Goal Section */}
            {character.lifeGoal && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center space-x-1 text-[11px] font-bold text-cyan-300">
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    <span>생애 목표: {character.lifeGoal.title}</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold border ${
                    character.goalAchieved || goalEval.achieved
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-amber-300'
                  }`}>
                    {character.goalAchieved || goalEval.achieved ? `달성 완료 (+${character.lifeGoal.bonusPoints})` : `+${character.lifeGoal.bonusPoints} PTS`}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 leading-snug" title={character.lifeGoal.targetText}>
                  진척도: <span className="text-slate-200 font-semibold">{goalEval.progressText}</span>
                </div>
              </div>
            )}

            {/* Focus Boost Stance Toggle */}
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center space-x-1 text-[11px] font-bold text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>연간 집중 태세</span>
                </span>
                <span className="text-[10px] text-slate-400">{activeStance.name}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {FOCUS_STANCES.map(st => {
                  const active = (character.focusStance || 'survival') === st.id;
                  const stanceDescriptions: Record<string, string> = {
                    survival: '생존 우선: HP 및 이성 회복력 강화, 위기 방어',
                    martial: '무예 연마: 물리 전투력(ATK) 수련 보정 및 백병전 판정 강화',
                    arcane: '비전 탐구: 오리지늄 아츠(ARTS) 적성 집중 및 주술 우위',
                    career: '입신양명: 승급 공적치(EXP) 및 명성 획득량 증가'
                  };
                  return (
                    <button
                      key={st.id}
                      onClick={() => onChangeFocusStance?.(st.id)}
                      title={`${st.name} [${st.id}]: ${stanceDescriptions[st.id] || st.effectText}`}
                      className={`py-1 rounded text-[10px] font-bold border transition-all ${
                        active
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow font-extrabold'
                          : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      {st.shortLabel}
                    </button>
                  );
                })}
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                {activeStance.effectText}
              </div>
            </div>
          </div>

          {/* Stats Sheet */}
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-white/5 pb-1">
              <span>핵심 역량 (한계 체감 적용)</span>
              <span>수치</span>
            </div>
            <div className="flex justify-between" title="전투력 (ATK): 신체 단련 및 물리 전투력 지표 (전투 피해량 및 무예 판정)">
              <span className="text-slate-400">전투력 (ATK)</span>
              <span className="font-bold text-amber-400">{character.stats.combat}</span>
            </div>
            <div className="flex justify-between" title="아츠 적성 (ARTS): 오리지늄 아츠 영창 및 조율 능력 (주술 공격력 및 결정화율 연동)">
              <span className="text-slate-400">아츠 적성 (ARTS)</span>
              <span className="font-bold text-cyan-400">
                {character.stats.artsAptitude}
                {character.oripathy.isInfected && (
                  <span className="text-[10px] text-red-400 ml-1">({character.oripathy.activeArtsMultiplier}x)</span>
                )}
              </span>
            </div>
            <div className="flex justify-between" title="정세 감각 (INTEL): 외교 정세 분석, 협상력 및 학술 자문 역량">
              <span className="text-slate-400">정세 감각 (INTEL)</span>
              <span className="font-bold text-purple-400">{character.stats.intellect}</span>
            </div>
            <div className="flex justify-between" title="행운 (LUCK): 돌발 재앙 회피 및 운명의 갈림길 성공률 판정 보정">
              <span className="text-slate-400">행운 (LUCK)</span>
              <span className="font-bold text-emerald-400">{character.stats.luck}</span>
            </div>
          </div>

          {/* Bonds (인연) */}
          {character.bonds && character.bonds.length > 0 && (
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-xs space-y-1.5">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 border-b border-white/5 pb-1 font-bold">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>대지의 인연 ({character.bonds.filter(b => b.isAlive).length}명 생존)</span>
              </div>
              {character.bonds.map(bond => (
                <div key={bond.id} className="flex items-center justify-between text-[11px]" title={bond.fateText || `${bond.role} · 위기 시 구명 개입 가능`}>
                  <span className={bond.isAlive ? 'text-slate-200 font-semibold' : 'text-slate-500 line-through'}>
                    {bond.isAlive ? '● ' : '✝ '}{bond.name} <span className="text-[10px] opacity-75">({bond.role})</span>
                  </span>
                  <span className={`text-[10px] font-bold ${bond.isAlive ? 'text-cyan-300' : 'text-rose-400/80'}`}>
                    {bond.isAlive ? `유대 ${bond.affinity}` : '산화'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Equipment & Inventory */}
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/5 pb-1 font-bold">
              <span>장착 장비 및 물자</span>
              <button
                onClick={onOpenActions}
                className="text-[10px] text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>무기고·승급 열기</span>
              </button>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">무기:</span>
              <span className="text-slate-200 font-bold">
                {character.equipment.weapon
                  ? `${character.equipment.weapon.name} (+${character.equipment.weapon.atkBonus})`
                  : '맨손'}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">방어구:</span>
              <span className="text-slate-200 font-bold">
                {character.equipment.armor
                  ? `${character.equipment.armor.name} (+${character.equipment.armor.defBonus})`
                  : '일반 평복'}
              </span>
            </div>
            <div className="pt-1.5 border-t border-white/5">
              <span className="text-[10px] text-slate-400 block mb-1">보유 소모품:</span>
              <div className="flex flex-wrap gap-1">
                {character.inventory.length > 0 ? character.inventory.map((slot, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {slot.item.name} x{slot.count}
                  </span>
                )) : (
                  <span className="text-[10px] text-slate-500">없음</span>
                )}
              </div>
            </div>
          </div>

          {/* Faction Reputations */}
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-xs space-y-1.5">
            <div className="text-[11px] text-slate-400 border-b border-white/5 pb-1 font-bold">
              주요 세력 우호도
            </div>
            {Object.entries(character.factions).map(([fac, rep]) => (
              <div key={fac} className="flex justify-between text-[11px]">
                <span className="text-slate-400">{fac}</span>
                <span className={`font-bold ${rep > 0 ? 'text-cyan-300' : rep < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                  {rep > 0 ? `+${rep}` : rep}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Event Log Stream (8 cols) */}
        <section 
          className={`md:col-span-8 ${
            isRightSidebar ? 'md:order-1' : 'md:order-2'
          } flex-col h-full overflow-hidden bg-[#0b0d11] ${
            mobileTab === 'log' ? 'flex' : 'hidden md:flex'
          }`}
          style={{ backgroundColor: nationIdentity.colors.surface }}
        >
          {/* Regional Specialty Widget: Chronicle Banner */}
          {nationIdentity.specialtyWidget?.position === 'chronicle-banner' && specialtyMetric && (
            <div 
              className="px-3 py-1.5 border-b text-xs flex items-center justify-between shrink-0"
              style={{ 
                borderColor: nationIdentity.colors.border, 
                backgroundColor: nationIdentity.colors.card 
              }}
            >
              <div className="flex items-center space-x-1.5 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider truncate" style={{ color: nationIdentity.colors.badgeText }}>
                  {nationIdentity.specialtyWidget.title}
                </span>
                <span className="text-slate-400 text-[10px] shrink-0">· {specialtyMetric.hint}</span>
              </div>
              <span className={`font-mono font-bold shrink-0 ${specialtyMetric.tone}`}>{specialtyMetric.value}</span>
            </div>
          )}

          <EventLogPanel
            logs={logs}
            currentEvent={currentEvent}
            character={character}
            nationId={activeNationId}
            onSelectChoice={onSelectChoice}
            autoChoicePendingId={autoChoicePendingId}
            minorTimeoutRemainingSec={minorTimeoutRemainingSec}
            isPlaying={isPlaying}
            onNextYear={onNextYear}
            onSkipToNextEvent={onSkipToNextEvent}
            onTogglePlay={onTogglePlay}
            onFlowThroughEvent={onFlowThroughEvent}
            theme={theme}
          />
        </section>
      </main>

      {/* Four-Season Smooth Time Progression Ribbon */}
      <div
        className="season-indicator h-6 bg-[#0b0f17] border-t border-cyan-500/20 px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 text-[10px]"
        data-season={currentSeason}
      >
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-cyan-400 font-bold">
            {character.year}년 · {currentSeason}
          </span>
          <div className="hidden sm:flex items-center space-x-1 text-slate-500">
            {(['봄', '여름', '가을', '겨울'] as Season[]).map(s => (
              <span
                key={s}
                className={`px-1 rounded ${
                  currentSeason === s ? 'bg-cyan-500/20 text-cyan-300 font-bold' : ''
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="grow bg-slate-900/90 h-1.5 rounded-full overflow-hidden border border-cyan-950">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-300 transition-[width] duration-75"
            style={{ width: `${Math.max(0, Math.min(100, yearProgress))}%` }}
          />
        </div>
        <span className="text-slate-400 shrink-0 font-bold">
          {isPlaying && !currentEvent ? `${speed}x 진행 중` : currentEvent ? '선택 대기' : '정지'}
        </span>
      </div>

      {/* Bottom Control Deck */}
      <footer className="h-14 border-t border-cyan-500/30 bg-[#0f131a] px-3 sm:px-4 flex items-center justify-between shrink-0 gap-2 overflow-x-auto">
        {/* Action Points & Auto Choice Options */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button
            onClick={onOpenActions}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-300 transition-all font-bold text-xs"
            title="연간 활동 포인트 (연간 기본 1 AP, T2 이상 2 AP, T4 이상 3 AP 회복)"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="hidden xs:inline">활동·승급</span>
            <span className="px-1.5 py-0.2 bg-cyan-400 text-black text-[10px] rounded font-black">
              {character.actionPoints} AP
            </span>
          </button>

          <button
            onClick={onToggleAutoChoice}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              isAutoChoiceEnabled
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="자동 진행 중 스토리 사건 및 선택지를 AI가 능력치에 맞춰 자동 선택"
          >
            <Bot className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{isAutoChoiceEnabled ? '사건 자동: ON' : '사건 자동: OFF'}</span>
            <span className="sm:hidden">{isAutoChoiceEnabled ? '자동ON' : '자동OFF'}</span>
          </button>
        </div>

        {/* Time Control Group */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
            }`}
            title={isPlaying ? '일시정지 (Space)' : '자동 진행 시작 (Space)'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">일시정지</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">자동진행</span>
              </>
            )}
          </button>

          {/* Speed Buttons (1x, 2x, 4x, 8x, 16x, 32x) */}
          <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-cyan-500/20">
            {([1, 2, 4, 8, 16, 32] as GameSpeed[]).map((s, idx) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  speed === s
                    ? 'bg-cyan-500 text-black shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`배속 설정: ${s}배속 (단축키: ${idx + 1} 또는 [ / ])`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Manual Turn Skip Button (+1 Year) */}
          <button
            onClick={onNextYear}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold transition-all"
            title="다음 해로 1년 넘기기 (단축키: N)"
          >
            <span className="hidden sm:inline">다음 해</span>
            <span className="sm:hidden">+1년</span>
            <SkipForward className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Skip to Next Choice/Event Button */}
          {onSkipToNextEvent && (
            <button
              onClick={onSkipToNextEvent}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 hover:text-indigo-200 text-xs font-bold transition-all shadow-[0_0_8px_rgba(99,102,241,0.2)]"
              title="다음 선택지나 사건이 나타날 때까지 즉시 건너뛰기 (단축키: S)"
            >
              <FastForward className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="hidden sm:inline">사건까지 스킵</span>
              <span className="sm:hidden">스킵</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
