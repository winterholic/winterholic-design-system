# 06 · 컴포넌트 규격 (notting)

각 컴포넌트를 **크기 · 색 · 상태 · 접근성 · 언제 쓰나** 로 적었다. 값은 전부 토큰 이름이다(`component.*` 는 `tokens/src/component.json`, 나머지는 시맨틱). §1~§16 은 범용, **§17 부터 notting 전용**이다. 여기 없는 컴포넌트는 §34 조립 규칙으로 만든다.

공통 상태 6종: `default` `hover` `active(눌림)` `focus-visible` `disabled` `loading`. 입력류는 `error` `readonly` 가 추가된다. 상태마다 한 가지 속성만 바꾼다.

---

## 1. Button

| size | 높이 | 좌우 패딩 | 아이콘 | 글자 | 언제 |
|---|---|---|---|---|---|
| `xs` | 24 | 8 | 12 | label-sm | 표 셀 안, 코드 블록 헤더(언어·복사), 근거 목록 행 |
| `sm` | 32 | 12 | 16 | label-md | **페이지 툴바, 패널 헤더, 트리, 보드 컬럼 헤더, 카드 헤더** |
| `md` | 40 | 16 | 20 | label-md | 기본 폼·모달 푸터·빈 상태 |
| `lg` | 48 | 20 | 20 | label-lg | 모바일 주 액션, 로그인, 랜딩 CTA |
| `xl` | 56 | 24 | 24 | label-lg | 히어로 CTA 전용 |

- radius `radius.md`(8). 랜딩 CTA 만 `radius.full`.
- variant: `primary` `ai` `secondary` `ghost` `danger` `danger-ghost`(01 §action). `primary` 와 `ai` 는 각각 화면당 1개. 둘이 나란히 있어도 된다(역할이 다르다: 사람 행동 vs AI 행동).
- `ai` 버튼은 아이콘 `sparkles` 를 앞에 붙인다. 아이콘 없이 보라 버튼만 있으면 "왜 보라지?" 가 된다.
- 아이콘 전용 버튼은 정사각형 + `aria-label` + 툴팁(단축키 있으면 툴팁 안 `kbd`).
- 같은 줄 버튼들은 같은 size. 그룹 간격 `space.2`(sm) / `space.3`(md 이상). 최소 폭 md 이상 64px. 줄바꿈 금지.

상태
| 상태 | 처리 |
|---|---|
| hover | `bg-hover`. `fast` |
| active | `bg-active` + `scale(0.98)` |
| focus-visible | 포커스 링 2px offset 2 |
| disabled | `action.disabled.*`, `cursor: not-allowed`, `aria-disabled`. 이유 툴팁 |
| loading | 라벨 자리에 스피너, 폭 유지, `aria-busy`. **AI 버튼의 loading 은 스트리밍 시작까지만** — 답변이 흐르기 시작하면 버튼은 "중지" 로 바뀐다 |

## 2. Input · Textarea · Select

| size | 높이 | 좌우 패딩 | 글자 | 언제 |
|---|---|---|---|---|
| `sm` | 32 | 12 | body-sm | 툴바 검색, 패널 안 필터, 속성 값 편집 |
| `md` | 40 | 12 | body-md(16) | 기본 |
| `lg` | 48 | 16 | body-md | 로그인, 커맨드 팔레트, Ask 입력 |

- 배경 `surface.default`, 테두리 `border.strong` 1px, radius `md`.
- 라벨 항상 보임(`label-md`, 위 `space.2`). 플레이스홀더는 예시만.
- 도움말 `caption` `text.tertiary` 아래 `space.1-5`. 오류가 있으면 도움말을 **대체**.
- Textarea 최소 96px, `resize: vertical`. **문서 본문 입력에는 Textarea 를 쓰지 않는다** — 에디터(§17).
- Select 는 네이티브 우선. 상태·담당자·우선순위 선택은 커스텀 Dropdown(§8) + 아이콘.

상태: hover 테두리 `neutral.500` · focus 테두리 `border.focus` 2px 안쪽 · error `border.danger` + 문구 + `aria-invalid` · disabled `surface.disabled` · readonly 테두리 없음 + `surface.sunken`.

## 3. Checkbox · Radio · Switch

| 컴포넌트 | 시각 크기 | radius | 테두리 | 선택 시 |
|---|---|---|---|---|
| Checkbox | 20 (문서 task list 안 **16**) | `xs` | `border.input-strict` | 배경 `action.primary.bg`, 체크 흰색, `spring` `fast` |
| Radio | 20 | `full` | 같음 | 테두리 `action.primary.bg` 2px + 안쪽 점 10 |
| Switch | 40×24, 손잡이 20 | `full` | 없음 | 트랙 `neutral.300` → `action.primary.bg` |

- 클릭 영역 44. 라벨 오른쪽 `space.2`.
- task list 체크박스는 글자 첫 줄 세로 중앙(`margin-top: 0.35em`). 체크되면 그 항목 글자 `text.tertiary` + 취소선.
- Switch 는 즉시 반영 설정(자동 저장·다크모드), Checkbox 는 제출로 반영되는 선택(내보내기 옵션·Context Pack 포함 항목).

## 4. Card

| 항목 | 값 |
|---|---|
| 배경 / 테두리 | `surface.default` / `border.default` 1px. **그림자 없음** |
| radius | `lg` 12 |
| 패딩 | sm 16 · **md 20** · lg 24 |
| 제목↔본문 | `space.3` |
| 카드 사이 | 16 / 24 |

- 클릭 가능한 카드만 hover(`shadow.md` + `translateY(-1px)`). 카드 안에 또 버튼이 있으면 카드 전체 클릭은 포기(⋯ 만 예외).
- 카드 안 카드 금지. 안쪽 구획은 `surface.sunken` 또는 `border.subtle`.
- **문서 본문 안에 카드를 넣지 않는다.** 문서 안 구획은 콜아웃·코드 블록·표.

## 5. Badge · Tag · Chip

| 종류 | 높이 | 좌우 패딩 | radius | 글자 | 언제 |
|---|---|---|---|---|---|
| Badge sm / md | 20 / 24 | 6 / 8 | `full` | label-sm | 개수·상태(status 계열) |
| Tag(각진) | 24 | 8 | `xs` | label-sm | 라벨·파일 형식(.md)·언어(ts) |
| Chip(선택형) | 32 | 12 | `full` | label-md | 필터, 다중 선택. 삭제 X 16 |
| Status pill | §25 | | | | 워크플로·ADR·왕복 등급 |
| AI badge | 20 | 6 | `full` | label-sm | "AI" — `ai.solid` + `on-solid`, 또는 `gradient.context` + neutral.950. 아이콘 sparkles 12 |
| Dot | 8×8 | | `full` | | 아바타 모서리·탭 라벨 옆 |
| Count | 최소 20 | 6 | `full` | label-sm | 백링크 수·미해결 충돌 수. 99+ |

- 상태 배지: 채움형 또는 옅은형 **한 화면에서 한 형태만**.
- AI 배지는 AI 가 만든 것(제안 관계·요약·자동 태그)에 붙인다. 사람이 확정하면 배지를 뗀다.

## 6. Avatar

| size | px | 폴백 글자 |
|---|---|---|
| xs | 24 | label-sm 1글자. **이슈 카드 담당자** |
| sm | 32 | label-sm. 툴바·댓글 |
| md | 40 | label-md |
| lg | 56 | heading-4 |
| xl | 80 | **페이지 아이콘 크기(이모지·이미지)**. 아바타는 아니지만 같은 스케일 |
| 2xl | 128 | 프로필 |

폴백 배경 `surface.brand-subtle`, 글자 `text.brand`. 겹쳐 쌓기 −8px + 흰 테두리 2px, 최대 4 + "+N".

## 7. Modal · Dialog · Drawer · Bottom sheet

| 항목 | 값 |
|---|---|
| 폭 | sm 400(확인) · **md 560**(폼·내보내기 옵션) · lg 800(**왕복 보고서·revision 비교·Context Pack 미리보기**) |
| 배경 / radius / 그림자 | `surface.raised` / `xl` / `shadow.lg` |
| 패딩 | 24 (모바일 20) |
| 헤더 | `heading-2` + 우상단 닫기 X(ghost sm) |
| 헤더↔본문↔푸터 | `space.5` |
| 푸터 | 우측 정렬, 간격 `space.3`, 주 버튼 오른쪽 |
| 스크림 / 상자 z | `overlay` / `modal` |

- 첫 포커스: 첫 인풋 또는 닫기. 포커스 트랩. Esc. 배경 스크롤 잠금.
- 스크림 클릭 닫기는 입력 내용 없을 때만. 편집 중이면 "나가면 저장되지 않습니다".
- 확인 다이얼로그: 제목 질문형 + 대상 명시, 버튼은 동작 이름. **손실을 감수하는 내보내기**("3개 블록이 대체 표현으로 나갑니다 · 그래도 내보내기")는 `danger` 가 아니라 `primary` — 파괴가 아니라 선택이다. 영구 삭제만 `danger`.
- Drawer: 우측 320(패널 대체) 또는 480(이슈 상세). Bottom sheet(모바일): 상단 radius `xl`, 손잡이 32×4, 최대 90vh.

## 8. Dropdown · Menu · Popover

| 항목 | 값 |
|---|---|
| 상자 | `surface.raised`, `border.default` 1px, `radius.md`, `shadow.md`, 패딩 `space.1` |
| 항목 높이 | 32 (터치 40) |
| 항목 패딩 / radius | 좌우 8 / `sm` |
| 항목 글자 | `body-sm` `text.primary`. 파괴 항목 `text.danger`. **AI 항목(요약·관계 제안) `text.ai` + sparkles 16** |
| hover / 선택 | `hover-overlay` / `selected-bg` + check |
| 폭 | 최소 160, 최대 높이 320 |
| 단축키 표시 | 우측 `kbd` |
| 그룹 라벨 | `overline` `text.tertiary` |

키보드 ↑↓ Enter Esc 타이핑 점프. `role="menu"`/`"listbox"`. 화면 밖이면 flip.
상태 셀렉트(이슈): 항목 = 상태 아이콘(`workflow.<s>.solid`) + 이름. 담당자 셀렉트: 아바타 xs + 이름 + 검색 인풋 sm.

## 9. Tooltip

배경 `surface.inverse`, 글자 `text.inverse`, `body-xs`, 패딩 6/8, `radius.sm`, 최대 폭 240, 트리거와 8px. 지연 300ms. 단축키가 있으면 문구 뒤 `space.2` 두고 `kbd`(배경 `kbd.bg-inverse`). 아이콘 전용 버튼에 필수. 중요한 정보를 숨기지 않는다.

## 10. Toast · Alert(Banner) · Inline message

| 종류 | 위치 | 크기 | 색 | 언제 |
|---|---|---|---|---|
| Toast | 우하단 / 상단 중앙(모바일), 최대 3개 | 폭 360, 패딩 16, `radius.lg`, `shadow.lg` | `surface.inverse` + `text.inverse`, 상태 아이콘만 색 | "저장됨", "가져왔어요 · 보고서 보기", "삭제됨 · 되돌리기" |
| Alert(배너) | 페이지·패널 상단, 섹션 안 | 패딩 16, `radius.lg`, 테두리 1px | `status.<s>.*`, AI 제안은 `ai.*` | 오프라인, 부분 손실, 충돌 있음, 근거 오래됨 |
| Inline message | 필드 아래 | `caption` + 아이콘 12 | `text.<s>` | 유효성 |

Toast: 4초, 오류 8초, 액션 있으면 자동 닫힘 없음. 한 문장. `role="status"`/`"alert"`.
Alert: 아이콘 20 왼쪽, 본문 `body-sm`, 액션 링크 우측. 페이지에 배너 1개. **에디터 컬럼 안이 아니라 툴바 아래 전폭**에 놓는다 — 문서와 섞이면 안 된다.

## 11. Table

| 항목 | 값 |
|---|---|
| 헤더 | `surface.sunken`, `label-md` `text.secondary`, 40, sticky |
| 행 높이 | compact 36 · **default 44** · relaxed 56 |
| 셀 패딩 | 좌우 12, 첫·마지막 16 |
| 셀 글자 | `body-sm`. 숫자 `numeric` 우측. 키·경로 `mono-label` |
| 선 | 행 사이 `border.default`, 세로선 없음 |
| hover / 선택 | `hover-overlay` / `selected-bg` + 체크박스 |
| 빈 상태 / 로딩 | 07 §2 / 행 5개 스켈레톤 |

이슈 목록: 첫 열 = 우선순위 아이콘 + 키 + 제목, 상태 필, 담당자 xs, 갱신 시각. 열 4개 이상이면 모바일 카드.
문서 안 표(block-table)는 §17.

## 12. Tabs · Segmented control

| 종류 | 언제 | 규격 |
|---|---|---|
| 밑줄 탭 | 페이지 수준 뷰 전환(이슈: 목록·보드) | 높이 40, 간격 24, `label-md`, 인디케이터 2px `border.brand` |
| 세그먼트 | 2~4개 짧은 옵션(**패널 탭: Ask·속성·백링크·revision**, 보기 방식) | 트랙 `surface.sunken` `radius.md` 패딩 4, 활성 `surface.default` `shadow.xs`, 높이 32 |
| 세로 탭 | 설정 좌측 | 폭 200, 항목 36, 활성 `selected-bg` |

탭은 URL 과 연결. 5개까지. 탭 안 탭 금지.

## 13. Navigation (Header · Breadcrumb · Pagination)

- Header(랜딩·설정): 56/64, `surface.default`, 아래 `border.subtle`. 앱 셸은 §22 페이지 툴바.
- Breadcrumb: `body-sm`, chevron-right 16 `text.tertiary`, 항목 `text.secondary`, 마지막 `text.primary`. 페이지 툴바 안에서는 항목 앞에 페이지 아이콘 16. 4단계 넘으면 "…". 모바일은 부모 하나만.
- Pagination: `sm` 버튼, "1–20 / 240". 검색 결과·이슈 목록.

## 14. Progress · Spinner · Skeleton

| 컴포넌트 | 규격 | 언제 |
|---|---|---|
| Spinner | 16(버튼) · 20 · 32, 선 2px, `action.primary.bg`(AI 는 `ai.solid`) | 1초 이내 예상 |
| Progress bar | 4 / 8, 트랙 `surface.sunken`, 채움 `action.primary.bg`, `full` | **가져오기·내보내기·인덱싱 진행률** |
| Skeleton | `surface.sunken`, `radius.sm`, 글자 0.75em | 페이지 첫 로딩: 제목 1줄 + 블록 6줄(마지막 60%). 트리: 항목 8개 |
| 무한 progress | 툴바 아래 2px | 페이지 전환·재조회·**재인덱싱 중** |

300ms 규칙. 스켈레톤은 실제와 같은 개수.

## 15. Empty · Error · Divider · Code(UI)

- Empty / Error: 07. Divider: `border.subtle` 1px, 상하 16.
- UI 안 코드(설정의 CLI 예시·MCP 설정): `code` 스타일, 배경 `code.bg`, 테두리 `border.default`, `radius.md`, 패딩 16, 우상단 복사(ghost xs).

## 16. Kbd

`<kbd>` 태그면 `typography.css` 가 처리한다. 높이 20, 패딩 6, `radius.xs`, 배경 `surface.sunken`, 테두리 `border.default` + 아래 2px, 글자 `kbd` 스타일 `text.secondary`. 툴팁·토스트 안에서는 `kbd.bg-inverse`. 조합은 `<kbd>⌘</kbd><kbd>K</kbd>` 사이 `space.0-5`. 플랫폼별 기호(⌘ / Ctrl)는 런타임에서 바꾼다.

---

## 17. Editor · Blocks

에디터 컬럼(03 §4)에 `.nt-doc` 를 걸면 `prose.css` 가 블록 스타일을 처리한다. 여기서는 규격만.

### 페이지 골격
| 요소 | 규격 |
|---|---|
| 커버 | 높이 `layout.cover` 240 / 모바일 160, `object-fit: cover`, radius 없음(전폭), hover 시 우하단 "커버 바꾸기·위치 조정" ghost sm |
| 아이콘 | `editor.icon-size` 80, 커버 있으면 커버 아래로 −40 겹침. 클릭 → 이모지/이미지 피커 |
| 제목 | `prose-title`, 빈 값이면 placeholder "제목 없음". Enter → 첫 블록 |
| 속성 | §24. 제목 아래, 접을 수 있음 |
| 블록 | 아래 |

### 블록 공통
| 항목 | 값 |
|---|---|
| 사이 간격 | `editor.block-gap` 4 + 블록 상하 패딩 `block-padding-y` 2 |
| 핸들 | gutter 32 안, `handle-size` 20 아이콘(`grip-vertical`) + `plus`. `handle-color` tertiary. **hover·포커스 시만 fade `fast`**. 클릭 영역 24, 모바일은 길게 누르기 |
| hover | 핸들 영역만 `mark.block-hover`. 블록 본문은 변화 없음 |
| 선택(블록 단위) | 배경 `mark.selection`, radius `block-radius` 4. Esc 로 블록 선택 ↔ 텍스트 편집 전환 |
| 드래그 | `shadow.lg` + scale 1.02, 원래 자리 `opacity.ghost-block`, 삽입 위치 `drop-indicator` 2px 가로선 |
| 빈 블록 placeholder | 포커스된 빈 문단에만 "명령은 '/', 텍스트는 그냥 입력" `text.placeholder` |
| 들여쓰기 | `layout.indent` 24, Tab / Shift+Tab. 최대 5단계 |

### 블록별
| 블록 | 규격 | Markdown |
|---|---|---|
| paragraph | `prose-body` | 문단 |
| heading 1·2·3 | `prose-h1/h2/h3`, 위 여백 32/24/20. **h4 이하 없음**(가져오면 h3 로, 보고서에 normalized) | `#` `##` `###` |
| bullet / numbered | `prose-body`, 마커 `text.secondary`, 들여쓰기 24, 중첩 마커 •→◦→▪ / 1.→a.→i. | `-` `1.` |
| task list | 체크박스 16 + 본문, 완료 시 tertiary + 취소선 | `- [ ]` |
| quote | 왼쪽 `marker` 3px `border.strong`, 패딩 16, 글자 `text.secondary` | `>` |
| callout | `block-callout`: `sunken` 면, radius 8, 패딩 16, 아이콘 20(이모지 또는 Lucide) + 본문. 변형 info/warning/danger/success(`status.<s>.bg` + 왼쪽 4px `icon` 색)·**ai**(`ai.bg`) | 고유 블록 → plain export 시 `> **아이콘** 본문` (degraded) |
| code | `block-code`: `code.bg` 면 + `border.default`, radius 8, 패딩 16, `prose-code`, 헤더 32(언어 셀렉트 ghost xs 좌 · 복사 ghost xs 우, hover/포커스 시 표시), 줄 번호 옵션(`line-number-width` 32, `line-number` 색), 강조 줄 `line-highlight`, 최대 480 + 펼치기. 가로 스크롤 | ```` ```lang ```` |
| divider | `block-divider` 1px `border.default`, 상하 16 | `---` |
| image | `block-image`: radius 8, 최대 폭 100%, 캡션 `prose-caption` tertiary 아래 8, 로딩 `placeholder-bg`, 실패 `image-off` 아이콘. 리사이즈 핸들 좌우(hover) | `![](…)` |
| table (GFM) | `block-table`: `border.default`, 헤더 `sunken` + `text.secondary` 500, 셀 패딩 8/12, 최소 열 120, `body-sm`, 가로 스크롤. 행/열 추가는 hover 시 가장자리 + | `\|` |
| toggle | `block-toggle`: chevron 16 `text.tertiary` 90° 회전, 자식 들여쓰기 24. `<details>` | 고유 블록 → plain export 시 제목 + 들여쓴 본문 (degraded) |
| link / mention | 링크 `text.link` + 밑줄. 페이지 멘션은 아이콘 16 + 제목 `text.primary` 500 + 밑줄 없음, hover `hover-overlay` | `[text](url)` / 멘션은 상대 링크 |
| inline code | `inline-code`: `code.bg-inline` + `code.string`(코럴), radius 4, 좌우 4 | `` ` `` |
| opaque (알 수 없는 블록) | `sunken` 면 + 점선 `border.strong` + 아이콘 `box` + "알 수 없는 블록 · 원문 보존됨" `caption` + `fidelity.opaque` 필. 편집 불가, 삭제만 | 사이드카에 보존 |

### 상태
| 상태 | 처리 |
|---|---|
| 읽기 전용(권한 없음·과거 revision) | 핸들 없음, 커서 기본, 툴바에 "읽기 전용 · revision a1b2c3" 배너 |
| 충돌(다른 revision 있음) | 저장 상태 `conflict` + 툴바 배너 "다른 곳에서 수정됨 · 비교" → §29 |
| 오프라인 | 저장 상태 `offline`, 편집은 계속 |
| 근거로 열림 | 해당 블록 왼쪽 `citation.marker` 3px + `flash` 1200 |

접근성: 블록 핸들 버튼 `aria-label="블록 옵션"`, 드래그는 키보드 대안(핸들 포커스 + Alt+↑↓). 에디터 `role="textbox" aria-multiline`. 슬래시 메뉴 `aria-expanded` `aria-activedescendant`.

## 18. Inline toolbar (서식 툴바)

텍스트를 선택하면(mouseup 후) 선택 영역 위 `space.2` 에 뜬다.
- 상자 `surface.raised` + `border.default` + `radius.md` + `shadow.md`, 패딩 4. `z-index.raised`.
- 항목 32×32 아이콘 버튼(아이콘 16), radius `sm`, 활성 서식은 `selected-bg` + `selected-text`. 순서: 블록 타입 셀렉트(sm, 텍스트) · B I S · code · link · 색(선택) · ⋯ (댓글·AI 다시쓰기 — AI 항목은 sparkles + `text.ai`).
- 키보드로 선택했을 때는 뜨지 않는다(단축키가 있으니). `aria-label` 필수.

## 19. Slash menu

`/` 를 입력하면 커서 아래 `space.1` 에.
| 항목 | 값 |
|---|---|
| 상자 | `surface.raised`, `border.default`, `radius.lg`, `shadow.md`, 폭 320, 최대 높이 400, 패딩 4, `z-index.dropdown` |
| 그룹 | `overline` `text.tertiary` 패딩 8: 기본 블록 · 미디어 · 고급 · **AI** |
| 항목 | 높이 44, 패딩 8, radius `sm`, 아이콘 타일 32(`sunken` 면, radius 6, 아이콘 20) + `space.3` + 이름 `label-md` / 설명 `caption` |
| 선택 | 키보드 선택 `hover-overlay`. ↑↓ Enter Esc, 타이핑으로 필터, 결과 없으면 "'{입력}' 에 맞는 블록이 없어요" |
| AI 그룹 | 항목 아이콘 타일 `ai.bg` + `ai.icon`, 이름 옆 AI 배지. "요약 넣기", "관련 문서 찾기" |

## 20. Command palette (⌘K)

| 항목 | 값 |
|---|---|
| 상자 | `surface.raised`, `radius.xl`, `shadow.lg`, 폭 640, 최대 높이 480, 화면 위에서 15vh, `z-index.modal`, 스크림 `overlay` |
| 인풋 | 48, `body-md`, 앞 search 20, 테두리 없음, 아래 `border.subtle` |
| 항목 | 44, 패딩 12, radius `sm`, 아이콘 20 + 제목 `label-md` + 경로 `mono-label` tertiary(우측) 또는 스니펫 `caption` |
| 그룹 | overline: 최근 · 페이지 · 이슈 · 명령 · **Ask** |
| Ask | 입력이 문장이면(물음표·10자 이상) 첫 항목 "'{입력}' 을 워크스페이스에 물어보기" `ai.bg` 면 + sparkles → 패널 Ask 탭 |
| 푸터 | 32, `surface.canvas`, `caption` + kbd: ↑↓ 이동 · ↵ 열기 · ⌘↵ 새 탭 · esc |

빈 결과: "결과가 없어요" + "새 페이지 '{입력}' 만들기". 로딩은 스피너 없이 이전 결과 유지 + 300ms 후 인풋 우측 스피너 16.

## 21. Page tree (사이드바)

| 항목 | 값 |
|---|---|
| 항목 | 높이 32, 패딩 8, radius `sm`, `label-md` `text.secondary`, chevron 16 + 아이콘 16 + 이름(1줄 말줄임) + 우측 hover 액션(+ ⋯ 각 24) |
| 들여쓰기 | 16 / 단계. 최대 깊이 제한 없음, 6단계 넘으면 가로 스크롤 대신 이름을 더 줄인다 |
| hover / 활성 | `hover-overlay` / `selected-bg` + `selected-text`(아이콘도) |
| 섹션 | `overline` 라벨(즐겨찾기 · 워크스페이스 · 개인), 사이 24, 접힘 가능 |
| 드래그 | 항목 이동·중첩. 삽입 선 `drop-indicator`, 자식으로 넣을 때 대상 항목 `selected-bg` |
| 빈 트리 | "페이지가 없어요" + "+ 새 페이지" ghost sm |
| 로딩 | 항목 8개 스켈레톤 |
| 하단 고정 | 설정 · 휴지통 · 가져오기 (각 32) |
| 키보드 | ↑↓ 이동, →← 펼침/접힘, Enter 열기, `role="tree"` |

## 22. Page toolbar · Save indicator

툴바(48, `surface.canvas`, 패딩 12, 간격 8, 버튼 32):
```
[☰ 사이드바] [🏠 워크스페이스 › 📄 부모 › 📄 현재]      [저장됨 ✓] [공유] [✦ Ask] [패널] [⋯]
```
- 스크롤 시 `border.subtle` 하단선 + `backdrop-filter: blur(md)` + 배경 90%.
- 브레드크럼은 모바일에서 현재 페이지 제목만.
- ⋯ 메뉴: 넓게 보기 · 폰트 · 잠금 · 내보내기 · 가져오기 · revision · 휴지통(danger).

Save indicator(`caption` + 아이콘 12, 간격 4):
| 상태 | 문구 | 색·아이콘 |
|---|---|---|
| saved | "저장됨" | `save-indicator.saved` tertiary + check |
| saving | "저장 중" | tertiary + loader(회전) — 300ms 이후에만 |
| offline | "오프라인 · 이 기기에 보관" | warning + cloud-off |
| error | "저장 실패 · 다시 시도" (클릭 가능) | danger + circle-x |
| conflict | "다른 revision 있음 · 비교" (클릭 가능) | ai + git-merge |

문구 교체는 fade `fast`. "저장됨" 은 상시 표시(숨기지 않는다 — 소유권 계약의 신호).

## 23. Panel (우측)

| 항목 | 값 |
|---|---|
| 폭 / 배경 / 테두리 | 320 / `surface.canvas` / 왼쪽 `border.subtle` |
| 헤더 | 48(툴바와 줄 맞춤), 세그먼트 탭(Ask · 속성 · 백링크 · revision) + 닫기 X |
| 본문 | 패딩 16, 섹션 사이 24, 섹션 제목 `heading-4` 또는 `overline` |
| 진입 | xl 이상 고정(에디터 밀림), lg 이하 드로어(`shadow.lg`), 모바일 바텀시트 |
| 빈 상태 | 탭별 문구(07 §2) — 백링크 0 "이 페이지를 참조하는 문서가 없어요", revision 1 "첫 버전이에요" |

Ask 탭: 상단 인풋 lg(멀티라인, Enter 전송, Shift+Enter 줄바꿈) + 범위 세그먼트(이 페이지 · 워크스페이스) + `ai` 버튼 → 아래 답변 카드(§26) 세로 스택, 최신이 아래, 자동 스크롤.

## 24. Property row

| 항목 | 값 |
|---|---|
| 행 | 최소 높이 32, 사이 0, 구분선 없음(제목 아래 그룹 전체를 `border.subtle` 로 위아래만) |
| 라벨 | 폭 140, `caption` `text.tertiary`, 아이콘 16 + 이름 |
| 값 | `body-sm` `text.primary`, 패딩 8, radius `sm`, hover `hover-overlay`(편집 가능 신호), 클릭 → 인라인 편집 또는 드롭다운 |
| 빈 값 | "비어 있음" `text.placeholder` |
| 값 유형 | 텍스트 · 날짜(`2026.09.20`) · 사람(아바타 xs + 이름) · 상태(status pill) · 태그(Tag 여러 개, 넘치면 +N) · 관계(페이지 멘션) · **읽기 전용 메타**(page ID·revision `mono-label`, hover 없음) |
| 접기 | 속성 5개 초과 시 "N개 더 보기" ghost xs |

## 25. Status pill

| 항목 | 값 |
|---|---|
| 높이 | 24 / sm 20, 패딩 8, `full`, `label-sm` |
| 구성 | 상태 아이콘 12 + 라벨. 아이콘은 **색 이외의 신호**: backlog 점선 원 · todo 빈 원 · in-progress 반 채움 · review 눈 · done 체크 원 · canceled X 원 |
| 색 | `workflow.<s>.bg` + `.text`, 아이콘 `.solid`. ADR 은 `decision.*`, 왕복 등급은 `fidelity.*` |
| 클릭 가능(상태 변경) | hover `hover-overlay`, chevron-down 12 우측, → 상태 드롭다운 |
| canceled | 라벨 취소선 |

## 26. Citation · AI answer

**근거 칩** (`.nt-cite`, 답변 문장 끝):
- 18×최소 18, 패딩 4, radius `xs`, `citation.bg` + `citation.text`, `mono-label` 11, 칩 사이 2. 번호는 답변 안 등장 순서.
- hover `citation.bg-hover` + 툴팁(페이지 제목 · 섹션 경로 · 수정 시각). 클릭 → 원문 블록으로 이동(같은 페이지면 스크롤 + `flash`, 다른 페이지면 열고 마커). 키보드 접근 가능(`<a>` 또는 `<button>`).
- 근거 문서가 그 뒤 수정·삭제됐으면 `.nt-cite--stale`(amber) + 툴팁 "이 근거는 현재 문서와 다를 수 있어요 · revision a1b2c3 기준".

**AI 답변 카드** (`ai-answer`):
```
┌ ai.bg 면, ai.border 1px, radius 12, 패딩 16 ────────────────┐
│ ✦ AI 답변 · 워크스페이스 · 방금        [복사] [👍 👎] [⋯]  │  ← label-sm ai.text, 액션 ghost xs
│                                                              │
│ prose-body text.primary 답변 본문 …[1] …[2]                  │  ← .nt-doc
│ ▍ (스트리밍 커서)                                            │
│ ── 근거 3 ──────────────────────────────────── space.3 ──   │
│ [1] 📄 아키텍처 › 8.2 Document AST · 2026.09.18       32   │  ← 근거 행 32, mono-label 번호 + 아이콘 16 + 제목 + 경로 caption
│ [2] …                                                        │
└──────────────────────────────────────────────────────────────┘
```
- 스트리밍 중: 커서 `stream-caret` 깜빡임 + `shadow.ai`, 헤더 우측 "중지" ghost xs. 완료 시 둘 다 `normal` 로 사라짐.
- **근거 부족**: 면이 `insufficient-bg`(중립) 로 바뀌고 아이콘 `search-x`, 문구 "워크스페이스에서 근거를 찾지 못했어요" + 검색어 제안 2개 + "그래도 일반 지식으로 답하기"(secondary, 명시적). 근거 없는 답을 AI 면에 담지 않는다.
- **문서 충돌**: `conflict-bg` 면, "두 문서가 다르게 말해요" + 두 근거를 나란히(각각 수정 시각 강조) + "어느 쪽이 맞나요?" 선택 → 선택하면 다른 쪽에 "오래됨" 태그 제안.
- 답변 안 코드는 `.nt-doc pre` 그대로. 답변 안 표도 `.nt-doc table`.
- 긴 답변(뷰포트 60% 초과): `fade-bottom` + "더 보기".
- 사용자 질문은 카드 없이 `body-md` `text.primary` 우측 정렬 없이 왼쪽, 위 `overline` "나".

## 27. Context pack

카드(`context-pack`): `surface.default` + `border.default` + radius 12, **상단 3px `gradient.context` 바**, 패딩 16.
```
[상단 바]
heading-5 "NT-42 인덱싱 파이프라인 재설계 컨텍스트"      revision a1b2c3 (mono-label)  [복사] [내보내기] [⋯]
caption tertiary "문서 4 · 결정 2 · 이슈 3 · 코드 링크 1 · 2026.09.20 14:30 기준"
── 포함 항목 ──
☑ 📄 아키텍처 › 9 AI Context Engine        이유: 작업과 같은 컴포넌트 (caption, text.ai)     40
☑ 📋 ADR-0003 하이브리드 검색 채택           이유: 이슈에서 링크됨                              40
☐ 📄 회의록 2026-09-12                       이유: 유사도 0.71 — 제외됨                          40  ← 체크 해제 시 opacity.stale
── 프롬프트 미리보기 ──  (code, 최대 480 + 펼치기)
```
- "선택 이유" 는 `text.ai` 로 — AI 가 고른 것임을 드러낸다. 사용자가 항목을 빼면 다음 생성에 반영(체크 해제 상태 유지).
- revision 고정 표시가 필수. 같은 pack 을 CLI/MCP 에서 다시 받으면 같은 결과라는 계약.
- 항목 행 40, 체크박스 20 + 아이콘 16 + 제목 `label-md` + 이유 `caption`. 최대 8개 이상이면 "N개 더".

## 28. Report (왕복 보고서)

import/export 후 모달 lg(800) 또는 패널 탭.
```
요약 타일 4개 (numeric): 무손실 18 · 정규화 3 · 대체 표현 2 · 손실 1        + opaque 0 (있을 때만)
[필터 chip: 전체 · 손실 · 대체 · 정규화 · 무손실]
── 그룹 헤더 40 sunken: ● 손실 1 ──
행 44: ● dropped 도트 8 | docs/adr/0001.md:42 (mono-label) | "callout 블록은 plain Markdown 에 없어요 → 인용으로 대체" (body-sm) | [원문 보기] ghost xs
── 그룹 헤더: ● 대체 표현 2 ──
…
푸터: [취소] [그래도 내보내기 (primary)]  또는 import 면 [닫기]
```
- 등급 색 `fidelity.<level>.*`, 도트 + 등급 이름(색 이외 신호). 그룹은 심각한 순(dropped → degraded → opaque → normalized → lossless), lossless 그룹은 기본 접힘.
- 0건이면 보고서를 모달로 띄우지 않고 토스트 "가져왔어요 · 손실 없음". 손실이 1건이라도 있으면 반드시 모달.
- 행 클릭 → 해당 블록으로 이동(flash).
- 보고서는 영구 보관(설정 › 가져오기/내보내기 기록). 토스트에서 "보고서 보기" 로 다시 열 수 있다.

## 29. Diff · Conflict

revision 비교(모달 lg 또는 전체 화면):
- 블록 단위 diff. 좌 gutter 32 에 기호 `+` `−` `~` (`diff.sign-color`) + 3px 마커(`diff.<d>-marker`), 행 배경 `diff.<d>-bg`, 글자 `diff.<d>-text`. 코드 블록 안은 줄 단위 `prose-code`.
- 상단: revision 두 개 선택(셀렉트 sm, `mono-label` 해시 + 시각 + 작성자), "변경 12곳" caption, ← → 이동 버튼.
- 충돌(3-way): 충돌 구간 `conflict-bg` + `conflict-border` 1px, 구간 위 32 액션 줄 "서버 유지 · 내 것 유지 · 둘 다" (secondary sm). 전부 해결하면 푸터 primary "병합 저장" 활성. 미해결 수 Count 배지.
- 자동 덮어쓰기 금지 — 충돌 화면을 닫으면 로컬 변경은 초안으로 남고 저장 상태 `conflict` 유지.

## 30. Search result

| 항목 | 값 |
|---|---|
| 항목 | 패딩 12, radius `md`, hover `hover-overlay`, 제목↔스니펫↔경로 4 |
| 제목 | `heading-5` + 페이지 아이콘 16. 히트 `mark` |
| 스니펫 | `body-sm` `text.secondary` 2줄 clamp, 히트 `mark.highlight` + `highlight-text` |
| 경로 | `mono-label` tertiary "워크스페이스 › 프로젝트 › 문서 › ## 섹션" |
| 메타 | `caption`: 수정 시각 · 유형 배지(문서 · 이슈 · ADR) |
| 평가 모드 | 우측 `caption` "lexical 0.82 · vector 0.71" (설정에서 켤 때만) |
| 0건 | 07 §2 검색 0건 + "워크스페이스에 물어보기" ai 버튼 |

## 31. Issue card · Board (Phase 2)

이슈 카드: `surface.default` + `border.default` + radius 8, 패딩 12, 간격 8.
```
NT-123 (mono-label tertiary)                          [우선순위 아이콘 16]
제목 label-md 2줄 clamp
[status pill sm] [Tag …]                          [아바타 xs]
```
- hover `shadow.sm`, 드래그 `shadow.lg` + scale 1.02, 클릭 → 우측 드로어 480 상세.
- 보드: 컬럼 280 · 사이 16 · 컬럼 `surface.canvas` radius 12 패딩 8 · 헤더 40(상태 아이콘 + 이름 `label-md` + 개수 caption + 우측 +) · 카드 사이 8 · 드롭 가능 컬럼 `board.drop-bg`. 컬럼 빈 상태 "이슈를 여기로 끌어오세요" caption 가운데 높이 80.
- 목록 뷰는 §11.

## 32. Revision list · Backlink

Revision(패널 탭): 세로 타임라인(`line-color` 1px), 항목 48: 시각 `caption` + 작성자 아바타 xs + 요약 `body-sm` 1줄("블록 3개 변경") + 해시 `mono-label`. 현재 revision 왼쪽 2px `current-marker`. 항목 클릭 → 읽기 전용으로 열기, "이 버전으로 복원"(secondary) → 확인 다이얼로그(복원은 새 revision 이므로 primary).

Backlink(패널 탭): 항목 40, 아이콘 16 + 페이지 제목 `label-md` + 링크 문맥 `caption` 1줄. 아래 별도 섹션 "제안된 관계" (`overline` + AI 배지): 항목 옆 "연결" ghost xs / "무시" ghost xs. 확정하면 위 목록으로 이동, 배지 제거.

## 33. Import dropzone

가져오기 모달 md: 점선 `border.strong` 2px, radius 12, 높이 200, 아이콘 `upload` 32 tertiary + "Markdown 파일·폴더·ZIP 을 끌어다 놓거나" + "파일 선택"(secondary). 드래그 오버 시 `selected-bg` + `border.brand`. 진행 중 progress bar 8 + "12 / 40 파일" caption. 완료 → §28 보고서(손실 있을 때) 또는 토스트.
동일 bundle 재가져오기: 선택 라디오 3개 "새 문서로 · 기존 문서 업데이트 · 충돌 확인" — 기본값 없음, 골라야 진행.

## 34. 여기 없는 컴포넌트를 만들 때

1. **크기**: `size.control.*` 중 하나. 툴바·패널·트리는 32, 폼은 40.
2. **패딩**: 세로는 높이가 정하고, 가로는 `space.3`(sm) / `space.4`(md).
3. **radius**: 컨트롤·문서 블록 `md`, 카드·상자 `lg`, 오버레이 `xl`.
4. **색**: 면 `surface.*` → 글자 `text.*` → 테두리 `border.*` → 상호작용. **AI 가 만든 것이면 `ai.*`**. 원시색은 열지 않는다.
5. **글자**: UI 는 `label-*`/`body-*`, 문서 안이면 `prose-*`.
6. **상태 6종** 을 전부 그린다. notting 은 여기에 **오프라인·충돌·읽기 전용** 세 상태를 더 묻는다(15 §8).
7. **접근성**: 포커스 링, 키보드, `aria-*`, 44px. 드래그에는 키보드 대안.
8. **모션**: 진입 `decelerate`, 퇴장 `accelerate`, 색 `fast`. 에디터 안에서는 텍스트를 움직이지 않는다.
9. 만든 뒤 이 문서에 §를 추가하고 `component.json` 에 토큰을 등록한다(13).
