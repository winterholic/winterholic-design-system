# 06 · 컴포넌트 규격 (memoir)

각 컴포넌트를 **크기 · 색 · 상태 · 접근성 · 언제 쓰나** 로 적었다. 값은 전부 토큰 이름이다(`component.*` 는 `tokens/src/component.json`, 나머지는 시맨틱). 기존 `components/ui`·`components/layout` 와의 대응을 적었다. 이 문서만으로 조립이 끝나야 한다. 없는 것은 §24 조립 규칙.

공통 상태 6종 `default` `hover` `active` `focus-visible` `disabled` `loading`, 입력류 `error` `readonly`. 상태마다 한 가지 속성만 바꾼다.

memoir 공통 규칙 세 가지
1. **면으로 구획.** 컴포넌트에 테두리·그림자를 주기 전에 어느 층(zone/default/raised)에 놓이는지 정한다.
2. **파랑은 클릭 가능한 것에만.** 활성 메뉴·링크·포커스. 장식으로 파랑 금지.
3. **핑크는 강조, 로즈는 액션.** 핑크 위 글자는 항상 wine.

---

## 1. Button (기존 `Button.tsx`)
| size | 높이 | 좌우 | 아이콘 | 글자 | 언제 |
|---|---|---|---|---|---|
| `xs` | 28 | 8 | 16 | caption 12/500 | 카드 안 인라인(복사·편집·⋯) |
| `sm` | 36 | 12 | 16 | label-md 14/600 | 서브 헤더·카드 헤더·모달 보조·빈 상태 링크형 |
| `md` | 44 | 20 | 20 | label-md | **기본** |
| `lg` | 52 | 24 | 20 | label-lg 16/600 | 로그인·2FA·온보딩·시트 CTA |

variant
| | 배경 / 글자 | 언제 | 화면당 |
|---|---|---|---|
| `primary` | 로즈 / 흰 | 저장·만들기·인증·시작 | 1개 (모달 안은 그 모달의 1개) |
| `secondary` | paper-deep / 로즈 | 덜 중요한 행동(추가·둘러보기). 테두리 없음 | 제한 없음 |
| `ghost` | 투명 / neutral.700, hover paper-tint | 취소·내비·아이콘 버튼 | 제한 없음 |
| `interactive` | 페리윙클 / 흰 | **활성 메뉴 전용**(카테고리 드롭다운 선택 항목·활성 탭). 일반 버튼 아님 | |
| `danger` | red.600 / 흰 | 삭제·탈퇴·2FA 해제 | 확인 모달 안에서만 |
| `danger-ghost` | 투명 / red.600 | ⋯ 메뉴 안 삭제 | |
| `disabled` | paper-deep / neutral.400 | 이유 툴팁 필수 | |

- radius 8. 헤더 `+ New` 와 랜딩 CTA 만 필(`radius-pill`). 그림자 없음(design-guide).
- 아이콘↔라벨 8. 아이콘 전용 정사각형 + `aria-label` + 툴팁. 최소 폭 72. 줄바꿈 금지.
- 상태: hover 한 단계 진하게 `fast`, active `scale(0.98)`, focus 링 2px indigo offset 2, disabled + `aria-disabled`, loading 스피너 16 + 폭 유지 + `aria-busy`.
- 그룹 간격 8(sm)/12(md). 데스크톱 우측 정렬 주 버튼 오른쪽. 모바일 세로, 주 버튼 위, 전폭 lg.

```css
.btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--mm-component-button-gap); height: var(--mm-component-button-md-height); padding-inline: var(--mm-component-button-md-padding-x); min-width: var(--mm-component-button-min-width); border-radius: var(--mm-component-button-radius); border: 0; font: 600 var(--mm-font-size-sm)/1.5 var(--mm-font-family-sans); transition: background-color var(--mm-motion-duration-fast) var(--mm-motion-easing-in-out), transform var(--mm-motion-duration-fast); }
.btn--primary { background: var(--mm-color-action-primary-bg); color: var(--mm-color-action-primary-text); }
.btn--primary:hover { background: var(--mm-color-action-primary-bg-hover); }
.btn--secondary { background: var(--mm-color-action-secondary-bg); color: var(--mm-color-action-secondary-text); }
.btn:disabled { background: var(--mm-color-action-disabled-bg); color: var(--mm-color-action-disabled-text); cursor: not-allowed; }
```

## 2. FAB (`component.fab`)
56 원형, 로즈, 흰 `plus` 24, `shadow.ambient`, 우하단 24(모바일 16). hover scale 1.04 `fast` `out`. 카테고리별 "새 메모"의 주 진입. 헤더 New 와 둘 다 있을 때 모바일은 FAB 만, 데스크톱은 New 만. 바텀시트·모달 열리면 숨김. 일반 메모(에디터 즉시 진입)에는 없음. `z-index.fab` 900.

## 3. Input · Textarea · Select (기존 `Input.tsx` `CustomSelect.tsx`)
두 형태만. 상자 테두리형은 없다.
| 형태 | 기본 | 포커스 | 오류 | 언제 |
|---|---|---|---|---|
| `underline` | 투명 배경, 밑줄 1px `border.strong` | 배경 흰 면 + 밑줄 2px indigo | 밑줄 red 2px | 폼(로그인·설정)·메모 속성·프롬프트 모달 |
| `filled` | `surface.zone-deep`, radius 8 | 흰 면 + `shadow.focus` | 밑줄 red 2px 안쪽 | 검색·필터·URL 붙여넣기·모달 안 |

- 높이 44(lg 52), 좌우 12, 글자 body 16(모바일도 16 이라 iOS 확대 없음).
- 라벨 `label`(대문자 자간) `text.tertiary` 위 8. 도움말 `caption` 아래 6. 필드 사이 24.
- 플레이스홀더 `text.placeholder`. 예시만("예: hong@example.com").
- 앞뒤 아이콘 20 `text.tertiary` 안쪽 12. 글자 수 카운터 우하단 `caption`.
- Textarea 최소 3줄(72), `resize: none`. 에디터 대신 쓰지 않는다.
- Select: 네이티브 우선. 커스텀(`CustomSelect`)은 filled 트리거 + 드롭다운(§13). 언어·플랫폼·폴더 선택.
- 상태: hover 밑줄 neutral.400, readonly 밑줄 없음 + `zone`, disabled `zone-deep` + `text.disabled`.
- 유효성: 첫 blur 후, 제출 시 첫 오류 포커스. `aria-invalid` `aria-describedby`.

## 4. Search bar (기존 `SearchBar.tsx`)
헤더 중앙 필 44, `surface.zone-deep`, 왼쪽 search 16 `text.tertiary`, 플레이스홀더는 카테고리별("코드 검색", "북마크 검색"), 우측 `⌘K` `caption`(데스크톱). 포커스 흰 면 + `shadow.focus`. 최대 폭 400. 모바일: 아이콘 버튼 44 → 전폭 오버레이(헤더 자리, 뒤로 화살표 + 인풋 + 취소). 입력 후 300ms 디바운스, 결과 드롭다운(§13 규격, 카테고리 그룹 라벨 `label`). Enter → 검색 결과 페이지(12 §12).

## 5. PIN / 2FA (`component.pin`)
6칸 × 52, 간격 8, radius 8, `zone-deep`, 채워지면 흰 면, 현재 칸 밑줄 2px indigo(`box-shadow inset`), 글자 `pin` 24 mono. 오류: 전체 shake 400 + 칸 밑줄 red + 아래 `caption` `text.danger` "코드가 맞지 않아요 (2/5)". 5회 실패 → 10분 잠금 배너. 자동 포커스 이동, Backspace 이전 칸, 붙여넣기 6자리 분배, `inputmode="numeric" autocomplete="one-time-code"`. 성공 → `lock` 600 블러 걷힘. 재전송 링크 `caption` 30초 카운트.

## 6. Chip · Tag · Lang badge · Count (기존 `Chip.tsx`)
| 종류 | 규격 | 색 | 언제 |
|---|---|---|---|
| 필터 칩(서브 헤더) | 28(터치 36), 좌우 12, 필, `label` 12/600 대문자 | 기본 paper-deep + neutral.700 · hover cream · 활성 pink + wine · ALL ink + paper | 언어·플랫폼·태그·정렬 |
| #태그 | 24, 좌우 8, 필, `tag` 12/500 | blush + ink(다크 pink.300 + wine) | 메모 하단 |
| 태그 입력 칩 | 28, 좌우 8 + X 16 | 같음 | 에디터·모달 태그 입력 |
| 언어·플랫폼 배지 | 22, 좌우 8, radius 4, `label` | zone-deep + secondary. 언어별 50~100 단계(JS amber, Java blue, Python green, Go cyan 대신 blue.50, Rust amber.50) | 코드·명령어 카드 |
| 카운트 | 20, 필, caption | zone-deep | 폴더 개수·드롭다운 항목 |
| 새 항목 배지 | 20, 필, `tag`, 로즈 + 흰 | 알림·업데이트 |

칩 사이 8. 서브 헤더 넘치면 가로 스크롤 + `fade-right`. 단일 선택(정렬)은 하나, 다중(태그)은 여러 개 + `aria-pressed`. 활성 칩에 X 없음(다시 누르면 해제), 태그 입력 칩만 X.

## 7. Card — 메모 카드 공통 (`component.card`)
- `zone` 위 흰 면, 테두리·그림자 없음, radius 12, 패딩 24, 카드 사이 24.
- 헤더 [언어/카테고리 배지] [제목 `title` 20 1줄 말줄임] 우측 [★ ghost xs] [⋯ ghost xs]. 헤더↔본문 16.
- 본문 카테고리별(§8). 본문↔메타 16.
- 메타 줄 왼쪽 #태그(간격 6, 최대 3 + "+N"), 오른쪽 날짜 `label` `text.tertiary` `OCT 24, 2023`.
- 클릭 가능한 카드만 hover `shadow.soft`(떠오름·확대 없음). 카드 안 버튼은 `stopPropagation`.
- 미리보기 카드(벤토 안): 패딩 12, radius 8, 배경 `zone`, 제목 `title-sm` + 1줄.
- 선택 모드(다중 삭제): 좌상단 체크박스 + 선택 시 `selected-bg` 배경.
- 즐겨찾기 카드: ★ pink.400 채움. 카드 테두리 없음.
- 카드 안 카드 금지. 구획은 `zone-deep` 또는 여백.

## 8. 카테고리별 본문
| 카테고리 | 컴포넌트 | 규격 |
|---|---|---|
| 💻 코드 | `code-block` | 배경 #1A1A1A, radius 12, 패딩 20, `code` 14 mono/1.6, 줄 번호 40 `code.gutter`. 접힘 240 + 하단 페이드(코드 배경색) + "더 보기" ghost xs 흰 글자. 툴바 36: 언어 라벨 왼쪽 `label` comment 색, 복사(ghost xs, `code.comment` → hover `code.text`) 오른쪽. 하이라이트 `code.keyword/string/number/function/comment`, 현재 줄 `line-highlight`. 가로 스크롤 허용, 줄바꿈 토글 |
| ⌨️ 명령어 | `command-row` | 행 52, 흰 면, radius 8, 행 사이 8(촘촘 예외). [플랫폼 배지 22] [명령어 `command` mono, 배경 `code.inline-bg` 패딩 4/8 radius 4, 1줄 말줄임] [설명 `body-sm` secondary 1줄] [복사 xs]. hover zone-deep. 모바일 2줄. 그룹 라벨 `label` 위 12, 그룹 사이 32. 행 클릭 → 인라인 편집(underline) |
| 🔗 북마크 | `bookmark-card` | 가로 96, [OG 96×64 radius 8 `object-fit: cover` \| 제목 `title-sm` 1줄 + external-link 12 / 도메인 `label` tertiary / 설명 `body-sm` 1줄] [태그]. 이미지 실패 zone-deep + 파비콘 16. 3열(xl)·2열(md)·1열. 클릭 새 탭 |
| 🎬 영상 | `video-card` | 16:9 썸네일 radius 16, 우하단 길이 배지(ink 80% + paper `caption`), hover 썸네일 위 play 32 + scrim. 아래 제목 `title-sm` 2줄 clamp, 채널·날짜 `caption`. 3열/2열/1열. 클릭 → WideModal(플레이어 + 메모 + 타임스탬프 링크) |
| ✍️ 단순 메모 | card | 제목 없어도 됨(첫 줄이 제목 `title-sm`), 본문 `body` 6줄 clamp, 더 길면 "…" + 클릭 확장 |
| 📝 일반 메모 | 에디터 §17 | 카드 없음. 즉시 진입 |
| 🔐 보안 | `secure-row` | 행 72, 왼쪽 4px 핑크 띠, [자물쇠 20 `status.secure.icon` \| 제목 `title-sm` \| 미리보기 `body-sm` 블러 8 + 50%] [남은 시간 `label` secure.text]. 해제 시 블러 걷힘(600)·자물쇠 열림. 클릭(해제 상태) → 상세 모달. 잠금 상태 클릭 → 인증 오버레이 |
| 🙈 프라이빗 | `folder` | 타일 160, radius 16, cream, hover blush, 폴더 32 `text.brand` + 이름 `title-sm` + 개수 `caption`. 안에서 단순 메모 카드 + 태그. "새 폴더" 타일 마지막(점선 아님, zone-deep + plus) |
| 📅 캘린더 | `calendar` | §11 |
| ☁️ 대시보드 | `bento` | §12 |

## 9. Header · Sub header (기존 `MainHeader` `SubHeader`)
- 메인 헤더 60, sticky, 좌우 24(모바일 16). [로고 24 `.mm-logo`] [카테고리 트리거 `label-lg` + chevron-down 16, hover zone, 높이 44] [검색 필 400] [New pill primary 44 → 카테고리 문맥("+ New Snippet")] [알림 bell 44(선택)] [아바타 32]. 정지 `surface.default`, 스크롤 시 `glass.bg-modal` + blur 12 + 아래 `border.subtle`. `z-index.sticky`.
- 서브 헤더 44, sticky top 60, 배경 canvas(헤더와 면 차이), 좌우 24. 내용 카테고리별(03 §3): 필터 칩 스크롤 / 브레드크럼 / 월 내비 / 잠금 상태. 우측 보조(정렬·뷰 전환·저장 상태). 첫 콘텐츠까지 32.
- 모바일: 로고·카테고리·검색 아이콘·아바타. 서브 헤더 칩 가로 스크롤 + `fade-right`.
- `<header>` + `<nav aria-label="카테고리">`, 서브 `<nav aria-label="필터">`.

## 10. Category dropdown (기존 `CategoryDropdown.tsx`)
폭 280, 글래스 `raised` + blur 20, radius 16, `shadow.ambient`, 패딩 8, 트리거 아래 4. 항목 44, radius 8, [카테고리 색 원 28(`category.<name>`) + 이모지] [이름 `label-md`] [개수 `caption` 우측]. 활성 `action.interactive`(페리윙클 + 흰 + 체크 16). hover zone. 10개 전부 스크롤 없이. 키보드 ↑↓ Enter Esc, `role="menu"`. 열림 fade + 4px `normal`. 모바일: 같은 규격 전폭 시트.

## 11. Calendar (`component.calendar`)
- 그리드 7열, 셀 최소 96(모바일 48), 패딩 8, 선 `border.default` 1px(선이 정보인 예외). 요일 헤더 `label` tertiary 배경 zone, 주말 `weekend-text`. 이전·다음 달 날짜 `text.disabled` 배경 zone.
- 오늘: 숫자 원형 28 로즈 채움 + 흰 글자. 선택: `today-bg` + 링 2px indigo(`box-shadow inset`). 이벤트: 도트 6 페리윙클 최대 3 + "+N"(모바일), 데스크톱은 1줄 칩(`tag` 규격, zone-deep) 최대 3.
- 우측 패널 320(`slide` 진입, lg 이상 고정): 날짜 `headline` + 할일 체크리스트 + 메모 카드 + "추가" secondary. 모바일 바텀시트.
- 서브 헤더: ‹ 2026년 9월 › + "오늘" ghost sm + 월/주 세그먼트.
- 주간 뷰: 7열 × 시간 없이 리스트. `<table>` + `<th scope>`, 셀 `<button aria-label="9월 19일, 메모 2개">`, 오늘 `aria-current="date"`.

## 12. Bento (`component.bento`)
글래스 40% + blur 24, radius 16, 패딩 24, 최소 높이 240, 제목 `title` + 우측 "전체 보기 →" `text.link`. 크림·블롭 위에서만. 오늘 할일(전폭): 체크박스 20 + `body`, 완료 취소선 + tertiary, 항목 상하 8, 하단 "할 일 추가" ghost sm. 코드·명령어·북마크 3열: 미리보기 카드 3개(패딩 12, zone). 빈 벤토: `body-sm` tertiary "즐겨찾기한 스니펫이 여기 보여요" + link. 로딩: 박스 안 스켈레톤 3줄.

## 13. Dropdown menu · Popover (⋯ 메뉴, 슬래시 메뉴)
글래스 `raised` + blur 20, radius 12, `shadow.ambient`, 패딩 8, 항목 36(터치 44) radius 6 좌우 12 `body-sm`, 아이콘 16 왼쪽, 단축키 `caption` tertiary 우측, 파괴 항목 `text.danger`, 구분선 = 항목 사이 8 여백(선 없음), 그룹 라벨 `label` tertiary. 최소 180, 최대 높이 320. hover `zone`. 키보드 ↑↓ Enter Esc 타이핑 점프. 화면 밖 flip. `z-index.dropdown`, 모달 안 `popover`. Popover(내용형): 패딩 16, 최대 320.

## 14. Modal · WideModal · PromptModal · Bottom sheet (기존)
| | Modal / Prompt | WideModal | 시트(모바일) |
|---|---|---|---|
| 폭 | 480 | 960 | 100% |
| 면 | 글래스 80% + blur 20, radius 16, `shadow.modal` | 같음 | 상단 radius 16, 손잡이 36×4 gray.300 |
| 패딩 | 32(모바일 20) | 32 | 20 |
| 제목 | `title-lg` 24 | `headline` 28 | `title-lg` |
| 푸터 | 우측, gap 12, 주 버튼 오른쪽 | 하단 고정 글래스 바 | 하단 고정 lg 전폭 |
| 최대 높이 | calc(100vh − 96), 본문 스크롤 | 풀스크린(모바일) | 90vh |
| z | `modal` 1300 | | `modal` |
- 스크림 ink 40%, 포커스 트랩, Esc, 배경 스크롤 잠금. 폼이 더러워지면 이탈 확인. 스크림 클릭 닫기는 입력 없을 때만.
- Prompt: 제목 + underline 인풋 1개 + 취소(ghost)/확인(primary). 첫 포커스 인풋.
- 위험 확인: 제목 질문형 + 대상 이름, 본문 결과 한 문장, 버튼 동작 이름, `danger`, 첫 포커스 취소. 매우 위험(폴더 삭제·탈퇴)은 이름 입력.
- WideModal(메모 편집): 좌 본문(에디터/CodeMirror) 우 속성 패널 280(제목·언어·태그·폴더 underline/filled). 자동 저장 상태 헤더 우측 `caption`.
- 모달 안 모달 금지. 팝오버는 `popover`.

## 15. Tooltip · Toast · Alert · Inline
- Tooltip: ink 면 + paper 글자, `caption`, 6/8, radius 6, 최대 240, 트리거와 8, 지연 300ms, 포커스 시도. 아이콘 버튼 필수. 터치 → 팝오버.
- Toast: ink 면, radius 12, `shadow.ambient`, 패딩 16, 폭 360, 우하단(모바일 하단 중앙 16, FAB 위). 3초, 오류·액션 6초, 액션 있으면 닫힘 없음. "삭제됐어요 · 되돌리기". `role="status"|"alert"`.
- Alert(배너): `status.<s>.bg` + 아이콘 20 + 제목 `label-md`(오류 필수) + `body-sm`, radius 12, 패딩 16, 테두리 없음(면으로). 페이지 1개. 보안 상태는 `status.secure`.
- Inline: 필드 아래 `caption` + 아이콘 12.

## 16. Checkbox · Radio · Switch
체크 20 radius 4 테두리 neutral.500, 체크 시 로즈 + 흰 체크, `spring` 없이 `fast`. 라디오 full. 스위치 40×24 손잡이 20, 트랙 neutral.300 → 로즈. 라벨 오른쪽 8 `body`. 클릭 44. 할일 완료: 취소선 + `todo-done-text`. 스위치 = 즉시 반영 설정(2FA·알림·다크), 체크박스 = 제출·선택(다중 삭제·할일). `aria-checked`, `role="switch"`.

## 17. Editor (일반 메모 · 노션형 블록)
- 풀 페이지 `zone` 배경, 본문 prose 680 을 캔버스에 바로(카드 없이). lg 이상 좌 10% 우 5%.
- 제목 `headline` 28 placeholder "제목 없음", 본문 `editor` 16/1.8. 블록 사이 8. 문단 첫 줄 placeholder "'/' 를 입력해 블록 추가".
- 블록 hover 왼쪽 ⋮⋮ 손잡이 + `+`(ghost xs, tertiary) −32px 위치. 드래그 중 블록 `shadow.soft` + 드롭 라인 2px indigo.
- 슬래시 메뉴: §13 규격, 항목 아이콘 20 + 이름 + `caption` 설명. 텍스트·제목1~3·체크·글머리·번호·인용·코드·구분선(간격 32 여백, 선 아님)·이미지·링크.
- 인라인: 굵게 600, 코드 `code.inline-bg` + `inline-text`, 링크 `text.link` 밑줄, 하이라이트 blush.
- 코드 블록 §8, 인용 왼쪽 4px `border.strong` + `body-lg` secondary, 체크 §16, 이미지 radius 12 + 캡션 `caption`.
- 플로팅 툴바(선택 시): 글래스 필, 아이콘 버튼 32, `shadow.ambient`, 위 8.
- 저장 상태 서브 헤더 우측 `caption` "저장됨 · 14:30" / "저장 중…" / danger "저장 실패 · 다시 시도". 자동 저장 2초 디바운스.
- 단축키: ⌘B/I/K, ⌘S(강제 저장), `/` 메뉴, Esc 메뉴 닫기. `contenteditable` + `role="textbox" aria-multiline`.

## 18. Tabs · Segmented
- 밑줄 탭(마이페이지·설정): 높이 44, 간격 24, `label-md`, 비활성 `text.secondary` → 활성 `text.primary`, 인디케이터 2px indigo(파랑 = 클릭 가능), 트랙 선 없음(면 차이). URL 연동. `role="tablist"`.
- 세그먼트(뷰 전환·정렬): 트랙 `zone-deep` 필 패딩 3, 항목 28 좌우 12 필 `label` 12/600, 활성 흰 면 + `text.primary` + `shadow.soft`. 2~4개.

## 19. Table (마이페이지 활동·설정 목록)
memoir 는 표가 드물다. 필요하면: 헤더 `label` tertiary 배경 zone 높이 40, 행 48 `body-sm`, 행 사이 **선 없이** 짝수 행 `zone`(zebra) 또는 hover 흰 면, 첫 열 좌 16. 숫자 우측. 모바일 카드 리스트로.

## 20. Progress · Spinner · Skeleton
스피너 16/20/32 2px 로즈 linear. 프로그레스 4(온보딩 단계·업로드) 트랙 zone-deep 채움 로즈 full. 스켈레톤 `zone-deep` radius 8 글자 0.75em, 카드 3장·행 5개 자리 그대로, shimmer 1.6s. 300ms 지연. 에디터는 플레이스홀더.

## 21. Avatar · Empty · Divider · Kbd
아바타 32 원형 폴백 blush + wine 첫 글자, 마이페이지 64. 빈 상태 07 §2(마스코트 120 또는 아이콘 48 + 크림 원 80). 구분선은 원칙적으로 없음 — 필요하면 32 여백. 문자 있는 구분("또는") `caption` tertiary 좌우 12 선 없이. Kbd `caption` mono, zone-deep, radius 4, 2/6.

## 22. Breadcrumb · Pagination · Load more
브레드크럼(서브 헤더): `body-sm`, chevron-right 16 tertiary, 항목 `text.secondary` 링크, 현재 `text.primary`, 4단계 넘으면 "…". 마지막 항목 클릭 → 폴더 드롭다운. 페이지네이션은 쓰지 않는다 — 리스트는 "더 보기" secondary sm(20개 단위) 또는 무한 스크롤 + 상단 "위로" FAB 보조.

## 23. Share view (`/share/[token]`)
로그인 없이 보는 읽기 전용 페이지. 헤더 대신 상단 바 60: 로고 + "memoir 에서 공유됨" `caption` + 우측 "memoir 시작하기" secondary sm. 본문 컨테이너 md, 카드 규격 그대로, 액션 버튼 없음. 만료·삭제된 링크: 빈 상태 "이 링크는 더 이상 유효하지 않아요".

## 24. 여기 없는 컴포넌트를 만들 때
1. 면부터: zone/default/raised 중 어디에 놓이는가. 선·그림자는 마지막 수단.
2. 높이 44 기본, 칩 28, 인라인 xs 28, CTA 52.
3. radius 8 컨트롤 / 12 카드 / 16 오버레이·벤토 / full 필.
4. 색: surface → text → action/chip/status. 파랑 = 클릭, 핑크 = 강조(+wine), 로즈 = 액션.
5. 글자 `typography.*` 하나. 메타는 `label`.
6. 상태 6종, 포커스 링 indigo, 키보드, aria, 44 터치.
7. 모션 진입 `out`, 퇴장 `in`, 면 전환 `fast`.
8. 이 문서와 `component.json` 에 등록, `docs/00` 표·`docs/16` 상황 갱신.
