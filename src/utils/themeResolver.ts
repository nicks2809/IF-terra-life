// src/utils/themeResolver.ts
import { NationThemeId, NationVisualIdentity } from '../types';
import { NATION_VISUAL_IDENTITIES } from '../data/nationThemes';

const RAW_NATION_MAP: Record<string, NationThemeId> = {
  // 빅토리아
  '빅토리아': 'victoria',
  'victoria': 'victoria',
  'Victoria': 'victoria',

  // 염국
  '염국': 'yan',
  'yan': 'yan',
  'Yan': 'yan',

  // 우르수스
  '우르수스 제국': 'ursus',
  '우르수스': 'ursus',
  'ursus': 'ursus',
  'Ursus': 'ursus',

  // 카시미어
  '카시미어': 'kazimierz',
  'kazimierz': 'kazimierz',
  'Kazimierz': 'kazimierz',

  // 컬럼비아
  '컬럼비아': 'columbia',
  'columbia': 'columbia',
  'Columbia': 'columbia',

  // 이베리아
  '이베리아': 'iberia',
  'iberia': 'iberia',
  'Iberia': 'iberia',

  // 라테라노
  '라테라노': 'laterano',
  'laterano': 'laterano',
  'Laterano': 'laterano',

  // 라이타니엔
  '라이타니엔': 'leithanien',
  'leithanien': 'leithanien',
  'Leithanien': 'leithanien',

  // 사미
  '사미': 'sami',
  'sami': 'sami',
  'Sami': 'sami',

  // 시라쿠사
  '시라쿠사': 'siracusa',
  'siracusa': 'siracusa',
  'Siracusa': 'siracusa',

  // 사르고 / 사르곤
  '사르고': 'sargon',
  '사르곤': 'sargon',
  'sargon': 'sargon',
  'Sargon': 'sargon',

  // 림 빌리톤
  '림 빌리톤': 'rim_billiton',
  '림빌리톤': 'rim_billiton',
  'rim_billiton': 'rim_billiton',
  'Rim Billiton': 'rim_billiton',
  'rim-billiton': 'rim_billiton',

  // 보조 및 특수 지역
  '용문': 'lungmen',
  'lungmen': 'lungmen',
  'Lungmen': 'lungmen',

  '카즈델': 'kazdel',
  'kazdel': 'kazdel',
  'Kazdel': 'kazdel',

  '쉐라그': 'kjerag',
  'kjerag': 'kjerag',
  'Kjerag': 'kjerag',

  // 로도스 아일랜드 (기본값)
  '로도스 아일랜드': 'rhodes_island',
  '로도스': 'rhodes_island',
  'rhodes_island': 'rhodes_island',
  'Rhodes Island': 'rhodes_island'
};

/**
 * Prototype pollution 및 Object prototype 상속 누수를 방지하기 위해 null 프로토타입 객체로 생성 및 동결합니다.
 */
const NATION_MAP: Readonly<Record<string, NationThemeId>> = Object.freeze(
  Object.assign(Object.create(null), RAW_NATION_MAP)
);

/**
 * 한글 국명 또는 영문 ID를 정규화하여 표준 NationThemeId로 반환합니다.
 * 미매칭 시 기본 테마인 'rhodes_island'로 폴백합니다.
 */
export function resolveNationId(nationNameOrId?: string): NationThemeId {
  if (!nationNameOrId) return 'rhodes_island';
  const clean = nationNameOrId.trim();
  if (!clean) return 'rhodes_island';
  
  // 1. 직접 일치 (Own property 검증)
  if (Object.prototype.hasOwnProperty.call(NATION_MAP, clean)) {
    return NATION_MAP[clean];
  }

  // 2. 소문자 일치 (Own property 검증)
  const lower = clean.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(NATION_MAP, lower)) {
    return NATION_MAP[lower];
  }

  // 3. 부분 문자열 검색 (고유 키 목록 대상)
  const matchedKey = Object.keys(NATION_MAP).find(k => clean.includes(k) || lower.includes(k.toLowerCase()));
  if (matchedKey && Object.prototype.hasOwnProperty.call(NATION_MAP, matchedKey)) {
    return NATION_MAP[matchedKey];
  }

  return 'rhodes_island';
}

/**
 * 주어진 국명 또는 ID에 해당하는 정밀 비주얼 정체성 메타데이터를 반환합니다.
 */
export function getNationVisualIdentity(nationNameOrId?: string): NationVisualIdentity {
  const id = resolveNationId(nationNameOrId);
  return NATION_VISUAL_IDENTITIES[id] || NATION_VISUAL_IDENTITIES.rhodes_island;
}
