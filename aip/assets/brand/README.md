# AIP 브랜드 자산

사용 규칙은 [`../../docs/15-brand-assets.md`](../../docs/15-brand-assets.md), 통합 미리보기는 [`../../examples/preview.html`](../../examples/preview.html) 첫 영역.

## 생성 방식

- 원본(source)은 `build-brand-assets.py` 의 `GEOMETRY`(512 좌표)다. 로고는 생성형 이미지가 아니라 좌표가 정본이다.
- 심볼: AIP Blue 타일 + 흰 Λ 다각형(수평 발·평평한 꼭대기) + Λ 뒤를 가로지르는 AIP Yellow 막대.
- 워드마크 `AIP`: 같은 Λ 다각형을 줄인 A + 사각형 I + 고리형 P. 글꼴을 쓰지 않는다.
- SVG 와 PNG 가 같은 좌표에서 나온다(PNG 는 4배 슈퍼샘플 후 축소). 모양을 바꾸려면 `GEOMETRY` 만 고친다.
- 히어로: Charcoal 어둠 + 점 격자 + 심볼 + Intent→Runtime→Data 흐름 조각. 1600×900 PNG/WebP.
- 이 스크립트가 시스템에서 유일하게 hex 를 직접 쓰는 곳이다(정적 산출물). 값은 `tokens/src/brand.json` 과 같아야 한다.

```bash
python3 build-brand-assets.py   # Pillow 필요
```
