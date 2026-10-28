// src/data/perks.ts
import { ReincarnationPerk } from '../types';

export const REINCARNATION_PERKS: ReincarnationPerk[] = [
  {
    id: 'perk_merchant_heir',
    name: '대형 상단 후원자',
    description: '태어날 때부터 든든한 재정적 후원을 받습니다. (초기 자산 +1,500 LMD, 지략 +8)',
    reqPoints: 0,
    badge: 'LMD +1,500 / 지략 +8'
  },
  {
    id: 'perk_martial_prodigy',
    name: '천부적 무예 혈통',
    description: '타고난 신체 능력과 호신 무기를 지니고 성장합니다. (전투력 +15, 최대 체력 +15, 근위국 제식 도검 장착)',
    reqPoints: 50,
    badge: '전투 +15 / 제식 도검'
  },
  {
    id: 'perk_arts_resonance',
    name: '고대 아츠 공명체',
    description: '오리지늄 아츠 회로에 천부적인 감응력을 지닙니다. (아츠 적성 +18, 최대 이성 +15, 행운 +10)',
    reqPoints: 100,
    badge: '아츠 +18 / 이성 +15'
  },
  {
    id: 'perk_rhodes_sponsor',
    name: '로도스 특별 보호 대상',
    description: '로도스 아일랜드 의료진의 지원을 받습니다. (정품 억제제 2개, 이성 회복제 2개 지참, 로도스 평판 +25)',
    reqPoints: 180,
    badge: '억제제x2 / 로도스 +25'
  },
  {
    id: 'perk_pure_immunity',
    name: '결정 면역 특이 체질',
    description: '오리지늄 분진에 강한 생체 저항성을 가집니다. (출생 시 100% 비감염 보장, 환경 감염률 80% 감소)',
    reqPoints: 300,
    badge: '비감염 보장 / 면역'
  },
  {
    id: 'perk_ancient_sovereign',
    name: '고대 왕가의 각성',
    description: '전설적인 고대종(드라코·아슬란) 직접 선택이 해금되며 왕의 자질을 부여받습니다. (모든 스탯 +12, 자산 +2,500 LMD)',
    reqPoints: 450,
    badge: '고대종 해금 / 전 스탯 +12'
  }
];
