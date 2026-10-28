// src/engine/gameEngine.ts
import { 
  Character, 
  CharacterStats, 
  OripathyStatus, 
  EnvironmentType, 
  LogEntry, 
  GameEvent, 
  EventChoice, 
  BattleState, 
  DeathRecord,
  ScoreBreakdown,
  ReincarnationConfig,
  AIStrategy,
  SpecialCareer
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
  public static getRandomName(): string {
    return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
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
          title: `🏆 【업적 달성: ${ach.tier}】 ${ach.title}`,
          text: `${ach.description} (+${ach.points} Pts)${isNewGlobal ? ' [도감 최초 등록!]' : ''}`,
          type: 'critical',
          effectBadges: [`업적 +${ach.points} PTS`, isNewGlobal ? '도감 신규 해금' : '이번 생애 달성']
        });
      }
    }
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
      let penaltyRatio = (char.oripathy.crystallizationRate / 100) * 0.65;

      if (char.oripathy.lesionSite === '호흡기(폐)' || char.oripathy.lesionSite === '혈관계') {
        penaltyRatio += 0.12;
      } else if (char.oripathy.lesionSite === '신경계') {
        penaltyRatio += 0.10;
      }

      if (char.oripathy.suppressantDoseLeft > 0) {
        penaltyRatio *= 0.5;
      }

      penaltyRatio = Math.min(0.85, penaltyRatio);

      effectiveMax = Math.max(22, Math.round(max * (1 - penaltyRatio)));
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

  // 캐릭터 생성 (무작위 또는 환생 커스텀 설정 반영)
  public static createRandomCharacter(config?: ReincarnationConfig): Character {
    const perks = config?.perkIds || [];

    // 1. 종족 결정
    let race = RACES_DATA[0];
    if (config?.raceId && config.raceId !== 'random') {
      race = RACES_DATA.find(r => r.id === config.raceId) || RACES_DATA[0];
    } else {
      const roll = Math.random();
      const ancientChance = perks.includes('perk_ancient_sovereign') ? 0.25 : 0.008;
      if (roll < ancientChance / 2) {
        race = RACES_DATA.find(r => r.id === 'draco') || RACES_DATA[0];
      } else if (roll < ancientChance) {
        race = RACES_DATA.find(r => r.id === 'aslan') || RACES_DATA[0];
      } else {
        const commonRaces = RACES_DATA.filter(r => r.id !== 'draco' && r.id !== 'aslan');
        race = commonRaces[Math.floor(Math.random() * commonRaces.length)];
      }
    }

    const subRace = race.subRaces ? race.subRaces[Math.floor(Math.random() * race.subRaces.length)] : undefined;
    const gender = config?.gender || (Math.random() < 0.5 ? '남성' : '여성');
    const name = config?.name?.trim() ? config.name.trim() : this.getRandomName();

    // 2. 국가 결정
    let nation = NATIONS_DATA[Math.floor(Math.random() * NATIONS_DATA.length)];
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
    const environment = config?.environment || environments[Math.floor(Math.random() * environments.length)];

    const stats: CharacterStats = { ...race.baseStats };

    // 환경별 보정
    if (environment === '이동도시 상류층') {
      stats.wealth += 1500;
      stats.intellect += 10;
    } else if (environment === '슬럼가 및 암시장') {
      stats.wealth = Math.max(50, stats.wealth - 200);
      stats.luck += 15;
      stats.combat += 5;
    } else if (environment === '황야의 노마드 캠프') {
      stats.health += 10;
      stats.combat += 10;
      stats.wealth = Math.max(50, stats.wealth - 300);
    } else if (environment === '이동기지 (로도스/블랙스틸)') {
      stats.artsAptitude += 10;
      stats.sanity += 10;
    }

    // 초기 광석병 감염 여부 결정
    let initialInfection = false;
    let baseInfectionChance = 0.15;
    if (race.id === 'sarkaz') baseInfectionChance += 0.25;
    if (race.id === 'cautus') baseInfectionChance += 0.15;
    if (environment === '슬럼가 및 암시장' || environment === '황야의 노마드 캠프') baseInfectionChance += 0.15;
    if (race.id === 'aegir') baseInfectionChance = 0.01;

    if (perks.includes('perk_pure_immunity')) {
      initialInfection = false;
    } else if (Math.random() < baseInfectionChance) {
      initialInfection = true;
    }

    const lesionSites = ['체표 피부', '호흡기(폐)', '신경계', '혈관계', '사지 골격'] as const;
    const chosenLesion = initialInfection ? lesionSites[Math.floor(Math.random() * lesionSites.length)] : '없음';

    const oripathy: OripathyStatus = {
      isInfected: initialInfection,
      crystallizationRate: initialInfection ? Number((0.5 + Math.random() * 3.5).toFixed(1)) : 0.0,
      originiumBloodDensity: initialInfection ? Number((0.18 + Math.random() * 0.15).toFixed(2)) : 0.08,
      stage: initialInfection ? 'Early' : 'Clean',
      lesionSite: chosenLesion,
      activeArtsMultiplier: initialInfection ? 1.25 : 1.0,
      suppressantDoseLeft: 0,
    };

    const initialSpray = ITEMS_DATA.find(i => i.id === 'med_emergency_spray')!;
    const inventory = [{ item: initialSpray, count: 2 }];
    const equipment: Character['equipment'] = {};
    const factions: Record<string, number> = {
      '로도스 아일랜드': 0,
      '용문 근위국': 0,
      '리유니온': 0,
      '라인 생명': 0,
      '블랙스틸': 0,
    };
    const secretFlags: Record<string, boolean> = {};

    // --- 환생 특전(Perks) 효과 적용 ---
    if (perks.includes('perk_merchant_heir')) {
      stats.wealth += 1500;
      stats.intellect += 8;
    }
    if (perks.includes('perk_martial_prodigy')) {
      stats.combat += 15;
      stats.maxHealth += 15;
      stats.health += 15;
      const blade = ITEMS_DATA.find(i => i.id === 'wp_guard_blade');
      if (blade) equipment.weapon = blade;
    }
    if (perks.includes('perk_arts_resonance')) {
      stats.artsAptitude += 18;
      stats.maxSanity += 15;
      stats.sanity += 15;
      stats.luck += 10;
    }
    if (perks.includes('perk_rhodes_sponsor')) {
      factions['로도스 아일랜드'] += 25;
      const supp = ITEMS_DATA.find(i => i.id === 'med_rhodes_suppressant');
      const sanPot = ITEMS_DATA.find(i => i.id === 'med_sanity_potion');
      if (supp) inventory.push({ item: supp, count: 2 });
      if (sanPot) inventory.push({ item: sanPot, count: 2 });
    }
    if (perks.includes('perk_pure_immunity')) {
      secretFlags['pure_immunity'] = true;
    }
    if (perks.includes('perk_ancient_sovereign')) {
      stats.combat += 12;
      stats.artsAptitude += 12;
      stats.intellect += 12;
      stats.luck += 12;
      stats.maxHealth += 12;
      stats.health += 12;
      stats.maxSanity += 12;
      stats.sanity += 12;
      stats.wealth += 2500;
    }

    const startYear = 1075 + Math.floor(Math.random() * 15);

    return {
      id: 'char_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
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

  // 특수 직군 해금 자격 검사
  public static checkSpecialCareerEligibility(char: Character, career: SpecialCareer): {
    eligible: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (char.age < 16) {
      reasons.push(`연령 16세 이상 필요 (현재 ${char.age}세)`);
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
          reasons.push(`${STAT_LABELS[key] || key} ${minVal} 이상 (현재 ${cur})`);
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

  // 특수 직군 공식 임관 / 전직
  public static promoteToSpecialCareer(
    character: Character,
    careerId: string,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    const career = SPECIAL_CAREERS_DATA.find(c => c.id === careerId);
    if (!career || character.specialCareerId === careerId) return character;

    const check = this.checkSpecialCareerEligibility(character, career);
    if (!check.eligible) return character;

    const char: Character = {
      ...character,
      stats: { ...character.stats },
      titles: [...character.titles],
      secretFlags: { ...character.secretFlags },
      unlockedAchievements: [...(character.unlockedAchievements || [])]
    };

    char.specialCareerId = career.id;
    char.career = career.name;
    char.careerRank = career.rank;

    const badges: string[] = [`직군: ${career.rank}`];

    if (career.category === 'combat') {
      char.stats.combat += 12;
      char.stats.maxHealth += 15;
      char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + 15);
      badges.push('전투력 +12', '최대체력 +15');
    } else if (career.category === 'arts') {
      char.stats.artsAptitude += 14;
      char.stats.maxSanity += 10;
      char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 10);
      badges.push('아츠 +14', '최대이성 +10');
    } else if (career.category === 'intellect') {
      char.stats.intellect += 14;
      char.stats.wealth += 1200;
      badges.push('지략 +14', 'LMD +1,200');
    } else {
      char.stats.combat += 8;
      char.stats.artsAptitude += 8;
      char.stats.intellect += 8;
      char.stats.wealth += 1000;
      badges.push('전투/아츠/지략 +8', 'LMD +1,000');
    }

    // 엔딩 조건 연동 시크릿 플래그
    if (career.id === 'rhodes_elite') char.secretFlags['completed_act1_or_act2'] = true;
    if (career.id === 'sarkaz_court') char.secretFlags['sarkaz_awakening'] = true;
    if (career.id === 'rhine_director') char.secretFlags['witnessed_lone_trail'] = true;
    if (career.id === 'steam_knight') char.secretFlags['steam_knight_stand'] = true;
    if (career.id === 'sami_snowpriest') char.secretFlags['stopped_collapse'] = true;

    if (!char.titles.includes(career.rank)) {
      char.titles.push(career.rank);
    }

    sound.playSuccess();
    addLog({
      year: char.year,
      age: char.age,
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
    const item = ITEMS_DATA.find(i => i.id === itemId);
    if (!item) return character;

    const char: Character = {
      ...character,
      stats: { ...character.stats },
      equipment: { ...character.equipment },
      inventory: character.inventory.map(s => ({ ...s, item: { ...s.item } })),
      unlockedAchievements: [...(character.unlockedAchievements || [])]
    };

    if (item.type === 'weapon' || item.type === 'armor') {
      const currentEquipped = item.type === 'weapon' ? char.equipment.weapon : char.equipment.armor;
      if (currentEquipped?.id === item.id) return char;

      if (char.stats.wealth < item.price) return char;
      char.stats.wealth -= item.price;

      // 이전 장비 보너스 차감 및 신규 장비 보너스 반영
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

      const badges: string[] = [`LMD -${item.price.toLocaleString()}`];
      if (item.atkBonus) badges.push(`장비 공격력 +${item.atkBonus}`);
      if (item.defBonus) badges.push(`장비 방어력 +${item.defBonus}`);
      if (item.artsBonus) {
        char.stats.artsAptitude += item.artsBonus;
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
        title: `🛡️ 【장비 조달 및 장착】 ${item.name}`,
        text: `${item.description} (${item.price.toLocaleString()} LMD 지불)`,
        type: 'general',
        effectBadges: badges
      });
      return char;
    } else {
      // 소모품 / 의약품 / 촉매 구매
      if (char.stats.wealth < item.price) return char;
      char.stats.wealth -= item.price;

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
        title: `💊 【물자 구매】 ${item.name}`,
        text: `${item.description} (보유 수량: ${existing ? existing.count : 1}개)`,
        type: 'general',
        effectBadges: [`LMD -${item.price.toLocaleString()}`, `${item.name} +1`]
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
    const char: Character = {
      ...character,
      stats: { ...character.stats },
      oripathy: { ...character.oripathy },
      inventory: character.inventory.map(s => ({ ...s, item: { ...s.item } })),
      unlockedAchievements: [...(character.unlockedAchievements || [])]
    };

    const slot = char.inventory.find(s => s.item.id === itemId && s.count > 0);
    if (!slot) return character;

    slot.count -= 1;
    const item = slot.item;

    if (item.effectType === 'heal_hp') {
      const val = item.effectValue || 35;
      char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + val);
      sound.playSuccess();
      addLog({
        year: char.year,
        age: char.age,
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
        title: `🧪 【신경 안정】 ${item.name}`,
        text: `청록색 신경 안정제를 복용하여 정신적 피로를 씻어냈습니다.`,
        type: 'general',
        effectBadges: [`이성 +${val}`]
      });
    } else if (item.effectType === 'suppress_oripathy') {
      if (item.id === 'med_blackmarket_fake') {
        // 암시장 불법 복제 억제제 (40% 확률 부작용)
        char.oripathy.suppressantDoseLeft += 1;
        if (Math.random() < 0.4) {
          char.stats.health = Math.max(5, char.stats.health - 15);
          char.stats.sanity = Math.max(5, char.stats.sanity - 15);
          sound.playHazardAlarm();
          addLog({
            year: char.year,
            age: char.age,
            title: `⚠️ 【불법 약물 부작용】 ${item.name}`,
            text: `억제 효과(1년)는 나타났으나, 정제되지 않은 불순물로 인해 심한 구토와 신경 독성을 겪었습니다!`,
            type: 'hazard',
            effectBadges: ['억제제 +1년', '체력 -15', '이성 -15']
          });
        } else {
          sound.playBeep(650, 0.08, 'sine');
          addLog({
            year: char.year,
            age: char.age,
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

  // 연간 직무 급여 및 일상 결산 계산
  public static getCareerAnnualSalary(char: Character): number {
    if (char.age < 15) return 0;
    if (char.specialCareerId) {
      return 650 + Math.floor(char.stats.intellect * 4);
    }
    if (char.career.includes('로도스') || char.career.includes('근위국') || char.career.includes('개척')) {
      return 320 + Math.floor(char.stats.intellect * 2.5);
    }
    if (char.career.includes('용병')) {
      return 280 + Math.floor(char.stats.combat * 2.5);
    }
    return 180 + Math.floor((char.stats.intellect + char.stats.luck) * 1.5);
  }

  // 1년 경과 (시간 흐름)
  public static advanceOneYear(
    character: Character, 
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void,
    options?: {
      autoManageApAndShop?: boolean;
      aiStrategy?: AIStrategy;
    }
  ): { updatedChar: Character; triggeredEvent?: GameEvent } {
    let char: Character = { 
      ...character,
      stats: { ...character.stats },
      oripathy: { ...character.oripathy },
      factions: { ...character.factions },
      secretFlags: { ...character.secretFlags },
      unlockedAchievements: [...(character.unlockedAchievements || [])],
      seenEventIds: [...(character.seenEventIds || [])],
      eventCooldowns: { ...(character.eventCooldowns || {}) }
    };

    // 이전 해에 남은 AP가 있고 자동 관리가 켜져 있으면 활용
    if (options?.autoManageApAndShop && char.isAlive && char.age >= 10) {
      char = this.runAutoYearlyManagement(char, options.aiStrategy || 'balanced', addLog);
    }

    char.age += 1;
    char.year += 1;
    char.actionPoints = char.stats.intellect >= 70 ? 2 : 1;

    // 15세 성인식 기본 직업 전환
    if (char.age === 15 && char.career === '무직 (어린 시절)') {
      char.career = '독립 생활자';
      char.careerRank = '청년 수습생';
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

    // 1. 테라 대사건 타임라인 속보 체크 (중복 연도 모두 처리 + 실제 인게임 효과 반영)
    const worldNewsList = WORLD_TIMELINE.filter(t => t.year === char.year);
    for (const worldNews of worldNewsList) {
      sound.playBeep(900, 0.08, 'sawtooth');
      const newsBadges: string[] = [];

      if (worldNews.year === 1089 && (char.nation.includes('카즈델') || char.race.includes('살카즈'))) {
        char.stats.combat += 5;
        newsBadges.push('전투력 +5');
      } else if (worldNews.year === 1091) {
        char.factions['로도스 아일랜드'] = (char.factions['로도스 아일랜드'] || 0) + 10;
        newsBadges.push('로도스 평판 +10');
        if (char.oripathy.isInfected) {
          char.oripathy.suppressantDoseLeft += 1;
          newsBadges.push('보급 억제제 +1년');
        }
      } else if (worldNews.year === 1096) {
        char.stats.combat += 3;
        char.stats.sanity = Math.max(10, char.stats.sanity - 4);
        newsBadges.push('전투력 +3', '이성 -4');
      } else if (worldNews.year === 1097 && worldNews.region === '카시미어' && char.nation.includes('카시미어')) {
        char.stats.wealth += 500;
        char.stats.combat += 4;
        newsBadges.push('LMD +500', '전투력 +4');
      } else if (worldNews.year === 1099 && worldNews.region === '빅토리아' && char.nation.includes('빅토리아')) {
        char.stats.combat += 6;
        newsBadges.push('전투력 +6');
      } else if (worldNews.year === 1100) {
        char.stats.intellect += 6;
        char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 12);
        char.secretFlags['witnessed_lone_trail'] = true;
        newsBadges.push('지략 +6', '이성 +12');
      }

      addLog({
        year: char.year,
        age: char.age,
        title: `【라디오 속보】 ${worldNews.title}`,
        text: `${worldNews.broadcastText}\n(효과: ${worldNews.inGameEffectText})`,
        type: 'news',
        effectBadges: newsBadges.length > 0 ? newsBadges : [`지역: ${worldNews.region}`]
      });
    }

    // 2. 광석병 병리 시뮬레이션
    if (char.oripathy.isInfected) {
      if (char.oripathy.suppressantDoseLeft > 0) {
        char.oripathy.suppressantDoseLeft -= 1;
        char.oripathy.crystallizationRate = Number((char.oripathy.crystallizationRate + 0.2).toFixed(1));
        addLog({
          year: char.year,
          age: char.age,
          title: '광석병 억제제 약효 유지',
          text: `로도스 억제제 효과로 체세포 결정화 침식이 최소화되었습니다. (현재 결정화율: ${char.oripathy.crystallizationRate}%, 잔여 약효: ${char.oripathy.suppressantDoseLeft}년)`,
          type: 'oripathy',
          effectBadges: [`결정화 +0.2%`, `억제 잔여 ${char.oripathy.suppressantDoseLeft}년`]
        });
      } else {
        const increase = Number((1.2 + Math.random() * 2.2).toFixed(1));
        char.oripathy.crystallizationRate = Number((char.oripathy.crystallizationRate + increase).toFixed(1));
        char.oripathy.originiumBloodDensity = Number((char.oripathy.originiumBloodDensity + 0.02).toFixed(2));
        char.stats.sanity = Math.max(0, char.stats.sanity - 4);

        addLog({
          year: char.year,
          age: char.age,
          title: '광석병 체내 침식 진행',
          text: `억제제가 고갈되어 체세포 결정화율이 +${increase}% 증가했습니다. (현재 결정화율: ${char.oripathy.crystallizationRate}%, 혈중 농도: ${char.oripathy.originiumBloodDensity}u/L)`,
          type: 'hazard',
          effectBadges: [`결정화 +${increase}%`, '이성 -4']
        });
        sound.playHazardAlarm();
        this.triggerAchievement(char, 'common_suppressant_shortage', addLog);
      }

      const rate = char.oripathy.crystallizationRate;
      if (rate >= 100) {
        char.oripathy.stage = 'Crystallized';
        char.isAlive = false;
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
        char.oripathy.activeArtsMultiplier = 2.8;
      } else if (rate >= 30) {
        char.oripathy.stage = 'Severe';
        char.oripathy.activeArtsMultiplier = 2.0;
      } else if (rate >= 10) {
        char.oripathy.stage = 'Mid';
        char.oripathy.activeArtsMultiplier = 1.5;
      } else {
        char.oripathy.stage = 'Early';
        char.oripathy.activeArtsMultiplier = 1.25;
      }
    } else {
      const infectionRoll = Math.random();
      let riskThreshold = 0.018;
      if (char.environment === '슬럼가 및 암시장' || char.environment === '황야의 노마드 캠프') {
        riskThreshold = 0.045;
      }
      if (char.secretFlags['pure_immunity']) {
        riskThreshold *= 0.2;
      }
      if (infectionRoll < riskThreshold) {
        char.oripathy.isInfected = true;
        char.oripathy.crystallizationRate = 1.2;
        char.oripathy.originiumBloodDensity = 0.22;
        char.oripathy.stage = 'Early';
        char.oripathy.lesionSite = '체표 피부';
        char.oripathy.activeArtsMultiplier = 1.2;
        
        sound.playHazardAlarm();
        addLog({
          year: char.year,
          age: char.age,
          title: '【긴급】 광석병 초기 감염 확진',
          text: '원인 모를 고열과 함께 쇄골 부근에 검은 결정체가 돋아났습니다. 오리지늄 광석병에 감염되었습니다!',
          type: 'hazard',
          effectBadges: ['광석병 감염 (STAGE I)', '아츠 증폭 1.2x']
        });
      }
    }

    if (char.stats.wealth <= 0) {
      this.triggerAchievement(char, 'rare_bankruptcy_ruin', addLog);
    }

    // 3. 체력/이성 고갈 판정
    if (char.stats.health <= 0) {
      char.isAlive = false;
      char.deathRecord = this.generateDeathRecord(
        char,
        'KilledInAction',
        '체력 고갈 및 가혹한 환경으로 인한 사망',
        '차가운 대지 위에서 힘없이 눈을 감았습니다.'
      );
      sound.playFlatline();
      return { updatedChar: char };
    }

    if (char.stats.sanity <= 0) {
      addLog({
        year: char.year,
        age: char.age,
        title: '정신 붕괴와 패닉',
        text: '이성이 바닥나 악몽과 환각에 시달립니다. 체력이 소모됩니다.',
        type: 'hazard',
        effectBadges: ['체력 -20', '이성 15 회복']
      });
      char.stats.health = Math.max(1, char.stats.health - 20);
      char.stats.sanity = 15;
    }

    // 4. 종족별 노화 및 자연 수명 판정
    const profile = this.getCharacterLifespanProfile(char);

    if (char.age >= profile.effectiveAgingStart) {
      const agingCycle = Math.max(3, Math.round(5 * profile.agingRate));
      const isAgingTurn = (char.age - profile.effectiveAgingStart) % agingCycle === 0;

      if (isAgingTurn) {
        const combatLoss = Math.random() < 0.6 ? 1 : 0;
        const healthLoss = Math.random() < 0.6 ? 2 : 1;
        char.stats.combat = Math.max(10, char.stats.combat - combatLoss);
        char.stats.health = Math.max(15, char.stats.health - healthLoss);
        char.stats.maxHealth = Math.max(30, char.stats.maxHealth - 1);
        
        if (Math.random() < 0.5) {
          char.stats.intellect += 1;
        }

        if (char.age % 10 === 0) {
          addLog({
            year: char.year,
            age: char.age,
            title: `【세월의 흔적】 ${char.race}의 신체 변화`,
            text: `향년 ${char.age}세. ${char.race}${char.subRace ? `(${char.subRace})` : ''}의 생애 주기에 따라 세월의 무게가 깃듭니다. 반응 속도가 다소 둔화되었으나 노련한 지략이 깊어집니다.`,
            type: 'general',
            effectBadges: ['노화 진행', '지략 +1']
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
        deathChance += (char.oripathy.crystallizationRate / 100) * 0.15;
      }

      if (char.age >= profile.effectiveMaxLifespan || Math.random() < deathChance) {
        char.isAlive = false;
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

    // 5. 연령 및 조건에 맞는 이벤트 탐색 (중복 및 쿨타임 철저 관리)
    const seenIds = char.seenEventIds || [];
    const cooldowns = char.eventCooldowns || {};

    const eligibleEvents = GAME_EVENTS.filter(e => {
      if (char.age < e.minAge || char.age > e.maxAge) return false;
      if (e.conditions?.isInfected !== undefined && e.conditions.isInfected !== char.oripathy.isInfected) return false;
      if (e.conditions?.race && !e.conditions.race.some(r => char.race.includes(r))) return false;
      if (e.conditions?.nation && !e.conditions.nation.some(n => char.nation.includes(n))) return false;
      if (e.conditions?.requiredFlag && !char.secretFlags[e.conditions.requiredFlag]) return false;
      if (e.conditions?.requiredCareer && char.specialCareerId !== e.conditions.requiredCareer) return false;

      // 일회성 고유 이벤트는 생애 1회만 등장
      const isOneTime = ONE_TIME_EVENT_PREFIXES.some(prefix => e.id.startsWith(prefix)) || e.maxAge - e.minAge <= 15;
      if (isOneTime && seenIds.includes(e.id)) return false;

      // 반복 가능 이벤트도 쿨타임 동안 재등장 금지
      if (cooldowns[e.id] && char.age < cooldowns[e.id]) return false;

      return true;
    });

    // 핵심 연령대(1세 첫 기억, 15세 진로 선택)나 미경험 고유 스토리 이벤트 우선 매칭
    const priorityEvents = eligibleEvents.filter(e => 
      (char.age === 1 && e.id === 'child_01_birth_mystery') ||
      (char.age === 15 && e.id === 'youth_01_career_choice') ||
      (e.id.startsWith('career_special_') && !char.specialCareerId)
    );

    let triggeredEvent: GameEvent | undefined = undefined;

    if (priorityEvents.length > 0) {
      triggeredEvent = priorityEvents[0];
    } else if (eligibleEvents.length > 0) {
      // 약 52% 확률로 선택지 사건 발생, 나머지 48%는 평온한 일상 및 직무 결산 해로 진행
      const eventChance = char.age < 15 ? 0.45 : 0.54;
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
      // 평온한 해: 연간 직무 급여 및 일상 성장 로그 기록
      this.processPeacefulYear(char, addLog);
    }

    return { updatedChar: char, triggeredEvent };
  }

  // 선택지 사건이 없는 평온한 해의 일상 및 정기 급여 정산
  private static processPeacefulYear(
    char: Character,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ) {
    const badges: string[] = [];

    if (char.age < 15) {
      // 유년기 성장
      const growthRoll = Math.random();
      if (growthRoll < 0.35) {
        char.stats.intellect += 2;
        badges.push('지략 +2');
      } else if (growthRoll < 0.7) {
        char.stats.combat += 2;
        badges.push('전투력 +2');
      } else {
        char.stats.artsAptitude += 2;
        badges.push('아츠 +2');
      }
      char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 3);

      const childActivities = [
        `${char.nation}의 거리를 뛰어다니며 세상 물정을 조금씩 배웠습니다.`,
        `${char.environment}에서 또래 아이들과 어울리며 기초 체력과 감각을 길렀습니다.`,
        `어른들의 어깨너머로 오리지늄 기기와 생존 기술을 유심히 관찰하며 한 해를 보냈습니다.`
      ];
      addLog({
        year: char.year,
        age: char.age,
        title: `【유년기 일상】 ${char.age}세의 성장`,
        text: childActivities[char.age % childActivities.length],
        type: 'general',
        effectBadges: badges
      });
    } else {
      // 성인기 직무 급여 및 경력 축적
      const salary = this.getCareerAnnualSalary(char);
      char.stats.wealth += salary;
      badges.push(`급여 +${salary.toLocaleString()} LMD`);

      if (char.specialCareerId) {
        char.stats.combat += 2;
        char.stats.artsAptitude += 2;
        badges.push('숙련도 +2');
      } else if (char.career.includes('로도스')) {
        char.factions['로도스 아일랜드'] = (char.factions['로도스 아일랜드'] || 0) + 3;
        char.stats.artsAptitude += 2;
        badges.push('로도스 +3', '아츠 +2');
      } else if (char.career.includes('근위국')) {
        char.factions['용문 근위국'] = (char.factions['용문 근위국'] || 0) + 3;
        char.stats.combat += 2;
        badges.push('용문 +3', '전투력 +2');
      } else {
        char.stats.intellect += 1;
        char.stats.combat += 1;
        badges.push('전투/지략 +1');
      }

      addLog({
        year: char.year,
        age: char.age,
        title: `【연간 직무 결산】 ${char.career} (${char.careerRank})`,
        text: `${char.nation}에서 [${char.career}] 직무를 성실히 수행하며 정기 보수와 실전 경험을 쌓았습니다.`,
        type: 'general',
        effectBadges: badges
      });
    }
  }

  // AI 자동 진행 시 연간 AP/장비/특수직군 자동 관리
  public static runAutoYearlyManagement(
    character: Character,
    strategy: AIStrategy,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    let char = character;

    // 1. 특수 직군 임관 자격이 되면 즉시 승급
    if (!char.specialCareerId && char.age >= 16) {
      for (const sc of SPECIAL_CAREERS_DATA) {
        if (this.checkSpecialCareerEligibility(char, sc).eligible) {
          char = this.promoteToSpecialCareer(char, sc.id, addLog);
          break;
        }
      }
    }

    // 2. 여유 자금이 있을 때 상위 무기/방어구 자동 구매 장착
    const reserveLmd = strategy === 'wealth' ? 3500 : strategy === 'survival' ? 1200 : 800;
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

    // 3. 잔여 AP 자동 사용
    while (char.actionPoints > 0 && char.isAlive) {
      const hasSuppressantItem = char.inventory.some(s => s.item.id === 'med_rhodes_suppressant' && s.count > 0);
      if (char.oripathy.isInfected && char.oripathy.suppressantDoseLeft <= 0 && (hasSuppressantItem || char.stats.wealth >= 800)) {
        char = this.executeAnnualAction(char, 'take_suppressant', addLog);
        continue;
      }

      if (char.stats.sanity < 40 || char.stats.health < char.stats.maxHealth * 0.45) {
        char = this.executeAnnualAction(char, 'recreation', addLog);
        continue;
      }

      if (strategy === 'wealth') {
        if (char.stats.health >= 25) {
          char = this.executeAnnualAction(char, 'faction_bounty', addLog);
        } else {
          char = this.executeAnnualAction(char, 'study_lore', addLog);
        }
      } else if (strategy === 'combat') {
        if (char.stats.artsAptitude > char.stats.combat + 10 && char.stats.sanity >= 20) {
          char = this.executeAnnualAction(char, 'cultivate_arts', addLog);
        } else if (char.stats.health >= 20) {
          char = this.executeAnnualAction(char, 'train_combat', addLog);
        } else {
          char = this.executeAnnualAction(char, 'recreation', addLog);
        }
      } else if (strategy === 'survival') {
        if (char.stats.health < char.stats.maxHealth * 0.75 || char.stats.sanity < char.stats.maxSanity * 0.75) {
          char = this.executeAnnualAction(char, 'recreation', addLog);
        } else {
          char = this.executeAnnualAction(char, 'study_lore', addLog);
        }
      } else {
        // balanced
        const roll = Math.random();
        if (roll < 0.3 && char.stats.health >= 20) {
          char = this.executeAnnualAction(char, 'train_combat', addLog);
        } else if (roll < 0.6 && char.stats.sanity >= 20) {
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

  // 인공지능 사건 선택지 자동 결정 (AI 성향 반영)
  public static selectAutoChoice(
    character: Character, 
    event: GameEvent,
    strategy: AIStrategy = 'balanced'
  ): EventChoice {
    const choices = event.choices;
    if (!choices || choices.length === 0) {
      throw new Error('Event has no choices');
    }
    if (choices.length === 1) return choices[0];

    const scored = choices.map(choice => {
      let score = 50;

      if (choice.diceCheck) {
        const statVal = character.stats[choice.diceCheck.stat] || 50;
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

      // AI 성향별 가중치
      if (strategy === 'survival') {
        if (text.includes('대피') || text.includes('안전') || text.includes('치료') || text.includes('방어') || text.includes('휴식') || text.includes('피한다')) score += 25;
        if (choice.triggerBattleEnemyId) score -= 20;
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
  ): { command: 'attack' | 'arts' | 'defend' | 'item'; itemId?: string } {
    if (character.stats.health < character.stats.maxHealth * 0.4) {
      const spray = character.inventory.find(slot => slot.item.id === 'med_emergency_spray' && slot.count > 0);
      if (spray) {
        return { command: 'item', itemId: spray.item.id };
      }
    }

    // 강적 상대로 촉매제가 있고 아직 미사용이면 사용
    if (!battle.catalystActive && battle.enemy.maxHp >= 500 && character.stats.artsAptitude >= 60) {
      const cat = character.inventory.find(slot => slot.item.id === 'med_originium_catalyst' && slot.count > 0);
      if (cat) {
        return { command: 'item', itemId: cat.item.id };
      }
    }

    if (character.stats.artsAptitude > character.stats.combat && character.stats.sanity >= 8) {
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
  private static buildOutcomeBadges(outcome: {
    statEffects?: Partial<CharacterStats>;
    crystallizationDelta?: number;
    bloodDensityDelta?: number;
    reputationDelta?: Record<string, number>;
    gainTitles?: string[];
    specialCareerGain?: { id: string; name: string; rank: string };
  }): string[] {
    const badges: string[] = [];
    if (outcome.statEffects) {
      for (const [k, v] of Object.entries(outcome.statEffects)) {
        const key = k as keyof CharacterStats;
        if (typeof v === 'number' && v !== 0) {
          const sign = v > 0 ? '+' : '';
          badges.push(`${STAT_LABELS[key] || key} ${sign}${v.toLocaleString()}`);
        }
      }
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
  ): { updatedChar: Character; battleEnemy?: string } {
    const char: Character = { 
      ...character,
      stats: { ...character.stats },
      oripathy: { ...character.oripathy },
      factions: { ...character.factions },
      titles: [...character.titles],
      secretFlags: { ...character.secretFlags },
      unlockedAchievements: [...(character.unlockedAchievements || [])]
    };

    if (choice.diceCheck) {
      sound.playDiceRoll();
      const rawRoll = Math.floor(Math.random() * 100) + 1;
      const statVal = char.stats[choice.diceCheck.stat] || 50;
      const statBonus = Math.floor(statVal / 5);
      const total = rawRoll + statBonus;
      const dc = choice.diceCheck.difficulty;

      let resultOutcome: '대성공' | '성공' | '실패' | '대참사' = '실패';
      let outcomeData = choice.outcomes.failure || choice.outcomes.success;

      if (rawRoll >= 95 || total >= dc + 25) {
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

      const badges = this.buildOutcomeBadges(outcomeData);

      addLog({
        year: char.year,
        age: char.age,
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

      if (outcomeData.deathReason) {
        char.isAlive = false;
        char.deathRecord = this.generateDeathRecord(char, 'KilledInAction', outcomeData.deathReason, '이곳에 전사의 숨결이 잠들다.');
        sound.playFlatline();
      }

      return { 
        updatedChar: char, 
        battleEnemy: choice.triggerBattleEnemyId 
      };
    } else {
      const outcomeData = choice.outcomes.success;
      const badges = this.buildOutcomeBadges(outcomeData);
      sound.playBeep(600, 0.05, 'sine');
      addLog({
        year: char.year,
        age: char.age,
        title: choice.label,
        text: outcomeData.text,
        type: 'general',
        effectBadges: badges
      });
      this.applyOutcomeEffects(char, outcomeData, addLog);

      return { 
        updatedChar: char, 
        battleEnemy: choice.triggerBattleEnemyId 
      };
    }
  }

  // 효과 반영 보조 함수
  private static applyOutcomeEffects(
    char: Character, 
    outcome: { 
      statEffects?: Partial<CharacterStats>; 
      crystallizationDelta?: number; 
      bloodDensityDelta?: number; 
      reputationDelta?: Record<string, number>; 
      gainTitles?: string[]; 
      specialCareerGain?: { id: string; name: string; rank: string };
      unlockAchievementId?: string;
      setSecretFlag?: string;
      setSecretFlag2?: string;
    },
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ) {
    if (outcome.statEffects) {
      for (const [k, v] of Object.entries(outcome.statEffects)) {
        const key = k as keyof CharacterStats;
        if (typeof v === 'number') {
          if (key === 'health') {
            char.stats.health = Math.min(char.stats.maxHealth, Math.max(0, char.stats.health + v));
          } else if (key === 'sanity') {
            char.stats.sanity = Math.min(char.stats.maxSanity, Math.max(0, char.stats.sanity + v));
          } else if (key === 'wealth') {
            char.stats.wealth = Math.max(0, char.stats.wealth + v);
          } else {
            char.stats[key] = Math.max(0, (char.stats[key] || 0) + v);
          }
        }
      }
    }

    if (outcome.crystallizationDelta) {
      char.oripathy.crystallizationRate = Math.max(0, Number((char.oripathy.crystallizationRate + outcome.crystallizationDelta).toFixed(1)));
      if (char.oripathy.crystallizationRate > 0) char.oripathy.isInfected = true;
    }

    if (outcome.bloodDensityDelta) {
      char.oripathy.originiumBloodDensity = Math.max(0.05, Number((char.oripathy.originiumBloodDensity + outcome.bloodDensityDelta).toFixed(2)));
    }

    if (outcome.reputationDelta) {
      for (const [f, delta] of Object.entries(outcome.reputationDelta)) {
        char.factions[f] = (char.factions[f] || 0) + delta;
      }
    }

    if (outcome.gainTitles) {
      for (const title of outcome.gainTitles) {
        if (!char.titles.includes(title)) {
          char.titles.push(title);
        }
      }
    }

    if (outcome.specialCareerGain) {
      char.specialCareerId = outcome.specialCareerGain.id;
      char.career = outcome.specialCareerGain.name;
      char.careerRank = outcome.specialCareerGain.rank;
      sound.playSuccess();
      addLog({
        year: char.year,
        age: char.age,
        title: `🎖️ 【특수 직군 승급】 ${char.career}`,
        text: `명예로운 [${char.careerRank}] 직무를 부여받았습니다. 능력치가 대폭 개편됩니다!`,
        type: 'critical',
        effectBadges: [`직군: ${char.careerRank}`]
      });
    }

    if (outcome.setSecretFlag) {
      char.secretFlags[outcome.setSecretFlag] = true;
    }
    if (outcome.setSecretFlag2) {
      char.secretFlags[outcome.setSecretFlag2] = true;
    }

    if (outcome.unlockAchievementId) {
      this.triggerAchievement(char, outcome.unlockAchievementId, addLog);
    }
  }

  // 연간 자율 활동 (아츠 수련, 백병전, 억제제, 현상금, 휴양, 학술/정세 연구)
  public static executeAnnualAction(
    character: Character,
    actionType: 'cultivate_arts' | 'train_combat' | 'take_suppressant' | 'faction_bounty' | 'recreation' | 'study_lore',
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    if (character.actionPoints <= 0) return character;
    const char: Character = { 
      ...character,
      stats: { ...character.stats },
      oripathy: { ...character.oripathy },
      inventory: character.inventory.map(s => ({ ...s, item: { ...s.item } })),
      secretFlags: { ...character.secretFlags },
      unlockedAchievements: [...(character.unlockedAchievements || [])]
    };
    char.actionPoints -= 1;

    switch (actionType) {
      case 'cultivate_arts': {
        sound.playArtsExplosion();
        const gain = Math.floor(Math.random() * 5) + 4;
        char.stats.artsAptitude += gain;
        char.stats.sanity = Math.max(5, char.stats.sanity - 5);
        addLog({
          year: char.year,
          age: char.age,
          title: '오리지늄 아츠 수련',
          text: `아츠 유닛을 튜닝하고 고위 영창 식을 암송했습니다. 아츠 적성이 +${gain} 상승했습니다.`,
          type: 'general',
          effectBadges: [`아츠 +${gain}`, '이성 -5']
        });
        break;
      }
      case 'train_combat': {
        sound.playSlash();
        const gain = Math.floor(Math.random() * 5) + 4;
        char.stats.combat += gain;
        char.stats.health = Math.max(10, char.stats.health - 5);
        addLog({
          year: char.year,
          age: char.age,
          title: '전술 백병전 훈련',
          text: `모래주머니를 차고 무기 숙련도와 전술 사격을 연마했습니다. 전투력이 +${gain} 상승했습니다.`,
          type: 'general',
          effectBadges: [`전투력 +${gain}`, '체력 -5']
        });
        break;
      }
      case 'study_lore': {
        sound.playBeep(780, 0.07, 'sine');
        const gain = Math.floor(Math.random() * 5) + 4;
        const stipend = 250 + Math.floor(char.stats.intellect * 2);
        char.stats.intellect += gain;
        char.stats.wealth += stipend;
        addLog({
          year: char.year,
          age: char.age,
          title: '정세 분석 및 학술 자문',
          text: `각 이동도시의 외교 동향과 오리지늄 공학 문헌을 연구하여 지략을 높이고 자문료를 받았습니다.`,
          type: 'general',
          effectBadges: [`지략 +${gain}`, `LMD +${stipend.toLocaleString()}`]
        });
        break;
      }
      case 'take_suppressant': {
        const slot = char.inventory.find(s => s.item.id === 'med_rhodes_suppressant' && s.count > 0);
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
            title: '로도스 정품 억제제 투약',
            text: '차가운 정제 억제제가 혈관을 순환하며 오리지늄 결정화를 3년간 동결합니다.',
            type: 'oripathy',
            effectBadges: ['억제제 +3년', '결정화 -0.5%']
          });
        } else if (char.stats.wealth >= 800) {
          char.stats.wealth -= 800;
          char.oripathy.suppressantDoseLeft += 3;
          char.oripathy.crystallizationRate = Math.max(0, Number((char.oripathy.crystallizationRate - 0.5).toFixed(1)));
          sound.playSuccess();
          this.triggerAchievement(char, 'common_rhodes_medicine', addLog);
          addLog({
            year: char.year,
            age: char.age,
            title: '로도스 이동 진료소 구매 및 투약',
            text: '800 LMD를 지불하고 정품 억제제를 처방받아 투약했습니다. 결정화 진행이 3년간 동결됩니다.',
            type: 'oripathy',
            effectBadges: ['LMD -800', '억제제 +3년', '결정화 -0.5%']
          });
        } else {
          addLog({
            year: char.year,
            age: char.age,
            title: '억제제 구매 실패',
            text: 'LMD가 부족하여 억제제를 구매하지 못했습니다. (800 LMD 필요)',
            type: 'hazard'
          });
          char.actionPoints += 1;
        }
        break;
      }
      case 'faction_bounty': {
        const reward = 650 + Math.floor(Math.random() * 550);
        char.stats.wealth += reward;
        char.stats.combat += 2;
        char.stats.health = Math.max(10, char.stats.health - 10);
        sound.playBeep(850, 0.08, 'sine');
        addLog({
          year: char.year,
          age: char.age,
          title: '현상금 및 특수 의뢰 완수',
          text: `황야의 약탈단을 소탕하고 의뢰 보상금 ${reward.toLocaleString()} LMD를 수령했습니다.`,
          type: 'general',
          effectBadges: [`LMD +${reward.toLocaleString()}`, '전투력 +2', '체력 -10']
        });
        break;
      }
      case 'recreation': {
        if (char.stats.wealth >= 200) {
          char.stats.wealth -= 200;
          char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 30);
          char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + 15);
          sound.playSuccess();
          addLog({
            year: char.year,
            age: char.age,
            title: '휴양과 심신 안정',
            text: '따뜻한 온천욕과 공연을 즐기며 지친 이성과 체력을 크게 회복했습니다.',
            type: 'general',
            effectBadges: ['LMD -200', '이성 +30', '체력 +15']
          });
        } else {
          char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 15);
          char.stats.health = Math.min(char.stats.maxHealth, char.stats.health + 8);
          addLog({
            year: char.year,
            age: char.age,
            title: '조용한 휴식',
            text: '돈을 들이지 않고 골목에서 조용히 독서와 사색을 즐겼습니다.',
            type: 'general',
            effectBadges: ['이성 +15', '체력 +8']
          });
        }
        break;
      }
    }

    return char;
  }

  // 턴제 전투 엔진 초기화
  public static startBattle(enemyId: string): BattleState {
    const enemyTemplate = ENEMIES_DATA[enemyId] || ENEMIES_DATA['slug_swarm'];
    return {
      isActive: true,
      enemy: { ...enemyTemplate },
      turn: 1,
      log: [`적 [${enemyTemplate.name}]과(와) 조우했습니다! (특기: ${enemyTemplate.specialSkillName})`],
      isPlayerTurn: true,
      playerShield: 0,
      enemyShield: 0,
      damageTaken: 0,
      catalystActive: false,
      armorBreak: 0
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
    const char: Character = { 
      ...character,
      stats: { ...character.stats },
      oripathy: { ...character.oripathy },
      inventory: character.inventory.map(s => ({ ...s, item: { ...s.item } })),
      secretFlags: { ...character.secretFlags },
      unlockedAchievements: [...(character.unlockedAchievements || [])]
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
        const totalAtk = char.stats.combat + weaponBonus;
        const rawDmg = Math.floor(totalAtk * (0.85 + Math.random() * 0.35));
        const effectiveDmg = Math.max(6, rawDmg - b.enemy.def);
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
        const artsPower = Math.floor((char.stats.artsAptitude + weaponArts) * 1.55 * artsAmp);
        const effectiveDmg = Math.max(12, Math.floor(artsPower * (1 - b.enemy.artsRes / 100)));
        const actual = dealDamageToEnemy(effectiveDmg);
        char.stats.sanity = Math.max(0, char.stats.sanity - 8);
        b.log.unshift(`> 오리지늄 아츠 영창! (증폭: ${artsAmp.toFixed(2)}x) [${b.enemy.name}]에게 ${actual}의 아츠 피해! (이성 -8)`);
        if (char.race.includes('카프리니') && actual >= 55) {
          grantAch('rare_caprinae_golden_melody');
        }
        break;
      }
      case 'defend': {
        sound.playBeep(500, 0.1, 'triangle');
        const armorDef = char.equipment.armor?.defBonus || 0;
        b.playerShield = 40 + armorDef;
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
              const heal = slot.item.effectValue || 40;
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
        const fleeRoll = Math.random();
        if (fleeRoll < 0.65) {
          sound.playBeep(400, 0.1, 'sine');
          b.isActive = false;
          b.result = 'fled';
          b.log.unshift(`> 연막을 뿌리고 전장에서 무사히 탈출했습니다!`);
          if (char.race.includes('쿠란타')) {
            grantAch('rare_kuranta_unstoppable_gallop');
          }
          if (addLog) {
            addLog({
              year: char.year,
              age: char.age,
              title: `【교전 이탈】 ${b.enemy.name} 전선 후퇴`,
              text: `[${b.enemy.name}]과의 교전 중 전술 연막을 전개하여 무사히 전선을 이탈했습니다.`,
              type: 'battle',
              effectBadges: ['전선 이탈 성공']
            });
          }
          return { updatedChar: char, updatedBattle: b };
        } else {
          b.log.unshift(`> 탈출 실패! 적의 포위망에 가로막혔습니다.`);
        }
        break;
      }
    }

    if (b.enemy.hp <= 0) {
      sound.playSuccess();
      b.isActive = false;
      b.result = 'victory';
      char.stats.wealth += b.enemy.rewardLmd;
      char.stats[b.enemy.rewardExpStat] = (char.stats[b.enemy.rewardExpStat] || 0) + 5;
      b.log.unshift(`★ 승리! [${b.enemy.name}]을(를) 물리치고 ${b.enemy.rewardLmd.toLocaleString()} LMD와 실전 경험을 획득했습니다!`);
      
      if (addLog) {
        addLog({
          year: char.year,
          age: char.age,
          title: `⚔️ 【전투 승리】 ${b.enemy.name} 격파!`,
          text: `치열한 교전 끝에 [${b.enemy.name}]을(를) 제압하고 전리품을 확보했습니다.`,
          type: 'battle',
          effectBadges: [
            `LMD +${b.enemy.rewardLmd.toLocaleString()}`,
            `${STAT_LABELS[b.enemy.rewardExpStat] || b.enemy.rewardExpStat} +5`
          ]
        });
      }

      grantAch('common_first_victory');

      if ((b.damageTaken || 0) === 0) {
        grantAch('rare_flawless_duel');
      }

      if (!char.equipment.weapon && !char.equipment.armor) {
        grantAch('rare_barehand_brawler');
      }

      if (char.race.includes('펠린') && char.stats.health <= 5) {
        grantAch('rare_feline_nine_lives');
      }

      if (char.race.includes('우르수스') && char.stats.health <= 20) {
        grantAch('rare_ursus_unbreakable_rage');
      }

      if (char.race.includes('리베리')) {
        grantAch('rare_liberi_stratosphere_flight');
      }

      if (b.enemy.id === 'emperors_blade' || b.enemy.name.includes('황제의 검')) {
        grantAch('unique_slay_emperors_blade');
      }
      if (b.enemy.id === 'seaborne_predator' || b.enemy.name.includes('심해')) {
        grantAch('unique_slay_abyssal_cult');
      }
      if (b.enemy.id === 'londinium_steam_knight' || b.enemy.name.includes('증기기사')) {
        grantAch('unique_slay_steam_goliath');
      }

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
      sound.playFlatline();
      b.isActive = false;
      b.result = 'defeat';
      char.isAlive = false;
      char.deathRecord = this.generateDeathRecord(
        char,
        'KilledInAction',
        `[${b.enemy.name}]과의 치열한 혈투 중 전사`,
        '피로 물든 칼자루를 놓지 못한 채 쓰러졌습니다.'
      );
      b.log.unshift(`☠ 패배... 치명상을 입고 쓰러졌습니다.`);
    }

    return { updatedChar: char, updatedBattle: b };
  }

  // 최종 사망/영면 기록 생성 (종합 점수제 및 엔딩 결정)
  public static generateDeathRecord(
    char: Character,
    _causeCode: string,
    detailedCause: string,
    lastWords: string
  ): DeathRecord {
    const ending = determineEnding(char, detailedCause);

    let achPoints = 0;
    const runAchs = char.unlockedAchievements || [];
    for (const id of runAchs) {
      const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
      if (ach) achPoints += ach.points;
    }

    const statsPoints = (char.stats.combat + char.stats.artsAptitude + char.stats.intellect + char.stats.luck) * 2;
    const wealthPoints = Math.floor(char.stats.wealth / 50);

    let repPoints = 0;
    for (const val of Object.values(char.factions)) {
      if (val > 0) repPoints += val * 5;
    }

    const lifespanPoints = char.age * 15;
    const endingBonus = ending.scoreBonus;
    const totalScore = achPoints + statsPoints + wealthPoints + repPoints + lifespanPoints + endingBonus;

    const scoreBreakdown: ScoreBreakdown = {
      achievements: achPoints,
      stats: statsPoints,
      wealth: wealthPoints,
      reputation: repPoints,
      lifespan: lifespanPoints,
      endingBonus: endingBonus
    };

    let rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
    if (totalScore >= 6000) rank = 'S';
    else if (totalScore >= 4000) rank = 'A';
    else if (totalScore >= 2500) rank = 'B';
    else if (totalScore >= 1500) rank = 'C';
    else if (totalScore >= 800) rank = 'D';
    else rank = 'F';

    if (totalScore >= 8000) {
      storage.saveUnlockedAchievement('legend_living_myth', char.name, char.year);
    }

    if (char.age <= 25 && char.stats.combat >= 80) {
      storage.saveUnlockedAchievement('rare_youth_warrior_blaze', char.name, char.year);
    }

    return {
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
        `최종 직업: ${char.career} (${char.careerRank})`,
        `도달 엔딩: "${ending.title}" (${ending.subtitle})`,
        `획득 칭호: ${char.titles.length > 0 ? char.titles.join(', ') : '이름 없는 방랑자'}`,
        `최종 종합 점수: ${totalScore.toLocaleString()}점 (등급: ${rank})`
      ],
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
