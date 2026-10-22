// src/data/events.ts
import { GameEvent } from '../types';

export const GAME_EVENTS: GameEvent[] = [
  // ==========================================
  // 유년기 (0 ~ 14세)
  // ==========================================
  {
    id: 'child_01_birth_mystery',
    title: '출생과 첫 기억',
    description: '황야의 먼지 속에서 혹은 이동도시의 번잡한 기계 소리 속에서 당신의 생애가 시작되었습니다. 부모님은 당신의 가슴에 작은 수호 부적을 쥐여주었습니다.',
    category: 'life',
    minAge: 1,
    maxAge: 4,
    choices: [
      {
        id: 'c01_look_sky',
        label: '호기심 가득 찬 눈으로 하늘을 바라본다',
        description: '테라의 변덕스러운 하늘과 구름을 응시합니다.',
        outcomes: {
          success: {
            text: '어린 시절부터 세상을 향한 호기심과 지혜가 싹텄습니다.',
            statEffects: { intellect: 4, sanity: 5 },
          }
        }
      },
      {
        id: 'c01_grasp_charm',
        label: '부적을 꽉 쥐며 울음을 터뜨린다',
        description: '강인한 생명력으로 거친 환경에 저항합니다.',
        outcomes: {
          success: {
            text: '튼튼한 폐활량과 끈질긴 생명력을 얻었습니다.',
            statEffects: { health: 6, combat: 3 },
          }
        }
      }
    ]
  },
  {
    id: 'child_02_dust_storm',
    title: '오리지늄 분진 폭풍의 내습',
    description: '이동도시 외곽 환기구가 고장 나며 황야의 오리지늄 분진이 주거 구역으로 쏟아져 들어옵니다! 아이들이 기침을 하며 도망칩니다.',
    category: 'oripathy',
    minAge: 5,
    maxAge: 10,
    choices: [
      {
        id: 'c02_wet_cloth',
        label: '물에 적신 헝겊으로 코와 입을 틀어막는다',
        description: '재치 있게 분진 흡입을 최소화합니다.',
        diceCheck: { stat: 'intellect', difficulty: 45 },
        outcomes: {
          criticalSuccess: {
            text: '기민한 대처로 한 톨의 분진도 마시지 않고 어린 이웃까지 구출했습니다! 영웅으로 칭송받습니다.',
            statEffects: { intellect: 6, sanity: 5, wealth: 150 },
            gainTitles: ['영민한 아이']
          },
          success: {
            text: '약간의 기침을 겪었지만 무사히 대피소에 도달하여 감염을 피했습니다.',
            statEffects: { health: -5, sanity: 3 }
          },
          failure: {
            text: '달아나다 넘어져 분진을 들이마셨습니다. 목 안쪽에서 따끔한 통증이 느껴집니다.',
            statEffects: { health: -15, sanity: -10 },
            bloodDensityDelta: 0.05
          },
          criticalFailure: {
            text: '폐 깊숙이 고농도 활성 오리지늄 분진이 흡입되었습니다! 체세포 결정화가 시작되었습니다...',
            statEffects: { health: -20, sanity: -20 },
            crystallizationDelta: 2.5,
            bloodDensityDelta: 0.15
          }
        }
      },
      {
        id: 'c02_sprint',
        label: '전력을 다해 방공호로 질주한다',
        description: '튼튼한 다리로 폭풍을 뚫고 달립니다.',
        diceCheck: { stat: 'combat', difficulty: 50 },
        outcomes: {
          success: {
            text: '바람을 가르며 방공호 철문을 닫아걸었습니다. 폐가 단련된 기분입니다.',
            statEffects: { combat: 5, health: 3 }
          },
          failure: {
            text: '바람에 밀려 무릎이 깨지고 분진을 소량 들이마셨습니다.',
            statEffects: { health: -10, sanity: -5 },
            bloodDensityDelta: 0.03
          }
        }
      }
    ]
  },
  {
    id: 'child_03_black_crystal',
    title: '골목길의 검은 보석',
    description: '어두운 뒷골목 모퉁이에서 묘하게 반짝이는 검고 영롱한 결정 조각을 발견했습니다. 오리지늄 원석 조각입니다.',
    category: 'life',
    minAge: 11,
    maxAge: 14,
    choices: [
      {
        id: 'c03_pawn',
        label: '천으로 정성껏 감싸 암시장 전당포에 내다 판다',
        description: '위험하지만 돈이 되는 물건임을 직감합니다.',
        diceCheck: { stat: 'luck', difficulty: 48 },
        outcomes: {
          criticalSuccess: {
            text: '전당포 주인이 고순도 원석이라며 거액의 LMD를 쳐주었습니다!',
            statEffects: { wealth: 600, intellect: 5 }
          },
          success: {
            text: '약간의 푼돈을 받고 안전하게 처분했습니다.',
            statEffects: { wealth: 200 }
          },
          failure: {
            text: '포장 천이 찢어져 손바닥이 살짝 긁혔습니다. 전당포 주인에게 헐값에 빼앗겼습니다.',
            statEffects: { wealth: 50, health: -5 },
            bloodDensityDelta: 0.02
          }
        }
      },
      {
        id: 'c03_examine',
        label: '아츠 유닛처럼 손에 쥐고 마음을 집중해본다',
        description: '내면의 아츠 적성을 시험해봅니다.',
        diceCheck: { stat: 'artsAptitude', difficulty: 55 },
        outcomes: {
          criticalSuccess: {
            text: '결정체에서 청명한 불꽃이 튀며 숨겨진 아츠 재능이 폭발적으로 각성했습니다!',
            statEffects: { artsAptitude: 15, intellect: 8 },
            gainTitles: ['원석의 감응자']
          },
          success: {
            text: '약간의 열기가 피어오르며 아츠의 기본 감각을 체득했습니다.',
            statEffects: { artsAptitude: 6 }
          },
          failure: {
            text: '아츠 폭주로 작은 폭발이 일어나 손에 화상을 입고 오리지늄 침식을 겪었습니다.',
            statEffects: { health: -12, sanity: -8 },
            crystallizationDelta: 1.0,
            bloodDensityDelta: 0.05
          }
        }
      }
    ]
  },

  // ==========================================
  // 청년기 (15 ~ 29세): 직업 및 진로 분기
  // ==========================================
  {
    id: 'youth_01_career_choice',
    title: '성년의 맹세: 길을 정하다',
    description: '이제 어른의 나이가 되었습니다. 테라의 거친 세계에서 살아남기 위해 당신은 자신의 앞날을 걸 직업과 진영을 결정해야 합니다.',
    category: 'career',
    minAge: 15,
    maxAge: 19,
    choices: [
      {
        id: 'c_rhodes',
        label: '로도스 아일랜드 견습 오퍼레이터에 지원한다',
        description: '감염자 치료와 인류 구원을 목표로 하는 제약 함선에 승선합니다.',
        outcomes: {
          success: {
            text: '로도스 아일랜드의 면접을 통과했습니다! 엄격한 훈련과 함께 정기 억제제 보급 혜택을 받습니다.',
            statEffects: { artsAptitude: 8, sanity: 10, combat: 5 },
            reputationDelta: { '로도스 아일랜드': 35 },
            gainTitles: ['로도스 견습생']
          }
        }
      },
      {
        id: 'c_guard',
        label: '용문 근위국 / 도시 치안대에 입대한다',
        description: '안정적인 봉급과 공권력의 보호 아래 치안을 지킵니다.',
        outcomes: {
          success: {
            text: '정식 제복과 제식 도검을 지급받았습니다. 매달 안정적인 LMD를 벌 수 있게 되었습니다.',
            statEffects: { combat: 10, wealth: 400, health: 10 },
            reputationDelta: { '용문 근위국': 30 },
            gainTitles: ['순찰 경관']
          }
        }
      },
      {
        id: 'c_mercenary',
        label: '카즈델 자유 용병단에 이름을 올린다',
        description: '오직 돈과 실력만을 믿고 테라의 전쟁터를 떠돕니다.',
        outcomes: {
          success: {
            text: '피 묻은 계약서에 서명했습니다. 치열한 전장이 당신의 무력을 빠르게 끌어올립니다.',
            statEffects: { combat: 18, wealth: 800, sanity: -10 },
            reputationDelta: { '자유 용병': 35 },
            gainTitles: ['풋내기 용병']
          }
        }
      },
      {
        id: 'c_knight',
        label: '카시미어 독립 기사로 토너먼트에 도전한다',
        description: '기사 메이저 대회의 화려한 스포트라이트와 명예를 좇습니다.',
        outcomes: {
          success: {
            text: '하급 기사 면허를 취득했습니다. 관중들의 환호와 함께 상업적 스폰서가 붙기 시작합니다.',
            statEffects: { combat: 12, wealth: 600, intellect: 5 },
            reputationDelta: { '카시미어 기사협회': 30 },
            gainTitles: ['독립 기사']
          }
        }
      }
    ]
  },
  {
    id: 'youth_02_chernobog_uprising',
    title: '체르노보그의 붉은 눈물 (1096년 사변)',
    description: '우르수스 체르노보그 전역에 재앙 경보가 울리고, 리유니온 무장 조직이 도시를 장악했습니다! 불길 속에서 비명소리가 가득합니다.',
    category: 'fateful',
    minAge: 16,
    maxAge: 35,
    choices: [
      {
        id: 'c_rescue_refugees',
        label: '불타는 폐허에서 민간인 피난민들을 탈출시킨다',
        description: '위험을 무릅쓰고 대피로를 확보합니다.',
        diceCheck: { stat: 'combat', difficulty: 60 },
        outcomes: {
          criticalSuccess: {
            text: '리유니온 돌격대를 물리치고 수십 명의 피난민을 로도스 함선으로 안전하게 호송했습니다! "체르노보그의 수호자" 칭호 획득!',
            statEffects: { combat: 15, sanity: 15, wealth: 1000 },
            reputationDelta: { '로도스 아일랜드': 40 },
            gainTitles: ['체르노보그의 수호자']
          },
          success: {
            text: '탈출 과정에서 가벼운 부상을 입었지만 가족들을 구출하는 데 성공했습니다.',
            statEffects: { health: -15, sanity: 10, combat: 8 }
          },
          failure: {
            text: '적의 기습을 받아 부상을 입고 간신히 혼자 몸만 빠져나왔습니다...',
            statEffects: { health: -35, sanity: -20 },
            bloodDensityDelta: 0.08
          }
        },
        triggerBattleEnemyId: 'reunion_vanguard'
      },
      {
        id: 'c_loot_vault',
        label: '혼란을 틈타 방치된 귀족 은행 금고를 털어 탈출한다',
        description: '인생역전의 기회를 노립니다.',
        diceCheck: { stat: 'luck', difficulty: 65 },
        outcomes: {
          criticalSuccess: {
            text: '순금괴와 무기명 채권 가방을 확보하여 무사히 국경을 넘었습니다! 돈방석에 앉았습니다.',
            statEffects: { wealth: 5000, luck: 10 },
            gainTitles: ['혼돈의 약탈자']
          },
          success: {
            text: '경비 드론을 피해 상당량의 LMD를 챙겨 달아났습니다.',
            statEffects: { wealth: 1800 }
          },
          failure: {
            text: '금고 경보가 울리며 제국 헌병대와 리유니온 양측의 표적이 되어 거의 죽을 뻔했습니다!',
            statEffects: { health: -40, wealth: 0, sanity: -25 }
          }
        }
      }
    ]
  },
  {
    id: 'youth_03_oripathy_outburst',
    title: '체내 오리지늄의 공명과 고통',
    description: '어느 날 밤, 뼈마디가 타들어가는 극심한 통증과 함께 피부 아래의 검은 결정이 빛을 뿜습니다. 광석병 침식이 심화되고 있습니다.',
    category: 'oripathy',
    minAge: 18,
    maxAge: 40,
    conditions: { isInfected: true },
    choices: [
      {
        id: 'c_inject_suppressant',
        label: '비축해둔 정품 억제제를 망설임 없이 투약한다',
        description: '약효로 고통을 가라앉히고 침식을 억제합니다.',
        outcomes: {
          success: {
            text: '차가운 억제제가 혈관을 타고 흐르며 통증이 진정되었습니다. 결정화 진행이 억제되었습니다.',
            statEffects: { health: 10, sanity: 15 },
            crystallizationDelta: -0.5,
            bloodDensityDelta: -0.05
          }
        }
      },
      {
        id: 'c_channel_pain',
        label: '고통을 정신력으로 억누르고 아츠 영창을 시도한다',
        description: '광석병의 파괴력을 아츠 수련으로 승화시킵니다.',
        diceCheck: { stat: 'sanity', difficulty: 65 },
        outcomes: {
          criticalSuccess: {
            text: '고통 속에서 아츠의 심연을 꿰뚫었습니다! 아츠 위력이 한 차원 높게 진화했습니다.',
            statEffects: { artsAptitude: 22, sanity: -10 },
            crystallizationDelta: 1.2,
            gainTitles: ['고통을 딛는 자']
          },
          success: {
            text: '체포 결정이 안정화되며 아츠 적성이 소폭 상승했습니다.',
            statEffects: { artsAptitude: 10, health: -10 },
            crystallizationDelta: 0.8
          },
          failure: {
            text: '아츠가 역류하여 폐와 흉부에 심각한 내상을 입었습니다!',
            statEffects: { health: -30, sanity: -20 },
            crystallizationDelta: 3.0,
            bloodDensityDelta: 0.12
          }
        }
      }
    ]
  },

  // ==========================================
  // 장년기 (30 ~ 49세): 조직의 핵심과 대위기
  // ==========================================
  {
    id: 'mid_01_londinium_siege',
    title: '런디니움 성벽 아래에서 (1099년)',
    description: '빅토리아 수도 런디니움이 살카즈 군사위원회에 의해 완전 봉쇄되었습니다. 증기기사단의 포효와 비행선들의 폭격이 하늘을 뒤덮습니다.',
    category: 'combat',
    minAge: 30,
    maxAge: 50,
    choices: [
      {
        id: 'c_duel_centurion',
        label: '아군을 엄호하며 살카즈 지휘관과의 결투에 나선다',
        description: '전장의 한복판에서 적의 목을 베어 전황을 뒤집습니다.',
        diceCheck: { stat: 'combat', difficulty: 72 },
        outcomes: {
          criticalSuccess: {
            text: '살카즈 백부장을 단칼에 베어 넘기고 적의 방어선을 궤멸시켰습니다! 제국의 전설이 되었습니다.',
            statEffects: { combat: 20, wealth: 3500, sanity: 20 },
            gainTitles: ['런디니움의 사신']
          },
          success: {
            text: '치열한 격투 끝에 적 지휘관을 퇴각시켰습니다. 온몸에 상처가 가득합니다.',
            statEffects: { health: -30, combat: 10, wealth: 1500 }
          },
          failure: {
            text: '적의 무시무시한 괴력에 방패가 부서지고 중상을 입어 후송되었습니다.',
            statEffects: { health: -55, sanity: -25 }
          }
        },
        triggerBattleEnemyId: 'sarkaz_centurion'
      },
      {
        id: 'c_sabotage_steampipe',
        label: '지하 증기 파이프를 파괴하여 적의 진격을 차단한다',
        description: '지략과 공학 지식을 발휘합니다.',
        diceCheck: { stat: 'intellect', difficulty: 68 },
        outcomes: {
          success: {
            text: '굉음과 함께 고압 증기가 분출되며 살카즈 기갑부대가 고립되었습니다! 퇴각로가 열렸습니다.',
            statEffects: { intellect: 15, wealth: 1200 }
          },
          failure: {
            text: '증기 폭발에 휩쓸려 전신 화상을 입었습니다!',
            statEffects: { health: -40, sanity: -15 }
          }
        }
      }
    ]
  },
  {
    id: 'mid_02_seaborne_whisper',
    title: '이베리아 해안과 바다의 속삭임',
    description: '황량한 해안선 조사 도중, 기괴한 침식 생물 시본(Seaborne) 무리가 바다에서 기어 나옵니다. 머릿속에 수천 마리의 속삭임이 울립니다.',
    category: 'fateful',
    minAge: 30,
    maxAge: 55,
    choices: [
      {
        id: 'c_resist_madness',
        label: '귀를 틀어막고 영창을 외우며 이성을 사수한다',
        description: '심해의 정신 오염에 저항합니다.',
        diceCheck: { stat: 'sanity', difficulty: 75 },
        outcomes: {
          criticalSuccess: {
            text: '바다의 유혹을 완벽히 차단하고 정제된 아츠로 괴수들을 잿더미로 만들었습니다!',
            statEffects: { sanity: 25, artsAptitude: 18 },
            gainTitles: ['심해를 거부한 자']
          },
          success: {
            text: '정신적 충격을 간신히 추스르고 해안 요새로 후퇴했습니다.',
            statEffects: { sanity: -20, combat: 8 }
          },
          failure: {
            text: '속삭임에 뇌신경이 침식되어 극심한 광기 발작을 겪었습니다...',
            statEffects: { sanity: -50, health: -25 }
          }
        },
        triggerBattleEnemyId: 'seaborne_predator'
      }
    ]
  },

  // ==========================================
  // 노년기 (50세 이상): 전설과 황혼
  // ==========================================
  {
    id: 'senior_01_last_stand',
    title: '황혼의 거인: 마지막 대재앙',
    description: '당신의 나이 50을 넘겼습니다. 대다수가 요절하는 테라에서 당신은 살아있는 전설입니다. 거대한 재앙 구름이 당신이 아끼는 정착지를 덮치려 합니다.',
    category: 'fateful',
    minAge: 50,
    maxAge: 100,
    choices: [
      {
        id: 'c_shield_people',
        label: '일생의 모든 아츠와 무력을 짜내어 피난민들을 지킨다',
        description: '후세를 위해 장렬하게 전장에 섭니다.',
        diceCheck: { stat: 'combat', difficulty: 80 },
        outcomes: {
          criticalSuccess: {
            text: '기적과도 같은 활약으로 재앙의 파편들을 전부 쳐내고 사람들을 구했습니다! 온 테라가 당신의 이름을 영원히 기억할 것입니다!',
            statEffects: { sanity: 40, wealth: 10000 },
            gainTitles: ['테라의 수호 성인']
          },
          success: {
            text: '상처투성이가 되었지만 방어선을 끝까지 사수했습니다. 명예로운 승리입니다.',
            statEffects: { health: -40, sanity: 20 },
            gainTitles: ['노익장의 기사']
          },
          failure: {
            text: '한계에 다다른 노쇠한 육신이 무너지며 장렬하게 전사했습니다...',
            deathReason: '재앙 속에서 사람들을 지키다 장렬히 전사'
          }
        }
      },
      {
        id: 'c_peaceful_retirement',
        label: '조용히 짐을 싸 쉐라그의 온천 마을로 은퇴한다',
        description: '이제 검을 내려놓고 평화로운 여생을 보냅니다.',
        outcomes: {
          success: {
            text: '설산의 따뜻한 온천과 맑은 공기 속에서 회고록을 집필하며 평화로운 나날을 보냅니다.',
            statEffects: { sanity: 30, health: 15 },
            gainTitles: ['은퇴한 거장']
          }
        }
      }
    ]
  }
];
