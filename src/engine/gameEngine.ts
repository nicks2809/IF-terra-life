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
  ScoreBreakdown
} from '../types';
import { RACES_DATA } from '../data/races';
import { NATIONS_DATA } from '../data/nations';
import { WORLD_TIMELINE } from '../data/timeline';
import { ITEMS_DATA } from '../data/items';
import { ENEMIES_DATA } from '../data/enemies';
import { GAME_EVENTS } from '../data/events';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { determineEnding } from '../data/endings';
import { storage } from '../services/storage';
import { sound } from '../services/sound';

const FIRST_NAMES = [
  '발터', '체이서', '아스트라', '카이사르', '아이린', '실반', '에단', '에리스', 
  '레오', '카밀라', '베라', '마커스', '단테', '클로에', '루카스', '미라', 
  '노아', '엘레나', '펠릭스', '세레나', '빅터', '로웬', '헬레나', '가브리엘'
];

export class GameEngine {
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
          type: 'critical'
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
    const raceData = RACES_DATA.find(r => r.name === char.race) || RACES_DATA[0];
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

    // 광석병 결정화율 및 병변 부위에 따른 수명 단축 계산
    let effectiveMax = max;
    let effectiveAging = agingStart;

    if (char.oripathy.isInfected) {
      // 결정화율 0% ~ 100%에 비례하여 최대 수명 단축 (최대 65% 단축)
      let penaltyRatio = (char.oripathy.crystallizationRate / 100) * 0.65;

      // 치명적 장기 병변 부위 (폐, 혈관계, 신경계)는 추가 부담
      if (char.oripathy.lesionSite === '호흡기(폐)' || char.oripathy.lesionSite === '혈관계') {
        penaltyRatio += 0.12;
      } else if (char.oripathy.lesionSite === '신경계') {
        penaltyRatio += 0.10;
      }

      // 억제제 복용 중이면 수명 감퇴 50% 완화
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

  // 캐릭터 무작위 생성 (출생)
  public static createRandomCharacter(): Character {
    // 0.5% 확률로 희귀 고대종(드라코, 아슬란)
    const roll = Math.random();
    let race = RACES_DATA[0];
    if (roll < 0.005) {
      race = RACES_DATA.find(r => r.id === 'draco') || RACES_DATA[0];
    } else if (roll < 0.01) {
      race = RACES_DATA.find(r => r.id === 'aslan') || RACES_DATA[0];
    } else {
      const commonRaces = RACES_DATA.filter(r => r.id !== 'draco' && r.id !== 'aslan');
      race = commonRaces[Math.floor(Math.random() * commonRaces.length)];
    }

    const subRace = race.subRaces ? race.subRaces[Math.floor(Math.random() * race.subRaces.length)] : undefined;
    const gender = Math.random() < 0.5 ? '남성' : '여성';
    const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const nation = NATIONS_DATA[Math.floor(Math.random() * NATIONS_DATA.length)];

    const environments: EnvironmentType[] = [
      '이동도시 상류층',
      '일반 거주구',
      '슬럼가 및 암시장',
      '황야의 노마드 캠프',
      '이동기지 (로도스/블랙스틸)'
    ];
    const environment = environments[Math.floor(Math.random() * environments.length)];

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
    if (race.id === 'aegir') baseInfectionChance = 0.01; // 에기르는 극저확률

    if (Math.random() < baseInfectionChance) {
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

    // 초기 지급 아이템
    const initialSpray = ITEMS_DATA.find(i => i.id === 'med_emergency_spray')!;
    const startYear = 1075 + Math.floor(Math.random() * 15); // 1075 ~ 1090년 사이 출생

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
      factions: {
        '로도스 아일랜드': 0,
        '용문 근위국': 0,
        '리유니온': 0,
        '라인 생명': 0,
        '블랙스틸': 0,
      },
      career: '무직 (어린 시절)',
      careerRank: '초년생',
      titles: [],
      equipment: {},
      inventory: [
        { item: initialSpray, count: 2 }
      ],
      actionPoints: 1,
      isAlive: true,
      secretFlags: {},
      unlockedAchievements: []
    };
  }

  // 1년 경과 (시간 흐름)
  public static advanceOneYear(
    character: Character, 
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): { updatedChar: Character; triggeredEvent?: GameEvent } {
    const char = { 
      ...character,
      secretFlags: { ...character.secretFlags },
      unlockedAchievements: [...(character.unlockedAchievements || [])]
    };
    char.age += 1;
    char.year += 1;
    char.actionPoints = char.stats.intellect >= 70 ? 2 : 1;

    // --- 나이 및 생존 마일스톤 업적 ---
    if (char.age >= 1) this.triggerAchievement(char, 'common_first_breath', addLog);
    if (char.age >= 15) this.triggerAchievement(char, 'common_coming_of_age', addLog);
    if (char.age >= 30) this.triggerAchievement(char, 'common_survive_30', addLog);
    if (char.age >= 50) this.triggerAchievement(char, 'rare_survive_50', addLog);
    if (char.age >= 70) this.triggerAchievement(char, 'mystic_longevity_70', addLog);
    if (char.age >= 100) this.triggerAchievement(char, 'mystic_centenarian_100', addLog);
    
    // 종족별 초장수 업적
    if (char.race.includes('살카즈') && char.age >= 150) {
      this.triggerAchievement(char, 'unique_sarkaz_elder_150', addLog);
    }
    if (char.race.includes('살카즈') && char.age >= 200) {
      this.triggerAchievement(char, 'legend_sarkaz_two_centuries', addLog);
    }
    if (char.race.includes('에기르') && char.age >= 120) {
      this.triggerAchievement(char, 'unique_aegir_deep_longevity', addLog);
    }

    // 완전 비감염 60세 생존
    if (!char.oripathy.isInfected && char.age >= 60) {
      this.triggerAchievement(char, 'rare_pure_blood_60', addLog);
    }

    // 말기 광석병(결정화율 70% 이상) 상태에서 장기 생존
    if (char.oripathy.isInfected && char.oripathy.crystallizationRate >= 70 && char.age >= 35) {
      this.triggerAchievement(char, 'unique_crystallized_will', addLog);
    }

    // 청빈한 은둔자 (50세 이상, 자산 200 이하)
    if (char.age >= 50 && char.stats.wealth <= 200) {
      this.triggerAchievement(char, 'rare_ascetic_hermit', addLog);
    }

    // 불운 속 생존 (행운 <= 15로 40세 생존)
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

    // 종족별 특화 스탯 업적
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

    // 1. 테라 대사건 타임라인 속보 체크
    const worldNews = WORLD_TIMELINE.find(t => t.year === char.year);
    if (worldNews) {
      sound.playBeep(900, 0.08, 'sawtooth');
      addLog({
        year: char.year,
        age: char.age,
        title: `【라디오 속보】 ${worldNews.title}`,
        text: `${worldNews.broadcastText}\n(효과: ${worldNews.inGameEffectText})`,
        type: 'news'
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
          type: 'oripathy'
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
          type: 'hazard'
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
      let infectionRoll = Math.random();
      let riskThreshold = 0.02;
      if (char.environment === '슬럼가 및 암시장' || char.environment === '황야의 노마드 캠프') {
        riskThreshold = 0.06;
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
          type: 'hazard'
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
        type: 'hazard'
      });
      char.stats.health = Math.max(1, char.stats.health - 20);
      char.stats.sanity = 15;
    }

    // 4. 종족별 노화 및 자연 수명 판정
    const profile = this.getCharacterLifespanProfile(char);

    // 노화 판정 및 점진적 신체 감퇴/지혜 성장
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
            type: 'general'
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

    // 5. 연령 및 조건에 맞는 이벤트 탐색
    const eligibleEvents = GAME_EVENTS.filter(e => {
      if (char.age < e.minAge || char.age > e.maxAge) return false;
      if (e.conditions?.isInfected !== undefined && e.conditions.isInfected !== char.oripathy.isInfected) return false;
      if (e.conditions?.race && !e.conditions.race.some(r => char.race.includes(r))) return false;
      if (e.conditions?.nation && !e.conditions.nation.some(n => char.nation.includes(n))) return false;
      if (e.conditions?.requiredFlag && !char.secretFlags[e.conditions.requiredFlag]) return false;
      if (e.conditions?.requiredCareer && char.specialCareerId !== e.conditions.requiredCareer) return false;
      return true;
    });

    const triggeredEvent = eligibleEvents.length > 0 
      ? eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)] 
      : undefined;

    return { updatedChar: char, triggeredEvent };
  }

  // 선택지 판정 및 처리
  public static resolveChoice(
    character: Character,
    choice: EventChoice,
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): { updatedChar: Character; battleEnemy?: string } {
    const char = { 
      ...character,
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
        }
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
      sound.playBeep(600, 0.05, 'sine');
      addLog({
        year: char.year,
        age: char.age,
        title: choice.label,
        text: outcomeData.text,
        type: 'general'
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
        type: 'critical'
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

  // 연간 자율 활동 (아츠 수련, 파밍, 의뢰, 치료, 휴양)
  public static executeAnnualAction(
    character: Character,
    actionType: 'cultivate_arts' | 'train_combat' | 'take_suppressant' | 'faction_bounty' | 'recreation',
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    if (character.actionPoints <= 0) return character;
    const char = { 
      ...character,
      secretFlags: { ...character.secretFlags },
      unlockedAchievements: [...(character.unlockedAchievements || [])]
    };
    char.actionPoints -= 1;

    switch (actionType) {
      case 'cultivate_arts': {
        sound.playArtsExplosion();
        const gain = Math.floor(Math.random() * 5) + 3;
        char.stats.artsAptitude += gain;
        char.stats.sanity = Math.max(5, char.stats.sanity - 5);
        addLog({
          year: char.year,
          age: char.age,
          title: '오리지늄 아츠 수련',
          text: `아츠 유닛을 튜닝하고 고위 영창 식을 암송했습니다. 아츠 적성이 +${gain} 상승했습니다. (이성 -5)`,
          type: 'general'
        });
        break;
      }
      case 'train_combat': {
        sound.playSlash();
        const gain = Math.floor(Math.random() * 5) + 3;
        char.stats.combat += gain;
        char.stats.health = Math.max(10, char.stats.health - 5);
        addLog({
          year: char.year,
          age: char.age,
          title: '전술 백병전 훈련',
          text: `모래주머니를 차고 무기 숙련도와 전술 사격을 연마했습니다. 전투력이 +${gain} 상승했습니다. (체력 -5)`,
          type: 'general'
        });
        break;
      }
      case 'take_suppressant': {
        const slot = char.inventory.find(s => s.item.id === 'med_rhodes_suppressant');
        if (slot && slot.count > 0) {
          slot.count -= 1;
          char.oripathy.suppressantDoseLeft += 3;
          char.oripathy.crystallizationRate = Math.max(0, Number((char.oripathy.crystallizationRate - 0.5).toFixed(1)));
          sound.playSuccess();
          this.triggerAchievement(char, 'common_rhodes_medicine', addLog);
          addLog({
            year: char.year,
            age: char.age,
            title: '로도스 정품 억제제 투약',
            text: '차가운 정제 억제제가 혈관을 순환하며 오리지늄 결정화를 3년간 동결합니다.',
            type: 'oripathy'
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
            type: 'oripathy'
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
        const reward = 600 + Math.floor(Math.random() * 500);
        char.stats.wealth += reward;
        char.stats.combat += 2;
        char.stats.health = Math.max(10, char.stats.health - 10);
        sound.playBeep(850, 0.08, 'sine');
        addLog({
          year: char.year,
          age: char.age,
          title: '현상금 및 특수 의뢰 완수',
          text: `황야의 약탈단을 소탕하고 의뢰 보상금 ${reward} LMD를 수령했습니다. (체력 -10, 전투력 +2)`,
          type: 'general'
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
            text: '따뜻한 온천욕과 공연을 즐기며 지친 이성과 체력을 크게 회복했습니다. (이성 +30, 체력 +15)',
            type: 'general'
          });
        } else {
          char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + 15);
          addLog({
            year: char.year,
            age: char.age,
            title: '조용한 휴식',
            text: '돈을 들이지 않고 골목에서 조용히 독서와 사색을 즐겼습니다. (이성 +15)',
            type: 'general'
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
      log: [`적 [${enemyTemplate.name}]과(와) 조우했습니다! 전투 태세를 갖추십시오.`],
      isPlayerTurn: true,
      playerShield: 0,
      enemyShield: 0,
      damageTaken: 0
    };
  }

  // 턴제 전투 액션 실행
  public static executeBattleCommand(
    character: Character,
    battle: BattleState,
    command: 'attack' | 'arts' | 'defend' | 'item' | 'flee',
    itemId?: string
  ): { updatedChar: Character; updatedBattle: BattleState } {
    const char = { 
      ...character,
      secretFlags: { ...character.secretFlags },
      unlockedAchievements: [...(character.unlockedAchievements || [])]
    };
    const b = { ...battle, log: [...battle.log] };

    if (!b.isActive) return { updatedChar: char, updatedBattle: b };

    const grantAch = (achId: string) => {
      if (!char.unlockedAchievements.includes(achId)) {
        char.unlockedAchievements.push(achId);
        storage.saveUnlockedAchievement(achId, char.name, char.year);
      }
    };

    switch (command) {
      case 'attack': {
        sound.playSlash();
        const weaponBonus = char.equipment.weapon?.atkBonus || 0;
        const totalAtk = char.stats.combat + weaponBonus;
        const rawDmg = Math.floor(totalAtk * (0.8 + Math.random() * 0.4));
        const effectiveDmg = Math.max(5, rawDmg - b.enemy.def);
        b.enemy.hp = Math.max(0, b.enemy.hp - effectiveDmg);
        b.log.unshift(`> 당신의 물리 공격! [${b.enemy.name}]에게 ${effectiveDmg}의 물리 피해를 입혔습니다.`);
        if (char.race.includes('루포') && effectiveDmg >= 45) {
          grantAch('rare_lupo_crimson_fangs');
        }
        break;
      }
      case 'arts': {
        sound.playArtsExplosion();
        const artsAmp = char.oripathy.isInfected ? char.oripathy.activeArtsMultiplier : 1.0;
        const artsPower = Math.floor(char.stats.artsAptitude * 1.5 * artsAmp);
        const effectiveDmg = Math.max(10, Math.floor(artsPower * (1 - b.enemy.artsRes / 100)));
        b.enemy.hp = Math.max(0, b.enemy.hp - effectiveDmg);
        char.stats.sanity = Math.max(0, char.stats.sanity - 8);
        b.log.unshift(`> 오리지늄 아츠 영창! (증폭: ${artsAmp}x) [${b.enemy.name}]에게 ${effectiveDmg}의 아츠 피해! (이성 -8)`);
        if (char.race.includes('카프리니') && effectiveDmg >= 55) {
          grantAch('rare_caprinae_golden_melody');
        }
        break;
      }
      case 'defend': {
        sound.playBeep(500, 0.1, 'triangle');
        b.playerShield = 40;
        b.log.unshift(`> 전술 방어 태세를 취했습니다. (방어 실드 40 전개)`);
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
              b.log.unshift(`> [${slot.item.name}] 사용: 체력이 ${heal} 회복되었습니다.`);
            } else if (slot.item.effectType === 'heal_san') {
              const heal = slot.item.effectValue || 30;
              char.stats.sanity = Math.min(char.stats.maxSanity, char.stats.sanity + heal);
              sound.playSuccess();
              b.log.unshift(`> [${slot.item.name}] 사용: 이성이 ${heal} 회복되었습니다.`);
            }
          }
        }
        break;
      }
      case 'flee': {
        const fleeRoll = Math.random();
        if (fleeRoll < 0.6) {
          sound.playBeep(400, 0.1, 'sine');
          b.isActive = false;
          b.result = 'fled';
          b.log.unshift(`> 연막을 뿌리고 전장에서 무사히 탈출했습니다!`);
          if (char.race.includes('쿠란타')) {
            grantAch('rare_kuranta_unstoppable_gallop');
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
      char.stats[b.enemy.rewardExpStat] = (char.stats[b.enemy.rewardExpStat] || 0) + 4;
      b.log.unshift(`★ 승리! [${b.enemy.name}]을(를) 물리치고 ${b.enemy.rewardLmd} LMD와 경험치를 획득했습니다!`);
      
      // 전투 승리 업적들
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

      // 보스 처치 업적
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

    b.turn += 1;
    const enemyDmgRaw = Math.floor(b.enemy.atk * (0.8 + Math.random() * 0.4));
    let netDmg = Math.max(5, enemyDmgRaw - (char.equipment.armor?.defBonus || 0));

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
      b.log.unshift(`! [${b.enemy.name}]의 반격! ${netDmg}의 피해를 입었습니다. (잔여 체력: ${char.stats.health})`);
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

    // 1. 업적 점수 계산
    let achPoints = 0;
    const runAchs = char.unlockedAchievements || [];
    for (const id of runAchs) {
      const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
      if (ach) achPoints += ach.points;
    }

    // 2. 스탯 점수
    const statsPoints = (char.stats.combat + char.stats.artsAptitude + char.stats.intellect + char.stats.luck) * 2;

    // 3. 자산 점수
    const wealthPoints = Math.floor(char.stats.wealth / 50);

    // 4. 주변 관계 및 평판 점수
    let repPoints = 0;
    for (const val of Object.values(char.factions)) {
      if (val > 0) repPoints += val * 5;
    }

    // 5. 생애 수명 점수
    const lifespanPoints = char.age * 15;

    // 6. 엔딩 희귀도 보너스
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

    // 등급 산출
    let rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
    if (totalScore >= 6000) rank = 'S';
    else if (totalScore >= 4000) rank = 'A';
    else if (totalScore >= 2500) rank = 'B';
    else if (totalScore >= 1500) rank = 'C';
    else if (totalScore >= 800) rank = 'D';
    else rank = 'F';

    // 신화적 업적 달성 검사
    if (totalScore >= 8000) {
      storage.saveUnlockedAchievement('legend_living_myth', char.name, char.year);
    }

    // 짧고 찬란했던 청춘 전사 업적
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
