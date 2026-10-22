import React, { useMemo } from 'react';
import { Character, LogEntry, GameEvent, EventChoice, GameSpeed, ThemeMode } from '../types';
import { GameEngine } from '../engine/gameEngine';
import { EventLogPanel } from './EventLogPanel';
import { 
  Heart, 
  Brain, 
  Coins, 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Award, 
  Trophy,
  RotateCcw,
  Feather,
  Flame
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
  onOpenActions,
  onOpenHallOfFame,
  onOpenAchievementBook,
  onRestart,
  isMuted,
  onToggleMute,
  onSwitchTheme,
  theme
}) => {
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

      {/* Main Tome Body */}
      <main className="grow grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-[#f4ebd0]">
        {/* Left Parchment: Character Bio (4 cols) */}
        <aside className="md:col-span-4 border-r-2 border-[#5c4033]/30 bg-[#ebdcb9] p-5 flex flex-col overflow-y-auto space-y-4 shadow-inner">
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
        <section className="md:col-span-8 flex flex-col h-full overflow-hidden bg-[#f4ebd0]">
          <EventLogPanel
            logs={logs}
            currentEvent={currentEvent}
            character={character}
            onSelectChoice={onSelectChoice}
            theme={theme}
          />
        </section>
      </main>

      {/* Tome Bottom Dock */}
      <footer className="h-14 border-t-2 border-[#5c4033] bg-[#d9c79f] px-6 flex items-center justify-between shrink-0 shadow-md">
        <button
          onClick={onOpenActions}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-[#8b1e1e] hover:bg-[#a32828] text-white text-xs font-bold shadow transition-all"
        >
          <Feather className="w-4 h-4" />
          <span>올해의 자율 행동</span>
          <span className="px-1.5 py-0.2 bg-white text-black text-[10px] rounded font-black">
            {character.actionPoints} AP
          </span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={onTogglePlay}
            className="p-2 rounded-lg bg-[#5c4033] hover:bg-[#432d24] text-white transition-all shadow"
            title={isPlaying ? '일시정지' : '자동 진행'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {([1, 2, 4] as GameSpeed[]).map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                speed === s
                  ? 'bg-[#8b1e1e] text-white border-[#8b1e1e]'
                  : 'bg-[#ebdcb9] border-[#5c4033]/40 text-[#5c4d47] hover:bg-[#dfceaa]'
              }`}
            >
              {s}x
            </button>
          ))}

          <button
            onClick={onNextYear}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-[#5c4033] hover:bg-[#432d24] text-white text-xs font-bold transition-all ml-2 shadow"
          >
            <span>다음 해로</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
