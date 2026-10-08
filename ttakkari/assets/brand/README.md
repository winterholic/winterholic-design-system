# Ttakkari 브랜드 자산

사용 규칙은 [`../../docs/16-brand-assets.md`](../../docs/16-brand-assets.md), 통합 미리보기는 [`../../examples/preview.html`](../../examples/preview.html) 첫 영역.

## 생성 방식

- 원본(source)은 `build-brand-assets.py` 의 `GEOMETRY`(512 좌표)다. 로고는 생성형 이미지가 아니라 좌표가 정본이다.
- 심볼: Ink 타일 + Paper '따'(ㄷ 두 개 + ㅏ 세로획, 굵기 44) + Mint ㅏ 가로획.
- 워드마크 `ttakkari`: 사각형·고리·사분원 획·다각형으로 그린다. 글꼴을 쓰지 않는다. tt 는 가로획 하나를 나눠 쓴다.
- SVG 와 PNG 가 같은 좌표에서 나온다(PNG 는 4배 슈퍼샘플 후 축소). 모양을 바꾸려면 `GEOMETRY` 만 고친다.
- 히어로: Ink + 점 격자 + 큰 '따' + 지시 → 결과물 흐름 조각. 1600×900 PNG/WebP.
- 이 스크립트가 시스템에서 유일하게 hex 를 직접 쓰는 곳이다(정적 산출물). 값은 `tokens/src/brand.json` 과 같아야 한다.

```bash
python3 build-brand-assets.py   # Pillow 필요
```
