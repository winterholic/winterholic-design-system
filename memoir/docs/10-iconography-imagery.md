# 10 · 아이콘·이미지·마스코트 (memoir)

## 1. 아이콘 라이브러리
**Lucide**(`lucide-react`) 하나. 24 그리드, 2px 선, MIT. 카테고리 이모지(☁️📅📝✍️💻⌨️🔗🎬🔐🙈)는 기획서의 정체성이라 **드롭다운·헤더 카테고리명·벤토 헤더에만** 유지하고, 나머지 UI 아이콘은 전부 Lucide. 이모지를 버튼·본문 문장·토스트에 넣지 않는다.

Lucide 에 없는 것은 같은 규격(24 그리드, 2px, round cap/join, 채움 없음)으로 직접 그린다.

## 2. 크기
| 토큰 | px | 언제 | 짝 |
|---|---|---|---|
| `icon.xs` | 12 | 외부 링크·태그 옆·인라인 오류 | caption, tag |
| `icon.sm` | 16 | 검색·칩 X·메뉴 항목·언어 배지 옆·서브 헤더 chevron | label, label-md |
| `icon.md` | 20 | **기본**. 버튼·카드 액션(★ ⋯ 복사)·자물쇠·인풋 접사·에디터 툴바 | label-md, body |
| `icon.lg` | 24 | FAB plus·헤더 액션·모달 닫기 | label-lg |
| `icon.xl` | 32 | 폴더 타일·빈 상태(작은)·영상 play | title |
| `icon.2xl` | 48 | 빈 상태(기본)·2FA shield·온보딩 | title-lg 이상 |

- 글자 옆 아이콘은 글자 × 1.25 근처(12 → 16, 16 → 20).
- 선 두께 16 이하 2, 32 이상 1.5.
- `currentColor`. 아이콘에 색을 직접 박지 않는다.

## 3. 색
| 상황 | 토큰 |
|---|---|
| 글자 옆 | 글자와 같은 색 |
| 독립 아이콘 버튼(ghost) | `text.tertiary` → hover `text.primary` |
| 헤더·에디터 툴바 아이콘 | `text.secondary` |
| 비활성 | `text.disabled` |
| 상태 | `status.<s>.icon` |
| 보안·자물쇠 | `status.secure.icon`(pink.600) |
| 즐겨찾기 ★ 켜짐 / 꺼짐 | `brand.pink` 채움 / `text.tertiary` 선 |
| 할일 체크 | 로즈(체크박스 규격) |
| 캘린더 이벤트 도트 | `brand.periwinkle` |
| 폴더 아이콘 | `text.brand`(로즈) 1.5px |
| 빈 상태 | `text.brand` + 크림 원 80 |
| 카테고리 드롭다운 원 | `category.<name>` 배경 + 이모지 |

## 4. 아이콘 + 라벨
- 간격 8(버튼·메뉴) / 6(칩·xs). 아이콘 왼쪽. 오른쪽은 chevron-down(드롭다운 트리거)·external-link 만.
- 아이콘 전용 버튼: 정사각형 + `aria-label` + 툴팁. 카드 헤더 ★·⋯ 두 개까지.
- 모호한 아이콘(설정 vs 필터)은 라벨 없이 쓰지 않는다. 확실한 것: plus, search, x, star, lock, copy, chevron.

## 5. 매핑
| 뜻 | Lucide |
|---|---|
| 새 메모 / 블록 추가 | `plus` 24 / 16 |
| 검색 | `search` |
| 카테고리 열기 / 브레드크럼 구분 | `chevron-down` / `chevron-right` |
| 더보기 | `ellipsis` |
| 즐겨찾기 | `star` |
| 복사 / 복사됨 | `copy` → `check` |
| 잠금 / 해제 / 2FA | `lock` / `lock-open` / `shield-check` |
| 폴더 / 열린 폴더 / 새 폴더 | `folder` / `folder-open` / `folder-plus` |
| 태그 | `hash` |
| 링크 / 외부 | `link` / `external-link` |
| 영상 재생 | `play` (썸네일 위 원형 배경 ink 60%) |
| 코드 / 명령어 | `code-2` / `terminal` |
| 캘린더 / 오늘 / 이전·다음 달 | `calendar` / `calendar-check` / `chevron-left` `chevron-right` |
| 할일 | `square` / `square-check` |
| 편집 / 삭제 / 되돌리기 / 복구 | `pencil` / `trash-2` / `undo-2` / `archive-restore` |
| 저장됨 / 저장 중 / 실패 | `cloud-check` / `loader-circle`(회전) / `cloud-off` |
| 공유 | `share-2` |
| 드래그 손잡이 | `grip-vertical` |
| 이미지 / 인용 / 구분선 / 체크리스트 / 글머리 / 번호 (슬래시 메뉴) | `image` / `quote` / `minus` / `list-checks` / `list` / `list-ordered` |
| 굵게 / 기울임 / 코드 / 링크 (툴바) | `bold` / `italic` / `code` / `link` |
| 설정 / 계정 / 로그아웃 / 알림 | `settings` / `user` / `log-out` / `bell` |
| 다크모드 | `sun` / `moon` |
| 닫기 / 뒤로 / 위로 | `x` / `arrow-left` / `arrow-up` |
| 정렬 / 뷰 전환 | `arrow-up-down` / `layout-grid` `list` |
| 성공 / 경고 / 오류 / 안내 / 오프라인 | `circle-check` / `triangle-alert` / `circle-x` / `info` / `wifi-off` |
| 휴지통 / 내보내기 / 가져오기 | `trash` / `download` / `upload` |
| 검색 없음 / 빈 폴더 | `search-x` / `folder-open` |

## 6. 로고
14 참조. 심볼 icon.svg(핑크 꽃잎) 24 + 워드마크 `memoir` Jakarta 800, `m` 로즈. 헤더 24, 파비콘 16, 앱 아이콘 512. 그라데이션 텍스트·세리프 금지.

## 7. 마스코트
`assets/brand/mascot.png`(기존 `public/mascot.png`). 빈 상태 120·404 160·온보딩·랜딩 200. 흰 배경 PNG 라 크림·다크 위에서는 흰 원형 카드(radius full, `surface.default`) 안에. 앱 헤더·카드·버튼·토스트에는 안 쓴다. 말풍선 없음. 투명 배경 버전 제작은 14 보완 목록.

## 8. 이미지
| 항목 | 규칙 |
|---|---|
| 북마크 OG | 96×64 radius 8 cover, 실패 zone-deep + 파비콘 16(`https://www.google.com/s2/favicons?domain=` 류 또는 자체 fetch) |
| 영상 썸네일 | 16:9 radius 16, 로딩 zone-deep, 위 제목 scrim-bottom, hover play 32 |
| 에디터 이미지 블록 | 최대 prose 폭, radius 12, 캡션 `caption` tertiary 가운데, 클릭 → 라이트박스(스크림 + 원본) |
| 아바타 | 32/64 원형, 폴백 blush + wine 첫 글자 |
| QR(2FA) | 흰 카드 200×200 패딩 16, 다크에서도 흰 유지 |
| 로딩 | next/image, `loading="lazy"`, 크기 지정, 플레이스홀더 zone-deep |
| 다크 | 스크린샷 `brightness(0.9)`, 사진 그대로 |
| 포맷 | WebP/AVIF, 2x |

## 9. 일러스트 (빈 상태·온보딩·랜딩)
빈 상태는 마스코트 또는 아이콘 48 + 크림 원 80 으로 충분. 따로 그리면 색 3개(`cream` `blush` `pink.200`) + 선 로즈 1.5px, 종이·연필·서랍·메모 모티프. 금고·자물쇠·방패 이미지로 보안을 과장하지 않는다(shield 아이콘 48 까지만). 크기 빈 상태 160×120, 온보딩 240×180.
