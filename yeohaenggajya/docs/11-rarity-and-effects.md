# 11 · 등급 시스템·연출 (여행가쟈) — 이 시스템의 "데이터 시각화"

여행가쟈에 차트는 도감 진행 막대뿐이다. 대신 **등급(발견의 결)과 그 연출**이 데이터를 시각화한다. 원본 `references/rarity-system.md` 가 정본(등급 산식·확률은 거기). 여기는 시각 규격.

## 1. 원칙
- 등급은 **카드에 붙지 지역에 붙지 않는다.** 같은 지역도 시기에 따라 다른 등급.
- 등급은 **서열이 아니라 발견의 결.** "높을수록 좋은 지역"으로 읽히는 카피·정렬 금지. 도감 정렬은 방문순·지도·계절·동행자.
- 표기는 **풀네임 + 한국어명**. 단일 알파벳 금지. Unique 는 지역명에 시즌 키워드 필수.
- 위계는 색이 아니라 **광택**으로 읽힌다: Legendary 만 금박, Moment 는 은박, 나머지는 단청 선.

## 2. 등급 6종 — 시각 규격
| 등급 | 한국어명 | 한자 | accent | text(한지) | 연출 | 캡슐 motion | 카드 |
|---|---|---|---|---|---|---|---|
| Common | 보통의 발견 | 常 | #8A7960 | ink-2 | 없음 | `soft` | 종이톤 프레임, 글로우 없음 |
| Rare | 숨겨진 발견 | 隱 | 파랑 #2A5E8C | 파랑 | 파란 글로우 약 + foil | `soft` | 파랑 프레임 |
| Epic | 운명의 발견 | 運 | 빨강 #C8362E | red-deep | 빨강 글로우 + 호일 | `strong` | 빨강 프레임 + visitorNote |
| Legendary | 전설의 발견 | 傳 | 금 #E8C44E | ink(한지) / holo.yellow(무대) | 금 + 무지개 홀로 + legendPulse | `vivid` | 금 프레임 + `shadow.foil` + visitorNote |
| Unique | 유일한 발견 | 唯 | 보라 #4A3A6E | 보라 | 보랏빛 aura, 느린 홀로(16s), 정적 | `vivid`(차분) | 보라 프레임 + 시즌 키워드 + visitorNote |
| Moment | 찰나의 발견 | — | 월백 #9FB3C0 | ink-2 | 은빛 sheen | `soft` | 은박 프레임 |

**Legendary vs Unique**: 전자는 축제의 폭발적 화려함, 후자는 비수기의 고요한 발견. 둘 다 정점이지만 결이 다르다. Unique 를 시끄럽게 만들지 않는다.

## 3. 어디에 등급색이 닿는가 (닿지 않는 곳이 더 중요)
| 닿는 곳 | 닿지 않는 곳 |
|---|---|
| 카드 프레임 3px | 카드 배경(항상 한지) |
| 캡슐 띠·베이스 테두리 | 캡슐 돔 |
| 도감 셀 프레임 2px | 셀 배경·일러스트 |
| RarityBadge 글자·테두리 | 본문 문장 |
| BannerRank 글로우 | 버튼 |
| 프로그레스 채움(등급 세트) | 리스트 행 배경 |
| 연출 aura/foil/rays(무대) | 한지 화면 어디든 |

## 4. 연출(EffectStage) 조합
| 등급 | aura | rays | foil | pulse | 홀로 | `--fx-color-a` / `-b` |
|---|---|---|---|---|---|---|
| Common | | | | | | — |
| Rare | | | ✓(약) | | sheen 3s | holo.blue / hanji.bright |
| Epic | ✓ 빨강 | | ✓ | | sheen | holo.red / holo.yellow |
| Legendary | ✓ 금 | ✓ 12개 | ✓ | ✓ legendPulse 2s | rainbow 8s | holo.yellow / holo.red |
| Unique | ✓ 보라(blur 넓게) | | ✓ 느림 | | rainbow 16s 정적 | holo.plum / holo.blue |
| Moment | | | ✓ 은빛 | | sheen | moon-white / hanji.bright |

3막 타이밍 05 §4. 차이는 **눈에 띌 만큼 분명**해야 한다 — Rare 와 Epic 이 구분되지 않으면 실패.

## 5. 카드 앞면 데이터 요소
| 요소 | 스타일 | 규칙 |
|---|---|---|
| 등급 라벨 | `rank` Cinzel 12 + 한국어명 mono-sm | 좌상단 |
| 카드 번호 | `mono-sm` `NO.0001` | 우상단 |
| 지역명 | `heading-xl` 28 | 한자 1곳 허용. Unique 시즌 키워드 앞에 |
| 한 줄 인용 | `brush` 24 rotate −1.5 | "진흙 위에 빛나는 여름" |
| visitorNote | `mono-sm` + 등급 단청선 위 | Epic+ 만. 없으면 미렌더. "한 해 7만 7천 명만 다녀간 곳" — 희소성이지 서열 아님 |
| 동행자 아바타 | 32 원형 최대 3 | 있으면 |
| 오방색 띠 | 하단 6 | 항상 |

## 6. 도감 진행(유일한 차트)
- **meter**: 헤더 아래 막대 8(트랙 hanji-2, 채움 빨강) + `보유 / 전체` mono + "다음 한 걸음" body-sm + 통계 4개(도감 %·뽑은 카드·완주 세트·방문 인증) mono 12/700 + 라벨 ui-sm.
- **세트 카드**(`.setcard`): 남은 장수 먼저("3장 남음" title) → 막대 4 → 정렬: 거의 다 온 것 → 진행 중 → 완주 → 미시작. 완주를 맨 위에 두지 않는다(트로피 진열장 금지).
- 등급별 개수 분포는 막대 5개(등급 accent 채움) 가로, 값 라벨 mono. 파이 없음.
- 도감 %: 링 없음, 막대.
- `role="progressbar"` + `aria-valuenow/max`, 숫자 병기.

## 7. 확률 안내 화면
`doc` 720. 등급 5행 표: 등급(RarityBadge) · 한국어명 · 의미 · 확률(mono, 소수 1자리 %) · 근거(비인기도·축제·시즌 한 줄). 표 헤더 hanji-2, 선 hanji-deep. "등급은 여행지의 점수가 아니에요" heading-sm 히어로. 데이터 공백 시 행 자체 생략.

## 8. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `rank="C"`, seal "L" | 풀네임 + 한자 도장 |
| 등급순 정렬·"최고 등급!" | 방문순·계절, "전설의 발견이에요" |
| 카드 배경 등급색 | 프레임·띠·글로우 |
| Unique 를 Legendary 처럼 | 고요·느린 홀로 |
| 한지 위 금 글자 | ink 글자 + 금 테두리 |
| visitorNote 빈 자리 "정보 없음" | 요소 미렌더 |
| 지역에 등급 고정 | 카드 인스턴스마다 등급 |
| 도감 셀에 연출 | Legendary foil 펄스만 |
