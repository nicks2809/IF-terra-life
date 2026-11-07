// src/components/LandingScreen.tsx
import React, { useState, useEffect } from 'react';
import { Gender, ReincarnationConfig, ThemeMode } from '../types';
import { NATIONS_DATA } from '../data/nations';
import { GameEngine } from '../engine/gameEngine';
import { NationInsignia } from './NationInsignia';
import { 
  Clock, 
  PauseCircle, 
  Compass, 
  Feather, 
  Flame, 
  AlertTriangle, 
  Dices, 
  Sparkles, 
  Play, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Terminal,
  Award,
  Trophy
} from 'lucide-react';

export interface LandingScreenProps {
  onStartLife?: (config?: ReincarnationConfig) => void;
  onStart?: (config?: ReincarnationConfig) => void;
  onResumeLife?: () => void;
  onResume?: () => void;
  hasActiveSave?: boolean;
  activeCharacterSummary?: {
    name: string;
    age: number;
    nation: string;
    gender?: Gender;
  } | null;
  activeCharacterInfo?: {
    name: string;
    age: number;
    nation: string;
  } | null;
  currentTheme?: ThemeMode;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onSwitchTheme?: () => void;
  onOpenHallOfFame?: () => void;
  onOpenAchievementBook?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartLife,
  onStart,
  onResumeLife,
  onResume,
  hasActiveSave = false,
  activeCharacterSummary = null,
  activeCharacterInfo = null,
  currentTheme,
  theme,
  onToggleTheme,
  onSwitchTheme,
  onOpenHallOfFame,
  onOpenAchievementBook,
  isMuted = false,
  onToggleMute,
  className = ''
}) => {
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<Gender | 'random'>('random');
  const [selectedNationId, setSelectedNationId] = useState<string>('random');
  const [customSeed, setCustomSeed] = useState<string>('');
  const [useFixedSeed, setUseFixedSeed] = useState<boolean>(false);
  const [isSeedOpen, setIsSeedOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isComposing, setIsComposing] = useState<boolean>(false);

  useEffect(() => {
    setIsSubmitting(false);
  }, [hasActiveSave]);

  const activeTheme = currentTheme || theme || 'prts';
  const handleToggleThemeClick = onToggleTheme || onSwitchTheme;
  const handleStartHandler = onStartLife || onStart;
  const handleResumeHandler = onResumeLife || onResume;

  // 무작위 이름 주사위 굴리기
  const handleRollRandomName = () => {
    const randomGenerated = GameEngine.getRandomName();
    setName(randomGenerated);
  };

  // 생애 시작 핸들러 (중복 제출 방어 및 유효성 검사)
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting || isComposing) return;

    setIsSubmitting(true);

    const config: ReincarnationConfig = {
      name: name.trim() || undefined,
      gender: gender === 'random' ? undefined : gender,
      nationId: selectedNationId === 'random' ? undefined : selectedNationId,
      seed: customSeed.trim() || undefined,
      useFixedSeed: useFixedSeed && !!customSeed.trim()
    };

    if (handleStartHandler) {
      handleStartHandler(config);
    }
  };

  // 키보드 엔터 및 스페이스 입력 격리 (단축키 충돌 방지)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const activeInfo = activeCharacterSummary || activeCharacterInfo;

  return (
    <div className={`relative min-h-screen w-full bg-[#0b0d11] text-slate-100 font-sans overflow-y-auto selection:bg-amber-500/30 selection:text-amber-200 ${className}`}>
      {/* 배경 PRTS 스캔라인 및 방사형 비네트 */}
      <div className="fixed inset-0 pointer-events-none scanlines opacity-40 z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-black/80 z-0" />

      {/* 메인 반응형 컨테이너 */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-16 flex flex-col space-y-6 sm:space-y-8">
        
        {/* 상단 내비게이션 바 & PRTS 시스템 모티프 */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          {/* 언어 및 유틸리티 도구 그룹 */}
          <div className="flex items-center space-x-1.5 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold shadow-sm">
              한국어
            </span>
            {handleToggleThemeClick && (
              <button
                type="button"
                onClick={handleToggleThemeClick}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors flex items-center space-x-1"
                title={activeTheme === 'prts' ? '역사서 고서 모드로 전환' : 'PRTS 터미널 모드로 전환'}
              >
                {activeTheme === 'prts' ? <BookOpen className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
                <span>{activeTheme === 'prts' ? '역사서 고서' : 'PRTS 터미널'}</span>
              </button>
            )}
            {onOpenHallOfFame && (
              <button
                type="button"
                onClick={onOpenHallOfFame}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/50 transition-colors flex items-center space-x-1"
                title="지난 생애 추모실"
              >
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>추모실</span>
              </button>
            )}
            {onOpenAchievementBook && (
              <button
                type="button"
                onClick={onOpenAchievementBook}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors flex items-center space-x-1"
                title="업적 도감"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>업적 도감</span>
              </button>
            )}
          </div>

          {/* PRTS 시스템 상태 및 사운드 제어 */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>PRTS // TERMINAL ONLINE</span>
            </div>

            {onToggleMute && (
              <button
                type="button"
                onClick={onToggleMute}
                aria-label="음소거 토글"
                className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                title={isMuted ? '음소거 해제' : '음소거'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            )}
          </div>
        </header>

        {/* 타이틀 & 서사 도입부 */}
        <section className="space-y-4">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-amber-400 uppercase">
            비공식 팬 제작 인생 시뮬레이션
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            테라의 한 사람으로<br />
            태어나
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
            이 대지에서는 매 순간 누군가 태어납니다. 그중 한 명이 되어, 한 해 한 해를 실시간으로 살아갑니다. 누구의 아이로 태어날지는 고를 수 없습니다.
          </p>
        </section>

        {/* 명일방주 IP 및 스포일러 주의 안내문 (IP / Spoiler Notice) */}
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 px-4 py-3 sm:px-5 sm:py-3.5 flex items-start space-x-3 text-amber-200/90 text-xs sm:text-sm leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">스포일러 주의 · </span>
            원작 게임 <span className="font-semibold text-amber-100">명일방주(Arknights / Hypergryph)</span> 본편 및 국가별 이벤트 스토리의 세계관 설정과 주요 결말이 포함되어 있습니다.
          </div>
        </div>

        {/* 5대 핵심 메커니즘 규칙 카드 */}
        <div className="flex flex-col space-y-2.5 sm:space-y-3">
          {/* 카드 1: 시간의 흐름 */}
          <div className="rounded-xl bg-[#131722]/80 border border-slate-800 p-4 sm:p-4.5 hover:border-amber-500/40 hover:bg-[#161c2b] transition-all flex items-start space-x-3.5 shadow-sm">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm sm:text-base text-slate-200 leading-snug">
              <strong className="text-amber-400 font-bold">1년 = 1분</strong> 기준의 시간 흐름 (<strong className="text-amber-400 font-bold">x1부터 x32까지</strong> 배속 조절 가능). 매 순간 테라에서의 시간 흐름이 실시간으로 펼쳐집니다.
            </div>
          </div>

          {/* 카드 2: 선택과 정지 */}
          <div className="rounded-xl bg-[#131722]/80 border border-slate-800 p-4 sm:p-4.5 hover:border-amber-500/40 hover:bg-[#161c2b] transition-all flex items-start space-x-3.5 shadow-sm">
            <PauseCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm sm:text-base text-slate-200 leading-snug">
              운명을 가르는 중대한 <strong className="text-amber-400 font-bold">선택지</strong>에서는 시간이 <strong className="text-amber-400 font-bold">일시정지</strong>합니다. 작은 선택은 기다려 주지 않고 흘러갑니다.
            </div>
          </div>

          {/* 카드 3: 출생과 환경 */}
          <div className="rounded-xl bg-[#131722]/80 border border-slate-800 p-4 sm:p-4.5 hover:border-amber-500/40 hover:bg-[#161c2b] transition-all flex items-start space-x-3.5 shadow-sm">
            <Compass className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm sm:text-base text-slate-200 leading-snug">
              12대 테라 주요 국가 혹은 국경 너머 황야. <strong className="text-amber-400 font-bold">태어나는 곳, 즉 출생지</strong>는 무작위이고, 원하면 아래에서 고를 수 있습니다. 안전한 이동도시도, 위험한 변방도 존재합니다.
            </div>
          </div>

          {/* 카드 4: 평온한 일상 */}
          <div className="rounded-xl bg-[#131722]/80 border border-slate-800 p-4 sm:p-4.5 hover:border-amber-500/40 hover:bg-[#161c2b] transition-all flex items-start space-x-3.5 shadow-sm">
            <Feather className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm sm:text-base text-slate-200 leading-snug">
              사건이 없는 <strong className="text-amber-400 font-bold">평온한 해</strong>는 <strong className="text-amber-400 font-bold">테라의 일상</strong> 한 줄 기록으로 넘어갑니다.
            </div>
          </div>

          {/* 카드 5: 테라에서의 삶 */}
          <div className="rounded-xl bg-[#131722]/80 border border-slate-800 p-4 sm:p-4.5 hover:border-amber-500/40 hover:bg-[#161c2b] transition-all flex items-start space-x-3.5 shadow-sm">
            <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm sm:text-base text-slate-200 leading-snug">
              <strong className="text-amber-400 font-bold">광석병</strong>과 <strong className="text-amber-400 font-bold">재앙</strong>이 도사리는 <strong className="text-amber-400 font-bold">테라의 삶</strong>. 누군가는 로도스의 오퍼레이터가 되고, 각자의 길에서 전설적인 정점 칭호를 새깁니다.
            </div>
          </div>
        </div>

        {/* 캐릭터 출생 설정 폼 (Character Birth Setup Form) */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            
            {/* 이름 입력 */}
            <div className="space-y-1.5">
              <label htmlFor="char-name" className="text-xs font-semibold text-slate-300">
                이름
              </label>
              <div className="relative flex items-center">
                <input
                  id="char-name"
                  type="text"
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="비워 두면 무작위 이름"
                  className="w-full h-11 px-3.5 pr-10 rounded-lg bg-[#131722] border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={handleRollRandomName}
                  aria-label="무작위 이름 생성"
                  className="absolute right-2 p-1 text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-center text-base"
                  title="무작위 이름 굴리기"
                >
                  <span role="img" aria-label="dice">🎲</span>
                </button>
              </div>
            </div>

            {/* 성별 선택 pills */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                성별
              </label>
              <div className="grid grid-cols-3 gap-1.5 h-11" role="group" aria-label="성별 선택">
                <button
                  type="button"
                  onClick={() => setGender('남성')}
                  className={`h-full rounded-lg text-sm font-bold transition-all ${
                    gender === '남성'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-[#131722] border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => setGender('여성')}
                  className={`h-full rounded-lg text-sm font-bold transition-all ${
                    gender === '여성'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-[#131722] border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  여성
                </button>
                <button
                  type="button"
                  onClick={() => setGender('random')}
                  className={`h-full rounded-lg text-sm font-bold transition-all ${
                    gender === 'random'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-[#131722] border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  무관
                </button>
              </div>
            </div>

            {/* 태어날 곳 (출생지 / 국가 선택) */}
            <div className="space-y-1.5">
              <label htmlFor="birthplace-select" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>태어날 곳 (출생지)</span>
                {selectedNationId !== 'random' && (
                  <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                    <NationInsignia nationId={selectedNationId} size="sm" variant="monochrome" className="inline-block" />
                    지정됨
                  </span>
                )}
              </label>
              <div className="relative">
                <select
                  id="birthplace-select"
                  value={selectedNationId}
                  onChange={(e) => setSelectedNationId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#131722] border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all appearance-none cursor-pointer"
                >
                  <option value="random">무작위 출생 (원작 인구통계 가중치)</option>
                  <optgroup label="12대 주요 국가">
                    {NATIONS_DATA.filter(n => ['yan','ursus','victoria','columbia','sargon','leithanien','kazimierz','iberia','siracusa','rim_billiton','sami','laterano'].includes(n.id)).map(n => (
                      <option key={n.id} value={n.id}>
                        {n.name} ({n.nameEn}) - 위험도: {n.riskLevel}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="특수 및 자치 도시">
                    {NATIONS_DATA.filter(n => !['yan','ursus','victoria','columbia','sargon','leithanien','kazimierz','iberia','siracusa','rim_billiton','sami','laterano'].includes(n.id)).map(n => (
                      <option key={n.id} value={n.id}>
                        {n.name} ({n.nameEn})
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

          </div>

          {/* 메인 CTA: 태어나기 & 이어하기 버튼 */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none min-w-[180px] h-12 px-8 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-black text-base tracking-wide shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
              <span>태어나기</span>
            </button>

            {hasActiveSave && handleResumeHandler && (
              <button
                type="button"
                onClick={handleResumeHandler}
                className="flex-1 sm:flex-none h-12 px-6 rounded-lg bg-cyan-950/40 border border-cyan-500/50 hover:bg-cyan-900/40 text-cyan-300 font-bold text-sm tracking-wide transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Play className="w-4 h-4 fill-cyan-300" />
                <span>
                  이전 생애 이어하기
                  {activeInfo && ` (${activeInfo.name}, ${activeInfo.age}세)`}
                </span>
              </button>
            )}
          </div>
        </form>

        {/* 추가 모드 카드 */}
        <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">추가 모드 / 특별 프로토콜</span>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">로도스 아일랜드 예비 오퍼레이터</h3>
            <p className="text-xs text-slate-400">오퍼레이터 선발 시험 · 이동함 생존 프로토콜 (추후 업데이트)</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">PRTS-LOCKED</span>
        </div>

        {/* 접이식 시드(Seed) 설정 아코디언 */}
        <div className="border border-slate-800/80 rounded-xl bg-slate-900/30 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setIsSeedOpen(!isSeedOpen)}
            className="w-full px-4 py-3 text-left font-mono text-slate-400 hover:text-slate-200 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className={`transition-transform duration-200 ${isSeedOpen ? 'rotate-90' : ''}`}>▶</span>
              시드 지정 (선택) - Custom Seed
            </span>
            <span className="text-[11px] text-slate-400">고급 설정: 시드 지정</span>
          </button>

          {isSeedOpen && (
            <div className="p-4 border-t border-slate-800 space-y-3 bg-[#131722]/60">
              <p className="text-slate-400 text-xs leading-relaxed">
                시드를 입력하면 초기 능력치, 인구통계 출생지, 그리고 테라 생애 분기가 100% 동일하게 재현됩니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="text"
                  value={customSeed}
                  onChange={(e) => setCustomSeed(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="임의 시드 코드 (예: TERRA_1085)"
                  className="w-full sm:w-72 h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useFixedSeed}
                    onChange={(e) => setUseFixedSeed(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span>고정 시드 모드 활성화</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 컨텐츠 수위 권장 고지문 */}
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-rose-400/90 font-medium">
            죽음, 질병(광석병), 범죄, 전쟁과 같은 무거운 장면이 나옵니다. 15세 이상에게 권장합니다.
          </p>
        </div>

        {/* 단축키 안내 & 비상업적 팬 창작물 면책 조항 */}
        <footer className="border-t border-slate-800/80 pt-6 pb-8 space-y-3 text-center">
          {/* 단축키 배지 바 */}
          <div className="text-xs font-mono text-slate-400">
            단축키 — <span className="text-slate-200">Space</span> 일시정지 · <span className="text-slate-200">[ ]</span> 배속 조절 · <span className="text-slate-200">1~4</span> 선택지 · <span className="text-slate-200">0</span> 흘려보내기
          </div>

          {/* 비상업적 비공식 팬메이드 고지문 */}
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            이 작품은 명일방주(Arknights) 세계관을 기반으로 한 비상업적 비공식 팬메이드 2차 창작물이며 원작 및 원작사(Hypergryph / Yostar)와 관련이 없습니다. 모든 수치와 사건은 이 시뮬레이션을 위해 만든 허구입니다.
          </p>

          {/* 원작 및 영감 작품 외부 바로가기 링크 */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-400 pt-1">
            <span>
              원작 IP —{' '}
              <a
                href="https://arknights.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
              >
                명일방주(Arknights) 공식 홈페이지
              </a>
            </span>
            <span className="text-slate-600">·</span>
            <span>
              영감 —{' '}
              <a
                href="https://project-moon-life.cityborn.workers.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
              >
                도시의 한 사람으로 태어나
              </a>
              {' '}(
              <a
                href="https://x.com/_ryo_man"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                @_ryo_man
              </a>
              )
            </span>
            <span className="text-slate-600">·</span>
            <a
              href="https://github.com/nicks2809/IF-terra-life"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors"
            >
              GitHub
            </a>
          </div>

          <p className="text-[11px] font-mono text-slate-400 tracking-wider">
            PRTS Protocol Life Simulator · Non-Commercial Fan Project
          </p>
        </footer>

      </div>
    </div>
  );
};

export default LandingScreen;
