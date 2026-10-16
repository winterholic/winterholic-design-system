# Ttakkari generated brand assets

생성형 일러스트 탐색본과 통합 참고용 원본이다. 앱 코드에는 연결하지 않는다. 기존 `assets/brand/` 정본을 덮어쓰지 않는다.

## 캐릭터 정의와 선택

- **사용자 결정(2026-10-17): 토끼형 빵 심부름꾼을 확정했다.** 앱 로고·아이콘도 마스코트로 간다. 짧고 둥근 귀가 있는 캐릭터다. 크림색 몸, 진한 잉크 외곽선, Blue 목도리, 크림·Mint 앞치마, 빵 봉지를 든다. 부지런히 눈치를 살피되 겁에 질리거나 피해를 당하는 연출은 없다.
- **선택 이유:** 귀와 빵 봉지로 작은 크기에서도 실루엣이 읽힌다. 목도리의 Blue는 사람의 지시와 닿고, Mint 앞치마는 에이전트 역할과 맞는다. 둥근 얼굴과 소심한 표정이 요청한 짠하고 귀여운 심부름꾼 인상에 가장 가깝다.
- **비교·보존:** 한 장의 2×2 탐색 보드에 참새형, 둥근 떡형, 토끼형, 후드형을 배치했다. 토끼형이 사용자 결정으로 확정됐다. 나머지 3종은 `characters/` 에 각각 기준 원본으로 보존하며 용도는 미정이다.
- **일관성:** 상태·온보딩 컷은 선택 원본을 이미지 참조로 사용했다. 얼굴 방향·표정·팔 위치와 소품에 따라 눈·몸 비율이 조금씩 달라지는 컷이 있다. 동일한 벡터 마스터를 변형한 수준의 픽셀 단위 일관성은 아니다. 도메인 빈 상태 컷은 캐릭터 대신 해당 기능의 소품만 쓴다.
- **색:** 디자인 시스템 시드의 Paper `#F4F4ED`, Ink `#080705`, Blue `#296EB4`, Mint `#00F0B5`를 지향한다. Mint는 에이전트 표식, amber는 승인 대기, muted red는 오류를 나타낸다. 생성 모델의 페인트 면 색은 지정한 hex와 픽셀 단위로 일치한다고 보증하지 않는다.
- **텍스트:** 생성 프롬프트에 글자·숫자·UI를 배제했다. 아이콘의 check 및 상태 소품은 의미를 위한 단순 도형이다.

## 생성 자산

| 파일 | 크기 | 용도 | 프롬프트 요약 |
|---|---:|---|---|
| `concepts/mascot-exploration-4-directions.png` | 1254×1254 | 캐릭터 시안 4종 비교 | 2×2 참새·떡·토끼·후드형 빵 심부름꾼 |
| `mascot/rabbit-identity-master-1254.png` | 1254×1254 | 선택 캐릭터 기준 원본, 투명 배경 | 탐색 보드의 좌하단 토끼형을 단독 전신으로 정리 |
| `icons/app-icon-light-1024.png` | 1024×1024 | 라이트 PWA 아이콘 | Paper 바탕, 중앙 안전영역 안 전신 캐릭터; 1254 생성본 축소 |
| `icons/app-icon-dark-1024.png` | 1024×1024 | 다크 PWA 아이콘 | Ink 바탕, 중앙 안전영역 안 전신 캐릭터; 1254 생성본 축소 |
| `icons/favicon-simple-transparent.png` | 1254×1254 | 단순 파비콘 기준 원본, 투명 배경 | 토끼 얼굴·귀·작은 빵만 남긴 고대비 형태 |
| `icons/favicon-32.png` | 32×32 | 파비콘 | 단순 파비콘 원본 축소 |
| `icons/favicon-16.png` | 16×16 | 파비콘 | 단순 파비콘 원본 축소 |
| `icons/splash-paper-portrait.png` | 1024×1536 | 세로 스플래시 | Paper 바탕, 여백을 둔 전신 캐릭터 |
| `states/state-empty.png` | 1254×1254 | 기본 빈 상태, 투명 | 빈 트레이와 작은 새싹, 호기심 있는 표정 |
| `states/state-working.png` | 1254×1254 | 작업 중, 투명 | 작은 책상과 노트북에서 집중해 일함 |
| `states/state-complete.png` | 1254×1254 | 완료, 투명 | 완성 묶음과 기하학 체크, 안도한 표정 |
| `states/state-error.png` | 1254×1254 | 오류, 투명 | 넘어간 상자를 살피고 고치려는 모습, muted red 표식 |
| `states/state-approval-wait.png` | 1254×1254 | 권한 승인 대기, 투명 | amber 카드 옆에서 공손히 기다림 |
| `states/state-offline.png` | 1254×1254 | 오프라인, 투명 | 끊긴 케이블과 간격이 있는 muted slate 구름 |
| `states/state-usage-limit.png` | 1254×1254 | 사용량 한도, 투명 | 숫자 없는 거의 찬 게이지를 살핌 |
| `onboarding/onboarding-01-intro.png` | 1254×1254 | 온보딩 1: 소개, 투명 | 휴대폰·노트북 옆에서 인사 |
| `onboarding/onboarding-02-task.png` | 1254×1254 | 온보딩 2: 작업 전달, 투명 | 빈 작업 카드를 트레이에 넣음 |
| `onboarding/onboarding-03-result.png` | 1254×1254 | 온보딩 3: 결과 받기, 투명 | 폴더와 파일 타일을 휴대폰에 전달 |
| `domain-empty/empty-github-project.png` | 1254×1254 | 코드/GitHub 대용 빈 상태, 투명 | 저장소 폴더와 분기 노드 |
| `domain-empty/empty-work-visualization.png` | 1254×1254 | 작업 시각화 빈 상태, 투명 | 빈 보드 카드와 흐름 노드 |
| `domain-empty/empty-notebook-library.png` | 1254×1254 | NotebookLM류 빈 상태, 투명 | 빈 노트와 연결된 자료 카드 |
| `domain-empty/empty-ml-research.png` | 1254×1254 | ML·LLM 연구 빈 상태, 투명 | 노드 네트워크·칩·돋보기 |
| `domain-empty/empty-blog.png` | 1254×1254 | 블로그 빈 상태, 투명 | 빈 종이·클립보드·펜 |
| `domain-empty/empty-harness-visualization.png` | 1254×1254 | 하네스 시각화 빈 상태, 투명 | 프롬프트 카드·도구 상자·체크포인트 연결 |
| `domain-empty/empty-stock-analysis.png` | 1254×1254 | 주식 분석 빈 상태, 투명 | 숫자 없는 막대 차트와 돋보기 |
| `domain-empty/empty-game-creation.png` | 1254×1254 | 게임 제작 빈 상태, 투명 | 게임패드와 픽셀 블록 |
| `domain-empty/empty-remote-control.png` | 1254×1254 | 원격 조종 빈 상태, 투명 | 휴대폰과 모니터를 잇는 연결 경로 |
| `concepts/contact-sheet.png` | 1196×1432 | 전체 미리보기, 26개 컷 | 원본 이미지들을 Paper 면에 축소 배열, 글자 없음 |

## 생성 및 확인

- 실제 사용 도구: 이 세션의 `image_gen.imagegen` 이미지 생성기. 모든 자산은 별도 장면 프롬프트로 생성했고, 캐릭터 상태·온보딩은 `rabbit-identity-master-1254.png`를 참조 이미지로 사용했다.
- 이미지 생성기는 1254×1254 결과를 반환했다. PWA 아이콘은 1024×1024로 축소했고, favicon은 32×32·16×16 파생본을 만들었다. 스플래시는 생성기가 1024×1536으로 반환했다.
- 앱 아이콘 프롬프트는 캐릭터를 중앙 68% 안전영역에 두도록 지정했다. 실제 OS 마스크 프리뷰 검증은 하지 않았다.
- 미리보기에서 26개 컷을 확인했다. 캐릭터의 얼굴·귀·목도리·앞치마는 대체로 유지되지만 개별 생성 특성상 일부 컷은 표정과 몸 비율이 조금 다르다.

## 2026-10-17 사용자 확정 및 추가 자산

사용자가 토끼 마스코트를 확정했다. 앱 로고·아이콘도 마스코트를 쓴다. 탐색 보드의 나머지 캐릭터 3종은 버리지 않고 `characters/<name>/` 아래에 보존했다(용도 미정). 아래 추가 컷은 `docs/23-illustration-assets.md` §4.5의 장면·우선순위를 그대로 따른다.

### 명세의 누락 컷 10종 — 명세 우선순위 순

모두 rabbit identity master를 참조해 생성한 1254×1254 RGBA 투명 PNG다.

| 순위 | 파일 | 장면(명세 요약) |
|---|---|---|
| 상 | `states/state-not-found.png` | 빈 봉지를 들고 갈림길을 살핀다(404·지워진 세션) |
| 상 | `states/state-no-results.png` | 돋보기로 빈 트레이를 본다(검색 0건) |
| 상 | `states/state-forbidden.png` | 잠긴 문 앞에서 공손히 기다린다(권한 없음) |
| 중 | `states/state-session-expired.png` | 재인증 열쇠를 찾는다 |
| 중 | `states/state-update-available.png` | 새 봉지를 가져온다(PWA 업데이트) |
| 중 | `states/state-unsupported-preview.png` | 낯선 상자를 들고 갸웃한다 |
| 중 | `states/state-link-expired.png` | 끊어진 줄을 든다(공유 링크 만료) |
| 중 | `states/state-vpn-required.png` | VPN 밖에서 휴대폰과 모니터 사이 끊긴 길을 본다 |
| 하 | `states/state-notifications-empty.png` | 알림 없는 상태에서 조용히 쉰다 |
| 하 | `states/state-diff-clean.png` | PR 변경 없는 상태를 정돈된 한 묶음으로 나타낸다 |

### 작은 크기 전용 아이콘

단독 얼굴과 짧은 귀, 굵은 Ink 외곽선, 전체를 채우는 Ttakkari Blue 색면 타일을 사용한다. 1254 원본에서 1024 master를 만든 뒤 크기별로 축소했다.

| 파일 | 크기 | 용도 |
|---|---:|---|
| `icons/icon-mascot-source-1254.png` | 1254×1254 | 생성 원본 |
| `icons/icon-mascot-16.png` | 16×16 | 파비콘·작은 표시 |
| `icons/icon-mascot-32.png` | 32×32 | 파비콘 |
| `icons/icon-mascot-48.png` | 48×48 | 고해상도 파비콘 |
| `icons/icon-mascot-180.png` | 180×180 | Apple touch icon |
| `icons/icon-mascot-192.png` | 192×192 | PWA 아이콘 |
| `icons/icon-mascot-512.png` | 512×512 | PWA 아이콘 |
| `icons/icon-mascot-1024.png` | 1024×1024 | 마스터 아이콘 |
| `icons/icon-mascot-maskable-192.png` | 192×192 | Android maskable |
| `icons/icon-mascot-maskable-512.png` | 512×512 | Android maskable |
| `icons/icon-mascot-maskable-1024.png` | 1024×1024 | 안전영역 기준 마스터 |

마스크 대응을 위해 얼굴·귀를 중앙 약 70% 안에 두고 배경 타일은 네 변까지 채웠다. maskable 파일은 같은 안전영역 작품을 각 크기로 내보낸 것이다. OS별 마스크 합성 프리뷰는 별도로 실행하지 않았다.

**실제 크기 판정:** 16×16 파일 자체를 열어 확인했을 때, 눈·코 세부는 작지만 두 귀와 얼굴 윤곽이 남아 토끼 머리로 읽힌다. 32×32에서는 얼굴·귀·눈·코가 분리되어 더 분명하다. 예전 전신형 파비콘보다 이 단순화 버전이 작은 크기에 적합하다고 판단한다.

### 보존 캐릭터 — 용도 미정

모두 정면 전신, 투명 RGBA PNG 기준 원본이다. 기존 시안의 특징을 살린 별도 참조 이미지다.

| 폴더·파일 | 크기 | 보존한 특징 | 용도 |
|---|---:|---|---|
| `characters/bird/character-master-front.png` | 1254×1254 | 참새형, 갈색 깃털, 앞치마와 빵 봉지 | 보존, 용도 미정 |
| `characters/riceball/character-master-front.png` | 1254×1254 | 둥근 떡형, 파란 목도리와 빵 봉지 | 보존, 용도 미정 |
| `characters/hooded/character-master-front.png` | 1254×1254 | 민트 후드, 크림 앞치마와 빵 봉지 | 보존, 용도 미정 |

### 이번 실행 contact sheet

| `concepts/contact-sheet-followup.png` | 1196×1196 | 이번 실행의 미리보기, 23개 이미지 | 글자 없이 축소 배열, 16·32px 타일은 확대하지 않음 |

`concepts/contact-sheet-followup.png`는 추가 상태 컷 10종, 보존 캐릭터 3종, 새 아이콘 각 크기와 maskable 파생본 등 23개 이미지를 무문자 축소 배열한 미리보기다. 16·32px 실제 크기는 별도로 판정했으며 contact sheet에서는 픽셀 크기를 확대하지 않았다.
