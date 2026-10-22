// src/components/MemorialModal.tsx
import React, { useRef, useEffect } from 'react';
import { DeathRecord, ThemeMode } from '../types';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Skull, Download, Copy, RotateCcw, Award, Check } from 'lucide-react';

interface Props {
  record: DeathRecord;
  isOpen: boolean;
  onRestart: () => void;
  onOpenHallOfFame: () => void;
  theme: ThemeMode;
}

export const MemorialModal: React.FC<Props> = ({
  record,
  isOpen,
  onRestart,
  onOpenHallOfFame,
  theme
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);
  const isPrts = theme === 'prts';

  useEffect(() => {
    if (isOpen && (record.finalRank === 'S' || record.finalRank === 'A')) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, record.finalRank]);

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
최종 등급: [${record.finalRank}]
사망 원인: ${record.cause}
유언: "${record.lastWords}"
업적:
${record.notableAchievements.map(a => `• ${a}`).join('\n')}
최종 결정화율: ${record.statsSummary.crystallizationRate}%`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rankColors = {
    S: 'from-amber-400 to-yellow-600 text-yellow-300 border-yellow-500',
    A: 'from-purple-400 to-indigo-600 text-purple-300 border-purple-500',
    B: 'from-blue-400 to-cyan-600 text-cyan-300 border-cyan-500',
    C: 'from-emerald-400 to-teal-600 text-emerald-300 border-emerald-500',
    D: 'from-slate-400 to-gray-600 text-slate-300 border-slate-500',
    F: 'from-red-600 to-rose-900 text-red-400 border-red-600',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl my-8">
        {/* Memorial Card to capture */}
        <div 
          ref={cardRef}
          className={`rounded-xl border p-6 shadow-2xl relative overflow-hidden transition-all ${
            isPrts 
              ? 'bg-[#0c0f15] border-red-500/40 text-slate-100 font-mono' 
              : 'bg-[#f4ebd0] border-[#8b1e1e] text-[#1a1412] font-serif'
          }`}
        >
          {/* PRTS Header Tag */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs">
            <div className="flex items-center space-x-2">
              <Skull className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="font-bold tracking-widest text-red-400">
                {isPrts ? 'PRTS BIOMETRIC FINAL REPORT' : '테라 역사 인명록 영면 기록'}
              </span>
            </div>
            <span className="opacity-60 text-[10px]">
              DOCUMENT_ID: {record.yearOfDeath}-{record.ageAtDeath}
            </span>
          </div>

          {/* Main Info Box */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <div className="text-[11px] opacity-70">
                {record.nation} 출신 · {record.race}
              </div>
              <h1 className="text-2xl font-bold tracking-wider mt-0.5">
                {record.characterName}
              </h1>
              <div className="text-xs text-red-400 mt-1">
                향년 {record.ageAtDeath}세 (테라력 {record.yearOfDeath}년 서거)
              </div>
            </div>

            {/* Rank Badge */}
            <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 bg-gradient-to-b shadow-lg ${rankColors[record.finalRank]}`}>
              <Award className="w-4 h-4 mb-0.5" />
              <span className="text-2xl font-black">{record.finalRank}</span>
              <span className="text-[9px] font-bold opacity-80">RANK</span>
            </div>
          </div>

          {/* Cause of Death */}
          <div className={`p-3.5 rounded-lg border mb-4 text-xs leading-relaxed ${
            isPrts ? 'bg-red-950/20 border-red-500/30 text-red-300' : 'bg-[#e8dcbe] border-red-900/40 text-[#8b1e1e]'
          }`}>
            <span className="font-bold block mb-1">【사망 원인】</span>
            {record.detailedCause}
          </div>

          {/* Epitaph / Last Words */}
          <div className={`p-3.5 rounded-lg border mb-4 text-xs italic ${
            isPrts ? 'bg-slate-900/60 border-slate-700/60 text-slate-300' : 'bg-[#e0d3b4] border-[#5c4033]/30 text-[#1a1412]'
          }`}>
            <span className="font-bold block not-italic mb-1 opacity-70">【유언 (Epitaph)】</span>
            "{record.lastWords}"
          </div>

          {/* Achievements */}
          <div className="space-y-1.5 mb-5 text-xs">
            <span className="font-bold opacity-70 block mb-1">【주요 행적 및 업적】</span>
            {record.notableAchievements.map((ach, idx) => (
              <div key={idx} className="flex items-center space-x-2 opacity-85">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                <span>{ach}</span>
              </div>
            ))}
          </div>

          {/* Stats Footer */}
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
            <span>추모 카드 PNG 저장</span>
          </button>

          <button
            onClick={onOpenHallOfFame}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
          >
            <Award className="w-4 h-4" />
            <span>추모실 둘러보기</span>
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
