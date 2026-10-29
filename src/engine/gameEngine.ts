// src/engine/gameEngine.ts
import {
  Character,
  CharacterStats,
  OripathyStatus,
  EnvironmentType,
  LogEntry,
  GameEvent,
  EventChoice,
  OutcomeResult,
  BattleState,
  DeathRecord,
  ScoreBreakdown,
  ReincarnationConfig,
  AIStrategy,
  SpecialCareer,
  FocusStance,
  Season
} from '../types';
import { RACES_DATA } from '../data/races';
import { NATIONS_DATA } from '../data/nations';
import { WORLD_TIMELINE } from '../data/timeline';
import { ITEMS_DATA } from '../data/items';
import { ENEMIES_DATA } from '../data/enemies';
import { GAME_EVENTS } from '../data/events';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { SPECIAL_CAREERS_DATA } from '../data/careers';
import { determineEnding } from '../data/endings';
import {
  normalizeSeed,
  createSeededRng,
  INNATE_TALENTS,
  INNATE_FLAWS,
  LIFE_GOALS,
  evaluateLifeGoal,
  CAREER_PROMOTION_THRESHOLDS,
  CareerTierThreshold,
  getTierRankTitle,
  COMPANION_TEMPLATES
} from '../data/traits';
import { storage } from '../services/storage';
import { sound } from '../services/sound';

const FIRST_NAMES = [
  '발터', '체이서', '아스트라', '카이사르', '아이린', '실반', '에단', '에리스',
  '레오', '카밀라', '베라', '마커스', '단테', '클로에', '루카스', '미라',
  '노아', '엘레나', '펠릭스', '세레나', '빅터', '로웬', '헬레나', '가브리엘',
  '레이드', '세실리아', '아델', '크로이츠', '비비안', '율리우스', '글라디아', '로렌조'
];

const ONE_TIME_EVENT_PREFIXES = [
  'child_01_',
  'child_02_',
  'child_03_',
  'child_slug_friend',
  'youth_01_',
  'career_special_',
  'story_',
  'fateful_',
  'priestess_black_box_discovery',
  'kazdel_royal_court_assembly',
  'sargon_pharaoh_tomb_expedition',
  'rim_billiton_mega_drill_event',
  'minos_athletic_triumph'
];

const CAREER_ACHIEVEMENT_MAP: Record<string, string> = {
  abyssal_hunter: 'unique_abyssal_hunter',
  gun_executor: 'mystic_gun_executor',
  radiant_knight: 'mystic_radiant_champion',
  rhine_director: 'mystic_rhine_director',
  yan_censor: 'mystic_yan_high_censor',
  steam_knight: 'unique_steam_knight_heart',
  emperors_blade: 'unique_emperors_blade',
  siracusa_capo: 'mystic_siracusa_don',
  rhodes_elite: 'rare_rhodes_specialist',
  sarkaz_court: 'unique_kazdel_court_infiltrator',
  sami_snowpriest: 'unique_sami_daemon_slayer',
  karlan_captain: 'mystic_silverash_confidant'
};

const BOSS_ENEMY_IDS = new Set([
  'sarkaz_centurion',
  'seaborne_predator',
  'londinium_steam_knight',
  'emperors_blade'
]);

const SEASONS: Season[] = ['봄', '여름', '가을', '겨울'];

const STAT_LABELS: Record<keyof CharacterStats, string> = {
  health: '체력',
  maxHealth: '최대체력',
  sanity: '이성',
  maxSanity: '최대이성',
  wealth: 'LMD',
  combat: '전투력',
  artsAptitude: '아츠',
  intellect: '지략',
  luck: '행운'
};

export class GameEngine {
  public static getRandomName(rng: () => number = Math.random): string {
    return FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
  }

  public static hasTrait(char: Character, traitId: string): boolean {
    return (char.innateTraits || []).some(t => t.id === traitId);
  }

  public static pickSeason(char: Character, offset = 0): Season {
    return SEASONS[Math.abs((char.year + char.age + offset) % 4)];
  }

  public static recordMilestone(char: Character, text: string) {
    if (!char.milestones) char.milestones = [];
    if (char.milestones.includes(text)) return;
    if (char.milestones.length >= 18) {
      // 탄생 기록(첫 줄)은 보존하고 오래된 중간 기록 하나를 정리
      char.milestones.splice(1, 1);
    }
    char.milestones.push(text);
  }

  // 구버전 세이브 데이터 하위 호환 보정
  public static ensureCharacterDefaults(character: Character): Character {
    const inferredTier =
      typeof character.careerTier === 'number'
        ? character.careerTier
        : character.specialCareerId
          ? 5
          : character.age < 15
            ? 0
            : 1;

    return {
      ...character,
      seed: character.seed || normalizeSeed(),
      careerTier: inferredTier,
      careerExp: typeof character.careerExp === 'number' ? character.careerExp : 0,
      focusStance: character.focusStance || 'survival',
      lifeGoal: character.lifeGoal || LIFE_GOALS[0],
      goalAchieved: !!character.goalAchieved,
      innateTraits: Array.isArray(character.innateTraits) ? character.innateTraits : [],
      bonds: Array.isArray(character.bonds) ? character.bonds : [],
      milestones: Array.isArray(character.milestones) && character.milestones.length > 0
        ? character.milestones
        : [`테라력 ${character.year - character.age}년, ${character.nation}에서 ${character.race} 아이로 탄생`],
      bossKills: typeof character.bossKills === 'number' ? character.bossKills : 0,
      unlockedAchievements: Array.isArray(character.unlockedAchievements) ? character.unlockedAchievements : [],
      seenEventIds: Array.isArray(character.seenEventIds) ? character.seenEventIds : [],
      eventCooldowns: character.eventCooldowns || {}
    };
  }

  // 스탯 성장 한계 체감 곡선 (무한 스탯 인플레이션 방지 + 특성/집중태세 보정)
  public static applyStatGain(
    char: Character,
    stat: 'combat' | 'artsAptitude' | 'intellect' | 'luck',
    rawDelta: number
  ): number {
    if (rawDelta <= 0) {
      const prev = char.stats[stat] || 0;
      char.stats[stat] = Math.max(0, prev + rawDelta);
      return char.stats[stat] - prev;
    }

    let mult = 1.0;
    if (stat === 'combat') {
      if (this.hasTrait(char, 'talent_combat_frame')) mult += 0.25;
      if (char.focusStance === 'martial') mult += 0.2;
    } else if (stat === 'artsAptitude') {
      if (this.hasTrait(char, 'talent_arts_circuit')) mult += 0.25;
      if (this.hasTrait(char, 'flaw_arts_blockage')) mult -= 0.3;
      if (char.focusStance === 'arcane') mult += 0.2;
    } else if (stat === 'intellect') {
      if (char.focusStance === 'arcane') mult += 0.2;
    }

    const cur = char.stats[stat] || 0;
    if (cur >= 112) return 0;

    let diminish = 1.0;
    if (cur >= 98) diminish = 0.14;
    else if (cur >= 86) diminish = 0.26;
    else if (cur >= 72) diminish = 0.45;
    else if (cur >= 55) diminish = 0.72;

    const scaled = Math.round(rawDelta * mult * diminish);
    const effective = cur < 106 ? Math.max(1, scaled) : Math.max(0, scaled);
    const nextVal = Math.min(112, cur + effective);
    const actualGain = nextVal - cur;
    char.stats[stat] = nextVal;
    return actualGain;
  }

  public static setFocusStance(character: Character, stance: FocusStance): Character {
    return {
      ...this.ensureCharacterDefaults(character),
      focusStance: stance
    };
  }

  public static getSuppressantCost(char: Character): number {
    switch (char.oripathy.stage) {
      case 'Terminal':
        return 1550;
      case 'Severe':
        return 1250;
      case 'Mid':
        return 1000;
      default:
        return 800;
    }
  }

  public static getAnnualLivingExpense(char: Character): number {
    if (char.age < 15) return 0;
    let base = 180;
    switch (char.environment) {
      case '이동도시 상류층':
        base = 460;
        break;
      case '일반 거주구':
        base = 215;
        break;
      case '이동기지 (로도스/블랙스틸)':
        base = 185;
        break;
      case '슬럼가 및 암시장':
        base = 120;
        break;
      case '황야의 노마드 캠프':
        base = 95;
        break;
    }
    if (char.age >= 32) base += 45;
    if (this.hasTrait(char, 'flaw_family_debt')) {
      base = Math.round(base * 1.35);
    }
    return base;
  }

  // 업적 해금 헬퍼
  public static triggerAchievement(
    char: Character,
    achievementId: string,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ) {
    if (!char.unlockedAchievements) {
      char.unlockedAchievements = [];
    }

    if (!char.unlockedAchievements.includes(achievementId)) {
      char.unlockedAchievements.push(achievementId);
      const isNewGlobal = storage.saveUnlockedAchievement(achievementId, char.name, char.year);
      const ach = ACHIEVEMENTS_DATA.find(a => a.id === achievementId);
      if (ach) {
        sound.playSuccess();
        addLog({
          year: char.year,
          age: char.age,
          season: this.pickSeason(char, 3),
          title: `🏆 【업적 달성: ${ach.tier}】 ${ach.title}`,
          text: `${ach.description} (+${ach.points} Pts)${isNewGlobal ? ' [도감 최초 등록!]' : ''}`,
          type: 'critical',
          effectBadges: [`업적 +${ach.points} PTS`, isNewGlobal ? '도감 신규 해금' : '이번 생애 달성']
        });
      }
    }
  }

  // 생애 목표 실시간 체크
  public static checkAndUpdateLifeGoal(
    char: Character,
    addLog?: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ) {
    if (!char.lifeGoal || char.goalAchieved) return;
    const status = evaluateLifeGoal(char);
    if (status.achieved) {
      char.goalAchieved = true;
      this.recordMilestone(char, `${char.age}세: 일생의 목표 【${char.lifeGoal.title}】 달성`);
      if (addLog) {
        sound.playSuccess();
        addLog({
          year: char.year,
          age: char.age,
          season: this.pickSeason(char, 2),
          title: `🎯 【생애 목표 달성】 ${char.lifeGoal.title}`,
          text: `${char.lifeGoal.description}\n일생의 숙원을 마침내 완수했습니다! (영면 결산 시 +${char.lifeGoal.bonusPoints} PTS 부여)`,
          type: 'critical',
          effectBadges: [`생애 목표 완수`, `결산 보너스 +${char.lifeGoal.bonusPoints} PTS`]
        });
      }
    }
  }

  // 위기 시 소중한 인연의 목숨 건 구명 개입
  private static tryCompanionLifeSave(
    char: Character,
    crisisLabel: string,
    addLog?: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): boolean {
    const saviors = (char.bonds || []).filter(b => b.isAlive && b.affinity >= 55);
    if (saviors.length === 0) return false;

    const chance = Math.min(0.7, 0.42 + char.stats.luck * 0.0025);
    if (Math.random() >= chance) return false;

    const savior = saviors[0];
    savior.isAlive = false;
    savior.fateText = `${char.year}년(${char.age}세), ${crisisLabel} 속에서 당신을 감싸고 산화`;

    char.stats.health = Math.min(char.stats.maxHealth, 18);
    char.stats.sanity = Math.max(5, char.stats.sanity - 15);
    this.recordMilestone(char, `${char.age}세: 소중한 인연 '${savior.name}'(${savior.role})의 희생으로 사선에서 생환`);

    if (addLog) {
      sound.playHazardAlarm();
      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char, 2),
        title: `🕯️ 【인연의 희생】 ${savior.name}의 마지막 엄호`,
        text: `치명적인 위기(${crisisLabel})로 숨이 끊어지려던 찰나, [${savior.name}](${savior.role})이(가) 몸을 던져 당신을 밀쳐내고 대신 치명상을 입었습니다.\n"내 몫까지... 반드시 살아남아 줘..."`,
        type: 'critical',
        effectBadges: ['구사일생 (체력 18 복구)', `인연 상실: ${savior.name}`, '이성 -15']
      });
    }
    return true;
  }

  // 종족별 수명 및 노화 프로필 계산
  public static getCharacterLifespanProfile(char: Character): {
    baseLifespan: number;
    maxLifespan: number;
    agingStartAge: number;
    agingRate: number;
    effectiveMaxLifespan: number;
    effectiveAgingStart: number;
  } {
    const raceData = RACES_DATA.find(r => r.name === char.race || char.race.includes(r.name) || r.name.includes(char.race)) || RACES_DATA[0];
    let base = raceData.lifespan.baseLifespan;
    let max = raceData.lifespan.maxLifespan;
    let agingStart = raceData.lifespan.agingStartAge;
    let rate = raceData.lifespan.agingRate;

    if (char.subRace && raceData.lifespan.subRaceLifespans?.[char.subRace]) {
      const sub = raceData.lifespan.subRaceLifespans[char.subRace];
      base = sub.baseLifespan;
      max = sub.maxLifespan;
      agingStart = sub.agingStartAge;
      rate = sub.agingRate;
    }

    let effectiveMax = max;
    let effectiveAging = agingStart;

    if (char.oripathy.isInfected) {
      let penaltyRatio = (char.oripathy.crystallizationRate / 100) * 0.68;

      if (char.oripathy.lesionSite === '호흡기(폐)' || char.oripathy.lesionSite === '혈관계') {
        penaltyRatio += 0.14;
      } else if (char.oripathy.lesionSite === '신경계') {
        penaltyRatio += 0.11;
      }

      if (char.oripathy.suppressantDoseLeft > 0) {
        penaltyRatio *= 0.52;
      }

      penaltyRatio = Math.min(0.86, penaltyRatio);

      effectiveMax = Math.max(20, Math.round(max * (1 - penaltyRatio)));
      effectiveAging = Math.max(16, Math.round(agingStart * (1 - penaltyRatio * 0.6)));
    }

    return {
      baseLifespan: base,
      maxLifespan: max,
      agingStartAge: agingStart,
      agingRate: rate,
      effectiveMaxLifespan: effectiveMax,
      effectiveAgingStart: effectiveAging
    };
  }

  // 캐릭터 생성 (운명 시드 결정론적 난수 및 유년기 현실적 초기치 반영)
  public static createRandomCharacter(config?: ReincarnationConfig): Character {
    const perks = config?.perkIds || [];
    const seed = config?.useFixedSeed && config?.seed?.trim()
      ? normalizeSeed(config.seed)
      : normalizeSeed();
    const rng = createSeededRng(seed);

    // 1. 종족 결정
    let race = RACES_DATA[0];
    if (config?.raceId && config.raceId !== 'random') {
      race = RACES_DATA.find(r => r.id === config.raceId) || RACES_DATA[0];
    } else {
      const roll = rng();
      const ancientChance = perks.includes('perk_ancient_sovereign') ? 0.25 : 0.008;
      if (roll < ancientChance / 2) {
        race = RACES_DATA.find(r => r.id === 'draco') || RACES_DATA[0];
      } else if (roll < ancientChance) {
        race = RACES_DATA.find(r => r.id === 'aslan') || RACES_DATA[0];
      } else {
        const commonRaces = RACES_DATA.filter(r => r.id !== 'draco' && r.id !== 'aslan');
        race = commonRaces[Math.floor(rng() * commonRaces.length)];
      }
    }

    const subRace = race.subRaces ? race.subRaces[Math.floor(rng() * race.subRaces.length)] : undefined;
    const gender = config?.gender || (rng() < 0.5 ? '남성' : '여성');
    const name = config?.name?.trim() ? config.name.trim() : this.getRandomName(rng);

    // 2. 국가 결정
    let nation = NATIONS_DATA[Math.floor(rng() * NATIONS_DATA.length)];
    if (config?.nationId && config.nationId !== 'random') {
      nation = NATIONS_DATA.find(n => n.id === config.nationId) || nation;
    }

    // 3. 성장 환경 결정
    const environments: EnvironmentType[] = [
      '이동도시 상류층',
      '일반 거주구',
      '슬럼가 및 암시장',
      '황야의 노마드 캠프',
      '이동기지 (로도스/블랙스틸)'
    ];
    const environment = config?.environment || environments[Math.floor(rng() * environments.length)];

    // 4. 유년기(0세) 현실적 초기 스탯 스케일링 (성인 잠재력의 약 45%에서 출발)
    const initMaxHp = Math.max(45, Math.round(race.baseStats.maxHealth * 0.76));
    const initMaxSan = Math.max(50, Math.round(race.baseStats.maxSanity * 0.88));
    const stats: CharacterStats = {
      health: initMaxHp,
      maxHealth: initMaxHp,
      sanity: initMaxSan,
      maxSanity: initMaxSan,
      wealth: Math.max(60, Math.round(race.baseStats.wealth * 0.45)),
      combat: Math.max(12, Math.round(race.baseStats.combat * 0.45)),
      artsAptitude: Math.max(12, Math.round(race.baseStats.artsAptitude * 0.45)),
      intellect: Math.max(14, Math.round(race.baseStats.intellect * 0.46)),
      luck: Math.max(15, Math.round(race.baseStats.luck * 0.65))
    };

    // 환경별 초기 보정
    if (environment === '이동도시 상류층') {
      stats.wealth += 650;
      stats.intellect += 5;
    } else if (environment === '슬럼가 및 암시장') {
      stats.wealth = Math.max(30, stats.wealth - 120);
      stats.luck += 6;
      stats.combat += 3;
    } else if (environment === '황야의 노마드 캠프') {
      stats.maxHealth += 6;
      stats.health += 6;
      stats.combat += 5;
      stats.wealth = Math.max(20, stats.wealth - 150);
    } else if (environment === '이동기지 (로도스/블랙스틸)') {
      stats.artsAptitude += 5;
      stats.maxSanity += 5;
      stats.sanity += 5;
    }

    // 전생의 유산 계승 (직전 생애 자산의 10% 상속 - 도시의 한 사람으로 태어나 연계 시스템)
    const inheritedLmd = storage.consumeLastInheritanceLmd();
    if (inheritedLmd > 0) {
      stats.wealth += inheritedLmd;
    }

    // 5. 선천적 재능 1종 + 선천적 결점(멍에) 1종 추첨
    const talent = INNATE_TALENTS[Math.floor(rng() * INNATE_TALENTS.length)];
    const flaw = INNATE_FLAWS[Math.floor(rng() * INNATE_FLAWS.length)];
    const innateTraits = [talent, flaw];

    if (talent.id === 'talent_arts_circuit') stats.artsAptitude += 6;
    if (talent.id === 'talent_iron_lungs') { stats.maxHealth += 14; stats.health += 14; }
    if (talent.id === 'talent_street_sense') stats.luck += 8;
    if (talent.id === 'talent_merchant_eye') { stats.intellect += 5; stats.wealth += 150; }
    if (talent.id === 'talent_lucid_mind') { stats.maxSanity += 14; stats.sanity += 14; }
    if (talent.id === 'talent_combat_frame') stats.combat += 6;

    if (flaw.id === 'flaw_frail_body') {
      stats.maxHealth = Math.max(32, stats.maxHealth - 12);
      stats.health = Math.min(stats.maxHealth, stats.health);
    }
    if (flaw.id === 'flaw_family_debt') {
      stats.wealth = Math.max(10, Math.floor(stats.wealth * 0.5));
    }
    if (flaw.id === 'flaw_chronic_insomnia') {
      stats.maxSanity = Math.max(35, stats.maxSanity - 10);
      stats.sanity = Math.min(stats.maxSanity, stats.sanity);
    }
    if (flaw.id === 'flaw_ill_fated') {
      stats.luck = Math.max(6, stats.luck - 8);
    }
    if (flaw.id === 'flaw_reckless_blood') {
      stats.combat += 4;
    }

    // 6. 초기 광석병 감염 여부 결정
    let initialInfection = false;
    let baseInfectionChance = 0.16;
    if (race.id === 'sarkaz') baseInfectionChance += 0.25;
    if (race.id === 'cautus') baseInfectionChance += 0.14;
    if (environment === '슬럼가 및 암시장' || environment === '황야의 노마드 캠프') baseInfectionChance += 0.14;
    if (race.id === 'aegir') baseInfectionChance = 0.015;
    if (talent.id === 'talent_oripathy_tolerance') baseInfectionChance *= 0.65;
    if (flaw.id === 'flaw_originium_sensitive') baseInfectionChance *= 1.6;

    if (perks.includes('perk_pure_immunity')) {
      initialInfection = false;
    } else if (rng() < baseInfectionChance) {
      initialInfection = true;
    }

    const lesionSites = ['체표 피부', '호흡기(폐)', '신경계', '혈관계', '사지 골격'] as const;
    const chosenLesion = initialInfection ? lesionSites[Math.floor(rng() * lesionSites.length)] : '없음';

    const oripathy: OripathyStatus = {
      isInfected: initialInfection,
      crystallizationRate: initialInfection ? Number((1.0 + rng() * 4.0).toFixed(1)) : 0.0,
      originiumBloodDensity: initialInfection ? Number((0.18 + rng() * 0.15).toFixed(2)) : 0.08,
      stage: initialInfection ? 'Early' : 'Clean',
      lesionSite: chosenLesion,
      activeArtsMultiplier: initialInfection ? 1.25 : 1.0,
      suppressantDoseLeft: 0,
    };

    const initialSpray = ITEMS_DATA.find(i => i.id === 'med_emergency_spray')!;
    const inventory = [{ item: initialSpray, count: 1 }];
    const equipment: Character['equipment'] = {};
    const factions: Record<string, number> = {
      '로도스 아일랜드': 0,
      '용문 근위국': 0,
      '리유니온': 0,
      '라인 생명': 0,
      '블랙스틸': 0,
    };
    const secretFlags: Record<string, boolean> = {};

    // --- 환생 특전(Perks) 효과 적용 (밸런스 개편치 반영) ---
    if (perks.includes('perk_merchant_heir')) {
      stats.wealth += 900;
      stats.intellect += 5;
    }
    if (perks.includes('perk_martial_prodigy')) {
      stats.combat += 10;
      stats.maxHealth += 12;
      stats.health += 12;
      const blade = ITEMS_DATA.find(i => i.id === 'wp_guard_blade');
      if (blade) equipment.weapon = blade;
    }
    if (perks.includes('perk_arts_resonance')) {
      stats.artsAptitude += 12;
      stats.maxSanity += 12;
      stats.sanity += 12;
      stats.luck += 6;
    }
    if (perks.includes('perk_rhodes_sponsor')) {
      factions['로도스 아일랜드'] += 20;
      const supp = ITEMS_DATA.find(i => i.id === 'med_rhodes_suppressant');
      const sanPot = ITEMS_DATA.find(i => i.id === 'med_sanity_potion');
      if (supp) inventory.push({ item: supp, count: 2 });
      if (sanPot) inventory.push({ item: sanPot, count: 2 });
    }
    if (perks.includes('perk_pure_immunity')) {
      secretFlags['pure_immunity'] = true;
    }
    if (perks.includes('perk_ancient_sovereign')) {
      stats.combat += 8;
      stats.artsAptitude += 8;
      stats.intellect += 8;
      stats.luck += 8;
      stats.maxHealth += 8;
      stats.health += 8;
      stats.maxSanity += 8;
      stats.sanity += 8;
      stats.wealth += 1500;
    }

    // 7. 생애 목표(Life Goal) 배정
    const chosenGoal =
      (config?.goalId && config.goalId !== 'random' && LIFE_GOALS.find(g => g.id === config.goalId)) ||
      LIFE_GOALS[Math.floor(rng() * LIFE_GOALS.length)];

    const startYear = 1075 + Math.floor(rng() * 15);
    const birthMilestone = inheritedLmd > 0
      ? `테라력 ${startYear}년, ${nation.name} (${environment})에서 ${race.name}${subRace ? `(${subRace})` : ''} 아이로 탄생 (선조의 유산 ${inheritedLmd.toLocaleString()} LMD 상속)`
      : `테라력 ${startYear}년, ${nation.name} (${environment})에서 ${race.name}${subRace ? `(${subRace})` : ''} 아이로 탄생`;

    return {
      id: 'char_' + Date.now() + '_' + Math.floor(rng() * 10000),
      seed,
      name,
      gender,
      race: race.name,
      subRace,
      nation: nation.name,
      environment,
      age: 0,
      year: startYear,
      stats,
      oripathy,
      factions,
      career: '무직 (어린 시절)',
      careerRank: '초년생',
      careerTier: 0,
      careerExp: 0,
      focusStance: 'survival',
      lifeGoal: chosenGoal,
      goalAchieved: false,
      innateTraits,
      bonds: [],
      milestones: [birthMilestone],
      bossKills: 0,
      titles: [],
      equipment,
      inventory,
      actionPoints: 1,
      isAlive: true,
      secretFlags,
      unlockedAchievements: [],
      seenEventIds: [],
      eventCooldowns: {},
      reincarnationPerks: perks
    };
  }

  // 일반 직급 승급 심사 (Tier 1 -> Tier 2 -> Tier 3 -> Tier 4)
  public static getNextPromotionThreshold(char: Character): CareerTierThreshold | undefined {
    const tier = char.careerTier ?? (char.age >= 15 ? 1 : 0);
    if (char.age < 15 || char.specialCareerId || tier < 1 || tier >= 4) return undefined;
    return CAREER_PROMOTION_THRESHOLDS.find(t => t.targetTier === tier + 1);
  }

  public static checkTierPromotionEligibility(char: Character): {
    eligible: boolean;
    threshold?: CareerTierThreshold;
    reasons: string[];
  } {
    const threshold = this.getNextPromotionThreshold(char);
    if (!threshold) {
      return { eligible: false, reasons: ['현재 일반 직급 승급 심사 대상이 아닙니다.'] };
    }

    const reasons: string[] = [];
    const exp = char.careerExp || 0;
    const bestStat = Math.max(char.stats.combat, char.stats.artsAptitude, char.stats.intellect);

    if (exp < threshold.reqExp) {
      reasons.push(`직무 공적(EXP) ${threshold.reqExp} 이상 필요 (현재 ${exp})`);
    }
    if (bestStat < threshold.reqMainStat) {
      reasons.push(`주력 역량(전투/아츠/지략 중 최고치) ${threshold.reqMainStat} 이상 필요 (현재 ${bestStat})`);
    }
    if (char.stats.wealth < threshold.examFee) {
      reasons.push(`심사 수수료 ${threshold.examFee.toLocaleString()} LMD 필요`);
    }

    return {
      eligible: reasons.length === 0,
      threshold,
      reasons
    };
  }

  public static attemptCareerTierPromotion(
    character: Character,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    const baseChar = this.ensureCharacterDefaults(character);
    const check = this.checkTierPromotionEligibility(baseChar);
    if (!check.eligible || !check.threshold) return baseChar;

    const threshold = check.threshold;
    const char: Character = {
      ...baseChar,
      stats: { ...baseChar.stats },
      titles: [...baseChar.titles],
      milestones: [...(baseChar.milestones || [])],
      unlockedAchievements: [...(baseChar.unlockedAchievements || [])]
    };

    char.stats.wealth -= threshold.examFee;
    const bestStat = Math.max(char.stats.combat, char.stats.artsAptitude, char.stats.intellect);
    const rawRoll = Math.floor(Math.random() * 100) + 1;
    const bonus = Math.floor(bestStat / 3.5) + (char.focusStance === 'career' ? 5 : 0);
    const total = rawRoll + bonus;

    sound.playDiceRoll();

    if (rawRoll >= 92 || total >= threshold.examDc) {
      char.careerTier = threshold.targetTier;
      char.careerRank = getTierRankTitle(char.career, char.careerTier);
      this.applyStatGain(char, 'intellect', 2);
      this.recordMilestone(char, `${char.age}세: [${char.career}] ${char.careerRank}(Tier ${char.careerTier}) 승급 심사 합격`);

      if (char.careerTier >= 2) {
        this.triggerAchievement(char, 'common_steady_worker', addLog);
      }
      this.checkAndUpdateLifeGoal(char, addLog);

      sound.playSuccess();
      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char, 1),
        title: `📜 【직급 승급 합격】 ${char.careerRank} (Tier ${char.careerTier})`,
        text: `치열한 실무 검증과 심사를 통과하여 [${char.career}]의 【${char.careerRank}】 직급으로 정식 승급했습니다! (주사위 ${rawRoll} + 역량보정 ${bonus} = ${total} / 목표 ${threshold.examDc})`,
        type: 'critical',
        effectBadges: [
          `직급 Tier ${char.careerTier}`,
          `직위: ${char.careerRank}`,
          `LMD -${threshold.examFee.toLocaleString()}`
        ]
      });
    } else {
      char.careerExp = Math.max(0, (char.careerExp || 0) - 10);
      char.stats.sanity = Math.max(5, char.stats.sanity - 6);
      sound.playBeep(320, 0.12, 'sawtooth');
      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char, 1),
        title: `【승급 심사 탈락】 ${threshold.label}`,
        text: `까다로운 심사관들의 실전 평가 기준을 아쉽게 넘지 못했습니다. 공적을 더 쌓아 재도전해야 합니다. (주사위 ${rawRoll} + 역량보정 ${bonus} = ${total} / 목표 ${threshold.examDc})`,
        type: 'hazard',
        effectBadges: [`LMD -${threshold.examFee.toLocaleString()}`, '공적 EXP -10', '이성 -6']
      });
    }

    return char;
  }

  // 특수 직군(Tier 5) 해금 자격 검사
  public static checkSpecialCareerEligibility(char: Character, career: SpecialCareer): {
    eligible: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];
    const tier = char.careerTier ?? 0;

    if (char.age < 22) {
      reasons.push(`연령 22세 이상 필요 (현재 ${char.age}세)`);
    }
    if (tier < 3) {
      reasons.push(`직급 3단계(베테랑) 이상 경력 필요 (현재 Tier ${tier})`);
    }
    if (career.allowedRaces && !career.allowedRaces.some(r => char.race.includes(r))) {
      reasons.push(`종족 제한: ${career.allowedRaces.join(', ')}`);
    }
    if (career.allowedNations && !career.allowedNations.some(n => char.nation.includes(n))) {
      reasons.push(`출신 국가 제한: ${career.allowedNations.join(', ')}`);
    }
    if (career.reqMinStats) {
      for (const [k, minVal] of Object.entries(career.reqMinStats)) {
        const key = k as keyof CharacterStats;
        const cur = char.stats[key] || 0;
        if (typeof minVal === 'number' && cur < minVal) {
          reasons.push(`${STAT_LABELS[key] || key} ${minVal.toLocaleString()} 이상 (현재 ${cur.toLocaleString()})`);
        }
      }
    }
    if (career.reqMinReputation) {
      for (const [f, minRep] of Object.entries(career.reqMinReputation)) {
        const curRep = char.factions[f] || 0;
        if (curRep < minRep) {
          reasons.push(`${f} 평판 ${minRep} 이상 (현재 ${curRep})`);
        }
      }
    }
    if (career.reqInfected !== undefined && career.reqInfected !== char.oripathy.isInfected) {
      reasons.push(career.reqInfected ? '광석병 감염자 전용' : '비감염자 전용');
    }

    return {
      eligible: reasons.length === 0,
      reasons
    };
  }

  // 특수 직군(Tier 5) 공식 임관 / 전직 (가짜 엔딩 플래그 자동 부여 버그 제거)
  public static promoteToSpecialCareer(
    character: Character,
    careerId: string,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    const baseChar = this.ensureCharacterDefaults(character);
    const career = SPECIAL_CAREERS_DATA.find(c => c.id === careerId);
    if (!career || baseChar.specialCareerId === careerId) return baseChar;

    const check = this.checkSpecialCareerEligibility(baseChar, career);
    if (!check.eligible) return baseChar;

    const char: Character = {
      ...baseChar,
      stats: { ...baseChar.stats },
      titles: [...baseChar.titles],
      milestones: [...(baseChar.milestones || [])],
      secretFlags: { ...baseChar.secretFlags },
      unlockedAchievements: [...(baseChar.unlockedAchievements || [])]
    };

    char.specialCareerId = career.id;
    char.career = career.name;
    char.careerRank = career.rank;
    char.careerTier = 5;

    const badges: string[] = [`특수직군(Tier 5): ${career.rank}`];

    if (career.category === 'combat') {
      const g = this.applyStatGain(char, 'combat', 10);
      char.stats.maxHealth += 12;
      char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + 12);
      badges.push(`전투력 +${g}`, '최대체력 +12');
    } else if (career.category === 'arts') {
      const g = this.applyStatGain(char, 'artsAptitude', 12);
      char.stats.maxSanity += 10;
      char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 10);
      badges.push(`아츠 +${g}`, '최대이성 +10');
    } else if (career.category === 'intellect') {
      const g = this.applyStatGain(char, 'intellect', 12);
      char.stats.wealth += 900;
      badges.push(`지략 +${g}`, 'LMD +900');
    } else {
      this.applyStatGain(char, 'combat', 6);
      this.applyStatGain(char, 'artsAptitude', 6);
      this.applyStatGain(char, 'intellect', 6);
      char.stats.wealth += 800;
      badges.push('전투/아츠/지략 상승', 'LMD +800');
    }

    if (!char.titles.includes(career.rank)) {
      char.titles.push(career.rank);
    }

    this.recordMilestone(char, `${char.age}세: 최고위 특수 직군 【${career.name}】 임관`);
    this.checkAndUpdateLifeGoal(char, addLog);

    sound.playSuccess();
    addLog({
      year: char.year,
      age: char.age,
      season: this.pickSeason(char, 2),
      title: `🎖️ 【특수 직군 임관】 ${career.name}`,
      text: `${career.description}\n"${career.loreSecret}"`,
      type: 'critical',
      effectBadges: badges
    });

    const achId = CAREER_ACHIEVEMENT_MAP[career.id];
    if (achId) {
      this.triggerAchievement(char, achId, addLog);
    }

    return char;
  }

  // 무기고 및 암시장 아이템 구매 / 장착
  public static buyOrEquipItem(
    character: Character,
    itemId: string,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    const baseChar = this.ensureCharacterDefaults(character);
    const item = ITEMS_DATA.find(i => i.id === itemId);
    if (!item) return baseChar;

    const char: Character = {
      ...baseChar,
      stats: { ...baseChar.stats },
      equipment: { ...baseChar.equipment },
      inventory: baseChar.inventory.map(s => ({ ...s, item: { ...s.item } })),
      unlockedAchievements: [...(baseChar.unlockedAchievements || [])]
    };

    const effectivePrice = item.id === 'med_rhodes_suppressant' ? this.getSuppressantCost(char) : item.price;

    if (item.type === 'weapon' || item.type === 'armor') {
      const currentEquipped = item.type === 'weapon' ? char.equipment.weapon : char.equipment.armor;
      if (currentEquipped?.id === item.id) return char;

      if (char.stats.wealth < effectivePrice) return char;
      char.stats.wealth -= effectivePrice;

      if (currentEquipped?.healthBonus) {
        char.stats.maxHealth = Math.max(30, char.stats.maxHealth - currentEquipped.healthBonus);
        char.stats.health = Math.min(char.stats.maxHealth, char.stats.health);
      }
      if (currentEquipped?.artsBonus) {
        char.stats.artsAptitude = Math.max(0, char.stats.artsAptitude - currentEquipped.artsBonus);
      }

      if (item.type === 'weapon') {
        char.equipment.weapon = item;
      } else {
        char.equipment.armor = item;
      }

      const badges: string[] = [`LMD -${effectivePrice.toLocaleString()}`];
      if (item.atkBonus) badges.push(`장비 공격력 +${item.atkBonus}`);
      if (item.defBonus) badges.push(`장비 방어력 +${item.defBonus}`);
      if (item.artsBonus) {
        char.stats.artsAptitude = Math.min(115, char.stats.artsAptitude + item.artsBonus);
        badges.push(`아츠 +${item.artsBonus}`);
      }
      if (item.healthBonus) {
        char.stats.maxHealth += item.healthBonus;
        char.stats.health += item.healthBonus;
        badges.push(`최대체력 +${item.healthBonus}`);
      }

      sound.playSuccess();
      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char),
        title: `🛡️ 【장비 조달 및 장착】 ${item.name}`,
        text: `${item.description} (${effectivePrice.toLocaleString()} LMD 지불)`,
        type: 'general',
        effectBadges: badges
      });
      return char;
    } else {
      if (char.stats.wealth < effectivePrice) return char;
      char.stats.wealth -= effectivePrice;

      const existing = char.inventory.find(s => s.item.id === item.id);
      if (existing) {
        existing.count += 1;
      } else {
        char.inventory.push({ item, count: 1 });
      }

      sound.playBeep(720, 0.06, 'sine');
      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char),
        title: `💊 【물자 구매】 ${item.name}`,
        text: `${item.description} (보유 수량: ${existing ? existing.count : 1}개)`,
        type: 'general',
        effectBadges: [`LMD -${effectivePrice.toLocaleString()}`, `${item.name} +1`]
      });
      return char;
    }
  }

  // 비전투 중 인벤토리 의약품 즉시 사용
  public static useInventoryItem(
    character: Character,
    itemId: string,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    const baseChar = this.ensureCharacterDefaults(character);
    const char: Character = {
      ...baseChar,
      stats: { ...baseChar.stats },
      oripathy: { ...baseChar.oripathy },
      inventory: baseChar.inventory.map(s => ({ ...s, item: { ...s.item } })),
      unlockedAchievements: [...(baseChar.unlockedAchievements || [])]
    };

    const slot = char.inventory.find(s => s.item.id === itemId && s.count > 0);
    if (!slot) return baseChar;

    slot.count -= 1;
    const item = slot.item;

    if (item.effectType === 'heal_hp') {
      const val = item.effectValue || 35;
      char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + val);
      sound.playSuccess();
      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char),
        title: `🩹 【응급 처치】 ${item.name}`,
        text: `상처 부위에 약제를 투여하여 체력을 회복했습니다.`,
        type: 'general',
        effectBadges: [`체력 +${val}`]
      });
    } else if (item.effectType === 'heal_san') {
      const val = item.effectValue || 30;
      char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + val);
      sound.playSuccess();
      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char),
        title: `🧪 【신경 안정】 ${item.name}`,
        text: `청록색 신경 안정제를 복용하여 정신적 피로를 씻어냈습니다.`,
        type: 'general',
        effectBadges: [`이성 +${val}`]
      });
    } else if (item.effectType === 'suppress_oripathy') {
      if (item.id === 'med_blackmarket_fake') {
        char.oripathy.suppressantDoseLeft += 1;
        if (Math.random() < 0.45) {
          char.stats.health = Math.max(5, char.stats.health - 18);
          char.stats.sanity = Math.max(5, char.stats.sanity - 16);
          sound.playHazardAlarm();
          addLog({
            year: char.year,
            age: char.age,
            season: this.pickSeason(char),
            title: `⚠️ 【불법 약물 부작용】 ${item.name}`,
            text: `억제 효과(1년)는 나타났으나, 정제되지 않은 불순물로 인해 심한 구토와 신경 독성을 겪었습니다!`,
            type: 'hazard',
            effectBadges: ['억제제 +1년', '체력 -18', '이성 -16']
          });
        } else {
          sound.playBeep(650, 0.08, 'sine');
          addLog({
            year: char.year,
            age: char.age,
            season: this.pickSeason(char),
            title: `💉 【암시장 약물 투약】 ${item.name}`,
            text: `다행히 큰 부작용 없이 오리지늄 활성화를 1년간 억제했습니다.`,
            type: 'oripathy',
            effectBadges: ['억제제 +1년']
          });
        }
      } else {
        const yrs = item.effectValue || 3;
        char.oripathy.suppressantDoseLeft += yrs;
        char.oripathy.crystallizationRate = Math.max(0, Number((char.oripathy.crystallizationRate - 0.5).toFixed(1)));
        sound.playSuccess();
        this.triggerAchievement(char, 'common_rhodes_medicine', addLog);
        addLog({
          year: char.year,
          age: char.age,
          season: this.pickSeason(char),
          title: `💉 【정품 억제제 투약】 ${item.name}`,
          text: `로도스 정품 앰플을 투약하여 결정화 진행을 ${yrs}년간 동결했습니다.`,
          type: 'oripathy',
          effectBadges: [`억제제 +${yrs}년`, '결정화 -0.5%']
        });
      }
    }

    char.inventory = char.inventory.filter(s => s.count > 0);
    return char;
  }

  // 연간 직무 급여 계산 (직급 Tier 및 감염자 임금 차별 반영)
  public static getCareerAnnualSalary(char: Character): number {
    if (char.age < 15) return 0;
    const tier = char.specialCareerId ? 5 : Math.max(1, char.careerTier || 1);
    const mainStat = char.career.includes('용병')
      ? char.stats.combat
      : Math.max(char.stats.intellect, Math.round((char.stats.combat + char.stats.artsAptitude) * 0.5));

    const tierBase = [0, 185, 275, 385, 515, 710][Math.min(5, tier)];
    const tierScale = [0, 1.35, 1.75, 2.15, 2.6, 3.1][Math.min(5, tier)];
    let salary = tierBase + Math.floor(mainStat * tierScale);

    if (this.hasTrait(char, 'talent_merchant_eye')) salary = Math.round(salary * 1.2);
    if (char.focusStance === 'career') salary = Math.round(salary * 1.2);
    if (this.hasTrait(char, 'flaw_marked_outcast')) salary = Math.round(salary * 0.85);

    // 테라 현실의 감염자 임금 불이익 (중기 이상 광석병, 로도스 외 일반 사회)
    const isProtected = char.career.includes('로도스') || char.environment === '이동기지 (로도스/블랙스틸)';
    if (char.oripathy.isInfected && char.oripathy.stage !== 'Early' && !isProtected) {
      const harshNations = ['우르수스 제국', '이베리아', '빅토리아', '염국'];
      const cutRatio = harshNations.some(n => char.nation.includes(n)) ? 0.65 : 0.75;
      salary = Math.round(salary * cutRatio);
    }

    return Math.max(60, salary);
  }

  // 1년 경과 (사계절 시뮬레이션, 가혹한 테라 생계/병리/재앙, 직급 경력, 사건 탐색)
  public static advanceOneYear(
    character: Character,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void,
    options?: {
      autoManageApAndShop?: boolean;
      aiStrategy?: AIStrategy;
    }
  ): { updatedChar: Character; triggeredEvent?: GameEvent } {
    const hydrated = this.ensureCharacterDefaults(character);
    let char: Character = {
      ...hydrated,
      stats: { ...hydrated.stats },
      oripathy: { ...hydrated.oripathy },
      factions: { ...hydrated.factions },
      titles: [...hydrated.titles],
      bonds: (hydrated.bonds || []).map(b => ({ ...b })),
      milestones: [...(hydrated.milestones || [])],
      secretFlags: { ...hydrated.secretFlags },
      unlockedAchievements: [...(hydrated.unlockedAchievements || [])],
      seenEventIds: [...(hydrated.seenEventIds || [])],
      eventCooldowns: { ...(hydrated.eventCooldowns || {}) }
    };

    // 이전 해에 남은 AP가 있고 자동 관리가 켜져 있으면 활용
    if (options?.autoManageApAndShop && char.isAlive && char.age >= 10) {
      char = this.runAutoYearlyManagement(char, options.aiStrategy || 'balanced', addLog);
    }

    char.age += 1;
    char.year += 1;
    char.actionPoints = (char.careerTier || 0) >= 3 && char.stats.intellect >= 82 ? 2 : 1;

    // 유년기 자연 신체 발육 (1~15세)
    if (char.age <= 15) {
      char.stats.maxHealth += 2;
      char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + 2);
      if (char.age % 2 === 1) {
        char.stats.maxSanity += 1;
        char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 1);
      }
    }

    // 15세 성인식 기본 직업 및 Tier 1 진입
    if (char.age >= 15 && (char.careerTier || 0) === 0) {
      char.careerTier = 1;
      if (char.career === '무직 (어린 시절)') {
        char.career = '독립 생활자';
      }
      char.careerRank = getTierRankTitle(char.career, 1);
    }

    // 집중 태세(/boost) 및 선천적 결점 연간 유지 효과
    if (char.age >= 12) {
      const stance = char.focusStance || 'survival';
      if (stance === 'survival') {
        char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + 3);
        char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 3);
      } else if (stance === 'martial') {
        char.stats.health = Math.max(4, char.stats.health - 2);
        if (char.age >= 15) char.careerExp = (char.careerExp || 0) + 2;
      } else if (stance === 'arcane') {
        char.stats.sanity = Math.max(4, char.stats.sanity - 2);
        if (char.age >= 15) char.careerExp = (char.careerExp || 0) + 2;
      } else if (stance === 'career') {
        char.stats.sanity = Math.max(4, char.stats.sanity - 2);
        char.stats.health = Math.max(4, char.stats.health - 1);
        if (char.age >= 15) char.careerExp = (char.careerExp || 0) + 5;
      }

      if (this.hasTrait(char, 'flaw_chronic_insomnia')) {
        let sanDrain = 2;
        if (this.hasTrait(char, 'talent_lucid_mind')) sanDrain = 1;
        char.stats.sanity = Math.max(2, char.stats.sanity - sanDrain);
      }
    }

    // 성인기 연간 정기 급여 & 가혹한 테라 생계비/세금 정산 (매년 상시 작동)
    let annualNetLmd = 0;
    let annualSalary = 0;
    let annualLivingCost = 0;
    if (char.age >= 15) {
      annualSalary = this.getCareerAnnualSalary(char);
      annualLivingCost = this.getAnnualLivingExpense(char);
      annualNetLmd = annualSalary - annualLivingCost;

      const baseExpGain = char.focusStance === 'survival' ? 4 : 6;
      char.careerExp = (char.careerExp || 0) + baseExpGain;

      if (char.stats.wealth + annualNetLmd < 0) {
        char.stats.wealth = 0;
        char.stats.health = Math.max(0, char.stats.health - 8);
        char.stats.sanity = Math.max(0, char.stats.sanity - 7);
        sound.playHazardAlarm();
        addLog({
          year: char.year,
          age: char.age,
          season: '겨울',
          title: '【극빈 생활고】 생계비 체납과 기아',
          text: `연간 보수(${annualSalary.toLocaleString()} LMD)로 거주세·식량비(${annualLivingCost.toLocaleString()} LMD)를 감당하지 못해 자산이 바닥났습니다. 추위와 굶주림이 육신과 정신을 갉아먹습니다.`,
          type: 'hazard',
          effectBadges: ['자산 0 LMD', '체력 -8', '이성 -7']
        });
      } else {
        char.stats.wealth += annualNetLmd;
      }
    }

    // 상류층 거주구 광석병 발각 시 재산 몰수 및 슬럼가 강제 추방 (테라 현실 고증)
    if (
      char.oripathy.isInfected &&
      char.environment === '이동도시 상류층' &&
      char.age >= 12 &&
      (char.oripathy.crystallizationRate >= 7.5 || Math.random() < 0.35)
    ) {
      const confiscated = Math.floor(char.stats.wealth * 0.65);
      char.stats.wealth = Math.max(0, char.stats.wealth - confiscated);
      char.environment = '슬럼가 및 암시장';
      char.stats.sanity = Math.max(5, char.stats.sanity - 18);
      this.recordMilestone(char, `${char.age}세: 광석병 발각으로 상류층 거주권 박탈 및 하층 슬럼가 추방`);
      sound.playHazardAlarm();
      addLog({
        year: char.year,
        age: char.age,
        season: '가을',
        title: '🚨 【거주권 박탈】 상류 구획 방역국 강제 추방령',
        text: `정기 방역 검진에서 광석병 감염 사실이 발각되었습니다! 이동도시 행정국은 "방역 정화 비용" 명목으로 자산의 65%(${confiscated.toLocaleString()} LMD)를 압류하고 당신을 하층 슬럼가로 강제 추방했습니다.`,
        type: 'hazard',
        effectBadges: [`압류 -${confiscated.toLocaleString()} LMD`, '슬럼가 강제 이주', '이성 -18']
      });
    }

    // --- 나이 및 생존 마일스톤 업적 ---
    if (char.age >= 1) this.triggerAchievement(char, 'common_first_breath', addLog);
    if (char.age >= 15) this.triggerAchievement(char, 'common_coming_of_age', addLog);
    if (char.age >= 30) this.triggerAchievement(char, 'common_survive_30', addLog);
    if (char.age >= 50) this.triggerAchievement(char, 'rare_survive_50', addLog);
    if (char.age >= 70) this.triggerAchievement(char, 'mystic_longevity_70', addLog);
    if (char.age >= 100) this.triggerAchievement(char, 'mystic_centenarian_100', addLog);

    if (char.race.includes('살카즈') && char.age >= 150) {
      this.triggerAchievement(char, 'unique_sarkaz_elder_150', addLog);
    }
    if (char.race.includes('살카즈') && char.age >= 200) {
      this.triggerAchievement(char, 'legend_sarkaz_two_centuries', addLog);
    }
    if (char.race.includes('에기르') && char.age >= 120) {
      this.triggerAchievement(char, 'unique_aegir_deep_longevity', addLog);
    }

    if (!char.oripathy.isInfected && char.age >= 60) {
      this.triggerAchievement(char, 'rare_pure_blood_60', addLog);
    }

    if (char.oripathy.isInfected && char.oripathy.crystallizationRate >= 70 && char.age >= 35) {
      this.triggerAchievement(char, 'unique_crystallized_will', addLog);
    }

    if (char.age >= 50 && char.stats.wealth <= 200) {
      this.triggerAchievement(char, 'rare_ascetic_hermit', addLog);
    }

    if (char.stats.luck <= 15 && char.age >= 40) {
      this.triggerAchievement(char, 'rare_miraculous_misfortune', addLog);
    }

    // --- 자산 마일스톤 ---
    if (char.stats.wealth >= 1000) this.triggerAchievement(char, 'common_wealth_1k', addLog);
    if (char.stats.wealth >= 30000) this.triggerAchievement(char, 'unique_lmd_tycoon_max', addLog);
    if (char.stats.wealth >= 50000) this.triggerAchievement(char, 'unique_wealth_50k', addLog);
    if (char.stats.wealth >= 100000) this.triggerAchievement(char, 'legend_columbia_bank_sovereign', addLog);

    // --- 스탯 극대화 마일스톤 ---
    if (char.stats.artsAptitude >= 90) this.triggerAchievement(char, 'rare_arts_mastery', addLog);
    if (char.stats.combat >= 90) this.triggerAchievement(char, 'rare_iron_warlord', addLog);
    if (char.stats.intellect >= 90) this.triggerAchievement(char, 'rare_grand_intellect', addLog);
    if (char.stats.luck >= 90) this.triggerAchievement(char, 'rare_destiny_favored', addLog);

    if (char.stats.combat >= 100) this.triggerAchievement(char, 'unique_combat_apex', addLog);
    if (char.stats.artsAptitude >= 100) this.triggerAchievement(char, 'unique_arts_apex', addLog);
    if (char.stats.intellect >= 100) this.triggerAchievement(char, 'unique_intellect_apex', addLog);

    if (char.race.includes('드라코') && char.stats.artsAptitude >= 95) {
      this.triggerAchievement(char, 'legend_draco_apocalypse', addLog);
    }
    if (char.race.includes('아슬란') && char.stats.combat >= 95) {
      this.triggerAchievement(char, 'legend_aslan_empire_conqueror', addLog);
    }
    if (char.race.includes('살카즈') && char.stats.artsAptitude >= 85 && char.oripathy.activeArtsMultiplier >= 2.0) {
      this.triggerAchievement(char, 'mystic_sarkaz_blood_surge', addLog);
    }
    if (char.race.includes('산크타') && char.stats.sanity >= 95) {
      this.triggerAchievement(char, 'mystic_sankta_pure_halo', addLog);
    }
    if (char.race.includes('에기르') && char.stats.health >= 95 && char.stats.combat >= 90) {
      this.triggerAchievement(char, 'mystic_aegir_prime_physique', addLog);
    }

    // --- 진영 평판 마일스톤 ---
    if ((char.factions['로도스 아일랜드'] || 0) >= 60) this.triggerAchievement(char, 'rare_rhodes_specialist', addLog);
    if ((char.factions['용문 근위국'] || 0) >= 50) this.triggerAchievement(char, 'rare_lungmen_captain', addLog);
    if ((char.factions['블랙스틸'] || 0) >= 50) this.triggerAchievement(char, 'rare_blacksteel_contract', addLog);
    if ((char.factions['쉐라그'] || 0) >= 50) this.triggerAchievement(char, 'rare_karlan_trust', addLog);
    if ((char.factions['쉐라그'] || 0) >= 70) this.triggerAchievement(char, 'mystic_silverash_confidant', addLog);

    // 1. 테라 대사건 타임라인 속보 체크 (공짜 시크릿 엔딩 플래그 부여 제거)
    const worldNewsList = WORLD_TIMELINE.filter(t => t.year === char.year);
    for (const worldNews of worldNewsList) {
      sound.playBeep(900, 0.08, 'sawtooth');
      const newsBadges: string[] = [];

      if (worldNews.year === 1089 && (char.nation.includes('카즈델') || char.race.includes('살카즈'))) {
        const g = this.applyStatGain(char, 'combat', 3);
        newsBadges.push(`전투력 +${g}`);
      } else if (worldNews.year === 1091) {
        char.factions['로도스 아일랜드'] = (char.factions['로도스 아일랜드'] || 0) + 8;
        newsBadges.push('로도스 평판 +8');
        if (char.oripathy.isInfected) {
          char.oripathy.suppressantDoseLeft += 1;
          newsBadges.push('보급 억제제 +1년');
        }
      } else if (worldNews.year === 1096) {
        const g = this.applyStatGain(char, 'combat', 2);
        char.stats.sanity = Math.max(8, char.stats.sanity - 5);
        newsBadges.push(`전투력 +${g}`, '이성 -5');
      } else if (worldNews.year === 1097 && worldNews.region === '카시미어' && char.nation.includes('카시미어')) {
        char.stats.wealth += 300;
        const g = this.applyStatGain(char, 'combat', 2);
        newsBadges.push('LMD +300', `전투력 +${g}`);
      } else if (worldNews.year === 1099 && worldNews.region === '빅토리아' && char.nation.includes('빅토리아')) {
        const g = this.applyStatGain(char, 'combat', 3);
        char.stats.sanity = Math.max(8, char.stats.sanity - 6);
        newsBadges.push(`전투력 +${g}`, '이성 -6');
      } else if (worldNews.year === 1100) {
        const g = this.applyStatGain(char, 'intellect', 3);
        char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 6);
        newsBadges.push(`지략 +${g}`, '이성 +6');
      }

      addLog({
        year: char.year,
        age: char.age,
        season: '여름',
        title: `【라디오 속보】 ${worldNews.title}`,
        text: `${worldNews.broadcastText}\n(효과: ${worldNews.inGameEffectText})`,
        type: 'news',
        effectBadges: newsBadges.length > 0 ? newsBadges : [`지역: ${worldNews.region}`]
      });
    }

    // 2. 4단계 실제 광석병 병리 및 장기 손상·발작 시뮬레이션
    if (char.oripathy.isInfected) {
      const wasSuppressed = char.oripathy.suppressantDoseLeft > 0;
      if (wasSuppressed) {
        char.oripathy.suppressantDoseLeft -= 1;
        const creep = char.oripathy.stage === 'Terminal' ? 0.5 : char.oripathy.stage === 'Severe' ? 0.35 : 0.2;
        char.oripathy.crystallizationRate = Number((char.oripathy.crystallizationRate + creep).toFixed(1));
        addLog({
          year: char.year,
          age: char.age,
          season: '봄',
          title: '광석병 억제제 약효 유지',
          text: `억제제 투약 덕분에 급격한 결정 확산을 억제하고 있습니다. (현재 결정화율: ${char.oripathy.crystallizationRate}%, 잔여 약효: ${char.oripathy.suppressantDoseLeft}년)`,
          type: 'oripathy',
          effectBadges: [`결정화 +${creep}%`, `억제 잔여 ${char.oripathy.suppressantDoseLeft}년`]
        });
      } else {
        let increase = 1.4 + Math.random() * 2.4;
        if (this.hasTrait(char, 'flaw_originium_sensitive')) increase *= 1.4;
        if (this.hasTrait(char, 'talent_oripathy_tolerance')) increase *= 0.7;
        const incFixed = Number(increase.toFixed(1));

        char.oripathy.crystallizationRate = Number((char.oripathy.crystallizationRate + incFixed).toFixed(1));
        char.oripathy.originiumBloodDensity = Number((char.oripathy.originiumBloodDensity + 0.03).toFixed(2));
        char.stats.sanity = Math.max(0, char.stats.sanity - 5);

        addLog({
          year: char.year,
          age: char.age,
          season: '겨울',
          title: '광석병 체내 침식 가속',
          text: `억제제가 고갈되어 장기 주변 오리지늄 결정이 날카롭게 증식합니다! (결정화율 +${incFixed}% → 현재 ${char.oripathy.crystallizationRate}%, 혈중 농도: ${char.oripathy.originiumBloodDensity}u/L)`,
          type: 'hazard',
          effectBadges: [`결정화 +${incFixed}%`, '이성 -5']
        });
        sound.playHazardAlarm();
        this.triggerAchievement(char, 'common_suppressant_shortage', addLog);
      }

      const rate = char.oripathy.crystallizationRate;
      const prevStage = char.oripathy.stage;
      if (rate >= 100) {
        char.oripathy.stage = 'Crystallized';
        char.isAlive = false;
        this.recordMilestone(char, `${char.age}세: 오리지늄 결정화율 100% 도달, 검은 원석 분진으로 산화`);
        char.deathRecord = this.generateDeathRecord(
          char,
          'OripathyCrystallization',
          '체세포 오리지늄 결정화율 100% 도달로 인한 전신 결정 파열 사망',
          '빛나는 검은 결정이 피부를 뚫고 솟구치며... 마지막 숨결이 흩어집니다.'
        );
        sound.playFlatline();
        return { updatedChar: char };
      } else if (rate >= 60) {
        char.oripathy.stage = 'Terminal';
        char.oripathy.activeArtsMultiplier = 2.6;
      } else if (rate >= 30) {
        char.oripathy.stage = 'Severe';
        char.oripathy.activeArtsMultiplier = 1.95;
      } else if (rate >= 10) {
        char.oripathy.stage = 'Mid';
        char.oripathy.activeArtsMultiplier = 1.45;
      } else {
        char.oripathy.stage = 'Early';
        char.oripathy.activeArtsMultiplier = 1.2;
      }

      if (prevStage !== char.oripathy.stage && (char.oripathy.stage === 'Severe' || char.oripathy.stage === 'Terminal')) {
        this.recordMilestone(char, `${char.age}세: 광석병이 ${char.oripathy.stage === 'Terminal' ? '말기(STAGE IV)' : '중증(STAGE III)'} 단계로 악화`);
      }

      // 단계별 실제 육체 침식 및 병소별 급성 발작
      if (char.oripathy.stage === 'Mid') {
        char.stats.sanity = Math.max(0, char.stats.sanity - (wasSuppressed ? 1 : 3));
      } else if (char.oripathy.stage === 'Severe') {
        char.stats.maxHealth = Math.max(25, char.stats.maxHealth - (wasSuppressed ? 1 : 2));
        char.stats.health = Math.max(0, Math.min(char.stats.maxHealth, char.stats.health - (wasSuppressed ? 3 : 6)));
        char.stats.sanity = Math.max(0, char.stats.sanity - (wasSuppressed ? 2 : 5));
      } else if (char.oripathy.stage === 'Terminal') {
        char.stats.maxHealth = Math.max(20, char.stats.maxHealth - (wasSuppressed ? 2 : 4));
        char.stats.health = Math.max(0, Math.min(char.stats.maxHealth, char.stats.health - (wasSuppressed ? 6 : 13)));
        char.stats.sanity = Math.max(0, char.stats.sanity - (wasSuppressed ? 4 : 9));
      }

      const seizureBaseChance =
        char.oripathy.stage === 'Terminal' ? 0.34 : char.oripathy.stage === 'Severe' ? 0.18 : 0;
      const seizureChance = wasSuppressed ? seizureBaseChance * 0.45 : seizureBaseChance;
      if (seizureChance > 0 && Math.random() < seizureChance) {
        const site = char.oripathy.lesionSite;
        const seizureBadges: string[] = [`병소 발작: ${site}`];
        let seizureDesc = '체내 결정이 신경과 장기를 찌르며 급성 발작이 일어났습니다!';

        if (site === '호흡기(폐)') {
          char.stats.maxHealth = Math.max(20, char.stats.maxHealth - 2);
          char.stats.health = Math.max(0, char.stats.health - 13);
          seizureDesc = '폐포에 자라난 원석 결정이 점막을 찢으며 검은 피를 토하는 급성 호흡곤란이 덮쳤습니다!';
          seizureBadges.push('체력 -13', '최대체력 -2');
        } else if (site === '신경계') {
          char.stats.sanity = Math.max(0, char.stats.sanity - 15);
          char.stats.intellect = Math.max(5, char.stats.intellect - 1);
          seizureDesc = '척수와 신경망을 타고 오리지늄 전류가 역류하며 극심한 이명과 경련 발작을 일으켰습니다!';
          seizureBadges.push('이성 -15', '지략 -1');
        } else if (site === '혈관계') {
          char.stats.health = Math.max(0, char.stats.health - 15);
          seizureDesc = '혈관 내 미세 결정 색전이 순환을 막아 심장 쇼크와 급격한 오한이 발생했습니다!';
          seizureBadges.push('체력 -15');
        } else if (site === '사지 골격') {
          char.stats.combat = Math.max(5, char.stats.combat - 2);
          char.stats.health = Math.max(0, char.stats.health - 10);
          seizureDesc = '관절 마디를 파고든 결정 파열로 사지가 마비되는 듯한 격통을 겪었습니다!';
          seizureBadges.push('전투력 -2', '체력 -10');
        } else {
          char.stats.health = Math.max(0, char.stats.health - 10);
          char.stats.sanity = Math.max(0, char.stats.sanity - 8);
          seizureDesc = '피부 표면의 결정이 갈라지며 출혈과 분진 통증이 밤새 이어졌습니다!';
          seizureBadges.push('체력 -10', '이성 -8');
        }

        sound.playHazardAlarm();
        addLog({
          year: char.year,
          age: char.age,
          season: '겨울',
          title: `🩸 【급성 광석병 발작】 ${site} 병변 악화`,
          text: seizureDesc,
          type: 'hazard',
          effectBadges: seizureBadges
        });
      }
    } else {
      const infectionRoll = Math.random();
      let riskThreshold = 0.02;
      if (char.environment === '슬럼가 및 암시장' || char.environment === '황야의 노마드 캠프') {
        riskThreshold = 0.048;
      }
      const nationObj = NATIONS_DATA.find(n => char.nation.includes(n.name));
      if (nationObj?.riskLevel === '극도로 위험') riskThreshold += 0.018;
      else if (nationObj?.riskLevel === '위험') riskThreshold += 0.01;

      if (char.secretFlags['pure_immunity']) riskThreshold *= 0.3;
      if (this.hasTrait(char, 'talent_oripathy_tolerance')) riskThreshold *= 0.65;
      if (this.hasTrait(char, 'flaw_originium_sensitive')) riskThreshold *= 1.6;

      if (infectionRoll < riskThreshold) {
        const lesionSites = ['체표 피부', '호흡기(폐)', '신경계', '혈관계', '사지 골격'] as const;
        const site = lesionSites[Math.floor(Math.random() * lesionSites.length)];
        char.oripathy.isInfected = true;
        char.oripathy.crystallizationRate = 1.6;
        char.oripathy.originiumBloodDensity = 0.22;
        char.oripathy.stage = 'Early';
        char.oripathy.lesionSite = site;
        char.oripathy.activeArtsMultiplier = 1.2;

        this.recordMilestone(char, `${char.age}세: 활성 원석 분진 노출로 광석병 확진 (병소: ${site})`);
        sound.playHazardAlarm();
        addLog({
          year: char.year,
          age: char.age,
          season: '가을',
          title: '【긴급】 광석병 초기 감염 확진',
          text: `원인 모를 고열과 함께 [${site}] 부근에서 활성 결정 반응이 확인되었습니다. 이제부터 세상의 차가운 시선과 억제제 비용을 감당해야 합니다.`,
          type: 'hazard',
          effectBadges: [`광석병 확진 (${site})`, 'STAGE I', '아츠 증폭 1.2x']
        });
      }
    }

    // 2.5 지역 위험도에 따른 연간 재앙 여파·혹한·분쟁 피해
    const nationInfo = NATIONS_DATA.find(n => char.nation.includes(n.name));
    let hazardChance =
      nationInfo?.riskLevel === '극도로 위험' ? 0.14 :
      nationInfo?.riskLevel === '위험' ? 0.1 :
      nationInfo?.riskLevel === '경계' ? 0.065 : 0.035;
    if (char.environment === '황야의 노마드 캠프') hazardChance += 0.04;
    if (this.hasTrait(char, 'flaw_ill_fated')) hazardChance += 0.045;
    if (this.hasTrait(char, 'talent_street_sense')) hazardChance -= 0.025;

    if (char.age >= 6 && Math.random() < hazardChance) {
      let dmgMult = 1.0;
      if (char.focusStance === 'survival') dmgMult -= 0.2;
      if (this.hasTrait(char, 'talent_iron_lungs')) dmgMult -= 0.25;
      if (this.hasTrait(char, 'flaw_frail_body')) dmgMult += 0.25;

      const hpLoss = Math.max(4, Math.round((10 + Math.floor(Math.random() * 10)) * dmgMult));
      const sanLoss = Math.max(3, Math.round((6 + Math.floor(Math.random() * 7)) * (this.hasTrait(char, 'talent_lucid_mind') ? 0.7 : 1)));
      char.stats.health = Math.max(0, char.stats.health - hpLoss);
      char.stats.sanity = Math.max(0, char.stats.sanity - sanLoss);

      const calamityTexts = [
        `${char.nation} 외곽을 스쳐 지나간 오리지늄 재앙 폭풍의 낙진과 산성비에 노출되어 건강이 상했습니다.`,
        `이동도시 보급로 봉쇄와 혹독한 한파가 겹쳐 식량 배급이 끊기며 고된 계절을 버텨야 했습니다.`,
        `인근 무장 세력 간의 국지전 여파로 거주 구획이 파손되어 파편 부상과 불면에 시달렸습니다.`
      ];
      addLog({
        year: char.year,
        age: char.age,
        season: '겨울',
        title: `⛈️ 【대지의 재해】 ${char.nation} 재앙 및 치안 악화`,
        text: calamityTexts[(char.year + char.age) % calamityTexts.length],
        type: 'hazard',
        effectBadges: [`체력 -${hpLoss}`, `이성 -${sanLoss}`]
      });
    }

    if (char.stats.wealth <= 0) {
      this.triggerAchievement(char, 'rare_bankruptcy_ruin', addLog);
    }

    // 생애 목표 달성 여부 체크
    this.checkAndUpdateLifeGoal(char, addLog);

    // 3. 체력/이성 고갈 판정 (인연 구명 개입 포함)
    if (char.stats.health <= 0) {
      if (!this.tryCompanionLifeSave(char, '치명적 부상과 병마', addLog)) {
        char.isAlive = false;
        this.recordMilestone(char, `${char.age}세: 혹독한 병마와 부상을 이기지 못하고 영면`);
        char.deathRecord = this.generateDeathRecord(
          char,
          'KilledInAction',
          '체력 고갈 및 가혹한 환경·병마로 인한 사망',
          '차가운 대지 위에서 힘없이 눈을 감았습니다.'
        );
        sound.playFlatline();
        return { updatedChar: char };
      }
    }

    if (char.stats.sanity <= 0) {
      addLog({
        year: char.year,
        age: char.age,
        season: '겨울',
        title: '정신 붕괴와 패닉 발작',
        text: '이성이 한계까지 마모되어 극심한 환각과 발작에 시달렸습니다. 육신이 크게 쇠약해집니다.',
        type: 'hazard',
        effectBadges: ['체력 -22', '이성 14 복구']
      });
      char.stats.health = Math.max(0, char.stats.health - 22);
      char.stats.sanity = 14;

      if (char.stats.health <= 0 && !this.tryCompanionLifeSave(char, '정신 붕괴에 따른 쇠약', addLog)) {
        char.isAlive = false;
        this.recordMilestone(char, `${char.age}세: 정신 붕괴와 육체 쇠약으로 쓰러짐`);
        char.deathRecord = this.generateDeathRecord(
          char,
          'SanityCollapse',
          '극심한 정신 붕괴와 신체 쇠약으로 인한 사망',
          '끝없는 환청 속에서 마침내 고요한 잠에 빠져들었습니다.'
        );
        sound.playFlatline();
        return { updatedChar: char };
      }
    }

    // 4. 종족별 노화 및 자연 수명 판정
    const profile = this.getCharacterLifespanProfile(char);

    if (char.age >= profile.effectiveAgingStart) {
      const agingCycle = Math.max(3, Math.round(5 * profile.agingRate));
      const isAgingTurn = (char.age - profile.effectiveAgingStart) % agingCycle === 0;

      if (isAgingTurn) {
        const combatLoss = Math.random() < 0.65 ? 1 : 0;
        const healthLoss = Math.random() < 0.65 ? 2 : 1;
        char.stats.combat = Math.max(10, char.stats.combat - combatLoss);
        char.stats.health = Math.max(10, char.stats.health - healthLoss);
        char.stats.maxHealth = Math.max(25, char.stats.maxHealth - 1);

        if (Math.random() < 0.45) {
          this.applyStatGain(char, 'intellect', 1);
        }

        if (char.age % 10 === 0) {
          addLog({
            year: char.year,
            age: char.age,
            season: '가을',
            title: `【세월의 흔적】 ${char.race}의 신체 변화`,
            text: `향년 ${char.age}세. ${char.race}${char.subRace ? `(${char.subRace})` : ''}의 생애 주기에 따라 세월의 무게가 깃듭니다.`,
            type: 'general',
            effectBadges: ['노화 진행', '최대체력 -1']
          });
        }
      }
    }

    // 자연 수명 사망 판정
    if (char.age >= profile.baseLifespan || char.age >= profile.effectiveMaxLifespan) {
      const excess = char.age - profile.baseLifespan;
      const span = Math.max(4, profile.effectiveMaxLifespan - profile.baseLifespan);
      const progress = Math.max(0, excess / span);

      let deathChance = Math.min(0.95, Math.pow(progress, 1.7) * 0.28 + 0.04);
      if (char.oripathy.isInfected) {
        deathChance += (char.oripathy.crystallizationRate / 100) * 0.16;
      }

      if (char.age >= profile.effectiveMaxLifespan || Math.random() < deathChance) {
        char.isAlive = false;
        this.recordMilestone(char, `${char.age}세: ${char.race}의 세월을 다하고 조용히 눈을 감음`);
        const isLongLived = char.age >= 100;
        const raceEpitaph = isLongLived
          ? `수세기에 걸친 테라의 격변과 방랑을 뒤로하고, 향년 ${char.age}세의 나이로 영면에 들었습니다.`
          : `${char.race} 종족의 기대 수명(${profile.baseLifespan}세)을 채우고 향년 ${char.age}세에 평온하게 숨을 거두었습니다.`;
        char.deathRecord = this.generateDeathRecord(
          char,
          'OldAge',
          `${char.race} 종족의 기대 수명(${profile.baseLifespan}세)을 넘어 향년 ${char.age}세로 천수를 누리고 영면`,
          raceEpitaph
        );
        sound.playFlatline();
        return { updatedChar: char };
      }
    }

    // 5. 연령 및 조건에 맞는 이벤트 탐색 (특수 직군 강제 발생 제거 + 신규 조건 지원)
    const seenIds = char.seenEventIds || [];
    const cooldowns = char.eventCooldowns || {};
    const hasLivingBond = (char.bonds || []).some(b => b.isAlive);

    const eligibleEvents = GAME_EVENTS.filter(e => {
      if (char.age < e.minAge || char.age > e.maxAge) return false;
      if (e.conditions?.isInfected !== undefined && e.conditions.isInfected !== char.oripathy.isInfected) return false;
      if (e.conditions?.race && !e.conditions.race.some(r => char.race.includes(r))) return false;
      if (e.conditions?.nation && !e.conditions.nation.some(n => char.nation.includes(n))) return false;
      if (e.conditions?.environment && !e.conditions.environment.includes(char.environment)) return false;
      if (e.conditions?.minCombat !== undefined && char.stats.combat < e.conditions.minCombat) return false;
      if (e.conditions?.minArts !== undefined && char.stats.artsAptitude < e.conditions.minArts) return false;
      if (e.conditions?.minIntellect !== undefined && char.stats.intellect < e.conditions.minIntellect) return false;
      if (e.conditions?.requiresLivingBond && !hasLivingBond) return false;
      if (e.conditions?.requiredFlag && !char.secretFlags[e.conditions.requiredFlag]) return false;
      if (e.conditions?.requiredCareer && char.specialCareerId !== e.conditions.requiredCareer) return false;
      if (e.id.startsWith('career_special_') && (char.specialCareerId || (char.careerTier || 0) < 3)) return false;

      const isOneTime = ONE_TIME_EVENT_PREFIXES.some(prefix => e.id.startsWith(prefix)) || e.maxAge - e.minAge <= 15;
      if (isOneTime && seenIds.includes(e.id)) return false;

      if (cooldowns[e.id] && char.age < cooldowns[e.id]) return false;

      return true;
    });

    // 필수 생애 분기(1세 첫 기억, 15세 진로 선택)만 확정 우선 발생
    const priorityEvents = eligibleEvents.filter(e =>
      (char.age === 1 && e.id === 'child_01_birth_mystery') ||
      (char.age === 15 && e.id === 'youth_01_career_choice')
    );

    let triggeredEvent: GameEvent | undefined = undefined;

    if (priorityEvents.length > 0) {
      triggeredEvent = priorityEvents[0];
    } else if (eligibleEvents.length > 0) {
      const eventChance = char.age < 15 ? 0.42 : 0.52;
      if (Math.random() < eventChance) {
        triggeredEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
      }
    }

    if (triggeredEvent) {
      if (!char.seenEventIds!.includes(triggeredEvent.id)) {
        char.seenEventIds!.push(triggeredEvent.id);
      }
      char.eventCooldowns![triggeredEvent.id] = char.age + 9;
    } else {
      this.processPeacefulYear(char, annualSalary, annualLivingCost, addLog);
    }

    return { updatedChar: char, triggeredEvent };
  }

  // 선택지 사건이 없는 해의 일상 성장 및 인연 교류 기록
  private static processPeacefulYear(
    char: Character,
    annualSalary: number,
    annualLivingCost: number,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ) {
    const badges: string[] = [];

    if (char.age < 15) {
      const growthRoll = Math.random();
      if (growthRoll < 0.34) {
        const g = this.applyStatGain(char, 'intellect', 1);
        if (g > 0) badges.push(`지략 +${g}`);
      } else if (growthRoll < 0.68) {
        const g = this.applyStatGain(char, 'combat', 1);
        if (g > 0) badges.push(`전투력 +${g}`);
      } else {
        const g = this.applyStatGain(char, 'artsAptitude', 1);
        if (g > 0) badges.push(`아츠 +${g}`);
      }
      char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 2);

      const childActivities = [
        `${char.nation}의 거리를 뛰어다니며 세상 물정을 조금씩 익혔습니다.`,
        `${char.environment}에서 또래 아이들과 어울리며 기초 체력과 감각을 길렀습니다.`,
        `어른들의 어깨너머로 오리지늄 기기와 생존 기술을 관찰하며 사계절을 보냈습니다.`
      ];
      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char),
        title: `【유년기 일상】 ${char.age}세의 사계절`,
        text: childActivities[char.age % childActivities.length],
        type: 'general',
        effectBadges: badges
      });
    } else {
      const net = annualSalary - annualLivingCost;
      badges.push(`보수 +${annualSalary.toLocaleString()}`, `생계·세금 -${annualLivingCost.toLocaleString()}`);

      if (char.specialCareerId) {
        const g1 = this.applyStatGain(char, 'combat', 1);
        const g2 = this.applyStatGain(char, 'artsAptitude', 1);
        if (g1 + g2 > 0) badges.push('특수숙련 상승');
      } else if (char.career.includes('로도스')) {
        const repGain = this.hasTrait(char, 'talent_charisma') ? 3 : 2;
        char.factions['로도스 아일랜드'] = (char.factions['로도스 아일랜드'] || 0) + repGain;
        const g = this.applyStatGain(char, 'artsAptitude', 1);
        badges.push(`로도스 +${repGain}`);
        if (g > 0) badges.push(`아츠 +${g}`);
      } else if (char.career.includes('근위국') || char.career.includes('치안')) {
        const repGain = this.hasTrait(char, 'talent_charisma') ? 3 : 2;
        char.factions['용문 근위국'] = (char.factions['용문 근위국'] || 0) + repGain;
        const g = this.applyStatGain(char, 'combat', 1);
        badges.push(`근위국 +${repGain}`);
        if (g > 0) badges.push(`전투력 +${g}`);
      } else if (char.career.includes('블랙스틸') || char.career.includes('개척')) {
        const repGain = this.hasTrait(char, 'talent_charisma') ? 3 : 2;
        char.factions['블랙스틸'] = (char.factions['블랙스틸'] || 0) + repGain;
        const g = this.applyStatGain(char, 'intellect', 1);
        badges.push(`블랙스틸 +${repGain}`);
        if (g > 0) badges.push(`지략 +${g}`);
      } else {
        const g = Math.random() < 0.5
          ? this.applyStatGain(char, 'intellect', 1)
          : this.applyStatGain(char, 'combat', 1);
        if (g > 0) badges.push('실무 숙련 +1');
      }

      // 인연(동료) 자연 조우 및 유대 심화
      const bondChance = this.hasTrait(char, 'talent_charisma') ? 0.17 : 0.11;
      if (Math.random() < bondChance) {
        if (!char.bonds) char.bonds = [];
        const livingBonds = char.bonds.filter(b => b.isAlive);
        if (livingBonds.length < 3 && (livingBonds.length === 0 || Math.random() < 0.45)) {
          const unused = COMPANION_TEMPLATES.filter(t => !char.bonds!.some(b => b.name === t.name));
          if (unused.length > 0) {
            const picked = unused[Math.floor(Math.random() * unused.length)];
            char.bonds.push({
              id: 'bond_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
              name: picked.name,
              role: picked.role,
              affinity: 50,
              isAlive: true
            });
            badges.push(`새 인연: ${picked.name}`);
            this.recordMilestone(char, `${char.age}세: '${picked.name}'(${picked.role})과(와) 소중한 인연을 맺음`);
          }
        } else if (livingBonds.length > 0) {
          const target = livingBonds[Math.floor(Math.random() * livingBonds.length)];
          target.affinity = Math.min(100, target.affinity + 10);
          char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 4);
          badges.push(`${target.name} 유대 +10`);
        }
      }

      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char),
        title: `【연간 생업 결산】 ${char.career} (${char.careerRank})`,
        text: `${char.nation}에서 [${char.career}] 실무를 수행하며 한 해를 버텨냈습니다. (순수지: ${net >= 0 ? '+' : ''}${net.toLocaleString()} LMD)`,
        type: 'general',
        effectBadges: badges
      });
    }
  }

  // AI 자동 진행 시 연간 AP/직급승급/장비/특수직군 자동 관리
  public static runAutoYearlyManagement(
    character: Character,
    strategy: AIStrategy,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    let char = this.ensureCharacterDefaults(character);

    // 0. 전략에 맞춘 집중 태세 자동 조율
    if (char.stats.health < char.stats.maxHealth * 0.45 || char.stats.sanity < 38 || strategy === 'survival') {
      char = this.setFocusStance(char, 'survival');
    } else if (strategy === 'combat') {
      char = this.setFocusStance(char, 'martial');
    } else if (strategy === 'wealth') {
      char = this.setFocusStance(char, 'career');
    } else if ((char.careerTier || 0) < 3) {
      char = this.setFocusStance(char, 'career');
    } else {
      char = this.setFocusStance(char, char.stats.artsAptitude >= char.stats.combat ? 'arcane' : 'martial');
    }

    // 1. 일반 직급 승급 심사 (Tier 2 ~ 4) 가능 시 응시
    const tierCheck = this.checkTierPromotionEligibility(char);
    if (tierCheck.eligible && tierCheck.threshold && char.stats.wealth >= tierCheck.threshold.examFee + 350) {
      char = this.attemptCareerTierPromotion(char, addLog);
    }

    // 2. 특수 직군(Tier 5) 임관 자격이 되면 즉시 승급
    if (!char.specialCareerId && char.age >= 22 && (char.careerTier || 0) >= 3) {
      for (const sc of SPECIAL_CAREERS_DATA) {
        if (this.checkSpecialCareerEligibility(char, sc).eligible) {
          char = this.promoteToSpecialCareer(char, sc.id, addLog);
          break;
        }
      }
    }

    // 3. 여유 자금이 있을 때 상위 무기/방어구 자동 구매 장착
    const reserveLmd = strategy === 'wealth' ? 4000 : strategy === 'survival' ? 1500 : 1000;
    const budget = char.stats.wealth - reserveLmd;

    if (budget >= 150) {
      const currentAtk = char.equipment.weapon?.atkBonus || 0;
      const affordableWeapons = ITEMS_DATA.filter(
        i => i.type === 'weapon' && i.price <= budget && (i.atkBonus || 0) > currentAtk
      ).sort((a, b) => (b.atkBonus || 0) - (a.atkBonus || 0));

      if (affordableWeapons.length > 0) {
        char = this.buyOrEquipItem(char, affordableWeapons[0].id, addLog);
      }
    }

    const budgetAfterWeapon = char.stats.wealth - reserveLmd;
    if (budgetAfterWeapon >= 120) {
      const currentDef = char.equipment.armor?.defBonus || 0;
      const affordableArmors = ITEMS_DATA.filter(
        i => i.type === 'armor' && i.price <= budgetAfterWeapon && (i.defBonus || 0) > currentDef
      ).sort((a, b) => (b.defBonus || 0) - (a.defBonus || 0));

      if (affordableArmors.length > 0) {
        char = this.buyOrEquipItem(char, affordableArmors[0].id, addLog);
      }
    }

    // 4. 잔여 AP 자동 사용
    while (char.actionPoints > 0 && char.isAlive) {
      const hasSuppressantItem = char.inventory.some(s => s.item.id === 'med_rhodes_suppressant' && s.count > 0);
      const suppCost = this.getSuppressantCost(char);
      if (char.oripathy.isInfected && char.oripathy.suppressantDoseLeft <= 0 && (hasSuppressantItem || char.stats.wealth >= suppCost)) {
        char = this.executeAnnualAction(char, 'take_suppressant', addLog);
        continue;
      }

      if (char.stats.sanity < 42 || char.stats.health < char.stats.maxHealth * 0.5) {
        char = this.executeAnnualAction(char, 'recreation', addLog);
        continue;
      }

      if (strategy === 'wealth') {
        if (char.stats.health >= 30) {
          char = this.executeAnnualAction(char, 'faction_bounty', addLog);
        } else {
          char = this.executeAnnualAction(char, 'study_lore', addLog);
        }
      } else if (strategy === 'combat') {
        if (char.stats.artsAptitude > char.stats.combat + 10 && char.stats.sanity >= 25) {
          char = this.executeAnnualAction(char, 'cultivate_arts', addLog);
        } else if (char.stats.health >= 25) {
          char = this.executeAnnualAction(char, 'train_combat', addLog);
        } else {
          char = this.executeAnnualAction(char, 'recreation', addLog);
        }
      } else if (strategy === 'survival') {
        if (char.stats.health < char.stats.maxHealth * 0.78 || char.stats.sanity < char.stats.maxSanity * 0.78) {
          char = this.executeAnnualAction(char, 'recreation', addLog);
        } else {
          char = this.executeAnnualAction(char, 'study_lore', addLog);
        }
      } else {
        const roll = Math.random();
        if (roll < 0.3 && char.stats.health >= 25) {
          char = this.executeAnnualAction(char, 'train_combat', addLog);
        } else if (roll < 0.6 && char.stats.sanity >= 25) {
          char = this.executeAnnualAction(char, 'cultivate_arts', addLog);
        } else if (roll < 0.8) {
          char = this.executeAnnualAction(char, 'study_lore', addLog);
        } else {
          char = this.executeAnnualAction(char, 'faction_bounty', addLog);
        }
      }
    }

    return char;
  }

  // 선택지 요구 조건 검증 (비용/아이템/스탯/플래그)
  public static checkChoiceRequirements(
    char: Character,
    choice: EventChoice
  ): { allowed: boolean; reason?: string } {
    const req = choice.requirements;
    if (!req) return { allowed: true };

    if (req.lmdCost !== undefined && char.stats.wealth < req.lmdCost) {
      return { allowed: false, reason: `${req.lmdCost.toLocaleString()} LMD 필요` };
    }
    if (req.itemCost) {
      const slot = char.inventory.find(s => s.item.id === req.itemCost!.itemId);
      const itemName = ITEMS_DATA.find(i => i.id === req.itemCost!.itemId)?.name || req.itemCost.itemId;
      if (!slot || slot.count < req.itemCost.count) {
        return { allowed: false, reason: `${itemName} ${req.itemCost.count}개 필요` };
      }
    }
    if (req.requiredItem) {
      const hasInv = char.inventory.some(s => s.item.id === req.requiredItem && s.count > 0);
      const hasEq = char.equipment.weapon?.id === req.requiredItem || char.equipment.armor?.id === req.requiredItem;
      if (!hasInv && !hasEq) {
        const itemName = ITEMS_DATA.find(i => i.id === req.requiredItem)?.name || req.requiredItem;
        return { allowed: false, reason: `${itemName} 보유 필요` };
      }
    }
    if (req.minStat) {
      const cur = char.stats[req.minStat.stat] || 0;
      if (cur < req.minStat.value) {
        return { allowed: false, reason: `${STAT_LABELS[req.minStat.stat]} ${req.minStat.value} 이상` };
      }
    }
    if (req.isInfected !== undefined && char.oripathy.isInfected !== req.isInfected) {
      return { allowed: false, reason: req.isInfected ? '감염자 전용' : '비감염자 전용' };
    }
    if (req.race && !req.race.some(r => char.race.includes(r))) {
      return { allowed: false, reason: `${req.race.join('/')} 종족 전용` };
    }
    if (req.nation && !req.nation.some(n => char.nation.includes(n))) {
      return { allowed: false, reason: `${req.nation.join('/')} 국가 전용` };
    }
    if (req.requiredCareer && char.specialCareerId !== req.requiredCareer) {
      return { allowed: false, reason: '특수 직군 전용' };
    }
    if (req.requiredFlag && !char.secretFlags[req.requiredFlag]) {
      return { allowed: false, reason: '선행 조건 미충족' };
    }

    return { allowed: true };
  }

  // 인공지능 사건 선택지 자동 결정 (요구 조건 충족 선택지만 대상)
  public static selectAutoChoice(
    character: Character,
    event: GameEvent,
    strategy: AIStrategy = 'balanced'
  ): EventChoice {
    const allChoices = event.choices;
    if (!allChoices || allChoices.length === 0) {
      throw new Error('Event has no choices');
    }
    const allowedChoices = allChoices.filter(c => this.checkChoiceRequirements(character, c).allowed);
    const pool = allowedChoices.length > 0 ? allowedChoices : [allChoices[allChoices.length - 1]];
    if (pool.length === 1) return pool[0];

    const scored = pool.map(choice => {
      let score = 50;

      if (choice.diceCheck) {
        const statVal = character.stats[choice.diceCheck.stat] || 30;
        const statBonus = Math.floor(statVal / 5);
        const expectedScore = 50 + statBonus;
        const diff = expectedScore - choice.diceCheck.difficulty;
        score += diff * 1.5;

        if (statVal >= 70) score += 20;
        if (strategy === 'survival' && diff < 0) score -= 25;
      }

      const text = (choice.label + ' ' + choice.description).toLowerCase();
      if (character.race.includes('살카즈') && (text.includes('살카즈') || text.includes('마왕') || text.includes('피') || text.includes('어둠'))) score += 15;
      if (character.race.includes('에기르') && (text.includes('심해') || text.includes('바다') || text.includes('헌터스') || text.includes('해사'))) score += 15;
      if (character.race.includes('산크타') && (text.includes('총기') || text.includes('율법') || text.includes('수호') || text.includes('광륜'))) score += 15;
      if (character.career.includes('로도스') && (text.includes('로도스') || text.includes('치료') || text.includes('구호') || text.includes('감염자'))) score += 15;
      if (character.nation === '카시미어' && (text.includes('기사') || text.includes('경기') || text.includes('영광'))) score += 15;

      if (strategy === 'survival') {
        if (text.includes('대피') || text.includes('안전') || text.includes('치료') || text.includes('방어') || text.includes('휴식') || text.includes('피한다')) score += 25;
        if (choice.triggerBattleEnemyId) score -= 22;
      } else if (strategy === 'combat') {
        if (choice.triggerBattleEnemyId || text.includes('맞선다') || text.includes('격파') || text.includes('돌격') || text.includes('결투')) score += 30;
      } else if (strategy === 'wealth') {
        if (text.includes('보상') || text.includes('거래') || text.includes('상금') || text.includes('투자') || text.includes('수락')) score += 25;
      }

      score += (Math.random() * 16 - 8);
      return { choice, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].choice;
  }

  // 자동 전투 커맨드 결정 (전술 AI)
  public static selectAutoBattleCommand(
    character: Character,
    battle: BattleState
  ): { command: 'attack' | 'arts' | 'defend' | 'item' | 'flee'; itemId?: string } {
    if (character.stats.health < character.stats.maxHealth * 0.42) {
      const spray = character.inventory.find(slot => slot.item.id === 'med_emergency_spray' && slot.count > 0);
      if (spray) {
        return { command: 'item', itemId: spray.item.id };
      }
      // 회복 수단이 없고 압도적 강적이면 후퇴 시도
      if (character.stats.health <= 18 && battle.enemy.atk >= 45 && battle.enemy.hp > battle.enemy.maxHp * 0.4) {
        return { command: 'flee' };
      }
    }

    if (!battle.catalystActive && battle.enemy.maxHp >= 500 && character.stats.artsAptitude >= 60) {
      const cat = character.inventory.find(slot => slot.item.id === 'med_originium_catalyst' && slot.count > 0);
      if (cat) {
        return { command: 'item', itemId: cat.item.id };
      }
    }

    const artsCost = this.hasTrait(character, 'flaw_arts_blockage') ? 11 : 8;
    if (character.stats.artsAptitude > character.stats.combat && character.stats.sanity >= artsCost) {
      return { command: 'arts' };
    }

    if (battle.playerShield <= 0 && battle.enemy.atk >= 40 && character.stats.health < character.stats.maxHealth * 0.5) {
      if (Math.random() < 0.4) {
        return { command: 'defend' };
      }
    }

    return { command: 'attack' };
  }

  // 결과 효과 배지 추출 헬퍼
  private static buildOutcomeBadges(
    outcome: OutcomeResult,
    extraBadges: string[] = []
  ): string[] {
    const badges: string[] = [...extraBadges];
    if (outcome.statEffects) {
      for (const [k, v] of Object.entries(outcome.statEffects)) {
        const key = k as keyof CharacterStats;
        if (typeof v === 'number' && v !== 0) {
          const sign = v > 0 ? '+' : '';
          badges.push(`${STAT_LABELS[key] || key} ${sign}${v.toLocaleString()}`);
        }
      }
    }
    if (outcome.careerExpDelta) {
      const sign = outcome.careerExpDelta > 0 ? '+' : '';
      badges.push(`공적 EXP ${sign}${outcome.careerExpDelta}`);
    }
    if (outcome.crystallizationDelta) {
      const sign = outcome.crystallizationDelta > 0 ? '+' : '';
      badges.push(`결정화 ${sign}${outcome.crystallizationDelta}%`);
    }
    if (outcome.reputationDelta) {
      for (const [f, d] of Object.entries(outcome.reputationDelta)) {
        if (d !== 0) {
          badges.push(`${f} ${d > 0 ? '+' : ''}${d}`);
        }
      }
    }
    if (outcome.addBond) {
      badges.push(`인연 합류: ${outcome.addBond.name}`);
    }
    if (outcome.changeEnvironment) {
      badges.push(`거처: ${outcome.changeEnvironment}`);
    }
    if (outcome.gainTitles) {
      for (const t of outcome.gainTitles) {
        badges.push(`칭호 [${t}]`);
      }
    }
    if (outcome.specialCareerGain) {
      badges.push(`전직 [${outcome.specialCareerGain.name}]`);
    }
    return badges;
  }

  // 선택지 판정 및 처리
  public static resolveChoice(
    character: Character,
    choice: EventChoice,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): { updatedChar: Character; battleEnemy?: string; battleAmbushed?: boolean } {
    const baseChar = this.ensureCharacterDefaults(character);
    const reqCheck = this.checkChoiceRequirements(baseChar, choice);
    if (!reqCheck.allowed) {
      return { updatedChar: baseChar };
    }

    const char: Character = {
      ...baseChar,
      stats: { ...baseChar.stats },
      oripathy: { ...baseChar.oripathy },
      factions: { ...baseChar.factions },
      titles: [...baseChar.titles],
      bonds: (baseChar.bonds || []).map(b => ({ ...b })),
      milestones: [...(baseChar.milestones || [])],
      inventory: baseChar.inventory.map(s => ({ ...s, item: { ...s.item } })),
      secretFlags: { ...baseChar.secretFlags },
      unlockedAchievements: [...(baseChar.unlockedAchievements || [])]
    };

    const costBadges: string[] = [];
    if (choice.requirements?.lmdCost) {
      char.stats.wealth = Math.max(0, char.stats.wealth - choice.requirements.lmdCost);
      costBadges.push(`비용 -${choice.requirements.lmdCost.toLocaleString()} LMD`);
    }
    if (choice.requirements?.itemCost) {
      const slot = char.inventory.find(s => s.item.id === choice.requirements!.itemCost!.itemId);
      if (slot) {
        slot.count -= choice.requirements.itemCost.count;
        costBadges.push(`${slot.item.name} -${choice.requirements.itemCost.count}`);
        char.inventory = char.inventory.filter(s => s.count > 0);
      }
    }

    if (choice.diceCheck) {
      sound.playDiceRoll();
      const rawRoll = Math.floor(Math.random() * 100) + 1;
      const statVal = char.stats[choice.diceCheck.stat] || 30;
      let statBonus = Math.floor(statVal / 4.5);
      if (
        char.focusStance === 'arcane' &&
        (choice.diceCheck.stat === 'artsAptitude' || choice.diceCheck.stat === 'intellect')
      ) {
        statBonus += 3;
      }
      const total = rawRoll + statBonus;
      const dc = choice.diceCheck.difficulty;

      let resultOutcome: '대성공' | '성공' | '실패' | '대참사' = '실패';
      let outcomeData = choice.outcomes.failure || choice.outcomes.success;

      if (rawRoll >= 96 || total >= dc + 25) {
        resultOutcome = '대성공';
        outcomeData = choice.outcomes.criticalSuccess || choice.outcomes.success;
        sound.playSuccess();
      } else if (total >= dc) {
        resultOutcome = '성공';
        outcomeData = choice.outcomes.success;
        sound.playBeep(700, 0.08, 'sine');
      } else if (rawRoll <= 5 || total < dc - 30) {
        resultOutcome = '대참사';
        outcomeData = choice.outcomes.criticalFailure || choice.outcomes.failure || choice.outcomes.success;
        sound.playHazardAlarm();
      } else {
        resultOutcome = '실패';
        outcomeData = choice.outcomes.failure || choice.outcomes.success;
        sound.playBeep(350, 0.12, 'sawtooth');
      }

      const badges = this.buildOutcomeBadges(outcomeData, costBadges);

      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char, 1),
        title: `【판정: ${resultOutcome}】 ${choice.label}`,
        text: outcomeData.text,
        type: resultOutcome === '대성공' ? 'critical' : resultOutcome === '대참사' ? 'hazard' : 'general',
        rollDetails: {
          stat: choice.diceCheck.stat,
          roll: rawRoll,
          total,
          dc,
          result: resultOutcome
        },
        effectBadges: badges
      });

      this.applyOutcomeEffects(char, outcomeData, addLog);
      this.checkAndUpdateLifeGoal(char, addLog);

      if (outcomeData.deathReason || char.stats.health <= 0) {
        const reason = outcomeData.deathReason || '위험한 사건의 치명상으로 인한 사망';
        if (!this.tryCompanionLifeSave(char, reason, addLog)) {
          char.isAlive = false;
          this.recordMilestone(char, `${char.age}세: ${reason}`);
          char.deathRecord = this.generateDeathRecord(char, 'KilledInAction', reason, '이곳에 방랑자의 숨결이 잠들다.');
          sound.playFlatline();
        }
      }

      const failedRoll = resultOutcome === '실패' || resultOutcome === '대참사';
      return {
        updatedChar: char,
        battleEnemy: choice.triggerBattleEnemyId,
        battleAmbushed: failedRoll && !!choice.triggerBattleEnemyId
      };
    } else {
      const outcomeData = choice.outcomes.success;
      const badges = this.buildOutcomeBadges(outcomeData, costBadges);
      sound.playBeep(600, 0.05, 'sine');
      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char, 1),
        title: choice.label,
        text: outcomeData.text,
        type: 'general',
        effectBadges: badges
      });
      this.applyOutcomeEffects(char, outcomeData, addLog);
      this.checkAndUpdateLifeGoal(char, addLog);

      if (outcomeData.deathReason || char.stats.health <= 0) {
        const reason = outcomeData.deathReason || '치명적인 사건으로 인한 사망';
        if (!this.tryCompanionLifeSave(char, reason, addLog)) {
          char.isAlive = false;
          this.recordMilestone(char, `${char.age}세: ${reason}`);
          char.deathRecord = this.generateDeathRecord(char, 'KilledInAction', reason, '이곳에 방랑자의 숨결이 잠들다.');
          sound.playFlatline();
        }
      }

      return {
        updatedChar: char,
        battleEnemy: choice.triggerBattleEnemyId,
        battleAmbushed: false
      };
    }
  }

  // 사건 결과 효과 반영
  private static applyOutcomeEffects(
    char: Character,
    outcome: OutcomeResult,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ) {
    if (outcome.statEffects) {
      for (const [k, v] of Object.entries(outcome.statEffects)) {
        const key = k as keyof CharacterStats;
        if (typeof v === 'number') {
          if (key === 'health') {
            char.stats.health = Math.min(char.stats.maxHealth, Math.max(0, char.stats.health + v));
          } else if (key === 'maxHealth') {
            char.stats.maxHealth = Math.max(20, char.stats.maxHealth + v);
            char.stats.health = Math.min(char.stats.maxHealth, char.stats.health);
          } else if (key === 'sanity') {
            const adj = v < 0 && this.hasTrait(char, 'talent_lucid_mind') ? Math.ceil(v * 0.75) : v;
            char.stats.sanity = Math.min(char.stats.maxSanity, Math.max(0, char.stats.sanity + adj));
          } else if (key === 'maxSanity') {
            char.stats.maxSanity = Math.max(20, char.stats.maxSanity + v);
            char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity);
          } else if (key === 'wealth') {
            const adj = v > 0 && this.hasTrait(char, 'talent_merchant_eye') ? Math.round(v * 1.15) : v;
            char.stats.wealth = Math.max(0, char.stats.wealth + adj);
          } else if (key === 'combat' || key === 'artsAptitude' || key === 'intellect' || key === 'luck') {
            this.applyStatGain(char, key, v);
          }
        }
      }
    }

    if (outcome.careerExpDelta) {
      const mult = char.focusStance === 'career' ? 1.35 : char.focusStance === 'survival' ? 0.85 : 1.0;
      const delta = outcome.careerExpDelta > 0 ? Math.round(outcome.careerExpDelta * mult) : outcome.careerExpDelta;
      char.careerExp = Math.max(0, (char.careerExp || 0) + delta);
    }

    if (outcome.crystallizationDelta) {
      const wasInfected = char.oripathy.isInfected;
      char.oripathy.crystallizationRate = Math.max(0, Number((char.oripathy.crystallizationRate + outcome.crystallizationDelta).toFixed(1)));
      if (char.oripathy.crystallizationRate > 0) {
        char.oripathy.isInfected = true;
        if (!wasInfected && char.oripathy.lesionSite === '없음') {
          char.oripathy.lesionSite = '체표 피부';
          char.oripathy.stage = 'Early';
          char.oripathy.activeArtsMultiplier = 1.2;
          this.recordMilestone(char, `${char.age}세: 사건 여파로 오리지늄 광석병 감염`);
        }
      }
    }

    if (outcome.bloodDensityDelta) {
      char.oripathy.originiumBloodDensity = Math.max(0.05, Number((char.oripathy.originiumBloodDensity + outcome.bloodDensityDelta).toFixed(2)));
    }

    if (outcome.reputationDelta) {
      const mult = this.hasTrait(char, 'talent_charisma') ? 1.3 : 1.0;
      for (const [f, delta] of Object.entries(outcome.reputationDelta)) {
        const adj = delta > 0 ? Math.round(delta * mult) : delta;
        char.factions[f] = (char.factions[f] || 0) + adj;
      }
    }

    if (outcome.gainItemIds) {
      for (const itemId of outcome.gainItemIds) {
        const item = ITEMS_DATA.find(i => i.id === itemId);
        if (item) {
          const existing = char.inventory.find(s => s.item.id === item.id);
          if (existing) existing.count += 1;
          else char.inventory.push({ item, count: 1 });
        }
      }
    }

    if (outcome.addBond) {
      if (!char.bonds) char.bonds = [];
      const existing = char.bonds.find(b => b.name === outcome.addBond!.name && b.isAlive);
      if (existing) {
        existing.affinity = Math.min(100, existing.affinity + 20);
      } else {
        char.bonds.push({
          id: 'bond_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          name: outcome.addBond.name,
          role: outcome.addBond.role,
          affinity: outcome.addBond.affinity || 60,
          isAlive: true
        });
        this.recordMilestone(char, `${char.age}세: '${outcome.addBond.name}'(${outcome.addBond.role})과(와) 생사를 나누는 인연을 맺음`);
      }
    }

    if (outcome.loseRandomBondReason && char.bonds) {
      const living = char.bonds.filter(b => b.isAlive);
      if (living.length > 0) {
        const lost = living[0];
        lost.isAlive = false;
        lost.fateText = `${char.year}년(${char.age}세), ${outcome.loseRandomBondReason}`;
        this.recordMilestone(char, `${char.age}세: 소중한 인연 '${lost.name}'을(를) 떠나보냄 (${outcome.loseRandomBondReason})`);
      }
    }

    if (outcome.changeEnvironment) {
      char.environment = outcome.changeEnvironment;
    }

    if (outcome.gainTitles) {
      for (const title of outcome.gainTitles) {
        if (!char.titles.includes(title)) {
          char.titles.push(title);
        }
        // 15세 성년 진로 선택 이벤트와 직군 연동
        if (!char.specialCareerId) {
          if (title === '로도스 견습생') {
            char.career = '로도스 아일랜드';
            char.careerTier = Math.max(1, char.careerTier || 1);
            char.careerRank = getTierRankTitle(char.career, char.careerTier);
            this.recordMilestone(char, `${char.age}세: 로도스 아일랜드 견습 오퍼레이터로 첫발을 내디딤`);
          } else if (title === '순찰 경관') {
            char.career = '도시 치안대 / 근위국';
            char.careerTier = Math.max(1, char.careerTier || 1);
            char.careerRank = getTierRankTitle(char.career, char.careerTier);
            this.recordMilestone(char, `${char.age}세: 이동도시 치안대 순찰 경관으로 임관`);
          } else if (title === '풋내기 용병') {
            char.career = '자유 용병단';
            char.careerTier = Math.max(1, char.careerTier || 1);
            char.careerRank = getTierRankTitle(char.career, char.careerTier);
            this.recordMilestone(char, `${char.age}세: 전장을 떠도는 자유 용병의 길에 투신`);
          } else if (title === '개척지 계약병') {
            char.career = '블랙스틸 / 개척단';
            char.careerTier = Math.max(1, char.careerTier || 1);
            char.careerRank = getTierRankTitle(char.career, char.careerTier);
            this.recordMilestone(char, `${char.age}세: 블랙스틸 전술 개척 계약병으로 입단`);
          }
        }
      }
    }

    if (outcome.specialCareerGain) {
      char.specialCareerId = outcome.specialCareerGain.id;
      char.career = outcome.specialCareerGain.name;
      char.careerRank = outcome.specialCareerGain.rank;
      char.careerTier = 5;
      this.recordMilestone(char, `${char.age}세: 특수 직군 【${char.career}】 등극`);
      sound.playSuccess();
      addLog({
        year: char.year,
        age: char.age,
        season: this.pickSeason(char, 2),
        title: `🎖️ 【특수 직군 승급】 ${char.career}`,
        text: `명예로운 [${char.careerRank}] 직무를 부여받았습니다!`,
        type: 'critical',
        effectBadges: [`특수직군(Tier 5): ${char.careerRank}`]
      });
    }

    if (outcome.setSecretFlag) {
      char.secretFlags[outcome.setSecretFlag] = true;
    }
    if (outcome.setSecretFlag2) {
      char.secretFlags[outcome.setSecretFlag2] = true;
    }
    if (outcome.setSecretFlags) {
      for (const f of outcome.setSecretFlags) {
        char.secretFlags[f] = true;
      }
    }

    if (outcome.unlockAchievementId) {
      this.triggerAchievement(char, outcome.unlockAchievementId, addLog);
    }
  }

  // 연간 자율 활동 (스탯 한계 체감, 공적 EXP 획득, 억제제 단계별 시세 반영)
  public static executeAnnualAction(
    character: Character,
    actionType: 'cultivate_arts' | 'train_combat' | 'take_suppressant' | 'faction_bounty' | 'recreation' | 'study_lore',
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    const baseChar = this.ensureCharacterDefaults(character);
    if (baseChar.actionPoints <= 0) return baseChar;
    const char: Character = {
      ...baseChar,
      stats: { ...baseChar.stats },
      oripathy: { ...baseChar.oripathy },
      inventory: baseChar.inventory.map(s => ({ ...s, item: { ...s.item } })),
      secretFlags: { ...baseChar.secretFlags },
      unlockedAchievements: [...(baseChar.unlockedAchievements || [])]
    };
    char.actionPoints -= 1;

    switch (actionType) {
      case 'cultivate_arts': {
        sound.playArtsExplosion();
        const raw = Math.floor(Math.random() * 3) + 3; // 3~5
        const gain = this.applyStatGain(char, 'artsAptitude', raw);
        const sanCost = this.hasTrait(char, 'flaw_arts_blockage') ? 9 : 6;
        char.stats.sanity = Math.max(5, char.stats.sanity - sanCost);
        char.careerExp = (char.careerExp || 0) + 3;
        this.checkAndUpdateLifeGoal(char, addLog);
        addLog({
          year: char.year,
          age: char.age,
          season: this.pickSeason(char),
          title: '오리지늄 아츠 수련',
          text: `아츠 유닛을 조율하고 고위 영창 식을 연마했습니다. 아츠 적성이 +${gain} 상승했습니다.`,
          type: 'general',
          effectBadges: [`아츠 +${gain}`, `이성 -${sanCost}`, '공적 EXP +3']
        });
        break;
      }
      case 'train_combat': {
        sound.playSlash();
        const raw = Math.floor(Math.random() * 3) + 3; // 3~5
        const gain = this.applyStatGain(char, 'combat', raw);
        char.stats.health = Math.max(10, char.stats.health - 7);
        char.careerExp = (char.careerExp || 0) + 3;
        this.checkAndUpdateLifeGoal(char, addLog);
        addLog({
          year: char.year,
          age: char.age,
          season: this.pickSeason(char),
          title: '전술 백병전 훈련',
          text: `실전 대련과 무기 반동 제어 훈련을 거쳤습니다. 전투력이 +${gain} 상승했습니다.`,
          type: 'general',
          effectBadges: [`전투력 +${gain}`, '체력 -7', '공적 EXP +3']
        });
        break;
      }
      case 'study_lore': {
        sound.playBeep(780, 0.07, 'sine');
        const raw = Math.floor(Math.random() * 3) + 3; // 3~5
        const gain = this.applyStatGain(char, 'intellect', raw);
        let stipend = 110 + Math.floor(char.stats.intellect * 1.1);
        if (this.hasTrait(char, 'talent_merchant_eye')) stipend = Math.round(stipend * 1.2);
        char.stats.wealth += stipend;
        char.stats.sanity = Math.max(5, char.stats.sanity - 4);
        char.careerExp = (char.careerExp || 0) + 4;
        this.checkAndUpdateLifeGoal(char, addLog);
        addLog({
          year: char.year,
          age: char.age,
          season: this.pickSeason(char),
          title: '정세 분석 및 학술 자문',
          text: `이동도시 간 통상 기록과 오리지늄 공학 문헌을 분석하여 실무 안목을 넓히고 소정의 원고료를 받았습니다.`,
          type: 'general',
          effectBadges: [`지략 +${gain}`, `LMD +${stipend.toLocaleString()}`, '이성 -4', '공적 EXP +4']
        });
        break;
      }
      case 'take_suppressant': {
        const slot = char.inventory.find(s => s.item.id === 'med_rhodes_suppressant' && s.count > 0);
        const clinicCost = this.getSuppressantCost(char);
        if (slot) {
          slot.count -= 1;
          char.inventory = char.inventory.filter(s => s.count > 0);
          char.oripathy.suppressantDoseLeft += 3;
          char.oripathy.crystallizationRate = Math.max(0, Number((char.oripathy.crystallizationRate - 0.5).toFixed(1)));
          sound.playSuccess();
          this.triggerAchievement(char, 'common_rhodes_medicine', addLog);
          addLog({
            year: char.year,
            age: char.age,
            season: this.pickSeason(char),
            title: '보유 정품 억제제 투약',
            text: '차가운 정제 억제제가 혈관을 순환하며 오리지늄 결정 확산을 3년간 억제합니다.',
            type: 'oripathy',
            effectBadges: ['억제제 +3년', '결정화 -0.5%']
          });
        } else if (char.stats.wealth >= clinicCost) {
          char.stats.wealth -= clinicCost;
          char.oripathy.suppressantDoseLeft += 3;
          char.oripathy.crystallizationRate = Math.max(0, Number((char.oripathy.crystallizationRate - 0.5).toFixed(1)));
          sound.playSuccess();
          this.triggerAchievement(char, 'common_rhodes_medicine', addLog);
          addLog({
            year: char.year,
            age: char.age,
            season: this.pickSeason(char),
            title: '이동 진료소 억제제 처방 투약',
            text: `현재 병기(${char.oripathy.stage}) 맞춤 처방비 ${clinicCost.toLocaleString()} LMD를 지불하고 정품 억제제를 투약했습니다.`,
            type: 'oripathy',
            effectBadges: [`LMD -${clinicCost.toLocaleString()}`, '억제제 +3년', '결정화 -0.5%']
          });
        } else {
          addLog({
            year: char.year,
            age: char.age,
            season: this.pickSeason(char),
            title: '억제제 구매 실패',
            text: `LMD가 부족하여 억제제를 처방받지 못했습니다. (${clinicCost.toLocaleString()} LMD 필요)`,
            type: 'hazard'
          });
          char.actionPoints += 1;
        }
        break;
      }
      case 'faction_bounty': {
        let reward = 380 + Math.floor(Math.random() * 340) + (char.careerTier || 1) * 55;
        if (this.hasTrait(char, 'talent_merchant_eye')) reward = Math.round(reward * 1.2);
        char.stats.wealth += reward;
        const g = this.applyStatGain(char, 'combat', 1);
        const expGain = char.focusStance === 'career' ? 9 : 7;
        char.careerExp = (char.careerExp || 0) + expGain;
        char.stats.health = Math.max(8, char.stats.health - 12);
        char.stats.sanity = Math.max(6, char.stats.sanity - 4);
        this.checkAndUpdateLifeGoal(char, addLog);
        sound.playBeep(850, 0.08, 'sine');
        addLog({
          year: char.year,
          age: char.age,
          season: this.pickSeason(char),
          title: '위험 현상금 및 호위 의뢰 완수',
          text: `황야 수송대 호위와 약탈단 토벌 의뢰를 마치고 위험 수당 ${reward.toLocaleString()} LMD와 실무 공적을 쌓았습니다.`,
          type: 'general',
          effectBadges: [`LMD +${reward.toLocaleString()}`, `공적 EXP +${expGain}`, `전투력 +${g}`, '체력 -12']
        });
        break;
      }
      case 'recreation': {
        if (char.stats.wealth >= 220) {
          char.stats.wealth -= 220;
          char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 26);
          char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + 16);
          sound.playSuccess();
          addLog({
            year: char.year,
            age: char.age,
            season: this.pickSeason(char),
            title: '요양소 휴식과 심신 재정비',
            text: '따뜻한 식사와 의료 요양을 통해 지친 이성과 상처를 회복했습니다.',
            type: 'general',
            effectBadges: ['LMD -220', '이성 +26', '체력 +16']
          });
        } else {
          char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 13);
          char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + 8);
          addLog({
            year: char.year,
            age: char.age,
            season: this.pickSeason(char),
            title: '검소한 휴식',
            text: '돈을 들이지 않고 거처에서 조용히 수면을 취하며 기력을 추슬렀습니다.',
            type: 'general',
            effectBadges: ['이성 +13', '체력 +8']
          });
        }
        break;
      }
    }

    return char;
  }

  // 턴제 전투 엔진 초기화 (판정 실패 기습 페널티 지원)
  public static startBattle(enemyId: string, ambushed = false): BattleState {
    const enemyTemplate = ENEMIES_DATA[enemyId] || ENEMIES_DATA['slug_swarm'];
    const logs = [`적 [${enemyTemplate.name}]과(와) 조우했습니다! (특기: ${enemyTemplate.specialSkillName})`];
    if (ambushed) {
      logs.unshift(`⚠️ 판정 실패로 적의 기습을 허용했습니다! 방어 태세가 무너진 채(방어구 손상 -6) 불리하게 교전을 시작합니다!`);
    }
    return {
      isActive: true,
      enemy: { ...enemyTemplate },
      turn: 1,
      log: logs,
      isPlayerTurn: true,
      playerShield: 0,
      enemyShield: ambushed && enemyTemplate.maxHp >= 300 ? 25 : 0,
      damageTaken: 0,
      catalystActive: false,
      armorBreak: ambushed ? 6 : 0,
      ambushed
    };
  }

  // 턴제 전투 액션 실행
  public static executeBattleCommand(
    character: Character,
    battle: BattleState,
    command: 'attack' | 'arts' | 'defend' | 'item' | 'flee',
    itemId?: string,
    addLog?: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): { updatedChar: Character; updatedBattle: BattleState } {
    const baseChar = this.ensureCharacterDefaults(character);
    const char: Character = {
      ...baseChar,
      stats: { ...baseChar.stats },
      oripathy: { ...baseChar.oripathy },
      bonds: (baseChar.bonds || []).map(bd => ({ ...bd })),
      milestones: [...(baseChar.milestones || [])],
      inventory: baseChar.inventory.map(s => ({ ...s, item: { ...s.item } })),
      secretFlags: { ...baseChar.secretFlags },
      unlockedAchievements: [...(baseChar.unlockedAchievements || [])]
    };
    const b: BattleState = { ...battle, enemy: { ...battle.enemy }, log: [...battle.log] };

    if (!b.isActive) return { updatedChar: char, updatedBattle: b };

    const grantAch = (achId: string) => {
      if (addLog) {
        this.triggerAchievement(char, achId, addLog);
      } else if (!char.unlockedAchievements.includes(achId)) {
        char.unlockedAchievements.push(achId);
        storage.saveUnlockedAchievement(achId, char.name, char.year);
      }
    };

    const dealDamageToEnemy = (dmg: number) => {
      let remaining = dmg;
      if (b.enemyShield > 0) {
        if (b.enemyShield >= remaining) {
          b.enemyShield -= remaining;
          remaining = 0;
        } else {
          remaining -= b.enemyShield;
          b.enemyShield = 0;
        }
      }
      b.enemy.hp = Math.max(0, b.enemy.hp - remaining);
      return remaining;
    };

    switch (command) {
      case 'attack': {
        sound.playSlash();
        const weaponBonus = char.equipment.weapon?.atkBonus || 0;
        let atkMult = 1.0;
        if (this.hasTrait(char, 'talent_combat_frame')) atkMult += 0.1;
        if (char.focusStance === 'martial') atkMult += 0.1;
        const totalAtk = Math.round((char.stats.combat + weaponBonus) * atkMult);
        const rawDmg = Math.floor(totalAtk * (0.85 + Math.random() * 0.35));
        const effectiveDmg = Math.max(5, rawDmg - b.enemy.def);
        const actual = dealDamageToEnemy(effectiveDmg);
        b.log.unshift(`> 물리 타격! [${b.enemy.name}]에게 ${actual}의 물리 피해를 입혔습니다.`);
        if (char.race.includes('루포') && actual >= 45) {
          grantAch('rare_lupo_crimson_fangs');
        }
        break;
      }
      case 'arts': {
        sound.playArtsExplosion();
        const artsAmp = (char.oripathy.isInfected ? char.oripathy.activeArtsMultiplier : 1.0) * (b.catalystActive ? 3.0 : 1.0);
        const weaponArts = char.equipment.weapon?.artsBonus || 0;
        const artsPower = Math.floor((char.stats.artsAptitude + weaponArts) * 1.5 * artsAmp);
        const effectiveDmg = Math.max(10, Math.floor(artsPower * (1 - b.enemy.artsRes / 100)));
        const actual = dealDamageToEnemy(effectiveDmg);
        const sanCost = this.hasTrait(char, 'flaw_arts_blockage') ? 11 : 8;
        char.stats.sanity = Math.max(0, char.stats.sanity - sanCost);
        b.log.unshift(`> 오리지늄 아츠 영창! (증폭: ${artsAmp.toFixed(2)}x) [${b.enemy.name}]에게 ${actual}의 아츠 피해! (이성 -${sanCost})`);
        if (char.race.includes('카프리니') && actual >= 55) {
          grantAch('rare_caprinae_golden_melody');
        }
        break;
      }
      case 'defend': {
        sound.playBeep(500, 0.1, 'triangle');
        const armorDef = char.equipment.armor?.defBonus || 0;
        b.playerShield = 38 + armorDef;
        b.log.unshift(`> 전술 방어 태세를 취했습니다. (방어 실드 +${b.playerShield} 전개)`);
        if (char.race.includes('포르테')) {
          grantAch('rare_forte_unshakable_bastion');
        }
        break;
      }
      case 'item': {
        if (itemId) {
          const slot = char.inventory.find(s => s.item.id === itemId && s.count > 0);
          if (slot) {
            slot.count -= 1;
            if (slot.item.effectType === 'heal_hp') {
              const heal = slot.item.effectValue || 35;
              char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + heal);
              sound.playSuccess();
              b.log.unshift(`> [${slot.item.name}] 사용: 체력이 +${heal} 회복되었습니다.`);
            } else if (slot.item.effectType === 'heal_san') {
              const heal = slot.item.effectValue || 30;
              char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + heal);
              sound.playSuccess();
              b.log.unshift(`> [${slot.item.name}] 사용: 이성이 +${heal} 회복되었습니다.`);
            } else if (slot.item.effectType === 'boost_arts') {
              b.catalystActive = true;
              char.oripathy.isInfected = true;
              char.oripathy.crystallizationRate = Number((char.oripathy.crystallizationRate + 4.0).toFixed(1));
              sound.playArtsExplosion();
              b.log.unshift(`> ⚡ [${slot.item.name}] 주입! 결정화율이 +4% 상승하고 이번 전투 아츠 위력이 3배로 폭증합니다!`);
            }
            char.inventory = char.inventory.filter(s => s.count > 0);
          }
        }
        break;
      }
      case 'flee': {
        let fleeChance = 0.48 + (char.stats.luck - 40) * 0.003;
        if (b.enemy.atk >= 55) fleeChance -= 0.18;
        else if (b.enemy.atk >= 35) fleeChance -= 0.08;
        if (this.hasTrait(char, 'talent_street_sense')) fleeChance += 0.14;
        if (char.race.includes('쿠란타') || char.race.includes('펠린')) fleeChance += 0.1;
        if (this.hasTrait(char, 'flaw_reckless_blood')) fleeChance -= 0.14;
        fleeChance = Math.min(0.72, Math.max(0.22, fleeChance));

        if (Math.random() < fleeChance) {
          sound.playBeep(400, 0.1, 'sine');
          b.isActive = false;
          b.result = 'fled';
          b.log.unshift(`> 연막을 뿌리고 전장에서 간신히 이탈했습니다! (성공률 ${Math.round(fleeChance * 100)}%)`);
          if (char.race.includes('쿠란타')) {
            grantAch('rare_kuranta_unstoppable_gallop');
          }
          if (addLog) {
            addLog({
              year: char.year,
              age: char.age,
              season: this.pickSeason(char, 2),
              title: `【교전 이탈】 ${b.enemy.name} 전선 후퇴`,
              text: `[${b.enemy.name}]과의 교전 중 전술 연막을 전개하여 전선을 이탈했습니다.`,
              type: 'battle',
              effectBadges: ['전선 이탈 성공']
            });
          }
          return { updatedChar: char, updatedBattle: b };
        } else {
          b.log.unshift(`> 탈출 실패! [${b.enemy.name}]의 추격에 퇴로가 차단되었습니다!`);
        }
        break;
      }
    }

    // 동료 인연 전술 원호 사격 / 엄호 치유 (도시의 한 사람으로 태어나 연계 시스템)
    if (command !== 'flee' && b.enemy.hp > 0 && char.bonds && char.bonds.length > 0) {
      const livingBonds = char.bonds.filter(bd => bd.isAlive);
      if (livingBonds.length > 0 && Math.random() < 0.32) {
        const ally = livingBonds[Math.floor(Math.random() * livingBonds.length)];
        const supportRoll = Math.random();
        if (supportRoll < 0.6) {
          const assistDmg = dealDamageToEnemy(14 + Math.floor(Math.random() * 12));
          sound.playSlash();
          b.log.unshift(`🤝 동료 [${ally.name}]의 원호 사격! 적에게 ${assistDmg}의 지원 피해를 입혔습니다!`);
        } else {
          const healAmt = 12 + Math.floor(Math.random() * 8);
          char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + healAmt);
          sound.playSuccess();
          b.log.unshift(`🤝 동료 [${ally.name}]이(가) 엄호하며 응급 붕대를 감아주었습니다. (체력 +${healAmt})`);
        }
      }
    }

    if (b.enemy.hp <= 0) {
      sound.playSuccess();
      b.isActive = false;
      b.result = 'victory';
      const isBoss = BOSS_ENEMY_IDS.has(b.enemy.id);
      const rewardLmd = Math.round(b.enemy.rewardLmd * (this.hasTrait(char, 'talent_merchant_eye') ? 1.15 : 0.85));
      char.stats.wealth += rewardLmd;

      let statGain = 4;
      if (
        b.enemy.rewardExpStat === 'combat' ||
        b.enemy.rewardExpStat === 'artsAptitude' ||
        b.enemy.rewardExpStat === 'intellect' ||
        b.enemy.rewardExpStat === 'luck'
      ) {
        statGain = this.applyStatGain(char, b.enemy.rewardExpStat, isBoss ? 6 : 4);
      } else if (b.enemy.rewardExpStat === 'sanity') {
        char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 10);
        statGain = 10;
      }

      const expReward = isBoss ? 18 : 7;
      char.careerExp = (char.careerExp || 0) + expReward;

      if (isBoss) {
        char.bossKills = (char.bossKills || 0) + 1;
        this.recordMilestone(char, `${char.age}세: 강적 【${b.enemy.name}】 토벌 승리`);
      }

      b.log.unshift(`★ 승리! [${b.enemy.name}]을(를) 물리치고 ${rewardLmd.toLocaleString()} LMD와 공적 EXP +${expReward}을(를) 획득했습니다!`);

      if (addLog) {
        addLog({
          year: char.year,
          age: char.age,
          season: this.pickSeason(char, 2),
          title: `⚔️ 【전투 승리】 ${b.enemy.name} 격파!`,
          text: `치열한 교전 끝에 [${b.enemy.name}]을(를) 제압하고 전리품을 확보했습니다.`,
          type: 'battle',
          effectBadges: [
            `LMD +${rewardLmd.toLocaleString()}`,
            `공적 EXP +${expReward}`,
            `${STAT_LABELS[b.enemy.rewardExpStat] || b.enemy.rewardExpStat} +${statGain}`
          ]
        });
      }

      grantAch('common_first_victory');
      if ((b.damageTaken || 0) === 0) grantAch('rare_flawless_duel');
      if (!char.equipment.weapon && !char.equipment.armor) grantAch('rare_barehand_brawler');
      if (char.race.includes('펠린') && char.stats.health <= 5) grantAch('rare_feline_nine_lives');
      if (char.race.includes('우르수스') && char.stats.health <= 20) grantAch('rare_ursus_unbreakable_rage');
      if (char.race.includes('리베리')) grantAch('rare_liberi_stratosphere_flight');

      if (b.enemy.id === 'emperors_blade' || b.enemy.name.includes('황제의 검')) grantAch('unique_slay_emperors_blade');
      if (b.enemy.id === 'seaborne_predator' || b.enemy.name.includes('심해')) grantAch('unique_slay_abyssal_cult');
      if (b.enemy.id === 'londinium_steam_knight' || b.enemy.name.includes('증기기사')) grantAch('unique_slay_steam_goliath');

      this.checkAndUpdateLifeGoal(char, addLog);
      return { updatedChar: char, updatedBattle: b };
    }

    // --- 적 턴 및 고유 필살기 발동 ---
    b.turn += 1;
    const isSpecialTurn = b.turn % 3 === 0 || (b.enemy.hp <= b.enemy.maxHp * 0.5 && b.turn === 2);
    const playerDef = Math.max(0, (char.equipment.armor?.defBonus || 0) - (b.armorBreak || 0));

    let enemyDmgRaw = Math.floor(b.enemy.atk * (0.85 + Math.random() * 0.35));

    if (isSpecialTurn) {
      if (b.enemy.id === 'slug_swarm') {
        b.armorBreak = (b.armorBreak || 0) + 5;
        enemyDmgRaw = Math.floor(enemyDmgRaw * 1.25);
        b.log.unshift(`⚠️ [${b.enemy.name}]의 특수기 【${b.enemy.specialSkillName}】! 방어구가 부식됩니다!`);
      } else if (b.enemy.id === 'wasteland_bandit') {
        enemyDmgRaw = Math.floor(enemyDmgRaw * 1.6);
        b.log.unshift(`⚠️ [${b.enemy.name}]의 특수기 【${b.enemy.specialSkillName}】! 맹렬한 2연속 참격!`);
      } else if (b.enemy.id === 'reunion_vanguard') {
        enemyDmgRaw = Math.floor(enemyDmgRaw * 1.5);
        b.log.unshift(`⚠️ [${b.enemy.name}]의 특수기 【${b.enemy.specialSkillName}】! 광기 어린 돌격!`);
      } else if (b.enemy.id === 'sarkaz_centurion') {
        b.enemyShield += 65;
        enemyDmgRaw = Math.floor(enemyDmgRaw * 1.3);
        b.log.unshift(`⚠️ [${b.enemy.name}]의 특수기 【${b.enemy.specialSkillName}】! 주술 보호막(+65)을 두르고 베어냅니다!`);
      } else if (b.enemy.id === 'seaborne_predator') {
        char.stats.sanity = Math.max(0, char.stats.sanity - 14);
        enemyDmgRaw = Math.floor(enemyDmgRaw * 1.35);
        b.log.unshift(`⚠️ [${b.enemy.name}]의 특수기 【${b.enemy.specialSkillName}】! 신경 오염으로 이성이 -14 깎입니다!`);
      } else if (b.enemy.id === 'londinium_steam_knight') {
        enemyDmgRaw = Math.floor(enemyDmgRaw * 1.65);
        b.log.unshift(`⚠️ [${b.enemy.name}]의 특수기 【${b.enemy.specialSkillName}】! 증기 파일벙커가 대지를 분쇄합니다!`);
      } else if (b.enemy.id === 'emperors_blade') {
        char.stats.sanity = Math.max(0, char.stats.sanity - 16);
        b.armorBreak = (b.armorBreak || 0) + 10;
        enemyDmgRaw = Math.floor(enemyDmgRaw * 1.55);
        b.log.unshift(`⚠️ [${b.enemy.name}]의 특수기 【${b.enemy.specialSkillName}】! 국토의 검은 안개가 공간과 정신을 침식합니다! (이성 -16)`);
      }
    }

    if (this.hasTrait(char, 'flaw_reckless_blood')) {
      enemyDmgRaw = Math.round(enemyDmgRaw * 1.15);
    }
    if (char.focusStance === 'survival') {
      enemyDmgRaw = Math.round(enemyDmgRaw * 0.88);
    }

    let netDmg = Math.max(5, enemyDmgRaw - playerDef);

    if (b.playerShield > 0) {
      if (b.playerShield >= netDmg) {
        b.playerShield -= netDmg;
        netDmg = 0;
      } else {
        netDmg -= b.playerShield;
        b.playerShield = 0;
      }
    }

    if (netDmg > 0) {
      sound.playBeep(220, 0.15, 'sawtooth');
      char.stats.health = Math.max(0, char.stats.health - netDmg);
      b.damageTaken = (b.damageTaken || 0) + netDmg;
      b.log.unshift(`! [${b.enemy.name}]의 공격! ${netDmg}의 피해를 입었습니다. (잔여 체력: ${char.stats.health})`);
    } else {
      b.log.unshift(`! 적의 공격을 방어 실드로 완벽히 차단했습니다!`);
    }

    if (char.stats.health <= 0) {
      if (this.tryCompanionLifeSave(char, `[${b.enemy.name}]과의 사투`, addLog)) {
        b.isActive = false;
        b.result = 'fled';
        b.log.unshift(`🕯️ 동료의 목숨을 바친 엄호 덕분에 전장에서 극적으로 생환했습니다!`);
      } else {
        sound.playFlatline();
        b.isActive = false;
        b.result = 'defeat';
        char.isAlive = false;
        this.recordMilestone(char, `${char.age}세: [${b.enemy.name}]과의 혈투 끝에 전사`);
        char.deathRecord = this.generateDeathRecord(
          char,
          'KilledInAction',
          `[${b.enemy.name}]과의 치열한 혈투 중 전사`,
          '피로 물든 칼자루를 놓지 못한 채 쓰러졌습니다.'
        );
        b.log.unshift(`☠ 패배... 치명상을 입고 쓰러졌습니다.`);
      }
    }

    return { updatedChar: char, updatedBattle: b };
  }

  // 최종 사망/영면 기록 생성 (S등급 진정한 위업 조건 및 수명·자산 착취 방지 공식 적용)
  public static generateDeathRecord(
    character: Character,
    _causeCode: string,
    detailedCause: string,
    lastWords: string
  ): DeathRecord {
    const char = this.ensureCharacterDefaults(character);
    this.checkAndUpdateLifeGoal(char);
    const ending = determineEnding(char, detailedCause);
    const profile = this.getCharacterLifespanProfile(char);

    let achPoints = 0;
    const runAchs = char.unlockedAchievements || [];
    for (const id of runAchs) {
      const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
      if (ach) achPoints += ach.points;
    }

    const statsPoints = Math.round(
      (char.stats.combat + char.stats.artsAptitude + char.stats.intellect + char.stats.luck) * 2.4
    );
    const wealthPoints = Math.min(1400, Math.floor(Math.sqrt(Math.max(0, char.stats.wealth)) * 6.2));

    let rawRepSum = 0;
    for (const val of Object.values(char.factions)) {
      if (val > 0) rawRepSum += val;
    }
    const repPoints = Math.min(850, rawRepSum * 4);

    // 장수종(살카즈/에기르) 수백 년 생존 시 공짜 S등급을 받던 왜곡 제거: 연령 체감 + 기대수명 달성률 혼합
    const baseAgeScore = Math.min(char.age, 70) * 9 + Math.floor(Math.sqrt(Math.max(0, char.age - 70)) * 32);
    const lifespanRatioBonus = Math.round(Math.min(1.15, char.age / Math.max(30, profile.baseLifespan)) * 260);
    const lifespanPoints = baseAgeScore + lifespanRatioBonus;

    const endingBonus = ending.scoreBonus;
    const goalBonus = char.goalAchieved && char.lifeGoal ? char.lifeGoal.bonusPoints : 0;
    const totalScore = achPoints + statsPoints + wealthPoints + repPoints + lifespanPoints + endingBonus + goalBonus;

    const scoreBreakdown: ScoreBreakdown = {
      achievements: achPoints,
      stats: statsPoints,
      wealth: wealthPoints,
      reputation: repPoints,
      lifespan: lifespanPoints,
      endingBonus,
      goalBonus
    };

    const hasPinnacleFeat =
      (char.careerTier || 0) >= 4 ||
      !!char.specialCareerId ||
      ending.rarity === 'Legendary' ||
      ending.rarity === 'Unique';

    const achievedGoal = !!char.goalAchieved;
    const hasSufficientAchs = (char.unlockedAchievements || []).length >= 6;
    const isDespairDeath = char.stats.wealth <= 0 && char.oripathy.crystallizationRate >= 80;

    // S등급 난이도 대폭 상향: 8,800점 이상 + 피너클 직위/엔딩 + 생애 목표 완수 + 업적 6개 이상 + 비참한 파산/방치사 아닐 것
    let rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
    if (totalScore >= 8800 && hasPinnacleFeat && achievedGoal && hasSufficientAchs && !isDespairDeath) {
      rank = 'S';
    } else if (totalScore >= 5600) {
      rank = 'A';
    } else if (totalScore >= 3500) {
      rank = 'B';
    } else if (totalScore >= 1900) {
      rank = 'C';
    } else if (totalScore >= 850) {
      rank = 'D';
    } else {
      rank = 'F';
    }

    if (rank === 'S') {
      storage.saveUnlockedAchievement('legend_living_myth', char.name, char.year);
    }

    if (char.age <= 25 && char.stats.combat >= 80) {
      storage.saveUnlockedAchievement('rare_youth_warrior_blaze', char.name, char.year);
    }

    // 다음 생애를 위한 유산 계승 (보유 자산의 10% 상속)
    storage.saveLastInheritanceLmd(char.stats.wealth);

    return {
      seed: char.seed,
      characterName: char.name,
      race: char.race,
      nation: char.nation,
      yearOfDeath: char.year,
      ageAtDeath: char.age,
      cause: detailedCause,
      detailedCause,
      finalRank: rank,
      lastWords: ending.epitaph || lastWords,
      notableAchievements: [
        `테라력 ${char.year}년까지 생존 (향년 ${char.age}세)`,
        `최종 직위: ${char.career} — ${char.careerRank} (Tier ${char.careerTier || 0})`,
        `도달 엔딩: "${ending.title}" (${ending.subtitle})`,
        `생애 목표: ${char.lifeGoal ? `${char.lifeGoal.title} (${char.goalAchieved ? '달성 완료' : '미완'})` : '없음'}`,
        `최종 종합 점수: ${totalScore.toLocaleString()}점 (등급: ${rank})`
      ],
      milestones: char.milestones || [],
      innateTraits: char.innateTraits || [],
      lifeGoalTitle: char.lifeGoal?.title,
      goalAchieved: !!char.goalAchieved,
      statsSummary: {
        combat: char.stats.combat,
        arts: char.stats.artsAptitude,
        wealth: char.stats.wealth,
        crystallizationRate: char.oripathy.crystallizationRate
      },
      endingId: ending.id,
      endingTitle: ending.title,
      endingSubtitle: ending.subtitle,
      endingRarity: ending.rarity,
      endingEpitaph: ending.epitaph,
      totalScore,
      scoreBreakdown,
      unlockedAchievementsInRun: runAchs
    };
  }
}
