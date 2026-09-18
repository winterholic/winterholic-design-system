# winterholic-base

winterholic 의 기본 디자인 시스템. 개인 프로젝트 대부분이 이걸 그대로 쓴다.
**개발하다 막히면 [`docs/00-decision-guide.md`](docs/00-decision-guide.md) 를 연다.** 상황 → 토큰 → 값이 표로 있다.

## 한눈에

| | |
|---|---|
| 주색 | Steel Blue `#2081C3` (`blue.500`) · 액션은 `blue.600` `#1A76B4` |
| 심색 | Twilight Indigo `#1D2F6F` |
| 강조 | Frozen Lake `#63D2FF` · Pearl Aqua `#78D5D7` |
| 캔버스 | Bright Snow `#F7F9F9` |
| 중립 | 쿨 슬레이트 `neutral.50` 부터 `950` |
| 상태 | 성공 green · 경고 amber(`#FAC748`) · 위험 red(`#CE2D4F`) · 정보 blue |
| 서체 | Pretendard Variable (본문·제목), JetBrains Mono (코드) |
| 스케일 | 간격 4px 그리드 · 글자 11부터 60px 11단계 · 컨트롤 24/32/40/48/56 · radius 4/6/8/12/16/24 |
| 다크모드 | 시맨틱 토큰이 자동 전환. 컴포넌트에 `dark:` 분기 없음 |
| 접근성 | 텍스트 4.5:1, 비텍스트 3:1 을 빌드가 86쌍 자동 검사 |

라이브 미리보기: [`examples/preview.html`](examples/preview.html) 을 브라우저로 열면 브랜드 자산부터 전 토큰과 컴포넌트 예시까지 라이트·다크로 한 번에 보인다.

## 설치

토큰은 빌드된 `dist/` 만 가져가면 된다.

### 1) CSS 변수 (어느 스택이든)
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
<link rel="stylesheet" href="/vendor/winterholic-base/tokens.css" />
<link rel="stylesheet" href="/vendor/winterholic-base/typography.css" />
```
```css
.card { background: var(--wh-color-surface-default); border-radius: var(--wh-radius-lg); padding: var(--wh-space-5); }
```

### 2) Tailwind
```js
// tailwind.config.js
module.exports = { presets: [require('./vendor/winterholic-base/tailwind.preset.cjs')], /* content… */ };
```
`tokens.css` 는 여전히 로드해야 한다(색이 CSS 변수를 가리킨다). 그 덕에 `dark:` 없이 다크가 된다.
```html
<button class="h-control-md px-4 rounded-md bg-action-primary-bg text-action-primary-text hover:bg-action-primary-bg-hover">저장</button>
```

### 3) JS / TS (CSS-in-JS, 계산이 필요할 때)
```ts
import { tokens } from './vendor/winterholic-base/tokens.js';
tokens.color.action.primary.bg.var    // 'var(--wh-color-action-primary-bg)'  ← 스타일에는 이것
tokens.color.action.primary.bg.value  // '#1A76B4' (라이트 raw)
tokens.color.action.primary.bg.dark   // '#69ADE5'
tokens.typography['heading-1'].value  // { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
```

### 4) 가져오는 방법
- **git submodule**: `git submodule add https://github.com/winterholic/winterholic-design-system.git vendor/wds` 후 `vendor/wds/winterholic-base/dist` 참조.
- **복사**: `dist/` 폴더만 프로젝트에 복사. 태그(`base-vX.Y.Z`)를 README 에 적어 둔다.
- Figma: `dist/tokens.figma.json` 을 Tokens Studio 플러그인으로 import.

## 문서 지도

| 문서 | 내용 | 이럴 때 |
|---|---|---|
| [00 결정 가이드](docs/00-decision-guide.md) | 상황별 토큰 정답표 | **막혔을 때 첫 번째** |
| [01 색](docs/01-color.md) | 팔레트 선정 이유, 3계층, 시맨틱 역할, 조합 규칙 | "여기 무슨 색?" |
| [02 타이포](docs/02-typography.md) | 서체·스케일·굵기·행간·텍스트 스타일 20종·한글 조판 | 글자 크기·굵기 |
| [03 간격·레이아웃](docs/03-spacing-layout.md) | 4px 그리드, 컨테이너, gutter, 브레이크포인트, 레이아웃 공식 | 여백·화면 골격 |
| [04 모양·깊이](docs/04-shape-elevation.md) | radius, 테두리, 그림자, 그라데이션 | 둥글기·그림자·그라데이션 |
| [05 모션](docs/05-motion.md) | duration, easing, 진입·퇴장 규격 | 애니메이션 |
| [06 컴포넌트](docs/06-components.md) | 버튼·인풋·카드·모달·표·탭 등 15종 규격 + 조립 규칙 | 컴포넌트 크기·상태 |
| [07 상태·피드백](docs/07-states-feedback.md) | 로딩·빈·오류·확인·성공·문구 | 데이터 없을 때, 실패했을 때 |
| [08 접근성](docs/08-accessibility.md) | 대비·포커스·키보드·시맨틱·체크리스트 | 출시 전 |
| [09 다크모드](docs/09-dark-mode.md) | 동작 방식, 매핑 원리, 확인 사항 | 다크가 이상할 때 |
| [10 아이콘·이미지](docs/10-iconography-imagery.md) | Lucide, 크기, 매핑표, 로고, 이미지 규칙 | 아이콘 고를 때 |
| [11 데이터 시각화](docs/11-data-viz.md) | 차트 색·종류·규격·KPI 타일 | 차트·대시보드 |
| [12 페이지 패턴](docs/12-page-patterns.md) | 로그인·대시보드·목록·상세·폼·설정·랜딩 골격 | 새 화면 시작 |
| [13 운영](docs/13-governance.md) | 파일 구조, 토큰 변경 절차, 이름 규칙, 버전, 채택 기준 | 토큰 추가·수정 |
| [14 브랜드 자산](docs/14-brand-assets.md) | 로고·파비콘·얼음 결정·윈티 캐릭터·브랜드 이미지 | 브랜딩·메타 이미지 |
| [CLAUDE.md](CLAUDE.md) | AI 에이전트용 규칙 요약 | Claude 로 UI 만들 때 |

## 토큰 수정

```bash
# tokens/src/*.json 편집 후
node tokens/build.mjs
# → tokens.json, dist/* 재생성. 참조 오류·라이트/다크 불일치·대비 미달이면 실패
```
절차와 규칙: [13 운영](docs/13-governance.md).

## 원칙 다섯 줄

1. 화면 코드에 hex·px 를 쓰지 않는다. 토큰만.
2. 시맨틱 토큰(`color.text.primary`)을 쓴다. 원시(`blue.500`)는 장식 예외만.
3. 결정은 한 번만 한다. 표에 있으면 그대로, 없으면 표에 추가한다.
4. 상태 6종(default·hover·active·focus·disabled·loading)과 화면 상태(로딩·빈·오류)는 항상 설계한다.
5. 접근성은 나중이 아니다. 빌드가 대비를 막고, 컴포넌트 규격이 포커스·키보드를 요구한다.
