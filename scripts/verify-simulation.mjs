// scripts/verify-simulation.mjs
// 무의존성 생애 시뮬레이션 무결성 검증기 (Vite Runtime 기반 50회 연속 생애 시뮬레이션)

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

const TOTAL_RUNS = parseInt(process.env.SIM_RUNS || '50', 10);
const MAX_YEARS_PER_LIFE = 150;

async function runSimulation() {
  console.log('='.repeat(70));
  console.log(`[PRTS Simulation Validator] 생애 시뮬레이션 무결성 검증 시작 (총 ${TOTAL_RUNS}회 생애)`);
  console.log('='.repeat(70));

  const startTime = Date.now();
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  const runtime = await createViteRuntime(server);

  // 엔진 및 데이터 모듈 로드
  const { GameEngine } = await runtime.executeUrl('./src/engine/gameEngine.ts');
  const { determineEnding } = await runtime.executeUrl('./src/data/endings.ts');
  const { ENEMIES_DATA } = await runtime.executeUrl('./src/data/enemies.ts');

  let totalYearsSimulated = 0;
  let totalEventsResolved = 0;
  let totalBattlesFought = 0;
  let totalBattlesWon = 0;
  let totalBattlesLost = 0;
  let statsViolations = 0;
  let maxAge = 0;

  const deathCauses = {};
  const endingDistribution = {};
  const raceCount = {};

  for (let run = 1; run <= TOTAL_RUNS; run++) {
    let char = GameEngine.createRandomCharacter();
    raceCount[char.race] = (raceCount[char.race] || 0) + 1;

    let years = 0;
    const logs = [];
    const addLog = (entry) => {
      logs.push(entry);
    };

    // 캐릭터 생성 초기 스탯 무결성 검증
    for (const [statKey, statVal] of Object.entries(char.stats)) {
      if (typeof statVal !== 'number' || Number.isNaN(statVal)) {
        console.error(`[오류] Run ${run} 초기 스탯 결함: ${statKey} = ${statVal}`);
        statsViolations++;
      }
    }

    let activeBattle = null;

    while (char.isAlive && years < MAX_YEARS_PER_LIFE) {
      years++;
      totalYearsSimulated++;

      // 1년 경과 시뮬레이션
      const advanceResult = GameEngine.advanceOneYear(char, addLog, {
        autoManageApAndShop: true
      });
      char = advanceResult.updatedChar;

      // 스탯 무결성 검증 (NaN, null, undefined 방지)
      for (const [statKey, statVal] of Object.entries(char.stats)) {
        if (typeof statVal !== 'number' || Number.isNaN(statVal) || !Number.isFinite(statVal)) {
          console.error(`[오류] Run ${run} (${char.age}세) 스탯 결함: ${statKey} = ${statVal}`);
          statsViolations++;
        }
      }

      // 광석병 수치 검증
      if (typeof char.oripathy.crystallizationRate !== 'number' || Number.isNaN(char.oripathy.crystallizationRate)) {
        console.error(`[오류] Run ${run} (${char.age}세) 결정화율 결함: ${char.oripathy.crystallizationRate}`);
        statsViolations++;
      }

      // 이벤트 처리
      if (advanceResult.triggeredEvent) {
        totalEventsResolved++;
        const event = advanceResult.triggeredEvent;

        // 적 조우 이벤트인 경우 전투 시작
        const battleEnemy = event.triggerBattleEnemyId || event.choices?.find(c => c.triggerBattleEnemyId)?.triggerBattleEnemyId;
        if (battleEnemy && ENEMIES_DATA[battleEnemy]) {
          activeBattle = GameEngine.startBattle(battleEnemy, false);
          totalBattlesFought++;
        } else if (event.choices && event.choices.length > 0) {
          // 선택지 해결: 가능한 첫 번째 선택지 또는 무작위 선택
          const chosen = event.choices[Math.floor(Math.random() * event.choices.length)];
          const choiceResult = GameEngine.resolveChoice(char, chosen, addLog);
          char = choiceResult.updatedChar;
        }
      }

      // 진행 중인 전투가 있을 경우 턴 해결
      if (activeBattle && activeBattle.isActive) {
        let rounds = 0;
        while (activeBattle.isActive && rounds < 20 && char.isAlive) {
          rounds++;
          // 기본 공격 또는 아츠 공격 실행
          const command = (char.stats.artsAptitude > 40 && char.stats.sanity >= 8) ? 'arts' : 'attack';
          const battleResult = GameEngine.executeBattleCommand(char, activeBattle, command, undefined, addLog);
          char = battleResult.updatedChar;
          activeBattle = battleResult.updatedBattle;

          if (activeBattle.result === 'victory') {
            totalBattlesWon++;
            activeBattle = null;
            break;
          } else if (activeBattle.result === 'defeat') {
            totalBattlesLost++;
            activeBattle = null;
            break;
          } else if (activeBattle.result === 'fled') {
            activeBattle = null;
            break;
          }
        }
      }
    }

    if (char.age > maxAge) {
      maxAge = char.age;
    }

    // 사망 원인 및 엔딩 집계
    const reason = char.deathReason || (years >= MAX_YEARS_PER_LIFE ? '노화 자연사' : '미상');
    deathCauses[reason] = (deathCauses[reason] || 0) + 1;

    let endingId = 'unknown';
    try {
      const ending = determineEnding(char, reason);
      endingId = ending?.id || 'unknown';
    } catch (err) {
      console.error(`[오류] Run ${run} 엔딩 산출 예외:`, err);
      statsViolations++;
    }
    endingDistribution[endingId] = (endingDistribution[endingId] || 0) + 1;

    // 사망 기록 및 점수 검증
    try {
      const deathRecord = char.deathRecord || GameEngine.generateDeathRecord(char, 'OldAge', reason, '안식에 들다.');
      if (typeof deathRecord.totalScore !== 'number' || Number.isNaN(deathRecord.totalScore)) {
        console.error(`[오류] Run ${run} 점수 산출 결함:`, deathRecord);
        statsViolations++;
      }
    } catch (err) {
      console.error(`[오류] Run ${run} 사망 기록 생성 예외:`, err);
      statsViolations++;
    }

    // 주기적 진행 상황 출력 (10회 단위 또는 마지막 회차)
    if (run % 10 === 0 || run === TOTAL_RUNS) {
      console.log(
        `[Run ${String(run).padStart(2, ' ')}/${TOTAL_RUNS}] ` +
        `종족: ${char.race.padEnd(6, ' ')} | ` +
        `생존: ${String(char.age).padStart(3, ' ')}년 | ` +
        `사인: ${reason.slice(0, 16).padEnd(16, ' ')} | ` +
        `엔딩: ${endingId}`
      );
    }
  }

  await server.close();

  const elapsedMs = Date.now() - startTime;
  const avgLifespan = (totalYearsSimulated / TOTAL_RUNS).toFixed(1);

  console.log('\n' + '='.repeat(70));
  console.log('[시뮬레이션 종합 무결성 검증 보고서]');
  console.log('='.repeat(70));
  console.log(`- 총 완료 생애: ${TOTAL_RUNS}회`);
  console.log(`- 총 시뮬레이션 연수: ${totalYearsSimulated}년 (평균 수명: ${avgLifespan}세, 최고령: ${maxAge}세)`);
  console.log(`- 해결된 총 이벤트: ${totalEventsResolved}건`);
  console.log(`- 치러진 총 전투: ${totalBattlesFought}회 (승리: ${totalBattlesWon}, 패배: ${totalBattlesLost})`);
  console.log(`- 수집된 종족 수: ${Object.keys(raceCount).length}종`);
  console.log(`- 도달한 고유 엔딩 수: ${Object.keys(endingDistribution).length}종`);
  console.log(`- 스탯 무결성 결함 (NaN, Infinite, null): ${statsViolations}건`);
  console.log(`- 소요 시간: ${(elapsedMs / 1000).toFixed(2)}초`);
  console.log('='.repeat(70));

  if (statsViolations > 0) {
    console.error(`[검증 실패] ${statsViolations}건의 스탯 무결성 결함이 감지되었습니다.`);
    process.exit(1);
  } else {
    console.log('[검증 성공] 100% 무결성 유지 및 런타임 오류 0건 통과.');
    process.exit(0);
  }
}

runSimulation().catch((err) => {
  console.error('[치명적 오류] 시뮬레이션 실행 중 예외 발생:', err);
  process.exit(1);
});
