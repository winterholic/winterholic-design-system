# 17 · 제품 매핑: AIP 생태계의 무엇이 화면에서 무엇이 되는가

이 시스템은 AIP 구현 세부(문법·런타임 내부·프로토콜 명세)에 **결합하지 않는다**. 대신 AIP 를 설명할 때 반복되는 개념과 다섯 제품을 시각 규칙에 연결한다. 개념의 정의가 바뀌어도 이 표의 오른쪽은 그대로다.

## 1. AIP 의 약속 → 시각 언어

| 약속 | 시각 언어 | 어디서 |
|---|---|---|
| 호출자는 필요한 것을 **선언**한다 | 형광펜 노랑 = 선언된 의도. 로고의 막대, 다이어그램 intent, `<mark>`, 코드의 함수명 | 15 · 12 · 01 |
| 서버가 **최종 권한**을 갖는다 | 탱저린 = 경계. permission 노드, 경고 면, 거부는 빨강 점선 | 12 · 08 §5 |
| Runtime 이 **안전하게 실행**한다 | AIP Blue = AIP 자체. runtime 영역, execution 노드, primary 행동 | 12 · 01 |
| 규칙은 **명확하고 예측 가능**하다 | 작은 radius, hairline, 모노 식별자, 정본(스펙)은 파란 선, 예시는 노란 바 | 04 · 07 |
| 사람과 AI 가 **같은 구조**를 읽는다 | 시맨틱 HTML 계약, GFM 이름, 안정 id, 텍스트 설명, View as Markdown | 07 §1 |
| **좋은 기본값** | 컴포넌트 기본값 = 가장 흔한 경우(secondary·md), variant 최소 | 06 |

## 2. 개념 → 화면

| 개념 | 문서에서 | 다이어그램 | 아이콘 | 색 |
|---|---|---|---|---|
| Intent | 코드 탭(TS·Python), Spec block | `data-role="intent"` | `braces` | `diagram.intent`(Yellow) |
| Runtime | 개념 문서, 경계 영역 | `.aip-svg-zone` / `runtime` | `cpu` | Blue |
| Execution / Plan | Playground Plan 탭, 예시 Result | `execution` | `play` | Blue 채움 |
| Permission / Policy | Guide·Security, 거부 예시 | `permission` + reject 선 | `shield-check` | Tangerine |
| Actor | 파라미터 설명("resolved by the server") | 라벨 | `key-round` | 없음(글자) |
| Frontend / Caller | Quick Start | `frontend` | `monitor` | Slate 밝은 면 |
| Backend / Server 정의 | 계약·정책 문서 | `backend` | `server` | 중립 |
| Data store | 마이그레이션 문서 | `data`(원통) | `database` | Slate 채움 |
| Extension(JS/Python) | Extensions 문서, `experimental` 배지 | `backend` 또는 note | `package` | 중립 |
| External system | 연동 문서 | `external`(점선) | `external-link` | 중립 점선 |

## 3. 제품 → 컴포넌트

| 제품 | 핵심 컴포넌트 | 템플릿 |
|---|---|---|
| 공식 홈페이지 | Header, display 글자, 코드 목업, Card, Flow, CTA 띠 | `examples/home.html` |
| Documentation | Docs 셸, Sidebar, TOC, Breadcrumb, Pager, Code Block/Tabs, Callout, Spec, Example, Params, Signature, Diagram, Search, Version | `examples/docs.html` |
| MakeAIP | Configurator 셸, Option card, Segmented, Select, Radio, Code 미리보기, Action bar, Status | `examples/makeaip.html` |
| Playground | Workbench, Toolbar, Editor, Tabs, Table, Run log, Status bar | `examples/playground.html` |
| Architecture / Spec Visualization | Diagram(Flow·SVG·Mermaid), Spec block | `docs.html` Figure 1, `preview.html#diagram` |

## 4. 제품 사이에서 달라지는 것과 같은 것

| | 같다 | 달라진다 |
|---|---|---|
| 헤더 | 높이·로고·검색 자리·테마 버튼 | 제품 이름, 내비 항목 |
| 색 | 토큰 전부 | Blue 의 면적: Docs 최소 → MakeAIP·Playground 행동 버튼 → 홈 CTA 띠 |
| 밀도 | 4px 그리드·컨트롤 높이 단계 | 홈 lg 버튼·넓은 섹션, Playground sm 컨트롤·꽉 찬 화면 |
| 글자 | 패밀리·스케일 | 홈 display, Docs doc-*, 앱 heading-* |
