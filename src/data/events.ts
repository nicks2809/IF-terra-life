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
    isMajor: false,
    preferredSeason: '봄',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '여름',
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
      },
      {
        id: 'c_slug_swarm_clash',
        label: '배관에서 갑자기 쏟아져 나온 변이 오리지늄 슬러그 무리를 무기를 들고 퇴치한다',
        description: '산성 분비물을 뿜는 야생 슬러그 무리와 실전 교전을 벌입니다.',
        diceCheck: { stat: 'combat', difficulty: 42 },
        outcomes: {
          criticalSuccess: {
            text: '민첩하게 슬러그 무리의 급소를 찔러 산성 피해 없이 완벽히 퇴치했습니다! 뒷골목 주민들이 환호합니다.',
            statEffects: { combat: 6, health: 5, wealth: 250 },
            gainTitles: ['슬러그 사냥꾼']
          },
          success: {
            text: '옷자락이 다소 부식되었지만 슬러그 무리를 물리쳤습니다.',
            statEffects: { combat: 4, health: -8 }
          },
          failure: {
            text: '산성 분비물을 뒤집어쓰고 화상을 입었습니다!',
            statEffects: { health: -18, sanity: -8 }
          }
        },
        triggerBattleEnemyId: 'slug_swarm'
      }
    ]
  },
  {
    id: 'event_wasteland_slug_infestation',
    title: '【황야 탐색】 노마드 캠프 주변의 변이 슬러그 대량 발생',
    description: '황야 노마드 캠프 인근. 비정상적으로 증식한 변이 오리지늄 슬러그 무리가 가축 사료와 텐트를 부식시키며 주민들을 위협하고 있습니다.',
    category: 'life',
    minAge: 12,
    maxAge: 35,
    isMajor: false,
    preferredSeason: '여름',
    conditions: { environment: ['황야의 노마드 캠프', '슬럼가 및 암시장'] },
    choices: [
      {
        id: 'c_purge_slug_infestation',
        label: '무기를 들고 캠프 주민들을 도와 슬러그 무리를 소탕한다',
        description: '산성 슬러그 무리와 직접 교전을 벌입니다.',
        diceCheck: { stat: 'combat', difficulty: 45 },
        outcomes: {
          success: {
            text: '슬러그 무리를 성공적으로 소탕하고 캠프 주민들로부터 감사의 보수와 원석 껍질을 받았습니다.',
            statEffects: { combat: 5, wealth: 350, sanity: 6 }
          },
          failure: {
            text: '산성액에 장비가 부식되고 상처를 입었습니다.',
            statEffects: { health: -20, sanity: -10 }
          }
        },
        triggerBattleEnemyId: 'slug_swarm'
      },
      {
        id: 'c_slug_chemical_smoke',
        label: '자극성 연막탄을 피워 슬러그 무리를 황야 바깥으로 유인한다',
        description: '지략을 발휘하여 무혈 해결을 시도합니다.',
        diceCheck: { stat: 'intellect', difficulty: 48 },
        outcomes: {
          success: {
            text: '연막이 슬러그 무리의 후각을 자극하여 전부 협곡 아래로 유인했습니다.',
            statEffects: { intellect: 5, sanity: 8 }
          },
          failure: {
            text: '연기를 잘못 마셔 심한 기침을 겪었습니다.',
            statEffects: { health: -10, sanity: -5 }
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
    isMajor: true,
    preferredSeason: '봄',
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
    minAge: 24,
    maxAge: 45,
    isMajor: true,
    preferredSeason: '봄',
    conditions: { race: ['에기르'], minCombat: 62 },
    choices: [
      {
        id: 'c_accept_abyssal_surgery',
        label: '개조 수술을 받아들여 어비설 헌터스로 거듭난다',
        description: '해사의 유전체와 에기르 나노 생체 합성을 견뎌냅니다.',
        diceCheck: { stat: 'combat', difficulty: 78 },
        outcomes: {
          criticalSuccess: {
            text: '기적적인 생체 적합성! 수술대 위에서 각성하여 순수한 어비설 헌터스로 각성했습니다! 완력과 신체 재생력이 인간의 한계를 초월합니다.',
            statEffects: { combat: 18, health: 20, sanity: 10 },
            careerExpDelta: 25,
            specialCareerGain: { id: 'abyssal_hunter', name: '어비설 헌터스 (Abyssal Hunter)', rank: '심해의 사냥꾼' },
            gainTitles: ['심해의 은빛 칼날'],
            unlockAchievementId: 'unique_abyssal_hunter'
          },
          success: {
            text: '극심한 발작 끝에 개조 수술을 성공적으로 마쳤습니다. 에기르의 초인적 완력을 손에 넣었습니다.',
            statEffects: { combat: 14, health: 10, sanity: -15 },
            careerExpDelta: 15,
            specialCareerGain: { id: 'abyssal_hunter', name: '어비설 헌터스 (Abyssal Hunter)', rank: '견습 사냥꾼' },
            unlockAchievementId: 'unique_abyssal_hunter'
          },
          failure: {
            text: '생체 거부 반응으로 혈관이 파열될 뻔했습니다! 수술은 중단되었고 간신히 목숨만 건졌습니다.',
            statEffects: { health: -45, sanity: -25 }
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
            statEffects: { sanity: 12 }
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
    minAge: 24,
    maxAge: 42,
    isMajor: true,
    preferredSeason: '봄',
    conditions: { race: ['산크타'], minCombat: 58 },
    choices: [
      {
        id: 'c_accept_executor',
        label: '교황청 제5청의 집행관 서약을 맹세한다',
        description: '공증소의 제식 흑색 코트와 개조 수호총을 지급받습니다.',
        diceCheck: { stat: 'intellect', difficulty: 74 },
        outcomes: {
          success: {
            text: '성스러운 율법의 이름으로! 라테라노 건 익제큐터로 정식 취임했습니다. 오리지늄 수호총 사격술이 극에 달합니다.',
            statEffects: { combat: 14, intellect: 10, sanity: 10, wealth: 1400 },
            careerExpDelta: 20,
            specialCareerGain: { id: 'gun_executor', name: '라테라노 건 익제큐터', rank: '공증소 제5청 집행관' },
            gainTitles: ['율법의 집행자'],
            unlockAchievementId: 'mystic_gun_executor'
          },
          failure: {
            text: '엄격한 율법 필기 및 탄도 심의에서 보류 판정을 받았습니다.',
            statEffects: { intellect: 4, sanity: -10 }
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
    minAge: 25,
    maxAge: 45,
    isMajor: true,
    preferredSeason: '봄',
    conditions: { nation: ['염국'], minIntellect: 62 },
    choices: [
      {
        id: 'c_accept_yan_censor',
        label: '천하의 법도를 바로세우기 위해 대리의 칙령을 받든다',
        description: '정3품 감찰패와 어사도를 하사받습니다.',
        diceCheck: { stat: 'intellect', difficulty: 76 },
        outcomes: {
          success: {
            text: '황제의 어명을 받들어 염국 대리 사법 감찰관으로 등극했습니다! 수많은 관리들이 당신의 그림자 앞에서도 고개를 숙입니다.',
            statEffects: { intellect: 15, combat: 10, wealth: 1800 },
            careerExpDelta: 20,
            specialCareerGain: { id: 'yan_censor', name: '염국 대리 사법 감찰사', rank: '대리 정3품 감찰관' },
            gainTitles: ['염국 대리 사경'],
            unlockAchievementId: 'mystic_yan_high_censor'
          },
          failure: {
            text: '조정의 까다로운 경전 및 암행 실무 고시에서 낙방했습니다.',
            statEffects: { intellect: 5, sanity: -12 }
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
    minAge: 26,
    maxAge: 48,
    isMajor: true,
    preferredSeason: '봄',
    conditions: { nation: ['컬럼비아'], minIntellect: 65 },
    choices: [
      {
        id: 'c_accept_rhine_director',
        label: '라인 랩의 특수 생체 연구 총괄 디렉터로 부임한다',
        description: '최첨단 연구실과 막대한 연구비를 배정받습니다.',
        diceCheck: { stat: 'intellect', difficulty: 78 },
        outcomes: {
          success: {
            text: '크리스틴 라이트 총괄의 승인을 받아 라인 랩 섹션 디렉터로 임명되었습니다! 연구 예산과 특별 특허권이 부여됩니다.',
            statEffects: { intellect: 16, wealth: 2400, artsAptitude: 10 },
            careerExpDelta: 20,
            specialCareerGain: { id: 'rhine_director', name: '라인 랩 총괄 디렉터', rank: '특수 프로젝트 수석 주임' },
            gainTitles: ['라인 랩 주임'],
            unlockAchievementId: 'mystic_rhine_director'
          },
          failure: {
            text: '윤리위원회와 이사회 청문회의 높은 문턱을 넘지 못했습니다.',
            statEffects: { intellect: 5, sanity: -12 }
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
    minAge: 25,
    maxAge: 46,
    isMajor: true,
    preferredSeason: '봄',
    conditions: { nation: ['빅토리아'], minCombat: 65 },
    choices: [
      {
        id: 'c_awaken_steam_knight',
        label: '증기 코어를 점화하고 거병의 조종간을 쥔다',
        description: '고압 증기와 육중한 강철 프레임에 몸을 싣습니다.',
        diceCheck: { stat: 'combat', difficulty: 80 },
        outcomes: {
          criticalSuccess: {
            text: '굉음과 함께 런디니움의 고대 증기기사가 완벽히 기동했습니다! 당신은 제국의 살아있는 거병이자 증기기사단의 후계자가 되었습니다.',
            statEffects: { combat: 20, health: 18, wealth: 2000 },
            careerExpDelta: 25,
            specialCareerGain: { id: 'steam_knight', name: '빅토리아 증기기사', rank: '런디니움 제식 거병' },
            gainTitles: ['증기기사의 후예'],
            unlockAchievementId: 'unique_steam_knight_heart'
          },
          success: {
            text: '증기 압력을 조절하며 갑주 기동에 성공했습니다.',
            statEffects: { combat: 14, health: 12 },
            careerExpDelta: 15,
            specialCareerGain: { id: 'steam_knight', name: '빅토리아 증기기사', rank: '예비 기동병' },
            unlockAchievementId: 'unique_steam_knight_heart'
          },
          failure: {
            text: '증기 밸브의 폭주로 전신에 심한 화상을 입었습니다.',
            statEffects: { health: -38, sanity: -18 }
          }
        }
      },
      {
        id: 'c_duel_ancient_steam_knight',
        label: '격납고에서 폭주 중인 고대 증기기사와 실전 결전을 벌인다',
        description: '실전 무투로 증기기사의 인공지능 코어를 굴복시키고 자격을 증명합니다.',
        diceCheck: { stat: 'combat', difficulty: 78 },
        outcomes: {
          criticalSuccess: {
            text: '고대 거병의 압도적인 돌진을 흘려내고 조종석을 완벽히 장악했습니다! 증기기사가 당신의 명령에 복종합니다.',
            statEffects: { combat: 22, health: 15, wealth: 3000 },
            careerExpDelta: 28,
            specialCareerGain: { id: 'steam_knight', name: '빅토리아 증기기사', rank: '런디니움 정예 거병' },
            gainTitles: ['증기기사를 굴복시킨 자'],
            unlockAchievementId: 'unique_slay_steam_goliath'
          },
          success: {
            text: '치열한 교전 끝에 증기기사를 기능 정지시키고 복구에 성공했습니다.',
            statEffects: { combat: 14, health: -30, wealth: 1500 },
            careerExpDelta: 16,
            specialCareerGain: { id: 'steam_knight', name: '빅토리아 증기기사', rank: '예비 기동병' },
            unlockAchievementId: 'unique_steam_knight_heart'
          },
          failure: {
            text: '증기 파일벙커의 반동에 직격당해 치명상을 입었습니다.',
            statEffects: { health: -55, sanity: -20 }
          }
        },
        triggerBattleEnemyId: 'londinium_steam_knight'
      }
    ]
  },
  {
    id: 'career_special_ursus_emperors_blade',
    title: '【특수 직군】 우르수스 황제의 검 (내위) 비밀 결사',
    description: '북방 설원의 눈보라 속에서 검은 안개를 두른 의문의 기사가 나타났습니다. "우르수스의 피가 흐르는 자여, 황제의 국경을 지키는 그림자가 되겠는가?"',
    category: 'career',
    minAge: 26,
    maxAge: 46,
    isMajor: true,
    preferredSeason: '봄',
    conditions: { nation: ['우르수스 제국'], minCombat: 68 },
    choices: [
      {
        id: 'c_accept_emperors_blade',
        label: '극북의 악마 파편을 품고 황제의 검으로 서약한다 (황제의 검 결투)',
        description: '검은 안개를 다루는 친위 내위의 맹세를 맺습니다.',
        diceCheck: { stat: 'combat', difficulty: 82 },
        outcomes: {
          success: {
            text: '갑주 틈새로 검은 안개가 피어오릅니다. 당신은 황제 직속 내위 "황제의 검"이 되었습니다. 적들은 당신의 그림자만 보아도 얼어붙습니다.',
            statEffects: { combat: 18, intellect: 12, sanity: -18 },
            careerExpDelta: 25,
            specialCareerGain: { id: 'emperors_blade', name: '우르수스 황제의 검', rank: '황실 친위 내위' },
            gainTitles: ['검은 안개의 추적자'],
            setSecretFlag: 'emperors_blade_vow',
            unlockAchievementId: 'unique_emperors_blade'
          },
          failure: {
            text: '악마 파편의 오염을 견디지 못하고 치명적인 내상과 정신 붕괴를 겪었습니다.',
            statEffects: { health: -50, sanity: -38 }
          }
        },
        triggerBattleEnemyId: 'emperors_blade'
      }
    ]
  },
  {
    id: 'story_ursus_shadow_guard_clash',
    title: '【우르수스 사변】 눈보라 속의 그림자: 황제의 검과의 결전',
    description: '북방 설원의 거센 눈보라 속에서, 우르수스 황실의 정예 친위대 "황제의 검(Emperor\'s Blade)"이 붕괴의 검은 안개를 뿜어내며 당신의 진로를 가로막아 섭니다. "황제의 영토에 발을 들인 침입자에게 죽음을."',
    category: 'fateful',
    minAge: 22,
    maxAge: 55,
    isMajor: true,
    preferredSeason: '가을',
    conditions: { nation: ['우르수스 제국'] },
    choices: [
      {
        id: 'c_fight_emperors_blade_boss',
        label: '검은 안개의 붕괴 영역을 정면 돌파하며 황제의 검과 결전을 벌인다 (보스전)',
        description: '황실 친위대의 검은 안개와 결사 항전을 치릅니다.',
        diceCheck: { stat: 'combat', difficulty: 82 },
        outcomes: {
          criticalSuccess: {
            text: '검은 안개를 가르고 황제의 검의 갑주를 격파했습니다! 제국의 그림자가 침묵하고 거대한 명성을 얻었습니다.',
            statEffects: { combat: 22, wealth: 4500, sanity: 20 },
            careerExpDelta: 30,
            gainTitles: ['황제의 검을 꺾은 자'],
            setSecretFlag: 'emperors_blade_vow',
            unlockAchievementId: 'unique_slay_emperors_blade'
          },
          success: {
            text: '피를 흘리며 황제의 검의 맹공을 버텨내고 퇴각시켰습니다.',
            statEffects: { combat: 15, health: -40, wealth: 2000 },
            careerExpDelta: 18,
            setSecretFlag: 'emperors_blade_vow'
          },
          failure: {
            text: '붕괴 도메인의 검은 안개에 짓눌려 치명적인 내상을 입었습니다!',
            statEffects: { health: -60, sanity: -35 }
          }
        },
        triggerBattleEnemyId: 'emperors_blade'
      },
      {
        id: 'c_flee_black_fog',
        label: '눈보라를 틈타 검은 안개 영역에서 신속히 이탈한다',
        description: '무리한 교전을 피하고 생존을 도모합니다.',
        diceCheck: { stat: 'luck', difficulty: 60 },
        outcomes: {
          success: {
            text: '지형을 이용하여 기척을 지우고 무사히 국경 감시선을 빠져나왔습니다.',
            statEffects: { sanity: 5, luck: 3 }
          },
          failure: {
            text: '안개 파편에 스쳐 한기와 부상을 입은 채 간신히 탈출했습니다.',
            statEffects: { health: -30, sanity: -15 }
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
    isMajor: true,
    preferredSeason: '겨울',
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
    isMajor: true,
    preferredSeason: '겨울',
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
    isMajor: true,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: true,
    preferredSeason: '가을',
    choices: [
      {
        id: 'c_kazimierz_finals',
        label: '황금빛 랜스를 들고 결승 투기장에 올라 영예로운 결투를 벌인다',
        description: '관중들의 환호 속에 챔피언의 자리를 쟁취합니다.',
        diceCheck: { stat: 'combat', difficulty: 75 },
        outcomes: {
          criticalSuccess: {
            text: '상대 기사의 방패를 일격에 분쇄하고 챔피언에 등극했습니다! 수만 관중이 당신의 이름을 연호하며 우승 상금이 수여됩니다!',
            statEffects: { combat: 18, wealth: 4500, sanity: 20 },
            careerExpDelta: 20,
            gainTitles: ['메이저 챔피언'],
            unlockAchievementId: 'mystic_radiant_champion'
          },
          success: {
            text: '치열한 연장전 끝에 판정승을 거두었습니다! 우승 상금과 명성을 획득했습니다.',
            statEffects: { combat: 12, wealth: 2400, health: -20 },
            careerExpDelta: 12,
            gainTitles: ['영광의 기사']
          },
          failure: {
            text: '상대의 기습적인 아츠 랜스에 밀려 아쉽게 준우승에 머물렀습니다.',
            statEffects: { health: -35, wealth: 700, sanity: -15 }
          }
        }
      },
      {
        id: 'c_kazimierz_gamble',
        label: '지략을 발휘하여 상업연합회의 배팅 장부를 분석하고 거액을 베팅한다',
        description: '경기 결과에 지략을 걸어 금융 수익을 노립니다.',
        diceCheck: { stat: 'intellect', difficulty: 74 },
        outcomes: {
          success: {
            text: '정교한 확률 계산으로 배당금 수익을 거두었습니다!',
            statEffects: { wealth: 3200, intellect: 10 }
          },
          failure: {
            text: '승부조작에 휘말려 베팅금을 잃었습니다.',
            statEffects: { wealth: -1800, sanity: -15 }
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
    isMajor: true,
    preferredSeason: '가을',
    choices: [
      {
        id: 'c_fight_seaborne_horde',
        label: '심해의 은빛 칼날을 휘두르며 해사의 군체 심장부로 돌진한다',
        description: '신경 오염을 억누르고 바다의 괴수들을 도륙합니다.',
        diceCheck: { stat: 'combat', difficulty: 80 },
        outcomes: {
          criticalSuccess: {
            text: '칼날이 허공을 가를 때마다 수십 마리의 해사가 산산조각 났습니다! 심해의 속삭임은 당신의 강철 같은 의지 앞에 침묵했습니다.',
            statEffects: { combat: 20, sanity: 20, wealth: 2800 },
            careerExpDelta: 22,
            gainTitles: ['심해의 침묵자'],
            setSecretFlag: 'conquered_seaborne',
            unlockAchievementId: 'unique_abyssal_hunter'
          },
          success: {
            text: '치열한 사투 끝에 해사 무리를 물리치고 등대를 지켜냈습니다.',
            statEffects: { combat: 14, health: -30, sanity: -15 },
            careerExpDelta: 14,
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
        diceCheck: { stat: 'artsAptitude', difficulty: 76 },
        outcomes: {
          success: {
            text: '눈부신 황금빛 등대 광선이 밤바다를 갈랐습니다! 해사들이 비명을 지르며 심해로 도주했습니다.',
            statEffects: { artsAptitude: 16, sanity: 18 },
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
    isMajor: true,
    preferredSeason: '여름',
    choices: [
      {
        id: 'c_lone_trail_sky',
        label: '크리스틴의 발사 관제탑을 지키고, 테라 너머의 우주를 함께 관측한다',
        description: '지략과 모든 지식을 동원하여 로켓 발사 궤적을 사수합니다.',
        diceCheck: { stat: 'intellect', difficulty: 82 },
        outcomes: {
          criticalSuccess: {
            text: '푸른 천공에 거대한 구멍이 뚫리고... 은하와 수억 개의 별들이 모습을 드러냈습니다! 고대 인류 보존자 트레버 프리스톤의 홀로그램이 당신에게 고대의 비밀을 전송했습니다!',
            statEffects: { intellect: 22, sanity: 25, wealth: 4000 },
            careerExpDelta: 25,
            gainTitles: ['별을 올려다본 자'],
            setSecretFlag: 'witnessed_lone_trail',
            unlockAchievementId: 'unique_lone_trail_sky'
          },
          success: {
            text: '발사는 성공했습니다. 당신은 대지 너머에 진정한 하늘이 존재함을 눈으로 목격했습니다.',
            statEffects: { intellect: 15, sanity: 15 },
            careerExpDelta: 15,
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
    isMajor: true,
    preferredSeason: '가을',
    choices: [
      {
        id: 'c_londinium_wall_defense',
        label: '아군을 엄호하며 살카즈 군사위원회 백부장과 결전을 벌인다',
        description: '런디니움의 방어선을 끝까지 사수합니다.',
        diceCheck: { stat: 'combat', difficulty: 78 },
        outcomes: {
          criticalSuccess: {
            text: '살카즈 백부장을 단칼에 베어 넘기고 성벽의 적 기갑선을 격침시켰습니다! 런디니움의 구원자로 칭송받습니다.',
            statEffects: { combat: 18, wealth: 3800, sanity: 20 },
            careerExpDelta: 25,
            gainTitles: ['런디니움의 구원자'],
            setSecretFlag: 'steam_knight_stand',
            setSecretFlag2: 'completed_act1_or_act2',
            unlockAchievementId: 'unique_steam_knight_heart'
          },
          success: {
            text: '격렬한 포화 속에서 시민들의 대피로를 확보했습니다.',
            statEffects: { combat: 12, health: -35, wealth: 1600 },
            careerExpDelta: 15,
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
            statEffects: { combat: 20, health: -20, wealth: 4200 },
            careerExpDelta: 25,
            gainTitles: ['강철의 수호기사'],
            setSecretFlag: 'steam_knight_stand'
          },
          failure: {
            text: '증기 기관이 과열되어 폭발했습니다!',
            statEffects: { health: -50, sanity: -25 }
          }
        }
      },
      {
        id: 'c_londinium_steam_knight_duel',
        label: '전장에 강림한 최후의 증기기사와 격돌하여 명예로운 결전을 벌인다',
        description: '빅토리아의 옛 영광이자 비극적인 거인, 증기기사와의 피할 수 없는 결전입니다.',
        diceCheck: { stat: 'combat', difficulty: 82 },
        outcomes: {
          criticalSuccess: {
            text: '증기기사의 격렬한 파일 벙커 공격을 쳐내고 가슴팍의 증기 코어를 제압했습니다! 빅토리아의 전설적인 기사 서약이 당신에게 계승되었습니다!',
            statEffects: { combat: 22, wealth: 4500, sanity: 20 },
            careerExpDelta: 30,
            gainTitles: ['강철의 수호기사', '증기기사의 후계자'],
            setSecretFlag: 'steam_knight_stand',
            setSecretFlag2: 'completed_act1_or_act2',
            unlockAchievementId: 'unique_slay_steam_goliath'
          },
          success: {
            text: '치열한 난전 끝에 증기기사를 안식에 들게 하고 런디니움 성벽 방어선을 사수했습니다.',
            statEffects: { combat: 15, health: -40, wealth: 2500 },
            careerExpDelta: 20,
            setSecretFlag: 'steam_knight_stand',
            setSecretFlag2: 'completed_act1_or_act2'
          },
          failure: {
            text: '증기기사의 파괴적인 증기 충격파에 튕겨져 나가 전신 골절을 입었습니다!',
            statEffects: { health: -65, sanity: -30 }
          }
        },
        triggerBattleEnemyId: 'londinium_steam_knight'
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
    isMajor: true,
    preferredSeason: '겨울',
    choices: [
      {
        id: 'c_stand_against_collapse',
        label: '아츠와 혼신의 무력으로 결계를 수호하며 붕괴체의 본대를 격퇴한다',
        description: '대륙의 북쪽 국경을 수호합니다.',
        diceCheck: { stat: 'artsAptitude', difficulty: 80 },
        outcomes: {
          criticalSuccess: {
            text: '성림의 영령들과 공명하여 거대한 빛의 결계를 완성했습니다! 붕괴체 무리가 정화되어 소멸했습니다. 테라는 구원받았습니다.',
            statEffects: { artsAptitude: 22, combat: 14, sanity: 25 },
            careerExpDelta: 25,
            gainTitles: ['극북의 결계사'],
            setSecretFlag: 'stopped_collapse',
            unlockAchievementId: 'unique_sami_daemon_slayer'
          },
          success: {
            text: '피를 흘리며 결계선을 사수했습니다. 붕괴체의 남하가 멈췄습니다.',
            statEffects: { artsAptitude: 14, health: -40, sanity: -20 },
            careerExpDelta: 15,
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
    isMajor: true,
    preferredSeason: '가을',
    choices: [
      {
        id: 'c_shield_people',
        label: '일생의 모든 아츠와 무력을 짜내어 피난민들을 지킨다',
        description: '후세를 위해 장렬하게 전장에 섭니다.',
        diceCheck: { stat: 'combat', difficulty: 82 },
        outcomes: {
          criticalSuccess: {
            text: '기적과도 같은 활약으로 재앙의 파편들을 전부 쳐내고 사람들을 구했습니다! 온 테라가 당신의 이름을 영원히 기억할 것입니다!',
            statEffects: { sanity: 30, wealth: 5500 },
            careerExpDelta: 30,
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
    isMajor: true,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '겨울',
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
    isMajor: false,
    preferredSeason: '여름',
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
    isMajor: false,
    preferredSeason: '여름',
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
    isMajor: false,
    preferredSeason: '겨울',
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
    category: 'catastrophe',
    minAge: 16,
    maxAge: 999,
    isMajor: true,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '여름',
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
    category: 'catastrophe',
    minAge: 25,
    maxAge: 999,
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
    isMajor: false,
    preferredSeason: '가을',
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
  },

  // ==========================================
  // 테라의 가혹한 현실 및 인연 사건 (Harsh Terra Reality & Bonds)
  // ==========================================
  {
    id: 'harsh_ursus_infected_patrol',
    title: '【가혹한 테라】 감염자 색출 순찰대의 야간 불심검문',
    description: '탐조등 불빛이 골목을 가르며 무장 헌병과 감찰 순찰대가 거리를 봉쇄했습니다. 휴대용 오리지늄 혈중 농도 측정기가 비프음을 내며 당신의 목덜미와 손목을 향합니다.',
    category: 'oripathy',
    minAge: 14,
    maxAge: 999,
    isMajor: false,
    preferredSeason: '가을',
    conditions: { isInfected: true, environment: ['이동도시 상류층', '일반 거주구', '슬럼가 및 암시장'] },
    choices: [
      {
        id: 'c_patrol_bribe_or_forge',
        label: '위조 비감염 증명서와 뒷돈(400 LMD)을 찔러 넣어 검문을 무마한다',
        description: '부패한 순찰대원의 주머니를 채워 위기를 모면합니다.',
        requirements: { lmdCost: 400 },
        diceCheck: { stat: 'intellect', difficulty: 56 },
        outcomes: {
          success: {
            text: '순찰대장이 지폐 뭉치를 코트 안주머니에 쑤셔 넣더니 측정기 전원을 끄고 지나가라 손짓했습니다. 치욕스럽지만 자유를 지켰습니다.',
            statEffects: { sanity: -6, intellect: 4 }
          },
          failure: {
            text: '돈만 빼앗기고 개머리판에 구타당한 뒤 슬럼 격리 구역으로 쫓겨났습니다!',
            statEffects: { health: -22, sanity: -16 },
            changeEnvironment: '슬럼가 및 암시장'
          }
        }
      },
      {
        id: 'c_patrol_breakthrough',
        label: '검문선을 무력으로 돌파하여 어두운 하수구로 도주한다',
        description: '체포되어 광산에 끌려가느니 사선을 뚫습니다.',
        diceCheck: { stat: 'combat', difficulty: 64 },
        outcomes: {
          success: {
            text: '전광석화 같은 몸놀림으로 검문 대열을 허물고 하수도 배수관으로 몸을 감췄습니다!',
            statEffects: { combat: 6, health: -12, sanity: -5 },
            careerExpDelta: 8
          },
          failure: {
            text: '진압봉과 석궁 세례를 맞으며 강제 노역소 호송차에 실렸다가 간신히 탈출했습니다. 온몸이 만신창이입니다.',
            statEffects: { health: -38, sanity: -22, wealth: -300 },
            crystallizationDelta: 3.5,
            changeEnvironment: '슬럼가 및 암시장'
          }
        }
      }
    ]
  },
  {
    id: 'harsh_catastrophe_sector_jettison',
    title: '【가혹한 테라】 재앙 회피 기동: 하층 거주구 긴급 절단',
    description: '전방에 초대형 오리지늄 폭풍이 발생하자, 이동도시 중앙 통제실이 추진 속도를 높이기 위해 당신이 머무는 외곽 하층 플랫폼의 연결 볼트를 폭파 절단하기로 결정했습니다! 경고 사이렌과 함께 도개교가 올라가기 시작합니다!',
    category: 'fateful',
    minAge: 10,
    maxAge: 999,
    isMajor: true,
    preferredSeason: '가을',
    conditions: { environment: ['일반 거주구', '슬럼가 및 암시장'] },
    choices: [
      {
        id: 'c_jump_jettison_bridge',
        label: '분리되는 강철 도개교 끝단을 향해 전력으로 질주하여 도약한다',
        description: '한 발이라도 늦으면 황야 한복판에 버려집니다.',
        diceCheck: { stat: 'combat', difficulty: 62 },
        outcomes: {
          criticalSuccess: {
            text: '끊어지는 크레인 와이어를 붙잡고 본체 갑판 위로 극적으로 기어올랐습니다! 뒤편에서 버려진 외곽 구획이 흑자색 폭풍 속으로 삼켜집니다.',
            statEffects: { combat: 8, luck: 4, sanity: -8 },
            careerExpDelta: 10
          },
          success: {
            text: '손바닥이 찢어지는 고통을 참으며 본체 난간을 붙잡아 살아남았습니다.',
            statEffects: { health: -18, sanity: -12 }
          },
          failure: {
            text: '도개교에서 미끄러져 분리된 구획과 함께 황야에 남겨졌습니다! 재앙 분진을 뒤집어쓰며 노마드 캠프까지 걸어야 했습니다.',
            statEffects: { health: -35, sanity: -24, wealth: -450 },
            crystallizationDelta: 4.5,
            bloodDensityDelta: 0.08,
            changeEnvironment: '황야의 노마드 캠프'
          }
        }
      },
      {
        id: 'c_seal_underground_bunker',
        label: '절단 구획 지하 밀폐 배수 벙커의 방폭문을 잠그고 폭풍이 지나가길 버틴다',
        description: '산소와 식량이 바닥나기 전에 구조대가 오길 기도합니다.',
        diceCheck: { stat: 'intellect', difficulty: 58 },
        outcomes: {
          success: {
            text: '환기 필터를 옷감으로 이중 밀봉해 분진 유입을 막아냈습니다. 사흘 뒤 지나가던 로도스 외근 수색팀에게 구조되었습니다.',
            statEffects: { intellect: 6, health: -10, sanity: -10 },
            reputationDelta: { '로도스 아일랜드': 12 }
          },
          failure: {
            text: '배관 틈새로 스며든 활성 오리지늄 분진을 마시며 극심한 고열과 공포에 시달렸습니다.',
            statEffects: { health: -30, sanity: -25 },
            crystallizationDelta: 5.5,
            bloodDensityDelta: 0.1
          }
        }
      }
    ]
  },
  {
    id: 'harsh_kazimierz_blood_pit',
    title: '【가혹한 테라】 네온사인 아래의 지하 무규칙 혈투장',
    description: '화려한 이동도시 상업지구의 지하 폐공장. 스폰서들의 유흥을 위해 채무자와 감염자들을 철창에 가두고 싸우게 하는 불법 지하 투기장에 발을 들였습니다.',
    category: 'combat',
    minAge: 17,
    maxAge: 65,
    isMajor: true,
    preferredSeason: '여름',
    choices: [
      {
        id: 'c_enter_blood_pit',
        label: '배당금이 걸린 철창 매치에 직접 출전하여 상금을 쟁취한다',
        description: '규칙도 심판도 없는 냉혹한 백병전입니다.',
        diceCheck: { stat: 'combat', difficulty: 66 },
        outcomes: {
          criticalSuccess: {
            text: '단 세 합 만에 거구의 상대를 쓰러뜨리자 관중석에서 지폐 다발이 쏟아집니다! 피 냄새 섞인 대전료를 챙겨 나왔습니다.',
            statEffects: { wealth: 1400, combat: 7, sanity: -8 },
            careerExpDelta: 12
          },
          success: {
            text: '갈비뼈에 금이 갔지만 상대를 제압하고 대전료를 받아냈습니다.',
            statEffects: { wealth: 750, combat: 4, health: -22, sanity: -10 },
            careerExpDelta: 8
          },
          failure: {
            text: '비열한 모래 뿌리기와 둔기 기습에 쓰러져 치료비만 날렸습니다.',
            statEffects: { health: -42, sanity: -18, wealth: -250 }
          }
        },
        triggerBattleEnemyId: 'wasteland_bandit'
      },
      {
        id: 'c_aid_pit_wounded',
        label: '투기장 뒷문 의무실에서 버려진 부상 투사들을 응급처치하고 빠져나온다',
        description: '돈 대신 양심과 뒷골목의 신망을 지킵니다.',
        outcomes: {
          success: {
            text: '지혈을 받은 노련한 투사가 감사를 표하며 실전 급소 방어 비결을 알려주었습니다.',
            statEffects: { combat: 3, sanity: 6, wealth: -80 },
            addBond: { name: '크비에트', role: '지하 투기장 생존자', affinity: 55 }
          }
        }
      }
    ]
  },
  {
    id: 'harsh_iberia_inquisition_lantern',
    title: '【가혹한 테라】 황폐한 해안과 재판관의 등불 심문',
    description: '잿빛 안개가 낀 해안 도시. 긴 흑의를 입은 이베리아 재판관이 핸드캐논과 등불을 들고 당신을 가로막습니다. "이방인이여, 바다의 속삭임을 들었는가? 네 눈동자의 흔들림을 증명하라."',
    category: 'fateful',
    minAge: 16,
    maxAge: 999,
    isMajor: true,
    preferredSeason: '가을',
    choices: [
      {
        id: 'c_prove_lucid_sanity',
        label: '흔들림 없는 눈빛으로 교리와 이성적 결백을 논리정연하게 진술한다',
        description: '정신력이 약하면 심해 교도 혐의를 뒤집어씁니다.',
        diceCheck: { stat: 'intellect', difficulty: 64 },
        outcomes: {
          success: {
            text: '"...오염의 징후는 없군. 밤바다를 가까이하지 마라." 재판관은 등불을 거두고 비상 식량 꾸러미를 던져주며 사라졌습니다.',
            statEffects: { intellect: 6, sanity: 5 },
            gainItemIds: ['med_emergency_spray']
          },
          failure: {
            text: '긴장한 나머지 말문이 막혀 사흘간 차가운 석조 지하실에 구금되어 혹독한 청문 조사를 받았습니다.',
            statEffects: { health: -18, sanity: -26 }
          }
        }
      },
      {
        id: 'c_flee_coastal_cliffs',
        label: '안개를 틈타 해안 암초 절벽 길로 빠르게 이탈한다',
        description: '재판소의 관할 구역을 벗어납니다.',
        diceCheck: { stat: 'luck', difficulty: 55 },
        outcomes: {
          success: {
            text: '자욱한 해무 덕분에 추적을 따돌리고 내륙 교역로에 합류했습니다.',
            statEffects: { luck: 4, health: -6 }
          },
          failure: {
            text: '날카로운 암초에 발을 헛디뎌 추락하며 큰 타박상을 입었습니다.',
            statEffects: { health: -28, sanity: -12 }
          }
        }
      }
    ]
  },
  {
    id: 'harsh_lungmen_slum_syndicate',
    title: '【가혹한 테라】 하층 구역 폭력 조직의 보호세 갈취',
    description: '장마철 빗물이 고인 뒷골목에서 쇠파이프와 쇠뇌로 무장한 지역 조직원들이 거처 문을 걷어차며 이번 달 "안전 유지비"를 두 배로 내놓으라고 협박합니다.',
    category: 'life',
    minAge: 14,
    maxAge: 999,
    isMajor: false,
    preferredSeason: '가을',
    conditions: { environment: ['일반 거주구', '슬럼가 및 암시장'] },
    choices: [
      {
        id: 'c_pay_syndicate_tax',
        label: '피해를 막기 위해 이를 악물고 350 LMD를 건넨다',
        description: '당장의 유혈 충돌을 피합니다.',
        requirements: { lmdCost: 350 },
        outcomes: {
          success: {
            text: '조직원들은 비릿하게 웃으며 지폐를 세어보고 물러갔습니다. 비참한 현실에 주먹을 꽉 쥡니다.',
            statEffects: { sanity: -10, intellect: 2 }
          }
        }
      },
      {
        id: 'c_repel_syndicate',
        label: '무기를 뽑아 들고 문턱을 넘은 폭력배들을 정면으로 제압한다',
        description: '만만한 먹잇감이 아님을 각인시킵니다.',
        diceCheck: { stat: 'combat', difficulty: 56 },
        outcomes: {
          success: {
            text: '선두에 선 행동대장을 단숨에 꺾어 빗물 바닥에 내동댕이치자, 패거리들이 혼비백산하여 달아났습니다!',
            statEffects: { combat: 5, sanity: 6 },
            careerExpDelta: 6
          },
          failure: {
            text: '수적 열세에 밀려 집기가 부서지고 지갑까지 털렸습니다.',
            statEffects: { health: -28, sanity: -15, wealth: -280 }
          }
        },
        triggerBattleEnemyId: 'wasteland_bandit'
      }
    ]
  },
  {
    id: 'harsh_columbia_clinical_subject',
    title: '【가혹한 테라】 외곽 생체 연구소의 고수익 임상 시험 전단지',
    description: '전봇대에 붙은 구인 광고. "신형 오리지늄 신경 안정제 3상 피험자 모집 — 당일 현금 1,200 LMD 지급, 면책 동의서 서명 필수." 생활고에 시달리는 이들이 줄을 서 있습니다.',
    category: 'oripathy',
    minAge: 18,
    maxAge: 70,
    isMajor: false,
    preferredSeason: '여름',
    choices: [
      {
        id: 'c_join_clinical_trial',
        label: '위험을 감수하고 면책 동의서에 서명한 뒤 주사를 맞는다',
        description: '목돈을 손에 넣지만 심각한 부작용 위험이 따릅니다.',
        diceCheck: { stat: 'luck', difficulty: 62 },
        outcomes: {
          criticalSuccess: {
            text: '놀랍게도 신약이 당신의 체질과 완벽히 맞아떨어져 아츠 감응도가 상승하고 두둑한 사례비까지 챙겼습니다!',
            statEffects: { wealth: 1300, artsAptitude: 6, health: 5 }
          },
          success: {
            text: '심한 오한과 구토가 이틀간 이어졌으나 약속된 임상 수당 1,100 LMD를 수령했습니다.',
            statEffects: { wealth: 1100, health: -16, sanity: -10 },
            bloodDensityDelta: 0.04
          },
          failure: {
            text: '투약 직후 혈관이 타들어 가는 급성 거부 반응이 일어났습니다! 연구소는 면책 조항을 들이밀며 위자료 몇 푼만 던져주고 당신을 내쫓았습니다.',
            statEffects: { wealth: 250, health: -38, sanity: -24 },
            crystallizationDelta: 5.0,
            bloodDensityDelta: 0.12
          }
        }
      },
      {
        id: 'c_ignore_clinical_flyer',
        label: '전단지를 구겨 버리고 정직한 일거리를 찾으러 발걸음을 옮긴다',
        description: '목숨을 담보로 한 돈은 거절합니다.',
        outcomes: {
          success: {
            text: '주머니는 가볍지만 내 몸의 주도권만큼은 대기업에 넘기지 않았습니다.',
            statEffects: { sanity: 4 }
          }
        }
      }
    ]
  },
  {
    id: 'harsh_suppressant_price_spike',
    title: '【가혹한 테라】 억제제 공급망 대란과 희석 앰플 파동',
    description: '국경 봉쇄로 정품 오리지늄 억제제 가격이 폭등했습니다! 체내 결정이 욱신거리며 통증이 몰려오는데, 약국 진열대는 텅 비어 있고 암시장 브로커만이 수상한 무라벨 앰플을 흔들고 있습니다.',
    category: 'oripathy',
    minAge: 12,
    maxAge: 999,
    isMajor: false,
    preferredSeason: '가을',
    conditions: { isInfected: true },
    choices: [
      {
        id: 'c_pay_blackmarket_premium',
        label: '웃돈(650 LMD)을 주고서라도 로도스 유출 정품 앰플을 수소문해 투여한다',
        description: '출혈이 크지만 안전하게 발작을 진정시킵니다.',
        requirements: { lmdCost: 650 },
        outcomes: {
          success: {
            text: '어렵게 구한 정품 억제제를 투여하자 타는 듯한 결정화 통증이 가라앉았습니다.',
            statEffects: { health: 8, sanity: 5 },
            crystallizationDelta: -1.5
          }
        }
      },
      {
        id: 'c_endure_raw_pain',
        label: '불량 약물에 손을 대느니 차가운 수건을 물고 생으로 발작을 견딘다',
        description: '돈을 아끼지만 육체와 정신이 깎여 나갑니다.',
        outcomes: {
          success: {
            text: '밤새 식은땀을 흘리며 경련을 버텨냈습니다. 피부 아래 검은 결정이 조금 더 자라난 것이 느껴집니다.',
            statEffects: { health: -24, sanity: -18 },
            crystallizationDelta: 3.2
          }
        }
      }
    ]
  },
  {
    id: 'harsh_kazdel_night_ambush',
    title: '【가혹한 테라】 잿빛 황무지의 야간 살카즈 약탈조 기습',
    description: '모닥불이 꺼져가는 새벽 3시, 바위 능선 너머에서 주술 아츠의 붉은 잔광과 함께 굶주린 탈영 용병 패거리가 야영지를 포위했습니다!',
    category: 'combat',
    minAge: 16,
    maxAge: 999,
    isMajor: true,
    preferredSeason: '가을',
    conditions: { environment: ['황야의 노마드 캠프', '슬럼가 및 암시장', '이동기지 (로도스/블랙스틸)'] },
    choices: [
      {
        id: 'c_counter_night_ambush',
        label: '기습에 당황하지 않고 엄폐물 뒤에서 역습을 가한다',
        description: '야간 백병전으로 적의 선봉을 꺾습니다.',
        diceCheck: { stat: 'combat', difficulty: 68 },
        outcomes: {
          success: {
            text: '어둠 속에서 침착하게 적 지휘관의 무기를 쳐내고 패거리를 격퇴했습니다! 버리고 간 군수품을 노획했습니다.',
            statEffects: { combat: 6, wealth: 550 },
            careerExpDelta: 10
          },
          failure: {
            text: '기습 화살에 어깨를 스치며 보급품 일부를 빼앗긴 채 불리한 교전에 돌입합니다!',
            statEffects: { health: -25, wealth: -300, sanity: -10 }
          }
        },
        triggerBattleEnemyId: 'reunion_vanguard'
      },
      {
        id: 'c_abandon_pack_escape',
        label: '배낭 일부를 미끼로 던져두고 어둠 속 협곡으로 은밀히 이탈한다',
        description: '재물 손실을 감수하고 목숨을 보전합니다.',
        diceCheck: { stat: 'intellect', difficulty: 54 },
        outcomes: {
          success: {
            text: '약탈자들이 배낭을 뒤지는 사이 기척을 지우고 협곡을 빠져나왔습니다.',
            statEffects: { wealth: -250, intellect: 4 }
          },
          failure: {
            text: '자갈을 밟아 위치가 노출되는 바람에 비탈길을 구르며 도망쳐야 했습니다.',
            statEffects: { wealth: -350, health: -22, sanity: -12 }
          }
        }
      }
    ]
  },
  {
    id: 'bond_battlefield_comrade',
    title: '【대지의 인연】 폭우 속 폐허에서 마주친 동료',
    description: '오리지늄 산성비를 피해 숨어든 폐건물 처마 아래. 부상당한 팔에 붕대를 감고 있던 한 방랑 실무자가 경계를 풀고 당신에게 건빵과 수통을 건넵니다. 밤새 서로의 살아온 이야기를 나누며 깊은 신뢰가 싹틉니다.',
    category: 'life',
    minAge: 15,
    maxAge: 999,
    isMajor: false,
    preferredSeason: '가을',
    choices: [
      {
        id: 'c_forge_comrade_bond',
        label: '비상약과 식량을 나누고 앞으로 서로의 등 뒤를 맡기기로 약조한다',
        description: '가혹한 테라에서 생사를 함께할 소중한 인연을 맺습니다.',
        outcomes: {
          success: {
            text: '"살아서 다시 보자고. 네가 부르면 어디든 달려갈 테니." 차가운 대지 위에서 든든한 동반자를 얻었습니다.',
            statEffects: { sanity: 14, combat: 3 },
            careerExpDelta: 6,
            addBond: { name: '레온', role: '맹세를 나눈 전우', affinity: 65 }
          }
        }
      },
      {
        id: 'c_keep_lone_distance',
        label: '테라에서 정은 곧 약점이다. 짧은 인사만 남기고 새벽에 홀로 떠난다',
        description: '고독하지만 흔들림 없는 단독 행보를 택합니다.',
        outcomes: {
          success: {
            text: '상실의 아픔을 겪지 않기 위해 스스로 고독을 택했습니다. 발걸음은 가볍지만 가슴 한구석이 서늘합니다.',
            statEffects: { intellect: 4, sanity: -4 },
            careerExpDelta: 4
          }
        }
      }
    ]
  },
  {
    id: 'bond_oripathy_parting',
    title: '【대지의 인연】 검은 결정으로 스러져가는 동료의 마지막 밤',
    description: '오랫동안 당신과 생사고락을 함께해 온 소중한 인연이 말기 광석병 급성 발작으로 쓰러졌습니다. 호흡할 때마다 잿빛 원석 분진이 피어오르고, 동료는 떨리는 손으로 당신의 소매를 붙잡습니다. "내 몸이 부서지기 전에... 멀리 떨어져 줘..."',
    category: 'oripathy',
    minAge: 18,
    maxAge: 999,
    isMajor: true,
    preferredSeason: '가을',
    conditions: { requiresLivingBond: true },
    choices: [
      {
        id: 'c_save_bond_suppressant',
        label: '보유 중인 로도스 정품 억제제와 응급 수술비(900 LMD)를 총동원해 생명을 붙잡는다',
        description: '정품 억제제 1개와 900 LMD를 소모하여 기적적인 연명을 시도합니다.',
        requirements: { itemCost: { itemId: 'med_rhodes_suppressant', count: 1 }, lmdCost: 900 },
        diceCheck: { stat: 'luck', difficulty: 52 },
        outcomes: {
          success: {
            text: '필사적인 투약과 밤샘 간호 끝에 급성 결정화 확산이 기적처럼 멈췄습니다! 동료는 눈물을 흘리며 당신의 손을 맞잡았습니다.',
            statEffects: { sanity: 18, luck: 4 },
            reputationDelta: { '로도스 아일랜드': 15 }
          },
          failure: {
            text: '모든 약물과 자금을 쏟아부었으나 이미 장기를 파고든 결정을 막기엔 너무 늦었습니다... 동료는 당신의 품에서 평온한 미소를 남기고 조용히 눈을 감았습니다.',
            statEffects: { sanity: -22 },
            loseRandomBondReason: '급성 광석병 합병증으로 당신의 품에서 영면'
          }
        }
      },
      {
        id: 'c_stay_until_end',
        label: '분진 감염의 위험을 무릅쓰고 마지막 숨이 멎을 때까지 손을 잡아준다',
        description: '떠나는 인연이 외롭지 않도록 최후를 배웅하고 유지를 이어받습니다.',
        outcomes: {
          success: {
            text: '"고마워... 너와 함께한 계절들이 내 인생 최고의 행운이었어." 동료는 검은 결정 가루가 되어 흩어졌고, 남겨진 낡은 무기와 유품이 당신의 결의를 다잡게 합니다.',
            statEffects: { sanity: -26, combat: 6, artsAptitude: 5 },
            crystallizationDelta: 2.0,
            bloodDensityDelta: 0.04,
            loseRandomBondReason: '말기 광석병 결정화로 유품을 남기고 산화'
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_arts_spark (손끝에서 튄 불꽃)
  // ------------------------------------------
  {
    "id": "child_arts_spark",
    "title": "손끝에서 튄 불꽃",
    "description": "어린 시절 모닥불 곁에서 장난을 치던 중, 손끝에서 기이한 오리지늄 아츠 불꽃이 타올랐습니다. 어른들이 놀란 눈으로 당신을 바라봅니다.",
    "category": "life",
    "minAge": 4,
    "maxAge": 9,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "c_spark_practice",
        "label": "호기심을 품고 아츠의 감각을 비밀리에 수련한다",
        "description": "손끝의 따스한 온기를 통제하는 훈련을 시작합니다.",
        "outcomes": {
          "success": {
            "text": "어린 나이에 기초적인 아츠 감각을 체득했습니다. 불꽃의 흐름이 익숙해집니다.",
            "statEffects": {
              "artsAptitude": 6,
              "intellect": 2
            }
          }
        }
      },
      {
        "id": "c_spark_hide",
        "label": "광석병으로 오해받을까 두려워 불꽃을 황급히 끈다",
        "description": "자신의 능력을 숨기고 평범한 아이처럼 행동합니다.",
        "outcomes": {
          "success": {
            "text": "신중하고 침착한 성격을 기르고 불필요한 의심을 피했습니다.",
            "statEffects": {
              "intellect": 4,
              "sanity": 4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_slug_companion (진흙 속의 둥근 친구)
  // ------------------------------------------
  {
    "id": "child_slug_companion",
    "title": "진흙 속의 둥근 친구",
    "description": "비 온 뒤 골목길 웅덩이에서 길 잃은 어린 변이 오리지늄 슬러그 한 마리가 꼬물거리고 있습니다.",
    "category": "life",
    "minAge": 5,
    "maxAge": 10,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "c_slug_pet",
        "label": "조심스럽게 야채 부스러기를 먹이며 돌보아 준다",
        "description": "슬러그와 따뜻한 교감을 나눕니다.",
        "outcomes": {
          "success": {
            "text": "슬러그는 작은 푸른 껍질을 부비며 당신을 따랐습니다. 생명에 대한 애정을 배웁니다.",
            "statEffects": {
              "sanity": 6,
              "luck": 2
            }
          }
        }
      },
      {
        "id": "c_slug_poke",
        "label": "나뭇가지로 쿡쿡 찔러보며 반응을 시험한다",
        "description": "야생 생물의 반응 속도와 점액 분비를 관찰합니다.",
        "outcomes": {
          "success": {
            "text": "슬러그가 토해낸 약산성 점액을 피해내며 반사신경을 길렀습니다.",
            "statEffects": {
              "combat": 3,
              "intellect": 2
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_leithanien_cellist (첨탑 음악원의 오디션)
  // ------------------------------------------
  {
    "id": "child_leithanien_cellist",
    "title": "첨탑 음악원의 오디션",
    "description": "라이타니엔 양식의 웅장한 음악원에서 견습생 모집을 위한 공개 청음회를 열었습니다. 화려한 첼로와 바이올린 소리가 울려 퍼집니다.",
    "category": "life",
    "minAge": 7,
    "maxAge": 12,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "c_leithanien_play",
        "label": "악보를 따라 바이올린 현을 진지하게 켠다",
        "description": "음률 아츠의 기초가 되는 음감을 발휘합니다.",
        "outcomes": {
          "success": {
            "text": "교관이 당신의 음감에 감탄하며 미소를 지었습니다. 감수성과 아츠 잠재력이 피어납니다.",
            "statEffects": {
              "artsAptitude": 5,
              "intellect": 3
            }
          }
        }
      },
      {
        "id": "c_leithanien_listen",
        "label": "연주를 감상하며 악기의 기계 구조를 관찰한다",
        "description": "복잡한 현악기의 조율 메커니즘을 분석합니다.",
        "outcomes": {
          "success": {
            "text": "정교한 음향 공학의 원리를 깨달았습니다.",
            "statEffects": {
              "intellect": 5,
              "sanity": 2
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_sargon_caravan (사막의 낙타몰이 카라반)
  // ------------------------------------------
  {
    "id": "child_sargon_caravan",
    "title": "사막의 낙타몰이 카라반",
    "description": "사르곤 사막의 오아시스 마을을 지나는 거대한 대상단이 나타났습니다. 낙타 방울 소리와 이국적인 향신료 향이 진동합니다.",
    "category": "life",
    "minAge": 6,
    "maxAge": 11,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "c_caravan_help",
        "label": "상인들을 도와 물가마니와 짐 꾸러미를 나른다",
        "description": "무거운 짐을 나르며 체력을 단련합니다.",
        "outcomes": {
          "success": {
            "text": "상단 주인이 고마워하며 달콤한 사탕과 동전 몇 닢을 쥐여주었습니다.",
            "statEffects": {
              "health": 6,
              "wealth": 40
            }
          }
        }
      },
      {
        "id": "c_caravan_map",
        "label": "낙타몰이꾼 노인에게 사막의 비밀 지도를 묻는다",
        "description": "오아시스와 모래폭풍을 피하는 길을 익힙니다.",
        "outcomes": {
          "success": {
            "text": "황야 지형과 별자리 방향을 분별하는 생존 지식을 전수받았습니다.",
            "statEffects": {
              "intellect": 4,
              "combat": 2
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_checkpoint_patrol (거리의 이동도시 방역 검문)
  // ------------------------------------------
  {
    "id": "child_checkpoint_patrol",
    "title": "거리의 이동도시 방역 검문",
    "description": "도시 방역대원들이 차가운 눈빛으로 거리를 봉쇄하고 신분증과 체표 오리지늄 결정을 검사하기 시작합니다.",
    "category": "oripathy",
    "minAge": 8,
    "maxAge": 13,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "c_checkpoint_calm",
        "label": "침착하게 검진기 앞에 서서 협조한다",
        "description": "당황하지 않고 규정을 준수합니다.",
        "outcomes": {
          "success": {
            "text": "\"이상 무. 통과.\" 차가운 스탬프가 찍혔고, 공포 속에서도 평정심을 지켜냈습니다.",
            "statEffects": {
              "sanity": 5,
              "intellect": 2
            }
          }
        }
      },
      {
        "id": "c_checkpoint_help_other",
        "label": "겁에 질려 우는 옆집 어린아이를 달래며 함께 통과한다",
        "description": "타인을 배려하는 따스한 용기를 발휘합니다.",
        "outcomes": {
          "success": {
            "text": "아이의 부모가 눈물을 흘리며 감사를 표했습니다. 이웃과의 유대가 싹틉니다.",
            "statEffects": {
              "sanity": 4,
              "luck": 3
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_rhodes_medic_encounter (흰 코트의 순회 의사)
  // ------------------------------------------
  {
    "id": "child_rhodes_medic_encounter",
    "title": "흰 코트의 순회 의사",
    "description": "황야의 임시 진료소에서 로도스 아일랜드 문장이 새겨진 흰 코트를 입은 순회 의사가 아픈 사람들을 돌보고 있습니다.",
    "category": "life",
    "minAge": 6,
    "maxAge": 12,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "c_medic_bandage",
        "label": "의사의 조수로 나서 붕대와 소독약을 건넨다",
        "description": "의료 현장에서 기초 위생 수칙을 배웁니다.",
        "outcomes": {
          "success": {
            "text": "의사는 미소 지으며 상처를 소독하고 감염을 막는 법을 친절히 가르쳐주었습니다.",
            "statEffects": {
              "intellect": 5,
              "sanity": 4
            }
          }
        }
      },
      {
        "id": "c_medic_candy",
        "label": "진료를 마친 뒤 의사가 건넨 비타민 사탕을 받는다",
        "description": "의료진의 온기에 마음의 평안을 얻습니다.",
        "outcomes": {
          "success": {
            "text": "상큼한 사탕의 맛과 함께, 언젠가 사람들을 구하는 이가 되겠다는 생각을 품었습니다.",
            "statEffects": {
              "sanity": 8
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_black_market_clock (암시장의 분해된 태엽 시계)
  // ------------------------------------------
  {
    "id": "child_black_market_clock",
    "title": "암시장의 분해된 태엽 시계",
    "description": "골목 암시장 쓰레기 더미에서 태엽 스프링이 튀어나온 고장 난 회중시계를 발견했습니다.",
    "category": "life",
    "minAge": 7,
    "maxAge": 13,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "c_clock_repair",
        "label": "핀셋과 작은 나사를 구해 부품을 하나씩 재조립한다",
        "description": "정밀 기계의 내부 구조를 끈기 있게 맞춰봅니다.",
        "outcomes": {
          "success": {
            "text": "째깍째깍! 시계 침이 다시 힘차게 돌기 시작했습니다. 손재주와 기계 이해도가 비약적으로 성장합니다.",
            "statEffects": {
              "intellect": 7
            }
          }
        }
      },
      {
        "id": "c_clock_sell",
        "label": "금속 부품을 고물상에 팔아 비상금을 마련한다",
        "description": "실용적인 자금 확보를 택합니다.",
        "outcomes": {
          "success": {
            "text": "고물상 주인이 은화 몇 닢을 던져주었습니다. 용돈이 생겼습니다.",
            "statEffects": {
              "wealth": 60
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_nomad_tracker (황야의 동물 발자국 추적)
  // ------------------------------------------
  {
    "id": "child_nomad_tracker",
    "title": "황야의 동물 발자국 추적",
    "description": "노마드 캠프 주변 모래톱에 맹수의 뾰족한 발자국과 깃털이 흩어져 있습니다. 사냥꾼들이 출동을 준비합니다.",
    "category": "combat",
    "minAge": 9,
    "maxAge": 14,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "c_track_beast",
        "label": "발자국의 깊이와 간격을 보고 짐승의 이동 방향을 짚어낸다",
        "description": "야생 추적술의 감각을 발휘합니다.",
        "outcomes": {
          "success": {
            "text": "사냥꾼들이 당신의 정확한 관찰 덕에 맹수의 기습을 막아냈습니다!",
            "statEffects": {
              "combat": 5,
              "intellect": 3
            }
          }
        }
      },
      {
        "id": "c_track_cautious",
        "label": "위험 지역임을 알리고 캠프의 방벽을 점검한다",
        "description": "안전제일주의로 경계를 늦추지 않습니다.",
        "outcomes": {
          "success": {
            "text": "캠프 경비대장이 당신의 신중함을 칭찬하며 가죽 장갑을 선물했습니다.",
            "statEffects": {
              "combat": 3,
              "health": 4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_infected_whisper (격리 구역의 검은 리본)
  // ------------------------------------------
  {
    "id": "child_infected_whisper",
    "title": "격리 구역의 검은 리본",
    "description": "높은 철조망 너머 격리 구역에서 검은 리본을 단 감염자 아이가 혼자 공놀이를 하고 있습니다.",
    "category": "oripathy",
    "minAge": 6,
    "maxAge": 12,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "c_infected_ball",
        "label": "철조망 밑으로 굴러온 공을 주워 다시 던져준다",
        "description": "편견 없이 다정한 눈빛으로 미소를 건넵니다.",
        "outcomes": {
          "success": {
            "text": "아이의 얼굴에 밝은 미소가 번졌습니다. 대지의 부조리 속에서도 인간적인 온기를 지켰습니다.",
            "statEffects": {
              "sanity": 6,
              "luck": 2
            }
          }
        }
      },
      {
        "id": "c_infected_observe",
        "label": "아이의 피부에 돋아난 검은 결정의 형태를 유심히 관찰한다",
        "description": "광석병 병리 현상의 실제 모습을 기록합니다.",
        "outcomes": {
          "success": {
            "text": "광석병의 잔혹한 침식 과정을 직접 목격하며 지식과 경각심을 얻었습니다.",
            "statEffects": {
              "intellect": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_kazimierz_wooden_sword (목검을 든 어린 기사)
  // ------------------------------------------
  {
    "id": "child_kazimierz_wooden_sword",
    "title": "목검을 든 어린 기사",
    "description": "카시미어 골목길에서 아이들이 나무 방패와 목검을 들고 기사 메이저 토너먼트 흉내를 내고 있습니다.",
    "category": "combat",
    "minAge": 7,
    "maxAge": 13,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "c_wood_duel",
        "label": "목검을 잡고 골목대장 아이에게 정정당당한 일기토를 신청한다",
        "description": "기사도의 정신으로 검술 대결에 임합니다.",
        "outcomes": {
          "success": {
            "text": "날렵한 풋워크로 승리를 거두며 골목길의 영웅이 되었습니다!",
            "statEffects": {
              "combat": 6,
              "health": 4
            }
          }
        }
      },
      {
        "id": "c_wood_cheer",
        "label": "승부의 전략과 공격 타이밍을 분석하며 조언해준다",
        "description": "전술가로서의 안목을 발휘합니다.",
        "outcomes": {
          "success": {
            "text": "당신의 코칭을 받은 약한 아이가 역전승을 거두었습니다.",
            "statEffects": {
              "intellect": 5,
              "sanity": 3
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_yan_tea_academy (백수 서당의 천자문 낭독)
  // ------------------------------------------
  {
    "id": "child_yan_tea_academy",
    "title": "백수 서당의 천자문 낭독",
    "description": "염국의 서당에서 훈장님이 죽간을 펼치고 엄숙한 목소리로 고전 시문과 대륙의 도리를 가르칩니다.",
    "category": "life",
    "minAge": 6,
    "maxAge": 12,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "c_tea_recite",
        "label": "한 글자도 틀리지 않고 낭랑하게 암송한다",
        "description": "동방 학문의 깊이를 체화합니다.",
        "outcomes": {
          "success": {
            "text": "훈장님이 흐뭇하게 수염을 쓸어내리며 고급 벼루와 먹을 선물했습니다.",
            "statEffects": {
              "intellect": 7,
              "sanity": 3
            }
          }
        }
      },
      {
        "id": "c_tea_debate",
        "label": "책에 적힌 구절의 모순에 대해 용기 있게 질문을 던진다",
        "description": "비판적 사고와 지적 호기심을 발휘합니다.",
        "outcomes": {
          "success": {
            "text": "당신의 날카로운 질문에 서당 전체가 토론의 열기로 가득 찼습니다.",
            "statEffects": {
              "intellect": 6,
              "combat": 1
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_victoria_chimney_sweep (런디니움 지붕 위의 모험)
  // ------------------------------------------
  {
    "id": "child_victoria_chimney_sweep",
    "title": "런디니움 지붕 위의 모험",
    "description": "런디니움의 높다란 붉은 벽돌 지붕에 올라서자, 거대한 증기 배기관들과 안개 낀 제국의 파노라마가 한눈에 펼쳐집니다.",
    "category": "life",
    "minAge": 8,
    "maxAge": 14,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "c_chimney_view",
        "label": "아찔한 지붕 끝 난간을 타고 걸으며 제국의 전경을 뇌리에 새긴다",
        "description": "담력과 균형 감각을 시험합니다.",
        "outcomes": {
          "success": {
            "text": "웅장한 증기 도시의 맥박을 느끼며 두려움을 이겨냈습니다.",
            "statEffects": {
              "health": 5,
              "sanity": 5
            }
          }
        }
      },
      {
        "id": "c_chimney_pigeon",
        "label": "지붕 틈새에 둥지를 튼 비둘기들에게 모이를 준다",
        "description": "잿빛 하늘 아래 작은 생명들을 보살핍니다.",
        "outcomes": {
          "success": {
            "text": "비둘기들이 푸드덕거리며 날아오르는 평화로운 광경에 마음이 정화되었습니다.",
            "statEffects": {
              "sanity": 7
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_ursus_samovar (혹한의 자작나무 숲 조난)
  // ------------------------------------------
  {
    "id": "child_ursus_samovar",
    "title": "혹한의 자작나무 숲 조난",
    "description": "땔감을 구하러 나섰다가 갑작스러운 눈보라에 갇혔습니다. 기온이 급격히 떨어지며 사방이 하얗게 지워집니다.",
    "category": "combat",
    "minAge": 8,
    "maxAge": 13,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "c_ursus_shelter",
        "label": "쓰러진 거목 밑동을 파내어 눈 동굴을 만들고 체온을 보존한다",
        "description": "북방의 생존 상식을 침착하게 실행합니다.",
        "outcomes": {
          "success": {
            "text": "눈보라가 잦아들 때까지 안전하게 버텨냈습니다. 강인한 생존력이 뼛속까지 각인됩니다.",
            "statEffects": {
              "health": 7,
              "sanity": 4
            }
          }
        }
      },
      {
        "id": "c_ursus_fire",
        "label": "부싯돌과 자작나무 껍질을 이용해 불꽃을 피워 구조 신호를 보낸다",
        "description": "연기와 불꽃으로 위치를 알립니다.",
        "outcomes": {
          "success": {
            "text": "수색대가 피어오르는 연기를 보고 달려왔습니다! 따스한 사모바르 차를 마시며 살아남았습니다.",
            "statEffects": {
              "combat": 4,
              "intellect": 4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_laterano_baking_contest (성도 어린이 사과 파이 경연)
  // ------------------------------------------
  {
    "id": "child_laterano_baking_contest",
    "title": "성도 어린이 사과 파이 경연",
    "description": "라테라노 광장에서 달콤한 축제가 열렸습니다. 아이들이 저마다 비밀 레시피로 반죽한 파이를 굽습니다.",
    "category": "life",
    "minAge": 6,
    "maxAge": 12,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "c_pie_bake",
        "label": "시나몬과 사과를 듬뿍 넣고 노릇하게 구워낸다",
        "description": "정통 디저트 제조의 솜씨를 뽐냅니다.",
        "outcomes": {
          "success": {
            "text": "수도사 심사위원들이 엄지를 치켜세웠습니다! 우승 상품으로 달콤한 과자 세트를 받았습니다.",
            "statEffects": {
              "sanity": 8,
              "luck": 3
            }
          }
        }
      },
      {
        "id": "c_pie_prank",
        "label": "설탕 대신 미량의 스파크 화약을 살짝 섞어 깜짝 파이를 만든다",
        "description": "산크타다운 화약 장난을 시도합니다.",
        "outcomes": {
          "success": {
            "text": "파이가 펑 소리와 함께 반짝였고 광장 전체가 웃음바다가 되었습니다!",
            "statEffects": {
              "artsAptitude": 4,
              "sanity": 6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_sami_bone_amulet (순록 뼈에 새긴 룬 부적)
  // ------------------------------------------
  {
    "id": "child_sami_bone_amulet",
    "title": "순록 뼈에 새긴 룬 부적",
    "description": "눈 덮인 성림을 지나던 늙은 스노우프리스트가 당신을 물끄러미 바라보더니 주머니에서 뼈 부적 하나를 꺼냅니다.",
    "category": "life",
    "minAge": 7,
    "maxAge": 13,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "c_sami_amulet_accept",
        "label": "공손히 두 손으로 부적을 받고 감사의 인사를 올린다",
        "description": "사미 영혼들의 축복을 받아들입니다.",
        "outcomes": {
          "success": {
            "text": "부적에서 은은한 온기가 전해지며 마음속 불안이 씻은 듯 사라졌습니다.",
            "statEffects": {
              "sanity": 7,
              "artsAptitude": 4
            }
          }
        }
      },
      {
        "id": "c_sami_amulet_carve",
        "label": "노인에게 룬 문자를 깎는 조각칼의 기술을 가르쳐달라 청한다",
        "description": "원초의 주술 기법을 배웁니다.",
        "outcomes": {
          "success": {
            "text": "노인은 고개를 끄덕이며 단단한 뼈에 기운을 불어넣는 법을 보여주었습니다.",
            "statEffects": {
              "intellect": 5,
              "artsAptitude": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_siracusa_opera_ticket (찢어진 오페라 초대권)
  // ------------------------------------------
  {
    "id": "child_siracusa_opera_ticket",
    "title": "찢어진 오페라 초대권",
    "description": "볼시니 오페라 극장 뒷골목 쓰레기통 옆에서 귀족들이 떨어뜨린 유효한 발코니석 티켓을 발견했습니다.",
    "category": "life",
    "minAge": 8,
    "maxAge": 14,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "c_opera_sneak",
        "label": "옷을 단정히 털고 극장 안으로 당당히 입장한다",
        "description": "우아한 음악과 배우들의 카리스마를 감상합니다.",
        "outcomes": {
          "success": {
            "text": "비극 오페라의 웅장한 선율에 전율하며 세상의 어두운 이면과 예술을 체감했습니다.",
            "statEffects": {
              "intellect": 6,
              "sanity": 4
            }
          }
        }
      },
      {
        "id": "c_opera_scalp",
        "label": "극장 앞 암표상에게 티켓을 팔아 현금을 챙긴다",
        "description": "거리의 현실적인 금전 감각을 발휘합니다.",
        "outcomes": {
          "success": {
            "text": "암표상이 두둑한 LMD를 쥐여주었습니다. 뒷골목의 생리를 배웠습니다.",
            "statEffects": {
              "wealth": 80,
              "intellect": 2
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_rim_drill_ride (채굴 육상함의 거대 드릴 탑승)
  // ------------------------------------------
  {
    "id": "child_rim_drill_ride",
    "title": "채굴 육상함의 거대 드릴 탑승",
    "description": "림 빌리톤 채굴 현장의 거대한 지층 굴착 육상함에 올라탈 수 있는 특별 견학 기회가 주어졌습니다.",
    "category": "life",
    "minAge": 8,
    "maxAge": 14,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "c_drill_pilot",
        "label": "조종석에 앉아 엔지니어 아저씨의 유압 레버 조작을 관찰한다",
        "description": "중공업 중장비의 제어 메커니즘을 배웁니다.",
        "outcomes": {
          "success": {
            "text": "대지를 뚫는 거대한 드릴의 진동이 가슴을 울렸습니다. 공학적 시야가 넓어집니다.",
            "statEffects": {
              "intellect": 6,
              "combat": 2
            }
          }
        }
      },
      {
        "id": "c_drill_ore",
        "label": "굴착된 광석 파편들 속에서 반짝이는 구리 원석을 골라낸다",
        "description": "야금학적 직관을 발휘합니다.",
        "outcomes": {
          "success": {
            "text": "순도 높은 구리 덩어리를 찾아내어 현장 감독의 칭찬을 받았습니다.",
            "statEffects": {
              "wealth": 50,
              "intellect": 3
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_lungmen_ferry_ride (용문 외곽 수상 페리 여행)
  // ------------------------------------------
  {
    "id": "child_lungmen_ferry_ride",
    "title": "용문 외곽 수상 페리 여행",
    "description": "용문 항구에서 수상 시장으로 향하는 작은 목선 페리에 올라탔습니다. 물안개 너머로 딤섬 찜통의 김이 피어오릅니다.",
    "category": "life",
    "minAge": 7,
    "maxAge": 13,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "c_ferry_market",
        "label": "수상 상인들과 흥정하며 값싸고 맛있는 간식을 사 먹는다",
        "description": "상업 도시의 활기찬 에너지를 즐깁니다.",
        "outcomes": {
          "success": {
            "text": "바삭한 완탕 튀김을 맛보며 상인들의 상술과 입담을 배웠습니다.",
            "statEffects": {
              "sanity": 6,
              "wealth": -15
            }
          }
        }
      },
      {
        "id": "c_ferry_steer",
        "label": "사공 노인에게 노 젓는 법과 조류 읽는 법을 배운다",
        "description": "수운 기술과 기초 체력을 기릅니다.",
        "outcomes": {
          "success": {
            "text": "거친 물살 속에서 노를 젓는 단단한 팔 힘을 길렀습니다.",
            "statEffects": {
              "health": 6,
              "combat": 3
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_kjerag_snow_shrine (성산의 만년설 약수)
  // ------------------------------------------
  {
    "id": "child_kjerag_snow_shrine",
    "title": "성산의 만년설 약수",
    "description": "쉐라그 성산 기슭의 오래된 사당에서 바위틈으로 솟아나는 차갑고 맑은 만년설 약수를 마셨습니다.",
    "category": "life",
    "minAge": 6,
    "maxAge": 12,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "c_kjerag_water_drink",
        "label": "경건한 마음으로 약수를 마시고 몸과 마음을 정화한다",
        "description": "성산의 영험한 기운을 받아들입니다.",
        "outcomes": {
          "success": {
            "text": "피로가 눈 녹듯 사라지고 이성과 집중력이 맑아졌습니다.",
            "statEffects": {
              "sanity": 8,
              "health": 4
            }
          }
        }
      },
      {
        "id": "c_kjerag_water_bell",
        "label": "사당 처마의 청동 풍경을 울리며 안녕을 기원한다",
        "description": "전통 신앙에 대한 존중을 표합니다.",
        "outcomes": {
          "success": {
            "text": "은은한 종소리가 설산 계곡에 울려 퍼지며 축복을 선사했습니다.",
            "statEffects": {
              "sanity": 6,
              "luck": 3
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_kazdel_ruin_scavenge (잿빛 폐허의 보물찾기)
  // ------------------------------------------
  {
    "id": "child_kazdel_ruin_scavenge",
    "title": "잿빛 폐허의 보물찾기",
    "description": "카즈델의 부서진 흑요석 기둥 사이에서 고대 살카즈의 문양이 음각된 낡은 단검 자루를 발견했습니다.",
    "category": "combat",
    "minAge": 9,
    "maxAge": 14,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "c_kazdel_blade_keep",
        "label": "녹슨 칼날을 숫돌에 갈아 자신만의 단검으로 간직한다",
        "description": "거친 폐허의 전사로서의 본능을 깨웁니다.",
        "outcomes": {
          "success": {
            "text": "서늘한 흑요석 칼날이 손에 익었습니다. 날카로운 호신 무기를 손에 넣었습니다.",
            "statEffects": {
              "combat": 6,
              "artsAptitude": 3
            }
          }
        }
      },
      {
        "id": "c_kazdel_blade_study",
        "label": "단검에 새겨진 고대 살카즈 주술 룬을 탁본으로 뜬다",
        "description": "오래된 흑마술의 기원을 학문적으로 연구합니다.",
        "outcomes": {
          "success": {
            "text": "원초적 아츠 문양의 원리를 파악했습니다.",
            "statEffects": {
              "intellect": 5,
              "artsAptitude": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_columbia_battery_experiment (오리지늄 전지 모형 폭발)
  // ------------------------------------------
  {
    "id": "child_columbia_battery_experiment",
    "title": "오리지늄 전지 모형 폭발",
    "description": "컬럼비아제 아동용 과학 실험 키트로 초소형 전동 모터를 조립하다가, 과부하로 작은 스파크가 터졌습니다!",
    "category": "life",
    "minAge": 8,
    "maxAge": 13,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "c_battery_analyze",
        "label": "그을린 회로를 분석하여 단락이 발생한 원인을 찾아낸다",
        "description": "실패 속에서 전기 공학의 교훈을 얻습니다.",
        "outcomes": {
          "success": {
            "text": "저항값과 축전기 배선의 원리를 완벽히 깨달았습니다!",
            "statEffects": {
              "intellect": 7
            }
          }
        }
      },
      {
        "id": "c_battery_extinguish",
        "label": "불꽃이 커지기 전에 젖은 걸레로 신속히 덮어 진화한다",
        "description": "위기 상황에서의 침착한 안전 대처를 실행합니다.",
        "outcomes": {
          "success": {
            "text": "화재를 완벽히 막아냈습니다. 순발력과 방화 감각을 인정받았습니다.",
            "statEffects": {
              "health": 4,
              "combat": 3
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // child_iberia_driftwood_cross (해변으로 밀려온 검은 십자가)
  // ------------------------------------------
  {
    "id": "child_iberia_driftwood_cross",
    "title": "해변으로 밀려온 검은 십자가",
    "description": "이베리아의 황폐한 해안가에서 파도에 씻겨 올라온 기이한 부식 목재 십자가를 주웠습니다. 바다의 짠 내가 진동합니다.",
    "category": "life",
    "minAge": 7,
    "maxAge": 13,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "c_iberia_cross_pray",
        "label": "해안 절벽의 작은 등대 사당에 십자가를 봉헌한다",
        "description": "바다에서 스러져간 영혼들의 넋을 기립니다.",
        "outcomes": {
          "success": {
            "text": "등대지기 노인이 당신의 갸륵한 마음에 감복하여 따뜻한 생선 죽을 대접했습니다.",
            "statEffects": {
              "sanity": 7,
              "luck": 2
            }
          }
        }
      },
      {
        "id": "c_iberia_cross_scrape",
        "label": "십자가 표면에 엉겨 붙은 검은 물질을 조심스레 긁어낸다",
        "description": "심해 생물의 흔적인지 관찰합니다.",
        "outcomes": {
          "success": {
            "text": "미지의 해양 침식 물질에 대한 경각심을 키웠습니다.",
            "statEffects": {
              "intellect": 5,
              "combat": 2
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_rhodes_trainee_exam (로도스 아일랜드 예비 대원 선발)
  // ------------------------------------------
  {
    "id": "youth_rhodes_trainee_exam",
    "title": "로도스 아일랜드 예비 대원 선발",
    "description": "황야를 순항하는 육상함 로도스 아일랜드에서 신규 현장 오퍼레이터 및 의료 연구생 선발 심사를 진행하고 있습니다.",
    "category": "career",
    "minAge": 16,
    "maxAge": 24,
    "isMajor": true,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "y_rhodes_combat",
        "label": "전술 훈련 구역에서 경호 및 기동 타격 오퍼레이터 시험을 치른다",
        "description": "강력한 물리 전투력과 실전 판단력을 입증합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 45
        },
        "outcomes": {
          "success": {
            "text": "도베르만 교관이 고개를 끄덕이며 전술 타격조 합격을 선언했습니다! 로도스의 제복을 지급받았습니다.",
            "statEffects": {
              "combat": 8,
              "health": 6,
              "sanity": 4
            }
          },
          "failure": {
            "text": "아쉽게 기준 점수에 미달했으나, 전투 훈련의 값진 피드백을 얻었습니다.",
            "statEffects": {
              "combat": 3,
              "sanity": -3
            }
          }
        }
      },
      {
        "id": "y_rhodes_medic",
        "label": "의료 분석실에서 광석병 억제제 조제 및 응급 처치 실기를 치른다",
        "description": "지략과 아츠 이론을 바탕으로 의료진 선발에 응시합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 46
        },
        "outcomes": {
          "success": {
            "text": "의료 부서 주임의 호평을 받으며 예비 의료 오퍼레이터로 선발되었습니다!",
            "statEffects": {
              "intellect": 8,
              "artsAptitude": 5,
              "sanity": 5
            }
          },
          "failure": {
            "text": "정밀 화학 분석에서 오차가 발생하여 탈락했습니다. 기초 이론을 더 다져야 합니다.",
            "statEffects": {
              "intellect": 3
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_blacksteel_cadet (블랙스틸 용병단 훈련생 입문)
  // ------------------------------------------
  {
    "id": "youth_blacksteel_cadet",
    "title": "블랙스틸 용병단 훈련생 입문",
    "description": "컬럼비아의 유력 민간 군사 기업 블랙스틸(Blacksteel Worldwide)에서 실전 전술 대원을 대규모로 모집합니다.",
    "category": "career",
    "minAge": 17,
    "maxAge": 23,
    "isMajor": true,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "y_bs_sign",
        "label": "혹독한 서약서에 서명하고 최신식 전술 방호복을 착용한다",
        "description": "전문 용병으로서의 첫걸음을 내딛습니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 48
        },
        "outcomes": {
          "success": {
            "text": "엄격한 사격 및 근접전 훈련을 우수한 성적으로 수료했습니다! 정식 계약금과 보수가 지급됩니다.",
            "statEffects": {
              "combat": 9,
              "health": 5,
              "wealth": 300
            }
          },
          "failure": {
            "text": "극단적인 체력 훈련 도중 탈진하여 보충 교육조로 밀려났습니다.",
            "statEffects": {
              "health": 2,
              "sanity": -5
            }
          }
        }
      },
      {
        "id": "y_bs_decline",
        "label": "용병의 위험성을 고려하여 자유 계약 프리랜서로 남는다",
        "description": "조직에 얽매이지 않고 독자적인 길을 모색합니다.",
        "outcomes": {
          "success": {
            "text": "자유로운 신분을 유지하며 다양한 의뢰를 선택할 유연성을 확보했습니다.",
            "statEffects": {
              "intellect": 4,
              "luck": 3
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_kazimierz_qualifier_duel (카바레리에키 예선 결투)
  // ------------------------------------------
  {
    "id": "youth_kazimierz_qualifier_duel",
    "title": "카바레리에키 예선 결투",
    "description": "카시미어 기사 메이저 토너먼트 본선 진출권을 건 공식 예선 결투가 경기장 네온 불빛 아래서 개막했습니다.",
    "category": "combat",
    "minAge": 18,
    "maxAge": 24,
    "isMajor": true,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "y_kaz_duel_rush",
        "label": "창과 검을 꼬나쥐고 전광석화의 돌격으로 상대를 제압한다",
        "description": "관중의 환호를 이끌어내는 화려한 기사 결투를 펼칩니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 50
        },
        "outcomes": {
          "success": {
            "text": "상대 기사의 방패를 산산조각 내며 통쾌한 KO 승리를 거두었습니다! 본선 시드권과 상금을 획득합니다.",
            "statEffects": {
              "combat": 10,
              "wealth": 500,
              "sanity": 8
            },
            "unlockAchievementId": "unique_silver_lance"
          },
          "failure": {
            "text": "노련한 상대의 반격에 맞아 매트에 쓰러졌습니다. 뼈아픈 패배지만 투지를 불태웁니다.",
            "statEffects": {
              "health": -15,
              "sanity": -8,
              "combat": 4
            }
          }
        }
      },
      {
        "id": "y_kaz_duel_feint",
        "label": "방패 뒤에 몸을 숨기며 상대의 스테미너가 고갈될 때까지 버틴다",
        "description": "냉철한 지구전 전술로 판정승을 노립니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 48
        },
        "outcomes": {
          "success": {
            "text": "상대가 지쳐 빈틈을 보인 순간 정밀한 일격으로 항복을 받아냈습니다!",
            "statEffects": {
              "combat": 7,
              "intellect": 6,
              "wealth": 350
            }
          },
          "failure": {
            "text": "무리한 방어 도중 방패가 찌그러지며 부상을 입었습니다.",
            "statEffects": {
              "health": -10,
              "sanity": -4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_rim_miner_apprentice (림 빌리톤 심층 갱도 착암 기사)
  // ------------------------------------------
  {
    "id": "youth_rim_miner_apprentice",
    "title": "림 빌리톤 심층 갱도 착암 기사",
    "description": "지하 수백 미터 아래에서 갑작스러운 메탄가스 누출과 암반 균열 경보가 울렸습니다. 대피 시간이 촉박합니다!",
    "category": "combat",
    "minAge": 16,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "y_rim_reinforce",
        "label": "착암기를 역회전시켜 붕괴하는 천장에 지지대를 긴급 시공한다",
        "description": "현장 지형지물과 장비를 능숙하게 다룹니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 44
        },
        "outcomes": {
          "success": {
            "text": "완벽한 긴급 지지대 설치로 갱도 붕괴를 막고 동료 광부 전원을 살려냈습니다!",
            "statEffects": {
              "combat": 7,
              "health": 5,
              "wealth": 250,
              "sanity": 5
            }
          },
          "failure": {
            "text": "낙석에 어깨를 부딪쳤지만 가까스로 비상 승강기로 탈출했습니다.",
            "statEffects": {
              "health": -12,
              "sanity": -4,
              "combat": 3
            }
          }
        }
      },
      {
        "id": "y_rim_evacuate",
        "label": "동료들을 인솔하여 비상 탈출 터널로 신속히 철수한다",
        "description": "인명 구호를 최우선으로 합니다.",
        "outcomes": {
          "success": {
            "text": "침착한 인솔 덕에 인명 피해 없이 전원 안전지대로 복귀했습니다.",
            "statEffects": {
              "intellect": 5,
              "sanity": 6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_siracusa_blood_toast (패밀리의 와인잔과 충성 맹세)
  // ------------------------------------------
  {
    "id": "youth_siracusa_blood_toast",
    "title": "패밀리의 와인잔과 충성 맹세",
    "description": "시라쿠사 유력 마피아 패밀리의 간부가 당신을 은밀한 만찬에 초대하여 권총과 붉은 와인잔을 내밉니다.",
    "category": "career",
    "minAge": 17,
    "maxAge": 24,
    "isMajor": true,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "y_siracusa_accept",
        "label": "와인을 들이키고 패밀리의 일원으로서 피의 맹세를 나눈다",
        "description": "어둠의 세계에 발을 들이고 강력한 뒷배를 얻습니다.",
        "outcomes": {
          "success": {
            "text": "\"이제 우리는 한 가족이다.\" 묵직한 맞춤 권총과 막대한 활동 자금이 주어졌습니다.",
            "statEffects": {
              "wealth": 600,
              "combat": 8,
              "sanity": -5
            }
          }
        }
      },
      {
        "id": "y_siracusa_refuse",
        "label": "정중하지만 단호하게 잔을 내려놓고 거절한다",
        "description": "자유와 양심을 지키고 위험한 제안을 거절합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 50
        },
        "outcomes": {
          "success": {
            "text": "간부는 씁쓸하게 웃으며 보내주었습니다. 위험한 음모에서 벗어났습니다.",
            "statEffects": {
              "sanity": 8,
              "intellect": 5
            }
          },
          "failure": {
            "text": "패밀리의 분노를 사 도망자 신세가 되었습니다. 황급히 볼시니를 벗어납니다.",
            "statEffects": {
              "sanity": -12,
              "combat": 4,
              "wealth": -100
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_sami_starlight_vision (설원의 신목 예언 의식)
  // ------------------------------------------
  {
    "id": "youth_sami_starlight_vision",
    "title": "설원의 신목 예언 의식",
    "description": "극북 사미의 영험한 신목 아래서 스노우프리스트들이 주관하는 성인 예언 의식에 참가했습니다.",
    "category": "fateful",
    "minAge": 16,
    "maxAge": 22,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "y_sami_commune",
        "label": "향불 연기 속에서 대지의 영혼과 교감하며 환영을 직시한다",
        "description": "원초의 영적 감응력을 극대화합니다.",
        "diceCheck": {
          "stat": "artsAptitude",
          "difficulty": 46
        },
        "outcomes": {
          "success": {
            "text": "밤하늘의 오로라가 가슴속으로 쏟아지는 듯한 계시를 받았습니다! 아츠와 정신력이 크게 도약합니다.",
            "statEffects": {
              "artsAptitude": 9,
              "sanity": 10
            }
          },
          "failure": {
            "text": "극지의 너무도 거대한 미지의 공포를 엿보아 정신적 충격을 받았습니다.",
            "statEffects": {
              "sanity": -10,
              "artsAptitude": 4
            }
          }
        }
      },
      {
        "id": "y_sami_guard",
        "label": "의식 주변의 결계를 지키며 외부의 야수 침입을 경계한다",
        "description": "전사로서 의식의 안전을 수호합니다.",
        "outcomes": {
          "success": {
            "text": "설원 늑대들의 접근을 막아내어 사제들의 깊은 신뢰를 얻었습니다.",
            "statEffects": {
              "combat": 6,
              "health": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_leithanien_salon_debut (황실 음악 살롱의 데뷔 연주)
  // ------------------------------------------
  {
    "id": "youth_leithanien_salon_debut",
    "title": "황실 음악 살롱의 데뷔 연주",
    "description": "라이타니엔 귀족들이 모인 호화로운 살롱에서 당신의 연주 차례가 돌아왔습니다. 수많은 시선이 쏠립니다.",
    "category": "life",
    "minAge": 16,
    "maxAge": 23,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "y_salon_masterpiece",
        "label": "복잡한 아츠 화음을 가미한 자작 소나타를 완벽하게 연주한다",
        "description": "예술성과 아츠 기교를 극한까지 끌어올립니다.",
        "diceCheck": {
          "stat": "artsAptitude",
          "difficulty": 50
        },
        "outcomes": {
          "success": {
            "text": "살롱 전체가 기립 박수를 보냈습니다! 선제후 가문의 후원 제의와 거액의 연주료를 받았습니다.",
            "statEffects": {
              "artsAptitude": 9,
              "wealth": 400,
              "sanity": 8
            }
          },
          "failure": {
            "text": "결정적인 순간 화음이 어긋나며 귀족들의 수군거림을 샀습니다.",
            "statEffects": {
              "sanity": -8,
              "artsAptitude": 3
            }
          }
        }
      },
      {
        "id": "y_salon_classic",
        "label": "안전하고 정석적인 고전 협주곡을 차분하게 연주한다",
        "description": "실수 없이 안정적인 호평을 확보합니다.",
        "outcomes": {
          "success": {
            "text": "단정하고 우아한 연주로 청중의 따뜻한 박수를 받았습니다.",
            "statEffects": {
              "artsAptitude": 5,
              "wealth": 150,
              "sanity": 4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_sargon_sand_scouter (모래폭풍 속의 불멸군 척후)
  // ------------------------------------------
  {
    "id": "youth_sargon_sand_scouter",
    "title": "모래폭풍 속의 불멸군 척후",
    "description": "사르곤 국경 사막에서 모래도적단이 오아시스 취락을 약탈하려 합니다. 불멸군 수비대와 함께 요격에 나섭니다.",
    "category": "combat",
    "minAge": 17,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "y_sargon_flank",
        "label": "모래언덕 뒤편으로 우회하여 도적단의 후방 보급선을 기습한다",
        "description": "사막 지형을 이용한 날카로운 기습 전술을 펼칩니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 47
        },
        "outcomes": {
          "success": {
            "text": "도적단의 수장을 단숨에 사로잡으며 전투를 대승으로 이끌었습니다!",
            "statEffects": {
              "combat": 9,
              "health": 4,
              "wealth": 300
            }
          },
          "failure": {
            "text": "모래구덩이에 발이 빠져 역습을 받았습니다. 힘겹게 퇴각했습니다.",
            "statEffects": {
              "health": -14,
              "combat": 4
            }
          }
        }
      },
      {
        "id": "y_sargon_defend",
        "label": "마을 우물 주위에 방책을 세우고 주민들을 보호한다",
        "description": "침착한 방어선 구축으로 피해를 최소화합니다.",
        "outcomes": {
          "success": {
            "text": "도적들의 침입을 완벽히 차단하고 마을 주민들의 영웅이 되었습니다.",
            "statEffects": {
              "combat": 6,
              "sanity": 6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_yan_imperial_exam (염국 과거 대리 사법관 시험)
  // ------------------------------------------
  {
    "id": "youth_yan_imperial_exam",
    "title": "염국 과거 대리 사법관 시험",
    "description": "염국 상경에서 수만 명의 인재가 운집한 가운데 국시(科擧)가 열렸습니다. 법률과 책략을 시험합니다.",
    "category": "career",
    "minAge": 18,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "y_exam_write",
        "label": "율법의 정밀함과 민생 구율책을 논리정연하게 작성한다",
        "description": "탁월한 정세 감각과 문장력을 총동원합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 52
        },
        "outcomes": {
          "success": {
            "text": "당신의 답안이 장원급제에 올랐습니다! 대리(司)의 사법 관료로 공식 임명됩니다.",
            "statEffects": {
              "intellect": 10,
              "wealth": 450,
              "sanity": 8
            }
          },
          "failure": {
            "text": "엄격한 채점 기준을 넘지 못하고 낙방했습니다. 학문의 길은 끝이 없습니다.",
            "statEffects": {
              "intellect": 5,
              "sanity": -5
            }
          }
        }
      },
      {
        "id": "y_exam_practical",
        "label": "지방 관청의 실무 서기직에 지원하여 현장 경험을 쌓는다",
        "description": "현실적인 공직 입문을 택합니다.",
        "outcomes": {
          "success": {
            "text": "성실성을 인정받아 관청 서기로 채용되었습니다. 안정적인 급여가 보장됩니다.",
            "statEffects": {
              "intellect": 5,
              "wealth": 180
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_victoria_officer_academy (빅토리아 왕립 육군사관학교 입학)
  // ------------------------------------------
  {
    "id": "youth_victoria_officer_academy",
    "title": "빅토리아 왕립 육군사관학교 입학",
    "description": "빅토리아 제국의 심장 런디니움에서 증기 기사단과 보병 연대를 지휘할 정예 사관생도를 선발합니다.",
    "category": "career",
    "minAge": 18,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "y_academy_tactics",
        "label": "도상 전술 시뮬레이션과 화력 지휘 평가에 임한다",
        "description": "제국 군사학 이론과 리더십을 증명합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 49
        },
        "outcomes": {
          "success": {
            "text": "빅토리아 왕립 사관학교에 장학생으로 수석 입학했습니다!",
            "statEffects": {
              "intellect": 8,
              "combat": 6,
              "sanity": 6
            }
          },
          "failure": {
            "text": "귀족 자제들의 파벌 견제와 엄격한 커트라인에 막혀 탈락했습니다.",
            "statEffects": {
              "intellect": 3,
              "sanity": -4
            }
          }
        }
      },
      {
        "id": "y_academy_engineer",
        "label": "증기 기사단의 공학 정비 및 장비 관리 보직에 지원한다",
        "description": "실용적인 기계 공학 기술을 펼칩니다.",
        "outcomes": {
          "success": {
            "text": "증기 기관의 구조를 능숙히 다루며 공병대 엔지니어로 배속되었습니다.",
            "statEffects": {
              "intellect": 6,
              "combat": 4,
              "wealth": 120
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_ursus_iron_guard_drill (우르수스 돌격대 혹한 훈련)
  // ------------------------------------------
  {
    "id": "youth_ursus_iron_guard_drill",
    "title": "우르수스 돌격대 혹한 훈련",
    "description": "영하 40도의 영구동토에서 우르수스 황제군의 정예 기동 훈련이 개시되었습니다. 한계를 시험받습니다.",
    "category": "combat",
    "minAge": 17,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "y_ursus_march",
        "label": "완전 군장을 메고 선두에서 눈보라를 뚫고 진군한다",
        "description": "우르수스인 특유의 강인한 육체적 끈기를 발휘합니다.",
        "diceCheck": {
          "stat": "health",
          "difficulty": 52
        },
        "outcomes": {
          "success": {
            "text": "낙오자 없이 훈련을 완수하며 중대장의 찬사와 훈장을 수여받았습니다!",
            "statEffects": {
              "health": 10,
              "combat": 8,
              "sanity": 5
            }
          },
          "failure": {
            "text": "동상과 탈진으로 쓰러져 야전 의무대로 후송되었습니다.",
            "statEffects": {
              "health": -15,
              "sanity": -6,
              "combat": 3
            }
          }
        }
      },
      {
        "id": "y_ursus_bivouac",
        "label": "설상 참호를 파고 방어 거점을 구축하는 공병 작업을 주도한다",
        "description": "효율적인 거점 구축으로 부대원의 생존율을 높입니다.",
        "outcomes": {
          "success": {
            "text": "견고한 방어 진지를 구축하여 동계 방어 훈련 우수 부대로 선정되었습니다.",
            "statEffects": {
              "combat": 6,
              "intellect": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_laterano_notary_intern (라테라노 공증소 실무 수습)
  // ------------------------------------------
  {
    "id": "youth_laterano_notary_intern",
    "title": "라테라노 공증소 실무 수습",
    "description": "라테라노 공증소에서 산크타들의 수호총 등록 대장과 유언장을 공증하는 수습 서기를 모집합니다.",
    "category": "life",
    "minAge": 17,
    "maxAge": 23,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "y_notary_audit",
        "label": "엄격한 율법 조항을 대조하며 총기 규약 서류를 무결하게 처리한다",
        "description": "공증소의 신성한 규칙을 빈틈없이 준수합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 47
        },
        "outcomes": {
          "success": {
            "text": "공증관의 두터운 신임을 얻으며 공식 공증관보 인장을 하사받았습니다.",
            "statEffects": {
              "intellect": 8,
              "sanity": 6,
              "wealth": 200
            }
          },
          "failure": {
            "text": "수많은 복잡한 조항들 사이에서 오류를 범해 시말서를 썼습니다.",
            "statEffects": {
              "sanity": -5,
              "intellect": 2
            }
          }
        }
      },
      {
        "id": "y_notary_maintenance",
        "label": "보관된 수호총의 오리지늄 코어와 격발 장치를 정밀 소제한다",
        "description": "총기 메커니즘을 학습합니다.",
        "outcomes": {
          "success": {
            "text": "정밀 총기 분해 결합 기술을 완전히 마스터했습니다.",
            "statEffects": {
              "combat": 5,
              "intellect": 4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_iberia_coastal_sentry (이베리아 해안가 야간 초병)
  // ------------------------------------------
  {
    "id": "youth_iberia_coastal_sentry",
    "title": "이베리아 해안가 야간 초병",
    "description": "칠흑 같은 안개 속에서 바다의 소리가 기괴하게 일그러집니다. 감시탑 계측기가 이상 수치를 가리킵니다.",
    "category": "combat",
    "minAge": 18,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "y_sentry_lantern",
        "label": "등대 조명탄을 쏘아 올려 갯벌로 기어오르는 시본의 형상을 밝힌다",
        "description": "두려움을 이겨내고 경보를 울립니다.",
        "diceCheck": {
          "stat": "sanity",
          "difficulty": 48
        },
        "outcomes": {
          "success": {
            "text": "조명탄 빛 아래서 침투하던 변이체 무리가 드러났고, 재판관 방어선이 즉각 화력을 집중했습니다!",
            "statEffects": {
              "sanity": 6,
              "combat": 6,
              "wealth": 250
            }
          },
          "failure": {
            "text": "바다의 검은 속삭임에 순간 이성을 잃고 환각에 시달렸습니다.",
            "statEffects": {
              "sanity": -14,
              "health": -6
            }
          }
        }
      },
      {
        "id": "y_sentry_retreat",
        "label": "초소를 폐쇄하고 방어벽 안쪽으로 신속히 신호탄을 던지며 후퇴한다",
        "description": "규정된 철수 수칙을 침착히 따릅니다.",
        "outcomes": {
          "success": {
            "text": "조기 경보 덕에 주민들이 무사히 방공호로 대피했습니다.",
            "statEffects": {
              "combat": 4,
              "intellect": 4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_lungmen_finance_trainee (용문 투자상사 수습 브로커)
  // ------------------------------------------
  {
    "id": "youth_lungmen_finance_trainee",
    "title": "용문 투자상사 수습 브로커",
    "description": "용문 증권거래소의 전광판이 폭락과 폭등으로 붉게 물듭니다. 거대한 자본의 파도가 출렁입니다.",
    "category": "life",
    "minAge": 19,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "y_finance_arbitrage",
        "label": "환율과 원자재 시세 차익을 노리고 과감한 레버리지 매수를 건다",
        "description": "고위험 고수익의 금융 승부를 겁니다.",
        "diceCheck": {
          "stat": "luck",
          "difficulty": 48
        },
        "outcomes": {
          "success": {
            "text": "대박이 터졌습니다! 막대한 LMD 수익을 실현하며 상사의 스타 브로커로 부상했습니다!",
            "statEffects": {
              "wealth": 1200,
              "intellect": 6,
              "sanity": 6
            }
          },
          "failure": {
            "text": "순식간에 시세가 반대로 꺾이며 손실을 입었습니다. 자본의 냉혹함을 배웠습니다.",
            "statEffects": {
              "wealth": -300,
              "sanity": -8
            }
          }
        }
      },
      {
        "id": "y_finance_steady",
        "label": "우량 이동도시 국채와 식량 선물에 분산 투자한다",
        "description": "안정적인 포트폴리오를 유지합니다.",
        "outcomes": {
          "success": {
            "text": "시장 변동성 속에서도 견고한 배당금 수익을 확보했습니다.",
            "statEffects": {
              "wealth": 250,
              "intellect": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_kjerag_mountain_patrol (성산 만년설 조난자 수색)
  // ------------------------------------------
  {
    "id": "youth_kjerag_mountain_patrol",
    "title": "성산 만년설 조난자 수색",
    "description": "성산 기슭에서 돌풍으로 인해 등산 카라반이 눈사태에 매몰되었다는 무전이 들어왔습니다.",
    "category": "combat",
    "minAge": 18,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "y_kjerag_probe",
        "label": "탐침과 삽을 들고 눈사태 현장 중심부로 직행하여 생존자를 파낸다",
        "description": "살을 에는 추위 속에서 생명을 건 구조에 나섭니다.",
        "diceCheck": {
          "stat": "health",
          "difficulty": 48
        },
        "outcomes": {
          "success": {
            "text": "기적적으로 매몰된 일가족 3명을 전원 무사히 구조했습니다! 카란 무역회사의 포상금을 받았습니다.",
            "statEffects": {
              "health": 7,
              "sanity": 8,
              "wealth": 300
            }
          },
          "failure": {
            "text": "2차 눈사태에 휘말려 부상을 입었으나 동료들에 의해 구출되었습니다.",
            "statEffects": {
              "health": -14,
              "sanity": -5,
              "combat": 3
            }
          }
        }
      },
      {
        "id": "y_kjerag_beacon",
        "label": "열 감지 드론과 비상 신호 횃불로 안전 수색 경로를 개척한다",
        "description": "체계적인 수색 지휘를 맡습니다.",
        "outcomes": {
          "success": {
            "text": "안전한 탈출로를 확보하여 구조대의 진입을 성공적으로 지원했습니다.",
            "statEffects": {
              "intellect": 6,
              "sanity": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_kazdel_mercenary_contract (카즈델 방랑 용병대 합류)
  // ------------------------------------------
  {
    "id": "youth_kazdel_mercenary_contract",
    "title": "카즈델 방랑 용병대 합류",
    "description": "잿빛 황무지에서 살카즈 용병 대장이 피 묻은 가죽 주머니를 던지며 위험천만한 호위 임무를 제안합니다.",
    "category": "combat",
    "minAge": 17,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "y_kazdel_accept",
        "label": "주머니를 받아 쥐고 용병단 선봉대에 합류한다",
        "description": "전장의 화약고 속으로 뛰어듭니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 48
        },
        "outcomes": {
          "success": {
            "text": "치열한 야간 기습을 완벽히 격퇴하고 풍성한 전리품과 거액의 보수를 챙겼습니다!",
            "statEffects": {
              "combat": 10,
              "wealth": 450,
              "sanity": -3
            }
          },
          "failure": {
            "text": "격전 중 파편상을 입었습니다. 가까스로 목숨을 건졌습니다.",
            "statEffects": {
              "health": -16,
              "sanity": -6,
              "combat": 5
            }
          }
        }
      },
      {
        "id": "y_kazdel_scout",
        "label": "정면 충돌을 피하고 야간 정찰 및 함정 설치 임무만 수임한다",
        "description": "생존율이 높은 실리적 역할을 맡습니다.",
        "outcomes": {
          "success": {
            "text": "적의 기동 경로에 부비트랩을 설치하여 부대의 안전한 진군을 도왔습니다.",
            "statEffects": {
              "combat": 5,
              "intellect": 5,
              "wealth": 200
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_columbia_pioneer_claim (프론티어 황야 토지 점유권 분쟁)
  // ------------------------------------------
  {
    "id": "youth_columbia_pioneer_claim",
    "title": "프론티어 황야 토지 점유권 분쟁",
    "description": "컬럼비아 서부 개척지에서 광산 개발권을 두고 두 개척민 무장 집단이 총을 겨누고 대치 중입니다.",
    "category": "life",
    "minAge": 19,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "y_pioneer_arbitrate",
        "label": "공화국 개척법 규정을 들이밀며 중재 협상을 이끈다",
        "description": "법률적 지식과 담판 능력을 발휘합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 47
        },
        "outcomes": {
          "success": {
            "text": "양측의 지분 분할 합의를 이끌어내며 유혈 사태를 막았습니다! 중재 수수료를 챙깁니다.",
            "statEffects": {
              "intellect": 8,
              "wealth": 350,
              "sanity": 5
            }
          },
          "failure": {
            "text": "흥분한 무장 괴한들의 총격전이 벌어져 빗맞은 유탄에 부상을 입었습니다.",
            "statEffects": {
              "health": -12,
              "sanity": -5
            }
          }
        }
      },
      {
        "id": "y_pioneer_claim",
        "label": "혼란을 틈타 버려진 외곽 시굴권 지분을 선점 등록한다",
        "description": "재빠른 기회 포착으로 자산을 확보합니다.",
        "outcomes": {
          "success": {
            "text": "소규모 희토류 광맥이 발견되어 안정적인 지분 배당을 받게 되었습니다.",
            "statEffects": {
              "wealth": 400,
              "intellect": 4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_oripathy_first_lesion (피부 위에 돋아난 검은 결정)
  // ------------------------------------------
  {
    "id": "youth_oripathy_first_lesion",
    "title": "피부 위에 돋아난 검은 결정",
    "description": "어느 날 아침 거울을 보던 중, 쇄골 부근에 작은 검은색 오리지늄 결정이 돋아나 있는 것을 발견했습니다... 광석병의 징후입니다!",
    "category": "oripathy",
    "minAge": 16,
    "maxAge": 24,
    "isMajor": true,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "y_lesion_suppress",
        "label": "전 재산을 털어 긴급 정품 억제제를 구입해 정맥에 투여한다",
        "description": "신속한 초기 진압으로 결정 확산을 억제합니다.",
        "requirements": {
          "lmdCost": 200
        },
        "outcomes": {
          "success": {
            "text": "차가운 약물이 퍼져나가며 결정의 통증이 가라앉았습니다. 병세의 급격한 악화를 막았습니다.",
            "statEffects": {
              "sanity": -6,
              "health": 4
            },
            "crystallizationDelta": 0.5,
            "bloodDensityDelta": 0.02
          }
        }
      },
      {
        "id": "y_lesion_arts",
        "label": "체내에 스며든 결정의 아츠 공명 에너지를 역이용해 잠재력을 개방한다",
        "description": "감염의 위험을 아츠 파워의 성장으로 치환합니다.",
        "outcomes": {
          "success": {
            "text": "날카로운 통증과 함께 전신의 아츠 회로가 각성했습니다! 그러나 결정화율이 상승했습니다.",
            "statEffects": {
              "artsAptitude": 12,
              "sanity": -10
            },
            "crystallizationDelta": 2.5,
            "bloodDensityDelta": 0.05
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_first_romance_encounter (황야의 이동 식당에서 맺은 첫사랑)
  // ------------------------------------------
  {
    "id": "youth_first_romance_encounter",
    "title": "황야의 이동 식당에서 맺은 첫사랑",
    "description": "먼지 날리는 황야의 휴게소 식당에서, 따뜻한 눈빛으로 수프를 건네주던 다정한 사람과 마주쳤습니다.",
    "category": "fateful",
    "minAge": 17,
    "maxAge": 23,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "y_romance_confess",
        "label": "용기를 내어 식탁 맞은편에 앉아 대화를 나누고 연락처를 교환한다",
        "description": "마음의 문을 열고 진솔한 감정을 전합니다.",
        "outcomes": {
          "success": {
            "text": "밤이 깊도록 테라의 살아온 이야기를 나누며 둘만의 소중한 인연을 맺었습니다.",
            "statEffects": {
              "sanity": 12
            },
            "addBond": {
              "name": "엘리시아",
              "role": "황야의 방랑 여행자",
              "affinity": 60
            }
          }
        }
      },
      {
        "id": "y_romance_glance",
        "label": "수줍은 미소만 남긴 채 마음속 고운 추억으로 간직한다",
        "description": "지나가는 인연의 아름다움을 간직합니다.",
        "outcomes": {
          "success": {
            "text": "가슴 한구석이 따스해지는 온기를 품고 다시 험난한 여정에 올랐습니다.",
            "statEffects": {
              "sanity": 6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_clandestine_intel_courier (국경 밀수선의 비밀 전령)
  // ------------------------------------------
  {
    "id": "youth_clandestine_intel_courier",
    "title": "국경 밀수선의 비밀 전령",
    "description": "암시장 정보 브로커가 밀봉된 외교 기밀 파우치를 건네며 국경 순찰선을 피해 이동도시로 배달해달라 요청합니다.",
    "category": "life",
    "minAge": 18,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "y_courier_stealth",
        "label": "수로를 헤엄쳐 야간 순찰선의 서치라이트를 피해 침투한다",
        "description": "은신과 잠영 기술을 총동원합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 46
        },
        "outcomes": {
          "success": {
            "text": "추적자들을 완벽히 따돌리고 배달을 완수했습니다! 거액의 성공 보수가 주어집니다.",
            "statEffects": {
              "wealth": 500,
              "combat": 5,
              "intellect": 4
            }
          },
          "failure": {
            "text": "순찰대에 발각되어 파우치를 강에 던져버리고 가까스로 탈출했습니다.",
            "statEffects": {
              "health": -10,
              "sanity": -6
            }
          }
        }
      },
      {
        "id": "y_courier_inspect",
        "label": "파우치를 열어 내용물을 확인하고 정세를 파악한다",
        "description": "정보의 가치를 분석하여 더 큰 이득을 노립니다.",
        "outcomes": {
          "success": {
            "text": "고위 관료의 비리 증거를 파악하여 양측으로부터 거액의 입막음 대가를 받았습니다.",
            "statEffects": {
              "wealth": 700,
              "intellect": 6,
              "sanity": -4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_underground_racing_circuit (이동도시 하부 무규칙 바이크 레이싱)
  // ------------------------------------------
  {
    "id": "youth_underground_racing_circuit",
    "title": "이동도시 하부 무규칙 바이크 레이싱",
    "description": "이동도시 하층의 폐쇄된 파이프라인 구간에서 불법 개조 고속 바이크 레이스가 열립니다. 막대한 판돈이 걸려 있습니다.",
    "category": "combat",
    "minAge": 17,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "y_race_speed",
        "label": "니트로 부스터를 개방하고 급커브 파이프 구간을 전속력으로 주파한다",
        "description": "아찔한 스피드와 한계 제어력을 시험합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 49
        },
        "outcomes": {
          "success": {
            "text": "체커기를 1위로 통과했습니다! 관중들의 환호와 함께 우승 상금을 거머쥡니다!",
            "statEffects": {
              "wealth": 600,
              "combat": 7,
              "sanity": 6
            }
          },
          "failure": {
            "text": "벽면에 바이크가 부딪치며 굴렀습니다. 타박상을 입었습니다.",
            "statEffects": {
              "health": -15,
              "sanity": -5,
              "wealth": -100
            }
          }
        }
      },
      {
        "id": "y_race_mechanic",
        "label": "출전 선수들의 바이크를 튜닝해주고 정비 수수료를 챙긴다",
        "description": "안전한 기술자로서의 실리를 취합니다.",
        "outcomes": {
          "success": {
            "text": "당신이 손본 바이크가 우승하며 실력 있는 메카닉으로 입소문이 났습니다.",
            "statEffects": {
              "wealth": 250,
              "intellect": 6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_nomad_sandcat_hunting (황야의 야생 모래고양이 조우)
  // ------------------------------------------
  {
    "id": "youth_nomad_sandcat_hunting",
    "title": "황야의 야생 모래고양이 조우",
    "description": "황야의 바위산 그늘에서 날카로운 발톱을 가진 야생 모래고양이 어미와 새끼들이 상처를 입고 으르렁거립니다.",
    "category": "life",
    "minAge": 16,
    "maxAge": 23,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "y_sandcat_heal",
        "label": "말린 고기와 지혈제를 천천히 바위 앞에 내려놓으며 안심시킨다",
        "description": "야생 동물과의 비폭력적 교감을 시도합니다.",
        "outcomes": {
          "success": {
            "text": "모래고양이는 경계를 풀고 상처를 치료받았습니다. 야생의 보은으로 희귀 약초를 물어다 주었습니다.",
            "statEffects": {
              "sanity": 8,
              "luck": 3
            }
          }
        }
      },
      {
        "id": "y_sandcat_tame",
        "label": "민첩한 몸놀림으로 어미를 제압하고 새끼 한 마리를 반려수로 길들인다",
        "description": "충직한 황야의 사냥 파트너를 확보합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 46
        },
        "outcomes": {
          "success": {
            "text": "새끼 모래고양이가 당신을 따르기 시작했습니다! 든든한 정찰 동반자가 생겼습니다.",
            "statEffects": {
              "combat": 6,
              "sanity": 5
            }
          },
          "failure": {
            "text": "어미의 날카로운 발톱에 손등을 할퀴이고 물러났습니다.",
            "statEffects": {
              "health": -8,
              "sanity": -3
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_salvage_tech_espionage (버려진 실험실의 기밀 디스크)
  // ------------------------------------------
  {
    "id": "youth_salvage_tech_espionage",
    "title": "버려진 실험실의 기밀 디스크",
    "description": "황야의 버려진 연구 시설 잔해에서 암호화된 컬럼비아제 실험 데이터 디스크를 발굴했습니다.",
    "category": "life",
    "minAge": 18,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "y_salvage_crack",
        "label": "해킹 툴을 이용해 암호를 해독하고 군사 기술 청사진을 추출한다",
        "description": "고도의 컴퓨터 공학적 지식을 투입합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 50
        },
        "outcomes": {
          "success": {
            "text": "암호 해독 성공! 최첨단 오리지늄 장비 설계도를 확보하여 학문적 깨달음을 얻었습니다.",
            "statEffects": {
              "intellect": 11,
              "artsAptitude": 4
            }
          },
          "failure": {
            "text": "자폭 방어 루틴이 작동하여 데이터가 지워졌습니다. 아쉽게 허탕을 쳤습니다.",
            "statEffects": {
              "intellect": 3
            }
          }
        }
      },
      {
        "id": "y_salvage_broker",
        "label": "내용을 보지 않고 암시장 데이터 브로커에게 통째로 넘긴다",
        "description": "위험을 피해 즉각 현금화합니다.",
        "outcomes": {
          "success": {
            "text": "브로커가 만족스러운 표정으로 거액의 현금을 지불했습니다.",
            "statEffects": {
              "wealth": 500
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_wandering_bard_tale (방랑 음유시인의 테라 대서사시)
  // ------------------------------------------
  {
    "id": "youth_wandering_bard_tale",
    "title": "방랑 음유시인의 테라 대서사시",
    "description": "황야의 주점에서 하프를 든 음유시인이 테라 이전의 고대 문명과 별들의 이야기를 노래하고 있습니다.",
    "category": "fateful",
    "minAge": 17,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "y_bard_listen",
        "label": "시인 곁에 밤새 앉아 고대 문명의 신화와 전설을 경청한다",
        "description": "대륙의 숨겨진 역사를 배우고 시야를 넓힙니다.",
        "outcomes": {
          "success": {
            "text": "거짓된 하늘과 과거 인류에 관한 서사시에 깊은 영감을 받았습니다. 지혜가 맑아집니다.",
            "statEffects": {
              "intellect": 7,
              "sanity": 6
            }
          }
        }
      },
      {
        "id": "y_bard_duet",
        "label": "자신의 악기를 꺼내 시인의 멜로디에 화음을 맞춰준다",
        "description": "음악적 소통으로 깊은 교감을 이룹니다.",
        "outcomes": {
          "success": {
            "text": "두 사람의 협주가 주점 손님들을 감동시켰습니다. 주점 주인이 숙식을 무료로 제공했습니다.",
            "statEffects": {
              "artsAptitude": 6,
              "sanity": 6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // youth_catastrophe_early_warning (재앙전령의 다급한 비상경보)
  // ------------------------------------------
  {
    "id": "youth_catastrophe_early_warning",
    "title": "재앙전령의 다급한 비상경보",
    "description": "오리지늄 먼지 냄새를 맡은 재앙전령이 이동도시 외곽 초소로 달려와 거대 재앙 구름의 접근을 알립니다.",
    "category": "combat",
    "minAge": 18,
    "maxAge": 24,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "y_cat_evac",
        "label": "사이렌을 울리고 이동도시 하부 블록 주민들의 피난을 지휘한다",
        "description": "신속하고 체계적인 민간인 대피를 돕습니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 46
        },
        "outcomes": {
          "success": {
            "text": "단 한 명의 낙오자 없이 피난 블록을 안전 구역으로 이동시켰습니다! 영웅으로 칭송받습니다.",
            "statEffects": {
              "sanity": 8,
              "intellect": 5,
              "combat": 4
            }
          },
          "failure": {
            "text": "혼란 속에서 탈출로가 막혔으나 다행히 재앙 구름이 비껴갔습니다.",
            "statEffects": {
              "sanity": -6,
              "health": -4
            }
          }
        }
      },
      {
        "id": "y_cat_reinforce",
        "label": "이동도시 외벽 장갑판 잠금장치를 점검하고 충격 완화 작업을 돕는다",
        "description": "구조물의 물리적 방호력을 강화합니다.",
        "outcomes": {
          "success": {
            "text": "외벽이 튼튼하게 고정되어 재앙 낙진 충격을 성공적으로 흡수했습니다.",
            "statEffects": {
              "combat": 5,
              "health": 6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_catastrophe_rescue_corps (제18차 재앙 구호 전진기지)
  // ------------------------------------------
  {
    "id": "adult_catastrophe_rescue_corps",
    "title": "제18차 재앙 구호 전진기지",
    "description": "거대한 오리지늄 재앙이 이동도시 외곽 섹터를 덮쳤습니다. 건물이 붕괴하고 파편이 비처럼 쏟아지는 가운데 긴급 인명 구조대가 편성됩니다.",
    "category": "combat",
    "minAge": 25,
    "maxAge": 48,
    "isMajor": true,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "a_rescue_lead",
        "label": "구조대의 선봉에 서서 붕괴 위험 건물 잔해로 돌입해 생존자를 구출한다",
        "description": "자신의 목숨을 걸고 잔해 속 민간인들을 구출합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 54
        },
        "outcomes": {
          "success": {
            "text": "매몰되었던 시민 14명을 기적적으로 구출해냈습니다! 대륙 전역에 당신의 용기가 보도됩니다.",
            "statEffects": {
              "combat": 10,
              "health": -8,
              "sanity": 12,
              "wealth": 600
            },
            "unlockAchievementId": "rare_lone_wolf"
          },
          "failure": {
            "text": "2차 붕괴 파편에 깔려 심각한 부상을 입었습니다. 가까스로 동료들에게 구조되었습니다.",
            "statEffects": {
              "health": -25,
              "sanity": -10,
              "combat": 4
            }
          }
        }
      },
      {
        "id": "a_rescue_contain",
        "label": "아츠 방호벽을 전개하여 오리지늄 분진 낙진이 임시 피난소로 번지는 것을 막는다",
        "description": "강력한 방어 아츠로 구조 거점을 지켜냅니다.",
        "diceCheck": {
          "stat": "artsAptitude",
          "difficulty": 52
        },
        "outcomes": {
          "success": {
            "text": "견고한 아츠 실드가 수천 톤의 낙진을 차단했습니다! 수백 명의 피난민이 안전을 확보했습니다.",
            "statEffects": {
              "artsAptitude": 11,
              "sanity": 8,
              "wealth": 500
            }
          },
          "failure": {
            "text": "아츠 과부하로 이성에 심한 두통이 닥쳤습니다. 실드가 일부 깨졌습니다.",
            "statEffects": {
              "sanity": -15,
              "artsAptitude": 4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_yan_censor_secret_audit (염국 사서의 은밀한 특별 감사)
  // ------------------------------------------
  {
    "id": "adult_yan_censor_secret_audit",
    "title": "염국 사서의 은밀한 특별 감사",
    "description": "염국 대리(司)의 특별 사법 감사관이 파견되어 거대 상단의 오리지늄 밀수와 관료 뇌물 장부를 전수 조사합니다.",
    "category": "career",
    "minAge": 28,
    "maxAge": 49,
    "isMajor": true,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "a_yan_audit_firm",
        "label": "권력자들의 협박과 회유를 단호히 물리치고 비리를 낱낱이 밝혀낸다",
        "description": "정의와 법치에 입각해 부패 카르텔을 일망타진합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 55
        },
        "outcomes": {
          "success": {
            "text": "수백만 LMD 규모의 국고 횡령을 밝혀내어 황실의 표창과 직위 승급을 받았습니다!",
            "statEffects": {
              "intellect": 12,
              "wealth": 800,
              "sanity": 10
            }
          },
          "failure": {
            "text": "부패 관료들의 역공작에 휘말려 좌천 위기에 처했습니다. 힘겨운 법정 공방이 이어집니다.",
            "statEffects": {
              "sanity": -12,
              "wealth": -200
            }
          }
        }
      },
      {
        "id": "a_yan_audit_bribe",
        "label": "거대 상단이 은밀히 건넨 금괴 상자를 묵인하고 조사를 종결한다",
        "description": "막대한 부를 챙기고 타협의 길을 걷습니다.",
        "outcomes": {
          "success": {
            "text": "거액의 뇌물이 비밀 계좌로 입금되었습니다. 양심의 가책은 무거운 금화로 덮습니다.",
            "statEffects": {
              "wealth": 1800,
              "sanity": -14
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_leithanien_spire_intrigue (금빛 첨탑의 암투와 마왕의 그림자)
  // ------------------------------------------
  {
    "id": "adult_leithanien_spire_intrigue",
    "title": "금빛 첨탑의 암투와 마왕의 그림자",
    "description": "라이타니엔 선제후 연합의 비밀 만찬회 도중, 마왕의 잔당이 심어둔 음률 암살 아츠가 발동했습니다!",
    "category": "combat",
    "minAge": 26,
    "maxAge": 47,
    "isMajor": true,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "a_spire_counter_arts",
        "label": "음악의 불협화음을 파악하고 역위상 아츠 공명으로 암살 주문을 무력화한다",
        "description": "고도의 음률 아츠 지식으로 치명적인 주술을 해체합니다.",
        "diceCheck": {
          "stat": "artsAptitude",
          "difficulty": 54
        },
        "outcomes": {
          "success": {
            "text": "맑은 고음의 공명과 함께 암살 주술이 산산이 부서졌습니다! 선제후들의 절대적 은인이 되었습니다.",
            "statEffects": {
              "artsAptitude": 12,
              "wealth": 1000,
              "sanity": 10
            }
          },
          "failure": {
            "text": "음파 폭발의 충격을 정면으로 받아 청력에 이상이 생기고 내상을 입었습니다.",
            "statEffects": {
              "health": -18,
              "sanity": -8,
              "artsAptitude": 5
            }
          }
        }
      },
      {
        "id": "a_spire_shield_body",
        "label": "귀족 대표의 앞을 가로막고 무거운 은제 식탁을 방패 삼아 보호한다",
        "description": "물리적 기동력으로 VIP를 안전하게 탈출시킵니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 50
        },
        "outcomes": {
          "success": {
            "text": "식탁을 관통하는 암살 파편을 막아내고 귀족을 탈출시켰습니다. 황실 기사 훈장을 받았습니다.",
            "statEffects": {
              "combat": 8,
              "health": -5,
              "wealth": 700
            }
          },
          "failure": {
            "text": "파편에 어깨를 관통당하며 쓰러졌습니다.",
            "statEffects": {
              "health": -20,
              "sanity": -6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_sargon_sand_rebellion (사막 파디샤의 폭정에 맞선 봉기)
  // ------------------------------------------
  {
    "id": "adult_sargon_sand_rebellion",
    "title": "사막 파디샤의 폭정에 맞선 봉기",
    "description": "사르곤 남방에서 탐욕스러운 파디샤의 과도한 수탈에 분노한 부족 연합이 모래성채를 포위했습니다.",
    "category": "fateful",
    "minAge": 27,
    "maxAge": 48,
    "isMajor": true,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "a_sargon_lead_rebels",
        "label": "사막 부족 전사들의 선두에서 성벽 성문을 파쇄하고 봉기를 지휘한다",
        "description": "자유를 위한 거대한 민중 봉기에 동참합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 53
        },
        "outcomes": {
          "success": {
            "text": "성문을 부수고 성채를 함락시켰습니다! 사막의 해방자이자 대부족장으로 추대받았습니다.",
            "statEffects": {
              "combat": 12,
              "health": 6,
              "wealth": 900,
              "sanity": 10
            }
          },
          "failure": {
            "text": "불멸군 정예 수비대의 집중 화망에 걸려 봉기군이 후퇴했습니다.",
            "statEffects": {
              "health": -22,
              "sanity": -10,
              "combat": 5
            }
          }
        }
      },
      {
        "id": "a_sargon_peace_treaty",
        "label": "양측의 지도부를 중재하여 과세 감면과 평화 조약을 이끌어낸다",
        "description": "유혈 사태를 막는 노련한 외교 협상을 성사시킵니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 52
        },
        "outcomes": {
          "success": {
            "text": "파디샤의 양보를 받아내어 부족민들의 권익을 평화롭게 보장했습니다.",
            "statEffects": {
              "intellect": 11,
              "sanity": 8,
              "wealth": 500
            }
          },
          "failure": {
            "text": "양측 모두로부터 박쥐 같은 첩자라는 의심을 사며 추방당했습니다.",
            "statEffects": {
              "sanity": -12,
              "wealth": -150
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_deep_sea_abyss_patrol (이베리아 심해 감시탑의 붉은 달)
  // ------------------------------------------
  {
    "id": "adult_deep_sea_abyss_patrol",
    "title": "이베리아 심해 감시탑의 붉은 달",
    "description": "대침묵의 바다 한가운데 위치한 해상 감시탑에 붉은 달이 뜨고, 거대한 해사 무리가 수면 위로 솟구칩니다.",
    "category": "combat",
    "minAge": 28,
    "maxAge": 49,
    "isMajor": true,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "a_abyss_cannon",
        "label": "등대 요새의 대구경 함포를 조준하여 괴수들의 군집에 일제 포격을 가한다",
        "description": "막강한 요새 화력으로 해사의 상륙을 분쇄합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 55
        },
        "outcomes": {
          "success": {
            "text": "거대한 화염과 함께 심해 괴수들이 격퇴되었습니다! 이베리아 종교재판소의 최고 표창을 받았습니다.",
            "statEffects": {
              "combat": 12,
              "sanity": 8,
              "wealth": 750
            }
          },
          "failure": {
            "text": "해사의 산성 분비물에 함포가 녹아내렸습니다. 요새 지하실로 긴급 대피했습니다.",
            "statEffects": {
              "health": -20,
              "sanity": -12
            }
          }
        }
      },
      {
        "id": "a_abyss_seal",
        "label": "고대 에기르의 음파 발신기를 활성화하여 바다 괴물들을 심해로 퇴각시킨다",
        "description": "잃어버린 고대 해양 기술을 가동합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 53
        },
        "outcomes": {
          "success": {
            "text": "특수 주파수 음파가 작동하자 해사들이 공포에 질려 바다 깊은 곳으로 가라앉았습니다.",
            "statEffects": {
              "intellect": 11,
              "artsAptitude": 6,
              "sanity": 10
            }
          },
          "failure": {
            "text": "발신기가 역공명을 일으켜 뇌에 극심한 통증을 유발했습니다.",
            "statEffects": {
              "sanity": -18,
              "health": -8
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_columbia_patent_trial (라인 랩 특허 침해 소송과 기업 인수)
  // ------------------------------------------
  {
    "id": "adult_columbia_patent_trial",
    "title": "라인 랩 특허 침해 소송과 기업 인수",
    "description": "컬럼비아 연방 법원에서 당신이 개발한 오리지늄 에너지 특허를 두고 거대 대기업이 적대적 특허 분쟁을 걸어왔습니다.",
    "category": "life",
    "minAge": 30,
    "maxAge": 48,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "a_patent_fight",
        "label": "최고의 로펌 변호인단을 선임하고 기술 원천 데이터를 법정에 제출한다",
        "description": "치밀한 법리 공방으로 기술 독점권을 수호합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 52
        },
        "outcomes": {
          "success": {
            "text": "승소했습니다! 대기업으로부터 막대한 특허 침해 배상금과 로열티를 받아냈습니다!",
            "statEffects": {
              "wealth": 1500,
              "intellect": 8,
              "sanity": 6
            }
          },
          "failure": {
            "text": "거대 자본의 로비에 밀려 특허를 헐값에 매각당했습니다.",
            "statEffects": {
              "wealth": -400,
              "sanity": -10
            }
          }
        }
      },
      {
        "id": "a_patent_compromise",
        "label": "공동 연구 개발 계약을 맺고 기술 라이선스 지분을 확보한다",
        "description": "실용적인 윈-윈 타협책을 택합니다.",
        "outcomes": {
          "success": {
            "text": "대기업의 연구 인프라와 자본을 등에 업고 안정적인 배당을 획득했습니다.",
            "statEffects": {
              "wealth": 800,
              "intellect": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_ursus_labor_camp_revolt (혹한의 광산 수용소 대탈출)
  // ------------------------------------------
  {
    "id": "adult_ursus_labor_camp_revolt",
    "title": "혹한의 광산 수용소 대탈출",
    "description": "우르수스 극비 감염자 광산 수용소에서 처절한 수형자 폭동이 발생했습니다. 통제 불능의 불길이 치솟습니다.",
    "category": "combat",
    "minAge": 27,
    "maxAge": 49,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "a_camp_liberate",
        "label": "철창을 부수고 감염자 수형자들의 탈출 통로를 열어 황야로 인도한다",
        "description": "억압받는 감염자들의 자유를 위해 총을 듭니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 53
        },
        "outcomes": {
          "success": {
            "text": "수백 명의 감염자들을 눈보라 속으로 탈출시키는 데 성공했습니다! 리유니온과 황야의 전설이 됩니다.",
            "statEffects": {
              "combat": 10,
              "sanity": 10,
              "health": -10
            }
          },
          "failure": {
            "text": "황제군 근위대의 장갑차 화망에 포위되어 가까스로 혼자 탈출했습니다.",
            "statEffects": {
              "health": -22,
              "sanity": -12,
              "combat": 5
            }
          }
        }
      },
      {
        "id": "a_camp_suppress",
        "label": "폭동의 확산을 막고 수용소 광산 시설의 폭발을 방지한다",
        "description": "대형 폭발 참사를 막기 위해 안전 밸브를 차단합니다.",
        "outcomes": {
          "success": {
            "text": "오리지늄 제련로의 연쇄 폭발을 막아내어 도시 전체의 괴멸을 방지했습니다.",
            "statEffects": {
              "combat": 7,
              "intellect": 6,
              "wealth": 400
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_victoria_duke_conspiracy (런디니움 대공작의 비밀 회동)
  // ------------------------------------------
  {
    "id": "adult_victoria_duke_conspiracy",
    "title": "런디니움 대공작의 비밀 회동",
    "description": "빅토리아의 왕위 공백기 속에서, 유력 대공작이 비밀 지하 살롱으로 당신을 호출해 제국 내전 개입을 타진합니다.",
    "category": "life",
    "minAge": 30,
    "maxAge": 48,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "a_duke_join",
        "label": "대공작의 진영에 가담하여 정계와 군사령부의 핵심 참모로 취임한다",
        "description": "제국의 최고 권력 핵심부로 진입합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 53
        },
        "outcomes": {
          "success": {
            "text": "대공작의 전폭적인 신임을 얻으며 제국의 군비 조달권을 장악했습니다!",
            "statEffects": {
              "wealth": 1200,
              "intellect": 9,
              "sanity": 4
            }
          },
          "failure": {
            "text": "살카즈 군사위원회의 첩자에게 회동 정보가 유출되어 감시망에 올랐습니다.",
            "statEffects": {
              "sanity": -10,
              "wealth": -300
            }
          }
        }
      },
      {
        "id": "a_duke_neutral",
        "label": "빅토리아의 평민들과 자치단의 편에 서서 중립을 선언한다",
        "description": "권력 다툼에 휘말리지 않고 민생을 지킵니다.",
        "outcomes": {
          "success": {
            "text": "런디니움 시민 자치단의 두터운 신망과 보호를 받게 되었습니다.",
            "statEffects": {
              "sanity": 8,
              "luck": 4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_kazimierz_corporate_buyout (상업연합회 이사회의 적대적 인수합병)
  // ------------------------------------------
  {
    "id": "adult_kazimierz_corporate_buyout",
    "title": "상업연합회 이사회의 적대적 인수합병",
    "description": "카시미어 대형 엔터테인먼트 및 기사 스폰서 지주회사의 지분을 대량 확보할 기회가 찾아왔습니다.",
    "category": "life",
    "minAge": 29,
    "maxAge": 49,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "a_buyout_hostile",
        "label": "기관 투자자들을 포섭해 이사회 의결권을 장악하고 기업을 인수한다",
        "description": "자본주의 카시미어의 대주주로 등극합니다.",
        "diceCheck": {
          "stat": "wealth",
          "difficulty": 50
        },
        "outcomes": {
          "success": {
            "text": "적대적 M&A 대성공! 상업연합회 주요 이사진의 한 자리와 막대한 배당을 거머쥡니다!",
            "statEffects": {
              "wealth": 2000,
              "intellect": 8,
              "sanity": 6
            }
          },
          "failure": {
            "text": "방어 세력의 포이즌 필(Poison Pill) 전략에 걸려 주가가 폭락했습니다.",
            "statEffects": {
              "wealth": -600,
              "sanity": -10
            }
          }
        }
      },
      {
        "id": "a_buyout_safe",
        "label": "소수 지분만 매입하여 매년 안전한 배당금을 수령한다",
        "description": "무리하지 않고 꾸준한 불로소득을 챙깁니다.",
        "outcomes": {
          "success": {
            "text": "기사 토너먼트 중계 수익의 알짜 지분을 안정적으로 확보했습니다.",
            "statEffects": {
              "wealth": 600,
              "intellect": 4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_laterano_heresy_inquiry (타락한 산크타의 사제 심문)
  // ------------------------------------------
  {
    "id": "adult_laterano_heresy_inquiry",
    "title": "타락한 산크타의 사제 심문",
    "description": "율법을 어기고 암시장에 수호총 부품을 밀매하던 파계 산크타가 공증소 특수요원들에게 체포되었습니다.",
    "category": "life",
    "minAge": 28,
    "maxAge": 48,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "a_heresy_interrogate",
        "label": "교황령 율법 조항을 엄밀히 적용하여 배후의 무기 밀수 조직망을 자백받는다",
        "description": "냉철한 심문 기술로 거대 카르텔의 전모를 밝힙니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 51
        },
        "outcomes": {
          "success": {
            "text": "테라 전역으로 뻗어나가려던 불법 총기 유통망을 일망타진했습니다! 교황청의 성스러운 은총을 받았습니다.",
            "statEffects": {
              "intellect": 9,
              "sanity": 7,
              "wealth": 500
            }
          },
          "failure": {
            "text": "용의자가 침묵을 지키다 스스로 헤일로를 파괴하여 단서가 끊겼습니다.",
            "statEffects": {
              "sanity": -8,
              "intellect": 3
            }
          }
        }
      },
      {
        "id": "a_heresy_redeem",
        "label": "그의 절박했던 사정을 듣고 참회의 기도를 인도하며 관대한 처벌을 건의한다",
        "description": "자비와 구원의 길을 제시합니다.",
        "outcomes": {
          "success": {
            "text": "그는 눈물을 흘리며 개과천선했고, 빼돌렸던 기밀 자금을 자진 헌납했습니다.",
            "statEffects": {
              "sanity": 10,
              "wealth": 350
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_sami_daemon_incursion (빙결 방어선을 뚫은 붕괴체의 포효)
  // ------------------------------------------
  {
    "id": "adult_sami_daemon_incursion",
    "title": "빙결 방어선을 뚫은 붕괴체의 포효",
    "description": "극북 사미의 설원 너머에서 현실의 법칙을 왜곡하는 검은 붕괴체(Daemon) 군단이 방어선 요새를 덮쳤습니다!",
    "category": "combat",
    "minAge": 27,
    "maxAge": 49,
    "isMajor": true,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "a_daemon_slay",
        "label": "혹한의 냉기 속에서 아츠와 무기를 극한까지 폭발시켜 붕괴체의 핵을 꿰뚫는다",
        "description": "존재 자체를 위협하는 미지의 공포에 맞서 목숨을 건 혈전을 치릅니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 58
        },
        "outcomes": {
          "success": {
            "text": "붕괴체의 거대한 핵이 파괴되며 현실 왜곡이 멎었습니다! 극북의 모든 전사들이 당신의 이름을 연호합니다!",
            "statEffects": {
              "combat": 15,
              "health": -15,
              "sanity": -5,
              "wealth": 1000
            },
            "unlockAchievementId": "legend_calamity_slayer"
          },
          "failure": {
            "text": "붕괴체의 암흑 안개에 닿아 극심한 정신 오염과 신체 부상을 입었습니다... 간신히 탈출했습니다.",
            "statEffects": {
              "health": -35,
              "sanity": -25,
              "combat": 6
            }
          }
        }
      },
      {
        "id": "a_daemon_rune_barrier",
        "label": "스노우프리스트들과 원을 그리고 고대 사미 룬 결계를 펼쳐 적을 봉인한다",
        "description": "원초의 주술로 결계를 재구축합니다.",
        "diceCheck": {
          "stat": "artsAptitude",
          "difficulty": 55
        },
        "outcomes": {
          "success": {
            "text": "신목의 성스러운 빛이 빙결 결계를 수복하여 붕괴체들을 북방 너머로 밀어냈습니다!",
            "statEffects": {
              "artsAptitude": 14,
              "sanity": 8,
              "health": -10
            }
          },
          "failure": {
            "text": "결계의 룬이 깨지며 튕겨 나갔습니다. 방어선 외곽 거점이 함락되었습니다.",
            "statEffects": {
              "artsAptitude": 5,
              "sanity": -20,
              "health": -18
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_siracusa_don_assassination (밀라노 패밀리 보스의 피습)
  // ------------------------------------------
  {
    "id": "adult_siracusa_don_assassination",
    "title": "밀라노 패밀리 보스의 피습",
    "description": "시라쿠사 최고의 마피아 패밀리 대부가 오페라 극장 앞에서 총격을 받았습니다! 12개 패밀리의 전면전이 터지기 직전입니다.",
    "category": "combat",
    "minAge": 26,
    "maxAge": 48,
    "isMajor": true,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "a_siracusa_revenge",
        "label": "쌍권총을 뽑아 들고 암살범들의 퇴로를 차단하며 적들의 배후를 추적한다",
        "description": "피에는 피로 응징하는 시라쿠사의 법도를 집행합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 54
        },
        "outcomes": {
          "success": {
            "text": "암살단을 전원 처단하고 배후 패밀리의 음모를 밝혀냈습니다! 패밀리의 최고 간부로 승격됩니다.",
            "statEffects": {
              "combat": 12,
              "wealth": 900,
              "sanity": 4
            }
          },
          "failure": {
            "text": "매복한 스나이퍼의 총탄에 복부를 관통당했습니다. 사경을 헤매다 구출되었습니다.",
            "statEffects": {
              "health": -30,
              "sanity": -10,
              "combat": 5
            }
          }
        }
      },
      {
        "id": "a_siracusa_broker_peace",
        "label": "사법부와 중립 패밀리들을 소집하여 전면전을 막을 긴급 정전 회담을 주재한다",
        "description": "피비린내 나는 참극을 막기 위한 지략을 펼칩니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 54
        },
        "outcomes": {
          "success": {
            "text": "냉철한 중재안으로 12개 패밀리의 무력 충돌을 막아냈습니다. 도시의 진정한 막후 실력자가 되었습니다.",
            "statEffects": {
              "intellect": 13,
              "sanity": 10,
              "wealth": 600
            }
          },
          "failure": {
            "text": "양측의 극단주의자들에게 회담장이 습격당했습니다.",
            "statEffects": {
              "sanity": -14,
              "health": -15
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_rim_deep_crust_collapse (지하 2000미터 지층 함몰 사고)
  // ------------------------------------------
  {
    "id": "adult_rim_deep_crust_collapse",
    "title": "지하 2000미터 지층 함몰 사고",
    "description": "림 빌리톤 채굴 구역 최심부에서 단층 미끄러짐으로 수십 기의 굴착기가 지하에 고립되었습니다.",
    "category": "combat",
    "minAge": 26,
    "maxAge": 49,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "a_rim_blast",
        "label": "특수 지향성 오리지늄 폭약을 정밀 발파하여 생존자 구출 터널을 뚫는다",
        "description": "위험한 암반 발파 기술을 완벽하게 통제합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 51
        },
        "outcomes": {
          "success": {
            "text": "단 한 번의 폭파로 완벽한 탈출로를 개척했습니다! 광업협회로부터 거액의 포상금과 지분을 받았습니다.",
            "statEffects": {
              "intellect": 9,
              "wealth": 700,
              "sanity": 6
            }
          },
          "failure": {
            "text": "충격파로 추가 낙석이 발생하여 발파조가 부상을 입었습니다.",
            "statEffects": {
              "health": -18,
              "sanity": -6
            }
          }
        }
      },
      {
        "id": "a_rim_pump",
        "label": "지하수 유입을 차단하기 위해 고압 배수 펌프 라인을 지휘한다",
        "description": "침수 위기를 막아내어 광산을 보전합니다.",
        "outcomes": {
          "success": {
            "text": "성공적인 배수 작업으로 주요 채굴 설비를 건져냈습니다.",
            "statEffects": {
              "combat": 6,
              "intellect": 6,
              "wealth": 350
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_lungmen_black_slip_heist (웨이 옌우 총독부 금고 도난 사변)
  // ------------------------------------------
  {
    "id": "adult_lungmen_black_slip_heist",
    "title": "웨이 옌우 총독부 금고 도난 사변",
    "description": "용문 상부 코어의 특수 금고에서 테라 열강들의 외교 밀약이 담긴 흑전(黑箋) 문서가 강탈당했습니다.",
    "category": "life",
    "minAge": 27,
    "maxAge": 48,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "a_lungmen_chase",
        "label": "근위국 특수수사대와 함께 옥상 환기구를 타고 도주하는 괴도를 추적한다",
        "description": "날렵한 도심 기동전으로 범인을 코너에 몰아넣습니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 52
        },
        "outcomes": {
          "success": {
            "text": "항구 컨테이너 위에서 괴도를 격투 끝에 제압하고 문서를 전량 회수했습니다! 총독의 특별 표창을 받았습니다.",
            "statEffects": {
              "combat": 10,
              "intellect": 6,
              "wealth": 600,
              "sanity": 6
            }
          },
          "failure": {
            "text": "괴도가 투척한 섬광 연막탄에 시야를 잃고 놓쳤습니다.",
            "statEffects": {
              "sanity": -8,
              "health": -6
            }
          }
        }
      },
      {
        "id": "a_lungmen_broker_buy",
        "label": "암시장 정보망을 가동하여 유출된 문서를 중간에서 가로채 회수한다",
        "description": "지하 세계의 자금력과 정보력으로 해결합니다.",
        "outcomes": {
          "success": {
            "text": "문서가 외교 분쟁으로 터지기 직전에 조용히 회수하여 사태를 수습했습니다.",
            "statEffects": {
              "intellect": 8,
              "wealth": 400
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_kazdel_civil_war_standoff (살카즈 군사위원회 전초기지 격돌)
  // ------------------------------------------
  {
    "id": "adult_kazdel_civil_war_standoff",
    "title": "살카즈 군사위원회 전초기지 격돌",
    "description": "카즈델 국경에서 테레시스의 군사위원회 정예 부대와 자유 용병 연합이 대치하며 일촉즉발의 위기가 고조됩니다.",
    "category": "combat",
    "minAge": 25,
    "maxAge": 48,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "a_kazdel_clash",
        "label": "용병 대열의 중앙에서 대검을 휘두르며 적의 전차 장갑을 절단한다",
        "description": "살카즈의 피가 끓어오르는 정면 격돌에 뛰어듭니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 55
        },
        "outcomes": {
          "success": {
            "text": "적의 지휘관을 베어 넘기고 전초기지를 점령했습니다! 막대한 전리품을 획득합니다.",
            "statEffects": {
              "combat": 13,
              "health": -10,
              "wealth": 800
            }
          },
          "failure": {
            "text": "적의 중장갑 보병들에게 밀려 중상을 입고 후퇴했습니다.",
            "statEffects": {
              "health": -25,
              "sanity": -10,
              "combat": 5
            }
          }
        }
      },
      {
        "id": "a_kazdel_flank_ambush",
        "label": "폐허의 지형을 이용해 적의 측면 탄약고를 기습 폭파한다",
        "description": "전술적 침투 폭파로 승기를 잡습니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 52
        },
        "outcomes": {
          "success": {
            "text": "거대한 화염과 함께 적의 탄약고가 폭발하며 적 부대가 퇴각했습니다!",
            "statEffects": {
              "intellect": 10,
              "combat": 7,
              "wealth": 500
            }
          },
          "failure": {
            "text": "기습이 발각되어 치열한 총격전을 벌이며 간신히 탈출했습니다.",
            "statEffects": {
              "health": -15,
              "sanity": -6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_kjerag_trade_monopoly_skirmish (설산 국경 철도 무력 분쟁)
  // ------------------------------------------
  {
    "id": "adult_kjerag_trade_monopoly_skirmish",
    "title": "설산 국경 철도 무력 분쟁",
    "description": "쉐라그의 근대화 철도 독점권을 노린 인접 열강의 무장 용병들이 설산 철도 터널을 불법 점거했습니다.",
    "category": "combat",
    "minAge": 26,
    "maxAge": 48,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "a_kjerag_tunnel_raid",
        "label": "설상 기습조를 이끌고 환기구를 통해 터널 내부로 강습한다",
        "description": "신속한 무력 소탕으로 철도를 탈환합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 53
        },
        "outcomes": {
          "success": {
            "text": "적의 점거 부대를 완벽히 무장 해제시키고 열차 운행을 재개했습니다! 실버애쉬 가문의 보상을 받았습니다.",
            "statEffects": {
              "combat": 10,
              "wealth": 700,
              "sanity": 6
            }
          },
          "failure": {
            "text": "터널 내 부비트랩에 걸려 부상을 입었습니다.",
            "statEffects": {
              "health": -18,
              "sanity": -5
            }
          }
        }
      },
      {
        "id": "a_kjerag_avalanche_trap",
        "label": "절벽의 눈더미를 유도 폭파하여 적의 진입로를 봉쇄하고 항복을 받아낸다",
        "description": "성산의 험준한 자연환경을 전술로 활용합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 51
        },
        "outcomes": {
          "success": {
            "text": "눈사태로 적의 퇴로가 차단되자 용병들이 무기를 버리고 무조건 항복했습니다!",
            "statEffects": {
              "intellect": 9,
              "sanity": 8,
              "wealth": 450
            }
          },
          "failure": {
            "text": "폭파 타이밍이 빗나가 철도 레일 일부가 묻혔습니다.",
            "statEffects": {
              "wealth": -150,
              "sanity": -4
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_blacksteel_vip_extraction (재앙 지대 VIP 긴급 구출 작전)
  // ------------------------------------------
  {
    "id": "adult_blacksteel_vip_extraction",
    "title": "재앙 지대 VIP 긴급 구출 작전",
    "description": "재앙 구름이 엄습한 컬럼비아 외곽 자원 탐사 기지에서 고립된 핵심 과학자들을 구출하라는 특수 의뢰가 하달되었습니다.",
    "category": "combat",
    "minAge": 27,
    "maxAge": 48,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "a_bs_extract",
        "label": "수송 헬기와 중장갑 호위 차량을 돌파시켜 연구진 전원을 탑승시킨다",
        "description": "완벽한 경호 방진을 유지하며 탈출합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 54
        },
        "outcomes": {
          "success": {
            "text": "재앙 파편이 쏟아지는 아수라장을 뚫고 VIP 전원을 무사 탈출시켰습니다! 특수작전 성공 수당을 지급받습니다.",
            "statEffects": {
              "combat": 11,
              "wealth": 850,
              "sanity": 6
            }
          },
          "failure": {
            "text": "호위 차량 엔진이 오리지늄 분진에 피격되어 보보로 간신히 후퇴했습니다.",
            "statEffects": {
              "health": -16,
              "sanity": -8
            }
          }
        }
      },
      {
        "id": "a_bs_research_rescue",
        "label": "연구진이 미처 챙기지 못한 극비 생명공학 샘플 박스를 회수한다",
        "description": "목숨을 걸고 핵심 연구 자산을 확보합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 52
        },
        "outcomes": {
          "success": {
            "text": "샘플을 완벽히 보존하여 연구소로부터 막대한 보너스를 받았습니다.",
            "statEffects": {
              "wealth": 1000,
              "intellect": 7
            }
          },
          "failure": {
            "text": "샘플 용기가 파손되며 오염 물질에 노출되었습니다.",
            "statEffects": {
              "health": -14,
              "sanity": -10
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_rhodes_field_doctor_choice (전선 야전병원의 광석병 치료제 배급 결단)
  // ------------------------------------------
  {
    "id": "adult_rhodes_field_doctor_choice",
    "title": "전선 야전병원의 광석병 치료제 배급 결단",
    "description": "전쟁터 한복판 야전병원에 중증 감염자 환자들이 넘쳐나지만, 보유한 고순도 억제제 앰플은 단 3병뿐입니다.",
    "category": "oripathy",
    "minAge": 28,
    "maxAge": 49,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "a_rhodes_triage",
        "label": "생존 가능성이 가장 높은 위독한 청년 환자들에게 우선 투약한다",
        "description": "냉철한 의료 트리아지(Triage) 원칙을 따릅니다.",
        "outcomes": {
          "success": {
            "text": "청년들은 살아났으나, 떠나보낸 환자들의 눈빛이 가슴에 깊은 상처로 남았습니다.",
            "statEffects": {
              "intellect": 8,
              "sanity": -8
            }
          }
        }
      },
      {
        "id": "a_rhodes_dilute_all",
        "label": "약물을 정밀 희석하여 모든 환자에게 공평하게 나누어 투여하고 철야 간호한다",
        "description": "단 한 명도 포기하지 않는 의술의 이상을 실천합니다.",
        "diceCheck": {
          "stat": "artsAptitude",
          "difficulty": 53
        },
        "outcomes": {
          "success": {
            "text": "당신의 지극한 정성과 아츠 치료 덕에 모든 환자의 결정화 발작이 안정되었습니다! 진정한 명의로 칭송받습니다.",
            "statEffects": {
              "sanity": 15,
              "artsAptitude": 10,
              "health": -8
            }
          },
          "failure": {
            "text": "약효가 너무 묽어져 몇몇 중증 환자를 살리지 못했습니다... 절망감이 덮칩니다.",
            "statEffects": {
              "sanity": -18,
              "health": -6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_oripathy_terminal_suppression (혈중 오리지늄 결정 급속 침식)
  // ------------------------------------------
  {
    "id": "adult_oripathy_terminal_suppression",
    "title": "혈중 오리지늄 결정 급속 침식",
    "description": "장기간의 과로와 스트레스로 인해 가슴과 팔의 결정이 급격히 팽창하며 극심한 발작이 찾아왔습니다!",
    "category": "oripathy",
    "minAge": 25,
    "maxAge": 49,
    "isMajor": true,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "a_suppress_intensive",
        "label": "고농도 전문 억제제를 정맥 투여하고 집중 치료 병동에 입원한다",
        "description": "모든 자금을 투입하여 급성 침식을 억제합니다.",
        "requirements": {
          "lmdCost": 500
        },
        "outcomes": {
          "success": {
            "text": "차가운 약물이 혈관을 타고 돌며 결정화의 폭주를 진정시켰습니다. 생명의 위기를 넘겼습니다.",
            "statEffects": {
              "sanity": 4,
              "health": 10
            },
            "crystallizationDelta": -1,
            "bloodDensityDelta": -0.05
          }
        }
      },
      {
        "id": "a_suppress_willpower",
        "label": "초인적인 정신력과 생존 본능으로 뼈를 깎는 고통을 맨몸으로 버텨낸다",
        "description": "자금 부족 속에서 온몸의 신경으로 고통에 저항합니다.",
        "diceCheck": {
          "stat": "sanity",
          "difficulty": 55
        },
        "outcomes": {
          "success": {
            "text": "핏줄을 쥐어짜는 고통을 이겨내고 스스로 체내 아츠 순환을 안정시켰습니다! 정신력이 신화적 경지에 이릅니다.",
            "statEffects": {
              "sanity": 14,
              "artsAptitude": 8,
              "health": -15
            },
            "crystallizationDelta": 1.5
          },
          "failure": {
            "text": "결정이 폐와 신경계를 깊숙이 파고들었습니다... 결정화율이 급증했습니다.",
            "statEffects": {
              "health": -25,
              "sanity": -15
            },
            "crystallizationDelta": 5,
            "bloodDensityDelta": 0.12
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_ancient_civilization_ruin (지하 벙커의 전 인류 데이터 터미널)
  // ------------------------------------------
  {
    "id": "adult_ancient_civilization_ruin",
    "title": "지하 벙커의 전 인류 데이터 터미널",
    "description": "황야 지하 깊은 곳에서 오리지늄 재앙 이전 시대의 것으로 추정되는 거대한 슈퍼컴퓨터 서버실을 발견했습니다.",
    "category": "fateful",
    "minAge": 28,
    "maxAge": 49,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "a_ruin_extract_data",
        "label": "보존된 양자 메모리 코어에서 구인류의 행성 개척 기록을 복원한다",
        "description": "테라 문명의 잃어버린 진실에 다가섭니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 55
        },
        "outcomes": {
          "success": {
            "text": "푸른 별의 과거와 대지의 기원을 담은 암호화된 데이터를 복원했습니다! 지적 시야가 신의 영역에 닿습니다.",
            "statEffects": {
              "intellect": 15,
              "sanity": 8
            },
            "unlockAchievementId": "mystic_precursor_archive"
          },
          "failure": {
            "text": "보안 방화벽의 전기 충격에 튕겨 나갔습니다. 시스템이 영구 잠금 상태에 들어갔습니다.",
            "statEffects": {
              "health": -14,
              "sanity": -6
            }
          }
        }
      },
      {
        "id": "a_ruin_salvage_metals",
        "label": "손상되지 않은 초전도체 희귀 금속 블록을 채굴하여 반출한다",
        "description": "현실적인 거액의 자원을 확보합니다.",
        "outcomes": {
          "success": {
            "text": "현대 테라 기술로는 제조 불가능한 초합금을 수거하여 천문학적인 가격에 매각했습니다.",
            "statEffects": {
              "wealth": 1800
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_mercenary_war_trophy (전설의 멸망한 기사단 대검 입수)
  // ------------------------------------------
  {
    "id": "adult_mercenary_war_trophy",
    "title": "전설의 멸망한 기사단 대검 입수",
    "description": "폐허의 고대 전장에서 수백 년 동안 녹슬지 않은 채 바위에 꽂혀 있던 전설적인 아츠 기사 대검을 발견했습니다.",
    "category": "combat",
    "minAge": 27,
    "maxAge": 49,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "a_trophy_pull",
        "label": "대검에 손을 얹고 아츠 기운을 불어넣어 바위에서 뽑아낸다",
        "description": "검의 영혼과 공명하여 무기를 계승합니다.",
        "diceCheck": {
          "stat": "combat",
          "difficulty": 53
        },
        "outcomes": {
          "success": {
            "text": "눈부신 섬광과 함께 대검이 뽑혀 나왔습니다! 당신의 손에 완벽히 길들여진 전설의 명검을 쥐었습니다.",
            "statEffects": {
              "combat": 12,
              "health": 5,
              "sanity": 6
            }
          },
          "failure": {
            "text": "검에 서린 원념의 반동으로 손바닥에 화상을 입고 튕겨 나갔습니다.",
            "statEffects": {
              "health": -12,
              "sanity": -5
            }
          }
        }
      },
      {
        "id": "a_trophy_museum",
        "label": "기사단의 역사를 존중하여 카시미어 국립 박물관에 기증한다",
        "description": "명예로운 기증으로 대중의 존경을 받습니다.",
        "outcomes": {
          "success": {
            "text": "국가적인 문화재 기증 감사패와 함께 거액의 기증 보상금을 수령했습니다.",
            "statEffects": {
              "wealth": 900,
              "sanity": 10
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_underground_broker_alliance (대륙 암시장 카르텔의 총수 회담)
  // ------------------------------------------
  {
    "id": "adult_underground_broker_alliance",
    "title": "대륙 암시장 카르텔의 총수 회담",
    "description": "용문, 시라쿠사, 컬럼비아의 지하 암시장을 주름잡는 거물들이 모인 비밀 연합에 당신의 지분 참여를 요청해왔습니다.",
    "category": "life",
    "minAge": 32,
    "maxAge": 49,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "a_broker_lead",
        "label": "대륙 간 물류 밀수 루트를 통합 관리하는 최고 총수로 등극한다",
        "description": "어둠의 상권을 장악하여 막대한 부와 권력을 쥡니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 54
        },
        "outcomes": {
          "success": {
            "text": "암흑가의 대부로 추대받으며 매년 수천만 LMD가 오가는 거대 카르텔의 정점에 섰습니다!",
            "statEffects": {
              "wealth": 2500,
              "intellect": 10,
              "sanity": -5
            }
          },
          "failure": {
            "text": "내부 배신자의 기습을 받아 암시장에서 쫓겨났습니다.",
            "statEffects": {
              "wealth": -500,
              "sanity": -12,
              "health": -10
            }
          }
        }
      },
      {
        "id": "a_broker_refuse",
        "label": "지하 범죄와의 연루를 거부하고 합법적인 상업 영역에만 머문다",
        "description": "깨끗한 명예와 안전을 지킵니다.",
        "outcomes": {
          "success": {
            "text": "위험한 범죄 조직의 표적에서 벗어나 떳떳한 시민의 존엄을 지켰습니다.",
            "statEffects": {
              "sanity": 10,
              "luck": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // adult_family_heirloom_investiture (가문의 유산과 영지 상속식)
  // ------------------------------------------
  {
    "id": "adult_family_heirloom_investiture",
    "title": "가문의 유산과 영지 상속식",
    "description": "가문의 원로들이 모인 자리에서 오랜 세월 보존되어 온 가문의 영지 문서와 수호 가보를 계승받게 되었습니다.",
    "category": "life",
    "minAge": 30,
    "maxAge": 49,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "a_heirloom_accept",
        "label": "가주의 인장을 건네받고 가문의 번영과 권익을 책임진다",
        "description": "일족의 총수로서 막중한 책임과 가문의 부를 이어받습니다.",
        "outcomes": {
          "success": {
            "text": "가문의 저택과 유산이 모두 당신의 명의로 귀속되었습니다! 든든한 가문의 뒷배가 생겼습니다.",
            "statEffects": {
              "wealth": 1500,
              "sanity": 8,
              "intellect": 6
            }
          }
        }
      },
      {
        "id": "a_heirloom_charity",
        "label": "영지 수익의 상당 부분을 빈민 구호 기금과 감염자 병동에 기부한다",
        "description": "노블레스 오블리주를 실천하여 대중의 칭송을 받습니다.",
        "outcomes": {
          "success": {
            "text": "수많은 사람들의 축복과 기도가 쏟아졌습니다. 테라 대륙 전역에서 존경받는 인물이 되었습니다.",
            "statEffects": {
              "sanity": 16,
              "wealth": 400,
              "luck": 8
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_master_disciple_investiture (등불을 건네받을 마지막 제자)
  // ------------------------------------------
  {
    "id": "elder_master_disciple_investiture",
    "title": "등불을 건네받을 마지막 제자",
    "description": "황혼의 나이에 이르러, 평생을 갈고닦은 당신의 무예와 학문, 아츠 비기를 온전히 전수받을 만한 총명한 젊은이가 문하생으로 찾아왔습니다.",
    "category": "fateful",
    "minAge": 50,
    "maxAge": 999,
    "isMajor": true,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "e_disciple_full_teach",
        "label": "일체의 숨김없이 비전(秘傳)의 정수를 쏟아부어 진정한 대원수로 길러낸다",
        "description": "자신의 모든 노하우를 후대에 아낌없이 전수합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 52
        },
        "outcomes": {
          "success": {
            "text": "제자는 눈물을 흘리며 사부의 비급을 완벽히 체화했습니다! 테라의 미래를 밝힐 위대한 후계자가 탄생했습니다.",
            "statEffects": {
              "sanity": 18,
              "intellect": 8,
              "artsAptitude": 6
            },
            "unlockAchievementId": "rare_living_legend"
          },
          "failure": {
            "text": "무리한 수련 도중 노쇠한 기력이 쇠하여 며칠간 앓아누웠습니다.",
            "statEffects": {
              "health": -15,
              "sanity": 5
            }
          }
        }
      },
      {
        "id": "e_disciple_gentle_guide",
        "label": "엄격한 비기 대신 삶의 지혜와 평화로운 마음가짐을 가르친다",
        "description": "인간으로서의 도리와 인품을 물려줍니다.",
        "outcomes": {
          "success": {
            "text": "제자는 겸손하고 강직한 영걸로 성장하여 언제나 당신을 깍듯이 모십니다.",
            "statEffects": {
              "sanity": 15,
              "luck": 6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_monument_silent_pilgrimage (이름 없는 전우들의 묘비 순례)
  // ------------------------------------------
  {
    "id": "elder_monument_silent_pilgrimage",
    "title": "이름 없는 전우들의 묘비 순례",
    "description": "과거 피 흘리며 함께 싸웠던 전장의 언덕을 찾아, 바람에 깎여나간 옛 동료들의 묘비 앞에 섰습니다.",
    "category": "life",
    "minAge": 52,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "e_monument_wine",
        "label": "독한 보드카를 묘비에 붓고 묵묵히 옛 군가를 읊조린다",
        "description": "떠난 이들을 추모하며 마음의 짐을 내려놓습니다.",
        "outcomes": {
          "success": {
            "text": "\"우리는 살아남았고, 그대들의 희생을 잊지 않았다.\" 가슴 깊은 곳의 응어리가 씻은 듯 풀립니다.",
            "statEffects": {
              "sanity": 16
            }
          }
        }
      },
      {
        "id": "e_monument_repair",
        "label": "무너진 묘비들을 바로 세우고 주변에 야생화를 심어 정돈한다",
        "description": "안식처를 돌보며 살아남은 자의 의무를 다합니다.",
        "outcomes": {
          "success": {
            "text": "아름답게 정돈된 추모의 동산이 완성되었습니다. 영혼들이 평안을 얻었습니다.",
            "statEffects": {
              "sanity": 12,
              "health": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_ancient_ruin_black_coffin (테라 이전 문명의 검은 관 탐사)
  // ------------------------------------------
  {
    "id": "elder_ancient_ruin_black_coffin",
    "title": "테라 이전 문명의 검은 관 탐사",
    "description": "황야 깊숙한 비밀 동굴에서 수만 년 동안 잠들어 있던 고대 인류의 동결 수면 캡슐 \"검은 관\"과 조우했습니다.",
    "category": "fateful",
    "minAge": 55,
    "maxAge": 999,
    "isMajor": true,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "e_coffin_touch",
        "label": "떨리는 손으로 검은 관의 콘솔에 손을 대고 마지막 시스템 로그를 열람한다",
        "description": "테라 문명 전체의 궁극적인 비밀을 마주합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 58
        },
        "outcomes": {
          "success": {
            "text": "구인류의 의지, 오리지늄의 창조 목적, 그리고 별들의 운명이 머릿속으로 밀려들었습니다! 전율 속에 해탈의 경지에 이릅니다.",
            "statEffects": {
              "intellect": 20,
              "artsAptitude": 15,
              "sanity": 10
            },
            "unlockAchievementId": "mystic_precursor_archive"
          },
          "failure": {
            "text": "지나치게 방대한 미지의 정보량에 노쇠한 뇌가 과부하를 일으켰습니다.",
            "statEffects": {
              "sanity": -25,
              "health": -15
            }
          }
        }
      },
      {
        "id": "e_coffin_reseal",
        "label": "아직 대지가 이 비밀을 받아들일 준비가 되지 않았음을 깨닫고 관을 다시 밀봉한다",
        "description": "지혜로운 침묵으로 세계의 균형을 수호합니다.",
        "outcomes": {
          "success": {
            "text": "비밀을 영원한 어둠 속에 묻어두었습니다. 위대한 침묵의 파수꾼이 되었습니다.",
            "statEffects": {
              "sanity": 18,
              "intellect": 10
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_final_stand_in_catastrophe (황혼의 마지막 저항: 재앙을 가르는 아츠)
  // ------------------------------------------
  {
    "id": "elder_final_stand_in_catastrophe",
    "title": "황혼의 마지막 저항: 재앙을 가르는 아츠",
    "description": "피난이 늦어진 마을을 향해 거대한 오리지늄 재앙 뇌운이 폭포처럼 쏟아져 내립니다. 당신만이 맞설 수 있습니다.",
    "category": "combat",
    "minAge": 54,
    "maxAge": 999,
    "isMajor": true,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "e_final_burst",
        "label": "평생을 단련한 생명력과 모든 아츠 에너지를 폭발시켜 재앙 구름을 둘로 가른다",
        "description": "인생 최후의 혼을 불사르는 영웅적 결전에 나섭니다.",
        "diceCheck": {
          "stat": "artsAptitude",
          "difficulty": 60
        },
        "outcomes": {
          "success": {
            "text": "눈부신 빛의 기둥이 하늘을 가르고 재앙 구름이 소멸했습니다! 마을 전체가 구원받았습니다! 대륙 역사에 길이 남을 기적입니다!",
            "statEffects": {
              "artsAptitude": 18,
              "sanity": 20,
              "health": -20
            },
            "unlockAchievementId": "legend_calamity_slayer"
          },
          "failure": {
            "text": "혼신의 아츠로 재앙의 궤도를 틀어 마을을 살려냈으나, 극심한 에너지 소진으로 쓰러졌습니다.",
            "statEffects": {
              "health": -40,
              "sanity": 5,
              "artsAptitude": 8
            }
          }
        }
      },
      {
        "id": "e_final_barrier",
        "label": "노련한 방호 진형을 지휘하여 주민들을 암반 지하 동굴로 신속히 대피시킨다",
        "description": "지략과 경험으로 피해를 최소화합니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 54
        },
        "outcomes": {
          "success": {
            "text": "노장의 완벽한 대피 지휘로 단 한 명의 희생자 없이 대재앙을 버텨냈습니다!",
            "statEffects": {
              "intellect": 12,
              "sanity": 15,
              "health": -5
            }
          },
          "failure": {
            "text": "낙진에 일부 주민이 다쳤으나 최악의 참사는 면했습니다.",
            "statEffects": {
              "health": -15,
              "sanity": -8
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_peaceful_orchard_retirement (산기슭 과수원의 가을 추수)
  // ------------------------------------------
  {
    "id": "elder_peaceful_orchard_retirement",
    "title": "산기슭 과수원의 가을 추수",
    "description": "총과 서류를 내려놓고 산기슭 작은 과수원에서 달콤하게 익은 능금과 배를 수확합니다.",
    "category": "life",
    "minAge": 50,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "e_orchard_harvest",
        "label": "수확한 과일을 바구니 가득 담아 마을 아이들에게 나누어준다",
        "description": "베풀며 살아가는 여생의 평화를 누립니다.",
        "outcomes": {
          "success": {
            "text": "아이들의 밝은 웃음소리가 과수원에 울려 퍼집니다. 티 없이 맑은 행복을 누립니다.",
            "statEffects": {
              "sanity": 16,
              "health": 6
            }
          }
        }
      },
      {
        "id": "e_orchard_cider",
        "label": "과일주를 담가 지하 창고에 숙성시키며 세월의 향기를 음미한다",
        "description": "세월을 벗 삼아 달콤한 과실주를 빚습니다.",
        "outcomes": {
          "success": {
            "text": "향긋한 술 향기가 집안 가득 퍼지며 친구들과 나눌 좋은 술이 완성되었습니다.",
            "statEffects": {
              "sanity": 14,
              "wealth": 200
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_memoirs_of_terra_publication (테라 백년사 회고록 출간)
  // ------------------------------------------
  {
    "id": "elder_memoirs_of_terra_publication",
    "title": "테라 백년사 회고록 출간",
    "description": "격변의 시대를 살아온 당신의 파란만장한 생애와 목격담을 집대성한 회고록이 출판사의 찬사 속에 인쇄기에 올려졌습니다.",
    "category": "life",
    "minAge": 53,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "e_memoir_publish",
        "label": "대륙 전역의 도서관과 학술원에 회고록을 무료로 배포한다",
        "description": "역사의 산증인으로서 미래 세대에게 교훈을 남깁니다.",
        "outcomes": {
          "success": {
            "text": "수많은 학자와 청년들이 당신의 책을 필독서로 삼았습니다! 위대한 지성인으로 추앙받습니다.",
            "statEffects": {
              "intellect": 14,
              "sanity": 15
            }
          }
        }
      },
      {
        "id": "e_memoir_royalties",
        "label": "정식 출판 계약을 맺고 베스트셀러 인세를 수령한다",
        "description": "문학적 성공에 따른 합당한 보상을 챙깁니다.",
        "outcomes": {
          "success": {
            "text": "책이 날개 돋친 듯 팔려나가며 막대한 인세 수입이 계좌에 들어왔습니다.",
            "statEffects": {
              "wealth": 1800,
              "intellect": 8,
              "sanity": 10
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_battle_scars_fever_dream (흘러간 전장의 환영과 옛 전우의 목소리)
  // ------------------------------------------
  {
    "id": "elder_battle_scars_fever_dream",
    "title": "흘러간 전장의 환영과 옛 전우의 목소리",
    "description": "오래된 상흔이 쑤시는 비 내리는 밤, 열병과 함께 젊은 날 전장에서 마주쳤던 영웅들의 환영이 눈앞을 스쳐 지나갑니다.",
    "category": "fateful",
    "minAge": 51,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "여름",
    "choices": [
      {
        "id": "e_fever_overcome",
        "label": "약물 없이 차분히 심호흡하며 내면의 트라우마를 따스하게 감싸 안는다",
        "description": "지나간 삶의 상처들과 화해하고 진정한 평안에 도달합니다.",
        "diceCheck": {
          "stat": "sanity",
          "difficulty": 53
        },
        "outcomes": {
          "success": {
            "text": "새벽 햇살과 함께 열이 내리고 영혼이 더없이 맑고 평온해졌습니다.",
            "statEffects": {
              "sanity": 20,
              "health": 8
            }
          },
          "failure": {
            "text": "악몽에 시달리며 식은땀을 흘렸습니다. 며칠간 기력이 쇠했습니다.",
            "statEffects": {
              "sanity": -10,
              "health": -10
            }
          }
        }
      },
      {
        "id": "e_fever_write",
        "label": "침상 곁에서 붓을 들고 떠오른 환영 속 전우들의 유언을 시로 적어 남긴다",
        "description": "시적 감수성으로 슬픔을 승화시킵니다.",
        "outcomes": {
          "success": {
            "text": "심금을 울리는 애절한 진혼시가 완성되었습니다. 가슴속 앙금이 눈 녹듯 사라졌습니다.",
            "statEffects": {
              "sanity": 16,
              "intellect": 6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_grandchild_arts_discovery (손자의 손끝에서 피어난 아츠 꽃잎)
  // ------------------------------------------
  {
    "id": "elder_grandchild_arts_discovery",
    "title": "손자의 손끝에서 피어난 아츠 꽃잎",
    "description": "무릎 위에 앉은 어린 손자가 당신의 뺨을 어루만지자, 작은 손끝에서 반짝이는 빛의 꽃잎이 피어올랐습니다.",
    "category": "life",
    "minAge": 55,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "봄",
    "choices": [
      {
        "id": "e_grandchild_bless",
        "label": "따스한 미소로 아이의 머리를 쓰다듬으며 안전한 아츠 호흡법을 일러준다",
        "description": "사랑과 자애로움으로 혈통의 재능을 축복합니다.",
        "outcomes": {
          "success": {
            "text": "아이는 까르르 웃으며 빛의 나비를 만들어 날렸습니다. 인생의 가장 순수한 기쁨을 맛보았습니다.",
            "statEffects": {
              "sanity": 20,
              "luck": 6
            }
          }
        }
      },
      {
        "id": "e_grandchild_gift",
        "label": "젊은 날 소중히 아껴두었던 수호 아츠 펜던트를 목에 걸어준다",
        "description": "가보를 물려주며 아이의 미래를 지켜줍니다.",
        "outcomes": {
          "success": {
            "text": "아이는 보물을 소중히 품에 안았습니다. 대를 잇는 끈끈한 가족의 유대가 완성되었습니다.",
            "statEffects": {
              "sanity": 18,
              "health": 5
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_sami_ancestral_spirits (성림의 조상신들과의 마지막 교감)
  // ------------------------------------------
  {
    "id": "elder_sami_ancestral_spirits",
    "title": "성림의 조상신들과의 마지막 교감",
    "description": "사미의 거대한 신목 아래 눈이 소복이 쌓인 밤, 숲의 고요 속에서 조상들의 영혼이 속삭여옵니다.",
    "category": "fateful",
    "minAge": 52,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "e_sami_spirits_listen",
        "label": "눈을 감고 숲의 정령들이 건네는 대지의 축복을 가슴에 품는다",
        "description": "자연과 하나 되는 절대적 합일의 경지를 경험합니다.",
        "outcomes": {
          "success": {
            "text": "몸을 짓누르던 노환의 피로가 가시고 영혼이 깃털처럼 가벼워졌습니다.",
            "statEffects": {
              "sanity": 20,
              "artsAptitude": 8,
              "health": 6
            }
          }
        }
      },
      {
        "id": "e_sami_spirits_carve",
        "label": "신목 기둥에 자신의 생애를 기리는 마지막 룬을 새긴다",
        "description": "성림의 영원한 기억 속에 자신의 이름을 남깁니다.",
        "outcomes": {
          "success": {
            "text": "새겨진 룬이 푸른 오로라 빛으로 반짝였습니다. 성림의 영원한 수호자로 기억됩니다.",
            "statEffects": {
              "sanity": 16,
              "intellect": 8
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_yan_recluse_mountain_tea (구름 위의 정자에서 나눈 신선과의 바둑)
  // ------------------------------------------
  {
    "id": "elder_yan_recluse_mountain_tea",
    "title": "구름 위의 정자에서 나눈 신선과의 바둑",
    "description": "염국의 높은 산봉우리 정자에서, 수이(Sui)의 파편이라 불리는 수수께끼의 도인과 마주 앉아 바둑판을 마주했습니다.",
    "category": "fateful",
    "minAge": 56,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "e_yan_baduk_play",
        "label": "한 수 한 수에 백년 인생의 혜안을 담아 신선과 무언의 대국을 펼친다",
        "description": "극상의 지략과 철학적 통찰로 반상(盤上)의 승부를 겨룹니다.",
        "diceCheck": {
          "stat": "intellect",
          "difficulty": 58
        },
        "outcomes": {
          "success": {
            "text": "마지막 한 수로 완벽한 무승부를 이루자 도인이 감탄하며 차를 따랐습니다! 도의 극의를 깨달았습니다.",
            "statEffects": {
              "intellect": 18,
              "sanity": 20,
              "artsAptitude": 10
            }
          },
          "failure": {
            "text": "신선의 깊은 묘수에 패했으나, 차 한 잔을 나누며 마음의 평안을 얻었습니다.",
            "statEffects": {
              "intellect": 8,
              "sanity": 12
            }
          }
        }
      },
      {
        "id": "e_yan_tea_drink",
        "label": "승부를 떠나 도인이 끓여낸 천년 묵은 영초 차를 천천히 음미한다",
        "description": "신선의 영초 차로 생명력을 보양합니다.",
        "outcomes": {
          "success": {
            "text": "기혈이 원활히 순환하며 수명이 연장되는 듯한 활력을 얻었습니다.",
            "statEffects": {
              "health": 15,
              "sanity": 15
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_leithanien_masterpiece_sonata (생애 마지막 황혼의 교향곡 초연)
  // ------------------------------------------
  {
    "id": "elder_leithanien_masterpiece_sonata",
    "title": "생애 마지막 황혼의 교향곡 초연",
    "description": "라이타니엔 린츠 황실 오페라 극장에서 당신이 평생 동안 작곡한 마지막 교향곡이 오케스트라의 연주로 첫선을 보입니다.",
    "category": "life",
    "minAge": 53,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "e_sonata_conduct",
        "label": "직접 지휘봉을 잡고 떨리는 손으로 최후의 악장을 지휘한다",
        "description": "영혼의 모든 에너지를 음악에 바쳐 지휘합니다.",
        "diceCheck": {
          "stat": "artsAptitude",
          "difficulty": 56
        },
        "outcomes": {
          "success": {
            "text": "마지막 음표가 울려 퍼지자 객석 전체가 눈물을 흘리며 15분간 기립 박수를 보냈습니다! 불멸의 명작이 탄생했습니다.",
            "statEffects": {
              "artsAptitude": 16,
              "sanity": 22,
              "wealth": 1500
            }
          },
          "failure": {
            "text": "지휘 도중 감정이 북받쳐 휘청거렸으나 악장의 도움으로 무사히 곡을 마쳤습니다.",
            "statEffects": {
              "artsAptitude": 8,
              "sanity": 10,
              "health": -8
            }
          }
        }
      },
      {
        "id": "e_sonata_box",
        "label": "발코니석에서 사랑하는 사람들의 손을 잡고 음악을 감상한다",
        "description": "창작자의 행복한 미소로 자신의 음악을 배웅합니다.",
        "outcomes": {
          "success": {
            "text": "황홀한 음악 속에 지난 세월의 모든 기쁨과 슬픔이 아름답게 녹아내렸습니다.",
            "statEffects": {
              "sanity": 20,
              "wealth": 800
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_victoria_retired_officer_club (런디니움 퇴역 장교 클럽의 담화)
  // ------------------------------------------
  {
    "id": "elder_victoria_retired_officer_club",
    "title": "런디니움 퇴역 장교 클럽의 담화",
    "description": "빅토리아의 고풍스러운 가죽 소파에 앉아, 백발이 성성한 노병들과 시가를 피우며 옛 런디니움의 영광을 회고합니다.",
    "category": "life",
    "minAge": 52,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "e_club_brandy",
        "label": "고급 브랜디를 채우고 제국의 평화를 위해 건배를 제의한다",
        "description": "동료들과 우아한 노년의 품격을 나눕니다.",
        "outcomes": {
          "success": {
            "text": "유쾌한 웃음과 따스한 온기 속에 옛 전우들과의 의리를 굳건히 확인했습니다.",
            "statEffects": {
              "sanity": 15,
              "wealth": -50
            }
          }
        }
      },
      {
        "id": "e_club_billiards",
        "label": "녹색 당구대에서 정밀한 각도 계산으로 승부를 겨룬다",
        "description": "여전한 집중력과 눈썰미를 발휘합니다.",
        "outcomes": {
          "success": {
            "text": "멋진 샷을 성공시키며 노신사들의 탄성을 자아냈습니다.",
            "statEffects": {
              "intellect": 6,
              "sanity": 10
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_laterano_golden_halo_twilight (성도 카테드랄의 황혼 종소리)
  // ------------------------------------------
  {
    "id": "elder_laterano_golden_halo_twilight",
    "title": "성도 카테드랄의 황혼 종소리",
    "description": "라테라노 대성당의 저녁 미사 시간, 금빛으로 빛나는 저녁노을 아래서 울려 퍼지는 천상의 종소리를 듣습니다.",
    "category": "fateful",
    "minAge": 51,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "e_laterano_bell_pray",
        "label": "성당의 스테인드글라스 아래 무릎을 꿇고 지상의 모든 생명을 위해 기도한다",
        "description": "성스러운 구원의 빛을 받습니다.",
        "outcomes": {
          "success": {
            "text": "가슴속에서 형언할 수 없는 평화와 은총이 솟아올랐습니다. 영혼의 완성을 느낍니다.",
            "statEffects": {
              "sanity": 22,
              "luck": 8
            }
          }
        }
      },
      {
        "id": "e_laterano_choir_sing",
        "label": "어린 성가대원들과 함께 아름다운 그레고리오 성가를 합창한다",
        "description": "맑은 목소리로 천상의 찬미를 바칩니다.",
        "outcomes": {
          "success": {
            "text": "노년의 부드러운 저음과 아이들의 맑은 고음이 성당 천장에 완벽한 화음을 이뤘습니다.",
            "statEffects": {
              "sanity": 18,
              "artsAptitude": 8
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_kazdel_nomad_hearth_fire (살카즈 유랑 천막의 따뜻한 화롯가)
  // ------------------------------------------
  {
    "id": "elder_kazdel_nomad_hearth_fire",
    "title": "살카즈 유랑 천막의 따뜻한 화롯가",
    "description": "카즈델의 거친 황무지 천막에서, 수많은 증오와 피의 역사를 털어낸 늙은 살카즈로서 화롯불을 지핍니다.",
    "category": "life",
    "minAge": 53,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "겨울",
    "choices": [
      {
        "id": "e_kazdel_peace_bread",
        "label": "화롯불에 구운 따스한 빵을 천막을 찾아온 어린 유랑민들에게 나누어준다",
        "description": "복수의 사슬을 끊고 사랑을 전합니다.",
        "outcomes": {
          "success": {
            "text": "아이들의 천진한 눈망울 속에서 카즈델의 새로운 미래를 보았습니다. 평온한 미소를 짓습니다.",
            "statEffects": {
              "sanity": 20,
              "health": 5
            }
          }
        }
      },
      {
        "id": "e_kazdel_lullaby",
        "label": "고대 살카즈의 부드러운 자장가를 조용히 허밍한다",
        "description": "대지의 거친 바람을 잠재우는 노래를 부릅니다.",
        "outcomes": {
          "success": {
            "text": "천막 안의 모든 이들이 깊고 편안한 잠에 빠져들었습니다.",
            "statEffects": {
              "sanity": 16,
              "artsAptitude": 6
            }
          }
        }
      }
    ]
  },
  // ------------------------------------------
  // elder_long_lived_race_eternity_sorrow (장수종의 슬픔: 시간의 흐름을 지켜보며)
  // ------------------------------------------
  {
    "id": "elder_long_lived_race_eternity_sorrow",
    "title": "장수종의 슬픔: 시간의 흐름을 지켜보며",
    "description": "수백 년을 사는 장수종(엘라피아, 드라코, 살카즈 등)으로서, 평생을 함께했던 필멸자 친구들이 하나둘 세상을 떠나가는 것을 배웅합니다.",
    "category": "fateful",
    "minAge": 70,
    "maxAge": 999,
    "isMajor": false,
    "preferredSeason": "가을",
    "choices": [
      {
        "id": "e_eternity_embrace",
        "label": "친구들의 유품과 기억을 마음에 품고 영원한 시간의 무게를 초연히 받아들인다",
        "description": "필멸의 덧없음 속에서 영원한 사랑과 기억의 가치를 깨닫습니다.",
        "diceCheck": {
          "stat": "sanity",
          "difficulty": 55
        },
        "outcomes": {
          "success": {
            "text": "슬픔은 깊은 지혜가 되었고, 당신의 눈동자에는 대륙의 백 년 세월이 담겼습니다.",
            "statEffects": {
              "sanity": 25,
              "intellect": 15
            },
            "unlockAchievementId": "unique_silver_lance"
          },
          "failure": {
            "text": "끝없는 상실감에 깊은 고독의 늪에 빠져 한동안 세상과의 인연을 끊었습니다.",
            "statEffects": {
              "sanity": -15,
              "intellect": 8
            }
          }
        }
      },
      {
        "id": "e_eternity_chronicler",
        "label": "떠나간 이들이 남긴 삶의 족적을 기록하는 영원한 역사 기록관이 된다",
        "description": "친구들의 삶이 잊히지 않도록 대륙의 역사에 아로새깁니다.",
        "outcomes": {
          "success": {
            "text": "테라의 모든 세대가 당신의 기록을 통해 선인들의 용기를 배웁니다.",
            "statEffects": {
              "intellect": 18,
              "sanity": 18
            }
          }
        }
      }
    ]
  }
];
