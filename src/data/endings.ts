// src/data/endings.ts
import { Character, EndingData, EndingRarity } from '../types';

export interface EndingDefinition extends EndingData {
  condition: (char: Character, cause: string) => boolean;
}

export const ENDINGS_DATA: EndingDefinition[] = [
  // ==========================================
  // 전설 (Legendary - 2500 Pts Bonus)
  // ==========================================
  {
    id: 'ending_dawn_of_terra',
    title: '새벽을 비추는 불꽃',
    subtitle: '로도스 아일랜드의 영원한 영웅',
    description: '로도스 아일랜드의 핵심 요원으로서 체르노보그와 런디니움의 비극을 종식시키고 감염자 구원의 새벽을 밝힌 전설적인 생애.',
    epitaph: '어둠이 아무리 깊어도, 새벽을 향해 걸어가는 이가 있는 한 테라의 불꽃은 결코 꺼지지 않는다.',
    rarity: 'Legendary',
    scoreBonus: 2500,
    condition: (char) => {
      const rep = char.factions['로도스 아일랜드'] || 0;
      return (char.specialCareerId === 'rhodes_elite' || rep >= 55) && 
        (char.stats.combat >= 75 || char.stats.artsAptitude >= 75) && 
        char.age >= 25 &&
        !!char.secretFlags['completed_act1_or_act2'];
    }
  },
  {
    id: 'ending_babel_phantom',
    title: '바벨의 망령',
    subtitle: '카즈델의 비원과 검은 관',
    description: '살카즈의 고대 마왕의 부름과 테레시아의 이상 사이에서 카즈델의 천 년 비원을 계승하고 전장을 호령한 삶.',
    epitaph: '천 년의 원한과 비원이 담긴 검은 관. 우리는 대지를 불사르고서라도 고향을 되찾으리라.',
    rarity: 'Legendary',
    scoreBonus: 2500,
    condition: (char) => {
      return char.race.includes('살카즈') && 
        (char.specialCareerId === 'sarkaz_court' || (char.stats.artsAptitude >= 85 && char.stats.combat >= 75)) &&
        !!char.secretFlags['sarkaz_awakening'];
    }
  },

  // ==========================================
  // 유니크 (Unique - 1500 Pts Bonus)
  // ==========================================
  {
    id: 'ending_lone_trail_sky',
    title: '은하를 올려다보는 별',
    subtitle: '트리몬트 천공 관측자',
    description: '크리스틴 라이트와 함께 가짜 천공을 돌파하여 테라 너머의 우주와 고대 인류의 진실을 목격한 선구자.',
    epitaph: '테라의 하늘이 거짓된 우리에 불과했을지라도, 우리는 저편의 우주를 향해 첫 발을 내딛었다.',
    rarity: 'Unique',
    scoreBonus: 1500,
    condition: (char) => {
      return (char.specialCareerId === 'rhine_director' || char.stats.intellect >= 80) &&
        !!char.secretFlags['witnessed_lone_trail'];
    }
  },
  {
    id: 'ending_steam_knight_legacy',
    title: '런디니움의 마지막 증기',
    subtitle: '빅토리아의 영원한 방패',
    description: '런디니움 성벽 아래에서 고대 증기기사의 망치를 휘두르며 시민들의 피난로를 홀로 결사 사수한 강철의 기사.',
    epitaph: '증기가 식고 강철이 부서질지라도, 기사의 맹세는 런디니움의 성벽과 함께 영원하리라.',
    rarity: 'Unique',
    scoreBonus: 1500,
    condition: (char) => {
      return (char.specialCareerId === 'steam_knight' || char.nation === '빅토리아') &&
        char.stats.combat >= 85 &&
        !!char.secretFlags['steam_knight_stand'];
    }
  },
  {
    id: 'ending_sami_daemon_shield',
    title: '만년설에 새겨진 방패',
    subtitle: '극북의 성림 파수꾼',
    description: '남쪽 이동도시들의 안락한 불빛 뒤편에서, 극북 사미의 붕괴체 무리를 홀로 결계로 가로막아 대륙의 멸망을 저지한 파수꾼.',
    epitaph: '남쪽의 불빛들이 평화로울 수 있었던 것은, 극북의 만년설 아래 우리가 피를 흘렸기 때문이다.',
    rarity: 'Unique',
    scoreBonus: 1500,
    condition: (char) => {
      return (char.specialCareerId === 'sami_snowpriest' || char.nation === '사미') &&
        char.stats.artsAptitude >= 75 && char.stats.sanity >= 65 &&
        !!char.secretFlags['stopped_collapse'];
    }
  },

  // ==========================================
  // 미스틱 (Mystic - 1000 Pts Bonus)
  // ==========================================
  {
    id: 'ending_silence_ocean',
    title: '심해의 부름에 침묵하다',
    subtitle: '어비설 헌터스의 귀환',
    description: '해사의 유혹과 신경 오염의 속삭임 속에서도 이성을 지켜내고, 바다의 침식을 막아낸 은빛 칼날의 수호자.',
    epitaph: '바다의 수천만 목소리가 귀를 찢을 때, 우리는 칼날의 침묵으로 대답했다.',
    rarity: 'Mystic',
    scoreBonus: 1000,
    condition: (char) => {
      return (char.specialCareerId === 'abyssal_hunter' || char.race.includes('에기르')) &&
        char.stats.combat >= 80 &&
        !!char.secretFlags['conquered_seaborne'];
    }
  },
  {
    id: 'ending_emperors_blade_shadow',
    title: '황제의 검의 그림자',
    subtitle: '우르수스 황실의 검은 국경',
    description: '우르수스 제국의 국경을 칼날로 확정하고, 검은 안개로 적들을 집어삼키며 황실의 절대적인 위엄을 수호한 삶.',
    epitaph: '황제의 국경은 칼끝이 닿는 곳까지. 안개 너머의 침묵은 우리만이 안다.',
    rarity: 'Mystic',
    scoreBonus: 1000,
    condition: (char) => {
      return (char.specialCareerId === 'emperors_blade' || (char.nation === '우르수스 제국' && char.stats.combat >= 80)) &&
        !!char.secretFlags['emperors_blade_vow'];
    }
  },
  {
    id: 'ending_laterano_law',
    title: '광륜 아래의 영원한 계율',
    subtitle: '공증소 최고 집행관',
    description: '라테라노의 성스러운 율법을 수호하며 한 치의 오차도 없이 총구를 겨누었던 성도의 수호자.',
    epitaph: '율법은 우리를 하나로 묶고, 총알은 죄악을 정화한다. 광륜 아래 안식을 빌며.',
    rarity: 'Mystic',
    scoreBonus: 1000,
    condition: (char) => {
      return (char.specialCareerId === 'gun_executor' || char.race.includes('산크타')) &&
        char.stats.combat >= 75 && char.stats.intellect >= 65;
    }
  },

  // ==========================================
  // 레어 (Rare - 500 Pts Bonus)
  // ==========================================
  {
    id: 'ending_radiant_glory',
    title: '황금빛 영광의 퇴장',
    subtitle: '카시미어 챔피언 기사',
    description: '카바레리에키 스타디움의 수만 관중의 열광을 뒤로하고 화려한 챔피언의 왕관과 막대한 부를 쥔 채 은퇴한 삶.',
    epitaph: '스타디움의 환호성은 잦아들었으나, 황금빛 갑주에 새겨진 전설은 퇴색하지 않는다.',
    rarity: 'Rare',
    scoreBonus: 500,
    condition: (char) => {
      return (char.specialCareerId === 'radiant_knight' || char.nation === '카시미어') &&
        char.stats.wealth >= 8000 && char.stats.combat >= 75;
    }
  },
  {
    id: 'ending_volsinii_evening',
    title: '볼시니의 조용한 저녁',
    subtitle: '시라쿠사 패밀리의 대부',
    description: '피비린내 나는 패밀리 간의 암투를 평정하고 밤의 거리에 질서를 가져온 마피아 수장의 은퇴.',
    epitaph: '오페라의 막이 내리고 마피아들의 총성이 멎은 밤, 우리는 마침내 조용한 에스프레소를 마셨다.',
    rarity: 'Rare',
    scoreBonus: 500,
    condition: (char) => {
      return (char.specialCareerId === 'siracusa_capo' || char.nation === '시라쿠사') &&
        char.stats.wealth >= 6000 && char.stats.intellect >= 70;
    }
  },
  {
    id: 'ending_yan_red_scroll',
    title: '사법관의 붉은 두루마리',
    subtitle: '염국 대리 대사경',
    description: '천하의 질서와 법도를 바로세우고 수이의 분열을 감시하여 염국의 만년 태평성대를 지켜낸 명신.',
    epitaph: '천하의 안녕을 위해 붓을 들고 칼을 갈았으니, 사서(史書)에 부끄러움 한 점 남기지 않았다.',
    rarity: 'Rare',
    scoreBonus: 500,
    condition: (char) => {
      return (char.specialCareerId === 'yan_censor' || char.nation === '염국') &&
        char.stats.intellect >= 80;
    }
  },

  // ==========================================
  // 커먼 (Common - 150 Pts Bonus)
  // ==========================================
  {
    id: 'ending_kjerag_teacup',
    title: '성산의 따뜻한 찻잔',
    subtitle: '설산의 평화로운 여생',
    description: '가혹한 대지의 분쟁을 벗어나 쉐라그의 따뜻한 온천과 설산의 평화 속에서 천수를 누린 삶.',
    epitaph: '성산의 눈보라가 창문을 두드릴 때, 따뜻한 차 한 잔과 함께 평화로운 생애를 마감하다.',
    rarity: 'Common',
    scoreBonus: 150,
    condition: (char) => {
      return char.age >= 55 && char.stats.sanity >= 50;
    }
  },
  {
    id: 'ending_wasteland_dust',
    title: '황야에 흩어진 한 줌의 먼지',
    subtitle: '이름 없는 대지의 방랑자',
    description: '광석병의 침식이나 가혹한 황야의 약탈 속에서 짧고도 치열하게 살다 간 한 사람의 방랑자.',
    epitaph: '이름 없는 대지의 방랑자. 거친 바람이 불어와 남은 흔적마저 지워버렸다.',
    rarity: 'Common',
    scoreBonus: 100,
    condition: () => true // Fallback ending
  }
];

export const ENDING_RARITY_STYLE = {
  Legendary: {
    ribbon: 'from-amber-400 via-yellow-500 to-amber-600',
    border: 'border-amber-400/80',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    badge: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold',
    subtleRibbon: 'border-t-4 border-amber-400',
    dot: 'bg-amber-400'
  },
  Unique: {
    ribbon: 'from-purple-500 via-indigo-500 to-purple-700',
    border: 'border-purple-400/80',
    text: 'text-purple-300',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.35)]',
    badge: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold',
    subtleRibbon: 'border-t-4 border-purple-400',
    dot: 'bg-purple-400'
  },
  Mystic: {
    ribbon: 'from-cyan-400 via-teal-500 to-cyan-600',
    border: 'border-cyan-400/80',
    text: 'text-cyan-300',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.35)]',
    badge: 'bg-gradient-to-r from-cyan-400 to-teal-600 text-black font-extrabold',
    subtleRibbon: 'border-t-4 border-cyan-400',
    dot: 'bg-cyan-400'
  },
  Rare: {
    ribbon: 'from-blue-400 via-sky-500 to-blue-600',
    border: 'border-blue-400/80',
    text: 'text-blue-300',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    badge: 'bg-gradient-to-r from-blue-500 to-sky-600 text-white font-extrabold',
    subtleRibbon: 'border-t-4 border-blue-400',
    dot: 'bg-blue-400'
  },
  Common: {
    ribbon: 'from-slate-400 via-gray-500 to-slate-600',
    border: 'border-slate-400/60',
    text: 'text-slate-300',
    glow: 'shadow-[0_0_10px_rgba(148,163,184,0.2)]',
    badge: 'bg-slate-600 text-white font-bold',
    subtleRibbon: 'border-t-4 border-slate-400',
    dot: 'bg-slate-400'
  }
};

export function determineEnding(character: Character, cause: string): EndingDefinition {
  for (const ending of ENDINGS_DATA) {
    if (ending.condition(character, cause)) {
      return ending;
    }
  }
  return ENDINGS_DATA[ENDINGS_DATA.length - 1];
}
