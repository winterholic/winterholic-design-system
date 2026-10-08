# 13 · 아이콘·이미지 (Ttakkari)

## 1. 아이콘: Lucide

[Lucide](https://lucide.dev)(ISC) 하나만 쓴다. React 는 `lucide-react`. 선 아이콘, `stroke-width: 1.75`, 끝·이음 둥글게. `.tk-icon` 이 `currentColor` 라 색은 부모 글자색이 정한다. lucide-react 를 쓰면 `<Icon className="tk-icon" strokeWidth={1.75} aria-hidden />`.

| 크기 | 토큰 | 쓰는 곳 |
|---|---|---|
| 12 | `size.icon.xs` | 배지·정책 배지·보존 안 |
| 16 | `size.icon.sm` | sm·xs 컨트롤·실행 단계·정책 판정·목록 메타·칩 |
| 20 | `size.icon.md` | md·lg 컨트롤·콜아웃·사이드바 내비. **기본** |
| 24 | `size.icon.lg` | 탭바·헤더 로고 |
| 32 | `size.icon.xl` | 빈 상태·미리보기 상태 패널 |

장식 아이콘은 `aria-hidden="true"`. 글자 없는 버튼은 `aria-label`.

## 2. 의미 고정 매핑

같은 의미에 다른 아이콘을 쓰지 않는다. 새 의미가 생기면 이 표에 먼저 추가한다. 예제 스프라이트(`examples/icons.js`)의 이름은 왼쪽 열, Lucide 정식 이름은 오른쪽 열.

| 의미 | 스프라이트 | Lucide |
|---|---|---|
| 채팅 · 작업 공간 · 보관함 · 파일 찾기 | `chat` · `workspace` · `library` · `folder-search` | `message-square` · `panel-right` · `archive` · `folder-search` |
| 새 세션 | `new-chat` | `square-pen` |
| 보내기 · 멈추기 · 첨부 | `send` · `stop` · `paperclip` | `arrow-up` · `square` · `paperclip` |
| 복사 / 복사됨 | `copy` / `check` | `copy` / `check` |
| 원본 다운로드 · 보내기(반출) · 메일 · 외부 링크 | `download` · `share` · `mail` · `external-link` | `download` · `send` · `mail` · `external-link` |
| 다시 시도·다시 변환 · 고정 · 삭제 | `retry` · `pin` · `trash` | `refresh-cw` · `pin` · `trash-2` |
| 찾기 · 필터 · 정렬 | `search` · `filter` · `sort` | `search` · `sliders-horizontal` · `arrow-up-down` |
| 확대 · 축소 · 폭 맞춤 · 전체 화면 · 줄 바꿈 · 따라가기 | `zoom-in` · `zoom-out` · `fit` · `expand` · `wrap` · `follow` | `zoom-in` · `zoom-out` · `move-horizontal` · `maximize` · `wrap-text` · `arrow-down` |
| 작업: 대기 · 실행 중 · 승인 대기 · 완료 · 실패 · 취소됨 | `clock` · (live 점·스피너) · `hand` · `check`/`circle-check` · `circle-x` · `ban` | `clock` · — · `hand` · `check`/`circle-check` · `circle-x` · `ban` |
| 정책: 허용 · 승인 필요 · 차단 · 민감·별도 정책 | `shield` · `shield-alert` · `ban` · `lock` | `shield-check` · `shield-alert` · `ban` · `lock` |
| 재인증·패스키 · 이 기기 | `key` · `smartphone` | `key-round` · `smartphone` |
| 파일 계열 | `file-text` · `file-pdf` · `presentation` · `sheet` · `image` · `file-code` · `globe` · `file-archive` | `file-text` · `file-text` · `presentation` · `file-spreadsheet` · `image` · `file-code` · `globe` · `file-archive` |
| 폴더 · 열린 폴더 · Mac Studio(디스크) · 터미널·로그 | `folder` · `folder-open` · `hard-drive` · `terminal` | 같음 |
| 오프라인 · 기록 · 보기 | `wifi-off` · `history` · `eye` | 같음 |
| Note / Tip / Important / Warning / Caution | `info` / `tip` / `important` / `warning` / `caution` | `info` / `lightbulb` / `bell` / `triangle-alert` / `octagon-alert` |
| 테마 | 라이트일 때 `moon`(다크로), 다크일 때 `sun` | 같음 |
| 메뉴 · 닫기 · 뒤로 · 더보기 | `menu` · `x` · `back` · `more`·`more-vertical` | `menu` · `x` · `arrow-left` · `ellipsis`·`ellipsis-vertical` |

에이전트를 반짝이(sparkles) 아이콘으로 표시하지 않는다. 에이전트는 '따' 아바타와 민트 점이 말한다.

## 3. 이미지

- 결과물 이미지는 원본 그대로 뷰어 Stage 에(체커 바탕). 목록에서는 썸네일이 글리프를 대신한다(`.tk-glyph > img`, `alt=""`, 이름이 옆에 있다).
- 사진·스크린샷 radius 12, 테두리 `border.default`.
- 앱 안에 장식 일러스트를 두지 않는다. 빈 상태는 아이콘 32 또는 에이전트 아바타(lg).
- 로그인·설치 안내만 브랜드 히어로와 점 격자를 쓴다(16).

## 4. 로고

16 브랜드 자산.
