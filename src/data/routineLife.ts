// src/data/routineLife.ts
import { Character, Season, EnvironmentType, NationThemeId } from '../types';
import { resolveNationId } from '../utils/themeResolver';

export interface RoutineLifeEntry {
  id: string;
  nationId: NationThemeId | 'all';
  lifeStage: 'childhood' | 'youth' | 'adulthood' | 'elder' | 'all';
  environment?: EnvironmentType | 'all';
  season?: Season | 'all';
  text: string;
}

export const ROUTINE_LIFE_ENTRIES: RoutineLifeEntry[] = [
  // ==========================================
  // 빅토리아 (Victoria)
  // ==========================================
  {
    id: 'vic_child_01',
    nationId: 'victoria',
    lifeStage: 'childhood',
    season: '봄',
    text: '런디니움 골목길의 낡은 증기 파이프 사이로 봄바람이 스며들고, 굴뚝새들이 붉은 벽돌 담벼락 위를 지저귀었습니다.'
  },
  {
    id: 'vic_child_02',
    nationId: 'victoria',
    lifeStage: 'childhood',
    season: '여름',
    text: '빅토리아 교외의 초원에서 나무 막대를 증기 기사의 랜스 삼아 휘두르며 노을 질 때까지 뛰놀았습니다.'
  },
  {
    id: 'vic_child_03',
    nationId: 'victoria',
    lifeStage: 'childhood',
    season: '가을',
    text: '뿌연 안개 낀 거리의 가로등 불빛 아래서, 마차 바퀴 소리를 들으며 군밤 한 봉지를 품에 안고 집으로 돌아왔습니다.'
  },
  {
    id: 'vic_child_04',
    nationId: 'victoria',
    lifeStage: 'childhood',
    season: '겨울',
    text: '벽난로의 석탄 불꽃이 따스하게 타오르는 방 안에서, 할머니가 들려주시는 고대 증기 기사의 무용담에 귀를 기울였습니다.'
  },
  {
    id: 'vic_youth_01',
    nationId: 'victoria',
    lifeStage: 'youth',
    season: '봄',
    text: '런디니움 공업 지구의 톱니바퀴 소리에 맞춰 새벽길을 걸으며, 가슴속에 품은 야망의 무게를 곱씹었습니다.'
  },
  {
    id: 'vic_youth_02',
    nationId: 'victoria',
    lifeStage: 'youth',
    season: '가을',
    text: '선술집 구석에서 글래스고 동료들과 진한 홍차를 마시며, 빅토리아 귀족들의 암투와 흔들리는 왕좌를 논했습니다.'
  },
  {
    id: 'vic_adult_01',
    nationId: 'victoria',
    lifeStage: 'adulthood',
    season: '여름',
    text: '정연하게 뿜어져 나오는 증기 배기관 아래서 서류철과 공구함을 정리하며, 제국의 무게를 견뎌내는 평범한 하루를 보냈습니다.'
  },
  {
    id: 'vic_adult_02',
    nationId: 'victoria',
    lifeStage: 'adulthood',
    season: '겨울',
    text: '차가운 런디니움의 겨울비가 잿빛 창문을 두드리는 밤, 따뜻한 진(Gin) 한 잔으로 고단한 하루의 피로를 씻어냈습니다.'
  },
  {
    id: 'vic_elder_01',
    nationId: 'victoria',
    lifeStage: 'elder',
    season: '가을',
    text: '황금빛으로 물든 오크 나무 벤치에 앉아, 증기 기관 열차가 긴 기적을 울리며 안개 속으로 사라지는 모습을 담담히 지켜보았습니다.'
  },
  {
    id: 'vic_elder_02',
    nationId: 'victoria',
    lifeStage: 'elder',
    season: '봄',
    text: '녹슨 회중시계의 태엽을 감으며, 제국의 전성기에 함께 거리를 누비던 오랜 전우들의 이름을 나지막이 읊조렸습니다.'
  },

  // ==========================================
  // 염국 (Yan)
  // ==========================================
  {
    id: 'yan_child_01',
    nationId: 'yan',
    lifeStage: 'childhood',
    season: '봄',
    text: '백수(상경)의 돌다리 아래로 살구꽃 꽃잎이 흩날리는 강물에 종이배를 띄우며 천진하게 웃었습니다.'
  },
  {
    id: 'yan_child_02',
    nationId: 'yan',
    lifeStage: 'childhood',
    season: '여름',
    text: '장마철 처마 밑에서 빗소리를 들으며 붓글씨 연습을 하다가, 처마 끝에 매달린 풍경 소리에 졸음을 청했습니다.'
  },
  {
    id: 'yan_child_03',
    nationId: 'yan',
    lifeStage: 'childhood',
    season: '가을',
    text: '등불 축제가 열린 저잣거리에서 갓 쪄낸 산사나무 탕후루를 손에 쥐고 용춤 행렬을 뒤쫓았습니다.'
  },
  {
    id: 'yan_child_04',
    nationId: 'yan',
    lifeStage: 'childhood',
    season: '겨울',
    text: '소복이 눈 쌓인 장독대 곁에서 김이 모락모락 나는 두부 탕을 먹으며 온돌방의 온기를 만끽했습니다.'
  },
  {
    id: 'yan_youth_01',
    nationId: 'yan',
    lifeStage: 'youth',
    season: '봄',
    text: '대리(司)의 사서들이 거니는 관청 누각 아래서, 죽간과 고서의 구절을 외우며 세상의 도리를 탐구했습니다.'
  },
  {
    id: 'yan_youth_02',
    nationId: 'yan',
    lifeStage: 'youth',
    season: '가을',
    text: '단풍 든 계곡 정자에서 친구들과 국화주를 나누며, 수이(Sui)의 전설과 대륙의 평안을 기원했습니다.'
  },
  {
    id: 'yan_adult_01',
    nationId: 'yan',
    lifeStage: 'adulthood',
    season: '여름',
    text: '치열한 상무 거래와 관청 업무를 마친 뒤, 어둑해진 찻집에서 차분하게 찻잔을 비우며 내공을 가다듬었습니다.'
  },
  {
    id: 'yan_adult_02',
    nationId: 'yan',
    lifeStage: 'adulthood',
    season: '겨울',
    text: '눈보라가 이동도시 외곽 장벽을 두드릴 때, 화로에 숯을 얹고 장부의 숫자를 맞추며 평온한 가장의 밤을 지켰습니다.'
  },
  {
    id: 'yan_elder_01',
    nationId: 'yan',
    lifeStage: 'elder',
    season: '봄',
    text: '오랜 세월 손때 묻은 옥비녀를 어루만지며, 뜰 앞의 매화가 다시 꽃망울을 터뜨리는 모습을 조용히 관조했습니다.'
  },
  {
    id: 'yan_elder_02',
    nationId: 'yan',
    lifeStage: 'elder',
    season: '가을',
    text: '수묵 산수화 병풍 뒤에서 손자에게 옛 동방의 비급 이야기를 들려주며 평화로운 황혼의 한 해를 보냈습니다.'
  },

  // ==========================================
  // 우르수스 (Ursus)
  // ==========================================
  {
    id: 'urs_child_01',
    nationId: 'ursus',
    lifeStage: 'childhood',
    season: '겨울',
    text: '혹한의 체르노보그 변두리에서 두꺼운 모피 코트를 여민 채, 얼어붙은 호수 위에서 팽이를 돌렸습니다.'
  },
  {
    id: 'urs_child_02',
    nationId: 'ursus',
    lifeStage: 'childhood',
    season: '봄',
    text: '눈이 녹아 진흙탕이 된 광산촌 골목에서 작은 야생화를 꺾어 부모님의 거친 손에 쥐여드렸습니다.'
  },
  {
    id: 'urs_child_03',
    nationId: 'ursus',
    lifeStage: 'childhood',
    season: '가을',
    text: '자작나무 숲에서 갓 채취한 야생 버섯을 소금에 절이며, 혹독하게 다가올 긴 겨울을 준비했습니다.'
  },
  {
    id: 'urs_youth_01',
    nationId: 'ursus',
    lifeStage: 'youth',
    season: '겨울',
    text: '황제군 주둔지 너머로 울려 퍼지는 군악대 나팔 소리를 들으며, 단단한 흑빵을 뜨거운 보르시에 적셔 삼켰습니다.'
  },
  {
    id: 'urs_youth_02',
    nationId: 'ursus',
    lifeStage: 'youth',
    season: '여름',
    text: '짧은 북방의 여름 햇살 아래서 통나무를 패며 체력을 기르고, 억압된 제국의 미래를 침묵 속에 고민했습니다.'
  },
  {
    id: 'urs_adult_01',
    nationId: 'ursus',
    lifeStage: 'adulthood',
    season: '겨울',
    text: '영하 30도의 눈보라를 뚫고 공장 교대 근무를 마친 뒤, 놋쇠 사모바르에서 끓여낸 뜨거운 홍차로 언 손을 녹였습니다.'
  },
  {
    id: 'urs_adult_02',
    nationId: 'ursus',
    lifeStage: 'adulthood',
    season: '가을',
    text: '단단하게 굳은 손바닥을 바라보며 가족을 위해 감자 포대를 창고에 쌓았고, 무탈한 한 해에 감사했습니다.'
  },
  {
    id: 'urs_elder_01',
    nationId: 'ursus',
    lifeStage: 'elder',
    season: '겨울',
    text: '창가에 맺힌 서리꽃을 손가락으로 닦아내며, 눈 덮인 시베리아 침엽수림 너머 지평선을 묵묵히 응시했습니다.'
  },
  {
    id: 'urs_elder_02',
    nationId: 'ursus',
    lifeStage: 'elder',
    season: '봄',
    text: '수많은 전쟁과 한파를 견뎌낸 낡은 군용 외투를 털어 말리며, 뼈마디의 묵직한 통증 속에서 살아있음을 느꼈습니다.'
  },

  // ==========================================
  // 카시미어 (Kazimierz)
  // ==========================================
  {
    id: 'kaz_child_01',
    nationId: 'kazimierz',
    lifeStage: 'childhood',
    season: '봄',
    text: '카바레리에키의 네온사인 불빛 아래서 플라스틱 장난감 기사 투구를 쓰고 목마를 타며 거리를 달렸습니다.'
  },
  {
    id: 'kaz_child_02',
    nationId: 'kazimierz',
    lifeStage: 'childhood',
    season: '여름',
    text: '대형 전광판에서 중계되는 기사 메이저 토너먼트 결승전을 보며, 눈부신 페가수스 기사의 환호성을 따라 외쳤습니다.'
  },
  {
    id: 'kaz_youth_01',
    nationId: 'kazimierz',
    lifeStage: 'youth',
    season: '가을',
    text: '상업연합회의 스폰서 전단지가 휘날리는 경기장 뒷골목에서, 녹슨 연습용 검을 휘두르며 상금을 꿈꿨습니다.'
  },
  {
    id: 'kaz_youth_02',
    nationId: 'kazimierz',
    lifeStage: 'youth',
    season: '봄',
    text: '황금빛 들판을 가로지르는 철도 건널목에서 바람을 맞으며, 자본의 도시가 약속하는 기회의 문을 향해 걸었습니다.'
  },
  {
    id: 'kaz_adult_01',
    nationId: 'kazimierz',
    lifeStage: 'adulthood',
    season: '여름',
    text: '화려한 쇼비즈니스와 광고 계약의 번잡함 속에서도, 정직하게 땀 흘려 번 금화를 지갑에 조심스레 챙겨 넣었습니다.'
  },
  {
    id: 'kaz_adult_02',
    nationId: 'kazimierz',
    lifeStage: 'adulthood',
    season: '겨울',
    text: '경기장 환호성이 잦아든 늦은 밤, 조용한 주점에서 동료 기사와 맥주잔을 부딪치며 기사도의 본질을 되새겼습니다.'
  },
  {
    id: 'kaz_elder_01',
    nationId: 'kazimierz',
    lifeStage: 'elder',
    season: '가을',
    text: '빛바랜 은메달 훈장을 벨벳 상자에 정돈하며, 젊은 날 함성이 가득했던 아레나의 잔디 향기를 회상했습니다.'
  },

  // ==========================================
  // 컬럼비아 (Columbia)
  // ==========================================
  {
    id: 'col_child_01',
    nationId: 'columbia',
    lifeStage: 'childhood',
    season: '여름',
    text: '트리몬트 시내의 전자 상가 쇼윈도에 달라붙어, 최신 오리지늄 로봇 모형의 움직임을 반짝이는 눈으로 관찰했습니다.'
  },
  {
    id: 'col_child_02',
    nationId: 'columbia',
    lifeStage: 'childhood',
    season: '가을',
    text: '개척단 트럭 뒤칸에 걸터앉아 노을 진 고속도로를 바라보며 달콤한 옥수수 시럽 팬케이크를 베어 물었습니다.'
  },
  {
    id: 'col_youth_01',
    nationId: 'columbia',
    lifeStage: 'youth',
    season: '봄',
    text: '라인 랩의 거대한 연구동 유리벽 사이로 비치는 푸른 하늘을 보며, 언젠가 하늘 너머의 진실에 닿겠다는 꿈을 품었습니다.'
  },
  {
    id: 'col_youth_02',
    nationId: 'columbia',
    lifeStage: 'youth',
    season: '겨울',
    text: '24시간 불이 꺼지지 않는 네온 다이너에서 햄버거와 블랙커피를 곁에 두고, 개척 투자 사업계획서를 다듬었습니다.'
  },
  {
    id: 'col_adult_01',
    nationId: 'columbia',
    lifeStage: 'adulthood',
    season: '여름',
    text: '첨단 텔레메트리 모니터가 점멸하는 연구실에서 정밀 계측 수치를 기록하며, 신대륙 기술 혁신의 한 축을 담당했습니다.'
  },
  {
    id: 'col_adult_02',
    nationId: 'columbia',
    lifeStage: 'adulthood',
    season: '가을',
    text: '황야 개척지 주유소의 차가운 캔 소다를 들이켜며, 사막의 지평선 위로 끝없이 뻗은 송전탑 행렬을 감상했습니다.'
  },
  {
    id: 'col_elder_01',
    nationId: 'columbia',
    lifeStage: 'elder',
    season: '봄',
    text: '자유 공화국이 이룩한 거대한 마천루 옥상 정원에서, 망원경을 통해 별빛 가득한 인공위성 궤도를 바라보았습니다.'
  },

  // ==========================================
  // 이베리아 (Iberia)
  // ==========================================
  {
    id: 'ibe_child_01',
    nationId: 'iberia',
    lifeStage: 'childhood',
    season: '여름',
    text: '소금기 짙은 해안가 방파제에서 파도 소리를 들으며, 바다의 침묵 너머에서 온다는 고대 유물의 조개껍데기를 주웠습니다.'
  },
  {
    id: 'ibe_child_02',
    nationId: 'iberia',
    lifeStage: 'childhood',
    season: '겨울',
    text: '재판관들의 검은 롱코트 행렬이 지나가는 골목 어귀에서, 성당의 엄숙한 오르간 소리에 숨을 죽였습니다.'
  },
  {
    id: 'ibe_youth_01',
    nationId: 'iberia',
    lifeStage: 'youth',
    season: '봄',
    text: '그란파로스의 낡은 풍차 아래서 황금빛 올리브유와 딱딱한 빵을 나누어 먹으며, 잃어버린 황금 함대의 전설을 읊었습니다.'
  },
  {
    id: 'ibe_adult_01',
    nationId: 'iberia',
    lifeStage: 'adulthood',
    season: '가을',
    text: '거센 해풍에 흔들리는 등대의 불빛을 점검하며, 검푸른 바다 깊은 곳의 어둠이 뭍으로 번지지 않기를 간절히 기도했습니다.'
  },
  {
    id: 'ibe_adult_02',
    nationId: 'iberia',
    lifeStage: 'adulthood',
    season: '여름',
    text: '종교재판소의 서슬 퍼런 감시 속에서도 성실히 생선 상자를 나르며, 소박하고 단단한 이베리아인의 삶을 지켰습니다.'
  },
  {
    id: 'ibe_elder_01',
    nationId: 'iberia',
    lifeStage: 'elder',
    season: '겨울',
    text: '해안 절벽의 석조 벤치에 앉아 부서지는 하얀 포말을 바라보며, 대침묵(The Profound Silence) 이전 번영했던 제국을 회상했습니다.'
  },

  // ==========================================
  // 라테라노 (Laterano)
  // ==========================================
  {
    id: 'lat_child_01',
    nationId: 'laterano',
    lifeStage: 'childhood',
    season: '봄',
    text: '산크타들의 성스러운 종소리가 울려 퍼지는 광장에서, 갓 구운 달콤한 사과 파이 한 조각을 베어 물고 환하게 웃었습니다.'
  },
  {
    id: 'lat_child_02',
    nationId: 'laterano',
    lifeStage: 'childhood',
    season: '가을',
    text: '성당의 스테인드글라스를 통과한 무지갯빛 햇살 아래서, 작은 설탕 과자를 나누며 헤일로를 반짝였습니다.'
  },
  {
    id: 'lat_youth_01',
    nationId: 'laterano',
    lifeStage: 'youth',
    season: '여름',
    text: '공증소 앞 테라스 카페에서 시원한 레모네이드를 마시며, 처음으로 배정받은 수호총의 정밀 부품을 닦았습니다.'
  },
  {
    id: 'lat_youth_02',
    nationId: 'laterano',
    lifeStage: 'youth',
    season: '겨울',
    text: '성탄 축제가 한창인 밤거리에서 폭죽의 경쾌한 화약 내음을 맡으며 친구들과 캐럴을 합창했습니다.'
  },
  {
    id: 'lat_adult_01',
    nationId: 'laterano',
    lifeStage: 'adulthood',
    season: '봄',
    text: '교황청의 율법에 따라 조화로운 하루를 시작하며, 정오의 천상의 합창 소리에 잠시 일손을 멈추고 감사를 표했습니다.'
  },
  {
    id: 'lat_adult_02',
    nationId: 'laterano',
    lifeStage: 'adulthood',
    season: '가을',
    text: '베이커리 오븐에서 뿜어져 나오는 바닐라 향과 총기 기름 냄새가 어우러진 라테라노 특유의 거리를 온화하게 거닐었습니다.'
  },
  {
    id: 'lat_elder_01',
    nationId: 'laterano',
    lifeStage: 'elder',
    season: '여름',
    text: '성도 대성당의 흰 대리석 기둥 아래서 조용히 묵주를 굴리며, 지상의 모든 영혼들에게 신의 자비가 깃들기를 기도했습니다.'
  },

  // ==========================================
  // 라이타니엔 (Leithanien)
  // ==========================================
  {
    id: 'lei_child_01',
    nationId: 'leithanien',
    lifeStage: 'childhood',
    season: '봄',
    text: '쌍둥이 첨탑이 올려다보이는 예술학원 뜰에서, 바람에 흩날리는 악보 종이를 주우며 바이올린 선율에 귀를 기울였습니다.'
  },
  {
    id: 'lei_child_02',
    nationId: 'leithanien',
    lifeStage: 'childhood',
    season: '가을',
    text: '붉게 물든 포도밭 언덕에서 첼로 활 모양의 나뭇가지를 주워 들고 소년 합창단의 노랫소리를 따라 흥얼거렸습니다.'
  },
  {
    id: 'lei_youth_01',
    nationId: 'leithanien',
    lifeStage: 'youth',
    season: '여름',
    text: '바로크 양식의 카페 야외 좌석에서 비엔나 커피를 마시며, 음률 아츠의 배음 구조를 분석한 필기 노트를 정리했습니다.'
  },
  {
    id: 'lei_youth_02',
    nationId: 'leithanien',
    lifeStage: 'youth',
    season: '겨울',
    text: '눈 내리는 황실 오페라 극장의 뒷골목에서, 선제후들의 은밀한 연회 음악을 연주한 대가로 따스한 금화를 받았습니다.'
  },
  {
    id: 'lei_adult_01',
    nationId: 'leithanien',
    lifeStage: 'adulthood',
    season: '가을',
    text: '마호가니 책상 위에 촛불을 켜고 고전 교향곡의 총보를 정서하며, 아츠와 음악이 빚어내는 황홀경에 젖어 들었습니다.'
  },
  {
    id: 'lei_adult_02',
    nationId: 'leithanien',
    lifeStage: 'adulthood',
    season: '봄',
    text: '첨탑 도시의 귀족 정계가 암투로 술렁이는 와중에도, 단골 악기점에서 새로 조율된 하프시코드의 줄을 튕기며 마음을 달랬습니다.'
  },
  {
    id: 'lei_elder_01',
    nationId: 'leithanien',
    lifeStage: 'elder',
    season: '겨울',
    text: '벽난로 곁에서 낡은 첼로를 무릎 사이에 끼우고, 평생 동안 탐구했던 완벽한 화음 하나를 허공에 띄워 보냈습니다.'
  },

  // ==========================================
  // 사미 (Sami)
  // ==========================================
  {
    id: 'sam_child_01',
    nationId: 'sami',
    lifeStage: 'childhood',
    season: '겨울',
    text: '끝없는 설원의 이글루 텐트 속에서, 밤하늘을 수놓은 신비로운 초록빛 오로라를 바라보며 어머니의 모피 품에 안겼습니다.'
  },
  {
    id: 'sam_child_02',
    nationId: 'sami',
    lifeStage: 'childhood',
    season: '여름',
    text: '짧은 백야의 툰드라 습지에서 어린 순록의 목에 딸랑이는 방울을 걸어주며 은빛 이끼를 함께 뜯었습니다.'
  },
  {
    id: 'sam_youth_01',
    nationId: 'sami',
    lifeStage: 'youth',
    season: '가을',
    text: '스노우프리스트의 거대한 신목 아래서 뼈로 만든 룬 문자를 굴리며, 북방의 암흑 안개가 다가오지 않기를 점쳤습니다.'
  },
  {
    id: 'sam_youth_02',
    nationId: 'sami',
    lifeStage: 'youth',
    season: '겨울',
    text: '설원에 쳐둔 덫을 살피고 거친 침엽수를 베어 장작을 마련하며, 혹독한 대지에서 살아남는 원초의 감각을 익혔습니다.'
  },
  {
    id: 'sam_adult_01',
    nationId: 'sami',
    lifeStage: 'adulthood',
    season: '봄',
    text: '얼음이 갈라지는 북방 방어선 초소에서 보초를 서며, 끓는 순록 고기 수프로 언 몸을 녹이고 대자연의 호흡을 느꼈습니다.'
  },
  {
    id: 'sam_adult_02',
    nationId: 'sami',
    lifeStage: 'adulthood',
    season: '가을',
    text: '원시림 깊은 곳에서 사이클롭스 점술가들의 묵직한 주문 소리를 들으며, 겨울나기용 말린 생선을 창고에 걸었습니다.'
  },
  {
    id: 'sam_elder_01',
    nationId: 'sami',
    lifeStage: 'elder',
    season: '겨울',
    text: '천막 밖으로 몰아치는 극지의 눈보라 소리를 들으며, 대지의 영혼들에게 바치는 고대 사미의 노래를 고요히 흥얼거렸습니다.'
  },

  // ==========================================
  // 시라쿠사 (Siracusa)
  // ==========================================
  {
    id: 'sir_child_01',
    nationId: 'siracusa',
    lifeStage: 'childhood',
    season: '가을',
    text: '볼시니의 비 내리는 돌길 위에서 갓 구운 토마토 포카치아를 베어 물고, 골목길을 순찰하는 루포 어른들의 눈치를 살폈습니다.'
  },
  {
    id: 'sir_child_02',
    nationId: 'siracusa',
    lifeStage: 'childhood',
    season: '봄',
    text: '오페라 하우스 뒷마당 계단에서 버려진 가면 조각을 얼굴에 대보며, 대부(Godfather)들의 웅장한 연극 흉내를 냈습니다.'
  },
  {
    id: 'sir_youth_01',
    nationId: 'siracusa',
    lifeStage: 'youth',
    season: '여름',
    text: '에스프레소의 쌉싸름한 향이 감도는 골목 카페에서 담배 연기를 뿜는 마피아 단원들 사이로 심부름 서류를 조심스레 전달했습니다.'
  },
  {
    id: 'sir_youth_02',
    nationId: 'siracusa',
    lifeStage: 'youth',
    season: '겨울',
    text: '코트 깃을 바짝 세우고 차가운 비를 맞으며 귀가하던 길, 뒷골목 어둠 속에서 들려온 짧은 총성과 탄피 튀는 소리에 발걸음을 재촉했습니다.'
  },
  {
    id: 'sir_adult_01',
    nationId: 'siracusa',
    lifeStage: 'adulthood',
    season: '가을',
    text: '패밀리의 식탁에서 피 묻지 않은 빵을 지켜내며, 묵직한 권총을 품 안쪽에 감추고 가족과의 저녁 식사를 평온히 마쳤습니다.'
  },
  {
    id: 'sir_adult_02',
    nationId: 'siracusa',
    lifeStage: 'adulthood',
    season: '봄',
    text: '비 내리는 도시의 축축한 아스팔트 위로 클래식 자동차가 지나갈 때, 우산을 고쳐 쥐고 사법부 청사로 출근길을 서둘렀습니다.'
  },
  {
    id: 'sir_elder_01',
    nationId: 'siracusa',
    lifeStage: 'elder',
    season: '겨울',
    text: '오랜 세월 수많은 복수극 속에서도 살아남은 늙은 늑대로서, 흔들의자에 앉아 쓴 에스프레소를 음미하며 밤의 장막을 바라보았습니다.'
  },

  // ==========================================
  // 사르고 (Sargon)
  // ==========================================
  {
    id: 'sar_child_01',
    nationId: 'sargon',
    lifeStage: 'childhood',
    season: '여름',
    text: '작열하는 사막의 정오, 시원한 오아시스 야자수 그늘 아래서 달콤한 대추야자를 먹으며 모래성을 쌓았습니다.'
  },
  {
    id: 'sar_child_02',
    nationId: 'sargon',
    lifeStage: 'childhood',
    season: '봄',
    text: '아카후알라 열대우림 어귀에서 다채로운 깃털의 열대 새들을 쫓아 덩굴 숲을 뛰어다녔습니다.'
  },
  {
    id: 'sar_youth_01',
    nationId: 'sargon',
    lifeStage: 'youth',
    season: '가을',
    text: '파디샤의 거대한 카라반을 따라 끝없는 모래언덕을 넘으며, 낙타 방울 소리에 맞춰 사막 전사들의 무용담을 배웠습니다.'
  },
  {
    id: 'sar_youth_02',
    nationId: 'sargon',
    lifeStage: 'youth',
    season: '여름',
    text: '뜨겁게 달아오른 사막 곡도를 숫돌에 갈며, 붉은 노을이 지는 황야를 배경으로 전사의 자세를 가다듬었습니다.'
  },
  {
    id: 'sar_adult_01',
    nationId: 'sargon',
    lifeStage: 'adulthood',
    season: '봄',
    text: '황야의 모래폭풍이 지나간 뒤 진흙 벽돌 집의 지붕을 보수하고, 우물에서 길어 올린 청량한 물 한 모금으로 갈증을 달랬습니다.'
  },
  {
    id: 'sar_adult_02',
    nationId: 'sargon',
    lifeStage: 'adulthood',
    season: '겨울',
    text: '모닥불 주변에 부족민들과 둥글게 둘러앉아 양고기 스튜를 나누며, 밤하늘의 쏟아질 듯한 별들을 감상했습니다.'
  },
  {
    id: 'sar_elder_01',
    nationId: 'sargon',
    lifeStage: 'elder',
    season: '가을',
    text: '뜨거운 태양이 대지를 식히는 황혼녘, 주름진 손으로 사막의 고운 모래를 한 줌 쥐었다 놓으며 영겁의 시간을 음미했습니다.'
  },

  // ==========================================
  // 림 빌리톤 (Rim Billiton)
  // ==========================================
  {
    id: 'rim_child_01',
    nationId: 'rim_billiton',
    lifeStage: 'childhood',
    season: '봄',
    text: '거대한 채굴 육상함의 쇳소리 속에서, 버려진 작은 오리지늄 광석 조각을 모으며 광부 놀이를 했습니다.'
  },
  {
    id: 'rim_child_02',
    nationId: 'rim_billiton',
    lifeStage: 'childhood',
    season: '가을',
    text: '붉은 황무지의 흙먼지를 뒤집어쓴 채 카우투스 귀를 쫑긋거리며, 엄마가 싸준 당근 파이를 맛있게 나누어 먹었습니다.'
  },
  {
    id: 'rim_youth_01',
    nationId: 'rim_billiton',
    lifeStage: 'youth',
    season: '여름',
    text: '지하 갱도로 내려가는 승강기 안에서 안전모의 랜턴을 밝히며, 묵직한 착암기의 진동을 온몸으로 받아냈습니다.'
  },
  {
    id: 'rim_youth_02',
    nationId: 'rim_billiton',
    lifeStage: 'youth',
    season: '겨울',
    text: '용광로의 열기가 후끈 달아오른 제련소 구내식당에서 시원한 탄산수를 들이켜며 동료들과 수당 장부를 점검했습니다.'
  },
  {
    id: 'rim_adult_01',
    nationId: 'rim_billiton',
    lifeStage: 'adulthood',
    season: '가을',
    text: '초대형 굴착 육상함의 메인 엔진 베어링에 윤활유를 주입하고, 거친 황무지를 가르는 육상함의 당당한 전진을 지켜보았습니다.'
  },
  {
    id: 'rim_adult_02',
    nationId: 'rim_billiton',
    lifeStage: 'adulthood',
    season: '봄',
    text: '붉은 먼지가 내려앉은 정비창 창가에서 녹슨 렌치를 닦으며, 묵묵한 근로가 가져다준 통장 잔고에 미소를 지었습니다.'
  },
  {
    id: 'rim_elder_01',
    nationId: 'rim_billiton',
    lifeStage: 'elder',
    season: '여름',
    text: '평생을 바친 채굴 육상함의 갑판 난간에 기대어, 붉은 노을이 끝없이 펼쳐진 아웃백 황무지를 평온하게 바라보았습니다.'
  },

  // ==========================================
  // 용문 (Lungmen)
  // ==========================================
  {
    id: 'lun_child_01',
    nationId: 'lungmen',
    lifeStage: 'childhood',
    season: '봄',
    text: '용문 상부 코어의 화려한 네온사인 아래서, 갓 튀겨낸 춘권을 손에 들고 근위국의 패트롤 차량을 신기하게 쳐다보았습니다.'
  },
  {
    id: 'lun_child_02',
    nationId: 'lungmen',
    lifeStage: 'childhood',
    season: '여름',
    text: '슬럼가와 상업 지구의 경계선 골목에서 비둘기들에게 빵 부스러기를 던져주며 항구의 뱃고동 소리를 들었습니다.'
  },
  {
    id: 'lun_youth_01',
    nationId: 'lungmen',
    lifeStage: 'youth',
    season: '가을',
    text: '야시장의 북적이는 포장마차에서 딤섬을 먹으며, 주식 시세판의 붉은 화살표와 용문폐(LMD) 환율을 분석했습니다.'
  },
  {
    id: 'lun_youth_02',
    nationId: 'lungmen',
    lifeStage: 'youth',
    season: '겨울',
    text: '근위국의 사이렌 소리가 멀리 울려 퍼지는 밤, 빗물에 젖은 거리를 우산 없이 달리며 독립 도시의 치열한 경쟁을 절감했습니다.'
  },
  {
    id: 'lun_adult_01',
    nationId: 'lungmen',
    lifeStage: 'adulthood',
    season: '봄',
    text: '웨이 옌우 총독부 인근 무역 빌딩에서 수억 LMD 규모의 계약서에 도장을 찍고, 성공적인 비즈니스를 축하했습니다.'
  },
  {
    id: 'lun_adult_02',
    nationId: 'lungmen',
    lifeStage: 'adulthood',
    season: '가을',
    text: '고층 아파트 발코니에서 용문 항구에 정박한 수백 척의 화물선을 내려다보며, 진한 밀크티 한 잔으로 숨을 돌렸습니다.'
  },
  {
    id: 'lun_elder_01',
    nationId: 'lungmen',
    lifeStage: 'elder',
    season: '겨울',
    text: '세월이 흘러도 잠들지 않는 용문의 마천루 야경을 바라보며, 밑바닥에서 시작해 쌓아 올린 인생의 자취를 되돌아보았습니다.'
  },

  // ==========================================
  // 카즈델 (Kazdel)
  // ==========================================
  {
    id: 'kazd_child_01',
    nationId: 'kazdel',
    lifeStage: 'childhood',
    season: '겨울',
    text: '폐허가 된 흑요석 성벽 틈새에서 차가운 밤바람을 피하며, 늙은 용병이 건네준 말린 말고기 조각을 씹었습니다.'
  },
  {
    id: 'kazd_child_02',
    nationId: 'kazdel',
    lifeStage: 'childhood',
    season: '봄',
    text: '버려진 투구와 부러진 검날이 흩어진 전장 터에서 작은 들풀이 돋아난 모습을 신기하게 지켜보았습니다.'
  },
  {
    id: 'kazd_youth_01',
    nationId: 'kazdel',
    lifeStage: 'youth',
    season: '가을',
    text: '모닥불 곁에서 살카즈 용병단의 거친 군가를 들으며, 대검 손잡이를 단단한 가죽 끈으로 동여맸습니다.'
  },
  {
    id: 'kazd_adult_01',
    nationId: 'kazdel',
    lifeStage: 'adulthood',
    season: '여름',
    text: '파괴와 재건이 반복되는 카즈델의 폐허 속에서도 작은 방공호에 모여 국수를 끓이며 동포들과 피의 유대를 다졌습니다.'
  },
  {
    id: 'kazd_elder_01',
    nationId: 'kazdel',
    lifeStage: 'elder',
    season: '겨울',
    text: '온몸에 새겨진 전투의 흉터들을 어루만지며, 폐허의 바람 속에 잠든 옛 바벨과 마왕의 전설을 회상했습니다.'
  },

  // ==========================================
  // 쉐라그 (Kjerag)
  // ==========================================
  {
    id: 'kje_child_01',
    nationId: 'kjerag',
    lifeStage: 'childhood',
    season: '겨울',
    text: '만년설 성산 기슭의 성역 마당에서, 사원의 향 연기 사이로 떨어지는 하얀 함박눈을 입으로 받아먹었습니다.'
  },
  {
    id: 'kje_child_02',
    nationId: 'kjerag',
    lifeStage: 'childhood',
    season: '봄',
    text: '실버애쉬 가문의 근대화 철도를 따라 달리는 증기 기관차를 향해 목동의 지팡이를 흔들었습니다.'
  },
  {
    id: 'kje_youth_01',
    nationId: 'kjerag',
    lifeStage: 'youth',
    season: '가을',
    text: '카란 무역회사의 창고에서 따스한 야크 털 스웨터를 입고, 산악 열차에 실릴 물자 송장을 검수했습니다.'
  },
  {
    id: 'kje_adult_01',
    nationId: 'kjerag',
    lifeStage: 'adulthood',
    season: '겨울',
    text: '눈 덮인 협곡이 내려다보이는 온천 여관에서 따뜻한 유황 온천수에 몸을 담그며, 성산의 절대적인 평화를 만끽했습니다.'
  },
  {
    id: 'kje_elder_01',
    nationId: 'kjerag',
    lifeStage: 'elder',
    season: '봄',
    text: '투리스 시내가 한눈에 내려다보이는 산기슭 테라스에서 카란의 허브 티를 마시며, 성산의 종소리를 경건하게 들었습니다.'
  },

  // ==========================================
  // 환경 특화 일상 (Environments)
  // ==========================================
  {
    id: 'env_elite_01',
    nationId: 'all',
    lifeStage: 'all',
    environment: '이동도시 상류층',
    season: '봄',
    text: '이동도시 코어 구역의 클래식 살롱에서 은제 식기에 담긴 애프터눈 티를 음미하며 고상한 사교계의 담소를 나누었습니다.'
  },
  {
    id: 'env_elite_02',
    nationId: 'all',
    lifeStage: 'all',
    environment: '이동도시 상류층',
    season: '가을',
    text: '완벽하게 방음된 펜트하우스 서재에서 이동도시 공기정화 필터의 청량함을 느끼며 사치스러운 클래식 음반을 감상했습니다.'
  },
  {
    id: 'env_res_01',
    nationId: 'all',
    lifeStage: 'all',
    environment: '일반 거주구',
    season: '여름',
    text: '평범하지만 정겨운 아파트 복도에서 이웃 주민과 반갑게 인사를 나누고, 저녁 찬거리로 신선한 채소를 사 들고 귀가했습니다.'
  },
  {
    id: 'env_res_02',
    nationId: 'all',
    lifeStage: 'all',
    environment: '일반 거주구',
    season: '겨울',
    text: '약간의 연체료가 붙은 난방비 고지서를 훑어보았지만, 거실 중앙의 온풍기 바람을 쐬며 가족과 귤을 까먹는 소박한 행복을 누렸습니다.'
  },
  {
    id: 'env_slum_01',
    nationId: 'all',
    lifeStage: 'all',
    environment: '슬럼가 및 암시장',
    season: '가을',
    text: '이동도시 하부 환기구의 축축한 열기 속에서, 암시장의 낡은 부품 좌판을 둘러보며 흥정의 기회를 엿보았습니다.'
  },
  {
    id: 'env_slum_02',
    nationId: 'all',
    lifeStage: 'all',
    environment: '슬럼가 및 암시장',
    season: '겨울',
    text: '드럼통에 피운 장작불 주위에 부랑자들과 옹기종기 모여 앉아, 얼어붙은 주먹밥을 모닥불에 데워 먹으며 겨울밤을 견뎠습니다.'
  },
  {
    id: 'env_nomad_01',
    nationId: 'all',
    lifeStage: 'all',
    environment: '황야의 노마드 캠프',
    season: '봄',
    text: '재앙의 그림자가 비켜간 메마른 황야에서 이동 천막을 거두고, 풀밭을 찾아 떠나는 카라반 대열에 발맞추어 나아갔습니다.'
  },
  {
    id: 'env_nomad_02',
    nationId: 'all',
    lifeStage: 'all',
    environment: '황야의 노마드 캠프',
    season: '여름',
    text: '황야의 거친 바람에 삐걱거리는 트랙터 위에서 먼지 묻은 물통의 미지근한 물을 마시며 수평선 너머의 이동도시 불빛을 바라보았습니다.'
  },
  {
    id: 'env_base_01',
    nationId: 'all',
    lifeStage: 'all',
    environment: '이동기지 (로도스/블랙스틸)',
    season: '봄',
    text: '육상함 로도스 아일랜드의 메디컬 데크 복도에서 청진기를 목에 건 의료 오퍼레이터들과 가볍게 눈인사를 교환했습니다.'
  },
  {
    id: 'env_base_02',
    nationId: 'all',
    lifeStage: 'all',
    environment: '이동기지 (로도스/블랙스틸)',
    season: '가을',
    text: '전술 훈련실에서 정비된 카빈 소총의 작동성을 점검한 뒤, 휴게실의 자동판매기에서 캔 커피를 뽑아 마시며 교대 시간을 기다렸습니다.'
  },

  // ==========================================
  // 생애 전반 공통 테라 서정 일상 (General Atmospheric)
  // ==========================================
  {
    id: 'gen_child_01',
    nationId: 'all',
    lifeStage: 'childhood',
    season: 'all',
    text: '골목길 어귀에서 작은 돌멩이를 주워 차며, 하늘 높이 날아가는 이동도시의 관측 기구를 호기심 가득 찬 눈으로 바라보았습니다.'
  },
  {
    id: 'gen_child_02',
    nationId: 'all',
    lifeStage: 'childhood',
    season: 'all',
    text: '어른들이 일터로 떠난 조용한 한낮, 마른 먼지가 피어오르는 창틀에 턱을 괴고 테라의 변덕스러운 구름을 세어보았습니다.'
  },
  {
    id: 'gen_youth_01',
    nationId: 'all',
    lifeStage: 'youth',
    season: 'all',
    text: '밤하늘의 불길한 오리지늄 광채를 올려다보며, 이 거친 대지 위에서 자신만의 확고한 자리를 찾겠노라 다짐했습니다.'
  },
  {
    id: 'gen_youth_02',
    nationId: 'all',
    lifeStage: 'youth',
    season: 'all',
    text: '지친 일과 끝에 길모퉁이 분식점에서 김이 오르는 국수를 들이켜며, 꿈과 현실 사이의 무게를 묵묵히 짊어졌습니다.'
  },
  {
    id: 'gen_adult_01',
    nationId: 'all',
    lifeStage: 'adulthood',
    season: 'all',
    text: '손에 굳은살이 깊게 박힌 채 매달의 가계부와 세금 계산을 마치고, 가족의 평안한 숨소리를 들으며 안도의 한숨을 내쉬었습니다.'
  },
  {
    id: 'gen_adult_02',
    nationId: 'all',
    lifeStage: 'adulthood',
    season: 'all',
    text: '매서운 계절의 변화 속에서도 성실히 직무를 완수하고, 오늘 하루도 대지의 재앙 없이 무탈했음에 깊이 감사했습니다.'
  },
  {
    id: 'gen_elder_01',
    nationId: 'all',
    lifeStage: 'elder',
    season: 'all',
    text: '지팡이에 몸을 의지한 채 마을 어귀 언덕에 서서, 저 멀리 붉게 물드는 테라의 지평선과 지나온 세월을 담담히 응시했습니다.'
  },
  {
    id: 'gen_elder_02',
    nationId: 'all',
    lifeStage: 'elder',
    season: 'all',
    text: '마루 끝에 앉아 따스한 햇볕을 쬐며 졸다가, 마당으로 날아든 산새의 날갯짓 소리에 엷은 미소를 지었습니다.'
  }
];

/**
 * 캐릭터의 출신 국가, 생애 단계(유년기/청년기/장년기/노년기), 거주 환경, 계절에 맞춘
 * 서정적 문학 테라 일상 한 줄을 반환합니다.
 */
export function getRoutineLifeLine(char: Character, season: Season): string {
  const nationId = resolveNationId(char.nation);
  
  // 생애 단계 판별
  let lifeStage: 'childhood' | 'youth' | 'adulthood' | 'elder' = 'adulthood';
  if (char.age < 15) {
    lifeStage = 'childhood';
  } else if (char.age < 25) {
    lifeStage = 'youth';
  } else if (char.age < 50) {
    lifeStage = 'adulthood';
  } else {
    lifeStage = 'elder';
  }

  // 1차 필터링: 국가 일치 + 생애 단계 일치
  const primaryCandidates = ROUTINE_LIFE_ENTRIES.filter(e => {
    const nationMatch = e.nationId === nationId;
    const stageMatch = e.lifeStage === lifeStage || e.lifeStage === 'all';
    const seasonMatch = !e.season || e.season === 'all' || e.season === season;
    return nationMatch && stageMatch && seasonMatch;
  });

  const yearVal = typeof char.year === 'number' && !isNaN(char.year) ? char.year : 1090;

  if (primaryCandidates.length > 0) {
    const seedIndex = Math.abs((char.age * 37 + season.charCodeAt(0) * 13 + yearVal) % primaryCandidates.length);
    const selected = primaryCandidates[seedIndex] || primaryCandidates[0];
    if (selected?.text) return selected.text;
  }

  // 2차 필터링: 환경 일치 + 생애 단계 일치
  const envCandidates = ROUTINE_LIFE_ENTRIES.filter(e => {
    const envMatch = e.environment === char.environment;
    const stageMatch = e.lifeStage === lifeStage || e.lifeStage === 'all';
    return envMatch && stageMatch;
  });

  if (envCandidates.length > 0) {
    const seedIndex = Math.abs((char.age * 19 + yearVal) % envCandidates.length);
    const selected = envCandidates[seedIndex] || envCandidates[0];
    if (selected?.text) return selected.text;
  }

  // 3차 필터링: 일반 생애 단계 일치
  const generalCandidates = ROUTINE_LIFE_ENTRIES.filter(e => {
    return (e.nationId === 'all' || !e.nationId) && (e.lifeStage === lifeStage || e.lifeStage === 'all');
  });

  if (generalCandidates.length > 0) {
    const seedIndex = Math.abs((char.age * 7 + yearVal) % generalCandidates.length);
    const selected = generalCandidates[seedIndex] || generalCandidates[0];
    if (selected?.text) return selected.text;
  }

  // 절대적 기본 폴백
  return `${char.nation}의 ${char.environment}에서 ${char.age}세의 사계절을 맞이하며, 대지의 거친 숨결 속에서도 묵묵히 하루를 살아냈습니다.`;
}
