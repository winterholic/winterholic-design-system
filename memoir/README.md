# memoir design system

`C:\mydevelop\memoir\memoir-frontend`(Next.js 14 + Tailwind) 개인 메모·보안 관리 서비스의 디자인 시스템. 기획서 §5, `design-guide.md`(Digital Editorial), `tailwind.config.ts` 세 곳에 흩어진 규칙을 winterholic-base 구조로 합치고, 어긋난 것(핑크 버튼 대비·테두리·그림자·순백 캔버스)을 바로잡고, 없던 것(다크·컴포넌트 규격·카테고리별 카드·보안 상태)을 채웠다.
**막히면 [`docs/00-decision-guide.md`](docs/00-decision-guide.md)**, 기존과 뭐가 다른지는 [`docs/15-audit-and-migration.md`](docs/15-audit-and-migration.md).

## 한눈에
| | |
|---|---|
| 원칙 | **선 대신 면(No-Line)** · **파랗다 = 클릭 가능** · **핑크는 강조, 로즈는 액션** |
| 종이 층 | canvas `#FFF9F8` → zone `#FFF0EE` → card `#FFFFFF`. 테두리·그림자 없이 밝기 차이로 구획 |
| 글자 | 따뜻한 검정 `#231917` (순검정 금지) |
| 액션 | 로즈 `#A1385E` + 흰 글자. 핑크 `#FF82A9` 는 활성 칩·히트맵·로고만(글자·버튼 배경 금지, 대비 2.33) |
| 상호작용 | 페리윙클 `#7F95D1` 활성 메뉴 · 인디고 `#465D95` 링크·포커스 |
| 서체 | Plus Jakarta Sans + Pretendard(한글 폴백). display 56 / headline 28 / body 16·1.6 / label 12 대문자 |
| 레이아웃 | 사이드바 없음. 메인 헤더 60 + 서브 헤더 44 sticky. 카테고리 10종 전용 골격 |
| 다크 | 새로 추가. 따뜻한 다크(`#1B1514`), primary 는 핑크 원색 + wine 글자로 전환 |
| 접근성 | 빌드가 116쌍 대비 검사 + No-Line 함정 규칙 |
| 호환 | Tailwind 프리셋이 기존 클래스명(`text-primary` `bg-surface-low` `shadow-soft`…)을 별칭으로 유지 |

미리보기: [`examples/preview.html`](examples/preview.html).

## 설치 (memoir-frontend)
```css
/* app/globals.css 맨 위 */
@import '../vendor/memoir/tokens.css';
@import '../vendor/memoir/typography.css';
@import '../vendor/memoir/legacy-aliases.css';   /* 이관 중 */
```
```ts
// tailwind.config.ts
import preset from './vendor/memoir/tailwind.preset.cjs';
export default { presets: [preset], content: [...] };
```
```html
<button class="h-control-md px-5 rounded-md bg-action-primary-bg text-action-primary-text mm-label-md">저장</button>
<article class="bg-surface-default rounded-lg p-6">…</article>   <!-- bg-surface-zone 위에 -->
```

## 문서 지도
| 문서 | 내용 |
|---|---|
| [00 결정 가이드](docs/00-decision-guide.md) | 상황별 토큰 정답표. 면·구획 §1 |
| [01 색](docs/01-color.md) | 세 문서 통합, 종이 층, 핑크/로즈/페리윙클 역할, 테두리 예외 |
| [02 타이포](docs/02-typography.md) | Jakarta + Pretendard, 에디토리얼 위계, 역할 스타일 21종 |
| [03 간격·레이아웃](docs/03-spacing-layout.md) | 여백이 구조, 헤더 의존 셸, 카테고리별 골격, 벤토 |
| [04 모양·깊이](docs/04-shape-elevation.md) | radius, 테두리 예외, 그림자 4단계, 글래스, 블롭 |
| [05 모션](docs/05-motion.md) | slide·fade·shake·lock |
| [06 컴포넌트](docs/06-components.md) | 버튼·FAB·인풋·검색·PIN·칩·카드·카테고리별 본문·헤더·드롭다운·캘린더·벤토·모달·에디터 |
| [07 상태·피드백](docs/07-states-feedback.md) | 잠김·인증 만료·저장 상태·빈 상태 문구·보이스 |
| [08 접근성](docs/08-accessibility.md) | No-Line 함정, 글래스, 핑크 위 글자, 시맨틱 |
| [09 다크모드](docs/09-dark-mode.md) | 따뜻한 다크 매핑 |
| [10 아이콘·이미지](docs/10-iconography-imagery.md) | Lucide 매핑, 이모지 범위, 마스코트 |
| [11 데이터 시각화](docs/11-data-viz.md) | 통계·히트맵 |
| [12 페이지 패턴](docs/12-page-patterns.md) | 카테고리 10종 + 인증·검색·랜딩·오류 |
| [13 운영](docs/13-governance.md) | 변경 절차, 채택 기준, 결정 기록 |
| [14 브랜드 자산](docs/14-brand-assets.md) | 로고 규격(세리프 워드마크 교체), 마스코트, OG |
| [15 점검·이관](docs/15-audit-and-migration.md) | 기존 가이드 점검 24항목, 5단계 이관, 클래스 대응표 |
| [CLAUDE.md](CLAUDE.md) | AI 에이전트 규칙 |

## 토큰 수정
```bash
node tokens/build.mjs
```
