// src/components/AnnualActionsModal.tsx
import React, { useState } from 'react';
import { Character, ThemeMode } from '../types';
import { ITEMS_DATA } from '../data/items';
import { SPECIAL_CAREERS_DATA } from '../data/careers';
import { GameEngine } from '../engine/gameEngine';
import { 
  Sparkles, 
  Shield, 
  HeartPulse, 
  Coins, 
  Coffee, 
  BookOpen, 
  ShoppingBag, 
  Award, 
  Sword, 
  CheckCircle2, 
  Lock, 
  Package,
  X 
} from 'lucide-react';

interface Props {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionType: 'cultivate_arts' | 'train_combat' | 'take_suppressant' | 'faction_bounty' | 'recreation' | 'study_lore') => void;
  onBuyOrEquipItem: (itemId: string) => void;
  onUseInventoryItem: (itemId: string) => void;
  onPromoteCareer: (careerId: string) => void;
  theme: ThemeMode;
}

export const AnnualActionsModal: React.FC<Props> = ({
  character,
  isOpen,
  onClose,
  onAction,
  onBuyOrEquipItem,
  onUseInventoryItem,
  onPromoteCareer,
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'directives' | 'armory' | 'career'>('directives');
  const [shopFilter, setShopFilter] = useState<'all' | 'weapon' | 'armor' | 'medicine'>('all');

  if (!isOpen) return null;

  const isPrts = theme === 'prts';
  const annualSalary = GameEngine.getCareerAnnualSalary(character);

  const actions = [
    {
      id: 'cultivate_arts' as const,
      title: '오리지늄 아츠 수련',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      cost: 'AP 1 / 이성 -5',
      desc: '아츠 유닛을 튜닝하고 고위 영창 식을 암송하여 아츠 적성(ARTS +4~8)을 수련합니다.',
      disabled: character.actionPoints <= 0 || character.stats.sanity < 5,
    },
    {
      id: 'train_combat' as const,
      title: '전술 백병전 훈련',
      icon: <Shield className="w-5 h-5 text-amber-400" />,
      cost: 'AP 1 / 체력 -5',
      desc: '제식 무기 및 전술 사격을 연마하여 물리 전투력(ATK +4~8)을 단련합니다.',
      disabled: character.actionPoints <= 0 || character.stats.health < 10,
    },
    {
      id: 'study_lore' as const,
      title: '정세 분석 및 학술 자문',
      icon: <BookOpen className="w-5 h-5 text-indigo-400" />,
      cost: 'AP 1 / 자문료 수입',
      desc: '각 이동도시의 외교 동향과 오리지늄 공학을 연구하여 지략(INTEL +4~8)과 자문료(LMD)를 얻습니다.',
      disabled: character.actionPoints <= 0,
    },
    {
      id: 'take_suppressant' as const,
      title: '로도스 억제제 투약',
      icon: <HeartPulse className="w-5 h-5 text-emerald-400" />,
      cost: character.inventory.some(s => s.item.id === 'med_rhodes_suppressant' && s.count > 0)
        ? 'AP 1 / 보유 앰플 1개'
        : 'AP 1 / 800 LMD',
      desc: '체세포 오리지늄 결정화율 진행을 3년간 동결하고 결정화율을 -0.5% 완화합니다.',
      disabled: character.actionPoints <= 0 || (!character.inventory.some(s => s.item.id === 'med_rhodes_suppressant' && s.count > 0) && character.stats.wealth < 800),
    },
    {
      id: 'faction_bounty' as const,
      title: '현상금 및 특수 의뢰',
      icon: <Coins className="w-5 h-5 text-yellow-400" />,
      cost: 'AP 1 / 체력 -10',
      desc: '황야 약탈단 소탕 및 비밀 배송 임무를 수행하여 650~1,200 LMD와 실전 경험을 얻습니다.',
      disabled: character.actionPoints <= 0 || character.stats.health < 15,
    },
    {
      id: 'recreation' as const,
      title: '온천 휴양 및 문화생활',
      icon: <Coffee className="w-5 h-5 text-purple-400" />,
      cost: character.stats.wealth >= 200 ? 'AP 1 / 200 LMD' : 'AP 1 / 무료 휴식',
      desc: '온천욕과 오페라 공연을 감상하며 지친 이성(SAN +30)과 체력(HP +15)을 회복합니다.',
      disabled: character.actionPoints <= 0,
    }
  ];

  const filteredItems = ITEMS_DATA.filter(item => {
    if (shopFilter === 'all') return true;
    if (shopFilter === 'medicine') return item.type === 'medicine' || item.type === 'catalyst';
    return item.type === shopFilter;
  });

  const usableInventory = character.inventory.filter(
    s => s.count > 0 && s.item.effectType && s.item.effectType !== 'boost_arts'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className={`w-full max-w-3xl rounded-xl border shadow-2xl p-4 sm:p-6 flex flex-col max-h-[88vh] transition-all ${
        isPrts 
          ? 'bg-[#0e131d] border-cyan-500/40 text-slate-100 font-mono' 
          : 'bg-[#f4ebd0] border-[#5c4033] text-[#1a1412] font-serif'
      }`}>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isPrts ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-wider">
                {isPrts ? '자율 활동 · 무기고 · 직군 센터' : '자율 일지 · 무기고 · 관직록'}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs mt-0.5">
                <span className={isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}>
                  잔여 행동력: <strong className="text-amber-400">{character.actionPoints} AP</strong>
                </span>
                <span className={isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}>
                  보유 자산: <strong className={isPrts ? 'text-yellow-300' : 'text-amber-800'}>{character.stats.wealth.toLocaleString()} LMD</strong>
                </span>
                <span className={isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}>
                  연간 급여: <strong className="text-emerald-400">+{annualSalary.toLocaleString()} LMD/년</strong>
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 my-3 shrink-0">
          <button
            onClick={() => setActiveTab('directives')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 border transition-all ${
              activeTab === 'directives'
                ? isPrts
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow'
                  : 'bg-[#8b1e1e] text-white border-[#8b1e1e] shadow'
                : isPrts
                  ? 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
                  : 'bg-[#e8dcbe] text-[#5c4d47] border-[#5c4033]/30 hover:text-black'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>훈련 · 자율 지시</span>
          </button>

          <button
            onClick={() => setActiveTab('armory')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 border transition-all ${
              activeTab === 'armory'
                ? isPrts
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow'
                  : 'bg-[#8b1e1e] text-white border-[#8b1e1e] shadow'
                : isPrts
                  ? 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
                  : 'bg-[#e8dcbe] text-[#5c4d47] border-[#5c4033]/30 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>무기고 · 암시장 (16)</span>
          </button>

          <button
            onClick={() => setActiveTab('career')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 border transition-all ${
              activeTab === 'career'
                ? isPrts
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow'
                  : 'bg-[#8b1e1e] text-white border-[#8b1e1e] shadow'
                : isPrts
                  ? 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
                  : 'bg-[#e8dcbe] text-[#5c4d47] border-[#5c4033]/30 hover:text-black'
            }`}
          >
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span>특수 직군 · 전직 (12)</span>
          </button>
        </div>

        {/* Tab 1: Directives & Quick Inventory */}
        {activeTab === 'directives' && (
          <div className="space-y-3 overflow-y-auto pr-1 grow">
            {/* Quick Consumables Bar (No AP required) */}
            {usableInventory.length > 0 && (
              <div className={`p-3 rounded-lg border ${
                isPrts ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-[#e5d6b1] border-[#5c4033]/40'
              }`}>
                <div className="text-xs font-bold mb-2 flex items-center space-x-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>보유 의약품 즉시 복용 (AP 소모 없음)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {usableInventory.map(slot => (
                    <button
                      key={slot.item.id}
                      onClick={() => onUseInventoryItem(slot.item.id)}
                      className={`px-2.5 py-1.5 rounded text-xs font-bold border flex items-center space-x-1.5 transition-all ${
                        isPrts
                          ? 'bg-slate-900 hover:bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : 'bg-[#f4ebd0] hover:bg-white border-[#5c4033] text-[#2c1810]'
                      }`}
                    >
                      <span>{slot.item.name} (x{slot.count})</span>
                      <span className="text-[10px] opacity-80 px-1.5 py-0.2 rounded bg-black/20">즉시 사용</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {actions.map((act) => (
                <div 
                  key={act.id}
                  className={`p-3.5 rounded-lg border flex flex-col justify-between gap-3 transition-all ${
                    isPrts
                      ? 'bg-slate-900/60 border-slate-700/60 hover:border-cyan-500/50'
                      : 'bg-[#e8dcbe]/80 border-[#5c4033]/40 hover:border-[#8b1e1e]'
                  } ${act.disabled ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded bg-black/20 mt-0.5 shrink-0">{act.icon}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="font-bold text-xs sm:text-sm">{act.title}</h3>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isPrts ? 'bg-slate-800 text-amber-300' : 'bg-[#5c4033]/20 text-[#8b1e1e]'
                        }`}>
                          {act.cost}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 leading-relaxed ${isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}`}>
                        {act.desc}
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={act.disabled}
                    onClick={() => onAction(act.id)}
                    className={`w-full py-1.5 rounded text-xs font-bold tracking-wider transition-all ${
                      isPrts
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black disabled:bg-slate-800 disabled:text-slate-500'
                        : 'bg-[#8b1e1e] hover:bg-[#a32828] text-white disabled:bg-stone-400'
                    }`}
                  >
                    {character.actionPoints <= 0 ? '올해 AP 소진됨' : isPrts ? '지시 실행 (1 AP)' : '행동 실행 (1 AP)'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Armory & Black Market */}
        {activeTab === 'armory' && (
          <div className="flex flex-col overflow-hidden grow">
            {/* Current Equipment Banner */}
            <div className={`p-3 rounded-lg border mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs shrink-0 ${
              isPrts ? 'bg-slate-900/90 border-cyan-500/30' : 'bg-[#e8dcbe] border-[#5c4033]/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="opacity-75">장착 주무기:</span>
                <span className="font-bold text-cyan-400">
                  {character.equipment.weapon 
                    ? `${character.equipment.weapon.name} (ATK +${character.equipment.weapon.atkBonus})`
                    : '맨손 (장착 없음)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-75">장착 방어구:</span>
                <span className="font-bold text-emerald-400">
                  {character.equipment.armor
                    ? `${character.equipment.armor.name} (DEF +${character.equipment.armor.defBonus})`
                    : '일반 평복 (장착 없음)'}
                </span>
              </div>
            </div>

            {/* Category Sub-Filters */}
            <div className="flex space-x-1.5 mb-2.5 shrink-0">
              {[
                { id: 'all', label: '전체 품목' },
                { id: 'weapon', label: '전술 무기 (6)' },
                { id: 'armor', label: '방어구 (5)' },
                { id: 'medicine', label: '의약품 · 촉매 (5)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setShopFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    shopFilter === tab.id
                      ? isPrts ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50' : 'bg-[#5c4033] text-white'
                      : isPrts ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-[#e0d3b4] text-[#5c4d47]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Shop Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 overflow-y-auto pr-1 grow">
              {filteredItems.map(item => {
                const isEquipped = character.equipment.weapon?.id === item.id || character.equipment.armor?.id === item.id;
                const invSlot = character.inventory.find(s => s.item.id === item.id);
                const canAfford = character.stats.wealth >= item.price;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border flex flex-col justify-between gap-2 ${
                      isEquipped
                        ? isPrts ? 'bg-cyan-950/40 border-cyan-400' : 'bg-[#f4ebd0] border-2 border-[#8b1e1e]'
                        : isPrts ? 'bg-slate-900/60 border-slate-700/70' : 'bg-[#e8dcbe]/80 border-[#5c4033]/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs sm:text-sm flex items-center space-x-1.5">
                          <Sword className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item.name}</span>
                        </span>
                        <span className="text-xs font-extrabold text-yellow-400 shrink-0">
                          {item.price.toLocaleString()} LMD
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                          ★{item.rarity}
                        </span>
                        {item.atkBonus && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold">
                            ATK +{item.atkBonus}
                          </span>
                        )}
                        {item.defBonus && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">
                            DEF +{item.defBonus}
                          </span>
                        )}
                        {item.artsBonus && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                            ARTS +{item.artsBonus}
                          </span>
                        )}
                        {item.healthBonus && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            최대HP +{item.healthBonus}
                          </span>
                        )}
                        {invSlot && invSlot.count > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                            보유: {invSlot.count}개
                          </span>
                        )}
                      </div>

                      <p className={`text-[11px] mt-1.5 leading-relaxed ${isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}`}>
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        disabled={isEquipped || !canAfford}
                        onClick={() => onBuyOrEquipItem(item.id)}
                        className={`w-full py-1.5 rounded text-xs font-bold transition-all ${
                          isEquipped
                            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                            : isPrts
                              ? 'bg-cyan-500 hover:bg-cyan-400 text-black disabled:bg-slate-800 disabled:text-slate-500'
                              : 'bg-[#8b1e1e] hover:bg-[#a32828] text-white disabled:bg-stone-400'
                        }`}
                      >
                        {isEquipped
                          ? '✓ 현재 장착 중'
                          : !canAfford
                            ? '용문폐(LMD) 부족'
                            : item.type === 'weapon' || item.type === 'armor'
                              ? '구매 및 즉시 장착'
                              : '물자 구매 (+1)'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Special Careers & Promotion Center */}
        {activeTab === 'career' && (
          <div className="flex flex-col overflow-hidden grow">
            <div className={`p-3 rounded-lg border mb-3 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 ${
              isPrts ? 'bg-slate-900/90 border-cyan-500/30' : 'bg-[#e8dcbe] border-[#5c4033]/40'
            }`}>
              <div>
                <span className="opacity-70 block text-[10px]">현재 소속 및 직책</span>
                <span className="font-extrabold text-sm text-amber-400">
                  {character.career} — [{character.careerRank}]
                </span>
              </div>
              <div className="text-right">
                <span className="opacity-70 block text-[10px]">연간 직무 보수</span>
                <span className="font-bold text-emerald-400">+{annualSalary.toLocaleString()} LMD / 년</span>
              </div>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 grow">
              {SPECIAL_CAREERS_DATA.map(sc => {
                const isCurrent = character.specialCareerId === sc.id;
                const check = GameEngine.checkSpecialCareerEligibility(character, sc);

                return (
                  <div
                    key={sc.id}
                    className={`p-3.5 rounded-lg border transition-all ${
                      isCurrent
                        ? isPrts ? 'bg-amber-950/30 border-amber-400' : 'bg-[#f4ebd0] border-2 border-[#8b1e1e]'
                        : check.eligible
                          ? isPrts ? 'bg-cyan-950/30 border-cyan-400/70' : 'bg-[#f4ebd0] border-[#2d5a27]'
                          : isPrts ? 'bg-slate-900/50 border-slate-800 opacity-75' : 'bg-[#e8dcbe]/60 border-[#5c4033]/30 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm">{sc.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            isPrts ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#8b1e1e]/15 text-[#8b1e1e]'
                          }`}>
                            {sc.rank}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${isPrts ? 'text-slate-300' : 'text-[#2c1810]'}`}>
                          {sc.description}
                        </p>
                      </div>

                      <button
                        disabled={isCurrent || !check.eligible}
                        onClick={() => {
                          onPromoteCareer(sc.id);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 flex items-center justify-center space-x-1.5 transition-all ${
                          isCurrent
                            ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50 cursor-default'
                            : check.eligible
                              ? isPrts
                                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg'
                                : 'bg-[#2d5a27] hover:bg-[#386d30] text-white shadow'
                              : isPrts
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-stone-400 text-stone-700 cursor-not-allowed'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>현재 재직 중</span>
                          </>
                        ) : check.eligible ? (
                          <>
                            <Award className="w-3.5 h-3.5" />
                            <span>임관 · 승급 신청</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>자격 미달</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Eligibility Checklist */}
                    {!isCurrent && (
                      <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                        {check.eligible ? (
                          <span className="text-[10px] text-emerald-400 font-bold">
                            ✓ 모든 임관 자격 요건을 충족했습니다! 즉시 전직할 수 있습니다.
                          </span>
                        ) : (
                          check.reasons.map((r, idx) => (
                            <span
                              key={idx}
                              className={`text-[10px] px-2 py-0.5 rounded border ${
                                isPrts
                                  ? 'bg-red-950/30 border-red-500/30 text-red-300'
                                  : 'bg-red-900/10 border-red-800/30 text-red-900'
                              }`}
                            >
                              미충족: {r}
                            </span>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
