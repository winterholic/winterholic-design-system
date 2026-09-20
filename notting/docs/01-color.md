# 01 · 색 (notting)

## 1. 왜 이 팔레트인가

coolors 후보 7개 중 **"Floral White · Black · Vibrant Coral · Verdigris · Soft Periwinkle"** 조합을 골랐고, 주색은 **Verdigris `#1EA896`** 이다.

notting 은 "Notion for humans, Markdown for tools, context for agents" — 개발자가 문서를 쓰고, Markdown 으로 꺼내고, AI 가 근거를 달아 읽는 워크스페이스다. 색이 해야 할 일이 세 가지였다.

1. **오래 읽고 쓰는 화면**이라 본문은 종이와 잉크여야 한다. 채도 높은 면은 작아야 한다.
2. **사람이 쓴 것과 AI 가 만든 것을 색으로 갈라야 한다.** "AI is a reader first" — 답변·제안·Context Pack 은 문서와 다른 색을 가져야 사용자가 출처를 헷갈리지 않는다.
3. **손실을 숨기지 않는다.** 왕복 보고서·충돌·삭제된 근거는 눈에 띄는 경고색이 필요하다.

후보 2번이 이 세 가지를 한 팔레트 안에서 다 준다. Floral White 가 종이, Black 이 잉크, Verdigris 가 행동, Periwinkle 이 AI, Coral 이 손실이다.

| 이름 | hex | 토큰 | 역할 |
|---|---|---|---|
| Floral White | `#FBFBF2` | `brand.paper` | 앱 크롬 캔버스(사이드바·패널·툴바) |
| Black | `#0A0908` | `brand.ink` | 반전 면(툴팁·토스트)·로고·오버레이. 글자는 neutral.900 |
| Verdigris | `#1EA896` | `brand.verdigris` = `teal.500` | **브랜드 주색**. 액션·선택·링크는 600·700 |
| Soft Periwinkle | `#9395D3` | `brand.periwinkle` = `periwinkle.400` | **AI·근거·Context Pack·review 상태** |
| Vibrant Coral | `#FF715B` | `brand.coral` = `coral.400` | **위험·오류·삭제·손실(dropped)** |

### 다른 후보를 안 고른 이유

| 후보 | 주색 | 이유 |
|---|---|---|
| 1 Glaucous `#507DBC` | 파랑 | 가장 안전한 "신뢰" 색이지만 winterholic-base(Steel Blue)와 구분이 안 된다. notting 이 base 의 스킨처럼 보인다 |
| 3 Petal Pink · 4 Amethyst | 분홍·보라 | 보라를 주색으로 쓰면 AI 영역에 줄 색이 없다. Linear·Obsidian 과도 겹친다 |
| 5 Neon Ice · Banana | 형광 | 대비를 맞추면 원색이 사라진다. 긴 글 화면에 맞지 않는다 |
| 6 Wheat · Dusty Rose | 따뜻한 중간톤 | 상태색(성공·경고)과 hue 가 붙어 기능색이 섞인다 |
| 7 Strawberry Red | 빨강 | 주색이 곧 오류색이 된다. 삭제 버튼과 저장 버튼이 같은 색 |

Verdigris 는 Notion(흑백)·Linear(보라)·GitHub(검정)·Obsidian(보라) 어느 것과도 겹치지 않고, 성공 초록(hue 140)과 30° 이상 떨어져 있어 상태색과 섞이지 않는다.

### 상태색 보강
후보에 없는 두 색을 더했다. 성공 **Leaf Green `#2F9E44`** (teal 과 구분되도록 노란 기운의 초록), 경고 **Marigold `#E0A100`** (검색 하이라이트·진행 중 상태와 공유). 중립은 잉크에서 뽑은 **Warm Stone** (hue 80, 채도를 1/3 로 낮춘 `stone` 곡선) — 종이 위 따뜻한 회색이다.

## 2. 세 계층 구조

```
원시(램프)               시맨틱(역할)                        컴포넌트
teal.600 #0D8273     →  color.action.primary.bg     →  component.button…
periwinkle.50        →  color.ai.bg                 →  component.ai-answer.bg
neutral.900          →  color.text.primary
```

- **화면 코드는 시맨틱만 쓴다.** `var(--nt-color-text-primary)` 처럼. 원시 `--nt-teal-600` 을 쓰면 다크모드가 깨진다.
- 원시 램프는 `tokens/scripts/palette-from-anchors.mjs` 가 OKLCH 로 생성한다. hex 를 손으로 고치지 않는다.
- 램프 단계는 50(가장 밝음)부터 950(가장 어두움)까지 11단계. 같은 단계면 색상이 달라도 체감 밝기가 비슷하다.

### 램프별 앵커와 특징

| 램프 | 앵커 | 글자로 쓸 수 있는 최소 단계(흰 배경 4.5:1) | 비고 |
|---|---|---|---|
| teal | 500 = #1EA896 | **600** (#0D8273, 4.71) | 500 은 2.96 으로 미달. 액션·포커스는 600, 글자·링크는 700 |
| periwinkle | 400 = #9395D3 | **600** (#696B9A, 5.04) | AI 버튼 600, AI 글자 700, 원색 400 은 스트리밍 커서·장식 |
| coral | 400 = #FF715B | **600** (#B24C3C, 5.26) | 위험 버튼 600, 글자 700, 원색 400 은 다크 버튼·장식 |
| neutral(stone) | 500 = #8C8984 | 600 (#72706B, 4.95) | hue 80 따뜻한 회색. canvas 위 4.75 |
| green | 500 = #2F9E44 | 600 (4.63) | 성공·무손실·diff 추가 |
| amber | 400 = #E0A100 | **700** (#755202) | 노랑은 어둡게 내려야 글자가 된다. 아이콘은 500(3.56) |

전 단계의 대비 수치는 `tokens/src/palette.json` 의 `$extensions["nt.contrast"]` 에 있다.

## 3. 시맨틱 색 — 무엇을 언제

### surface (면) — 두 세계
notting 화면은 **앱 크롬**(사이드바·패널·툴바)과 **문서**(페이지 본문·카드)로 나뉜다. 크롬은 종이(`canvas`), 문서는 흰색(`default`). 문서가 크롬보다 밝아서 눈이 자연히 글에 간다.

| 토큰 | 라이트 | 다크 | 언제 |
|---|---|---|---|
| `canvas` | paper #FBFBF2 | neutral.950 | `body`, 사이드바, 우측 패널, 페이지 툴바, 보드 컬럼 |
| `default` | white | neutral.900 | 에디터 본문, 카드, 인풋, 표, 이슈 카드 |
| `raised` | white + shadow | neutral.800 | 모달, 슬래시 메뉴, 커맨드 팔레트, 인라인 툴바, 팝오버 |
| `sunken` | neutral.100 | #181614 | 표 헤더, kbd, 세그먼트 트랙, 스켈레톤, 슬래시 메뉴 아이콘 타일 |
| `overlay` | ink 50% | black 60% | 모달 스크림 |
| `inverse` | ink | neutral.50 | 툴팁·토스트 |
| `brand` | teal.700 | teal.800 | 랜딩 CTA 섹션·온보딩 헤더·로그인 사이드 |
| `brand-subtle` | teal.50 | teal.950 | 선택된 항목·활성 탭·안내 카드 |
| `disabled` | neutral.100 | neutral.800 | 비활성 인풋 |

**면 쌓기 규칙**: canvas 위에 default, default 위에 raised. 에디터 본문 안에서 흰 카드를 또 만들지 않는다(문서 안 구획은 콜아웃 `sunken` 또는 코드 블록 `code.bg`).

### text (글자)
| 토큰 | 라이트 | 대비(흰 / 종이) | 언제 |
|---|---|---|---|
| `primary` | neutral.900 | 13.17 / 12.7 | 본문·제목. 기본 |
| `secondary` | neutral.700 | 6.96 / 6.7 | 설명·속성 값·스니펫·인용 블록 |
| `tertiary` | neutral.600 | 4.95 / 4.75 | 캡션·타임스탬프·속성 라벨·블록 핸들·경로. **하한** |
| `placeholder` | neutral.600 | 4.95 | 빈 블록·인풋 안내 |
| `disabled` | neutral.400 | 2.43 | 비활성. 대비 예외 |
| `inverse` / `on-brand` | white | | inverse·brand·primary 버튼 위 |
| `brand` | teal.700 | 6.70 | 강조 키워드·활성 탭·선택 트리 항목 글자 |
| `link` / `link-hover` | teal.700 / 800 | 6.70 / 9.44 | 문서 안 링크는 밑줄 동반 |
| `ai` | periwinkle.700 | 7.08 | "AI 답변"·"제안" 라벨, 근거 번호, Context Pack 선택 이유 |
| `success` `warning` `danger` `info` | 각 700 | 6.5 이상 | 상태 문구 |

**글자에 원시색을 쓰지 않는다.** 특히 `#1EA896` 은 2.96:1 로 AA 미달이다. 브랜드색 글자는 `text.brand`(700).
**AI 답변의 본문은 `primary` 다.** AI 색은 라벨·아이콘·면에만 쓴다. 답변 본문까지 보라색이면 읽기 힘들고, 사람이 쓴 글과 대비만 강조된다.

### border (테두리)
문서 화면은 선을 아낀다. 카드·표·코드 블록에만 `default`, 나머지는 `subtle` 또는 여백.

| 토큰 | 라이트 | 언제 |
|---|---|---|
| `subtle` | neutral.100 | 사이드바 섹션 사이, 속성 행 사이, 툴바 하단(스크롤 시) |
| `default` | neutral.200 | 카드·표·코드 블록·이슈 카드 외곽 |
| `strong` | neutral.400 | 인풋·셀렉트 |
| `input-strict` | neutral.500 | 체크박스·라디오(3:1) |
| `brand` | teal.600 | 선택·활성·현재 revision 마커 |
| `focus` | teal.600 | 포커스 링 |
| `danger` | coral.500 | 오류 인풋·손실 항목 |
| `ai` | periwinkle.300 | AI 답변 카드·패널 테두리(장식) |
| `inverse` | white 20% | 어두운 면 위 구분선 |

### action (버튼)
| variant | 언제 | 화면당 개수 |
|---|---|---|
| `primary` | 그 화면의 주 목적(저장·만들기·가져오기·내보내기 확정) | 1개 |
| `ai` | **AI 에게 시키는 것**(물어보기·Context Pack 만들기·관계 제안 보기·요약). 사람 행동과 색으로 분리 | 1개. primary 와 나란히 있어도 된다(역할이 다르다) |
| `secondary` | 대안(취소·뒤로·미리보기) | 제한 없음 |
| `ghost` | 카드·표·툴바 안의 가벼운 행동(편집·필터·복사·닫기) | 제한 없음 |
| `danger` | 되돌릴 수 없는 파괴(영구 삭제·워크스페이스 삭제·손실 감수하고 내보내기). 확인 다이얼로그 안에서만 primary 자리 | |
| `danger-ghost` | 목록 행의 삭제 아이콘 | |
| `disabled` | 조건 미충족. 이유를 툴팁으로 | |

### status (상태 피드백)
| 상태 | 언제 | 아이콘 |
|---|---|---|
| `success` | 저장됨·가져오기 완료·왕복 무손실·연결됨 | circle-check |
| `warning` | 부분 손실·근거 오래됨·오프라인·곧 만료 | triangle-alert |
| `danger` | 실패·손실·충돌 미해결·삭제됨 | circle-x |
| `info` | 안내·팁·새 기능 | info |
| `neutral` | 상태가 아닌 분류(초안·보관·태그), **"근거 부족" 응답** | 없음 |

각 상태는 `bg` `border` `text` `icon` `solid` `on-solid` 6종. `warning.solid` 는 노랑이라 **검은 글자**(`on-solid` = neutral.950).

### 도메인 그룹 — notting 전용
| 그룹 | 무엇 | 상세 |
|---|---|---|
| `ai.*` | AI 가 만든 것의 면·글자·아이콘·배지 | 15 §3 |
| `citation.*` | 근거 칩·원문 마커·'현재 아님' | 15 §3 |
| `mark.*` | 검색 히트·에디터 선택·블록 hover·드롭 인디케이터 | 06 §17 |
| `diff.*` | revision 비교·충돌 | 15 §5 |
| `workflow.*` | 이슈 상태 6종 | 15 §6 |
| `priority.*` | 이슈 우선순위 5종 | 15 §6 |
| `decision.*` | ADR 상태 5종 | 15 §7 |
| `fidelity.*` | 왕복 보고서 등급 5종 | 15 §4 |
| `code.*` | 코드 블록 배경·하이라이트 7종 | 06 §17 |

### interactive
- `focus-ring`: teal.600. 모든 포커스 가능한 요소. `typography.css` 가 `:focus-visible` 에 전역으로 건다.
- `selected-*`: 트리 항목·표 행·탭·세그먼트의 선택 상태.
- `hover-overlay` / `pressed-overlay`: 어떤 면 위에도 얹는 반투명 층. 트리 항목·표 행·슬래시 메뉴 항목 hover.

### accent (장식)
`verdigris` `periwinkle` `coral` `paper` `ink`. 그라데이션 재료, 로고, 온보딩 일러스트, 빈 상태. **글자·상태·버튼에는 쓰지 않는다.**

## 4. 색 조합 규칙

1. **한 화면에 색상(hue)은 세 개까지**: verdigris + 중립 + (AI periwinkle 또는 상태색 1). 차트·보드 컬럼 헤더는 예외.
2. **채도 높은 면은 작게**: 버튼·필·도트·마커. 큰 면(카드·섹션·패널)은 `brand-subtle`·`ai.bg`·`paper` 그라데이션처럼 옅게.
3. **periwinkle = AI.** 사람이 만든 링크·버튼·태그에 쓰지 않는다. 반대로 AI 가 만든 것은 반드시 periwinkle 라벨·면·아이콘 중 하나를 갖는다.
4. **상태색은 상태에만.** 코럴은 오류·손실·삭제, 초록은 성공·무손실, 앰버는 경고·진행 중·하이라이트.
5. **텍스트 대비 4.5:1, 아이콘·테두리·마커 3:1.** 빌드(`node tokens/build.mjs`)가 시맨틱 조합 210쌍을 자동 검사한다. 새 조합을 만들면 `build.mjs` 의 `pairs` 에 추가한다.
6. **다크는 시맨틱이 알아서 바꾼다.** 컴포넌트에 `dark:` 분기를 쓰지 않는다. 09 참조.

## 5. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `color: #1EA896` 로 브랜드색 글자 | `var(--nt-color-text-brand)` (teal.700) |
| 에디터 본문 배경 `#fff` 하드코딩 | `var(--nt-color-surface-default)` |
| AI 답변 본문 글자를 보라로 | 본문 `text.primary`, 라벨·아이콘만 `ai.text`·`ai.icon` |
| 사용자 링크에 periwinkle | `text.link` (teal.700). periwinkle 은 AI 전용 |
| primary 버튼 두 개 나란히 | 하나는 secondary. "물어보기" 는 `ai` variant |
| 삭제 버튼을 코럴 primary 로 목록에 노출 | `danger-ghost` 아이콘, 확인 다이얼로그에서 `danger` |
| 노란 배지에 흰 글자 | `status.warning.solid` + `on-solid`(검정) |
| 회색 글자 `#999` 로 캡션 | `text.tertiary` (#72706B) |
| 손실 항목을 회색으로 조용히 | `fidelity.dropped.*` 코럴 + 문구 + 개수 |
| 성공을 teal 로 | 성공은 `status.success`(초록). teal 은 브랜드·완료(done) |
| 코드 블록을 다크로만 | 라이트 `code.bg`(종이색). 다크는 토큰이 처리 |

## 6. 원시 램프를 직접 써도 되는 유일한 경우

- 차트 시리즈가 8개를 넘어 `chart.categorical` 이 모자랄 때(차트를 나누는 게 먼저).
- OG 이미지·이메일·PDF 내보내기처럼 **다크모드가 없는 정적 산출물**.
- 이 경우에도 `var(--nt-teal-300)` 처럼 변수로 쓴다.

## 7. 코드 예시

```css
.page-body { background: var(--nt-color-surface-default); color: var(--nt-color-text-primary); }
.sidebar { background: var(--nt-color-surface-canvas); border-right: 1px solid var(--nt-color-border-subtle); }
.btn-primary { background: var(--nt-color-action-primary-bg); color: var(--nt-color-action-primary-text); }
.btn-ai { background: var(--nt-color-action-ai-bg); color: var(--nt-color-action-ai-text); }
.ai-answer { background: var(--nt-color-ai-bg); border: 1px solid var(--nt-color-ai-border); }
.ai-answer__label { color: var(--nt-color-ai-text); }
.cite { background: var(--nt-color-citation-bg); color: var(--nt-color-citation-text); }
.report-row--dropped { background: var(--nt-color-fidelity-dropped-bg); color: var(--nt-color-fidelity-dropped-text); }
```

Tailwind(프리셋 적용 후):
```html
<aside class="bg-surface-canvas border-r border-border-subtle">…</aside>
<main class="bg-surface-default text-text-primary">…</main>
<button class="bg-action-ai-bg text-action-ai-text hover:bg-action-ai-bg-hover">물어보기</button>
<span class="bg-workflow-in-progress-bg text-workflow-in-progress-text">In Progress</span>
```
