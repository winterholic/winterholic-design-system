# 04 · 모양·깊이 — radius · 테두리 · 그림자 · 그라데이션

## 1. radius

| 토큰 | px | 언제 |
|---|---|---|
| `none` | 0 | 표 셀, 전폭 배너, 이미지가 화면 끝에 붙을 때 |
| `xs` | 4 | 체크박스, 인라인 코드, 각진 태그, 스켈레톤(글자) |
| `sm` | 6 | xs·sm 컨트롤, 툴팁, 드롭다운 항목 hover 배경 |
| `md` | 8 | **md·lg 버튼, 인풋, 셀렉트, 드롭다운 메뉴 상자**. 기본 |
| `lg` | 12 | 카드, 배너, 팝오버, 토스트 |
| `xl` | 16 | 모달, 바텀시트, 대형 카드 |
| `2xl` | 24 | 히어로 이미지, 프로모션 카드 |
| `full` | 9999 | 아바타, 칩, 토글, 상태 도트, 필 버튼 |

### 규칙
- **큰 면일수록 큰 radius.** 40px 버튼은 8, 카드는 12, 모달은 16. 작은 것에 큰 radius 를 주면 캡슐이 되고, 큰 것에 작은 radius 를 주면 뾰족해 보인다.
- **부모 안 자식 radius = 부모 radius − 패딩** (음수면 0 이나 xs). 카드(12) 안 패딩 8 이면 안쪽 이미지는 4. 안쪽이 부모보다 둥글면 모서리가 뜬다.
- 한 컴포넌트 안에서는 한 값. 버튼 왼쪽만 둥글게 같은 건 세그먼트 컨트롤(붙은 버튼)에서만.
- 필(full) 버튼은 랜딩 CTA·필터 칩에서만. 앱 폼 버튼은 md 로 통일한다. 한 화면에 필 버튼과 md 버튼이 섞이면 안 된다.

## 2. 테두리

| 토큰 | px | 언제 |
|---|---|---|
| `hairline` | 1 | 모든 기본 테두리 |
| `focus` | 2 | 포커스 링, 선택 표시, 탭 인디케이터 |
| `accent` | 4 | 콜아웃·인용 왼쪽 바 |

색은 01 §border. 테두리와 그림자는 **둘 중 하나만** 주 신호로 쓴다.
- 밀도 높은 화면(표·대시보드) → 테두리(`border.default`), 그림자 없음.
- 여유 있는 화면(카드 갤러리·랜딩) → 그림자(`shadow.sm`), 테두리 없음 또는 `border.subtle`.
- 다크모드에서는 그림자가 잘 안 보이니 테두리를 더한다(빌드된 CSS 가 다크에서 그림자 alpha 를 올려 두었지만, 테두리가 확실하다).

## 3. 그림자 (elevation)

그림자 색은 `#1B2027`(neutral.950) 계열이라 쿨 톤을 유지한다. 검은 그림자(`#000`)는 따뜻한 화면에서 온 것처럼 탁해 보인다.

| 토큰 | 언제 | 뜬 높이 감각 |
|---|---|---|
| `xs` | 인풋·버튼에 살짝 입체감. 없어도 된다 | 1px |
| `sm` | **카드 기본**(정지 상태) | 2px |
| `md` | 카드 hover, 드롭다운, 팝오버, 스크롤 시 스티키 헤더 | 8px |
| `lg` | 모달, 드로어, 바텀시트, 드래그 중 아이템 | 24px |
| `xl` | 랜딩 목업 이미지·프로모션. **앱 UI 금지** | 48px |
| `inner` | 눌린 상태, sunken 면, 인풋 안쪽 | 안으로 |
| `brand` | primary CTA hover 글로우. 랜딩에서만 | 파란 빛 |

### 규칙
- 그림자는 **"이게 떠 있다"** 는 뜻이다. 떠 있지 않은 것(섹션 배경·표·헤더 정지 상태)에 주지 않는다.
- 한 화면에 그림자 단계는 두 개까지(예: 카드 sm + 모달 lg).
- hover 로 그림자를 올릴 때는 `sm → md` 한 단계만, `transform: translateY(-1px)` 을 같이 주면 자연스럽다. 두 단계 이상 뛰면 튀어 오른다.
- 클릭할 수 없는 카드는 hover 로 그림자를 바꾸지 않는다(클릭 가능하다는 거짓 신호).

```css
.card { box-shadow: var(--wh-shadow-sm); transition: box-shadow var(--wh-motion-duration-fast) var(--wh-motion-easing-standard), transform var(--wh-motion-duration-fast) var(--wh-motion-easing-standard); }
.card[href]:hover, .card[role="button"]:hover { box-shadow: var(--wh-shadow-md); transform: translateY(-1px); }
```

## 4. 그라데이션

그라데이션은 **브랜드 표현 자리에서만** 쓴다. 기능 UI(버튼·인풋·표·배너)에는 쓰지 않는다. 각도는 135deg 하나로 고정해 어디 나와도 한 시스템으로 읽히게 한다.

| 토큰 | 색 | 언제 | 위 글자 |
|---|---|---|---|
| `brand` | twilight → steel(55%) → ice | **주 그라데이션**. 히어로 배경, OG 이미지, 로그인 사이드 패널, 이메일 헤더 | white |
| `aurora` | steel → aqua | 밝은 보조. 배지, 아바타 폴백, 강조 텍스트(`background-clip: text`), 프로그레스 바 채움 | neutral.950 |
| `frost` | snow → blue.50 | 거의 안 보이는 배경. 랜딩 섹션 배경, 빈 상태 카드, 대시보드 요약 카드 배경 | text.primary 그대로 |
| `twilight` | indigo.950 → twilight | 어두운 브랜드 면. 다크 히어로, 푸터 | white, cyan.300 |
| `scrim-bottom` | 투명 → 950 @70% (180deg) | 이미지 위 글자 가독용 하단 스크림 | white |

```css
.hero { background: var(--wh-gradient-brand); color: var(--wh-color-text-on-brand); }
.text-gradient { background: var(--wh-gradient-aurora); -webkit-background-clip: text; background-clip: text; color: transparent; }
.thumb::after { content: ''; position: absolute; inset: 0; background: var(--wh-gradient-scrim-bottom); }
```

### 규칙
- 한 화면에 그라데이션은 두 종류까지(주로 `brand` + `frost`).
- 그라데이션 위 글자는 가장 밝은 지점 기준으로 대비를 본다. `brand` 의 끝(`#63D2FF`)에 흰 글자는 1.72:1 이다. 글자는 **어두운 쪽(twilight 시작점)에 두거나** `scrim` 을 깐다. 넓게 글자를 깔아야 하면 `twilight` 그라데이션을 쓴다.
- 버튼에 그라데이션을 주고 싶으면 참는다. hover 상태 표현이 어렵고 다크모드에서 튄다. 대신 랜딩 CTA 는 `shadow.brand` 글로우로 힘을 준다.
- 다크모드에서 `frost` 는 자동으로 어두운 값이 되지 않는다(원시 참조). 다크에서는 `frost` 대신 `surface.brand-subtle` 단색을 쓴다.

## 5. 불투명도·블러

| 토큰 | 값 | 언제 |
|---|---|---|
| `opacity.disabled` | 0.4 | 비활성 요소 전체. 색 토큰을 따로 바꾸지 않고 이것만 걸어도 된다 |
| `opacity.hover` / `pressed` | 0.06 / 0.1 | overlay 층 alpha |
| `opacity.scrim` | 0.5 | 모달 뒤 |
| `opacity.skeleton` | 0.6 | 스켈레톤 펄스 최저점 |
| `blur.md` | 12px | 글래스 헤더 `backdrop-filter`. 스크롤 시 헤더가 콘텐츠 위로 지나갈 때 |
| `blur.lg` | 24px | 모달 뒤 배경(선택 사항, 성능 비용 있음) |

## 6. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| 버튼 radius 20px(캡슐) 앱 폼에 | `radius.md` 8. 필은 랜딩 CTA 만 |
| 카드 12 안에 이미지도 12 | 이미지는 부모 − 패딩 (예: 4) |
| 표 셀에 그림자 | 테두리 `border.default` |
| 정지 카드에 `shadow.lg` | `shadow.sm`. lg 는 모달 |
| `box-shadow: 0 0 10px rgba(0,0,0,.3)` | `var(--wh-shadow-md)` |
| 버튼에 그라데이션 | 단색 `action.primary.bg`. 힘이 필요하면 `shadow.brand` |
| 그라데이션 각도 화면마다 다르게 | 135deg 고정(스크림만 180) |
| `brand` 그라데이션 밝은 끝에 흰 제목 | 제목을 어두운 시작점에, 또는 `twilight` 그라데이션 |
