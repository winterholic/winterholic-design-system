# stock-gosu design system

`C:\stock-gosu\front` 투자 대시보드의 디자인 시스템. 기존 FDS(`global.css` 토큰 + `finance-design-system.html`)를 winterholic-base 와 같은 구조로 옮기고, 빠져 있던 것(다크 모드·대비 검사·차트 색 단일 소스·금융 전용 토큰)을 보완했다.
**막히면 [`docs/00-decision-guide.md`](docs/00-decision-guide.md)**, 기존 시스템과 무엇이 달라졌는지는 [`docs/15-audit-and-migration.md`](docs/15-audit-and-migration.md).

## 한눈에
| | |
|---|---|
| 주색 | Toss Blue `#3182F6` (`blue.500`). 글자·링크는 `blue.700`, 엄격 액션은 `blue.600` |
| 등락 | 상승 빨강 `#F04452` · 하락 파랑 `#3182F6` · 보합 회색. 글자용은 600, 큰 숫자·차트는 500. `data-market="us"` 로 반전 |
| 캔버스 | `#F2F4F6` 회색 위 흰 카드 |
| 서체 | Pretendard. 13/15/17 본문, 가격 28/800 tabular |
| 스케일 | 4px 그리드(2·6·10·14 포함) · 컨트롤 28/36/44/52 · radius 4~24, 카드 20 |
| 다크 | 새로 추가. 시맨틱 자동, 차트는 `dist/chart-theme.ts` 두 벌 |
| 접근성 | 빌드가 106쌍 대비 검사. 캔버스 위 글자 규칙 |
| 차트 | 시리즈 8색 고정, MA·캔들·히트맵·스파크라인 토큰, recharts 헬퍼 |
| 이관 | `dist/legacy-aliases.css` 로 기존 변수명 그대로 동작하며 단계적 전환 |

미리보기: [`examples/preview.html`](examples/preview.html).

## 설치 (front 기준)
```html
<link rel="stylesheet" href="/vendor/stock-gosu/tokens.css" />
<link rel="stylesheet" href="/vendor/stock-gosu/typography.css" />
<link rel="stylesheet" href="/vendor/stock-gosu/legacy-aliases.css" />  <!-- 이관 중에만 -->
```
```ts
import { currentChartTheme, axisProps, gridProps, seriesColor } from '/vendor/stock-gosu/chart-theme';
```
Tailwind 프리셋·JS 토큰·SCSS·Figma 는 base README 와 같은 방식(`dist/`).

## 문서 지도
| 문서 | 내용 |
|---|---|
| [00 결정 가이드](docs/00-decision-guide.md) | 상황별 토큰 정답표. 등락 §1 |
| [01 색](docs/01-color.md) | Toss 팔레트 유지 이유, 등락색 text/solid 이원화, 빨강 충돌 규칙, 미국식 반전 |
| [02 타이포](docs/02-typography.md) | 13/15/17 스케일, 가격 스타일, 숫자·통화 표기 |
| [03 간격·레이아웃](docs/03-spacing-layout.md) | 촘촘한 4px 단계, 1180 컨테이너, 앱 셸·종목 리스트·상세·차트 골격 |
| [04 모양·깊이](docs/04-shape-elevation.md) | radius 20 카드, 그림자 1~4 매핑, 그라데이션 5곳 |
| [05 모션](docs/05-motion.md) | 150/250/400, 시세 플래시, 차트 갱신 규칙 |
| [06 컴포넌트](docs/06-components.md) | 버튼·인풋·검색·금액·카드·종목 행·가격 셀·배지·세그먼트·탭바·시트·표·KPI |
| [07 상태·피드백](docs/07-states-feedback.md) | 장 마감·지연·집계 전, 빈 상태 문구, 확인, 금융 보이스 |
| [08 접근성](docs/08-accessibility.md) | 색 이외 신호, 등락 aria, 차트 표 대안 |
| [09 다크모드](docs/09-dark-mode.md) | 매핑 원리, 차트 다크, 확인 사항 |
| [10 아이콘·이미지](docs/10-iconography-imagery.md) | Lucide 매핑, 등락 화살표, 종목 로고 |
| [11 데이터 시각화](docs/11-data-viz.md) | 시리즈·MA·캔들·히트맵, 금융 차트 규칙, recharts 예시 |
| [12 페이지 패턴](docs/12-page-patterns.md) | 홈·목록·상세·기술차트·시장·자산·뉴스·설정·로그인·온보딩 |
| [13 운영](docs/13-governance.md) | 변경 절차, 채택 기준, 결정 기록 |
| [14 브랜드 자산](docs/14-brand-assets.md) | 파랑새 로고 규칙, 보완 목록 |
| [15 점검·이관](docs/15-audit-and-migration.md) | 기존 FDS 점검 27항목, 5단계 이관, 변수 대응표 |
| [CLAUDE.md](CLAUDE.md) | AI 에이전트 규칙 |

## 토큰 수정
```bash
node tokens/build.mjs   # 참조·라이트/다크·대비 검사 후 dist/ 10개 재생성
```
