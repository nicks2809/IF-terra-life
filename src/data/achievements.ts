// src/data/achievements.ts
import { Achievement } from '../types';

export const ACHIEVEMENTS_DATA: Achievement[] = [
  // ==========================================
  // 전설 (Legendary - 1000 Pts)
  // ==========================================
  {
    id: 'legend_dawn_of_terra',
    title: '새벽을 비추는 불꽃',
    description: '로도스 아일랜드 엘리트 오퍼레이터로서 메인 스토리의 모든 시련을 극복하고 대지의 새벽을 열다.',
    loreQuote: '"어둠이 아무리 깊어도, 새벽을 향해 걸어가는 이가 있는 한 불꽃은 꺼지지 않는다."',
    tier: 'Legendary',
    points: 1000,
    category: 'story',
    icon: 'flame'
  },
  {
    id: 'legend_babel_phantom',
    title: '바벨의 망령',
    description: '살카즈의 비극적인 역사와 마왕의 부름 속에서 카즈델의 비원을 가슴에 품다.',
    loreQuote: '"우리는 폐허 속에서 태어나, 폐허 속에서 죽는다. 그러나 우리의 노래는 끝나지 않으리라."',
    tier: 'Legendary',
    points: 1000,
    category: 'story',
    icon: 'crown'
  },
  {
    id: 'legend_ancient_observer',
    title: '고대 문명의 관측자',
    description: '트레버 프리스톤과 보존자의 기록을 열람하여 테라 이전 고대 인류의 흔적을 규명하다.',
    loreQuote: '"만 년의 세월 동안 별들은 침묵했으나, 우리는 여전히 이곳에 존재했음을 증명하노라."',
    tier: 'Legendary',
    points: 1000,
    category: 'secret',
    icon: 'eye'
  },
  {
    id: 'legend_living_myth',
    title: '테라의 살아있는 신화',
    description: '최종 종합 점수 8,000점 이상을 달성하여 테라 역사에 지워지지 않을 이름을 새기다.',
    loreQuote: '"역사서의 수많은 페이지 중, 단 한 사람의 이름이 대륙 전체의 방향을 바꾸었다."',
    tier: 'Legendary',
    points: 1000,
    category: 'survival',
    icon: 'sparkles'
  },

  // ==========================================
  // 유니크 (Unique - 500 Pts)
  // ==========================================
  {
    id: 'unique_abyssal_hunter',
    title: '심해의 은빛 칼날',
    description: '에기르의 개조 수술을 견뎌내고 해사(Seaborne)를 사냥하는 어비설 헌터스로 거듭나다.',
    loreQuote: '"우리는 심해를 걷는 자들이며, 바다의 공포에 맞서는 유일한 칼날이다."',
    tier: 'Unique',
    points: 500,
    category: 'career',
    icon: 'sword'
  },
  {
    id: 'unique_steam_knight_heart',
    title: '마지막 증기기사의 심장',
    description: '빅토리아 런디니움 결전에서 고대 증기기사 갑주를 가동하고 성벽을 사수하다.',
    loreQuote: '"증기가 식고 강철이 부서져도, 런디니움의 심장은 결코 멈추지 않는다."',
    tier: 'Unique',
    points: 500,
    category: 'career',
    icon: 'shield'
  },
  {
    id: 'unique_emperors_blade',
    title: '황제의 검: 검은 안개',
    description: '우르수스 황실 내위의 비밀 서약을 맺고 극북의 데몬 파편을 몸에 깃들이다.',
    loreQuote: '"황제의 국경은 칼끝이 닿는 곳까지. 안개 너머의 침묵은 우리만이 안다."',
    tier: 'Unique',
    points: 500,
    category: 'career',
    icon: 'skull'
  },
  {
    id: 'unique_lone_trail_sky',
    title: '하늘을 꿰뚫은 별',
    description: '컬럼비아 론 트레일 계획에 동참하여 거짓된 천공을 뚫고 우주의 진실을 마주하다.',
    loreQuote: '"저 위에 무엇이 있는지 두려워하지 말라. 우리는 별을 올려다보는 자들이다."',
    tier: 'Unique',
    points: 500,
    category: 'story',
    icon: 'rocket'
  },
  {
    id: 'unique_sami_daemon_slayer',
    title: '만년설의 데몬 슬레이어',
    description: '극북 사미의 설원에서 붕괴체의 남하를 저지하고 부족의 결계를 수호하다.',
    loreQuote: '"눈보라가 모든 소리를 집어삼킬 때, 전사의 도끼날만이 진실을 새긴다."',
    tier: 'Unique',
    points: 500,
    category: 'combat',
    icon: 'snowflake'
  },
  {
    id: 'unique_lmd_tycoon_max',
    title: '이동도시를 매입한 부호',
    description: '보유 자산 30,000 LMD를 돌파하여 대륙 금융가를 손아귀에 쥐다.',
    loreQuote: '"돈으로 살 수 없는 것이 테라에 있는가? 최소한 안전과 침묵은 살 수 있다."',
    tier: 'Unique',
    points: 500,
    category: 'survival',
    icon: 'coins'
  },

  // ==========================================
  // 미스틱 (Mystic - 300 Pts)
  // ==========================================
  {
    id: 'mystic_gun_executor',
    title: '라테라노 건 익제큐터',
    description: '공증소의 수호총 집행관이 되어 성스러운 계율과 율법의 집행을 도맡다.',
    loreQuote: '"탄환 하나에 계율 하나. 광륜 아래 방황하는 자에게 자비란 없다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'target'
  },
  {
    id: 'mystic_rhine_director',
    title: '라인 랩 총괄 디렉터',
    description: '컬럼비아 라인 생명의 주임 직책에 올라 금단의 오리지늄 생체 연구를 지휘하다.',
    loreQuote: '"진보에는 언제나 대가가 따른다. 우리는 그 대가를 치를 준비가 되어 있다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'dna'
  },
  {
    id: 'mystic_yan_high_censor',
    title: '염국 대리 사법 감찰사',
    description: '수이의 권속들의 준동을 감시하고 염국 대리의 사법령을 집행하다.',
    loreQuote: '"법은 만물을 비추는 거울이요, 사령관의 붓은 사악함을 베는 칼날이다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'scroll'
  },
  {
    id: 'mystic_siracusa_don',
    title: '시라쿠사의 대부 (Don)',
    description: '볼시니 12개 패밀리의 권력 투쟁을 평정하고 밤의 제왕으로 등극하다.',
    loreQuote: '"패밀리를 위해 흘린 피는 결코 헛되지 않다. 식사는 품위 있게, 복수는 조용하게."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'briefcase'
  },
  {
    id: 'mystic_frostnova_warmth',
    title: '눈꽃의 온기',
    description: '체르노보그에서 프로스트노바와의 비극적인 대치 중 따뜻한 온기와 유언을 나누다.',
    loreQuote: '"당신의 손이... 참 따뜻하네요. 부디 살아남아 새벽을 보아주세요."',
    tier: 'Mystic',
    points: 300,
    category: 'story',
    icon: 'heart'
  },
  {
    id: 'mystic_patriot_legacy',
    title: '순국자의 방패를 넘은 자',
    description: '테라 최후의 순혈 웬디고 대위 패트리어트의 숭고한 저항 정신을 기리다.',
    loreQuote: '"나의 방패는 무너졌으나, 감염자들의 행진은 멈추지 않을 것이다."',
    tier: 'Mystic',
    points: 300,
    category: 'story',
    icon: 'shield-alert'
  },
  {
    id: 'mystic_radiant_champion',
    title: '카시미어 광휘의 챔피언',
    description: '카바레리에키 기사 메이저 토너먼트 결승에서 우승 트로피를 들어올리다.',
    loreQuote: '"네온사인보다 눈부시게 빛나는 것은, 굴복하지 않는 기사의 의지다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'trophy'
  },
  {
    id: 'mystic_longevity_70',
    title: '고희(古稀)의 기적',
    description: '혹독한 테라의 환경 속에서 70세까지 천수를 누리며 생존하다.',
    loreQuote: '"대다수가 요절하는 대지에서 백발의 노인이 된다는 것은 그 자체로 경이로움이다."',
    tier: 'Mystic',
    points: 300,
    category: 'survival',
    icon: 'sun'
  },

  // ==========================================
  // 레어 (Rare - 150 Pts)
  // ==========================================
  {
    id: 'rare_arts_mastery',
    title: '고위 영창술사',
    description: '아츠 적성 90을 달성하여 복합 원소 오리지늄 주술을 자유자재로 구사하다.',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'sparkle'
  },
  {
    id: 'rare_iron_warlord',
    title: '백전노장의 무력',
    description: '물리 전투 숙련도 90을 달성하여 전장에서 홀로 부대를 격파하다.',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'swords'
  },
  {
    id: 'rare_grand_intellect',
    title: '정세의 책사',
    description: '지략 스탯 90을 달성하여 각국 수뇌부의 암투를 손바닥 보듯 꿰뚫어보다.',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'brain'
  },
  {
    id: 'rare_rhodes_specialist',
    title: '로도스 일등 정예 대원',
    description: '로도스 아일랜드 평판 60 이상을 달성하고 함선의 핵심 요원으로 인정받다.',
    tier: 'Rare',
    points: 150,
    category: 'career',
    icon: 'cross'
  },
  {
    id: 'rare_lungmen_captain',
    title: '용문 근위국 경감',
    description: '용문 평판 50 이상을 달성하고 특별 기동 순찰대를 지휘하다.',
    tier: 'Rare',
    points: 150,
    category: 'career',
    icon: 'badge'
  },
  {
    id: 'rare_karlan_trust',
    title: '성산의 맹약',
    description: '쉐라그 평판 50 이상을 달성하고 엔시오데스 실버애쉬의 비밀 신임장을 받다.',
    tier: 'Rare',
    points: 150,
    category: 'career',
    icon: 'mountains'
  },
  {
    id: 'rare_blacksteel_contract',
    title: '블랙스틸 엘리트 용병',
    description: '블랙스틸 평판 50 이상을 달성하고 특수전 계약을 성공적으로 수행하다.',
    tier: 'Rare',
    points: 150,
    category: 'career',
    icon: 'briefcase'
  },
  {
    id: 'rare_survive_50',
    title: '반백의 방랑자',
    description: '50세까지 생존하여 테라의 산증인이 되다.',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'clock'
  },
  {
    id: 'rare_kelseit_listener',
    title: '녹색 링스의 훈화 청강생',
    description: '켈시의 30분 난해한 철학 훈계를 단 한 번의 조름도 없이 끝까지 경청하다.',
    loreQuote: '"...따라서 네가 이해했든 못했든, 오리지늄은 여전히 너의 혈관을 순환하고 있다."',
    tier: 'Rare',
    points: 150,
    category: 'secret',
    icon: 'message-square'
  },
  {
    id: 'rare_boiling_ramen',
    title: '입안의 온천 컵라면',
    description: '주전자 없이 끓는 물을 입에 직접 붓고 컵라면 면발을 씹어 삼키는 기행을 성공시키다.',
    loreQuote: '"이것이 전설의 닥터식 0초 조리 야식 비법이다."',
    tier: 'Rare',
    points: 150,
    category: 'secret',
    icon: 'coffee'
  },

  // ==========================================
  // 커먼 (Common - 50 Pts)
  // ==========================================
  {
    id: 'common_first_breath',
    title: '대지의 첫 숨결',
    description: '가혹한 테라의 하늘 아래 무사히 첫 울음을 터뜨리다.',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'baby'
  },
  {
    id: 'common_coming_of_age',
    title: '성년의 맹세',
    description: '15세 성인이 되어 자신의 앞길과 진로를 결정하다.',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'user'
  },
  {
    id: 'common_first_victory',
    title: '첫 교전 승리',
    description: '황야의 약탈자나 오리지늄 슬러그와의 전투에서 승리하다.',
    tier: 'Common',
    points: 50,
    category: 'combat',
    icon: 'award'
  },
  {
    id: 'common_rhodes_medicine',
    title: '차가운 앰플',
    description: '로도스 아일랜드 정품 오리지늄 억제제를 성공적으로 투약하다.',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'pill'
  },
  {
    id: 'common_wealth_1k',
    title: '지갑의 두께',
    description: '보유 자산 1,000 LMD를 모아 기본적인 생계를 보장받다.',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'coin'
  },
  {
    id: 'common_survive_30',
    title: '이립(而立)의 고개',
    description: '30세까지 테라의 가혹한 생존 경쟁에서 살아남다.',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'shield'
  },
  {
    id: 'common_laterano_apple_pie',
    title: '바삭한 애플파이',
    description: '라테라노 베이커리의 폭발 사고 속에서 기적적으로 갓 구운 애플파이를 맛보다.',
    tier: 'Common',
    points: 50,
    category: 'secret',
    icon: 'pie'
  }
];

export const TIER_SCORES: Record<string, number> = {
  Legendary: 1000,
  Unique: 500,
  Mystic: 300,
  Rare: 150,
  Common: 50
};

export const TIER_COLORS = {
  Legendary: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/60',
    gradient: 'from-amber-400 to-yellow-600',
    badge: 'bg-amber-500 text-black',
    glow: 'shadow-amber-500/30'
  },
  Unique: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/60',
    gradient: 'from-purple-400 to-indigo-600',
    badge: 'bg-purple-600 text-white',
    glow: 'shadow-purple-500/30'
  },
  Mystic: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    border: 'border-cyan-500/60',
    gradient: 'from-cyan-400 to-teal-600',
    badge: 'bg-cyan-600 text-black',
    glow: 'shadow-cyan-500/30'
  },
  Rare: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/60',
    gradient: 'from-blue-400 to-sky-600',
    badge: 'bg-blue-600 text-white',
    glow: 'shadow-blue-500/30'
  },
  Common: {
    bg: 'bg-slate-500/20',
    text: 'text-slate-300',
    border: 'border-slate-500/40',
    gradient: 'from-slate-400 to-gray-600',
    badge: 'bg-slate-600 text-white',
    glow: 'shadow-slate-500/20'
  }
};
