# 06 · 컴포넌트 규격

각 컴포넌트를 **크기 · 색 · 상태 · 접근성 · 언제 쓰나** 로 적었다. 값은 전부 토큰 이름이다(`component.*` 는 `tokens/src/component.json`, 나머지는 시맨틱). 여기 없는 컴포넌트는 §16 조립 규칙으로 만든다.

공통 상태 6종: `default` `hover` `active(눌림)` `focus-visible` `disabled` `loading`. 입력류는 `error` `readonly` 가 추가된다. 상태마다 한 가지 속성만 바꾼다(hover 는 배경 한 단계, focus 는 링, disabled 는 opacity).

---

## 1. Button

| size | 높이 | 좌우 패딩 | 아이콘 | 글자 | 언제 |
|---|---|---|---|---|---|
| `xs` | 24 | 8 | 12 | label-sm | 표 셀 안, 칩 삭제 |
| `sm` | 32 | 12 | 16 | label-md | 툴바, 표 필터, 카드 헤더 |
| `md` | 40 | 16 | 20 | label-md | **기본** 폼·다이얼로그 |
| `lg` | 48 | 20 | 20 | label-lg | 모바일 주 액션, 로그인, 랜딩 CTA |
| `xl` | 56 | 24 | 24 | label-lg | 히어로 CTA 전용 |

- radius `radius.md`(8). 랜딩 CTA 만 `radius.full`.
- 아이콘↔라벨 `space.2`. 아이콘 전용 버튼은 정사각형(높이 = 폭), `aria-label` 필수.
- variant 색: 01 §action. `primary` 는 화면당 1개.
- 같은 줄 버튼들은 같은 size. 그룹 간격 `space.2`(sm) / `space.3`(md 이상).
- 최소 폭: md 이상 64px. "확인" 두 글자 버튼이 정사각형처럼 보이지 않게.
- 텍스트 줄바꿈 금지(`white-space: nowrap`). 길면 문구를 줄인다.

상태
| 상태 | 처리 |
|---|---|
| hover | `bg-hover`. `fast` |
| active | `bg-active` + `scale(0.98)` |
| focus-visible | 포커스 링 2px offset 2 |
| disabled | `action.disabled.*`, `cursor: not-allowed`, `aria-disabled`. **왜 안 되는지** 툴팁 또는 도움말 |
| loading | 라벨 자리에 스피너(16/20px), 폭 유지(`min-width` 를 현재 폭으로), `aria-busy`, 클릭 무시. 라벨을 없애지 않고 스피너를 앞에 붙여도 된다 |

모바일: 폼 하단 주 버튼은 전폭 `lg`. 두 개면 세로 쌓기, 주 버튼이 위.

```css
.btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--wh-component-button-gap);
  height: var(--wh-component-button-md-height); padding-inline: var(--wh-component-button-md-padding-x);
  border-radius: var(--wh-component-button-radius); font: 500 var(--wh-font-size-sm)/1.5 var(--wh-font-family-sans);
  white-space: nowrap; min-width: 64px; border: 1px solid transparent;
  transition: background-color var(--wh-motion-duration-fast) var(--wh-motion-easing-standard), transform var(--wh-motion-duration-fast); }
.btn--primary { background: var(--wh-color-action-primary-bg); color: var(--wh-color-action-primary-text); }
.btn--primary:hover { background: var(--wh-color-action-primary-bg-hover); }
.btn--primary:active { background: var(--wh-color-action-primary-bg-active); transform: scale(var(--wh-motion-scale-press)); }
.btn--secondary { background: var(--wh-color-action-secondary-bg); color: var(--wh-color-action-secondary-text); border-color: var(--wh-color-action-secondary-border); }
.btn:disabled, .btn[aria-disabled="true"] { background: var(--wh-color-action-disabled-bg); color: var(--wh-color-action-disabled-text); border-color: var(--wh-color-action-disabled-border); cursor: not-allowed; }
```

## 2. Input · Textarea · Select

| size | 높이 | 좌우 패딩 | 글자 | 언제 |
|---|---|---|---|---|
| `sm` | 32 | 12 | body-sm | 표 필터, 인라인 편집 |
| `md` | 40 | 12 | body-md(16) | **기본**. 16px 이어야 iOS 자동 확대가 없다 |
| `lg` | 48 | 16 | body-md | 로그인, 검색 히어로, 모바일 |

- 배경 `surface.default`, 테두리 `border.strong` 1px, radius `radius.md`.
- 라벨: `label-md`, `text.primary`, 인풋 위 `space.2`. **항상 보이는 라벨**. 플레이스홀더를 라벨 대용으로 쓰지 않는다(입력하면 사라진다).
- 플레이스홀더: `text.placeholder`. 형식 예시만("예: hong@example.com"), 지시문 금지.
- 도움말: `caption` `text.tertiary`, 인풋 아래 `space.1-5`.
- 필수 표시: 라벨 뒤 `*` `text.danger`. 대부분 필수면 선택 항목에 "(선택)" 을 쓴다.
- 앞·뒤 아이콘/접사: `size.icon.md`, `text.tertiary`, 패딩 안쪽 `space.3`.
- Textarea 최소 높이 96px(3줄), `resize: vertical`.
- Select 는 네이티브 `<select>` 우선. 검색·다중 선택이 필요할 때만 커스텀(Dropdown 규격).

상태
| 상태 | 처리 |
|---|---|
| hover | 테두리 `neutral.500` |
| focus | 테두리 `border.focus` 2px 로 **안쪽**(offset 0, `box-shadow: 0 0 0 1px` 로 두께 보정) |
| error | 테두리 `border.danger`, 아래 오류 문구 `caption` `text.danger` + 아이콘, `aria-invalid` `aria-describedby`. 도움말이 있으면 오류가 **대체**한다 |
| disabled | 배경 `surface.disabled`, 글자 `text.disabled`, 테두리 `border.default` |
| readonly | 테두리 없음, 배경 `surface.sunken`, 글자 primary |

유효성 검사 시점: 첫 blur 후부터, 이후 입력마다. 제출 전에 빈 필드에 오류를 띄우지 않는다.

## 3. Checkbox · Radio · Switch

| 컴포넌트 | 시각 크기 | radius | 테두리 | 선택 시 |
|---|---|---|---|---|
| Checkbox | 20 | `radius.xs` | `border.input-strict` 1px | 배경 `action.primary.bg`, 체크 `action.primary.text`, `spring` `fast` |
| Radio | 20 | `full` | 같음 | 테두리 `action.primary.bg` 2px + 안쪽 점 10px |
| Switch | 40×24, 손잡이 20 | `full` | 없음 | 트랙 `neutral.300` → `action.primary.bg`, 손잡이 흰색 이동 `fast` `spring` |

- 클릭 영역은 44px 로 확보(`label` 로 감싸거나 pseudo-element).
- 라벨 오른쪽, 간격 `space.2`, `body-md` 또는 `body-sm`. 라벨 클릭으로 토글.
- Checkbox 그룹 세로 간격 `space.2`, 가로 나열은 3개 이하일 때만.
- Switch 는 **즉시 반영되는 설정**(알림 켜기)에, Checkbox 는 **제출로 반영되는 선택**에. Switch 옆에 저장 버튼이 있으면 잘못 쓴 것이다.
- indeterminate(부분 선택) 체크박스: 가로 바 아이콘.

## 4. Card

| 항목 | 값 |
|---|---|
| 배경 / 테두리 | `surface.default` / `border.default` 1px (또는 테두리 없이 `shadow.sm`) |
| radius | `radius.lg` 12 |
| 패딩 | sm 16 · **md 20** · lg 24 |
| 제목↔본문 | `space.3` |
| 카드 사이 | 16(모바일) / 24(데스크톱) |
| 제목 / 설명 | `heading-3` 또는 `heading-5` / `body-sm` `text.secondary` |

- 클릭 가능한 카드만 hover(`shadow.md` + `translateY(-1px)`), `cursor: pointer`, 전체가 `<a>` 또는 `role="button"`. 카드 안에 또 버튼이 있으면 카드 전체 클릭은 포기한다(중첩 인터랙션 금지).
- 카드 안 카드 금지. 안쪽 구획은 `surface.sunken` 또는 `border.subtle` 구분선.
- 이미지 카드: 이미지 radius = 카드 radius(패딩 0 일 때) 또는 `radius.md`(패딩 있을 때). 비율 16:9 또는 4:3 고정(`aspect-ratio`).
- 카드 푸터 액션: 우측 정렬 `sm` 버튼, 위 구분선 `border.subtle`.

## 5. Badge · Tag · Chip

| 종류 | 높이 | 좌우 패딩 | radius | 글자 | 언제 |
|---|---|---|---|---|---|
| Badge sm | 20 | 6 | `full` | label-sm | 표 안 상태 |
| Badge md | 24 | 8 | `full` | label-sm | 카드 헤더·목록 상태 |
| Tag(각진) | 24 | 8 | `radius.xs` | label-sm | 카테고리·라벨(상태 아님) |
| Chip(선택형) | 32 | 12 | `full` | label-md | 필터, 다중 선택 표시. 삭제 X 아이콘 16 |
| Dot | 8×8 | | `full` | | 아바타 모서리·탭 라벨 옆 알림 |
| Count | 최소 20, 좌우 6 | | `full` | label-sm 숫자 | 알림 수. 99+ 로 자름 |

- 상태 배지: `status.<s>.solid` + `on-solid`(채움형) 또는 `status.<s>.bg` + `text`(옅은형). **한 화면에서 한 형태만**.
- 분류 태그(상태 아님): `status.neutral.*` 또는 `surface.brand-subtle` + `text.brand`.
- 배지 글자는 두 단어 이하. 아이콘 `size.icon.xs`(12) 앞에, 간격 `space.1`.
- Chip 선택 상태: 배경 `interactive.selected-bg`, 테두리 `selected-border`, 글자 `selected-text`.

## 6. Avatar

| size | px | 폴백 글자 |
|---|---|---|
| xs | 24 | label-sm 1글자 |
| sm | 32 | label-sm 1글자 |
| md | 40 | label-md 1글자 |
| lg | 56 | heading-4 1글자 |
| xl | 80 | heading-2 |
| 2xl | 128 | display-sm |

- radius `full`. 폴백 배경 `surface.brand-subtle`, 글자 `text.brand`(이름 첫 글자). 이미지 실패 시 자동 폴백.
- 겹쳐 쌓기(stack): `margin-left: -8px`, 흰 테두리 2px(`avatar.border`), 최대 4개 + "+N".
- 상태 도트: 우하단, 크기 = 아바타의 1/4, 테두리 2px 흰색.

## 7. Modal · Dialog · Drawer · Bottom sheet

| 항목 | 값 |
|---|---|
| 폭 | sm 400(확인) · **md 560**(폼) · lg 800(상세). 모바일은 전폭 − 32 또는 바텀시트 |
| 배경 / radius / 그림자 | `surface.raised` / `radius.xl` / `shadow.lg` |
| 패딩 | 24 (모바일 20) |
| 헤더 | `heading-2`, 우상단 닫기 X(ghost sm 아이콘 버튼) |
| 헤더↔본문↔푸터 | `space.5` |
| 푸터 | 우측 정렬, 버튼 간격 `space.3`, 주 버튼 오른쪽 |
| 스크림 | `surface.overlay`, `z-index.overlay`; 상자 `z-index.modal` |
| 모션 | 05 §3 |

- 열릴 때 첫 포커스는 첫 인풋 또는 닫기 버튼, 포커스 트랩, `Esc` 로 닫힘, 뒤 배경 스크롤 잠금.
- 스크림 클릭으로 닫기는 **입력 내용이 없을 때만**. 폼이 더러워졌으면 "나가면 저장되지 않습니다" 확인.
- 확인 다이얼로그(sm): 제목은 질문("삭제할까요?"), 본문 한 문장(무엇이 어떻게 되는지), 버튼은 동작 이름("삭제" · "취소"). "예/아니오" 금지. 파괴 동작은 `danger` 버튼.
- 모달 안 모달 금지. 모달 안 팝오버는 `z-index.popover`.
- 콘텐츠가 길면 본문만 스크롤(헤더·푸터 고정), 최대 높이 `calc(100vh - 2 * space.12)`.
- Drawer(옆): 폭 400 또는 480, 우측에서. 필터·상세 편집. 배경 스크림은 옅게(`opacity.scrim` 0.3 정도) 또는 없이.
- Bottom sheet(모바일): 상단 radius `xl`, 드래그 손잡이 32×4 `neutral.300`, 최대 높이 90vh.

## 8. Dropdown · Menu · Popover

| 항목 | 값 |
|---|---|
| 상자 | `surface.raised`, `border.default` 1px, `radius.md`, `shadow.md`, 안쪽 패딩 `space.1` |
| 항목 높이 | 32 (터치 위주 40) |
| 항목 패딩 / radius | 좌우 `space.2` / `radius.sm` |
| 항목 글자 | `body-sm` `text.primary`. 파괴 항목 `text.danger` |
| 항목 hover | `interactive.hover-overlay` |
| 항목 선택 | `selected-bg` + 우측 check 아이콘 |
| 폭 | 최소 160, 트리거 폭 이상. 최대 높이 320 스크롤 |
| 트리거와 거리 | `space.1` |
| 구분선 | `border.subtle`, 상하 `space.1` |
| 그룹 라벨 | `overline` `text.tertiary`, 패딩 `space.2` |
| z-index | `dropdown`(모달 안이면 `popover`) |

- 키보드: ↑↓ 이동, Enter 선택, Esc 닫기, 타이핑 점프. `role="menu"` / `role="listbox"`.
- 항목 아이콘 `size.icon.sm`(16) 왼쪽, 단축키 표시 우측 `caption` `text.tertiary`.
- 화면 밖으로 나가면 반대 방향으로 뒤집는다(flip).
- Popover(내용형): 패딩 `space.4`, 최대 폭 320, 화살표 없음.

## 9. Tooltip

- 배경 `surface.inverse`, 글자 `text.inverse`, `body-xs`, 패딩 6/8, `radius.sm`, 최대 폭 240, 트리거와 8px.
- 나타남 지연 300ms(마우스), 사라짐 즉시. 포커스 시에도 표시.
- **아이콘 전용 버튼에는 필수.** 본문 링크·긴 설명에는 쓰지 않는다(터치에서 안 보인다). 중요한 정보는 툴팁에 숨기지 않는다.
- 화살표 없음(단순하게). `z-index.tooltip`.

## 10. Toast · Alert(Banner) · Inline message

| 종류 | 위치 | 크기 | 색 | 언제 |
|---|---|---|---|---|
| Toast | 우하단(데스크톱) / 상단 중앙(모바일), 세로 쌓기 gap 12, 최대 3개 | 폭 360, 패딩 16, `radius.lg`, `shadow.lg` | 기본 `surface.inverse`+`text.inverse`. 상태 아이콘만 `status.<s>.solid` 색 | 동작 결과 알림("저장됨", "삭제됨 · 되돌리기") |
| Alert(배너) | 콘텐츠 상단 또는 섹션 안 | 패딩 16, `radius.lg`, 테두리 1px | `status.<s>.bg` + `border` + `text` + `icon` | 페이지·섹션 수준 상태(결제 실패, 점검 예정) |
| Inline message | 필드 아래 | `caption` + 아이콘 12 | `text.<s>` | 유효성·필드 도움 |

Toast 규칙
- 지속 4초(`toast.duration-default`), 오류 8초, **되돌리기 같은 액션이 있으면 자동 닫힘 없음**(닫기 버튼).
- 한 문장. 제목 없음. 액션 버튼은 ghost sm 1개.
- 폼 유효성 오류는 토스트가 아니라 필드 옆 inline.
- `role="status"`(정보) / `role="alert"`(오류).

Alert 규칙
- 아이콘 `size.icon.md` 왼쪽, 제목 `label-md`(선택), 본문 `body-sm`, 액션 링크 우측 또는 아래.
- 닫기 가능하면 우상단 X. 닫은 상태를 저장(다시 보이지 않게).
- 페이지에 배너 1개. 두 개면 더 심각한 것만.

## 11. Table

| 항목 | 값 |
|---|---|
| 헤더 | 배경 `surface.sunken`, `label-md` `text.secondary`, 높이 40, `position: sticky; top: 0` |
| 행 높이 | compact 36 · **default 44** · relaxed 56(아바타·2줄) |
| 셀 패딩 | 좌우 12, 첫·마지막 열 16 |
| 셀 글자 | `body-sm` `text.primary`. 보조 열 `text.secondary` |
| 숫자 열 | `numeric` 우측 정렬 |
| 선 | 행 사이 `border.default` 1px, 세로선 없음 |
| hover / 선택 | `hover-overlay` / `selected-bg` + 왼쪽 체크박스 |
| 정렬 아이콘 | 헤더 우측 16px, 정렬된 열만 `text.primary` |
| 빈 상태 | 표 안에 07 §2 빈 상태, 높이 최소 240 |
| 로딩 | 행 5개 스켈레톤 |

- 첫 열은 식별자(이름·제목), 마지막 열은 액션(ghost xs 아이콘 버튼 또는 ⋯ 메뉴). 액션 열은 hover 시만 보이게 하지 않는다(터치).
- 열 폭: 고정 열(체크박스 48, 상태 배지 120, 날짜 140, 액션 56)은 고정, 나머지 `auto`. 텍스트는 1줄 말줄임 + title 툴팁.
- 페이지네이션: 표 아래 우측, `sm` 버튼, "1–20 / 240" 표기. 20·50·100 선택.
- 모바일: 열 4개 이상이면 카드 리스트로 전환, 3개 이하면 가로 스크롤.

## 12. Tabs · Segmented control

| 종류 | 언제 | 규격 |
|---|---|---|
| 밑줄 탭 | 페이지·섹션 내 뷰 전환(5개 이하) | 높이 40, 항목 간격 24, 글자 `label-md`, 비활성 `text.secondary` → 활성 `text.primary`, 인디케이터 2px `border.brand` 아래, 트랙 선 `border.default` |
| 세그먼트 | 2~4개 짧은 옵션(보기 방식·기간) | 트랙 `surface.sunken` `radius.md` 패딩 4, 활성 항목 `surface.default` `shadow.xs` `radius.sm`, 높이 32 |
| 세로 탭 | 설정 페이지 좌측 | 폭 200, 항목 높이 36, 활성 `selected-bg` + `selected-text`, `radius.sm` |

- 탭은 URL 과 연결한다(새로고침 유지). 탭 개수는 5개까지, 넘으면 드롭다운 또는 세로 탭.
- 인디케이터 이동 `normal` `standard`. `role="tablist"`, ←→ 이동.
- 탭 안에 탭 금지.

## 13. Navigation (Header · Sidebar · Breadcrumb · Pagination)

Header
- 높이 56/64, 배경 `surface.default`, 아래 `border.subtle`. 스크롤 시 `shadow.md` 또는 `backdrop-filter: blur(blur.md)` + 배경 90% 투명.
- 로고 왼쪽(높이 24 또는 28), 내비 항목 `label-md` 간격 `space.6`, 우측 액션(검색·알림·아바타 32) 간격 `space.3`.
- 모바일: 로고 + 햄버거(아이콘 버튼 40). 메뉴는 드로어.

Sidebar
- 폭 240 / 접힘 64. 배경 `surface.default` 또는 `canvas`, 우측 `border.subtle`.
- 항목 높이 36, 패딩 좌우 12, `radius.sm`, 아이콘 20 + 라벨 `label-md`, 간격 `space.2`. 그룹 제목 `overline`, 위 `space.6`.
- 활성 항목 `selected-bg` + `selected-text` + 아이콘도 같은 색. hover `hover-overlay`.
- 접힘 상태는 아이콘만 + 툴팁.

Breadcrumb
- `body-sm`, 구분자 chevron-right 16 `text.tertiary`, 항목 `text.secondary` 링크, 마지막(현재) `text.primary` 링크 아님. 4단계 넘으면 중간 "…" 으로 접기. 페이지 제목 위 `space.2`.

Pagination
- `sm` 버튼 세트, 현재 페이지 `selected-bg`. 1 … 4 5 [6] 7 8 … 20. 모바일은 "이전 · 6 / 20 · 다음".

## 14. Progress · Spinner · Skeleton

| 컴포넌트 | 규격 | 언제 |
|---|---|---|
| Spinner | 16(버튼 안) · 20 · 32(영역), 선 2px, `action.primary.bg`, `linear` 무한 | 1초 이내 예상, 영역이 작을 때 |
| Progress bar | 높이 4(인라인) · 8(카드), 트랙 `surface.sunken`, 채움 `action.primary.bg`(상태면 `status.<s>.solid`), `radius.full` | 진행률을 알 때(업로드) |
| Skeleton | 배경 `surface.sunken`, `radius.sm`, 글자용 높이 0.75em, shimmer 1.5s | 페이지·카드·표 첫 로딩. **레이아웃 자리를 그대로 차지** |
| 무한 progress bar | 헤더 아래 2px 이동 바 | 페이지 전환·데이터 재조회 |

- 300ms 이내에 끝나는 요청엔 아무것도 띄우지 않는다(깜빡임). 300ms 지연 후 표시.
- 스켈레톤은 실제 콘텐츠와 같은 크기·개수(카드 3개면 3개). 글자 스켈레톤은 마지막 줄을 60% 폭으로.

## 15. Empty · Error · Divider · Kbd · Code

- Empty / Error 상태: 07 참조.
- Divider: `border.subtle` 1px, 상하 `space.4`. 글자 있는 구분선("또는")은 `caption` `text.tertiary` 좌우 `space.3`.
- Kbd: `code` 서체 `xs`, 배경 `surface.sunken`, 테두리 `border.default`, `radius.xs`, 패딩 2/6, 아래 테두리 2px(키 느낌).
- Code block: 배경 `surface.sunken`, `radius.lg`, 패딩 `space.4`, `code` 스타일, 우상단 복사 버튼(ghost xs), 줄 번호 `text.tertiary`. 다크에서는 `surface.sunken` 이 더 어두운 값으로 자동 전환된다.

## 16. 여기 없는 컴포넌트를 만들 때

1. **크기**: `size.control.*` 중 하나. 한 줄이면 40, 밀도 높으면 32.
2. **패딩**: 세로는 높이가 정하고, 가로는 `space.3`(sm) / `space.4`(md).
3. **radius**: 컨트롤 `md`, 상자 `lg`, 오버레이 `xl`.
4. **색**: 면 `surface.*` → 글자 `text.*` → 테두리 `border.*` → 상호작용 `action.*`/`interactive.*`. 이 순서로 고르고 원시색은 열지 않는다.
5. **글자**: `typography.*` 하나. 컨트롤은 `label-*`, 내용은 `body-*`.
6. **상태 6종** 을 전부 그린다. 하나라도 빠지면 미완성.
7. **접근성**: 포커스 링, 키보드 조작, `aria-*`, 44px 터치.
8. **모션**: 진입 `decelerate`, 퇴장 `accelerate`, 색 `fast`.
9. 만든 뒤 이 문서에 §를 추가하고 `component.json` 에 토큰을 등록한다(13 거버넌스).
