# 19 · React 연동 (React + Vite + TypeScript PWA)

소비 앱(`winterholic-ttakkari/front`)이 이 시스템을 가져가는 법. 이 시스템은 프레임워크 없는 CSS + 바닐라 JS 다. React 앱은 **CSS 와 토큰을 그대로 쓰고, 동작은 같은 계약으로 컴포넌트를 만든다.** `tk.js` 는 예제·기준 구현이며 React 트리 안에서 쓰지 않는다(직접 DOM 을 바꾸면 React 상태와 어긋난다).

## 1. 가져오기

```bash
# 저장소 루트에서 서브모듈(태그 고정) 또는 dist 복사
git submodule add https://github.com/winterholic/winterholic-design-system.git vendor/wds
```
```ts
// src/main.tsx — 순서가 중요하다(토큰 → 글자 → 컴포넌트 → 문서)
import '../vendor/wds/ttakkari/dist/tokens.css';
import '../vendor/wds/ttakkari/dist/typography.css';
import '../vendor/wds/ttakkari/dist/components.css';
import '../vendor/wds/ttakkari/dist/prose.css';
// import '../vendor/wds/ttakkari/dist/aliases.css';   // 시드 이름(--background 등)을 쓰는 코드가 있을 때만
```
- 브랜드 파일(`assets/brand/*`)은 `public/brand/` 로 복사한다.
- `index.html` `<head>` 맨 앞: 테마 깜빡임 방지 한 줄(12 §3) + `viewport-fit=cover` + `dist/pwa.json` 의 theme-color 두 줄.
- 글꼴: Pretendard·JetBrains Mono 를 자체 호스팅하거나 CDN 을 서비스 워커로 캐시한다(오프라인에서도 글꼴이 같아야 한다).

### Tailwind 를 쓴다면
```js
// tailwind.config.cjs
module.exports = { presets: [require('./vendor/wds/ttakkari/dist/tailwind.preset.cjs')], content: ['./src/**/*.{ts,tsx}'] };
```
`bg-surface-default text-text-secondary border-border-default rounded-lg h-control-md` 처럼 쓴다. 색은 CSS 변수라 **`dark:` 를 쓰지 않는다.** 컴포넌트 클래스(`.tk-*`)와 섞어 써도 된다. 간격·색을 Tailwind 로 다시 조립하기보다 `.tk-*` 컴포넌트를 먼저 쓴다.

### 토큰을 JS 에서
```ts
import { tokens } from '../vendor/wds/ttakkari/dist/tokens.js';
tokens.color.agent.live.var      // 'var(--tk-color-agent-live)'  ← 스타일에는 이것
tokens.color.ink.bg.value        // '#171B1C' (라이트) · .dark '#111516'  ← 캔버스·차트 계산용
```

## 2. 컴포넌트 계약 → React

React 컴포넌트는 06~09 의 **마크업 계약(클래스 + ARIA + data 속성)을 그대로 출력**한다. 상태는 props 로 받아 ARIA·data 속성으로 낸다. 클래스를 조건부로 붙여 상태를 표현하지 않는다.

```tsx
type RunState = 'queued' | 'running' | 'waiting' | 'succeeded' | 'failed' | 'cancelled';
export function RunBadge({ state, children }: { state: RunState; children: React.ReactNode }) {
  return <span className="tk-badge" data-state={state}>{state === 'running' && <span className="tk-dot tk-dot--live" aria-hidden />}{children}</span>;
}
export function Button({ variant, size, busy, ...rest }: ButtonProps) {
  const cls = ['tk-button', variant && `tk-button--${variant}`, size && `tk-button--${size}`].filter(Boolean).join(' ');
  return <button className={cls} aria-busy={busy || undefined} disabled={busy || rest.disabled} {...rest} />;
}
```

| 동작(tk.js) | React 에서 | 지켜야 할 계약 |
|---|---|---|
| 테마 `[data-tk-theme-toggle]` | `useTheme()` 가 `document.documentElement.dataset.theme` 과 `localStorage['tk-theme']` | 버튼 `aria-pressed`(다크 = true), 아이콘 둘 |
| 탭 `role="tablist"` | 상태로 선택, roving tabindex | ←→ Home End, 선택 = 패널 전환 |
| 다이얼로그·시트·드로어·전체 화면 뷰어 | 네이티브 `<dialog>` 에 ref → `showModal()`/`close()` | 닫히면 연 요소로 포커스. `data-tk-modal` 의미 |
| 메뉴 | 상태 + `useRef` | ↓↑ 열기, Esc 복귀, Tab 닫기, 바깥 클릭 |
| 툴팁 | 포털 + `role="tooltip"` | hover 400ms · 포커스 즉시 · Esc · **터치에서 띄우지 않음** |
| 토스트 | 전역 store + `.tk-toast-region`(role=status) | 행동이 있으면 자동으로 닫지 않음 |
| 컴포저 | §3 | Enter 규칙 · 한글 조합 |
| 스레드 따라가기 | §5 | 바닥일 때만 따라감, 아니면 `.tk-jump` |
| 로그 따라가기 | `aria-pressed` 상태 | 위로 휠 = 끔 |
| 분할 손잡이 | pointer events + `--tk-_split` 스타일 | `role="separator"` ←→ |
| 뷰어 배율 | 상태 → `style={{'--tk-zoom': z}}` | 단계 50~300% · 표시값 |
| 뷰어 찾기 | 렌더러별(prose 는 mark 래핑, PDF.js 는 텍스트 레이어) | `mark[data-hit]`, 현재 `aria-current`, n/m |
| 선택 모드 | 상태 | `.tk-selectionbar` 개수, `aria-selected` 행 |

headless 라이브러리(Radix 등)를 써도 된다. 단 **같은 클래스·ARIA 를 출력하게** 하고, 라이브러리 기본 스타일은 끈다(라이브러리를 쓸지는 소비 앱이 정한다).

## 3. 컴포저 구현 규칙(반드시)

```tsx
function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (e.key !== 'Enter' || e.nativeEvent.isComposing || e.keyCode === 229) return;   // 한글 조합 중
  const mod = e.metaKey || e.ctrlKey;
  const coarse = matchMedia('(pointer: coarse)').matches;
  if (mod || (!e.shiftKey && !coarse)) { e.preventDefault(); submit(); }
}
```
- 한글 IME 조합 중 Enter 를 보내기로 처리하면 마지막 글자가 잘리거나 두 번 보내진다. `isComposing` 과 `keyCode 229` 를 둘 다 본다.
- 터치 기기의 Enter 는 줄바꿈이다.
- 빈 입력·오프라인이면 보내기 `aria-disabled`. 오프라인 초안은 IndexedDB(또는 localStorage)에 세션별로.
- 실행 중이면 보내기 자리를 멈추기로(`data-tk-stop` 대신 별도 버튼 렌더).
- 높이: `field-sizing: content` 를 먼저 쓰고, 지원하지 않으면 `scrollHeight` 로 맞춘다. 최대 `--tk-size-layout-composer-max`.

## 4. 렌더러 연결

| 렌더러 | 연결 |
|---|---|
| react-markdown | `<article className="tk-prose">`(뷰어) · `<div className="tk-prose tk-prose--compact">`(메시지). `remark-gfm` 으로 표·체크리스트. GFM alert 는 `.markdown-alert .markdown-alert-<kind>` + `.markdown-alert-title` 을 내는 플러그인이면 그대로 맞는다(플러그인 선택은 확인 필요). 코드 하이라이트는 Prism·highlight.js·Shiki(css-variables 테마) 클래스를 prose.css 가 이미 칠한다. 외부 테마 CSS 를 넣지 않는다 |
| Monaco | `import theme from '…/dist/monaco-theme.json'`; `monaco.editor.defineTheme('tk-ink-light', theme['tk-ink-light'])` · `'tk-ink-dark'`. 앱 테마 변화(`tk:themechange` 또는 상태)에 맞춰 `setTheme`. 루트에 `className="tk-code__monaco"`, `readOnly: true`, 글꼴은 `tokens.font.family.mono.value`, 크기 14 |
| PDF.js | 페이지마다 `<article className="tk-page tk-page--a4">` 안에 캔버스 + 텍스트 레이어. 화면 밖 페이지는 `data-pending` 으로 자리만(IntersectionObserver 로 그 근처만 렌더). 배율은 `.tk-desk` 의 `--tk-zoom` 과 PDF.js scale 을 같이 바꾼다 |
| XLSX·CSV | 파싱 결과를 `<table className="tk-cells">` 로. 행·열 머리는 `th`, 숫자는 `td[data-type="number"]`. 1,000행 넘으면 가상 스크롤 또는 `too-large` 상태 |
| HTML | `<iframe sandbox="" title="… 격리 미리보기" src="https://<별도 출처>/a/<id>">`. `srcdoc` 로 앱 출처에 넣지 않는다 |
| 이미지 | `<div className="tk-stage" style={{'--tk-zoom': z}}><img …/></div>` |

## 5. 라우팅·모바일 뷰어

- 영역 넷은 라우트(`/chat/:session`, `/workspace/:session`, `/library`, `/files`). 탭바·사이드바는 같은 라우트를 가리킨다.
- 결과물 열기: 데스크톱은 같은 라우트 안 분할 패널(`?artifact=<id>`), 모바일은 같은 쿼리로 전체 화면 `<dialog className="tk-viewer-dialog">`. 열 때 `history.pushState`, 닫을 때 `history.back()` → 브라우저·안드로이드 뒤로 가기가 뷰어를 닫는다.
- 결과물 URL 은 언제나 **Artifact ID**. 경로를 URL 에 넣지 않는다.

## 6. PWA

- manifest: `dist/pwa.json` 의 `name`·`short_name`·`theme_color`·`background_color`·`icons`(any + maskable)를 그대로. `display: "standalone"`, `start_url: "/chat"`.
- `<meta name="theme-color">` 두 줄(light #F4F4ED · dark #080705)은 `pwa.json` 의 `meta`.
- iOS: `apple-touch-icon-180.png`, `<meta name="apple-mobile-web-app-status-bar-style" content="default">`(확인 필요: black-translucent 는 safe-area 처리를 바꾼다).
- 키보드: 셸은 `100dvh`. iOS standalone 에서 키보드가 올라올 때 컴포저 위치는 기기 확인이 필요하다(확인 필요). 필요하면 `visualViewport` 높이로 `--tk-_vh` 를 갱신한다.
- 서비스 워커: 셸·CSS·글꼴·아이콘은 precache, 결과물 원본은 캐시하지 않는다(민감 자료가 기기에 남는다). 미리보기 캐시는 사용자가 고른 것만.

## 7. 확인 명령(소비 앱)

```bash
grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.{css,scss,tsx,ts,jsx}   # 0건(manifest·테스트 제외)
grep -rn "dark:" src                                                      # 0건
grep -rnE "z-index:\s*[0-9]" src                                          # 0건
```
결과 줄을 PR·응답에 붙인다.
