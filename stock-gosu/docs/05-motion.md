# 05 · 모션 (stock-gosu)

"움직임은 사용자의 행동을 따라가야지 주의를 빼앗아선 안 된다. 잔액·수익률 같은 핵심 숫자를 과한 모션으로 강조하지 않는다 — 깜빡임은 불안이다."(기존 FDS) 모션은 상태 변화를 설명하기 위해서만 쓴다.

## 1. duration
| 토큰 | ms | 언제 |
|---|---|---|
| `instant` | 0 | reduced-motion 대체값 |
| `fast` | 150 | hover 색, 세그먼트 활성 이동, 토글, 체크박스, 버튼 눌림, 탭 인디케이터 |
| `normal` | 250 | **기본**. 드롭다운·검색 결과·툴팁·팝오버 열기, 아코디언(작은 높이), 토스트 진입 (기존 base) |
| `slow` | 400 | 바텀시트·모달·드로어 진입, 페이지 전환, 큰 아코디언 |
| `flash` | 600 | 실시간 틱 셀 배경 플래시 후 원복 |
| `chart` | 300 | 차트 첫 렌더 그려짐(recharts `animationDuration`) |
| `skeleton-cycle` | 1400 | shimmer 한 바퀴 |
| `toast` / `toast-long` | 3000 / 6000 | 정보 토스트 / 오류·액션 토스트 유지 |

- 이동 거리가 길수록, 면이 클수록 길게. 툴팁 250, 시트 400.
- 닫힘은 열림보다 짧게. 시트 열기 400 / 닫기 250.
- 400 을 넘는 UI 모션은 없다. 기다리게 하는 모션은 스켈레톤·스피너뿐.

## 2. easing
| 토큰 | 값 | 언제 |
|---|---|---|
| `out` | cubic-bezier(0.22, 1, 0.36, 1) | **등장·이동 전부**. 빠르게 나타나 부드럽게 멈춤 (기존 --ease-out) |
| `in-out` | cubic-bezier(0.4, 0, 0.2, 1) | 색·상태 전환, 플래시 (기존 --ease-in-out) |
| `in` | cubic-bezier(0.4, 0, 1, 1) | 사라짐. 천천히 출발해 빠르게 |
| `linear` | | 스피너·프로그레스·shimmer 처럼 끝없이 도는 것 |

`ease`·`ease-in-out` CSS 키워드는 쓰지 않는다. 네 토큰으로 통일.

## 3. 실시간 시세 (금융 전용)
가격이 바뀐 셀의 **배경**을 잠깐 물들이고 원복한다. 글자색은 바꾸지 않는다(등락색은 방향, 플래시는 "방금 바뀜").
```css
.price-cell[data-tick="up"]   { animation: sg-flash-up   var(--sg-motion-duration-flash) var(--sg-motion-easing-in-out); }
.price-cell[data-tick="down"] { animation: sg-flash-down var(--sg-motion-duration-flash) var(--sg-motion-easing-in-out); }
@keyframes sg-flash-up   { from { background: var(--sg-color-finance-flash-up); }   to { background: transparent; } }
@keyframes sg-flash-down { from { background: var(--sg-color-finance-flash-down); } to { background: transparent; } }
```
- `data-tick` 은 값이 바뀔 때마다 제거 → 리플로우 → 재부여(같은 방향 연속 틱도 다시 깜빡이게).
- 동시에 플래시되는 셀이 20개를 넘으면(전체 시장 갱신) 플래시를 끄고 "15:30:05 갱신" 문구만 바꾼다.
- 순위 리스트가 실시간으로 재정렬될 때 행 이동 애니메이션 금지. 5초 주기 정지 갱신 + 일시정지 버튼.
- 숫자 카운트업 금지(총자산이 0 에서 올라가는 연출).
- 현재가 옆 화살표 방향 전환은 즉시(애니메이션 없음).

## 4. 진입·퇴장 규격
| 컴포넌트 | 진입 | 퇴장 |
|---|---|---|
| 툴팁·차트 툴팁 | fade, `fast` | 즉시 |
| 드롭다운·검색 결과·팝오버 | fade + `distance.sm` 4px + scale 0.97, `normal`, `out`. 기준점 트리거 쪽 | fade, `fast`, `in` |
| 모달(데스크톱) | 스크림 fade `normal` / 상자 fade + scale 0.97 + `distance.lg` 16px 위로, `slow`, `out` | 상자 `normal` `in`, 스크림 뒤따라 |
| 바텀시트 | translateY(100%→0), `slow`, `out` | `normal`, `in`. 드래그로 닫을 때는 손가락 속도 따라 |
| 드로어 | translateX(100%→0), `slow`, `out` | `normal`, `in` |
| 토스트 | fade + `distance.md` 8px 위로, `normal`, `out`. 모바일 탭바 위 72 | fade, `normal`, `in` |
| 탭 인디케이터·세그먼트 활성 | 위치·폭 `fast`, `out` | |
| 아코디언(재무 상세·FAQ) | `grid-template-rows: 0fr → 1fr`, `normal`, `out` | 같음 |
| 차트 | 첫 렌더만 `chart` 300, 갱신 `isAnimationActive={false}` | |
| 스켈레톤 | shimmer `skeleton-cycle` linear 무한 | |
| 버튼 눌림 | `scale(0.97)`, `fast` | |
| 관심 ★ 토글 | scale 1 → 1.2 → 1, `fast`, `out` | |
| 체크박스·스위치 | 체크 그리기·손잡이 이동 `fast`, `out` | |
| 리스트 항목 추가(알림) | fade + 4px, `normal`, 순차 30ms 지연 최대 8개 | |
| 페이지 전환(앱 라우팅) | 콘텐츠 fade + 8px, `normal` | 즉시 |
| 하단 탭 전환 | 애니메이션 없음(즉시) | |

```css
.dropdown { transform-origin: top left; animation: sg-pop-in var(--sg-motion-duration-normal) var(--sg-motion-easing-out); }
@keyframes sg-pop-in { from { opacity: 0; transform: translateY(calc(-1 * var(--sg-motion-distance-sm))) scale(var(--sg-motion-scale-enter)); } to { opacity: 1; transform: none; } }
.sheet { animation: sg-sheet-in var(--sg-motion-duration-slow) var(--sg-motion-easing-out); }
@keyframes sg-sheet-in { from { transform: translateY(var(--sg-motion-distance-sheet)); } to { transform: none; } }
.acc { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--sg-motion-duration-normal) var(--sg-motion-easing-out); }
.acc[open] { grid-template-rows: 1fr; }
.acc > div { overflow: hidden; }
```

## 5. 무엇을 애니메이션할 것인가
- `opacity`·`transform` 만. `width` `height` `top` `margin` 금지(레이아웃 재계산). 높이 전환은 `grid-template-rows`.
- 색 전환(`background-color` `color` `border-color` `box-shadow`)은 `fast`.
- 차트 갱신 시 y 도메인이 튀는 애니메이션 금지. 기간 전환은 도메인 고정 후 선만 교체.
- 한 번에 움직이는 그룹은 하나. 시트가 올라오는데 뒤 카드도 움직이면 안 된다.
- 스크롤 리빌 없음. 투자 화면은 정보를 즉시 보여야 한다.
- 무한 반복은 스켈레톤·스피너·무한 progress 만.

## 6. reduced-motion
`dist/tokens.css` 가 `prefers-reduced-motion: reduce` 에서 `fast` `normal` `slow` `flash` `chart` 를 0ms 로 내린다. 토큰만 쓰면 자동. 직접 `@keyframes` 를 쓰면 덧붙인다:
```css
@media (prefers-reduced-motion: reduce) {
  .price-cell[data-tick], .dropdown, .sheet { animation: none; }
  .skeleton::after { animation: none; opacity: var(--sg-opacity-skeleton); }
}
```
플래시가 사라져도 부호·화살표가 방향을 전달한다(색만으로 전달 금지 규칙이 여기서도 산다). 자동 갱신 화면은 일시정지 버튼.

## 7. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `transition: all .3s ease` | 속성 명시 + 토큰 |
| 총자산 카운트업 | 즉시 표시 |
| 가격 변경 시 글자색 깜빡 | 배경 플래시 600 |
| 순위 행 실시간 재정렬 애니메이션 | 주기 갱신 + 갱신 시각 + 일시정지 |
| 차트 매 갱신 그려짐 | 첫 렌더만 |
| 바텀시트 spring 바운스 | `out` |
| 카드 hover `scale(1.05)` | `translateY(-2px)` + 그림자 한 단계 |
| `height: 0 → auto` 트랜지션 | `grid-template-rows` |
| 페이지 진입 요소 20개 순차 등장 | 8개까지 |
| 하단 탭 전환 슬라이드 | 즉시 |
