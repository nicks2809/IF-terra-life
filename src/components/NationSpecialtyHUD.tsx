// src/components/NationSpecialtyHUD.tsx
// 15개국 전용 다이어제틱 계기판 위젯, AP 아이콘 은유 및 시즌 진행바 컴포넌트

import React from 'react';
import { Character, NationApMetaphor, Season } from '../types';
import { EffectiveNationTheme } from '../utils/themeResolver';

interface NationSidebarWidgetProps {
  character: Character;
  effectiveTheme: EffectiveNationTheme;
  metric?: { value: string; hint: string; tone: string } | null;
}

export const NationApIcon: React.FC<{ iconType?: NationApMetaphor['iconType']; className?: string }> = ({
  iconType = 'sparkles',
  className = 'w-4 h-4'
}) => {
  switch (iconType) {
    case 'coin':
      // 염국 대염통보 엽전 (방공원전)
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <rect x="9" y="9" width="6" height="6" />
        </svg>
      );
    case 'espresso':
      // 라테라노 에스프레소 모카포트 (제총사의 밤)
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 4h10l-1.5 7h-7L7 4z" />
          <path d="M8.5 11h7L17 20H7l1.5-9z" />
          <path d="M17 6h2.5v4H16" />
          <line x1="10" y1="2" x2="14" y2="2" />
        </svg>
      );
    case 'hammer':
      // 우르수스 구축주의 쇠망치
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 7h11l2 3-3 2H6z" />
          <line x1="11" y1="12" x2="11" y2="21" />
        </svg>
      );
    case 'gear':
      // 빅토리아 증기 밸브 기어
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M19.1 4.9l-2.8 2.8M7.7 16.3l-2.8 2.8" />
        </svg>
      );
    case 'cassette':
      // 컬럼비아 카세트 테이프 모듈
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="12" r="2" />
          <circle cx="15.5" cy="12" r="2" />
          <path d="M7 19l2-3h6l2 3" />
        </svg>
      );
    case 'gem':
      // 사르곤 오리지늄 보석 세공
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="6,3 18,3 22,9 12,21 2,9" />
          <path d="M2 9h20M12 21L8 9l4-6 4 6-4 12z" />
        </svg>
      );
    case 'gramophone':
      // 라이타니엔 축음기 혼
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 17h12v4H6z" />
          <path d="M12 17v-3c4 0 7-3 7-7L11 4v6" />
          <circle cx="18" cy="7" r="2" />
        </svg>
      );
    case 'medal':
      // 카시미어 기사단 황금 훈장
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="14" r="6" />
          <path d="M8 3l2 6M16 3l-2 6M12 11v6M9 14h6" />
        </svg>
      );
    case 'lantern':
      // 이베리아 심문관 등불
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6h6l1.5 9L14 20h-4l-2.5-5L9 6z" />
          <path d="M10 3h4M12 10v5" />
        </svg>
      );
    case 'lighter':
      // 시라쿠사 빗속의 황동 라이터
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="6" y="10" width="12" height="11" rx="1.5" />
          <path d="M6 13h12M12 3c2 2.5 2.5 4.5 0 6-2.5-1.5-2-3.5 0-6z" />
        </svg>
      );
    case 'backpack':
      // 림 빌리톤 여행자 배낭
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="7" width="14" height="14" rx="3" />
          <path d="M9 7V5a3 3 0 0 1 6 0v2M8 14h8v4H8z" />
        </svg>
      );
    case 'rune':
      // 사미 상하 맞물림 밀문판
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16v7l-4 2-4-2-4 2-4-2V4z" />
          <path d="M4 13l4 2 4-2 4 2 4-2v7H4v-7z" />
        </svg>
      );
    case 'shield':
      // 용문근위국 전술 방패
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
          <path d="M12 7v10M8 11h8" />
        </svg>
      );
    case 'flame':
      // 카즈델 혼령 용광로 불꽃
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3c3 4 6 6.5 6 11a6 6 0 1 1-12 0c0-3 1.5-5.5 3.5-7.5 0 2 1 3 2.5 3 0-2.5 0-4.5 0-6.5z" />
        </svg>
      );
    case 'bell':
      // 쉐라그 성산 종
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2z" />
          <path d="M10 18a2 2 0 0 0 4 0" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z" />
        </svg>
      );
  }
};

export const NationSidebarWidget: React.FC<NationSidebarWidgetProps> = ({
  character,
  effectiveTheme,
  metric
}) => {
  const { identity, activeSubTheme, colors } = effectiveTheme;
  const nid = identity.id;

  // 국가별 보조 지표 계산
  const sanPct = Math.max(0, Math.min(100, Math.round((character.stats.sanity / Math.max(1, character.stats.maxSanity)) * 100)));
  const hpPct = Math.max(0, Math.min(100, Math.round((character.stats.health / Math.max(1, character.stats.maxHealth)) * 100)));

  return (
    <div
      className={`p-3 border text-xs space-y-2 relative overflow-hidden transition-colors ${
        nid === 'siracusa' ? 'nation-suit-stitch rounded-none' : nid === 'kjerag' ? 'nation-brushed-silver rounded-lg' : 'rounded-lg'
      }`}
      style={{
        backgroundColor: colors.panelBg,
        borderColor: colors.panelBorder
      }}
    >
      {/* 상단 이벤트 출처 & 위젯 타이틀 */}
      <div className="flex items-center justify-between gap-1.5 border-b pb-1.5" style={{ borderColor: colors.panelBorder }}>
        <div className="min-w-0">
          <div className="text-[10px] font-extrabold tracking-wider uppercase truncate" style={{ color: colors.badgeText }}>
            {identity.specialtyWidget.title}
          </div>
          <div className="text-[9px] text-slate-400 truncate">
            {activeSubTheme ? activeSubTheme.eventSource : (identity.eventRefs?.[0] || identity.terminalHeader.inspiration)}
          </div>
        </div>
        {metric && (
          <span className={`font-mono font-bold text-[11px] shrink-0 ${metric.tone}`}>
            {metric.value}
          </span>
        )}
      </div>

      {/* 1. 염국: 대염통보 3매 엽전 투척 & 황부 낙관 */}
      {nid === 'yan' && (
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center space-x-1.5">
            {[0, 1, 2].map(idx => {
              const yang = ((character.year + character.age + character.stats.luck + idx * 7) % 2) === 0;
              return (
                <div
                  key={idx}
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center font-serif font-bold text-[10px] shadow-sm"
                  style={{
                    borderColor: colors.accent,
                    backgroundColor: yang ? 'rgba(234, 179, 8, 0.16)' : 'rgba(200, 60, 35, 0.2)',
                    color: colors.badgeText
                  }}
                  title={yang ? '대염통보 양(陽)면' : '대염통보 음(陰)면'}
                >
                  {yang ? '通' : '寶'}
                </div>
              );
            })}
          </div>
          <span
            className="px-2 py-0.5 text-[10px] font-bold border"
            style={{
              backgroundColor: 'rgba(250, 204, 21, 0.16)',
              borderColor: '#eab308',
              color: '#fde047'
            }}
          >
            勅令 · 황부 봉인
          </span>
        </div>
      )}

      {/* 2. 우르수스: 성준보 신문 호외 & 구축주의 쇠망치 게이지 */}
      {nid === 'ursus' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold tracking-wider">『성준보(СВЯТОГОР)』 제{character.year}호</span>
            <span className="px-1.5 py-0.2 border border-red-500/70 text-red-400 font-black rotate-[-2deg]">
              결재 스탬프 인가
            </span>
          </div>
          <div className="w-full h-2 bg-slate-950 overflow-hidden flex border border-red-900/50">
            <div className="h-full bg-red-600 transition-all" style={{ width: `${hpPct}%` }} />
            <div className="h-full bg-amber-500 transition-all" style={{ width: `${Math.max(0, 100 - hpPct)}%`, opacity: 0.35 }} />
          </div>
        </div>
      )}

      {/* 3. 빅토리아: 왕립 군수 증기압 & 타라 경계선 */}
      {nid === 'victoria' && (
        <div className="flex items-center justify-between text-[10px] gap-2">
          <span className="px-2 py-0.5 rounded-sm border border-amber-500/40 bg-amber-500/10 text-amber-300 font-serif font-bold">
            ROYAL ORDNANCE
          </span>
          <span className="text-slate-300 truncate">
            {activeSubTheme?.id === 'tara_elegy' ? '타라 자색 불꽃 점화' : '런디니움 중앙 승강장 정시'}
          </span>
        </div>
      )}

      {/* 4. 컬럼비아: 론 트레일 3색 스트라이프 & 수직 고도·중력 지표 */}
      {nid === 'columbia' && (
        <div className="space-y-1.5">
          <div className="h-1 w-full rounded-sm columbia-tri-stripe" />
          <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
            <div className="px-1.5 py-0.5 bg-slate-950/60 border border-amber-500/30 rounded-sm">
              ALT {(12 + character.stats.intellect * 0.6).toFixed(1)}km
            </div>
            <div className="px-1.5 py-0.5 bg-slate-950/60 border border-sky-500/30 rounded-sm">
              {(0.98 - Math.min(0.4, character.stats.artsAptitude * 0.003)).toFixed(2)} G
            </div>
            <div className="px-1.5 py-0.5 bg-slate-950/60 border border-rose-500/30 rounded-sm">
              {activeSubTheme?.id === 'rankwood_noir' ? 'REC 24F' : 'VHS-78'}
            </div>
          </div>
        </div>
      )}

      {/* 5. 사르곤: 현대 박물관 상형문자 전시표 & 보석 세공 */}
      {nid === 'sargon' && (
        <div className="flex items-center justify-between text-[10px] gap-2">
          <span className="font-mono tracking-widest text-amber-300">◈ 𓇳 𓋹 𓅃 ◈</span>
          <span className="px-2 py-0.5 border border-teal-400/40 bg-teal-500/15 text-teal-300 font-bold">
            {activeSubTheme?.id === 'imperial_wild' ? '생존 연산 가동' : '전시관 보석 감정급'}
          </span>
        </div>
      )}

      {/* 6. 라이타니엔: 흑금 피아노 건반 & 클라드니 오디오 스펙트럼 */}
      {nid === 'leithanien' && (
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded-sm leithanien-piano-strip border border-amber-500/30" />
          <div className="flex items-end justify-between h-4 gap-0.5 px-1">
            {[45, 80, 60, 95, 70, 50, 88, 64, 92, 55, 76, 40].map((bar, i) => {
              const dyn = Math.max(20, Math.min(100, ((bar + character.stats.artsAptitude + character.age * 3 + i * 7) % 85) + 15));
              return (
                <span
                  key={i}
                  className="flex-1 rounded-t-sm transition-all"
                  style={{ height: `${dyn}%`, backgroundColor: i % 2 === 0 ? colors.primary : colors.accent }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 7. 카시미어: 3대 세력(감정회·상업연합회·아머레스 유니온) 명성 게이지 */}
      {nid === 'kazimierz' && (
        <div className="space-y-1 text-[10px]">
          {[
            { name: '기사 감정회', val: Math.min(100, 35 + Math.round(character.stats.combat * 0.6)), color: '#f59e0b' },
            { name: '상업연합회', val: Math.min(100, 25 + Math.round(character.stats.wealth / 180)), color: '#06b6d4' },
            { name: '아머레스 유니온', val: Math.min(100, 30 + Math.round(character.stats.intellect * 0.55)), color: '#f43f5e' }
          ].map(fac => (
            <div key={fac.name} className="flex items-center gap-2">
              <span className="w-24 truncate text-slate-300">{fac.name}</span>
              <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full transition-all" style={{ width: `${fac.val}%`, backgroundColor: fac.color }} />
              </div>
              <span className="w-7 text-right font-mono font-bold">{fac.val}</span>
            </div>
          ))}
        </div>
      )}

      {/* 8. 이베리아: 황금 함선 방위각 & 소금 결정 연금 농도 */}
      {nid === 'iberia' && (
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-serif font-bold" style={{ color: colors.badgeText }}>
            {effectiveTheme.polarity === 'light' ? '창백한 소금 사막 항로' : '스툴티페라 황금 등불 점등'}
          </span>
          <span className="font-mono">
            방위 {((character.year * 17 + character.age * 9) % 360)}° N
          </span>
        </div>
      )}

      {/* 9. 시라쿠사: 볼시니 서류철 & 오메르타/복수심 저울 */}
      {nid === 'siracusa' && (
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-300">볼시니 패밀리 원단 인장</span>
          <span className="px-2 py-0.5 bg-red-950/70 border border-red-500/50 text-red-300 font-bold">
            {metric?.hint || '침묵 서약 유지'}
          </span>
        </div>
      )}

      {/* 10. 림 빌리톤: 24x24 픽셀 토끼 배지 & 원격 가족 통신 상태 */}
      {nid === 'rim_billiton' && (
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center space-x-2">
            {/* 픽셀 아트 스타일 미니 토끼 아이콘 */}
            <svg className="w-6 h-6 shrink-0 border border-lime-400/50 bg-slate-950 p-0.5" viewBox="0 0 8 8" shapeRendering="crispEdges">
              <rect x="2" y="0" width="1" height="3" fill="#a3e635" />
              <rect x="5" y="0" width="1" height="3" fill="#fb923c" />
              <rect x="2" y="3" width="4" height="4" fill="#fef08a" />
              <rect x="3" y="4" width="1" height="1" fill="#0f172a" />
              <rect x="5" y="4" width="1" height="1" fill="#dc2626" />
            </svg>
            <span className="text-lime-300 font-bold">원격 통신: 수신 양호</span>
          </div>
          <span className="font-mono text-amber-300">HWY-0 · {character.age * 42}km</span>
        </div>
      )}

      {/* 11. 사미: 간섭 방지 지수 레이더 & 상하 맞물림 밀문판 */}
      {nid === 'sami' && (
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke={colors.primary} strokeWidth="1.5" />
              <circle cx="12" cy="12" r="5" fill="none" stroke={colors.accent} strokeWidth="1" />
              <line x1="12" y1="12" x2="19" y2="6" stroke={colors.primary} strokeWidth="2" />
            </svg>
            <span>간섭 방지 지수: <strong>{Math.max(1, Math.ceil(sanPct / 16))}/6</strong></span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-sky-950/70 border border-sky-400/40 text-sky-200 font-mono">
            밀문 합치
          </span>
        </div>
      )}

      {/* 12. 라테라노: 수호총 6연발 약실 & 디저트 당도 계기 */}
      {nid === 'laterano' && (
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center space-x-1" title="수호총 축성 탄약 실린더">
            {[0, 1, 2, 3, 4, 5].map(chamber => {
              const loaded = chamber < Math.max(1, Math.ceil((sanPct / 100) * 6));
              return (
                <span
                  key={chamber}
                  className="w-2.5 h-2.5 rounded-full border"
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: loaded ? colors.primary : 'transparent'
                  }}
                />
              );
            })}
          </div>
          <span className="text-amber-200 font-semibold">
            젤라토 보급 · 탄약 정상
          </span>
        </div>
      )}

      {/* 13. 용문: 펭귄 로지스틱스 스트리트 태그 & SDU 치안 코드 */}
      {nid === 'lungmen' && (
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-extrabold tracking-wide">
            L.G.D. SDU CODE-1
          </span>
          <span className="px-1.5 py-0.5 bg-rose-600 text-white font-black italic -skew-x-6 text-[9px]">
            PENGUIN EXPRESS
          </span>
        </div>
      )}

      {/* 14. 카즈델: 생각 조각 석판(야간) vs 바벨 안전 사슬(주간) */}
      {nid === 'kazdel' && (
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <span className="font-bold">
            {effectiveTheme.polarity === 'light' ? '바벨 안전 사슬 결속 중' : '혼령 용광로 생각 조각 공명'}
          </span>
          <span className="font-mono font-bold" style={{ color: colors.primary }}>
            {effectiveTheme.polarity === 'light' ? `BPM ${Math.max(42, Math.round(hpPct * 0.82))}` : `석판 ${(character.age % 5) + 1}매`}
          </span>
        </div>
      )}

      {/* 15. 쉐라그: 은심호 산악열차 대합실 행선지 보드 */}
      {nid === 'kjerag' && (
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
          <span className="px-1.5 py-0.5 bg-sky-500/20 border border-sky-400/40 text-sky-200 font-bold">
            은심호 {character.year}편
          </span>
          <span className="truncate text-slate-300">
            카란 무역역 → 성산 쉐라간드
          </span>
        </div>
      )}

      {/* 16. 로도스 폴백 */}
      {nid === 'rhodes_island' && metric && (
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">{metric.hint}</span>
          <span className="text-cyan-300 font-mono">NEURAL LINK ACTIVE</span>
        </div>
      )}
    </div>
  );
};

interface NationSeasonProgressBarProps {
  effectiveTheme: EffectiveNationTheme;
  year: number;
  currentSeason: Season;
  yearProgress: number;
  isPlaying: boolean;
  hasEvent: boolean;
  speed: number;
}

export const NationSeasonProgressBar: React.FC<NationSeasonProgressBarProps> = ({
  effectiveTheme,
  year,
  currentSeason,
  yearProgress,
  isPlaying,
  hasEvent,
  speed
}) => {
  const { identity, colors, polarity } = effectiveTheme;
  const clamped = Math.max(0, Math.min(100, yearProgress));
  const styleKind = identity.progressStyle || 'prts_sync';

  const progressLabel: Record<string, string> = {
    panoramic_voyage: '항해 방위',
    forward_timer: '전진 공정',
    musical_staff: '연간 악장',
    railway_board: '은심호 노선',
    altimeter_tape: '궤도 시퀀스',
    live_ticker: '중계 편성',
    ink_coin: '사세 절기',
    babel_ecg: polarity === 'light' ? '바벨 파형' : '용광로 주기'
  };

  return (
    <div
      className="season-indicator h-7 border-t px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 text-[10px] relative z-10"
      data-season={currentSeason}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.panelBorder
      }}
    >
      <div className="flex items-center space-x-2 shrink-0">
        <span className="font-bold" style={{ color: colors.badgeText }}>
          {progressLabel[styleKind] ? `[${progressLabel[styleKind]}] ` : ''}{year}년 · {currentSeason}
        </span>
        <div className="hidden sm:flex items-center space-x-1 text-slate-400">
          {(['봄', '여름', '가을', '겨울'] as Season[]).map(s => (
            <span
              key={s}
              className={`px-1.5 py-0.2 rounded transition-colors ${
                currentSeason === s ? 'font-extrabold' : 'opacity-65'
              }`}
              style={
                currentSeason === s
                  ? { backgroundColor: colors.badgeBg, color: colors.badgeText }
                  : undefined
              }
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* 국가별 전용 진행 트랙 */}
      <div
        className="grow h-2 rounded-full overflow-hidden border relative"
        style={{
          backgroundColor: polarity === 'light' ? 'rgba(15, 23, 42, 0.12)' : 'rgba(2, 6, 23, 0.75)',
          borderColor: colors.panelBorder
        }}
      >
        {/* 라이타니엔 5선 악보 오선지 눈금 / 이베리아 항해 눈금 */}
        {styleKind === 'musical_staff' && (
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(234,179,8,0.6) 2px)'
            }}
          />
        )}
        {(styleKind === 'panoramic_voyage' || styleKind === 'railway_board' || styleKind === 'altimeter_tape') && (
          <div
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 24px, ${colors.primary} 25px)`
            }}
          />
        )}
        <div
          className={`h-full transition-[width] duration-75 ${
            identity.id === 'columbia' && effectiveTheme.activeSubTheme?.id === 'lone_trail' ? 'columbia-tri-stripe' : ''
          }`}
          style={
            identity.id === 'columbia' && effectiveTheme.activeSubTheme?.id === 'lone_trail'
              ? { width: `${clamped}%` }
              : {
                  width: `${clamped}%`,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`
                }
          }
        />
      </div>

      <span className="text-slate-300 shrink-0 font-bold font-mono">
        {isPlaying && !hasEvent ? `${speed}x 진행 중` : hasEvent ? '선택 대기' : '정지'}
      </span>
    </div>
  );
};
