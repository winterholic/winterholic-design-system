# 19 · 오픈소스 프레젠테이션

제품 소개와 기술 포트폴리오는 Docs보다 넓은 이미지, 긴 서사, 비교와 근거를 필요로 한다. `components/presentation.css`가 `dist/components.css`에 포함되므로 소비 앱은 예제 전용 CSS를 복사할 필요가 없다. 기존 색·타입·간격 토큰을 그대로 쓴다.

## 1. 어떤 페이지에서 시작할까

| 목적 | 템플릿 | 순서 |
|---|---|---|
| 프로젝트의 가치를 처음 소개 | [showcase.html](../examples/showcase.html) | 대형 이미지·약속 → 문제 → 구조 비교 → 작동 방식 → 근거·한계 → 다음 행동 |
| 기술을 깊이 설명 | [architecture.html](../examples/architecture.html) | 제목·3D 레이어 → 전체 경로 → 책임·경계 → 선택·대가 → 한계 |
| 개발자의 판단과 기여를 소개 | [case-study.html](../examples/case-study.html) | 역할·기간 → 상황·성공 기준 → 대안·선택 → 검증 → 배운 점 |

신규 페이지의 주 독자는 도구를 검토하는 개발자와 기술 포트폴리오를 읽는 사람이다. 첫 과업은 프로젝트가 무엇을 해결하고 어떤 근거가 있는지 이해하는 것이다. 소개 화면은 Docs로, 상세 화면은 재현 자료나 저장소로 이어진다. 예제 링크는 로컬 템플릿으로 연결했다. 게시 시 실제 목적지로 교체한다.

## 2. 조립 계약

### 페이지와 히어로

`.aip-story`는 전체 프레젠테이션의 본문이다. 제목·이미지·설명은 항상 HTML로 남긴다. h1 하나, skip link, main, 섹션 제목과 안정 id를 유지한다.

```html
<main class="aip-story" id="main" tabindex="-1">
  <section class="aip-story-hero" aria-labelledby="hero-title">
    <div class="aip-container aip-container--lg aip-story-hero__inner">
      <div class="aip-story-hero__copy">
        <p class="aip-mono-label aip-text-brand">프로젝트 / 분야</p>
        <h1 class="aip-display-xl" id="hero-title">해결하는 문제를 한 문장으로</h1>
        <p class="aip-lead aip-text-secondary">독자가 판단할 수 있는 구체적인 약속.</p>
        <a class="aip-button aip-button--primary aip-button--lg" href="#mechanism">작동 방식</a>
      </div>
      <figure class="aip-artwork">
        <img src="/brand/runtime-layers-3d.webp" alt="" width="1536" height="1024">
        <figcaption>개념 이미지. 정확한 구조는 본문에서 설명합니다.</figcaption>
      </figure>
    </div>
  </section>
</main>
```

- `.aip-story-hero--cover`: 제목 위계 다음에 전폭 이미지를 둔다. 기본은 좌측 문구·우측 이미지, cover는 모든 폭에서 세로다.
- `.aip-artwork`: 이미지와 HTML 캡션. 로고, 텍스트, UI를 이미지에 구워 넣지 않는다.
- `.aip-artwork--contain`: 캐릭터를 자르지 않고 은은한 시맨틱 면 위에 놓는다.
- `.aip-project-meta`: `dl`의 역할·기간·분야·상태. 모바일 2열, 768 이상 4열. 확인하지 않은 역할·기간·성과를 예제에서 만들지 않는다.
- 첫 화면 이미지만 eager, 나머지는 `loading="lazy"`. width·height를 적어 레이아웃 이동을 줄인다. WebP로 제공하고 PNG 정본을 보존한다.

### 장 내비게이션과 본문

```html
<nav class="aip-chapter-nav" aria-label="이 페이지의 장">
  <div class="aip-container aip-container--lg aip-chapter-nav__inner">
    <a href="#mechanism"><span>01</span>작동 방식</a>
  </div>
</nav>
<section class="aip-chapter" id="mechanism" aria-labelledby="mechanism-title">
  <div class="aip-container aip-container--lg aip-chapter__inner">
    <header class="aip-chapter__intro">
      <h2 class="aip-heading-1" id="mechanism-title">의도에서 실행으로</h2>
      <p class="aip-body-md aip-text-secondary">이 장이 답할 질문.</p>
    </header>
    <div class="aip-chapter__body">다이어그램·코드·비교·근거</div>
  </div>
</section>
```

앵커는 JS 없이 작동한다. 1024 이상에서 서론:본문 = 1:2, 그 아래는 읽는 순서대로 쌓인다.

**1:2 는 본문이 서론보다 풍부할 때만 맞다.** 본문이 한 문장·짧은 목록이면 양쪽이 비고, 비교·흐름·카드 3열처럼 넓은 시각 자료면 2/3 열에서 잘리거나 눌린다. 그때는 `aip-chapter--stacked` 로 서론을 위(최대 md 폭), 본문을 전체 폭에 둔다. 한 페이지의 장을 전부 같은 골격으로 찍지 말고 내용에 맞춰 섞는다. 넓은 시각 자료를 장 밖으로 빼서 장을 세 덩어리로 쪼개지 않는다. 내비게이션은 줄바꿈한다. 별도 sticky 바나 자동 스크롤을 추가하지 않는다.

Story 안의 HTML Flow 노드는 본문 열에 맞춰 균등하게 줄어든다. 고정 최소 폭으로 양끝 노드를 자르지 않는다. 768 미만에서는 기존 Flow 규칙대로 세로다.

### 문제 진술과 비교

```html
<blockquote class="aip-statement">
  <p>문제를 한 문장으로 보여줍니다.</p>
  <cite>실제 인용이면 출처. 자체 문제 진술이면 그 성격.</cite>
</blockquote>
<div class="aip-comparison">
  <section class="aip-comparison__side" aria-labelledby="before-title">
    <h3 class="aip-heading-2" id="before-title">기존 방식</h3><p>같은 기능의 경로.</p>
  </section>
  <section class="aip-comparison__side" aria-labelledby="after-title">
    <h3 class="aip-heading-2" id="after-title">변경한 방식</h3><p>어느 책임이 이동했는지.</p>
  </section>
</div>
```

Before/After는 삭제된 코드 줄 수보다 **동일한 과업의 책임 변화**를 보여준다. 비교 대상, 포함·제외 범위를 명시한다. 모바일은 이전→이후로 쌓이고 768 이상 2열이다. 색만으로 구분하지 않는다.

- 두 쪽은 같은 면이다. 한쪽만 회색 면을 깔면 무게가 기운다. 구분은 라벨(`aip-mono-label`)과 제목이 한다.
- 양쪽 맨 아래 예시는 `aip-comparison__foot` 에 넣는다. 목록 길이가 달라도 예시가 같은 높이에서 시작한다. 비교 아래에 코드 블록과 캡션을 따로 쌓지 않는다.
- Statement 는 면 없이 큰 글자와 왼쪽 선으로 말한다. 한 줄짜리 문장에 형광펜 면을 깔면 경고 콜아웃처럼 읽히고 장 제목보다 시선을 끈다. 선언된 의도를 인용할 때만 `aip-statement--highlight`.

### 기능과 시각 자료

```html
<div class="aip-feature-stage">
  <div class="aip-feature-stage__copy"><h3 class="aip-heading-2">기능</h3><p>왜 유용한지</p></div>
  <div class="aip-feature-stage__visual">실제 UI·코드·다이어그램·브랜드 이미지</div>
</div>
```

`.aip-feature-stage--reverse`는 데스크톱에서 시각 자료를 왼쪽으로 옮긴다. 모바일 DOM 순서는 설명→시각 자료다. 기능 모두를 같은 카드로 만들지 않는다. 화면 목업에는 실제 UI를 쓰고, 생성 이미지에는 개념 이미지 캡션을 붙인다.

### 근거, 설계 결정, 진행 과정

```html
<article class="aip-proof">
  <h3 class="aip-heading-3">지연 시간</h3>
  <p class="aip-proof__value">미측정</p>
  <p>측정 후 p95 값과 단위를 넣습니다.</p>
  <p class="aip-proof__scope">비교 대상 · workload · 환경 · 실행일 · 결과 링크</p>
</article>
<ol class="aip-decision-list">
  <li><h3 class="aip-heading-2">선택한 구조</h3>
    <div class="aip-decision-list__reason"><p>선택 이유</p>
      <dl><div><dt>대안</dt><dd>검토한 대안</dd></div><div><dt>대가</dt><dd>감수한 비용</dd></div></dl>
    </div>
  </li>
</ol>
<ol class="aip-milestones">
  <li><span class="aip-milestones__index">01</span>
    <div class="aip-milestones__body"><h3 class="aip-heading-3">검증 단계</h3><p>결과와 다음 조건</p></div>
  </li>
</ol>
```

성과 수치는 출처·명령·환경·기준 커밋·날짜를 짝지어야 한다. 테스트 개수, 속도, 사용자는 서로 다른 근거다. 최신 제품 문서의 숫자를 복사해 넣어도 새로운 성능 보증이 되지는 않는다. 예제는 `미측정`·`자료 입력 전`으로 남겨두었다. 실제 실행 자료가 없으면 그래프 대신 측정 계획과 한계를 쓴다.

### 다음 행동

```html
<section class="aip-story-next" aria-labelledby="next-title">
  <div class="aip-container aip-container--lg aip-story-next__inner">
    <div class="aip-story-next__copy"><h2 class="aip-display-md" id="next-title">구조를 살펴보세요</h2><p>다음 화면의 의미.</p></div>
    <a class="aip-button aip-button--lg" href="architecture.html">Architecture</a>
  </div>
</section>
```

Hero의 primary 하나를 유지하고 마지막 행동은 secondary를 쓴다. 저장소·데모·문서 모두를 같은 강도로 밀지 않는다.

## 3. 시각 결정과 검토 기준

- 색: 기존 Blue·Yellow·Tangerine·Slate 의미를 이미지에도 사용. 새로운 네온 팔레트를 추가하지 않는다.
- 타입: Pretendard display는 약속, heading은 논리, Mono는 기계값·메타. 새 서체가 필요하지 않다.
- 골격: Showcase는 넓은 cover, Architecture는 구조와 책임, Case Study는 판단과 근거. 모든 페이지를 동일한 카드 그리드로 시작하려던 기본값을 버렸다.
- 모션: 스크롤 등장, 자동 3D 회전, 숫자 카운터는 필요하지 않다. 정지 이미지의 빛과 재료로 깊이를 만든다.
- 정상: 본문·이미지·앵커. 원격 데이터 로딩·제출·권한 상태는 정적 템플릿에 해당하지 않는다. 제품 기능을 붙이면 [08 상태·피드백](08-states-feedback.md)을 적용한다.
- 이미지 실패: 제목·본문·캡션·다이어그램이 남아 의미를 전달한다. 핵심 설명을 이미지에만 넣지 않는다.
- 390·768·1280·1440 폭, 라이트·다크, 이미지 decode, 키보드 메뉴·skip link·장 이동은 `check:ui`로 검사한다. 스크린샷은 사람도 확인한다.

## 4. 제품 콘텐츠 교체

AIP는 발전 중인 프로젝트다. 예제의 구조 설명은 개념 예시이고 일부는 기존 Core IR 경로다. 게시할 페이지에서 현재 제품 서비스 경로와 혼동하지 않도록 기준 버전·정본 링크를 연결한다. 문법, 지원 DB·OS, 인증, 배포, 라이선스, 성능과 호환성을 이 디자인 시스템이 결정하지 않는다.
