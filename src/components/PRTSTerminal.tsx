// src/components/PRTSTerminal.tsx
import React, { useRef, useEffect } from 'react';
import { Character, LogEntry, GameEvent, EventChoice, GameSpeed, ThemeMode } from '../types';
import { EventLogPanel } from './EventLogPanel';
import { 
  Heart, 
  Brain, 
  Coins, 
  Sparkles, 
  ShieldAlert, 
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
  Activity
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

export const PRTSTerminal: React.FC<Props> = ({
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      ctx.strokeStyle = isLowHp ? '#ef4444' : '#00e5ff';
      ctx.shadowBlur = 4;
      ctx.shadowColor = isLowHp ? '#ef4444' : '#00e5ff';

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
  }, [character.stats.health, character.isAlive]);

  const oripathyBadge = {
    Clean: { label: '비감염 (CLEAN)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    Early: { label: '초기 감염 (STAGE I)', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
    Mid: { label: '중기 침식 (STAGE II)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    Severe: { label: '중증 침식 (STAGE III)', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
    Terminal: { label: '말기 한계 (TERMINAL)', color: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' },
    Crystallized: { label: '결정화 파열 (CRITICAL)', color: 'bg-rose-900 text-rose-200 border-rose-500' },
  }[character.oripathy.stage];

  return (
    <div className="flex flex-col h-screen bg-[#0b0d11] text-slate-100 font-mono select-none overflow-hidden">
      {/* Top Bar Header */}
      <header className="h-12 border-b border-cyan-500/30 bg-[#0f131a] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
            PRTS VITAL SYSTEM // TERRA OS
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            [테라력 {character.year}년 · {character.age}세]
          </span>
        </div>

        {/* Global Action Icons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onSwitchTheme}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all"
            title="고서적 테마로 전환"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">역사서 뷰</span>
          </button>

          {onOpenAchievementBook && (
            <button
              onClick={onOpenAchievementBook}
              className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 transition-all"
              title="테라 업적 도감"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">업적 도감</span>
            </button>
          )}

          <button
            onClick={onOpenHallOfFame}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="지난 생애 추모실"
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">추모실</span>
          </button>

          <button
            onClick={onRestart}
            className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            title="새로운 생애 시작"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Vital & Medical Status Ribbon */}
      <section className="h-16 border-b border-cyan-500/20 bg-[#121620] px-4 py-2 grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0 items-center">
        {/* ECG Canvas */}
        <div className="hidden md:flex items-center space-x-2 col-span-1 bg-black/40 rounded px-2 py-1 border border-cyan-500/20">
          <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
          <canvas ref={canvasRef} width={120} height={32} className="w-full h-8" />
        </div>

        {/* HP Bar */}
        <div className="space-y-1">
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
        <div className="space-y-1">
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

        {/* LMD & Faction */}
        <div className="hidden md:flex items-center space-x-2 text-xs">
          <Coins className="w-4 h-4 text-yellow-400" />
          <div>
            <div className="text-[10px] text-slate-400">보유 자산</div>
            <div className="font-bold text-yellow-300">{character.stats.wealth.toLocaleString()} LMD</div>
          </div>
        </div>

        {/* Oripathy Badge */}
        <div className="text-right">
          <div className="text-[10px] text-slate-400">광석병 병리 지표</div>
          <div className="flex items-center justify-end space-x-1.5 mt-0.5">
            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${oripathyBadge.color}`}>
              {oripathyBadge.label}
            </span>
            <span className="text-xs font-bold text-red-400">
              {character.oripathy.crystallizationRate}%
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Profile & Right Logs */}
      <main className="grow grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Column: Character Sheet (4 cols) */}
        <aside className="md:col-span-4 border-r border-cyan-500/20 bg-[#0e1219] p-4 flex flex-col overflow-y-auto space-y-4">
          {/* Identity Box */}
          <div className="p-3.5 rounded-lg border border-cyan-500/30 bg-slate-900/60 relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                SUBJECT DOSSIER
              </span>
              <span className="text-[10px] text-slate-400">
                {character.gender} · {character.race}
                {character.subRace && ` (${character.subRace})`}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-wider text-slate-100">
              {character.name}
            </h2>
            <div className="text-xs text-slate-300 mt-1">
              소속 국적: <span className="text-amber-400">{character.nation}</span>
            </div>
            <div className="text-xs text-slate-400">
              성장 환경: {character.environment}
            </div>
            <div className="text-xs text-slate-400">
              현재 직업: <span className="text-cyan-300">{character.career}</span>
            </div>

            {/* Titles */}
            {character.titles.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {character.titles.map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats Sheet */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-white/5 pb-1">
              <span>기본 능력치</span>
              <span>수치</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">전투력 (ATK)</span>
              <span className="font-bold text-amber-400">{character.stats.combat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">아츠 적성 (ARTS)</span>
              <span className="font-bold text-cyan-400">
                {character.stats.artsAptitude}
                {character.oripathy.isInfected && (
                  <span className="text-[10px] text-red-400 ml-1">({character.oripathy.activeArtsMultiplier}x)</span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">정세 감각 (INTEL)</span>
              <span className="font-bold text-purple-400">{character.stats.intellect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">행운 (LUCK)</span>
              <span className="font-bold text-emerald-400">{character.stats.luck}</span>
            </div>
          </div>

          {/* Equipment & Inventory */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 text-xs space-y-2">
            <div className="text-[11px] text-slate-400 border-b border-white/5 pb-1 font-bold">
              장착 장비 및 물자
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">무기:</span>
              <span className="text-slate-200">{character.equipment.weapon?.name || '맨손'}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">방어구:</span>
              <span className="text-slate-200">{character.equipment.armor?.name || '일반 평복'}</span>
            </div>
            <div className="pt-1.5 border-t border-white/5">
              <span className="text-[10px] text-slate-400 block mb-1">보유 소모품:</span>
              <div className="flex flex-wrap gap-1">
                {character.inventory.map((slot, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {slot.item.name} x{slot.count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Event Log Stream (8 cols) */}
        <section className="md:col-span-8 flex flex-col h-full overflow-hidden bg-[#0b0d11]">
          <EventLogPanel
            logs={logs}
            currentEvent={currentEvent}
            character={character}
            onSelectChoice={onSelectChoice}
            theme={theme}
          />
        </section>
      </main>

      {/* Bottom Control Deck */}
      <footer className="h-14 border-t border-cyan-500/30 bg-[#0f131a] px-4 flex items-center justify-between shrink-0">
        {/* Action Points Button */}
        <button
          onClick={onOpenActions}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-300 transition-all font-bold text-xs"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>연간 자율 활동</span>
          <span className="px-1.5 py-0.2 bg-cyan-400 text-black text-[10px] rounded font-black">
            {character.actionPoints} AP
          </span>
        </button>

        {/* Time Control Group */}
        <div className="flex items-center space-x-2">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className={`p-2 rounded-lg border transition-all ${
              isPlaying 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30' 
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
            }`}
            title={isPlaying ? '일시정지' : '자동 진행 시작'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Speed Buttons */}
          {([1, 2, 4] as GameSpeed[]).map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2 py-1 rounded text-xs border font-bold transition-all ${
                speed === s
                  ? 'bg-cyan-500 text-black border-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}

          {/* Manual Turn Skip Button */}
          <button
            onClick={onNextYear}
            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold transition-all ml-2"
            title="다음 해로 즉시 넘기기"
          >
            <span>다음 해</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
