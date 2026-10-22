// src/data/races.ts
import { RaceData } from '../types';

export const RACES_DATA: RaceData[] = [
  {
    id: 'sarkaz',
    name: '살카즈',
    nameEn: 'Sarkaz',
    subRaces: ['웬디고', '뱀파이어', '나흐체러', '밴시', '가고일', '골리앗', '아난타'],
    description: '고대 마족의 후예. 테라 전역에서 박해와 편견을 받지만, 원초의 아츠 친화력과 질긴 생명력을 지녔습니다.',
    lore: '카즈델의 불타는 폐허에서 태어난 이들은 태생적으로 오리지늄에 강하게 공명하지만, 그만큼 광석병의 저주에 쉽게 노출됩니다.',
    avatarIcon: 'horns',
    baseStats: {
      health: 85,
      maxHealth: 85,
      sanity: 60,
      maxSanity: 60,
      wealth: 300,
      combat: 65,
      artsAptitude: 70,
      intellect: 45,
      luck: 35,
    },
    traits: [
      {
        id: 'sarkaz_blood',
        name: '원초의 혈맥',
        description: '오리지늄 아츠 친화력 대폭 증가, 전투 시 아츠 위력 1.3배',
        statBonus: { artsAptitude: 15, combat: 5 },
        artsMultiplierBonus: 0.3,
        oripathyRiskBonus: 0.25,
      }
    ]
  },
  {
    id: 'sankta',
    name: '산크타',
    nameEn: 'Sankta',
    subRaces: ['교황청 직속', '수호총 수호병', '율법 순찰관'],
    description: '라테라노의 천사 종족. 머리 위에 빛나는 광륜(Halo)과 날개를 지니며, 계율(The Law)로 서로의 감정을 공감합니다.',
    lore: '고도의 오리지늄 화기(수호총)를 독점 운용하며, 높은 정신적 안정성과 감각적 사격 능력을 자랑합니다.',
    avatarIcon: 'halo',
    baseStats: {
      health: 65,
      maxHealth: 65,
      sanity: 85,
      maxSanity: 85,
      wealth: 1200,
      combat: 60,
      artsAptitude: 55,
      intellect: 60,
      luck: 60,
    },
    traits: [
      {
        id: 'sankta_law',
        name: '공감각과 율법',
        description: '이성 최대치 증가, 수호총 사용 가능, 산크타 동족 처치 시 타락 위험',
        statBonus: { sanity: 15, intellect: 10 },
      }
    ]
  },
  {
    id: 'kuranta',
    name: '쿠란타',
    nameEn: 'Kuranta',
    subRaces: ['페가수스', '나이트메어', '평원 혈통'],
    description: '말 종족. 카시미어 기사도의 주축이자 뛰어난 기동성과 우직한 체력을 자랑하는 전사들입니다.',
    lore: '초원을 달리던 선조들의 피를 이어받아, 결투와 기동전에서 압도적인 반사신경과 선공권을 발휘합니다.',
    avatarIcon: 'horse',
    baseStats: {
      health: 80,
      maxHealth: 80,
      sanity: 70,
      maxSanity: 70,
      wealth: 800,
      combat: 65,
      artsAptitude: 45,
      intellect: 50,
      luck: 55,
    },
    traits: [
      {
        id: 'kuranta_dash',
        name: '질풍의 기동',
        description: '전투 회피율 및 기동 판정 주사위 +10 보너스',
        statBonus: { combat: 10, health: 5 },
      }
    ]
  },
  {
    id: 'lupo',
    name: '루포',
    nameEn: 'Lupo',
    subRaces: ['시라쿠사 늑대', '황야 늑대'],
    description: '늑대 종족. 시라쿠사 마피아 사회의 핵심을 이루며, 날카로운 직관과 단독 생존 본능을 갖추었습니다.',
    lore: '피의 유대와 패밀리의 규율에 얽매이기 쉬우며, 사냥감의 숨통을 끊는 치명타에 특화되어 있습니다.',
    avatarIcon: 'wolf',
    baseStats: {
      health: 75,
      maxHealth: 75,
      sanity: 65,
      maxSanity: 65,
      wealth: 600,
      combat: 70,
      artsAptitude: 40,
      intellect: 55,
      luck: 45,
    },
    traits: [
      {
        id: 'lupo_instinct',
        name: '무리 사냥꾼',
        description: '치명타 확률 +15%, 암살 및 기습 주사위 판정 보정',
        statBonus: { combat: 10, luck: 5 },
      }
    ]
  },
  {
    id: 'feline',
    name: '펠린',
    nameEn: 'Feline',
    subRaces: ['빅토리아 혈통', '용문 혈통', '사막 혈통'],
    description: '고양이과 종족. 테라 전역에 가장 널리 퍼져 있으며, 유연한 신체와 뛰어난 도심 적응력을 지녔습니다.',
    lore: '민첩한 반사신경과 호기심으로 어디서든 은밀히 숨어들거나 도망치는 데 일가견이 있습니다.',
    avatarIcon: 'cat',
    baseStats: {
      health: 70,
      maxHealth: 70,
      sanity: 75,
      maxSanity: 75,
      wealth: 700,
      combat: 55,
      artsAptitude: 55,
      intellect: 60,
      luck: 60,
    },
    traits: [
      {
        id: 'feline_agility',
        name: '도약과 은신',
        description: '위기 도주 판정 성공률 +20%, 도심 밀수 및 정보 수집 보너스',
        statBonus: { intellect: 5, luck: 10 },
      }
    ]
  },
  {
    id: 'aegir',
    name: '에기르',
    nameEn: 'Aegir',
    subRaces: ['심해 기술자', '해안 거주민'],
    description: '초고대 해양 문명에서 유래한 종족. 경이로운 신체 능력과 질병 저항력을 지니고 있으나, 오리지늄 아츠를 쓰지 못합니다.',
    lore: '광석병에 거의 걸리지 않는 완벽에 가까운 생체 구조를 지녔지만, 바다 저편의 시본(해사)의 부름에 정신을 위협받습니다.',
    avatarIcon: 'fish',
    baseStats: {
      health: 95,
      maxHealth: 95,
      sanity: 55,
      maxSanity: 55,
      wealth: 1000,
      combat: 80,
      artsAptitude: 0, // 아츠 불모지
      intellect: 70,
      luck: 40,
    },
    traits: [
      {
        id: 'aegir_body',
        name: '초월적 신체',
        description: '전투력 +20, 매 턴 체력 자연 회복, 단 아츠 적성 0 고정',
        statBonus: { combat: 20, health: 15 },
        oripathyRiskBonus: -0.5,
      }
    ]
  },
  {
    id: 'ursus',
    name: '우르수스',
    nameEn: 'Ursus',
    subRaces: ['북방 설원 혈통', '제국 황제군 혈통'],
    description: '곰 종족. 혹독한 북방 대제국 우르수스의 주인들로, 거대한 체격과 무시무시한 근력을 지녔습니다.',
    lore: '차가운 보드카와 끝없는 노동, 전장의 포화 속에서도 굴하지 않는 강철 같은 체력을 발휘합니다.',
    avatarIcon: 'bear',
    baseStats: {
      health: 95,
      maxHealth: 95,
      sanity: 60,
      maxSanity: 60,
      wealth: 500,
      combat: 75,
      artsAptitude: 40,
      intellect: 40,
      luck: 45,
    },
    traits: [
      {
        id: 'ursus_strength',
        name: '설원의 거한',
        description: '최대 체력 +25%, 물리 타격 저항 및 혹한 내성',
        statBonus: { health: 20, combat: 10 },
      }
    ]
  },
  {
    id: 'liberi',
    name: '리베리',
    nameEn: 'Liberi',
    subRaces: ['이베리아 혈통', '라테라노 조류', '컬럼비아 혈통'],
    description: '조류 종족. 넓은 시야와 민첩한 비행 감각, 날렵한 공격 템포를 지니고 있습니다.',
    lore: '이베리아의 황폐한 해안선부터 컬럼비아의 마천루까지 폭넓게 적응하며 자유를 갈망합니다.',
    avatarIcon: 'bird',
    baseStats: {
      health: 68,
      maxHealth: 68,
      sanity: 70,
      maxSanity: 70,
      wealth: 750,
      combat: 60,
      artsAptitude: 55,
      intellect: 60,
      luck: 60,
    },
    traits: [
      {
        id: 'liberi_vision',
        name: '매의 눈',
        description: '원거리 명중률 +20%, 선제 공격권 획득 확률 증가',
        statBonus: { combat: 5, intellect: 10 },
      }
    ]
  },
  {
    id: 'forte',
    name: '포르테',
    nameEn: 'Forte',
    subRaces: ['미노스 혈통', '철강 장인'],
    description: '소 종족. 우직하고 성실하며, 단단한 뿔과 바위 같은 인내력으로 중장갑 방어에 능합니다.',
    lore: '대장장이, 광부, 중장 방패병으로 활약하며 어떤 거센 충격도 정면에서 버텨냅니다.',
    avatarIcon: 'bull',
    baseStats: {
      health: 90,
      maxHealth: 90,
      sanity: 75,
      maxSanity: 75,
      wealth: 600,
      combat: 60,
      artsAptitude: 40,
      intellect: 50,
      luck: 50,
    },
    traits: [
      {
        id: 'forte_shield',
        name: '철벽의 육신',
        description: '받는 물리 피해 20% 감소, 기절 및 넉백 저항',
        statBonus: { health: 15, combat: 5 },
      }
    ]
  },
  {
    id: 'caprinae',
    name: '카프리니',
    nameEn: 'Caprinae',
    subRaces: ['라이타니엔 음악가', '탑의 주술사'],
    description: '염소 종족. 라이타니엔의 클래식 음악과 음률 아츠에 천부적인 재능을 타고난 학자 종족입니다.',
    lore: '음표와 주파수를 통해 복합 오리지늄 아츠를 연산하며, 우아하고 치명적인 마법을 구사합니다.',
    avatarIcon: 'goat',
    baseStats: {
      health: 60,
      maxHealth: 60,
      sanity: 80,
      maxSanity: 80,
      wealth: 900,
      combat: 45,
      artsAptitude: 80,
      intellect: 75,
      luck: 50,
    },
    traits: [
      {
        id: 'caprinae_resonance',
        name: '음률의 조율',
        description: '아츠 공격력 +20%, 복합 주문 영창 속도 증가',
        statBonus: { artsAptitude: 20, intellect: 10 },
      }
    ]
  },
  {
    id: 'elafia',
    name: '엘라피아',
    nameEn: 'Elafia',
    subRaces: ['사미 원시 사제', '빅토리아 귀족'],
    description: '사슴 종족. 깊은 숲과 설원의 정령 신앙을 간직하고 있으며, 치유와 영적 감응에 특화되어 있습니다.',
    lore: '정신적 스트레스에 강하고 자연의 흐름을 읽어 재앙의 징조를 미리 감지합니다.',
    avatarIcon: 'deer',
    baseStats: {
      health: 70,
      maxHealth: 70,
      sanity: 85,
      maxSanity: 85,
      wealth: 700,
      combat: 50,
      artsAptitude: 65,
      intellect: 65,
      luck: 60,
    },
    traits: [
      {
        id: 'elafia_grace',
        name: '정령의 가호',
        description: '이성 회복력 증가, 재앙 조우 회피 주사위 +15 보정',
        statBonus: { sanity: 15, luck: 10 },
      }
    ]
  },
  {
    id: 'vulpo',
    name: '불포',
    nameEn: 'Vulpo',
    subRaces: ['염국 영물 여우', '사막 페넥 여우'],
    description: '여우 종족. 매혹적인 외모와 교활할 정도로 빠른 두뇌 회전, 암시장과 상업에서의 기민함을 지녔습니다.',
    lore: '재치 있는 언변으로 위기를 벗어나며, 행운과 정보 수집에서 발군의 능력을 보입니다.',
    avatarIcon: 'fox',
    baseStats: {
      health: 65,
      maxHealth: 65,
      sanity: 75,
      maxSanity: 75,
      wealth: 950,
      combat: 50,
      artsAptitude: 60,
      intellect: 75,
      luck: 75,
    },
    traits: [
      {
        id: 'vulpo_cunning',
        name: '영물 여우의 지혜',
        description: '사기 및 위기 모면 확률 대폭 상승, LMD 획득량 20% 증가',
        statBonus: { intellect: 15, luck: 15 },
      }
    ]
  },
  {
    id: 'draco',
    name: '드라코 (고대종)',
    nameEn: 'Draco',
    subRaces: ['빅토리아 정통 왕권'],
    description: '불꽃을 다루는 전설의 고대 용 종족. 출생 확률 0.5%의 극희귀 혈통입니다.',
    lore: '신화 속 정통 군주의 피를 이어받아, 파괴적인 화염 아츠와 만인을 압도하는 패왕의 기백을 품고 있습니다.',
    avatarIcon: 'dragon',
    baseStats: {
      health: 90,
      maxHealth: 90,
      sanity: 80,
      maxSanity: 80,
      wealth: 2000,
      combat: 85,
      artsAptitude: 90,
      intellect: 70,
      luck: 70,
    },
    traits: [
      {
        id: 'draco_flame',
        name: '제왕의 용염',
        description: '모든 아츠 공격이 화염 속성으로 강화, 아츠 대미지 1.5배',
        statBonus: { combat: 15, artsAptitude: 20 },
        artsMultiplierBonus: 0.5,
      }
    ]
  },
  {
    id: 'aslan',
    name: '아슬란 (고대종)',
    nameEn: 'Aslan',
    subRaces: ['황실 사자 혈통'],
    description: '빅토리아 황실을 지배하는 황금 사자 종족. 출생 확률 0.5%의 극희귀 혈통입니다.',
    lore: '위엄 있는 포효와 무쌍의 무예, 그리고 제국의 기사단을 호령하는 천부적인 통솔력을 타고납니다.',
    avatarIcon: 'lion',
    baseStats: {
      health: 95,
      maxHealth: 95,
      sanity: 85,
      maxSanity: 85,
      wealth: 2500,
      combat: 90,
      artsAptitude: 65,
      intellect: 80,
      luck: 70,
    },
    traits: [
      {
        id: 'aslan_majesty',
        name: '사자의 패도',
        description: '적 기절 확률 25%, 모든 전투 판정 주사위 +15 보정',
        statBonus: { combat: 20, health: 15 },
      }
    ]
  }
];
