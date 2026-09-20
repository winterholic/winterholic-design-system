# 05 · 모션 (notting)

모션은 **상태가 바뀌었다는 걸 설명**하기 위해 쓴다. 에디터 안에서는 특히 절제한다 — 타이핑하는 사람 시야에서 움직이는 것은 커서·슬래시 메뉴·저장 상태뿐이어야 한다.

## 1. duration

| 토큰 | ms | 언제 |
|---|---|---|
| `instant` | 0 | reduced-motion 대체값 |
| `fast` | 100 | hover 색 변화, 체크박스, 토글, 버튼 눌림, **블록 핸들 나타남** |
| `normal` | 200 | **기본**. 드롭다운·슬래시 메뉴·툴팁·인라인 툴바 열기, 탭 인디케이터, **토글 블록 펼침**, 트리 펼침 |
| `slow` | 300 | 모달·커맨드 팔레트·드로어·**우측 패널** 진입, 페이지 전환 |
| `slower` | 500 | 토스트 진입, 랜딩 리빌, **근거로 스크롤** |
| `skeleton-cycle` | 1500 | 스켈레톤 shimmer 한 바퀴 |
| `stream-caret` | 800 | AI 스트리밍 커서 깜빡임 한 주기 |
| `flash` | 1200 | 근거·검색 결과로 이동한 뒤 해당 블록 하이라이트가 사라지는 시간 |

- 이동 거리가 길수록, 면이 클수록 길게. 툴팁 200, 패널 300.
- 닫힘은 열림보다 짧게. 패널 열기 300 / 닫기 200.
- 500ms 를 넘는 UI 모션은 없다. 예외는 `flash`(1200) — 움직임이 아니라 색이 사라지는 시간이고, 사용자가 "여기다" 를 찾을 시간을 준다.

## 2. easing

| 토큰 | 값 | 언제 |
|---|---|---|
| `standard` | cubic-bezier(0.2, 0, 0, 1) | 화면 안에서 움직이는 것 전부. 기본 |
| `decelerate` | cubic-bezier(0, 0, 0, 1) | 들어오는 것(모달·패널·토스트·슬래시 메뉴 진입) |
| `accelerate` | cubic-bezier(0.3, 0, 1, 1) | 나가는 것(닫힘·사라짐) |
| `spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | 토글 손잡이, 체크 표시, **복사됨 체크**, task 체크박스. 큰 면 금지 |
| `linear` | cubic-bezier(0, 0, 1, 1) | 스피너, 프로그레스, shimmer, **스트리밍 커서** |

`ease`, `ease-in-out` 키워드는 쓰지 않는다.

## 3. 진입·퇴장 규격

| 컴포넌트 | 진입 | 퇴장 |
|---|---|---|
| 툴팁 | fade + `distance.sm` 위로, `normal`, `decelerate` | fade, `fast`, `accelerate` |
| 드롭다운·슬래시 메뉴·멘션 목록 | fade + scale 0.96 + `distance.sm`, `normal`, `decelerate`. 기준점 커서 위치 | fade + scale, `fast`, `accelerate` |
| 인라인 툴바 | fade + `distance.sm` 위로, `fast`, `decelerate`. 선택이 끝난 뒤(mouseup) 에 뜬다 | fade, `fast` |
| 모달·커맨드 팔레트 | 스크림 fade `slow` / 상자 fade + scale 0.96 + `distance.lg` 위로, `slow`, `decelerate` | 상자 `normal` `accelerate` |
| 우측 패널 | translateX `distance.panel` → 0, `slow`, `decelerate`. 에디터 컬럼이 밀리면 같은 duration 으로 | `normal`, `accelerate` |
| 사이드바 드로어 | translateX −100% → 0, `slow`, `decelerate` | `normal`, `accelerate` |
| 바텀시트 | translateY 100% → 0, `slow`, `decelerate` | `normal`, `accelerate` |
| 토스트 | fade + `distance.md` 위로, `slower`, `decelerate` | fade, `normal`, `accelerate` |
| 토글 블록·트리 펼침 | `grid-template-rows: 0fr → 1fr` + chevron 90° 회전, `normal`, `standard` | 같음 |
| 블록 핸들 | opacity 0 → 1, `fast`. 위치는 움직이지 않는다 | `fast` |
| 블록 드래그 | 집을 때 scale 1.02 + `shadow.lg` `fast`. 놓을 때 자리로 `normal` `standard` | |
| 블록 삽입(슬래시로) | 새 블록 fade `fast`. **밀려나는 블록은 애니메이션 없음**(레이아웃 점프를 늦추면 더 어색) | |
| 근거로 이동 | 스크롤 `slower` smooth → 도착 후 블록 `flash` 1200 | |
| AI 스트리밍 | 글자는 즉시 추가(애니메이션 없음), 커서 `stream-caret` 깜빡임 `linear` 무한, 카드 `shadow.ai` | 완료 시 커서·글로우 `normal` 로 사라짐 |
| 저장 상태 | 문구 교체는 fade `fast`. "저장 중" 스피너 `linear` | |
| 스켈레톤 | shimmer `skeleton-cycle` `linear` 무한 | |
| 리스트 아이템 추가 | fade + `distance.sm`, `normal`, 순서대로 30ms 지연(최대 8개) | |

```css
.slash-menu { transform-origin: top left; animation: nt-pop-in var(--nt-motion-duration-normal) var(--nt-motion-easing-decelerate); }
@keyframes nt-pop-in {
  from { opacity: 0; transform: translateY(calc(-1 * var(--nt-motion-distance-sm))) scale(var(--nt-motion-scale-enter)); }
  to   { opacity: 1; transform: none; }
}
.stream-caret { display: inline-block; width: var(--nt-component-ai-answer-stream-caret-width); height: 1em; background: var(--nt-component-ai-answer-stream-caret-color); animation: nt-blink var(--nt-motion-duration-stream-caret) var(--nt-motion-easing-linear) infinite; }
@keyframes nt-blink { 50% { opacity: 0; } }
```

## 4. 무엇을 애니메이션할 것인가

- `opacity`, `transform` 만. `height` 전환은 `grid-template-rows` 기법.
- 색 전환(`background-color` `color` `border-color` `box-shadow`)은 `fast`.
- **에디터 본문 텍스트는 절대 애니메이션하지 않는다.** 블록이 바뀔 때 글자가 움직이면 커서를 잃는다.
- 한 번에 움직이는 요소는 한 그룹. 패널이 열리면 에디터가 밀리는 것까지가 한 그룹이고, 그때 사이드바는 가만히 있는다.
- 스크롤 리빌은 랜딩에서만.

## 5. reduced-motion

`dist/tokens.css` 가 `prefers-reduced-motion: reduce` 에서 `fast` `normal` `slow` `slower` 를 0ms 로 바꾼다. 컴포넌트는 duration 토큰만 쓰면 자동으로 따른다. 직접 `@keyframes` 를 쓸 때는:

```css
@media (prefers-reduced-motion: reduce) {
  .reveal, .slash-menu { animation: none; opacity: 1; transform: none; }
  .stream-caret { animation: none; opacity: 1; }        /* 커서는 정지 상태로 보인다 */
  .nt-doc .nt-flash { animation: none; background: var(--nt-component-citation-source-flash-bg); }  /* flash 는 정지 하이라이트로 남기고 다음 클릭에 지운다 */
}
```
스켈레톤 shimmer 는 정지 단색.

## 6. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `transition: all 0.3s ease` | 속성 명시 + 토큰 |
| 블록 삽입 시 아래 블록들이 밀리는 애니메이션 | 즉시. 새 블록만 fade |
| 타이핑할 때 저장 상태가 튀는 애니메이션 | 문구 fade `fast` 만 |
| AI 답변 글자가 타자기처럼 한 글자씩 | 청크 도착 즉시 추가. 커서만 깜빡 |
| 근거로 이동 후 하이라이트가 영원히 | `flash` 1200 후 사라짐(reduced-motion 이면 정지 후 다음 클릭에 지움) |
| 모달 열림·닫힘 같은 속도 | 열림 300 / 닫힘 200 |
| 카드 hover `scale(1.05)` | `translateY(-1px)` + 그림자 한 단계 |
| `height: 0 → auto` | `grid-template-rows: 0fr → 1fr` |
| `spring` 으로 패널 등장 | 패널은 `decelerate` |
