# 여행가쟈 design system — AI 에이전트 규칙

원본 프로젝트 `C:	our-datarontend` 의 UI 작업은 **원본 `CLAUDE.md`(Bright Line 11) + `.claude/skills/design-system`** 이 정본이다. 이 저장소는 참조본. 두 곳이 어긋나면 원본이 이기고 이 저장소를 고친다.

## Bright Line 11 (원본 요지)
1. 토큰만 쓴다(hex·px 하드코딩 금지, 새 값은 토큰 먼저). 2. 배경은 한지 계열, 순백 금지, 어두운 배경은 가챠 연출만. 3. 단청 5색은 액센트(가는 선)로만. 4. 캡슐이 모든 화면의 시각 중심. 5. 등급은 풀네임(알파벳 금지). 6. Unique 지역명에 시즌 키워드. 7. 폰트 역할 고정(Myeongjo 제목·Batang 본문·Brush 강조·Cinzel 등급·Mono 숫자). 8. 해요체 + 가챠 어휘, 사극·SNS·게임 톤 금지. 9. 접근성 기본값(시맨틱 태그·role/label/state·reduced-motion). 10. 375 기준, 본문 13~14·헤더 20~22, 카피 한 줄. 11. 다크패턴 금지.
우선순위: **접근성(9) > 등급·카피(5·6·8) > 색·배경(2·3).** 규칙 위반 요청은 침묵 적용하지 말고 한 줄로 surface.

## 이 저장소를 쓸 때
1. `docs/00-decision-guide.md`(토큰·원본 변수명 대응) → `docs/16-situations.md`(상황) → 원본 SKILL "막혔을 때"(충돌·질의).
2. 컴포넌트 수치는 `docs/06`, 화면은 `docs/12`, 등급·연출은 `docs/11`.
3. 값을 바꾸려면 **원본 `tokens.css`·references 먼저**, 그 다음 여기 `tokens/src` → `node tokens/build.mjs` → README §검증 스크립트로 값 일치.

## 반드시
- 원본 변수명(`--hanji` `--dc-red` `--sp-4`) 또는 `--yg-*`. 값 직접 금지.
- 먹선 2px(칩·입력 1.5) + 오프셋 그림자. hover 로 떠오르지 않는다.
- 읽는 글자는 `ink-3` 이상. `ink-4` 는 장식.
- 노랑·금·jade·persimmon·홀로는 글자 금지(띠·아이콘·글로우·무대).
- 등급 의존 컴포넌트는 5등급 + moment 전부 + 스토리 전부.
- 무대는 `data-tone="dark"`(연출만). 시스템 다크 없음.
- 기둥 520/720/960/1152 외 새 max-width 금지.
- 아이콘보다 아트워크(도장·필터 프레임·민화). 이모지 금지.
- 다이얼로그 왼쪽 "닫기", CTA 문구는 결과가 보이게.

## 완료 전
원본 절차: 5등급 스토리 시각 확인 · Storybook a11y 0건 · `npm run lint` · 375 확인 · 보고 형식(만든 것·체크리스트·새 토큰·한 줄 보고·다음 할 일). 이 저장소를 건드렸으면 `node tokens/build.mjs` + 대조 스크립트 결과를 붙인다.
