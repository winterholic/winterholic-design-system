# Ttakkari Design System

Winterholic Ttakkari(내 Mac Studio 에서 도는 AI 에이전트에게 어디서든 일을 시키고, 진행을 보고, 결과물을 바로 여는 개인용 PWA)의 디자인 시스템. 채팅 · 작업 공간 · 보관함 · 파일 찾기가 같은 토큰과 컴포넌트를 쓴다.
**개발하다 막히면 [`docs/00-decision-guide.md`](docs/00-decision-guide.md)를 연다.** 상황 → 토큰 → 값이 표로 있다. 상황이 애매하면 [`docs/17-situations.md`](docs/17-situations.md).

> 방향: **종이 위 지시서, 잉크 위 기계의 답.** 사람의 행동은 Blue, 에이전트의 존재(실행 중·완료·도착)는 Mint. 메시지·문서는 Paper 와 Ink, 코드·로그는 두 테마 모두 잉크 면. 민트 글로우·그라데이션은 없다.

## 한눈에

| | |
|---|---|
| 시드(그대로) | Paper `#F4F4ED` · Ink `#080705` · Blue `#296EB4` · Mint `#00F0B5` · Mint Soft `#6DECAF` + 중립 시드 8색(라이트 `#FFFFFF` `#E9ECE8` `#D6DCD7` `#59645F` · 다크 `#171B1C` `#22292A` `#30383A` `#A6B0B8`) |
| 역할 | Blue = 사람(주 버튼·링크·포커스·선택·사용자 말풍선) / Mint = 에이전트(실행 중·완료·결과물 도착·커서) / Mint Soft = 형광펜(검색 히트) / amber = 승인 대기 / red = 실패·차단 / plum = 별도 정책·이미지 |
| 파생 | OKLCH 램프 7종(blue·mint·sage·graphite + 보강 red·amber·plum) → 시맨틱 토큰. 화면은 시맨틱만 쓴다 |
| 서체 | Pretendard(메시지·UI·문서) + JetBrains Mono(코드·로그·경로·해시, 리거처 끔) |
| 스케일 | 4px 간격 · 글자 12~36(하한 12, 입력 16) · 컨트롤 24/32/40/48 · radius 2/4/8/12/16/20 · 채팅 열 760 · 문서 열 720 |
| 셸 | 모바일: 헤더 56 · 화면 · 컴포저 · 탭바 56(+safe-area) / lg 이상: 사이드바 280 · 채팅 \| 작업 공간 분할 |
| 다크 | 시드 `.dark` 값 그대로. `prefers-color-scheme` · `data-theme="dark"` · `.dark` 셋 다 지원. 컴포넌트에 `dark:` 없음 |
| 컴포넌트 | **구현 포함**: `dist/components.css` + `dist/tk.js`. core 25 + 채팅(스레드·메시지·컴포저) + 실행·승인(Run·Steps·Log·Approval·Checks) + 결과물(Glyph·Card·Policy·Retention·Detail) + Universal Artifact Viewer(본문 7종·상태 7종) |
| 검사 | 대비 510쌍(라이트·다크), 컴포넌트 lint(hex·px·시간·z-index·없는 변수), 이름 충돌 검사, 정적 테스트, Chrome 동작 검사 58개(6폭 가로 넘침·키보드·한글 조합 Enter·분할·뷰어) |
| 연동 | React+Vite+TS 계약([19](docs/19-react-integration.md)), Tailwind 프리셋, Monaco 테마, PWA 색, 시드 별칭 |

미리보기: [`examples/preview.html`](examples/preview.html)(전 토큰·컴포넌트, 라이트·다크). 템플릿: [`chat`](examples/chat.html) · [`workspace`](examples/workspace.html) · [`library`](examples/library.html) · [`files`](examples/files.html) · [`auth`](examples/auth.html).

## 설치

```html
<script>try{var t=localStorage.getItem('tk-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/jetbrains-mono@5/index.min.css">
<link rel="stylesheet" href="/vendor/ttakkari/tokens.css">
<link rel="stylesheet" href="/vendor/ttakkari/typography.css">
<link rel="stylesheet" href="/vendor/ttakkari/components.css">
<link rel="stylesheet" href="/vendor/ttakkari/prose.css">
<link rel="stylesheet" href="/vendor/ttakkari/aliases.css">   <!-- 시드 이름(--background·--primary…)을 쓰는 코드가 있을 때만 -->
<script src="/vendor/ttakkari/tk.js" defer></script>            <!-- React 앱은 쓰지 않는다(19) -->
```

```html
<button class="tk-button tk-button--primary tk-button--lg" type="button">승인하고 보내기</button>
<span class="tk-badge" data-state="running"><span class="tk-dot tk-dot--live" aria-hidden="true"></span>실행 중</span>
```

### React + Vite + TS
`dist/*.css` 를 `main.tsx` 에서 import 하고, 컴포넌트는 마크업 계약대로 만든다. 순서·컴포저 한글 조합 규칙·Monaco·PDF.js·sandbox iframe·PWA 는 [19](docs/19-react-integration.md).

### Tailwind
```js
module.exports = { presets: [require('./vendor/wds/ttakkari/dist/tailwind.preset.cjs')] };   // tokens.css 는 계속 로드
```
`bg-surface-default text-agent border-border-default rounded-lg h-control-md`. 색은 CSS 변수라 다크가 자동이다.

### JS / TS
```ts
import { tokens } from './vendor/ttakkari/tokens.js';
tokens.color.agent.live.var     // 'var(--tk-color-agent-live)'
tokens.color.ink.bg.value       // '#171B1C' (라이트) · .dark '#111516'
```

### 그 밖의 산출물
`tokens.scss` · `tokens.figma.json`(Tokens Studio) · `tokens.global.js`(`window.TK_TOKENS`) · `monaco-theme.json`(`tk-ink-light`·`tk-ink-dark`) · `pwa.json`(manifest·theme-color) · `aliases.css`(시드 이름) · `contrast-report.json`.

가져오는 법: `git submodule add https://github.com/winterholic/winterholic-design-system.git vendor/wds` 후 `vendor/wds/ttakkari/dist`, 또는 `dist/` 복사(태그 `ttakkari-vX.Y.Z` 를 적어 둔다). 브랜드 파일은 `assets/brand/` 를 앱의 `public/brand/` 로.

## 문서 지도

| 문서 | 내용 | 이럴 때 |
|---|---|---|
| [00 결정 가이드](docs/00-decision-guide.md) | 상황별 정답표 | **막혔을 때 첫 번째** |
| [01 색](docs/01-color.md) | 시드 13색의 자리, 램프 7종, 시맨틱, 도메인 그룹, 잉크 면, 조합 규칙 | "여기 무슨 색?" |
| [02 타이포](docs/02-typography.md) | 24 스타일, 메시지·문서 리듬, 기계값 | 글자 |
| [03 간격·레이아웃](docs/03-spacing-layout.md) | 4px, 원시 요소, 브레이크포인트별 앱 셸, safe-area·키보드 | 여백·골격 |
| [04 모양·깊이](docs/04-shape-elevation.md) | radius, 선, 그림자, 패턴 | 둥글기·그림자 |
| [05 모션](docs/05-motion.md) | duration·easing, 에이전트 신호의 움직임, 모션 축소 | 애니메이션 |
| [06 컴포넌트](docs/06-components.md) | core 25종 마크업 계약·변형·상태·접근성 | 컴포넌트 |
| [07 채팅](docs/07-chat.md) | 스레드·메시지·생각 중·커서·새 메시지·제안·컴포저 | 채팅 화면 |
| [08 실행·승인](docs/08-run-approval.md) | 작업 6상태, Run·Steps·Log·Approval·Checks | 에이전트가 일할 때 |
| [09 결과물·뷰어](docs/09-artifact-viewer.md) | 결과물 행·카드·정책·상세, 뷰어 셸·본문 7종·상태 7종, HTML 격리, prose | 결과물을 열 때 |
| [10 상태·피드백](docs/10-states-feedback.md) | 로딩·빈·오류·연결·성공·정책 | 데이터 없을 때·실패 |
| [11 접근성](docs/11-accessibility.md) | 기계가 막는 것, 키보드·터치 표, 라이브 영역 | 출시 전 |
| [12 다크모드](docs/12-dark-mode.md) | 시드 다크의 재배치, 구현, 깜빡임 방지 | 다크가 이상할 때 |
| [13 아이콘·이미지](docs/13-iconography-imagery.md) | Lucide, 의미 고정 매핑 | 아이콘 |
| [14 페이지 패턴](docs/14-page-patterns.md) | 공통 셸, 채팅·작업 공간·보관함·파일 찾기·로그인·오류·설정 | 새 화면 |
| [15 운영](docs/15-governance.md) | 파일 구조, 변경 절차, 이름 규칙, 버전, 채택 기준, 한계 | 토큰·컴포넌트 추가 |
| [16 브랜드 자산](docs/16-brand-assets.md) | '따' 심볼·락업·파비콘·PWA 아이콘·히어로 | 브랜딩 |
| [17 상황 사전](docs/17-situations.md) | A~R 상황별 답 | 애매할 때 |
| [18 제품 매핑](docs/18-product-mapping.md) | 요구사항의 약속·개념·Phase → 화면, 화면이 하지 않는 것 | 요구사항이 화면에서 뭐가 되나 |
| [19 React 연동](docs/19-react-integration.md) | import 순서, 컴포넌트 계약, 컴포저 규칙, 렌더러, 라우팅, PWA | 프론트 구현 |
| [20 설계 검토](docs/20-design-review.md) | 결정·대안·렌더 검토에서 고친 것 | 왜 이렇게 됐나 |
| [CLAUDE.md](CLAUDE.md) | AI 에이전트 규칙 요약 | AI 로 UI 를 만들 때 |

## 빌드·검사

```bash
npm run build      # = node tokens/build.mjs. 참조·라이트/다크·대비 510쌍·lint·이름 충돌 실패 시 중단
npm test           # 빌드 + 정적 검사 + 브랜드 자산 검사(Python+Pillow 필요)
npm run check:ui   # 실제 Chrome 으로 6폭 가로 넘침·키보드·컴포저·분할·뷰어 검사(playwright-core 필요)
npm run brand      # 브랜드 자산 재생성(Python+Pillow)
```

## 원칙 여섯 줄

1. 화면 코드에 hex·px 를 쓰지 않는다. 토큰과 컴포넌트만.
2. 기본값이 정답이다. 클래스 하나가 가장 흔한 경우다.
3. Blue 는 사람, Mint 는 에이전트. amber 는 기다림, red 는 실패, plum 은 별도 정책.
4. 사람이 읽는 것은 종이, 기계가 내놓는 것은 잉크.
5. 사람을 기다리는 것과 지금 움직이는 것만 눈에 띈다. 끝난 일은 조용하다.
6. 결정은 한 번만. 표에 있으면 그대로, 없으면 표에 추가한다.
