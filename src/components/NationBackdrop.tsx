// src/components/NationBackdrop.tsx
// 15개국 핵심 이벤트 및 서브테마별 절차적 SVG·CSS 배경 질감 렌더러 (클릭 간섭 0 보장)

import React from 'react';
import { EffectiveNationTheme } from '../utils/themeResolver';

interface NationBackdropProps {
  effectiveTheme: EffectiveNationTheme;
  crtEffect?: boolean;
  sanityRatio?: number;
}

export const NationBackdrop: React.FC<NationBackdropProps> = ({
  effectiveTheme,
  crtEffect = true,
  sanityRatio = 1
}) => {
  const { identity, backdropVariant, colors, polarity } = effectiveTheme;
  const nid = identity.id;
  const collapseIntensity = Math.max(0, Math.min(1, 1 - sanityRatio));

  return (
    <div
      className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 기본 주변광 그라데이션 */}
      <div
        className="absolute inset-0 opacity-35"
        style={{
          background:
            polarity === 'light'
              ? `radial-gradient(circle at 18% 12%, ${colors.primaryGlow}, transparent 55%), radial-gradient(circle at 85% 88%, rgba(15,23,42,0.06), transparent 60%)`
              : `radial-gradient(circle at 15% 12%, ${colors.primaryGlow}, transparent 52%), radial-gradient(circle at 88% 85%, ${colors.scanlineTint}, transparent 58%)`
        }}
      />

      {/* 1. 염국: 수묵·순묘 목조 탁본 vs 쉐이 계원 전지·아날로그 호러 */}
      {nid === 'yan' && backdropVariant === 'yan_ink' && (
        <>
          {/* 순묘(장부맞춤) 네 귀퉁이 목조 결구 프레임 */}
          <svg className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] opacity-25" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <path d="M0 40 H40 V0 M20 0 V28 H0 M960 0 V40 H1000 M1000 20 H972 V0 M0 560 H40 V600 M20 600 V572 H0 M960 600 V560 H1000 M1000 580 H972 V600" fill="none" stroke={colors.accent} strokeWidth="2" />
          </svg>
          {/* 수묵 산수 농담 및 주홍 인장 워터마크 */}
          <svg className="absolute bottom-0 right-0 w-[420px] h-[220px] opacity-[0.11]" viewBox="0 0 420 220">
            <path d="M0 220 L70 130 L135 175 L220 80 L305 160 L370 110 L420 220 Z" fill={colors.secondary} />
            <rect x="330" y="24" width="64" height="64" rx="4" fill="none" stroke={colors.primary} strokeWidth="4" />
            <text x="362" y="64" textAnchor="middle" fill={colors.primary} fontSize="22" fontWeight="bold">大炎</text>
          </svg>
        </>
      )}

      {nid === 'yan' && backdropVariant === 'yan_horror' && (
        <>
          {/* 『쉐이의 기이한 계원』 고채도 분홍 × 곰팡이 녹색 비네팅 + 전지 공예 격자 */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 85% 20%, rgba(244,63,94,0.16), transparent 45%), radial-gradient(circle at 15% 85%, rgba(101,163,13,0.18), transparent 50%)'
            }}
          />
          <svg className="absolute top-14 right-6 w-44 h-44 opacity-15" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="6 4" />
            <polygon points="60,14 98,60 60,106 22,60" fill="none" stroke="#84cc16" strokeWidth="1.8" />
            <circle cx="60" cy="60" r="18" fill="none" stroke="#f43f5e" strokeWidth="2" />
          </svg>
        </>
      )}

      {/* 2. 우르수스: 구축주의 사선·건축 백모 실루엣 & 성준보 스탬프 */}
      {nid === 'ursus' && (
        <>
          <svg className="absolute inset-0 w-full h-full opacity-[0.09]" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <polygon points="0,0 290,0 110,800 0,800" fill={colors.primary} />
            <polygon points="1200,0 1040,0 1150,800 1200,800" fill={colors.secondary} />
          </svg>
          {/* 하얀 건축 백모 실루엣 */}
          <svg className="absolute bottom-12 left-6 w-80 h-28 opacity-[0.09]" viewBox="0 0 320 110">
            <path d="M0 110 V70 H35 V40 H65 V70 H90 V20 L110 4 L130 20 V70 H165 V50 H210 V110 Z M225 110 V32 H265 V60 H305 V110 Z" fill="#f8fafc" />
          </svg>
        </>
      )}

      {/* 3. 빅토리아: 런디니움 증기 황동 리벳 vs 타라 보라 불꽃 시야 경계 */}
      {nid === 'victoria' && (
        <>
          <div
            className="absolute inset-x-0 top-12 h-1 opacity-40"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${colors.secondary} 0px, ${colors.secondary} 4px, transparent 4px, transparent 20px)`
            }}
          />
          {backdropVariant === 'victoria_tara' && (
            <div
              className="absolute inset-0"
              style={{
                boxShadow: 'inset 0 0 95px rgba(168, 85, 247, 0.28)',
                background: 'linear-gradient(0deg, rgba(251, 146, 60, 0.1) 0%, transparent 28%)'
              }}
            />
          )}
        </>
      )}

      {/* 4. 컬럼비아: 론 트레일 3색 스트라이프·고도계 vs 라인 미니멀 vs 랭크우드 뷰파인더 */}
      {nid === 'columbia' && backdropVariant === 'columbia_nasa' && (
        <>
          <div className="absolute top-12 left-0 right-0 h-[3px] columbia-tri-stripe opacity-80" />
          {/* 우측 수직 고도계·중력계 눈금 */}
          <div className="hidden lg:flex flex-col justify-between absolute right-2 top-28 bottom-20 w-5 opacity-25 text-[8px] font-mono text-amber-300">
            <span>90km</span>
            <span>─ 75</span>
            <span>─ 60</span>
            <span>─ 45</span>
            <span>─ 30</span>
            <span>0.9G</span>
          </div>
        </>
      )}

      {nid === 'columbia' && backdropVariant === 'columbia_rhine' && (
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      )}

      {nid === 'columbia' && backdropVariant === 'columbia_velvet' && (
        <>
          {/* 카메라 뷰파인더 네 모서리 브래킷 */}
          <svg className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] opacity-25" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <path d="M0 45 V0 H45 M955 0 H1000 V45 M0 555 V600 H45 M955 600 H1000 V555" fill="none" stroke="#fda4af" strokeWidth="2.5" />
            <path d="M485 300 H515 M500 285 V315" fill="none" stroke="#fda4af" strokeWidth="1.2" />
          </svg>
          <div className="hidden sm:flex items-center space-x-1.5 absolute top-16 right-8 text-[10px] font-mono text-rose-400 opacity-60">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>REC // RANKWOOD 24FPS</span>
          </div>
        </>
      )}

      {/* 5. 사르곤: 현대 박물관 상형문자·보석 세공 vs 황동 사각 소용돌이·전술 지도 */}
      {nid === 'sargon' && backdropVariant === 'sargon_museum' && (
        <svg className="absolute bottom-14 right-8 w-56 h-56 opacity-[0.1]" viewBox="0 0 200 200">
          <polygon points="100,10 165,45 190,100 165,155 100,190 35,155 10,100 35,45" fill="none" stroke="#14b8a6" strokeWidth="2.5" />
          <polygon points="100,32 155,150 45,150" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="100" cy="78" r="16" fill="none" stroke="#fcd34d" strokeWidth="2" />
        </svg>
      )}

      {nid === 'sargon' && backdropVariant === 'sargon_wild' && (
        <svg className="absolute inset-x-0 bottom-14 h-8 w-full opacity-20" viewBox="0 0 800 32" preserveAspectRatio="none">
          <path d="M0 28 H24 V8 H8 V20 H16 M32 28 H56 V8 H40 V20 H48 M64 28 H88 V8 H72 V20 H80 M96 28 H120 V8 H104 V20 H112 M128 28 H800" fill="none" stroke="#d97706" strokeWidth="2" />
        </svg>
      )}

      {/* 6. 라이타니엔: 흑금 피아노 건반 스트립 + 클라드니 소리 도형 + 리포밍 플럭스 굴절 광선 */}
      {nid === 'leithanien' && (
        <>
          <div className="absolute top-12 inset-x-0 h-1.5 leithanien-piano-strip opacity-75" />
          <svg className="absolute right-8 bottom-16 w-64 h-64 opacity-[0.11]" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="95" fill="none" stroke={colors.primary} strokeWidth="1.5" />
            <path d="M110 15 C145 75 145 145 110 205 C75 145 75 75 110 15 Z" fill="none" stroke={colors.primary} strokeWidth="1.5" />
            <path d="M15 110 C75 75 145 75 205 110 C145 145 75 145 15 110 Z" fill="none" stroke={colors.primary} strokeWidth="1.5" />
            <line x1="95" y1="205" x2="95" y2="35" stroke={colors.accent} strokeWidth="2" />
            <line x1="125" y1="205" x2="125" y2="35" stroke={colors.accent} strokeWidth="2" />
          </svg>
        </>
      )}

      {/* 7. 카시미어: 기사단 황금 훈장 × 고채도 상업 네온사인 사선 */}
      {nid === 'kazimierz' && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'linear-gradient(125deg, rgba(245,158,11,0.18) 0%, transparent 32%, transparent 68%, rgba(6,182,212,0.18) 100%)'
          }}
        />
      )}

      {/* 8. 이베리아: 심해 황금 함선 나침반 vs 주간 백색 소금 결정 */}
      {nid === 'iberia' && (
        <svg className="absolute right-6 bottom-16 w-64 h-64 opacity-[0.12]" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r="88" fill="none" stroke={colors.primary} strokeWidth="1.8" strokeDasharray="4 4" />
          <circle cx="110" cy="110" r="62" fill="none" stroke={colors.secondary} strokeWidth="1.5" />
          <polygon points="110,12 122,98 208,110 122,122 110,208 98,122 12,110 98,98" fill="none" stroke={colors.primary} strokeWidth="1.8" />
        </svg>
      )}

      {/* 9. 시라쿠사: 빗줄기·라이터 불빛 & 볼시니 인형극 마리오네트 줄 */}
      {nid === 'siracusa' && (
        <>
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'repeating-linear-gradient(108deg, transparent 0px, transparent 18px, rgba(255,255,255,0.45) 19px, transparent 20px)'
            }}
          />
          <div
            className="absolute bottom-10 right-10 w-52 h-52 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(245,158,11,0.45) 0%, rgba(220,38,38,0.18) 45%, transparent 72%)'
            }}
          />
          {backdropVariant === 'siracusa_opera' && (
            <svg className="absolute top-12 right-12 w-40 h-48 opacity-20" viewBox="0 0 120 140">
              <line x1="25" y1="0" x2="40" y2="95" stroke="#fde68a" strokeWidth="1" />
              <line x1="60" y1="0" x2="60" y2="85" stroke="#fde68a" strokeWidth="1" />
              <line x1="95" y1="0" x2="80" y2="95" stroke="#fde68a" strokeWidth="1" />
              <path d="M20 15 L100 15 M35 28 L85 28" stroke="#dc2626" strokeWidth="2.5" />
            </svg>
          )}
        </>
      )}

      {/* 10. 림 빌리톤: 0번 국도 파선 + 반쪽 토끼 & 24x24 도트 그리드 */}
      {nid === 'rim_billiton' && (
        <>
          <div
            className="absolute bottom-14 inset-x-0 h-[2px] opacity-35"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #fb923c 0px, #fb923c 18px, transparent 18px, transparent 32px)'
            }}
          />
          <svg className="absolute right-6 bottom-16 w-44 h-44 opacity-[0.12]" viewBox="0 0 120 120">
            <path d="M42 95 V55 C42 42 52 36 60 36 V14 C68 14 73 24 73 36 L73 18 C81 18 86 28 84 42 C92 48 96 60 94 75 L94 95 Z" fill="none" stroke="#a3e635" strokeWidth="2.5" />
            <line x1="60" y1="10" x2="60" y2="102" stroke="#fb923c" strokeWidth="2" strokeDasharray="4 3" />
          </svg>
        </>
      )}

      {/* 11. 사미: 빙하 룬 & 검은 [국가] 차원 침식 비네팅 */}
      {nid === 'sami' && (
        <>
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: backdropVariant === 'sami_daemon' ? 0.85 : 0.25 + collapseIntensity * 0.5,
              boxShadow: 'inset 0 0 110px rgba(2, 6, 23, 0.95), inset 0 0 45px rgba(168, 85, 247, 0.22)'
            }}
          />
          <svg className="absolute left-6 bottom-16 w-52 h-52 opacity-[0.12]" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="76" fill="none" stroke={colors.primary} strokeWidth="1.5" />
            <circle cx="90" cy="90" r="48" fill="none" stroke={colors.accent} strokeWidth="1.2" strokeDasharray="5 5" />
            <path d="M90 10 V170 M10 90 H170" stroke={colors.primary} strokeWidth="1" />
          </svg>
        </>
      )}

      {/* 12. 라테라노: DNA 이중나선·다재질 헤일로 콜라주 vs 『월만』 푸른 수면 파문 */}
      {nid === 'laterano' && (
        <svg className="absolute right-6 bottom-14 w-64 h-64 opacity-[0.13]" viewBox="0 0 220 220">
          {backdropVariant === 'laterano_ripple' ? (
            <>
              <circle cx="110" cy="110" r="32" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="110" cy="110" r="62" fill="none" stroke="#7dd3fc" strokeWidth="1.5" />
              <circle cx="110" cy="110" r="94" fill="none" stroke="#bae6fd" strokeWidth="1" strokeDasharray="6 6" />
            </>
          ) : (
            <>
              {/* 다재질 기하 헤일로 + DNA 이중나선 */}
              <circle cx="110" cy="70" r="46" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
              <circle cx="110" cy="70" r="34" fill="none" stroke="#fef08a" strokeWidth="1.2" strokeDasharray="8 4" />
              <path d="M75 115 C95 135 125 135 145 155 C125 175 95 175 75 195" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <path d="M145 115 C125 135 95 135 75 155 C95 175 125 175 145 195" fill="none" stroke="#fbbf24" strokeWidth="2" />
            </>
          )}
        </svg>
      )}

      {/* 13. 용문: 홍콩 마천루 네온 스카이라인 + 야시장 붉은 등롱 */}
      {nid === 'lungmen' && (
        <>
          <svg className="absolute bottom-14 right-0 w-[460px] h-32 opacity-[0.12]" viewBox="0 0 460 130">
            <path d="M0 130 V85 H38 V52 H72 V95 H98 V28 H142 V130 Z M155 130 V42 H198 V18 L215 6 L232 18 V130 Z M248 130 V60 H292 V35 H340 V80 H375 V24 H425 V130 Z" fill={colors.primary} />
          </svg>
          {/* 야시장 붉은 등롱 글로우 */}
          <div
            className="absolute top-16 right-12 w-28 h-28 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)' }}
          />
        </>
      )}

      {/* 14. 카즈델: 야간 혼령 용광로·검은 비 vs 주간 바벨 순백·안전 사슬 */}
      {nid === 'kazdel' && backdropVariant === 'kazdel_furnace' && (
        <>
          {/* 오리지늄 검은 비 스트로크 */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'repeating-linear-gradient(96deg, transparent 0px, transparent 26px, #f43f5e 27px, transparent 28px)'
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-40 opacity-25"
            style={{
              background: 'linear-gradient(0deg, rgba(220,38,38,0.45) 0%, rgba(147,51,234,0.15) 55%, transparent 100%)'
            }}
          />
        </>
      )}

      {nid === 'kazdel' && backdropVariant === 'kazdel_babel' && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.14]" viewBox="0 0 1200 800" preserveAspectRatio="none">
          {/* 『바벨』 안전 사슬 대각선 선화 */}
          <line x1="0" y1="110" x2="360" y2="0" stroke="#27272a" strokeWidth="3" strokeDasharray="12 6" />
          <line x1="860" y1="800" x2="1200" y2="660" stroke="#27272a" strokeWidth="3" strokeDasharray="12 6" />
          <path d="M0 710 H820 L835 685 L850 730 L865 702 L880 710 H1200" fill="none" stroke="#991b1b" strokeWidth="1.8" />
        </svg>
      )}

      {/* 15. 쉐라그: 성산 설봉 & 푸른 얼음 결정 마름모 */}
      {nid === 'kjerag' && (
        <svg className="absolute right-6 bottom-14 w-72 h-44 opacity-[0.12]" viewBox="0 0 280 170">
          <path d="M0 170 L68 78 L112 120 L175 28 L235 112 L262 88 L280 170 Z" fill="none" stroke={colors.primary} strokeWidth="2" />
          <polygon points="175,6 189,24 175,42 161,24" fill={colors.primary} />
        </svg>
      )}

      {/* CRT 스캔라인 오버레이 (유저 설정 존중) */}
      {crtEffect && (
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${
              polarity === 'light' ? '#0f172a' : colors.primary
            } 3px)`
          }}
        />
      )}
    </div>
  );
};
