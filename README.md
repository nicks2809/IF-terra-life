# 테라의 한 사람으로 태어나 (Terra: Life in Arknights)

> **"박사님, PRTS 가동을 시작합니다. 테라의 한 사람으로서 살아가는 여정에 오신 것을 환영합니다."**

Project Moon의 명작 웹 시뮬레이터 ['도시의 한 사람으로 태어나'](https://project-moon-life.cityborn.workers.dev/)에서 영감을 받아, **명일방주(Arknights)** 세계관인 '테라(Terra)'를 배경으로 제작된 텍스트 & RPG 하이브리드 인생 시뮬레이션 웹 게임입니다.

---

## 🌟 주요 특징 (Key Features)

### 1. 테라에서의 무작위 출생 (Random Origins)
- **12개 이상의 국가 및 환경**: 용문(Lungmen), 우르수스(Ursus), 빅토리아(Victoria), 컬럼비아(Columbia), 카즈델(Kazdel), 라테라노(Laterano), 이베리아, 카시미어, 사미, 쉐라그, 시에스타, 시라쿠사 등
- **종족 고유 패시브 (Racial Traits)**:
  - 살카즈: 강력한 아츠 친화력과 신체 능력, 그러나 감염률 위험과 사회적 편견
  - 산크타: 공감 능력과 수호총 사격 특화
  - 쿠란타: 강인한 기동성과 카시미어 기사도 전승
  - 루포, 페라인, 에기르, 우르수스, 포르테 등 12종 이상의 테라 종족 지원
- **환경**: 이동도시 상류층 / 일반 구역 / 슬럼가 / 황야(Nomad) / 이동기지

### 2. 광석병(Oripathy) 생존 시스템
- 감염 여부 및 **체세포 오리지늄 결정화율(%)** 관리
- 비감염자로 태어나도 재앙, 분진, 전투 중 감염될 수 있습니다.
- 감염 시 아츠(Arts) 위력이 비약적으로 상승하지만, 수명이 제한되고 로도스 아일랜드의 억제제를 정기적으로 투약하지 않으면 치명적인 결정화 사망에 이릅니다.

### 3. 하이브리드 시간 제어 & 연간 자율 활동
- **하이브리드 템포**: 1분=1년 실시간 자동 진행 + 1x/2x/4x 배속 + 일시정지 + '다음 해로 넘기기(턴 스킵)' 버튼 제공
- **연간 자율 활동 탭**:
  - 오리지늄 아츠 수련
  - 암시장 무기/방어구 파밍
  - 로도스 / 근위국 의뢰 수주
  - 오리지늄 억제제 및 이성 회복제 복용

### 4. 군상극 서사 & 미니 턴제 배틀 모달
- 평소에는 테라 전역의 소문과 대사건(체르노보그 사변, 라인 랩 사건, 런디니움 사태)이 라디오 속보로 들려옵니다.
- 플레이어의 진로와 행적에 따라 역사의 소용돌이에 직접 휘말립니다.
- 인생의 결정적 고비나 보스급 적과의 조우 시 **[미니 턴제 배틀 모달]**이 열려 [공격 / 방어 / 아츠 영창 / 약품 사용] 전술 커맨드를 직접 지휘합니다.

### 5. 듀얼 비주얼 테마
- **PRTS 터미널 테마 (기본)**: 카본 블랙, 로도스 시안(#00e5ff), 하저드 옐로우(#f7b500), 생체 바이탈 모니터 HUD
- **테라 역사서 고서적 테마**: '도시의 한 사람' 스타일의 앤틱 송명체, 양장본 일지 테두리, 빈티지 잉크 감성

### 6. 영구 보존 & 추모실
- 실시간 브라우저 로컬 저장
- 사망 시 최종 일대기 & 유언 추모 카드 생성 (클립보드 복사 및 이미지 다운로드)
- 과거 플레이한 모든 캐릭터들의 기록이 남는 **[지난 생애 추모실]**

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 18 / TypeScript / Vite / Tailwind CSS
- **Icons & Effects**: Lucide React, Canvas-Confetti, html-to-image
- **Deployment**: GitHub Pages (GitHub Actions 자동 배포), Vercel, Cloudflare Pages 호환

---

## 🚀 로컬 실행 방법 (Quick Start)

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 실행 (브라우저에서 즉시 플레이)
npm run dev

# 3. 배포용 빌드
npm run build
```

---

## 🌐 깃허브(GitHub) 업로드 및 GitHub Pages 배포 가이드

### 1. 깃허브에 레포지토리 푸시하기
```bash
# Git 초기화 및 커밋
git init
git add .
git commit -m "feat: initial commit for Terra Life"

# 본인의 GitHub 레포지토리 연결 및 푸시
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_ID>/terra-life.git
git push -u origin main
```

### 2. GitHub Pages 무료 호스팅 활성화
1. GitHub 레포지토리의 **Settings** -> **Pages** 메뉴로 이동합니다.
2. **Build and deployment -> Source**를 `GitHub Actions`로 선택합니다.
3. 푸시할 때마다 `.github/workflows/deploy.yml`이 자동으로 빌드하여 `https://<YOUR_GITHUB_ID>.github.io/terra-life/` 주소로 무료 배포됩니다!

---

## 📜 상세 기획 및 구현 계획서
전체 기술 사양, 데이터 스키마 및 이벤트 플로우는 [PLAN.md](./PLAN.md)에서 확인하실 수 있습니다.
