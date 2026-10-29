// src/data/careers.ts
import { SpecialCareer } from '../types';

export const SPECIAL_CAREERS_DATA: SpecialCareer[] = [
  {
    id: 'abyssal_hunter',
    name: '어비설 헌터스 (Abyssal Hunter)',
    rank: '심해의 사냥꾼',
    description: '에기르의 비밀 연구진에 의해 해사(Seaborne)의 유전 인자를 이식받은 초인 전사. 바다의 괴수들을 단신으로 베어 넘기는 압도적 신체 능력을 지닙니다.',
    loreSecret: '그들의 칼날은 뼈와 살을 가르고, 그들의 피는 해사를 끌어당기지만 결코 바다에 굴복하지 않습니다.',
    category: 'combat',
    allowedRaces: ['에기르'],
    reqMinStats: { combat: 80, health: 75 }
  },
  {
    id: 'gun_executor',
    name: '라테라노 건 익제큐터 (Gun Executor)',
    rank: '공증소 제5청 집행관',
    description: '라테라노 교황청 공증소 소속의 특수 사법 집행관. 성스러운 율법을 위반한 자들을 정밀 수호총 연사로 심판합니다.',
    loreSecret: '그들의 머리 위 광륜은 언제나 서늘하게 빛나며, 규율에 위배되는 어떤 감정도 허락하지 않습니다.',
    category: 'combat',
    allowedRaces: ['산크타'],
    reqMinStats: { combat: 75, intellect: 68 }
  },
  {
    id: 'radiant_knight',
    name: '카시미어 광휘의 기사 (Radiant Knight)',
    rank: '메이저 챔피언 기사',
    description: '카바레리에키 스타디움을 뒤흔드는 기사 메이저 토너먼트의 정점. 수만 관중의 열광과 막대한 스폰서십을 한 몸에 받는 슈퍼스타.',
    loreSecret: '자본과 스포트라이트 뒤편에서, 진정한 기사도의 이상을 가슴에 품고 싸웁니다.',
    category: 'combat',
    allowedNations: ['카시미어'],
    reqMinStats: { combat: 80, wealth: 3500 }
  },
  {
    id: 'rhine_director',
    name: '라인 랩 총괄 디렉터 (Rhine Lab Section Director)',
    rank: '특수 프로젝트 수석 주임',
    description: '컬럼비아 라인 생명의 연구 부서를 총괄하며 금단의 생체 공학 및 오리지늄 구조학을 지휘하는 천재 과학자.',
    loreSecret: '트리몬트의 연구실 깊은 곳에서 테라의 천공 너머를 응시하는 비밀 프로젝트를 진행합니다.',
    category: 'intellect',
    allowedNations: ['컬럼비아'],
    reqMinStats: { intellect: 82, artsAptitude: 65 }
  },
  {
    id: 'yan_censor',
    name: '염국 대리 사법 감찰사 (Yan High Censorate)',
    rank: '대리 정3품 감찰관',
    description: '황제의 직속 사법기관 대리(司)의 특파 감찰관. 각 주의 관리들을 사찰하고 수이(Sui)의 준동을 감시하는 암행의 칼날.',
    loreSecret: '동방의 유구한 법도와 내공 아츠를 품고, 나라를 뒤흔들려는 거대한 음모를 추적합니다.',
    category: 'intellect',
    allowedNations: ['염국'],
    reqMinStats: { intellect: 80, combat: 68 }
  },
  {
    id: 'steam_knight',
    name: '빅토리아 증기기사 (Victoria Steam Knight)',
    rank: '런디니움 제식 거병',
    description: '빅토리아의 전설적인 고대 증기기사 중장갑을 가동하여 전선을 단신으로 돌파하는 강철의 거인.',
    loreSecret: '증기 기관의 심장에서 뿜어져 나오는 굉음은 빅토리아 기사단의 마지막 긍지입니다.',
    category: 'combat',
    allowedNations: ['빅토리아'],
    allowedRaces: ['아슬란', '드라코', '펠린', '우르수스'],
    reqMinStats: { combat: 84, health: 82 }
  },
  {
    id: 'emperors_blade',
    name: '우르수스 황제의 검 (Emperor\'s Blade)',
    rank: '황실 친위 내위',
    description: '우르수스 황제의 명령만을 따르는 그림자 친위대. 극북의 악마(붕괴체)를 갑주에 봉인하여 검은 안개를 다룹니다.',
    loreSecret: '그들이 걷는 자리는 검은 안개로 뒤덮이며, 대지의 어떤 군대도 감히 그들과 마주 서지 못합니다.',
    category: 'special',
    allowedNations: ['우르수스 제국'],
    allowedRaces: ['우르수스'],
    reqMinStats: { combat: 85, intellect: 72 }
  },
  {
    id: 'siracusa_capo',
    name: '시라쿠사 패밀리 카포 (Siracusa Capo)',
    rank: '패밀리 최고 간부',
    description: '볼시니 12개 마피아 패밀리의 핵심 실력자. 암살, 무기 밀수, 사법 거래를 총괄하며 밤의 거리를 지배합니다.',
    loreSecret: '에스프레소 한 잔과 품위 있는 슈트 뒤에 수많은 정적들의 피가 묻어 있습니다.',
    category: 'special',
    allowedNations: ['시라쿠사'],
    allowedRaces: ['루포', '펠린'],
    reqMinStats: { combat: 76, wealth: 4500 }
  },
  {
    id: 'rhodes_elite',
    name: '로도스 아일랜드 엘리트 오퍼레이터 (Elite Operator)',
    rank: '로도스 최고위 작전 지휘관',
    description: '아미야와 켈시의 전폭적인 신뢰를 받는 로도스의 최상위 오퍼레이터. 테라 각지의 결전에 단독 투입되어 불가능을 가능케 합니다.',
    loreSecret: '감염자 치료의 희망과 인류 구원의 이상을 두 어깨에 짊어진 채 전선에 섭니다.',
    category: 'special',
    reqMinReputation: { '로도스 아일랜드': 55 },
    reqMinStats: { combat: 78, artsAptitude: 75 }
  },
  {
    id: 'sarkaz_court',
    name: '살카즈 왕정 군사위원 (Sarkaz Royal Court Officer)',
    rank: '군사위원회 특수 사령관',
    description: '테레시스 군사위원회의 부름을 받아 카즈델의 비원과 살카즈 민족의 부흥을 위해 전장에 서는 마족 장교.',
    loreSecret: '고대 주술의 피와 복수심으로 가득 차 있으며, 적들에게 원초의 공포를 선사합니다.',
    category: 'arts',
    allowedRaces: ['살카즈'],
    reqMinStats: { artsAptitude: 80, combat: 75 }
  },
  {
    id: 'sami_snowpriest',
    name: '사미 설원 스노우프리스트 (Sami Snowpriest)',
    rank: '성림 결계사',
    description: '극북 사미의 만년설 너머에서 침식해오는 붕괴체를 결계로 막아서며, 자연의 원초적 영령과 교감하는 사제.',
    loreSecret: '설원의 얼어붙은 안개 속에서 고대의 예언을 읽고 대륙의 멸망을 홀로 경계합니다.',
    category: 'arts',
    allowedNations: ['사미'],
    allowedRaces: ['엘라피아', '살카즈'],
    reqMinStats: { artsAptitude: 78, sanity: 72 }
  },
  {
    id: 'karlan_captain',
    name: '쉐라그 카란 무역 경호대장 (Karlan Captain)',
    rank: '카란 무역 총괄 경호관',
    description: '엔시오데스 실버애쉬의 충실한 심복이자 현대화된 쉐라그 사병 조직을 이끄는 지휘관.',
    loreSecret: '만년설 성산의 전통 보수파와의 암투 속에서 가문의 원대한 이상을 지키기 위해 무력을 행사합니다.',
    category: 'special',
    allowedNations: ['쉐라그'],
    reqMinStats: { combat: 74, intellect: 74 }
  }
];
