# 05 · 모션 (stock-gosu)

"움직임은 사용자의 행동을 따라가야지 주의를 빼앗아선 안 된다. 잔액·수익률 같은 핵심 숫자를 과한 모션으로 강조하지 않는다 — 깜빡임은 불안이다."(기존 FDS)

## 1. duration
| 토큰 | ms | 언제 |
|---|---|---|
| `fast` | 150 | hover 색, 세그먼트 활성 이동, 토글, 버튼 눌림 |
| `normal` | 250 | 드롭다운·검색 결과·아코디언·탭 인디케이터 (기존 base) |
| `slow` | 400 | 바텀시트·모달 진입, 페이지 전환 |
| `flash` | 600 | 실시간 틱 셀 플래시 후 원복 |
| `chart` | 300 | 차트 그려짐·데이터 갱신(recharts `animationDuration`) |
| `skeleton-cycle` | 1400 | shimmer |
| `toast` / `toast-long` | 3000 / 6000 | 정보 / 오류·액션 |

닫힘은 열림보다 짧게(시트 열기 400 / 닫기 250).

## 2. easing
| 토큰 | 값 | 언제 |
|---|---|---|
| `out` | (0.22, 1, 0.36, 1) | **등장·이동 전부**. 기존 --ease-out |
| `in-out` | (0.4, 0, 0.2, 1) | 색·상태 전환, 플래시. 기존 --ease-in-out |
| `in` | (0.4, 0, 1, 1) | 사라짐 |
| `linear` | | 스피너·shimmer·프로그레스 |

## 3. 실시간 시세 플래시 (금융 전용)
가격이 바뀐 셀의 **배경**을 잠깐 물들이고 원복한다. 글자색은 바꾸지 않는다(등락색은 방향, 플래시는 "방금 바뀜").
```css
.price-cell[data-tick="up"]   { animation: sg-flash-up   var(--sg-motion-duration-flash) var(--sg-motion-easing-in-out); }
.price-cell[data-tick="down"] { animation: sg-flash-down var(--sg-motion-duration-flash) var(--sg-motion-easing-in-out); }
@keyframes sg-flash-up   { from { background: var(--sg-color-finance-flash-up); }   to { background: transparent; } }
@keyframes sg-flash-down { from { background: var(--sg-color-finance-flash-down); } to { background: transparent; } }
```
- 한 화면에서 동시에 플래시되는 셀이 20개를 넘으면(전체 시장 갱신) 플래시를 끄고 "15:30:05 갱신" 문구만 바꾼다.
- 리스트 정렬이 실시간으로 바뀌는 화면(등락 순위)은 행 이동 애니메이션을 하지 않는다. 순위가 뒤바뀌는 움직임은 읽기를 방해한다. 갱신 버튼 또는 5초 주기 정지 갱신.
- 숫자 자체를 카운트업하지 않는다(총자산이 0 에서 올라가는 연출 금지).

## 4. 진입·퇴장 규격
| 컴포넌트 | 진입 | 퇴장 |
|---|---|---|
| 바텀시트 | translateY(100%→0), `slow`, `out`. 스크림 fade `normal` | `normal`, `in` |
| 모달(데스크톱) | fade + scale 0.97 + 16px 위로, `slow`, `out` | `normal`, `in` |
| 드롭다운·검색 결과 | fade + 4px, `normal`, `out` | `fast`, `in` |
| 툴팁·차트 툴팁 | fade, `fast` | 즉시 |
| 토스트 | fade + 8px 위로, `normal`, `out`. 모바일은 탭바 위 72px | `normal`, `in` |
| 탭 인디케이터·세그먼트 | 위치·폭 `fast`, `out` | |
| 아코디언(재무 상세) | `grid-template-rows 0fr→1fr`, `normal` | 같음 |
| 차트 | 첫 렌더만 `chart` 300, 갱신은 `isAnimationActive={false}` 또는 300 | |
| 스켈레톤 | shimmer `skeleton-cycle` linear 무한 | |
| 버튼 눌림 | `scale(0.97)` `fast` | |
| 관심 ★ 토글 | scale 1→1.2→1 `fast` `out` | |

## 5. 무엇을 움직이나
- `opacity`·`transform` 만. `height`·`top`·`width` 금지.
- 색 전환은 `fast`.
- 차트 갱신 시 축이 튀지 않게 y 도메인을 고정하거나 `allowDataOverflow`. 축 재계산 애니메이션이 가장 산만하다.
- 스크롤 리빌 없음. 투자 화면은 정보를 즉시 보여야 한다.

## 6. reduced-motion
`tokens.css` 가 `fast` `normal` `slow` `flash` `chart` 를 0 으로 내린다. 플래시는 배경색이 즉시 사라지므로 방향 부호·화살표가 정보를 대신한다(색만으로 전달 금지 규칙이 여기서도 산다). 직접 쓴 `@keyframes` 는 05 base 와 같이 미디어 쿼리를 덧붙인다.

## 7. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| 총자산 카운트업 | 즉시 표시 |
| 가격 변경 시 글자색 깜빡 | 배경 플래시 600ms |
| 순위 리스트 행 실시간 재정렬 애니메이션 | 주기 갱신 + 갱신 시각 |
| 차트 매 갱신 그려짐 애니메이션 | 첫 렌더만 |
| `transition: all .3s ease` | 속성 명시 + 토큰 |
| 바텀시트 spring 바운스 | `out` |
