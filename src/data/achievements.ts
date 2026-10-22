// src/data/achievements.ts
import { Achievement } from '../types';

export const ACHIEVEMENTS_DATA: Achievement[] = [
  // ==========================================
  // 전설 (Legendary - 1000 Pts)
  // ==========================================
  {
    id: 'legend_dawn_of_terra',
    title: '새벽을 비추는 불꽃',
    description: '로도스 아일랜드 엘리트 오퍼레이터로서 메인 스토리의 모든 시련을 극복하고 대지의 새벽을 열다.',
    loreQuote: '"어둠이 아무리 깊어도, 새벽을 향해 걸어가는 이가 있는 한 불꽃은 꺼지지 않는다."',
    tier: 'Legendary',
    points: 1000,
    category: 'story',
    icon: 'flame',
    hint: '로도스 아일랜드 엘리트 오퍼레이터 직무를 획득하고, 체르노보그와 런디니움의 대사건을 모두 헤쳐나가십시오.'
  },
  {
    id: 'legend_babel_phantom',
    title: '바벨의 망령',
    description: '살카즈의 비극적인 역사와 마왕의 부름 속에서 카즈델의 비원을 가슴에 품다.',
    loreQuote: '"우리는 폐허 속에서 태어나, 폐허 속에서 죽는다. 그러나 우리의 노래는 끝나지 않으리라."',
    tier: 'Legendary',
    points: 1000,
    category: 'story',
    icon: 'crown',
    hint: '살카즈 종족으로 황혼의 나이까지 생존하여 바벨 함선 흑관의 영창 이벤트에서 비원을 계승하십시오.'
  },
  {
    id: 'legend_ancient_observer',
    title: '고대 문명의 관측자',
    description: '트레버 프리스톤과 보존자의 기록을 열람하여 테라 이전 고대 인류의 흔적을 규명하다.',
    loreQuote: '"만 년의 세월 동안 별들은 침묵했으나, 우리는 여전히 이곳에 존재했음을 증명하노라."',
    tier: 'Legendary',
    points: 1000,
    category: 'secret',
    icon: 'eye',
    hint: '라인 생명 총괄 디렉터 직무 또는 고지능 상태에서 트리몬트의 지하 고대 유적 룸을 탐색하십시오.'
  },
  {
    id: 'legend_living_myth',
    title: '테라의 살아있는 신화',
    description: '최종 종합 생애 점수 8,000점 이상을 달성하여 테라 역사에 지워지지 않을 전설을 새기다.',
    loreQuote: '"역사서의 수많은 페이지 중, 단 한 사람의 이름이 대륙 전체의 방향을 바꾸었다."',
    tier: 'Legendary',
    points: 1000,
    category: 'survival',
    icon: 'sparkles',
    hint: '긴 수명, 높은 스탯, 풍부한 자산 및 다수의 업적을 축적하여 생애 최종 점수 8,000점을 초과하십시오.'
  },
  {
    id: 'legend_sarkaz_two_centuries',
    title: '이백 년의 영생자',
    description: '웬디고나 뱀파이어 등 살카즈 장수 혈통으로 테라력 200년의 세월을 온전히 살아남다.',
    loreQuote: '"수십 세대의 인간들이 흙으로 돌아가는 것을 보았다. 나의 칼날만이 여전히 서늘하구나."',
    tier: 'Legendary',
    points: 1000,
    category: 'survival',
    icon: 'hourglass',
    hint: '살카즈(웬디고, 뱀파이어, 가고일 등) 종족으로 광석병을 억제하며 200세 이상 생존하십시오.'
  },
  {
    id: 'legend_columbia_bank_sovereign',
    title: '대륙 금융의 제왕',
    description: '보유 자산 100,000 LMD를 돌파하여 대륙 전역의 이동도시 채권을 장악하다.',
    loreQuote: '"국가는 무너져도 자본의 장부는 영원하다. 테라의 모든 바퀴는 내 금고를 향해 구른다."',
    tier: 'Legendary',
    points: 1000,
    category: 'survival',
    icon: 'coins',
    hint: '상업 활동, 현상금 및 지략 투자를 통해 순자산 100,000 LMD 이상을 축적하십시오.'
  },
  {
    id: 'legend_draco_apocalypse',
    title: '태초의 용염',
    description: '극희귀 고대종 드라코로 아츠 적성 95 이상을 달성하고 전설의 용염을 해방하다.',
    loreQuote: '"붉은 용의 숨결이 닿는 곳마다, 거짓된 왕들의 관이 잿더미로 화하리라."',
    tier: 'Legendary',
    points: 1000,
    category: 'combat',
    icon: 'flame',
    hint: '0.5% 확률로 태어나는 고대종 드라코로 수련하여 아츠 적성 95를 돌파하십시오.'
  },
  {
    id: 'legend_aslan_empire_conqueror',
    title: '황금 사자의 패왕도',
    description: '극희귀 고대종 아슬란으로 전투력 95 이상을 달성하고 제국의 기사단을 호령하다.',
    loreQuote: '"황금 갈기를 휘날리며 포효할 때, 대지의 모든 맹수들이 무릎 꿇었다."',
    tier: 'Legendary',
    points: 1000,
    category: 'combat',
    icon: 'shield',
    hint: '0.5% 확률로 태어나는 고대종 아슬란으로 수련하여 전투력 95를 돌파하십시오.'
  },
  {
    id: 'legend_priestess_black_box',
    title: '프리스티스의 블랙박스',
    description: '테라 이전 인류의 마지막 유산, 보존자 캡슐에서 프리스티스의 육성 기록을 복원하다.',
    loreQuote: '"우리의 눈길이 다시 교차할 때까지... 부디 나를 잊지 말아줘."',
    tier: 'Legendary',
    points: 1000,
    category: 'secret',
    icon: 'radio',
    hint: '지략 90 이상의 상태에서 고대 문명 발굴 이벤트 중 비밀 식별 코드를 해독하십시오.'
  },

  // ==========================================
  // 유니크 (Unique - 500 Pts)
  // ==========================================
  {
    id: 'unique_abyssal_hunter',
    title: '심해의 은빛 칼날',
    description: '에기르의 개조 수술을 견뎌내고 해사(Seaborne)를 사냥하는 어비설 헌터스로 거듭나다.',
    loreQuote: '"우리는 심해를 걷는 자들이며, 바다의 공포에 맞서는 유일한 칼날이다."',
    tier: 'Unique',
    points: 500,
    category: 'career',
    icon: 'sword',
    hint: '에기르 종족으로 성장하여 심해 개조 수술 이벤트의 가혹한 신체 판정을 통과하십시오.'
  },
  {
    id: 'unique_steam_knight_heart',
    title: '마지막 증기기사의 심장',
    description: '빅토리아 런디니움 결전에서 고대 증기기사 갑주를 가동하고 성벽을 사수하다.',
    loreQuote: '"증기가 식고 강철이 부서져도, 런디니움의 심장은 결코 멈추지 않는다."',
    tier: 'Unique',
    points: 500,
    category: 'career',
    icon: 'shield',
    hint: '빅토리아 출신으로 증기기사 승급 이벤트에서 높은 전투 판정에 성공하십시오.'
  },
  {
    id: 'unique_emperors_blade',
    title: '황제의 검: 검은 안개',
    description: '우르수스 황실 내위의 비밀 서약을 맺고 극북의 데몬 파편을 몸에 깃들이다.',
    loreQuote: '"황제의 국경은 칼끝이 닿는 곳까지. 안개 너머의 침묵은 우리만이 안다."',
    tier: 'Unique',
    points: 500,
    category: 'career',
    icon: 'skull',
    hint: '우르수스에서 높은 충성도와 전투력을 유지하며 황실 내위 영입 의식을 치르십시오.'
  },
  {
    id: 'unique_lone_trail_sky',
    title: '하늘을 꿰뚫은 별',
    description: '컬럼비아 론 트레일 계획에 동참하여 거짓된 천공을 뚫고 우주의 진실을 마주하다.',
    loreQuote: '"저 위에 무엇이 있는지 두려워하지 말라. 우리는 별을 올려다보는 자들이다."',
    tier: 'Unique',
    points: 500,
    category: 'story',
    icon: 'rocket',
    hint: '컬럼비아 라인 생명 총괄 디렉터로서 론 트레일 로켓 발사 결전을 지휘하십시오.'
  },
  {
    id: 'unique_sami_daemon_slayer',
    title: '만년설의 데몬 슬레이어',
    description: '극북 사미의 설원에서 붕괴체의 남하를 저지하고 부족의 결계를 수호하다.',
    loreQuote: '"눈보라가 모든 소리를 집어삼킬 때, 전사의 도끼날만이 진실을 새긴다."',
    tier: 'Unique',
    points: 500,
    category: 'combat',
    icon: 'snowflake',
    hint: '사미 극북 빙원 원정 이벤트에서 미지의 붕괴체와의 사투를 극복하십시오.'
  },
  {
    id: 'unique_lmd_tycoon_max',
    title: '이동도시를 매입한 부호',
    description: '보유 자산 30,000 LMD를 돌파하여 대륙 금융가를 손아귀에 쥐다.',
    loreQuote: '"돈으로 살 수 없는 것이 테라에 있는가? 최소한 안전과 침묵은 살 수 있다."',
    tier: 'Unique',
    points: 500,
    category: 'survival',
    icon: 'coins',
    hint: '사업 번창 및 현상금 사냥을 통해 순자산 30,000 LMD 이상을 달성하십시오.'
  },
  {
    id: 'unique_sarkaz_elder_150',
    title: '대마족의 장로',
    description: '살카즈 종족으로 테라의 전란 속에서 150세의 장수를 누리다.',
    loreQuote: '"내가 태어났을 때의 이동도시는 지금 흔적도 없지. 그러나 나는 여전히 걷고 있다."',
    tier: 'Unique',
    points: 500,
    category: 'survival',
    icon: 'clock',
    hint: '살카즈 종족으로 150세 이상 생존하십시오.'
  },
  {
    id: 'unique_aegir_deep_longevity',
    title: '심해의 백이십 년',
    description: '초월적 생체 구조의 에기르 종족으로 120세의 긴 수명을 온전히 누리다.',
    loreQuote: '"육지의 세월은 모래처럼 흩어지지만, 바다의 혈맥은 여전히 푸르게 뛴다."',
    tier: 'Unique',
    points: 500,
    category: 'survival',
    icon: 'droplets',
    hint: '에기르 종족으로 120세 이상 생존하십시오.'
  },
  {
    id: 'unique_crystallized_will',
    title: '결정화의 저주를 딛고',
    description: '결정화율 70% 이상의 극심한 말기 광석병 상태에서 10년 이상 생존하며 불굴의 의지를 보이다.',
    loreQuote: '"온몸이 검은 돌로 굳어가도, 나의 심장은 아직 뜨겁게 박동한다."',
    tier: 'Unique',
    points: 500,
    category: 'survival',
    icon: 'activity',
    hint: '체세포 결정화율 70% 이상의 말기 상태에 도달한 뒤, 억제제와 생명력으로 10년 이상 버텨내십시오.'
  },
  {
    id: 'unique_combat_apex',
    title: '일기당천의 무신',
    description: '물리 전투 숙련도 100(MAX)을 달성하여 인간의 한계를 초월한 무예에 도달하다.',
    loreQuote: '"칼끝이 가리키는 곳에 적의 방진은 바람 앞의 낙엽처럼 흩어졌다."',
    tier: 'Unique',
    points: 500,
    category: 'combat',
    icon: 'swords',
    hint: '훈련과 장비 보정을 통해 전투 숙련도 100을 완성하십시오.'
  },
  {
    id: 'unique_arts_apex',
    title: '오리지늄 아츠의 절대자',
    description: '아츠 적성 100(MAX)을 달성하여 자연 법칙을 뒤틀어버리는 고위 마법을 완성하다.',
    loreQuote: '"주문 영창은 더 이상 필요 없다. 생각이 닿는 순간 오리지늄은 곧 현실이 된다."',
    tier: 'Unique',
    points: 500,
    category: 'combat',
    icon: 'wand',
    hint: '꾸준한 아츠 수련과 영창 강화를 통해 아츠 적성 100을 완성하십시오.'
  },
  {
    id: 'unique_intellect_apex',
    title: '만고의 지략가',
    description: '정세 감각 및 지략 100(MAX)을 달성하여 각국 수뇌부의 머리 위에서 장기판을 흔들다.',
    loreQuote: '"승패는 칼을 뽑기 전에 이미 서재의 지도 위에서 결정되었다."',
    tier: 'Unique',
    points: 500,
    category: 'survival',
    icon: 'brain',
    hint: '학문 정진과 정계 교류를 통해 지략 스탯 100을 완성하십시오.'
  },
  {
    id: 'unique_slay_emperors_blade',
    title: '검은 안개의 참수자',
    description: '우르수스 황제의 검과의 극한 결투에서 승리하여 제국의 공포를 꺾다.',
    loreQuote: '"도메인이 찢어지고 데몬의 안개가 걷혔다. 우르수스의 신화는 여기서 무너졌다."',
    tier: 'Unique',
    points: 500,
    category: 'combat',
    icon: 'sword',
    hint: '우르수스 황제의 검과의 특수 전투에서 승리하십시오.'
  },
  {
    id: 'unique_slay_abyssal_cult',
    title: '심해 교단의 괴멸',
    description: '심해 교단 주교와 거대 해사의 융합체를 격퇴하여 해안 도시를 구원하다.',
    loreQuote: '"우리는 침묵의 바다로 돌아가지 않는다. 대지는 결코 너희에게 무릎 꿇지 않는다."',
    tier: 'Unique',
    points: 500,
    category: 'combat',
    icon: 'shield-alert',
    hint: '이베리아 연안에서 출몰하는 심해 교단 주교와의 보스전에서 승리하십시오.'
  },
  {
    id: 'unique_slay_steam_goliath',
    title: '강철 거신의 붕괴',
    description: '폭주한 빅토리아 고대 증기 골리앗의 동력 코어를 파괴하고 승리하다.',
    loreQuote: '"거대한 증기 기둥이 허공으로 치솟으며, 강철의 거인이 대지에 무릎을 꿇었다."',
    tier: 'Unique',
    points: 500,
    category: 'combat',
    icon: 'crosshair',
    hint: '런디니움 성벽에서 조우하는 증기 거신과의 결전에서 승리하십시오.'
  },
  {
    id: 'unique_kazdel_court_infiltrator',
    title: '살카즈 왕정 밀실',
    description: '살카즈 섭정왕 카즈델 왕정 위원회의 비밀 어전 회의에 잠입하여 기밀을 입수하다.',
    loreQuote: '"왕정의 열 개 왕관 아래 모인 자들의 음모가 어둠 속에서 드러났다."',
    tier: 'Unique',
    points: 500,
    category: 'secret',
    icon: 'key',
    hint: '카즈델 첩보 작전 이벤트에서 은신 및 정보 수집 주사위를 완벽하게 통과하십시오.'
  },
  {
    id: 'unique_wealth_50k',
    title: '대륙 제일의 거상',
    description: '보유 자산 50,000 LMD를 돌파하여 대륙 상업 연합회의 수석 주주가 되다.',
    loreQuote: '"황금의 무게가 곧 법의 무게다. 내 허락 없이는 어떠한 화물선도 출항할 수 없다."',
    tier: 'Unique',
    points: 500,
    category: 'survival',
    icon: 'coins',
    hint: '보유 자산 50,000 LMD 이상을 달성하십시오.'
  },

  // ==========================================
  // 미스틱 (Mystic - 300 Pts)
  // ==========================================
  {
    id: 'mystic_gun_executor',
    title: '라테라노 건 익제큐터',
    description: '공증소의 수호총 집행관이 되어 성스러운 계율과 율법의 집행을 도맡다.',
    loreQuote: '"탄환 하나에 계율 하나. 광륜 아래 방황하는 자에게 자비란 없다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'target',
    hint: '산크타 종족으로 라테라노 공증소 집행관 시험을 통과하십시오.'
  },
  {
    id: 'mystic_rhine_director',
    title: '라인 랩 총괄 디렉터',
    description: '컬럼비아 라인 생명의 주임 직책에 올라 금단의 오리지늄 생체 연구를 지휘하다.',
    loreQuote: '"진보에는 언제나 대가가 따른다. 우리는 그 대가를 치를 준비가 되어 있다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'dna',
    hint: '컬럼비아에서 높은 지략과 아츠 적성을 바탕으로 라인 랩 총괄 주임으로 승급하십시오.'
  },
  {
    id: 'mystic_yan_high_censor',
    title: '염국 대리 사법 감찰사',
    description: '수이의 권속들의 준동을 감시하고 염국 대리의 사법령을 집행하다.',
    loreQuote: '"법은 만물을 비추는 거울이요, 사령관의 붓은 사악함을 베는 칼날이다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'scroll',
    hint: '염국에서 사법 감찰사 임명 이벤트의 지략 판정을 통과하십시오.'
  },
  {
    id: 'mystic_siracusa_don',
    title: '시라쿠사의 대부 (Don)',
    description: '볼시니 12개 패밀리의 권력 투쟁을 평정하고 밤의 제왕으로 등극하다.',
    loreQuote: '"패밀리를 위해 흘린 피는 결코 헛되지 않다. 식사는 품위 있게, 복수는 조용하게."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'briefcase',
    hint: '시라쿠사에서 마피아 패밀리의 항쟁을 종식시키고 패밀리 돈 자리에 오르십시오.'
  },
  {
    id: 'mystic_frostnova_warmth',
    title: '눈꽃의 온기',
    description: '체르노보그에서 프로스트노바와의 비극적인 대치 중 따뜻한 온기와 유언을 나누다.',
    loreQuote: '"당신의 손이... 참 따뜻하네요. 부디 살아남아 새벽을 보아주세요."',
    tier: 'Mystic',
    points: 300,
    category: 'story',
    icon: 'heart',
    hint: '체르노보그 결전 이벤트에서 서리별과의 마지막 대화를 선택하고 온기를 나누십시오.'
  },
  {
    id: 'mystic_patriot_legacy',
    title: '순국자의 방패를 넘은 자',
    description: '테라 최후의 순혈 웬디고 대위 패트리어트의 숭고한 저항 정신을 기리다.',
    loreQuote: '"나의 방패는 무너졌으나, 감염자들의 행진은 멈추지 않을 것이다."',
    tier: 'Mystic',
    points: 300,
    category: 'story',
    icon: 'shield-alert',
    hint: '체르노보그 코어 결전에서 패트리어트의 마지막 행진에 경의를 표하십시오.'
  },
  {
    id: 'mystic_radiant_champion',
    title: '카시미어 광휘의 챔피언',
    description: '카바레리에키 기사 메이저 토너먼트 결승에서 우승 트로피를 들어올리다.',
    loreQuote: '"네온사인보다 눈부시게 빛나는 것은, 굴복하지 않는 기사의 의지다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'trophy',
    hint: '카시미어 메이저 기사 결승전에 진출하여 결투에서 승리하십시오.'
  },
  {
    id: 'mystic_longevity_70',
    title: '고희(古稀)의 기적',
    description: '혹독한 테라의 환경 속에서 70세까지 천수를 누리며 생존하다.',
    loreQuote: '"대다수가 요절하는 대지에서 백발의 노인이 된다는 것은 그 자체로 경이로움이다."',
    tier: 'Mystic',
    points: 300,
    category: 'survival',
    icon: 'sun',
    hint: '어떤 종족이든 70세까지 천수를 누리며 생존하십시오.'
  },
  {
    id: 'mystic_centenarian_100',
    title: '백수(百壽)의 현자',
    description: '100세의 나이를 돌파하여 한 세기를 온전히 목격한 살아있는 역사서가 되다.',
    loreQuote: '"제국이 흥망성쇠를 거듭하는 동안, 나는 노송처럼 굳건히 이 자리를 지켰다."',
    tier: 'Mystic',
    points: 300,
    category: 'survival',
    icon: 'hourglass',
    hint: '장수 종족이나 뛰어난 건강 관리로 100세까지 생존하십시오.'
  },
  {
    id: 'mystic_sarkaz_blood_surge',
    title: '핏빛 마왕의 잔향',
    description: '살카즈 종족으로 광석병과 원초의 혈맥을 조화시켜 아츠 위력을 폭주시키다.',
    loreQuote: '"혈관을 흐르는 것은 피가 아니라 원초의 화염이다."',
    tier: 'Mystic',
    points: 300,
    category: 'combat',
    icon: 'flame',
    hint: '살카즈 종족으로 아츠 적성 85 이상을 달성하고 감염 배율 2.0x 이상으로 각성하십시오.'
  },
  {
    id: 'mystic_sankta_pure_halo',
    title: '무결의 광륜',
    description: '산크타 종족으로 동족에 대한 죄를 범하지 않고 이성 95 이상을 유지하다.',
    loreQuote: '"광륜의 빛이 한 점의 흐림도 없이 맑게 타오릅니다."',
    tier: 'Mystic',
    points: 300,
    category: 'survival',
    icon: 'sun',
    hint: '산크타 종족으로 이성 최대치 및 현재치를 95 이상으로 유지하십시오.'
  },
  {
    id: 'mystic_aegir_prime_physique',
    title: '바다의 완벽한 육체',
    description: '에기르 종족으로 체력 95, 전투력 90 이상을 달성하여 초인적 피지컬을 완성하다.',
    loreQuote: '"해일보다 거세고 암초보다 단단한 육신."',
    tier: 'Mystic',
    points: 300,
    category: 'combat',
    icon: 'heart',
    hint: '에기르 종족으로 체력 95와 전투력 90을 동시에 달성하십시오.'
  },
  {
    id: 'mystic_iberian_golden_inquisition',
    title: '이베리아 황금의 심판관',
    description: '침묵의 바다를 감시하는 이베리아 대심문관의 황금 인장을 부여받다.',
    loreQuote: '"등대의 불빛이 꺼지지 않는 한, 해변의 심판은 계속된다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'award',
    hint: '이베리아에서 이단 심문관 활동을 완수하고 지략과 전투력을 겸비하십시오.'
  },
  {
    id: 'mystic_sargon_pharaoh_tomb',
    title: '사르곤 파디샤의 황금 묘역',
    description: '사르곤 황금 사막 깊은 곳의 고대 파디샤 능묘를 발굴하여 보물을 획득하다.',
    loreQuote: '"모래바람 아래 묻힌 천 년 전 파디샤의 옥좌가 햇빛을 보았다."',
    tier: 'Mystic',
    points: 300,
    category: 'secret',
    icon: 'gem',
    hint: '사르곤 사막 탐험 이벤트에서 고대 미로 유적의 함정을 파훼하십시오.'
  },
  {
    id: 'mystic_laterano_bell_echo',
    title: '성당의 공명하는 종소리',
    description: '라테라노 대성당 지하의 계율 종루를 공명시켜 전 도시의 광륜을 밝히다.',
    loreQuote: '"종소리가 울릴 때, 천 명의 산크타가 같은 노래를 불렀다."',
    tier: 'Mystic',
    points: 300,
    category: 'secret',
    icon: 'bell',
    hint: '라테라노 성당 이벤트에서 율법의 종루를 수호하고 공감각을 일치시키십시오.'
  },
  {
    id: 'mystic_seaborn_assimilation',
    title: '바다의 부름과 유혹',
    description: '해사의 유전자 침식 속에서도 자아를 잃지 않고 공존의 균형을 유지하다.',
    loreQuote: '"우리는 바다를 거부했으나, 바다는 이미 우리 안에 있었다."',
    tier: 'Mystic',
    points: 300,
    category: 'secret',
    icon: 'droplet',
    hint: '심해 해사 오염 위기 이벤트에서 높은 이성 판정으로 자아를 유지하십시오.'
  },
  {
    id: 'mystic_leithanien_virtuoso',
    title: '라이타니엔 탑의 지휘자',
    description: '라이타니엔 고탑 아츠 학술원의 수석 지휘자 칭호를 얻어 음률 아츠의 정점에 서다.',
    loreQuote: '"음표 하나로 성벽을 쌓고, 화음 하나로 적의 군대를 잠재운다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'music',
    hint: '카프리니 종족 또는 라이타니엔 학술원에서 아츠 적성 85 이상으로 지휘자 칭호를 획득하십시오.'
  },
  {
    id: 'mystic_silverash_confidant',
    title: '성산의 영구 동맹',
    description: '쉐라그 카를란 무역과 엔시오데스 실버애쉬의 절대적 신뢰를 획득하다.',
    loreQuote: '"설산의 바람이 차가워질 때, 우리는 서로의 등을 맡길 것이다."',
    tier: 'Mystic',
    points: 300,
    category: 'career',
    icon: 'mountain',
    hint: '쉐라그 평판 70 이상을 달성하고 카를란 무역 특별 협정에 서명하십시오.'
  },

  // ==========================================
  // 레어 (Rare - 150 Pts)
  // ==========================================
  {
    id: 'rare_arts_mastery',
    title: '고위 영창술사',
    description: '아츠 적성 90을 달성하여 복합 원소 오리지늄 주술을 자유자재로 구사하다.',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'sparkle',
    hint: '아츠 수련을 반복하여 아츠 적성 90 이상을 달성하십시오.'
  },
  {
    id: 'rare_iron_warlord',
    title: '백전노장의 무력',
    description: '물리 전투 숙련도 90을 달성하여 전장에서 홀로 부대를 격파하다.',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'swords',
    hint: '백병전 훈련과 결투를 거듭하여 전투 숙련도 90 이상을 달성하십시오.'
  },
  {
    id: 'rare_grand_intellect',
    title: '정세의 책사',
    description: '지략 스탯 90을 달성하여 각국 수뇌부의 암투를 손바닥 보듯 꿰뚫어보다.',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'brain',
    hint: '지략 스탯 90 이상을 달성하십시오.'
  },
  {
    id: 'rare_rhodes_specialist',
    title: '로도스 일등 정예 대원',
    description: '로도스 아일랜드 평판 60 이상을 달성하고 함선의 핵심 요원으로 인정받다.',
    tier: 'Rare',
    points: 150,
    category: 'career',
    icon: 'cross',
    hint: '로도스 아일랜드 평판을 60 이상으로 끌어올리십시오.'
  },
  {
    id: 'rare_lungmen_captain',
    title: '용문 근위국 경감',
    description: '용문 평판 50 이상을 달성하고 특별 기동 순찰대를 지휘하다.',
    tier: 'Rare',
    points: 150,
    category: 'career',
    icon: 'badge',
    hint: '용문 근위국 평판을 50 이상으로 높이십시오.'
  },
  {
    id: 'rare_karlan_trust',
    title: '성산의 맹약',
    description: '쉐라그 평판 50 이상을 달성하고 엔시오데스 실버애쉬의 비밀 신임장을 받다.',
    tier: 'Rare',
    points: 150,
    category: 'career',
    icon: 'mountains',
    hint: '쉐라그 평판을 50 이상으로 달성하십시오.'
  },
  {
    id: 'rare_blacksteel_contract',
    title: '블랙스틸 엘리트 용병',
    description: '블랙스틸 평판 50 이상을 달성하고 특수전 계약을 성공적으로 수행하다.',
    tier: 'Rare',
    points: 150,
    category: 'career',
    icon: 'briefcase',
    hint: '블랙스틸 평판을 50 이상으로 달성하십시오.'
  },
  {
    id: 'rare_survive_50',
    title: '반백의 방랑자',
    description: '50세까지 생존하여 테라의 산증인이 되다.',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'clock',
    hint: '50세까지 생존하십시오.'
  },
  {
    id: 'rare_kelseit_listener',
    title: '녹색 링스의 훈화 청강생',
    description: '켈시의 30분 난해한 철학 훈계를 단 한 번의 조름도 없이 끝까지 경청하다.',
    loreQuote: '"...따라서 네가 이해했든 못했든, 오리지늄은 여전히 너의 혈관을 순환하고 있다."',
    tier: 'Rare',
    points: 150,
    category: 'secret',
    icon: 'message-square',
    hint: '로도스 아일랜드 의료실 이벤트에서 켈시의 긴 훈계를 끝까지 경청하십시오.'
  },
  {
    id: 'rare_boiling_ramen',
    title: '입안의 온천 컵라면',
    description: '주전자 없이 끓는 물을 입에 직접 붓고 컵라면 면발을 씹어 삼키는 기행을 성공시키다.',
    loreQuote: '"이것이 전설의 닥터식 0초 조리 야식 비법이다."',
    tier: 'Rare',
    points: 150,
    category: 'secret',
    icon: 'coffee',
    hint: '야식 컵라면 조리 이벤트에서 기상천외한 닥터식 방법을 선택하십시오.'
  },
  {
    id: 'rare_pure_blood_60',
    title: '무결의 육신',
    description: '오리지늄 결정화율 0.0%의 완전한 청정 상태를 유지하며 60세까지 생존하다.',
    loreQuote: '"검은 먼지가 대지를 뒤덮었으나, 그 어떤 결정도 그의 피부에 닿지 못했다."',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'shield-check',
    hint: '단 한 번도 광석병에 걸리지 않고 60세까지 생존하십시오.'
  },
  {
    id: 'rare_youth_warrior_blaze',
    title: '불꽃처럼 짧았던 청춘',
    description: '전투력 80 이상을 달성하고 25세 이전에 전장에서 명예롭게 전사하다.',
    loreQuote: '"짧았으나 그 어떤 별보다 뜨겁게 타올랐던 영웅의 칼날."',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'flame',
    hint: '전투력 80 이상의 상태에서 25세 이전에 교전 중 전사하십시오.'
  },
  {
    id: 'rare_kuranta_unstoppable_gallop',
    title: '은빛 평원의 질주',
    description: '쿠란타 종족으로 질풍의 기동을 발휘하여 전장의 모든 회피 판정에 연속 성공하다.',
    loreQuote: '"화살도 창도 그의 말발굽보다 빠를 수는 없었다."',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'zap',
    hint: '쿠란타 종족으로 전투에서 적의 공격을 회피하거나 기동 판정에 성공하십시오.'
  },
  {
    id: 'rare_lupo_crimson_fangs',
    title: '진홍빛 늑대의 이빨',
    description: '루포 종족의 살인적 직관으로 암살 기습 치명타를 터뜨려 적을 단숨에 베어 넘기다.',
    loreQuote: '"그림자가 흩날리는 순간 사냥감의 목은 이미 바닥에 떨어져 있었다."',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'crosshair',
    hint: '루포 종족으로 전투 중 강력한 물리 일격을 적중시키십시오.'
  },
  {
    id: 'rare_feline_nine_lives',
    title: '아홉 개의 목숨',
    description: '펠린 종족으로 체력이 5 이하로 떨어진 절체절명의 위기에서 기적적으로 살아남다.',
    loreQuote: '"고양이는 아홉 번을 죽어야 비로소 잠든다고 했던가."',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'heart',
    hint: '펠린 종족으로 잔여 체력 5 이하의 빈사 상태를 겪고 생환하십시오.'
  },
  {
    id: 'rare_ursus_unbreakable_rage',
    title: '설원의 꺾이지 않는 포효',
    description: '우르수스 종족으로 혹한과 중상 속에서도 거한의 힘을 발휘하여 적을 분쇄하다.',
    loreQuote: '"우르수스의 심장이 뛰는 한, 쓰러지는 것은 언제나 적들뿐이다."',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'shield',
    hint: '우르수스 종족으로 전투 중 체력이 낮은 상태에서 승리를 거두십시오.'
  },
  {
    id: 'rare_liberi_stratosphere_flight',
    title: '창공을 가르는 매',
    description: '리베리 종족의 매의 눈으로 원거리 선제 사격을 적중시켜 적 지휘관을 저격하다.',
    loreQuote: '"하늘 높이 날아오른 매의 눈에서 벗어날 수 있는 사냥감은 없다."',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'crosshair',
    hint: '리베리 종족으로 원거리 공격 및 선제 교전 판정에서 대성공을 거두십시오.'
  },
  {
    id: 'rare_forte_unshakable_bastion',
    title: '바위 같은 인내',
    description: '포르테 종족의 철벽 방어로 적의 강력한 필살 공격을 완전히 차단하다.',
    loreQuote: '"거센 파도가 바위를 칠지언정, 바위는 한 치도 물러서지 않는다."',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'shield',
    hint: '포르테 종족으로 전투 중 방어(Defend)를 사용하여 피해를 0으로 막아내십시오.'
  },
  {
    id: 'rare_caprinae_golden_melody',
    title: '황금 음률의 영창',
    description: '카프리니 종족으로 복합 음률 아츠 공격을 완벽히 연주하여 적진을 와해시키다.',
    loreQuote: '"음계가 겹쳐질 때, 대지는 거대한 오르간으로 변한다."',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'music',
    hint: '카프리니 종족으로 아츠 공격을 성공시켜 적에게 치명타를 입히십시오.'
  },
  {
    id: 'rare_elafia_ancestral_whisper',
    title: '정령의 나지막한 속삭임',
    description: '엘라피아 종족으로 대재앙의 전조를 미리 감지하고 안전 구역으로 피난하다.',
    loreQuote: '"바람결에 실려온 나무의 탄식이 다가올 재앙을 알려주었습니다."',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'wind',
    hint: '엘라피아 종족으로 재앙 조우 회피 판정에서 성공하십시오.'
  },
  {
    id: 'rare_vulpo_illusive_phantom',
    title: '구미호의 기만',
    description: '불포 종족의 현란한 속임수로 암시장 마피아를 따돌리고 거액의 LMD를 탈취하다.',
    loreQuote: '"여우의 꼬리를 쫓던 자들은 언제나 빈손으로 허공을 쥘 뿐이다."',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'sparkles',
    hint: '불포 종족으로 슬럼가나 암시장 이벤트에서 속임수 판정에 성공하십시오.'
  },
  {
    id: 'rare_destiny_favored',
    title: '행운의 여신의 축복',
    description: '행운 스탯 90 이상을 달성하여 모든 기적적 확률을 자신의 편으로 만들다.',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'sparkles',
    hint: '행운 스탯 90 이상을 달성하십시오.'
  },
  {
    id: 'rare_miraculous_misfortune',
    title: '불운을 비웃은 생존자',
    description: '행운 스탯 15 이하의 지독한 불운 속에서도 40세까지 끈질기게 살아남다.',
    loreQuote: '"벼락이 옆에 떨어져도, 나는 털고 일어나 길을 갈 뿐이다."',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'alert-triangle',
    hint: '행운 스탯 15 이하의 상태에서 40세까지 생존하십시오.'
  },
  {
    id: 'rare_ascetic_hermit',
    title: '청빈한 은둔자',
    description: '보유 자산 200 LMD 이하의 무소유 상태로 50세까지 고결한 삶을 살아가다.',
    loreQuote: '"빈손으로 태어나 빈손으로 돌아가니, 금화의 무게에 짓눌릴 필요가 없다."',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'feather',
    hint: '소지 자금 200 LMD 이하를 유지하며 50세까지 생존하십시오.'
  },
  {
    id: 'rare_flawless_duel',
    title: '무결점의 결투',
    description: '전투에서 단 한 번의 피해도 입지 않고 완벽한 무결 승리를 거두다.',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'shield-check',
    hint: '전투에서 단 한 점의 HP 피해도 받지 않고 승리하십시오.'
  },
  {
    id: 'rare_barehand_brawler',
    title: '맨손의 전사',
    description: '무기나 방어구를 장착하지 않은 맨몸으로 적과의 교전에서 승리하다.',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'sword',
    hint: '무기와 방어구를 장착하지 않은 상태로 적을 쓰러뜨리십시오.'
  },
  {
    id: 'rare_rim_billiton_mega_drill',
    title: '림 빌리톤의 거대 굴착기',
    description: '림 빌리톤 광산의 지하 초대형 굴착선을 성공적으로 조종하여 고순도 맥석을 채굴하다.',
    loreQuote: '"엔진 굉음과 함께 단단한 지층이 뚫리며 황금빛 광맥이 드러났다."',
    tier: 'Rare',
    points: 150,
    category: 'career',
    icon: 'wrench',
    hint: '림 빌리톤 채굴선 이벤트에서 굴착기 운전 판정에 성공하십시오.'
  },
  {
    id: 'rare_minos_golden_laurel',
    title: '미노스의 월계관',
    description: '미노스 전사 제전의 철인 3종 경기에서 우승하여 황금 월계관을 쓰다.',
    loreQuote: '"강인한 신체와 맑은 영혼, 이것이 미노스 영웅의 자격이다."',
    tier: 'Rare',
    points: 150,
    category: 'combat',
    icon: 'award',
    hint: '미노스 전사 제전 이벤트에서 체력과 전투력 판정에 성공하여 우승하십시오.'
  },
  {
    id: 'rare_originium_lightning_strike',
    title: '재앙의 번개와 춤을',
    description: '재앙 구름에서 쏟아지는 오리지늄 벼락을 피하거나 기적적으로 살아남다.',
    loreQuote: '"하늘이 쪼개지며 검붉은 번개가 정수리를 스쳤다. 아직 죽을 때가 아니다."',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'zap',
    hint: '재앙 벼락 조우 이벤트에서 살아남거나 회피하십시오.'
  },
  {
    id: 'rare_bankruptcy_ruin',
    title: '파산의 절망을 딛고',
    description: '전 재산을 날리고 빚쟁이들에게 쫓기는 극단적 파산 위기를 딛고 재기하다.',
    loreQuote: '"바닥을 쳐본 자만이 다시 일어서는 법을 안다."',
    tier: 'Rare',
    points: 150,
    category: 'survival',
    icon: 'alert-circle',
    hint: '자산이 0으로 떨어진 뒤 재기 이벤트에서 다시 살아남으십시오.'
  },

  // ==========================================
  // 커먼 (Common - 50 Pts)
  // ==========================================
  {
    id: 'common_first_breath',
    title: '대지의 첫 숨결',
    description: '가혹한 테라의 하늘 아래 무사히 첫 울음을 터뜨리다.',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'baby',
    hint: '게임 시작 후 무사히 첫해를 맞이하십시오.'
  },
  {
    id: 'common_coming_of_age',
    title: '성년의 맹세',
    description: '15세 성인이 되어 자신의 앞길과 진로를 결정하다.',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'user',
    hint: '15세 성년에 도달하십시오.'
  },
  {
    id: 'common_first_victory',
    title: '첫 교전 승리',
    description: '황야의 약탈자나 오리지늄 슬러그와의 전투에서 승리하다.',
    tier: 'Common',
    points: 50,
    category: 'combat',
    icon: 'award',
    hint: '어떤 적이든 전투에서 1회 승리하십시오.'
  },
  {
    id: 'common_rhodes_medicine',
    title: '차가운 앰플',
    description: '로도스 아일랜드 정품 오리지늄 억제제를 성공적으로 투약하다.',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'pill',
    hint: '연간 활동에서 로도스 정품 억제제를 처방받아 투약하십시오.'
  },
  {
    id: 'common_wealth_1k',
    title: '지갑의 두께',
    description: '보유 자산 1,000 LMD를 모아 기본적인 생계를 보장받다.',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'coin',
    hint: '소지금 1,000 LMD를 모으십시오.'
  },
  {
    id: 'common_survive_30',
    title: '이립(而立)의 고개',
    description: '30세까지 테라의 가혹한 생존 경쟁에서 살아남다.',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'shield',
    hint: '30세까지 생존하십시오.'
  },
  {
    id: 'common_laterano_apple_pie',
    title: '바삭한 애플파이',
    description: '라테라노 베이커리의 폭발 사고 속에서 기적적으로 갓 구운 애플파이를 맛보다.',
    tier: 'Common',
    points: 50,
    category: 'secret',
    icon: 'pie',
    hint: '라테라노 베이커리 폭발 이벤트에서 애플파이를 구출하십시오.'
  },
  {
    id: 'common_sami_mushroom_trip',
    title: '무지갯빛 환각 버섯',
    description: '사미 설원에서 수상하게 발광하는 버섯을 호기심에 맛보고 기묘한 환각을 보다.',
    loreQuote: '"버섯이 나에게 말을 걸었다... 세상의 끝에는 따뜻한 수프가 있노라고."',
    tier: 'Common',
    points: 50,
    category: 'secret',
    icon: 'sparkles',
    hint: '사미 설원 버섯 채집 이벤트에서 수상한 발광 버섯을 먹어보십시오.'
  },
  {
    id: 'common_siracusa_fatal_comedy',
    title: '눈물겨운 시라쿠사 희극',
    description: '시라쿠사 오페라 극장에서 배꼽 빠지는 마피아 희극을 관람하며 포복절도하다.',
    loreQuote: '"비극보다 더 무서운 것은, 너무 웃겨서 숨이 막혀오는 시라쿠사의 코미디다."',
    tier: 'Common',
    points: 50,
    category: 'secret',
    icon: 'smile',
    hint: '시라쿠사 극장 관람 이벤트에서 코미디 연극을 선택하십시오.'
  },
  {
    id: 'common_ursus_frostbite',
    title: '꽁꽁 언 코끝',
    description: '우르수스의 영하 40도 혹한 속에서 독한 보드카로 동상을 녹여내다.',
    loreQuote: '"목구멍이 타들어 가는 한 모금. 이것이 북방에서 살아남는 유일한 난로다."',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'thermometer',
    hint: '우르수스 설원 혹한 이벤트에서 보드카로 체온을 유지하십시오.'
  },
  {
    id: 'common_columbia_lab_zap',
    title: '파지직! 감전의 맛',
    description: '컬럼비아 연구소의 누전된 고압 전선에 감전되어 머리가 번쩍 솟구치다.',
    loreQuote: '"새로운 아이디어가 번개처럼 떠올랐다. 아니, 진짜 번개였나?"',
    tier: 'Common',
    points: 50,
    category: 'secret',
    icon: 'zap',
    hint: '컬럼비아 연구소 탐방 중 전기 실험 장치와 접촉하십시오.'
  },
  {
    id: 'common_durin_nap_master',
    title: '달콤한 땅속 낮잠',
    description: '두린 종족처럼 아늑한 지하 방구석에서 12시간 연속 꿀잠을 즐기다.',
    loreQuote: '"지상의 소음 따위 알 게 무언가. 이불 속이 곧 낙원이다."',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'moon',
    hint: '휴양 활동이나 두린 관련 이벤트에서 온전한 휴식을 취하십시오.'
  },
  {
    id: 'common_cautus_carrot_stew',
    title: '어머니의 당근 스튜',
    description: '카우투스 정착지에서 따뜻한 당근 스튜 한 그릇으로 심신을 치유하다.',
    loreQuote: '"진한 국물 한 숟가락에 황야의 피로가 눈 녹듯 사라졌다."',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'coffee',
    hint: '카우투스 마을 방문 이벤트에서 대접받은 따뜻한 스튜를 맛보십시오.'
  },
  {
    id: 'common_nomad_campfire',
    title: '모닥불 앞의 밤',
    description: '황야의 노마드 캠프에서 여행자들과 모닥불을 쬐며 악기를 연주하다.',
    loreQuote: '"테라의 밤하늘 아래, 우리는 모두 같은 유랑자일 뿐이다."',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'flame',
    hint: '황야 노마드 캠프에서 동료들과 모닥불 대화를 나누십시오.'
  },
  {
    id: 'common_slum_street_smart',
    title: '뒷골목 생존 수칙',
    description: '이동도시 슬럼가에서 소매치기의 손길을 직감으로 쳐내고 역으로 훈계하다.',
    loreQuote: '"내 주머니에 손을 넣는 녀석치고 손가락이 온전한 놈은 없지."',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'user-check',
    hint: '슬럼가 소매치기 조우 이벤트에서 소지품을 사수하십시오.'
  },
  {
    id: 'common_suppressant_shortage',
    title: '텅 빈 약병',
    description: '억제제가 떨어져 광석병 결정화의 통증을 이를 악물고 참아내다.',
    loreQuote: '"약이 없다고 해서 삶을 포기할 수는 없다."',
    tier: 'Common',
    points: 50,
    category: 'survival',
    icon: 'alert-triangle',
    hint: '광석병 감염 상태에서 억제제가 고갈된 채 1년을 버텨내십시오.'
  }
];

export const TIER_SCORES: Record<string, number> = {
  Legendary: 1000,
  Unique: 500,
  Mystic: 300,
  Rare: 150,
  Common: 50
};

export const TIER_COLORS = {
  Legendary: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/60',
    gradient: 'from-amber-400 to-yellow-600',
    badge: 'bg-amber-500 text-black',
    glow: 'shadow-amber-500/30'
  },
  Unique: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/60',
    gradient: 'from-purple-400 to-indigo-600',
    badge: 'bg-purple-600 text-white',
    glow: 'shadow-purple-500/30'
  },
  Mystic: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    border: 'border-cyan-500/60',
    gradient: 'from-cyan-400 to-teal-600',
    badge: 'bg-cyan-600 text-black',
    glow: 'shadow-cyan-500/30'
  },
  Rare: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/60',
    gradient: 'from-blue-400 to-sky-600',
    badge: 'bg-blue-600 text-white',
    glow: 'shadow-blue-500/30'
  },
  Common: {
    bg: 'bg-slate-500/20',
    text: 'text-slate-300',
    border: 'border-slate-500/40',
    gradient: 'from-slate-400 to-gray-600',
    badge: 'bg-slate-600 text-white',
    glow: 'shadow-slate-500/20'
  }
};
