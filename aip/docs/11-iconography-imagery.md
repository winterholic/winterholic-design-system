# 11 · 아이콘·이미지 (AIP)

## 1. 아이콘: Lucide

[Lucide](https://lucide.dev)(ISC) 하나만 쓴다. 선 아이콘, `stroke-width: 1.75`(기본 2 보다 가늘어 정밀한 인상), 끝·이음 둥글게. `.aip-icon` 이 `currentColor` 를 쓰므로 색은 부모 글자색이 정한다.

| 크기 | 토큰 | 쓰는 곳 |
|---|---|---|
| 12 | `size.icon.xs` | 배지 안 |
| 16 | `size.icon.sm` | sm 컨트롤·사이드바·브레드크럼·인풋 앞·복사 |
| 20 | `size.icon.md` | md·lg 컨트롤·콜아웃. **기본** |
| 24 | `size.icon.lg` | 헤더 로고 마크·피처 |
| 32 | `size.icon.xl` | 빈 상태 |

장식 아이콘은 `aria-hidden="true"`. 의미가 있는데 글자가 없으면 버튼에 `aria-label`.

## 2. 의미 고정 매핑

| 의미 | Lucide 이름 |
|---|---|
| Note / Tip / Important / Warning / Caution | `info` / `lightbulb` / `highlighter` / `triangle-alert` / `octagon-alert` |
| 복사 / 복사됨 | `copy` / `check` |
| 검색 · 메뉴 · 닫기 | `search` · `menu` · `x` |
| 테마 | 라이트일 때 `moon`(다크로), 다크일 때 `sun`(라이트로) |
| 실행 · 초기화 · 공유 링크 · 다운로드 | `play` · `rotate-ccw` · `link` · `download` |
| 성공 / 실패 결과 | `circle-check` / `circle-x` |
| 파일 · 폴더 · 패키지 · 터미널 | `file` · `folder` · `package` · `terminal` |
| Runtime · Data · Server · Permission | `cpu` · `database` · `server` · `shield-check` |
| 외부 링크 | `external-link` 또는 글자 `↗` |

같은 의미에 다른 아이콘을 쓰지 않는다. 새 의미가 생기면 이 표에 먼저 추가한다.

## 3. 이미지

- 제품 스크린샷은 실제 UI 를 쓴다. 장식용 3D 일러스트·추상 그라데이션 블롭·AI 생성 '미래 도시' 이미지는 쓰지 않는다.
- 설명 그림은 이미지가 아니라 **다이어그램 컴포넌트**(12)로 그린다. 텍스트로 검색되고 테마를 따른다.
- 사진·스크린샷은 `radius.lg`, 테두리 `border.default`.
- 마케팅 배경 장식은 점 격자(04 §4) 하나뿐이다.

## 4. 로고

15 브랜드 자산.
