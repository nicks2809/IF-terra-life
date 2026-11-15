// src/data/nationThemes.ts
// 테라 15개국 + 로도스 아일랜드 전용 비주얼 테마, 핵심 이벤트 모티브 및 다중 서브테마 정의

import { NationThemeId, NationVisualIdentity } from '../types';

export const NATION_VISUAL_IDENTITIES: Record<NationThemeId, NationVisualIdentity> = {
  victoria: {
    id: 'victoria',
    nameKo: '빅토리아',
    nameEn: 'Victoria',
    motto: 'May the Golden Lion Watch Over Londinium',
    insigniaTitle: '제국 증기 기사단과 황실의 사자',
    terminalHeader: {
      title: 'LONDINIUM STEAM ORDNANCE',
      subtitle: '런디니움 왕립 군수공장 및 증기 승강장 지령 단말기',
      inspiration: '런디니움 편(9~14장) · 『위대한 서곡의 끝』 · 『불타버린 엘레지여』'
    },
    interfaceTitle: 'LONDINIUM STEAM ORDNANCE',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'victoria-steam',
      title: '황실 증기압 지표',
      position: 'header-ribbon',
      metricLabel: 'STEAM CORE'
    },
    colors: {
      primary: '#c5283d',
      primaryGlow: 'rgba(197, 40, 61, 0.45)',
      secondary: '#d4af37',
      surface: '#10121a',
      card: '#171b26',
      border: 'rgba(212, 175, 55, 0.38)',
      accent: '#eab308',
      badgeBg: 'rgba(197, 40, 61, 0.22)',
      badgeText: '#fde68a',
      scanlineTint: 'rgba(212, 175, 55, 0.05)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'chamfer',
      glowIntensity: 'medium'
    },
    eventRefs: ['메인 9~14장 런디니움', '『위대한 서곡의 끝』', '『불타버린 엘레지여』'],
    officialThemes: ['공식 테마: 『미성』'],
    designSummary: '포연과 스모그 색조 위 왕실 기사단 문장·강철 황동 리벳 질감 및 타라 보라 불꽃 대비',
    fontMood: 'serif_editorial',
    buttonMetaphor: 'ordnance_card',
    choiceLabels: ['왕립 군수 지령', '증기 승강장 발차', '의회 긴급 의정서', '타라 화염 서약'],
    progressStyle: 'steam_flap',
    apMetaphor: {
      label: '증기 가동',
      badgeUnit: 'PSI',
      tooltip: '런디니움 증기 기관 밸브 및 연간 작전 가동력',
      iconType: 'gear'
    },
    subThemes: [
      {
        id: 'londinium_steam',
        nameKo: '런디니움 증기·황동',
        eventSource: '런디니움 편 · 『위대한 서곡의 끝』',
        officialTheme: '공식 테마: 『미성』',
        description: '안개와 포연이 자욱한 스모그 색조 위 대영제국풍 기사단 문장과 강철·황동 기계 단말기',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'victoria_steam',
        colors: {
          primary: '#c5283d',
          primaryGlow: 'rgba(197, 40, 61, 0.45)',
          secondary: '#d4af37',
          surface: '#10121a',
          card: '#171b26',
          border: 'rgba(212, 175, 55, 0.38)',
          accent: '#eab308',
          badgeBg: 'rgba(212, 175, 55, 0.16)',
          badgeText: '#fde68a',
          scanlineTint: 'rgba(212, 175, 55, 0.05)',
          textPrimary: '#f1f5f9',
          textSecondary: '#cbd5e1',
          textMuted: '#94a3b8',
          panelBg: 'rgba(23, 27, 38, 0.85)',
          panelBorder: 'rgba(212, 175, 55, 0.36)'
        }
      },
      {
        id: 'tara_elegy',
        nameKo: '타라 자색 불꽃',
        eventSource: '『불타버린 엘레지여』',
        description: '타라 연작 특유의 보라색 시야 경계선과 타오르는 불꽃 앰버 대비',
        polarity: 'dark',
        autoTrigger: 'crisis',
        backdropVariant: 'victoria_tara',
        colors: {
          primary: '#a855f7',
          primaryGlow: 'rgba(168, 85, 247, 0.5)',
          secondary: '#fb923c',
          surface: '#120d1d',
          card: '#1b132b',
          border: 'rgba(192, 132, 252, 0.42)',
          accent: '#fdba74',
          badgeBg: 'rgba(168, 85, 247, 0.22)',
          badgeText: '#e9d5ff',
          scanlineTint: 'rgba(168, 85, 247, 0.06)',
          textPrimary: '#f5f3ff',
          textSecondary: '#ddd6fe',
          textMuted: '#a78bfa',
          panelBg: 'rgba(27, 19, 43, 0.86)',
          panelBorder: 'rgba(192, 132, 252, 0.4)'
        }
      }
    ]
  },

  yan: {
    id: 'yan',
    nameKo: '염국',
    nameEn: 'Yan',
    motto: '천하의 질서와 쉐이의 균형',
    insigniaTitle: '진용군과 대리사의 주홍 낙관',
    terminalHeader: {
      title: '司歲臺 // 대염 수묵 감찰록',
      subtitle: '사세태 순묘 목조 탁본 및 12쉐이 기담 관측',
      inspiration: '『화중인』 · 『회서리』 · 『사세행』 · 『쉐이의 기이한 계원』'
    },
    interfaceTitle: '司歲臺 // 대염 수묵 감찰록',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'yan-tianji',
      title: '천기(天機) 감찰',
      position: 'chronicle-banner',
      metricLabel: 'TIANJI'
    },
    colors: {
      primary: '#c83c23',
      primaryGlow: 'rgba(200, 60, 35, 0.45)',
      secondary: '#3a7d69',
      surface: '#0c1212',
      card: '#131d1d',
      border: 'rgba(229, 193, 88, 0.38)',
      accent: '#e5c158',
      badgeBg: 'rgba(200, 60, 35, 0.22)',
      badgeText: '#fde68a',
      scanlineTint: 'rgba(58, 125, 105, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'filigree',
      glowIntensity: 'subtle'
    },
    eventRefs: ['『화중인』', '『회서리』', '『사세행』', '『쉐이의 기이한 계원』'],
    officialThemes: ['공식 테마: 『대황』', '『현상』'],
    designSummary: '수묵 농담·순묘 목조·붉은 탁본 미학과 전지 공예·고채도 분홍/곰팡이 녹색 중식 아날로그 호러 이원화',
    fontMood: 'brush_seal',
    buttonMetaphor: 'talisman_seal',
    choiceLabels: ['황부(黃符) 제1결', '사세태 감찰첩', '주홍 인장령', '대염 묵향 서찰'],
    progressStyle: 'ink_coin',
    apMetaphor: {
      label: '대염통보 투척',
      badgeUnit: '文',
      tooltip: '대염통보(엽전) 점괘 투척 및 연간 행정·수련 결단',
      iconType: 'coin'
    },
    subThemes: [
      {
        id: 'ink_rubbing',
        nameKo: '수묵·순묘 탁본',
        eventSource: '『화중인』 · 『회서리』 · 『사세행』',
        officialTheme: '공식 테마: 『대황』',
        description: '정통 수묵 농담·순묘(장부맞춤) 목조 프레임·붉은 활자 탁본 및 노란 부적 태그 미학',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'yan_ink',
        colors: {
          primary: '#dc3b24',
          primaryGlow: 'rgba(220, 59, 36, 0.45)',
          secondary: '#3a7d69',
          surface: '#0d1312',
          card: '#151f1e',
          border: 'rgba(229, 193, 88, 0.4)',
          accent: '#facc15',
          badgeBg: 'rgba(234, 179, 8, 0.18)',
          badgeText: '#fef08a',
          scanlineTint: 'rgba(229, 193, 88, 0.04)',
          textPrimary: '#f5f5f4',
          textSecondary: '#d6d3d1',
          textMuted: '#a8a29e',
          panelBg: 'rgba(21, 31, 30, 0.88)',
          panelBorder: 'rgba(229, 193, 88, 0.36)'
        }
      },
      {
        id: 'sui_horror',
        nameKo: '계원 전지·호러',
        eventSource: '통합 전략 『쉐이의 기이한 계원』',
        officialTheme: '공식 테마: 『현상』',
        description: '전지 공예 실루엣에 고채도 분홍·곰팡이 녹색 대비와 CRT 노이즈를 결합한 중식 아날로그 호러',
        polarity: 'dark',
        autoTrigger: 'crisis',
        backdropVariant: 'yan_horror',
        colors: {
          primary: '#f43f5e',
          primaryGlow: 'rgba(244, 63, 94, 0.55)',
          secondary: '#65a30d',
          surface: '#0b120d',
          card: '#121f15',
          border: 'rgba(244, 63, 94, 0.45)',
          accent: '#a3e635',
          badgeBg: 'rgba(101, 163, 13, 0.25)',
          badgeText: '#fda4af',
          scanlineTint: 'rgba(163, 230, 53, 0.07)',
          textPrimary: '#ecfccb',
          textSecondary: '#fda4af',
          textMuted: '#84cc16',
          panelBg: 'rgba(18, 31, 21, 0.88)',
          panelBorder: 'rgba(244, 63, 94, 0.42)'
        }
      }
    ]
  },

  ursus: {
    id: 'ursus',
    nameKo: '우르수스 제국',
    nameEn: 'Ursus',
    motto: '불굴의 강철과 황제의 영광',
    insigniaTitle: '북방의 쌍두 곰과 붉은 제국성',
    terminalHeader: {
      title: 'СВЯТОГОР // 성준보 선전 지휘국',
      subtitle: '구축주의 전진 타이머 및 제국 활판 스탬프 통제망',
      inspiration: '『사람들, 우리들』 · 『시간이여, 앞으로!』'
    },
    interfaceTitle: 'СВЯТОГОР // 성준보 선전 지휘국',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'ursus-cold-command',
      title: '동토 혹한 경계',
      position: 'header-ribbon',
      metricLabel: 'COLD FRONT'
    },
    colors: {
      primary: '#dc2626',
      primaryGlow: 'rgba(220, 38, 38, 0.48)',
      secondary: '#d9822b',
      surface: '#0e1117',
      card: '#161b24',
      border: 'rgba(220, 38, 38, 0.42)',
      accent: '#fca5a5',
      badgeBg: 'rgba(220, 38, 38, 0.22)',
      badgeText: '#fde68a',
      scanlineTint: 'rgba(220, 38, 38, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.05,
      cornerStyle: 'sharp',
      glowIntensity: 'medium'
    },
    eventRefs: ['『사람들, 우리들』', '『시간이여, 앞으로!』'],
    designSummary: '러시아 구축주의 대칭 구도·쇠망치 타이포그래피·건축 백모 실루엣·성준보 신문 활판지 및 붉은 스탬프',
    fontMood: 'constructivist',
    buttonMetaphor: 'pravda_stamp',
    choiceLabels: ['성준보 호외 결재', '쇠망치 연대 결의', '전진 열차 배차', '붉은 스탬프 날인'],
    progressStyle: 'forward_timer',
    apMetaphor: {
      label: '전진 공정',
      badgeUnit: '공수',
      tooltip: '『시간이여, 앞으로!』 정방향 전진 공정 및 노동·군사 투입량',
      iconType: 'hammer'
    },
    subThemes: [
      {
        id: 'constructivist',
        nameKo: '구축주의·성준보',
        eventSource: '『시간이여, 앞으로!』',
        description: '소비에트 선전 사선 구도, 하얀 건축 백모 실루엣, 정방향 타이머와 성준보 붉은 결재 스탬프',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'ursus_constructivist',
        colors: {
          primary: '#dc2626',
          primaryGlow: 'rgba(220, 38, 38, 0.48)',
          secondary: '#f59e0b',
          surface: '#0e1117',
          card: '#171b23',
          border: 'rgba(220, 38, 38, 0.45)',
          accent: '#fca5a5',
          badgeBg: 'rgba(220, 38, 38, 0.24)',
          badgeText: '#fef08a',
          scanlineTint: 'rgba(220, 38, 38, 0.05)',
          textPrimary: '#f8fafc',
          textSecondary: '#e2e8f0',
          textMuted: '#94a3b8',
          panelBg: 'rgba(23, 27, 35, 0.9)',
          panelBorder: 'rgba(220, 38, 38, 0.42)'
        }
      },
      {
        id: 'peredvizhniki',
        nameKo: '이동파 동토 유화',
        eventSource: '『사람들, 우리들』',
        description: '러시아 이동파 사실주의 유화의 묵직한 황토·잿빛 질감과 열차 그래피티 훈장 대비',
        polarity: 'dark',
        autoTrigger: 'night',
        backdropVariant: 'ursus_oil',
        colors: {
          primary: '#d97706',
          primaryGlow: 'rgba(217, 119, 6, 0.45)',
          secondary: '#94a3b8',
          surface: '#121110',
          card: '#1c1a17',
          border: 'rgba(217, 119, 6, 0.38)',
          accent: '#fcd34d',
          badgeBg: 'rgba(217, 119, 6, 0.2)',
          badgeText: '#fde68a',
          scanlineTint: 'rgba(217, 119, 6, 0.04)',
          textPrimary: '#f5f5f4',
          textSecondary: '#d6d3d1',
          textMuted: '#a8a29e',
          panelBg: 'rgba(28, 26, 23, 0.88)',
          panelBorder: 'rgba(217, 119, 6, 0.36)'
        }
      }
    ]
  },

  kazimierz: {
    id: 'kazimierz',
    nameKo: '카시미어',
    nameEn: 'Kazimierz',
    motto: '빛나는 기사도와 아레나의 영광',
    insigniaTitle: '태양의 페가수스와 챔피언 월계관',
    terminalHeader: {
      title: 'ROSEBUD LIVE // MAJOR DESK',
      subtitle: '박사의 책상 기사단 집무창 및 『로즈버드 뉴스』 생중계',
      inspiration: '『니어 라이트』 · 『마리아 니어』'
    },
    interfaceTitle: 'ROSEBUD LIVE // MAJOR DESK',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'kazimierz-odds',
      title: '아레나 배당률',
      position: 'dossier-crest',
      metricLabel: 'ODDS'
    },
    colors: {
      primary: '#f59e0b',
      primaryGlow: 'rgba(245, 158, 11, 0.52)',
      secondary: '#00e5ff',
      surface: '#0d1018',
      card: '#151b28',
      border: 'rgba(245, 158, 11, 0.44)',
      accent: '#fef08a',
      badgeBg: 'rgba(245, 158, 11, 0.22)',
      badgeText: '#fde047',
      scanlineTint: 'rgba(0, 229, 255, 0.05)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.05,
      cornerStyle: 'chamfer',
      glowIntensity: 'vibrant'
    },
    eventRefs: ['『니어 라이트』', '『마리아 니어』'],
    designSummary: '전통 기사단 황금 훈장과 상업 네온사인 충돌, 박사의 책상·3대 세력 명성 게이지·로즈버드 뉴스 중계 배너',
    fontMood: 'constructivist',
    buttonMetaphor: 'broadcast_tab',
    choiceLabels: ['LIVE 단독 결단', '감정회 공인 서명', '상업연합 스폰서 계약', '로즈버드 특종 기고'],
    progressStyle: 'live_ticker',
    apMetaphor: {
      label: '토너먼트 일정',
      badgeUnit: '시드',
      tooltip: '박사의 책상 업무 결재 및 메이저 아레나 출전 시드',
      iconType: 'medal'
    },
    subThemes: [
      {
        id: 'neon_arena',
        nameKo: '메이저 야경·네온',
        eventSource: '『니어 라이트』',
        description: '어두운 그랜드 나이트 영지 야경 위 황금 훈장과 시안·마젠타 상업 네온사인의 고대비 충돌',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'kazimierz_neon',
        colors: {
          primary: '#f59e0b',
          primaryGlow: 'rgba(245, 158, 11, 0.55)',
          secondary: '#06b6d4',
          surface: '#0c0f18',
          card: '#151b29',
          border: 'rgba(245, 158, 11, 0.44)',
          accent: '#fef08a',
          badgeBg: 'rgba(6, 182, 212, 0.2)',
          badgeText: '#fde047',
          scanlineTint: 'rgba(236, 72, 153, 0.05)',
          textPrimary: '#f8fafc',
          textSecondary: '#e2e8f0',
          textMuted: '#94a3b8',
          panelBg: 'rgba(21, 27, 41, 0.88)',
          panelBorder: 'rgba(245, 158, 11, 0.42)'
        }
      },
      {
        id: 'doctors_desk',
        nameKo: '박사의 책상·타블로이드',
        eventSource: '『마리아 니어』 · 『로즈버드 뉴스』',
        description: '박사의 책상 업무 파일첩과 스포츠 타블로이드 신문 지면 배너 레이아웃',
        polarity: 'dark',
        autoTrigger: 'day',
        backdropVariant: 'kazimierz_desk',
        colors: {
          primary: '#eab308',
          primaryGlow: 'rgba(234, 179, 8, 0.45)',
          secondary: '#f43f5e',
          surface: '#111318',
          card: '#1b1f28',
          border: 'rgba(234, 179, 8, 0.38)',
          accent: '#fde68a',
          badgeBg: 'rgba(234, 179, 8, 0.2)',
          badgeText: '#fef08a',
          scanlineTint: 'rgba(234, 179, 8, 0.04)',
          textPrimary: '#f8fafc',
          textSecondary: '#cbd5e1',
          textMuted: '#94a3b8',
          panelBg: 'rgba(27, 31, 40, 0.9)',
          panelBorder: 'rgba(234, 179, 8, 0.36)'
        }
      }
    ]
  },

  columbia: {
    id: 'columbia',
    nameKo: '컬럼비아',
    nameEn: 'Columbia',
    motto: '개척과 진보, 무한한 프론티어',
    insigniaTitle: '궤도 위성과 파이오니어 독수리',
    terminalHeader: {
      title: 'TRIMONT // CASSETTE TELEMETRY',
      subtitle: '나사펑크 고도·중력 계측기 및 트라이마운츠 궤도 관제망',
      inspiration: '『론 트레일』 · 『허락받지 못한 땅』 · 『붉게 물든 벨벳』'
    },
    interfaceTitle: 'TRIMONT // CASSETTE TELEMETRY',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'columbia-telemetry',
      title: '개척 신용도',
      position: 'header-ribbon',
      metricLabel: 'CREDIT'
    },
    colors: {
      primary: '#f59e0b',
      primaryGlow: 'rgba(245, 158, 11, 0.45)',
      secondary: '#3b82f6',
      surface: '#0c1017',
      card: '#151c27',
      border: 'rgba(245, 158, 11, 0.4)',
      accent: '#38bdf8',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
      badgeText: '#fde68a',
      scanlineTint: 'rgba(245, 158, 11, 0.05)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.05,
      cornerStyle: 'sharp',
      glowIntensity: 'medium'
    },
    eventRefs: ['『론 트레일』', '『허락받지 못한 땅』', '『붉게 물든 벨벳』'],
    officialThemes: ['공식 테마: 『극목』'],
    designSummary: '70~80s 카세트 퓨처리즘(황변 VHS·적황청 3색 스트라이프·고도계), 연구기업 미니멀리즘, 랭크우드 뷰파인더 느와르',
    fontMood: 'mono',
    buttonMetaphor: 'vhs_cassette',
    choiceLabels: ['TAPE-A 궤도 점화', '라인 랩 실험 프로토콜', 'RANKWOOD TAKE-1', '프론티어 긴급 교신'],
    progressStyle: 'altimeter_tape',
    apMetaphor: {
      label: '카세트 모듈',
      badgeUnit: 'MOD',
      tooltip: '카세트 텔레메트리 연산 및 개척 모듈 실행 횟수',
      iconType: 'cassette'
    },
    subThemes: [
      {
        id: 'lone_trail',
        nameKo: '론 트레일·나사펑크',
        eventSource: '『론 트레일』',
        officialTheme: '공식 테마: 『극목』',
        description: '황변 VHS 스티커 라벨, 적·황·청 3색 스트라이프, 주황/녹색 CRT 주사선과 수직 고도·중력계 눈금',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'columbia_nasa',
        colors: {
          primary: '#f59e0b',
          primaryGlow: 'rgba(245, 158, 11, 0.48)',
          secondary: '#ef4444',
          surface: '#0e1116',
          card: '#181d26',
          border: 'rgba(245, 158, 11, 0.42)',
          accent: '#38bdf8',
          badgeBg: 'rgba(245, 158, 11, 0.2)',
          badgeText: '#fde68a',
          scanlineTint: 'rgba(34, 197, 94, 0.05)',
          textPrimary: '#fef3c7',
          textSecondary: '#e2e8f0',
          textMuted: '#94a3b8',
          panelBg: 'rgba(24, 29, 38, 0.9)',
          panelBorder: 'rgba(245, 158, 11, 0.4)'
        }
      },
      {
        id: 'rhine_minimal',
        nameKo: '연구기업 미니멀리즘',
        eventSource: '『허락받지 못한 땅』',
        description: '첨단 연구단지의 차갑고 정밀한 모듈형 클린 미니멀리즘 인터페이스',
        polarity: 'dark',
        autoTrigger: 'day',
        backdropVariant: 'columbia_rhine',
        colors: {
          primary: '#0ea5e9',
          primaryGlow: 'rgba(14, 165, 233, 0.45)',
          secondary: '#10b981',
          surface: '#091019',
          card: '#101b29',
          border: 'rgba(56, 189, 248, 0.36)',
          accent: '#7dd3fc',
          badgeBg: 'rgba(14, 165, 233, 0.18)',
          badgeText: '#bae6fd',
          scanlineTint: 'rgba(56, 189, 248, 0.04)',
          textPrimary: '#f8fafc',
          textSecondary: '#cbd5e1',
          textMuted: '#94a3b8',
          panelBg: 'rgba(16, 27, 41, 0.88)',
          panelBorder: 'rgba(56, 189, 248, 0.35)'
        }
      },
      {
        id: 'rankwood_noir',
        nameKo: '랭크우드 벨벳 느와르',
        eventSource: '『붉게 물든 벨벳』',
        description: '랭크우드 쇼비즈니스 필름 느와르 조명과 카메라 뷰파인더 초점 프레임',
        polarity: 'dark',
        autoTrigger: 'night',
        backdropVariant: 'columbia_velvet',
        colors: {
          primary: '#e11d48',
          primaryGlow: 'rgba(225, 29, 72, 0.5)',
          secondary: '#fbbf24',
          surface: '#110a10',
          card: '#1c1019',
          border: 'rgba(225, 29, 72, 0.42)',
          accent: '#fda4af',
          badgeBg: 'rgba(225, 29, 72, 0.22)',
          badgeText: '#fecdd3',
          scanlineTint: 'rgba(225, 29, 72, 0.05)',
          textPrimary: '#fff1f2',
          textSecondary: '#fecdd3',
          textMuted: '#9f1239',
          panelBg: 'rgba(28, 16, 25, 0.9)',
          panelBorder: 'rgba(225, 29, 72, 0.4)'
        }
      }
    ]
  },

  iberia: {
    id: 'iberia',
    nameKo: '이베리아',
    nameEn: 'Iberia',
    motto: '황금의 함선과 등대의 불빛',
    insigniaTitle: '대침묵의 등대와 심해의 성호',
    terminalHeader: {
      title: 'STULTIFERA // 이베리아 항해 천구의',
      subtitle: '심해 황금 함선 등불 및 백색 소금 사막 연금술 해도',
      inspiration: '『스툴티페라 나비스』 · 『창백한 바다로부터의 탈출』 · 『미즈키 & 카이룰라 아버』'
    },
    interfaceTitle: 'STULTIFERA // 이베리아 항해 천구의',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'iberia-astrolabe',
      title: '심해 파동계',
      position: 'chronicle-banner',
      metricLabel: 'ASTROLABE'
    },
    colors: {
      primary: '#d4af37',
      primaryGlow: 'rgba(212, 175, 55, 0.5)',
      secondary: '#1e3a5f',
      surface: '#070e17',
      card: '#0f1a28',
      border: 'rgba(212, 175, 55, 0.4)',
      accent: '#38bdf8',
      badgeBg: 'rgba(212, 175, 55, 0.18)',
      badgeText: '#fde68a',
      scanlineTint: 'rgba(34, 211, 238, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'filigree',
      glowIntensity: 'medium'
    },
    eventRefs: ['『스툴티페라 나비스』', '『창백한 바다로부터의 탈출』', '『미즈키 & 카이룰라 아버』'],
    designSummary: '심해 아포칼립스 황금 함선·등불(야간)과 백색 소금 사막 연금술 범선(주간) 이원화 및 파노라마 항해 진행바',
    fontMood: 'serif_editorial',
    buttonMetaphor: 'voyage_compass',
    choiceLabels: ['황금 등불 점화', '연금술 해도 수정', '재판소 성무 집행', '선수 방위각 고정'],
    progressStyle: 'panoramic_voyage',
    apMetaphor: {
      label: '항해 등불',
      badgeUnit: '등불',
      tooltip: '심문관의 핸드캐논 등불 및 범선 항해 행동력',
      iconType: 'lantern'
    },
    subThemes: [
      {
        id: 'stultifera_night',
        nameKo: '심해 황금함선 (야간)',
        eventSource: '『스툴티페라 나비스』 · 『미즈키 & 카이룰라 아버』',
        description: '심해 아포칼립스의 칠흑 바다 위 황금 함선 장식과 등불·명흔 발광 대비',
        polarity: 'dark',
        autoTrigger: 'night',
        backdropVariant: 'iberia_abyss',
        colors: {
          primary: '#d4af37',
          primaryGlow: 'rgba(212, 175, 55, 0.5)',
          secondary: '#0284c7',
          surface: '#070e17',
          card: '#0f1a28',
          border: 'rgba(212, 175, 55, 0.42)',
          accent: '#38bdf8',
          badgeBg: 'rgba(212, 175, 55, 0.2)',
          badgeText: '#fde68a',
          scanlineTint: 'rgba(34, 211, 238, 0.05)',
          textPrimary: '#f1f5f9',
          textSecondary: '#cbd5e1',
          textMuted: '#94a3b8',
          panelBg: 'rgba(15, 26, 40, 0.88)',
          panelBorder: 'rgba(212, 175, 55, 0.38)'
        }
      },
      {
        id: 'salt_desert_day',
        nameKo: '백색 소금사막 (주간)',
        eventSource: '『창백한 바다로부터의 탈출』',
        description: '눈부신 하얀 소금 결정 사막을 가르는 연금술 기호와 범선 나침반 라이트 미학',
        polarity: 'light',
        autoTrigger: 'day',
        backdropVariant: 'iberia_salt',
        colors: {
          primary: '#1e3a5f',
          primaryGlow: 'rgba(30, 58, 95, 0.28)',
          secondary: '#b45309',
          surface: '#f1f5f9',
          card: '#e2e8f0',
          border: 'rgba(30, 58, 95, 0.32)',
          accent: '#0369a1',
          badgeBg: 'rgba(30, 58, 95, 0.12)',
          badgeText: '#1e3a5f',
          scanlineTint: 'rgba(180, 83, 9, 0.04)',
          textPrimary: '#0f172a',
          textSecondary: '#1e293b',
          textMuted: '#475569',
          panelBg: 'rgba(255, 255, 255, 0.86)',
          panelBorder: 'rgba(30, 58, 95, 0.28)'
        }
      }
    ]
  },

  laterano: {
    id: 'laterano',
    nameKo: '라테라노',
    nameEn: 'Laterano',
    motto: '성스러운 율법과 천상의 낙원',
    insigniaTitle: '천상의 헤일로와 수호총의 성가',
    terminalHeader: {
      title: 'SANCTUM // 율법 연산 성소',
      subtitle: '순백·황금 성당 도상학과 구문명 DNA·기계 본질 콜라주',
      inspiration: '『중생의 여정』 · 『가이딩 어헤드』 · 『물 위를 걷는 달』'
    },
    interfaceTitle: 'SANCTUM // 율법 연산 성소',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'laterano-halo',
      title: '헤일로 공명 주파수',
      position: 'dossier-crest',
      metricLabel: 'HALO RES'
    },
    colors: {
      primary: '#ffd54f',
      primaryGlow: 'rgba(255, 213, 79, 0.55)',
      secondary: '#38bdf8',
      surface: '#0f131c',
      card: '#171d2b',
      border: 'rgba(255, 213, 79, 0.42)',
      accent: '#fde68a',
      badgeBg: 'rgba(255, 213, 79, 0.2)',
      badgeText: '#fef08a',
      scanlineTint: 'rgba(255, 213, 79, 0.05)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'round',
      glowIntensity: 'vibrant'
    },
    eventRefs: ['『중생의 여정』', '『가이딩 어헤드』', '『물 위를 걷는 달』'],
    officialThemes: ['공식 테마: 『월만』'],
    designSummary: '성당 도상학 이면의 구문명 과학 기계 콜라주(DNA 이중나선·헤일로), 에스프레소 커피포트 AP·탄약/젤라토·푸른 수면 파문',
    fontMood: 'serif_editorial',
    buttonMetaphor: 'notarial_halo',
    choiceLabels: ['공증소 집행 교령', '수호총 탄창 장전', '젤라토 정오 성찬', '율법 코어 동기화'],
    progressStyle: 'water_ripple',
    apMetaphor: {
      label: '에스프레소 추출',
      badgeUnit: '잔',
      tooltip: '『제총사의 밤』 에스프레소 커피포트 행동력 추출',
      iconType: 'espresso'
    },
    subThemes: [
      {
        id: 'revelation_collage',
        nameKo: '성당·구문명 콜라주',
        eventSource: '『중생의 여정』 · 『가이딩 어헤드』',
        description: '황금 스테인드글라스 성당 도상학과 DNA 이중나선·다재질 헤일로·총기/디저트 일상의 조화',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'laterano_collage',
        colors: {
          primary: '#fbbf24',
          primaryGlow: 'rgba(251, 191, 36, 0.5)',
          secondary: '#f8fafc',
          surface: '#0f131c',
          card: '#181e2c',
          border: 'rgba(251, 191, 36, 0.42)',
          accent: '#fef08a',
          badgeBg: 'rgba(251, 191, 36, 0.2)',
          badgeText: '#fef08a',
          scanlineTint: 'rgba(251, 191, 36, 0.05)',
          textPrimary: '#f8fafc',
          textSecondary: '#e2e8f0',
          textMuted: '#94a3b8',
          panelBg: 'rgba(24, 30, 44, 0.88)',
          panelBorder: 'rgba(251, 191, 36, 0.38)'
        }
      },
      {
        id: 'azure_moon_ripple',
        nameKo: '월만(月滿) 수면 파문',
        eventSource: '콜라보 『물 위를 걷는 달』',
        officialTheme: '공식 테마: 『월만』',
        description: '달빛 아래 번지는 청량한 푸른 수면 동심원 파문과 백금빛 헤일로 공명',
        polarity: 'dark',
        autoTrigger: 'night',
        backdropVariant: 'laterano_ripple',
        colors: {
          primary: '#38bdf8',
          primaryGlow: 'rgba(56, 189, 248, 0.5)',
          secondary: '#fde047',
          surface: '#081320',
          card: '#0f2034',
          border: 'rgba(56, 189, 248, 0.42)',
          accent: '#bae6fd',
          badgeBg: 'rgba(56, 189, 248, 0.2)',
          badgeText: '#7dd3fc',
          scanlineTint: 'rgba(56, 189, 248, 0.05)',
          textPrimary: '#f0f9ff',
          textSecondary: '#bae6fd',
          textMuted: '#7dd3fc',
          panelBg: 'rgba(15, 32, 52, 0.88)',
          panelBorder: 'rgba(56, 189, 248, 0.38)'
        }
      }
    ]
  },

  leithanien: {
    id: 'leithanien',
    nameKo: '라이타니엔',
    nameEn: 'Leithanien',
    motto: '음률과 아츠의 영원한 협주곡',
    insigniaTitle: '쌍둥이 첨탑과 첼로의 금빛 음표',
    terminalHeader: {
      title: 'ZWILLINGSTÜRME // 황금 총보',
      subtitle: '흑금 피아노 건반·클라드니 음향 기하학 및 리포밍 플럭스',
      inspiration: '『츠빌링슈튀르메의 가을』 · 『링거링 에코스』 · 『월루몽드의 황혼』'
    },
    interfaceTitle: 'ZWILLINGSTÜRME // 황금 총보',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'leithanien-cadence',
      title: '아츠 케이던스',
      position: 'dossier-crest',
      metricLabel: 'CADENCE'
    },
    colors: {
      primary: '#eab308',
      primaryGlow: 'rgba(234, 179, 8, 0.5)',
      secondary: '#a855f7',
      surface: '#0c0b12',
      card: '#151320',
      border: 'rgba(234, 179, 8, 0.42)',
      accent: '#fde68a',
      badgeBg: 'rgba(234, 179, 8, 0.2)',
      badgeText: '#fef08a',
      scanlineTint: 'rgba(234, 179, 8, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'filigree',
      glowIntensity: 'medium'
    },
    eventRefs: ['『츠빌링슈튀르메의 가을』', '『링거링 에코스』', '『월루몽드의 황혼』'],
    designSummary: '흑금 피아노 건반 배색, 클라드니 소리 도형·오디오 스펙트럼 파형, 악보 오선지·리포밍 플럭스·축음기 위젯',
    fontMood: 'baroque_score',
    buttonMetaphor: 'piano_key',
    choiceLabels: ['제1악장: 알레그로', '제2악장: 아다지오', '리포밍 플럭스 변주', '피날레: 황금 카덴차'],
    progressStyle: 'musical_staff',
    apMetaphor: {
      label: '축음기 연주',
      badgeUnit: '악장',
      tooltip: '축음기 아츠 선율 조율 및 연간 악장 연주 포인트',
      iconType: 'gramophone'
    },
    subThemes: [
      {
        id: 'zwillingsturme_gold',
        nameKo: '흑금 건반·황금 노을',
        eventSource: '『츠빌링슈튀르메의 가을』',
        description: '바로크 쌍둥이 탑 위로 퍼지는 황금 노을, 흑금 피아노 건반과 클라드니 공명 기하학',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'leithanien_gold',
        colors: {
          primary: '#eab308',
          primaryGlow: 'rgba(234, 179, 8, 0.52)',
          secondary: '#c084fc',
          surface: '#0c0b12',
          card: '#161422',
          border: 'rgba(234, 179, 8, 0.44)',
          accent: '#fef08a',
          badgeBg: 'rgba(234, 179, 8, 0.2)',
          badgeText: '#fef08a',
          scanlineTint: 'rgba(234, 179, 8, 0.05)',
          textPrimary: '#fafaf9',
          textSecondary: '#e7e5e4',
          textMuted: '#a8a29e',
          panelBg: 'rgba(22, 20, 34, 0.9)',
          panelBorder: 'rgba(234, 179, 8, 0.4)'
        }
      },
      {
        id: 'wolumonde_dusk',
        nameKo: '월루몽드 황혼 현악',
        eventSource: '『월루몽드의 황혼』 · 『링거링 에코스』',
        description: '저녁 안개 속 첼로 현의 잔향과 검붉은 버건디·은백색 악보 대비',
        polarity: 'dark',
        autoTrigger: 'night',
        backdropVariant: 'leithanien_dusk',
        colors: {
          primary: '#f43f5e',
          primaryGlow: 'rgba(244, 63, 94, 0.45)',
          secondary: '#eab308',
          surface: '#110d14',
          card: '#1c1522',
          border: 'rgba(244, 63, 94, 0.38)',
          accent: '#fda4af',
          badgeBg: 'rgba(244, 63, 94, 0.2)',
          badgeText: '#fecdd3',
          scanlineTint: 'rgba(244, 63, 94, 0.04)',
          textPrimary: '#f5f5f4',
          textSecondary: '#e2e8f0',
          textMuted: '#a1a1aa',
          panelBg: 'rgba(28, 21, 34, 0.9)',
          panelBorder: 'rgba(244, 63, 94, 0.36)'
        }
      }
    ]
  },

  sami: {
    id: 'sami',
    nameKo: '사미',
    nameEn: 'Sami',
    motto: '원초의 성림과 은빛 서리의 맹세',
    insigniaTitle: '순록의 뿔과 고대 오로라 룬',
    terminalHeader: {
      title: 'SILVERFROST // 밀문(密文) 계측기',
      subtitle: '눈의 사제 암호판 및 간섭 방지 지수 극지 레이더',
      inspiration: '『탐험가의 은빛 서리 끝자락』 · 『나무 그늘 속에 잠들다』'
    },
    interfaceTitle: 'SILVERFROST // 밀문(密文) 계측기',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'sami-collapse',
      title: '오로라 영기',
      position: 'chronicle-banner',
      metricLabel: 'ANTI-INTERFERENCE'
    },
    colors: {
      primary: '#38bdf8',
      primaryGlow: 'rgba(56, 189, 248, 0.48)',
      secondary: '#10b981',
      surface: '#071017',
      card: '#0e1c26',
      border: 'rgba(125, 211, 252, 0.38)',
      accent: '#67e8f9',
      badgeBg: 'rgba(56, 189, 248, 0.2)',
      badgeText: '#bae6fd',
      scanlineTint: 'rgba(56, 189, 248, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'chamfer',
      glowIntensity: 'medium'
    },
    eventRefs: ['『탐험가의 은빛 서리 끝자락』', '『나무 그늘 속에 잠들다』'],
    officialThemes: ['공식 테마: 『은송』'],
    designSummary: '빙하 실버·블루 샤머니즘, 상하 조각 맞물림 주술 암호판(밀문판), 간섭 방지 지수 레이더 및 검은 [국가] 침식 비네팅',
    fontMood: 'mono',
    buttonMetaphor: 'cipher_slab',
    choiceLabels: ['본원·작용 밀문 결합', '눈의 사제 신탁', '간섭 방지 레이더 보정', '은송 성림 순례'],
    progressStyle: 'frost_radar',
    apMetaphor: {
      label: '밀문판 각인',
      badgeUnit: '밀문',
      tooltip: '상하 주술 암호판(밀문판) 조합 및 극지 탐사 행동력',
      iconType: 'rune'
    },
    subThemes: [
      {
        id: 'silver_frost',
        nameKo: '은빛 서리·밀문판',
        eventSource: '『탐험가의 은빛 서리 끝자락』',
        officialTheme: '공식 테마: 『은송』',
        description: '빙하 실버·아이스 블루 프레임 위 북유럽 샤머니즘 밀문판과 극지 탐사 계측기',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'sami_frost',
        colors: {
          primary: '#38bdf8',
          primaryGlow: 'rgba(56, 189, 248, 0.48)',
          secondary: '#2dd4bf',
          surface: '#071017',
          card: '#0e1d28',
          border: 'rgba(148, 163, 184, 0.4)',
          accent: '#67e8f9',
          badgeBg: 'rgba(56, 189, 248, 0.2)',
          badgeText: '#bae6fd',
          scanlineTint: 'rgba(56, 189, 248, 0.04)',
          textPrimary: '#f0f9ff',
          textSecondary: '#cbd5e1',
          textMuted: '#94a3b8',
          panelBg: 'rgba(14, 29, 40, 0.88)',
          panelBorder: 'rgba(125, 211, 252, 0.38)'
        }
      },
      {
        id: 'daemon_eclipse',
        nameKo: '차원 침식 경보',
        eventSource: '북방 데몬 · 검은 [국가] 왜곡',
        description: '간섭 방지 지수가 흔들릴 때 가장자리를 잠식하는 검은 차원 비네팅과 기하 균열',
        polarity: 'dark',
        autoTrigger: 'crisis',
        backdropVariant: 'sami_daemon',
        colors: {
          primary: '#c084fc',
          primaryGlow: 'rgba(192, 132, 252, 0.55)',
          secondary: '#2dd4bf',
          surface: '#06070d',
          card: '#101220',
          border: 'rgba(192, 132, 252, 0.44)',
          accent: '#e879f9',
          badgeBg: 'rgba(192, 132, 252, 0.22)',
          badgeText: '#f5d0fe',
          scanlineTint: 'rgba(192, 132, 252, 0.07)',
          textPrimary: '#faf5ff',
          textSecondary: '#d8b4fe',
          textMuted: '#a855f7',
          panelBg: 'rgba(16, 18, 32, 0.92)',
          panelBorder: 'rgba(192, 132, 252, 0.42)'
        }
      }
    ]
  },

  siracusa: {
    id: 'siracusa',
    nameKo: '시라쿠사',
    nameEn: 'Siracusa',
    motto: '밤의 늑대와 피의 서약',
    insigniaTitle: '늑대의 단검과 패밀리의 인장',
    terminalHeader: {
      title: 'VOLSINII // 패밀리 기밀 서류철',
      subtitle: '빗속 라이터 불빛·수제 양복 스티치 및 볼시니 인형극장',
      inspiration: '『시라쿠사인』 · 『막을 여는 자들』 · 『교차지점』'
    },
    interfaceTitle: 'VOLSINII // 패밀리 기밀 서류철',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'siracusa-omerta',
      title: '오메르타 결속도',
      position: 'dossier-crest',
      metricLabel: 'OMERTA'
    },
    colors: {
      primary: '#dc2626',
      primaryGlow: 'rgba(220, 38, 38, 0.5)',
      secondary: '#f59e0b',
      surface: '#09090b',
      card: '#141417',
      border: 'rgba(220, 38, 38, 0.42)',
      accent: '#f4f4f5',
      badgeBg: 'rgba(220, 38, 38, 0.24)',
      badgeText: '#fca5a5',
      scanlineTint: 'rgba(220, 38, 38, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'sharp',
      glowIntensity: 'subtle'
    },
    eventRefs: ['『시라쿠사인』', '『막을 여는 자들』', '『교차지점』'],
    designSummary: '흑적 마피아 필름 누아르, 빗속 라이터 불빛, 볼시니 인형극 무대, 기밀 서류철/연회 메뉴/익명 초대장 및 수제 양복 스티치 마감',
    fontMood: 'noir_typewriter',
    buttonMetaphor: 'mafia_dossier',
    choiceLabels: ['기밀 서류철 열람', '연회 메뉴 수락', '익명 초대장 개봉', '오메르타 침묵 날인'],
    progressStyle: 'stage_curtain',
    apMetaphor: {
      label: '라이터 점화',
      badgeUnit: '교섭',
      tooltip: '빗속 골목의 황동 라이터 점화 및 패밀리 막후 교섭',
      iconType: 'lighter'
    },
    subThemes: [
      {
        id: 'rainy_noir',
        nameKo: '흑적 누아르·양복 스티치',
        eventSource: '『시라쿠사인』 · 『교차지점』',
        description: '흑적(Black & Red) 마피아 필름 누아르, 빗줄기·라이터 불빛과 거친 수제 양복 원단 스티치 테두리',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'siracusa_rain',
        colors: {
          primary: '#dc2626',
          primaryGlow: 'rgba(220, 38, 38, 0.5)',
          secondary: '#f59e0b',
          surface: '#09090b',
          card: '#141418',
          border: 'rgba(220, 38, 38, 0.44)',
          accent: '#f4f4f5',
          badgeBg: 'rgba(220, 38, 38, 0.24)',
          badgeText: '#fca5a5',
          scanlineTint: 'rgba(220, 38, 38, 0.04)',
          textPrimary: '#fafafa',
          textSecondary: '#d4d4d8',
          textMuted: '#a1a1aa',
          panelBg: 'rgba(20, 20, 24, 0.9)',
          panelBorder: 'rgba(220, 38, 38, 0.4)'
        }
      },
      {
        id: 'volsinii_stage',
        nameKo: '볼시니 오페라·인형극',
        eventSource: '『막을 여는 자들』',
        description: '볼시니 카니발의 붉은 오페라 커튼, 목각 인형극 마리오네트 줄과 법정 연회 연출',
        polarity: 'dark',
        autoTrigger: 'night',
        backdropVariant: 'siracusa_opera',
        colors: {
          primary: '#e11d48',
          primaryGlow: 'rgba(225, 29, 72, 0.5)',
          secondary: '#eab308',
          surface: '#11090c',
          card: '#1d1015',
          border: 'rgba(234, 179, 8, 0.4)',
          accent: '#fde68a',
          badgeBg: 'rgba(225, 29, 72, 0.22)',
          badgeText: '#fda4af',
          scanlineTint: 'rgba(234, 179, 8, 0.04)',
          textPrimary: '#fff1f2',
          textSecondary: '#fecdd3',
          textMuted: '#fda4af',
          panelBg: 'rgba(29, 16, 21, 0.9)',
          panelBorder: 'rgba(234, 179, 8, 0.38)'
        }
      }
    ]
  },

  sargon: {
    id: 'sargon',
    nameKo: '사르곤',
    nameEn: 'Sargon',
    motto: '타오르는 사막과 불멸의 군주',
    insigniaTitle: '태양 원반과 사막의 곡도',
    terminalHeader: {
      title: 'MENAT-HAMAI // 황금 박물관 기록관',
      subtitle: '상형문자·오리지늄 보석 세공 쇼케이스 및 생존 연산 전술도',
      inspiration: '『태양을 뿌리쳐라』 · 『아테누스 복수록』 · 『생존 연산』 · 『가비알 리턴즈』'
    },
    interfaceTitle: 'MENAT-HAMAI // 황금 박물관 기록관',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'sargon-tribute',
      title: '오아시스 기후 지수',
      position: 'chronicle-banner',
      metricLabel: 'CLIMATE'
    },
    colors: {
      primary: '#f59e0b',
      primaryGlow: 'rgba(245, 158, 11, 0.48)',
      secondary: '#14b8a6',
      surface: '#100e0b',
      card: '#1b1712',
      border: 'rgba(245, 158, 11, 0.4)',
      accent: '#fcd34d',
      badgeBg: 'rgba(20, 184, 166, 0.22)',
      badgeText: '#5eead4',
      scanlineTint: 'rgba(245, 158, 11, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'chamfer',
      glowIntensity: 'medium'
    },
    eventRefs: ['『태양을 뿌리쳐라』', '『아테누스 복수록』', '『생존 연산』', '『위대한 족장 가비알 리턴즈』'],
    designSummary: '고대 유적을 재해석한 현대 박물관 패널·상형문자·오리지늄 보석 세공과 황동 사각 소용돌이·야생 전술 지도',
    fontMood: 'serif_editorial',
    buttonMetaphor: 'museum_gem',
    choiceLabels: ['전시관 보석 감정', '파디샤 황동 칙령', '생존 연산 루트 개척', '대족장 결투 수락'],
    progressStyle: 'hieroglyph_bar',
    apMetaphor: {
      label: '보석 세공·연산',
      badgeUnit: '연산',
      tooltip: '오리지늄 보석 세공 및 야생 생존 연산 결단 포인트',
      iconType: 'gem'
    },
    subThemes: [
      {
        id: 'museum_jewel',
        nameKo: '현대 박물관·보석 세공',
        eventSource: '『태양을 뿌리쳐라』',
        description: '고대 유적을 세련된 현대 박물관 전시관 패널로 재해석하고 이집트 상형문자와 터쿼이즈 보석 세공을 결합',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'sargon_museum',
        colors: {
          primary: '#14b8a6',
          primaryGlow: 'rgba(20, 184, 166, 0.48)',
          secondary: '#f59e0b',
          surface: '#0c1212',
          card: '#141e1e',
          border: 'rgba(245, 158, 11, 0.38)',
          accent: '#fcd34d',
          badgeBg: 'rgba(20, 184, 166, 0.22)',
          badgeText: '#5eead4',
          scanlineTint: 'rgba(20, 184, 166, 0.04)',
          textPrimary: '#f0fdfa',
          textSecondary: '#ccfbf1',
          textMuted: '#99f6e4',
          panelBg: 'rgba(20, 30, 30, 0.88)',
          panelBorder: 'rgba(245, 158, 11, 0.38)'
        }
      },
      {
        id: 'imperial_wild',
        nameKo: '황동 소용돌이·생존 전술도',
        eventSource: '『아테누스 복수록』 · 『생존 연산』 · 『가비알 리턴즈』',
        description: '제국의 위압감을 담은 황동 사각 소용돌이(메안더)와 야생 노이즈 전술 지도·원색 그래피티',
        polarity: 'dark',
        autoTrigger: 'crisis',
        backdropVariant: 'sargon_wild',
        colors: {
          primary: '#d97706',
          primaryGlow: 'rgba(217, 119, 6, 0.5)',
          secondary: '#84cc16',
          surface: '#120f0a',
          card: '#1f1911',
          border: 'rgba(217, 119, 6, 0.45)',
          accent: '#bef264',
          badgeBg: 'rgba(132, 204, 22, 0.22)',
          badgeText: '#fde047',
          scanlineTint: 'rgba(217, 119, 6, 0.05)',
          textPrimary: '#fef3c7',
          textSecondary: '#fde68a',
          textMuted: '#d97706',
          panelBg: 'rgba(31, 25, 17, 0.9)',
          panelBorder: 'rgba(217, 119, 6, 0.42)'
        }
      }
    ]
  },

  rim_billiton: {
    id: 'rim_billiton',
    nameKo: '림 빌리톤',
    nameEn: 'Rim Billiton',
    motto: '붉은 대지의 굴착과 개척',
    insigniaTitle: '광부의 곡괭이와 반쪽 토끼 개척장',
    terminalHeader: {
      title: 'HIGHWAY 0 // 오렌지 아웃백 통신망',
      subtitle: '0번 국도 로드무비 편지지·원격 통신 팝업 및 24x24 픽셀 캔버스',
      inspiration: '『대지가 오렌지 한 알이 될 때까지』 · 『그리닝 밸리를 향해』'
    },
    interfaceTitle: 'HIGHWAY 0 // 오렌지 아웃백 통신망',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'rim-billiton-depth',
      title: '채굴 심도 계측',
      position: 'header-ribbon',
      metricLabel: 'DRILL RIG'
    },
    colors: {
      primary: '#fb923c',
      primaryGlow: 'rgba(251, 146, 60, 0.48)',
      secondary: '#a3e635',
      surface: '#110f0d',
      card: '#1c1814',
      border: 'rgba(251, 146, 60, 0.42)',
      accent: '#bef264',
      badgeBg: 'rgba(163, 230, 53, 0.2)',
      badgeText: '#d9f99d',
      scanlineTint: 'rgba(251, 146, 60, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'round',
      glowIntensity: 'medium'
    },
    eventRefs: ['『대지가 오렌지 한 알이 될 때까지』', '『그리닝 밸리를 향해』'],
    designSummary: '아웃백 오렌지 0번 국도 로드무비 감성, 라임색 편지지·우체통·원격 통신 가족 팝업·여행자 배낭·24x24 픽셀 토끼 로고',
    fontMood: 'rounded_road',
    buttonMetaphor: 'postcard_comm',
    choiceLabels: ['라임색 편지지 발송', '0번 국도 풀악셀', '가족 원격 통신 응답', '카우투스 채굴 작업'],
    progressStyle: 'highway_zero',
    apMetaphor: {
      label: '여행자 배낭',
      badgeUnit: '배낭',
      tooltip: '0번 국도 여행자 배낭 정비 및 광산 개척 행동력',
      iconType: 'backpack'
    },
    subThemes: [
      {
        id: 'highway_zero',
        nameKo: '0번 국도·라임 편지지',
        eventSource: '『대지가 오렌지 한 알이 될 때까지』 · 『그리닝 밸리를 향해』',
        description: '호주 아웃백의 오렌지빛 대지와 라임색 편지지, 원격 통신 팝업창과 24x24 픽셀 아트 감성',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'rim_highway',
        colors: {
          primary: '#fb923c',
          primaryGlow: 'rgba(251, 146, 60, 0.48)',
          secondary: '#a3e635',
          surface: '#120f0c',
          card: '#1d1813',
          border: 'rgba(251, 146, 60, 0.42)',
          accent: '#bef264',
          badgeBg: 'rgba(163, 230, 53, 0.2)',
          badgeText: '#d9f99d',
          scanlineTint: 'rgba(163, 230, 53, 0.04)',
          textPrimary: '#fff7ed',
          textSecondary: '#fed7aa',
          textMuted: '#fdba74',
          panelBg: 'rgba(29, 24, 19, 0.88)',
          panelBorder: 'rgba(251, 146, 60, 0.4)'
        }
      },
      {
        id: 'cautus_mine',
        nameKo: '카우투스 중공업 리그',
        eventSource: '림 빌리톤 채굴 플랫폼 · 반쪽 토끼 로고',
        description: '거대 육상 채굴함의 강철 안전 스트라이프와 반쪽 토끼 세력 스텐실 마크',
        polarity: 'dark',
        autoTrigger: 'night',
        backdropVariant: 'rim_rig',
        colors: {
          primary: '#f59e0b',
          primaryGlow: 'rgba(245, 158, 11, 0.45)',
          secondary: '#ea580c',
          surface: '#0e0f12',
          card: '#181a20',
          border: 'rgba(245, 158, 11, 0.4)',
          accent: '#fdba74',
          badgeBg: 'rgba(245, 158, 11, 0.2)',
          badgeText: '#fde68a',
          scanlineTint: 'rgba(245, 158, 11, 0.04)',
          textPrimary: '#f8fafc',
          textSecondary: '#cbd5e1',
          textMuted: '#94a3b8',
          panelBg: 'rgba(24, 26, 32, 0.9)',
          panelBorder: 'rgba(245, 158, 11, 0.38)'
        }
      }
    ]
  },

  lungmen: {
    id: 'lungmen',
    nameKo: '용문',
    nameEn: 'Lungmen',
    motto: '번영하는 상업과 용문 근위국의 방패',
    insigniaTitle: '근위국의 비룡과 용문폐 심볼',
    terminalHeader: {
      title: 'L.G.D. // 네온 아크릴 전술망',
      subtitle: '마천루 네온 스카이라인·야시장 붉은 등롱 및 펭귄 스트리트 태그',
      inspiration: '메인 용문 편(5~8장) · 『소란의 법칙』 · 『리의 탐정사무소』'
    },
    interfaceTitle: 'L.G.D. // 네온 아크릴 전술망',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'lungmen-lgd',
      title: '근위국 치안 지수',
      position: 'chronicle-banner',
      metricLabel: 'L.G.D. SDU'
    },
    colors: {
      primary: '#06b6d4',
      primaryGlow: 'rgba(6, 182, 212, 0.52)',
      secondary: '#ef4444',
      surface: '#080e14',
      card: '#0f1924',
      border: 'rgba(6, 182, 212, 0.42)',
      accent: '#fbbf24',
      badgeBg: 'rgba(6, 182, 212, 0.2)',
      badgeText: '#67e8f9',
      scanlineTint: 'rgba(239, 68, 68, 0.05)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.05,
      cornerStyle: 'chamfer',
      glowIntensity: 'vibrant'
    },
    eventRefs: ['메인 5~8장 용문 편', '『소란의 법칙』', '『리의 탐정사무소』'],
    designSummary: '홍콩 모티브 도시 사이버펑크 다크 아크릴 패널, 마천루 네온 스카이라인, 야시장 붉은 등롱, SDU 전술 아이콘·용문폐·펭귄 스트리트 태그',
    fontMood: 'mono',
    buttonMetaphor: 'acrylic_street',
    choiceLabels: ['근위국 SDU 전술 기동', '펭귄 로지스틱스 급송', '야시장 등롱가 거래', '리 탐정사무소 조사'],
    progressStyle: 'neon_skyline',
    apMetaphor: {
      label: '근위국 작전',
      badgeUnit: '작전',
      tooltip: '용문근위국(SDU) 전술 출동 및 상업 지구 교섭 포인트',
      iconType: 'shield'
    },
    subThemes: [
      {
        id: 'kowloon_neon',
        nameKo: '마천루 네온·다크 아크릴',
        eventSource: '용문 편(5~8장) · 『소란의 법칙』',
        description: '홍콩 모티브 마천루 네온 스카이라인, 야시장 붉은 등롱과 펭귄 로지스틱스 스트리트 태그 아크릴 패널',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'lungmen_neon',
        colors: {
          primary: '#06b6d4',
          primaryGlow: 'rgba(6, 182, 212, 0.52)',
          secondary: '#ef4444',
          surface: '#080e14',
          card: '#0f1924',
          border: 'rgba(6, 182, 212, 0.42)',
          accent: '#fbbf24',
          badgeBg: 'rgba(239, 68, 68, 0.2)',
          badgeText: '#67e8f9',
          scanlineTint: 'rgba(6, 182, 212, 0.05)',
          textPrimary: '#f8fafc',
          textSecondary: '#cbd5e1',
          textMuted: '#94a3b8',
          panelBg: 'rgba(15, 25, 36, 0.85)',
          panelBorder: 'rgba(6, 182, 212, 0.4)'
        }
      },
      {
        id: 'lee_agency',
        nameKo: '리의 탐정사무소·야시장',
        eventSource: '애니메이션 『리의 탐정사무소』',
        description: '뒷골목 야시장 붉은 등롱과 옥색·호박색 네온 간판이 교차하는 탐정 의뢰 보드',
        polarity: 'dark',
        autoTrigger: 'day',
        backdropVariant: 'lungmen_lantern',
        colors: {
          primary: '#10b981',
          primaryGlow: 'rgba(16, 185, 129, 0.5)',
          secondary: '#f59e0b',
          surface: '#091312',
          card: '#112220',
          border: 'rgba(245, 158, 11, 0.4)',
          accent: '#fde047',
          badgeBg: 'rgba(16, 185, 129, 0.22)',
          badgeText: '#6ee7b7',
          scanlineTint: 'rgba(245, 158, 11, 0.04)',
          textPrimary: '#ecfdf5',
          textSecondary: '#d1fae5',
          textMuted: '#6ee7b7',
          panelBg: 'rgba(17, 34, 32, 0.88)',
          panelBorder: 'rgba(16, 185, 129, 0.4)'
        }
      }
    ]
  },

  kazdel: {
    id: 'kazdel',
    nameKo: '카즈델',
    nameEn: 'Kazdel',
    motto: '폐허의 불길과 살카즈의 비원',
    insigniaTitle: '부서진 뿔과 혼령 용광로의 관',
    terminalHeader: {
      title: 'BABEL // 영겁 혼령 용광로',
      subtitle: '주간 바벨 순백 심전도·안전 사슬 및 야간 혼령 용광로·생각 조각 석판',
      inspiration: '『바벨』 · 통합 전략 『살카즈의 영겁 기담』'
    },
    interfaceTitle: 'BABEL // 영겁 혼령 용광로',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'kazdel-souls',
      title: '원혼 공명률',
      position: 'chronicle-banner',
      metricLabel: 'SOUL FURNACE'
    },
    colors: {
      primary: '#dc2626',
      primaryGlow: 'rgba(220, 38, 38, 0.52)',
      secondary: '#9333ea',
      surface: '#0d0910',
      card: '#17101d',
      border: 'rgba(220, 38, 38, 0.42)',
      accent: '#fb7185',
      badgeBg: 'rgba(220, 38, 38, 0.22)',
      badgeText: '#fda4af',
      scanlineTint: 'rgba(220, 38, 38, 0.05)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.05,
      cornerStyle: 'sharp',
      glowIntensity: 'vibrant'
    },
    eventRefs: ['『바벨』', '통합 전략 『살카즈의 영겁 기담』'],
    officialThemes: ['공식 테마: 『사제』'],
    designSummary: '주간 절제된 순백 미니멀리즘·멎어가는 심전도·안전 사슬(『바벨』)과 야간 검붉은 혼령 용광로·검은 비·생각 조각 석판(『영겁 기담』) 대조',
    fontMood: 'serif_editorial',
    buttonMetaphor: 'memory_tablet',
    choiceLabels: ['생각 조각 투하', '혼령 용광로 공명', '바벨 안전 사슬 결속', '층간 벽화 해석'],
    progressStyle: 'babel_ecg',
    apMetaphor: {
      label: '생각 조각 부하',
      badgeUnit: '조각',
      tooltip: '혼령 용광로 생각 조각 해독 및 바벨 작전 부하',
      iconType: 'flame'
    },
    subThemes: [
      {
        id: 'myriad_souls_night',
        nameKo: '영겁 기담·용광로 (야간)',
        eventSource: '통합 전략 『살카즈의 영겁 기담』',
        officialTheme: '공식 테마: 『사제』',
        description: '검붉은 혼령 용광로 불꽃, 오리지늄 검은 비, 생각 조각 석판과 고대 살카즈 층간 벽화 질감',
        polarity: 'dark',
        autoTrigger: 'night',
        backdropVariant: 'kazdel_furnace',
        colors: {
          primary: '#dc2626',
          primaryGlow: 'rgba(220, 38, 38, 0.55)',
          secondary: '#9333ea',
          surface: '#0d0910',
          card: '#18101e',
          border: 'rgba(220, 38, 38, 0.45)',
          accent: '#fda4af',
          badgeBg: 'rgba(220, 38, 38, 0.24)',
          badgeText: '#fecdd3',
          scanlineTint: 'rgba(220, 38, 38, 0.06)',
          textPrimary: '#fff1f2',
          textSecondary: '#fecdd3',
          textMuted: '#fda4af',
          panelBg: 'rgba(24, 16, 30, 0.9)',
          panelBorder: 'rgba(220, 38, 38, 0.42)'
        }
      },
      {
        id: 'babel_day',
        nameKo: '바벨 순백·심전도 (주간)',
        eventSource: '『바벨』',
        description: '절제된 순백 비극적 미니멀리즘 바탕 위에 점점 멎어가는 심전도(ECG) 파형 선과 안전 사슬을 배치',
        polarity: 'light',
        autoTrigger: 'day',
        backdropVariant: 'kazdel_babel',
        colors: {
          primary: '#991b1b',
          primaryGlow: 'rgba(153, 27, 27, 0.28)',
          secondary: '#27272a',
          surface: '#f5f5f7',
          card: '#e7e7ec',
          border: 'rgba(39, 39, 42, 0.28)',
          accent: '#b91c1c',
          badgeBg: 'rgba(153, 27, 27, 0.1)',
          badgeText: '#7f1d1d',
          scanlineTint: 'rgba(39, 39, 42, 0.04)',
          textPrimary: '#111827',
          textSecondary: '#27272a',
          textMuted: '#52525b',
          panelBg: 'rgba(255, 255, 255, 0.88)',
          panelBorder: 'rgba(39, 39, 42, 0.26)'
        }
      }
    ]
  },

  kjerag: {
    id: 'kjerag',
    nameKo: '쉐라그',
    nameEn: 'Kjerag',
    motto: '성산의 침묵과 설산의 축복',
    insigniaTitle: '성산 쉐라간드의 종과 은심호 철교',
    terminalHeader: {
      title: 'SILVERHEART // 은심호 승강장 안내판',
      subtitle: '브러시드 실버 산악열차 대합실 보드 및 성녀상 푸른 얼음 결정 표식',
      inspiration: '『은심호 열차』 · 『브레이크 디 아이스』 · 『설산 강림 1101』'
    },
    interfaceTitle: 'SILVERHEART // 은심호 승강장 안내판',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'kjerag-bell',
      title: '성산 만년설 순도',
      position: 'dossier-crest',
      metricLabel: 'SILVERHEART'
    },
    colors: {
      primary: '#38bdf8',
      primaryGlow: 'rgba(56, 189, 248, 0.45)',
      secondary: '#cbd5e1',
      surface: '#0b121b',
      card: '#141f2d',
      border: 'rgba(148, 163, 184, 0.42)',
      accent: '#e0f2fe',
      badgeBg: 'rgba(56, 189, 248, 0.2)',
      badgeText: '#bae6fd',
      scanlineTint: 'rgba(203, 213, 225, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'round',
      glowIntensity: 'subtle'
    },
    eventRefs: ['『은심호 열차』', '『브레이크 디 아이스』', '『설산 강림 1101』'],
    designSummary: '만년설 토착 신앙과 카란 철도 산업의 설산×은철 물성 대비, 은심호 승강장 안내판 및 성녀상 푸른 얼음 결정 표식',
    fontMood: 'mono',
    buttonMetaphor: 'frost_crystal',
    choiceLabels: ['은심호 플랫폼 승차', '카란 무역 협상안', '쉐라간드 성소 참배', '삼대 가문 합의서'],
    progressStyle: 'railway_board',
    apMetaphor: {
      label: '은심호 배차·타종',
      badgeUnit: '구간',
      tooltip: '은심호 산악열차 운행 구간 및 성산 기도 종 울림',
      iconType: 'bell'
    },
    subThemes: [
      {
        id: 'silverheart_rail',
        nameKo: '은심호 열차·브러시드 은철',
        eventSource: '『은심호 열차』 · 카란 무역',
        description: '브러시드 실버 메탈 패널 위에 배치된 산악열차 승강장·대합실 행선지 안내판 레이아웃',
        polarity: 'dark',
        autoTrigger: 'default',
        backdropVariant: 'kjerag_rail',
        colors: {
          primary: '#38bdf8',
          primaryGlow: 'rgba(56, 189, 248, 0.45)',
          secondary: '#e2e8f0',
          surface: '#0c131c',
          card: '#162231',
          border: 'rgba(203, 213, 225, 0.42)',
          accent: '#e0f2fe',
          badgeBg: 'rgba(148, 163, 184, 0.22)',
          badgeText: '#e0f2fe',
          scanlineTint: 'rgba(226, 232, 240, 0.05)',
          textPrimary: '#f8fafc',
          textSecondary: '#cbd5e1',
          textMuted: '#94a3b8',
          panelBg: 'rgba(22, 34, 49, 0.88)',
          panelBorder: 'rgba(203, 213, 225, 0.4)'
        }
      },
      {
        id: 'karlan_sanctum',
        nameKo: '설산 강림·얼음 결정',
        eventSource: '『설산 강림 1101』 · 『브레이크 디 아이스』',
        description: '스노우 화이트·아이스 블루 설풍 속 성녀상의 푸른 얼음 결정 방향 표식',
        polarity: 'dark',
        autoTrigger: 'night',
        backdropVariant: 'kjerag_ice',
        colors: {
          primary: '#0ea5e9',
          primaryGlow: 'rgba(14, 165, 233, 0.5)',
          secondary: '#f8fafc',
          surface: '#08111d',
          card: '#102033',
          border: 'rgba(56, 189, 248, 0.44)',
          accent: '#7dd3fc',
          badgeBg: 'rgba(14, 165, 233, 0.22)',
          badgeText: '#bae6fd',
          scanlineTint: 'rgba(56, 189, 248, 0.05)',
          textPrimary: '#f0f9ff',
          textSecondary: '#bae6fd',
          textMuted: '#7dd3fc',
          panelBg: 'rgba(16, 32, 51, 0.88)',
          panelBorder: 'rgba(56, 189, 248, 0.4)'
        }
      }
    ]
  },

  rhodes_island: {
    id: 'rhodes_island',
    nameKo: '로도스 아일랜드',
    nameEn: 'Rhodes Island',
    motto: 'May I Enjoy My Life and Practice My Art',
    insigniaTitle: '방주 육상함과 체스의 흑백 나이트',
    terminalHeader: {
      title: 'PRTS VITAL // RHODES ISLAND',
      subtitle: '로도스 아일랜드 본함 중앙 신경망',
      inspiration: 'PRTS 신경망'
    },
    interfaceTitle: 'PRTS VITAL // RHODES ISLAND',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'rhodes-prts',
      title: 'PRTS 동기화율',
      position: 'header-ribbon',
      metricLabel: 'SYNC RATE'
    },
    colors: {
      primary: '#00e5ff',
      primaryGlow: 'rgba(0, 229, 255, 0.4)',
      secondary: '#00838f',
      surface: '#0e1219',
      card: '#131722',
      border: 'rgba(0, 229, 255, 0.3)',
      accent: '#f59e0b',
      badgeBg: 'rgba(0, 229, 255, 0.15)',
      badgeText: '#00e5ff',
      scanlineTint: 'rgba(0, 229, 255, 0.05)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.05,
      cornerStyle: 'chamfer',
      glowIntensity: 'medium'
    },
    eventRefs: ['메인 스토리 제약회사 본함', 'PRTS 전술 신경망'],
    designSummary: '로도스 아일랜드 표준 전술 신경망 단말기 UI',
    fontMood: 'mono',
    buttonMetaphor: 'prts_tactical',
    choiceLabels: ['PRTS 전술안 A', 'PRTS 전술안 B', '의료부 권고안', '현장 오퍼레이터 재량'],
    progressStyle: 'prts_sync',
    apMetaphor: {
      label: '활동·승급',
      badgeUnit: 'AP',
      tooltip: '연간 전술 활동 및 오퍼레이터 승급 심사 포인트',
      iconType: 'sparkles'
    }
  }
};
