# 08 · 실행·승인: Run · Steps · Log · Approval · Checks

에이전트가 **무엇을 하고 있는지**, 사람이 **무엇을 허락해야 하는지**를 보여주는 곳이다. 구현은 `components/run.css`, 로그 따라가기는 tk.js `initLogs`.

## 1. 작업 상태 6종

`data-state` 하나가 배지·실행 카드 레일·단계 아이콘을 같이 바꾼다. 색 토큰은 `color.run.<state>.{bg,border,text,icon}`.

| state | 단어 | 아이콘(Lucide) | 색 | 주의를 끄나 |
|---|---|---|---|---|
| `queued` | 대기 · n번째 | `clock` | 중립 | 아니오 |
| `running` | 실행 중 | live 점 맥박 · 단계에는 스피너 | **민트**(에이전트) | 예. 움직이는 것 |
| `waiting` | 승인 대기 · 입력 대기 | `hand` | **amber** | 예. 사람을 기다림 |
| `succeeded` | 완료 | `check`·`circle-check` | 중립 면 + 민트 글자·아이콘 | 아니오(조용히 끝난다) |
| `failed` | 실패 | `circle-x` | red | 예 |
| `cancelled` | 취소됨 | `ban` | 중립, 단계 65% | 아니오 |

색만으로 말하지 않는다. 배지에는 언제나 단어, 단계에는 아이콘 모양이 다르다(체크·손·엑스·금지). 끝난 작업이 빛나지 않아야 지금 움직이는 것과 사람을 기다리는 것이 보인다.

## 2. Run card

```html
<div class="tk-run" data-state="running">
  <div class="tk-run__head">
    <p class="tk-run__title">테스트 돌리고 원인 찾기</p>
    <span class="tk-badge" data-state="running"><span class="tk-dot tk-dot--live" aria-hidden="true"></span>실행 중</span>
  </div>
  <p class="tk-run__meta"><span class="tk-run__elapsed">0:31</span><span>파일 3개 읽음</span></p>
  <div class="tk-progress tk-progress--agent" style="--tk-progress: 0.41" role="progressbar" aria-label="진행" aria-valuenow="41" aria-valuemin="0" aria-valuemax="100"></div>
  <ol class="tk-steps">…</ol>
  <div class="tk-log">…</div>
  <div class="tk-run__actions"><button class="tk-button tk-button--sm tk-button--ghost">로그</button><button class="tk-button tk-button--sm">멈추기</button></div>
</div>
```
- 흰 면 + 테두리 + 왼쪽 3px 상태 레일(아이콘 색). running·waiting 은 테두리도 상태색.
- 머리: 제목(무엇을 하는가, 동사로 끝나는 짧은 구) + 상태 배지. 메타: 경과(모노) · 개수. 항목 사이 `·` 는 CSS 가 넣는다.
- 진행을 알면 진행 막대(민트), 모르면 막대 없이 단계만. 막대를 가짜로 채우지 않는다.
- 끝난 카드는 단계·로그를 `<details class="tk-run__more">` 로 접는다(요약 "단계 4개"). 실패 카드는 펼쳐 둔다.
- 행동: 앞은 ghost(로그), 끝은 주 행동(멈추기·다시 시도). 실패 시 다시 시도는 primary 가 될 수 있다(화면에 다른 primary 가 없을 때).
- `.tk-run__summary` 한두 문장: 실패·대기 이유.

## 3. Steps

```html
<ol class="tk-steps">
  <li data-state="succeeded"><svg class="tk-icon">circle-check</svg><span class="tk-step__name">회의록 찾기 <span class="tk-step__target">~/Documents/회의록/*.md</span></span><span class="tk-step__time">4초</span></li>
  <li data-state="running"><span class="tk-spinner tk-spinner--sm" aria-hidden="true"></span><span class="tk-step__name">pytest 실행 <span class="tk-step__target">88 / 214</span></span><span class="tk-step__time">0:31</span></li>
  <li data-state="waiting"><svg class="tk-icon">hand</svg><span class="tk-step__name">외부로 보내기 승인<span class="tk-step__detail">파일을 밖으로 보내는 일은 직접 허락해야 해요</span></span><span class="tk-step__time">대기</span></li>
  <li data-state="queued"><span class="tk-step__mark" aria-hidden="true"></span><span class="tk-step__name">실패 원인 분석</span><span class="tk-step__time"></span></li>
</ol>
```
- 아이콘 16 · 이름 · 경과(오른쪽, 모노). 단계 사이를 세로 선이 잇는다.
- 대상(파일·경로·개수)은 `.tk-step__target`(모노 12), 설명은 `.tk-step__detail`.
- 지금 단계(running·waiting·failed)만 글자가 진해진다. 대기 단계는 빈 고리(`.tk-step__mark`).
- 단계 이름은 사람 말로("결정 사항 추출"). 도구 이름(`grep -r`)은 로그에.

## 4. Log

```html
<div class="tk-log">
  <div class="tk-log__header">
    <span class="tk-dot tk-dot--live" aria-hidden="true"></span><span class="tk-log__title">실행 로그</span>
    <div class="tk-button-group">
      <button class="tk-icon-button tk-icon-button--xs" aria-label="로그 따라가기" aria-pressed="true" data-tk-log-follow>…</button>
      <button class="tk-copy" type="button" data-tk-copy>…복사…</button>
    </div>
  </div>
  <div class="tk-log__body" tabindex="0" role="region" aria-label="실행 로그">
    <ol class="tk-log__lines">
      <li data-level="tool"><span class="tk-log__time">14:31:08</span><span class="tk-log__level">tool</span><span class="tk-log__msg">contacts.search("팀장")</span></li>
      <li data-level="warn" data-live>…</li>
    </ol>
  </div>
  <button class="tk-log__more" type="button">전체 로그 1,284줄 보기</button>
</div>
```
- 잉크 면, 모노 12/1.6. 시각 · 레벨 · 메시지 세 열. 레벨: `debug`·`info`(기본)·`tool`(파랑)·`ok`(민트)·`warn`(amber)·`error`(빨강). 레벨 단어가 색과 함께 간다.
- 지금 쓰이는 마지막 줄은 `data-live`(민트 커서).
- 실행 카드 안에서는 최대 높이 320, 미리보기는 마지막 4줄(`component.log.preview-lines`) + "전체 로그 n줄 보기". 전체는 작업 공간 뷰어(`--full`).
- 따라가기(`data-tk-log-follow`, `aria-pressed`): 켜면 새 줄을 따라 내려간다. 사용자가 위로 휠을 굴리면 꺼진다(읽던 곳을 빼앗지 않는다).
- 복사는 줄마다 "시각 레벨 메시지" 그대로.
- 로그에 비밀(토큰·키·비밀번호)이 찍히면 서버가 가린 값(`••••`)으로 보낸다. 화면이 가리는 것은 보안이 아니다(18 §3).

## 5. Approval

```html
<section class="tk-approval" aria-labelledby="ap">
  <div class="tk-approval__head">
    <svg class="tk-icon">shield-alert</svg>
    <div><h2 class="tk-approval__title" id="ap">파일 1개를 외부 메일로 보낼까요?</h2>
      <p class="tk-approval__lead">컴퓨터 밖으로 나가는 작업이라 직접 승인해야 진행돼요.</p></div>
  </div>
  <div class="tk-approval__body">
    <dl class="tk-meta">…받는 사람·보낼 파일·수단…</dl>
    <ul class="tk-checks">…정책 판정…</ul>
  </div>
  <div class="tk-approval__footer">
    <button class="tk-button tk-button--lg">거부</button>
    <button class="tk-button tk-button--lg tk-button--primary">승인하고 보내기</button>
  </div>
</section>
```
요구사항 §6 "고위험 작업은 별도 승인"의 화면이다.

- 머리: 질문형 제목(무엇을 · 몇 개를 · 어디로) + 왜 승인이 필요한지 한 줄. amber 면 + 왼쪽 바.
- 본문: **무엇을**(파일·경로·크기) · **어디로**(받는 사람·수단) · **정책 판정**(Checks) · **되돌릴 수 있나**. 이 넷이 다 보이기 전에는 승인 버튼을 누를 수 없게 하지 않는다. 다 보여주면 된다.
- 버튼: 거부(secondary) | 승인(primary, 동작 이름 "승인하고 보내기"). 모바일은 반씩, md 이상은 오른쪽 정렬. 파일을 지우는 승인은 primary 대신 danger.
- 결정 뒤에는 카드가 남는다(기록). `data-decision="approved|denied"` 이면 중립 면이 되고 버튼 자리가 결과 한 줄("14:02 에 승인함 · 이 기기")이 된다.
- 한 번에 한 건. 여러 건이면 위에서부터 하나씩, 남은 수를 헤더 메타에("승인 2건 대기").
- 승인 대상이 길면(파일 20개) 카드에는 요약 + "모두 보기" → Sheet/Dialog 에 전체 목록.
- 승인은 **이 카드(또는 그 상세)에서만** 한다. 토스트·알림에서 바로 승인하지 않는다(맥락 없이 누르게 된다).
- 재인증이 필요한 승인(민감 자료)은 승인 버튼이 패스키 확인을 거친다(Dialog `data-tk-modal`).

## 6. Checks (정책 판정)

```html
<ul class="tk-checks" aria-label="정책 확인 결과">
  <li data-result="pass"><svg class="tk-icon">circle-check</svg><span>개인 작업 영역에서 만든 파일이에요</span></li>
  <li data-result="warn"><svg class="tk-icon">triangle-alert</svg><span><strong>처음 보내는 주소</strong>예요. 보낸 뒤에는 되돌릴 수 없어요</span></li>
  <li data-result="fail"><svg class="tk-icon">circle-x</svg><span>인증 정보 패턴이 있어요(<code>AWS_SECRET…</code>). 보낼 수 없어요</span></li>
</ul>
```
File Broker 가 확인한 것을 사람 말로. pass(민트 체크) · warn(amber) · fail(빨강, 글자 진하게). 판정 문구는 서버가 정한 정책 결과를 그대로 옮긴다. 화면이 판정을 만들지 않는다.

## 7. 하지 말 것

| ❌ | ✅ |
|---|---|
| 스피너 하나로 "작업 중" | Run card: 무엇을 · 몇 단계 · 지금 어디 |
| 가짜로 차오르는 진행 막대 | 아는 진행만 막대, 모르면 단계 |
| 끝난 작업에 큰 초록 체크 배너 | 조용한 완료 배지 + 결과물 카드 |
| 승인 요청을 토스트로 | 스레드 안 Approval card |
| "확인" / "취소" 버튼 | "승인하고 보내기" / "거부" |
| 로그를 sans 로 | 잉크 면 모노 |
| 실패를 빨간 문단으로만 | 실패 배지 + 단계의 이유(`step__detail`) + 다시 할 행동 |
