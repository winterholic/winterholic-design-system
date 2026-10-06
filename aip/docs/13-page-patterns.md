# 13 · 페이지 패턴 (AIP)

제품마다 완성 템플릿이 `examples/` 에 있다. 새 화면은 가장 가까운 템플릿을 복사해서 시작한다. 특정 페이지를 위해 시스템을 바꾸지 않는다. 필요하면 14 절차로 시스템에 먼저 넣는다.

| 제품 | 템플릿 | 밀도 | Brand Blue 비중 |
|---|---|---|---|
| 홈페이지 | `examples/home.html` | 낮음(넓은 여백, display 글자) | 히어로 CTA + 하단 CTA 띠 |
| Docs | `examples/docs.html` | 읽기 | 링크·현재 위치·코드 키워드만 |
| MakeAIP | `examples/makeaip.html` | 중간(폼) | 선택된 옵션 면 + Generate |
| Playground | `examples/playground.html` | 높음(도구) | Run 버튼·실행 노드 |
| 프로젝트 소개 | `examples/showcase.html` | 낮음(이미지·서사) | 주 CTA·메타 |
| 기술 프레젠테이션 | `examples/architecture.html` | 구조·설명 | Runtime·앵커 |
| 기술 포트폴리오 | `examples/case-study.html` | 읽기·근거 | 주 CTA·메타 |
| 전체 부품 | `examples/preview.html` | | |

## 1. 공통 셸

- 헤더는 네 제품이 같다(06 §14). `AIP / <제품>` 표기, 높이 56/64.
- 첫 요소 skip link, `main#main`.
- 푸터는 홈페이지에만. 문서는 Pager 가 끝이다. 앱(MakeAIP·Playground)은 푸터가 없다.

## 2. 홈페이지

1. 히어로: eyebrow(모노) → `display-xl`(핵심 단어 하나에 형광펜) → `lead` → 버튼 둘(primary + secondary, lg) | 오른쪽 3D Artwork(15·19)와 코드 목업(`.aip-code` + `shadow.lg`). 바탕 점 격자. 모바일은 세로 쌓기.
2. 원칙: 카드 3장(eyebrow + 제목 + 본문). 아이콘 장식 없이 글로 말한다.
3. 아키텍처: `.aip-flow` 한 줄 + 캡션. 색 문법을 문장으로 한 번 설명한다("Yellow is what you declare…").
4. CTA 띠: `surface.brand` + 흰 글자 + 흰 버튼. 페이지에 하나.
5. 푸터.

하지 않는다: 숫자 카운터 애니메이션, 로고 월, 그라데이션 블롭, 스크롤 리빌.

## 3. MakeAIP

```
[설정 열 560]                                   [미리보기 · sticky]
 eyebrow · heading-1 · 설명                       코드 탭(Files | aip.config) + 복사
 ─ Project   name(mono) · version                 생성 바: 요약(모노) · Share · Generate(primary lg)
 ─ Language  Segmented(TS | Python)               role=status 결과
 ─ Runtime   Option cards(radio)
 ─ Stack     Select · Select · Radio inline
 ─ Features  Option cards(checkbox) 2열
```
- 섹션은 hairline 으로 나눈다. 섹션 제목 `heading-3`, 선택지 묶음은 fieldset+legend.
- 큰 선택지는 Option card(`.aip-option`): 라디오/체크박스를 감싼 label. 선택되면 파랑 테두리 2겹 + `brand-subtle` 면. 버전·성숙도는 meta 줄.
- 미리보기는 설정이 바뀔 때마다 즉시 갱신(생성 버튼을 누르기 전에 결과가 보인다).
- lg 미만: 생성 바가 화면 아래 고정(`.aip-actionbar--sticky`), 요약 상세는 숨김.
- 결과는 다이얼로그가 아니라 그 자리 `.aip-status--success`.
- MakeAIP 만의 색·모양은 없다. 같은 컴포넌트에 Blue 비중만 조금 높다.

## 4. Playground

```
[툴바 48: Run(primary sm) · 실행 주체 Select · | · 초기화 · 공유 ······ sandbox 배지]
[에디터(코드 면)                 | 결과 탭: Result | Plan | Log(카운트)     ]
[상태 바 24: runtime · 언어 · 커서 위치                                     ]
```
- 높이는 화면에 꽉 차고(`.aip-workbench`), 패널 안에서만 스크롤.
- 에디터는 코드 면(slate), 커서 색은 AIP Yellow. 에디터 라이브러리를 붙이면 루트에 `.aip-editor` 를 건다.
- 결과: 상태 한 줄(`.aip-status`) + 표(`.aip-table`). Plan 은 코드 블록, Log 는 `.aip-run-log`(시간 모노 + 레벨 단어·색).
- lg 미만: 에디터 위·결과 아래로 쌓는다.
- "실행 주체"(누구로 실행하는가)를 툴바에서 바꿀 수 있어야 한다. 권한 판단이 AIP 의 핵심이라 거부 결과를 직접 볼 수 있게 한다.

## 5. Docs

07 §2 의 셸. 페이지 유형별 본문 순서:

| 유형 | 순서 |
|---|---|
| Quick Start | lead → 설치(코드 블록·셸 프롬프트) → 단계(h2 번호 없이 동사로 시작) → 결과 확인(Example) → 다음 단계(카드 링크 2~3) |
| Concept | lead → 한 문단 정의 → 다이어그램 → 하위 개념 h2 → 관련 문서 |
| Guide | lead → 전제(NOTE) → 단계 → 문제 해결(WARNING·details) |
| Specification | 절 번호 h2(`data-section`) → Spec block → 규범 문장(.aip-rfc) → Example |
| API / SDK Reference | 항목마다 ref-head → signature → params → 반환 → Example → 오류 표 |
| Architecture | 큰 SVG 다이어그램 + 텍스트 설명 → 구성 요소별 h2 |
| Security | 위협 → 보장(CAUTION·IMPORTANT) → 설정 |

## 6. 앱 조각의 마크업 계약

```html
<!-- MakeAIP -->
<form class="aip-configurator">
  <div class="aip-configurator__form">
    <section class="aip-config-section">…</section>             <!-- 섹션 사이 hairline. 선택지 묶음이면 fieldset.aip-config-section.aip-fieldset -->
  </div>
  <aside class="aip-configurator__preview">                    <!-- lg 이상 sticky -->
    <figure class="aip-code">…</figure>
    <div class="aip-actionbar aip-actionbar--sticky">
      <div class="aip-actionbar__summary"><span class="aip-actionbar__title">aip-starter</span><span class="aip-actionbar__detail">TypeScript · Node.js</span></div>
      <div class="aip-button-group">…Generate…</div>
    </div>
  </aside>
</form>
<label class="aip-option"><input type="radio" name="runtime"><span class="aip-option__head"><svg class="aip-icon aip-option__icon">…</svg><span class="aip-option__title">Node.js</span></span><span class="aip-option__desc">…</span><span class="aip-option__meta"><span class="aip-version">22 LTS</span></span></label>
<ul class="aip-tree"><li><button class="aip-tree__item aip-tree__item--folder">src/</button><ul><li><button class="aip-tree__item" aria-current="true">server.ts</button></li></ul></li></ul>

<!-- Playground -->
<main class="aip-workbench">
  <div class="aip-toolbar" role="toolbar" aria-label="…">… <span class="aip-toolbar__divider"></span> … <span class="aip-toolbar__spacer"></span> …</div>
  <div class="aip-panes">
    <section class="aip-pane" aria-label="Editor"><div class="aip-pane__header"><h2 class="aip-pane__title">intent.ts</h2></div>
      <div class="aip-pane__body aip-pane__body--code"><textarea class="aip-editor"></textarea></div></section>
    <section class="aip-pane" aria-label="Output"><div class="aip-pane__header">탭</div><div class="aip-pane__body">…<ol class="aip-run-log">…</ol></div></section>
  </div>
  <div class="aip-statusbar" role="status">…</div>
</main>
```
`.aip-tree` 는 생성될 파일 목록이다. 파일을 고르면 `aria-current="true"` 를 옮기고 옆 코드 미리보기를 바꾼다(그 연결은 제품 코드). 폴더는 `--folder`(선택 불가).

## 7. 오류·빈 페이지

404: 헤더 + `.aip-container--sm` 가운데 → eyebrow `404` → `heading-1` "This page moved or never existed" → 검색 트리거 → 홈·문서 링크. 500: 같은 골격 + 상태 페이지 링크. 일러스트 없음.

## 8. 오픈소스·포트폴리오 프레젠테이션

마케팅·상세 구조·케이스 스터디는 [19 프레젠테이션](19-presentation.md)의 배포 컴포넌트와 세 템플릿을 쓴다. homepage의 코드 목업은 기본 예시이고 유일한 히어로 형태가 아니다. `home.html`에는 3D Artwork와 코드가 함께 있으며, `showcase.html`은 대형 cover 방식이다.
