// src/engine/gameEngine.ts
import { 
  Character, 
  CharacterStats, 
  OripathyStatus, 
  OripathyStage, 
  LesionSite, 
  EnvironmentType, 
  LogEntry, 
  GameEvent, 
  EventChoice, 
  BattleState, 
  DeathRecord 
} from '../types';
import { RACES_DATA } from '../data/races';
import { NATIONS_DATA } from '../data/nations';
import { WORLD_TIMELINE } from '../data/timeline';
import { ITEMS_DATA } from '../data/items';
import { ENEMIES_DATA } from '../data/enemies';
import { GAME_EVENTS } from '../data/events';
import { sound } from '../services/sound';

const FIRST_NAMES = [
  '발터', '체이서', '아스트라', '카이사르', '아이린', '실반', '에단', '에리스', 
  '레오', '카밀라', '베라', '마커스', '단테', '클로에', '루카스', '미라', 
  '노아', '엘레나', '펠릭스', '세레나', '빅터', '로웬', '헬레나', '가브리엘'
];

export class GameEngine {
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
    if (environment === '슬럼가 및 암시장' || environment === '황야의 노마드 캠프') baseInfectionChance += 0.15;
    if (race.id === 'aegir') baseInfectionChance = 0.01; // 에기르는 극저확률

    if (Math.random() < baseInfectionChance) {
      initialInfection = true;
    }

    const lesionSites: LesionSite[] = ['체표 피부', '호흡기(폐)', '신경계', '혈관계', '사지 골격'];
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
      isAlive: true
    };
  }

  // 1년 경과 (시간 흐름)
  public static advanceOneYear(
    character: Character, 
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): { updatedChar: Character; triggeredEvent?: GameEvent } {
    const char = { ...character };
    char.age += 1;
    char.year += 1;
    char.actionPoints = char.stats.intellect >= 70 ? 2 : 1;

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
        // 억제제 복용 중: 미세한 침식
        char.oripathy.crystallizationRate = Number((char.oripathy.crystallizationRate + 0.2).toFixed(1));
        addLog({
          year: char.year,
          age: char.age,
          title: '광석병 억제제 약효 유지',
          text: `로도스 억제제 효과로 체세포 결정화 침식이 최소화되었습니다. (현재 결정화율: ${char.oripathy.crystallizationRate}%, 잔여 약효: ${char.oripathy.suppressantDoseLeft}년)`,
          type: 'oripathy'
        });
      } else {
        // 무방비 상태: 결정화율 급증
        const increase = Number((1.2 + Math.random() * 2.2).toFixed(1));
        char.oripathy.crystallizationRate = Number((char.oripathy.crystallizationRate + increase).toFixed(1));
        char.oripathy.originiumBloodDensity = Number((char.oripathy.originiumBloodDensity + 0.02).toFixed(2));
        
        // 이성 소모
        char.stats.sanity = Math.max(0, char.stats.sanity - 4);

        addLog({
          year: char.year,
          age: char.age,
          title: '광석병 체내 침식 진행',
          text: `억제제가 고갈되어 체세포 결정화율이 +${increase}% 증가했습니다. (현재 결정화율: ${char.oripathy.crystallizationRate}%, 혈중 농도: ${char.oripathy.originiumBloodDensity}u/L)`,
          type: 'hazard'
        });
        sound.playHazardAlarm();
      }

      // 병기 판정 및 아츠 증폭 계산
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
      // 비감염자: 자연 감염 확률 체크 (황야/슬럼가는 위험)
      let infectionRoll = Math.random();
      let riskThreshold = 0.02; // 기본 2%
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
      char.stats.sanity = 15; // 최소치로 회복
    }

    // 4. 노환 판정 (65세 이상 매년 생존 주사위)
    if (char.age >= 65) {
      if (Math.random() < (char.age - 60) * 0.06) {
        char.isAlive = false;
        char.deathRecord = this.generateDeathRecord(
          char,
          'OldAge',
          `가혹한 테라에서 ${char.age}세의 나이로 천수를 누리고 영면`,
          '평화롭게 지난 생애의 기억을 회상하며 숨을 거두었습니다.'
        );
        sound.playFlatline();
        return { updatedChar: char };
      }
    }

    // 5. 연령 및 조건에 맞는 이벤트 탐색
    const eligibleEvents = GAME_EVENTS.filter(e => {
      if (char.age < e.minAge || char.age > e.maxAge) return false;
      if (e.conditions?.isInfected !== undefined && e.conditions.isInfected !== char.oripathy.isInfected) return false;
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
    const char = { ...character };

    // 주사위 롤 판정
    if (choice.diceCheck) {
      sound.playDiceRoll();
      const rawRoll = Math.floor(Math.random() * 100) + 1; // 1 ~ 100
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

      // 판정 로그 기록
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

      // 스탯 및 효과 적용
      this.applyOutcomeEffects(char, outcomeData);

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
      // 주사위 없는 일반 선택지
      const outcomeData = choice.outcomes.success;
      sound.playBeep(600, 0.05, 'sine');
      addLog({
        year: char.year,
        age: char.age,
        title: choice.label,
        text: outcomeData.text,
        type: 'general'
      });
      this.applyOutcomeEffects(char, outcomeData);

      return { 
        updatedChar: char, 
        battleEnemy: choice.triggerBattleEnemyId 
      };
    }
  }

  // 효과 반영 보조 함수
  private static applyOutcomeEffects(char: Character, outcome: { 
    statEffects?: Partial<CharacterStats>; 
    crystallizationDelta?: number; 
    bloodDensityDelta?: number; 
    reputationDelta?: Record<string, number>; 
    gainTitles?: string[]; 
  }) {
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
  }

  // 연간 자율 활동 (아츠 수련, 파밍, 의뢰, 치료, 휴양)
  public static executeAnnualAction(
    character: Character,
    actionType: 'cultivate_arts' | 'train_combat' | 'take_suppressant' | 'faction_bounty' | 'recreation',
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  ): Character {
    if (character.actionPoints <= 0) return character;
    const char = { ...character };
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
        // 로도스 억제제 소모
        const slot = char.inventory.find(s => s.item.id === 'med_rhodes_suppressant');
        if (slot && slot.count > 0) {
          slot.count -= 1;
          char.oripathy.suppressantDoseLeft += 3;
          char.oripathy.crystallizationRate = Math.max(0, Number((char.oripathy.crystallizationRate - 0.5).toFixed(1)));
          sound.playSuccess();
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
          char.actionPoints += 1; // 포인트 환불
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
      enemyShield: 0
    };
  }

  // 턴제 전투 액션 실행
  public static executeBattleCommand(
    character: Character,
    battle: BattleState,
    command: 'attack' | 'arts' | 'defend' | 'item' | 'flee',
    itemId?: string
  ): { updatedChar: Character; updatedBattle: BattleState } {
    const char = { ...character };
    const b = { ...battle, log: [...battle.log] };

    if (!b.isActive) return { updatedChar: char, updatedBattle: b };

    // --- 플레이어 턴 ---
    switch (command) {
      case 'attack': {
        sound.playSlash();
        const weaponBonus = char.equipment.weapon?.atkBonus || 0;
        const totalAtk = char.stats.combat + weaponBonus;
        const rawDmg = Math.floor(totalAtk * (0.8 + Math.random() * 0.4));
        const effectiveDmg = Math.max(5, rawDmg - b.enemy.def);
        b.enemy.hp = Math.max(0, b.enemy.hp - effectiveDmg);
        b.log.unshift(`> 당신의 물리 공격! [${b.enemy.name}]에게 ${effectiveDmg}의 물리 피해를 입혔습니다.`);
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
        break;
      }
      case 'defend': {
        sound.playBeep(500, 0.1, 'triangle');
        b.playerShield = 40;
        b.log.unshift(`> 전술 방어 태세를 취했습니다. (방어 실드 40 전개)`);
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
          return { updatedChar: char, updatedBattle: b };
        } else {
          b.log.unshift(`> 탈출 실패! 적의 포위망에 가로막혔습니다.`);
        }
        break;
      }
    }

    // 적 격퇴 확인
    if (b.enemy.hp <= 0) {
      sound.playSuccess();
      b.isActive = false;
      b.result = 'victory';
      char.stats.wealth += b.enemy.rewardLmd;
      char.stats[b.enemy.rewardExpStat] = (char.stats[b.enemy.rewardExpStat] || 0) + 4;
      b.log.unshift(`★ 승리! [${b.enemy.name}]을(를) 물리치고 ${b.enemy.rewardLmd} LMD와 경험치를 획득했습니다!`);
      return { updatedChar: char, updatedBattle: b };
    }

    // --- 적 턴 반격 ---
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
      b.log.unshift(`! [${b.enemy.name}]의 반격! ${netDmg}의 피해를 입었습니다. (잔여 체력: ${char.stats.health})`);
    } else {
      b.log.unshift(`! 적의 공격을 방어 실드로 완벽히 차단했습니다!`);
    }

    // 플레이어 사망 확인
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

  // 최종 사망 기록 생성 (PRTS 바이탈 리포트)
  public static generateDeathRecord(
    char: Character,
    _causeCode: string,
    detailedCause: string,
    lastWords: string
  ): DeathRecord {
    let rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
    const totalScore = char.stats.combat + char.stats.artsAptitude + Math.floor(char.stats.wealth / 100) + char.age * 2;

    if (totalScore >= 350 || char.titles.length >= 4) rank = 'S';
    else if (totalScore >= 250) rank = 'A';
    else if (totalScore >= 180) rank = 'B';
    else if (totalScore >= 120) rank = 'C';
    else if (totalScore >= 70) rank = 'D';
    else rank = 'F';

    return {
      characterName: char.name,
      race: char.race,
      nation: char.nation,
      yearOfDeath: char.year,
      ageAtDeath: char.age,
      cause: detailedCause,
      detailedCause,
      finalRank: rank,
      lastWords,
      notableAchievements: [
        `테라력 ${char.year}년까지 생존 (향년 ${char.age}세)`,
        `최종 직업: ${char.career}`,
        `획득 칭호: ${char.titles.length > 0 ? char.titles.join(', ') : '이름 없는 방랑자'}`,
        `최종 결정화율: ${char.oripathy.crystallizationRate}%`
      ],
      statsSummary: {
        combat: char.stats.combat,
        arts: char.stats.artsAptitude,
        wealth: char.stats.wealth,
        crystallizationRate: char.oripathy.crystallizationRate
      }
    };
  }
}
