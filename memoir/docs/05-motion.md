# 05 · 모션 (memoir)

종이가 미끄러지고 겹치듯. 튀지 않고, 흔들리는 건 오류일 때뿐이다. 기존 `globals.css` 의 네 애니메이션을 토큰으로 옮겼다.

## 1. duration · easing
| 토큰 | ms | easing | 언제 |
|---|---|---|---|
| `fast` | 150 | `in-out` | hover 면 전환(리스트 항목 흰 면), 칩 활성, 체크 |
| `normal` | 200 | `ease` | fade-in(기존 0.2s), 드롭다운, 툴팁, 토스트 |
| `slide` | 250 | `out` | 캘린더 패널·상세 패널 slide-in-right(기존) |
| `slow` | 300 | `out` | 모달·바텀시트 slide-up(기존), 페이지 전환 |
| `shake` | 400 | `ease` | 2FA·비밀번호 오류 흔들림(기존, 진폭 6→4px) |
| `lock` | 600 | `out` | 보안 메모 잠금 해제: 블러 8→0 + 불투명도 .5→1 |
| `skeleton-cycle` | 1600 | linear | shimmer |
| `blob` | 18000 | in-out 무한 | 랜딩 블롭 부유 |

퇴장은 진입보다 짧게(`normal` 200, `in`).

## 2. 규격
| 컴포넌트 | 진입 | 퇴장 |
|---|---|---|
| 카테고리 드롭다운 | fade + 4px 아래로, `normal`, `ease` | fade `fast` |
| 모달(Modal·Prompt·Wide) | 스크림 fade `normal` / 상자 fade + scale 0.98 + 16px 위로, `slow`, `out` | `normal`, `in` |
| 바텀시트(모바일 모달) | translateY 100%→0, `slow`, `out` | `normal`, `in` |
| 캘린더 날짜 패널 | translateX 100%→0, `slide`, `out` | `slide`, `in` |
| 리스트 항목 hover | 배경 → 흰 면, `fast` | |
| 카드 hover(클릭 가능) | `shadow.soft` 등장, `fast`. 이동 없음 | |
| 칩 활성 | 배경·글자 `fast` | |
| FAB hover | scale 1.04, `fast`, `out` | |
| 코드 아코디언 | `grid-template-rows 0fr→1fr`, `normal`, `out` | 같음 |
| 잠금 해제 | 블러·불투명도 `lock` | 잠금은 즉시 |
| 2FA 실패 | shake `shake` + PIN 칸 `border.danger` | |
| 저장됨 표시 | 캡션 fade `normal`, 1.5초 후 fade out | |
| 랜딩 리빌 | fade + 16px, `slow`, 뷰포트 진입 시 1회 | |

```css
.dropdown { animation: mm-fade-in var(--mm-motion-duration-normal) var(--mm-motion-easing-ease) both; }
@keyframes mm-fade-in { from { opacity: 0; transform: translateY(calc(-1 * var(--mm-motion-distance-sm))); } to { opacity: 1; transform: none; } }
.pin.is-error { animation: mm-shake var(--mm-motion-duration-shake) var(--mm-motion-easing-ease) both; }
@keyframes mm-shake { 0%,100% { transform: none; } 20% { transform: translateX(calc(-1 * var(--mm-motion-distance-shake))); } 40% { transform: translateX(var(--mm-motion-distance-shake)); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
.secure-body.is-locked { filter: blur(var(--mm-blur-locked)); opacity: var(--mm-opacity-locked); transition: filter var(--mm-motion-duration-lock) var(--mm-motion-easing-out), opacity var(--mm-motion-duration-lock); }
```

## 3. 규칙
- `opacity`·`transform`·`filter` 만. 면 색 전환은 `background-color` `fast`.
- 카드 hover 에 `translateY(-2px)` 를 쓰지 않는다. memoir 는 면이 뜨는 게 아니라 종이가 밝아지는 시스템. 그림자 soft 등장만.
- 에디터 안에서는 애니메이션 없음(블록 추가·삭제 즉시).
- 블롭은 랜딩만. 앱 화면에 무한 애니메이션 없음(스켈레톤 제외).
- reduced-motion: `tokens.css` 가 `fast` `normal` `slow` `slide` `shake` `lock` 을 0 으로. shake 대신 PIN 칸 빨간 밑줄 + 문구가 오류를 알린다.

## 4. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `transition: all .3s ease` | 속성 명시 + 토큰 |
| 카드 hover 떠오름·확대 | 그림자 soft 만 |
| 모달 bounce | `out` |
| 리스트 항목 순차 등장 20개 | 8개까지 |
| 잠금 해제 즉시 | 600ms 블러 걷힘(보안 구역 진입감) |
