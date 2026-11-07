// src/data/nationThemes.ts
import { NationThemeId, NationVisualIdentity } from '../types';

export const NATION_VISUAL_IDENTITIES: Record<NationThemeId, NationVisualIdentity> = {
  victoria: {
    id: 'victoria',
    nameKo: '빅토리아',
    nameEn: 'Victoria',
    motto: 'May the Golden Lion Watch Over Londinium',
    insigniaTitle: '제국 증기 기사단과 황실의 사자',
    terminalHeader: {
      title: 'LONDINIUM STEAM GAZETTE',
      subtitle: '런디니움 증기 공보 및 황실 전령',
      inspiration: '런디니움 / 바벨'
    },
    interfaceTitle: 'LONDINIUM STEAM GAZETTE',
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
      border: 'rgba(212, 175, 55, 0.35)',
      accent: '#e5b842',
      badgeBg: 'rgba(197, 40, 61, 0.2)',
      badgeText: '#fca5a5',
      scanlineTint: 'rgba(212, 175, 55, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'chamfer',
      glowIntensity: 'medium'
    }
  },
  yan: {
    id: 'yan',
    nameKo: '염국',
    nameEn: 'Yan',
    motto: '천하의 질서와 수이의 균형',
    insigniaTitle: '진용군과 대리의 주홍 낙관',
    terminalHeader: {
      title: '司歲臺 // 천문 감찰록',
      subtitle: '사세태 천기 관측 및 12수이 감시',
      inspiration: '장진주 / 등림의'
    },
    interfaceTitle: '司歲臺 // 천문 감찰록',
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
      card: '#121c1c',
      border: 'rgba(58, 125, 105, 0.4)',
      accent: '#e5c158',
      badgeBg: 'rgba(58, 125, 105, 0.25)',
      badgeText: '#6ee7b7',
      scanlineTint: 'rgba(58, 125, 105, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'filigree',
      glowIntensity: 'subtle'
    }
  },
  ursus: {
    id: 'ursus',
    nameKo: '우르수스 제국',
    nameEn: 'Ursus',
    motto: '불굴의 강철과 황제의 영광',
    insigniaTitle: '북방의 쌍두 곰과 붉은 제국성',
    terminalHeader: {
      title: 'URSUS IMPERIAL COMMAND',
      subtitle: '제국 군부 동토 작전 지휘망',
      inspiration: '동토 / 체르노보그'
    },
    interfaceTitle: 'URSUS IMPERIAL COMMAND',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'ursus-cold-command',
      title: '동토 혹한 경계',
      position: 'header-ribbon',
      metricLabel: 'COLD FRONT'
    },
    colors: {
      primary: '#d9822b',
      primaryGlow: 'rgba(217, 130, 43, 0.45)',
      secondary: '#7b8c9e',
      surface: '#0e1117',
      card: '#151a24',
      border: 'rgba(123, 140, 158, 0.35)',
      accent: '#c92a2a',
      badgeBg: 'rgba(217, 130, 43, 0.2)',
      badgeText: '#fcd34d',
      scanlineTint: 'rgba(123, 140, 158, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.05,
      cornerStyle: 'sharp',
      glowIntensity: 'medium'
    }
  },
  kazimierz: {
    id: 'kazimierz',
    nameKo: '카시미어',
    nameEn: 'Kazimierz',
    motto: '빛나는 기사도와 아레나의 영광',
    insigniaTitle: '태양의 페가수스와 챔피언 월계관',
    terminalHeader: {
      title: 'KAZIMIERZ MAJOR BROADCAST',
      subtitle: '기사회 아레나 메이저 실시간 중계',
      inspiration: '니어 라이트'
    },
    interfaceTitle: 'KAZIMIERZ MAJOR BROADCAST',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'kazimierz-odds',
      title: '아레나 배당률',
      position: 'dossier-crest',
      metricLabel: 'ODDS'
    },
    colors: {
      primary: '#f59e0b',
      primaryGlow: 'rgba(245, 158, 11, 0.5)',
      secondary: '#00e5ff',
      surface: '#0f121a',
      card: '#161c28',
      border: 'rgba(245, 158, 11, 0.4)',
      accent: '#fef08a',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
      badgeText: '#fde047',
      scanlineTint: 'rgba(245, 158, 11, 0.05)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.05,
      cornerStyle: 'chamfer',
      glowIntensity: 'vibrant'
    }
  },
  columbia: {
    id: 'columbia',
    nameKo: '컬럼비아',
    nameEn: 'Columbia',
    motto: '개척과 진보, 무한한 프론티어',
    insigniaTitle: '궤도 위성과 파이오니어 독수리',
    terminalHeader: {
      title: 'TRIMONT PIONEER TELEMETRY',
      subtitle: '트라이마운츠 궤도 개척 관제 시스템',
      inspiration: '론 트레일'
    },
    interfaceTitle: 'TRIMONT PIONEER TELEMETRY',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'columbia-telemetry',
      title: '개척 신용도',
      position: 'header-ribbon',
      metricLabel: 'CREDIT'
    },
    colors: {
      primary: '#1e88e5',
      primaryGlow: 'rgba(30, 136, 229, 0.45)',
      secondary: '#ff7043',
      surface: '#0a101d',
      card: '#121b2d',
      border: 'rgba(56, 189, 248, 0.35)',
      accent: '#38bdf8',
      badgeBg: 'rgba(30, 136, 229, 0.2)',
      badgeText: '#93c5fd',
      scanlineTint: 'rgba(56, 189, 248, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'sharp',
      glowIntensity: 'medium'
    }
  },
  iberia: {
    id: 'iberia',
    nameKo: '이베리아',
    nameEn: 'Iberia',
    motto: '황금의 함선과 등대의 불빛',
    insigniaTitle: '대침묵의 등대와 심해의 성호',
    terminalHeader: {
      title: 'IBERIA PROFOUND ASTROLABE',
      subtitle: '대침묵 관측 및 심해 성당 아스트롤라베',
      inspiration: '스툴티페라 나비스'
    },
    interfaceTitle: 'IBERIA PROFOUND ASTROLABE',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'iberia-astrolabe',
      title: '심해 파동계',
      position: 'chronicle-banner',
      metricLabel: 'ASTROLABE'
    },
    colors: {
      primary: '#1e3a5f',
      primaryGlow: 'rgba(30, 58, 95, 0.5)',
      secondary: '#d4af37',
      surface: '#080f17',
      card: '#101a26',
      border: 'rgba(212, 175, 55, 0.3)',
      accent: '#22d3ee',
      badgeBg: 'rgba(34, 211, 238, 0.15)',
      badgeText: '#67e8f9',
      scanlineTint: 'rgba(34, 211, 238, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'filigree',
      glowIntensity: 'medium'
    }
  },
  laterano: {
    id: 'laterano',
    nameKo: '라테라노',
    nameEn: 'Laterano',
    motto: '성스러운 율법과 천상의 낙원',
    insigniaTitle: '천상의 헤일로와 수호총의 성가',
    terminalHeader: {
      title: 'LATERANO NOTARIAL SANCTUM',
      subtitle: '교황청 공증소 및 성스러운 율법 기록',
      inspiration: '가이딩 어헤드'
    },
    interfaceTitle: 'LATERANO NOTARIAL SANCTUM',
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
      secondary: '#f8fafc',
      surface: '#0f1219',
      card: '#171c26',
      border: 'rgba(255, 213, 79, 0.4)',
      accent: '#a78bfa',
      badgeBg: 'rgba(255, 213, 79, 0.2)',
      badgeText: '#fef08a',
      scanlineTint: 'rgba(255, 213, 79, 0.05)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.05,
      cornerStyle: 'round',
      glowIntensity: 'vibrant'
    }
  },
  leithanien: {
    id: 'leithanien',
    nameKo: '라이타니엔',
    nameEn: 'Leithanien',
    motto: '음률과 아츠의 영원한 협주곡',
    insigniaTitle: '쌍둥이 첨탑과 첼로의 금빛 음표',
    terminalHeader: {
      title: 'ZWILLINGSTÜRME SCORE ARCHIVE',
      subtitle: '쌍둥이 첨탑 음악원 아츠 총보',
      inspiration: '츠빌링슈튀르메의 가을'
    },
    interfaceTitle: 'ZWILLINGSTÜRME SCORE ARCHIVE',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'leithanien-cadence',
      title: '아츠 케이던스',
      position: 'dossier-crest',
      metricLabel: 'CADENCE'
    },
    colors: {
      primary: '#e6a122',
      primaryGlow: 'rgba(230, 161, 34, 0.5)',
      secondary: '#6b1426',
      surface: '#0e0f16',
      card: '#161824',
      border: 'rgba(230, 161, 34, 0.35)',
      accent: '#fde68a',
      badgeBg: 'rgba(230, 161, 34, 0.2)',
      badgeText: '#fde68a',
      scanlineTint: 'rgba(230, 161, 34, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'filigree',
      glowIntensity: 'medium'
    }
  },
  sami: {
    id: 'sami',
    nameKo: '사미',
    nameEn: 'Sami',
    motto: '원초의 성림과 은빛 서리의 맹세',
    insigniaTitle: '순록의 뿔과 고대 오로라 룬',
    terminalHeader: {
      title: 'SAMI SNOWPRIEST RUNE',
      subtitle: '설원 성림 주술 및 붕괴 관측 룬',
      inspiration: '은빛 서리 끝'
    },
    interfaceTitle: 'SAMI SNOWPRIEST RUNE',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'sami-collapse',
      title: '오로라 영기',
      position: 'chronicle-banner',
      metricLabel: 'AURA'
    },
    colors: {
      primary: '#10b981',
      primaryGlow: 'rgba(16, 185, 129, 0.45)',
      secondary: '#38bdf8',
      surface: '#081116',
      card: '#0f1d26',
      border: 'rgba(56, 189, 248, 0.35)',
      accent: '#67e8f9',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      badgeText: '#6ee7b7',
      scanlineTint: 'rgba(16, 185, 129, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'chamfer',
      glowIntensity: 'medium'
    }
  },
  siracusa: {
    id: 'siracusa',
    nameKo: '시라쿠사',
    nameEn: 'Siracusa',
    motto: '밤의 늑대와 피의 서약',
    insigniaTitle: '늑대의 단검과 패밀리의 인장',
    terminalHeader: {
      title: 'FAMIGLIA BOLSIGNI DOSSIER',
      subtitle: '볼시니 패밀리 비밀 장부 및 서약록',
      inspiration: '일 시라쿠사노'
    },
    interfaceTitle: 'FAMIGLIA BOLSIGNI DOSSIER',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'siracusa-omerta',
      title: '오메르타 결속도',
      position: 'dossier-crest',
      metricLabel: 'OMERTA'
    },
    colors: {
      primary: '#991b1b',
      primaryGlow: 'rgba(153, 27, 27, 0.5)',
      secondary: '#78350f',
      surface: '#0c0c0e',
      card: '#151518',
      border: 'rgba(153, 27, 27, 0.4)',
      accent: '#e4e4e7',
      badgeBg: 'rgba(153, 27, 27, 0.25)',
      badgeText: '#fca5a5',
      scanlineTint: 'rgba(153, 27, 27, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'sharp',
      glowIntensity: 'subtle'
    }
  },
  sargon: {
    id: 'sargon',
    nameKo: '사르고',
    nameEn: 'Sargon',
    motto: '타오르는 사막과 불멸의 군주',
    insigniaTitle: '태양 원반과 사막의 곡도',
    terminalHeader: {
      title: 'SARGON GOLDEN OASIS',
      subtitle: '황금 오아시스 파샤 영지 상업록',
      inspiration: '황금 오아시스'
    },
    interfaceTitle: 'SARGON GOLDEN OASIS',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'sargon-tribute',
      title: '오아시스 기후 지수',
      position: 'chronicle-banner',
      metricLabel: 'CLIMATE'
    },
    colors: {
      primary: '#d97706',
      primaryGlow: 'rgba(217, 119, 6, 0.45)',
      secondary: '#0d9488',
      surface: '#120e0a',
      card: '#1d1712',
      border: 'rgba(217, 119, 6, 0.35)',
      accent: '#ea580c',
      badgeBg: 'rgba(217, 119, 6, 0.2)',
      badgeText: '#fcd34d',
      scanlineTint: 'rgba(217, 119, 6, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'chamfer',
      glowIntensity: 'medium'
    }
  },
  rim_billiton: {
    id: 'rim_billiton',
    nameKo: '림 빌리톤',
    nameEn: 'Rim Billiton',
    motto: '붉은 대지의 굴착과 개척',
    insigniaTitle: '광부의 곡괭이와 거대 육상함 톱니바퀴',
    terminalHeader: {
      title: 'RIM BILLITON EXCAVATION RIG',
      subtitle: '심층 갱도 채굴 및 이동리그 원격 계측',
      inspiration: '채굴 리그 / 육상함'
    },
    interfaceTitle: 'RIM BILLITON EXCAVATION RIG',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'rim-billiton-depth',
      title: '채굴 심도 계측',
      position: 'header-ribbon',
      metricLabel: 'DRILL RIG'
    },
    colors: {
      primary: '#f59e0b',
      primaryGlow: 'rgba(245, 158, 11, 0.45)',
      secondary: '#c2410c',
      surface: '#0e0e11',
      card: '#17181f',
      border: 'rgba(194, 65, 12, 0.4)',
      accent: '#fb923c',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
      badgeText: '#fdba74',
      scanlineTint: 'rgba(245, 158, 11, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'sharp',
      glowIntensity: 'medium'
    }
  },
  lungmen: {
    id: 'lungmen',
    nameKo: '용문',
    nameEn: 'Lungmen',
    motto: '번영하는 상업과 용문 근위국의 방패',
    insigniaTitle: '근위국의 비룡과 황금 엽전',
    terminalHeader: {
      title: 'L.G.D. EXECUTIVE TERMINAL',
      subtitle: '용문근위국 행정 통제 및 외곽 치안망',
      inspiration: '용문근위국'
    },
    interfaceTitle: 'L.G.D. EXECUTIVE TERMINAL',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'lungmen-lgd',
      title: '근위국 치안 지수',
      position: 'chronicle-banner',
      metricLabel: 'SECURITY'
    },
    colors: {
      primary: '#10b981',
      primaryGlow: 'rgba(16, 185, 129, 0.5)',
      secondary: '#f59e0b',
      surface: '#091312',
      card: '#10201e',
      border: 'rgba(16, 185, 129, 0.4)',
      accent: '#fbbf24',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      badgeText: '#6ee7b7',
      scanlineTint: 'rgba(16, 185, 129, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'chamfer',
      glowIntensity: 'vibrant'
    }
  },
  kazdel: {
    id: 'kazdel',
    nameKo: '카즈델',
    nameEn: 'Kazdel',
    motto: '폐허의 불길과 살카즈의 비원',
    insigniaTitle: '부서진 뿔과 피의 흑요석 관',
    terminalHeader: {
      title: 'KAZDEL MYRIAD SOULS',
      subtitle: '살카즈 원혼 비원 및 폐허 결계망',
      inspiration: '만혼의 비원'
    },
    interfaceTitle: 'KAZDEL MYRIAD SOULS',
    sidebarPosition: 'left',
    specialtyWidget: {
      id: 'kazdel-souls',
      title: '원혼 공명률',
      position: 'chronicle-banner',
      metricLabel: 'SOULS'
    },
    colors: {
      primary: '#dc2626',
      primaryGlow: 'rgba(220, 38, 38, 0.5)',
      secondary: '#7c3aed',
      surface: '#0e0a12',
      card: '#181120',
      border: 'rgba(124, 58, 237, 0.4)',
      accent: '#f43f5e',
      badgeBg: 'rgba(220, 38, 38, 0.2)',
      badgeText: '#fca5a5',
      scanlineTint: 'rgba(220, 38, 38, 0.05)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.05,
      cornerStyle: 'sharp',
      glowIntensity: 'vibrant'
    }
  },
  kjerag: {
    id: 'kjerag',
    nameKo: '쉐라그',
    nameEn: 'Kjerag',
    motto: '성산의 침묵과 설산의 축복',
    insigniaTitle: '성산의 종과 만년설 설봉',
    terminalHeader: {
      title: 'KARLAN SACRED BELL',
      subtitle: '카를란 성산 종소리 및 무역연합 회보',
      inspiration: '브레이크 디 아이스'
    },
    interfaceTitle: 'KARLAN SACRED BELL',
    sidebarPosition: 'right',
    specialtyWidget: {
      id: 'kjerag-bell',
      title: '성산 만년설 순도',
      position: 'dossier-crest',
      metricLabel: 'PURITY'
    },
    colors: {
      primary: '#38bdf8',
      primaryGlow: 'rgba(56, 189, 248, 0.45)',
      secondary: '#94a3b8',
      surface: '#0a111a',
      card: '#121c2a',
      border: 'rgba(56, 189, 248, 0.35)',
      accent: '#e0f2fe',
      badgeBg: 'rgba(56, 189, 248, 0.2)',
      badgeText: '#7dd3fc',
      scanlineTint: 'rgba(56, 189, 248, 0.04)'
    },
    atmosphericDetails: {
      scanlineOpacity: 0.04,
      cornerStyle: 'round',
      glowIntensity: 'subtle'
    }
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
    }
  }
};
