# notting

notting("Documents for humans, Markdown for tools, context for agents")의 디자인 시스템. 개발자용 문서 워크스페이스 — 블록 에디터, Markdown 왕복, 근거 있는 AI 답변, Context Pack, 이슈·ADR 까지 한 벌로 답한다.
**개발하다 막히면 [`docs/00-decision-guide.md`](docs/00-decision-guide.md) 를 연다.** 상황 → 토큰 → 값이 표로 있다. notting 개념(블록·근거·왕복·Pack)은 [`docs/15-product-mapping.md`](docs/15-product-mapping.md).

## 한눈에

| | |
|---|---|
| 주색 | Verdigris `#1EA896` (`teal.500`) · 액션·포커스는 `teal.600` `#0D8273` · 글자·링크는 `teal.700` `#01685C` |
| AI 색 | Soft Periwinkle `#9395D3` — AI 답변·근거 칩·Context Pack·관계 제안 **전용** |
| 위험·손실 | Vibrant Coral `#FF715B` (버튼 600, 글자 700) |
| 캔버스 | Floral White `#FBFBF2` (사이드바·패널) · 문서는 white · 잉크 `#0A0908` |
| 중립 | Warm Stone(hue 80) `neutral.50` 부터 `950` |
| 상태 | 성공 Leaf Green · 경고 Marigold `#E0A100` · 위험 Coral · 정보 Verdigris |
| 도메인 색 | `ai` `citation` `mark` `diff` `workflow`(이슈 6상태) `priority` `decision`(ADR) `fidelity`(왕복 등급) `code`(하이라이트) |
| 서체 | Pretendard Variable (UI·문서), JetBrains Mono (코드·경로·ID, 항상 로드) |
| 스케일 | 간격 4px 그리드 · 글자 11부터 60px 11단계 · 컨트롤 24/32/40/48/56 · radius 4/6/8/12/16/24 · 문서 본문 16px/1.7 |
| 레이아웃 | 사이드바 260 · 툴바 48 · 에디터 760(넓게 1080) · 패널 320 · 블록 gutter 32 |
| 다크모드 | 시맨틱 토큰이 자동 전환(따뜻한 잉크 다크). 컴포넌트에 `dark:` 없음 |
| 접근성 | 텍스트 4.5:1, 비텍스트 3:1 을 빌드가 210쌍 자동 검사(코드 하이라이트·근거 칩·도메인 필 포함) |

라이브 미리보기: [`examples/preview.html`](examples/preview.html) 을 브라우저로 열면 브랜드 자산부터 전 토큰, 컴포넌트, notting 패턴(에디터·Ask·보고서·보드)까지 라이트·다크로 한 번에 보인다. 온보딩·로그인·빈 상태·복구·가져오기 완성 화면은 [`examples/experience-templates.html`](examples/experience-templates.html)에 있다.

## 설치

토큰은 빌드된 `dist/` 만 가져가면 된다.

### 1) CSS 변수 (어느 스택이든)
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/jetbrains-mono@5/index.min.css" />
<link rel="stylesheet" href="/vendor/notting/tokens.css" />
<link rel="stylesheet" href="/vendor/notting/typography.css" />
<link rel="stylesheet" href="/vendor/notting/prose.css" />
```
```css
.sidebar { background: var(--nt-color-surface-canvas); }
.editor  { max-width: var(--nt-size-layout-editor); background: var(--nt-color-surface-default); }
.btn-ai  { background: var(--nt-color-action-ai-bg); color: var(--nt-color-action-ai-text); }
```
```html
<article class="nt-doc"> <!-- 에디터 출력·읽기 모드·Ask 답변 본문 --> … </article>
```

### 2) Tailwind
```js
// tailwind.config.js
module.exports = { presets: [require('./vendor/notting/tailwind.preset.cjs')], /* content… */ };
```
`tokens.css`·`prose.css` 는 여전히 로드한다(색이 CSS 변수를 가리킨다).
```html
<button class="h-control-sm px-3 rounded-md bg-action-ai-bg text-action-ai-text hover:bg-action-ai-bg-hover">물어보기</button>
<span class="bg-workflow-done-bg text-workflow-done-text rounded-full">Done</span>
<a class="bg-citation-bg text-citation-text rounded-xs">1</a>
```

### 3) JS / TS
```ts
import { tokens } from './vendor/notting/tokens.js';
tokens.color.ai.bg.var                  // 'var(--nt-color-ai-bg)'  ← 스타일에는 이것
tokens.color.fidelity.dropped.text.value // '#8F3B2E' (라이트 raw)
tokens.color.fidelity.dropped.text.dark  // '#FDAA9B'
tokens.typography['prose-body'].value    // { fontFamily, fontSize, fontWeight, lineHeight: 1.7, letterSpacing }
```

### 4) 가져오는 방법
- **git submodule**: `git submodule add https://github.com/winterholic/winterholic-design-system.git vendor/wds` 후 `vendor/wds/notting/dist` 참조.
- **복사**: `dist/` 폴더만 복사. 태그(`notting-vX.Y.Z`)를 README 에 적어 둔다.
- Figma: `dist/tokens.figma.json` 을 Tokens Studio 로 import.

## 문서 지도

| 문서 | 내용 | 이럴 때 |
|---|---|---|
| [00 결정 가이드](docs/00-decision-guide.md) | 상황별 토큰 정답표 | **막혔을 때 첫 번째** |
| [01 색](docs/01-color.md) | 팔레트 선정 이유(후보 7개 비교), 3계층, 시맨틱 + 도메인 그룹 9종, 조합 규칙 | "여기 무슨 색?" |
| [02 타이포](docs/02-typography.md) | UI 스타일 22종 + 문서 스타일 7종, 한글·코드 조판 | 글자 크기·굵기 |
| [03 간격·레이아웃](docs/03-spacing-layout.md) | 4px 그리드, 3열 앱 셸, 에디터 컬럼, 브레이크포인트별 동작 | 여백·화면 골격 |
| [04 모양·깊이](docs/04-shape-elevation.md) | radius, 테두리(marker 3px), 그림자(ai 글로우), 그라데이션(context) | 둥글기·그림자 |
| [05 모션](docs/05-motion.md) | duration(flash·stream-caret), easing, 에디터 안 모션 절제 | 애니메이션 |
| [06 컴포넌트](docs/06-components.md) | 범용 16종 + notting 17종(에디터·블록·슬래시·팔레트·트리·툴바·패널·속성·필·근거·답변·Pack·보고서·diff·검색·이슈·revision) | 컴포넌트 규격 |
| [07 상태·피드백](docs/07-states-feedback.md) | 로딩·빈·오류 + 오프라인·충돌·근거 부족·부분 손실, 문구 | 데이터 없을 때, 실패했을 때 |
| [08 접근성](docs/08-accessibility.md) | 대비·포커스·에디터 접근성·드래그 대안·스트리밍 | 출시 전 |
| [09 다크모드](docs/09-dark-mode.md) | 따뜻한 잉크 다크 매핑 | 다크가 이상할 때 |
| [10 아이콘·이미지](docs/10-iconography-imagery.md) | Lucide, notting 매핑표(상태·등급·AI), 로고, 커버 | 아이콘 고를 때 |
| [11 데이터 시각화](docs/11-data-viz.md) | 이슈 통계·검색 평가·왕복 통계 | 차트 |
| [12 페이지 패턴](docs/12-page-patterns.md) | 앱 셸·편집·Ask·가져오기·내보내기·검색·이슈·ADR·비교·Pack·설정·온보딩·로그인·랜딩·오류 | 새 화면 시작 |
| [13 운영](docs/13-governance.md) | 파일 구조, 변경 절차, 도메인 그룹 추가법, 버전, 채택 기준 | 토큰 추가·수정 |
| [14 브랜드 자산](docs/14-brand-assets.md) | 잉크 타일 + 근거 마커 심볼, 락업, 파비콘, 히어로 | 브랜딩 |
| [15 제품 매핑](docs/15-product-mapping.md) | 기획서(initial-plan.md) 개념 → UI 규격 대조표 | **notting 개념이 화면에서 뭐가 되는지** |
| [16 상황 사전](docs/16-situations.md) | A~J 범용 + K 에디터 · L 왕복 · M AI·근거 · N 이슈·revision | 상황이 애매할 때 |
| [17 경험 템플릿](docs/17-experience-templates.md) | 온보딩·인증·빈 상태·복구·가져오기 완성 화면과 조립 규칙 | 화면을 바로 구현할 때 |
| [CLAUDE.md](CLAUDE.md) | AI 에이전트용 규칙 요약 | Claude 로 UI 만들 때 |

## 토큰 수정

```bash
# tokens/src/*.json 편집 후
node tokens/build.mjs
# → tokens.json, dist/* 재생성. 참조 오류·라이트/다크 불일치·대비 미달이면 실패
```
절차와 규칙: [13 운영](docs/13-governance.md).

## 원칙 여섯 줄

1. 화면 코드에 hex·px 를 쓰지 않는다. 토큰만.
2. 시맨틱 토큰을 쓴다. 원시는 장식 예외만.
3. **periwinkle 은 AI 가 만든 것에만.** 사람 것과 색으로 가른다.
4. **손실을 숨기지 않는다.** 변환에는 보고서, 근거 없는 답은 중립 면.
5. 결정은 한 번만. 표에 있으면 그대로, 없으면 표에 추가.
6. 상태 6종 + 화면 상태(로딩·빈·오류·오프라인·충돌·읽기 전용)는 항상 설계한다. 접근성은 빌드가 막고 규격이 요구한다.
