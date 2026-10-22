// src/components/HallOfFameModal.tsx
import React, { useState } from 'react';
import { DeathRecord, ThemeMode } from '../types';
import { Award, Skull, X, Search } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  records: DeathRecord[];
  theme: ThemeMode;
}

export const HallOfFameModal: React.FC<Props> = ({ isOpen, onClose, records, theme }) => {
  const [filterRank, setFilterRank] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const isPrts = theme === 'prts';

  if (!isOpen) return null;

  const filtered = records.filter(r => {
    if (filterRank !== 'ALL' && r.finalRank !== filterRank) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        r.characterName.toLowerCase().includes(term) ||
        r.race.toLowerCase().includes(term) ||
        r.nation.toLowerCase().includes(term) ||
        r.cause.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const rankBadgeColors: Record<string, string> = {
    S: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    A: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    B: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    C: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    D: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
    F: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className={`w-full max-w-3xl rounded-xl border shadow-2xl p-6 flex flex-col max-h-[85vh] transition-all ${
        isPrts 
          ? 'bg-[#0e1219] border-cyan-500/40 text-slate-100 font-mono' 
          : 'bg-[#f4ebd0] border-[#5c4033] text-[#1a1412] font-serif'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isPrts ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'}`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wider">
                {isPrts ? '테라 영면자 명예의 전당 (HALL OF FAME)' : '지난 생애 추모실'}
              </h2>
              <p className={`text-xs ${isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}`}>
                지금까지 테라를 살아간 {records.length}명의 기록이 보존되어 있습니다.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
          {/* Rank buttons */}
          <div className="flex items-center space-x-1 text-xs">
            {['ALL', 'S', 'A', 'B', 'C', 'D', 'F'].map(rank => (
              <button
                key={rank}
                onClick={() => setFilterRank(rank)}
                className={`px-2.5 py-1 rounded border transition-all ${
                  filterRank === rank
                    ? isPrts ? 'bg-cyan-500 text-black border-cyan-400 font-bold' : 'bg-[#8b1e1e] text-white border-[#8b1e1e] font-bold'
                    : isPrts ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-[#e8dcbe] border-[#5c4033]/40 text-[#5c4d47]'
                }`}
              >
                {rank}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="이름, 종족, 사망 원인 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`text-xs pl-8 pr-3 py-1.5 rounded-lg border w-56 ${
                isPrts ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-[#e8dcbe] border-[#5c4033] text-black'
              }`}
            />
          </div>
        </div>

        {/* Record List */}
        <div className="overflow-y-auto space-y-3 pr-1 grow">
          {filtered.length === 0 ? (
            <div className="p-12 text-center opacity-60 text-xs">
              <Skull className="w-8 h-8 mx-auto mb-2 opacity-40" />
              보존된 영면 기록이 없습니다.
            </div>
          ) : (
            filtered.map((r, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border transition-all ${
                  isPrts
                    ? 'bg-slate-900/50 border-slate-800 hover:border-cyan-500/40'
                    : 'bg-[#e8dcbe]/70 border-[#5c4033]/30 hover:border-[#8b1e1e]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="font-bold text-sm">{r.characterName}</h3>
                      <span className="text-xs opacity-60">({r.race} · {r.nation})</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${rankBadgeColors[r.finalRank]}`}>
                        RANK {r.finalRank}
                      </span>
                      {r.endingTitle && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                          ✦ {r.endingTitle}
                        </span>
                      )}
                      {r.totalScore !== undefined && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {r.totalScore.toLocaleString()}점
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-red-400/90 mt-1">
                      향년 {r.ageAtDeath}세 (테라력 {r.yearOfDeath}년) - {r.detailedCause}
                    </div>
                  </div>
                </div>

                <div className="text-xs italic opacity-80 mb-2">
                  "{r.lastWords}"
                </div>

                <div className="flex flex-wrap gap-1.5 text-[10px] opacity-75">
                  {r.notableAchievements.map((ach, aIdx) => (
                    <span
                      key={aIdx}
                      className={`px-2 py-0.5 rounded ${
                        isPrts ? 'bg-slate-800 text-slate-300' : 'bg-[#5c4033]/15 text-[#5c4d47]'
                      }`}
                    >
                      {ach}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
