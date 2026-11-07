// src/components/NationInsignia.tsx
import React, { useId } from 'react';
import { NationThemeId } from '../types';
import { resolveNationId } from '../utils/themeResolver';
import { NATION_VISUAL_IDENTITIES } from '../data/nationThemes';

export type InsigniaSize = 'sm' | 'md' | 'lg' | 'xl';

export interface NationInsigniaProps extends React.SVGAttributes<SVGElement> {
  /**
   * 테라 국가 식별자 (영문 ID 또는 한글 국명)
   * 예: 'victoria', '빅토리아', 'ursus', '염국', 'leithanien'
   * 미지정 또는 미매칭 시 'rhodes_island'로 안전하게 폴백
   */
  nationId?: NationThemeId | string;

  /**
   * 크기 프리셋 또는 사용자 지정 픽셀 크기
   * - 'sm': 16px (w-4 h-4) - 인라인 태그, 배지 내부
   * - 'md': 24px (w-6 h-6) - 표준 버튼, 헤더 내비게이션
   * - 'lg': 48px (w-12 h-12) - 프로필 카드, 모달 상단
   * - 'xl': 64px (w-16 h-16) - 랜딩 화면 출신지 선택 대형 카드
   * - number: 임의의 픽셀 단위 크기 (예: 32)
   * 기본값: 'md' (24px)
   */
  size?: InsigniaSize | number;

  /**
   * 렌더링 스타일 변형
   * - 'monochrome': 단일 선화 (currentColor 단색 스트로크)
   * - 'duotone': 선화 + 15% 반투명 내부 악센트 채움 (기본값)
   * - 'badge': 둥근 테두리와 배경 컨테이너를 포함하는 배지 형태
   */
  variant?: 'monochrome' | 'duotone' | 'badge';

  /**
   * 보조 악센트 색상 (duotone 모드에서 내부 채움 등에 사용)
   * 미지정 시 currentColor에 기반한 반투명 채움 적용
   */
  accentColor?: string;

  /**
   * 접근성 대체 텍스트 (미지정 시 "{nameKo} 인시그니아 심볼" 자동 생성)
   */
  'aria-label'?: string;

  /**
   * 브라우저 네이티브 툴팁용 텍스트
   */
  title?: string;

  /**
   * 추가 Tailwind 또는 인라인 CSS 클래스
   */
  className?: string;
}

/**
 * 사전 정의된 크기별 픽셀 및 Tailwind 클래스 매핑
 */
const SIZE_MAP: Record<InsigniaSize, { px: number; tw: string }> = {
  sm: { px: 16, tw: 'w-4 h-4' },
  md: { px: 24, tw: 'w-6 h-6' },
  lg: { px: 48, tw: 'w-12 h-12' },
  xl: { px: 64, tw: 'w-16 h-16' },
};

/**
 * 15개 테라 국가 + 로도스 아일랜드 고유 벡터 SVG 경로 정의
 * viewBox: 0 0 24 24 기준
 */
interface InsigniaPaths {
  primary: string; // 기본 외곽선/주요 형태 스트로크
  accent?: string;  // 보조 악센트/내부 채움 형태
}

const NATION_SVG_PATHS: Record<NationThemeId, InsigniaPaths> = {
  // 1. 빅토리아: 제국 증기 기사단과 황실의 사자
  victoria: {
    primary:
      'M5 8 L7 12 L12 7 L17 12 L19 8 L19 13 C19 17.5 15.5 20.5 12 21 C8.5 20.5 5 17.5 5 13 Z M12 3 V6 M8 4 L9.5 6 M16 4 L14.5 6',
    accent: 'M12 11 L14.5 14 L12 17 L9.5 14 Z',
  },

  // 2. 염국: 진용군과 대리의 주홍 낙관
  yan: {
    primary:
      'M4 4 H20 V20 H4 Z M7 16 C8.5 13 10.5 13 12 15 C13.5 17 15.5 16 16.5 13 C17.5 11 16 9 14 9.5 C12.5 10 11.5 11 10 11',
    accent: 'M8 8 C9.5 7 11 8 10 9.5 Z M13.5 14 H16',
  },

  // 3. 우르수스 제국: 북방의 쌍두 곰과 붉은 제국성
  ursus: {
    primary:
      'M5 9 C4 6 7 5 8 7 L12 8 L16 7 C17 5 20 6 19 9 L18 14 L15 19 L9 19 L6 14 Z M8 13 H10 M14 13 H16 M11 16.5 H13',
    accent:
      'M12 9.5 L12.7 11 L14.3 11.2 L13.1 12.3 L13.5 13.9 L12 13 L10.5 13.9 L10.9 12.3 L9.7 11.2 L11.3 11 Z',
  },

  // 4. 카시미어: 태양의 페가수스와 챔피언 월계관
  kazimierz: {
    primary:
      'M14 4 C11 5 9 8 9 12 L6 14 L7 16 L10 15 L11 19 L15 20 C16 16 15 12 14 4 Z M13 8 C16 6 19 7 21 10 C18 11 16 12 14 12 M14 12 C17 12 19 14 20 16 C17 16 15 15 13 14',
    accent: 'M3 8 L5 10 M3 13 H5 M5 16 L3 18',
  },

  // 5. 컬럼비아: 궤도 위성과 파이오니어 독수리
  columbia: {
    primary:
      'M6 15 L12 8 L18 15 M8 17 L12 12 L16 17 M12 3 V5 M12 19 V21 M3 12 H5 M19 12 H21',
    accent:
      'M4.5 16 C3 14 4 10 8 8 C12 6 18 6 20 8 C22 10 20 14 16 16 C12 18 6 18 4.5 16 Z',
  },

  // 6. 이베리아: 대침묵의 등대와 심해의 성호
  iberia: {
    primary:
      'M10 6 H14 V9 H10 Z M10.5 9 L9.5 17 H14.5 L13.5 9 M10 6 C10 4 14 4 14 6 M8 20 C10 21.5 14 21.5 16 20 M12 17 V22',
    accent: 'M8 7.5 L2.5 5 M8 8.5 L2 11 M16 7.5 L21.5 5 M16 8.5 L22 11',
  },

  // 7. 라테라노: 천상의 헤일로와 수호총의 성가
  laterano: {
    primary:
      'M7 9 L17 19 M17 9 L7 19 M6 8 L8 10 M18 8 L16 10 M6 13 C3 11 3 16 5 18 M18 13 C21 11 21 16 19 18',
    accent: 'M6 5 C6 3.5 18 3.5 18 5 C18 6.5 6 6.5 6 5 Z',
  },

  // 8. 라이타니엔: 쌍둥이 첨탑과 첼로의 금빛 음표
  leithanien: {
    primary:
      'M6 20 V10 L8 4 L8 20 M18 20 V10 L16 4 L16 20 M4 20 H20 M10 8 L12 5 L14 8 H10 Z',
    accent:
      'M11.5 11 C12.2 11.5 12.3 12.3 11.8 13.2 C11.2 14.2 12.5 15.2 13.2 16 M11 13.5 H13',
  },

  // 9. 사미: 원초의 순록 뿔과 고대 오로라 룬
  sami: {
    primary:
      'M11 14 C9 12 7 9 6 5 M9 11 C7 11 5 12 4 14 M7.5 8.5 C5.5 8 4 9 3 9.5 M13 14 C15 12 17 9 18 5 M15 11 C17 11 19 12 20 14 M16.5 8.5 C18.5 8 20 9 21 9.5 M10 18 L12 21 L14 18',
    accent: 'M12 9.5 L14.5 13 L12 16.5 L9.5 13 Z',
  },

  // 10. 시라쿠사: 늑대의 단검과 패밀리의 인장
  siracusa: {
    primary:
      'M5 5 H19 V13 C19 18 12 21 12 21 C12 21 5 18 5 13 Z M11 7 L12 10 L8 12 L9 13.5 L13 15 M7 11 L17 15 M14 11.5 L13 14',
    accent: 'M12 12 C13 11 15 11 16 12 C17 13 16 14 15 14 Z',
  },

  // 11. 사르고: 타오르는 태양 원반과 사막의 곡도
  sargon: {
    primary:
      'M6 19 C8 15 12 12 17 12 M7 18 L8 20 M18 19 C16 15 12 12 7 12 M17 18 L16 20 M12 14 V19 M12 2.5 V3.5 M7 8 H8 M16 8 H17 M8.5 4.5 L9.2 5.2 M15.5 4.5 L14.8 5.2',
    accent: 'M12 4.5 A 3.5 3.5 0 1 0 12 11.5 A 3.5 3.5 0 1 0 12 4.5 Z',
  },

  // 12. 림 빌리톤: 광부의 곡괭이와 거대 육상함 톱니바퀴
  rim_billiton: {
    primary:
      'M6 19 L15 10 M14 9 L17 12 M18 19 L9 10 M10 9 L7 12 M12 7 V8.5 M12 19.5 V21 M5 14 H6.5 M17.5 14 H19 M10 11 C9 7 9 4 10.5 3 C11.5 4 11 7 11 10 M14 11 C15 7 15 4 13.5 3 C12.5 4 13 7 13 10',
    accent: 'M12 9.5 A 4.5 4.5 0 1 0 12 18.5 A 4.5 4.5 0 1 0 12 9.5 Z',
  },

  // 13. 용문: 근위국의 비룡과 황금 엽전
  lungmen: {
    primary:
      'M9 6 L12 4 L15 6 L14 8 H10 Z M9 8 C7 10 6 13 6 16 M15 8 C17 10 18 13 18 16 M10.5 11.5 H13.5 V14.5 H10.5 Z',
    accent: 'M12 6.5 A 6.5 6.5 0 1 0 12 19.5 A 6.5 6.5 0 1 0 12 6.5 Z',
  },

  // 14. 카즈델: 부서진 뿔과 피의 흑요석 관
  kazdel: {
    primary:
      'M10 15 C8 13 5 9 6 4 C7 6 9 10 11 12 M14 15 C16 13 19 9 18 4 C17 6 15 10 13 12 M12 6 L11.5 9 L13 12 L11 15 L12 20 M7 17 L8.5 15 L10 17 M14 17 L15.5 15 L17 17',
    accent: 'M11 10 L13 12 L11 14 Z',
  },

  // 15. 쉐라그: 성산의 종과 만년설 설봉
  kjerag: {
    primary:
      'M7 16 L12 5 L17 16 M10 10 L12 11 L14 10 M3 17 L7 11 L9 14 M15 14 L17 11 L21 17 M10 13 H14 V17 C14 18 10 18 10 17 Z M12 18 V19.5 M2 19 H22',
    accent: 'M12 7 L14 10 H10 Z',
  },

  // 16. 로도스 아일랜드: 방주 육상함과 체스의 흑백 나이트 (기본/폴백)
  rhodes_island: {
    primary:
      'M7 16 L9 13 L8 12 L11 9 L13 6 L14 7 L14 10 C16 12 17 15 17 19 H7 Z M5 20 H19 L17 17',
    accent: 'M10.5 11.5 A 1 1 0 1 0 10.5 9.5 A 1 1 0 1 0 10.5 11.5 Z',
  },
};

/**
 * NationInsignia 컴포넌트
 * 테라 15개 국가 및 로도스 아일랜드의 고유 벡터 SVG 인시그니아 심볼을 렌더링합니다.
 */
export const NationInsignia: React.FC<NationInsigniaProps> = ({
  nationId,
  size = 'md',
  variant = 'duotone',
  accentColor,
  'aria-label': ariaLabelProp,
  title,
  className = '',
  ...svgProps
}) => {
  const titleId = useId();
  const normalizedId = resolveNationId(nationId);
  const visualIdentity = NATION_VISUAL_IDENTITIES[normalizedId] || NATION_VISUAL_IDENTITIES.rhodes_island;
  const paths = NATION_SVG_PATHS[normalizedId] || NATION_SVG_PATHS.rhodes_island;

  // 크기 계산 (프리셋 또는 숫자 픽셀)
  const isPresetSize = typeof size === 'string' && size in SIZE_MAP;
  const pixelSize = isPresetSize ? SIZE_MAP[size as InsigniaSize].px : Number(size) || 24;
  const sizeClass = isPresetSize ? SIZE_MAP[size as InsigniaSize].tw : '';

  // 접근성 레이블 결정
  const effectiveAriaLabel = ariaLabelProp || title || `${visualIdentity.nameKo} 인시그니아 심볼 (${visualIdentity.insigniaTitle})`;
  const effectiveTitle = title || visualIdentity.insigniaTitle;

  // 뱃지 모드 래퍼 클래스
  const badgeClasses =
    variant === 'badge'
      ? 'inline-flex items-center justify-center p-1.5 rounded-lg border border-nation-border/40 bg-nation-surface/60 shadow-sm transition-all duration-200'
      : 'inline-flex items-center justify-center';

  return (
    <span
      className={`${badgeClasses} ${className}`}
      title={effectiveTitle}
    >
      <svg
        role="img"
        aria-labelledby={titleId}
        aria-label={effectiveAriaLabel}
        viewBox="0 0 24 24"
        width={pixelSize}
        height={pixelSize}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${sizeClass} shrink-0 transition-colors duration-200`}
        {...svgProps}
      >
        <title id={titleId}>{effectiveAriaLabel}</title>

        {/* 보조 악센트/내부 채움 경로 (duotone 모드 지원) */}
        {variant !== 'monochrome' && paths.accent && (
          <path
            d={paths.accent}
            fill={accentColor || 'currentColor'}
            fillOpacity={variant === 'duotone' ? 0.2 : 0.35}
            stroke="none"
          />
        )}

        {/* 기본 외곽선 및 주요 기하학 경로 */}
        <path
          d={paths.primary}
          fill="none"
          stroke="currentColor"
        />
      </svg>
    </span>
  );
};

export default NationInsignia;
