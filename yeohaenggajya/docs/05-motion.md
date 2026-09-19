# 05 · 모션 (여행가쟈)

모션은 두 얼굴이다. **UI 는 도장처럼 짧고 단단하게**(180/320), **가챠 연출은 캡슐이 살아 있듯**(흔들림·부유·홀로). 새 keyframe 은 원본 `effects.css` 에만 모은다. `prefers-reduced-motion` 전역 가드가 모든 animation·transition 을 1ms 로 줄인다.

## 1. duration
| 토큰 | ms | 언제 | 원본 |
|---|---|---|---|
| `fast` | 180 | hover·눌림·꺾쇠 회전·칩 활성·탭 밑줄 | `--dur-fast` |
| `normal` | 320 | 등장·페이드·시트·다이얼로그·상태 변화 | `--dur-norm` |
| `flip` | 700 | 카드 뒤집기 | `--dur-flip` |
| `arrive` | 700 | 캡슐·카드 등장(capArrive) | |
| `fade-in` | 400 | 코스 항목 등장(cpFadeIn) | |
| `float` | 3600 | 홈 캡슐 부유 한 주기 | appCapsuleFloat |
| `shake-soft` / `-strong` / `-vivid` | 3200 / 2600 / 2200 | 캡슐 흔들림 주기(대부분 정지, 끝에 흔들) | capShake* |
| `pulse` | 2000 | legendPulse·fxPulse | |
| `holo-shift` | 3000 | 호일 광택 이동 | holoShift |
| `holo-rotate` | 8000 (Unique 16000) | 무지개 회전 | holoRotate |
| `twinkle` | 1600 | 별빛 | fxTwinkle |
| `prelude` | 3000 | 캡슐의 여정(결정 2s → 여정 3~5s → 공개 1~2s) | |
| `toast` | 2800 | 토스트 유지 | |
| `instant` | 1 | reduced-motion 가드 값 | |

## 2. easing
| 토큰 | 값 | 언제 |
|---|---|---|
| `out` | cubic-bezier(0.2, 0.8, 0.2, 1) | 기본 전부. --ease-out |
| `in-out` | (0.4, 0, 0.2, 1) | 부유·색 전환 |
| `in` | (0.4, 0, 1, 1) | 사라짐 |
| `linear` | | holoRotate·holoShift |

## 3. UI 규격
| 컴포넌트 | 동작 |
|---|---|
| 버튼 눌림 | `translate(1px,1px)` + 그림자 3→1, `fast`. hover 는 색만(deep) |
| 칩 활성·탭 밑줄 | 색·밑줄 `fast` |
| 꺾쇠(paper-bar) | rotate 45 ↔ −135, `fast` |
| 시트 | translateY 100%→0, `normal`, `out`. 스크림 fade `normal` | 
| 다이얼로그(`<dialog>`) | fade + scale .96, `normal` | 
| 드롭다운 | fade + 4px, `normal` |
| 토스트 | fade + 8px 위로, `normal`; 2.8초 후 fade `fast` |
| 탭 전환(도감 4탭) | 패널 fade `normal`. 슬라이드 없음 |
| 리스트 항목 등장(코스) | cpFadeIn 400: opacity 0→1, 8px 위로. 순차 60ms, 8개까지 |
| 페이지 전환 | 없음(즉시). 셸이 유지되므로 콘텐츠만 교체 |
| 도감 셀 수집 | 셀 fade + 도장 찍힘(scale 1.2→1, `fast`) |
| 스켈레톤 | 펄스 없음 — hanji-2 단색 정지(종이는 깜빡이지 않는다) |

## 4. 가챠 연출 규격 (등급별 강도)
| 등급 | 캡슐 motion | 흔들림 | 연출 플래그 | 홀로 |
|---|---|---|---|---|
| Common | `soft` | rotate ±3, 3200 주기 | 없음 | 없음 |
| Rare | `soft` | ±3 | foil(파랑 글로우 약) | sheen 3s |
| Epic | `strong` | ±5 + translateY −2, 2600 | aura + foil | sheen |
| Legendary | `vivid` | ±7 + scale 1.02, 2200 | aura + rays + foil + pulse(legendPulse) | rainbow 8s |
| Unique | `vivid` (차분) | ±7 이지만 진폭 느리게 | aura(보라) + 느린 홀로 | rainbow 16s, 정적인 빛 |
| Moment | `soft` | ±3 | foil(은빛) | sheen |

3막: **결정**(0~2s 큰 버튼·햅틱) → **여정**(3~5s 캡슐 흔들림, 등급색이 언뜻 비침 = prelude) → **공개**(1~2s capArrive 캡슐 개봉 → 카드 flip 700 → BannerRank). 첫 뽑기는 스킵 불가, 이후 "건너뛰기" ghost.

```css
.capsule--soft   { animation: capShakeSoft   var(--yg-motion-duration-shake-soft)   var(--yg-motion-easing-out) infinite; }
.capsule--strong { animation: capShakeStrong var(--yg-motion-duration-shake-strong) var(--yg-motion-easing-out) infinite; }
.capsule--vivid  { animation: capShakeVivid  var(--yg-motion-duration-shake-vivid)  var(--yg-motion-easing-out) infinite; }
.capsule--arrive { animation: capArrive var(--yg-motion-duration-arrive) var(--yg-motion-easing-out) both; }
.home-capsule    { animation: appCapsuleFloat var(--yg-motion-duration-float) var(--yg-motion-easing-in-out) infinite; }
.card { transition: transform var(--yg-motion-duration-flip) var(--yg-motion-easing-out); transform-style: preserve-3d; }
.card.is-open { transform: rotateY(180deg); }
```

## 5. 규칙
- `opacity`·`transform`·`box-shadow`(펄스만) 만. `height`·`top` 금지.
- 흔들림 keyframe 은 주기의 대부분(70~88%)이 정지다. 계속 흔들리면 불안하다.
- 홈 캡슐 부유는 10px, 3.6s. 더 크면 장난감처럼 보인다.
- 연출 keyframe(holo*, cap*, fx*, legendPulse)은 `data-tone="dark"` 화면 또는 홈 캡슐에서만. 리스트·도감에서 캡슐이 흔들리지 않는다(Legendary 셀 펄스만 예외).
- 숫자 카운트업 없음(남은 횟수·도감 %).
- 다크패턴 금지: 연출로 시간을 끌지 않는다(공개 1~2s), "한 번 더" 강요 애니메이션 없음.

## 6. reduced-motion
원본 `effects.css` 전역 가드가 모든 animation/transition 을 1ms 로 만든다. 토큰 `motion.duration.instant` 도 1ms. 새 애니메이션은 자동 보호되지만 **연출의 정보(등급)는 색·라벨로 전달**되어야 한다 — 흔들림이 없어도 BannerRank 와 풀네임이 등급을 말한다. 캡슐 개봉은 즉시 카드 표시.

## 7. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| hover 로 그림자 커짐·떠오름 | 색만. 눌림에서 1px 이동 |
| 스켈레톤 shimmer | hanji-2 정지 |
| 페이지 슬라이드 전환 | 즉시 |
| 도감에서 캡슐 흔들림 | 홈·무대만 |
| Unique 를 Legendary 처럼 요란하게 | 느린 홀로, 정적 빛 |
| 연출 5초 넘기기 | 공개 1~2s |
| `transition: all` | 속성 명시 |
| 컴포넌트 모듈에 새 keyframe | `effects.css` 에 모으고 사용만 |
