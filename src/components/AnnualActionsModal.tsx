// src/components/AnnualActionsModal.tsx
import React from 'react';
import { Character, ThemeMode } from '../types';
import { Sparkles, Shield, HeartPulse, Coins, Coffee, X } from 'lucide-react';

interface Props {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionType: 'cultivate_arts' | 'train_combat' | 'take_suppressant' | 'faction_bounty' | 'recreation') => void;
  theme: ThemeMode;
}

export const AnnualActionsModal: React.FC<Props> = ({ character, isOpen, onClose, onAction, theme }) => {
  if (!isOpen) return null;

  const isPrts = theme === 'prts';

  const actions = [
    {
      id: 'cultivate_arts' as const,
      title: '오리지늄 아츠 수련',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      cost: 'AP 1 / 이성 -5',
      desc: '아츠 유닛을 튜닝하고 고위 영창 식을 암송하여 아츠 적성(ARTS)을 수련합니다.',
      disabled: character.actionPoints <= 0 || character.stats.sanity < 5,
    },
    {
      id: 'train_combat' as const,
      title: '전술 백병전 훈련',
      icon: <Shield className="w-5 h-5 text-amber-400" />,
      cost: 'AP 1 / 체력 -5',
      desc: '모래주머니를 차고 제식 무기 및 전술 사격을 연마하여 전투력(ATK)을 단련합니다.',
      disabled: character.actionPoints <= 0 || character.stats.health < 10,
    },
    {
      id: 'take_suppressant' as const,
      title: '로도스 억제제 투약',
      icon: <HeartPulse className="w-5 h-5 text-emerald-400" />,
      cost: character.inventory.some(s => s.item.id === 'med_rhodes_suppressant' && s.count > 0) ? 'AP 1 / 소지 앰플 1개 소모' : 'AP 1 / 800 LMD 소모',
      desc: '체세포 오리지늄 결정화율 진행을 3년간 동결하고 혈중 농도를 안정화합니다.',
      disabled: character.actionPoints <= 0 || (!character.inventory.some(s => s.item.id === 'med_rhodes_suppressant' && s.count > 0) && character.stats.wealth < 800),
    },
    {
      id: 'faction_bounty' as const,
      title: '현상금 및 특수 의뢰',
      icon: <Coins className="w-5 h-5 text-yellow-400" />,
      cost: 'AP 1 / 체력 -10',
      desc: '황야 약탈단 소탕 및 비밀 배송 임무를 수행하여 거액의 LMD를 수령합니다.',
      disabled: character.actionPoints <= 0 || character.stats.health < 15,
    },
    {
      id: 'recreation' as const,
      title: '온천 휴양 및 문화생활',
      icon: <Coffee className="w-5 h-5 text-purple-400" />,
      cost: 'AP 1 / 200 LMD',
      desc: '온천욕과 오페라 공연을 감상하며 지친 이성(SAN +30)과 체력을 회복합니다.',
      disabled: character.actionPoints <= 0,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className={`w-full max-w-xl rounded-lg border shadow-2xl p-6 transition-all ${
        isPrts 
          ? 'bg-[#10141d] border-cyan-500/40 text-slate-100 font-mono' 
          : 'bg-[#f4ebd0] border-[#5c4033] text-[#1a1412] font-serif'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded ${isPrts ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wider">
                {isPrts ? '연간 자율 활동 (ANNUAL DIRECTIVES)' : '올해의 자율 일지'}
              </h2>
              <p className={`text-xs ${isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}`}>
                현재 잔여 활동 포인트: <span className="font-bold text-amber-400">{character.actionPoints} AP</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {actions.map((act) => (
            <div 
              key={act.id}
              className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                isPrts
                  ? 'bg-slate-900/60 border-slate-700/60 hover:border-cyan-500/50'
                  : 'bg-[#e8dcbe]/80 border-[#5c4033]/40 hover:border-[#8b1e1e]'
              } ${act.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded bg-black/20 mt-1">{act.icon}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm">{act.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      isPrts ? 'bg-slate-800 text-amber-300' : 'bg-[#5c4033]/20 text-[#8b1e1e]'
                    }`}>
                      {act.cost}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}`}>
                    {act.desc}
                  </p>
                </div>
              </div>
              <button
                disabled={act.disabled}
                onClick={() => {
                  onAction(act.id);
                  onClose();
                }}
                className={`px-4 py-2 rounded text-xs font-bold tracking-wider transition-all whitespace-nowrap self-end md:self-auto ${
                  isPrts
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black disabled:bg-slate-800 disabled:text-slate-500'
                    : 'bg-[#8b1e1e] hover:bg-[#a32828] text-white disabled:bg-stone-400'
                }`}
              >
                {isPrts ? '지시 실행' : '행동하기'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
