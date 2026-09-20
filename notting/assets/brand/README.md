# notting 브랜드 자산

사용 규칙은 [`../../docs/14-brand-assets.md`](../../docs/14-brand-assets.md), 통합 미리보기는 [`../../examples/preview.html`](../../examples/preview.html) 첫 영역.

## 생성 방식

- 도구: `build-brand-assets.py` (Pillow). 이미지 생성 모델을 쓰지 않았다 — 심볼이 기하 도형이라 스크립트가 정본이다.
- 심볼 좌표(`GEOMETRY`, 512 기준)에서 SVG 와 PNG 가 같이 나온다. 모양을 바꾸려면 `GEOMETRY` 만 고치고 다시 실행한다.
- 히어로: `gradient.brand`(teal.800 → verdigris → periwinkle, 135deg) 위 심볼 480 + 옅은 종이 줄. 1600×900 PNG/WebP.
- 이 스크립트가 유일하게 hex 를 직접 쓰는 곳이다(정적 산출물 예외, 01 §6). 값은 `tokens/src/brand.json`·`palette.json` 과 같아야 한다.

```bash
python build-brand-assets.py
```
