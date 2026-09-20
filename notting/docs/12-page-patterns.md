# 12 · 페이지 패턴 — 자주 만드는 화면의 정답 골격 (notting)

컴포넌트를 조립하는 순서와 값을 화면 유형별로 적었다. 새 화면은 여기서 가장 가까운 것을 복사해 시작한다. 값은 03·06 의 토큰.

## 1. 앱 셸

```
[사이드바 260 canvas]  [페이지 툴바 48 canvas ────────────────────]  [패널 320 canvas]
  워크스페이스 전환(heading-6 + chevron)   ☰ · 브레드크럼 · 저장 상태 · 공유 · ✦ Ask · 패널 · ⋯
  검색 (sm 인풋, ⌘K kbd)
  overline 즐겨찾기 / 워크스페이스 / 개인
  트리 (06 §21)
  ─ 하단: 설정 · 휴지통 · 가져오기
                       [에디터 컬럼 760 default, 가운데]              [탭: Ask·속성·백링크·revision]
```
- lg 미만: 사이드바 드로어. xl 미만: 패널 드로어. 모바일: 패널 바텀시트, 툴바에 제목만.
- 페이지 전환 시 에디터만 바뀌고 사이드바·패널은 유지(스크롤 위치 포함).

## 2. 페이지(문서) 편집

```
툴바 48
[커버 240 (선택)]
에디터 컬럼 760, 상단 여백 80(커버 있으면 32)
  [아이콘 80]  (아래 16)
  prose-title "제목 없음" placeholder
  속성 그룹 (선택, 접힘 가능): 라벨 140 · 값, 행 32  (위아래 border.subtle)  (아래 24)
  블록 …  (사이 4)
  [마지막 블록 아래 128 클릭 영역]
```
- 새 페이지: 제목에 포커스, 속성 접힘, 첫 블록 placeholder.
- 근거로 열림: 해당 블록으로 스크롤 + 마커 + flash. 툴바 아래 "Ask 답변의 근거 [2] · 돌아가기" 배너(ghost).
- 과거 revision: 툴바 배너 "읽기 전용 · revision a1b2c3 · 2026.09.18 14:30 · 이 버전으로 복원".
- 충돌: 저장 상태 `conflict` + 배너 → §9 비교.
- 모바일: gutter 숨김, 툴바 제목만, 속성은 "속성 N개" 접힘 버튼.

## 3. Ask (패널 또는 전체 화면)

```
패널 320 (또는 lg 이하 드로어, 전체 화면 모드 컨테이너 md 768)
  세그먼트: 이 페이지 · 워크스페이스
  [스크롤 영역]
    overline "나" + body-md 질문
    AI 답변 카드 (06 §26) …
    (반복, 최신이 아래)
  하단 고정: 인풋 lg 멀티라인 + ai 버튼 "물어보기" (전송 후 "중지")
```
- 첫 진입 빈 상태: sparkles 32 + "이 페이지(워크스페이스)에 대해 물어보세요" + 예시 질문 칩 3개(ghost sm) — "왜 JSONB 로 저장하기로 했지?" 같은 실제 질문 형태.
- 답변마다 근거가 없으면 중립 카드. 충돌이면 conflict 카드. 절대 근거 없는 AI 면을 만들지 않는다.
- 답변 액션: 복사(Markdown) · 페이지에 삽입(ai 콜아웃 블록으로, AI 배지 유지) · 👍👎.

## 4. Markdown 가져오기

```
모달 md 560
  heading-2 "Markdown 가져오기"  (아래 8)
  body-sm secondary "폴더·ZIP 은 페이지 계층과 이미지를 그대로 가져와요"  (아래 24)
  드롭존 200 (06 §33)  (아래 16)
  옵션: 가져올 위치(페이지 셀렉트) · 같은 bundle 이 이미 있으면 → 라디오 3개(기본값 없음)
  푸터: 취소 · 가져오기(primary, 파일 없으면 비활성 + 이유)
진행: 드롭존 자리에 progress 8 + "12 / 40 파일" + 현재 파일명 mono-label
완료: 손실 0 → 토스트 + 모달 닫힘 · 손실 있음 → 모달이 lg 로 커지며 보고서(06 §28)
```

## 5. Markdown 내보내기

```
모달 md 560
  heading-2 "내보내기"
  세그먼트: 이 페이지 · 하위 포함 · 워크스페이스 전체
  라디오: Plain Markdown(다른 도구용) · Notting bundle(.md + assets + .notting, 완전 복원)
  Plain 선택 시 미리 계산된 안내 배너(warning): "callout 2 · toggle 1 이 대체 표현으로 나가요 · 보고서 보기"
  체크: 이미지 포함 · frontmatter 포함
  푸터: 취소 · 내보내기(primary)
```
- 손실이 있으면 primary 클릭 시 확인 다이얼로그(07 §4 손실 감수). 없으면 바로.
- "Copy as Markdown" 은 모달 없이 툴바 ⋯ 또는 블록 메뉴에서 즉시 + 복사됨 피드백. 손실 블록이 있으면 토스트 "복사됨 · 2개 블록은 대체 표현".

## 6. 검색 결과

```
커맨드 팔레트(⌘K)에서 시작. Enter 로 전체 화면:
컨테이너 lg 1024
  인풋 lg 전폭 + 우측 필터 chip(유형: 문서·이슈·ADR / 기간 / 작성자)  (아래 16)
  caption "결과 24개 · 0.3초"  (아래 16)
  결과 항목 (06 §30) 세로, 사이 4
  페이지네이션
  우측(xl 이상) 320: "이 검색으로 물어보기" ai 카드 + 최근 검색
```
- 0건: 07 §2 + ai 버튼.
- 평가 모드(설정): 항목 우측에 점수, 상단에 방식 세그먼트(full-text · vector · hybrid) — 같은 질문을 세 방식으로 비교.

## 7. 이슈 목록 · 보드 (Phase 2)

```
컨테이너 xl 1280
  heading-1 "이슈" + 우측 primary md "+ 새 이슈"  (아래 24)
  밑줄 탭: 목록 · 보드  (아래 16)
  툴바 32: 검색 sm 280 · 상태 chip · 담당자 chip · 우선순위 chip · 우측 정렬 세그먼트
  [목록] 표 compact 36: 우선순위 16 | NT-123 mono-label | 제목 label-md | 상태 필 sm | 담당자 xs | 갱신 caption
  [보드] 가로 스크롤, 컬럼 6개(상태 순) 280, 카드(06 §31)
  행/카드 클릭 → 우측 드로어 480: 제목(편집 가능 heading-3) · 속성 그룹 · 설명(.nt-doc 에디터) · 관련 문서 · Context Pack 만들기(ai)
```
- Backlog·Canceled 컬럼은 기본 접힘(폭 48 세로 라벨).
- 문서에서 이슈 만들기: 블록 선택 → 인라인 툴바 ⋯ "이슈로 만들기" → 드로어에 본문 미리 채움 + 원문 블록 링크.

## 8. ADR (Phase 2)

```
일반 페이지 + 속성 그룹이 고정: 상태(decision pill) · 결정일 · 대체(superseded by 관계) · 관련 이슈
본문 템플릿 블록: h2 맥락 / h2 결정 / h2 대안 / h2 결과
```
- 문서에서 ADR 추출 제안: 문서 안 "결정" "~하기로 했다" 패턴 감지 → 블록 옆 sparkles 힌트(ghost xs, 조용히) → 클릭 → "ADR 로 추출" 미리보기(ai 콜아웃) → 확정 시 새 ADR 페이지 + 원문에 멘션.

## 9. revision 비교 · 충돌 해결

```
모달 lg 800 (또는 전체 화면)
  헤더: revision A 셀렉트 sm · ⇄ · revision B 셀렉트 sm · caption "변경 12곳" · ← → 
  본문: 블록 diff (06 §29), 변경 없는 구간은 접힘("변경 없음 8블록" 클릭 펼침)
  충돌: 구간마다 액션 줄 32 "서버 유지 · 내 것 유지 · 둘 다"
  푸터: 미해결 Count 배지 · 취소 · "병합 저장"(primary, 미해결 0 일 때 활성) / 비교만이면 "이 버전으로 복원"(secondary)
```

## 10. Context Pack 미리보기

```
모달 lg 800 또는 패널
  Context Pack 카드 (06 §27) 전폭
  탭: 항목 · 프롬프트 미리보기 · JSON
  푸터: "revision 고정" 안내 caption · 복사(secondary) · CLI 명령 복사(secondary, kbd 스타일) · 닫기
```

## 11. 설정

```
컨테이너 lg
  heading-1 "설정"  (아래 24)
  좌 세로 탭 200: 워크스페이스 · 멤버 · 가져오기/내보내기 기록 · 검색·AI · 연동(GitHub) · 위험 구역
  우 섹션 카드 lg 패딩 24, 사이 24
    행: label-md + caption / 우측 컨트롤(switch·select sm)
  검색·AI: 모델·평가 모드 스위치·"근거 없으면 답하지 않기"(기본 켬, 끄면 warning 안내)
  가져오기/내보내기 기록: 표(시각 · 방향 · 파일 수 · 등급 요약 4개 숫자 · 보고서 보기)
  위험 구역: 마지막, 카드 테두리 status.danger.border, 버튼 danger secondary 형태
```

## 12. 온보딩

- 단계 3개: 워크스페이스 이름 → 가져오기(건너뛰기 가능) → 첫 페이지. 상단 프로그레스 4px.
- 한 화면 한 질문, 컨테이너 sm, 제목 heading-2, 컨트롤 lg.
- 가져오기 단계는 §4 드롭존 그대로. 손실 보고서도 그대로 — 온보딩이라고 숨기지 않는다.
- 끝나면 첫 페이지가 열리고 툴바 ✦ Ask 에 툴팁 한 번 "문서에 대해 물어볼 수 있어요".

## 13. 로그인

```
canvas 배경, lg 이상 좌 50% gradient.brand 패널(제목은 어두운 시작점 쪽) + 우 50% 폼
  컨테이너 sm → 폼 폭 400
  로고 28 (아래 32)
  heading-2 "로그인" (아래 8) · body-sm secondary (아래 32)
  필드 lg: 이메일 / 비밀번호(eye) 간격 16
  primary lg 전폭 (위 24) · 구분선 "또는" (상하 24) · secondary lg GitHub 로 계속하기
  caption "계정이 없나요? 가입하기" (위 32)
```

## 14. 랜딩

```
헤더 64 (스크롤 시 blur) — 로고 · 내비 label-md · 우측 secondary "로그인" + primary "시작하기"
히어로 (상하 80 / 128), 컨테이너 lg, 가운데
  overline text.brand "Notion for humans, Markdown for tools, context for agents"
  display-lg 2줄 이내 · body-lg secondary · 버튼 primary xl + ghost xl
  목업 (위 64) radius 2xl shadow xl — 에디터 + Ask 패널이 보이는 장면
섹션 (64 / 96), 번갈아 canvas / gradient.paper
  세 계약(편집·소유권·근거)을 피처 3열: 아이콘 배경 원 48 brand-subtle + heading-4 + body-sm
  코드 중심 섹션: gradient.ink 배경 + 코드 블록(CLI pull/push · MCP get_context)
CTA gradient.brand: display-md white + secondary 형태 버튼
푸터 gradient.ink
```

## 15. 오류 페이지 (404 · 500 · 403)

```
canvas, 세로 가운데, 컨테이너 sm
  display-sm text.brand "404" (아래 16)
  heading-2 "페이지를 찾을 수 없어요" (아래 8)
  body-md secondary "옮겨졌거나 휴지통에 있을 수 있어요" (아래 32)
  primary md "홈으로" + ghost "휴지통 보기"
  caption tertiary 오류 ID mono-label (500 일 때, 위 32)
```
