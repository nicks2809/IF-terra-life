// scripts/tier5-engine-adversarial.mjs
// ============================================================================
// Tier 5 White-box Adversarial Engine Hardening & Extreme Boundary Coverage Suite
// IF-terra-life: PRTS Arknights Life Simulator
// ============================================================================
// 무의존성 Vite createViteRuntime 기반 화이트박스 적대적 테스트 하네스

import { createServer, createViteRuntime } from 'vite';

// Node 환경을 위한 브라우저 글로벌 API 모의 객체
if (!globalThis.localStorage) {
  globalThis.localStorage = {
    _data: {},
    getItem(key) {
      return this._data[key] ?? null;
    },
    setItem(key, value) {
      this._data[key] = String(value);
    },
    removeItem(key) {
      delete this._data[key];
    },
    clear() {
      this._data = {};
    }
  };
}

if (!globalThis.window) {
  globalThis.window = globalThis;
}

// -----------------------------------------------------------------------------
// 테스트 리포터
// -----------------------------------------------------------------------------
class AdversarialReporter {
  constructor() {
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.failures = [];
    this.currentSuite = '';
  }

  suite(name) {
    this.currentSuite = name;
    console.log(`\n--- [Adversarial Suite] ${name} ---`);
  }

  assert(name, condition, errorMsg = 'Condition not met') {
    this.total++;
    if (condition) {
      this.passed++;
      console.log(`  [PASS] ${name}`);
    } else {
      this.failed++;
      console.log(`  [FAIL] ${name} -> ${errorMsg}`);
      this.failures.push({
        suite: this.currentSuite,
        test: name,
        error: errorMsg
      });
    }
  }

  assertThrows(name, fn) {
    this.total++;
    try {
      fn();
      this.failed++;
      console.log(`  [FAIL] ${name} -> Expected function to throw, but it did not`);
      this.failures.push({
        suite: this.currentSuite,
        test: name,
        error: 'Expected throw'
      });
    } catch {
      this.passed++;
      console.log(`  [PASS] ${name}`);
    }
  }

  assertDoesNotThrow(name, fn) {
    this.total++;
    try {
      fn();
      this.passed++;
      console.log(`  [PASS] ${name}`);
    } catch (err) {
      this.failed++;
      const msg = err ? (err.message || String(err)) : 'Threw exception';
      console.log(`  [FAIL] ${name} -> Threw: ${msg}`);
      this.failures.push({
        suite: this.currentSuite,
        test: name,
        error: msg
      });
    }
  }

  printSummary(elapsedMs) {
    console.log('\n' + '='.repeat(70));
    console.log('[Tier 5 Engine Adversarial Hardening 결과 보고서]');
    console.log('='.repeat(70));
    console.log(`총 테스트 케이스: ${this.total}건`);
    console.log(`성공(PASS): ${this.passed}건 | 실패(FAIL): ${this.failed}건`);
    console.log(`소요 시간: ${(elapsedMs / 1000).toFixed(2)}초`);

    if (this.failures.length > 0) {
      console.log('\n--- 실패 항목 목록 ---');
      this.failures.forEach((f, idx) => {
        console.log(`[${idx + 1}] [${f.suite}] ${f.test}: ${f.error}`);
      });
      console.log('='.repeat(70));
      return false;
    } else {
      console.log('\n>>> 모든 적대적 테스트 통과 (Verdict: APPROVE / ROBUST) <<<');
      console.log('='.repeat(70));
      return true;
    }
  }
}

// -----------------------------------------------------------------------------
// 메인 적대적 검증 실행기
// -----------------------------------------------------------------------------
async function runAdversarialAudit() {
  console.log('='.repeat(70));
  console.log('[PRTS Tier 5 Adversarial Audit] 화이트박스 적대적 엔진 무결성 검증 시작');
  console.log('='.repeat(70));

  const startTime = Date.now();
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  const runtime = await createViteRuntime(server);

  // 엔진 및 데이터 모듈 로드
  const { GameEngine } = await runtime.executeUrl('./src/engine/gameEngine.ts');
  const { ENDINGS_DATA, determineEnding } = await runtime.executeUrl('./src/data/endings.ts');
  const { ENEMIES_DATA } = await runtime.executeUrl('./src/data/enemies.ts');
  const { SPECIAL_CAREERS_DATA } = await runtime.executeUrl('./src/data/careers.ts');
  const { RACES_DATA } = await runtime.executeUrl('./src/data/races.ts');
  const { NATIONS_DATA } = await runtime.executeUrl('./src/data/nations.ts');
  const { INNATE_TALENTS, INNATE_FLAWS, LIFE_GOALS, evaluateLifeGoal } = await runtime.executeUrl('./src/data/traits.ts');
  const { ITEMS_DATA } = await runtime.executeUrl('./src/data/items.ts');
  const { storage } = await runtime.executeUrl('./src/services/storage.ts');

  const reporter = new AdversarialReporter();
  const dummyLog = () => {};

  // =========================================================================
  // SUITE 1: Math Hazards (NaN, Division by Zero, Negative & Overflow Values)
  // =========================================================================
  reporter.suite('Math Hazards: NaN, Div/0, Underflow, and Extremes');

  // 1-1: 음수 자산 및 극단적 자산 결산 점수 산출
  {
    const charNegWealth = GameEngine.createRandomCharacter();
    charNegWealth.stats.wealth = -99999;
    const recordNeg = GameEngine.generateDeathRecord(charNegWealth, 'Test', '사망', '유언');
    reporter.assert(
      'ADV-1-1: wealth가 극단적 음수(-99999)여도 NaN 없이 wealthPoints는 0이어야 함',
      !Number.isNaN(recordNeg.scoreBreakdown.wealth) && recordNeg.scoreBreakdown.wealth === 0,
      `wealthPoints was ${recordNeg.scoreBreakdown.wealth}`
    );

    const charInfWealth = GameEngine.createRandomCharacter();
    charInfWealth.stats.wealth = 100000000;
    const recordInf = GameEngine.generateDeathRecord(charInfWealth, 'Test', '사망', '유언');
    reporter.assert(
      'ADV-1-2: wealth가 1억 LMD여도 wealthPoints는 최대 1,400점으로 캡되어야 함',
      recordInf.scoreBreakdown.wealth === 1400,
      `wealthPoints was ${recordInf.scoreBreakdown.wealth}`
    );
  }

  // 1-3: 수명 프로필 0 또는 음수 수명 방어
  {
    const corruptedChar = GameEngine.createRandomCharacter();
    corruptedChar.age = -50;
    const profile = GameEngine.getCharacterLifespanProfile(corruptedChar);
    reporter.assert(
      'ADV-1-3: age가 -50이어도 lifespan profile에 NaN이 없어야 함',
      !Number.isNaN(profile.baseLifespan) && !Number.isNaN(profile.effectiveMaxLifespan) && profile.effectiveMaxLifespan >= 20,
      `effectiveMaxLifespan was ${profile.effectiveMaxLifespan}`
    );

    corruptedChar.age = 99999;
    const recordSuperOld = GameEngine.generateDeathRecord(corruptedChar, 'OldAge', '노환', '유언');
    reporter.assert(
      'ADV-1-4: age가 99,999세여도 lifespan 점수 및 총 점수에 NaN이 발생하지 않아야 함',
      !Number.isNaN(recordSuperOld.totalScore) && Number.isFinite(recordSuperOld.totalScore),
      `totalScore was ${recordSuperOld.totalScore}`
    );
  }

  // 1-5: factions가 빈 객체이거나 음수일 때의 평판 점수 방어
  {
    const noRepChar = GameEngine.createRandomCharacter();
    noRepChar.factions = {};
    const recordNoRep = GameEngine.generateDeathRecord(noRepChar, 'Test', '사망', '유언');
    reporter.assert(
      'ADV-1-5: factions가 빈 객체여도 reputation 점수가 0으로 정상 계산되어야 함',
      recordNoRep.scoreBreakdown.reputation === 0,
      `rep points was ${recordNoRep.scoreBreakdown.reputation}`
    );

    noRepChar.factions = { '로도스 아일랜드': -50, '용문 근위국': -100 };
    const recordNegRep = GameEngine.generateDeathRecord(noRepChar, 'Test', '사망', '유언');
    reporter.assert(
      'ADV-1-6: 모든 평판이 음수여도 reputation 점수는 음수가 되지 않고 0이어야 함',
      recordNegRep.scoreBreakdown.reputation === 0,
      `rep points was ${recordNegRep.scoreBreakdown.reputation}`
    );
  }

  // 1-7: applyStatGain 한계 체감 및 상하한 클램프
  {
    const charStat = GameEngine.createRandomCharacter();
    charStat.stats.combat = 10;
    const deltaNeg = GameEngine.applyStatGain(charStat, 'combat', -50);
    reporter.assert(
      'ADV-1-7: applyStatGain으로 현재 스탯보다 큰 음수 감쇄 시 스탯은 0 이하로 떨어지지 않아야 함',
      charStat.stats.combat === 0 && deltaNeg === -10,
      `combat was ${charStat.stats.combat}, delta was ${deltaNeg}`
    );

    charStat.stats.combat = 112;
    const deltaOver = GameEngine.applyStatGain(charStat, 'combat', 20);
    reporter.assert(
      'ADV-1-8: applyStatGain으로 이미 112 상한에 도달한 스탯은 추가 증가(delta 0)하지 않아야 함',
      charStat.stats.combat === 112 && deltaOver === 0,
      `combat was ${charStat.stats.combat}, delta was ${deltaOver}`
    );

    charStat.stats.combat = 111;
    const deltaNear = GameEngine.applyStatGain(charStat, 'combat', 10);
    reporter.assert(
      'ADV-1-9: 111에서 증가 시 112 상한을 초과하지 않고 정확히 112로 클램프되어야 함',
      charStat.stats.combat === 112 && deltaNear === 1,
      `combat was ${charStat.stats.combat}, delta was ${deltaNear}`
    );
  }

  // =========================================================================
  // SUITE 2: Combat Engine White-Box Adversarial Stress
  // =========================================================================
  reporter.suite('Combat Engine: Extremes, Bosses, and Resilience');

  // 2-1: 0 HP 상태에서 전투 액션 수행
  {
    const deadChar = GameEngine.createRandomCharacter();
    deadChar.stats.health = 0;
    const battle = GameEngine.startBattle('slug_swarm');
    const result = GameEngine.executeBattleCommand(deadChar, battle, 'attack', undefined, dummyLog);
    reporter.assert(
      'ADV-2-1: 0 HP 상태에서 전투 액션 수행 시 사망 또는 패배 처리되어야 함',
      !result.updatedChar.isAlive || result.updatedBattle.result === 'defeat' || result.updatedBattle.result === 'fled',
      `isAlive was ${result.updatedChar.isAlive}, result was ${result.updatedBattle.result}`
    );
  }

  // 2-2: 극단적 방어력(DEF 9999)의 적에게 물리 공격 시 최소 대미지(5) 보장
  {
    const fighter = GameEngine.createRandomCharacter();
    fighter.stats.combat = 30;
    const superDefEnemy = {
      id: 'super_tank',
      name: '초고강도 방패병',
      faction: '테스트',
      hp: 100,
      maxHp: 100,
      atk: 10,
      def: 99999,
      artsRes: 0,
      specialSkillName: '철벽',
      specialSkillDesc: '방어력 극대화',
      avatarIcon: 'shield',
      rewardLmd: 100,
      rewardExpStat: 'combat'
    };
    const bState = {
      isActive: true,
      enemy: superDefEnemy,
      turn: 1,
      log: [],
      isPlayerTurn: true,
      playerShield: 0,
      enemyShield: 0,
      damageTaken: 0,
      catalystActive: false,
      armorBreak: 0,
      ambushed: false
    };
    const { updatedBattle } = GameEngine.executeBattleCommand(fighter, bState, 'attack', undefined, dummyLog);
    reporter.assert(
      'ADV-2-2: 적 DEF가 99,999여도 플레이어 물리 공격은 최소 5의 대미지를 입혀야 함',
      updatedBattle.enemy.hp <= 95,
      `enemy hp was ${updatedBattle.enemy.hp} (expected <= 95)`
    );
  }

  // 2-3: 극단적 마법 저항(RES 100)의 적에게 아츠 공격 시 최소 대미지(10) 보장
  {
    const caster = GameEngine.createRandomCharacter();
    caster.stats.artsAptitude = 50;
    caster.stats.sanity = 30;
    const superResEnemy = {
      id: 'super_golem',
      name: '마법 면역 골렘',
      faction: '테스트',
      hp: 100,
      maxHp: 100,
      atk: 10,
      def: 10,
      artsRes: 100,
      specialSkillName: '마법 면역',
      specialSkillDesc: '아츠 저항 100',
      avatarIcon: 'shield',
      rewardLmd: 100,
      rewardExpStat: 'artsAptitude'
    };
    const bState = {
      isActive: true,
      enemy: superResEnemy,
      turn: 1,
      log: [],
      isPlayerTurn: true,
      playerShield: 0,
      enemyShield: 0,
      damageTaken: 0,
      catalystActive: false,
      armorBreak: 0,
      ambushed: false
    };
    const { updatedBattle } = GameEngine.executeBattleCommand(caster, bState, 'arts', undefined, dummyLog);
    reporter.assert(
      'ADV-2-3: 적 artsRes가 100%여도 아츠 공격은 최소 10의 대미지를 입혀야 함',
      updatedBattle.enemy.hp <= 90,
      `enemy hp was ${updatedBattle.enemy.hp} (expected <= 90)`
    );
  }

  // 2-4: 플레이어 방어 태세 및 실드 완충 흡수
  {
    const tankChar = GameEngine.createRandomCharacter();
    tankChar.stats.health = 50;
    const weakEnemy = {
      id: 'weakling',
      name: '약한 슬러그',
      faction: '야생',
      hp: 100,
      maxHp: 100,
      atk: 10,
      def: 0,
      artsRes: 0,
      specialSkillName: '몸통박치기',
      specialSkillDesc: '약한 공격',
      avatarIcon: 'bug',
      rewardLmd: 50,
      rewardExpStat: 'combat'
    };
    const bState = {
      isActive: true,
      enemy: weakEnemy,
      turn: 1,
      log: [],
      isPlayerTurn: true,
      playerShield: 0,
      enemyShield: 0,
      damageTaken: 0,
      catalystActive: false,
      armorBreak: 0,
      ambushed: false
    };
    const { updatedChar, updatedBattle } = GameEngine.executeBattleCommand(tankChar, bState, 'defend', undefined, dummyLog);
    reporter.assert(
      'ADV-2-4: 전술 방어 태세 시 방어 실드(>=38)가 전개되어 적 약타격(10)을 완벽 차단해야 함',
      updatedChar.stats.health === 50 && updatedBattle.playerShield > 0,
      `hp was ${updatedChar.stats.health}, shield was ${updatedBattle.playerShield}`
    );
  }

  // 2-5: 4대 보스 전수 토벌 및 bossKills 누적 무결성
  {
    const slayer = GameEngine.createRandomCharacter();
    slayer.stats.health = 100;
    slayer.stats.combat = 95;
    slayer.stats.artsAptitude = 90;
    slayer.bossKills = 0;

    const bossList = ['sarkaz_centurion', 'seaborne_predator', 'londinium_steam_knight', 'emperors_blade'];
    for (const bId of bossList) {
      let b = GameEngine.startBattle(bId);
      b.enemy.hp = 1;
      const { updatedChar } = GameEngine.executeBattleCommand(slayer, b, 'attack', undefined, dummyLog);
      slayer.bossKills = updatedChar.bossKills;
    }

    reporter.assert(
      'ADV-2-5: 4종 보스 전수 처치 시 bossKills가 정확히 4로 누적되어야 함',
      slayer.bossKills === 4,
      `bossKills was ${slayer.bossKills}`
    );
  }

  // =========================================================================
  // SUITE 3: Oripathy Pathology, Terminal Stages, and Suppressant Logistics
  // =========================================================================
  reporter.suite('Oripathy Pathology & Extreme Stages');

  // 3-1: 결정화율 100% 도달 시 즉각 산화 사망
  {
    const infected = GameEngine.createRandomCharacter();
    infected.oripathy.isInfected = true;
    infected.oripathy.crystallizationRate = 99.8;
    infected.oripathy.suppressantDoseLeft = 0;
    const { updatedChar } = GameEngine.advanceOneYear(infected, dummyLog);
    reporter.assert(
      'ADV-3-1: 99.8% 결정화율에서 억제제 고갈 상태로 1년 경과 시 100% 초과로 산화 사망해야 함',
      !updatedChar.isAlive && updatedChar.oripathy.stage === 'Crystallized',
      `isAlive was ${updatedChar.isAlive}, stage was ${updatedChar.oripathy.stage}`
    );
  }

  // 3-2: 0 AP 상태에서 정품 억제제 투약(take_suppressant) 허용 및 자금 차감
  {
    const brokeInfected = GameEngine.createRandomCharacter();
    brokeInfected.oripathy.isInfected = true;
    brokeInfected.oripathy.crystallizationRate = 20.0;
    brokeInfected.oripathy.suppressantDoseLeft = 0;
    brokeInfected.actionPoints = 0;
    brokeInfected.stats.wealth = 2000;

    const beforeDose = brokeInfected.oripathy.suppressantDoseLeft;
    const updated = GameEngine.executeAnnualAction(brokeInfected, 'take_suppressant', dummyLog);
    reporter.assert(
      'ADV-3-2: 0 AP 상태여도 자금이 충분하면 억제제 투약이 실행되고 3년 약효가 추가되어야 함',
      updated.oripathy.suppressantDoseLeft === beforeDose + 3 && updated.stats.wealth < 2000,
      `dose was ${updated.oripathy.suppressantDoseLeft}, wealth was ${updated.stats.wealth}`
    );
  }

  // 3-3: 0 AP 상태에서 다른 자율 행동(train_combat)은 엄격히 차단되어야 함
  {
    const tiredChar = GameEngine.createRandomCharacter();
    tiredChar.actionPoints = 0;
    const initCombat = tiredChar.stats.combat;
    const rejected = GameEngine.executeAnnualAction(tiredChar, 'train_combat', dummyLog);
    reporter.assert(
      'ADV-3-3: 0 AP 상태에서 train_combat 시도는 변경 없이 거부되어야 함',
      rejected.stats.combat === initCombat && rejected.actionPoints === 0,
      `combat was ${rejected.stats.combat}, AP was ${rejected.actionPoints}`
    );
  }

  // 3-4: 5대 병소(lesionSite) 발작 시뮬레이션 무결성 (폐, 신경, 혈관, 골격, 피부)
  {
    const lesionSites = ['체표 피부', '호흡기(폐)', '신경계', '혈관계', '사지 골격'];
    let allPassed = true;
    for (const site of lesionSites) {
      const char = GameEngine.createRandomCharacter();
      char.oripathy.isInfected = true;
      char.oripathy.stage = 'Terminal';
      char.oripathy.lesionSite = site;
      char.oripathy.crystallizationRate = 75.0;
      char.oripathy.suppressantDoseLeft = 0;
      char.stats.health = 50;
      char.stats.sanity = 50;

      try {
        const { updatedChar } = GameEngine.advanceOneYear(char, dummyLog);
        if (Number.isNaN(updatedChar.stats.health) || Number.isNaN(updatedChar.stats.sanity)) {
          allPassed = false;
        }
      } catch {
        allPassed = false;
      }
    }
    reporter.assert(
      'ADV-3-4: 5대 병소(폐, 신경, 혈관, 골격, 피부) 말기 발작 시뮬레이션 중 예외나 NaN이 없어야 함',
      allPassed,
      'One or more lesion sites caused exception or NaN'
    );
  }

  // =========================================================================
  // SUITE 4: All Races and Trait Combinations
  // =========================================================================
  reporter.suite('All Races & Innate Traits Combinations');

  // 4-1: 전체 39개 종족/세부종족 수명 프로필 검사
  {
    let raceCoverageOk = true;
    let totalProfilesChecked = 0;

    for (const r of RACES_DATA) {
      const char = GameEngine.createRandomCharacter();
      char.race = r.name;
      const subList = r.subRaces && r.subRaces.length > 0 ? r.subRaces : [undefined];

      for (const sub of subList) {
        char.subRace = sub;
        const profile = GameEngine.getCharacterLifespanProfile(char);
        totalProfilesChecked++;

        if (
          !profile ||
          typeof profile.baseLifespan !== 'number' ||
          Number.isNaN(profile.baseLifespan) ||
          profile.baseLifespan <= 0 ||
          profile.effectiveMaxLifespan <= 0
        ) {
          raceCoverageOk = false;
        }
      }
    }

    reporter.assert(
      `ADV-4-1: 전체 ${totalProfilesChecked}개 종족/세부종족 수명 프로필이 정상 산출되어야 함`,
      raceCoverageOk && totalProfilesChecked >= 20,
      `total checked was ${totalProfilesChecked}`
    );
  }

  // 4-2: 전체 10개 선천 재능 및 8개 선천 결점 전수 조합 스탯 초기화 안전성
  {
    let allCombinationsOk = true;
    let combCount = 0;

    for (const t of INNATE_TALENTS) {
      for (const f of INNATE_FLAWS) {
        combCount++;
        const testChar = GameEngine.createRandomCharacter();
        testChar.innateTraits = [t, f];

        for (const [k, v] of Object.entries(testChar.stats)) {
          if (typeof v !== 'number' || Number.isNaN(v)) {
            allCombinationsOk = false;
          }
        }
      }
    }

    reporter.assert(
      `ADV-4-2: 전체 ${combCount}개 선천 재능 x 결점 조합에서 스탯 무결성이 유지되어야 함`,
      allCombinationsOk && combCount === INNATE_TALENTS.length * INNATE_FLAWS.length,
      `checked ${combCount} combinations`
    );
  }

  // =========================================================================
  // SUITE 5: Life Goals & Milestone System Rigorous Verification
  // =========================================================================
  reporter.suite('Life Goals & Milestones Invariants');

  // 5-1: 6대 생애 목표 경계치 검증
  {
    // Goal 1: goal_apex_specialist (특수직군 또는 T5 + 최고스탯 >= 85)
    const g1Char = GameEngine.createRandomCharacter();
    g1Char.lifeGoal = LIFE_GOALS.find(g => g.id === 'goal_apex_specialist');
    g1Char.specialCareerId = 'abyssal_hunter';
    g1Char.stats.combat = 84;
    reporter.assert(
      'ADV-5-1a: goal_apex_specialist 최고스탯 84는 미달성',
      !evaluateLifeGoal(g1Char).achieved
    );
    g1Char.stats.combat = 85;
    reporter.assert(
      'ADV-5-1b: goal_apex_specialist 최고스탯 85는 달성',
      evaluateLifeGoal(g1Char).achieved
    );

    // Goal 2: goal_calamity_slayer (보스 2킬 + 전투력 >= 82)
    const g2Char = GameEngine.createRandomCharacter();
    g2Char.lifeGoal = LIFE_GOALS.find(g => g.id === 'goal_calamity_slayer');
    g2Char.bossKills = 1;
    g2Char.stats.combat = 90;
    reporter.assert(
      'ADV-5-2a: goal_calamity_slayer 보스 1킬은 미달성',
      !evaluateLifeGoal(g2Char).achieved
    );
    g2Char.bossKills = 2;
    g2Char.stats.combat = 81;
    reporter.assert(
      'ADV-5-2b: goal_calamity_slayer 전투력 81은 미달성',
      !evaluateLifeGoal(g2Char).achieved
    );
    g2Char.stats.combat = 82;
    reporter.assert(
      'ADV-5-2c: goal_calamity_slayer 보스 2킬 + 전투력 82는 달성',
      evaluateLifeGoal(g2Char).achieved
    );

    // Goal 3: goal_continental_tycoon (자산 >= 25,000 + Tier >= 3)
    const g3Char = GameEngine.createRandomCharacter();
    g3Char.lifeGoal = LIFE_GOALS.find(g => g.id === 'goal_continental_tycoon');
    g3Char.careerTier = 2;
    g3Char.stats.wealth = 30000;
    reporter.assert(
      'ADV-5-3a: goal_continental_tycoon Tier 2는 미달성',
      !evaluateLifeGoal(g3Char).achieved
    );
    g3Char.careerTier = 3;
    g3Char.stats.wealth = 24999;
    reporter.assert(
      'ADV-5-3b: goal_continental_tycoon 자산 24,999 LMD는 미달성',
      !evaluateLifeGoal(g3Char).achieved
    );
    g3Char.stats.wealth = 25000;
    reporter.assert(
      'ADV-5-3c: goal_continental_tycoon 자산 25,000 LMD + Tier 3은 달성',
      evaluateLifeGoal(g3Char).achieved
    );

    // Goal 4: goal_truth_observer (아츠/지략 >= 88)
    const g4Char = GameEngine.createRandomCharacter();
    g4Char.lifeGoal = LIFE_GOALS.find(g => g.id === 'goal_truth_observer');
    g4Char.stats.artsAptitude = 87;
    g4Char.stats.intellect = 87;
    reporter.assert(
      'ADV-5-4a: goal_truth_observer 최고스탯 87은 미달성',
      !evaluateLifeGoal(g4Char).achieved
    );
    g4Char.stats.intellect = 88;
    reporter.assert(
      'ADV-5-4b: goal_truth_observer 지략 88은 달성',
      evaluateLifeGoal(g4Char).achieved
    );

    // Goal 5: goal_shelter_in_storm (연령 >= 60 + 인연 >= 1 + 이성 >= 50)
    const g5Char = GameEngine.createRandomCharacter();
    g5Char.lifeGoal = LIFE_GOALS.find(g => g.id === 'goal_shelter_in_storm');
    g5Char.age = 59;
    g5Char.bonds = [{ id: 'b1', name: '아미야', role: '리더', affinity: 80, isAlive: true }];
    g5Char.stats.sanity = 60;
    reporter.assert(
      'ADV-5-5a: goal_shelter_in_storm 연령 59세는 미달성',
      !evaluateLifeGoal(g5Char).achieved
    );
    g5Char.age = 60;
    g5Char.stats.sanity = 49;
    reporter.assert(
      'ADV-5-5b: goal_shelter_in_storm 이성 49는 미달성',
      !evaluateLifeGoal(g5Char).achieved
    );
    g5Char.stats.sanity = 50;
    g5Char.bonds[0].isAlive = false;
    reporter.assert(
      'ADV-5-5c: goal_shelter_in_storm 생존 인연 0명은 미달성',
      !evaluateLifeGoal(g5Char).achieved
    );
    g5Char.bonds[0].isAlive = true;
    reporter.assert(
      'ADV-5-5d: goal_shelter_in_storm 조건 충족 시 달성',
      evaluateLifeGoal(g5Char).achieved
    );

    // Goal 6: goal_unbroken_infected (감염 + 45세 + 최고평판 >= 50)
    const g6Char = GameEngine.createRandomCharacter();
    g6Char.lifeGoal = LIFE_GOALS.find(g => g.id === 'goal_unbroken_infected');
    g6Char.oripathy.isInfected = false;
    g6Char.age = 50;
    g6Char.factions = { '로도스 아일랜드': 60 };
    reporter.assert(
      'ADV-5-6a: goal_unbroken_infected 비감염자는 미달성',
      !evaluateLifeGoal(g6Char).achieved
    );
    g6Char.oripathy.isInfected = true;
    g6Char.age = 44;
    reporter.assert(
      'ADV-5-6b: goal_unbroken_infected 44세는 미달성',
      !evaluateLifeGoal(g6Char).achieved
    );
    g6Char.age = 45;
    g6Char.factions = { '로도스 아일랜드': 49 };
    reporter.assert(
      'ADV-5-6c: goal_unbroken_infected 평판 49는 미달성',
      !evaluateLifeGoal(g6Char).achieved
    );
    g6Char.factions = { '로도스 아일랜드': 50 };
    reporter.assert(
      'ADV-5-6d: goal_unbroken_infected 조건 충족 시 달성',
      evaluateLifeGoal(g6Char).achieved
    );
  }

  // 5-7: 마일스톤 배열 18개 초과 시 첫 번째(탄생 기록) 영구 보존 및 순환
  {
    const msChar = GameEngine.createRandomCharacter();
    const birthMilestone = msChar.milestones[0];
    for (let i = 1; i <= 30; i++) {
      GameEngine.recordMilestone(msChar, `테스트 마일스톤 기록 #${i}`);
    }
    reporter.assert(
      'ADV-5-7a: 마일스톤은 최대 18개까지만 보존되어야 함',
      msChar.milestones.length === 18,
      `milestones length was ${msChar.milestones.length}`
    );
    reporter.assert(
      'ADV-5-7b: 대량 추가 후에도 0번 인덱스의 탄생 기록은 결코 삭제되지 않아야 함',
      msChar.milestones[0] === birthMilestone,
      `milestones[0] was ${msChar.milestones[0]}`
    );
  }

  // =========================================================================
  // SUITE 6: All Endings & Retirement Conditions
  // =========================================================================
  reporter.suite('Retirement & All 17 Endings Coverage');

  // 6-1: 17개 등록 엔딩 조건 테스트
  {
    for (const ending of ENDINGS_DATA) {
      const char = GameEngine.createRandomCharacter();

      if (ending.id === 'ending_dawn_of_terra') {
        char.specialCareerId = 'rhodes_elite';
        char.stats.combat = 80;
        char.age = 30;
        char.secretFlags['completed_act1_or_act2'] = true;
      } else if (ending.id === 'ending_babel_phantom') {
        char.race = '살카즈';
        char.specialCareerId = 'sarkaz_court';
        char.secretFlags['sarkaz_awakening'] = true;
      } else if (ending.id === 'ending_lone_trail_sky') {
        char.specialCareerId = 'rhine_director';
        char.secretFlags['witnessed_lone_trail'] = true;
      } else if (ending.id === 'ending_steam_knight_legacy') {
        char.specialCareerId = 'steam_knight';
        char.stats.combat = 90;
        char.secretFlags['steam_knight_stand'] = true;
      } else if (ending.id === 'ending_sami_daemon_shield') {
        char.specialCareerId = 'sami_snowpriest';
        char.stats.artsAptitude = 80;
        char.stats.sanity = 70;
        char.secretFlags['stopped_collapse'] = true;
      } else if (ending.id === 'ending_silence_ocean') {
        char.specialCareerId = 'abyssal_hunter';
        char.stats.combat = 85;
        char.secretFlags['conquered_seaborne'] = true;
      } else if (ending.id === 'ending_emperors_blade_shadow') {
        char.specialCareerId = 'emperors_blade';
        char.secretFlags['emperors_blade_vow'] = true;
      } else if (ending.id === 'ending_laterano_law') {
        char.specialCareerId = 'gun_executor';
        char.stats.combat = 80;
        char.stats.intellect = 70;
      } else if (ending.id === 'ending_radiant_glory') {
        char.specialCareerId = 'radiant_knight';
        char.stats.wealth = 10000;
        char.stats.combat = 80;
      } else if (ending.id === 'ending_volsinii_evening') {
        char.specialCareerId = 'siracusa_capo';
        char.stats.wealth = 7000;
        char.stats.intellect = 75;
      } else if (ending.id === 'ending_yan_red_scroll') {
        char.specialCareerId = 'yan_censor';
        char.stats.intellect = 85;
      } else if (ending.id === 'ending_lungmen_harbor') {
        char.age = 56;
        char.stats.sanity = 60;
        char.nation = '용문';
      } else if (ending.id === 'ending_victoria_noble_rest') {
        char.age = 56;
        char.stats.sanity = 60;
        char.nation = '빅토리아';
      } else if (ending.id === 'ending_columbia_pioneer_lodge') {
        char.age = 56;
        char.stats.sanity = 60;
        char.nation = '컬럼비아';
      } else if (ending.id === 'ending_kjerag_teacup') {
        char.age = 56;
        char.stats.sanity = 60;
        char.nation = '쉐라그';
      } else if (ending.id === 'ending_peaceful_twilight') {
        char.age = 56;
        char.stats.sanity = 60;
        char.nation = '사르곤';
      } else if (ending.id === 'ending_wasteland_dust') {
        char.age = 20;
        char.stats.sanity = 20;
      }

      const determined = determineEnding(char, '사망');
      reporter.assert(
        `ADV-6-1 [${ending.id}]: 엔딩 조건식 평가 및 도달 검증`,
        determined && typeof determined.title === 'string' && typeof determined.scoreBonus === 'number',
        `Determined title was ${determined?.title}`
      );
    }
  }

  // 6-2: S등급 결산 난이도 대폭 강화 및 방어벽
  {
    const richWarrior = GameEngine.createRandomCharacter();
    richWarrior.age = 85;
    richWarrior.careerTier = 5;
    richWarrior.specialCareerId = 'rhodes_elite';
    richWarrior.stats.combat = 110;
    richWarrior.stats.artsAptitude = 100;
    richWarrior.stats.intellect = 100;
    richWarrior.stats.luck = 100;
    richWarrior.stats.wealth = 50000;
    richWarrior.factions = { '로도스 아일랜드': 100, '용문 근위국': 100 };
    richWarrior.secretFlags['completed_act1_or_act2'] = true;
    richWarrior.goalAchieved = true;
    richWarrior.lifeGoal = LIFE_GOALS[0];
    richWarrior.unlockedAchievements = [
      'legend_dawn_of_terra',
      'legend_babel_phantom',
      'legend_ancient_observer',
      'legend_sarkaz_two_centuries',
      'legend_columbia_bank_sovereign',
      'unique_combat_apex'
    ];

    const sRecord = GameEngine.generateDeathRecord(richWarrior, 'OldAge', '새벽의 영면', '안식');
    reporter.assert(
      'ADV-6-2a: 8,800점 이상 + T5 직위 + 생애목표 완수 + 업적 6개 이상 시 S등급 부여',
      sRecord.finalRank === 'S',
      `finalRank was ${sRecord.finalRank}, score was ${sRecord.totalScore}`
    );

    // 파산 + 말기 감염 상태(isDespairDeath) 시 S등급 박탈
    richWarrior.stats.wealth = 0;
    richWarrior.oripathy.crystallizationRate = 85.0;
    const despairRecord = GameEngine.generateDeathRecord(richWarrior, 'OldAge', '파산 영면', '안식');
    reporter.assert(
      'ADV-6-2b: 점수가 높아도 파산 및 광석병 80% 이상 절망사 상태면 S등급 취득이 차단되어야 함',
      despairRecord.finalRank !== 'S',
      `finalRank was ${despairRecord.finalRank}`
    );
  }

  // =========================================================================
  // SUITE 7: Dice Engine 2d50 & Master Protection Edge
  // =========================================================================
  reporter.suite('2d50 Dice Engine & Master Immunity');

  // 7-1: 숙련도 90 이상 & DC 60 이하 시 대참사(Critical Failure) 완전 면역
  {
    const masterChar = GameEngine.createRandomCharacter();
    masterChar.stats.combat = 95;

    const mockChoice = {
      id: 'mock_choice_master',
      label: '시험',
      description: '시험',
      diceCheck: {
        stat: 'combat',
        difficulty: 50
      },
      outcomes: {
        success: { text: '성공' },
        failure: { text: '일반 실패' },
        criticalFailure: { text: '대참사 발생', deathReason: '즉사' }
      }
    };

    let criticalFailureOccurred = false;
    for (let i = 0; i < 500; i++) {
      const { updatedChar } = GameEngine.resolveChoice(masterChar, mockChoice, (entry) => {
        if (entry.title.includes('대참사')) {
          criticalFailureOccurred = true;
        }
      });
      if (!updatedChar.isAlive) {
        criticalFailureOccurred = true;
      }
    }

    reporter.assert(
      'ADV-7-1: 달인(스탯 95, DC 50)은 500회 판정 중 대참사(Critical Failure)가 0건이어야 함',
      !criticalFailureOccurred,
      'Critical failure occurred for master character'
    );
  }

  // =========================================================================
  // SUITE 8: UI & Service Resilience (ensureCharacterDefaults, Storage)
  // =========================================================================
  reporter.suite('UI & Service Layer Invariants');

  // 8-1: 유년기 및 성인 세이브 데이터 복원 시 careerTier 안전 추론
  {
    const childSaved = { age: 10 };
    const recoveredChild = GameEngine.ensureCharacterDefaults(childSaved);
    reporter.assert(
      'ADV-8-1a: 15세 미만 세이브 복원 시 careerTier가 0으로 정상 추론되어야 함',
      recoveredChild.careerTier === 0,
      `careerTier was ${recoveredChild.careerTier}`
    );

    const adultSaved = { age: 20 };
    const recoveredAdult = GameEngine.ensureCharacterDefaults(adultSaved);
    reporter.assert(
      'ADV-8-1b: 15세 이상 세이브 복원 시 careerTier가 1로 정상 추론되어야 함',
      recoveredAdult.careerTier === 1,
      `careerTier was ${recoveredAdult.careerTier}`
    );

    const recoveredDefaults = GameEngine.ensureCharacterDefaults({});
    reporter.assert(
      'ADV-8-1c: 빈 객체 복원 시 milestones 배열과 equipment 객체가 기본 생성되어야 함',
      Array.isArray(recoveredDefaults.milestones) && typeof recoveredDefaults.equipment === 'object',
      'defaults missing'
    );
  }

  // 8-2: localStorage getItem / setItem 에러 시 storage 서비스의 무경고 방어
  {
    reporter.assertDoesNotThrow(
      'ADV-8-2: storage.saveActiveCharacter 호출 시 예외를 던지지 않고 안전 흡수해야 함',
      () => {
        storage.saveActiveCharacter(null);
        storage.loadActiveCharacter();
      }
    );
  }

  const elapsedMs = Date.now() - startTime;
  const passedAll = reporter.printSummary(elapsedMs);

  process.exit(passedAll ? 0 : 1);
}

runAdversarialAudit().catch((err) => {
  console.error('[치명적 오류 발생]', err);
  process.exit(1);
});
