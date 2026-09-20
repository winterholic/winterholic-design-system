# 02 · 타이포그래피 (notting)

notting 은 글자가 제품이다. 그래서 스타일이 두 벌이다 — **UI 글자**(버튼·트리·패널·표)와 **문서 글자**(에디터·읽기 모드·Ask 답변·Markdown 미리보기). 둘은 같은 서체를 쓰지만 행간·여백 규칙이 다르다.

## 1. 서체

| 용도 | 토큰 | 스택 |
|---|---|---|
| UI·문서 본문·제목 | `font.family.sans` | Pretendard Variable → Pretendard → 시스템 산세리프 → Apple SD Gothic Neo → Noto Sans KR |
| 코드·경로·ID·해시·kbd | `font.family.mono` | JetBrains Mono → D2Coding → SFMono → Menlo → Consolas |
| display(랜딩 대형) | `font.family.display` | Pretendard 와 같다. 나중에 바꾸고 싶을 때를 위한 분리 |

**모노를 항상 로드한다.** base 는 "코드가 없는 화면은 시스템 모노로 충분" 이지만 notting 은 모든 화면에 경로·이슈 키·해시가 있다. JetBrains Mono 는 한글이 없으니 한글 주석이 섞인 코드는 D2Coding 폴백이 맡는다.

### 로드 방법 (소비 앱이 한다)
```html
<link rel="stylesheet" as="style" crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/jetbrains-mono@5/index.min.css" />
```
- `dynamic-subset` 은 실제 쓰인 글자만 받는다. 한글 전체(2MB 이상)를 받는 일반 버전을 쓰지 않는다.
- 셀프 호스팅이면 `woff2` 를 `/fonts` 에 넣고 `font-display: swap`. 에디터 첫 페인트에서 글자가 늦으면 커서 위치가 튄다 — 폰트는 `preload`.

## 2. 스케일

| 토큰 | px | rem | UI | 문서 |
|---|---|---|---|---|
| `2xs` | 11 | 0.6875 | 배지·근거 칩·kbd. **하한** | |
| `xs` | 12 | 0.75 | 캡션·속성 라벨·경로·mono-label | |
| `sm` | 14 | 0.875 | 보조 본문·폼 라벨·표·트리 항목 | 코드 블록·표·캡션 |
| `md` | 16 | 1 | 본문·md 버튼·인풋. **기본** | **문서 본문** |
| `lg` | 18 | 1.125 | 리드 문단·lg 버튼·h4 | |
| `xl` | 20 | 1.25 | h3·카드 제목 | 문서 h3 |
| `2xl` | 24 | 1.5 | h2·모달 제목 | 문서 h2 |
| `3xl` | 30 | 1.875 | h1(앱 화면 제목) | 문서 h1 |
| `4xl` | 36 | 2.25 | display-sm | **문서(페이지) 제목** |
| `5xl` | 48 | 3 | display-md | |
| `6xl` | 60 | 3.75 | display-lg | |

- 11px 아래로 내려가지 않는다.
- 문서 본문은 16px 이고 사용자 설정으로 줄이지 않는다. "작게 보기" 가 필요하면 에디터 폭을 넓히는 쪽(`editor-wide`)으로 푼다.
- 인풋·에디터 글자는 모바일에서 16px 이상이어야 iOS 가 자동 확대를 하지 않는다.

## 3. 굵기 4단계

| 토큰 | 값 | UI | 문서 |
|---|---|---|---|
| `regular` | 400 | 본문 | 본문·인용·코드 |
| `medium` | 500 | 라벨·버튼·표 헤더·트리 항목·이슈 제목 | mono-label·kbd |
| `semibold` | 600 | h2 이하 제목·카드 타이틀·활성 탭 | 문서 h2·h3·`<strong>` |
| `bold` | 700 | display·h1·큰 숫자 | 문서 제목·문서 h1 |

문서 안 `**굵게**` 는 **semibold(600)** 이다. UI 본문 강조(medium)보다 한 단계 굵다 — 문서는 행간이 넓어 500 은 강조로 안 보인다. 300 이하 금지, 800 이상 금지.

## 4. 행간·자간

| 행간 토큰 | 값 | 어디에 |
|---|---|---|
| `none` | 1 | 아이콘과 나란한 라벨·숫자 타일·kbd |
| `tight` | 1.2 | display·문서 제목 |
| `snug` | 1.3 | h1~h4·문서 h1~h3 |
| `normal` | 1.5 | 라벨·버튼·짧은 UI 텍스트·캡션 |
| `relaxed` | 1.6 | **UI 본문**·코드 블록 |
| `prose` | 1.7 | **문서 본문**. 720px 한 줄에 한글 42자면 1.7 이 되돌아오기 편하다 |
| `loose` | 1.75 | 랜딩 소개 문단 |

| 자간 토큰 | 값 | 어디에 |
|---|---|---|
| `tighter` | -0.03em | display |
| `tight` | -0.02em | h1~h3·문서 제목·문서 h1·h2 |
| `snug` | -0.01em | h4 이하·body-lg·문서 h3 |
| `normal` | 0 | 본문·라벨·코드 |
| `wide` | 0.04em | overline·대문자 라틴 |

## 5. 텍스트 스타일 — UI (이것만 쓴다)

화면에는 아래 이름으로만 글자를 놓는다. `dist/typography.css` 에 같은 이름의 클래스(`.nt-heading-1`)가 있고, `tokens.js` 에서는 `tokens.typography['heading-1'].value` 로 객체를 받는다.

| 스타일 | size / weight / lh / ls | 언제 | 짝 글자색 |
|---|---|---|---|
| `display-lg` | 60 / 700 / 1.2 / -0.03em | 랜딩 히어로. 모바일 48 | primary 또는 on-brand |
| `display-md` | 48 / 700 / 1.2 / -0.03em | 랜딩 섹션 제목. 모바일 36 | |
| `display-sm` | 36 / 700 / 1.2 / -0.02em | KPI 큰 숫자·모바일 히어로 | |
| `heading-1` | 30 / 700 / 1.3 / -0.02em | 앱 화면 제목(설정·이슈·대시보드). 페이지당 1개 | primary |
| `heading-2` | 24 / 600 / 1.3 / -0.02em | 섹션·모달 제목 | primary |
| `heading-3` | 20 / 600 / 1.3 / -0.01em | 카드 제목·보드 컬럼 제목 | primary |
| `heading-4` | 18 / 600 / 1.5 / -0.01em | 패널 섹션 제목·그룹 제목 | primary |
| `heading-5` | 16 / 600 / 1.5 / 0 | 검색 결과 제목·폼 섹션·작은 카드 | primary |
| `heading-6` | 14 / 600 / 1.5 / 0 | 사이드바 워크스페이스 이름·표 컬럼 그룹 | secondary |
| `body-lg` | 18 / 400 / 1.6 / -0.01em | 랜딩 리드 | secondary |
| `body-md` | 16 / 400 / 1.6 / 0 | UI 본문 기본 | primary |
| `body-sm` | 14 / 400 / 1.6 / 0 | 보조 설명·표 셀·스니펫·속성 값 | primary 또는 secondary |
| `body-xs` | 12 / 400 / 1.5 / 0 | 툴팁·여러 줄 메타 | tertiary |
| `label-lg` | 16 / 500 / 1.5 / 0 | lg 버튼·탭·내비 | |
| `label-md` | 14 / 500 / 1.5 / 0 | **md 버튼·폼 라벨·표 헤더·트리 항목·이슈 제목·슬래시 메뉴 항목** | |
| `label-sm` | 12 / 500 / 1.5 / 0 | 배지·상태 필·sm 버튼 | |
| `caption` | 12 / 400 / 1.5 / 0 | 도움말·타임스탬프·저장 상태·속성 라벨 | tertiary |
| `overline` | 11 / 600 / 1.5 / 0.04em 대문자 | 사이드바 섹션명·슬래시 메뉴 그룹명·패널 섹션 라벨 | tertiary |
| `code` | 14 mono / 400 / 1.6 | UI 안 코드(설정의 CLI 예시·API 키 표시) | primary, 배경 code.bg |
| `numeric` | 16 / 500 / 1 tabular | 표 수치·왕복 요약 숫자·KPI | primary |
| `mono-label` | 12 mono / 500 / 1.5 tabular | **경로·page ID·revision 해시·이슈 키(NT-123)·브랜치명** | secondary 또는 tertiary |
| `kbd` | 11 mono / 500 / 1 | 단축키. `<kbd>` 태그면 자동 | kbd.text |

## 6. 텍스트 스타일 — 문서 (`.nt-doc`)

에디터 출력·읽기 모드·Ask 답변 본문·Markdown 미리보기는 컨테이너에 `.nt-doc` 를 걸면 `dist/prose.css` 가 아래를 전부 처리한다. 블록 단위 스타일은 06 §17.

| 스타일 / 요소 | size / weight / lh / ls | 위 여백 | 언제 |
|---|---|---|---|
| `prose-title` | 36 / 700 / 1.2 / -0.02em (모바일 30) | 커버 없으면 80 | 페이지 제목. 에디터 첫 줄. `.nt-doc` 밖에 있다 |
| `h1` = `prose-h1` | 30 / 700 / 1.3 / -0.02em | `space.8` 32 | Markdown `#` |
| `h2` = `prose-h2` | 24 / 600 / 1.3 / -0.02em | `space.6` 24 | `##` |
| `h3` = `prose-h3` | 20 / 600 / 1.3 / -0.01em | `space.5` 20 | `###`. **h4 이하는 h3 모양**(문서 안 제목 3단계) |
| `p` `li` `blockquote` = `prose-body` | 16 / 400 / **1.7** / 0 | 블록 gap 4 | 본문 |
| `pre` = `prose-code` | 14 mono / 400 / 1.6 | | 코드 블록 |
| `:not(pre) > code` | 0.9em mono | | 인라인 코드. 글자 `code.string`(코럴), 배경 `code.bg-inline` |
| `figcaption` = `prose-caption` | 14 / 400 / 1.5 | `space.2` | 이미지·표 캡션. tertiary |
| `strong` | 600 | | |
| `a` | link + 밑줄(`border.brand` 색) | | 문서 링크는 항상 밑줄 |
| `.nt-cite` | 11 mono / 500 | | 근거 칩. 15 §3 |

### 문서 위계 규칙
- 문서 안 제목은 **3단계까지만** 시각적으로 구분한다. Markdown `####` 이하는 h3 모양으로 그린다. 4단계 이상 필요한 문서는 페이지를 나눠야 한다는 신호.
- 페이지 제목(`prose-title`)은 문서 안 h1 보다 크다. 제목 아래 속성이 있으면 속성 → `space.6` → 첫 블록.
- 제목 아래 첫 블록과의 간격은 제목의 **위** 여백이 만든다. 제목의 아래 여백은 0(블록 gap 만).

## 7. 한국어·코드 조판 규칙

`typography.css` 가 `html` 에 전역으로 건다.
- `word-break: keep-all` — 단어 중간에서 줄이 끊기지 않는다.
- `overflow-wrap: anywhere` — URL·긴 영문이 상자를 뚫지 않는다. **코드 블록은 예외**: `pre` 는 `overflow-x: auto`, 줄바꿈 없음.
- 코드 블록 `tab-size: 2`.
- 숫자와 단위 사이 띄어쓰기 없음: `16px`, `3개`. 표의 숫자는 `numeric` + 우측 정렬.
- 한 줄 최대 폭 `container.prose` 720px. 에디터 컬럼 760 은 여기에 좌우 안전 여백 20 을 더한 값.
- 경로·ID 는 `mono-label` 로, 길면 가운데 말줄임(`…`)이 아니라 **앞을 자른다**(`…/adr/0001-document-model.md`). 파일명이 보여야 한다.
- 영문 대문자 라벨(overline)만 `uppercase`. 한글에는 자간만.

## 8. 반응형

`typography.css`·`prose.css` 가 767px 이하에서 자동으로 내린다.

| 스타일 | 데스크톱 | 모바일 |
|---|---|---|
| display-lg / md / sm | 60 / 48 / 36 | 48 / 36 / 30 |
| heading-1 | 30 | 24 |
| prose-title | 36 | 30 |
| 문서 h1 / h2 / h3 | 30 / 24 / 20 | 24 / 20 / 18 |

본문 16px 은 어떤 화면에서도 줄이지 않는다.

## 9. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `font-size: 13px` | `sm`(14) 또는 `xs`(12) |
| 문서 본문 행간 1.5 | `prose` 1.7. UI 본문만 1.6 |
| 문서 `**굵게**` 를 500 으로 | 600. 넓은 행간에서 500 은 안 보인다 |
| 문서 안 h4·h5 를 따로 더 작게 | h3 모양. 3단계 넘으면 페이지 분리 |
| 경로를 본문 서체로 | `.nt-mono-label` |
| 이슈 키 `NT-123` 을 캡션 서체로 | `.nt-mono-label` (숫자 정렬) |
| `<h3>` 태그를 모양 때문에 | 태그는 구조, 모양은 클래스 |
| 인풋·에디터 14px 모바일 | 16 |
| 코드 블록에 `overflow-wrap: anywhere` | 가로 스크롤 |
| Noto Sans KR 을 첫 폰트로 | Pretendard. Noto 는 폴백 |
