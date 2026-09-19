# 09 · 다크 모드 (stock-gosu)

기존 stock-gosu 에는 다크 모드가 없었다. 투자 앱은 장 마감 후·야간 사용이 많고 차트 위주 화면은 어두운 배경에서 눈이 편하다. 이 시스템이 새로 추가한 가장 큰 항목이다.

## 1. 동작 방식
`dist/tokens.css` 하나로 세 가지 모드를 지원한다.

| 상황 | 결과 |
|---|---|
| 아무 설정 없음 | 시스템 설정(`prefers-color-scheme`)을 따른다 |
| `<html data-theme="dark">` | 항상 다크 |
| `<html data-theme="light">` | 항상 라이트 |

```html
<!-- 깜빡임 방지: head 최상단 인라인. 설정 화면의 세그먼트(시스템/라이트/다크)가 localStorage 에 저장 -->
<script>try{const t=localStorage.getItem('sg-theme');if(t)document.documentElement.dataset.theme=t;}catch{}</script>
```
`:root` 에 `color-scheme: light dark` 가 걸려 있어 스크롤바·네이티브 셀렉트·체크박스 기본색도 따라온다. React 에서는 테마 변경 시 `document.documentElement.dataset.theme` 만 바꾸면 CSS 가 처리한다. 차트만 §4.

## 2. 컴포넌트가 할 일: 없음
시맨틱 토큰만 썼다면 다크는 자동이다. `dark:` 접두사, `@media (prefers-color-scheme)` 분기를 컴포넌트에 쓰지 않는다. 다크 분기가 생겼다면 둘 중 하나:
- 원시색(`--blue-500`, `--gray-100`)이나 hex 를 직접 썼다 → 시맨틱으로.
- 시맨틱 토큰이 부족하다 → `color.dark.json` 에 추가(라이트도 같은 경로, 빌드가 검사).

`legacy-aliases.css` 를 로드하면 기존 `--blue-500`·`--text-primary` 를 쓰는 화면도 다크가 된다(별칭이 `--sg-*` 를 가리킴). 단 **원시 별칭을 배경으로 쓴 곳**(`--gray-100` 카드 안 구획 등)은 다크에서 밝게 남는다 → 15 이관 표.

## 3. 매핑 원리 — 밝기 반전이 아니라 의미 재매핑
| 축 | 라이트 | 다크 | 이유 |
|---|---|---|---|
| 면 쌓기 | canvas gray.100 → default white → raised white+shadow | canvas #111418 → default #191F28 → raised #333D4B | 어두운 곳에서 그림자는 안 보여 **위로 올라올수록 밝게** |
| sunken | gray.50 / gray.100 | #14181D / #111418 | 카드보다 더 어둡게(눌린 면) |
| 주 버튼 | blue.500 + 흰 글자 | **blue.400 + gray.950 글자** | 흰 글자는 어떤 파랑 위에서도 AA 미달. 밝은 파랑 + 어두운 글자가 더 잘 읽힘 |
| 위험 버튼 | red.600 + 흰 | red.400 + gray.950 | 같은 이유 |
| 브랜드 글자·링크 | blue.700 | blue.300 #64A8FF | |
| 등락 글자 | red.600 / blue.600 | red.400 #FD7678 / blue.300 #64A8FF | 어두운 면에서 밝은 색이 읽힌다(6:1 이상) |
| 등락 큰 숫자·차트·캔들 | red.500 / blue.500 | red.400 / blue.300 | 글자와 같은 값(다크에선 구분 불필요) |
| 등락 배지 | 50 배경 + 700 글자 | 950 배경 + 300/200 글자 | 채도 유지, 명도만 |
| 상태 배너 | 50 + 600/700 | 950 + 300/400 | |
| 상태 배지(solid) | 600 + 흰 | 400 + 950 | |
| 차트 시리즈 | 원본 8색 | 밝은 8색 | 어두운 배경에서 남색·진초록이 죽는다 |
| 격자·축·기준선 | gray.200 / 500 / 400 | gray.800 / 500 / 600 | |
| 차트 툴팁 | 흰 96% | #191F28 96% | |
| 그림자 | 남색 4~16% | 검정 20~60% + 테두리 | alpha 를 올려야 보인다 |
| hover 덧칠 | 어둡게 4% | 밝게 6% | 면이 밝아지는 방향이 반응 |
| 포커스 링 | blue.500 | blue.300 | 어두운 배경에서 3:1 |
| 시장 태그 | blue.50 + blue.700 | blue.950 + blue.300 | |
| 플래시 | 500 @15% | 400/300 @20% | |
| 스크림 | 900 @50% | 검정 @60% | |

## 4. 차트 (다크의 핵심)
recharts 는 SVG `fill`/`stroke` 에 CSS 변수를 못 쓴다. `dist/chart-theme.ts` 가 라이트·다크 두 벌 raw 값을 내보낸다.
```ts
import { currentChartTheme, axisProps, gridProps } from '…/stock-gosu/dist/chart-theme';
const [theme, setTheme] = useState(currentChartTheme());
useEffect(() => {
  const mo = new MutationObserver(() => setTheme(currentChartTheme()));
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = matchMedia('(prefers-color-scheme: dark)'); const on = () => setTheme(currentChartTheme());
  mq.addEventListener('change', on);
  return () => { mo.disconnect(); mq.removeEventListener('change', on); };
}, []);
<Line stroke={theme.finance.up.solid} /> <CartesianGrid {...gridProps(theme)} /> <XAxis {...axisProps(theme)} />
```
- 캔들·거래량: `theme.candle.*` (거래량 alpha 50% 유지).
- 히트맵: `theme.heat.*` 다크에서 950→400 재배치. 셀 글자는 밝기에 따라 white/gray.950(11 §3).
- 툴팁 DOM 은 CSS 변수(`component.chart-tooltip.*`)라 자동.
- 라이트 hex 를 하드코딩한 차트는 다크에서 그대로 남는다 → 기존 `chartTheme.ts` 를 이 파일로 교체하는 것이 이관의 핵심(15 §3 1단계).

## 5. 다크에서 특히 확인할 것
- **순백 면**: 종목 로고 배경·뉴스 썸네일 플레이스홀더·OG 이미지 흰 배경 → `surface.default` 카드 안 + 원형 마스크·radius.
- **채도 높은 큰 면**: `surface.brand` 가 다크에선 blue.800. 온보딩 `gradient.brand` 는 원시 참조라 그대로 → 다크 온보딩은 `surface.brand` 단색.
- **`gradient.sky`·`fade-right`**: 원시 참조라 밝게 남음 → `surface.default` 단색 / `linear-gradient(90deg, transparent, var(--sg-color-surface-default))`.
- **코드·API 응답 블록**: `surface.sunken-strong` 이 #111418 로 캔버스와 같아짐 → 카드(#191F28) 안에서만 쓴다.
- **스켈레톤**: `sunken-strong` 이 카드 위에서 보이는지(#111418 on #191F28 — 보인다).
- **이미지·일러스트**: `filter: brightness(0.9)`. 사진은 그대로.
- **하단 탭바 글래스**: `surface.default` 92% + blur 가 다크에서도 콘텐츠와 구분되는지(위 `border.default` + `shadow.sticky` 가 보장).
- **상태 alpha 값**(hover-overlay 등)은 라이트=검정 계열, 다크=흰 계열로 갈라져 있다.

## 6. 검증
- 빌드가 다크 시맨틱 조합의 대비를 라이트와 같은 기준으로 검사(`contrast-report.json` mode=dark).
- `data-theme="dark"` 강제 후: ① 순백 면 ② 그림자만으로 구분된 모달·드롭다운 ③ 남아 있는 hex(`grep -rnE "#[0-9a-fA-F]{6}" src --include=*.tsx | grep -v chart-theme`) ④ 차트 시리즈·캔들 색이 바뀌는지 ⑤ 등락 배지 글자 읽히는지 ⑥ 원시 별칭 배경(`var(--gray-`) 잔존.

## 7. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `dark:bg-gray-800` 컴포넌트마다 | `bg-surface-default` 하나 |
| 다크 = 라이트 `invert()` | 시맨틱 재매핑 |
| 다크 카드에 라이트와 같은 그림자만 | 그림자 + `border.default` |
| 다크에서 blue.500 버튼 + 흰 글자 | 토큰 그대로(blue.400 + 950) |
| chartTheme.ts 라이트 hex 유지 | `dist/chart-theme.ts` `currentChartTheme()` |
| 다크 온보딩에 `gradient.brand` | `surface.brand` 단색 |
| `--gray-100` 배경 별칭 유지 | `surface.sunken-strong` |
| 다크에서 `#fff` 로고 박스 | 투명 배경 로고 + `surface.default` |
