// src/data/nations.ts
import { NationData } from '../types';

export const NATIONS_DATA: NationData[] = [
  {
    id: 'lungmen',
    name: '용문',
    nameEn: 'Lungmen',
    description: '웨이 옌우 총독이 다스리는 테라 최대의 독립 상업 이동도시. 막대한 자본과 엄격한 치안(근위국)을 자랑하지만, 빈민가의 그늘이 짙습니다.',
    capital: '용문 상부 코어',
    dominantRaces: ['펠린', '루포', '불포', '우르수스'],
    factions: ['용문 근위국', '웨이 옌우 총독부', '흑방(슬럼가)'],
    specialty: '상업 무역 및 고수익 의뢰 (LMD 획득량 +20%)',
    riskLevel: '경계'
  },
  {
    id: 'ursus',
    name: '우르수스 제국',
    nameEn: 'Ursus',
    description: '황제군과 귀족 군벌들이 지배하는 혹한의 군국주의 제국. 잔혹한 감염자 격리 광산과 끝없는 억압으로 인해 반란의 불씨가 타오르고 있습니다.',
    capital: '상트페테르부르크 이동수도',
    dominantRaces: ['우르수스', '포르테', '살카즈'],
    factions: ['우르수스 황제군', '체르노보그 수비대', '리유니온 무브먼트'],
    specialty: '혹독한 신체 단련 및 중화기 (체력/전투력 보너스, 감염 위험 높음)',
    riskLevel: '극도로 위험'
  },
  {
    id: 'victoria',
    name: '빅토리아',
    nameEn: 'Victoria',
    description: '증기 기관의 심장 런디니움을 품은 유서 깊은 열강. 왕위 공백과 대공작들의 암투, 그리고 살카즈 군사위원회의 침공으로 혼란에 빠져 있습니다.',
    capital: '런디니움',
    dominantRaces: ['펠린', '아슬란', '드라코', '카프리니'],
    factions: ['빅토리아 정규군', '글래스고 파벌', '살카즈 군사위원회', '런디니움 자치단'],
    specialty: '증기 기사 공학과 귀족 정계 (최고급 장비 및 무기 조달)',
    riskLevel: '위험'
  },
  {
    id: 'columbia',
    name: '컬럼비아',
    nameEn: 'Columbia',
    description: '자유와 개척, 첨단 자본주의의 신흥 공화국. 라인 랩의 생명공학과 블랙스틸의 민간 군사 기업들이 번영을 견인합니다.',
    capital: '트리몬트',
    dominantRaces: ['리베리', '페로', '펠린', '포르테'],
    factions: ['라인 생명 (Rhine Lab)', '블랙스틸 (Blacksteel)', '컬럼비아 개척단'],
    specialty: '첨단 오리지늄 과학 및 최신 총기 (기술 판정 우대)',
    riskLevel: '경계'
  },
  {
    id: 'kazdel',
    name: '카즈델',
    nameEn: 'Kazdel',
    description: '수천 년 동안 파괴와 재건을 반복한 살카즈들의 폐허이자 용병들의 고향. 법도 질서도 없으며, 오직 아츠의 힘과 검만이 통합니다.',
    capital: '폐허의 카즈델',
    dominantRaces: ['살카즈'],
    factions: ['살카즈 군사위원회 (테레시스)', '바벨 (테레시아)', '자유 용병 길드'],
    specialty: '피비린내 나는 전장 (아츠 적성 급성장, 상시 생존 위기)',
    riskLevel: '극도로 위험'
  },
  {
    id: 'laterano',
    name: '라테라노',
    nameEn: 'Laterano',
    description: '교황청과 성스러운 율법이 지배하는 천상의 도시. 달콤한 디저트와 축제가 가득하며, 산크타들의 수호총 사격술이 절대적인 평화를 수호합니다.',
    capital: '라테라노 성도',
    dominantRaces: ['산크타', '리베리'],
    factions: ['라테라노 교황청', '공증소', '사도 순찰대'],
    specialty: '수호총 수리 및 정신적 안식 (이성 소모 감소)',
    riskLevel: '안전'
  },
  {
    id: 'iberia',
    name: '이베리아',
    nameEn: 'Iberia',
    description: '한때 번영했던 황금의 해양 왕국이었으나, 대침묵(The Profound Silence) 이후 쇠락하여 종교재판소의 공포 정치와 바다의 침식에 신음합니다.',
    capital: '그란파로스',
    dominantRaces: ['리베리', '에기르'],
    factions: ['이베리아 종교재판소 (재판관)', '등대 수호대', '심해의 교단'],
    specialty: '심해 유물 발굴 (초고위험 시본 조우율)',
    riskLevel: '극도로 위험'
  },
  {
    id: 'kazimierz',
    name: '카시미어',
    nameEn: 'Kazimierz',
    description: '고귀했던 기사도가 상업연합회의 자본주의 스포츠 쇼(기사 메이저 대회)로 변질된 나라. 화려한 네온사인 아래 감염자 기사들이 피를 흘립니다.',
    capital: '카바레리에키',
    dominantRaces: ['쿠란타', '펠린'],
    factions: ['카시미어 상업연합회', '기사협회', '감염자 피나카 기사단'],
    specialty: '기사 메이저 토너먼트 (승부 결투 및 거액의 상금)',
    riskLevel: '경계'
  },
  {
    id: 'sami',
    name: '사미',
    nameEn: 'Sami',
    description: '설원과 원시림이 우거진 극북의 땅. 설산 깊은 곳의 사이클롭스 점술가들과 스노우프리스트들이 남하하는 미지의 붕괴체(데몬)를 막아서고 있습니다.',
    capital: '사미 성림',
    dominantRaces: ['엘라피아', '아나티', '살카즈(사이클롭스)'],
    factions: ['스노우프리스트 연합', '북방 방어선', '사이클롭스 예언단'],
    specialty: '원초의 주술과 설원 생존술 (정신력 및 자연 직관)',
    riskLevel: '위험'
  },
  {
    id: 'kjerag',
    name: '쉐라그',
    nameEn: 'Kjerag',
    description: '눈 덮인 성산에 둘러싸인 천혜의 요새. 실버애쉬 가문의 카란 무역회사가 주도하는 근대화 개혁과 만주원의 전통 신앙이 공존합니다.',
    capital: '투리스',
    dominantRaces: ['펠린', '카프리니', '이테라'],
    factions: ['카란 무역회사 (실버애쉬)', '만주원', '성산 경비대'],
    specialty: '만년설 온천 요양 및 철도 무역 (안정적인 체력 회복)',
    riskLevel: '안전'
  },
  {
    id: 'siracusa',
    name: '시라쿠사',
    nameEn: 'Siracusa',
    description: '12개 마피아 패밀리가 정부와 법 위에 군림하는 회색빛 도시. 오페라와 에스프레소의 향기 뒤편에서 끝없는 피의 복수극이 벌어집니다.',
    capital: '볼시니',
    dominantRaces: ['루포', '펠린'],
    factions: ['벨로네 패밀리', '살루초 패밀리', '시라쿠사 사법부'],
    specialty: '암살 청부 및 뒷골목 카르텔 (치명타 및 무기 거래)',
    riskLevel: '위험'
  },
  {
    id: 'yan',
    name: '염국',
    nameEn: 'Yan',
    description: '수천 년의 역사를 자랑하는 거대한 동방 제국. 고대 신적 존재인 수이(Sui)의 열두 파편들과 사법기관인 대리(司)가 국가의 운명을 조율합니다.',
    capital: '백수(상경)',
    dominantRaces: ['용(드라코/불포 계통)', '페로', '펠린'],
    factions: ['대리 (사법부)', '염국 사령관부', '수이의 권속들'],
    specialty: '동방 무협 및 내공 아츠 (극상의 심신 조화)',
    riskLevel: '안전'
  }
];
