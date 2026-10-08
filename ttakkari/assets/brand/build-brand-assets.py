"""Ttakkari 브랜드 자산 생성기: SVG(컬러·단색·락업 2종·파비콘) + PNG/ICO(파비콘·앱 아이콘·설치 아이콘) + 히어로.

심볼 = Ink 타일 위 Paper 색 '따'. 모음 ㅏ 의 짧은 가로획만 Mint 다.
따까리의 첫 음절이고, 민트 획은 오른쪽으로 뻗는 손(지시를 받아 움직이는 쪽)이자 터미널 커서처럼 대기하는 신호다.
처음 시안은 ㄷ 두 개 + 커서 블록이었으나 렌더해 보니 라틴 'CC.' 로 읽혀 버렸다. ㅏ 를 붙여 한 음절로 만들자 한글로 읽힌다.
워드마크 ttakkari 도 글꼴이 아니라 같은 좌표계의 도형이다(폰트가 없는 환경에서도 같은 모양). i 의 점은 Mint 커서와 같은 색이다.
모든 파일이 GEOMETRY 하나에서 나온다. 실행: python3 build-brand-assets.py (이 디렉터리, Pillow 필요)
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent

# 팔레트: tokens/src/brand.json · palette.json 과 같은 값. 정적 산출물이라 여기서만 hex 를 쓴다(docs/01 §8).
PAPER = "#F4F4ED"
INK = "#080705"
BLUE = "#296EB4"
MINT = "#00F0B5"
MINT_SOFT = "#6DECAF"
SURFACE = "#171B1C"        # seed dark-surface
SURFACE_MUTED = "#22292A"  # seed dark-surface-muted
BORDER = "#30383A"         # seed dark-border = graphite.900
TEXT_MUTED = "#A6B0B8"     # seed dark-text-muted
BLUE_TINT = "#1A2A37"      # dark-tint.blue
RED_TINT = "#372121"       # dark-tint.red
RED_300 = "#FBABA1"

# 512 좌표계. 타일 radius 22%(다른 시스템과 같은 비율).
# 획이 아니라 다각형이다. 굵기 44. ㄸ(ㄷ 두 개, 높이 208)은 세로 모음 ㅏ(높이 264)보다 짧다 — 한글 음절의 자연스러운 비례.
GEOMETRY = {
    "size": 512,
    "tile_radius": 112,
    "d1": [(92, 152), (188, 152), (188, 196), (136, 196), (136, 316), (188, 316), (188, 360), (92, 360)],
    "d2": [(208, 152), (304, 152), (304, 196), (252, 196), (252, 316), (304, 316), (304, 360), (208, 360)],
    "stem": [(334, 124), (378, 124), (378, 388), (334, 388)],   # ㅏ 의 세로획
    "cursor": (378, 234, 52, 44),   # (x, y, w, h): ㅏ 의 가로획 = 민트. 두 ㄷ 사이(20)보다 넓게 떨어진 ㅏ(30)가 초성과 모음을 가른다
    "cursor_radius": 6,
}

# 워드마크(락업 높이 64 기준). 바닥선 44, x-height 22(위 22), 어센더 위 10. 획 6.
WORD = {"base": 44, "x_top": 22, "asc": 10, "t_top": 13, "stroke": 6, "gap": 4}


def path_d(points) -> str:
    return "M" + " L".join(f"{x:g} {y:g}" for x, y in points) + " Z"


def scaled(points, s, ox, oy):
    return [(ox + x * s, oy + y * s) for x, y in points]


def mark_svg(tile: str | None, glyph: str, cursor: str, scale=1.0, offset=(0, 0), cursor_opacity: float | None = None) -> str:
    g = GEOMETRY
    ox, oy = offset
    s = scale
    parts = []
    if tile:
        parts.append(f'<rect x="{ox:g}" y="{oy:g}" width="{g["size"] * s:g}" height="{g["size"] * s:g}" rx="{g["tile_radius"] * s:g}" fill="{tile}"/>')
    parts.append(f'<path d="{path_d(scaled(g["d1"], s, ox, oy))}" fill="{glyph}"/>')
    parts.append(f'<path d="{path_d(scaled(g["d2"], s, ox, oy))}" fill="{glyph}"/>')
    parts.append(f'<path d="{path_d(scaled(g["stem"], s, ox, oy))}" fill="{glyph}"/>')
    cx, cy, cw, ch = g["cursor"]
    op = f' fill-opacity="{cursor_opacity:g}"' if cursor_opacity is not None else ""
    parts.append(f'<rect x="{ox + cx * s:g}" y="{oy + cy * s:g}" width="{cw * s:g}" height="{ch * s:g}" rx="{g["cursor_radius"] * s:g}" fill="{cursor}"{op}/>')
    return "\n  ".join(parts)


def thick_line(p0, p1, w):
    """두 점을 잇는 두께 w 의 사각형(다각형 꼭짓점 4개)."""
    (x0, y0), (x1, y1) = p0, p1
    dx, dy = x1 - x0, y1 - y0
    length = math.hypot(dx, dy)
    nx, ny = -dy / length * w / 2, dx / length * w / 2
    return [(x0 + nx, y0 + ny), (x1 + nx, y1 + ny), (x1 - nx, y1 - ny), (x0 - nx, y0 - ny)]


def word_shapes(x0: float):
    """ttakkari 워드마크 도형 목록. 반환: (도형들, 오른쪽 끝 x). 도형 = (kind, data, role) — role 은 ink 또는 accent(i 의 점)."""
    b, xt, asc, tt, s, gap = WORD["base"], WORD["x_top"], WORD["asc"], WORD["t_top"], WORD["stroke"], WORD["gap"]
    shapes = []
    x = x0
    # tt: 두 t 가 가로획 하나를 나눠 쓴다(합자)
    shapes.append(("rect", (x + 4, tt, s, b - tt), "ink"))
    shapes.append(("rect", (x + 18, tt, s, b - tt), "ink"))
    shapes.append(("rect", (x, xt, 28, s), "ink"))
    x += 28 + gap
    # a: 고리 + 오른쪽 기둥(한 층 a)
    def a_at(x):
        r = (b - xt) / 2
        shapes.append(("ring", (x + r, xt + r, r, s), "ink"))
        shapes.append(("rect", (x + 2 * r - s, xt, s, b - xt), "ink"))
        return x + 2 * r
    x = a_at(x) + gap
    # k: 기둥 + 팔 + 다리
    def k_at(x):
        shapes.append(("rect", (x, asc, s, b - asc), "ink"))
        shapes.append(("poly", thick_line((x + s - 1, 35), (x + 21, xt + 1.5), s), "ink"))
        shapes.append(("poly", thick_line((x + 11, 30.5), (x + 21.5, b - 1.5), s), "ink"))
        return x + 23
    x = k_at(x) + gap
    x = k_at(x) + gap
    x = a_at(x) + gap
    # r: 기둥 + 어깨(사분원 획)
    shapes.append(("rect", (x, xt, s, b - xt), "ink"))
    shapes.append(("arc", (x + s / 2, xt + 11, 11, s), "ink"))
    x += 17 + gap
    # i: 기둥 + 민트 점(심볼의 커서와 같은 색)
    shapes.append(("rect", (x, xt, s, b - xt), "ink"))
    shapes.append(("rect", (x, asc, s, s), "accent"))
    x += s
    return shapes, x


def shapes_svg(shapes, ink: str, accent: str) -> str:
    out = []
    for kind, d, role in shapes:
        color = accent if role == "accent" else ink
        if kind == "rect":
            x, y, w, h = d
            rx = ' rx="1.5"' if role == "accent" else ""
            out.append(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}"{rx} fill="{color}"/>')
        elif kind == "poly":
            out.append(f'<path d="{path_d([(round(px, 2), round(py, 2)) for px, py in d])}" fill="{color}"/>')
        elif kind == "ring":
            cx, cy, r, w = d
            out.append(f'<circle cx="{cx:g}" cy="{cy:g}" r="{r - w / 2:g}" fill="none" stroke="{color}" stroke-width="{w:g}"/>')
        elif kind == "arc":
            cx, cy, r, w = d
            # 기둥 중심선(cx) 위 cy 에서 시작해 오른쪽 위로 도는 사분원. 끝은 평평하게
            out.append(f'<path d="M{cx:g} {cy:g} A{r:g} {r:g} 0 0 1 {cx + r:g} {cy - r:g}" fill="none" stroke="{color}" stroke-width="{w:g}"/>')
    return "\n  ".join(out)


def write(name: str, text: str):
    (HERE / name).write_text(text.strip() + "\n", encoding="utf-8")


def build_svgs():
    size = GEOMETRY["size"]
    write("logo-mark.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-label="Ttakkari">
  {mark_svg(INK, PAPER, MINT)}
</svg>''')
    # 단색: currentColor 하나. 민트 획도 같은 색(세로획에 붙어 ㅏ 가 된다)
    write("logo-mark-mono.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-label="Ttakkari" color="{INK}">
  {mark_svg(None, "currentColor", "currentColor")}
</svg>''')
    write("favicon.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">
  {mark_svg(INK, PAPER, MINT)}
</svg>''')
    # 락업: 64 높이. 심볼 64 + 간격 14 + 워드마크
    shapes, right = word_shapes(64 + 14)
    width = math.ceil(right + 2)
    s = 64 / size
    write("logo-lockup.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 64" role="img" aria-label="Ttakkari">
  {mark_svg(INK, PAPER, MINT, scale=s)}
  {shapes_svg(shapes, INK, INK)}
</svg>''')
    # 어두운 면: 타일 없이(잉크 타일은 어둠에 묻힌다) Paper 글자 + Mint 커서·점
    write("logo-lockup-inverse.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 64" role="img" aria-label="Ttakkari">
  {mark_svg(None, PAPER, MINT, scale=s)}
  {shapes_svg(shapes, PAPER, MINT)}
</svg>''')


# ---------- PNG ----------
SS = 4  # 슈퍼샘플


def draw_mark(img: Image.Image, box, tile: str | None, glyph: str, cursor: str, radius_ratio=None):
    x0, y0, side = box
    g = GEOMETRY
    s = side / g["size"]
    d = ImageDraw.Draw(img)
    if tile:
        r = (g["tile_radius"] if radius_ratio is None else g["size"] * radius_ratio) * s
        d.rounded_rectangle([x0, y0, x0 + side - 1, y0 + side - 1], radius=r, fill=tile)
    for key in ("d1", "d2", "stem"):
        d.polygon([(x0 + x * s, y0 + y * s) for x, y in g[key]], fill=glyph)
    cx, cy, cw, ch = g["cursor"]
    d.rounded_rectangle([x0 + cx * s, y0 + cy * s, x0 + (cx + cw) * s - 1, y0 + (cy + ch) * s - 1], radius=g["cursor_radius"] * s, fill=cursor)


def mark_png(px: int, *, tile=INK, radius_ratio=None, bg=(0, 0, 0, 0), inset=0.0) -> Image.Image:
    big = px * SS
    img = Image.new("RGBA", (big, big), bg)
    pad = big * inset
    draw_mark(img, (pad, pad, big - 2 * pad), tile, PAPER, MINT, radius_ratio)
    return img.resize((px, px), Image.LANCZOS)


def build_pngs():
    mark_png(512).save(HERE / "logo-mark.png")
    for px in (16, 32, 48):
        mark_png(px).save(HERE / f"favicon-{px}.png")
    mark_png(256).save(HERE / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    mark_png(512).save(HERE / "app-icon-512.png")
    # maskable: 바깥까지 Ink 로 채우고 심볼은 안전 영역(가운데 80%) 안에. 타일 radius 0(OS 가 깎는다)
    big = 512 * SS
    img = Image.new("RGBA", (big, big), INK)
    pad = big * 0.14
    draw_mark(img, (pad, pad, big - 2 * pad), None, PAPER, MINT)
    img.resize((512, 512), Image.LANCZOS).save(HERE / "app-icon-maskable-512.png")
    # apple-touch: 불투명 정사각형(iOS 가 모서리를 깎는다)
    big = 180 * SS
    img = Image.new("RGBA", (big, big), INK)
    pad = big * 0.08
    draw_mark(img, (pad, pad, big - 2 * pad), None, PAPER, MINT)
    img.convert("RGB").resize((180, 180), Image.LANCZOS).save(HERE / "apple-touch-icon-180.png")


def build_hero():
    """1600×900: Ink 바탕 + 점 격자 + 오른쪽 큰 심볼(타일 없음) + 지시 → 결과물 흐름 조각. 왼쪽 45% 는 제목 자리(HTML)."""
    W, H = 1600 * 2, 900 * 2
    img = Image.new("RGB", (W, H), INK)
    d = ImageDraw.Draw(img)
    step = 48
    for y in range(step // 2, H, step):
        for x in range(step // 2, W, step):
            d.ellipse([x - 2, y - 2, x + 2, y + 2], fill="#1C2122")
    # 큰 심볼
    draw_mark(img, (W * 0.60, H * 0.10, H * 0.62), None, PAPER, MINT)
    # 흐름 조각: 사용자 지시(파란 기운 말풍선) → 결과물 카드(PDF 글리프) + 실행 중 점
    def rr(box, r, fill, outline=None, width=0):
        d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)
    bx, by = W * 0.56, H * 0.74
    rr([bx, by, bx + 520, by + 120], 36, BLUE_TINT)
    rr([bx + 40, by + 38, bx + 400, by + 52], 7, "#3A5A7A")
    rr([bx + 40, by + 70, bx + 300, by + 84], 7, "#2F4A63")
    # 화살표
    ax, ay = bx + 560, by + 60
    d.line([ax, ay, ax + 90, ay], fill=BORDER, width=8)
    d.polygon([(ax + 90, ay - 18), (ax + 120, ay), (ax + 90, ay + 18)], fill=BORDER)
    # 결과물 카드
    cx, cy = ax + 150, by - 10
    rr([cx, cy, cx + 560, cy + 140], 28, SURFACE, outline=BORDER, width=3)
    rr([cx + 28, cy + 30, cx + 108, cy + 110], 18, RED_TINT)
    rr([cx + 52, cy + 50, cx + 84, cy + 90], 6, RED_300)
    rr([cx + 136, cy + 44, cx + 440, cy + 62], 9, "#C9D1D6")
    rr([cx + 136, cy + 82, cx + 320, cy + 96], 7, TEXT_MUTED)
    d.ellipse([cx + 500, cy + 56, cx + 528, cy + 84], fill=MINT)
    img = img.resize((1600, 900), Image.LANCZOS)
    img.save(HERE / "brand-hero.png")
    img.save(HERE / "brand-hero.webp", quality=88, method=6)


if __name__ == "__main__":
    build_svgs()
    build_pngs()
    build_hero()
    print("ok · svg 5 · png 9 · ico 1 · hero 2")
