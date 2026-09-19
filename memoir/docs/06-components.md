# 06 · 컴포넌트 규격 (memoir)

공통 상태 6종 `default` `hover` `active` `focus-visible` `disabled` `loading`, 입력류 `error` `readonly`. 기존 `components/ui`·`components/layout` 와의 대응을 적었다. 값은 `component.*` 토큰.

---

## 1. Button (기존 `Button.tsx`)
| size | 높이 | 좌우 | 글자 | 언제 |
|---|---|---|---|---|
| `xs` | 28 | 8 | caption | 카드 안 인라인(복사·편집) |
| `sm` | 36 | 12 | label-md | 서브 헤더·카드 헤더·모달 보조 |
| `md` | 44 | 20 | label-md | **기본** |
| `lg` | 52 | 24 | label-lg | 로그인·2FA·온보딩 |

- radius 8. 헤더 `+ New` 와 랜딩 CTA 만 필(`radius-pill`). 그림자 없음(design-guide).
- variant: `primary` 로즈 · `secondary` paper-deep + 로즈 글자 · `ghost` 투명 · `interactive` 페리윙클(활성 메뉴 전용, 일반 버튼 아님) · `danger` red · `danger-ghost`.
- 상태: hover 한 단계 진하게, active `scale(0.98)`, focus 링 2px indigo, disabled paper-deep + neutral.400 + 이유 툴팁, loading 스피너 16 + 폭 유지.
- 화면당 primary 1개. 모달 안 primary 는 그 모달의 1개.

## 2. FAB
56 원형, 로즈, 흰 `plus` 24, `shadow.ambient`, 우하단 24(모바일 16, 바텀시트 위에서는 숨김). hover scale 1.04. 카테고리별 "새 메모"의 주 진입. 헤더 New 버튼과 둘 다 있을 때 모바일은 FAB 만.

## 3. Input · Textarea (기존 `Input.tsx`)
두 형태만. 상자 테두리형은 없다.

| 형태 | 기본 | 포커스 | 오류 | 언제 |
|---|---|---|---|---|
| `underline` | 투명 배경, 밑줄 1px `border.strong` | 배경 → 흰 면, 밑줄 2px indigo | 밑줄 red | 폼·제목·메모 속성(에디토리얼) |
| `filled` | `surface.zone-deep`, radius 8 | 배경 → 흰 면 + `shadow.focus` | 밑줄 red 2px | 검색·필터·모달 안 |

- 높이 44 (lg 52), 좌우 12, 글자 body 16.
- 라벨 `label`(대문자 자간) `text.tertiary`, 위 8. 도움말 `caption` 아래 6. 필드 사이 24.
- 플레이스홀더 `text.placeholder`. 예시만.
- Textarea 최소 3줄, `resize: none`(에디터 대신 쓰지 않는다).

## 4. Search bar (기존 `SearchBar.tsx`)
헤더 중앙. 필 44, `surface.zone-deep`, 왼쪽 search 16 `text.tertiary`, 플레이스홀더 "Search snippets…" 는 카테고리에 따라 바뀐다("코드 검색"). 포커스 흰 면 + `shadow.focus`. 최대 폭 400, 모바일은 아이콘 버튼 → 전폭 오버레이. `⌘K` 힌트 `caption` 우측(데스크톱).

## 5. PIN / 2FA
6칸 × 52, 간격 8, radius 8, `surface.zone-deep`, 채워지면 흰 면, 현재 칸 밑줄 2px indigo, 글자 `pin` 24 mono. 오류: 전체 shake + 칸 밑줄 red + 아래 `caption` `text.danger` "코드가 맞지 않아요 (2/5)". 자동 포커스 이동, 붙여넣기 지원, `inputmode="numeric"`, `autocomplete="one-time-code"`. 성공 시 `lock` 600ms 로 보안 구역 진입.

## 6. Chip (기존 `Chip.tsx`) · Tag · Lang badge
| 종류 | 규격 | 색 |
|---|---|---|
| 필터 칩(서브 헤더) | 28 높이(터치 36), 좌우 12, 필, `label` 12/600 대문자 | 기본 paper-deep + neutral.700 · hover cream · 활성 pink + wine · ALL ink + paper |
| #태그 | 24, 좌우 8, 필, `tag` 12/500 | blush + ink |
| 언어·플랫폼 배지 | 22, 좌우 8, radius 4, `label` | zone-deep + secondary. 언어별 옅은 색 허용(JS amber.100, Java blue.100, Python green.100 등 50~100 단계만) |
| 카운트 배지 | 20, 필, caption | zone-deep |

칩 사이 8. 서브 헤더에서 넘치면 가로 스크롤 + `fade-right`. 다중 선택 필터는 활성 여러 개, 단일(정렬)은 하나.

## 7. Card — 메모 카드 공통
- `zone` 위 흰 면, 테두리·그림자 없음, radius 12, 패딩 24, 카드 사이 24.
- 헤더: [언어/카테고리 배지] [제목 `title` 20] 우측 [⋯ ghost xs]. 헤더↔본문 16.
- 본문: 카테고리별(§8). 본문↔메타 16.
- 메타 줄: 왼쪽 #태그들(간격 6), 오른쪽 날짜 `label` `text.tertiary` `OCT 24, 2023`.
- 클릭 가능한 카드만 hover `shadow.soft`. 카드 안 버튼(복사·⋯)은 `stopPropagation`.
- 미리보기 카드(대시보드 벤토 안): 패딩 12, radius 8, 배경 `zone`.

## 8. 카테고리별 본문
| 카테고리 | 컴포넌트 | 규격 |
|---|---|---|
| 💻 코드 | `code-block` | 배경 #1A1A1A, radius 12, 패딩 20, `code` 14 mono, 줄 번호 40 `code.gutter`. 접힘 240 + 하단 페이드 + "더 보기". 툴바 36: 언어 라벨 왼쪽, 복사(ghost xs, 흰 아이콘) 오른쪽. 하이라이트 색 `code.keyword/string/number/function/comment` |
| ⌨️ 명령어 | `command-row` | 행 52, 흰 면, radius 8, 행 사이 8. [플랫폼 배지 22] [명령어 `command` mono, 배경 `code.inline-bg` 패딩 4/8 radius 4] [설명 `body-sm` secondary 1줄] [복사 xs]. hover zone-deep. 모바일: 명령어 위·설명 아래 2줄 |
| 🔗 북마크 | `bookmark-card` | 가로 96 높이, [OG 이미지 96×64 radius 8 \| 제목 `title-sm` 1줄 / 도메인 `label` tertiary / 설명 `body-sm` 1줄] [태그]. 이미지 실패 시 zone-deep + 파비콘 16. 외부 링크 아이콘 12 제목 뒤. 3열(xl)·2열(md)·1열 |
| 🎬 영상 | `video-card` | 16:9 썸네일 radius 16, 우하단 길이 배지(ink 80% + paper 글자 caption), 아래 제목 `title-sm` 2줄, 채널 `caption`. 3열·2열·1열. hover 썸네일 위 play 아이콘 + scrim |
| ✍️ 단순 메모 | card | 본문 `body` 최대 6줄 clamp, 더 길면 "…". 제목 없어도 됨(첫 줄이 제목) |
| 📝 일반 메모 | 에디터(§13) | 카드 없음. 즉시 진입 풀 페이지 |
| 🔐 보안 | `secure-row` | 행 72, 왼쪽 4px 핑크 띠, [자물쇠 20 \| 제목 `title-sm` \| 미리보기 `body-sm` 블러 8 + 50%] [남은 시간 `label` secure.text]. 잠금 해제되면 블러 걷힘·자물쇠 열림. 세션 만료 카운트다운은 서브 헤더에 |
| 🙈 프라이빗 | `folder` | 타일 160, radius 16, cream, hover blush, 폴더 아이콘 32 + 이름 `title-sm` + 개수 `caption`. 안에서는 단순 메모 카드 + 태그 |
| 📅 캘린더 | `calendar` | §10 |
| ☁️ 대시보드 | `bento` | §11 |

## 9. Header · Sub header · Category dropdown (기존 `MainHeader` `SubHeader` `CategoryDropdown`)
- 메인 헤더 60, sticky, 좌우 24. [로고 24 `.mm-logo`] [카테고리 트리거 `label-lg` + chevron, 현재 카테고리명, hover zone] [검색 필 400] [New pill primary 44] [아바타 32]. 스크롤 시 글래스.
- 서브 헤더 44, sticky top 60, 배경 canvas(헤더와 면 차이). 내용은 카테고리별(03 §3 표). 좌우 24. 서브 헤더 아래 첫 콘텐츠 32.
- 카테고리 드롭다운: 폭 280, 글래스 `raised` + blur 20, radius 16, `shadow.ambient`, 패딩 8. 항목 44, radius 8, [카테고리 색 원 28(`category.<name>`) + 이모지] [이름 `label-md`] [개수 `caption` 우측]. 활성 항목 `action.interactive`(페리윙클 + 흰 글자). hover zone. 키보드 ↑↓ Enter Esc. 10개 전부 한 번에 보인다(스크롤 없음).

## 10. Calendar
- 그리드 7열, 셀 최소 96(모바일 48), 패딩 8, 선 `border.default` 1px(선이 정보인 예외). 요일 헤더 `label` tertiary, 주말 `weekend-text`.
- 오늘: 날짜 숫자 원형 28 로즈 채움 + 흰 글자. 선택: 셀 `today-bg` + 링 2px indigo. 이벤트: 도트 6 페리윙클(최대 3 + "+N"), 데스크톱은 도트 대신 1줄 칩.
- 우측 패널 320(`slide` 진입): 날짜 headline + 할일 체크리스트 + 메모. 모바일은 바텀시트.
- 서브 헤더: ‹ 월 › + "오늘" ghost sm.

## 11. Bento (대시보드)
글래스 40% + blur 24, radius 16, 패딩 24, 최소 높이 240, 제목 `title` + 우측 "전체 보기 →" link. 오늘 할일(전폭): 체크박스 20 + `body`, 완료 시 취소선 + tertiary. 코드·명령어·북마크 3열: 각 미리보기 카드 3개(패딩 12, zone). 즐겨찾기 ★ pink.400 채움.

## 12. Modal · WideModal · PromptModal (기존)
| | Modal / Prompt | WideModal |
|---|---|---|
| 폭 | 480 | 960 |
| 면 | 글래스 80% + blur 20, radius 16, `shadow.modal` | 같음 |
| 패딩 | 32 (모바일 20) | 32 |
| 제목 | `title-lg` 24 | `headline` 28 |
| 푸터 | 우측, gap 12, 주 버튼 오른쪽 | 하단 고정 바(글래스) |
| 모바일 | 바텀시트(상단 radius 16, 손잡이 36×4) | 풀스크린 |
- 스크림 ink 40%, 포커스 트랩, Esc, 배경 스크롤 잠금. 폼이 더러워지면 이탈 확인.
- Prompt: 제목 + 인풋 1개(underline) + 취소/확인. 첫 포커스 인풋.
- 위험 확인: 제목 질문형, 버튼 동작 이름("삭제"), `danger`, 첫 포커스 취소.

## 13. Editor (일반 메모, 노션형 블록)
- 풀 페이지, `zone` 배경, 본문 prose 680 흰 면 없이(캔버스에 바로 씀 — 종이 위에 쓰는 느낌). lg 이상 좌 10% 우 5%.
- 제목 `headline` 28 placeholder "제목 없음", 본문 `editor` 16/1.8.
- 블록 hover 왼쪽 ⋮⋮ 손잡이 + `+` (ghost xs, `text.tertiary`), 블록 사이 8.
- 슬래시 메뉴: 드롭다운 규격(§9 글래스), 항목 아이콘 20 + 이름 + 단축키.
- 인라인 코드 `code.inline-bg` + `inline-text`, 코드 블록 §8, 인용 왼쪽 4px `border.strong`, 체크리스트 §11.
- 저장 상태 서브 헤더 우측 `caption` "저장됨 · 14:30" / "저장 중…". 자동 저장, 버튼 없음.
- 툴바(선택 시 플로팅): 글래스 필, 아이콘 버튼 32, `shadow.ambient`.

## 14. Tooltip · Toast · Dropdown menu · Checkbox · Skeleton · Avatar
- 툴팁 ink + paper 글자, caption, 6/8, radius 6. 아이콘 버튼 필수.
- 토스트 ink 면, radius 12, `shadow.ambient`, 우하단(모바일 하단 중앙), 3초. "삭제됨 · 되돌리기".
- ⋯ 메뉴: 글래스, radius 12, 항목 36, 파괴 항목 `text.danger`.
- 체크박스 20, radius 4, 테두리 neutral.500, 체크 로즈. 할일 완료 취소선.
- 스켈레톤 zone-deep, radius 8, 카드 3장 자리 그대로.
- 아바타 32 원형, 폴백 blush + wine 첫 글자.

## 15. 여기 없는 컴포넌트를 만들 때
1. 면부터: 어느 층(zone/default/raised)에 놓이는가. 선·그림자는 마지막 수단.
2. 높이 44 기본, 칩 28, CTA 52.
3. radius 8 컨트롤 / 12 카드 / 16 오버레이 / full 필.
4. 색: surface → text → action/chip/status. 파랑은 클릭 가능한 것만, 핑크는 강조만, 로즈는 액션.
5. 글자는 `typography.*` 하나. 메타는 `label`.
6. 상태 6종, 포커스 링 indigo, 44 터치.
7. 이 문서와 `component.json` 에 등록.
