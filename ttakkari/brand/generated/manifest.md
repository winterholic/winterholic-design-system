# Ttakkari generated brand assets

생성형 일러스트 탐색본과 통합 참고용 원본이다. 앱 코드에는 연결하지 않는다. 기존 `assets/brand/` 정본을 덮어쓰지 않는다.

## 캐릭터 정의와 선택

- **선택:** 짧고 둥근 귀가 있는 토끼형 빵 심부름꾼. 크림색 몸, 진한 잉크 외곽선, Blue 목도리, 크림·Mint 앞치마, 빵 봉지를 든다. 부지런히 눈치를 살피되 겁에 질리거나 피해를 당하는 연출은 없다.
- **선택 이유:** 귀와 빵 봉지로 작은 크기에서도 실루엣이 읽힌다. 목도리의 Blue는 사람의 지시와 닿고, Mint 앞치마는 에이전트 역할과 맞는다. 둥근 얼굴과 소심한 표정이 요청한 짠하고 귀여운 심부름꾼 인상에 가장 가깝다.
- **비교:** 한 장의 2×2 탐색 보드에 참새형, 둥근 떡형, 토끼형, 후드형을 배치했다. 탐색 보드와 선택 원본은 아래 목록에 포함된다.
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
