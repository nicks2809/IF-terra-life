// src/data/perks.ts
import { ReincarnationPerk } from '../types';

export const REINCARNATION_PERKS: ReincarnationPerk[] = [
  {
    id: 'perk_merchant_heir',
    name: '대형 상단 후원자',
    description: '태어날 때부터 상단의 재정적 후원을 받습니다. (초기 자산 +900 LMD, 지략 +5)',
    reqPoints: 120,
    badge: 'LMD +900 / 지략 +5'
  },
  {
    id: 'perk_martial_prodigy',
    name: '천부적 무예 혈통',
    description: '단련된 신체 감각과 호신 무기를 지니고 성장합니다. (전투력 +10, 최대 체력 +12, 근위국 제식 도검 장착)',
    reqPoints: 250,
    badge: '전투 +10 / 제식 도검'
  },
  {
    id: 'perk_arts_resonance',
    name: '고대 아츠 공명체',
    description: '오리지늄 아츠 회로에 뛰어난 감응력을 지닙니다. (아츠 적성 +12, 최대 이성 +12, 행운 +6)',
    reqPoints: 400,
    badge: '아츠 +12 / 이성 +12'
  },
  {
    id: 'perk_rhodes_sponsor',
    name: '로도스 특별 보호 대상',
    description: '로도스 아일랜드 의료진의 지원을 받습니다. (정품 억제제 2개, 이성 회복제 2개 지참, 로도스 평판 +20)',
    reqPoints: 600,
    badge: '억제제x2 / 로도스 +20'
  },
  {
    id: 'perk_pure_immunity',
    name: '결정 면역 특이 체질',
    description: '오리지늄 분진에 강한 생체 저항성을 가집니다. (출생 시 100% 비감염 보장, 환경 감염률 70% 감소)',
    reqPoints: 850,
    badge: '비감염 보장 / 면역'
  },
  {
    id: 'perk_ancient_sovereign',
    name: '고대 왕가의 각성',
    description: '전설적인 고대종(드라코·아슬란) 직접 선택이 해금되며 왕의 자질을 부여받습니다. (모든 스탯 +8, 자산 +1,500 LMD)',
    reqPoints: 1200,
    badge: '고대종 해금 / 전 스탯 +8'
  }
];
