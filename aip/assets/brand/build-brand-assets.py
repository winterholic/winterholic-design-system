"""AIP 브랜드 자산 생성기 — SVG(컬러·단색·락업 2종·파비콘) + PNG/ICO(파비콘·앱 아이콘·설치 아이콘) + 히어로.

심볼 = AIP Blue 타일 위 흰 Λ(두 획) + Λ 를 가로지르는 AIP Yellow 형광펜 막대.
'선언된 의도(Intent)를 형광펜으로 표시한다' — 막대가 A 의 가로획이 되어 Λ 가 A 로 읽힌다.
워드마크 AIP 도 글꼴이 아니라 같은 좌표계의 획으로 그린다(폰트가 없는 환경에서도 같은 모양).
모든 파일이 GEOMETRY 하나에서 나온다. 실행: python3 build-brand-assets.py (이 디렉터리, Pillow 필요)
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent

# 팔레트 — tokens/src/brand.json · palette.json 과 같은 값. 정적 산출물이라 여기서만 hex 를 쓴다(docs/01 §7).
BLUE = "#1C77C3"
YELLOW = "#F5E663"
TANGERINE = "#FAA381"
CHARCOAL = "#3D3B30"
SLATE = "#4D5061"
WHITE = "#FFFFFF"
NEUTRAL_50 = "#F7F7F4"
NEUTRAL_950 = "#211F19"
NEUTRAL_900 = "#323029"
BLUE_50 = "#F1F8FF"
SLATE_900 = "#2D2F3C"

# 512 좌표계. 타일 radius 22%(다른 시스템과 같은 비율).
# Λ 는 획이 아니라 다각형이다 — 발은 수평으로 잘리고 꼭대기는 평평하다(제도용 글자처럼 정확하게, 둥근 장난감 글자가 아니게).
GEOMETRY = {
    "size": 512,
    "tile_radius": 112,
    # 바깥 왼발 → 꼭대기 왼쪽 → 꼭대기 오른쪽 → 바깥 오른발 → 안쪽 오른발 → 안쪽 꼭짓점 → 안쪽 왼발. 발 두께 60
    "lambda": [(134, 392), (240, 112), (272, 112), (378, 392), (318, 392), (256, 228), (194, 392)],
    "bar": (150, 270, 212, 48),         # 형광펜 막대 (x, y, w, h) — 두 다리 밖으로 조금 나와 '긋는' 느낌. Λ 뒤에 깔린다
    "bar_radius": 6,                    # 마커 팁처럼 거의 각지게
}

# 워드마크(락업 높이 64 기준, 대문자 높이 34 = 15~49). A 는 심볼의 Λ 다각형을 그대로 줄여 쓴다
WORD = {"top": 15, "bottom": 49, "stem": 7}


def scaled(points, s, ox, oy):
    return [(ox + x * s, oy + y * s) for x, y in points]


def path_d(points) -> str:
    return "M" + " L".join(f"{x:g} {y:g}" for x, y in points) + " Z"


def mark_svg(tile: str | None, legs: str, bar: str, scale=1.0, offset=(0, 0)) -> str:
    g = GEOMETRY
    ox, oy = offset
    s = scale
    parts = []
    if tile:
        parts.append(f'<rect x="{ox:g}" y="{oy:g}" width="{g["size"] * s:g}" height="{g["size"] * s:g}" rx="{g["tile_radius"] * s:g}" fill="{tile}"/>')
    bx, by, bw, bh = g["bar"]
    parts.append(f'<rect x="{ox + bx * s:g}" y="{oy + by * s:g}" width="{bw * s:g}" height="{bh * s:g}" rx="{g["bar_radius"] * s:g}" fill="{bar}"/>')
    parts.append(f'<path d="{path_d(scaled(g["lambda"], s, ox, oy))}" fill="{legs}"/>')
    return "\n  ".join(parts)


def word_parts(x0: float):
    """AIP 워드마크 도형 목록(kind, data). 반환: (도형들, 오른쪽 끝 x)."""
    t, b, w = WORD["top"], WORD["bottom"], WORD["stem"]
    h = b - t
    # A: 심볼 Λ 의 높이(112~392 = 280)를 대문자 높이 34 로
    lam = GEOMETRY["lambda"]
    s = h / 280
    a_pts = [(x0 + (x - 134) * s, t + (y - 112) * s) for x, y in lam]
    a_right = x0 + (378 - 134) * s
    shapes = [("poly", a_pts)]
    # A 가로획: 안쪽 꼭짓점 아래, 획 두께만큼
    cy = t + h * 0.62
    shapes.append(("rect", (x0 + (196 - 134) * s, cy, (316 - 196) * s, w * 0.9)))
    i_x = a_right + 5  # A 의 사선이 시각 간격을 넓히므로 I 를 당긴다
    shapes.append(("rect", (i_x, t, w, h)))
    p_x = i_x + w + 8
    shapes.append(("rect", (p_x, t, w, h)))
    bowl_h = h * 0.58
    shapes.append(("bowl", (p_x, t, bowl_h, w)))
    right = p_x + w + bowl_h / 2 + 3
    return shapes, right


def word_svg(x0: float, color: str) -> tuple[str, float]:
    shapes, right = word_parts(x0)
    out = []
    for kind, data in shapes:
        if kind == "poly":
            out.append(f'<path d="{path_d(data)}" fill="{color}"/>')
        elif kind == "rect":
            x, y, w, h = data
            out.append(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" fill="{color}"/>')
        else:  # P 의 고리: 바깥 반원 − 안쪽 반원
            x, y, bh, w = data
            r = bh / 2
            inner = r - w
            d = (f"M{x:g} {y:g} H{x + w + 3:g} A{r:g} {r:g} 0 0 1 {x + w + 3:g} {y + bh:g} H{x:g} Z "
                 f"M{x + w:g} {y + w:g} V{y + bh - w:g} H{x + w + 3:g} A{inner:g} {inner:g} 0 0 0 {x + w + 3:g} {y + w:g} Z")
            out.append(f'<path d="{d}" fill="{color}" fill-rule="evenodd"/>')
    return "\n  ".join(out), right


def svg_document(body: str, viewbox: str, title: str, width=None, height=None, attributes="") -> str:
    size_attr = f' width="{width}" height="{height}"' if width and height else ""
    attr = f" {attributes}" if attributes else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}"{size_attr} role="img" aria-label="{title}"{attr}>\n'
        f"  <title>{title}</title>\n  {body}\n</svg>\n"
    )


def write(name: str, text: str) -> None:
    (HERE / name).write_text(text, encoding="utf-8", newline="\n")


def build_svgs() -> None:
    write("logo-mark.svg", svg_document(mark_svg(BLUE, WHITE, YELLOW), "0 0 512 512", "AIP 심볼"))
    write("favicon.svg", svg_document(mark_svg(BLUE, WHITE, YELLOW), "0 0 512 512", "AIP 파비콘", 64, 64))
    # 단색: 타일 없이 막대 + Λ 를 currentColor 하나로. 막대는 투명도를 낮춰 Λ 와 겹친 자리가 읽히게 한다
    mono = mark_svg(None, "currentColor", "currentColor").replace('fill="currentColor"/>', 'fill="currentColor" fill-opacity="0.45"/>', 1)
    write("logo-mark-mono.svg", svg_document(mono, "0 0 512 512", "AIP 단색 심볼", attributes=f'color="{CHARCOAL}"'))
    # 락업: 심볼 64 + 간격 22(심볼 높이의 0.35) + 획 워드마크
    for name, tile, legs, word in (
        ("logo-lockup.svg", BLUE, WHITE, CHARCOAL),
        ("logo-lockup-inverse.svg", WHITE, BLUE, WHITE),
    ):
        mark = mark_svg(tile, legs, YELLOW, scale=64 / 512)
        wbody, right = word_svg(64 + 22, word)
        width = math.ceil(right + 2)
        write(name, svg_document(mark + "\n  " + wbody, f"0 0 {width} 64", "AIP 로고"))


# ---------- 래스터(4배 슈퍼샘플 후 축소) ----------
def draw_mark(img: Image.Image, size: int, offset=(0, 0), tile=BLUE, legs=WHITE, bar=YELLOW, tile_scale=1.0) -> None:
    g = GEOMETRY
    s = size / g["size"]
    d = ImageDraw.Draw(img)
    ox, oy = offset
    if tile:
        inset = size * (1 - tile_scale) / 2
        d.rounded_rectangle((ox + inset, oy + inset, ox + size - inset, oy + size - inset), radius=g["tile_radius"] * s * tile_scale, fill=tile)
    bx, by, bw, bh = g["bar"]
    d.rounded_rectangle((ox + bx * s, oy + by * s, ox + (bx + bw) * s, oy + (by + bh) * s), radius=g["bar_radius"] * s, fill=bar)
    d.polygon(scaled(g["lambda"], s, ox, oy), fill=legs)


def render_mark(size: int, transparent_corners=True, tile_scale=1.0, bg=None) -> Image.Image:
    big = size * 4
    img = Image.new("RGBA", (big, big), bg or (0, 0, 0, 0))
    draw_mark(img, big, tile_scale=tile_scale)
    return img.resize((size, size), Image.LANCZOS)


def build_rasters() -> None:
    for s in (16, 32, 48):
        render_mark(s).save(HERE / f"favicon-{s}.png")
    render_mark(512).save(HERE / "app-icon-512.png")
    render_mark(512).save(HERE / "logo-mark.png")
    # maskable: 안전 영역 80% 안에 심볼, 바깥은 타일색으로 꽉 채운다
    big = 2048
    img = Image.new("RGBA", (big, big), BLUE)
    inner = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw_mark(inner, big, tile=None)
    inner = inner.resize((int(big * 0.8), int(big * 0.8)), Image.LANCZOS)
    img.alpha_composite(inner, (int(big * 0.1), int(big * 0.1)))
    img.resize((512, 512), Image.LANCZOS).save(HERE / "app-icon-maskable-512.png")
    # apple-touch: 불투명(iOS 가 모서리를 깎는다)
    img = Image.new("RGBA", (720, 720), BLUE)
    draw_mark(img, 720, tile=None)
    img.convert("RGB").resize((180, 180), Image.LANCZOS).save(HERE / "apple-touch-icon-180.png")
    icons = [render_mark(s) for s in (16, 32, 48)]
    icons[2].save(HERE / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=icons[:2])


def build_hero() -> None:
    """1600×900. Charcoal 바탕 + 제도용 점 격자 + 오른쪽 심볼 + Intent→Runtime→Data 흐름 조각. 왼쪽 45% 는 제목 자리."""
    W, H, k = 1600, 900, 2
    img = Image.new("RGBA", (W * k, H * k), NEUTRAL_950)
    d = ImageDraw.Draw(img)
    grid = 24 * k
    for y in range(grid // 2, H * k, grid):
        for x in range(grid // 2, W * k, grid):
            d.ellipse((x - 1.4 * k, y - 1.4 * k, x + 1.4 * k, y + 1.4 * k), fill=NEUTRAL_900)
    # 오른쪽 큰 심볼
    mark = 340 * k
    mx, my = 1040 * k, 150 * k
    draw_mark(img, mark, offset=(mx, my))
    # 흐름 조각: Intent(노랑) → Runtime(파랑 외곽) → Data(slate), 심볼 아래
    def node(x, y, w, h, fill, outline=None, text_bars=(), bar_fill=CHARCOAL):
        d.rounded_rectangle((x * k, y * k, (x + w) * k, (y + h) * k), radius=8 * k, fill=fill, outline=outline, width=2 * k)
        for i, bw in enumerate(text_bars):
            d.rounded_rectangle(((x + 16) * k, (y + 18 + i * 16) * k, (x + 16 + bw) * k, (y + 24 + i * 16) * k), radius=3 * k, fill=bar_fill)
    y0 = 560
    node(900, y0, 168, 64, YELLOW, text_bars=(96, 56), bar_fill=CHARCOAL)
    node(1124, y0, 168, 64, NEUTRAL_950, outline=BLUE, text_bars=(110, 72), bar_fill=BLUE)
    node(1348, y0, 168, 64, SLATE, text_bars=(80, 48), bar_fill=NEUTRAL_50)
    for x1, x2 in ((1068, 1124), (1292, 1348)):
        d.line(((x1 + 8) * k, (y0 + 32) * k, (x2 - 10) * k, (y0 + 32) * k), fill=NEUTRAL_50, width=3 * k)
        d.polygon((((x2 - 4) * k, (y0 + 32) * k), ((x2 - 14) * k, (y0 + 26) * k), ((x2 - 14) * k, (y0 + 38) * k)), fill=NEUTRAL_50)
    # 권한 경계: Runtime 둘레의 tangerine 점선
    dash, gap = 10 * k, 8 * k
    x1, y1, x2, y2 = 1108 * k, (y0 - 16) * k, 1308 * k, (y0 + 80) * k
    for xs in range(x1, x2, dash + gap):
        d.line((xs, y1, min(xs + dash, x2), y1), fill=TANGERINE, width=2 * k)
        d.line((xs, y2, min(xs + dash, x2), y2), fill=TANGERINE, width=2 * k)
    for ys in range(y1, y2, dash + gap):
        d.line((x1, ys, x1, min(ys + dash, y2)), fill=TANGERINE, width=2 * k)
        d.line((x2, ys, x2, min(ys + dash, y2)), fill=TANGERINE, width=2 * k)
    out = img.resize((W, H), Image.LANCZOS).convert("RGB")
    out.save(HERE / "brand-hero.png", optimize=True)
    out.save(HERE / "brand-hero.webp", quality=88, method=6)


if __name__ == "__main__":
    build_svgs()
    build_rasters()
    build_hero()
    print("ok · svg 5 · png/ico 9 · hero 2")
