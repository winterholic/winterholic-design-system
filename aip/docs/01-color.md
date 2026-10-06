# 01 · 색 (AIP)

## 1. 출발점: Brand Palette 5색

| 이름 | hex | 토큰 | 흰 배경 대비 | 할 수 있는 일 |
|---|---|---|---|---|
| AIP Blue | `#1C77C3` | `brand.blue` = `blue.600` | 4.69 | 주 액션·포커스·활성·브랜드 면. 흰 글자를 얹을 수 있다 |
| AIP Tangerine | `#FAA381` | `brand.tangerine` = `tangerine.300` | 1.98 | 경고 면의 테두리·다이어그램 permission·코드 문자열. **글자 불가** |
| AIP Yellow | `#F5E663` | `brand.yellow` = `yellow.200` | 1.28 | 형광펜·Important·Example 탭·다이어그램 intent·코드 함수명. **글자 불가** |
| AIP Charcoal | `#3D3B30` | `brand.charcoal` = `neutral.800` | 11.25 | 라이트 테마 본문 글자 그 자체·구조선·워드마크 |
| AIP Slate | `#4D5061` | `brand.slate` = `slate.700` | 7.97 | 코드 면의 색상 기준·data 노드 |

이 5색을 화면에 그대로 칠하지 않는다. 여기서 **램프 7종 → 시맨틱 토큰**을 파생하고, 화면은 시맨틱만 쓴다.

### 방향: 제도 용지 위의 청사진

AIP 는 "복잡한 내부 동작을 명확한 규칙과 좋은 기본값 뒤에 숨기는 도구"다. 색이 해야 할 일은 세 가지였다.

1. **오래 읽는 문서가 주인공**이다. 바탕은 흰 종이, 글자는 Charcoal 잉크다. 채도 높은 면은 작게 쓴다.
2. **AIP 자체를 한 색으로** 말한다. Blue 가 주 행동·현재 위치·Runtime 을 맡는다. Blue 는 두 테마에서 같은 hex 라 테마를 건너도 같은 브랜드로 보인다.
3. **밝은 브랜드 색이 놓일 자리를 만든다**. Tangerine·Yellow 는 흰 면에서 글자가 될 수 없다. 그래서 코드 면을 Slate 계열의 어두운 면으로 고정했고, 그 위에서 두 색이 구문 강조로 산다. 흰 면에서는 형광펜(노랑)과 경고 면(탱저린)으로 쓴다.

피한 것: 보라 네온 그라데이션, 사이버펑크·크립토 계열의 검정+형광, Tailwind slate+blue 그대로의 흔한 SaaS 조합. 중립을 차가운 slate 가 아니라 **따뜻한 Charcoal** 에서 뽑은 이유가 마지막 항목이다.

## 2. 램프 7종

`tokens/scripts/palette-from-anchors.mjs` 가 OKLCH 로 만든다. 앵커 hex 는 지정 단계에 그대로 박힌다. 단계는 OKLCH 명도가 가장 가까운 칸이다.

| 램프 | 앵커 | 역할 | 흰 배경 글자 최소 단계 |
|---|---|---|---|
| blue | 600 = AIP Blue | 주색·정보·링크 | 600 (4.69). 링크·브랜드 글자는 **700** (subtle 면에서도 4.5 유지) |
| tangerine | 300 = AIP Tangerine | 경고·permission·experimental | 600 (5.10). 경고 글자는 800 |
| yellow | 200 = AIP Yellow | 형광펜·important·example | 글자로 쓰지 않는다. 노란 면 위 글자는 charcoal |
| neutral | 800 = AIP Charcoal | 글자·테두리·면 | 600 (4.96) = tertiary 하한 |
| slate | 700 = AIP Slate | 코드 면·frontend·data | 600 (4.98) |
| red | 600 = `#C62948` (보강) | 위험·오류·거부 | 600 (5.51) |
| green | 600 = `#1C8457` (보강) | 성공·허용·Tip | 600 (4.68) |

- **중립(neutral)은 `charcoal` 곡선**이다. 밝은 쪽은 거의 무채(채도 0.003)라 종이가 노랗게 뜨지 않고, 글자 쪽(L≈0.38)으로 갈수록 Charcoal 의 따뜻한 기운이 남는다.
- **neutral·slate 에는 925·975 단계가 더 있다**. 다크 테마는 캔버스·사이드바·떠 있는 면을 가르는 칸이 950 근처에 더 필요하다.
- **red 는 crimson(h≈15)**, tangerine(h≈42)과 30° 가까이 떨어져 경고(탱저린)와 위험(빨강)이 섞이지 않는다. **green 은 h≈158** 로 blue·yellow 와 50° 이상 떨어져 있다.
- `dark-tint.*` 는 다크 테마 상태 면 전용 생성값이다(10 §2). 화면 코드가 직접 쓰지 않는다.
- 단계마다 흰/검정 대비는 `tokens/src/palette.json` 의 `$extensions["aip.contrast"]` 에 있다.

## 3. 세 계층

```
원시(램프)             시맨틱(역할)                     컴포넌트
blue.600 #1C77C3   →  color.action.primary.bg    →  .aip-button--primary
yellow.200         →  color.highlight.mark       →  .aip-doc mark
slate.900          →  color.code.bg              →  component.code-block.bg
```

화면 코드는 시맨틱(또는 컴포넌트)만 쓴다. 원시를 쓰면 다크에서 깨진다.

## 4. 시맨틱 그룹

### surface: 면
| 토큰 | 라이트 | 다크 | 언제 |
|---|---|---|---|
| `canvas` | white | neutral.950 | body·문서 본문 |
| `subtle` | neutral.50 | neutral.975 | 문서 사이드바·섹션 띠·표 헤더(표 래퍼)·Playground 툴바 |
| `default` | white | neutral.950 | 카드·인풋·탭 패널 |
| `raised` | white + 그림자 | neutral.925 | 드롭다운·다이얼로그·검색 |
| `sunken` | neutral.100 | neutral.975 | kbd·세그먼트 트랙·스켈레톤 |
| `inverse` | neutral.900 | neutral.100 | 툴팁 |
| `brand` | AIP Blue | AIP Blue | 랜딩 CTA 띠 |
| `brand-subtle` | blue.50 | blue.950 | 선택된 옵션·활성 항목 |

면 쌓기: canvas → default(테두리로 구분) → raised(그림자로 구분). 문서 본문 안에 카드를 만들지 않는다. 문서 안 구획은 콜아웃·코드·스펙·Example 이다.

### text: 글자
| 토큰 | 라이트 | 대비(흰) | 언제 |
|---|---|---|---|
| `primary` | AIP Charcoal | 11.25 | 본문·제목 |
| `secondary` | neutral.700 | 6.93 | 설명·메타·lead |
| `tertiary` | neutral.600 | 4.96 | 캡션·TOC·타임스탬프. **하한**. sunken 위 금지 |
| `link` / `brand` | blue.700 | 6.94 | 링크·활성 항목·eyebrow |
| `success`·`warning`·`danger`·`info` | green.700·tangerine.700·red.700·blue.700 | 6.6 이상 | 상태 문구 |
| `on-brand` | white | 4.69 | Blue 면 위 |

### border
`subtle`(행 구분) · `default`(카드·표·헤더, 장식) · `strong`(인풋·체크박스 경계, **3:1 지킴**) · `brand`(선택·활성) · `focus` · `danger`.

### action: 버튼 variant 는 네 개
| variant | 언제 | 화면당 |
|---|---|---|
| `primary` | 그 화면의 주 목적(Generate·Get started·Save) | 1개 |
| `secondary` | **기본값**. 대안·일반 행동 | 제한 없음 |
| `ghost` | 도구(복사·닫기·툴바·테마) | 제한 없음 |
| `danger` | 되돌릴 수 없는 파괴. 확인 다이얼로그 안에서 | |

Primary 의 hover 는 두 테마 모두 **어두워진다**(blue.700). 다크에서 밝게 바꾸면 흰 글자가 3.47:1 로 떨어진다.

### status: 피드백 5종
`info`(Blue) · `success`(green) · `warning`(**Tangerine**) · `danger`(red) · `neutral`. 각각 `bg border text icon solid on-solid`. `warning.solid` 는 밝은 탱저린이라 위 글자가 검정 계열이다(흰 글자 금지).

### AIP 도메인 그룹
| 그룹 | 무엇 | 상세 |
|---|---|---|
| `highlight.*` | AIP Yellow 형광펜. 본문 mark·검색 히트·Important·Example | 07 §3·§6 |
| `code.*` | Slate 코드 면 + 구문 강조 7종 + diff·강조 줄 | 07 §4 |
| `lifecycle.*` | stable·beta·experimental·deprecated | 07 §9 |
| `diagram.*` | 개념 9종(fill·stroke·text) + 선 5종 + 캔버스·격자·경계 영역 | 12 |

### 코드 색이 브랜드를 쓰는 방법
| 구문 | 토큰 | 값 | 이유 |
|---|---|---|---|
| keyword | `code.keyword` | blue.300 | AIP Blue 의 밝은 단계 |
| string | `code.string` | AIP Tangerine | 원색 그대로 |
| function | `code.function` | AIP Yellow | intent 이름이 형광펜처럼 보인다 |
| number | `code.number` | red.300 | |
| type | `code.type` | green.300 | |
| comment | `code.comment` | slate.400 (기울임) | |

전부 코드 면 위 4.5:1 이상(빌드 검사). 라이트 테마에서도 코드 면은 어둡다. 문서(종이)와 코드(slate)가 한눈에 갈리는 것이 이 시스템의 첫 번째 시각 규칙이다.

## 5. 조합 규칙

1. **한 화면의 색상(hue)은 셋까지**: 중립 + Blue + (상태색 하나 또는 형광펜). 다이어그램·코드 면은 예외.
2. **채도 높은 면은 작게**: 버튼·배지·다이어그램 노드. 큰 면은 `subtle`·`brand-subtle`·상태 `bg` 처럼 옅게. 예외는 랜딩 CTA 띠 하나.
3. **노랑은 강조, 탱저린은 경고, 빨강은 위험**. 셋을 바꿔 쓰지 않는다.
4. **텍스트 4.5:1, 아이콘·경계·마커·다이어그램 선 3:1**. 빌드가 310쌍(라이트·다크)을 검사한다. 새 조합을 화면에 만들면 `build.mjs` 의 `PAIRS` 에 넣는다.
5. **다크는 시맨틱이 처리한다**. 컴포넌트에 `dark:`·`prefers-color-scheme` 분기를 쓰지 않는다(10).

## 6. 그라데이션이 없는 이유

AIP 는 그라데이션 토큰을 두지 않는다. 브랜드 표현은 (1) 점 격자 바탕, (2) Blue 단색 면, (3) 형광펜 노랑으로 충분하다. 그라데이션을 허용하면 "흔한 AI SaaS" 로 가장 먼저 무너진다. 유일한 예외는 컴포넌트 내부의 기능적 페이드(긴 코드 접힘)이고, 이것도 `color.code.bg` 에서 투명으로 가는 같은 색이다.

## 7. 원시 램프를 직접 써도 되는 경우

- OG 이미지·PDF·이메일처럼 **다크 모드가 없는 정적 산출물**(브랜드 자산 스크립트가 유일하게 hex 를 쓴다).
- 브랜드 장식(히어로 안의 고정 어두운 면처럼 테마와 무관해야 하는 곳). 이때도 `var(--aip-neutral-950)` 처럼 변수로.
- 차트 시리즈가 `chart.categorical` 6개를 넘을 때. 먼저 차트를 나눈다.

## 8. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `color: #FAA381` 로 강조 글자 | 강조는 `<mark>`(형광펜) 또는 `text.brand` |
| 노란 배지를 경고로 | 경고는 `status.warning`(탱저린 면) |
| 링크에 원색 AIP Blue(#1C77C3) | `text.link`(blue.700). subtle·콜아웃 면에서도 4.5 유지 |
| 성공을 Blue 로 | 성공은 green. Blue 는 정보·브랜드 |
| 코드 블록을 라이트 테마에서 흰 면으로 | 코드는 항상 `code.bg`(slate). 인라인 코드만 밝다 |
| 순검정 `#000` 글자 | `text.primary`(AIP Charcoal) |
| 회색 캡션 `#999` | `text.tertiary`(#727069) |
| primary 버튼 둘 | 하나는 secondary |
| 다크 primary hover 를 밝게 | 두 테마 모두 blue.700 |
| 보라·네온 글로우로 'AI 느낌' | AIP 는 색 글로우가 없다 |
