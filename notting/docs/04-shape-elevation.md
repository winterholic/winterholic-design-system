# 04 · 모양·깊이 — radius · 테두리 · 그림자 · 그라데이션 (notting)

## 1. radius

| 토큰 | px | 언제 |
|---|---|---|
| `none` | 0 | 표 셀, 전폭 배너, 커버 이미지(화면 끝에 붙을 때) |
| `xs` | 4 | 체크박스, 인라인 코드, 근거 칩, kbd, 블록 선택·hover 배경, 각진 태그(.md) |
| `sm` | 6 | 툴팁, 트리 항목, 메뉴·슬래시 메뉴 항목, 인라인 툴바 버튼, xs·sm 컨트롤, 아이콘 타일 |
| `md` | 8 | **버튼, 인풋, 드롭다운 상자, 코드 블록, 콜아웃, 이미지 블록, 이슈 카드, 검색 결과 항목**. 기본 |
| `lg` | 12 | 카드, 배너, 팝오버, 토스트, AI 답변 카드, Context Pack 카드, 슬래시 메뉴 상자, 보드 컬럼 |
| `xl` | 16 | 모달, 커맨드 팔레트, 바텀시트 |
| `2xl` | 24 | 히어로 이미지, 랜딩 카드 |
| `full` | 9999 | 아바타, 상태 필, 토글, 도트, 필 버튼(랜딩) |

### 규칙
- **큰 면일수록 큰 radius.** 버튼 8, 카드 12, 모달 16.
- **부모 안 자식 radius = 부모 radius − 패딩**(음수면 xs). 카드(12) 안 코드 블록은 패딩 20 이라 계산상 0 이지만 코드 블록은 독립 블록이므로 8 을 유지한다 — 카드 안에 코드 블록을 넣지 않는 게 먼저다.
- 문서 안 블록(코드·콜아웃·이미지·표)은 전부 8 로 통일한다. 문서 안에서 radius 가 섞이면 산만하다.
- 필(full)은 상태 필·아바타·토글·랜딩 CTA 에만. 앱 버튼은 8.

## 2. 테두리

| 토큰 | px | 언제 |
|---|---|---|
| `hairline` | 1 | 모든 기본 테두리 |
| `focus` | 2 | 포커스 링, 선택 표시, 탭 인디케이터, 드롭 인디케이터, 현재 revision 마커 |
| `marker` | 3 | **인용 블록 왼쪽, 근거 원문 블록 왼쪽, diff 마커, Context Pack 상단 바** |
| `accent` | 4 | 콜아웃 왼쪽 강조 바(상태형일 때만) |

색은 01 §border. 테두리와 그림자는 **둘 중 하나만** 주 신호로 쓴다.
- 문서·목록·표·보드(밀도 높음) → 테두리(`border.default`), 그림자 없음.
- 떠 있는 것(메뉴·팔레트·모달·드래그 중) → 그림자, 테두리는 `border.default` 를 얇게 같이(다크 대비).
- 카드는 **정지 상태에 그림자 없음**. base 는 카드 기본이 `shadow.sm` 이지만 notting 은 문서 화면이라 테두리다. hover 로 뜰 때만 `sm → md`.

## 3. 그림자 (elevation)

그림자 색은 ink(#0A0908) 계열이라 종이 위 따뜻한 그림자다.

| 토큰 | 언제 | 뜬 높이 감각 |
|---|---|---|
| `xs` | 세그먼트 활성 항목·버튼 살짝. 없어도 된다 | 1px |
| `sm` | 클릭 가능한 카드 hover 시작점, 이슈 카드 드래그 준비 | 2px |
| `md` | **드롭다운, 슬래시 메뉴, 인라인 툴바, 팝오버, 스크롤 시 sticky 툴바**, 카드 hover | 8px |
| `lg` | 모달, 커맨드 팔레트, 드로어, **드래그 중인 블록·카드** | 24px |
| `xl` | 랜딩 목업. **앱 UI 금지** | 48px |
| `inner` | 눌린 상태, kbd 아래, 인풋 안쪽 | 안으로 |
| `brand` | primary CTA hover 글로우. 랜딩에서만 | teal 빛 |
| `ai` | **AI 패널이 열릴 때 300ms, 스트리밍 중 답변 카드**. 앱에서 유일하게 허용되는 색 그림자 | periwinkle 빛 |

### 규칙
- 그림자는 "이게 떠 있다" 는 뜻이다. 문서 블록·표·헤더·패널에 주지 않는다.
- 한 화면에 그림자 단계는 두 개까지(예: 메뉴 md + 모달 lg).
- 드래그 중인 블록은 `shadow.lg` + `scale(1.02)` + 원래 자리에 `opacity.ghost-block` 잔상.
- `shadow.ai` 는 스트리밍이 끝나면 `normal` 로 사라진다. 완성된 답변에 글로우가 남아 있으면 "아직 생성 중" 으로 읽힌다.

```css
.card--clickable { border: 1px solid var(--nt-color-border-default); transition: box-shadow var(--nt-motion-duration-fast) var(--nt-motion-easing-standard), transform var(--nt-motion-duration-fast) var(--nt-motion-easing-standard); }
.card--clickable:hover { box-shadow: var(--nt-shadow-md); transform: translateY(-1px); }
.block--dragging { box-shadow: var(--nt-shadow-lg); transform: scale(var(--nt-motion-scale-drag)); z-index: var(--nt-z-index-raised); }
.ai-answer--streaming { box-shadow: var(--nt-shadow-ai); }
```

## 4. 그라데이션

브랜드 표현 자리에서만. 기능 UI(버튼·인풋·표·문서 본문)에는 쓰지 않는다. 각도 135deg 하나(스크림·페이드만 180).

| 토큰 | 색 | 언제 | 위 글자 |
|---|---|---|---|
| `brand` | teal.800 → verdigris(60%) → periwinkle | **주 그라데이션**. 히어로, OG 이미지, 로그인 사이드, 온보딩 헤더 | white — **어두운 시작점 쪽에만**. periwinkle 끝(2.81:1)에 흰 글자 금지 |
| `context` | periwinkle → verdigris | **AI·Context Pack 표현**. AI 배지 배경, Context Pack 카드 상단 바 3px, 강조 텍스트(`background-clip: text`), 스트리밍 진행 바 | neutral.950 |
| `paper` | paper → teal.50 | 거의 안 보이는 배경. 랜딩 섹션, 빈 상태 카드, 온보딩. 다크에서는 `surface.brand-subtle` 단색 | text.primary |
| `ink` | neutral.950 → teal.950 | 어두운 브랜드 면. 다크 히어로, 푸터, 코드 중심 랜딩 섹션 | white, teal.300 |
| `scrim-bottom` | 투명 → ink 70% (180deg) | 커버 이미지 위 제목 | white |
| `fade-bottom` | 투명 → white (180deg) | 긴 답변·미리보기 카드 하단 "더 보기" 페이드. 다크에서는 `color-mix(in srgb, var(--nt-color-surface-default), transparent)` 로 다시 그린다 | |

```css
.hero { background: var(--nt-gradient-brand); color: var(--nt-color-text-on-brand); }
.ai-badge { background: var(--nt-gradient-context); color: var(--nt-neutral-950); }   /* 장식 예외: 그라데이션 위 글자는 원시 참조 허용 */
.context-pack { border-top: var(--nt-component-context-pack-top-bar-height) solid transparent; border-image: var(--nt-component-context-pack-top-bar) 1; }
.cover::after { content: ''; position: absolute; inset: 0; background: var(--nt-gradient-scrim-bottom); }
```

### 규칙
- 한 화면에 그라데이션은 두 종류까지(주로 `brand` + `paper`, 앱 안에서는 `context` 하나).
- `context` 는 AI 표현에만. 사람이 만든 것에 `context` 그라데이션이 붙으면 01 §4 규칙 3 위반.
- 버튼에 그라데이션 금지. AI 버튼도 단색 `action.ai.bg`.

## 5. 불투명도·블러

| 토큰 | 값 | 언제 |
|---|---|---|
| `opacity.disabled` | 0.4 | 비활성 요소 전체 |
| `opacity.hover` / `pressed` | 0.06 / 0.1 | overlay 층 alpha |
| `opacity.scrim` | 0.5 | 모달 뒤 |
| `opacity.skeleton` | 0.6 | 스켈레톤 펄스 최저점 |
| `opacity.ghost-block` | 0.5 | 드래그 중 원래 자리 잔상 |
| `opacity.stale` | 0.7 | '현재 아님' 근거 미리보기·삭제된 문서 |
| `blur.md` | 12px | 스크롤 시 페이지 툴바 `backdrop-filter` |
| `blur.lg` | 24px | 커맨드 팔레트 뒤 배경(선택) |

## 6. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| 정지 카드에 `shadow.sm` | 테두리 `border.default`. 그림자는 hover |
| 문서 안 코드 블록 radius 12 | 8. 문서 안 블록은 전부 8 |
| 사이드바에 그림자 | 오른쪽 `border.subtle` 1px |
| 드래그 중 블록에 그림자 없이 opacity 만 | `shadow.lg` + scale 1.02 + 잔상 0.5 |
| AI 답변 카드에 항상 `shadow.ai` | 스트리밍 중에만 |
| 버튼에 `gradient.context` | 단색 `action.ai.bg` |
| `brand` 그라데이션 밝은 끝에 흰 제목 | 제목은 어두운 시작점에, 또는 `ink` 그라데이션 |
| `box-shadow: 0 0 10px rgba(0,0,0,.3)` | `var(--nt-shadow-md)` |
| 인용 블록 왼쪽 선 1px | `border-width.marker` 3px |
