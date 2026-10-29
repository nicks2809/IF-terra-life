// src/types/index.ts

export type ThemeMode = 'prts' | 'tome';

export type GameSpeed = 1 | 2 | 4 | 8 | 16 | 32;

export type Season = '봄' | '여름' | '가을' | '겨울';

export type Gender = '남성' | '여성';

export type AIStrategy = 'balanced' | 'survival' | 'combat' | 'wealth';

export type FocusStance = 'survival' | 'martial' | 'arcane' | 'career';

export type LogFilter = 'all' | 'event' | 'news' | 'combat' | 'oripathy';

export interface InnateTrait {
  id: string;
  name: string;
  type: 'talent' | 'flaw';
  description: string;
  badge: string;
}

export interface LifeGoal {
  id: string;
  title: string;
  description: string;
  targetText: string;
  bonusPoints: number;
}

export interface CharacterBond {
  id: string;
  name: string;
  role: string;
  affinity: number; // 0 ~ 100
  isAlive: boolean;
  fateText?: string;
}

export interface AdvancedSettings {
  aiStrategy: AIStrategy;
  pauseOnLowHp: boolean;
  pauseOnOripathyCrisis: boolean;
  pauseOnRareEvent: boolean;
  autoUseApAndShop: boolean;
  minorEventAutoTimeout: boolean;
  crtEffect: boolean;
}

export interface ReincarnationPerk {
  id: string;
  name: string;
  description: string;
  reqPoints: number;
  badge: string;
}

export interface ReincarnationConfig {
  seed?: string;
  useFixedSeed?: boolean;
  name?: string;
  gender?: Gender;
  raceId?: string;
  nationId?: string;
  environment?: EnvironmentType;
  goalId?: string;
  perkIds?: string[];
}

export interface RaceTrait {
  id: string;
  name: string;
  description: string;
  statBonus: Partial<CharacterStats>;
  artsMultiplierBonus?: number;
  oripathyRiskBonus?: number;
}

export interface SubRaceLifespan {
  baseLifespan: number;
  maxLifespan: number;
  agingStartAge: number;
  agingRate: number;
}

export interface RaceLifespanConfig {
  baseLifespan: number;        // 평균 자연 수명 (노화 사망 시작 연령)
  maxLifespan: number;         // 절대 최대 수명
  agingStartAge: number;       // 신체 노화 시작 나이 (스탯 감퇴 등)
  agingRate: number;           // 노화 진행 계수 (1.0 = 표준, 0.2~0.5 = 장수종)
  subRaceLifespans?: Record<string, SubRaceLifespan>;
}

export interface RaceData {
  id: string;
  name: string;
  nameEn: string;
  subRaces?: string[];
  description: string;
  lore: string;
  traits: RaceTrait[];
  avatarIcon: string;
  baseStats: CharacterStats;
  lifespan: RaceLifespanConfig;
}

export interface NationData {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  capital: string;
  dominantRaces: string[];
  factions: string[];
  specialty: string;
  riskLevel: '안전' | '경계' | '위험' | '극도로 위험';
}

export type EnvironmentType = 
  | '이동도시 상류층'
  | '일반 거주구'
  | '슬럼가 및 암시장'
  | '황야의 노마드 캠프'
  | '이동기지 (로도스/블랙스틸)';

export interface CharacterStats {
  health: number;
  maxHealth: number;
  sanity: number;
  maxSanity: number;
  wealth: number;        // LMD
  combat: number;        // 물리 전투 숙련
  artsAptitude: number;  // 아츠 적성
  intellect: number;     // 정세 감각 & 지략
  luck: number;          // 행운
}

export type OripathyStage = 'Clean' | 'Early' | 'Mid' | 'Severe' | 'Terminal' | 'Crystallized';

export type LesionSite = '없음' | '호흡기(폐)' | '신경계' | '혈관계' | '사지 골격' | '체표 피부';

export interface OripathyStatus {
  isInfected: boolean;
  crystallizationRate: number;       // 0.0% ~ 100.0%
  originiumBloodDensity: number;     // 0.05 ~ 1.20+ u/L
  stage: OripathyStage;
  lesionSite: LesionSite;
  activeArtsMultiplier: number;      // 1.0x ~ 3.5x
  suppressantDoseLeft: number;       // 억제 효과 남은 연수
}

export interface Equipment {
  weapon?: Item;
  armor?: Item;
  accessory?: Item;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'medicine' | 'consumable' | 'catalyst';
  description: string;
  price: number;
  rarity: 1 | 2 | 3 | 4 | 5 | 6;
  atkBonus?: number;
  defBonus?: number;
  artsBonus?: number;
  healthBonus?: number;
  effectType?: 'heal_hp' | 'heal_san' | 'suppress_oripathy' | 'boost_arts' | 'cure_hazard';
  effectValue?: number;
}

export interface InventorySlot {
  item: Item;
  count: number;
}

// --- 업적 시스템 (Achievement System) ---
export type AchievementTier = 'Common' | 'Rare' | 'Mystic' | 'Unique' | 'Legendary';
export type AchievementCategory = 'career' | 'story' | 'survival' | 'combat' | 'secret';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  loreQuote?: string;
  tier: AchievementTier;
  points: number;
  category: AchievementCategory;
  icon?: string;
  hint?: string;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
  characterName: string;
  year: number;
}

// --- 엔딩 시스템 (Ending System) ---
export type EndingRarity = 'Common' | 'Rare' | 'Mystic' | 'Unique' | 'Legendary';

export interface EndingData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  epitaph: string;
  rarity: EndingRarity;
  scoreBonus: number;
}

// --- 특수 직군 (Specialized Careers) ---
export interface SpecialCareer {
  id: string;
  name: string;
  rank: string;
  description: string;
  loreSecret: string;
  category: 'combat' | 'arts' | 'intellect' | 'special';
  allowedRaces?: string[];
  allowedNations?: string[];
  reqMinStats?: Partial<CharacterStats>;
  reqMinReputation?: Record<string, number>;
  reqInfected?: boolean;
}

export interface Character {
  id: string;
  seed?: string;
  name: string;
  gender: Gender;
  race: string;
  subRace?: string;
  nation: string;
  environment: EnvironmentType;
  age: number;
  year: number; // 테라력 (예: 1085 ~)
  stats: CharacterStats;
  oripathy: OripathyStatus;
  factions: Record<string, number>; // 진영별 평판 (-100 ~ 100)
  career: string;
  careerRank: string;
  careerTier?: number; // 0(유년) ~ 5(전설 특수직군)
  careerExp?: number;  // 직급 승급용 공적/경력도
  specialCareerId?: string;
  focusStance?: FocusStance;
  lifeGoal?: LifeGoal;
  goalAchieved?: boolean;
  innateTraits?: InnateTrait[];
  bonds?: CharacterBond[];
  milestones?: string[];
  bossKills?: number;
  titles: string[];
  equipment: Equipment;
  inventory: InventorySlot[];
  actionPoints: number; // 연간 활동 포인트 (기본 1~2)
  isAlive: boolean;
  deathRecord?: DeathRecord;
  secretFlags: Record<string, boolean>;
  unlockedAchievements: string[];
  seenEventIds?: string[];
  eventCooldowns?: Record<string, number>;
  reincarnationPerks?: string[];
}

export interface DiceCheck {
  stat: keyof CharacterStats;
  difficulty: number; // DC (1~100)
}

export interface OutcomeResult {
  text: string;
  statEffects?: Partial<CharacterStats>;
  crystallizationDelta?: number;
  bloodDensityDelta?: number;
  reputationDelta?: Record<string, number>;
  careerExpDelta?: number;
  gainItemIds?: string[];
  gainTitles?: string[];
  deathReason?: string;
  specialCareerGain?: { id: string; name: string; rank: string };
  addBond?: { name: string; role: string; affinity?: number };
  loseRandomBondReason?: string;
  changeEnvironment?: EnvironmentType;
  unlockAchievementId?: string;
  setSecretFlag?: string;
  setSecretFlag2?: string;
  setSecretFlags?: string[];
}

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  requirements?: {
    minStat?: { stat: keyof CharacterStats; value: number };
    itemCost?: { itemId: string; count: number };
    lmdCost?: number;
    isInfected?: boolean;
    race?: string[];
    nation?: string[];
    requiredItem?: string;
    requiredCareer?: string;
    requiredFlag?: string;
  };
  diceCheck?: DiceCheck;
  outcomes: {
    criticalSuccess?: OutcomeResult;
    success: OutcomeResult;
    failure?: OutcomeResult;
    criticalFailure?: OutcomeResult;
  };
  triggerBattleEnemyId?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: 'life' | 'oripathy' | 'world_news' | 'combat' | 'fateful' | 'career';
  minAge: number;
  maxAge: number;
  conditions?: {
    isInfected?: boolean;
    race?: string[];
    nation?: string[];
    environment?: EnvironmentType[];
    minCombat?: number;
    minArts?: number;
    minIntellect?: number;
    requiresLivingBond?: boolean;
    specificYear?: number;
    requiredFlag?: string;
    requiredCareer?: string;
  };
  choices: EventChoice[];
}

export interface WorldTimelineEvent {
  year: number;
  title: string;
  region: string;
  broadcastText: string;
  inGameEffectText: string;
  triggerEventId?: string;
}

export interface Enemy {
  id: string;
  name: string;
  faction: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  artsRes: number;
  specialSkillName: string;
  specialSkillDesc: string;
  avatarIcon: string;
  rewardLmd: number;
  rewardExpStat: keyof CharacterStats;
}

export interface BattleState {
  isActive: boolean;
  enemy: Enemy;
  turn: number;
  log: string[];
  isPlayerTurn: boolean;
  playerShield: number;
  enemyShield: number;
  damageTaken?: number;
  catalystActive?: boolean;
  armorBreak?: number;
  ambushed?: boolean;
  result?: 'victory' | 'defeat' | 'fled';
}

export interface LogEntry {
  id: string;
  year: number;
  age: number;
  season?: Season;
  title: string;
  text: string;
  type: 'general' | 'critical' | 'hazard' | 'news' | 'battle' | 'oripathy';
  rollDetails?: {
    stat: keyof CharacterStats;
    roll: number;
    total: number;
    dc: number;
    result: '대성공' | '성공' | '실패' | '대참사';
  };
  effectBadges?: string[];
  timestamp: string;
}

export interface ScoreBreakdown {
  achievements: number;
  stats: number;
  wealth: number;
  reputation: number;
  lifespan: number;
  endingBonus: number;
  goalBonus?: number;
}

export interface DeathRecord {
  seed?: string;
  yearOfDeath: number;
  ageAtDeath: number;
  cause: string;
  detailedCause: string;
  finalRank: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  lastWords: string;
  notableAchievements: string[];
  milestones?: string[];
  innateTraits?: InnateTrait[];
  lifeGoalTitle?: string;
  goalAchieved?: boolean;
  statsSummary: {
    combat: number;
    arts: number;
    wealth: number;
    crystallizationRate: number;
  };
  characterName: string;
  race: string;
  nation: string;
  endingId?: string;
  endingTitle?: string;
  endingSubtitle?: string;
  endingRarity?: EndingRarity;
  endingEpitaph?: string;
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  unlockedAchievementsInRun: string[];
}
