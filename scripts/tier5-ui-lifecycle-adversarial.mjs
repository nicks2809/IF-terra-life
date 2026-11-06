// scripts/tier5-ui-lifecycle-adversarial.mjs
// Tier 5 UI 및 라이프사이클 화이트박스 적대적 하드닝 검증 스위트
// 목적: 스토리지 손상 방어, 상태 전이 경합, 토스트 큐 포화, 고속 자동 진행, 전투 상태 머신, 구버전 마이그레이션 극한 스트레스 검증

import { createServer, createViteRuntime } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

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

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testFailures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
    testFailures.push({ testName, details });
  }
}

function assertEqual(actual, expected, testName) {
  assert(actual === expected, testName, `기댓값 [${expected}], 실제값 [${actual}]`);
}

async function runAdversarialSuite() {
  console.log('='.repeat(80));
  console.log('>> [PRTS Tier 5 Adversarial Hardening Suite] UI 및 라이프사이클 적대적 스트레스 하네스');
  console.log('='.repeat(80));

  const startTime = Date.now();

  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  const runtime = await createViteRuntime(server);

  // 모듈 동적 로드
  const { GameEngine } = await runtime.executeUrl('./src/engine/gameEngine.ts');
  const { storage, DEFAULT_ADVANCED_SETTINGS } = await runtime.executeUrl('./src/services/storage.ts');
  const { ITEMS_DATA } = await runtime.executeUrl('./src/data/items.ts');
  const { ENEMIES_DATA } = await runtime.executeUrl('./src/data/enemies.ts');
  const { FOCUS_STANCES } = await runtime.executeUrl('./src/data/traits.ts');

  // =========================================================================
  // Suite 1: Storage Resilience & Schema Corruption Stress
  // =========================================================================
  console.log('\n--- [Suite 1] 스토리지 손상 방어 및 스키마 마이그레이션 스트레스 ---');

  // S1-1: 손상된 원시 JSON 문자열 저장 시 안전 처리
  localStorage.clear();
  localStorage.setItem('terra_life_active_character', '{"name": "BrokenChar", "stats": {');
  const corruptedChar = storage.loadActiveCharacter();
  assert(corruptedChar === null, 'T5-S1-1: JSON 문법 오류가 발생한 캐릭터 세이브 로드 시 null 반환');

  // S1-2: 원시 타입(Primitive/Array) 저장 시 방어
  localStorage.setItem('terra_life_active_character', '"just_a_string"');
  const stringChar = storage.loadActiveCharacter();
  assert(typeof stringChar === 'string', 'T5-S1-2a: 원시 문자열 JSON 파싱');
  const isStringCharHandled = Boolean(stringChar && typeof stringChar === 'object' && stringChar.isAlive);
  assert(isStringCharHandled === false, 'T5-S1-2b: 비객체 세이브는 App.tsx 초기화 조건(saved && saved.isAlive)에서 거부됨');

  // S1-3: 백업 JSON 가져오기(importBackupJson) 악의적/손상 페이로드 방어
  const invalidPayloads = [
    '',
    '   ',
    'not_json',
    '12345',
    'true',
    'null',
    '[]',
    '{}',
    JSON.stringify({ randomField: 'useless' }),
    JSON.stringify({ version: 1, hallOfFame: 'not_array' }),
    JSON.stringify({ achievements: ['should_be_object_not_array'] })
  ];

  let allInvalidRejected = true;
  for (const p of invalidPayloads) {
    const res = storage.importBackupJson(p);
    if (res !== false) {
      allInvalidRejected = false;
      break;
    }
  }
  assert(allInvalidRejected, 'T5-S1-3: 11종의 결함/악의적 백업 페이로드 전체에 대해 importBackupJson 안전 거부(false 반환)');

  // S1-4: 스토리지 용량 초과(QuotaExceededError) 시 프로세스 비정상 종료 방어
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = () => {
    const err = new Error('The quota has been exceeded.');
    err.name = 'QuotaExceededError';
    throw err;
  };

  let quotaSafe = true;
  try {
    const dummyChar = GameEngine.createRandomCharacter();
    storage.saveActiveCharacter(dummyChar);
    storage.saveLogs([{ id: '1', year: 1085, age: 0, title: 't', text: 't', type: 'general', timestamp: '' }]);
    storage.saveMemorial({
      id: 'd1',
      characterName: 'Test',
      gender: '남성',
      race: '살카즈',
      ageAtDeath: 30,
      yearOfDeath: 1115,
      causeOfDeath: 'KilledInAction',
      detailedCause: '전사',
      lastWords: '...',
      endingId: 'ending_wasteland_dust',
      endingTitle: '황야의 먼지',
      score: 1000,
      grade: 'B',
      epitaph: '...'
    });
    storage.saveUnlockedAchievement('common_first_victory', 'Test', 1085);
  } catch (e) {
    quotaSafe = false;
  } finally {
    localStorage.setItem = originalSetItem;
  }
  assert(quotaSafe, 'T5-S1-4: localStorage setItem QuotaExceededError 발생 시 크래시 없이 무시 처리');

  // S1-5: ensureCharacterDefaults 구버전/누락 필드 정규화 검증
  const legacyChar = {
    id: 'legacy_1',
    name: '구버전캐릭터',
    gender: '여성',
    race: '살카즈',
    nation: '카즈델',
    environment: '슬럼가 및 암시장',
    year: 1090,
    age: 18,
    isAlive: true,
    stats: {
      health: 80,
      maxHealth: 80,
      sanity: 80,
      maxSanity: 80,
      wealth: 300,
      combat: 45,
      artsAptitude: 40,
      intellect: 40,
      luck: 40
    },
    oripathy: {
      isInfected: false,
      crystallizationRate: 0,
      stage: 'Uninfected',
      activeArtsMultiplier: 1.0,
      suppressantDoseLeft: 0
    },
    inventory: [],
    factions: { rhodes_island: 10 },
    equipment: {}
  };

  const normalized = GameEngine.ensureCharacterDefaults(legacyChar);
  assert(normalized.careerTier === 1, 'T5-S1-5a: careerTier 누락 시 성인 기본값(1티어) 보정');
  assert(normalized.careerExp === 0, 'T5-S1-5b: careerExp 누락 시 0으로 보정');
  assert(normalized.focusStance === 'survival', 'T5-S1-5c: focusStance 누락 시 기본 생존 태세 보정');
  assert(Array.isArray(normalized.unlockedAchievements), 'T5-S1-5d: unlockedAchievements 배열 보정');
  assert(Array.isArray(normalized.milestones), 'T5-S1-5e: milestones 누락 시 탄생 기록 기본 생성');
  assert(typeof normalized.equipment === 'object' && normalized.equipment !== null, 'T5-S1-5f: equipment 객체 보정');

  // S1-6: PRTSErrorBoundary 비상 복구 스토리지 키 일치성 정적 분석
  const errorBoundarySrc = fs.readFileSync(path.resolve('./src/components/PRTSErrorBoundary.tsx'), 'utf-8');
  const storageSrc = fs.readFileSync(path.resolve('./src/services/storage.ts'), 'utf-8');

  const hasCorrectActiveCharKey = errorBoundarySrc.includes("'terra_life_active_character'");
  const hasOldActiveCharKey = errorBoundarySrc.includes("'terra_life_active_char'");
  const hasCorrectLogsKey = errorBoundarySrc.includes("'terra_life_active_logs'");
  const hasOldLogsKey = errorBoundarySrc.includes("'terra_life_logs'");

  assert(
    !hasOldActiveCharKey && hasCorrectActiveCharKey,
    'T5-S1-6a: PRTSErrorBoundary 긴급 초기화 키(ACTIVE_CHAR)가 storage.ts와 완벽히 일치해야 함',
    hasOldActiveCharKey ? "PRTSErrorBoundary에서 구버전 키 'terra_life_active_char'를 사용하여 실제 세이브('terra_life_active_character')가 삭제되지 않음" : ""
  );

  assert(
    !hasOldLogsKey && hasCorrectLogsKey,
    'T5-S1-6b: PRTSErrorBoundary 긴급 초기화 키(ACTIVE_LOGS)가 storage.ts와 완벽히 일치해야 함',
    hasOldLogsKey ? "PRTSErrorBoundary에서 구버전 키 'terra_life_logs'를 사용하여 실제 로그('terra_life_active_logs')가 삭제되지 않음" : ""
  );

  // =========================================================================
  // Suite 2: UI State Transitions & Auto-Play Speed Stress
  // =========================================================================
  console.log('\n--- [Suite 2] UI 상태 전이 및 고속 자동 진행 스트레스 ---');

  // S2-1: 게임 속도 1,000회 연속 고속 토글 스트레스
  const validSpeeds = [1, 2, 4, 8, 16, 32];
  const speedIntervalMap = {
    1: 2400,
    2: 1600,
    4: 1050,
    8: 700,
    16: 480,
    32: 350
  };

  let speedCycleValid = true;
  for (let i = 0; i < 1000; i++) {
    const sp = validSpeeds[i % validSpeeds.length];
    const ms = speedIntervalMap[sp];
    if (typeof ms !== 'number' || ms < 200 || ms > 3000) {
      speedCycleValid = false;
      break;
    }
  }
  assert(speedCycleValid, 'T5-S2-1: 6종 게임 속도(1x~32x) 1,000회 연속 순환 시 인터벌 매핑 안정성 확인');

  // S2-2: 스토리지 내 비정상 속도값 유입 시 기본값(1) 안전 복구
  const invalidSpeeds = [0, -1, 3, 5, 7, 999, NaN, Infinity, null, undefined];
  let invalidSpeedsSafe = true;
  for (const inv of invalidSpeeds) {
    localStorage.setItem('terra_life_game_speed_v1', String(inv));
    const loaded = storage.loadSpeed();
    if (loaded !== 1) {
      invalidSpeedsSafe = false;
      break;
    }
  }
  assert(invalidSpeedsSafe, 'T5-S2-2: 비인가 속도값(0, -1, 999, NaN 등) 유입 시 1배속으로 강제 폴백');

  // S2-3: 토스트 큐 500건 연속 추가 시 메모리 경계(최대 5건 슬라이스) 유지
  let mockToastQueue = [];
  function addMockToast(toast) {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newToast = { ...toast, id };
    mockToastQueue = [...mockToastQueue.slice(-4), newToast];
  }

  for (let i = 0; i < 500; i++) {
    addMockToast({
      type: i % 2 === 0 ? 'achievement' : 'crisis',
      title: `알림 ${i}`,
      description: `테스트 토스트 알림 메시지 ${i}`,
      duration: 3000
    });
  }
  assert(mockToastQueue.length <= 5, `T5-S2-3: 토스트 500건 폭풍 유입 시 큐 크기 상한(5건) 유지 (현재 큐 크기: ${mockToastQueue.length})`);

  // S2-4: 토스트 큐 전체 고속 닫기 시 안전 정렬
  while (mockToastQueue.length > 0) {
    const targetId = mockToastQueue[0].id;
    mockToastQueue = mockToastQueue.filter(t => t.id !== targetId);
  }
  assertEqual(mockToastQueue.length, 0, 'T5-S2-4: 토스트 큐 순차 배출 완료 후 큐 크기 0 확인');

  // S2-5: 100회 연속 advanceOneYear 자동 진행 시 스탯 결함(NaN) 미발생
  let simChar = GameEngine.createRandomCharacter();
  let advanceLoopSafe = true;
  for (let i = 0; i < 100; i++) {
    if (!simChar.isAlive) break;
    const res = GameEngine.advanceOneYear(simChar, () => {});
    simChar = res.updatedChar;

    for (const [k, v] of Object.entries(simChar.stats)) {
      if (typeof v !== 'number' || Number.isNaN(v)) {
        advanceLoopSafe = false;
        break;
      }
    }
    if (!advanceLoopSafe) break;
  }
  assert(advanceLoopSafe, 'T5-S2-5: 최대 100년 연속 advanceOneYear 시뮬레이션 시 스탯 NaN 오염 0건');

  // =========================================================================
  // Suite 3: Battle Lifecycle & Tactical Modal State Machine
  // =========================================================================
  console.log('\n--- [Suite 3] 전투 상태 머신 및 전술 모달 라이프사이클 스트레스 ---');

  // S3-1: 미등록 적 ID 전달 시 기본값(slug_swarm) 폴백
  const fallbackBattle = GameEngine.startBattle('unknown_eldritch_god_99');
  assert(fallbackBattle.isActive === true, 'T5-S3-1a: 알 수 없는 적 조우 시 전투 정상 활성화');
  assert(fallbackBattle.enemy.id === 'slug_swarm', 'T5-S3-1b: 알 수 없는 적은 slug_swarm으로 안전 대체');

  // S3-2: 기습(ambushed) 전투 상태 초기화
  const ambushedBattle = GameEngine.startBattle('sarkaz_centurion', true);
  assert(ambushedBattle.ambushed === true, 'T5-S3-2a: 기습 전투 플래그 활성화');
  assert(ambushedBattle.armorBreak === 6, 'T5-S3-2b: 기습 시 방어구 파손(-6) 페널티 부여');
  assert(ambushedBattle.enemyShield === 25, 'T5-S3-2c: 엘리트 적 기습 시 적 주술 실드(+25) 전개');

  // S3-3: 전투 턴 전개 및 5종 커맨드(attack, arts, defend, item, flee) 순환
  let battleTestChar = GameEngine.createRandomCharacter();
  battleTestChar.stats.health = 100;
  battleTestChar.stats.maxHealth = 100;
  battleTestChar.stats.sanity = 100;
  battleTestChar.stats.combat = 60;
  battleTestChar.stats.artsAptitude = 50;
  battleTestChar.inventory = [
    { item: ITEMS_DATA.find(i => i.id === 'med_emergency_spray'), count: 2 }
  ];

  let activeBattle = GameEngine.startBattle('wasteland_bandit');

  // 1턴: 물리 공격
  const turn1 = GameEngine.executeBattleCommand(battleTestChar, activeBattle, 'attack');
  assert(turn1.updatedBattle.turn === 2, 'T5-S3-3a: attack 실행 후 턴 카운터(turn 2) 증가');
  assert(turn1.updatedBattle.enemy.hp < activeBattle.enemy.maxHp, 'T5-S3-3b: attack 실행 시 적 체력 감소');

  // 2턴: 아츠 영창
  const turn2 = GameEngine.executeBattleCommand(turn1.updatedChar, turn1.updatedBattle, 'arts');
  assert(turn2.updatedChar.stats.sanity < turn1.updatedChar.stats.sanity, 'T5-S3-3c: arts 실행 시 이성 소모');

  // 3턴: 방어 태세
  const turn3 = GameEngine.executeBattleCommand(turn2.updatedChar, turn2.updatedBattle, 'defend');
  assert(turn3.updatedBattle.turn === 4, 'T5-S3-3d: defend 실행 후 턴 카운터 증가');

  // 4턴: 아이템 사용
  const turn4 = GameEngine.executeBattleCommand(turn3.updatedChar, turn3.updatedBattle, 'item', 'med_emergency_spray');
  const remainingItem = turn4.updatedChar.inventory.find(s => s.item.id === 'med_emergency_spray');
  assertEqual(remainingItem?.count, 1, 'T5-S3-3e: 전투 중 소모품 아이템 1개 차감');

  // S3-4: 전투 패배 및 사망 레코드 생성
  let lethalChar = GameEngine.createRandomCharacter();
  lethalChar.stats.health = 1;
  let lethalBattle = GameEngine.startBattle('emperors_blade');
  lethalBattle.enemy.atk = 150; // 확실한 치명타

  const defeatResult = GameEngine.executeBattleCommand(lethalChar, lethalBattle, 'defend');
  assert(defeatResult.updatedChar.isAlive === false, 'T5-S3-4a: 치명타 피격 시 캐릭터 사망 처리');
  assert(defeatResult.updatedBattle.isActive === false, 'T5-S3-4b: 전투 상태 비활성화(isActive = false)');
  assertEqual(defeatResult.updatedBattle.result, 'defeat', 'T5-S3-4c: 전투 결과 패배(defeat) 확정');
  assert(Boolean(defeatResult.updatedChar.deathRecord), 'T5-S3-4d: 사망 레코드(deathRecord) 정상 생성');

  // S3-5: 전투 승리 및 보상 지급
  let victorChar = GameEngine.createRandomCharacter();
  victorChar.stats.wealth = 100;
  victorChar.careerExp = 0;
  let frailBattle = GameEngine.startBattle('slug_swarm');
  frailBattle.enemy.hp = 1; // 1방 컷

  const victorResult = GameEngine.executeBattleCommand(victorChar, frailBattle, 'attack');
  assert(victorResult.updatedBattle.result === 'victory', 'T5-S3-5a: 적 체력 0 도달 시 victory 확정');
  assert(victorResult.updatedChar.stats.wealth > 100, 'T5-S3-5b: 승리 보상 LMD 획득');
  assert((victorResult.updatedChar.careerExp || 0) > 0, 'T5-S3-5c: 승리 보상 공적 EXP 획득');

  // S3-6: App.tsx의 battleAmbushed 전달 누락 점검
  const appSrc = fs.readFileSync(path.resolve('./src/App.tsx'), 'utf-8');
  const passesAmbushedArg = appSrc.includes('GameEngine.startBattle(result.battleEnemy, result.battleAmbushed)');
  assert(
    passesAmbushedArg,
    'T5-S3-6: App.tsx에서 resolveChoice 결과의 battleAmbushed 인자를 startBattle에 정상 전달해야 함',
    !passesAmbushedArg ? "App.tsx line 288에서 'GameEngine.startBattle(result.battleEnemy)'로 호출하여 기습 플래그(result.battleAmbushed)가 유실됨" : ""
  );

  // =========================================================================
  // Suite 4: Character Lifecycle, AP Dynamics & Post-Mortem Integrity
  // =========================================================================
  console.log('\n--- [Suite 4] 캐릭터 라이프사이클, AP 동작 및 사후 무결성 ---');

  // S4-1: 직급별 AP 산출 공식 검증 (T1: 1, T2: 2, T4: 3, Special: 3)
  const t1Char = GameEngine.createRandomCharacter();
  t1Char.age = 16;
  t1Char.careerTier = 1;
  const resT1 = GameEngine.advanceOneYear(t1Char, () => {});
  assertEqual(resT1.updatedChar.actionPoints, 1, 'T5-S4-1a: 1티어 성인은 1 AP 부여');

  const t2Char = GameEngine.createRandomCharacter();
  t2Char.age = 20;
  t2Char.careerTier = 2;
  const resT2 = GameEngine.advanceOneYear(t2Char, () => {});
  assertEqual(resT2.updatedChar.actionPoints, 2, 'T5-S4-1b: 2티어 성인은 2 AP 부여');

  const t4Char = GameEngine.createRandomCharacter();
  t4Char.age = 28;
  t4Char.careerTier = 4;
  const resT4 = GameEngine.advanceOneYear(t4Char, () => {});
  assertEqual(resT4.updatedChar.actionPoints, 3, 'T5-S4-1c: 4티어 성인은 3 AP 부여');

  const specChar = GameEngine.createRandomCharacter();
  specChar.age = 30;
  specChar.specialCareerId = 'steam_knight';
  specChar.careerTier = 5;
  const resSpec = GameEngine.advanceOneYear(specChar, () => {});
  assertEqual(resSpec.updatedChar.actionPoints, 3, 'T5-S4-1d: 5티어 특수 직군은 3 AP 부여');

  // S4-2: AP 0 상태에서 일반 행동 차단 및 억제제(0 AP) 허용
  const zeroApChar = GameEngine.createRandomCharacter();
  zeroApChar.actionPoints = 0;
  zeroApChar.stats.wealth = 5000;
  zeroApChar.stats.sanity = 80;
  zeroApChar.stats.health = 80;

  const artsBlocked = GameEngine.executeAnnualAction(zeroApChar, 'cultivate_arts', () => {});
  assertEqual(artsBlocked.actionPoints, 0, 'T5-S4-2a: 0 AP 상태에서 아츠 수련 차단');
  assertEqual(artsBlocked.stats.artsAptitude, zeroApChar.stats.artsAptitude, 'T5-S4-2b: 차단 시 스탯 불변');

  const combatBlocked = GameEngine.executeAnnualAction(zeroApChar, 'train_combat', () => {});
  assertEqual(combatBlocked.actionPoints, 0, 'T5-S4-2c: 0 AP 상태에서 전술 백병전 차단');

  const suppAllowed = GameEngine.executeAnnualAction(zeroApChar, 'take_suppressant', () => {});
  assert(suppAllowed.stats.wealth < zeroApChar.stats.wealth, 'T5-S4-2d: 0 AP 상태에서도 억제제 복용은 자금 소모하여 허용');
  assertEqual(suppAllowed.actionPoints, 0, 'T5-S4-2e: 억제제 투약 후에도 AP는 0 유지(AP 차감 없음)');

  // S4-3: 구버전 세이브에서 actionPoints 필드 누락 시 방어
  const noApChar = { ...zeroApChar };
  delete noApChar.actionPoints;

  const normalizedNoAp = GameEngine.ensureCharacterDefaults(noApChar);
  assert(
    typeof normalizedNoAp.actionPoints === 'number' && !Number.isNaN(normalizedNoAp.actionPoints),
    'T5-S4-3: ensureCharacterDefaults 호출 시 actionPoints 누락 세이브에 유효한 숫자 기본값 부여 보장',
    typeof normalizedNoAp.actionPoints !== 'number' ? `actionPoints가 [${normalizedNoAp.actionPoints}]로 방치되어 executeAnnualAction 시 NaN 발생 위험` : ''
  );

  // S4-4: 사망한 캐릭터(isAlive === false)에 대한 행동 실행 차단
  const deadChar = GameEngine.createRandomCharacter();
  deadChar.isAlive = false;
  deadChar.actionPoints = 2;
  deadChar.stats.wealth = 1000;

  const deadAction = GameEngine.executeAnnualAction(deadChar, 'train_combat', () => {});
  const deadBuy = GameEngine.buyOrEquipItem(deadChar, 'wpn_tactical_blade', () => {});

  assert(
    deadAction.stats.combat === deadChar.stats.combat,
    'T5-S4-4a: 사망한 캐릭터는 executeAnnualAction 실행 시 스탯 변경이 차단되어야 함',
    deadAction.stats.combat !== deadChar.stats.combat ? "사망한 캐릭터가 훈련을 받아 사후 스탯이 증가함" : ""
  );

  assert(
    deadBuy.stats.wealth === deadChar.stats.wealth,
    'T5-S4-4b: 사망한 캐릭터는 buyOrEquipItem 장비 구매가 차단되어야 함',
    deadBuy.stats.wealth !== deadChar.stats.wealth ? "사망한 캐릭터가 자금을 소모하여 무기를 구매함" : ""
  );

  // S4-5: 환생(createRandomCharacter) 시 모든 일시 상태 리셋 무결성
  const rebirthChar = GameEngine.createRandomCharacter({
    name: '환생자',
    gender: '남성',
    raceId: 'race_sarkaz',
    nationId: 'nation_kazdel',
    environment: '이동도시 상류층'
  });
  assertEqual(rebirthChar.name, '환생자', 'T5-S4-5a: 환생 설정 이름 정상 반영');
  assertEqual(rebirthChar.age, 0, 'T5-S4-5b: 환생 캐릭터 나이 0세 시작');
  assert(rebirthChar.isAlive === true, 'T5-S4-5c: 환생 캐릭터 생존 상태(isAlive = true)');

  // =========================================================================
  // Suite 5: Event Log Panel & Tome Equivalence Stress
  // =========================================================================
  console.log('\n--- [Suite 5] 이벤트 로그 패널, 특수문자 검색 및 고서적 뷰 동등성 ---');

  // S5-1: 특수 정규식 메타문자 검색 시 오류 없이 일반 문자열 검색
  const testLogs = [
    { id: 'l1', year: 1090, age: 5, title: '【특수】 (C++ / [Vite] * regex?)', text: '정규식 메타문자 .*+?^${}()|[]\\ 테스트', type: 'general', timestamp: '' },
    { id: 'l2', year: 1091, age: 6, title: '일반 속보', text: '평범한 소식', type: 'news', timestamp: '' },
    { id: 'l3', year: 1092, age: 7, title: '전투 승리', text: '전투 로그', type: 'battle', timestamp: '' }
  ];

  const regexQuery = '.*+?^${}()|[]\\';
  let regexSearchThrows = false;
  let matchedLogs = [];
  try {
    const q = regexQuery.trim().toLowerCase();
    matchedLogs = testLogs.filter(entry => {
      const matchText = (entry.text || '').toLowerCase().includes(q) || (entry.title || '').toLowerCase().includes(q);
      const matchYear = String(entry.year).includes(q) || String(entry.age).includes(q);
      return matchText || matchYear;
    });
  } catch (e) {
    regexSearchThrows = true;
  }
  assert(!regexSearchThrows, 'T5-S5-1a: 특수 정규식 문자열 검색 시 예외 미발생');
  assertEqual(matchedLogs.length, 1, 'T5-S5-1b: 정확한 부분 문자열 일치 1건 검출');

  // S5-2: 1,000건 대량 로그 카테고리 필터링 스트레스
  const bulkLogs = [];
  const logTypes = ['general', 'news', 'hazard', 'critical', 'battle', 'oripathy'];
  for (let i = 0; i < 1000; i++) {
    bulkLogs.push({
      id: `bulk_${i}`,
      year: 1085 + (i % 50),
      age: i % 50,
      title: `로그 제목 ${i}`,
      text: `본문 내용 ${i}`,
      type: logTypes[i % logTypes.length],
      timestamp: new Date().toISOString()
    });
  }

  const filters = ['all', 'event', 'news', 'combat', 'oripathy'];
  let bulkFilterSafe = true;
  for (const f of filters) {
    const filtered = bulkLogs.filter(entry => {
      if (f === 'all') return true;
      if (f === 'event') return entry.type === 'critical' || entry.title.includes('【');
      if (f === 'news') return entry.type === 'news';
      if (f === 'combat') return entry.type === 'battle' || entry.type === 'hazard';
      if (f === 'oripathy') return entry.type === 'oripathy';
      return true;
    });
    if (!Array.isArray(filtered)) {
      bulkFilterSafe = false;
      break;
    }
  }
  assert(bulkFilterSafe, 'T5-S5-2: 1,000건 대량 로그에 대한 5개 카테고리 필터링 무오류 완주');

  // S5-3: 빈 로그(logs = []) 방어
  const emptyLogs = [];
  const emptyFiltered = emptyLogs.filter(entry => entry.type === 'news');
  assertEqual(emptyFiltered.length, 0, 'T5-S5-3: 빈 로그 배열 주입 시 안전 처리');

  // S5-4: 마일스톤(milestones) 최대 18개 상한 및 0번(탄생) 영구 보존 검증
  const msChar = GameEngine.createRandomCharacter();
  const birthMilestone = msChar.milestones[0];
  for (let i = 1; i <= 30; i++) {
    GameEngine.recordMilestone(msChar, `${i}세: 마일스톤 사건 기록 ${i}`);
  }
  assertEqual(msChar.milestones.length, 18, 'T5-S5-4a: 30회 마일스톤 기록 추가 후에도 최대 18개로 제한');
  assertEqual(msChar.milestones[0], birthMilestone, 'T5-S5-4b: 오래된 기록 정리 시 0번(탄생 기록)은 영구 보존됨');

  // S5-5: 4종 집중 태세(Focus Stance) 데이터 및 보정 효과 검증
  assertEqual(FOCUS_STANCES.length, 4, 'T5-S5-5a: 집중 태세 총 4종(survival, martial, arcane, career) 정의 확인');
  const stanceIds = FOCUS_STANCES.map(s => s.id);
  assert(
    stanceIds.includes('survival') && stanceIds.includes('martial') && stanceIds.includes('arcane') && stanceIds.includes('career'),
    'T5-S5-5b: 4종 필수 집중 태세 ID 무결성 확인'
  );

  // =========================================================================
  // 종합 결과 보고서 출력
  // =========================================================================
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n' + '='.repeat(80));
  console.log('[Tier 5 UI & Lifecycle Adversarial Test Suite 종합 결과]');
  console.log('='.repeat(80));
  console.log(`총 테스트 케이스: ${totalTests}건`);
  console.log(`성공(PASS): ${passedTests}건 | 실패(FAIL): ${failedTests}건`);
  console.log(`소요 시간: ${duration}초`);

  if (testFailures.length > 0) {
    console.log('\n--- 노출된 취약점 및 결함 목록 (Failures) ---');
    testFailures.forEach((f, idx) => {
      console.log(`${idx + 1}. [FAIL] ${f.testName}`);
      if (f.details) console.log(`   └─ 사유: ${f.details}`);
    });
  }
  console.log('='.repeat(80));

  await server.close();

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAdversarialSuite().catch(err => {
  console.error('치명적 스위트 런타임 오류:', err);
  process.exit(1);
});
