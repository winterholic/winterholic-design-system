# 10 · 아이콘·이미지 (notting)

## 1. 아이콘 라이브러리

**Lucide** 하나만 쓴다. 24px 그리드, 2px 아웃라인, MIT. 다른 세트를 섞지 않는다. 없는 아이콘은 같은 규격으로 그린다.

**이모지**는 페이지 아이콘·콜아웃 아이콘에서 사용자가 고르는 것만 허용한다. 시스템 UI 아이콘 자리에 이모지를 쓰지 않는다.

## 2. 크기

| 토큰 | px | 언제 | 짝 |
|---|---|---|---|
| `icon.xs` | 12 | 근거 칩 옆·상태 필 안·저장 상태·캡션 옆 | label-sm, caption |
| `icon.sm` | 16 | **트리 항목, 속성 행, 인라인 툴바, 브레드크럼, 코드 블록 헤더, 메뉴 항목, 근거 목록** | label-md, body-sm |
| `icon.md` | 20 | **기본**. md 컨트롤, 블록 핸들, 콜아웃, 슬래시 메뉴 타일 안, 배너, 커맨드 팔레트 항목 | label-md, body-md |
| `icon.lg` | 24 | 헤더(랜딩), lg 컨트롤 | label-lg |
| `icon.xl` | 32 | 빈 상태(작은), 드롭존 | heading-3 |
| `icon.2xl` | 48 | 빈 상태(기본), 온보딩 | heading-4 |

- 선 두께: 16 이하 `stroke-width: 2`, 32 이상 1.5, 12 는 2.5 허용.
- `currentColor`. 아이콘에 색을 직접 박지 않는다.

## 3. 색

| 상황 | 색 토큰 |
|---|---|
| 글자 옆 아이콘 | `currentColor` |
| 독립 아이콘 버튼(ghost) | `text.secondary`, hover `text.primary` |
| 블록 핸들 | `editor.handle-color` (tertiary) |
| 비활성 | `text.disabled` |
| 상태 아이콘 | `status.<s>.icon` |
| **AI 아이콘(sparkles)** | `ai.icon`. AI 가 만든 것 옆에만 |
| 워크플로 상태 아이콘 | `workflow.<s>.solid` |
| 우선순위 아이콘 | `priority.<p>` |
| 트리·탭 활성 | `selected-text` |
| 피처 아이콘(랜딩·빈 상태) | `text.brand` + 배경 원 `surface.brand-subtle` |

## 4. 아이콘 + 라벨

- 간격 `space.2`(8). xs·sm 컨트롤·트리 항목은 `space.1-5`(6).
- 아이콘 왼쪽. 오른쪽은 진행 방향(chevron-right, external-link)일 때만.
- 아이콘 전용 버튼: 정사각형, `aria-label`, 툴팁(단축키 있으면 kbd). 툴바에 3개 이상 나열되면 그룹 사이 구분선.
- 의미가 모호한 아이콘(설정 vs 필터 vs 더보기)은 라벨 없이 쓰지 않는다.

## 5. 자주 쓰는 매핑

### 공통
| 뜻 | Lucide |
|---|---|
| 닫기 / 더보기 / 추가 / 삭제 / 편집 | `x` / `ellipsis` / `plus` / `trash-2` / `pencil` |
| 검색 / 필터 / 정렬 / 설정 / 알림 | `search` / `sliders-horizontal` / `arrow-up-down` / `settings` / `bell` |
| 성공 / 경고 / 오류 / 정보 | `circle-check` / `triangle-alert` / `circle-x` / `info` |
| 외부 링크 / 복사 → 복사됨 / 로딩 | `external-link` / `copy` → `check` / `loader-circle` |
| 펼치기·접기 / 트리 | `chevron-down`·`chevron-up` / `chevron-right` |
| 뒤로 / 홈 / 사용자 / 캘린더 / 시간 | `arrow-left` / `house` / `user` / `calendar` / `clock` |
| 다크모드 | `sun` / `moon` |

### notting
| 뜻 | Lucide | 어디 |
|---|---|---|
| 페이지 | `file-text` | 트리·브레드크럼·검색 결과(아이콘 없을 때 기본) |
| 새 페이지 | `file-plus` | |
| 워크스페이스 | `layout-grid` 또는 워크스페이스 이모지 | 브레드크럼 첫 항목 |
| 사이드바 토글 | `panel-left` / `panel-left-close` | 툴바 |
| 우측 패널 토글 | `panel-right` | 툴바 |
| 블록 핸들 / 블록 추가 | `grip-vertical` / `plus` | gutter |
| 블록 타입: 문단·h1·h2·h3 | `pilcrow` · `heading-1` · `heading-2` · `heading-3` | 슬래시 메뉴 |
| 리스트·번호·할 일·토글 | `list` · `list-ordered` · `list-todo` · `chevron-right` | |
| 인용·콜아웃·코드·구분선 | `quote` · `message-square-warning` · `code` · `minus` | |
| 이미지·표·링크·멘션 | `image` · `table` · `link` · `at-sign` | |
| 서식 B / I / S / 코드 | `bold` / `italic` / `strikethrough` / `code` | 인라인 툴바 |
| **AI(물어보기·제안·요약)** | `sparkles` | AI 버튼·배지·콜아웃 ai·슬래시 AI 그룹 |
| 근거 / 근거 오래됨 | `quote` 12 / `history` | 근거 칩 툴팁 |
| 근거 부족 | `search-x` | 답변 카드 |
| 문서 충돌(답변) | `git-compare` | |
| Context Pack | `package` | 카드·버튼 |
| Markdown 가져오기 / 내보내기 | `download` / `upload` (방향 = 파일 기준) 또는 `file-input` / `file-output` | 툴바 ⋯ 메뉴 |
| 왕복 보고서 | `clipboard-check` | |
| 등급: lossless / normalized / degraded / dropped / opaque | `circle-check` / `equal` / `triangle-alert` / `circle-x` / `box` | 보고서 도트 옆 |
| revision / 비교 / 복원 | `history` / `git-compare` / `rotate-ccw` | 패널 |
| 충돌 / 병합 | `git-merge` | 저장 상태·배너 |
| 백링크 / 관계 제안 | `link-2` / `sparkles` + `link-2` | 패널 |
| 저장됨 / 저장 중 / 오프라인 / 실패 | `check` / `loader-circle` / `cloud-off` / `circle-x` | 저장 상태 |
| 읽기 전용 / 잠금 | `eye` / `lock` | 툴바 배너 |
| 이슈 | `circle-dot` | 트리·검색 유형 |
| 상태: backlog / todo / in-progress / review / done / canceled | `circle-dashed` / `circle` / `circle-dot-dashed`(반 채움 커스텀) / `eye` / `circle-check` / `circle-x` | 상태 필·보드 헤더 |
| 우선순위 urgent / high / medium / low / none | `signal-high` 계열(막대 4/3/2/1) + urgent 는 `triangle-alert` / `signal-zero` | 이슈 카드 |
| ADR | `scale` | 트리·검색 유형 |
| 결정 상태 proposed / accepted / deprecated / superseded / rejected | `circle-dashed` / `circle-check` / `triangle-alert` / `arrow-right-left` / `circle-x` | |
| GitHub / PR / 커밋 | `github` (brand) / `git-pull-request` / `git-commit-horizontal` | Context Pack 코드 링크 |
| 커맨드 팔레트 | `command` | 툴바 힌트 |
| 휴지통 / 복원 | `trash-2` / `archive-restore` | |
| 공유 / 권한 | `share-2` / `shield` | 툴바 |
| 표 뷰 / 보드 뷰 / 리스트 뷰 | `table-2` / `kanban` / `list` | 이슈 탭 |

`in-progress` 반 채움 원은 Lucide 에 정확히 없어 24 그리드에 직접 그린다(원 2px + 왼쪽 반 채움). `assets/brand/` 가 아니라 소비 프로젝트 아이콘 폴더에 둔다.

## 6. 로고

- 정본은 `assets/brand/`. `logo-mark.svg`, `logo-lockup.svg`, `logo-lockup-inverse.svg`, `logo-mark-mono.svg`.
- 워드마크 `notting` 은 Pretendard 700, 자간 -0.02em, 소문자.
- 심볼은 **잉크 페이지 위 verdigris 근거 마커**: 둥근 사각 타일(radius 22%) 안에 문서 줄 셋, 오른쪽에 세로 마커. "문서에 근거가 붙는다" 는 제품 문장.
- 최소 높이 24(툴바·헤더), 심볼 단독 20. 좌우 여백은 로고 높이의 1/2.
- 파비콘 `favicon.svg` 우선, PNG 16·32·48 폴백. 전체 규칙 14.

## 7. 이미지

| 항목 | 규칙 |
|---|---|
| 커버 | 높이 240/160, `object-fit: cover`, 위치 조정 가능(`object-position` 저장). 위 제목은 커버 아래에 있으므로 스크림은 커버 위 액션 버튼 가독용으로만 |
| 문서 안 이미지 | 최대 폭 100%(에디터 컬럼), radius 8, 캡션 아래 8. 원본 비율 유지, 리사이즈는 폭만 |
| 로딩 중 | `block-image.placeholder-bg` + 크기 지정(`aspect-ratio` 저장) |
| 실패 | `sunken` + `image-off` + "이미지를 불러오지 못했어요" caption + 원본 경로 `mono-label` |
| 포맷 | WebP/AVIF, 원본은 자산으로 보존(export 시 원본 그대로) |
| 다크 | 사진 그대로, 스크린샷 `brightness(0.9)` |
| 썸네일(검색·카드) | 16:9, radius 8 |

## 8. 일러스트 (빈 상태·온보딩)

- 색 3개 이내: `accent.verdigris` `accent.periwinkle` `teal.100`, 선 `teal.700` 1.5px.
- 크기: 빈 상태 160×120, 온보딩 240×180.
- 모티프: 문서(줄 셋)·마커·꺾쇠 `[ ]`. 사람·복잡한 장면 피한다.
- 없으면 아이콘 48 + 배경 원 80 으로 충분.
