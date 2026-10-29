// src/data/traits.ts
import { Character, FocusStance, InnateTrait, LifeGoal } from '../types';

// --- 운명 시드 (Seed) 결정론적 난수 엔진 ---
export function normalizeSeed(raw?: string): string {
  const trimmed = (raw || '').trim().toUpperCase();
  if (trimmed.length > 0) return trimmed;
  return generateRandomSeedCode();
}

export function generateRandomSeedCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars[Math.floor(Math.random() * chars.length)];
    part2 += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TR-${part1}-${part2}`;
}

export function hashSeedString(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createSeededRng(seed: string): () => number {
  let state = hashSeedString(seed) || 0x9e3779b9;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- 선천적 재능 (Innate Talents) ---
export const INNATE_TALENTS: InnateTrait[] = [
  {
    id: 'talent_arts_circuit',
    name: '예리한 아츠 회로',
    type: 'talent',
    description: '선천적으로 오리지늄 신경망이 매끄럽게 발달했습니다. (초기 아츠 +6, 아츠 수련 효율 +25%)',
    badge: '아츠 수련 +25%'
  },
  {
    id: 'talent_iron_lungs',
    name: '강철의 심폐',
    type: 'talent',
    description: '분진과 혹독한 기후를 버텨내는 강인한 호흡기를 타고났습니다. (최대체력 +14, 재앙·분진 피해 -25%)',
    badge: '최대HP +14 / 재앙내성'
  },
  {
    id: 'talent_street_sense',
    name: '뒷골목의 생존감각',
    type: 'talent',
    description: '살기와 함정을 본능적으로 감지합니다. (행운 +8, 교전 후퇴 및 위기 회피율 상승)',
    badge: '행운 +8 / 회피 특화'
  },
  {
    id: 'talent_merchant_eye',
    name: '상인의 눈썰미',
    type: 'talent',
    description: '자금의 흐름과 거래의 허점을 꿰뚫어 봅니다. (지략 +5, 직무 보수 및 의뢰 수입 +20%)',
    badge: '수입 +20% / 지략 +5'
  },
  {
    id: 'talent_lucid_mind',
    name: '명경지수의 정신',
    type: 'talent',
    description: '극한의 공포와 오염 앞에서도 이성이 쉽게 흔들리지 않습니다. (최대이성 +14, 정신 타격 경감)',
    badge: '최대SAN +14 / 정신저항'
  },
  {
    id: 'talent_combat_frame',
    name: '무투가의 골격',
    type: 'talent',
    description: '무기를 다루기에 이상적인 근골격을 지녔습니다. (초기 전투 +6, 백병전 수련 효율 +25%, 물리 피해 +10%)',
    badge: '전투 수련 +25%'
  },
  {
    id: 'talent_oripathy_tolerance',
    name: '저결정 대사 체질',
    type: 'talent',
    description: '체내 오리지늄 활성화를 늦추는 희귀 대사 체질입니다. (자연 감염률 -35%, 결정화 진행 완화)',
    badge: '광석병 저항 +35%'
  },
  {
    id: 'talent_charisma',
    name: '대지의 친화력',
    type: 'talent',
    description: '사람들의 경계를 풀고 신뢰를 얻는 성품입니다. (세력 평판 상승량 +30%, 인연 조우율 상승)',
    badge: '평판 +30% / 인연'
  }
];

// --- 선천적 결점 및 멍에 (Innate Flaws / Burdens) ---
export const INNATE_FLAWS: InnateTrait[] = [
  {
    id: 'flaw_originium_sensitive',
    name: '오리지늄 과민 체질',
    type: 'flaw',
    description: '미량의 원석 분진에도 세포가 민감하게 반응합니다. (자연 감염률 1.6배, 미억제 시 결정화 가속)',
    badge: '감염·결정화 취약'
  },
  {
    id: 'flaw_frail_body',
    name: '선천적 허약 체질',
    type: 'flaw',
    description: '어릴 적 영양실조로 잔병치레가 잦습니다. (최대체력 -12, 혹한 및 질병 피해 가중)',
    badge: '최대HP -12'
  },
  {
    id: 'flaw_family_debt',
    name: '몰락 가문의 부채',
    type: 'flaw',
    description: '부모 세대가 남긴 빚과 징수원이 따라다닙니다. (초기 자산 감소, 연간 생계·세금 지출 +35%)',
    badge: '생계 지출 +35%'
  },
  {
    id: 'flaw_chronic_insomnia',
    name: '만성 불면과 악몽',
    type: 'flaw',
    description: '밤마다 대지의 비명 같은 이명에 시달립니다. (최대이성 -10, 매년 이성 -2 자연 소모)',
    badge: '최대SAN -10 / 불면'
  },
  {
    id: 'flaw_marked_outcast',
    name: '경계받는 이방인',
    type: 'flaw',
    description: '출신 성분으로 인해 이동도시 검문소의 표적이 됩니다. (정규 보수 -15%, 검문·차별 빈발)',
    badge: '보수 -15% / 검문 표적'
  },
  {
    id: 'flaw_ill_fated',
    name: '재앙을 부르는 그림자',
    type: 'flaw',
    description: '머무는 곳마다 유독 사고와 기상 이변이 끊이지 않습니다. (행운 -8, 재앙·위기 조우율 증가)',
    badge: '행운 -8 / 재해 노출'
  },
  {
    id: 'flaw_arts_blockage',
    name: '아츠 회로 경직',
    type: 'flaw',
    description: '체내 오리지늄 전달 경로가 불완전합니다. (아츠 수련 효율 -30%, 아츠 영창 시 이성 소모 +3)',
    badge: '아츠 효율 -30%'
  },
  {
    id: 'flaw_reckless_blood',
    name: '거친 피의 충동',
    type: 'flaw',
    description: '위험 앞에서 물러서지 못해 상처가 끊이지 않습니다. (전투 +4, 피격 피해 +15%, 도주율 감소)',
    badge: '피격 +15% / 전투 +4'
  }
];

// --- 생애 목표 (Life Goals) ---
export const LIFE_GOALS: LifeGoal[] = [
  {
    id: 'goal_apex_specialist',
    title: '정점의 특색(특수직군)',
    description: '밑바닥 말단부터 공적을 쌓아 테라 최고위 특수 직군(Tier 5)에 임관하고 주력 역량을 증명합니다.',
    targetText: '특수 직군(Tier 5) 임관 및 전투/아츠/지략 중 85 달성',
    bonusPoints: 600
  },
  {
    id: 'goal_calamity_slayer',
    title: '전장의 대적자',
    description: '테라를 위협하는 강적들과 정면으로 맞서 싸워 무훈을 세웁니다.',
    targetText: '강적/보스급 교전 2회 이상 승리 및 전투력 82 이상',
    bonusPoints: 600
  },
  {
    id: 'goal_continental_tycoon',
    title: '황금 바퀴의 거상',
    description: '혹독한 세금과 약탈을 이겨내고 이동도시 상권을 움직이는 막대한 부를 축적합니다.',
    targetText: '보유 자산 25,000 LMD 이상 및 직급 3단계(베테랑) 이상',
    bonusPoints: 550
  },
  {
    id: 'goal_truth_observer',
    title: '별과 아츠의 구도자',
    description: '오리지늄 아츠 혹은 학술 지략의 극한에 도달하여 대지의 심오한 비전을 해명합니다.',
    targetText: '아츠 적성 또는 지략 88 이상 달성',
    bonusPoints: 550
  },
  {
    id: 'goal_shelter_in_storm',
    title: '폭풍 속의 안식',
    description: '단명하기 쉬운 테라에서 소중한 인연을 지키며 기대 수명 가까이 평온히 살아남습니다.',
    targetText: '60세 이상 생존, 생존한 인연 1명 이상, 이성 50 이상 유지',
    bonusPoints: 500
  },
  {
    id: 'goal_unbroken_infected',
    title: '결정 속의 불꽃',
    description: '광석병의 침식과 세상의 박해에 굴하지 않고 45세 이상 생존하며 세력의 신망을 얻습니다.',
    targetText: '광석병 감염 상태로 45세 이상 생존 및 임의 세력 평판 50 이상',
    bonusPoints: 600
  }
];

export function evaluateLifeGoal(char: Character): { achieved: boolean; progressText: string } {
  const goal = char.lifeGoal;
  if (!goal) return { achieved: false, progressText: '목표 없음' };

  const maxCoreStat = Math.max(char.stats.combat, char.stats.artsAptitude, char.stats.intellect);
  const maxRep = Math.max(0, ...Object.values(char.factions));
  const livingBonds = (char.bonds || []).filter(b => b.isAlive).length;
  const bossKills = char.bossKills || 0;
  const tier = char.careerTier || 0;

  switch (goal.id) {
    case 'goal_apex_specialist': {
      const hasSpecial = !!char.specialCareerId || tier >= 5;
      const achieved = hasSpecial && maxCoreStat >= 85;
      return {
        achieved,
        progressText: `${hasSpecial ? '특수직군 완료' : `직급 T${tier}/5`} · 최고역량 ${maxCoreStat}/85`
      };
    }
    case 'goal_calamity_slayer': {
      const achieved = bossKills >= 2 && char.stats.combat >= 82;
      return {
        achieved,
        progressText: `강적 토벌 ${bossKills}/2 · 전투력 ${char.stats.combat}/82`
      };
    }
    case 'goal_continental_tycoon': {
      const achieved = char.stats.wealth >= 25000 && tier >= 3;
      return {
        achieved,
        progressText: `자산 ${char.stats.wealth.toLocaleString()}/25,000 · 직급 T${tier}/3`
      };
    }
    case 'goal_truth_observer': {
      const best = Math.max(char.stats.artsAptitude, char.stats.intellect);
      const achieved = best >= 88;
      return {
        achieved,
        progressText: `아츠/지략 최고치 ${best}/88`
      };
    }
    case 'goal_shelter_in_storm': {
      const achieved = char.age >= 60 && livingBonds >= 1 && char.stats.sanity >= 50;
      return {
        achieved,
        progressText: `연령 ${char.age}/60세 · 생존 인연 ${livingBonds}/1 · 이성 ${char.stats.sanity}/50`
      };
    }
    case 'goal_unbroken_infected': {
      const achieved = char.oripathy.isInfected && char.age >= 45 && maxRep >= 50;
      return {
        achieved,
        progressText: `${char.oripathy.isInfected ? '감염' : '비감염'} · 연령 ${char.age}/45세 · 최고평판 ${maxRep}/50`
      };
    }
    default:
      return { achieved: false, progressText: '진행 중' };
  }
}

// --- 집중 태세 (/boost: 연간 생애 집중 방침) ---
export const FOCUS_STANCES: {
  id: FocusStance;
  name: string;
  shortLabel: string;
  effectText: string;
}[] = [
  {
    id: 'survival',
    name: '생존 방비',
    shortLabel: '생존',
    effectText: '재앙·위기 피해 -20%, 매년 체력/이성 소폭 회복 (공적 획득 -15%)'
  },
  {
    id: 'martial',
    name: '무력 연마',
    shortLabel: '무력',
    effectText: '전투 수련 효율 +20%, 물리 교전 피해 +10% (매년 체력 -2 소모)'
  },
  {
    id: 'arcane',
    name: '아츠·지략',
    shortLabel: '학술',
    effectText: '아츠·학술 수련 +20%, 아츠/지략 판정 +3 (매년 이성 -2 소모)'
  },
  {
    id: 'career',
    name: '생업·공적',
    shortLabel: '공적',
    effectText: '연간 보수 +20%, 승급 공적(EXP) 획득 +35% (매년 이성 -2, 체력 -1)'
  }
];

// --- 5단계 직급 승급 사다리 (도시의 9급~1급~특색 구조를 테라 세계관으로 발전) ---
export interface CareerTierThreshold {
  targetTier: 2 | 3 | 4;
  reqExp: number;
  reqMainStat: number;
  examDc: number;
  examFee: number;
  label: string;
}

export const CAREER_PROMOTION_THRESHOLDS: CareerTierThreshold[] = [
  { targetTier: 2, reqExp: 25, reqMainStat: 36, examDc: 52, examFee: 200, label: '정규(Tier 2) 승급 심사' },
  { targetTier: 3, reqExp: 58, reqMainStat: 54, examDc: 66, examFee: 500, label: '베테랑(Tier 3) 승급 심사' },
  { targetTier: 4, reqExp: 95, reqMainStat: 70, examDc: 78, examFee: 900, label: '수석(Tier 4) 승급 심사' }
];

export function getTierRankTitle(career: string, tier: number): string {
  if (tier <= 0) return '초년생';
  if (career.includes('로도스')) {
    return ['초년생', '견습 오퍼레이터', '정규 오퍼레이터', '선임 오퍼레이터', '수석 작전팀장', '엘리트 오퍼레이터'][Math.min(5, tier)];
  }
  if (career.includes('근위국') || career.includes('치안')) {
    return ['초년생', '말단 순경', '정규 경사', '선임 경위', '특무 경감', '치안 총괄관'][Math.min(5, tier)];
  }
  if (career.includes('용병')) {
    return ['초년생', '하급 용병', '숙련 용병', '베테랑 청부인', '일급 용병대장', '전설의 검귀'][Math.min(5, tier)];
  }
  if (career.includes('블랙스틸') || career.includes('개척')) {
    return ['초년생', '인턴 계약병', '정규 전술요원', '선임 현장팀장', '수석 작전고문', '특수 총괄역'][Math.min(5, tier)];
  }
  return ['초년생', '9급 수습생', '6급 실무자', '3급 숙련가', '1급 권위자', '특급 명장'][Math.min(5, tier)];
}

// --- 테라 인연(동료) 풀 ---
export const COMPANION_TEMPLATES: { name: string; role: string }[] = [
  { name: '마르코', role: '황야 순찰 전우' },
  { name: '소피아', role: '이동진료소 간호사' },
  { name: '그레이엄', role: '퇴역 노병 스승' },
  { name: '유즈하', role: '뒷골목 정보상' },
  { name: '레온하르트', role: '방랑 아츠 전달자' },
  { name: '안나', role: '슬럼가 시절 의형제' },
  { name: '카시안', role: '수송 호위 파트너' },
  { name: '미레유', role: '학술 연구 동료' }
];
