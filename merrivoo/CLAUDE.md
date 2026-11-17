# merrivoo — AI 에이전트 규칙

Merrivoo UI·장면을 만들거나 고칠 때 따른다. 먼저 `dist/design-system.config.json`(기계 판독 요약)과 `docs/00-decision-guide.md` 를 읽는다.

## 반드시
- 색·간격·글자·radius·그림자·시간·z-index 는 **토큰만**(`var(--mv-…)`). 색은 시맨틱(`color.surface|text|border|action|status|interactive|scene`)만.
- 글자는 typography 클래스 중 하나(`.mv-display-*`, `.mv-question`, `.mv-body-*`, `.mv-label-*` …). 한글은 `keep-all`.
- 컴포넌트는 상태(default·hover·pressed·focus-visible·disabled·loading·selected)를 구현. hover 는 `@media (hover:hover)` 안에서만.
- 터치 대상 44px 이상, 인접 8px 이상. 로딩·빈·오류 상태를 화면과 함께 만든다.
- 장면은 `composeScene` 결과(순수 데이터)를 렌더러가 그린다. 좌표·배치를 화면 코드에서 다시 계산하지 않는다.
- 장식 위치는 `placeOrnaments` 한 곳에서만 정한다(점수 → 자리). 용량을 넘으면 `overflow` 로 돌려받아 UI 로 알린다.
- 새 에셋은 manifest(`schema/*.schema.json`)와 함께, `validateCatalog` 통과 후에만 카탈로그에 넣는다.
- reduced-motion 이면 연출을 정지 상태로.

## 하지 않는다
- hex, 임의 px, `z-index: 999`, `transition: all`, `!important`(base.css 예외 외), 컴포넌트 안 `dark:` 분기.
- 선택 상태를 색만으로 표시, 카드 안 카드(질문 패널 안에 선택 카드 넣기), 주 버튼 두 개 나란히.
- 세계관 테마로 글자·버튼·상태 색 바꾸기(`color.scene.*`, `border.gold` 만 허용).
- 캔버스에서 `ctx.filter`(사파리·인앱 브라우저). 색 보정은 multiply 오버레이.
- 이 저장소에 서비스 콘텐츠·상용 일러스트·비밀 정보·라이선스 불명 에셋을 넣기. 서비스 파일을 경로로 참조하기.

## 토큰을 고칠 때
`tokens/src/*.json` 만 편집 → `node tokens/build.mjs`(참조·라이트/다크 불일치·대비·CSS lint·레지스트리 검증) → `docs/00` 갱신 → `CHANGELOG.md`. `palette.json`·`dist/` 는 생성물.

## 완료 전 확인
```bash
npm test                        # 빌드 + 엔진 15 + 정적 검사
grep -rnE "#[0-9a-fA-F]{3,8}\b" components/ | wc -l    # 0
```
결과 줄을 응답에 붙인다.
