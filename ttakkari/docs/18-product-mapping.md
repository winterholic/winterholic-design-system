# 18 · 제품 매핑: 요구사항의 무엇이 화면에서 무엇이 되는가

이 시스템은 Ttakkari 구현 세부(엔진·API·정책 키)에 결합하지 않는다. 요구사항 문서의 약속·개념·화면을 시각 규칙에 연결한다. 구현이 바뀌어도 이 표의 오른쪽은 그대로다.

## 1. 약속 → 시각 언어

| 요구사항의 약속 | 시각 언어 | 어디서 |
|---|---|---|
| 지시부터 결과물 활용까지 원격에서 완결(§1) | 채팅 → 실행 카드 → 결과물 카드 → 뷰어 → 후속 지시가 한 흐름. 새 탭·외부 앱으로 나가지 않는다 | 07 · 08 · 09 |
| Mobile First(§8) | 탭바·바텀 시트·전체 화면 뷰어·48 주 행동·16 입력·safe-area | 03 · 06 |
| Minimal Friction | 결과물 카드 한 번 = 뷰어, 원본 다운로드 한 번 | 09 |
| Context Continuity | 뷰어 아래 후속 지시 컴포저, 문맥 칩 | 07 §7 · 09 §5 |
| Unified Experience | 형식이 달라도 툴바 자리 고정 | 09 §2 |
| Persistent Results | 보관함·보존 표시·고정 | 09 · 14 §4 |
| Secure by Design | 정책 배지·승인 카드·정책 판정·격리 띠. 접근과 반출을 따로 표시 | 08 · 09 · 10 §6 |
| 에이전트 자율성 | Mint 가 에이전트의 일(실행 중·완료·도착)을 말한다. Blue 는 사람의 결정 | 01 |

## 2. 개념 → 화면

| 개념 | 컴포넌트 | 아이콘 | 색 |
|---|---|---|---|
| Session | 사이드바·드로어 `.tk-session`, 헤더 제목 | `message-square` | 중립(실행 중이면 live 점) |
| Task(작업) | Run card · Steps · Log | 상태별(08 §1) | `run.*` |
| 오케스트레이터·에이전트 | '따' 아바타 + "따까리" 이름 하나 | — | Mint |
| 고위험 작업 승인 | Approval card · Checks | `shield-alert` | amber |
| Artifact | Glyph · Artifact card · row · Detail | 파일 계열 | `filetype.*` |
| 원본 / 미리보기 파생 파일 | 다운로드는 원본, 뷰어는 파생. 변환 안내 Notice | `download` | |
| 미리보기 생성 상태 | Viewer state 7종 · 카드 메타의 상태 | 스피너·`circle-x` | 10 |
| 접근 정책 / 반출 정책 | `.tk-policy` 4종 · `.tk-policy-note` | 방패·잠금·금지 | `policy.*` |
| 보존 기간 | `.tk-retention` | `clock`·`pin` | 중립·amber |
| 무결성(해시) | Detail 메타 SHA-256(모노, 복사) | | |
| File Broker 검증 | Checks(pass·warn·fail) | | |
| 다운로드 링크 만료·재인증 | Status "링크가 만료됐어요" · 재인증 Dialog | `key` | |
| 감사 로그 | Detail 기록 탭 · `.tk-list--inset` | `history` | |
| Mac Studio(실행 호스트) | Presence 알약·헤더 메타·Banner | `hard-drive`·`monitor` | `presence.*` |
| Workspace(현재 작업 결과물) | 작업 공간 화면(목록 + 뷰어) | `panel-right` | |
| Artifact Library | 보관함 화면(필터 + 목록 + 상세) | `archive` | |
| 원격 파일 탐색 | 파일 찾기 화면(검색 + 트리 + 선택) | `folder-search` | |
| 외부 전달 | 내보내기 Sheet → Approval | `send`·`mail` | |

## 3. 화면이 하지 않는 것(보안 경계)

요구사항 §6·§7 "에이전트가 반환한 경로는 신뢰된 권한이 아니다"를 화면이 지키는 방법:

- 화면은 **파일 ID** 로만 결과물을 연다. 경로는 보여주는 정보일 뿐, 경로로 다운로드 URL 을 만들지 않는다.
- 정책 배지·판정·차단은 **서버가 보낸 판정**을 그대로 그린다. 화면이 파일 이름·확장자를 보고 정책을 추측해 표시하지 않는다.
- 민감 값 가리기(로그의 토큰 등)는 서버가 한다. CSS 로 흐리게 하는 것은 보안이 아니다.
- HTML 결과물은 앱 출처 밖 sandbox iframe 에서만 렌더한다(09 §3).
- 정책을 바꾸는 화면은 설정에만, 재인증 뒤에만 있다. 에이전트 메시지 안에 "정책 바꾸기" 버튼을 두지 않는다.
- 승인은 Approval card 에서 사람이 누른다. 알림·토스트에서 바로 승인하지 않는다.

## 4. 단계(Phase)별로 필요한 부품

| Phase | 요구사항 | 이 시스템에서 쓰는 것 |
|---|---|---|
| 1 원격 작업 + 기본 결과물 | 채팅 PWA · 원격 실행 · 진행 상황 · MD·PDF 미리보기 · 다운로드 | App 셸 · Header · Tabbar · Thread · Message · Composer · Run · Log · Artifact card · Viewer(doc·desk) · Viewer state · Banner(연결) |
| 2 Universal Artifact Workspace | PPTX·DOCX·HTML·XLSX·이미지·코드 뷰어 · Library · 파일 탐색 · 문서 기반 후속 작업 | Viewer 본문 7종 · Notice · Find · Split · Library(Filter bar · Detail) · Files(Path · Tree · List) · 후속 지시 |
| 3 고급 파일 관리·외부 연동 | Broker 정책 · 이동·복사·정리 · 메일·외부 저장소 · 승인 정책 · 대용량·보존 | Approval · Checks · Policy · Selection bar · 내보내기 Sheet · Retention · `too-large` 상태 |

Phase 1 부터 이 시스템 전체를 로드해도 된다. 쓰지 않는 컴포넌트는 CSS 몇 줄일 뿐이다(components.css 는 gzip 기준 수십 KB 수준, 확인 필요).
