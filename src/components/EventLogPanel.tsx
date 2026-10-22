// src/components/EventLogPanel.tsx
import React, { useRef, useEffect } from 'react';
import { LogEntry, GameEvent, EventChoice, Character, ThemeMode } from '../types';
import { Radio, AlertTriangle, Sparkles, Sword, Dices, ChevronRight } from 'lucide-react';

interface Props {
  logs: LogEntry[];
  currentEvent?: GameEvent;
  character: Character;
  onSelectChoice: (choice: EventChoice) => void;
  theme: ThemeMode;
}

export const EventLogPanel: React.FC<Props> = ({
  logs,
  currentEvent,
  character,
  onSelectChoice,
  theme
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const isPrts = theme === 'prts';

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, currentEvent]);

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
            <span>대성공</span>
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable Story Logs */}
      <div 
        ref={logContainerRef}
        className="grow overflow-y-auto space-y-3 p-4 pr-2 font-mono scroll-smooth"
      >
        {logs.map((entry) => (
          <div
            key={entry.id}
            className={`p-3.5 rounded-lg border text-xs leading-relaxed transition-all ${
              entry.type === 'hazard'
                ? isPrts ? 'bg-red-950/20 border-red-500/40 text-red-200' : 'bg-red-100 border-red-700 text-red-950'
                : entry.type === 'critical'
                ? isPrts ? 'bg-purple-950/20 border-purple-500/40 text-purple-200' : 'bg-purple-100 border-purple-700 text-purple-950'
                : entry.type === 'news'
                ? isPrts ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' : 'bg-amber-100 border-amber-700 text-amber-950'
                : isPrts 
                ? 'bg-slate-900/40 border-slate-800/80 text-slate-300' 
                : 'bg-[#f0e4c6] border-[#5c4033]/25 text-[#1a1412]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold opacity-70 ${isPrts ? 'text-cyan-400' : 'text-[#8b1e1e]'}`}>
                  [{entry.year}년 · {entry.age}세]
                </span>
                <span className="font-bold">{entry.title}</span>
              </div>
              {getLogBadge(entry.type)}
            </div>

            <p className="whitespace-pre-line opacity-90">{entry.text}</p>

            {entry.rollDetails && (
              <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] ${
                isPrts ? 'border-white/10 text-cyan-300' : 'border-[#5c4033]/20 text-[#8b1e1e]'
              }`}>
                <span className="flex items-center space-x-1">
                  <Dices className="w-3.5 h-3.5" />
                  <span>
                    판정: {entry.rollDetails.stat} | 주사위 {entry.rollDetails.roll} + 보정 = {entry.rollDetails.total} (목표: {entry.rollDetails.dc})
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
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className={`text-xs font-bold tracking-widest ${isPrts ? 'text-cyan-400' : 'text-[#8b1e1e]'}`}>
              【운명의 갈림길】 {currentEvent.title}
            </span>
          </div>

          <p className="text-xs mb-3 leading-relaxed opacity-90">
            {currentEvent.description}
          </p>

          {/* Choices Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {currentEvent.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => onSelectChoice(choice)}
                className={`p-3 rounded-lg border text-left transition-all group flex flex-col justify-between ${
                  isPrts
                    ? 'bg-slate-900/80 border-slate-700 hover:border-cyan-400 hover:bg-slate-800'
                    : 'bg-[#f4ebd0] border-[#5c4033]/40 hover:border-[#8b1e1e] hover:bg-[#faeed2]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs group-hover:text-cyan-400 transition-colors">
                      {choice.label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] opacity-70 leading-normal mb-2">
                    {choice.description}
                  </p>
                </div>

                {choice.diceCheck && (
                  <div className="flex items-center space-x-1.5 text-[10px] text-amber-400 pt-1.5 border-t border-white/5">
                    <Dices className="w-3 h-3" />
                    <span>
                      {choice.diceCheck.stat.toUpperCase()} 판정 (난이도: {choice.diceCheck.difficulty})
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
