# 02 · 타이포그래피

## 1. 서체

| 용도 | 토큰 | 스택 |
|---|---|---|
| 본문·제목 전부 | `font.family.sans` | Pretendard Variable → Pretendard → 시스템 산세리프 → Apple SD Gothic Neo → Noto Sans KR → Malgun Gothic |
| 코드·수치 정렬 | `font.family.mono` | JetBrains Mono → D2Coding → SFMono → Menlo → Consolas |
| display(랜딩 대형) | `font.family.display` | Pretendard 와 같다. 나중에 디스플레이 서체를 바꾸고 싶을 때 이 토큰만 바꾸라고 분리해 뒀다 |

**Pretendard 하나로 끝내는 이유**: 한글과 라틴의 굵기·x-height 가 맞춰져 있어 한 문장 안에서 영문이 튀지 않는다. 가변 폰트라 4개 굵기를 파일 하나로 받는다.

### 로드 방법 (소비 앱이 한다)
```html
<link rel="stylesheet" as="style" crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```
- `dynamic-subset` 은 글리프를 쪼개 실제 쓰인 글자만 받는다. 한글 폰트 전체(2MB 이상)를 받는 일반 버전을 쓰지 않는다.
- 셀프 호스팅이 필요하면 같은 저장소의 `woff2` 를 `/fonts` 에 넣고 `@font-face` 로 `font-display: swap`.
- 모노는 필요할 때만 로드한다. 코드가 없는 화면은 시스템 모노 폴백으로 충분하다.

## 2. 스케일

| 토큰 | px | rem | 어디에 |
|---|---|---|---|
| `2xs` | 11 | 0.6875 | 배지 안 글자, 법적 고지. **하한** |
| `xs` | 12 | 0.75 | 캡션·타임스탬프·표 보조 |
| `sm` | 14 | 0.875 | 보조 본문·폼 라벨·표 본문·sm 버튼 |
| `md` | 16 | 1 | 본문·md 버튼·인풋. **기본** |
| `lg` | 18 | 1.125 | 리드 문단·lg 버튼·h4 |
| `xl` | 20 | 1.25 | h3·카드 제목 |
| `2xl` | 24 | 1.5 | h2·모달 제목 |
| `3xl` | 30 | 1.875 | h1(앱 페이지 제목) |
| `4xl` | 36 | 2.25 | display-sm |
| `5xl` | 48 | 3 | display-md |
| `6xl` | 60 | 3.75 | display-lg |

- 11px 아래로 내려가지 않는다. 더 작게 보여야 하면 글자를 줄이는 대신 정보를 줄인다.
- 인풋 글자는 모바일에서 **16px 이상**이어야 iOS 가 자동 확대를 하지 않는다. `input.md` 가 body-md(16px) 인 이유다.

## 3. 굵기 4단계

| 토큰 | 값 | 어디에 |
|---|---|---|
| `regular` | 400 | 본문 |
| `medium` | 500 | 라벨·버튼·표 헤더·본문 안 강조 |
| `semibold` | 600 | h2 이하 제목·카드 타이틀·활성 탭 |
| `bold` | 700 | display·h1·큰 숫자 |

300 이하는 한글 획이 끊겨 보여 금지. 800 이상은 Pretendard 에서 뭉친다. 본문 안 강조는 `<strong>` → medium(500) 이면 충분하고 bold 는 너무 튄다.

## 4. 행간·자간

| 행간 토큰 | 값 | 어디에 |
|---|---|---|
| `none` | 1 | 아이콘과 나란한 한 줄 라벨·숫자 타일 |
| `tight` | 1.2 | display·h1 |
| `snug` | 1.3 | h2 부터 h4 |
| `normal` | 1.5 | 라벨·버튼·짧은 UI 텍스트 |
| `relaxed` | 1.6 | **본문 기본**. 한글은 라틴보다 행간이 더 필요하다 |
| `loose` | 1.75 | 긴 글(prose) |

| 자간 토큰 | 값 | 어디에 |
|---|---|---|
| `tighter` | -0.03em | display |
| `tight` | -0.02em | h1 부터 h3 |
| `snug` | -0.01em | h4 이하 제목·body-lg |
| `normal` | 0 | 본문·라벨 |
| `wide` | 0.04em | overline·대문자 라틴 |

Pretendard 는 기본 자간이 넓어 큰 글자는 조여야 단단해 보인다. 본문(16px 이하)은 조이면 획이 붙으니 0.

## 5. 텍스트 스타일 (이것만 쓴다)

화면에는 아래 이름으로만 글자를 놓는다. `font-size: 15px; font-weight: 550` 같은 즉석 조합은 금지. `dist/typography.css` 에 같은 이름의 클래스(`.wh-heading-1`)가 있고, `tokens.js` 에서는 `tokens.typography['heading-1'].value` 로 객체를 받는다.

| 스타일 | size / weight / lh / ls | 언제 | 짝 글자색 |
|---|---|---|---|
| `display-lg` | 60 / 700 / 1.2 / -0.03em | 랜딩 히어로 한 줄. 모바일 48 | primary 또는 on-brand |
| `display-md` | 48 / 700 / 1.2 / -0.03em | 랜딩 섹션 제목. 모바일 36 | |
| `display-sm` | 36 / 700 / 1.2 / -0.02em | KPI 큰 숫자·모바일 히어로. 모바일 30 | |
| `heading-1` | 30 / 700 / 1.3 / -0.02em | 앱 페이지 제목. **페이지당 1개**. 모바일 24 | primary |
| `heading-2` | 24 / 600 / 1.3 / -0.02em | 섹션·모달 제목 | primary |
| `heading-3` | 20 / 600 / 1.3 / -0.01em | 카드 제목·서브섹션 | primary |
| `heading-4` | 18 / 600 / 1.5 / -0.01em | 그룹 제목·사이드바 섹션 | primary |
| `heading-5` | 16 / 600 / 1.5 / 0 | 폼 섹션 제목·작은 카드 | primary |
| `heading-6` | 14 / 600 / 1.5 / 0 | 표 컬럼 그룹·아주 작은 구획 | secondary |
| `body-lg` | 18 / 400 / 1.6 / -0.01em | 랜딩 리드 문단 | secondary |
| `body-md` | 16 / 400 / 1.6 / 0 | **본문 기본** | primary |
| `body-sm` | 14 / 400 / 1.6 / 0 | 보조 설명·표 셀·카드 설명 | primary 또는 secondary |
| `body-xs` | 12 / 400 / 1.5 / 0 | 여러 줄 메타 | tertiary |
| `label-lg` | 16 / 500 / 1.5 / 0 | lg 버튼·탭·내비 항목 | |
| `label-md` | 14 / 500 / 1.5 / 0 | **md 버튼·폼 라벨·표 헤더·메뉴** | |
| `label-sm` | 12 / 500 / 1.5 / 0 | sm 버튼·배지·칩 | |
| `caption` | 12 / 400 / 1.5 / 0 | 도움말·타임스탬프·글자수 | tertiary |
| `overline` | 11 / 600 / 1.5 / 0.04em, 대문자 | 섹션 위 카테고리 라벨 | tertiary 또는 brand |
| `code` | 14 mono / 400 / 1.6 | 코드 블록. 인라인은 0.9em | primary, 배경 sunken |
| `numeric` | 16 / 500 / 1 / 0, tabular-nums | 표 금액·수치 | primary |

### 위계 만드는 법
- 제목 단계는 **크기 + 굵기 + 색**을 같이 움직인다. 크기만 바꾸면 밋밋하고, 굵기만 바꾸면 크기가 같아 헷갈린다.
- 한 화면에 제목 스타일은 3단계까지. h1 → h3 → h5 처럼 건너뛰어도 된다. HTML 태그 레벨(`<h2>`)과 시각 스타일(`.wh-heading-3`)은 분리한다. 태그는 문서 구조, 클래스는 모양.
- 제목 아래 설명은 항상 한 단계 작고 한 단계 옅다: `heading-2` + `body-sm` `text.secondary`.

## 6. 한국어 조판 규칙

`typography.css` 가 `html` 에 전역으로 건다.
- `word-break: keep-all` : 단어 중간에서 줄이 끊기지 않는다. 한글에서 가장 중요한 한 줄.
- `overflow-wrap: anywhere` : URL·긴 영문이 상자를 뚫지 않게 한다.
- 문장부호: 마침표 뒤 한 칸. 따옴표는 `“ ”` 대신 `" "` 로 통일(개발 문서 성격).
- 숫자와 단위 사이 띄어쓰기 없음: `16px`, `3개`, `2,400원`. 표의 숫자는 `numeric` 스타일 + 우측 정렬.
- 한 줄 최대 폭 `size.container.prose` 720px. 16px 기준 한글 약 42자. 이보다 길면 시선이 되돌아오지 못한다.
- 영문 대문자 라벨(overline)은 `text-transform: uppercase` 로 처리하고 한글에는 적용하지 않는다(효과 없음).

## 7. 반응형

`typography.css` 가 767px 이하에서 자동으로 내린다.

| 스타일 | 데스크톱 | 모바일 |
|---|---|---|
| display-lg | 60 | 48 |
| display-md | 48 | 36 |
| display-sm | 36 | 30 |
| heading-1 | 30 | 24 |

나머지는 그대로다. 본문 16px 은 어떤 화면에서도 줄이지 않는다.

## 8. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `font-size: 13px` | `sm`(14) 또는 `xs`(12). 스케일 밖 값 금지 |
| `font-weight: 300` 으로 세련되게 | `regular` + `text.secondary` 로 옅게 |
| 제목에 `line-height: 1.6` | `snug` 1.3. 제목 행간이 넓으면 두 줄 제목이 붕 뜬다 |
| 본문에 `letter-spacing: -0.05em` | 본문은 0. 조이는 건 24px 이상부터 |
| `<h3>` 태그를 모양 때문에 선택 | 태그는 구조대로, 모양은 `.wh-heading-*` 클래스 |
| 표의 숫자를 본문 서체로 좌측 정렬 | `.wh-numeric` + `text-align: right` |
| 인풋 글자 14px (모바일 자동 확대 발생) | 16px (`input.md`) |
| Noto Sans KR 을 첫 폰트로 | Pretendard. Noto 는 폴백 |
