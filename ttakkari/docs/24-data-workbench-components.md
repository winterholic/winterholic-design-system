# 24 · 데이터·작업대 컴포넌트 (Ttakkari)

`components/data.css`(표·지표·차트·diff·타임라인)와 `components/workbench.css`(도구줄·칸 나누기·에디터·캔버스·원격 화면)의 마크업 계약이다. 화면을 어떻게 짜는지는 [21 페이지 아키타입](21-page-archetypes.md), 만들면서 터지는 실수는 [22](22-ui-error-prevention.md).

공통 약속

- 넘치는 것은 **그 상자만** 스크롤한다. 페이지는 가로로 밀리지 않는다.
- 숫자는 mono·tabular, 오른쪽 정렬. 상태와 증감은 색만으로 말하지 않는다(기호·글자 동반).
- 긴 값이 들어올 수 있는 글자는 `<span>` 으로 감싼다. 감싼 글자만 말줄임이 된다(맨 글자는 flex 안에서 말줄임이 되지 않는다).
- 말줄임이 생기면 전체 글자를 `title` 이나 상세에서 보여 준다.
- 새 토큰은 `color.art.halo` 하나뿐이다. 나머지는 기존 토큰이다.

## 1. Data table

```html
<section class="tk-datatable tk-datatable--sticky-col" aria-label="실험 실행 목록">
  <div class="tk-datatable__bar">…건수·필터…</div>                                   <!-- 선택 -->
  <div class="tk-datatable__scroll" role="region" aria-label="실행 표(가로로 스크롤)" tabindex="0">
    <table>
      <thead><tr>
        <th scope="col" aria-sort="ascending"><button class="tk-datatable__sort" type="button">이름</button></th>
        <th scope="col" class="tk-datatable__num">eval loss</th></tr></thead>
      <tbody><tr aria-selected="false"><th scope="row" class="tk-datatable__clip" title="전체 이름">…</th><td class="tk-datatable__num">1.482</td></tr></tbody>
    </table>
  </div>
  <div class="tk-datatable__foot">…쪽 이동·마지막 갱신…</div>                      <!-- 선택 -->
</section>
```

| 클래스 | 뜻 |
|---|---|
| `.tk-datatable` | 틀. 테두리·둥근 모서리. 넘침을 자른다 |
| `__scroll` | 가로·세로 스크롤 상자. 키보드로 스크롤하도록 `tabindex="0"` + `role="region"` + 이름 |
| `__bar` · `__foot` | 스크롤하지 않는 위·아래 줄 |
| `--scroll-y` | 높이 384 로 제한하고 머리 행을 고정한다. 부모가 높이를 정하면 `--fill` |
| `--compact` | 행 높이 32. 터치(coarse)에서는 누르는 행을 44 로 되돌린다 |
| `--sticky-col` | 첫 열 고정. 가로로 밀어도 무엇의 줄인지 보인다 |
| `--stack` | 767 이하에서 행을 카드로 바꾼다. 칸에 `data-label` 필수. 열 5개 이하에만 |
| `__num` | 숫자 칸(오른쪽 정렬·줄바꿈 없음). 머리 칸에도 같이 |
| `__clip` | 한 줄 말줄임 칸(경로·제목). `title` 로 전체 |
| `__mono` | 코드·ID 칸 |
| `__sort` | 정렬 머리 버튼. `th[aria-sort]` 가 화살표를 정한다 |
| `__state` | 빈·오류 행: `<tr class="tk-datatable__state"><td colspan="n"><div class="tk-empty">…</div></td></tr>` |

일반 칸은 288 폭에서 줄을 바꾸고(`overflow-wrap: anywhere`), 그 밖의 폭은 표 상자가 스크롤한다. 선택은 `tr[aria-selected]`, 클릭 가능한 행은 `tr[tabindex]` 또는 `tr[data-href]`.

## 2. Stat

```html
<div class="tk-stats"><div class="tk-stat">
  <span class="tk-stat__label">검증 손실</span>
  <span class="tk-stat__value">1.482</span>
  <span class="tk-stat__delta" data-tone="positive">▼ 0.031</span>
  <svg class="tk-spark" …/>                                                     <!-- 선택 -->
</div></div>
```

`.tk-stats` 는 칸 너비가 144 아래로 줄지 않는 자동 격자다(모바일 2열, 넓으면 4열 이상). `data-tone` 은 `positive|negative|warning|neutral`. 방향(▲▼)과 좋고 나쁨은 다르다. 손실은 내려가는 것이 positive, 주식은 상승이 빨강인 관례라 **페이지가 tone 을 고르고** 화살표·부호가 방향을 말한다. 값 안의 단위는 `.tk-stat__unit`.

## 3. Chart · Legend · Spark

```html
<figure class="tk-chart tk-chart--wide" aria-labelledby="t1">
  <div class="tk-chart__head"><h3 class="tk-chart__title" id="t1">학습 손실</h3>
    <ul class="tk-legend"><li><button class="tk-legend__item" data-series="1" aria-pressed="true"><span>train</span></button></li></ul></div>
  <div class="tk-chart__plot" role="img" aria-label="추세·최댓값·최솟값을 한 문장으로">
    <svg viewBox="0 0 320 180" preserveAspectRatio="none">
      <line class="tk-chart__grid" …/><path class="tk-chart__area" data-series="1" d="…"/><path class="tk-chart__line" data-series="1" d="…"/></svg>
  </div>
  <p class="tk-chart__readout" role="status">스텝 4,000 · train 0.36</p>          <!-- 터치용 값 줄 -->
  <details class="tk-chart__data"><summary>데이터 표로 보기</summary>…tk-datatable…</details>
</figure>
```

- 래퍼는 차트 라이브러리를 정하지 않는다. SVG 든 canvas 든 `.tk-chart__plot` 안에 `position: absolute; inset: 0` 으로 들어간다. 비율은 기본 16:9(`--tall` 4:3 · `--wide` 21:9 · `--square`), 최소 높이 192.
- 시리즈 색은 `data-series` 1에서 6이 `color.chart.categorical.N` 을 `--tk-_series` 로 건넨다. **색만으로 구분하지 않는다.** 둘째 선부터 `data-dash`, 범례에 이름, 읽기 줄에 값.
- 차트마다 `role="img"` + 한 문장 요약(`aria-label`)과 데이터 표(`details`)를 둔다. 호버 툴팁(`.tk-chart__tip`)만으로 값을 전하지 않는다. 터치는 점을 누르면 `__readout` 이 바뀐다.
- 상태: `aria-busy="true"` 면 plot 이 스켈레톤 면이 되고, 빈·오류는 plot 위에 `.tk-chart__state`(한 겹) 를 얹는다.
- 범례는 켜고 끄는 버튼(`aria-pressed`), 터치에서 44.
- `.tk-spark`: 축·범례 없는 한 줄 추세. `.tk-stat` 안이나 표 칸 옆. 높이 32.
- 트리맵·히트맵처럼 칸이 많은 시각화는 767 이하에서 목록으로 바꾼다(구조 트리맵 사고, 22).

## 4. Diff

```html
<section class="tk-diff" aria-label="FileDiff.tsx 변경">
  <header class="tk-diff__file"><button type="button" aria-expanded="true">
    <span class="tk-diff__path"><span class="tk-diff__dir">front/src/features/viewer/</span><b class="tk-diff__name">FileDiff.tsx</b></span></button>
    <span class="tk-diff__stat"><span>+12</span><span>−3</span></span></header>
  <div class="tk-diff__body" tabindex="0" role="region" aria-label="FileDiff.tsx 코드">
    <table class="tk-diff__table"><tbody>
      <tr class="tk-diff__hunk"><td colspan="4">@@ -10,6 +10,14 @@ export function FileDiff</td></tr>
      <tr data-diff="+"><td class="tk-diff__no"></td><td class="tk-diff__no">11</td><td class="tk-diff__sign">+</td><td class="tk-diff__code">…</td></tr>
    </tbody></table></div>
</section>
```

- 잉크 면(코드와 같다). 추가·삭제는 `tr[data-diff="+"|"-"]` + 기호 칸이 말한다(색만으로 말하지 않는다).
- 경로는 폴더가 먼저 줄어들고(`__dir` 말줄임) 파일 이름(`__name`)은 끝까지 남는다.
- 줄 번호 두 칸은 가로 스크롤에서 **왼쪽에 고정**된다. 긴 줄은 `[data-wrap]`(줄 바꿈 버튼 `data-tk-diff-wrap`)로 접어 읽는다. 모바일 기본은 줄 바꿈 끔 + 가로 스크롤, 읽기 모드에서 켠다.
- 나란히 보기는 `[data-view="split"]`(md 이상에서 호출부가 고른다). 한 행이 번호·기호·코드 × 2.
- 파일 머리 버튼이 `aria-expanded` 로 접고 편다(tk.js `initDiffs`). 큰 diff 는 파일 단위로 접어서 시작한다.
- 리뷰 댓글은 `tr.tk-diff__thread > td > *`(종이 면 카드). 가로로 스크롤해도 화면 안에 머문다.

## 5. Timeline

`<ol class="tk-timeline"><li data-state="succeeded|running|waiting|failed"><span class="tk-timeline__node">아이콘</span><div class="tk-timeline__body"><span class="tk-timeline__title">…</span><span class="tk-timeline__meta">…</span></div></li></ol>`
커밋·PR 활동·실험 기록·작업 이력. 상태색은 run 6상태 토큰을 그대로 쓴다.

## 6. Toolbar

`<div class="tk-toolbar" role="toolbar" aria-label="서식"><div class="tk-toolbar__group">…</div><span class="tk-toolbar__spacer"></span>…</div>`
한 줄. 넘치면 이 줄만 가로 스크롤한다(줄바꿈은 화면 위쪽을 키운다). 그룹 사이는 얇은 선. 안의 아이콘 버튼은 32(터치 히트 44). 켜짐은 `aria-pressed`. `--bottom` 은 키보드 바로 위·화면 아래에 두는 변형(safe-area 포함).

## 7. Panes

```html
<div class="tk-panes" data-tk-panes>
  <div class="tk-panes__tabs tk-tablist tk-tablist--fill" role="tablist"><button class="tk-tab" role="tab" aria-controls="p-main" aria-selected="true">대화</button>…</div>
  <div class="tk-panes__body">
    <section class="tk-panes__pane tk-panes__pane--start" id="p-src">…</section>
    <section class="tk-panes__pane tk-panes__pane--main" id="p-main" data-active>…</section>
    <section class="tk-panes__pane tk-panes__pane--end" id="p-out">…</section></div></div>
```

- 칸 수는 **컨테이너 폭**이 정한다(사이드바가 폭을 먹는 데스크톱에서도 맞는다). 컨테이너가 64rem(1024) 미만이면 `data-active` 인 칸 하나와 탭, 이상이면 전부 나란히(시작 280 · 가운데 360 이상 · 끝 360, 80rem 이상이면 400).
- `--tabs`: 폭과 무관하게 언제나 탭으로 한 칸씩(PR 의 대화·커밋·변경 파일처럼 **같은 대상의 다른 보기**).
- 한 칸을 접으려면 `data-collapsed`. 칸 안은 `__head`(제목 줄 48) + `__scroll`(칸 안 스크롤).
- 채팅|작업 공간 분할(손잡이로 폭 조절)은 기존 `.tk-split`. 손잡이가 필요 없는 고정 칸이 이 컴포넌트다.
- 탭 동작은 기존 `role=tablist` 계약(화살표 이동)을 그대로 쓰고, `initPanes` 가 `data-active` 를 맞춘다.

## 8. Editor

`.tk-editor` > `.tk-toolbar.tk-editor__toolbar`(위 고정) + `.tk-editor__scroll` > `.tk-editor__surface.tk-prose`(contenteditable, 읽기 폭 720) + `.tk-editor__status`(저장 상태·글자 수).
입력은 16(iOS 확대 방지), 마지막 줄 아래에 키보드가 가려도 읽히도록 넉넉한 여백. 원문 모드는 `.tk-editor__source`(모노 textarea). 서식 버튼은 `aria-pressed`, 저장 상태는 `data-save="saving|saved|error"` 와 글자(색만으로 말하지 않는다). 발행은 되돌리기 어려우니 Dialog 로 한 번 묻는다.

## 9. Canvas · Node · Edge

```html
<div class="tk-canvas" data-tk-canvas data-tk-fit tabindex="0" role="application" aria-label="구조 그래프. 방향키 이동, 더하기·빼기 확대, 0 전체 보기">
  <div class="tk-canvas__stage">
    <svg class="tk-canvas__edges" width="800" height="320"><path class="tk-edge" data-active d="M230 150 C…"/></svg>
    <div class="tk-node" data-tk-node data-kind="agent" data-state="running" role="button" tabindex="0" style="left:40px;top:120px">
      <span class="tk-node__port" data-side="in"></span><div class="tk-node__head"><svg class="tk-icon"/><span class="tk-node__title">오케스트레이터</span></div><span class="tk-node__meta">접수·기획·작업</span></div></div>
  <div class="tk-canvas__controls" role="group" aria-label="보기">…<button data-tk-canvas-action="in|out|fit|reset"></div></div>
```

- 이동·확대 상태는 `--tk-pan-x`, `--tk-pan-y`, `--tk-zoom` 셋(외부 계약)이다. tk.js 가 포인터 끌기·핀치·휠·키보드를 처리하고 `tk:canvaschange` 를 낸다. React 는 같은 변수를 쓰면 된다.
- 노드는 stage 안 절대 좌표. 제목은 한 줄 말줄임. 종류는 아이콘과 글자(`data-kind` 색은 보조: agent 민트, human 블루, hook amber). 상태는 `data-state`.
- **그래프만 있고 목록이 없으면 안 된다.** 스크린 리더·키보드·작은 화면을 위해 같은 노드의 목록(`.tk-list`)을 다른 탭에 둔다(21 §그래프).
- 노드가 50개를 넘으면 클러스터로 접거나 화면에 보이는 것만 그린다. 미니맵(`.tk-canvas__minimap`)은 768 이상에서만 보인다. 좁은 화면은 "전체 보기" 버튼이 대신한다.
- 선택된 노드의 상세는 모바일 시트, 데스크톱 끝 칸.

## 10. Stream · Keybar · Pad

```html
<section class="tk-stream" data-state="live|connecting|degraded|lost" aria-label="원격 화면">
  <div class="tk-stream__view" tabindex="0"><video|canvas/><div class="tk-stream__hud"><span data-quality="good">18 ms</span><span>30 fps</span></div>
    <div class="tk-stream__status" role="status">…연결 중·끊김 안내와 행동…</div></div>
  <div class="tk-stream__bar" role="toolbar" aria-label="원격 제어">…아이콘 버튼…<span class="tk-stream__spacer"></span><button class="tk-button tk-button--sm tk-button--danger">연결 끊기</button></div></section>
<div class="tk-keybar" role="group" aria-label="특수 키"><button class="tk-keybar__key" aria-pressed="false">Ctrl</button>…</div>
```

- 영상은 늘리지 않고 비율대로 안에 넣는다(`object-fit: contain`). 높이는 헤더·탭바를 뺀 화면을 넘지 않는다.
- `data-state` 가 live 가 아니면 상태 막이 영상을 덮고 **입력을 막는다**. `degraded` 는 아래 띠로만 알린다.
- 연결 끊기는 danger, 되돌릴 수 있는 일이라 확인을 한 번 더 묻지 않는다. 원격 조종을 **시작**하는 것은 Approval 카드(Mac 에서 승인된 기기만).
- `data-fullscreen`(또는 `:fullscreen`)은 화면 전체. 좌우 노치와 아래 홈 바를 피한다.
- Keybar 는 폰에 없는 키(Esc·Tab·Ctrl·방향). 수식 키는 `aria-pressed` 로 눌림을 유지한다. Pad 는 상대 좌표 포인터를 위한 가상 트랙패드(3:2).
- 같은 망(VPN)에서만 연결된다는 안내를 화면 위 `.tk-banner` 한 줄로 항상 보인다.

## 11. Art (일러스트 자리)

[23 일러스트 자산](23-illustration-assets.md) 이 목록·크기·파일명을 갖는다. 마크업은 다음 둘이다.

```html
<figure class="tk-art tk-art--md" data-art="state-empty"><img src="…/state-empty-480.webp" alt="" width="480" height="480" loading="lazy" decoding="async"></figure>
<figure class="tk-art tk-art--md" data-pending data-art="state-empty"><svg class="tk-icon"/></figure>   <!-- 그림이 아직 없을 때 자리만 -->
```

- 크기 `--sm` 96 · 기본 154 · `--lg` 230. 정사각 상자 안에 비율대로 들어가고 상자를 넘지 않는다. 가로 모드 폰에서는 줄어든다.
- `alt=""`. 그림은 장식이고 뜻은 옆 글(`.tk-empty__title`)이 말한다.
- 다크에서는 `color.art.halo`(Paper) 한 겹이 Ink 외곽선을 띄운다. 라이트에서는 투명이라 아무 일도 없다.
- `.tk-empty > .tk-art` 로 쓴다. 로딩(스켈레톤)·아바타 자리에 쓰지 않는다.

## 12. tk.js 추가 동작

| 함수 | 마크업 | 하는 일 |
|---|---|---|
| `initPanes` | `[data-tk-panes]` | 탭 선택을 `data-active` 로 옮긴다 |
| `initCanvas` | `[data-tk-canvas]` | 끌기·핀치·휠·키보드, 줌 버튼, `data-tk-fit` 으로 처음에 전체 보기, `tk:canvaschange` |
| `initDiffs` | `.tk-diff` | 파일 머리 접기, `[data-tk-diff-wrap]` 줄 바꿈 토글 |
| 말줄임 title | `.tk-truncate` `.tk-list__title` `.tk-datatable__clip` … | 마우스를 올리면 잘린 요소에만 `title` |

React 앱은 이 파일을 쓰지 않고 같은 ARIA·키보드·`data-*` 계약을 구현한다(19).
