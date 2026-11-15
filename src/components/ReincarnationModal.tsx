// src/components/ReincarnationModal.tsx
import React, { useState, useMemo } from 'react';
import { EnvironmentType, Gender, NationThemeId, ReincarnationConfig, ThemeMode } from '../types';
import { RACES_DATA } from '../data/races';
import { NATIONS_DATA } from '../data/nations';
import { REINCARNATION_PERKS } from '../data/perks';
import { LIFE_GOALS } from '../data/traits';
import { GameEngine } from '../engine/gameEngine';
import { storage } from '../services/storage';
import { NationInsignia } from './NationInsignia';
import { getNationVisualIdentity } from '../utils/themeResolver';
import { Sparkles, Dices, Trophy, Lock, CheckCircle2, RotateCcw, X, Target, Key, ChevronDown } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartReincarnation: (config?: ReincarnationConfig) => void;
  theme: ThemeMode;
  isAlive?: boolean;
}

export const ReincarnationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onStartReincarnation,
  theme,
  isAlive = false
}) => {
  const [name, setName] = useState<string>(() => GameEngine.getRandomName());
  const [gender, setGender] = useState<Gender>('남성');
  const [raceId, setRaceId] = useState<string>('random');
  const [nationId, setNationId] = useState<string>('random');
  const [environment, setEnvironment] = useState<string>('random');
  const [goalId, setGoalId] = useState<string>('random');
  const [customSeed, setCustomSeed] = useState<string>('');
  const [selectedPerks, setSelectedPerks] = useState<string[]>(['perk_merchant_heir']);
  const [openDropdown, setOpenDropdown] = useState<'race' | 'nation' | 'env' | 'goal' | null>(null);

  const achStats = useMemo(() => storage.getAchievementCollectionStats(), [isOpen]);
  const totalPoints = achStats.totalPoints;
  const canPickAncient = totalPoints >= 450 || selectedPerks.includes('perk_ancient_sovereign');

  if (!isOpen) return null;

  const isPrts = theme === 'prts';

  const selectedRaceObj = RACES_DATA.find(r => r.id === raceId);
  const selectedNationObj = NATIONS_DATA.find(n => n.id === nationId);
  const selectedGoalObj = LIFE_GOALS.find(g => g.id === goalId);

  const togglePerk = (perkId: string, reqPoints: number) => {
    if (totalPoints < reqPoints) return;
    setSelectedPerks(prev => {
      if (prev.includes(perkId)) {
        return prev.filter(p => p !== perkId);
      }
      if (prev.length >= 2) {
        return [prev[1], perkId];
      }
      return [...prev, perkId];
    });
  };

  const handleCustomStart = () => {
    if (isAlive) {
      const confirmed = window.confirm("진행 중인 생애가 종료됩니다. 계속하시겠습니까?");
      if (!confirmed) return;
    }
    const config: ReincarnationConfig = {
      name: name.trim() || GameEngine.getRandomName(),
      gender,
      raceId: raceId === 'random' ? undefined : raceId,
      nationId: nationId === 'random' ? undefined : nationId,
      environment: environment === 'random' ? undefined : (environment as EnvironmentType),
      goalId: goalId === 'random' ? undefined : goalId,
      seed: customSeed.trim() || undefined,
      useFixedSeed: !!customSeed.trim(),
      perkIds: selectedPerks
    };
    onStartReincarnation(config);
    onClose();
  };

  const handleInstantRandom = () => {
    if (isAlive) {
      const confirmed = window.confirm("진행 중인 생애가 종료됩니다. 계속하시겠습니까?");
      if (!confirmed) return;
    }
    onStartReincarnation({ perkIds: selectedPerks });
    onClose();
  };

  const environments: EnvironmentType[] = [
    '이동도시 상류층',
    '일반 거주구',
    '슬럼가 및 암시장',
    '황야의 노마드 캠프',
    '이동기지 (로도스/블랙스틸)'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className={`w-full max-w-2xl rounded-xl border shadow-2xl p-4 sm:p-6 flex flex-col max-h-[90vh] transition-all ${
        isPrts
          ? 'bg-[#0e131d] border-cyan-500/40 text-slate-100 font-mono'
          : 'bg-[#f4ebd0] border-[#5c4033] text-[#1a1412] font-serif'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg ${isPrts ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-wider">
                {isPrts ? '새로운 생애 및 운명 설계 (REINCARNATION)' : '윤회의 서 · 새로운 생애 설계'}
              </h2>
              <div className="flex items-center space-x-2 text-xs mt-0.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>누적 업적 유산 포인트: <strong className="text-amber-400">{totalPoints.toLocaleString()} PTS</strong></span>
                <span className="opacity-60">(특전 최대 2개 장착 가능)</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Character Survival Warning Banner */}
        {isAlive && (
          <div className="p-2.5 rounded-lg border border-amber-500/50 bg-amber-950/40 text-amber-300 text-xs font-bold mb-3 flex items-center space-x-2 shrink-0">
            <span>⚠️ 주의: 현재 진행 중인 생애가 생존 상태입니다. 환생 진행 시 진행 중인 생애가 종료됩니다.</span>
          </div>
        )}

        {/* Instant Random Rebirth Banner */}
        <div className={`p-3 rounded-lg border mb-4 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 ${
          isPrts ? 'bg-cyan-950/30 border-cyan-500/40' : 'bg-[#e8dcbe] border-[#8b1e1e]/40'
        }`}>
          <div className="text-xs">
            <span className="font-bold block">운명에 모든 것을 맡기시겠습니까?</span>
            <span className="opacity-75 text-[11px]">선택한 환생 특전({selectedPerks.length}개)만 유지한 채 무작위 종족·국가로 즉시 태어납니다.</span>
          </div>
          <button
            onClick={handleInstantRandom}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center space-x-1.5 shrink-0 shadow transition-all ${
              isPrts ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-[#2d5a27] hover:bg-[#386d30] text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>즉시 무작위 환생</span>
          </button>
        </div>

        {/* Custom Destiny Form */}
        <div className="space-y-4 overflow-y-auto pr-1 grow">
          {/* Row 1: Name & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1 opacity-80">이름 지정</label>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={14}
                  placeholder="이름 입력..."
                  className={`w-full px-3 py-1.5 rounded-lg border text-xs font-bold ${
                    isPrts ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white/80 border-[#5c4033] text-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setName(GameEngine.getRandomName(Math.random, nationId === 'random' ? undefined : nationId, gender))}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold shrink-0 flex items-center space-x-1 ${
                    isPrts ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-cyan-300' : 'bg-[#e8dcbe] border-[#5c4033] text-[#2c1810]'
                  }`}
                  title="무작위 이름 생성"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>랜덤</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1 opacity-80">성별</label>
              <div className="grid grid-cols-2 gap-2">
                {(['남성', '여성'] as Gender[]).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      gender === g
                        ? isPrts ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-[#8b1e1e] text-white border-[#8b1e1e]'
                        : isPrts ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-[#e8dcbe] border-[#5c4033]/40 text-[#5c4d47]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Race & Nation & Environment (전용 커스텀 선택기) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 종족 선택 */}
            <div className="relative">
              <label className="text-xs font-bold block mb-1 opacity-80">종족 선택</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'race' ? null : 'race')}
                className={`w-full px-3 py-2 rounded-lg border text-xs font-bold flex items-center justify-between transition-all ${
                  isPrts
                    ? 'bg-slate-900 border-slate-700 hover:border-cyan-500/60 text-white'
                    : 'bg-white/80 border-[#5c4033] text-black'
                }`}
              >
                <span className="truncate">
                  {selectedRaceObj ? `${selectedRaceObj.name} (~${selectedRaceObj.lifespan.baseLifespan}세)` : '🎲 무작위 종족'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0 ml-1" />
              </button>
              {openDropdown === 'race' && (
                <div className={`mt-1.5 p-2 rounded-lg border max-h-48 overflow-y-auto space-y-1 shadow-xl ${
                  isPrts ? 'bg-[#090d14] border-cyan-500/40' : 'bg-[#f8f1de] border-[#5c4033]'
                }`}>
                  <button
                    type="button"
                    onClick={() => { setRaceId('random'); setOpenDropdown(null); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-bold ${
                      raceId === 'random'
                        ? isPrts ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    🎲 무작위 종족
                  </button>
                  {RACES_DATA.map(r => {
                    const isAncient = r.id === 'draco' || r.id === 'aslan';
                    const locked = isAncient && !canPickAncient;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        disabled={locked}
                        onClick={() => { setRaceId(r.id); setOpenDropdown(null); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between ${
                          locked
                            ? 'opacity-40 cursor-not-allowed'
                            : raceId === r.id
                              ? isPrts ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'bg-[#8b1e1e]/20 text-[#8b1e1e] font-bold'
                              : 'hover:bg-white/5'
                        }`}
                      >
                        <span>{r.name}</span>
                        <span className="text-[10px] opacity-75">
                          {isAncient ? (locked ? '🔒 450P' : '👑 고대종') : `~${r.lifespan.baseLifespan}세`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 출신 국가 */}
            <div className="relative">
              <label className="text-xs font-bold block mb-1 opacity-80">출신 국가</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'nation' ? null : 'nation')}
                className={`w-full px-3 py-2 rounded-lg border text-xs font-bold flex items-center justify-between transition-all ${
                  isPrts
                    ? 'bg-slate-900 border-slate-700 hover:border-cyan-500/60 text-white'
                    : 'bg-white/80 border-[#5c4033] text-black'
                }`}
              >
                <span className="flex items-center space-x-1.5 truncate">
                  {selectedNationObj ? (
                    <>
                      <NationInsignia nationId={selectedNationObj.id} size="sm" />
                      <span>{selectedNationObj.name} ({selectedNationObj.riskLevel})</span>
                    </>
                  ) : (
                    <span>🎲 무작위 국가</span>
                  )}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0 ml-1" />
              </button>
              {openDropdown === 'nation' && (
                <div className={`mt-1.5 p-2 rounded-lg border max-h-48 overflow-y-auto space-y-1 shadow-xl ${
                  isPrts ? 'bg-[#090d14] border-cyan-500/40' : 'bg-[#f8f1de] border-[#5c4033]'
                }`}>
                  <button
                    type="button"
                    onClick={() => { setNationId('random'); setOpenDropdown(null); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-bold ${
                      nationId === 'random'
                        ? isPrts ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    🎲 무작위 국가 (인구 가중치)
                  </button>
                  {NATIONS_DATA.map(n => {
                    const nTheme = getNationVisualIdentity(n.id as NationThemeId);
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => { setNationId(n.id); setOpenDropdown(null); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between gap-2 ${
                          nationId === n.id
                            ? isPrts ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'bg-[#8b1e1e]/20 text-[#8b1e1e] font-bold'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center space-x-1.5 min-w-0 truncate">
                          <NationInsignia nationId={n.id} size="sm" style={isPrts ? { color: nTheme.colors.primary } : undefined} />
                          <span className="truncate">{n.name}</span>
                          {nTheme.eventRefs && nTheme.eventRefs[0] && (
                            <span className="text-[10px] opacity-65 truncate hidden sm:inline">
                              · {nTheme.eventRefs[0]}
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] opacity-75 shrink-0">{n.riskLevel}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 성장 환경 */}
            <div className="relative">
              <label className="text-xs font-bold block mb-1 opacity-80">성장 환경</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'env' ? null : 'env')}
                className={`w-full px-3 py-2 rounded-lg border text-xs font-bold flex items-center justify-between transition-all ${
                  isPrts
                    ? 'bg-slate-900 border-slate-700 hover:border-cyan-500/60 text-white'
                    : 'bg-white/80 border-[#5c4033] text-black'
                }`}
              >
                <span className="truncate">{environment === 'random' ? '🎲 무작위 환경' : environment}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0 ml-1" />
              </button>
              {openDropdown === 'env' && (
                <div className={`mt-1.5 p-2 rounded-lg border max-h-48 overflow-y-auto space-y-1 shadow-xl ${
                  isPrts ? 'bg-[#090d14] border-cyan-500/40' : 'bg-[#f8f1de] border-[#5c4033]'
                }`}>
                  <button
                    type="button"
                    onClick={() => { setEnvironment('random'); setOpenDropdown(null); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-bold ${
                      environment === 'random'
                        ? isPrts ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    🎲 무작위 환경
                  </button>
                  {environments.map(env => (
                    <button
                      key={env}
                      type="button"
                      onClick={() => { setEnvironment(env); setOpenDropdown(null); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs ${
                        environment === env
                          ? isPrts ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'bg-[#8b1e1e]/20 text-[#8b1e1e] font-bold'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2.5: Life Goal & Destiny Seed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <label className="text-xs font-bold mb-1 opacity-80 flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>생애 목표 지정 (S등급 핵심 가산점)</span>
              </label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'goal' ? null : 'goal')}
                className={`w-full px-3 py-2 rounded-lg border text-xs font-bold flex items-center justify-between transition-all ${
                  isPrts
                    ? 'bg-slate-900 border-slate-700 hover:border-cyan-500/60 text-white'
                    : 'bg-white/80 border-[#5c4033] text-black'
                }`}
              >
                <span className="truncate">
                  {selectedGoalObj ? `${selectedGoalObj.title} (+${selectedGoalObj.bonusPoints}점)` : '🎲 무작위 생애 서원'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0 ml-1" />
              </button>
              {openDropdown === 'goal' && (
                <div className={`mt-1.5 p-2 rounded-lg border max-h-48 overflow-y-auto space-y-1 shadow-xl ${
                  isPrts ? 'bg-[#090d14] border-cyan-500/40' : 'bg-[#f8f1de] border-[#5c4033]'
                }`}>
                  <button
                    type="button"
                    onClick={() => { setGoalId('random'); setOpenDropdown(null); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-bold ${
                      goalId === 'random'
                        ? isPrts ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    🎲 무작위 생애 서원
                  </button>
                  {LIFE_GOALS.map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => { setGoalId(g.id); setOpenDropdown(null); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs ${
                        goalId === g.id
                          ? isPrts ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'bg-[#8b1e1e]/20 text-[#8b1e1e] font-bold'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{g.title}</span>
                        <span className="text-[10px] text-amber-400">+{g.bonusPoints}점</span>
                      </div>
                      <p className="text-[10px] opacity-70 truncate mt-0.5">{g.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold mb-1 opacity-80 flex items-center space-x-1">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>운명 시드 코드 (선택 사항)</span>
              </label>
              <input
                type="text"
                value={customSeed}
                onChange={(e) => setCustomSeed(e.target.value.toUpperCase())}
                placeholder="예: TR-A8K2-9XZP (비워두면 무작위)"
                maxLength={20}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono uppercase ${
                  isPrts ? 'bg-slate-900 border-slate-700 text-cyan-300 placeholder-slate-600' : 'bg-white/80 border-[#5c4033] text-[#2c1810] placeholder-[#8c7b74]'
                }`}
              />
            </div>
          </div>

          {/* Row 3: Reincarnation Perks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                환생 유산 특전 선택 (최대 2개 장착 · 현재 {selectedPerks.length}/2)
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REINCARNATION_PERKS.map(perk => {
                const unlocked = totalPoints >= perk.reqPoints;
                const active = selectedPerks.includes(perk.id);
                return (
                  <button
                    key={perk.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => togglePerk(perk.id, perk.reqPoints)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      active
                        ? isPrts
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                          : 'bg-[#ebdcb9] border-2 border-[#8b1e1e]'
                        : unlocked
                          ? isPrts
                            ? 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
                            : 'bg-[#e8dcbe]/70 border-[#5c4033]/30'
                          : 'opacity-45 cursor-not-allowed bg-black/20 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs flex items-center space-x-1">
                        {active ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        ) : !unlocked ? (
                          <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        ) : null}
                        <span>{perk.name}</span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                        unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-red-950/60 text-red-300'
                      }`}>
                        {unlocked ? perk.badge : `${perk.reqPoints} PTS 필요`}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}`}>
                      {perk.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-xs font-bold border ${
              isPrts ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-[#5c4033] text-[#5c4d47]'
            }`}
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleCustomStart}
            className={`px-6 py-2.5 rounded-lg text-xs font-extrabold tracking-wider flex items-center space-x-2 shadow-lg transition-all ${
              isPrts ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : 'bg-[#8b1e1e] hover:bg-[#a32828] text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>설계한 운명으로 환생 시작</span>
          </button>
        </div>
      </div>
    </div>
  );
};
