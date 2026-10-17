# Ttakkari 브랜드 자산

사용 규칙은 [`../../docs/16-brand-assets.md`](../../docs/16-brand-assets.md), 통합 미리보기는 [`../../examples/preview.html`](../../examples/preview.html) 첫 영역.

## 생성 방식

- 원본(source)은 `brand/generated/` 의 마스코트 PNG 다(`icons/icon-mascot-*.png` 작은 크기 전용, `icons/favicon-simple-transparent.png` 단색 실루엣용, `mascot/rabbit-identity-master-1254.png` 전신). 로고는 좌표가 아니라 이 이미지에서 파생한다. 스크립트는 모서리 깎기·포맷·크기 선택만 하고 그림을 새로 그리지 않는다.
- 심볼: Blue 타일 + 마스코트 얼굴(생성 세션의 icon-mascot-*.png). SVG 는 PNG(256)를 data URI 로 포함해 외부 참조가 없다. maskable 은 원본이 80% 원을 약 2% 넘어 가장자리 색을 늘려 한 번 더 줄인다.
- 워드마크 `ttakkari`: 사각형·고리·사분원 획·다각형으로 그린다. 글꼴을 쓰지 않는다. tt 는 가로획 하나를 나눠 쓴다.
- SVG 와 PNG 가 같은 원본에서 나온다(PNG 는 4배 슈퍼샘플 후 축소). 옛 '따' 는 앱 에이전트 아바타(CSS)에만 남았다.
- 히어로: Ink + 점 격자 + 오른쪽 큰 마스코트 전신(Paper 띠) + 지시 → 결과물 흐름 조각. 1600×900 PNG/WebP.
- 이 스크립트가 시스템에서 유일하게 hex 를 직접 쓰는 곳이다(정적 산출물). 값은 `tokens/src/brand.json` 과 같아야 한다.

```bash
python3 build-brand-assets.py   # Pillow·numpy 필요
```
