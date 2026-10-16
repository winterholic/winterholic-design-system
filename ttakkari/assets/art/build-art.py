#!/usr/bin/env python3
"""일러스트 웹 파생본 생성: brand/generated 의 투명 PNG(1254 정사각)를 앱이 쓰는 WebP 로 줄인다.

- 원본(brand/generated)은 건드리지 않는다. 이미지를 새로 만들지 않고 크기·형식만 바꾼다.
- 출력: assets/art/<키>-480.webp(1x) · <키>-960.webp(2x). 키는 원본 파일 이름(확장자 제외).
- 예산: 480 은 60 KB, 960 은 180 KB 이하. 넘으면 실패한다(품질을 낮추지 않고 원본을 다시 의뢰한다).
- 실행: python3 assets/art/build-art.py   (ttakkari 디렉터리에서). 필요: Pillow(WebP 지원).
"""
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'brand' / 'generated'
OUT = Path(__file__).resolve().parent
GROUPS = ['states', 'onboarding', 'domain-empty']
SIZES = {480: 60 * 1024, 960: 180 * 1024}

manifest = {}
failed = []
for group in GROUPS:
    for png in sorted((SRC / group).glob('*.png')):
        key = png.stem
        im = Image.open(png).convert('RGBA')
        # 바깥 투명 여백을 잘라 같은 상자 안에서 그림이 더 크게 보이게 하되, 정사각을 유지하고 8% 여백을 남긴다
        bbox = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
        if bbox:
            w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
            side = int(max(w, h) * 1.16)
            cx, cy = (bbox[0] + bbox[2]) // 2, (bbox[1] + bbox[3]) // 2
            box = (cx - side // 2, cy - side // 2, cx - side // 2 + side, cy - side // 2 + side)
            canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
            canvas.paste(im, (-box[0], -box[1]))
            im = canvas
        entry = {'group': group, 'source': str(png.relative_to(ROOT)), 'files': {}}
        for px, budget in SIZES.items():
            out = OUT / f'{key}-{px}.webp'
            im.resize((px, px), Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
            size = out.stat().st_size
            entry['files'][str(px)] = size
            if size > budget:
                failed.append(f'{out.name} {size // 1024} KB > {budget // 1024} KB')
        manifest[key] = entry
(OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
total = sum(sum(e['files'].values()) for e in manifest.values())
print(f'{len(manifest)} 키 · {len(manifest) * len(SIZES)} 파일 · {total // 1024} KB')
if failed:
    print('예산 초과:', *failed, sep='\n  ')
    sys.exit(1)
