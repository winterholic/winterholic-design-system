# 07 · 채팅: 스레드 · 메시지 · 컴포저

채팅은 Ttakkari 의 첫 화면이다. 사람은 지시하고, 에이전트는 무엇을 하는지 보여주고, 결과물을 건넨다. 이 문서의 컴포넌트는 `components/chat.css`, 동작은 tk.js 의 `initComposers`·`initThreads`.

## 1. 원칙

1. **누가 말하는지 모양으로 안다.** 사용자는 오른쪽 말풍선(파란 기운), 에이전트는 말풍선 없는 전폭 본문 + 머리(아바타·이름·상태·시각). 말풍선이 화면 양쪽에 줄지어 서지 않는다. 에이전트 답이 결과의 주인공이다.
2. **에이전트의 일은 글이 아니라 구조로.** 무엇을 했는지는 실행 카드(08), 내놓은 것은 결과물 카드(09). 본문 글은 요약과 판단만.
3. **사람을 기다리는 것이 가장 크게 보인다.** 승인 카드는 스레드 안에서 amber 로 선다(08 §4).
4. **입력은 언제나 살아 있다.** 실행 중에도 다음 지시를 쓸 수 있고, 오프라인이면 초안이 남는다.

## 2. Thread

```html
<div class="tk-thread" data-tk-follow role="log" aria-label="대화" aria-live="polite">
  <div class="tk-thread__inner">
    <p class="tk-thread__day">오늘 · 2026.10.09</p>
    <article class="tk-message tk-message--user" data-author="user">…</article>
    <article class="tk-message tk-message--agent" data-author="agent">…</article>
    <button class="tk-jump" type="button" hidden><span class="tk-dot tk-dot--live"></span>새 메시지<svg class="tk-icon">arrow-down</svg></button>
  </div>
</div>
```
- 스크롤 컨테이너. 열 폭 760, 좌우 gutter 16.
- 메시지 사이: 사람이 바뀌면 24, 같은 사람이 이어 말하면 8(`data-author="same"` 을 다음 메시지에).
- `.tk-thread__day` 날짜·이벤트 구분(가운데 캡션 + 양옆 선).
- `role="log" aria-live="polite"`. 스트리밍 중에는 글자마다 알리지 않도록 진행 중인 메시지에 `aria-busy="true"` 를 걸고, 끝나면 뗀다.

## 3. Message

### 사용자
```html
<article class="tk-message tk-message--user" aria-label="내 지시">
  <div class="tk-chips">…문맥 칩(첨부·지금 보던 결과물)…</div>
  <div class="tk-message__body">결정 사항 문서를 팀장님께 메일로 보내줘</div>
  <p class="tk-message__meta"><span class="tk-message__time">14:31</span></p>
</article>
```
말풍선 `brand-subtle`, radius 16(말한 쪽 아래 4), 최대 85%, 쓴 줄바꿈 그대로. 보내지 못한 지시는 `data-failed`(빨간 외곽선) + 아래 `.tk-message__error` 한 줄과 다시 보내기.

### 에이전트
```html
<article class="tk-message tk-message--agent" aria-label="따까리의 응답" aria-busy="true">
  <div class="tk-message__head">
    <span class="tk-avatar tk-avatar--agent tk-avatar--sm" aria-hidden="true"></span>
    <span class="tk-message__name">따까리</span>
    <span class="tk-badge" data-state="waiting">승인 대기</span>      <!-- 진행 중일 때만 -->
    <span class="tk-message__time">14:31</span>
  </div>
  <div class="tk-message__body">
    <div class="tk-prose tk-prose--compact">…Markdown 렌더 결과…</div>
    <div class="tk-run" data-state="…">…</div>          <!-- 08 -->
    <div class="tk-artifacts">…결과물 카드…</div>      <!-- 09 -->
    <div class="tk-chips tk-suggestions">…제안 칩…</div>
  </div>
  <div class="tk-message__actions">…복사·다시 실행…</div>
</article>
```
- 본문 블록 사이 12. 순서는 **글 → 실행 카드 → 결과물 → 제안**이 기본이다. 승인이 필요하면 실행 카드 바로 아래 승인 카드.
- md 이상에서 본문이 아바타 폭만큼 들여 써진다(머리와 본문이 한 기둥). 모바일은 들여쓰지 않는다(폭이 아깝다).
- 행동(`__actions`): 복사·다시 실행. 마우스 기기에서는 평소 65% 투명, hover·포커스에 진해진다. 터치에서는 항상 보인다.
- 에이전트 오류(연결 끊김·실행 불가): 본문 대신 `.tk-message__error` 한 줄 + 다시 시도.

### 시스템
`<p class="tk-message tk-message--system"><span>…</span></p>`: 가운데 한 줄(세션 재개·연결 복구·모델 변경). 아이콘 + 짧은 문장.

## 4. Thinking · Caret

```html
<p class="tk-thinking"><span class="tk-dot tk-dot--live" aria-hidden="true"></span>파일을 찾는 중<span class="tk-thinking__detail">· ~/Documents 412개</span></p>
<p>…지금까지 받은 글…<span class="tk-caret" aria-hidden="true"></span></p>
```
- 첫 글자가 오기 전: **무엇을 하는지** 한 줄. 말없이 도는 점 세 개를 쓰지 않는다. 에이전트가 단계를 알려주면 그 이름, 모르면 "생각하는 중".
- 스트리밍 중: 본문 끝 민트 블록(깜빡이지 않는다). 끝나면 지운다.

## 5. Jump(새 메시지)

위로 올려 읽는 중에 새 메시지·결과물이 오면, 끌어내리지 않고 아래 가운데에 `.tk-jump` 를 띄운다. 누르면 바닥으로, 바닥에 닿으면 사라진다. 바닥 근처(96px)에 있으면 새 메시지를 따라간다(tk.js `data-tk-follow`).

## 6. Suggestions(후속 지시 제안)

```html
<div class="tk-chips tk-suggestions" aria-label="후속 지시 제안">
  <button class="tk-chip" type="button" data-tk-suggest="결정 사항 문서를 팀장님께 메일로 보내줘">팀장님께 메일로 보내기</button>
</div>
```
- 응답 끝에 셋까지. 칩 글자는 짧게, 실제로 채울 문장은 `data-tk-suggest`.
- 누르면 컴포저에 **채우고** 포커스를 옮긴다. 바로 보내지 않는다. 사람이 고칠 기회를 준다(되돌릴 수 없는 일을 칩 하나로 시작시키지 않는다).
- 가장 최근 응답에만 둔다. 지난 응답의 제안은 지운다.

## 7. Composer

```html
<div class="tk-composer-tray">
  <form class="tk-composer" data-tk-composer aria-label="따까리에게 지시하기">
    <div class="tk-chips" aria-label="함께 보낼 문맥">…문맥 칩…</div>
    <div class="tk-composer__row">
      <button class="tk-icon-button" type="button" aria-label="파일 첨부">…</button>
      <label class="tk-sr-only" for="c">지시</label>
      <textarea class="tk-composer__input" id="c" rows="1" placeholder="따까리에게 지시하기"></textarea>
      <button class="tk-icon-button tk-icon-button--primary tk-icon-button--round tk-composer__send" type="submit" aria-label="보내기">…send…</button>
    </div>
    <p class="tk-composer__hint"><span>…</span><span class="tk-composer__keys"><kbd>↵</kbd> 보내기 · <kbd>⇧</kbd><kbd>↵</kbd> 줄바꿈</span></p>
  </form>
</div>
```
- 트레이는 화면 아래 sticky, 위쪽이 스레드 면으로 페이드돼 컴포저만 떠 보인다. 컴포저: 흰 면 + 테두리 + `shadow.sm` + radius 16, 포커스 시 파란 2px.
- 입력은 1줄에서 시작해 내용만큼 늘고, 200(약 6줄)에서 멈춘 뒤 안에서 스크롤(`field-sizing: content`, 미지원 브라우저는 tk.js 가 높이를 맞춘다).
- **키 규칙**(tk.js 가 구현, 검사 스크립트가 확인):
  | 기기 | Enter | Shift+Enter | ⌘/Ctrl+Enter |
  |---|---|---|---|
  | 키보드(정밀 포인터) | 보내기 | 줄바꿈 | 보내기 |
  | 터치 | 줄바꿈 | 줄바꿈 | 보내기 |
  | 한글 조합 중(`isComposing`) | 아무것도 하지 않음 | | |
  한글 조합 중 Enter 를 보내기로 처리하면 마지막 글자가 잘린다. 직접 구현할 때 반드시 막는다.
- 빈 입력·오프라인이면 보내기가 `aria-disabled`. 오프라인이면 `data-offline`(점선 테두리) + 안내 "오프라인 · 초안은 이 기기에 남아 있어요".
- **실행 중**: 보내기 자리가 멈추기(`data-tk-stop`, secondary·원형·사각 아이콘)로 바뀐다. Esc 로 멈추는 단축키는 앱이 붙인다(툴팁에 `Esc`). 입력은 그대로 쓸 수 있고, 다음 지시는 대기열에 들어간다는 안내를 hint 에.
- 문맥 칩: 작업 공간에서 결과물을 연 채 지시하면 그 결과물이 칩으로 붙는다(Context Continuity). 빼기 버튼이 있다.
- 뷰어 안 후속 지시(`.tk-viewer__followup`)도 같은 컴포저다(09 §5).
- 첨부: 이 기기의 파일을 올린다. 올라가는 동안 칩에 `aria-busy="true"` + 앞에 `.tk-spinner--xs`, 실패하면 `data-failed`(빨간 외곽선) + 다시 시도 아이콘 버튼.

## 8. 문구

- 에이전트 이름은 **따까리**. 존댓말 해요체("찾았어요", "보내도 될까요?").
- 무엇을 했는지 숫자로: "회의록 3개를 찾았어요"(✅) / "회의록을 찾았습니다"(❌).
- 사람에게 결정을 넘길 때는 질문 하나: "파일 1개를 외부 메일로 보낼까요?".
- 실패는 무엇이 → 왜 → 지금 할 수 있는 것: "PPTX 저장에서 멈췄어요. 이미지가 8.2 MB 라서요. 줄여서 다시 할까요?"
