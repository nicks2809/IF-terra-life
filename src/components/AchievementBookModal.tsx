// src/components/AchievementBookModal.tsx
import React, { useState, useMemo } from 'react';
import { ThemeMode, AchievementTier } from '../types';
import { ACHIEVEMENTS_DATA, TIER_COLORS, TIER_SCORES } from '../data/achievements';
import { storage } from '../services/storage';
import { 
  Trophy, 
  X, 
  Lock, 
  CheckCircle2, 
  Search,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const AchievementBookModal: React.FC<Props> = ({
  isOpen,
  onClose,
  theme
}) => {
  const [selectedTier, setSelectedTier] = useState<AchievementTier | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const isPrts = theme === 'prts';

  const unlockedMap = useMemo(() => {
    return storage.loadUnlockedAchievements();
  }, [isOpen]);

  const stats = useMemo(() => {
    let unlocked = 0;
    let points = 0;
    for (const ach of ACHIEVEMENTS_DATA) {
      if (unlockedMap[ach.id]) {
        unlocked++;
        points += ach.points;
      }
    }
    const total = ACHIEVEMENTS_DATA.length;
    const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    return { unlocked, total, points, percent };
  }, [unlockedMap]);

  const filteredAchievements = useMemo(() => {
    return ACHIEVEMENTS_DATA.filter(ach => {
      if (selectedTier !== 'ALL' && ach.tier !== selectedTier) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ach.title.toLowerCase().includes(q);
        const matchDesc = ach.description.toLowerCase().includes(q);
        const matchHint = ach.hint ? ach.hint.toLowerCase().includes(q) : false;
        return matchTitle || matchDesc || matchHint;
      }
      return true;
    });
  }, [selectedTier, searchQuery]);

  if (!isOpen) return null;

  const tiers: Array<{ key: AchievementTier | 'ALL'; label: string; score: number }> = [
    { key: 'ALL', label: '전체 (ALL)', score: 0 },
    { key: 'Legendary', label: '전설 (Legendary)', score: TIER_SCORES.Legendary },
    { key: 'Unique', label: '유니크 (Unique)', score: TIER_SCORES.Unique },
    { key: 'Mystic', label: '미스틱 (Mystic)', score: TIER_SCORES.Mystic },
    { key: 'Rare', label: '레어 (Rare)', score: TIER_SCORES.Rare },
    { key: 'Common', label: '커먼 (Common)', score: TIER_SCORES.Common },
  ];

  const handleCardClick = (achId: string) => {
    setSelectedCardId(prev => prev === achId ? null : achId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div 
        className={`w-full max-w-4xl h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isPrts 
            ? 'bg-[#0a0d14] border-cyan-500/40 text-slate-100 font-mono' 
            : 'bg-[#f4ebd0] border-[#5c4033] text-[#1a1412] font-serif'
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b flex items-center justify-between shrink-0 ${
          isPrts 
            ? 'bg-[#0f1420] border-cyan-500/20' 
            : 'bg-[#d9c79f] border-[#5c4033]/40'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border shadow-md ${
              isPrts 
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400' 
                : 'bg-[#8b1e1e] border-[#5c4033] text-amber-200'
            }`}>
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-wide">
                  {isPrts ? 'PRTS BIOMETRIC CODEX // 업적 도감' : '테라 역사 총서 : 인명 업적 도감'}
                </h2>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isPrts ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'
                }`}>
                  Persistent Archive
                </span>
              </div>
              <p className="text-xs opacity-70 mt-0.5">
                여러 회차를 거치며 테라의 대지에 새긴 위대한 발자취들을 수집하고 보존합니다. (미해금 업적을 누르면 힌트가 표시됩니다)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              isPrts 
                ? 'hover:bg-cyan-500/20 text-slate-400 hover:text-white' 
                : 'hover:bg-black/10 text-[#5c4d47] hover:text-black'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Summary Bar */}
        <div className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs ${
          isPrts ? 'bg-[#0c101a] border-white/5' : 'bg-[#ebdcb4] border-[#5c4033]/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div>
              <span className="opacity-60 block text-[10px]">수집 달성도</span>
              <span className="text-base font-extrabold text-cyan-400">
                {stats.unlocked} <span className="text-xs font-normal opacity-60">/ {stats.total} ({stats.percent}%)</span>
              </span>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div>
              <span className="opacity-60 block text-[10px]">누적 업적 점수</span>
              <span className="text-base font-extrabold text-amber-400">
                {stats.points.toLocaleString()} <span className="text-xs font-normal opacity-60">PTS</span>
              </span>
            </div>
          </div>

          {/* Progress Visual */}
          <div className="flex-1 max-w-xs hidden md:block">
            <div className="h-2 rounded-full overflow-hidden bg-black/40 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-500 transition-all duration-500"
                style={{ width: `${stats.percent}%` }}
              ></div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="업적 이름 또는 힌트 검색..."
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
                isPrts 
                  ? 'bg-black/50 border-cyan-500/30 text-slate-200 focus:border-cyan-400' 
                  : 'bg-white/50 border-[#5c4033]/40 text-[#1a1412] focus:border-[#8b1e1e]'
              }`}
            />
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className={`px-4 sm:px-6 py-2.5 border-b flex items-center space-x-2 overflow-x-auto shrink-0 ${
          isPrts ? 'bg-[#0f1422] border-white/5' : 'bg-[#e4d4a8] border-[#5c4033]/20'
        }`}>
          {tiers.map(t => {
            const isSelected = selectedTier === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setSelectedTier(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? isPrts
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                      : 'bg-[#8b1e1e] text-white shadow-md'
                    : isPrts
                      ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                      : 'bg-[#d9c79f] hover:bg-[#cfb98d] text-[#2c1810]'
                }`}
              >
                <span>{t.label}</span>
                {t.score > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/20 text-current' : 'opacity-60'
                  }`}>
                    +{t.score}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Achievement Grid Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
          {filteredAchievements.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center opacity-60 text-center">
              <Trophy className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">해당 조건에 맞는 업적이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredAchievements.map((ach) => {
                const unlocked = unlockedMap[ach.id];
                const tierStyle = TIER_COLORS[ach.tier];
                const isSelected = selectedCardId === ach.id;

                return (
                  <div
                    key={ach.id}
                    onClick={() => handleCardClick(ach.id)}
                    className={`rounded-xl border p-4 relative overflow-hidden transition-all flex flex-col justify-between cursor-pointer select-none ${
                      unlocked 
                        ? `${tierStyle.bg} ${tierStyle.border} ${isPrts ? 'shadow-lg shadow-black/40 hover:border-cyan-400' : 'shadow-md hover:border-[#8b1e1e]'}` 
                        : isPrts 
                          ? `bg-black/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-cyan-500/50 ${isSelected ? 'border-cyan-400/80 ring-1 ring-cyan-400/30' : 'opacity-75'}` 
                          : `bg-[#ebdcb4]/60 border-[#5c4033]/30 hover:bg-[#e6d3a6] hover:border-[#8b1e1e]/60 ${isSelected ? 'border-[#8b1e1e] ring-1 ring-[#8b1e1e]/40' : 'opacity-80'}`
                    }`}
                  >
                    {/* Top Row: Tier badge & Points */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${tierStyle.badge}`}>
                          {ach.tier.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-bold text-amber-400">
                          +{ach.points} PTS
                        </span>
                      </div>

                      {unlocked ? (
                        <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px]">해금 완료</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-amber-400/90 text-xs font-semibold">
                          <Lock className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{isSelected ? '힌트 표시 중' : '미해금 (클릭 시 힌트)'}</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className={`text-base font-extrabold tracking-wide mb-1 flex items-center space-x-1.5 ${
                        unlocked ? tierStyle.text : 'text-slate-300'
                      }`}>
                        <span>{ach.title}</span>
                      </h3>
                      <p className="text-xs opacity-85 leading-relaxed">
                        {ach.description}
                      </p>

                      {/* Lore Quote (if unlocked) */}
                      {ach.loreQuote && (
                        <div className={`mt-2.5 pt-2 border-t text-[11px] italic leading-relaxed ${
                          unlocked 
                            ? isPrts ? 'border-white/10 text-cyan-200/90' : 'border-black/10 text-[#5c4033]' 
                            : 'border-white/5 opacity-50 blur-[1px]'
                        }`}>
                          {unlocked ? ach.loreQuote : '"기록되지 않은 역사의 조각..."'}
                        </div>
                      )}
                    </div>

                    {/* Subtle Hint Section for unearned achievement */}
                    {!unlocked && (
                      <div className="mt-3 pt-2 border-t border-white/10">
                        {isSelected ? (
                          <div className={`text-xs p-2.5 rounded-lg flex items-start space-x-2 transition-all ${
                            isPrts 
                              ? 'bg-cyan-950/50 border border-cyan-500/30 text-cyan-200' 
                              : 'bg-[#8b1e1e]/10 border border-[#8b1e1e]/30 text-[#8b1e1e]'
                          }`}>
                            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                            <div className="leading-relaxed">
                              <span className="text-[10px] font-bold block uppercase tracking-wider opacity-70">
                                {isPrts ? 'PRTS HINT // 달성 단서' : '테라 사서의 기록 단서'}
                              </span>
                              <span className="text-xs font-medium">
                                {ach.hint || '특수 사건이나 행동을 통해 이 업적의 단서를 발견할 수 있습니다.'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 text-[11px] opacity-60 hover:opacity-100 transition-opacity text-amber-400/90">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>카드를 클릭하여 잠금 해제 힌트 확인</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer: Unlock Record */}
                    {unlocked && (
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] opacity-70">
                        <span>
                          기록자: <span className="font-bold text-cyan-400">{unlocked.characterName}</span>
                        </span>
                        <span>테라력 {unlocked.year}년 달성</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
