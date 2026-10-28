// src/components/AdvancedSettingsModal.tsx
import React from 'react';
import { AdvancedSettings, AIStrategy, ThemeMode } from '../types';
import { Settings, Bot, ShieldAlert, Monitor, Volume2, VolumeX, BookOpen, Terminal, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AdvancedSettings;
  onUpdateSettings: (next: AdvancedSettings) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  theme: ThemeMode;
  onSwitchTheme: () => void;
}

export const AdvancedSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isMuted,
  onToggleMute,
  theme,
  onSwitchTheme
}) => {
  if (!isOpen) return null;

  const isPrts = theme === 'prts';

  const strategies: { id: AIStrategy; title: string; badge: string; desc: string }[] = [
    {
      id: 'balanced',
      title: '균형 발전형 (Balanced)',
      badge: '권장 기본값',
      desc: '능력치 판정 성공률, 종족 시너지, 체력 안정을 고르게 계산하여 선택지와 훈련을 진행합니다.'
    },
    {
      id: 'survival',
      title: '생존 · 방역 최우선 (Survival)',
      badge: '장수 특화',
      desc: '무모한 교전을 피하고 휴양·억제제 투약·안전한 선택지를 우선하여 천수를 누리도록 유도합니다.'
    },
    {
      id: 'combat',
      title: '무투 · 결전 추구형 (Combat & Arts)',
      badge: '무훈 특화',
      desc: '백병전·아츠 수련과 보스 교전 선택지를 적극 채택하여 강력한 전사로 육성합니다.'
    },
    {
      id: 'wealth',
      title: '자본 · 엘리트 지향 (Wealth & Career)',
      badge: '거부 특화',
      desc: '현상금 의뢰, 학술 자문, 금전 보상 선택지를 우선하여 거액의 LMD와 특수 직군을 노립니다.'
    }
  ];

  const toggleField = (key: keyof Omit<AdvancedSettings, 'aiStrategy'>) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className={`w-full max-w-2xl rounded-xl border shadow-2xl p-4 sm:p-6 flex flex-col max-h-[88vh] transition-all ${
        isPrts
          ? 'bg-[#0e131d] border-cyan-500/40 text-slate-100 font-mono'
          : 'bg-[#f4ebd0] border-[#5c4033] text-[#1a1412] font-serif'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg ${isPrts ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#8b1e1e]/20 text-[#8b1e1e]'}`}>
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-wider">
                {isPrts ? '시스템 및 전술 AI 고급 설정 (SYSTEM CONFIG)' : '연대기 진행 및 세부 환경 설정'}
              </h2>
              <p className={`text-xs ${isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}`}>
                고속 배속 시 급사 방지 브레이크, AI 의사결정 성향, 화면 효과를 제어합니다.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto pr-1 grow">
          {/* Section 1: AI Strategy */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider mb-2.5 text-cyan-400">
              <Bot className="w-4 h-4" />
              <span>1. 자동 진행 AI 의사결정 성향</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {strategies.map(st => {
                const active = settings.aiStrategy === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => onUpdateSettings({ ...settings, aiStrategy: st.id })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      active
                        ? isPrts
                          ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                          : 'bg-[#ebdcb9] border-2 border-[#8b1e1e]'
                        : isPrts
                          ? 'bg-slate-900/60 border-slate-700/70 hover:border-slate-500'
                          : 'bg-[#e8dcbe]/60 border-[#5c4033]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{st.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        active
                          ? isPrts ? 'bg-cyan-400 text-black' : 'bg-[#8b1e1e] text-white'
                          : 'bg-black/20 opacity-70'
                      }`}>
                        {active ? '적용 중' : st.badge}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}`}>
                      {st.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Emergency Auto-Pause & Auto-AP */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider mb-2.5 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>2. 위기 감지 자동 브레이크 & 스마트 대행</span>
            </div>
            <div className="space-y-2">
              {[
                {
                  key: 'autoUseApAndShop' as const,
                  title: 'AI 연간 자율 활동(AP) · 무기고 장착 · 특수직군 임관 자동 대행',
                  desc: '매년 남은 AP로 수련/치료를 수행하고, 여유 LMD로 상위 장비를 구매하며 자격 달성 시 특수 직군으로 자동 승급합니다.'
                },
                {
                  key: 'pauseOnLowHp' as const,
                  title: '생명 위독 시 자동 일시정지 (HP 25% 이하)',
                  desc: '고속 배속 중 체력이 25% 이하로 떨어지면 급사를 막기 위해 시간을 즉시 일시정지합니다.'
                },
                {
                  key: 'pauseOnOripathyCrisis' as const,
                  title: '광석병 위기 시 자동 일시정지 (결정화 70% 이상)',
                  desc: '결정화율이 치명적 단계(70%+)에 진입하면 억제제 투약을 위해 자동 일시정지합니다.'
                },
                {
                  key: 'pauseOnRareEvent' as const,
                  title: '특수 직군 · 중대 분기 사건 등장 시 수동 선택 대기',
                  desc: '사건 자동(ON) 상태라도 특수 직군 전직이나 핵심 역사 분기점이 뜨면 일시정지하여 직접 고를 수 있게 합니다.'
                }
              ].map(item => {
                const checked = settings[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleField(item.key)}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isPrts ? 'bg-slate-900/60 border-slate-700/70 hover:border-cyan-500/40' : 'bg-[#e8dcbe]/80 border-[#5c4033]/30'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{item.title}</div>
                      <div className={`text-[11px] mt-0.5 ${isPrts ? 'text-slate-400' : 'text-[#5c4d47]'}`}>
                        {item.desc}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded text-xs font-extrabold shrink-0 transition-all ${
                        checked
                          ? isPrts ? 'bg-emerald-500 text-black' : 'bg-[#2d5a27] text-white'
                          : isPrts ? 'bg-slate-800 text-slate-400' : 'bg-stone-400 text-stone-800'
                      }`}
                    >
                      {checked ? 'ON' : 'OFF'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Display & Audio */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider mb-2.5 text-emerald-400">
              <Monitor className="w-4 h-4" />
              <span>3. 인터페이스 테마 및 시청각 효과</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={onSwitchTheme}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs font-bold ${
                  isPrts ? 'bg-slate-900/70 border-slate-700 text-amber-300' : 'bg-[#e8dcbe] border-[#5c4033] text-[#8b1e1e]'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  {isPrts ? <BookOpen className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                  <span>현재 테마</span>
                </span>
                <span>{isPrts ? 'PRTS 터미널' : '고서적 역사서'}</span>
              </button>

              <button
                onClick={() => toggleField('crtEffect')}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs font-bold ${
                  isPrts ? 'bg-slate-900/70 border-slate-700 text-cyan-300' : 'bg-[#e8dcbe] border-[#5c4033] text-[#2c1810]'
                }`}
              >
                <span>CRT 스캔라인 효과</span>
                <span className="px-2 py-0.5 rounded bg-black/20">{settings.crtEffect ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={onToggleMute}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs font-bold ${
                  isPrts ? 'bg-slate-900/70 border-slate-700 text-slate-200' : 'bg-[#e8dcbe] border-[#5c4033] text-[#2c1810]'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  <span>사운드 효과음</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-black/20">{isMuted ? '음소거됨' : '켜짐'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-4 border-t border-white/10 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-xs font-bold ${
              isPrts ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : 'bg-[#8b1e1e] hover:bg-[#a32828] text-white'
            }`}
          >
            설정 저장 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
