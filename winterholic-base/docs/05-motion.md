# 05 · 모션

모션은 **상태가 바뀌었다는 걸 설명**하기 위해 쓴다. 장식 애니메이션은 랜딩 리빌에 한정한다.

## 1. duration

| 토큰 | ms | 언제 |
|---|---|---|
| `instant` | 0 | reduced-motion 대체값 |
| `fast` | 100 | hover 색 변화, 체크박스, 토글, 버튼 눌림 |
| `normal` | 200 | **기본**. 드롭다운·툴팁·팝오버 열기, 탭 인디케이터 이동, 작은 아코디언 |
| `slow` | 300 | 모달·드로어·바텀시트 진입, 페이지 전환, 큰 아코디언 |
| `slower` | 500 | 토스트 진입, 랜딩 스크롤 리빌 |
| `skeleton-cycle` | 1500 | 스켈레톤 shimmer 한 바퀴 |

- **이동 거리가 길수록, 면이 클수록 길게.** 툴팁 200, 모달 300.
- **닫힘은 열림보다 짧게.** 모달 열기 300 / 닫기 200. 사용자는 이미 결정했으니 빨리 사라져야 한다.
- 500ms 를 넘는 UI 모션은 없다. 기다리게 하는 모션은 스켈레톤·스피너뿐이다.

## 2. easing

| 토큰 | 값 | 언제 |
|---|---|---|
| `standard` | cubic-bezier(0.2, 0, 0, 1) | **화면 안에서 움직이는 것 전부**. 색·크기·위치 |
| `decelerate` | cubic-bezier(0, 0, 0, 1) | **들어오는 것**. 빠르게 나타나 부드럽게 멈춘다 |
| `accelerate` | cubic-bezier(0.3, 0, 1, 1) | **나가는 것**. 천천히 출발해 빠르게 사라진다 |
| `spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | 토글 손잡이, 체크 표시, 좋아요. 살짝 넘치고 돌아온다. **큰 면 금지** |
| `linear` | cubic-bezier(0, 0, 1, 1) | 스피너, 프로그레스, shimmer 처럼 끝없이 도는 것 |

`ease`, `ease-in-out` 같은 CSS 키워드는 쓰지 않는다. 토큰 다섯 개로 통일한다.

## 3. 진입·퇴장 규격

| 컴포넌트 | 진입 | 퇴장 |
|---|---|---|
| 툴팁 | fade + `distance.sm`(4px) 위로, `normal`, `decelerate` | fade, `fast`, `accelerate` |
| 드롭다운·팝오버 | fade + scale `enter`(0.96) + `distance.sm`, `normal`, `decelerate`. 기준점은 트리거 쪽 | fade + scale, `fast`, `accelerate` |
| 모달 | 스크림 fade `slow` / 상자 fade + scale 0.96 + `distance.lg`(16px) 위로, `slow`, `decelerate` | 상자 `normal` `accelerate`, 스크림은 상자 뒤에 |
| 드로어(옆) | translateX 100% → 0, `slow`, `decelerate` | `normal`, `accelerate` |
| 바텀시트 | translateY 100% → 0, `slow`, `decelerate` | `normal`, `accelerate` |
| 토스트 | fade + `distance.md`(8px) 위로, `slower`, `decelerate` | fade, `normal`, `accelerate` |
| 아코디언 | height auto 전환(`grid-template-rows: 0fr → 1fr` 기법), `normal`, `standard` | 같음 |
| 탭 인디케이터 | 위치·폭 `normal` `standard` | |
| 스켈레톤 | 배경 위치 shimmer `skeleton-cycle` `linear` 무한 | |
| 버튼 눌림 | `transform: scale(0.98)`, `fast` | |
| 리스트 아이템 추가 | fade + `distance.sm`, `normal`, 순서대로 30ms 지연(최대 8개까지만) | |

```css
.dropdown {
  transform-origin: top left;
  animation: wh-pop-in var(--wh-motion-duration-normal) var(--wh-motion-easing-decelerate);
}
@keyframes wh-pop-in {
  from { opacity: 0; transform: translateY(calc(-1 * var(--wh-motion-distance-sm))) scale(var(--wh-motion-scale-enter)); }
  to   { opacity: 1; transform: none; }
}
```

## 4. 무엇을 애니메이션할 것인가

- `opacity`, `transform` 만 애니메이션한다. `width` `height` `top` `margin` 은 레이아웃을 다시 계산해 버벅인다. 높이 전환은 `grid-template-rows` 기법을 쓴다.
- 색 전환(`background-color` `color` `border-color` `box-shadow`)은 `fast`. 그 이상 길면 hover 가 끈적하다.
- 한 번에 움직이는 요소는 한 그룹. 모달이 뜨는데 뒤 카드도 움직이면 시선이 갈린다.
- 스크롤 리빌(랜딩): 요소가 뷰포트 20% 들어왔을 때 fade + `distance.lg`, `slower`, `decelerate`. 한 번만 재생. 앱 화면에는 쓰지 않는다.

## 5. reduced-motion

`dist/tokens.css` 가 `prefers-reduced-motion: reduce` 에서 `fast` `normal` `slow` `slower` 를 0ms 로 바꾼다. 컴포넌트는 duration 토큰만 쓰면 자동으로 따른다. 직접 `@keyframes` 를 쓸 때는 아래를 덧붙인다.

```css
@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; opacity: 1; transform: none; }
}
```
스켈레톤 shimmer 는 reduced-motion 에서 정지 상태(`opacity.skeleton` 단색)로 둔다.

## 6. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `transition: all 0.3s ease` | 속성 명시 + 토큰: `transition: background-color var(--wh-motion-duration-fast) var(--wh-motion-easing-standard)` |
| 모달 열림·닫힘 같은 속도 | 열림 300 / 닫힘 200 |
| 카드 hover 에 `scale(1.05)` | `translateY(-1px)` + 그림자 한 단계 |
| `height: 0 → auto` 트랜지션(동작 안 함) | `grid-template-rows: 0fr → 1fr` 또는 `max-height` |
| 무한 반복 배경 애니메이션 앱 화면에 | 스켈레톤·스피너만 반복. 나머지는 한 번 |
| `spring` 으로 모달 등장 | 모달은 `decelerate`. spring 은 20px 이하 요소 |
| 페이지 진입 시 요소 20개 순차 등장 | 8개까지, 그 뒤는 동시에 |
