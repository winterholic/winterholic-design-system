# AIP Design System

AIP(Application Intent Protocol) 생태계 전체가 공유하는 디자인 시스템. 공식 홈페이지 · Documentation · MakeAIP · Playground · 아키텍처/명세 시각화가 같은 토큰과 컴포넌트를 쓴다.
**개발하다 막히면 [`docs/00-decision-guide.md`](docs/00-decision-guide.md)를 연다.** 상황 → 토큰 → 값이 표로 있다. 상황이 애매하면 [`docs/16-situations.md`](docs/16-situations.md).

> 방향: **제도 용지 위의 청사진.** 흰 종이와 Charcoal 잉크 위에서 AIP Blue 가 행동과 AIP 자체를, 노란 형광펜이 '선언된 의도'를, 탱저린이 '서버가 지키는 경계'를 말한다. 코드는 두 테마 모두 Slate 의 어두운 면이다. 그라데이션·글로우·보라 네온은 없다.

## 한눈에

| | |
|---|---|
| Brand Palette | Blue `#1C77C3` · Tangerine `#FAA381` · Yellow `#F5E663` · Charcoal `#3D3B30` · Slate `#4D5061` |
| 역할 | Blue = 주 행동·링크·활성·Runtime / Yellow = 형광펜·Important·Example·Intent / Tangerine = 경고·Permission / Charcoal = 본문 글자 / Slate = 코드 면·Data |
| 파생 | OKLCH 램프 7종(5색 + 보강 red·green) → 시맨틱 토큰. 화면은 시맨틱만 쓴다 |
| 서체 | Pretendard(본문·UI·제목) + JetBrains Mono(코드·식별자, 리거처 끔) |
| 스케일 | 4px 간격 · 글자 12~60px(하한 12) · 컨트롤 24/32/40/48 · radius 2/4/6/8/12/16 · 문서 본문 16/1.7 · 본문 열 720 |
| 레이아웃 | 헤더 56/64 · 문서 사이드바 272 · TOC 224 · MakeAIP 설정 560 |
| 다크 | Charcoal 계열 따뜻한 어둠. AIP Blue·Yellow 는 두 테마 같은 값. 컴포넌트에 `dark:` 없음 |
| 컴포넌트 | **구현 포함**: `dist/components.css` + `dist/aip.js`(키보드·복사·다이얼로그·메뉴·툴팁·TOC·검색·테마). core 19 + 문서 15 + 앱 조각 + 프레젠테이션 부품 |
| 접근성 | 대비 312쌍(라이트·다크)을 빌드가 검사, 컴포넌트 CSS 에 하드코딩 값이 있으면 빌드 실패, 키보드 동작 검사 스크립트 |
| AI 친화 | 시맨틱 HTML 계약, GFM alert 이름의 콜아웃, Shiki·Prism·hljs 연결, Mermaid classDef 생성, `CLAUDE.md` |

미리보기: [`examples/preview.html`](examples/preview.html)(전 토큰·컴포넌트, 라이트·다크). 제품 템플릿: [`home`](examples/home.html) · [`docs`](examples/docs.html) · [`makeaip`](examples/makeaip.html) · [`playground`](examples/playground.html). 프레젠테이션: **[`showcase`](examples/showcase.html)** · [`architecture`](examples/architecture.html) · [`case-study`](examples/case-study.html).

## 설치

UI는 `dist/`를 가져간다. 로고·3D 이미지·캐릭터를 쓰면 필요한 `assets/brand/`도 앱의 정적 자산 경로로 복사한다.

```html
<script>try{var t=localStorage.getItem('aip-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/jetbrains-mono@5/index.min.css">
<link rel="stylesheet" href="/vendor/aip/tokens.css">
<link rel="stylesheet" href="/vendor/aip/typography.css">
<link rel="stylesheet" href="/vendor/aip/components.css">
<link rel="stylesheet" href="/vendor/aip/prose.css">      <!-- 문서 본문(.aip-doc)이 있는 제품만 -->
<script src="/vendor/aip/aip.js" defer></script>
```

```html
<button class="aip-button aip-button--primary" type="submit">Generate</button>
<article class="aip-doc"><!-- Markdown 렌더 결과 그대로 --></article>
```

### Tailwind
```js
module.exports = { presets: [require('./vendor/aip/tailwind.preset.cjs')] };   // tokens.css 는 계속 로드
```
`bg-action-primary-bg text-action-primary-text rounded-md h-control-md` 처럼 쓴다. 색은 CSS 변수를 가리켜 다크가 자동이다.

### JS / TS
```ts
import { tokens } from './vendor/aip/tokens.js';
tokens.color.code.bg.var        // 'var(--aip-color-code-bg)'
tokens.color.code.bg.value      // '#2D2F3C'   (라이트)
tokens.color.code.bg.dark       // '#12131C'
```

### 그 밖의 산출물
`tokens.scss` · `tokens.figma.json`(Tokens Studio) · `tokens.global.js`(`window.AIP_TOKENS`) · `diagram.mermaid.json`(Mermaid 테마·classDef) · `contrast-report.json`.

가져오는 법: `git submodule add https://github.com/winterholic/winterholic-design-system.git vendor/wds` 후 `vendor/wds/aip/dist`, 또는 `dist/` 복사(태그 `aip-vX.Y.Z` 를 적어 둔다).

## 문서 지도

| 문서 | 내용 | 이럴 때 |
|---|---|---|
| [00 결정 가이드](docs/00-decision-guide.md) | 상황별 정답표 | **막혔을 때 첫 번째** |
| [01 색](docs/01-color.md) | Brand 5색의 역할, 램프 7종, 시맨틱, 코드 색, 조합 규칙 | "여기 무슨 색?" |
| [02 타이포](docs/02-typography.md) | 마케팅·문서·UI·코드 네 묶음 26 스타일, 문서 리듬 | 글자 |
| [03 간격·레이아웃](docs/03-spacing-layout.md) | 4px, 레이아웃 원시 요소, 브레이크포인트별 제품 셸 | 여백·골격 |
| [04 모양·깊이](docs/04-shape-elevation.md) | radius, 선, 그림자, 점 격자 | 둥글기·그림자 |
| [05 모션](docs/05-motion.md) | duration·easing, 모션 축소 | 애니메이션 |
| [06 컴포넌트](docs/06-components.md) | core 19종 마크업 계약·변형·상태·접근성 | 컴포넌트 |
| [07 문서 컴포넌트](docs/07-documentation.md) | AI 가 읽기 쉬운 문서 계약, Prose, Code Block/Tabs, Spec, Example, Params, Reference, Search | Docs 화면 |
| [08 상태·피드백](docs/08-states-feedback.md) | 로딩·빈·오류·성공·권한 거부 | 데이터 없을 때·실패 |
| [09 접근성](docs/09-accessibility.md) | 기계가 막는 것과 사람이 볼 것, 키보드 표 | 출시 전 |
| [10 다크모드](docs/10-dark-mode.md) | 재배치 원칙, 매핑, 깜빡임 방지 | 다크가 이상할 때 |
| [11 아이콘·이미지](docs/11-iconography-imagery.md) | Lucide 1.75, 의미 고정 매핑 | 아이콘 |
| [12 다이어그램](docs/12-diagrams.md) | 색=개념·모양=종류·선=흐름, Flow·SVG·Mermaid | 구조 그림 |
| [13 페이지 패턴](docs/13-page-patterns.md) | 홈·Docs(유형별)·MakeAIP·Playground·오류 | 새 화면 |
| [14 운영](docs/14-governance.md) | 파일 구조, 변경 절차, 이름 규칙, 버전, 채택 기준, 한계 | 토큰·컴포넌트 추가 |
| [15 브랜드 자산](docs/15-brand-assets.md) | 심볼·락업·파비콘·히어로·3D 2종·Aipi 캐릭터·전체 제작 프롬프트 | 브랜딩 |
| [16 상황 사전](docs/16-situations.md) | A~M 상황별 답 | 애매할 때 |
| [17 제품 매핑](docs/17-product-mapping.md) | AIP 약속·개념·제품 → 시각 규칙 | AIP 개념이 화면에서 뭐가 되나 |
| [18 설계 검토](docs/18-design-review.md) | 결정·대안·렌더 검토에서 고친 것 | 왜 이렇게 됐나 |
| [19 프레젠테이션](docs/19-presentation.md) | Showcase·Architecture·Case Study, Hero·Chapter·Comparison·Proof·설계 선택·진행 과정 | 오픈소스 소개·기술 포트폴리오 |
| [CLAUDE.md](CLAUDE.md) | AI 에이전트 규칙 요약 | AI 로 UI 를 만들 때 |

## 빌드·검사

```bash
npm run build      # = node tokens/build.mjs. 참조·라이트/다크·대비 312쌍·컴포넌트 lint 실패 시 중단
npm test           # 토큰·컴포넌트·문서·예제 정적 검사 + 브랜드 자산 검사(Python+Pillow 필요)
npm run check:ui   # 실제 Chrome 으로 키보드·복사·가로 넘침 검사(playwright-core 필요)
npm run brand      # 브랜드 자산 재생성(Python+Pillow)
```

## 원칙 여섯 줄

1. 화면 코드에 hex·px 를 쓰지 않는다. 토큰과 컴포넌트만.
2. 기본값이 정답이다. 클래스 하나가 가장 흔한 경우다.
3. 노랑은 강조, 탱저린은 경고, 빨강은 위험, 파랑은 AIP.
4. 문서는 종이, 코드는 Slate.
5. 구조는 시맨틱 HTML 이 말한다. 사람과 AI 가 같은 구조를 읽는다.
6. 결정은 한 번만. 표에 있으면 그대로, 없으면 표에 추가한다.
