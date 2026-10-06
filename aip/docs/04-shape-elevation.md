# 04 · 모양·깊이 (AIP)

## 1. radius: 제도 용지의 모서리

AIP 는 정밀한 도구라 모서리를 작게 잡는다. 둥근 정도로 친근함을 만들지 않고, 간격과 글자로 만든다.

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `none` | 0 | 표 셀·전폭 띠 |
| `xs` | 2 | 인라인 코드·kbd·mark |
| `sm` | 4 | 체크박스·배지·툴팁·사이드바·메뉴 항목·xs/sm 버튼 |
| `md` | 6 | 버튼·인풋·셀렉트·드롭다운. **기본** |
| `lg` | 8 | 카드·코드 블록·콜아웃·스펙·Example·다이어그램·옵션 카드 |
| `xl` | 12 | 다이얼로그·검색 팔레트 |
| `2xl` | 16 | 랜딩 대형 패널·히어로 이미지 |
| `full` | 9999 | 스위치·라디오·카운트 배지 |

규칙: 큰 면일수록 큰 값. 자식은 부모보다 둥글지 않다(부모 radius − 안쪽 padding ≈ 자식 radius). 세그먼트 활성 칸이 이 계산을 쓴다.

## 2. 선: 구조는 선이 만든다

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `border-width.hairline` | 1 | 모든 기본 테두리 |
| `border-width.strong` | 2 | 활성 탭 밑줄·포커스 링·현재 위치(헤더 내비)·스펙 상단 파란 선 |
| `border-width.accent` | 3 | 콜아웃·Example 왼쪽 바·강조 줄 마커·TOC 활성 마커 |

선 색은 `border.subtle`(행) · `default`(카드·표·헤더) · `strong`(입력 경계 3:1) · `brand`(선택·활성).
콜아웃·스펙의 강조 바는 `box-shadow: inset` 으로 그린다. 테두리를 쓰면 radius 모서리에서 바가 휘어진다.

## 3. 그림자: 떠 있는 것만

| 토큰 | 쓰는 곳 |
|---|---|
| `shadow.xs` | 세그먼트 활성 칸·스위치 손잡이 |
| `shadow.sm` | 클릭 가능한 카드 hover |
| `shadow.md` | 드롭다운·툴팁 |
| `shadow.lg` | 다이얼로그·드로어·검색·모바일 하단 생성 바·히어로 코드 목업 |

카드·코드 블록·콜아웃·스펙에는 **그림자가 없다**. 그림자 색은 Charcoal 계열이고, 색 글로우(브랜드 빛 번짐)는 없다. 다크는 `shadow-dark.*` 로 자동 교체되며 고도의 주 신호는 면 밝기(`surface.raised`)다.

## 4. 배경 장식: 점 격자 하나

유일한 배경 패턴은 제도용 점 격자다. `pattern.grid-size` 24px, 점 반지름 `pattern.grid-dot` 1px, 색 `color.diagram.grid`.
쓰는 곳: 다이어그램 캔버스(컴포넌트가 자동), 홈페이지 히어로, 빈 Playground. 본문·카드·폼 뒤에는 깔지 않는다.

```css
background-image: radial-gradient(circle, var(--aip-color-diagram-grid) var(--aip-pattern-grid-dot), transparent calc(var(--aip-pattern-grid-dot) + var(--aip-space-px)));
background-size: var(--aip-pattern-grid-size) var(--aip-pattern-grid-size);
```

## 5. 투명도

`opacity.disabled` 0.45(아이콘 포함 비활성 묶음) · `opacity.muted` 0.65(다이어그램 노드 종류 라벨, 선택 해제 설명). 색 토큰 `action.disabled.*` 가 있으면 그쪽이 먼저다.

## 6. 하지 말 것

| ❌ | ✅ |
|---|---|
| 카드에 상시 그림자 | 테두리. hover 만 `shadow.sm` |
| 글래스모피즘·backdrop blur | 헤더는 불투명 canvas + 하단선 |
| 보라·파랑 글로우 | 없음 |
| 그라데이션 버튼·배경 | 단색. 01 §6 |
| radius 20 카드 | 8 |
| 콜아웃 왼쪽 바를 border-left 로 | inset box-shadow(모서리에서 휘지 않게) |
