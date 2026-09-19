# 12 · 페이지 패턴 (여행가쟈)

원본 `references/page-blueprints.md`(v4.1 초안 기준) + 실제 라우트(`src/app`: `/` `/pull` `/ar` `/result` `/course` `/dex` `/dex/detail` `/my` `/share` `/onboarding` `/auth` `/rooms` `/info` `/guide` `/legal` `/offline` `/walking-courses`). 모든 화면은 `AppShell` 로 감싼다(03 §3).

## 1. 홈 `/` — "오늘 어디로 가실래요?"
```
[띠 6] [헤더 52: 로고 md 28 · PullCounter 7/10]
eyebrow rank "TODAY'S CAPSULE" (Cinzel, brand)      ← 아래 4
heading 22 "오늘 어디로 가실래요?" + 단청 밑줄 3px    ← 아래 16
Capsule lg 160 가운데, appCapsuleFloat, EffectStage(등급 미정이면 legend 데모 옵션)   ← 가용 40%
body 태그라인 + brush "캡슐 굴려요" 1곳              ← 아래 24
인기 리스트: ListItem 56 × 3~5 또는 카드 가로 스크롤(200 카드 xs)
[GachaCta 52 고정] [TabBar 홈 활성]
```
홈 앰비언트(`HomeAmbient`)는 한지 텍스처 위 옅은 민화 요소만, 글로우 금지.

## 2. Quick Pull `/pull` — 딸깍 모드 (무대)
`tone="dark"` `hideNav`. 3막: 결정(큰 red lg "굴리기" + 햅틱) → 여정(Capsule xl 220, motion 등급별, 배경 vignette, "두근두근— 뭐가 나올까요") → 공개(capArrive → 카드 flip → BannerRank). 첫 뽑기 스킵 불가, 이후 우상단 "건너뛰기" ghost sm. 실패 시 한지 복귀 + 다이얼로그(횟수 보존).

## 3. AR Throw `/ar` — 다트 모드
카메라 뷰(전폭, 무대 톤) + 상단 안내 body(hanji.bright) + 하단 "직접 던지기" ghost fallback. 던지기 감지 → 남한 지도(한지 카드 안, 착지점 도장) → 주변 후보 시트(ListItem) → 공개(§2 3막). 카메라·모델 실패 시 fallback 유지. `DartOnboarding` 첫 진입 3장.

## 4. 결과 `/result`
무대 → 한지 복귀. 카드 200 가운데(`shadow.paper`) → RarityBadge + heading-xl 지역명 + brush 인용 + visitorNote → 동행자 아바타 → BottomCta Double: "까치 보내기"(blue) / "추천 여행 경로 보기"(red). 로그인 시 서버 도감 반영. 등급은 장식적·비위계적(모서리 프레임·띠).

## 5. 코스 `/course` · `/walking-courses`
헤더 "보령 하루 코스". 상단 OSM iframe 미리보기(16:9, ink 2px 래퍼) → ListItem 타임라인(num = 시각 mono `10:00`, icon, title, meta 거리·시간) cpFadeIn 순차 → 장소별 "네이버 지도 ↗" / "카카오맵 ↗" ghost sm → BottomCta "코스 저장"(red). 빈: "이 캡슐엔 아직 코스가 없어요".

## 6. 도감 `/dex` — "수집의 도파민"
```
헤더 "도감" · 우측 정렬 아이콘
Tabs 4: 뽑은 카드 · 도감 · 세트 · 인증 완료
meter: 막대 8 + 보유/전체 mono + 다음 한 걸음 + 통계 4
3열 그리드 DexCell 108, gap 8 (세트 탭: setcard 리스트 — 남은 장수 우선 정렬)
FloatingFinder 56 우하단(세트 탭 제외) → 필터 시트(검색 paper-bar · 계절 · 권역 · 등급 칩)
정렬: 지도 / 방문순 / 계절 / 동행자 (등급순 없음)
```
데이터 소스: 로그인 → `/dex/me`, 비로그인+로컬 → localStorage, 없음 → 공개 갤러리. Legendary 셀 foil 펄스. 빈 셀 = CardShell 일러스트 자리.

## 7. 도감 상세 `/dex/detail`
카드 확대(폭 min(280, 100% − 32), 뒤집기 가능) → 지역 정보(body) → 좌표 있으면 "다녀왔어요 도장" red(로컬 인증) → "추천 코스" blue. 등급 한국어명 heading-sm. 사진 출처.

## 8. 마이 `/my` · `/my/activity`
```
ProfileAvatar 56 + heading-sm 닉네임 + 계정 상태 배지(연결됨 jade 테두리 / 로컬 hanji-2)
통계 카드 4(발견 수·코스·인증·최근) mono 17/700 + ui-sm 라벨
메뉴 ListItem: 최근 장소 · 방 · 확률 안내 · 설정 · 법적 고지
최근 장소(user-settings recentPlaces) 카드 가로 스크롤
활동: 날짜별 ListItem 타임라인
```

## 9. 공유 `/share?contentId=` — 까치 보내기
비로그인 열람. 셸(hideNav) + 상단 로고 + 카드 200 + 지역명 + "같이 굴려볼까요" body + BottomCta "나도 굴려보기"(red). 만료: 빈 상태. 공유 복사 토스트 "까치가 날아갔어요".

## 10. 온보딩 `/onboarding`
hideNav, 3~4장 가로 슬라이드(가챠 → 실제 방문 → 도감), 각 장 캡슐 md 120 + heading-xl + body, 도트 인디케이터(빨강/hanji.deep), 하단 "다음" red lg + "건너뛰기" ghost. 마지막 장 첫 뽑기 풀버전(무대). 진입 즉시 바텀시트 금지.

## 11. 계정 `/auth`
panel 520. 로고 lg 40 → heading "계정을 연결해요" → body "어디서든 도감을 볼 수 있어요" → 소셜 버튼 lg(각 provider ghost, 아이콘 22) 세로 gap 8 → caption 법적 링크. 오류는 인라인 danger. 다크패턴 금지: "나중에" ghost 항상.

## 12. 방(멀티) `/rooms`
방 목록 ListItem(num 인원 mono, title 방 이름, meta 방장·상태 칩) → "방 만들기" red. 방 안: 참가자 아바타 스택 + 각자 캡슐 xs 정지 + "같이 굴리기" red lg + 나가기 ghost(다이얼로그). 실시간 상태 `aria-live="polite"` 한 곳.

## 13. 안내·확률 `/info` `/guide`
doc 720(모바일 셸 안). heading-sm 히어로 "등급은 여행지의 점수가 아니에요" → 등급 표(11 §7) → 산식 콜아웃(한지 카드 + 파랑 띠) → FAQ `<details>`. 행간 loose.

## 14. 법적 `/legal` · 이미지 출처
doc 720, ui 14 Pretendard(법적 문서는 Batang 아님), ink-2 이상, heading-sm 섹션, 표 hanji-2 헤더. ImageCredit 규약.

## 15. 오프라인 `/offline` · 오류
빈 상태 형식: 캡슐 sm + heading-sm "앗, 길을 잃었어요"(404) / "오프라인이에요"(offline) + body + red "홈으로" + ghost "이전". 500 은 mono 오류 ID. 오프라인은 로컬 도감 링크.

## 16. 시트·다이얼로그 공통
장소 시트(`PlaceSheet`): 손잡이 → 사진 16:9 → heading-sm 이름 + 칩(권역·계절) → body 설명 → 거리 mono → BottomCta "코스에 담기"(red) / "지도 열기"(blue). 필터 시트: 검색 paper-bar → 칩 그룹(계절·권역·등급) → "적용" red / "초기화" ghost.
