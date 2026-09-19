# 05 · 모션 (memoir)

종이가 미끄러지고 겹치듯. 튀지 않고, 흔들리는 건 오류일 때뿐이다. 모션은 상태 변화를 설명할 때만 쓴다. 기존 `globals.css` 의 네 애니메이션(slide-in-right·slide-up·fade-in·shake)을 토큰으로 옮겼다.

## 1. duration
| 토큰 | ms | 언제 |
|---|---|---|
| `instant` | 0 | reduced-motion 대체값 |
| `fast` | 150 | hover 면 전환(리스트 항목 흰 면), 칩 활성, 체크, 버튼 눌림, 세그먼트 이동, FAB hover |
| `normal` | 200 | **기본**. fade-in(기존 0.2s), 드롭다운·⋯ 메뉴·슬래시 메뉴·툴팁·토스트 진입, 아코디언, 페이지 콘텐츠 전환 |
| `slide` | 250 | 캘린더 패널·상세 패널 slide-in-right(기존) |
| `slow` | 300 | 모달·바텀시트 slide-up(기존), 와이드 모달 |
| `shake` | 400 | 2FA·비밀번호 오류 흔들림(기존) |
| `lock` | 600 | 보안 메모 잠금 해제: 블러 8→0 + 불투명도 .5→1 |
| `skeleton-cycle` | 1600 | shimmer |
| `toast` | 3000 | 정보 토스트 유지(오류·액션 6000) |
| `blob` | 18000 | 랜딩 블롭 부유 한 주기 |

퇴장은 진입보다 짧게: 모달 300 → 200, 패널 250 → 200, 드롭다운 200 → 150.

## 2. easing
| 토큰 | 값 | 언제 |
|---|---|---|
| `out` | cubic-bezier(0.22, 1, 0.36, 1) | 등장·이동 전부(기존 slide 계열) |
| `in-out` | cubic-bezier(0.4, 0, 0.2, 1) | 색·면 전환, 블롭 |
| `in` | cubic-bezier(0.4, 0, 1, 1) | 사라짐 |
| `ease` | cubic-bezier(0.25, 0.1, 0.25, 1) | 기존 fade-in·shake |
| `linear` | | 스피너·shimmer |

## 3. 진입·퇴장 규격
| 컴포넌트 | 진입 | 퇴장 |
|---|---|---|
| 카테고리 드롭다운·⋯ 메뉴·슬래시 메뉴 | fade + 4px 아래로, `normal`, `ease`. 기준점 트리거 | fade `fast` `in` |
| 툴팁 | fade `fast` | 즉시 |
| 모달(Modal·Prompt·Wide) | 스크림 fade `normal` / 상자 fade + scale 0.98 + 16px 위로, `slow`, `out` | `normal`, `in` |
| 바텀시트 | translateY 100%→0, `slow`, `out` | `normal`, `in` |
| 캘린더 날짜 패널·상세 패널 | translateX 100%→0, `slide`, `out` | `slide`, `in` |
| 검색 오버레이(모바일) | fade + 인풋 포커스, `normal` | `fast` |
| 리스트 항목 hover | 배경 → 흰 면 `fast` `in-out` | |
| 카드 hover(클릭 가능) | `shadow.soft` 등장 `fast`. 이동·확대 없음 | |
| 칩 활성 | 배경·글자 `fast` | |
| FAB hover / 숨김 | scale 1.04 `fast` `out` / scale 0 + fade `fast` | |
| 코드 아코디언 | `grid-template-rows 0fr→1fr`, `normal`, `out` | 같음 |
| 잠금 해제 | 블러·불투명도 `lock` `out` | 잠금은 즉시 |
| 2FA 실패 | shake `shake` `ease` + PIN 밑줄 red | |
| 저장됨 표시 | 캡션 fade `normal`, 1.5초 후 fade out | |
| 새 카드 생성 | 목록 상단 fade + 4px `normal` | 삭제는 fade `fast` + 아래 항목 위로 `normal` |
| 에디터 블록 드래그 | 들어올릴 때 `shadow.soft` `fast`, 드롭 라인 즉시 | |
| 페이지(카테고리) 전환 | 콘텐츠 fade + 4px `normal` | 즉시 |
| 랜딩 스크롤 리빌 | fade + 16px `slow` `out`, 뷰포트 20% 진입 시 1회 | |
| 블롭 | translate/scale 미세 부유 `blob` `in-out` 무한 alternate | |

```css
.dropdown { animation: mm-fade-in var(--mm-motion-duration-normal) var(--mm-motion-easing-ease) both; }
@keyframes mm-fade-in { from { opacity: 0; transform: translateY(calc(-1 * var(--mm-motion-distance-sm))); } to { opacity: 1; transform: none; } }
.modal { animation: mm-modal-in var(--mm-motion-duration-slow) var(--mm-motion-easing-out) both; }
@keyframes mm-modal-in { from { opacity: 0; transform: translateY(var(--mm-motion-distance-lg)) scale(var(--mm-motion-scale-enter)); } to { opacity: 1; transform: none; } }
.panel { animation: mm-slide-in-right var(--mm-motion-duration-slide) var(--mm-motion-easing-out) both; }
@keyframes mm-slide-in-right { from { transform: translateX(var(--mm-motion-distance-panel)); opacity: 0; } to { transform: none; opacity: 1; } }
.pin.is-error { animation: mm-shake var(--mm-motion-duration-shake) var(--mm-motion-easing-ease) both; }
@keyframes mm-shake { 0%,100% { transform: none; } 20% { transform: translateX(calc(-1 * var(--mm-motion-distance-shake))); } 40% { transform: translateX(var(--mm-motion-distance-shake)); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
.secure-body { transition: filter var(--mm-motion-duration-lock) var(--mm-motion-easing-out), opacity var(--mm-motion-duration-lock); }
.secure-body.is-locked { filter: blur(var(--mm-blur-locked)); opacity: var(--mm-opacity-locked); }
.acc { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--mm-motion-duration-normal) var(--mm-motion-easing-out); } .acc[open] { grid-template-rows: 1fr; } .acc > div { overflow: hidden; }
```

## 4. 규칙
- `opacity`·`transform`·`filter` 만. `height`·`top`·`width` 금지. 높이는 `grid-template-rows`.
- 면 색 전환은 `background-color` `fast`.
- 카드 hover 에 `translateY`·`scale` 금지. memoir 는 면이 뜨는 게 아니라 종이가 밝아지는 시스템.
- 에디터 안 텍스트 편집은 애니메이션 없음(블록 추가·삭제 즉시). 드래그만 예외.
- 무한 반복은 스켈레톤·스피너·블롭(랜딩)만. 앱 화면에 무한 애니메이션 없음.
- 한 번에 움직이는 그룹은 하나. 순차 등장은 8개까지, 30ms 간격.
- 숫자 카운트업 없음(메모 수·통계).

## 5. reduced-motion
`tokens.css` 가 `fast` `normal` `slow` `slide` `shake` `lock` 을 0 으로 내린다. 직접 쓴 `@keyframes` 는:
```css
@media (prefers-reduced-motion: reduce) {
  .dropdown, .modal, .panel, .pin.is-error, .landing-bg::before { animation: none; }
  .reveal { opacity: 1; transform: none; }
  .skeleton::after { animation: none; opacity: var(--mm-opacity-skeleton); }
}
```
shake 대신 PIN 칸 빨간 밑줄 + 문구가 오류를 알린다. 블롭은 정지 이미지처럼. 잠금 해제는 즉시(블러 0).

## 6. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `transition: all .3s ease` | 속성 명시 + 토큰 |
| 카드 hover 떠오름·확대 | `shadow.soft` 만 |
| 모달 bounce·spring | `out` |
| 리스트 20개 순차 등장 | 8개까지 |
| 잠금 해제 즉시 | 600 블러 걷힘(보안 구역 진입감) |
| 에디터 타이핑마다 애니메이션 | 없음 |
| 앱 화면 배경 블롭 부유 | 랜딩·로그인만 |
| `height: 0 → auto` | `grid-template-rows` |
