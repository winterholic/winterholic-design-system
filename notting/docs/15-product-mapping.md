# 15 · 제품 매핑 — 기획서의 개념이 화면에서 무엇이 되는가 (notting)

읽은 것: `C:\notting\docs\initial-plan.md` (Draft v0.1, 2026-09-20). 기획서의 개념·계약·수용 기준을 하나씩 UI 규격에 연결했다. 기획서가 바뀌면 이 문서가 먼저 낡는다 — 기획서 §번호를 같이 적어 두었으니 diff 로 맞춘다.

## 1. 세 계약 → 세 가지 시각 언어

| 계약(기획 §1) | 시각 언어 | 어디서 보이나 |
|---|---|---|
| **편집 계약** — 빠르고 익숙한 블록 에디터 | 종이 위 잉크. 흰 에디터, 촘촘한 블록(4px), 핸들은 hover 에만, 모션 최소 | 06 §17~19, 05 |
| **소유권 계약** — Markdown 왕복, 손실을 숨기지 않음 | 등급 5색 + 도트 + 숫자. 손실은 코럴, 항상 보고서 | 06 §28, 07 §4, `fidelity.*` |
| **근거 계약** — 답변·Pack 은 출처와 시점을 추적 | periwinkle = AI. 근거 칩 [n], stale 표시, revision 해시 | 06 §26~27, `ai.*` `citation.*` |

## 2. 도메인 모델 (기획 §8.1) → UI 표현

| 개념 | 화면 | 아이콘 | 색 | 규격 |
|---|---|---|---|---|
| Workspace | 사이드바 상단 전환 메뉴, 브레드크럼 첫 항목 | 워크스페이스 이모지 또는 `layout-grid` | 없음 | 12 §1 |
| Page | 트리 항목, 에디터 페이지, 검색 결과 항목, 멘션 | 페이지 아이콘(사용자 지정) 또는 `file-text` | 없음 | 06 §17·21·30 |
| Document / Block | 에디터 블록. 사용자는 "Document" 를 보지 않는다 | 블록 타입 아이콘 | 없음 | 06 §17 |
| Revision | 패널 revision 탭 타임라인, 저장 상태, 읽기 전용 배너, 비교 모달 | `history` | 현재 = `border.brand` 마커, 해시 `mono-label` | 06 §32, 12 §9 |
| Link / backlink | 문서 안 멘션·링크, 패널 백링크 탭 | `link-2` | 링크 `text.link` + 밑줄 | 06 §17·32 |
| Asset | 이미지 블록, 가져오기 보고서의 자산 행 | `image` | 실패 시 `sunken` + `image-off` | 06 §17, 10 §7 |
| Chunk | 사용자에게 안 보인다. 근거 칩이 chunk 를 가리킨다 | — | — | 06 §26 |
| RelationSuggestion | 패널 백링크 탭 "제안된 관계" 섹션, AI 배지, 연결/무시 | `sparkles` + `link-2` | `ai.*`. 확정 시 배지 제거 | 06 §32 |
| Issue | 이슈 목록·보드·드로어, 트리(이슈 컬렉션), 멘션 | `circle-dot` | 상태 `workflow.*`, 우선순위 `priority.*` | 06 §31, 12 §7 |
| ADR | 페이지 + 고정 속성, 상태 배지 | `scale` | `decision.*` | 12 §8 |
| ContextPack | 카드(상단 context 그라데이션 바), 미리보기 모달, CLI 복사 | `package` | 상단 바 `gradient.context`, 이유 `text.ai` | 06 §27, 12 §10 |

## 3. AI 와 근거 (기획 §3.1 원칙 3, §9.4, §6.3)

### 무엇을 AI 색으로 칠하나
| 대상 | AI 색 | 이유 |
|---|---|---|
| Ask 답변 카드 면·라벨·아이콘 | `ai.bg` `ai.text` `ai.icon` | AI 가 만든 텍스트 |
| 답변 **본문 글자** | `text.primary` (AI 색 아님) | 읽어야 하는 글. 면과 라벨이 이미 출처를 말한다 |
| 근거 칩 [n] | `citation.*` | AI 가 붙인 참조. 눌러야 하므로 hover 있음 |
| Context Pack 의 "선택 이유" | `text.ai` | AI 가 고른 근거 |
| Context Pack 항목 제목 | `text.primary` | 사람이 쓴 문서 |
| 관계 제안 | AI 배지 + `ai.*` | 확정 전. 확정하면 사람 것이 된다 → 색 제거 |
| 슬래시 메뉴 AI 그룹, ⋯ 메뉴 AI 항목 | 타일 `ai.bg`, 글자 `text.ai` + sparkles | AI 를 부르는 명령 |
| AI 버튼 | `action.ai.*` | 사용자가 AI 에게 시키는 행동 |
| 답변을 페이지에 삽입한 블록 | `callout--ai` + AI 배지 | 문서 안에서도 출처 유지. 배지는 사용자가 편집하면 "편집됨" 으로 바뀌고 색은 유지 |
| 문서 안 사용자 링크·버튼·태그 | **periwinkle 금지** | 01 §4 규칙 3 |

### 근거 규칙 (수용 기준 §6.3)
| 기준 | UI |
|---|---|
| 답변에 페이지·섹션 citation | 문장 끝 칩 [n] + 카드 하단 근거 목록(번호 · 아이콘 · 제목 · 섹션 경로 · 수정 시각) |
| 충돌하는 문서 | `conflict-bg` 카드, 두 근거 나란히, 각 수정 시각 강조, "어느 쪽이 맞나요?" → 선택 시 다른 쪽에 "오래됨" 태그 제안 |
| 근거 없음 | **중립 면** 카드 "근거를 찾지 못했어요" + 검색어 제안 + "일반 지식으로 답하기"(secondary, 명시적 선택) |
| 삭제·수정된 근거(§9.4) | 칩 `stale`(amber) + 툴팁 "revision a1b2c3 기준 · 현재 문서와 다를 수 있어요". 클릭하면 그 revision 을 읽기 전용으로 연다 |
| 권한 밖 문서(§9.4) | 아예 근거에 안 나온다. UI 에 "숨겨진 근거 N개" 같은 힌트도 금지(존재 노출) |
| 문서 안 명령을 지시로 승격 금지(§9.4) | 답변 카드에 "문서의 지시를 따르지 않았어요" 같은 배너 없음 — 조용히 데이터로 취급. 대신 설정 › 검색·AI 에 정책 설명 |

### Ask 의 두 범위(§5.2)
세그먼트 "이 페이지 · 워크스페이스". 답변 카드 헤더에 범위 표시("AI 답변 · 이 페이지"). 범위를 바꾸면 새 대화가 아니라 다음 질문부터 적용, 카드 헤더로 구분.

## 4. Markdown 왕복 (기획 §7, §6.1~6.2)

### lossless 의 세 정의(§7.1) → 등급
| 기획 | 등급 토큰 | 색 | 아이콘 | 보고서 그룹 |
|---|---|---|---|---|
| Semantic round-trip 통과 | `fidelity.lossless` | 초록 | `circle-check` | 기본 접힘 |
| 공백·마커·heading style 정규화(§7.1 첫 문단) | `fidelity.normalized` | 중립 | `equal` | 펼침 |
| 고유 블록 → plain Markdown 대체 표현(§7.1 3) | `fidelity.degraded` | 앰버 | `triangle-alert` | 펼침 |
| 표현 불가·사이드카에만 남음·파일 못 읽음 | `fidelity.dropped` | 코럴 | `circle-x` | 펼침, 맨 위 |
| 알 수 없는 블록 보존(§8.2 opaque node) | `fidelity.opaque` | periwinkle | `box` | 펼침 |

### 수용 기준 → UI
| 기준 | UI |
|---|---|
| 계층·링크·자산 보존(§6.1) | 가져온 뒤 트리에 같은 계층, 상대 링크는 멘션으로, 이미지 블록. 보고서 요약 타일에 "페이지 40 · 링크 88 · 자산 12" |
| 미지원 문법을 report 에 파일·위치·처리 방식 표시 | 보고서 행: `mono-label` 경로:줄 + 처리 문구 + [원문 보기] |
| 같은 bundle 재가져오기 → 새 문서/업데이트/충돌 명시 선택 | 가져오기 모달 라디오 3개, **기본값 없음**. 골라야 버튼 활성 |
| plain export 전 예상 손실과 대체 표현 미리 보여주기(§6.2) | 내보내기 모달 warning 배너 + 확인 다이얼로그(07 §4) |
| full bundle 은 복원 가능 | bundle 선택 시 배너 없음, "완전 복원" 라벨 |
| 충돌 정책(§7.4) 자동 덮어쓰기 금지 | 저장 상태 `conflict` + 비교 화면. 닫아도 로컬은 초안으로 보존 |
| 경고·충돌·누락 자산 영구 기록 | 설정 › 가져오기/내보내기 기록 표 |

### Copy as Markdown / Paste Markdown(§5.2)
- 복사: 즉시 + 복사됨 피드백. 손실 블록이 있으면 토스트에 개수.
- 붙여넣기: Markdown 감지 시 블록으로 변환. 미지원 요소는 그 자리에 opaque 블록(사라지지 않는다).

## 5. Revision 과 충돌 (기획 §8.3, §7.4)

| 개념 | UI |
|---|---|
| append-only revision | 패널 타임라인. 삭제 버튼 없음. "이 버전으로 복원" 은 새 revision 생성 → primary |
| optimistic concurrency | 저장 실패 원인이 revision 불일치면 `conflict` 상태(오류가 아니다) |
| 3-way merge, 모호하면 conflict UI | 자동 병합된 구간은 `diff.changed-bg` 로 표시하고 알림 토스트 "자동 병합 3곳 · 보기". 모호한 구간만 `conflict-bg` + 액션 줄 |
| 삭제·수정된 문서의 revision 보존 | 휴지통 항목 클릭 → 읽기 전용 열람. 근거 칩 stale 클릭도 같은 화면 |

## 6. Issue (기획 §5.3)

| 기획 값 | 토큰 | 아이콘(색 이외 신호) |
|---|---|---|
| Backlog | `workflow.backlog` 중립 옅음 | `circle-dashed` |
| Todo | `workflow.todo` 중립 | `circle` |
| In Progress | `workflow.in-progress` 앰버 | 반 채움 원 |
| Review | `workflow.review` periwinkle | `eye` |
| Done | `workflow.done` verdigris | `circle-check` |
| Canceled | `workflow.canceled` 중립 옅음 + 취소선 | `circle-x` |

- Review 가 periwinkle 인 이유: "검토" 는 사람이 보는 단계이고, notting 에서 periwinkle 은 "확인이 필요한 것" 이라는 뜻과 겹친다(AI 제안도 확인이 필요하다). 단 review 필에는 sparkles 를 붙이지 않는다 — AI 가 아니다.
- 우선순위 `priority.*`: urgent 코럴 + `triangle-alert`, high 앰버 막대 3, medium verdigris 막대 2, low 중립 막대 1, none 빈 막대.
- dependency/parent: 카드 하단 `caption` "← NT-120 이후" + `git-branch` 16. 보드에서는 의존 대상이 Done 이 아니면 카드 왼쪽 `border.strong` 점선 표시하지 않는다(과한 신호) — 드로어에서만.
- Cycle 은 미정(§5.3). 토큰 없음.

## 7. ADR (기획 §5.3, §8.1)

| 상태 | 토큰 | 아이콘 |
|---|---|---|
| proposed | `decision.proposed` periwinkle | `circle-dashed` |
| accepted | `decision.accepted` verdigris | `circle-check` |
| deprecated | `decision.deprecated` 앰버 | `triangle-alert` |
| superseded | `decision.superseded` 중립 | `arrow-right-left` + "→ ADR-0007" 링크 |
| rejected | `decision.rejected` 코럴 | `circle-x` |

문서에서 ADR 추출 제안: 조용한 sparkles 힌트(ghost xs, 블록 gutter 옆) → 클릭해야만 미리보기. 자동으로 만들지 않는다(§3.2 "자율 에이전트" 비범위).

## 8. 화면 상태 — notting 이 base 에 더하는 세 가지

모든 화면은 base 의 로딩·빈·오류에 더해 아래 셋을 답해야 한다.

| 상태 | 질문 | 기본 답 |
|---|---|---|
| **오프라인** | 이 화면은 오프라인에서 무엇을 할 수 있나? | 에디터: 편집 계속 + `offline` 저장 상태. Ask: 비활성 + 이유. 가져오기: 로컬 파일이면 가능, 보고서는 로컬 생성. 이슈: 읽기 + 변경은 큐 |
| **충돌** | 서버와 갈라졌을 때 무엇을 보여주나? | 에디터: `conflict` + 비교. 이슈 속성: 마지막 쓰기 승리 + 토스트 "다른 사람이 상태를 바꿨어요". 속성 편집 중: 값 옆 `history` 아이콘 |
| **읽기 전용** | 권한 없음·과거 revision·잠금일 때? | 툴바 배너 + 핸들 없음 + 인풋 readonly 스타일. 이유를 배너에("편집 권한이 없어요" / "revision a1b2c3" / "잠김 · 해제") |

## 9. Gate 와 UI 검증

| Gate(기획 §5.1~5.2) | 디자인 시스템이 확인할 것 |
|---|---|
| Gate 0: 지원 fixture 의미 손실 0, 미지원 전부 report | 보고서 UI 가 fixture 결과를 그대로 보여주는지. lossless 만 있으면 토스트, 하나라도 아니면 모달 |
| Gate 0: full-text/vector/hybrid 비교 | 검색 평가 모드(12 §6) + 11 §1 중립 색 |
| Gate 1: 디자인 파트너가 도움 없이 작성·가져오기·내보내기 | 12 §2·4·5 골격 그대로 만들어 온보딩 없이 시험 |
| Gate 1: 근거 없으면 "근거 부족" | 06 §26 중립 카드 |
| 가설 4: 커스텀 속성 없이 기본 Issue/ADR | 06 §24 속성 행이 고정 세트로 충분한지, "속성 추가" 버튼을 Phase 2 까지 숨김 |

## 10. 기획서 용어 ↔ 토큰 이름 대조

| 기획서 | 토큰/클래스 |
|---|---|
| Notting Document AST · Block | `component.editor.*`, `block-*` |
| slash command | `component.slash-menu` |
| Copy as Markdown | 06 §17 블록 메뉴 항목, 07 §5 복사 피드백 |
| compatibility report / import/export report | `component.report`, `color.fidelity.*` |
| conversion_warnings | 보고서 행 |
| Ask Workspace / Ask Current Page | 06 §23 세그먼트, `component.ai-answer` |
| citation | `component.citation`, `.nt-cite`, `color.citation.*` |
| "현재 아님" | `citation.stale-*`, `opacity.stale` |
| 근거 부족 | `ai-answer.insufficient-bg` |
| Context Pack | `component.context-pack`, `gradient.context` |
| RelationSuggestion / 관련 문서 추천 | `component.backlink.suggested-badge` |
| revision / optimistic concurrency | `component.revision-list`, `save-indicator.conflict` |
| 3-way merge / conflict UI | `component.diff`, `color.diff.conflict-*` |
| Issue status 6종 | `color.workflow.*` |
| priority | `color.workflow` 아닌 `color.priority.*` |
| ADR status | `color.decision.*` |
| opaque node | `fidelity.opaque`, 06 §17 opaque 블록 |
| `.notting/` sidecar | UI 에 노출 안 함. 보고서 "사이드카에 보존" 문구만 |
| MCP / CLI `get_context` | 12 §10 CLI 명령 복사, 설정 › 연동 코드 블록 |
