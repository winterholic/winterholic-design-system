# 09 · 결과물·뷰어: Artifact · Universal Artifact Viewer · Prose

에이전트가 만들거나 찾은 파일을 **열어 보고, 받고, 그 위에서 다시 시키는** 곳이다. 요구사항 §3.2·§3.3·§4·§5 의 화면. 구현은 `components/artifact.css`·`viewer.css`·`code.css`, `dist/prose.css`, tk.js `initZoom`·`initFind`·`initSelection`.

## 1. 결과물을 읽는 순서

**무엇인지**(계열 글리프 + 이름 + 확장자) → **쓸 수 있는지**(미리보기 상태·정책) → **언제·어디서**(세션·크기·시각). 행·카드·상세가 전부 이 순서다.

### Glyph · Ext
```html
<span class="tk-glyph" data-type="pdf"><svg class="tk-icon" aria-hidden="true">file-pdf</svg></span>
<span class="tk-glyph tk-glyph--sm" data-type="image"><img src="thumb.webp" alt=""></span>
<span class="tk-ext">PDF</span>
```

| `data-type` | 계열 | 확장자 | 아이콘 | 색 |
|---|---|---|---|---|
| `doc` | 읽는 문서 | md·txt·docx·html | `file-text` · html 은 `globe` | 파랑 |
| `pdf` | 고정 레이아웃 | pdf | `file-pdf`(file-text 변형) | 빨강 |
| `slide` | 발표 | pptx·key | `presentation` | amber |
| `sheet` | 표 | xlsx·csv·tsv | `sheet` | 민트 |
| `image` | 이미지 | png·jpg·webp·gif·svg | `image`(썸네일이 있으면 썸네일) | 자두 |
| `code` | 코드·데이터 | py·ts·json·yaml·log | `file-code` | 중립 |
| `other` | 나머지 | zip·바이너리 | `file-archive`·`file` | 중립 |

색은 보조 신호다. 정본은 아이콘 모양과 확장자 라벨. 타일 40(`--sm` 32), radius 8. 방금 도착한 결과물은 `data-new`(오른쪽 위 민트 점).

### Artifact card(채팅 안)
```html
<div class="tk-artifact-card" data-new>
  <a class="tk-artifact-card__open" href="/workspace/art_01J9…">
    <span class="tk-glyph tk-glyph--sm" data-type="pdf">…</span>
    <span class="tk-artifact-card__body"><span class="tk-artifact-card__name">결정사항-요약-1009.pdf</span>
      <span class="tk-artifact-card__meta"><span class="tk-ext">PDF</span><span>2쪽</span><span>148 KB</span></span></span>
  </a>
  <button class="tk-icon-button tk-icon-button--sm" aria-label="결정사항-요약-1009.pdf 다운로드">…download…</button>
</div>
```
카드 전체가 열기(작업 공간 뷰어), 뒤에 다운로드 하나. 그 밖의 행동은 뷰어·상세에서. 여러 개면 `.tk-artifacts` 로 쌓고 넷째부터 "모두 보기(작업 공간)". 미리보기를 만드는 중이면 메타에 `.tk-artifact__status`(스피너 xs + "미리보기 만드는 중"). 원본은 그동안에도 받을 수 있다.

### Artifact row(작업 공간·보관함·파일 찾기)
`.tk-list__item.tk-artifact`: 글리프 · `__body`(이름 + 메타 + 스니펫) · `__end`(정책·보존 배지). 선택 모드에서는 앞에 `.tk-checkbox--bare`. 방금 도착한 행은 `agent-subtle` 면(선택·현재 행이면 선택 면이 이긴다).

### Policy · Retention
```html
<span class="tk-policy" data-policy="approval"><svg class="tk-icon">shield-alert</svg>반출 승인</span>
<div class="tk-policy-note" data-policy="restricted"><svg class="tk-icon">lock</svg><div><p>…긴 이유…</p></div></div>
<span class="tk-retention" data-soon><svg class="tk-icon">clock</svg>3일 뒤 정리</span>
```
| `data-policy` | 뜻 | 단어 예 | 아이콘 |
|---|---|---|---|
| `allowed` | 접근·다운로드 허용 | 허용 | `shield-check` |
| `approval` | 반출(외부 전송)에 승인 필요 | 반출 승인 | `shield-alert` |
| `blocked` | 이 기기에서 열기·받기 불가 | 반출 차단 · 회사 자료 | `ban` |
| `restricted` | 별도 정책 범위(민감·회사 자료) | 민감 · 별도 정책 | `lock` |

배지는 짧게, 이유는 `.tk-policy-note`(상세·시트·뷰어 상태 패널). 허용은 배지를 굳이 달지 않는다(목록이 배지로 시끄러워진다). 보존: 기본은 회색 기간, 7일 안이면 `data-soon`(amber), 고정이면 `data-pinned`.

**접근 권한과 반출 권한은 다르다.** 보이는 파일이라고 보낼 수 있는 것이 아니다. 같은 행에 "열기 가능 + 반출 승인"이 함께 있을 수 있다.

### Filter bar · Selection bar · Tree · Detail
- `.tk-filterbar`(`role="search"`): 검색(`.tk-input-wrap`) + 정렬 Select(md 이상) + 칩 줄 + 결과 수(`__count`, `role="status"`).
- `.tk-selectionbar`(`data-tk-selectionbar`): 여러 개를 고르면 화면 아래 떠오른다. "n개 선택" + 다운로드 · 작업 공간에 담기 · 보내기(primary sm) · 해제. 범위는 `data-tk-select-scope`, 체크박스는 `input[data-tk-select]`.
- `.tk-tree`: 원격 파일 탐색의 허용된 위치(데스크톱 사이드바). 현재 폴더 `aria-current`. 별도 정책 폴더는 뒤에 배지.
- `.tk-detail`: 결과물 상세(보관함 오른쪽 패널 400·모바일 시트). 미리보기 썸네일(4:3) → 이름 + 배지 줄 → 행동(열기 primary · 다운로드 · 더보기) → 탭(정보 | 기록). 정보 탭은 `dl.tk-meta`: Artifact ID · 형식(MIME) · 크기 · SHA-256 · 원본 위치 · 만든 작업 · 만든 시각 · 보존 · 반출 정책. 기록 탭은 다운로드·반출 감사 로그.

## 2. Viewer 셸

```html
<section class="tk-viewer" role="tabpanel" id="v-pdf" aria-labelledby="t-pdf">
  <div class="tk-viewer__toolbar">
    <button class="tk-icon-button tk-hide-from-lg" data-tk-dialog-close aria-label="목록으로">…back…</button>
    <div class="tk-viewer__title"><span class="tk-glyph tk-glyph--sm" data-type="pdf">…</span><h2 class="tk-viewer__name">결정사항-요약-1009.pdf</h2></div>
    <div class="tk-viewer__tools">
      찾기 · | · 축소 [100%] 확대 폭맞춤 · | · [1 / 2] · 다운로드 · 더보기
    </div>
  </div>
  <div class="tk-findbar" hidden>…</div>
  <div class="tk-viewer__notice">…변환 안내…</div>
  <div class="tk-viewer__body" tabindex="0" role="region" aria-label="PDF 페이지">…본문 7종 중 하나…</div>
  <div class="tk-viewer__followup">…컴포저…</div>
</section>
```
- **형식이 달라도 자리가 같다**(Unified Experience): 제목 · 찾기 · 배율 · 쪽 · 다운로드 · 더보기. 없는 기능은 자리를 비우지 않고 버튼을 뺀다. `.tk-viewer__wide` 를 붙인 도구(배율)는 md 미만에서 숨고, 모바일은 핀치 줌.
- 배율·쪽 값은 모노 tabular(`.tk-viewer__value`). 배율 버튼은 `data-tk-zoom="in|out|fit"`, 값은 `[data-tk-zoom-value]`, 대상은 `.tk-desk`·`.tk-stage` 의 `--tk-zoom`(1 = 폭 맞춤). 단계 50·75·100·125·150·200·300%.
- 다운로드는 **원본**이다(미리보기 파생 파일이 아니다). 버튼 이름도 "원본 다운로드".
- 데스크톱: 작업 공간·보관함의 분할 오른쪽. 모바일: `dialog.tk-viewer-dialog` 전체 화면(노치·홈 바 안쪽, 왼쪽 위 뒤로). 같은 뷰어 마크업을 두 자리에 렌더한다.
- 본문은 포커스 가능(키보드 스크롤), `aria-label` 로 무엇인지.

### Find bar
`[data-tk-find-open]` 이 연다(⌘/Ctrl+F 도). 입력 `[data-tk-find]` + `n/m` + 이전·다음 + 닫기. Enter 다음, Shift+Enter 이전, Esc 닫고 표시 지우기. 히트는 연민트 `mark[data-hit]`, 현재 위치는 원색 민트 + 테두리(`aria-current`). PDF·슬라이드는 PDF.js 텍스트 레이어에 같은 mark 를 쓴다.

### Notice
툴바 아래 한 줄. 변환 미리보기 안내(info), 부분 미리보기·큰 파일(warning). 언제나 원본으로 가는 링크를 함께 둔다.

## 3. 본문 7종

| 형식 | 마크업 | 렌더러 | 규칙 |
|---|---|---|---|
| Markdown · TXT · DOCX(HTML 변환) | `.tk-viewer__doc > article.tk-prose` | react-markdown + remark-gfm(+ GFM alert 플러그인, 패키지 선택은 확인 필요) · 서버 DOCX→HTML | 본문 열 720, 16/1.7. 맨 요소를 prose 가 받는다 |
| PDF · PPTX/DOCX(PDF 변환) | `.tk-viewer__body > .tk-desk > .tk-page` | PDF.js 캔버스 + 텍스트 레이어 | 책상 위 흰 페이지(다크에서도 흰 종이). `--a4`·`--slide` 비율. 화면 밖 페이지는 `data-pending` 빈 종이로 자리만(지연 로딩, 스크롤이 튀지 않는다) |
| 이미지 | `.tk-stage > img` | 브라우저 | 체커 바탕, `--tk-zoom`, `data-fit="actual"` 원본 크기, 터치 핀치 |
| HTML | `.tk-frame > .tk-frame__bar + iframe[sandbox]` | 별도 출처 iframe | 위 띠가 "격리된 미리보기 · 스크립트·외부 요청 꺼짐"을 항상 말한다 |
| XLSX · CSV | `.tk-cells-view > .tk-viewer__body > table.tk-cells` + `.tk-cells__tabs` | SheetJS 등 → 표 | 머리 행·첫 열 고정, 숫자 오른쪽, 빈 칸 tertiary, 시트 탭은 아래 |
| 소스코드 | `figure.tk-code.tk-code--viewer` (+ `.tk-code__monaco`) | Monaco(읽기 전용) · 가벼우면 Shiki | 잉크 면, 줄 번호, 줄 바꿈 토글. Monaco 테마는 `dist/monaco-theme.json` |
| 그 밖 | `.tk-viewer__state` | | 아래 §4 |

### HTML 격리(보안 계약)
- `sandbox=""`(아무것도 허용 안 함)가 기본. 스크립트가 필요한 결과물은 사용자가 "스크립트 허용…"을 눌러야 `allow-scripts` 만 더한다. **`allow-same-origin` 과 `allow-scripts` 를 함께 주지 않는다**(둘이 같이 있으면 sandbox 를 스스로 풀 수 있다).
- 앱과 다른 출처(예: `usercontent.` 하위 도메인)에서 제공하고, 응답에 CSP(`default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'`)를 건다.
- 위 띠(`.tk-frame__bar`)는 지우지 않는다. 사용자가 보는 것이 앱이 아니라 결과물이라는 표시다. 띠 아이콘은 정책 허용 색.

### Prose(`dist/prose.css`)
`.tk-prose` 안의 h1~h4·p·ul·ol·체크리스트·blockquote·table·pre·code·img·figure·details·mark·GFM alert(`.markdown-alert-note` 등)를 클래스 없이 받는다. `--compact` 는 에이전트 메시지 안(문단 12, 제목 18·16). 코드 블록은 잉크 면 + Prism·hljs·Shiki 매핑(외부 테마 CSS 를 넣지 않는다). 표는 넘치면 표만 가로 스크롤.

## 4. 미리보기 상태

요구사항 §4 "변환 실패 시 원본 다운로드 제공 · 미리보기 상태 표시 · 비동기 처리"의 화면. 어떤 상태에도 **원본 다운로드 또는 왜 못 받는지**가 있다.

```html
<div class="tk-viewer__state" data-state="failed" role="status">
  <span class="tk-glyph" data-type="doc">…</span>
  <p class="tk-viewer__state-title">미리보기를 만들지 못했어요</p>
  <p>문서 안의 표 서식을 변환하다 멈췄어요. 원본은 그대로 있어요. <code>convert: table nesting depth 6 &gt; 4</code></p>
  <div class="tk-button-group"><button class="tk-button">다시 변환</button><button class="tk-button tk-button--primary">원본 다운로드</button></div>
</div>
```

| `data-state` | 제목 | 보여줄 것 | 행동 |
|---|---|---|---|
| `pending` | 미리보기를 기다리는 중이에요 | 대기 순서 | 원본 다운로드 |
| `converting` | 미리보기를 만드는 중이에요 | 진행 막대(아는 만큼) · "12장 중 7장" | 원본 다운로드 |
| `failed` | 미리보기를 만들지 못했어요 | 사람 말 이유 + 기계 이유(모노) | 다시 변환 · 원본 다운로드(primary) |
| `unsupported` | 미리보기를 지원하지 않는 형식이에요 | 형식 · 크기 | 원본 다운로드 |
| `too-large` | 처음 1,000행만 보여드려요 | 원본 크기 | 부분 보기 · 에이전트에게 요약 시키기 |
| `blocked` | 이 기기에서는 열 수 없어요 | 정책 이유(`.tk-policy-note` 또는 배지) | 다운로드 `aria-disabled` + 이유 툴팁. Mac 에서 직접 열라는 안내 |
| `offline` | 오프라인이라 열 수 없어요 | 받아 둔 사본이 있으면 그 시각 | 받아 둔 사본 열기 |

변환 미리보기가 준비돼 본문을 보여줄 때도 PPTX·DOCX 는 Notice 를 붙인다: "PDF로 변환한 미리보기예요. 글꼴·애니메이션은 원본과 다를 수 있어요. 원본 받기".

## 5. 보면서 지시하기(Context Continuity)

```html
<div class="tk-viewer__followup"><form class="tk-composer" data-tk-composer aria-label="이 문서에 대해 지시하기">…</form></div>
```
뷰어 아래의 컴포저는 지금 보는 결과물을 문맥으로 이미 붙인 상태다(칩 없이 placeholder 가 말한다: "이 문서에 대해 지시하기 · 예: 3번을 더 짧게"). 보내면 채팅 스레드에 같은 지시가 문맥 칩과 함께 남는다. 모바일 전체 화면 뷰어에서도 아래에 붙어 있다(safe-area 안).

## 6. 하지 말 것

| ❌ | ✅ |
|---|---|
| 형식마다 다른 툴바 배치 | 자리 고정, 없는 기능만 뺀다 |
| 변환 실패를 빈 화면으로 | 상태 패널 + 원본 다운로드 |
| HTML 을 앱 DOM 에 `innerHTML` | 별도 출처 sandbox iframe |
| 다크에서 PDF 페이지를 어둡게 반전 | 문서는 원본 그대로(흰 종이), 책상만 어둡게 |
| 미리보기 파일을 "다운로드" | 다운로드는 언제나 원본, 이름도 "원본 다운로드" |
| 결과물을 새 브라우저 탭으로 | 같은 앱 안 뷰어 |
| 정책 배지를 모든 행에 | 허용은 조용히, 예외만 배지 |
