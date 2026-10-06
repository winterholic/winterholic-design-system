# 08 · 상태·피드백 (AIP)

## 1. 로딩

| 예상 시간 | 표시 |
|---|---|
| < 300ms | 아무것도 표시하지 않는다(깜빡임 방지) |
| 300ms ~ 1s | 버튼이면 `aria-busy` 스피너, 영역이면 스켈레톤 |
| > 1s | 스켈레톤 + 무엇을 하는지 한 줄(`.aip-status` "Indexing…") |
| > 5s 또는 진행률을 안다 | 단계·개수("12 / 40 files") |

스켈레톤은 실제와 같은 개수·모양(문서: 제목 1줄 + 문단 3줄 + 코드 블록 1개). 정지해 있다.

## 2. 빈 상태

`.aip-empty`: 무엇이 없는지(제목) + 왜/어떻게(한 줄) + 다음 행동 하나(primary). 빈 상태는 오류가 아니다. 빨강·경고색을 쓰지 않는다.

| 상황 | 문구 예 | 행동 |
|---|---|---|
| 검색 0건 | No results for “{q}”. Try a concept name like *intent*. | (제안 링크) |
| Playground 실행 전 | Run the intent to see rows here. | Run |
| MakeAIP 기능 0개 선택 | No features selected — you'll get a minimal project. | (없음, 정보) |

## 3. 오류

| 범위 | 컴포넌트 | 예 |
|---|---|---|
| 필드 | `.aip-error` + `aria-invalid` | "Use letters, numbers and dots only." |
| 영역 | Callout `--caution`(문서) 또는 `.aip-status--danger`(앱) | "Generation failed. Try again." + 다시 시도 |
| 페이지 | 13 §6 오류 페이지 | 404·500 |

오류 문구 규칙: 무엇이 잘못됐는지 → 어떻게 고치는지. 사용자를 탓하지 않는다. 오류 코드는 모노로 덧붙인다(`403 · PERMISSION_DENIED`). 색만으로 말하지 않는다(아이콘 + 단어).

## 4. 성공·확인

- 짧은 확인은 그 자리에서: 복사 버튼이 "Copied"로 1.6초, MakeAIP 생성 후 버튼 아래 `.aip-status--success`.
- 확인 상태는 `role="status"` 또는 aip.js `AIP.announce()` 로 스크린 리더에도 알린다.
- 성공을 위해 다이얼로그를 띄우지 않는다.

## 5. 권한·거부 (AIP 고유)

AIP 의 핵심 상태 중 하나가 "서버가 거부했다"이다. 거부는 오류가 아니라 **정상 동작한 정책의 결과**다.

| 어디서 | 표시 |
|---|---|
| Playground 결과 | `.aip-status--danger` "403 · PERMISSION_DENIED" + 실행 로그 `data-level="denied"` |
| 문서 예시 | Example 블록의 Result 에 같은 표시 |
| 다이어그램 | `data-edge="reject"`(빨강 점선) + 라벨 "deny · 403" |

## 6. 상태 문구 톤

- 짧고 구체적으로. "Something went wrong" 대신 "Couldn't reach the runtime (timeout after 10s)".
- 동작 이름은 버튼과 같은 단어(Generate → "Generated aip-starter.zip").
- 시간은 상대 시간 7일까지, 그 뒤 `2026.10.06`.
