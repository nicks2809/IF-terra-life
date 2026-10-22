// src/components/MemorialModal.tsx
import React, { useRef, useEffect } from 'react';
import { DeathRecord, ThemeMode } from '../types';
import { ENDING_RARITY_STYLE } from '../data/endings';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Skull, Download, Copy, RotateCcw, Award, Check, Trophy, Sparkles, Compass } from 'lucide-react';

interface Props {
  record: DeathRecord;
  isOpen: boolean;
  onRestart: () => void;
  onOpenHallOfFame: () => void;
  onOpenAchievementBook?: () => void;
  theme: ThemeMode;
}

export const MemorialModal: React.FC<Props> = ({
  record,
  isOpen,
  onRestart,
  onOpenHallOfFame,
  onOpenAchievementBook,
  theme
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);
  const isPrts = theme === 'prts';

  const endingRarity = record.endingRarity || 'Common';
  const rarityStyle = ENDING_RARITY_STYLE[endingRarity];

  useEffect(() => {
    if (isOpen && (record.finalRank === 'S' || record.finalRank === 'A' || endingRarity === 'Legendary' || endingRarity === 'Unique')) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, record.finalRank, endingRarity]);

  if (!isOpen) return null;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `Terra_Memorial_${record.characterName}_${record.yearOfDeath}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Fallback
    }
  };

  const handleCopyText = () => {
    const text = `[테라의 한 사람으로 태어나 - 영면 기록]
이름: ${record.characterName} (${record.race})
출신: ${record.nation}
생애: 향년 ${record.ageAtDeath}세 (테라력 ${record.yearOfDeath}년 서거)
도달 엔딩: "${record.endingTitle || '황야의 먼지'}" (${record.endingSubtitle || '방랑자'})
최종 종합 점수: ${record.totalScore?.toLocaleString() || 0}점 [${record.finalRank} RANK]
사망 원인: ${record.cause}
유언 / 비문: "${record.lastWords}"
업적:
${record.notableAchievements.map(a => `• ${a}`).join('\n')}
최종 결정화율: ${record.statsSummary.crystallizationRate}%`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rankColors = {
    S: 'from-amber-400 to-yellow-600 text-yellow-300 border-yellow-500 shadow-yellow-500/20',
    A: 'from-purple-400 to-indigo-600 text-purple-300 border-purple-500 shadow-purple-500/20',
    B: 'from-blue-400 to-cyan-600 text-cyan-300 border-cyan-500 shadow-cyan-500/20',
    C: 'from-emerald-400 to-teal-600 text-emerald-300 border-emerald-500',
    D: 'from-slate-400 to-gray-600 text-slate-300 border-slate-500',
    F: 'from-red-600 to-rose-900 text-red-400 border-red-600',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-xl my-auto">
        {/* Memorial Card to capture */}
        <div 
          ref={cardRef}
          className={`rounded-2xl border p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-all ${
            isPrts 
              ? 'bg-[#0c0f16] border-slate-700/60 text-slate-100 font-mono' 
              : 'bg-[#f4ebd0] border-[#8b1e1e] text-[#1a1412] font-serif'
          }`}
        >
          {/* Subtle Top Rarity Ribbon Accent (색상으로만 고급스럽게 희귀도 표기) */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${rarityStyle.ribbon}`}></div>

          {/* PRTS Header Tag */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs">
            <div className="flex items-center space-x-2">
              <Skull className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="font-bold tracking-widest text-red-400">
                {isPrts ? 'PRTS BIOMETRIC FINAL REPORT' : '테라 역사 인명록 영면 기록'}
              </span>
            </div>
            {/* Subtle Rarity Pip Dot & Document ID */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1" title="엔딩 희귀도 징표">
                <span className={`w-2 h-2 rounded-full ${rarityStyle.dot} animate-ping`}></span>
                <span className={`w-2 h-2 rounded-full ${rarityStyle.dot}`}></span>
              </div>
              <span className="opacity-60 text-[10px]">
                DOC #{record.yearOfDeath}-{record.ageAtDeath}
              </span>
            </div>
          </div>

          {/* Character Identity & Final Rank */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-[11px] opacity-70">
                {record.nation} 출신 · {record.race}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider mt-0.5">
                {record.characterName}
              </h1>
              <div className="text-xs text-red-400 mt-1 font-bold">
                향년 {record.ageAtDeath}세 (테라력 {record.yearOfDeath}년 영면)
              </div>
            </div>

            {/* Rank Badge */}
            <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 bg-gradient-to-b shadow-lg shrink-0 ${rankColors[record.finalRank]}`}>
              <Award className="w-4 h-4 mb-0.5" />
              <span className="text-2xl font-black">{record.finalRank}</span>
              <span className="text-[8px] font-extrabold tracking-wider opacity-90">RANK</span>
            </div>
          </div>

          {/* Prominent Authentic Ending Display with Color-Coded Ribbon */}
          {record.endingTitle && (
            <div className={`p-4 rounded-xl border mb-4 relative overflow-hidden shadow-inner ${
              isPrts 
                ? 'bg-slate-900/80 border-slate-700/80' 
                : 'bg-[#ebdcb4] border-[#5c4033]/40'
            }`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${rarityStyle.ribbon}`}></div>
              <div className="pl-2">
                <div className="flex items-center space-x-2">
                  <Compass className={`w-4 h-4 ${rarityStyle.text}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${rarityStyle.text}`}>
                    FINAL CONCLUSION // 도달 엔딩
                  </span>
                </div>
                <h2 className="text-lg font-black tracking-wide mt-0.5">
                  "{record.endingTitle}"
                </h2>
                {record.endingSubtitle && (
                  <p className="text-xs opacity-75 mt-0.5">
                    {record.endingSubtitle}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Cause of Death */}
          <div className={`p-3 rounded-lg border mb-3 text-xs leading-relaxed ${
            isPrts ? 'bg-red-950/20 border-red-500/30 text-red-300' : 'bg-[#e8dcbe] border-red-900/40 text-[#8b1e1e]'
          }`}>
            <span className="font-bold block mb-0.5">【사망 원인】</span>
            {record.detailedCause}
          </div>

          {/* Epitaph / Last Words */}
          <div className={`p-3.5 rounded-lg border mb-4 text-xs italic ${
            isPrts ? 'bg-slate-900/60 border-slate-700/60 text-slate-300' : 'bg-[#e0d3b4] border-[#5c4033]/30 text-[#1a1412]'
          }`}>
            <span className="font-bold block not-italic mb-1 opacity-70">【유언 및 비문 (Epitaph)】</span>
            "{record.lastWords}"
          </div>

          {/* Comprehensive Score Breakdown */}
          {record.scoreBreakdown && (
            <div className={`p-3 rounded-xl border mb-4 text-xs ${
              isPrts ? 'bg-black/40 border-white/10' : 'bg-[#e5d6b1] border-[#5c4033]/30'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>생애 최종 종합 점수 산출</span>
                </span>
                <span className="text-sm font-black text-amber-400">
                  {record.totalScore?.toLocaleString()} PTS
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] opacity-85">
                <div>
                  <span className="opacity-60 block">업적 가산</span>
                  <span className="font-bold text-cyan-400">+{record.scoreBreakdown.achievements}</span>
                </div>
                <div>
                  <span className="opacity-60 block">신체/아츠 역량</span>
                  <span className="font-bold text-emerald-400">+{record.scoreBreakdown.stats}</span>
                </div>
                <div>
                  <span className="opacity-60 block">축적 자산</span>
                  <span className="font-bold text-yellow-400">+{record.scoreBreakdown.wealth}</span>
                </div>
                <div>
                  <span className="opacity-60 block">진영/대인 평판</span>
                  <span className="font-bold text-indigo-400">+{record.scoreBreakdown.reputation}</span>
                </div>
                <div>
                  <span className="opacity-60 block">생애 연수</span>
                  <span className="font-bold text-slate-300">+{record.scoreBreakdown.lifespan}</span>
                </div>
                <div>
                  <span className="opacity-60 block">엔딩 보너스</span>
                  <span className={`font-bold ${rarityStyle.text}`}>+{record.scoreBreakdown.endingBonus}</span>
                </div>
              </div>
            </div>
          )}

          {/* Achievements in Run */}
          {record.unlockedAchievementsInRun && record.unlockedAchievementsInRun.length > 0 && (
            <div className="mb-4">
              <span className="text-[11px] font-bold opacity-70 block mb-1.5">
                【이번 생애 달성 업적 ({record.unlockedAchievementsInRun.length}개)】
              </span>
              <div className="flex flex-wrap gap-1.5">
                {record.unlockedAchievementsInRun.map(id => {
                  const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
                  if (!ach) return null;
                  return (
                    <span 
                      key={id}
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${
                        isPrts ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300' : 'bg-white/60 border-[#5c4033]/30 text-[#8b1e1e]'
                      }`}
                    >
                      🏆 {ach.title}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats Summary Footer */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10 text-center text-[11px]">
            <div>
              <span className="opacity-60 block">전투력</span>
              <span className="font-bold text-amber-400">{record.statsSummary.combat}</span>
            </div>
            <div>
              <span className="opacity-60 block">아츠 적성</span>
              <span className="font-bold text-cyan-400">{record.statsSummary.arts}</span>
            </div>
            <div>
              <span className="opacity-60 block">최종 자산</span>
              <span className="font-bold text-yellow-400">{record.statsSummary.wealth.toLocaleString()} LMD</span>
            </div>
            <div>
              <span className="opacity-60 block">체세포 결정화</span>
              <span className="font-bold text-red-400">{record.statsSummary.crystallizationRate}%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <button
            onClick={handleCopyText}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              copied 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '복사됨!' : '텍스트 복사'}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>카드 PNG 저장</span>
          </button>

          {onOpenAchievementBook && (
            <button
              onClick={onOpenAchievementBook}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-black transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>업적 도감</span>
            </button>
          )}

          <button
            onClick={onOpenHallOfFame}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
          >
            <Award className="w-4 h-4" />
            <span>추모실</span>
          </button>

          <button
            onClick={onRestart}
            className={`flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-bold shadow-lg transition-all ${
              isPrts ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : 'bg-[#8b1e1e] hover:bg-[#a32828] text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>새로운 생애 시작</span>
          </button>
        </div>
      </div>
    </div>
  );
};
