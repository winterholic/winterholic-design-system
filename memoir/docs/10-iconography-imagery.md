# 10 · 아이콘·이미지·마스코트 (memoir)

## 1. 아이콘
**Lucide** 하나. 24 그리드 2px. 카테고리 이모지(☁️📅📝✍️💻⌨️🔗🎬🔐🙈)는 기획서의 정체성이라 **드롭다운·헤더 카테고리명 옆에만** 유지하고, 나머지 UI 아이콘은 Lucide.

크기: `xs` 12 (외부 링크·태그 옆) · `sm` 16 (검색·칩·메뉴) · `md` 20 (버튼·카드 액션·자물쇠) · `lg` 24 (FAB plus·헤더) · `xl` 32 (폴더·빈 상태 작은) · `2xl` 48 (빈 상태).

색: 글자와 같은 `currentColor`. 독립 아이콘 버튼 `text.tertiary` → hover `text.primary`. 즐겨찾기 ★ 켜짐 `brand.pink` 채움. 잠금 자물쇠 `status.secure.icon`.

| 뜻 | Lucide |
|---|---|
| 새 메모 | `plus` (FAB·New) |
| 검색 | `search` |
| 카테고리 열기 | `chevron-down` |
| 더보기 | `ellipsis` |
| 즐겨찾기 | `star` |
| 복사 / 복사됨 | `copy` → `check` |
| 잠금 / 해제 | `lock` / `lock-open` |
| 2FA | `shield-check` |
| 폴더 | `folder` / `folder-open` |
| 태그 | `hash` |
| 링크 / 외부 | `link` / `external-link` |
| 영상 | `play` (썸네일 위). 브랜드 아이콘은 파비콘으로 |
| 코드 / 명령어 | `code-2` / `terminal` |
| 캘린더 / 오늘 | `calendar` / `calendar-check` |
| 할일 | `square` / `square-check` |
| 편집 / 삭제 / 되돌리기 | `pencil` / `trash-2` / `undo-2` |
| 저장됨 | `cloud-check` |
| 설정·계정·로그아웃 | `settings` / `user` / `log-out` |
| 드래그 손잡이 | `grip-vertical` |
| 에디터 블록 추가 | `plus` 16 |
| 다크모드 | `sun` / `moon` |
| 닫기 / 뒤로 | `x` / `arrow-left` |

## 2. 로고
14 참조. 워드마크 `memoir`, `m` 로즈 + `emoir` ink, Jakarta 800.

## 3. 마스코트
`assets/brand/mascot.png` (기존 `public/mascot.png`). 빈 상태·온보딩·404·랜딩에만. 크기 120~200. 앱 헤더·카드에는 안 쓴다. 흰 배경 PNG 라 다크·크림 위에서는 원형 마스크 또는 `surface.default` 카드 안에.

## 4. 이미지
| 항목 | 규칙 |
|---|---|
| 북마크 OG | 96×64 radius 8, `object-fit: cover`, 실패 시 zone-deep + 파비콘 16 |
| 영상 썸네일 | 16:9 radius 16, 로딩 zone-deep, 위 제목은 scrim-bottom |
| 에디터 이미지 블록 | 최대 prose 폭, radius 12, 캡션 `caption` tertiary 가운데 |
| 아바타 | 32 원형, 폴백 blush + wine |
| 로딩 | `loading="lazy"`, 크기 지정, next/image |
| 다크 | 스크린샷은 다크 버전 없으면 `brightness(0.9)`, 사진은 그대로 |

## 5. 일러스트
빈 상태는 마스코트 또는 아이콘 48 + 크림 원 80. 따로 그리면 색 3개(`cream` `blush` `pink.200`) + 선 `rose` 1.5px, 종이·연필·메모 모티프. 금고·자물쇠 이미지로 보안을 과장하지 않는다.
