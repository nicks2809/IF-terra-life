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
            statEffects: { intellect: 5, sanity: 5 },
            unlockAchievementId: 'common_first_breath'
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
            statEffects: { health: 8, combat: 4 },
            unlockAchievementId: 'common_first_breath'
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
            statEffects: { intellect: 8, sanity: 6, wealth: 180 },
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
            statEffects: { combat: 6, health: 4 }
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
            statEffects: { wealth: 650, intellect: 5 }
          },
          success: {
            text: '약간의 푼돈을 받고 안전하게 처분했습니다.',
            statEffects: { wealth: 250 }
          },
          failure: {
            text: '포장 천이 찢어져 손바닥이 살짝 긁혔습니다. 전당포 주인에게 헐값에 빼앗겼습니다.',
            statEffects: { wealth: 60, health: -5 },
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
            statEffects: { artsAptitude: 16, intellect: 8 },
            gainTitles: ['원석의 감응자']
          },
          success: {
            text: '약간의 열기가 피어오르며 아츠의 기본 감각을 체득했습니다.',
            statEffects: { artsAptitude: 7 }
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
  {
    id: 'child_slug_friend',
    title: '【이스터에그】 야생 오리지늄 슬러그와의 조우',
    description: '환기구 배관 뒤편에서 귀엽게 꿈틀거리는 야생 오리지늄 슬러그 한 마리를 발견했습니다. 블랙스틸의 바닐라 대원이 기를 법한 온순한 눈망울을 하고 있습니다.',
    category: 'life',
    minAge: 8,
    maxAge: 14,
    choices: [
      {
        id: 'c_pet_slug',
        label: '설탕 조각을 건네며 조심스럽게 길들여본다',
        description: '이 무해해 보이는 생물과 교감을 시도합니다.',
        diceCheck: { stat: 'luck', difficulty: 50 },
        outcomes: {
          criticalSuccess: {
            text: '슬러그가 기뻐하며 반짝이는 원석 껍질을 선물로 떨어뜨리고 갔습니다! 이성이 치유되었습니다.',
            statEffects: { sanity: 20, wealth: 300, luck: 6 },
            gainTitles: ['슬러그 조련사']
          },
          success: {
            text: '슬러그가 설탕을 핥아먹고 기분 좋게 배관 속으로 사라졌습니다.',
            statEffects: { sanity: 10 }
          },
          failure: {
            text: '슬러그가 놀라 미약한 산성 점액을 뿜어 옷이 녹아내렸습니다.',
            statEffects: { health: -5, sanity: -5 }
          }
        }
      },
      {
        id: 'c_catch_slug',
        label: '위험 생물체이므로 막대기로 멀리 쫓아낸다',
        description: '오리지늄 생태 위험을 예방합니다.',
        outcomes: {
          success: {
            text: '슬러그를 안전하게 황야 밖으로 몰아냈습니다. 위생 감각이 향상되었습니다.',
            statEffects: { combat: 3, intellect: 2 }
          }
        }
      }
    ]
  },

  // ==========================================
  // 청년기 (15 ~ 29세): 직업 분기 & 원작 메인스 Act 1
  // ==========================================
  {
    id: 'youth_01_career_choice',
    title: '성년의 맹세: 길을 정하다',
    description: '15세 성인이 되었습니다. 테라의 거친 세계에서 살아남기 위해 당신의 앞날을 걸 기본 진로를 결정해야 합니다.',
    category: 'career',
    minAge: 15,
    maxAge: 18,
    choices: [
      {
        id: 'c_rhodes_entry',
        label: '로도스 아일랜드 견습 오퍼레이터에 지원한다',
        description: '감염자 치료와 인류 구원을 목표로 하는 제약 함선에 승선합니다.',
        outcomes: {
          success: {
            text: '로도스 아일랜드의 엄격한 면접과 적성 검사를 통과했습니다! 정기 억제제 보급과 훈련을 받습니다.',
            statEffects: { artsAptitude: 10, sanity: 12, combat: 6 },
            reputationDelta: { '로도스 아일랜드': 35 },
            gainTitles: ['로도스 견습생'],
            unlockAchievementId: 'common_coming_of_age'
          }
        }
      },
      {
        id: 'c_guard_entry',
        label: '도시 치안대 / 용문 근위국에 입대한다',
        description: '공권력의 보호와 안정적인 급여 아래 질서를 수호합니다.',
        outcomes: {
          success: {
            text: '정식 제복과 무기를 지급받았습니다. 안정적인 LMD를 벌기 시작합니다.',
            statEffects: { combat: 12, wealth: 500, health: 10 },
            reputationDelta: { '용문 근위국': 30 },
            gainTitles: ['순찰 경관'],
            unlockAchievementId: 'common_coming_of_age'
          }
        }
      },
      {
        id: 'c_mercenary_entry',
        label: '카즈델 자유 용병단에 이름을 올린다',
        description: '오직 돈과 실력만을 믿고 테라의 전장을 떠돕니다.',
        outcomes: {
          success: {
            text: '피 묻은 계약서에 서명했습니다. 치열한 전장이 당신의 무력을 끌어올립니다.',
            statEffects: { combat: 20, wealth: 900, sanity: -10 },
            reputationDelta: { '자유 용병': 35 },
            gainTitles: ['풋내기 용병'],
            unlockAchievementId: 'common_coming_of_age'
          }
        }
      },
      {
        id: 'c_columbia_pioneer',
        label: '컬럼비아 개척단 및 블랙스틸 인턴 지원',
        description: '신흥 공화국의 기회와 자본주의 최첨단 장비를 좇습니다.',
        outcomes: {
          success: {
            text: '블랙스틸의 기초 전술 사격 과정을 이수했습니다. 현대적인 화기 운용법을 익힙니다.',
            statEffects: { combat: 10, intellect: 10, wealth: 600 },
            reputationDelta: { '블랙스틸': 30 },
            gainTitles: ['개척지 계약병'],
            unlockAchievementId: 'common_coming_of_age'
          }
        }
      }
    ]
  },

  // ----------------------------------------------------
  // 종족 및 국가별 특수 비밀 직업 분기 (Special Lore Careers)
  // ----------------------------------------------------
  {
    id: 'career_special_aegir_abyssal',
    title: '【특수 직군】 에기르의 부름: 어비설 헌터스 개조 제안',
    description: '에기르 출신의 당신에게 심해 기술단이 극비리에 접촉해왔습니다. "육상에 나와 있는 동포여, 해사의 침식에 맞서기 위해 신체를 초월적 전사로 개조하는 수술을 받겠는가?" 치명적인 고통이 따르지만 상상을 초월하는 완력을 얻게 됩니다.',
    category: 'career',
    minAge: 18,
    maxAge: 32,
    conditions: { race: ['에기르'] },
    choices: [
      {
        id: 'c_accept_abyssal_surgery',
        label: '개조 수술을 받아들여 어비설 헌터스로 거듭난다',
        description: '해사의 유전체와 에기르 나노 생체 합성을 견뎌냅니다.',
        diceCheck: { stat: 'combat', difficulty: 70 },
        outcomes: {
          criticalSuccess: {
            text: '기적적인 생체 적합성! 수술대 위에서 각성하여 순수한 어비설 헌터스로 각성했습니다! 완력과 신체 재생력이 인간의 한계를 초월합니다.',
            statEffects: { combat: 35, health: 30, sanity: 20 },
            specialCareerGain: { id: 'abyssal_hunter', name: '어비설 헌터스 (Abyssal Hunter)', rank: '심해의 사냥꾼' },
            gainTitles: ['심해의 은빛 칼날'],
            unlockAchievementId: 'unique_abyssal_hunter'
          },
          success: {
            text: '극심한 발작 끝에 개조 수술을 성공적으로 마쳤습니다. 에기르의 초인적 완력을 손에 넣었습니다.',
            statEffects: { combat: 25, health: 15, sanity: -10 },
            specialCareerGain: { id: 'abyssal_hunter', name: '어비설 헌터스 (Abyssal Hunter)', rank: '견습 사냥꾼' },
            unlockAchievementId: 'unique_abyssal_hunter'
          },
          failure: {
            text: '생체 거부 반응으로 혈관이 파열될 뻔했습니다! 수술은 중단되었고 간신히 목숨만 건졌습니다.',
            statEffects: { health: -40, sanity: -25 }
          }
        }
      },
      {
        id: 'c_refuse_abyssal',
        label: '인간성을 지키기 위해 개조 수술을 정중히 거절한다',
        description: '평범하지만 평온한 삶을 선택합니다.',
        outcomes: {
          success: {
            text: '심해의 기술자들은 아쉬워하며 물러났습니다. 당신은 자신의 신체를 보전했습니다.',
            statEffects: { sanity: 15 }
          }
        }
      }
    ]
  },
  {
    id: 'career_special_sankta_executor',
    title: '【특수 직군】 라테라노 공증소의 칙령: 건 익제큐터 임명',
    description: '라테라노 성도의 제5청 공증소에서 전령이 도착했습니다. 당신의 뛰어난 사격 실력과 성스러운 율법 준수도를 인정하여 수호총 집행관(Executor)으로의 승격을 제안합니다.',
    category: 'career',
    minAge: 18,
    maxAge: 32,
    conditions: { race: ['산크타'] },
    choices: [
      {
        id: 'c_accept_executor',
        label: '교황청 제5청의 집행관 서약을 맹세한다',
        description: '공증소의 제식 흑색 코트와 개조 수호총을 지급받습니다.',
        diceCheck: { stat: 'intellect', difficulty: 60 },
        outcomes: {
          success: {
            text: '성스러운 율법의 이름으로! 라테라노 건 익제큐터로 정식 취임했습니다. 오리지늄 수호총 사격술이 극에 달합니다.',
            statEffects: { combat: 22, intellect: 15, sanity: 15, wealth: 2000 },
            specialCareerGain: { id: 'gun_executor', name: '라테라노 건 익제큐터', rank: '공증소 제5청 집행관' },
            gainTitles: ['율법의 집행자'],
            unlockAchievementId: 'mystic_gun_executor'
          },
          failure: {
            text: '엄격한 율법 필기 시험에서 몇 가지 조항을 혼동하여 보류되었습니다.',
            statEffects: { intellect: 5, sanity: -5 }
          }
        }
      },
      {
        id: 'c_pass_executor',
        label: '공증소의 딱딱한 관료직 대신 자유로운 순찰을 선호한다',
        description: '거리의 자유로운 산크타로 남습니다.',
        outcomes: {
          success: {
            text: '디저트를 즐기며 자유로운 삶을 누립니다.',
            statEffects: { sanity: 10 }
          }
        }
      }
    ]
  },
  {
    id: 'career_special_yan_censorate',
    title: '【특수 직군】 염국 대리(司)의 밀령: 암행 사법 감찰사',
    description: '염국 황제의 직속 사법기관 대리(司)로부터 붉은 밀지가 당도했습니다. "수이(Sui)의 준동을 감시하고, 각 주의 탐관오리를 징벌할 암행 감찰사로 임명하노라."',
    category: 'career',
    minAge: 19,
    maxAge: 35,
    conditions: { nation: ['염국'] },
    choices: [
      {
        id: 'c_accept_yan_censor',
        label: '천하의 법도를 바로세우기 위해 대리의 칙령을 받든다',
        description: '정3품 감찰패와 어사도를 하사받습니다.',
        diceCheck: { stat: 'intellect', difficulty: 68 },
        outcomes: {
          success: {
            text: '황제의 어명을 받들어 염국 대리 사법 감찰관으로 등극했습니다! 수많은 관리들이 당신의 그림자 앞에서도 고개를 숙입니다.',
            statEffects: { intellect: 25, combat: 15, wealth: 3000 },
            specialCareerGain: { id: 'yan_censor', name: '염국 대리 사법 감찰사', rank: '대리 정3품 감찰관' },
            gainTitles: ['염국 대리 사경'],
            unlockAchievementId: 'mystic_yan_high_censor'
          },
          failure: {
            text: '조정의 복잡한 궁중 시험에서 아쉽게 낙방했습니다.',
            statEffects: { intellect: 8, sanity: -10 }
          }
        }
      }
    ]
  },
  {
    id: 'career_special_columbia_rhine',
    title: '【특수 직군】 라인 생명(Rhine Lab) 특수 프로젝트 주임 취임',
    description: '트리몬트의 첨단 생명공학 대기업 라인 랩에서 당신의 연구 성과와 천재적인 감각을 눈여겨보고 총괄 디렉터직을 제안해왔습니다.',
    category: 'career',
    minAge: 20,
    maxAge: 38,
    conditions: { nation: ['컬럼비아'] },
    choices: [
      {
        id: 'c_accept_rhine_director',
        label: '라인 랩의 특수 생체 연구 총괄 디렉터로 부임한다',
        description: '최첨단 연구실과 막대한 연구비를 배정받습니다.',
        diceCheck: { stat: 'intellect', difficulty: 70 },
        outcomes: {
          success: {
            text: '크리스틴 라이트 총괄의 승인을 받아 라인 랩 섹션 디렉터로 임명되었습니다! 천문학적인 연구비와 특허권이 주어집니다.',
            statEffects: { intellect: 28, wealth: 5000, artsAptitude: 15 },
            specialCareerGain: { id: 'rhine_director', name: '라인 랩 총괄 디렉터', rank: '특수 프로젝트 수석 주임' },
            gainTitles: ['라인 랩 주임'],
            unlockAchievementId: 'mystic_rhine_director'
          },
          failure: {
            text: '윤리위원회의 까다로운 청문회 문턱을 넘지 못했습니다.',
            statEffects: { intellect: 10, sanity: -10 }
          }
        }
      }
    ]
  },
  {
    id: 'career_special_victoria_steam',
    title: '【특수 직군】 런디니움의 유산: 빅토리아 증기기사 계승',
    description: '빅토리아의 폐쇄된 지하 격납고에서 잠들어 있던 전설의 고대 증기기사(Steam Knight) 갑주가 당신의 신체 반응에 공명하기 시작합니다!',
    category: 'career',
    minAge: 20,
    maxAge: 40,
    conditions: { nation: ['빅토리아'] },
    choices: [
      {
        id: 'c_awaken_steam_knight',
        label: '증기 코어를 점화하고 거병의 조종간을 쥔다',
        description: '고압 증기와 육중한 강철 프레임에 몸을 싣습니다.',
        diceCheck: { stat: 'combat', difficulty: 75 },
        outcomes: {
          criticalSuccess: {
            text: '굉음과 함께 런디니움의 고대 증기기사가 완벽히 기동했습니다! 당신은 제국의 살아있는 거병이자 증기기사단의 후계자가 되었습니다.',
            statEffects: { combat: 35, health: 30, wealth: 4000 },
            specialCareerGain: { id: 'steam_knight', name: '빅토리아 증기기사', rank: '런디니움 제식 거병' },
            gainTitles: ['증기기사의 후예'],
            unlockAchievementId: 'unique_steam_knight_heart'
          },
          success: {
            text: '증기 압력을 조절하며 갑주 기동에 성공했습니다.',
            statEffects: { combat: 22, health: 18 },
            specialCareerGain: { id: 'steam_knight', name: '빅토리아 증기기사', rank: '예비 기동병' },
            unlockAchievementId: 'unique_steam_knight_heart'
          },
          failure: {
            text: '증기 밸브의 폭주로 전신에 가벼운 화상을 입었습니다.',
            statEffects: { health: -30, sanity: -15 }
          }
        }
      }
    ]
  },
  {
    id: 'career_special_ursus_emperors_blade',
    title: '【특수 직군】 우르수스 황제의 검 (내위) 비밀 결사',
    description: '북방 설원의 눈보라 속에서 검은 안개를 두른 의문의 기사가 나타났습니다. "우르수스의 피가 흐르는 자여, 황제의 국경을 지키는 그림자가 되겠는가?"',
    category: 'career',
    minAge: 20,
    maxAge: 40,
    conditions: { nation: ['우르수스 제국'] },
    choices: [
      {
        id: 'c_accept_emperors_blade',
        label: '극북의 악마 파편을 품고 황제의 검으로 서약한다',
        description: '검은 안개를 다루는 친위 내위의 맹세를 맺습니다.',
        diceCheck: { stat: 'combat', difficulty: 76 },
        outcomes: {
          success: {
            text: '갑주 틈새로 검은 안개가 피어오릅니다. 당신은 황제 직속 내위 "황제의 검"이 되었습니다. 적들은 당신의 그림자만 보아도 얼어붙습니다.',
            statEffects: { combat: 32, intellect: 18, sanity: -15 },
            specialCareerGain: { id: 'emperors_blade', name: '우르수스 황제의 검', rank: '황실 친위 내위' },
            gainTitles: ['검은 안개의 추적자'],
            setSecretFlag: 'emperors_blade_vow',
            unlockAchievementId: 'unique_emperors_blade'
          },
          failure: {
            text: '악마 파편의 오염을 견디지 못하고 정신 붕괴를 겪을 뻔했습니다.',
            statEffects: { health: -45, sanity: -35 }
          }
        }
      }
    ]
  },

  // ----------------------------------------------------
  // 원작 메인스토리 Act 1: 체르노보그 & 리유니온 결전 (1096~1097년)
  // ----------------------------------------------------
  {
    id: 'story_act1_chernobog_core',
    title: '체르노보그 사변: 붉은 불길과 로도스 함선 (1096년)',
    description: '우르수스 체르노보그에 대재앙이 내습하고, 감염자 무장조직 리유니온이 도시를 장악했습니다. 불타는 도심 한복판에서 아미야와 닥터를 호위하는 로도스 아일랜드 소대와 마주쳤습니다!',
    category: 'fateful',
    minAge: 16,
    maxAge: 35,
    choices: [
      {
        id: 'c_act1_cover_rhodes',
        label: '로도스 아일랜드 소대의 퇴각로를 엄호하며 리유니온 돌격대를 요격한다',
        description: '전방에 서서 아미야와 닥터의 탈출로를 확보합니다.',
        diceCheck: { stat: 'combat', difficulty: 60 },
        outcomes: {
          criticalSuccess: {
            text: '완벽한 사격과 검술로 리유니온 전위대를 섬멸했습니다! 아미야가 깊은 감사를 표하며 당신의 이름을 로도스 핵심 동맹으로 등록했습니다.',
            statEffects: { combat: 18, sanity: 15, wealth: 1500 },
            reputationDelta: { '로도스 아일랜드': 45 },
            gainTitles: ['체르노보그의 영웅'],
            setSecretFlag: 'completed_act1_or_act2',
            unlockAchievementId: 'rare_rhodes_specialist'
          },
          success: {
            text: '치열한 교전 끝에 로도스 함선으로 무사히 철수했습니다. 부상을 입었지만 보람찬 승리입니다.',
            statEffects: { health: -20, combat: 10, sanity: 10 },
            reputationDelta: { '로도스 아일랜드': 30 },
            setSecretFlag: 'completed_act1_or_act2'
          },
          failure: {
            text: '리유니온의 맹공에 밀려 부상을 입고 간신히 탈출했습니다.',
            statEffects: { health: -40, sanity: -20 }
          }
        },
        triggerBattleEnemyId: 'reunion_vanguard'
      },
      {
        id: 'c_act1_evacuate_slums',
        label: '불타는 슬럼가에서 고립된 감염자 민간인들을 구출한다',
        description: '지략을 발휘하여 하수도를 통한 탈출로를 엽니다.',
        diceCheck: { stat: 'intellect', difficulty: 58 },
        outcomes: {
          success: {
            text: '수십 명의 어린아이와 노인들을 안전하게 황야 밖으로 피난시켰습니다! 감염자들 사이에서 당신의 인망이 드높아집니다.',
            statEffects: { intellect: 14, sanity: 20, wealth: 800 },
            gainTitles: ['슬럼가의 등불'],
            setSecretFlag: 'completed_act1_or_act2'
          },
          failure: {
            text: '무너지는 건물 더미에 갇혀 큰 부상을 입었습니다.',
            statEffects: { health: -35, sanity: -15 }
          }
        }
      }
    ]
  },
  {
    id: 'story_act1_frostnova_stand',
    title: '【명일방주 메인스】 눈꽃의 비가: 프로스트노바와의 대치',
    description: '체르노보그의 얼어붙은 골목길. 영하 100도의 극한 한기 속에서 리유니온 설괴 소대의 대장 "프로스트노바(FrostNova)"가 검은 결정을 흩날리며 가로막아 섭니다. 그녀의 눈빛에는 슬픔과 결의가 서려 있습니다.',
    category: 'fateful',
    minAge: 17,
    maxAge: 38,
    choices: [
      {
        id: 'c_frostnova_warmth',
        label: '무기를 거두고, 따뜻한 온기와 사탕을 건네며 진심어린 대화를 시도한다',
        description: '적의 대장이 아닌, 대지의 같은 피해자로서 마음을 전합니다.',
        diceCheck: { stat: 'sanity', difficulty: 68 },
        outcomes: {
          criticalSuccess: {
            text: '"...당신의 손이, 참 따뜻하네요. 우리는 단지 살아가고 싶었을 뿐인데..." 프로스트노바의 눈가에 눈물이 맺히며 한기가 사그라듭니다. 그녀는 당신에게 작고 투명한 얼음 결정을 선물했습니다.',
            statEffects: { sanity: 30, artsAptitude: 20, intellect: 15 },
            gainTitles: ['눈꽃의 맹세'],
            unlockAchievementId: 'mystic_frostnova_warmth'
          },
          success: {
            text: '프로스트노바는 말없이 고개를 끄덕이고 설괴 소대와 함께 물러났습니다. 서로의 신념을 확인했습니다.',
            statEffects: { sanity: 15, combat: 5 }
          },
          failure: {
            text: '살을 에는 한기에 손발에 동상을 입고 물러서야 했습니다.',
            statEffects: { health: -30, sanity: -20 }
          }
        }
      },
      {
        id: 'c_frostnova_duel',
        label: '얼음 폭풍을 정면으로 뚫고 아츠 결투를 벌인다',
        description: '극강의 아츠와 무력으로 얼음 장벽을 분쇄합니다.',
        diceCheck: { stat: 'combat', difficulty: 74 },
        outcomes: {
          success: {
            text: '온몸이 얼어붙는 고통 속에서도 검을 휘둘러 빙벽을 돌파했습니다! 설괴 소대가 경의를 표하며 퇴각합니다.',
            statEffects: { combat: 22, health: -25, sanity: 10 },
            gainTitles: ['한파를 벤 자']
          },
          failure: {
            text: '절대영도의 한기에 아츠 회로가 얼어붙으며 치명상을 입었습니다.',
            statEffects: { health: -50, sanity: -30 }
          }
        }
      }
    ]
  },
  {
    id: 'story_act1_patriot_shield',
    title: '【명일방주 메인스】 순국자의 방패: 패트리어트 대면',
    description: '체르노보그 중앙 광장. 전신의 60% 이상이 오리지늄 결정으로 뒤덮인 거인, 테라 최후의 순혈 웬디고 "패트리어트(Patriot)"가 거대한 방패와 할버드를 짚고 우뚝 서 있습니다. 대지가 그의 발걸음마다 진동합니다.',
    category: 'fateful',
    minAge: 18,
    maxAge: 40,
    choices: [
      {
        id: 'c_patriot_respect',
        label: '그의 거룩한 방패 앞에 서서 감염자의 미래와 신념을 떳떳이 밝힌다',
        description: '무력이 아닌 대의와 지혜로 노장군의 인정을 받습니다.',
        diceCheck: { stat: 'intellect', difficulty: 72 },
        outcomes: {
          criticalSuccess: {
            text: '"...너의 눈빛에서, 내가 잃어버린 희망을 본다. 나아가라, 대지의 아이여." 노장군 패트리어트가 길을 열어주며 웬디고의 묵직한 축복을 내렸습니다!',
            statEffects: { intellect: 25, combat: 20, sanity: 25 },
            gainTitles: ['순국자의 후계'],
            unlockAchievementId: 'mystic_patriot_legacy'
          },
          success: {
            text: '노장군은 당신의 기개를 인정하며 방패를 거두었습니다. 잊지 못할 가르침을 얻었습니다.',
            statEffects: { intellect: 15, combat: 10 }
          },
          failure: {
            text: '거인의 위압감 앞에 다리가 풀리며 물러서야 했습니다.',
            statEffects: { sanity: -25 }
          }
        }
      },
      {
        id: 'c_patriot_clash',
        label: '모든 힘을 집중하여 그의 철벽 방패를 시험해본다',
        description: '최강의 전사에게 정면 승부를 신청합니다.',
        diceCheck: { stat: 'combat', difficulty: 82 },
        outcomes: {
          success: {
            text: '당신의 일격이 패트리어트의 방패에 굉음을 일으키며 흠집을 냈습니다! 노장군이 호탕하게 웃으며 당신의 무력을 칭찬했습니다.',
            statEffects: { combat: 30, health: -30, wealth: 2500 },
            gainTitles: ['웬디고의 호적수']
          },
          failure: {
            text: '방패에 튕겨져 나가 전신 타박상을 입었습니다!',
            statEffects: { health: -55, sanity: -20 }
          }
        }
      }
    ]
  },

  // ----------------------------------------------------
  // 이스터에그 이벤트 (독타의 컵라면, 켈시 훈화, 펭귄 로지스틱스)
  // ----------------------------------------------------
  {
    id: 'easter_egg_boiling_ramen',
    title: '【이스터에그】 심야의 로도스 휴게실: 전설의 컵라면',
    description: '새벽 2시, 로도스 아일랜드 휴게실에서 후드를 뒤집어쓴 의문의 지휘관(박사)이 끓는 물을 주전자 없이 입에 직접 붓고 컵라면 면발을 털어 넣는 기이한 광경을 목격했습니다!',
    category: 'life',
    minAge: 16,
    maxAge: 60,
    choices: [
      {
        id: 'c_try_boiling_ramen',
        label: '전설의 닥터식 0초 조리 비법을 따라서 도전해본다',
        description: '끓는 물을 머금고 이성을 시험합니다.',
        diceCheck: { stat: 'luck', difficulty: 55 },
        outcomes: {
          criticalSuccess: {
            text: '성공! 혀끝의 데임 없이 면발이 완벽한 알덴테로 익어 삼켜졌습니다! 이성이 기적처럼 100% 회복되고 신기한 깨달음을 얻었습니다!',
            statEffects: { sanity: 40, health: 10, luck: 10 },
            gainTitles: ['0초 컵라면 마스터'],
            unlockAchievementId: 'rare_boiling_ramen'
          },
          success: {
            text: '약간 혀를 데었지만 맛있는 야식의 온기가 몸을 녹였습니다.',
            statEffects: { sanity: 20, health: -5 }
          },
          failure: {
            text: '뜨거운 물을 뿜어내며 혀에 심한 화상을 입었습니다!',
            statEffects: { health: -20, sanity: -15 }
          }
        }
      },
      {
        id: 'c_pass_ramen',
        label: '정상인답게 포트에 물을 끓여 3분을 기다려 먹는다',
        description: '상식적인 휴식을 취합니다.',
        outcomes: {
          success: {
            text: '따뜻한 라면 국물과 함께 평화로운 휴식을 취했습니다.',
            statEffects: { sanity: 15, health: 5 }
          }
        }
      }
    ]
  },
  {
    id: 'easter_egg_kelseit_lecture',
    title: '【이스터에그】 녹색 링스(켈시)의 30분 긴급 훈화',
    description: '로도스의 의료 총괄 켈시가 다가와 몬3터를 등 뒤에 대기시키며 테라의 지질학적 변천사와 오리지늄의 철학적 당위성에 대해 30분간 난해한 훈화를 시작했습니다.',
    category: 'life',
    minAge: 18,
    maxAge: 70,
    choices: [
      {
        id: 'c_listen_kaltsit',
        label: '단 한 순간도 졸지 않고 초집중하여 훈화를 경청한다',
        description: '심오한 철학과 테라의 비밀을 흡수합니다.',
        diceCheck: { stat: 'intellect', difficulty: 72 },
        outcomes: {
          criticalSuccess: {
            text: '놀랍게도 켈시의 모든 난해한 복합 문장 구조를 완벽히 이해했습니다! 켈시가 희미한 미소를 지으며 특수 정밀 장비를 선물했습니다.',
            statEffects: { intellect: 25, artsAptitude: 15, sanity: 20 },
            gainTitles: ['켈시의 우등생'],
            unlockAchievementId: 'rare_kelseit_listener'
          },
          success: {
            text: '머리에 쥐가 날 뻔했지만 테라의 정세에 대한 귀중한 안목을 넓혔습니다.',
            statEffects: { intellect: 12, sanity: -5 }
          },
          failure: {
            text: '중간에 깜빡 졸다가 몬3터의 날카로운 꼬리에 어깨를 찔려 깜짝 놀랐습니다!',
            statEffects: { sanity: -20, health: -10 }
          }
        }
      }
    ]
  },
  {
    id: 'easter_egg_laterano_pie_event',
    title: '【이스터에그】 라테라노 베이커리의 폭발과 애플파이',
    description: '라테라노 도심을 걷던 중, 유명 제과점에서 쾅! 하는 굉음과 함께 지붕이 날아갔습니다. 폭파 면허를 가진 산크타 제빵사가 환하게 웃으며 날아온 갓 구운 바삭한 애플파이를 당신에게 건넵니다.',
    category: 'life',
    minAge: 15,
    maxAge: 60,
    choices: [
      {
        id: 'c_eat_pie',
        label: '공중에서 회전하며 날아온 애플파이를 멋지게 받아먹는다',
        description: '라테라노의 명물 디저트를 음미합니다.',
        outcomes: {
          success: {
            text: '바삭한 파이 크러스트와 달콤한 사과 잼이 입안 가득 퍼집니다! 이성이 완전히 치유되었습니다.',
            statEffects: { sanity: 25, health: 10, luck: 5 },
            gainTitles: ['애플파이 애식가'],
            unlockAchievementId: 'common_laterano_apple_pie'
          }
        }
      }
    ]
  },

  // ----------------------------------------------------
  // 장년기 (30 ~ 49세): Side Story & 원작 메인스 Act 2
  // ----------------------------------------------------
  {
    id: 'story_side_kazimierz_major',
    title: '【사이드스토리】 제24회 카시미어 기사 메이저 대회 결승전',
    description: '카바레리에키 스타디움의 수만 관중이 함성을 지릅니다! 상업연합회의 어둠을 걷어내고 광휘의 기사로서 챔피언 트로피를 두고 결승전에 출전할 기회가 주어졌습니다.',
    category: 'combat',
    minAge: 25,
    maxAge: 45,
    choices: [
      {
        id: 'c_kazimierz_finals',
        label: '황금빛 랜스를 들고 결승 투기장에 올라 영예로운 결투를 벌인다',
        description: '관중들의 환호 속에 챔피언의 자리를 쟁취합니다.',
        diceCheck: { stat: 'combat', difficulty: 75 },
        outcomes: {
          criticalSuccess: {
            text: '상대 기사의 방패를 일격에 분쇄하고 챔피언에 등극했습니다! 수만 관중이 당신의 이름을 연호하며 거액의 우승 상금이 쏟아집니다!',
            statEffects: { combat: 25, wealth: 12000, sanity: 25 },
            gainTitles: ['메이저 챔피언'],
            unlockAchievementId: 'mystic_radiant_champion'
          },
          success: {
            text: '치열한 연장전 끝에 판정승을 거두었습니다! 우승 상금과 명성을 획득했습니다.',
            statEffects: { combat: 15, wealth: 5000, health: -20 },
            gainTitles: ['영광의 기사']
          },
          failure: {
            text: '상대의 기습적인 아츠 랜스에 밀려 아쉽게 준우승에 머물렀습니다.',
            statEffects: { health: -35, wealth: 1500, sanity: -15 }
          }
        }
      },
      {
        id: 'c_kazimierz_gamble',
        label: '지략을 발휘하여 상업연합회의 배팅 장부를 분석하고 거액을 베팅한다',
        description: '경기 결과에 지략을 걸어 금융 수익을 노립니다.',
        diceCheck: { stat: 'intellect', difficulty: 70 },
        outcomes: {
          success: {
            text: '완벽한 확률 계산으로 배당금 잭팟을 터뜨렸습니다!',
            statEffects: { wealth: 8000, intellect: 15 }
          },
          failure: {
            text: '승부조작에 휘말려 베팅금을 잃었습니다.',
            statEffects: { wealth: -2000, sanity: -15 }
          }
        }
      }
    ]
  },
  {
    id: 'story_side_stultifera_navis',
    title: '【사이드스토리】 스툴티페라 나비스: 심해의 해사와 대침묵',
    description: '이베리아 해안가에 수백 년간 실종되었던 황금 함선 스툴티페라 나비스가 나타났습니다. 바다 밑바닥에서 끝없이 증식하는 기괴한 침식체 "해사(Seaborne)" 무리가 쏟아져 나옵니다!',
    category: 'fateful',
    minAge: 25,
    maxAge: 50,
    choices: [
      {
        id: 'c_fight_seaborne_horde',
        label: '심해의 은빛 칼날을 휘두르며 해사의 군체 심장부로 돌진한다',
        description: '신경 오염을 억누르고 바다의 괴수들을 도륙합니다.',
        diceCheck: { stat: 'combat', difficulty: 80 },
        outcomes: {
          criticalSuccess: {
            text: '칼날이 허공을 가를 때마다 수십 마리의 해사가 산산조각 났습니다! 심해의 속삭임은 당신의 강철 같은 의지 앞에 침묵했습니다.',
            statEffects: { combat: 30, sanity: 25, wealth: 6000 },
            gainTitles: ['심해의 침묵자'],
            setSecretFlag: 'conquered_seaborne',
            unlockAchievementId: 'unique_abyssal_hunter'
          },
          success: {
            text: '치열한 사투 끝에 해사 무리를 물리치고 등대를 지켜냈습니다.',
            statEffects: { combat: 18, health: -30, sanity: -15 },
            setSecretFlag: 'conquered_seaborne'
          },
          failure: {
            text: '해사의 신경독에 노출되어 극심한 환각과 발작을 겪었습니다!',
            statEffects: { health: -50, sanity: -40 }
          }
        },
        triggerBattleEnemyId: 'seaborne_predator'
      },
      {
        id: 'c_rekindle_lighthouse',
        label: '재판관의 랜턴을 밝히고 고대 등대의 오리지늄 렌즈를 재점화한다',
        description: '빛으로 바다의 어둠을 몰아내고 해사들을 쫓아냅니다.',
        diceCheck: { stat: 'artsAptitude', difficulty: 75 },
        outcomes: {
          success: {
            text: '눈부신 황금빛 등대 광선이 밤바다를 갈랐습니다! 해사들이 비명을 지르며 심해로 도주했습니다.',
            statEffects: { artsAptitude: 22, sanity: 20 },
            setSecretFlag: 'conquered_seaborne'
          },
          failure: {
            text: '렌즈 과열로 폭발이 일어나 부상을 입었습니다.',
            statEffects: { health: -35, sanity: -15 }
          }
        }
      }
    ]
  },
  {
    id: 'story_columbia_lone_trail',
    title: '【사이드스토리】 론 트레일(Lone Trail): 거짓된 하늘을 뚫는 별',
    description: '트리몬트 상공. 라인 랩 총괄 크리스틴 라이트가 거대한 에너지 빔으로 테라를 둘러싼 "가짜 천공"을 뚫는 로켓 발사를 감행했습니다! 컬럼비아 국방부와 군벌들이 요격을 시도합니다.',
    category: 'fateful',
    minAge: 28,
    maxAge: 52,
    choices: [
      {
        id: 'c_lone_trail_sky',
        label: '크리스틴의 발사 관제탑을 지키고, 테라 너머의 우주를 함께 관측한다',
        description: '지략과 모든 지식을 동원하여 로켓 발사 궤적을 사수합니다.',
        diceCheck: { stat: 'intellect', difficulty: 82 },
        outcomes: {
          criticalSuccess: {
            text: '푸른 천공에 거대한 구멍이 뚫리고... 은하와 수억 개의 별들이 모습을 드러냈습니다! 고대 인류 보존자 트레버 프리스톤의 홀로그램이 당신에게 고대의 비밀을 전송했습니다!',
            statEffects: { intellect: 35, sanity: 30, wealth: 10000 },
            gainTitles: ['별을 올려다본 자'],
            setSecretFlag: 'witnessed_lone_trail',
            unlockAchievementId: 'unique_lone_trail_sky'
          },
          success: {
            text: '발사는 성공했습니다. 당신은 대지 너머에 진정한 하늘이 존재함을 눈으로 목격했습니다.',
            statEffects: { intellect: 20, sanity: 15 },
            setSecretFlag: 'witnessed_lone_trail'
          },
          failure: {
            text: '국방부 공습에 휘말려 관제탑 파편에 부상을 입었습니다.',
            statEffects: { health: -40, sanity: -20 }
          }
        }
      }
    ]
  },
  {
    id: 'story_act2_londinium_siege',
    title: '【명일방주 메인스】 런디니움 결전: 살카즈 군사위원회와 증기기사 (1099년)',
    description: '빅토리아 수도 런디니움이 살카즈 군사위원회 테레시스의 군세에 포위되었습니다. 공중 비행선들이 포탄을 쏟아붓고, 런디니움 성벽 아래에서 자치단과 로도스 아일랜드가 최후의 방어전을 펼치고 있습니다.',
    category: 'fateful',
    minAge: 25,
    maxAge: 55,
    choices: [
      {
        id: 'c_londinium_wall_defense',
        label: '아군을 엄호하며 살카즈 군사위원회 백부장과 결전을 벌인다',
        description: '런디니움의 방어선을 끝까지 사수합니다.',
        diceCheck: { stat: 'combat', difficulty: 78 },
        outcomes: {
          criticalSuccess: {
            text: '살카즈 백부장을 단칼에 베어 넘기고 성벽의 적 기갑선을 격침시켰습니다! 런디니움의 구원자로 칭송받습니다.',
            statEffects: { combat: 25, wealth: 8000, sanity: 20 },
            gainTitles: ['런디니움의 구원자'],
            setSecretFlag: 'steam_knight_stand',
            setSecretFlag2: 'completed_act1_or_act2',
            unlockAchievementId: 'unique_steam_knight_heart'
          },
          success: {
            text: '격렬한 포화 속에서 시민들의 대피로를 확보했습니다.',
            statEffects: { combat: 15, health: -35, wealth: 3000 },
            setSecretFlag: 'completed_act1_or_act2'
          },
          failure: {
            text: '비행선 포격에 직격당해 중상을 입고 후송되었습니다.',
            statEffects: { health: -60, sanity: -30 }
          }
        },
        triggerBattleEnemyId: 'sarkaz_centurion'
      },
      {
        id: 'c_londinium_steam_overdrive',
        label: '고대 증기기사의 망치를 풀 파워로 가동하여 적의 비행선을 분쇄한다',
        description: '빅토리아 증기 공학의 정점을 보여줍니다.',
        diceCheck: { stat: 'combat', difficulty: 84 },
        outcomes: {
          success: {
            text: '고압 증기 폭풍이 전장을 휩쓸며 적 비행선이 화염에 휩싸여 추락했습니다! 제국의 전설이 되었습니다.',
            statEffects: { combat: 30, health: -20, wealth: 10000 },
            gainTitles: ['강철의 수호기사'],
            setSecretFlag: 'steam_knight_stand'
          },
          failure: {
            text: '증기 기관이 과열되어 폭발했습니다!',
            statEffects: { health: -50, sanity: -25 }
          }
        }
      }
    ]
  },
  {
    id: 'story_sami_collapse',
    title: '【명일방주】 극북 사미의 붕괴체 남하 방어전 (1102년)',
    description: '극북 사미의 만년설 너머에서 형체 없는 검은 악마, "붕괴체(Collapse)" 무리가 쏟아져 내려오고 있습니다. 테라 대륙 전체의 생존이 걸린 극북 결계선에서 부족 사제들과 함께 최후의 저항선에 섭니다.',
    category: 'fateful',
    minAge: 30,
    maxAge: 60,
    choices: [
      {
        id: 'c_stand_against_collapse',
        label: '아츠와 혼신의 무력으로 결계를 수호하며 붕괴체의 본대를 격퇴한다',
        description: '대륙의 북쪽 국경을 수호합니다.',
        diceCheck: { stat: 'artsAptitude', difficulty: 80 },
        outcomes: {
          criticalSuccess: {
            text: '성림의 영령들과 공명하여 거대한 빛의 결계를 완성했습니다! 붕괴체 무리가 정화되어 소멸했습니다. 테라는 구원받았습니다.',
            statEffects: { artsAptitude: 30, combat: 20, sanity: 30 },
            gainTitles: ['극북의 결계사'],
            setSecretFlag: 'stopped_collapse',
            unlockAchievementId: 'unique_sami_daemon_slayer'
          },
          success: {
            text: '피를 흘리며 결계선을 사수했습니다. 붕괴체의 남하가 멈췄습니다.',
            statEffects: { artsAptitude: 18, health: -40, sanity: -20 },
            setSecretFlag: 'stopped_collapse'
          },
          failure: {
            text: '붕괴체의 정신 오염 파동에 노출되어 영구적인 내상을 입었습니다.',
            statEffects: { health: -55, sanity: -45 }
          }
        }
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
            statEffects: { sanity: 40, wealth: 15000 },
            gainTitles: ['테라의 수호 성인'],
            unlockAchievementId: 'legend_living_myth'
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
  },
  {
    id: 'senior_sarkaz_babel_calling',
    title: '【살카즈 비원】 바벨의 흑관과 마왕의 유산',
    description: '황혼의 나이에 다다른 살카즈인 당신. 핏줄 속에서 카즈델의 원초적 아츠가 고동치며 먼 옛날 바벨 함선의 검은 관(Black Coffin)과 테레시아의 노래가 귓가에 울려 퍼집니다.',
    category: 'fateful',
    minAge: 50,
    maxAge: 999,
    conditions: { race: ['살카즈'] },
    choices: [
      {
        id: 'c_accept_sarkaz_awakening',
        label: '마왕의 부름에 화답하여 살카즈 민족의 비원을 가슴에 품는다',
        description: '카즈델의 역사와 마족의 유산을 영혼에 아로새깁니다.',
        diceCheck: { stat: 'artsAptitude', difficulty: 82 },
        outcomes: {
          criticalSuccess: {
            text: '흑관의 파편이 공명하며 고대 마왕의 원초적 영창이 영혼에 깃들었습니다! 당신은 바벨의 살아있는 전설이 되었습니다.',
            statEffects: { artsAptitude: 35, sanity: 30 },
            gainTitles: ['바벨의 영원한 방패'],
            setSecretFlag: 'sarkaz_awakening',
            unlockAchievementId: 'legend_babel_phantom'
          },
          success: {
            text: '동포들의 희생을 기리며 깊은 평온 속에서 아츠를 완성했습니다.',
            statEffects: { artsAptitude: 20, sanity: 15 },
            setSecretFlag: 'sarkaz_awakening'
          },
          failure: {
            text: '고대의 기억이 너무 무거워 눈물을 흘렸습니다.',
            statEffects: { sanity: -20 }
          }
        }
      }
    ]
  },

  // ==========================================
  // 기이한 조우 및 특수 사건 (Bizarre & Special Encounters)
  // ==========================================
  {
    id: 'bizarre_sami_mushrooms',
    title: '사미 설원의 무지갯빛 발광 버섯',
    description: '극북 사미의 울창한 침엽수림 속에서 영롱한 무지갯빛 형광을 내뿜는 버섯 군락을 발견했습니다. 설원의 전설에 따르면 영적 계시를 준다고 합니다.',
    category: 'life',
    minAge: 12,
    maxAge: 999,
    choices: [
      {
        id: 'c_eat_sami_mushroom',
        label: '호기심을 이기지 못하고 버섯을 한 입 베어 문다',
        description: '버섯의 맛을 보고 영적 환각을 체험합니다.',
        outcomes: {
          success: {
            text: '눈앞에 온갖 무지갯빛 슬러그와 우주 고래가 춤을 추는 기묘한 환각을 목격했습니다! 머릿속이 몽롱하지만 잊을 수 없는 경험입니다.',
            statEffects: { sanity: -10, intellect: 6, luck: 8 },
            unlockAchievementId: 'common_sami_mushroom_trip',
            gainTitles: ['설원의 몽상가']
          }
        }
      },
      {
        id: 'c_sample_sami_mushroom',
        label: '조심스럽게 약초 채집용 유리병에 표본을 담는다',
        description: '학술적 가치를 지닌 희귀 균류로 보존합니다.',
        outcomes: {
          success: {
            text: '손상 없이 온전한 표본을 채집하여 학술원에 고가에 납품했습니다.',
            statEffects: { intellect: 5, wealth: 350 }
          }
        }
      }
    ]
  },
  {
    id: 'bizarre_siracusa_opera',
    title: '볼시니 오페라 극장의 비극과 희극',
    description: '시라쿠사 볼시니의 대극장에서 오늘 밤 마피아 가문의 복수극을 다룬 신작 오페라가 막을 올렸습니다. 무대 뒤편에서는 배우들이 긴장하고 있습니다.',
    category: 'life',
    minAge: 16,
    maxAge: 999,
    choices: [
      {
        id: 'c_laugh_at_siracusa_comedy',
        label: '풍자와 블랙코미디가 가미된 희극 연극을 관람한다',
        description: '배꼽 빠지는 시라쿠사식 풍자극을 즐깁니다.',
        outcomes: {
          success: {
            text: '배우들의 능청스러운 연기와 마피아 풍자에 숨이 넘어갈 정도로 웃었습니다! 눈물이 찔끔 날 정도의 유쾌한 밤이었습니다.',
            statEffects: { sanity: 25, health: 5 },
            unlockAchievementId: 'common_siracusa_fatal_comedy'
          }
        }
      },
      {
        id: 'c_opera_box_whisper',
        label: '2층 귀빈실에서 패밀리 간부들과 밀담을 나눈다',
        description: '시라쿠사 밤의 권력자들과 정보 거래를 틉니다.',
        diceCheck: { stat: 'intellect', difficulty: 60 },
        outcomes: {
          criticalSuccess: {
            text: '화려한 언변으로 패밀리 간부들의 호감을 사며 거액의 스폰서십을 약조받았습니다!',
            statEffects: { wealth: 1200, intellect: 8 },
            gainTitles: ['오페라의 귀빈']
          },
          success: {
            text: '쏠쏠한 뒷골목 정보를 얻고 소정의 수고비를 챙겼습니다.',
            statEffects: { wealth: 400, intellect: 4 }
          },
          failure: {
            text: '무례한 태도로 패밀리의 눈 밖에 날 뻔했습니다.',
            statEffects: { sanity: -15 }
          }
        }
      }
    ]
  },
  {
    id: 'bizarre_columbia_lab_zap',
    title: '트리몬트 연구소의 고전압 누전 사고',
    description: '컬럼비아 과학 연구소 견학 중 배전반이 폭발하며 굵은 스파크 전선이 허공에서 춤을 춥니다! 주변 연구원들이 비명을 지릅니다.',
    category: 'life',
    minAge: 15,
    maxAge: 999,
    choices: [
      {
        id: 'c_touch_zap_wire',
        label: '번쩍이는 전선에 호기심으로 손을 뻗어본다',
        description: '파지직! 순식간에 강력한 고전압 전류가 전신을 관통합니다.',
        outcomes: {
          success: {
            text: '파지직!! 전신에 번개가 치며 머리카락이 고슴도치처럼 솟구쳤습니다! 기적적으로 살아남았으나 한동안 혀끝이 얼얼합니다.',
            statEffects: { health: -15, sanity: 5, artsAptitude: 4 },
            unlockAchievementId: 'common_columbia_lab_zap'
          }
        }
      },
      {
        id: 'c_safely_insulate_circuit',
        label: '절연 막대를 들고 메인 차단기를 내린다',
        description: '기민하게 화재를 예방하고 사람들을 구합니다.',
        diceCheck: { stat: 'intellect', difficulty: 55 },
        outcomes: {
          success: {
            text: '신속한 판단으로 2차 폭발을 막아내 연구원들의 뜨거운 감사를 받았습니다.',
            statEffects: { intellect: 8, wealth: 500 }
          },
          failure: {
            text: '차단기를 내리는 과정에서 가벼운 감전 화상을 입었습니다.',
            statEffects: { health: -10 }
          }
        }
      }
    ]
  },
  {
    id: 'bizarre_ursus_blizzard_vodka',
    title: '영하 40도 북방 툰드라의 혹한과 보드카',
    description: '우르수스 극북 설원의 밤. 체감 온도가 영하 40도까지 곤두박질치며 눈보라가 텐트를 찢을 듯이 몰아칩니다. 코끝이 딱딱하게 얼어붙기 시작합니다.',
    category: 'life',
    minAge: 18,
    maxAge: 999,
    choices: [
      {
        id: 'c_drink_nordic_vodka',
        label: '우르수스 불곰 전사들이 건넨 70도 독주 보드카를 병째 마신다',
        description: '목구멍을 태우는 화염 같은 알코올로 체온을 끌어올립니다.',
        outcomes: {
          success: {
            text: '목구멍부터 위장까지 불길이 타오르는 듯한 열기가 전신으로 퍼지며 동상이 기적처럼 녹아내렸습니다! 우르수스 전사들이 호탕하게 웃으며 등을 두드립니다.',
            statEffects: { health: 10, sanity: 15, combat: 5 },
            unlockAchievementId: 'common_ursus_frostbite'
          }
        }
      },
      {
        id: 'c_huddle_by_fire',
        label: '모닥불 곁에서 털가죽 담요를 겹겹이 두르고 버틴다',
        description: '안전하게 체온을 보존하며 새벽을 기다립니다.',
        outcomes: {
          success: {
            text: '동틀 무렵 눈보라가 멎었습니다. 무사히 혹한의 밤을 넘겼습니다.',
            statEffects: { health: 5, sanity: 5 }
          }
        }
      }
    ]
  },
  {
    id: 'catastrophe_originium_lightning',
    title: '재앙 구름의 폭주: 흑자색 오리지늄 벼락',
    description: '황야를 이동하던 중 갑작스러운 재앙 구름이 하늘을 뒤덮더니, 흑자색 오리지늄 번개가 대지를 뒤흔들며 바로 눈앞으로 내리꽂힙니다!',
    category: 'fateful',
    minAge: 16,
    maxAge: 999,
    choices: [
      {
        id: 'c_dodge_lightning',
        label: '아츠 유닛과 무기를 역방향으로 휘두르며 벼락의 낙하 궤적을 쳐낸다',
        description: '경이로운 반사신경으로 벼락을 흘려보냅니다.',
        diceCheck: { stat: 'combat', difficulty: 75 },
        outcomes: {
          criticalSuccess: {
            text: '기적과도 같은 신기(神技)! 벼락의 전하를 칼끝으로 흩뿌려버리며 한 점의 부상도 없이 대재앙을 비웃었습니다!',
            statEffects: { combat: 15, artsAptitude: 12, sanity: 20 },
            gainTitles: ['벼락을 베어낸 자'],
            unlockAchievementId: 'rare_originium_lightning_strike'
          },
          success: {
            text: '벼락의 파편에 겉옷이 불탔지만 치명상을 피하고 살아남았습니다.',
            statEffects: { health: -20, sanity: 10 },
            unlockAchievementId: 'rare_originium_lightning_strike'
          },
          failure: {
            text: '충격파에 튕겨 날아가 깊은 내상을 입었습니다.',
            statEffects: { health: -45, sanity: -20 }
          }
        }
      },
      {
        id: 'c_shelter_bunker',
        label: '암반 동굴 속으로 몸을 던져 피신한다',
        description: '대피소에 숨어 번개가 지나가길 기다립니다.',
        outcomes: {
          success: {
            text: '거센 천둥소리 속에서 동굴 천장이 흔들렸으나 다행히 무사히 피신했습니다.',
            statEffects: { sanity: 5 }
          }
        }
      }
    ]
  },
  {
    id: 'rim_billiton_mega_drill_event',
    title: '림 빌리톤 채굴선: 초대형 거대 굴착기',
    description: '림 빌리톤의 거대한 이동 광산선 지하 심도 800미터. 고순도 오리지늄 광맥을 향해 전진하는 직경 20미터의 초대형 굴착기의 조종수가 급환으로 쓰러졌습니다!',
    category: 'career',
    minAge: 18,
    maxAge: 999,
    choices: [
      {
        id: 'c_drive_mega_drill',
        label: '조종석에 올라타 굴착기의 회전 토크를 제어한다',
        description: '지하 암반의 진동을 감각으로 읽으며 전진합니다.',
        diceCheck: { stat: 'intellect', difficulty: 68 },
        outcomes: {
          criticalSuccess: {
            text: '완벽한 각도 제어로 전설적인 고순도 광맥 코어를 채굴선 도크로 끌어올렸습니다! 광산 감독관이 찬사를 보냅니다!',
            statEffects: { wealth: 3500, intellect: 10, combat: 8 },
            gainTitles: ['대심도 채굴 기사'],
            unlockAchievementId: 'rare_rim_billiton_mega_drill'
          },
          success: {
            text: '거대 드릴의 균형을 되찾고 안전하게 암반을 돌파했습니다.',
            statEffects: { wealth: 1500, intellect: 5 },
            unlockAchievementId: 'rare_rim_billiton_mega_drill'
          },
          failure: {
            text: '드릴 날이 과열되어 긴급 정지했습니다. 수리비가 청구됩니다.',
            statEffects: { wealth: -300, sanity: -10 }
          }
        }
      }
    ]
  },
  {
    id: 'minos_athletic_triumph',
    title: '미노스 전사 제전: 판크라티온 결투',
    description: '자유와 체육의 나라 미노스. 고대 원형 경기장에서 수천 명의 군중이 환호하는 가운데 최고의 전사를 가리는 제전이 열렸습니다.',
    category: 'combat',
    minAge: 18,
    maxAge: 999,
    choices: [
      {
        id: 'c_enter_minos_arena',
        label: '투기장에 입장하여 무패의 미노스 챔피언에게 도전한다',
        description: '순수한 완력과 격투 기술로 승부를 겨룹니다.',
        diceCheck: { stat: 'combat', difficulty: 72 },
        outcomes: {
          criticalSuccess: {
            text: '경기장을 뒤흔드는 깔끔한 메치기로 챔피언을 제압했습니다! 군중들이 당신의 머리 위에 황금 월계관을 씌워줍니다!',
            statEffects: { combat: 15, sanity: 25, wealth: 2500 },
            gainTitles: ['미노스의 투기영웅'],
            unlockAchievementId: 'rare_minos_golden_laurel'
          },
          success: {
            text: '치열한 공방 끝에 판정승을 거두고 관중들의 박수갈채를 받았습니다.',
            statEffects: { combat: 8, sanity: 15, wealth: 1000 },
            unlockAchievementId: 'rare_minos_golden_laurel'
          },
          failure: {
            text: '챔피언의 거센 돌진에 밀려 모래바닥에 쓰러졌습니다.',
            statEffects: { health: -20, sanity: -10 }
          }
        }
      }
    ]
  },
  {
    id: 'priestess_black_box_discovery',
    title: '【고대 인류의 메아리】 보존자의 비밀 블랙박스',
    description: '지하 깊은 유적의 봉인된 냉각 챔버. 테라의 그 어떤 종족의 언어도 아닌, 만 년 전 고대 인류의 통신 규약으로 암호화된 블랙박스가 푸른빛을 점멸하고 있습니다.',
    category: 'fateful',
    minAge: 25,
    maxAge: 999,
    choices: [
      {
        id: 'c_decode_priestess_box',
        label: '아츠 연산 유닛을 극대화하여 통신 암호 규약을 복원한다',
        description: '고대 인류의 기록과 프리스티스의 마지막 육성을 재생합니다.',
        diceCheck: { stat: 'intellect', difficulty: 85 },
        outcomes: {
          criticalSuccess: {
            text: '기밀 프로토콜이 해제되며 부드럽고 서글픈 여인의 음성이 울려 퍼집니다. "...우리의 눈길이 다시 교차할 때까지, 부디 나를 잊지 말아줘." 테라 이전 인류의 궁극의 비밀을 목도했습니다!',
            statEffects: { intellect: 30, sanity: 30 },
            gainTitles: ['기원을 엿본 자'],
            unlockAchievementId: 'legend_priestess_black_box',
            setSecretFlag: 'witnessed_pre_terra_voice'
          },
          success: {
            text: '데이터의 일부분을 복원하여 테라의 하늘 너머 별들에 관한 기록을 열람했습니다.',
            statEffects: { intellect: 18, sanity: 15 },
            unlockAchievementId: 'legend_priestess_black_box'
          },
          failure: {
            text: '데이터 보호 시스템이 작동하여 코드가 영구 잠금 상태로 전환되었습니다.',
            statEffects: { sanity: -15 }
          }
        }
      }
    ]
  },
  {
    id: 'cautus_warm_carrot_stew',
    title: '카우투스 마을의 저녁: 따뜻한 당근 스튜',
    description: '황야 여행 중 들른 작은 카우투스 정착지. 쌀쌀한 밤바람을 피해 들어간 작은 오두막에서 푸근한 인상의 어머니가 김이 모락모락 나는 당근과 감자 스튜를 한 그릇 내어줍니다.',
    category: 'life',
    minAge: 5,
    maxAge: 999,
    choices: [
      {
        id: 'c_enjoy_cautus_stew',
        label: '따뜻한 스튜 한 그릇을 감사히 비우고 온기를 나눈다',
        description: '소박하지만 진심 어린 환대에 마음이 녹아내립니다.',
        outcomes: {
          success: {
            text: '진하고 달콤한 국물이 지친 몸과 마음을 치유해 주었습니다. 오랜만에 깊고 편안한 잠을 청했습니다.',
            statEffects: { health: 20, sanity: 25 },
            unlockAchievementId: 'common_cautus_carrot_stew'
          }
        }
      }
    ]
  },
  {
    id: 'durin_underground_retreat',
    title: '지하 두린 대도시의 초대: 달콤한 낮잠',
    description: '지하 거대 공동에 자리 잡은 두린들의 도시 쩨르노. 지상의 오리지늄 분진과 전쟁의 위협이 전혀 닿지 않는 아늑한 온천 여관에 투숙하게 되었습니다.',
    category: 'life',
    minAge: 15,
    maxAge: 999,
    choices: [
      {
        id: 'c_sleep_durin_nap',
        label: '푹신한 버섯 매트리스 위에서 알람 없이 12시간 꿀잠을 잔다',
        description: '두린 종족의 여유로운 수면 철학을 만끽합니다.',
        outcomes: {
          success: {
            text: '세상의 모든 피로가 씻은 듯이 사라졌습니다! 눈을 뜨니 상쾌한 아침 햇살 대신 아늑한 발광석 등불이 반겨줍니다.',
            statEffects: { sanity: 35, health: 15 },
            unlockAchievementId: 'common_durin_nap_master'
          }
        }
      }
    ]
  },
  {
    id: 'nomad_campfire_night',
    title: '황야 노마드 캠프의 밤: 모닥불과 노래',
    description: '이동도시의 차가운 강철벽을 떠나 황야의 유랑민들과 캠프를 차렸습니다. 딱딱거리는 모닥불 가에 모인 방랑자들이 옛 노래를 흥얼거립니다.',
    category: 'life',
    minAge: 10,
    maxAge: 999,
    choices: [
      {
        id: 'c_join_nomad_song',
        label: '모닥불 곁에 앉아 낡은 현악기를 뜯으며 함께 노래한다',
        description: '대지의 방랑자들과 교감을 나눕니다.',
        outcomes: {
          success: {
            text: '모닥불 불꽃이 밤하늘로 날아오르고, 유랑민들의 합창이 황야의 침묵을 따뜻하게 물들였습니다.',
            statEffects: { sanity: 20, luck: 5 },
            unlockAchievementId: 'common_nomad_campfire'
          }
        }
      }
    ]
  },
  {
    id: 'slum_street_smart_encounter',
    title: '슬럼가 골목길의 소매치기',
    description: '어두운 슬럼가 골목을 지나던 중, 한 아이가 지나치는 척하며 당신의 주머니 속 지갑을 날렵하게 털어가려 합니다!',
    category: 'life',
    minAge: 8,
    maxAge: 999,
    choices: [
      {
        id: 'c_catch_pickpocket',
        label: '반사적으로 소매치기의 손목을 비틀어 쥐어챈다',
        description: '도심 뒷골목의 생존 본능을 발휘합니다.',
        diceCheck: { stat: 'luck', difficulty: 45 },
        outcomes: {
          success: {
            text: '소매치기의 손목을 붙잡고 지갑을 사수했습니다! 아이는 깜짝 놀라 혀를 내두르며 사과하고 달아났습니다.',
            statEffects: { combat: 4, luck: 6 },
            unlockAchievementId: 'common_slum_street_smart'
          },
          failure: {
            text: '기민한 꼬마의 손놀림을 놓쳐 지갑에서 약간의 동전을 털렸습니다.',
            statEffects: { wealth: -80, sanity: -5 }
          }
        }
      }
    ]
  },
  {
    id: 'kazdel_royal_court_assembly',
    title: '【카즈델 왕정】 섭정왕 어전 회의의 밀서',
    description: '카즈델 군사위원회가 전 대륙의 전쟁을 획책하는 비밀 왕정 회의실. 섭정왕 테레시스와 군단장들의 작전 지도가 놓여 있습니다.',
    category: 'fateful',
    minAge: 25,
    maxAge: 999,
    choices: [
      {
        id: 'c_infiltrate_kazdel_court',
        label: '어둠 속에 몸을 숨겨 왕정 위원회의 비밀 군사 배치도를 필사한다',
        description: '발각되면 즉각 참수당하는 극도의 첩보 작전입니다.',
        diceCheck: { stat: 'intellect', difficulty: 78 },
        outcomes: {
          criticalSuccess: {
            text: '그림자조차 눈치채지 못하게 왕정의 극비 작전 문서를 완벽히 탈취했습니다! 이 정보는 런디니움과 로도스의 운명을 바꿀 것입니다!',
            statEffects: { intellect: 25, sanity: 20 },
            gainTitles: ['밤을 훔친 자'],
            unlockAchievementId: 'unique_kazdel_court_infiltrator'
          },
          success: {
            text: '간발의 차로 핵심 전술 지도 일부를 확보하고 탈출했습니다.',
            statEffects: { intellect: 15, sanity: 10 },
            unlockAchievementId: 'unique_kazdel_court_infiltrator'
          },
          failure: {
            text: '순찰병에게 발각되어 혈투 끝에 부상을 입고 간신히 도주했습니다.',
            statEffects: { health: -40, sanity: -25 }
          }
        }
      }
    ]
  },
  {
    id: 'sargon_pharaoh_tomb_expedition',
    title: '사르곤 황금 사막: 전설의 파디샤 능묘',
    description: '모래바람이 불어 닥친 사르곤 깊은 황무지에서 천 년 전 파디샤의 황금 묘역 입구가 지표면으로 드러났습니다.',
    category: 'fateful',
    minAge: 25,
    maxAge: 999,
    choices: [
      {
        id: 'c_enter_pharaoh_tomb',
        label: '고대 주술 함정을 해제하고 황금 묘역 중심부로 진입한다',
        description: '전설의 파디샤 옥좌와 보물을 탐색합니다.',
        diceCheck: { stat: 'intellect', difficulty: 75 },
        outcomes: {
          criticalSuccess: {
            text: '주술 함정을 완벽히 파훼하고 고대 파디샤의 황금 단검과 5,000 LMD 상당의 보석을 획득했습니다!',
            statEffects: { wealth: 5000, intellect: 15, sanity: 20 },
            gainTitles: ['사막의 발굴왕'],
            unlockAchievementId: 'mystic_sargon_pharaoh_tomb'
          },
          success: {
            text: '함정을 피해 황금 보물 일부를 챙겨 무사히 귀환했습니다.',
            statEffects: { wealth: 2000, intellect: 8 },
            unlockAchievementId: 'mystic_sargon_pharaoh_tomb'
          },
          failure: {
            text: '독화살 함정이 작동하여 어깨에 부상을 입고 후퇴했습니다.',
            statEffects: { health: -30, sanity: -15 }
          }
        }
      }
    ]
  }
];
