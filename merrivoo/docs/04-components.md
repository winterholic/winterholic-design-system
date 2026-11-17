# 04 · 컴포넌트

기계 판독 사양은 [`registry/components.json`](../registry/components.json)(class·parts·variants·states·tokens·usage·a11y). 빌드가 이 목록이 실제 CSS·토큰과 일치하는지 검사한다. 15종: Button · Choice Card · Question Panel · Progress · Bottom Sheet · Modal · Ornament Selector · Nickname Input · Anonymous Toggle · Compatibility Result · Universe Card · Tree Interaction Overlay · Share Card · Toast · State View.

## 상태 규칙
default · hover(`@media (hover:hover)` 안에서만) · pressed(scale 0.97) · focus-visible(2px 링 + offset 2) · disabled(`opacity.disabled`, 클릭 불가) · loading(`aria-busy`, 중복 제출 차단) · selected(색 + 체크 + 두꺼운 테두리 + 금 후광).

## 실제 맥락의 크기(토큰 기계 적용 금지)
| 컴포넌트 | 크기·패딩 | 이유 |
|---|---|---|
| 주 버튼 | 52px(lg), 공개/첫 화면 CTA 60px(xl, pill) | 엄지 도달·게임형 터치감 |
| 선택 카드 | 최소 64px, 패딩 16, 아이콘 40, 제목 18/600 | 한 손 선택, 3줄까지 |
| 질문 패널 | 패딩 20, 금 프레임 3px, 반투명 + 블러 | 장면이 비쳐 보여야 "세계가 생겨난다" |
| 시트 | 패딩 20, 상단 radius 24, 핸들 40×4 | 모바일 관례, 엄지로 닫기 |
| 장식 선택기 | 4열, 칸 64px 이상 | 장식 그림이 읽히는 최소 크기 |
| 트리 위 장식 | 보이는 크기 18px~, 터치 영역은 44px(::after) | 빽빽해도 누를 수 있게, 대체 경로는 목록 시트 |

## 조립 규칙(없는 컴포넌트를 만들 때)
1. 레지스트리에 같은 역할이 있는지 먼저 본다. 2. 면은 `surface.*`, 테두리는 `border.*`, 행동은 `action.*`. 3. 반경은 `radius.md~xl`(부모 radius − padding ≈ 자식). 4. 새 값이 필요하면 토큰을 추가한다(임시 값 금지). 5. 레지스트리·docs 갱신.
