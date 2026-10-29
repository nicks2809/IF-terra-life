// src/components/EventLogPanel.tsx
import React, { useRef, useEffect, useState } from 'react';
import { LogEntry, GameEvent, EventChoice, Character, ThemeMode, LogFilter } from '../types';
import { GameEngine } from '../engine/gameEngine';
import { Radio, AlertTriangle, Sparkles, Sword, Dices, ChevronRight, Bot, Play, FastForward, Filter, Lock, Clock } from 'lucide-react';

interface Props {
  logs: LogEntry[];
  currentEvent?: GameEvent;
  character: Character;
  onSelectChoice: (choice: EventChoice) => void;
  autoChoicePendingId?: string | null;
  minorTimeoutRemainingSec?: number | null;
  isPlaying?: boolean;
  onNextYear?: () => void;
  onSkipToNextEvent?: () => void;
  onTogglePlay?: () => void;
  theme: ThemeMode;
}

export const EventLogPanel: React.FC<Props> = ({
  logs,
  currentEvent,
  character,
  onSelectChoice,
  autoChoicePendingId,
  minorTimeoutRemainingSec,
  isPlaying,
  onNextYear,
  onSkipToNextEvent,
  onTogglePlay,
  theme
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<LogFilter>('all');
  const isPrts = theme === 'prts';

  const filteredLogs = logs.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'event') return entry.type === 'critical' || !!entry.rollDetails || entry.title.includes('【판정') || entry.title.includes('【업적') || entry.title.includes('【특수 직군') || entry.title.includes('【직급') || entry.title.includes('【생애 목표');
    if (filter === 'news') return entry.type === 'news';
    if (filter === 'combat') return entry.type === 'battle' || entry.type === 'hazard';
    if (filter === 'oripathy') return entry.type === 'oripathy' || entry.title.includes('광석병') || entry.title.includes('억제제');
    return true;
  });

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, currentEvent, filter]);

  const getLogBadge = (type: LogEntry['type']) => {
    switch (type) {
      case 'news':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Radio className="w-3 h-3" />
            <span>속보</span>
          </span>
        );
      case 'hazard':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>경보</span>
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3 h-3" />
            <span>주요성취</span>
          </span>
        );
      case 'battle':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Sword className="w-3 h-3" />
            <span>전투</span>
          </span>
        );
      case 'oripathy':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            <span>광석병</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getEffectBadgeStyle = (badge: string) => {
    const isNegative = badge.includes('-') && !badge.includes('결정화 -');
    const isOripathyBad = badge.includes('결정화 +') || badge.includes('감염') || badge.includes('확진');
    const isLmd = badge.includes('LMD') || badge.includes('급여') || badge.includes('보수');
    const isSpecial = badge.includes('업적') || badge.includes('직군') || badge.includes('칭호') || badge.includes('목표') || badge.includes('직급');

    if (isSpecial) {
      return isPrts
        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
        : 'bg-purple-900/15 text-purple-900 border-purple-800/30';
    }
    if (isOripathyBad || isNegative) {
      return isPrts
        ? 'bg-red-500/15 text-red-300 border-red-500/30'
        : 'bg-red-900/15 text-red-900 border-red-800/30';
    }
    if (isLmd) {
      return isPrts
        ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
        : 'bg-amber-900/15 text-amber-900 border-amber-800/30';
    }
    return isPrts
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      : 'bg-emerald-900/15 text-emerald-900 border-emerald-800/30';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Filter Bar */}
      <div className={`px-3 sm:px-4 py-2 border-b flex items-center justify-between gap-2 shrink-0 overflow-x-auto ${
        isPrts ? 'bg-[#0e121a] border-cyan-500/20' : 'bg-[#e8dcbe] border-[#5c4033]/30'
      }`}>
        <div className="flex items-center space-x-1.5 text-[11px] shrink-0">
          <Filter className={`w-3.5 h-3.5 ${isPrts ? 'text-cyan-400' : 'text-[#8b1e1e]'}`} />
          <span className="font-bold opacity-75 hidden sm:inline">일지 필터:</span>
        </div>
        <div className="flex items-center space-x-1 shrink-0">
          {[
            { id: 'all', label: `전체 (${logs.length})` },
            { id: 'event', label: '주요 사건·판정' },
            { id: 'news', label: '세계 속보' },
            { id: 'combat', label: '전투·경보' },
            { id: 'oripathy', label: '광석병' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as LogFilter)}
              className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-all ${
                filter === tab.id
                  ? isPrts
                    ? 'bg-cyan-500 text-black shadow'
                    : 'bg-[#8b1e1e] text-white shadow'
                  : isPrts
                    ? 'text-slate-400 hover:text-white bg-slate-900/60'
                    : 'text-[#5c4d47] hover:text-black bg-[#f4ebd0]/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Story Logs */}
      <div
        ref={logContainerRef}
        className="grow overflow-y-auto space-y-2.5 p-3.5 sm:p-4 pr-2 font-mono scroll-smooth"
      >
        {filteredLogs.map((entry) => (
          <div
            key={entry.id}
            className={`p-3.5 rounded-lg border text-xs leading-relaxed transition-all ${
              entry.type === 'hazard'
                ? isPrts ? 'bg-red-950/20 border-red-500/40 text-red-200' : 'bg-red-100 border-red-700 text-red-950'
                : entry.type === 'critical'
                ? isPrts ? 'bg-purple-950/20 border-purple-500/40 text-purple-200' : 'bg-purple-100 border-purple-700 text-purple-950'
                : entry.type === 'news'
                ? isPrts ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' : 'bg-amber-100 border-amber-700 text-amber-950'
                : entry.type === 'battle'
                ? isPrts ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' : 'bg-rose-100 border-rose-700 text-rose-950'
                : isPrts
                ? 'bg-slate-900/40 border-slate-800/80 text-slate-300'
                : 'bg-[#f0e4c6] border-[#5c4033]/25 text-[#1a1412]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className={`text-[10px] font-bold opacity-75 ${isPrts ? 'text-cyan-400' : 'text-[#8b1e1e]'}`}>
                  [{entry.year}년{entry.season ? ` ${entry.season}` : ''} · {entry.age}세]
                </span>
                <span className="font-bold">{entry.title}</span>
              </div>
              {getLogBadge(entry.type)}
            </div>

            <p className="whitespace-pre-line opacity-90">{entry.text}</p>

            {/* Stat / LMD / Effect Delta Badges */}
            {entry.effectBadges && entry.effectBadges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 pt-1.5 border-t border-white/5">
                {entry.effectBadges.map((badge, i) => (
                  <span
                    key={i}
                    className={`text-[10px] px-2 py-0.5 rounded border font-extrabold ${getEffectBadgeStyle(badge)}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {entry.rollDetails && (
              <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] ${
                isPrts ? 'border-white/10 text-cyan-300' : 'border-[#5c4033]/20 text-[#8b1e1e]'
              }`}>
                <span className="flex items-center space-x-1">
                  <Dices className="w-3.5 h-3.5" />
                  <span>
                    판정: {entry.rollDetails.stat.toUpperCase()} | 주사위 {entry.rollDetails.roll} + 보정 = {entry.rollDetails.total} (목표: {entry.rollDetails.dc})
                  </span>
                </span>
                <span className="font-bold underline">
                  결과: {entry.rollDetails.result}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current Active Choice Decision Panel */}
      {currentEvent && character.isAlive && (
        <div className={`shrink-0 p-4 border-t shadow-2xl transition-all ${
          isPrts
            ? 'bg-[#0d1017] border-cyan-500/30 text-slate-100 font-mono'
            : 'bg-[#ebdcb9] border-[#5c4033] text-[#1a1412] font-serif'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className={`text-xs font-bold tracking-widest ${isPrts ? 'text-cyan-400' : 'text-[#8b1e1e]'}`}>
                【운명의 갈림길】 {currentEvent.title}
              </span>
            </div>
            {typeof minorTimeoutRemainingSec === 'number' && minorTimeoutRemainingSec > 0 && (
              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                isPrts
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                  : 'bg-amber-900/15 border-amber-800/40 text-amber-950'
              }`}>
                <Clock className="w-3 h-3" />
                <span>자동 넘김 {minorTimeoutRemainingSec}초</span>
              </span>
            )}
          </div>

          <p className="text-xs mb-3 leading-relaxed opacity-90">
            {currentEvent.description}
          </p>

          {/* Choices Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {currentEvent.choices.map((choice) => {
              const isAutoPending = choice.id === autoChoicePendingId;
              const reqCheck = GameEngine.checkChoiceRequirements(character, choice);
              const isDisabled = !reqCheck.allowed;

              return (
                <button
                  key={choice.id}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && onSelectChoice(choice)}
                  className={`p-3 rounded-lg border text-left transition-all group flex flex-col justify-between relative ${
                    isDisabled
                      ? isPrts
                        ? 'bg-slate-950/60 border-slate-800/70 text-slate-500 cursor-not-allowed opacity-65'
                        : 'bg-[#e3d7ba]/70 border-[#5c4033]/20 text-[#7d6f68] cursor-not-allowed opacity-70'
                      : isAutoPending
                        ? isPrts
                          ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse'
                          : 'bg-[#faecd0] border-[#8b1e1e] ring-2 ring-[#8b1e1e]/40 shadow-[0_0_12px_rgba(139,30,30,0.3)]'
                        : isPrts
                          ? 'bg-slate-900/80 border-slate-700 hover:border-cyan-400 hover:bg-slate-800'
                          : 'bg-[#f4ebd0] border-[#5c4033]/40 hover:border-[#8b1e1e] hover:bg-[#faeed2]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-xs transition-colors flex items-center flex-wrap gap-1.5 ${
                        !isDisabled ? 'group-hover:text-cyan-400' : ''
                      }`}>
                        <span>{choice.label}</span>
                        {isAutoPending && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold flex items-center space-x-1 ${
                            isPrts ? 'bg-cyan-400 text-black' : 'bg-[#8b1e1e] text-white'
                          }`}>
                            <Bot className="w-2.5 h-2.5" />
                            <span>AI 자동 선택</span>
                          </span>
                        )}
                      </span>
                      {isDisabled ? (
                        <Lock className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      ) : (
                        <ChevronRight className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                    <p className="text-[11px] opacity-75 leading-normal mb-2">
                      {choice.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-white/5 text-[10px]">
                    {choice.diceCheck && (
                      <span className={`flex items-center space-x-1 font-bold ${isPrts ? 'text-amber-400' : 'text-[#8b1e1e]'}`}>
                        <Dices className="w-3 h-3" />
                        <span>{choice.diceCheck.stat.toUpperCase()} 판정 (DC {choice.diceCheck.difficulty})</span>
                      </span>
                    )}
                    {isDisabled && reqCheck.reason && (
                      <span className="text-red-400 font-bold">
                        조건 미충족: {reqCheck.reason}
                      </span>
                    )}
                    {!isDisabled && choice.requirements?.lmdCost && (
                      <span className={isPrts ? 'text-yellow-300 font-bold' : 'text-amber-900 font-bold'}>
                        소모: {choice.requirements.lmdCost.toLocaleString()} LMD
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Progress Prompt Banner when Paused */}
      {!currentEvent && character.isAlive && !isPlaying && (
        <div className={`shrink-0 p-3.5 border-t flex flex-wrap items-center justify-between gap-2.5 transition-all ${
          isPrts 
            ? 'bg-[#0d1017]/95 border-cyan-500/30 text-slate-100 shadow-[0_-5px_15px_rgba(0,0,0,0.4)]' 
            : 'bg-[#ebdcb9] border-[#5c4033]/40 text-[#1a1412] shadow-md'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <div>
              <div className="text-xs font-bold flex items-center space-x-1.5">
                <span className="text-amber-400">【일시정지됨】</span>
                <span>테라력 {character.year}년 · {character.age}세</span>
              </div>
              <p className="text-[11px] opacity-70">
                시간이 멈춰 있습니다. 다음 해로 진행하거나 자동진행을 시작하세요.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {onTogglePlay && (
              <button
                onClick={onTogglePlay}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow ${
                  isPrts 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30' 
                    : 'bg-[#2d5a27] hover:bg-[#386d30] text-white'
                }`}
                title="자동 진행 재개 (Space)"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>자동진행 시작</span>
              </button>
            )}

            {onNextYear && (
              <button
                onClick={onNextYear}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border shadow ${
                  isPrts 
                    ? 'bg-slate-800 hover:bg-slate-700 border-cyan-500/50 text-cyan-300' 
                    : 'bg-[#f4ebd0] hover:bg-[#faeed2] border-[#5c4033] text-[#2c1810]'
                }`}
                title="다음 해로 1년 진행 (N)"
              >
                <span>+1년 진행</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onSkipToNextEvent && (
              <button
                onClick={onSkipToNextEvent}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border shadow ${
                  isPrts 
                    ? 'bg-indigo-950/90 hover:bg-indigo-900 border-indigo-500/60 text-indigo-300' 
                    : 'bg-[#c99732] hover:bg-[#dba83f] border-[#5c4033] text-black'
                }`}
                title="다음 사건이나 선택지가 나올 때까지 직행 (S)"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>사건까지 스킵</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
