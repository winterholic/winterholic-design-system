# 02 · 타이포그래피 (AIP)

## 1. 전략 한 줄

**본문과 UI 는 Pretendard 한 서체, 코드와 기계값(식별자)만 JetBrains Mono.** 개발자 도구라고 UI 를 모노로 채우지 않는다. 모노는 "이것은 기계가 읽는 값이다"라는 표식이라 아껴 쓸수록 의미가 선다.

| 패밀리 | 토큰 | 쓰는 곳 | 로드 |
|---|---|---|---|
| Pretendard Variable | `font.family.sans` | 마케팅 제목·문서 제목·본문·UI 전부 | `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css` |
| JetBrains Mono | `font.family.mono` | 코드 블록·인라인 코드·파라미터 이름/타입·버전·경로·스펙 ID·kbd·eyebrow | `https://cdn.jsdelivr.net/npm/@fontsource-variable/jetbrains-mono@5/index.min.css` |

- Pretendard 는 한글과 라틴의 굵기·x-height 가 맞아 한·영 혼용 문서에서 한 서체로 끝난다. 장시간 읽기에 맞는 넓은 자면이다.
- JetBrains Mono 는 x-height 가 높아 14px 코드에서도 `0O`, `1lI`, `{}()` 구분이 분명하다. **리거처는 끈다**(`font-variant-ligatures: none`). 명세의 `!=` 가 `≠` 로 보이면 독자와 AI 가 다르게 읽는다.
- 마케팅 제목과 문서 제목은 서체가 아니라 **크기·자간**으로 구분한다. 마케팅 display 는 −0.035em 로 조이고, 문서 제목은 −0.02em 이다.

## 2. 스케일

`font.size`: xs 12 · sm 14 · md 16 · lg 18 · xl 20 · 2xl 24 · 3xl 30 · 4xl 36 · 5xl 48 · 6xl 60. **12px 아래는 없다.**
`font.weight`: 400 · 500 · 600 · 700 네 개.
`font.line-height`: none 1 · tight 1.1 · snug 1.25 · heading 1.35 · normal 1.5 · relaxed 1.6 · **prose 1.7**.

## 3. 역할 스타일(26종 → 묶음 넷)

화면의 글자는 이 클래스 중 하나로만 놓는다. 개별 size·weight 조합은 금지다. 클래스는 색을 정하지 않는다. 색은 `.aip-text-secondary` 같은 유틸 또는 컴포넌트가 정한다.

### 마케팅(홈페이지·랜딩)
| 클래스 | 값 | 언제 |
|---|---|---|
| `.aip-display-xl` | 60/700/1.1/−0.035em | 히어로 한 줄. 모바일 36 |
| `.aip-display-lg` | 48/700/1.1 | 섹션 제목. 모바일 30 |
| `.aip-display-md` | 36/700/1.25 | 소제목·CTA 띠. 모바일 24 |
| `.aip-lead` | 20/400/1.6 | 히어로·섹션 설명. secondary 와 짝 |

### 문서(Docs·Specification·Reference)
| 클래스 / 요소 | 값 | 언제 |
|---|---|---|
| `.aip-doc-title` (`h1`) | 36/700/1.25 | 페이지 제목. 페이지당 1개. 모바일 30 |
| `.aip-doc-lead` | 18/400/1.6 | 제목 아래 한두 문장 요약. AI 에이전트가 요지를 여기서 읽는다 |
| `.aip-doc h2` (`doc-h2`) | 24/600/1.35 | 위에 hairline. 앵커 |
| `.aip-doc h3` (`doc-h3`) | 20/600/1.35 | |
| `.aip-doc h4` (`doc-h4`) | 16/600/1.5 | API 항목 이름. **그 아래 단계는 없다** |
| `.aip-doc p` (`doc-body`) | 16/400/**1.7** | 본문. 줄이지 않는다 |
| `figcaption` (`doc-caption`) | 14/400/1.5 | 그림·표 캡션 |

### UI(MakeAIP·Playground·컴포넌트)
`heading-1` 30/700 · `heading-2` 24/600 · `heading-3` 18/600 · `heading-4` 16/600 · `body-lg` 18 · `body-md` 16/1.6 · `body-sm` 14/1.6 · `label-lg` 16/500 · `label-md` 14/500 · `label-sm` 12/500 · `caption` 12/400.

### 코드·식별자
| 클래스 | 값 | 언제 |
|---|---|---|
| `.aip-code` | 모노 14/1.6 | 코드 블록·에디터 |
| `.aip-code-sm` | 모노 12/1.6 | 좁은 열의 코드 |
| 인라인 코드 | 모노 **0.875em** | 본문·제목 어디서든 주변 글자 비율을 따른다 |
| `.aip-mono-label` | 모노 12/500 | 타입·버전·경로·스펙 ID |
| `.aip-eyebrow` | 모노 12/600/대문자/0.06em | 제목 위 분류 라벨. '명세' 표식이 되는 유일한 장식 |
| `kbd` | 모노 12 | 단축키 |
| `.aip-numeric` | 16/500/tabular | 수치 |

## 4. 문서 본문의 리듬

- 본문 폭 720px(`size.container.prose`). 한국어 약 45자, 영어 약 85자다. 영어 기준으로는 조금 넓은데, 80열 코드가 가로 스크롤 없이 들어가는 폭을 우선했다(코드와 본문 폭이 같아야 문서가 한 기둥으로 읽힌다).
- 문단 사이 20px(`doc.block-gap`). 행간 1.7(27.2px)보다 짧아 문단 경계가 행간보다 분명하되 끊기지 않는다.
- 코드·콜아웃·스펙·그림 위아래 24px(`doc.figure-gap`).
- h2 는 위 48px + hairline + 24px. 명세서의 절처럼 구획된다. 첫 h2 가 맨 앞이면 선이 없다.
- 제목 바로 아래 첫 블록은 12px(`doc.heading-after`). 제목이 아래 내용에 붙어 보이게 한다.
- `scroll-margin-top: 88px` 이라 앵커로 이동해도 sticky 헤더(64) 밑에 숨지 않는다.
- Specification 페이지는 `h2[data-section="§ 3.2"]` 로 절 번호를 모노 tertiary 로 앞에 붙인다.

## 5. 한·영 혼용과 숫자

- `:lang(ko)` 에 `word-break: keep-all`. 한국어는 어절 단위로 줄바꿈한다. 긴 식별자는 `overflow-wrap: anywhere` 로 넘친다.
- 날짜 `2026.10.06`, 시간 `14:30`. 버전은 모노 `v0.4.0`.
- 수치 열은 `.aip-numeric` 또는 `font-variant-numeric: tabular-nums` + 오른쪽 정렬(`.aip-table__num`).
- 영어 대문자 라벨은 `.aip-eyebrow` 만. 한국어에는 대문자 변환이 없으니 자간만 남는다.

## 6. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| UI 전체를 모노로 | 모노는 코드·식별자·eyebrow 만 |
| 문서 본문 14px | 16px 고정. 좁아 보이면 레이아웃(사이드바 접힘)을 바꾼다 |
| h5·h6 | h4 가 마지막. 더 깊으면 페이지를 나눈다 |
| 코드 리거처 | 끈다. 기본으로 꺼져 있다 |
| 파라미터 이름을 굵은 sans 로 | `.aip-param__name`(모노 semibold) |
| 13px·15px | 스케일 안의 12·14·16 |
| font-weight 300 | 400 이상 |
