"""notting 브랜드 자산 생성기 — SVG(컬러·단색·락업 2종·파비콘) + PNG/ICO(파비콘·앱 아이콘) + 히어로.

심볼 = 잉크 타일 위 문서 줄 셋 + verdigris 근거 마커. 모든 파일이 같은 GEOMETRY(512 좌표)에서 나온다.
실행: python build-brand-assets.py   (이 디렉터리에서, Pillow 필요)
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent

# 팔레트 — tokens/src/brand.json · palette.json 의 값. 여기서만 hex 를 쓴다(정적 산출물 예외).
INK = "#0A0908"
PAPER = "#FBFBF2"
VERDIGRIS = "#1EA896"
TEAL_800 = "#0D4F46"
TEAL_950 = "#032520"
PERIWINKLE = "#9395D3"

# 512 좌표계. 타일 radius 22%. 줄 셋(둥근 막대) + 오른쪽 세로 마커.
GEOMETRY = {
    "size": 512,
    "tile_radius": 112,
    "lines": [  # (x, y, w, h)
        (116, 156, 212, 40),
        (116, 236, 152, 40),
        (116, 316, 184, 40),
    ],
    "line_radius": 20,
    "marker": (360, 132, 48, 248),  # (x, y, w, h)
    "marker_radius": 24,
}


def rect_svg(x, y, w, h, r, fill):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"/>'


def symbol_body(tile_fill: str | None, line_fill: str, marker_fill: str, offset=(0, 0), scale=1.0) -> str:
    g = GEOMETRY
    ox, oy = offset
    parts = []
    if tile_fill:
        parts.append(rect_svg(ox, oy, g["size"] * scale, g["size"] * scale, g["tile_radius"] * scale, tile_fill))
    for (x, y, w, h) in g["lines"]:
        parts.append(rect_svg(ox + x * scale, oy + y * scale, w * scale, h * scale, g["line_radius"] * scale, line_fill))
    mx, my, mw, mh = g["marker"]
    parts.append(rect_svg(ox + mx * scale, oy + my * scale, mw * scale, mh * scale, g["marker_radius"] * scale, marker_fill))
    return "\n  ".join(parts)


def svg_document(body: str, viewbox: str, title: str, width=None, height=None, attributes="") -> str:
    size_attr = f' width="{width}" height="{height}"' if width and height else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}"{size_attr} role="img" aria-label="{title}" {attributes}>\n'
        f"  <title>{title}</title>\n  {body}\n</svg>\n"
    )


def write(name: str, text: str) -> None:
    (HERE / name).write_text(text, encoding="utf-8", newline="\n")


def build_svgs() -> None:
    write("logo-mark.svg", svg_document(symbol_body(INK, PAPER, VERDIGRIS), "0 0 512 512", "notting 심볼"))
    write("favicon.svg", svg_document(symbol_body(INK, PAPER, VERDIGRIS), "0 0 512 512", "notting 파비콘", 64, 64))
    # 단색: 타일 없이 줄 + 마커만 currentColor. 작은 UI·마스크·인쇄.
    write(
        "logo-mark-mono.svg",
        svg_document(symbol_body(None, "currentColor", "currentColor"), "0 0 512 512", "notting 단색 심볼", attributes=f'color="{INK}"'),
    )
    # 락업: 심볼 64 + 워드마크. 폭 = 64 + 22(gap 0.35) + 텍스트.
    word_x = 64 + 22
    for name, tile, line, word in (
        ("logo-lockup.svg", INK, PAPER, INK),
        ("logo-lockup-inverse.svg", PAPER, INK, PAPER),
    ):
        body = symbol_body(tile, line, VERDIGRIS, scale=64 / 512)
        body += (
            f'\n  <text x="{word_x}" y="46" fill="{word}" font-family="Pretendard Variable, Pretendard, system-ui, sans-serif" '
            f'font-size="40" font-weight="700" letter-spacing="-0.8">notting</text>'
        )
        write(name, svg_document(body, "0 0 232 64", "notting 로고"))


def draw_symbol(size: int, tile: str | None = INK, line: str = PAPER, marker: str = VERDIGRIS, supersample: int = 4) -> Image.Image:
    g = GEOMETRY
    s = g["size"] * supersample
    k = s / g["size"]
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if tile:
        d.rounded_rectangle((0, 0, s - 1, s - 1), radius=int(g["tile_radius"] * k), fill=tile)
    for (x, y, w, h) in g["lines"]:
        d.rounded_rectangle((x * k, y * k, (x + w) * k, (y + h) * k), radius=int(g["line_radius"] * k), fill=line)
    mx, my, mw, mh = g["marker"]
    d.rounded_rectangle((mx * k, my * k, (mx + mw) * k, (my + mh) * k), radius=int(g["marker_radius"] * k), fill=marker)
    return im.resize((size, size), Image.LANCZOS)


def build_rasters() -> None:
    icon = draw_symbol(512)
    icon.save(HERE / "app-icon-512.png")
    for px in (16, 32, 48):
        draw_symbol(px).save(HERE / f"favicon-{px}.png")
    draw_symbol(48).save(HERE / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    draw_symbol(512).save(HERE / "logo-mark.png")


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def hex_rgb(h: str):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def build_hero(width=1600, height=900) -> None:
    """gradient.brand(135deg: teal.800 → verdigris 60% → periwinkle) 위에 큰 심볼과 종이 줄. 왼쪽 45% 는 글자 여백."""
    stops = [(0.0, hex_rgb(TEAL_800)), (0.6, hex_rgb(VERDIGRIS)), (1.0, hex_rgb(PERIWINKLE))]
    im = Image.new("RGB", (width, height))
    px = im.load()
    diag = width + height
    for y in range(height):
        for x in range(width):
            t = (x + y) / diag
            for i in range(len(stops) - 1):
                t0, c0 = stops[i]
                t1, c1 = stops[i + 1]
                if t <= t1:
                    px[x, y] = lerp(c0, c1, (t - t0) / (t1 - t0))
                    break
    # 옅은 종이 줄(장식) — 오른쪽 아래, 심볼 뒤
    deco = Image.new("RGBA", im.size, (0, 0, 0, 0))
    dd = ImageDraw.Draw(deco)
    for i, w in enumerate((520, 380, 460, 300)):
        y = 560 + i * 72
        dd.rounded_rectangle((980, y, 980 + w, y + 28), radius=14, fill=(251, 251, 242, 28))
    im = Image.alpha_composite(im.convert("RGBA"), deco)
    # 심볼 480, 오른쪽 중앙(70%)
    sym = draw_symbol(480)
    shadow = Image.new("RGBA", im.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sx, sy = 1120 - 240, 450 - 240
    sd.rounded_rectangle((sx + 12, sy + 28, sx + 480 + 12, sy + 480 + 28), radius=105, fill=(3, 37, 32, 90))
    im = Image.alpha_composite(im, shadow)
    im.alpha_composite(sym, (sx, sy))
    rgb = im.convert("RGB")
    rgb.save(HERE / "brand-hero.png", optimize=True)
    rgb.save(HERE / "brand-hero.webp", quality=88, method=6)


if __name__ == "__main__":
    build_svgs()
    build_rasters()
    build_hero()
    print("ok · notting brand assets:", ", ".join(sorted(p.name for p in HERE.iterdir() if p.suffix in {".svg", ".png", ".ico", ".webp"})))
