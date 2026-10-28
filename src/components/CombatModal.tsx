// src/components/CombatModal.tsx
import React, { useState } from 'react';
import { Character, BattleState, ThemeMode } from '../types';
import { Sword, Sparkles, Shield, HeartPulse, LogOut, Skull, Trophy, Flame } from 'lucide-react';

interface Props {
  character: Character;
  battle: BattleState;
  isOpen: boolean;
  onExecuteCommand: (command: 'attack' | 'arts' | 'defend' | 'item' | 'flee', itemId?: string) => void;
  onClose: () => void;
  theme: ThemeMode;
}

export const CombatModal: React.FC<Props> = ({
  character,
  battle,
  isOpen,
  onExecuteCommand,
  onClose,
  theme
}) => {
  const [selectedItem, setSelectedItem] = useState<string>('');

  if (!isOpen) return null;

  const isPrts = theme === 'prts';
  const enemy = battle.enemy;

  const enemyHpPercent = Math.max(0, Math.min(100, Math.round((enemy.hp / enemy.maxHp) * 100)));
  const playerHpPercent = Math.max(0, Math.min(100, Math.round((character.stats.health / character.stats.maxHealth) * 100)));
  const playerSanPercent = Math.max(0, Math.min(100, Math.round((character.stats.sanity / character.stats.maxSanity) * 100)));

  const consumableItems = character.inventory.filter(s => 
    s.count > 0 && (s.item.effectType === 'heal_hp' || s.item.effectType === 'heal_san' || s.item.effectType === 'boost_arts')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className={`w-full max-w-2xl rounded-xl border shadow-2xl p-5 sm:p-6 transition-all ${
        isPrts 
          ? 'bg-[#0f131a] border-red-500/50 text-slate-100 font-mono' 
          : 'bg-[#f4ebd0] border-[#8b1e1e] text-[#1a1412] font-serif'
      }`}>
        {/* Battle Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <span className="animate-pulse w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <h2 className="text-base font-bold tracking-widest text-red-400">
              {isPrts ? '전술 교전 상태 (TACTICAL ENGAGEMENT)' : '결전의 순간'}
            </h2>
          </div>
          <div className={`text-xs px-2.5 py-1 rounded font-bold ${isPrts ? 'bg-slate-800 text-slate-300' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'}`}>
            턴 {battle.turn} {battle.turn % 3 === 2 && !battle.result ? '· ⚠️ 다음 턴 적 필살기 예고' : ''}
          </div>
        </div>

        {/* Combatants HUD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Enemy Card */}
          <div className={`p-4 rounded-lg border ${
            isPrts ? 'bg-red-950/20 border-red-500/30' : 'bg-[#e8dcbe] border-red-900/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-sm text-red-400">{enemy.name}</h3>
                <span className="text-[10px] text-slate-400">{enemy.faction}</span>
              </div>
              <div className="text-right text-xs">
                <span className="text-red-300 font-bold">{enemy.hp} / {enemy.maxHp} HP</span>
                {battle.enemyShield > 0 && (
                  <span className="text-purple-300 text-[10px] block">주술 실드 +{battle.enemyShield}</span>
                )}
              </div>
            </div>

            {/* Enemy HP Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-red-900/50 mb-2">
              <div 
                className="bg-gradient-to-r from-red-600 to-rose-400 h-full transition-all duration-300"
                style={{ width: `${enemyHpPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>공격: {enemy.atk}</span>
              <span>방어: {enemy.def}</span>
              <span>마저: {enemy.artsRes}%</span>
            </div>
            <div className="text-[10px] text-amber-400/90 mt-1.5">
              <span className="font-bold">특수기 [{enemy.specialSkillName}]:</span> {enemy.specialSkillDesc}
            </div>
          </div>

          {/* Player Card */}
          <div className={`p-4 rounded-lg border ${
            isPrts ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-[#e8dcbe] border-cyan-900/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-sm text-cyan-400">{character.name} ({character.race})</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-amber-400 font-bold">
                    {character.oripathy.isInfected 
                      ? `광석병 증폭: ${character.oripathy.activeArtsMultiplier}x` 
                      : '비감염 (표준 아츠)'}
                  </span>
                  {battle.catalystActive && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-600 text-white font-bold animate-pulse flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" /> 촉매 3x 폭주
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="text-emerald-400 font-bold">{character.stats.health}/{character.stats.maxHealth} HP</span>
                {battle.playerShield > 0 && (
                  <span className="text-cyan-300 text-[10px] block">방어 실드 +{battle.playerShield}</span>
                )}
              </div>
            </div>

            {/* HP Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-emerald-900/50 mb-1.5">
              <div 
                className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full transition-all duration-300"
                style={{ width: `${playerHpPercent}%` }}
              ></div>
            </div>

            {/* SAN Bar */}
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-blue-900/50 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-300"
                style={{ width: `${playerSanPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>전투: {character.stats.combat}{character.equipment.weapon ? `(+${character.equipment.weapon.atkBonus})` : ''}</span>
              <span>방어: {Math.max(0, (character.equipment.armor?.defBonus || 0) - (battle.armorBreak || 0))}</span>
              <span>아츠: {character.stats.artsAptitude}</span>
              <span>이성: {character.stats.sanity}</span>
            </div>
          </div>
        </div>

        {/* Combat Log */}
        <div className={`p-3 rounded-lg border max-h-36 overflow-y-auto mb-4 text-xs space-y-1 ${
          isPrts ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-[#e0d3b4] border-[#5c4033]/30 text-[#1a1412]'
        }`}>
          {battle.log.map((entry, idx) => (
            <div key={idx} className={idx === 0 ? 'font-bold text-amber-300' : 'opacity-80'}>
              {entry}
            </div>
          ))}
        </div>

        {/* Result Overlay or Command Deck */}
        {battle.result ? (
          <div className={`p-4 rounded-lg border text-center space-y-3 ${
            isPrts ? 'bg-black/60 border-cyan-500/40' : 'bg-[#e8dcbe] border-[#8b1e1e]'
          }`}>
            {battle.result === 'victory' && (
              <div className="space-y-1">
                <div className="text-emerald-400 flex items-center justify-center space-x-2">
                  <Trophy className="w-6 h-6" />
                  <span className="text-lg font-extrabold">교전 승리! 적 제압 완료</span>
                </div>
                <p className="text-xs text-amber-300 font-bold">
                  전리품 획득: +{enemy.rewardLmd.toLocaleString()} LMD · 실전 능력치 +5 상승
                </p>
              </div>
            )}
            {battle.result === 'defeat' && (
              <div className="text-red-500 flex items-center justify-center space-x-2">
                <Skull className="w-6 h-6" />
                <span className="text-lg font-extrabold">치명상으로 인한 전사...</span>
              </div>
            )}
            {battle.result === 'fled' && (
              <div className="text-amber-400 flex items-center justify-center space-x-2">
                <LogOut className="w-6 h-6" />
                <span className="text-lg font-extrabold">전선 이탈 성공</span>
              </div>
            )}
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                isPrts ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : 'bg-[#8b1e1e] hover:bg-[#a32828] text-white'
              }`}
            >
              {isPrts ? '전투 결과 확인 및 복귀' : '상황 종료'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => onExecuteCommand('attack')}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-lg bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs transition-all"
              >
                <Sword className="w-4 h-4" />
                <span>물리 공격</span>
              </button>

              <button
                onClick={() => onExecuteCommand('arts')}
                disabled={character.stats.sanity < 8}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 text-white font-bold text-xs transition-all disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4" />
                <span>오리지늄 아츠 (-8 SAN)</span>
              </button>

              <button
                onClick={() => onExecuteCommand('defend')}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-white font-bold text-xs transition-all"
              >
                <Shield className="w-4 h-4" />
                <span>전술 방어</span>
              </button>

              <button
                onClick={() => onExecuteCommand('flee')}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>후퇴 시도 (65%)</span>
              </button>
            </div>

            {/* Tactical Item Row */}
            {consumableItems.length > 0 && (
              <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                <HeartPulse className="w-4 h-4 text-emerald-400 shrink-0" />
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className={`text-xs p-1.5 rounded border grow ${
                    isPrts ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-[#e8dcbe] border-[#5c4033] text-black'
                  }`}
                >
                  <option value="">전술 의약품 · 촉매 선택...</option>
                  {consumableItems.map(slot => (
                    <option key={slot.item.id} value={slot.item.id}>
                      {slot.item.name} ({slot.count}개) - {slot.item.description}
                    </option>
                  ))}
                </select>
                <button
                  disabled={!selectedItem}
                  onClick={() => {
                    if (selectedItem) {
                      onExecuteCommand('item', selectedItem);
                      setSelectedItem('');
                    }
                  }}
                  className="px-3 py-1.5 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-all shrink-0"
                >
                  즉시 투여
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
