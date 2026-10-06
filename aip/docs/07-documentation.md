# 07 · 문서 컴포넌트 (AIP Docs)

AIP 에서 문서는 핵심 제품이다. 그리고 문서는 **사람과 AI 코딩 에이전트가 같이 읽는다.** 그래서 이 문서의 컴포넌트는 두 가지를 동시에 지킨다.

1. 사람에게: 오래 읽어도 편하고, 코드·명세·예시·경고가 한눈에 갈린다.
2. 기계에게: 구조를 **시맨틱 HTML 이 말한다**. 클래스와 색은 모양일 뿐이고, 정보는 태그·속성·텍스트에 있다.

## 1. AI 가 읽기 쉬운 문서의 계약

| 규칙 | 이유 |
|---|---|
| 페이지당 `<h1>` 하나, 바로 아래 `.aip-doc-lead` 한두 문장 | 에이전트가 페이지 요지를 첫 두 요소에서 얻는다 |
| 제목은 h2→h3→h4 순서로만, 건너뛰지 않는다 | 목차·청크 경계가 제목 구조를 따른다 |
| 모든 h2·h3 에 안정적인 `id`(영문 kebab) | 링크·인용·검색 결과가 절을 가리킨다. 문구를 바꿔도 id 는 유지 |
| 코드는 `<pre><code>` + 언어 표시(`data-lang` 또는 헤더 라벨) | 복사·실행 단위가 분명하다 |
| 정의는 `<dl>`(스펙·파라미터), 순서는 `<ol>`, 그림은 `<figure>`+`<figcaption>` | 표·목록 구조가 그대로 데이터가 된다 |
| 그림에는 항상 텍스트 설명 | 이미지만으로 정보를 주지 않는다(12 §5) |
| 셸 프롬프트 `$`·줄 번호·삭제된 diff 줄은 복사에서 빠진다 | 복사한 그대로 실행된다 |
| 규범 단어는 `<span class="aip-rfc">MUST</span>` | 명세 문장에서 요구 수준을 기계도 찾는다 |
| 페이지마다 "View as Markdown" 링크(같은 내용의 `.md`) | 에이전트는 HTML 크롬 없이 본문만 받는다 |
| 숨김 콘텐츠에 핵심 정보를 두지 않는다(탭은 예외: 언어별 같은 내용) | 크롤러·리더가 놓친다 |

## 2. 문서 셸

```html
<header class="aip-header">…</header>
<div class="aip-docs__mobilebar">메뉴 버튼 + 브레드크럼</div>          <!-- lg 미만 -->
<div class="aip-docs">
  <aside class="aip-docs__sidebar"><nav class="aip-sidebar" aria-label="Documentation">…</nav></aside>
  <div class="aip-docs__body">
    <main class="aip-docs__main" id="main">
      <div class="aip-docs__head">breadcrumb · h1.aip-doc-title · p.aip-doc-lead · .aip-docs__meta</div>
      <details class="aip-toc-disclosure">…</details>                   <!-- xl 미만에서 보인다 -->
      <article class="aip-doc">Markdown 렌더 결과</article>
      <nav class="aip-pager">…</nav>
    </main>
    <aside class="aip-docs__toc"><nav class="aip-toc">…</nav></aside>   <!-- xl 이상 -->
  </div>
</div>
```
전체 예시: `examples/docs.html`. 폭 규칙은 03 §3.
`.aip-docs__meta`: 버전(`.aip-version`) + 성숙도 배지 · 갱신일 · "Edit this page" · "View as Markdown".

## 3. Prose (`.aip-doc`): Markdown 을 그대로 받는다

`dist/prose.css` 를 로드하고 렌더 결과를 `<article class="aip-doc">` 에 넣으면 클래스 없는 h2·p·ul·ol·blockquote·pre·table·img·hr·mark·details·dl 이 전부 스타일된다.

- **GFM alert**: `> [!NOTE]` 등을 렌더러가 `.markdown-alert.markdown-alert-note` 로 내면 AIP 콜아웃(06 §10)과 같은 모양이 된다.
- **구문 강조**: Prism(`.token.*`)·highlight.js(`.hljs-*`)·Shiki(`css-variables` 테마의 `--shiki-*` 변수) 세 가지를 `color.code.*` 에 연결했다. 외부 테마 CSS 를 넣지 않는다.
- **앵커**: `<h2 id="x">Title <a class="aip-anchor" href="#x"><span class="aip-sr-only">Section link: Title</span>#</a></h2>`. hover·포커스에 보이고 터치 기기에서는 항상 보인다.
- **절 번호**(명세): `<h2 data-section="§ 3.2">`.
- 본문 링크는 밑줄, `<mark>` 는 형광펜(AIP Yellow).

## 4. Code Block

```html
<figure class="aip-code">
  <div class="aip-code__header">
    <span class="aip-code__title">src/intents/orders.ts</span>        <!-- 또는 <span class="aip-code__lang">shell</span> -->
    <button class="aip-copy" type="button" data-aip-copy aria-label="Copy code">
      <span class="aip-copy__idle">[copy 아이콘]</span><span class="aip-copy__done">[check 아이콘]</span>
      <span class="aip-copy__idle">Copy</span><span class="aip-copy__done">Copied</span>
    </button>
  </div>
  <pre class="aip-code__pre" tabindex="0"><code>…</code></pre>
</figure>
```

| 기능 | 마크업 | 모양 |
|---|---|---|
| 줄 번호 | `<pre … data-line-numbers>` + 줄마다 `<span class="aip-code__line">` | 40px 열, `code.line-number` |
| 강조 줄 | `<span class="aip-code__line" data-highlight>` | Yellow 14% 면 + 왼쪽 Yellow 3px |
| diff | `data-diff="+"` / `"-"` | 초록·빨강 20% 면 + 기호(색만으로 말하지 않는다) |
| 셸 프롬프트 | `<span class="aip-code__prompt">$</span>` | 선택·복사 안 됨 |
| 긴 코드 접기 | `<figure class="aip-code" data-collapsible>` | 560px 넘으면 페이드 + "Show all N lines" |
| 헤더 없음 | `<figure class="aip-code">` 안에 pre + `.aip-copy` | 복사 버튼이 오른쪽 위에 떠서 hover·포커스에 보인다 |

- 면 `code.bg`(slate)는 **두 테마 모두 어둡다**. 문서(종이)와 코드(slate)가 갈리는 첫 신호다.
- 글자 모노 14/1.6, 리거처 없음, 탭 2칸, 가로 스크롤(`pre` 가 `tabindex="0"` 이라 키보드로 스크롤).
- 복사: aip.js 가 프롬프트·`aria-hidden`·삭제 줄을 빼고 복사하고, 1.6초간 "Copied" + `aria-live` 알림. 클립보드 API 가 막히면 textarea 폴백, 그것도 실패하면 "직접 복사하라"고 알린다.
- 파일명이 있으면 `__title`, 없으면 언어 `__lang`. 둘 다 없으면 헤더를 생략한다.

## 5. Code Tabs

```html
<div class="aip-code aip-code-tabs" data-aip-sync="language">
  <div class="aip-code__header">
    <div class="aip-code-tabs__list" role="tablist" aria-label="Language">
      <button class="aip-code-tabs__tab" role="tab" id="t-ts" aria-controls="p-ts" aria-selected="true" data-aip-sync-value="ts">TypeScript</button>
      <button class="aip-code-tabs__tab" role="tab" id="t-py" aria-controls="p-py" aria-selected="false" data-aip-sync-value="py">Python</button>
    </div>
    <button class="aip-copy" … data-aip-copy>…</button>
  </div>
  <div role="tabpanel" id="p-ts" aria-labelledby="t-ts"><pre class="aip-code__pre">…</pre></div>
  <div role="tabpanel" id="p-py" aria-labelledby="t-py" hidden><pre class="aip-code__pre">…</pre></div>
</div>
```
AIP 는 JS/TS 와 Python 생태계를 함께 쓴다. **같은 `data-aip-sync` 값을 가진 탭은 페이지 전체가 같이 바뀌고 선택이 기억된다**(localStorage `aip-sync:language`). 그래서 언어 탭의 값은 사이트 전체에서 `ts`·`py` 처럼 하나로 고정한다. 복사는 보이는 패널만. 활성 밑줄은 Yellow(코드 면 위의 형광펜).

## 6. Inline Code

본문 안 `` `code` `` → `.aip-doc :not(pre) > code`. UI 안에서는 `<code class="aip-code-inline">`. 모노 0.875em, 칩 면 `code.bg-inline`, radius 2. 긴 식별자는 어디서든 줄바꿈된다. 링크 안의 코드는 링크 색을 따른다.

## 7. Callout

06 §10. 문서에서는 GFM alert 다섯 이름만 쓴다. 의미가 겹치는 다른 종류(Info·Danger·Success 따위)를 만들지 않는다.

| 쓰고 싶은 말 | 종류 |
|---|---|
| 알아 두면 좋은 정보 | NOTE |
| 더 잘하는 방법 | TIP |
| 반드시 알아야 하는 것 | IMPORTANT |
| 문제가 생길 수 있음 | WARNING |
| 데이터 손실·보안 위험 | CAUTION |

## 8. Sidebar · TOC · Breadcrumb · Pager

**Sidebar** (`nav.aip-sidebar`): 그룹 제목 `.aip-sidebar__title`(eyebrow), 항목 `.aip-sidebar__link`(높이 32, 14px), 현재 페이지 `aria-current="page"`(파랑 면 + 파랑 글자 + 500). 하위 묶음은 `<details><summary class="aip-sidebar__link">` 라 JS 없이 접힌다. 항목 옆 배지(experimental·MakeAIP)는 오른쪽 정렬. 모바일에서는 같은 마크업을 `dialog.aip-drawer` 안에 둔다.

**TOC** (`nav.aip-toc`): 제목 "On this page", h2 와 h3(`data-level="3"`)만. 왼쪽 1px 가이드선 위에 현재 절 3px 파랑 마커. aip.js 가 IntersectionObserver 로 `aria-current="true"` 를 옮긴다(첫 제목 전에는 첫 항목). xl 미만은 `details.aip-toc-disclosure` 로 본문 위에 접는다.

**Breadcrumb**: 06 §15. 문서 머리와 모바일 바에 같은 것을 둔다.

**Pager** (`nav.aip-pager`): 이전·다음 페이지. 방향 라벨(모노 대문자) + 페이지 제목(링크 색). 다음만 있으면 오른쪽에 붙는다.

## 9. Version · Lifecycle

`<span class="aip-version">v0.4.0</span>` + `<span class="aip-badge aip-badge--beta">beta</span>`. 성숙도는 네 단계뿐이다.

| 배지 | 뜻 | 색 |
|---|---|---|
| `stable` | 하위 호환 보장 | green |
| `beta` | 바뀔 수 있으나 쓸 만함 | blue |
| `experimental` | 언제든 바뀌거나 사라짐 | tangerine |
| `deprecated` | 다음 major 에서 제거 | red |

API 항목에는 `.aip-since`(모노 `since v0.2`)를 함께 둔다. 버전 전환기는 헤더의 Dropdown(`menuitemradio`).

## 10. Specification block

```html
<section class="aip-spec" aria-labelledby="s1">
  <header class="aip-spec__header">
    <span class="aip-spec__kind">Spec</span><h3 class="aip-spec__title" id="s1">Intent request</h3>
    <span class="aip-badge aip-badge--beta">beta</span><span class="aip-spec__id">aip.intent/v1</span>
  </header>
  <dl class="aip-spec__fields"><div class="aip-spec__field"><dt>name</dt><dd>Stable identifier.</dd></div>…</dl>
  <div class="aip-spec__body"><p>The Runtime <span class="aip-rfc">MUST</span> …</p></div>
</section>
```
**정본(normative) 정의**를 담는다. 코드(slate)와 달리 종이 위의 표이고, 위에 2px AIP Blue 선이 "정본" 표시다. 필드는 `<dl>`(이름 모노 | 설명), sm 이상에서 1:2.5 두 열. 규범 단어는 `.aip-rfc`(모노 대문자 semibold, 색 없음). 스펙 ID 는 오른쪽 모노.

## 11. Example block

```html
<figure class="aip-example">
  <figcaption class="aip-example__label"><span class="aip-example__tag">Example</span> A denied request</figcaption>
  <div class="aip-example__body">코드 블록 · 설명</div>
  <div class="aip-example__result"><p class="aip-example__result-label">Result</p>…</div>
</figure>
```
입력 → 결과를 한 덩어리로 보인다. 왼쪽 3px 형광펜 노랑 바 + 노란 라벨 띠(AIP Yellow = Example). 결과는 점선 아래 `surface.subtle`, 상태는 `.aip-status`. 예시가 정본이 아니라는 것을 모양으로 말한다(스펙은 파랑 선, 예시는 노랑 바).

## 12. Parameter / Property rows

```html
<dl class="aip-params">
  <div class="aip-param">
    <dt class="aip-param__head" id="ref-run-input">
      <code class="aip-param__name">input</code><span class="aip-param__type">Record&lt;string, unknown&gt;</span>
      <span class="aip-param__optional">optional</span>                       <!-- 또는 <span class="aip-param__required">required</span> -->
    </dt>
    <dd class="aip-param__desc"><p>…</p><p class="aip-param__default">Default: <code>20</code></p>
      <details class="aip-params-nested"><summary>Show 2 properties</summary><dl class="aip-params">…</dl></details>
    </dd>
  </div>
</dl>
```
이름(모노 semibold) · 타입(모노 secondary) · required/optional(**색 없이 단어**: required 는 진한 semibold, optional 은 tertiary) · 성숙도 배지. 행 사이는 `border.subtle`. 하위 속성은 접힌 상자 안에 같은 목록. 각 `dt` 에 id 를 주면 파라미터 단위로 링크된다.

## 13. API / SDK Reference 항목

```html
<div class="aip-ref-head"><h3 id="ref-run"><code>client.run()</code></h3><span class="aip-badge aip-badge--stable">stable</span><span class="aip-since">since v0.2</span></div>
<pre class="aip-signature"><span class="aip-signature__name">run</span>(intent: Intent, input?: Input): Promise&lt;Result&gt;</pre>
<dl class="aip-params">…</dl>
```
순서: 제목(코드) + 성숙도 + since → 시그니처 → 한 줄 설명 → 파라미터 → 반환값 → 예시(Example) → 오류. 시그니처는 실행할 코드가 아니라 선언이라 **밝은 면**(`surface.subtle` + 테두리)에 줄바꿈된다.

## 14. Architecture Diagram Container

12 §4. `figure.aip-diagram` = 점 격자 캔버스 + 캡션 + 범례 + 텍스트 설명.

## 15. Search UI

```html
<button class="aip-search-trigger" type="button" data-aip-search-open>[search] <span>Search docs</span><kbd>⌘K</kbd></button>
<dialog class="aip-search" aria-label="Search documentation">
  <div class="aip-search__field">[search]<input class="aip-search__input" type="search" aria-label="Search docs"><kbd>esc</kbd></div>
  <ul class="aip-search__results">
    <li class="aip-search__group" role="presentation">Concepts</li>
    <li><a class="aip-search__result" href="…"><span class="aip-search__title">…</span><span class="aip-search__path">docs / concepts / intents</span></a></li>
  </ul>
  <p class="aip-search__empty" hidden>No results for “<span data-aip-search-query></span>”.</p>
  <div class="aip-search__footer">↑↓ move · ↵ open · esc close</div>
</dialog>
```
- 열기: 트리거 클릭, ⌘K·Ctrl+K, 입력 중이 아닐 때 `/`.
- aip.js 가 combobox(`aria-controls`·`aria-activedescendant`) + listbox/option 을 붙인다. ↑↓ 이동, ↵ 열기, Esc 닫기 후 원래 포커스로.
- 결과: 제목 + 경로(모노 tertiary, 문서 위치를 경로로 보인다). 선택 항목은 파랑 면 + 왼쪽 2px. 일치 부분은 `<mark>`(형광펜).
- 데모의 필터링은 텍스트 포함 검사다. 실제 검색 엔진은 제품이 붙이고, 결과 마크업만 이 계약을 따른다.
- 모바일: 트리거는 아이콘 버튼이 되고 다이얼로그는 화면 폭 − 32.
