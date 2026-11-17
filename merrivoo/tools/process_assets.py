#!/usr/bin/env python3
"""Merrivoo asset pipeline. 이미지 생성 결과(마젠타 #FF00FF 배경 시트)를 조립 가능한 에셋으로 가공한다.

  key    IN OUT.webp                  마젠타 키 제거(투명 배경) + 번짐 제거
  slice  SHEET --cols C --rows R --names a,b,... --out DIR [--size 256]
                                      시트를 개체별 투명 webp 로 자르고 앵커·크기를 JSON 으로 낸다
  tree   IN OUT.webp --width 1024 [--mask-cols 48]
                                      트리 한 그루를 키 제거·크롭·리사이즈하고 알파 마스크(JSON)를 낸다
  bg     IN OUT.webp [--quality 82] [--width N]
                                      배경·screen 합성용 효과(검정 배경) 최적화. 효과는 알파 없이 검정을 그대로 두고 screen 블렌드로 합성한다
  fx     IN OUT.webp [--width 720] [--quality 72]
                                      검정 배경 효과를 휘도→알파로 바꾼다(screen/normal 둘 다 쓸 수 있게)

의존성: Pillow, numpy, scipy. 외부 서비스 호출 없음.
"""
import argparse, json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

M_LO, M_HI = 55.0, 190.0  # 마젠타 지수(min(R,B)-G) 구간. 이 아래는 불투명, 위는 투명


def key_magenta(img: Image.Image) -> Image.Image:
    a = np.asarray(img.convert("RGB"), dtype=np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g
    t = np.clip((M_HI - m) / (M_HI - M_LO), 0, 1)
    alpha = t * t * (3 - 2 * t)  # smoothstep
    # 가장자리 색 복원: 마젠타와 섞인 픽셀에서 마젠타 성분을 걷어낸다
    mag = np.array([255.0, 0.0, 255.0], dtype=np.float32)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.where(alpha[..., None] < 0.999, (a - (1 - alpha[..., None]) * mag) / safe, a)
    # 남은 분홍 번짐: 가장자리에서 R·B 가 G 보다 25 넘게 높은 만큼만 R·B 를 내린다(붉은색·보라색 본체는 건드리지 않는다)
    pink = np.clip(np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1] - 25, 0, None) * (alpha < 0.999)
    rgb[..., 0] -= pink
    rgb[..., 2] -= pink
    rgb = np.clip(rgb, 0, 255)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def alpha_bbox(im: Image.Image, thr=24):
    al = np.asarray(im.split()[-1])
    ys, xs = np.where(al > thr)
    if len(xs) == 0:
        raise SystemExit("빈 이미지")
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def save_webp(im: Image.Image, path: Path, quality=88):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=6, alpha_quality=95)


def cmd_key(a):
    im = key_magenta(Image.open(a.input))
    im = im.crop(alpha_bbox(im))
    save_webp(im, Path(a.output))
    print(a.output, im.size)


def components(alpha: np.ndarray, grow: int):
    mask = alpha > 40
    grown = ndi.binary_dilation(mask, iterations=grow)
    lab, n = ndi.label(grown)
    objs = ndi.find_objects(lab)
    out = []
    for i, sl in enumerate(objs, start=1):
        area = int(((lab[sl] == i) & mask[sl]).sum())
        if area < 2500:
            continue
        out.append({"sl": sl, "area": area})
    return out


def cmd_slice(a):
    im = key_magenta(Image.open(a.sheet))
    W, H = im.size
    alpha = np.asarray(im.split()[-1])
    names = a.names.split(",")
    want = a.cols * a.rows
    # 장식 안쪽 조각(고리·불꽃)은 합치고 이웃 개체와는 분리하는 팽창 폭을 큰 값부터 찾는다
    best = None
    for grow in (14, 12, 9, 7, 5, 4, 3):
        cs = components(alpha, grow=grow)
        if best is None or abs(len(cs) - want) < abs(len(best) - want):
            best = cs
        if len(cs) == want:
            break
    comps = best
    if len(comps) != a.cols * a.rows:
        print(f"경고: 개체 {len(comps)}개 검출, 기대 {a.cols * a.rows}개", file=sys.stderr)
    # 행 → 열 순서: y 중심으로 R 개 행에 묶고 행 안에서 x 정렬
    comps.sort(key=lambda c: (c["sl"][0].start + c["sl"][0].stop) / 2)
    rows = [comps[i * a.cols:(i + 1) * a.cols] for i in range(a.rows)]
    ordered = [c for row in rows for c in sorted(row, key=lambda c: c["sl"][1].start)]
    outdir = Path(a.out)
    meta = []
    for name, c in zip(names, ordered):
        ys, xs = c["sl"]
        pad = 6
        box = (max(0, xs.start - pad), max(0, ys.start - pad), min(W, xs.stop + pad), min(H, ys.stop + pad))
        crop = im.crop(box)
        crop = crop.crop(alpha_bbox(crop))
        w, h = crop.size
        s = a.size / max(w, h)
        crop = crop.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
        w, h = crop.size
        al = np.asarray(crop.split()[-1])
        top = al[: max(2, h // 25)]
        ys2, xs2 = np.where(top > 128)
        ax = float(xs2.mean() / w) if len(xs2) else 0.5
        save_webp(crop, outdir / f"{name}.webp")
        meta.append({"id": name, "file": f"{name}.webp", "width": w, "height": h, "aspect": round(w / h, 4), "anchorTop": {"x": round(ax, 4), "y": 0.04}})
    (outdir / "_slice.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
    print(len(meta), "개 →", outdir)


def cmd_tree(a):
    im = key_magenta(Image.open(a.input))
    im = im.crop(alpha_bbox(im))
    w, h = im.size
    im = im.resize((a.width, round(h * a.width / w)), Image.LANCZOS)
    save_webp(im, Path(a.output), quality=a.quality)
    al = np.asarray(im.split()[-1]).astype(np.float32) / 255
    cols = a.mask_cols
    rows = round(cols * im.size[1] / im.size[0])
    cell = Image.fromarray((al * 255).astype(np.uint8)).resize((cols, rows), Image.BOX)
    grid = (np.asarray(cell) > 140).astype(np.uint8)
    # 줄기 쪽(맨 아래)은 장식 불가: 마지막 2행은 마스크에서 뺀다
    grid[-2:, :] = 0
    meta = {
        "file": Path(a.output).name,
        "width": im.size[0],
        "height": im.size[1],
        "aspect": round(im.size[0] / im.size[1], 4),
        "mask": {"cols": cols, "rows": rows, "data": ["".join(map(str, r)) for r in grid.tolist()]},
        "coverage": round(float(grid.mean()), 3),
    }
    Path(a.output).with_suffix(".mask.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
    print(a.output, im.size, "mask", cols, "x", rows, "coverage", meta["coverage"])


def cmd_bg(a):
    im = Image.open(a.input).convert("RGB")
    if a.width and im.size[0] > a.width:
        im = im.resize((a.width, round(im.size[1] * a.width / im.size[0])), Image.LANCZOS)
    save_webp(im, Path(a.output), quality=a.quality)
    print(a.output, im.size, Path(a.output).stat().st_size // 1024, "KB")


def cmd_fx(a):
    im = Image.open(a.input).convert("RGB")
    arr = np.asarray(im, dtype=np.float32)
    lum = arr.max(axis=2)
    alpha = np.clip(lum / 255 * 1.15, 0, 1)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.clip(arr / safe, 0, 255)
    out = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), "RGBA")
    if a.width and out.size[0] > a.width:
        out = out.resize((a.width, round(out.size[1] * a.width / out.size[0])), Image.LANCZOS)
    save_webp(out, Path(a.output), quality=a.quality)
    print(a.output, out.size, Path(a.output).stat().st_size // 1024, "KB")


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("key"); s.add_argument("input"); s.add_argument("output"); s.set_defaults(f=cmd_key)
    s = sub.add_parser("slice"); s.add_argument("sheet"); s.add_argument("--cols", type=int, required=True); s.add_argument("--rows", type=int, required=True)
    s.add_argument("--names", required=True); s.add_argument("--out", required=True); s.add_argument("--size", type=int, default=256); s.set_defaults(f=cmd_slice)
    s = sub.add_parser("tree"); s.add_argument("input"); s.add_argument("output"); s.add_argument("--width", type=int, default=1024); s.add_argument("--mask-cols", type=int, default=48); s.add_argument("--quality", type=int, default=84); s.set_defaults(f=cmd_tree)
    s = sub.add_parser("bg"); s.add_argument("input"); s.add_argument("output"); s.add_argument("--quality", type=int, default=82); s.add_argument("--width", type=int, default=0); s.set_defaults(f=cmd_bg)
    s = sub.add_parser("fx"); s.add_argument("input"); s.add_argument("output"); s.add_argument("--width", type=int, default=0); s.add_argument("--quality", type=int, default=72); s.set_defaults(f=cmd_fx)
    a = p.parse_args()
    a.f(a)


if __name__ == "__main__":
    main()
