# 01 · 색 (Ttakkari)

## 1. 출발점: 사용자가 준 시드

처음 받은 `:root`·`.dark` 변수 13개가 이 시스템의 정본이다. 값은 하나도 바꾸지 않았다(테스트가 막는다).

| 시드 변수 | 라이트 | 다크 | 토큰 | 이 시스템에서의 자리 |
|---|---|---|---|---|
| `--background` | `#F4F4ED` | `#080705` | `brand.paper` · `brand.ink` | `color.surface.canvas` |
| `--foreground` | `#080705` | `#F4F4ED` | `brand.ink` · `brand.paper` | `color.text.primary` |
| `--primary` | `#296EB4` | `#296EB4` | `brand.blue` = `blue.600` | `color.action.primary.bg` |
| `--accent` | `#00F0B5` | `#00F0B5` | `brand.mint` = `mint.300` | `color.agent.on-ink` · `accent.mint` |
| `--accent-soft` | `#6DECAF` | `#6DECAF` | `brand.mint-soft` | `color.highlight.mark` |
| `--surface` | `#FFFFFF` | `#171B1C` | `seed.surface` · `seed.dark-surface` | `color.surface.default` |
| `--surface-muted` | `#E9ECE8` | `#22292A` | `seed.surface-muted` · `seed.dark-surface-muted` | `color.surface.muted` |
| `--border` | `#D6DCD7` | `#30383A` | `seed.border` · `seed.dark-border` | `color.border.default` |
| `--text-muted` | `#59645F` | `#A6B0B8` | `seed.text-muted` · `seed.dark-text-muted` | `color.text.tertiary` |

시드 이름으로 이미 짠 코드는 `dist/aliases.css` 를 `tokens.css` 다음에 로드하면 그대로 돈다(§2). 새 코드는 `--tk-*` 를 쓴다.

### 방향: 종이 위 지시서, 잉크 위 기계의 답

Ttakkari 는 "내 컴퓨터의 심부름꾼"이다. 사람은 지시하고, 에이전트는 일하고 결과물을 내놓는다. 색이 할 일은 세 가지였다.

1. **누가 말하는지 한눈에.** 사람의 행동(지시·선택·승인)은 **Blue**, 에이전트의 존재(실행 중·완료·도착)는 **Mint** 다. 사용자 말풍선은 파란 기운의 면이고 에이전트 본문에는 말풍선이 없다(결과가 주인공).
2. **사람이 읽는 것과 기계가 내놓는 것을 가른다.** 메시지·문서는 종이(Paper)와 잉크 글자(Ink), 코드·로그·터미널 출력은 두 테마 모두 어두운 **잉크 면**(`color.ink.*`)이다. 이 대비가 첫 번째 시각 규칙이다.
3. **민트가 놓일 자리를 만든다.** 민트는 종이 위에서 글자가 될 수 없다(1.35:1). 그래서 잉크 면·아바타·로고·상태 점에 쓰고, 그 위에서 커서와 `ok` 로그가 된다. 밝은 면에서 민트의 의미가 필요한 글자는 `mint.700`(`text.agent`)으로 내린다.

피한 것: 민트 글로우와 네온 그라데이션(흔한 'AI 제품'), 검정 바탕 + 형광 초록 해커 톤, 보라 그라데이션.

## 2. 시드 별칭

`dist/aliases.css` 가 시드 이름을 토큰에 잇는다. 토큰이 테마마다 바뀌므로 별칭은 한 벌이다.

```css
:root { --background: var(--tk-color-surface-canvas); --primary: var(--tk-color-action-primary-bg); --accent: var(--tk-color-accent-mint); … }
```

시드처럼 `.dark` 클래스를 `<html>` 에 붙여도 다크가 된다(`:root.dark`). `data-theme="dark"` 와 같은 결과다.

## 3. 램프 7종

`tokens/scripts/palette-from-anchors.mjs` 가 OKLCH 로 만든다. 앵커 hex 는 지정 단계에 그대로 박힌다.

| 램프 | 앵커 | 역할 | 흰 면·종이 위 글자 최소 단계 |
|---|---|---|---|
| blue | 600 = `#296EB4` | 사람의 행동·정보·링크 | 600(4.77). 링크·브랜드 글자는 **700**(띠 면에서도 4.5) |
| mint | 300 = `#00F0B5` | 에이전트·성공·표 파일 | **700**. 300 은 종이 위 1.35 |
| sage | 700 = `#59645F` | 라이트 중립(글자·선·면) | 700(5.57) = tertiary |
| graphite | 900 = `#30383A` | 다크 중립·잉크 면 | 다크 글자는 200·300 |
| red | 600 = `#C93A35`(보강) | 실패·차단·파괴 | 600(4.59)·글자는 700 |
| amber | 400 = `#E39B2D`(보강) | 승인 필요·주의·발표 파일 | 글자는 700·800. 400 은 면 전용(2.11) |
| plum | 600 = `#7E57B8`(보강) | 이미지 파일·별도 정책 범위 | 600(4.82)·글자는 700 |

- **sage 와 graphite 가 따로 있는 이유.** 시드의 라이트 중립(#E9ECE8·#D6DCD7·#59645F)은 녹회색(h≈140~167)이고, 다크 중립(#171B1C·#30383A·#A6B0B8)은 청회색(h≈207~242)이다. 하나로 뽑으면 한쪽 테마가 시드와 어긋난다. 채도 곡선도 시드를 따라 직접 정했다(`ramp.mjs` 의 `sage`·`graphite`).
- sage 에는 75 단계(L .955)가 더 있다. 종이(L .965)와 시드 surface-muted(L .940) 사이 띠 면이다.
- graphite 에는 925·975 가 더 있다. 다크의 캔버스(ink) < 띠(975) < 카드(시드) < 떠 있는 면(시드 muted) 순서를 만든다.
- 보강색 hue: red 27°·amber 72°(45° 차이, 주의와 위험이 섞이지 않는다), plum 300°(blue 252° 와 48° 차이).
- `dark-tint.*` 는 다크 상태 면 전용 생성값이다. 각 색을 다크 카드 면(#171B1C)에 18% 섞었다. 화면 코드가 직접 쓰지 않는다(12 §2).

## 4. 세 계층

```
원시(램프·시드)        시맨틱(역할)                      컴포넌트
blue.600 #296EB4  →  color.action.primary.bg     →  .tk-button--primary
mint.300 #00F0B5  →  color.agent.on-ink          →  .tk-log__lines > [data-live] 커서
seed.dark-surface →  color.ink.bg                →  component.code-block.bg
```

화면 코드는 시맨틱(또는 컴포넌트)만 쓴다. 원시를 쓰면 다크에서 깨진다.

## 5. 시맨틱 그룹

### surface: 면
| 토큰 | 라이트 | 다크 | 언제 |
|---|---|---|---|
| `canvas` | paper | ink | body·스레드 |
| `subtle` | sage.75 | graphite.975 | 사이드바·뷰어 툴바·표 머리 |
| `default` | white | #171B1C | 카드·입력·패널 |
| `raised` | white + 그림자 | #22292A | 메뉴·다이얼로그·시트 |
| `muted` | #E9ECE8 | #22292A | 칩·중립 배지·스켈레톤 |
| `sunken` | #E9ECE8 | graphite.975 | 트랙(손잡이가 트랙보다 밝아야 한다) |
| `brand-subtle` | blue.50 | dark-tint.blue | 사용자 말풍선·선택 |
| `agent-subtle` | mint.50 | dark-tint.mint | 방금 도착·실행 중 |
| `inverse` | graphite.950 | sage.100 | 툴팁 |

면 쌓기: canvas → default(테두리로 구분) → raised(그림자·밝기로 구분).

### text: 글자
`primary`(18.23:1) · `secondary`(sage.800) · `tertiary`(시드 text-muted, **하한**, 시각·용량) · `link`/`brand`(blue.700) · `agent`(mint.700, 다크는 민트 원색) · `success`(mint.700) · `warning`(amber.700) · `danger`(red.700) · `on-brand`(white).

### border
`subtle`(행 구분) · `default`(카드·패널, 시드) · `strong`(입력 경계 3:1) · `brand`(선택) · `agent`(도착·실행 중) · `danger` · `focus`.

### action: 버튼 variant 는 넷
primary(화면당 1) · secondary(기본) · ghost(도구) · danger(파괴). primary hover 는 두 테마 모두 **어두워진다**(blue.700). 밝게 하면 흰 글자 대비가 떨어진다.

### status: 피드백 5종
info(Blue) · success(**Mint**, 에이전트가 해낸 것) · warning(amber) · danger(red) · neutral. 각각 `bg border text icon solid on-solid`. `warning.solid` 위 글자는 ink(흰 글자 금지).

### Ttakkari 도메인 그룹
| 그룹 | 무엇 | 상세 |
|---|---|---|
| `agent.*` | 에이전트의 존재: live 점, 잉크 위 민트, 아바타, 이름표 | 07·08 |
| `run.*` | 작업 수명 주기 6상태 | 08 |
| `policy.*` | File Broker 판정 4종 | 09 |
| `filetype.*` | 결과물 계열 7종 타일 | 09 |
| `ink.*` | 잉크 면: 코드·로그·diff·커서·인라인 코드 | 08·09 |
| `viewer.*` | 책상·페이지·HTML 바탕·체커·표 머리 | 09 |
| `highlight.*` | 연민트 형광펜·현재 히트 | 09 |
| `presence.*` | Mac Studio 연결 점 | 10 |

### 잉크 면이 브랜드를 쓰는 방법
| 구문·로그 | 토큰 | 값 | 이유 |
|---|---|---|---|
| keyword | `ink.keyword` | blue.300 | Blue 의 밝은 단계 |
| string | `ink.string` | Mint Soft | 시드 accent-soft 그대로 |
| function | `ink.function` | amber.300 | |
| type | `ink.type` | plum.300 | |
| 커서·`ok`·diff 추가 | `ink.caret` · `log-ok` · `added-sign` | **Mint 원색** | 에이전트가 쓰는 자리 |
| tool 호출 | `ink.log-tool` | blue.300 | 에이전트가 사람 대신 누른 도구 |

전부 잉크 면 위 4.5:1 이상(빌드 검사).

## 6. 조합 규칙

1. **한 화면의 색상(hue)은 넷까지**: 중립 + Blue + Mint + (상태 하나). 잉크 면·파일 글리프는 예외.
2. **채도 높은 면은 작게**: 버튼·배지·점·글리프 타일. 큰 면은 `subtle`·`brand-subtle`·`agent-subtle` 처럼 옅게.
3. **Blue 사람, Mint 에이전트, amber 대기, red 실패, plum 별도 정책.** 바꿔 쓰지 않는다.
4. **텍스트 4.5:1, 아이콘·경계·점·줄 번호 3:1.** 빌드가 510쌍(라이트·다크)을 검사한다. 새 조합은 `build.mjs` 의 `PAIRS` 에 넣는다.
5. **다크는 시맨틱이 처리한다.** 컴포넌트에 `dark:`·`prefers-color-scheme` 분기를 쓰지 않는다(12).

## 7. 글로우·그라데이션이 없는 이유

민트는 빛나는 색이라 글로우를 얹고 싶어진다. 얹는 순간 흔한 'AI 제품'이 된다. 민트의 힘은 **잉크 면 위의 작은 면적**에서 나온다(커서·점·로고). 유일한 그라데이션은 기능적 페이드(긴 코드 접힘, 컴포저 트레이)이고 같은 색에서 투명으로 간다.

## 8. 원시 램프를 직접 써도 되는 경우

- 브랜드 자산 스크립트·manifest·OG 이미지처럼 **다크 모드가 없는 정적 산출물**.
- **테마를 따르면 안 되는 면**: 브랜드 히어로 위 흰 글자(`--tk-base-white`), 다크에서도 흰 종이인 PDF 페이지 안 글자(`--tk-brand-ink`). 이때도 변수로.
- 차트 시리즈가 `chart.categorical` 6개를 넘을 때. 먼저 차트를 나눈다.

## 9. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `color: #00F0B5` 로 '실행 중' 글자 | `text.agent`(mint.700) + live 점 |
| 민트 테두리 버튼으로 에이전트 행동 강조 | 버튼은 Blue(사람이 누른다). 에이전트 표시는 점·배지 |
| 성공을 Blue 로 | 성공은 Mint(`status.success`) |
| 승인 필요를 빨강으로 | amber(`run.waiting`·`policy.approval`). 빨강은 이미 막힌 것 |
| 코드 블록을 라이트에서 흰 면으로 | 항상 `ink.bg`. 인라인 코드만 밝다 |
| 순검정 대신 다른 검정 | `text.primary` 는 시드 ink(#080705) 그대로 |
| 회색 캡션 `#999` | `text.tertiary`(시드 #59645F) |
| primary 버튼 둘 | 하나는 secondary |
| 민트 글로우로 'AI 느낌' | 없음 |
