# 여행가쟈 design system

`C:\tour-data\frontend`(Next.js 16 · Tailwind 4 + CSS Modules · Storybook) — 가챠로 뽑는 국내 여행지 추천 서비스의 디자인 시스템. 원본은 이미 `src/styles/tokens.css` + `.claude/skills/design-system/`(Bright Line 11 + references 5편)으로 완결돼 있고 **디자인 변경 계획이 없다.** 이 저장소는 그 값을 하나도 바꾸지 않고(73개 변수 대조 검증) winterholic 형식(DTCG → dist → 문서 16편)으로 옮긴 **기록·참조본**이다. 정본은 원본이다.

**막히면 [`docs/00-decision-guide.md`](docs/00-decision-guide.md)(토큰) → [`docs/16-situations.md`](docs/16-situations.md)(상황) → 원본 SKILL "막혔을 때"(규칙 충돌·질의).**

## 한눈에
| | |
|---|---|
| 무드 | 한지 배경 + 단청 가는 선 + 민화 + 가챠 도파민. 박물관도 일반 가챠앱도 아님 |
| 배경 | 한지 5단계 `#FBF5E5 → #B8A578`. 순백 금지. 어두운 배경은 연출 무대만(`data-tone="dark"`) |
| 액센트 | 단청 오방색(빨 `#C8362E` · 파 `#2A5E8C` · 노 `#E8B632` · 흰 · 검) — 띠·테두리·버튼 같은 가는 선·작은 면에만 |
| 글자 | 잉크 4단계. `ink-3 #735F47`(5.17:1)이 읽는 글자 하한, `ink-4` 는 장식 |
| 질감 | 먹선 2px + 도장 오프셋 그림자(`3px 3px 0`). blur 그림자는 연출만 |
| 서체 | Myeongjo(제목 800) · Gowun Batang(본문) · Nanum Brush(강조 1~2곳, −1.5°) · Cinzel(등급) · DM Mono(숫자) · Pretendard(UI) · Gaegu |
| 등급 | Common·Rare·Epic·Legendary·Unique(+Moment) 풀네임. 색은 프레임·띠·글로우에만. 위계는 색이 아니라 광택 |
| 레이아웃 | 375 기준, AppShell(띠 6 · 헤더 52 · 본문 430 · CTA · 플로팅 탭바). 768 폰 프레임, 1024 책상. 기둥 520/720/960/1152 |
| 캡슐 | 시그니처. 홈 160×189 부유. 등급별 흔들림 soft/strong/vivid |
| 카피 | 해요체 + 굴리다·캡슐·짠·까치. 사극·SNS·게임 톤 금지. 왼쪽 버튼은 "닫기" |
| 접근성 | 시맨틱 태그 필수, 등급 텍스트 병기, reduced-motion 전역 가드. 빌드가 92쌍 대비 검사 |

미리보기: [`examples/preview.html`](examples/preview.html) (한지 / 무대 토글).

## 설치
원본 프로젝트는 자체 `tokens.css` 를 쓰므로 **설치 의무가 없다.** 다른 프로젝트가 여행가쟈 톤을 빌리거나, 원본이 이 저장소로 갈아타고 싶을 때:
```html
<link rel="stylesheet" href="/vendor/yeohaenggajya/tokens.css" />
<link rel="stylesheet" href="/vendor/yeohaenggajya/typography.css" />      <!-- .yg-* 역할 클래스, .yg-band, .yg-hanji-scroll -->
<link rel="stylesheet" href="/vendor/yeohaenggajya/legacy-aliases.css" />  <!-- --hanji, --dc-red, --sp-4 … 원본 변수명 그대로 -->
```
```css
.btn { background: var(--dc-red); box-shadow: var(--sh-stamp); }          /* 원본 변수명 계속 사용 가능 */
.btn { background: var(--yg-color-action-primary-bg); box-shadow: var(--yg-shadow-stamp); }  /* 시맨틱 이름 */
```
Tailwind 프리셋(`dist/tailwind.preset.cjs`)은 원본 `@theme inline` 의 `background`·`foreground` 를 유지한다. 원본은 CSS Modules 우선이라 프리셋은 레이아웃 보조.

## 검증 — 원본과 값이 같은가
```bash
cd C:/mydevelop/winterholic-design-system/yeohaenggajya && node -e "
const fs=require('fs');const o={};for(const m of fs.readFileSync('C:/tour-data/frontend/src/styles/tokens.css','utf8').matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm))o[m[1]]=m[2].trim();
const dist=fs.readFileSync('dist/tokens.css','utf8').split('[data-tone')[0];const d={};for(const m of dist.matchAll(/^\s*(--yg-[\w-]+):\s*([^;]+);/gm))d[m[1]]=m[2].trim();
const a={};for(const m of fs.readFileSync('dist/legacy-aliases.css','utf8').matchAll(/^\s*(--[\w-]+):\s*var\((--yg-[\w-]+)\);/gm))a[m[1]]=m[2];
let n=0,bad=0;for(const[k,v]of Object.entries(o)){n++;const dv=d[a[k]];if(!dv)bad++;}console.log('vars',n,'missing',bad);"
# → vars 73 missing 0   (그림자는 표기만 다름: 0 vs 0px, rgb() vs #RRGGBBAA)
```

## 문서 지도
| 문서 | 내용 |
|---|---|
| [00 결정 가이드](docs/00-decision-guide.md) | 상황별 토큰 정답표 + 원본 변수명 대응 + 등급 한눈에 |
| [01 색](docs/01-color.md) | 한지·단청·잉크·한국색·홀로, 시맨틱 역할, 대비 실측, 조합 규칙 |
| [02 타이포](docs/02-typography.md) | 서체 7종 역할, 스케일, 역할 스타일 19종, 한국어 조판 |
| [03 간격·레이아웃](docs/03-spacing-layout.md) | sp 스케일, AppShell 골격, 기둥 4종, 화면 공식 |
| [04 모양·깊이](docs/04-shape-elevation.md) | 먹선, 도장·종이 그림자, 오방색 띠, 텍스처, 9-slice |
| [05 모션](docs/05-motion.md) | 180/320/700, 캡슐 흔들림·부유·홀로, 3막 연출 |
| [06 컴포넌트](docs/06-components.md) | 27절 — Button·GachaCta·BottomCta·TextInput·Chip·RarityBadge·Capsule·GachaCard·CardShell·BannerRank·DexCell·TabBar·AppShell·Header·PullCounter·ListItem·Tabs·Progress·Stamp·Dropdown·ConfirmDialog·Sheet·EffectStage·Logo·Toast·Empty + 조립 규칙 |
| [07 상태·피드백](docs/07-states-feedback.md) | 횟수 소진·오프라인·카메라 실패·빈 상태·오류·카피 견본 |
| [08 접근성](docs/08-accessibility.md) | 대비 실측, ARIA 표, 등급 텍스트 병기 |
| [09 어두운 무대](docs/09-dark-mode.md) | 다크 모드가 아닌 연출 무대 스코프 |
| [10 아이콘·아트워크](docs/10-iconography-imagery.md) | Lucide 매핑, 도장·필터 프레임·민화 아트, 사진 출처 |
| [11 등급·연출](docs/11-rarity-and-effects.md) | 6등급 시각 규격, 연출 조합, 카드 데이터 요소, 도감 진행 |
| [12 페이지 패턴](docs/12-page-patterns.md) | 홈·풀·AR·결과·코스·도감·상세·마이·공유·온보딩·계정·방·안내·법적·오프라인 |
| [13 운영](docs/13-governance.md) | 원본이 정본, 변경 절차, 결정 기록 |
| [14 브랜드 자산](docs/14-brand-assets.md) | 로고 파일·Logo 컴포넌트 규칙·메타 색 |
| [15 점검](docs/15-audit-and-migration.md) | 원본 점검 14항목, 되가져갈 후보, 정정 권고 3줄 |
| [16 상황 사전](docs/16-situations.md) | 배경·색·카피·레이아웃·조합·등급·상태·접근성 8축 120여 상황 |
| [CLAUDE.md](CLAUDE.md) | AI 에이전트 규칙(Bright Line 11 인용) |

## 토큰 수정
원본 `tokens.css` 가 먼저 바뀐 뒤에만(13 §2). `node tokens/build.mjs` → 대조 스크립트로 값 일치 확인.
