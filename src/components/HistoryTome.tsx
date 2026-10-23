import React, { useMemo, useState, useEffect } from 'react';
import { Character, LogEntry, GameEvent, EventChoice, GameSpeed, ThemeMode } from '../types';
import { GameEngine } from '../engine/gameEngine';
import { EventLogPanel } from './EventLogPanel';
import { 
  Heart, 
  Brain, 
  Coins, 
  Play, 
  Pause, 
  FastForward,
  SkipForward, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Award, 
  Trophy,
  RotateCcw,
  Feather,
  Flame,
  Bot
} from 'lucide-react';

interface Props {
  character: Character;
  logs: LogEntry[];
  currentEvent?: GameEvent;
  onSelectChoice: (choice: EventChoice) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: GameSpeed;
  onChangeSpeed: (speed: GameSpeed) => void;
  onNextYear: () => void;
  onSkipToNextEvent?: () => void;
  isAutoChoiceEnabled: boolean;
  onToggleAutoChoice: () => void;
  autoChoicePendingId?: string | null;
  onOpenActions: () => void;
  onOpenHallOfFame: () => void;
  onOpenAchievementBook?: () => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onSwitchTheme: () => void;
  theme: ThemeMode;
}

export const HistoryTome: React.FC<Props> = ({
  character,
  logs,
  currentEvent,
  onSelectChoice,
  isPlaying,
  onTogglePlay,
  speed,
  onChangeSpeed,
  onNextYear,
  onSkipToNextEvent,
  isAutoChoiceEnabled,
  onToggleAutoChoice,
  autoChoicePendingId,
  onOpenActions,
  onOpenHallOfFame,
  onOpenAchievementBook,
  onRestart,
  isMuted,
  onToggleMute,
  onSwitchTheme,
  theme
}) => {
  const [mobileTab, setMobileTab] = useState<'profile' | 'log'>('log');

  useEffect(() => {
    if (currentEvent) {
      setMobileTab('log');
    }
  }, [currentEvent]);

  const lifespanProfile = useMemo(() => {
    return GameEngine.getCharacterLifespanProfile(character);
  }, [character.race, character.subRace, character.oripathy.crystallizationRate, character.oripathy.suppressantDoseLeft]);

  return (
    <div className="flex flex-col h-screen bg-[#e8dcbe] text-[#1a1412] font-serif select-none overflow-hidden">
      {/* Antique Header */}
      <header className="h-14 border-b-2 border-[#5c4033] bg-[#d9c79f] px-6 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center space-x-3">
          <Feather className="w-5 h-5 text-[#8b1e1e]" />
          <div>
            <h1 className="text-base font-bold tracking-widest text-[#2c1810]">
              테라 역사 총서 (CHRONICLES OF TERRA)
            </h1>
            <span className="text-[11px] text-[#5c4d47]">
              제 {character.year}년의 기록 · {character.name}의 생애 ({character.age}세)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded hover:bg-black/10 text-[#5c4d47]"
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-700" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onSwitchTheme}
            className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs bg-[#2c1810] text-[#00e5ff] hover:bg-black transition-all shadow"
            title="PRTS 터미널로 복귀"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">PRTS HUD</span>
          </button>

          {onOpenAchievementBook && (
            <button
              onClick={onOpenAchievementBook}
              className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs bg-[#c99732] text-black font-bold hover:bg-[#dba83f] transition-all shadow"
              title="테라 업적 도감"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">업적 도감</span>
            </button>
          )}

          <button
            onClick={onOpenHallOfFame}
            className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs bg-[#8b1e1e] text-white hover:bg-[#a32828] transition-all shadow"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">추모실</span>
          </button>

          <button
            onClick={onRestart}
            className="p-1.5 rounded hover:bg-black/10 text-[#5c4d47]"
            title="새로운 생애 시작"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Screen Tab Switcher */}
      <div className="md:hidden flex border-b border-[#5c4033]/30 bg-[#ebdcb9] text-xs font-bold shrink-0">
        <button
          onClick={() => setMobileTab('log')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-all flex items-center justify-center space-x-1.5 ${
            mobileTab === 'log'
              ? 'border-[#8b1e1e] text-[#8b1e1e] bg-[#f4ebd0]'
              : 'border-transparent text-[#5c4d47] hover:text-[#2c1810]'
          }`}
        >
          <span>사서의 연대기 & 사건</span>
          {currentEvent && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] animate-pulse">!</span>
          )}
        </button>
        <button
          onClick={() => setMobileTab('profile')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-all flex items-center justify-center space-x-1.5 ${
            mobileTab === 'profile'
              ? 'border-[#8b1e1e] text-[#8b1e1e] bg-[#f4ebd0]'
              : 'border-transparent text-[#5c4d47] hover:text-[#2c1810]'
          }`}
        >
          <span>인물 약력 · 능력치</span>
        </button>
      </div>

      {/* Main Tome Body */}
      <main className="grow grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-[#f4ebd0]">
        {/* Left Parchment: Character Bio (4 cols) */}
        <aside className={`md:col-span-4 border-r-2 border-[#5c4033]/30 bg-[#ebdcb9] p-5 flex-col overflow-y-auto space-y-4 shadow-inner ${
          mobileTab === 'profile' ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Identity Scroll */}
          <div className="p-4 rounded-lg border border-[#5c4033]/40 bg-[#f4ebd0] shadow-sm">
            <span className="text-[10px] text-[#8b1e1e] font-bold block mb-1">
              [인물 약력]
            </span>
            <h2 className="text-2xl font-bold tracking-wide text-[#2c1810]">
              {character.name}
            </h2>
            <div className="text-xs text-[#5c4d47] mt-1">
              {character.nation} 출신 · {character.race} {character.subRace && `(${character.subRace})`}
            </div>
            <div className="text-xs text-[#5c4d47]">
              환경: {character.environment}
            </div>
            <div className="text-xs font-bold text-[#8b1e1e] mt-1">
              직업: {character.career}
            </div>
            <div className="text-[11px] text-[#5c4d47] mt-1 pt-1 border-t border-[#5c4033]/20 flex items-center justify-between">
              <span>기대 수명: <span className="font-bold text-[#8b1e1e]">{lifespanProfile.baseLifespan}세</span> (최대 {lifespanProfile.effectiveMaxLifespan}세)</span>
              {character.oripathy.isInfected && (
                <span className="text-[10px] text-red-700 font-semibold">[광석병 감퇴]</span>
              )}
            </div>

            {character.titles.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {character.titles.map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#8b1e1e]/15 border border-[#8b1e1e]/40 text-[#8b1e1e] font-bold">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Vitals Summary */}
          <div className="p-4 rounded-lg border border-[#5c4033]/40 bg-[#f4ebd0] space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-1 text-red-800 font-bold">
                <Heart className="w-3.5 h-3.5" />
                <span>기력 (체력)</span>
              </span>
              <span className="font-bold">{character.stats.health} / {character.stats.maxHealth}</span>
            </div>
            <div className="w-full bg-[#d9c79f] rounded-full h-2 overflow-hidden border border-[#5c4033]/30">
              <div 
                className="bg-red-800 h-full"
                style={{ width: `${Math.max(0, Math.min(100, (character.stats.health / character.stats.maxHealth) * 100))}%` }}
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="flex items-center space-x-1 text-blue-900 font-bold">
                <Brain className="w-3.5 h-3.5" />
                <span>정신 (이성)</span>
              </span>
              <span className="font-bold">{character.stats.sanity} / {character.stats.maxSanity}</span>
            </div>
            <div className="w-full bg-[#d9c79f] rounded-full h-2 overflow-hidden border border-[#5c4033]/30">
              <div 
                className="bg-blue-800 h-full"
                style={{ width: `${Math.max(0, Math.min(100, (character.stats.sanity / character.stats.maxSanity) * 100))}%` }}
              />
            </div>

            {/* Oripathy indicator */}
            <div className="pt-2 border-t border-[#5c4033]/20 flex justify-between items-center text-xs">
              <span className="flex items-center space-x-1 text-[#8b1e1e] font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>광석병 결정화</span>
              </span>
              <span className="font-bold text-red-700">
                {character.oripathy.crystallizationRate}% ({character.oripathy.stage})
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center space-x-1 text-amber-900 font-bold">
                <Coins className="w-3.5 h-3.5" />
                <span>보유 용문폐</span>
              </span>
              <span className="font-bold text-amber-800">{character.stats.wealth.toLocaleString()} LMD</span>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="p-4 rounded-lg border border-[#5c4033]/40 bg-[#f4ebd0] space-y-1.5 text-xs">
            <div className="text-[11px] text-[#5c4d47] font-bold border-b border-[#5c4033]/20 pb-1">
              숙련도 및 적성
            </div>
            <div className="flex justify-between">
              <span>전투 숙련도 (ATK)</span>
              <span className="font-bold">{character.stats.combat}</span>
            </div>
            <div className="flex justify-between">
              <span>오리지늄 아츠 (ARTS)</span>
              <span className="font-bold text-indigo-900">
                {character.stats.artsAptitude}
                {character.oripathy.isInfected && ` (${character.oripathy.activeArtsMultiplier}x)`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>지략 및 정세 (INTEL)</span>
              <span className="font-bold">{character.stats.intellect}</span>
            </div>
            <div className="flex justify-between">
              <span>운수 (LUCK)</span>
              <span className="font-bold">{character.stats.luck}</span>
            </div>
          </div>
        </aside>

        {/* Right Page: Journal Chronicles (8 cols) */}
        <section className={`md:col-span-8 flex-col h-full overflow-hidden bg-[#f4ebd0] ${
          mobileTab === 'log' ? 'flex' : 'hidden md:flex'
        }`}>
          <EventLogPanel
            logs={logs}
            currentEvent={currentEvent}
            character={character}
            onSelectChoice={onSelectChoice}
            autoChoicePendingId={autoChoicePendingId}
            isPlaying={isPlaying}
            onNextYear={onNextYear}
            onSkipToNextEvent={onSkipToNextEvent}
            onTogglePlay={onTogglePlay}
            theme={theme}
          />
        </section>
      </main>

      {/* Tome Bottom Dock */}
      <footer className="h-14 border-t-2 border-[#5c4033] bg-[#d9c79f] px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-md gap-2 overflow-x-auto">
        {/* Action Points & Auto Choice Options */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button
            onClick={onOpenActions}
            className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-[#8b1e1e] hover:bg-[#a32828] text-white text-xs font-bold shadow transition-all shrink-0"
          >
            <Feather className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline">자율 행동</span>
            <span className="px-1.5 py-0.2 bg-white text-black text-[10px] rounded font-black">
              {character.actionPoints} AP
            </span>
          </button>

          <button
            onClick={onToggleAutoChoice}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all border ${
              isAutoChoiceEnabled
                ? 'bg-[#8b1e1e] text-white border-[#8b1e1e]'
                : 'bg-[#ebdcb9] border-[#5c4033]/40 text-[#5c4d47] hover:text-[#2c1810]'
            }`}
            title="자동 진행 중 스토리 사건 및 선택지를 AI가 능력치에 맞춰 자동 선택 (클릭하여 켜기/끄기)"
          >
            <Bot className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{isAutoChoiceEnabled ? '사건 자동: ON' : '사건 자동: OFF'}</span>
            <span className="sm:hidden">{isAutoChoiceEnabled ? '자동ON' : '자동OFF'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button
            onClick={onTogglePlay}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all ${
              isPlaying 
                ? 'bg-[#8b1e1e] text-white' 
                : 'bg-[#5c4033] hover:bg-[#432d24] text-amber-200'
            }`}
            title={isPlaying ? '일시정지 (Space)' : '자동 진행 (Space)'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">일시정지</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">자동진행</span>
              </>
            )}
          </button>

          <div className="flex items-center bg-[#ebdcb9] rounded-lg p-0.5 border border-[#5c4033]/40">
            {([1, 2, 4, 8, 16] as GameSpeed[]).map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  speed === s
                    ? 'bg-[#8b1e1e] text-white shadow font-extrabold'
                    : 'text-[#5c4d47] hover:text-[#2c1810]'
                }`}
                title={`배속 설정: ${s}배속 (단축키: ${s})`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={onNextYear}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#5c4033] hover:bg-[#432d24] text-white text-xs font-bold transition-all shadow"
            title="다음 해로 1년 넘기기 (단축키: N)"
          >
            <span className="hidden sm:inline">다음 해</span>
            <span className="sm:hidden">+1년</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {onSkipToNextEvent && (
            <button
              onClick={onSkipToNextEvent}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#c99732] hover:bg-[#dba83f] text-black text-xs font-bold transition-all shadow"
              title="다음 선택지나 사건이 발생할 때까지 건너뛰기 (단축키: S)"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">사건까지 스킵</span>
              <span className="sm:hidden">스킵</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
