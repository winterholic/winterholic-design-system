"""Ttakkari 브랜드 자산 생성기: SVG(컬러·단색·락업 2종·파비콘) + PNG/ICO(파비콘·앱 아이콘·설치 아이콘) + 히어로.

심볼 = Blue 타일 위 토끼 마스코트 얼굴(2026-10-17 사용자 확정). 마스코트는 생성형 이미지(brand/generated)라 좌표가 아니라
그 원본 PNG 가 정본이고, 이 스크립트는 모서리 깎기·포맷·크기 선택만 한다(그림을 새로 그리지 않는다).
작은 크기용 아이콘(16·32·48·180·192·512, maskable)은 생성 세션이 얼굴·귀만 굵은 외곽선으로 단순화해 크기별로 내보낸 것을 그대로 쓴다.
전신은 16px 에서 토끼로 읽히지 않았다(docs/23 §4.6). 전신은 큰 면(히어로·일러스트)에만 쓴다.
워드마크 ttakkari 는 여전히 글꼴이 아니라 도형이다(폰트가 없는 환경에서도 같은 모양). i 의 점은 Mint 다.
옛 '따' 심볼은 앱 안 에이전트 아바타(.tk-avatar--agent)가 CSS 로 계속 그린다. 마스코트(브랜드 얼굴)와 아바타(정보 표지)는 층이 다르다.
실행: python3 build-brand-assets.py (이 디렉터리, Pillow 필요)
"""
from __future__ import annotations

import base64
import io
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent
GENERATED = HERE.parents[1] / "brand" / "generated"
ICON_DIR = GENERATED / "icons"                                         # 작은 크기 전용 아이콘(icon-mascot-<크기>.png, Blue 타일 + 얼굴)
FACE_SRC = ICON_DIR / "favicon-simple-transparent.png"                  # 단색 실루엣용 얼굴(투명 배경)
MASTER_SRC = GENERATED / "mascot" / "rabbit-identity-master-1254.png"  # 전신 기준 원본

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
GEOMETRY = {"size": 512, "tile_radius": 112}
EMBED_PX = 256          # SVG 에 박는 얼굴 PNG 변(px). 헤더 24·로그인 48 에 2x 면 충분하다
MASKABLE_ZOOM_OUT = 0.06   # maskable 원본 각 변에 덧대는 비율(내용은 1/(1+2×0.06) ≈ 0.89 배로 줄어든다)
HALO = 0.028            # 타일 없는 면(히어로)에서 마스코트 둘레 Paper 띠 두께(변 대비)

# 워드마크(락업 높이 64 기준). 바닥선 44, x-height 22(위 22), 어센더 위 10. 획 6.
WORD = {"base": 44, "x_top": 22, "asc": 10, "t_top": 13, "stroke": 6, "gap": 4}


def path_d(points) -> str:
    return "M" + " L".join(f"{x:g} {y:g}" for x, y in points) + " Z"


def scaled(points, s, ox, oy):
    return [(ox + x * s, oy + y * s) for x, y in points]


def _crop_square(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    im = im.crop(im.getchannel("A").getbbox())
    side = max(im.size)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    return sq


def load_face() -> Image.Image:
    """단순화 마스코트를 투명 여백 없이 정사각으로 자른다."""
    return _crop_square(Image.open(FACE_SRC))


def with_halo(im: Image.Image, color: str = PAPER) -> Image.Image:
    """투명 이미지 둘레에 단색 띠를 두른다(스티커). 어두운 면에서 Ink 외곽선이 묻히는 것을 막는다."""
    side = im.width
    r = max(1, round(side * HALO))
    pad = r + 1
    canvas = Image.new("RGBA", (side + 2 * pad, side + 2 * pad), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad))
    alpha = canvas.getchannel("A").filter(ImageFilter.MaxFilter(2 * r + 1))
    ring = Image.new("RGBA", canvas.size, color)
    ring.putalpha(alpha)
    ring.alpha_composite(canvas)
    return _crop_square(ring)


def png_data_uri(im: Image.Image, px: int) -> str:
    small = im.resize((px, px), Image.LANCZOS)
    try:
        small = small.quantize(colors=128, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
    except ValueError:
        pass
    buf = io.BytesIO()
    small.save(buf, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def icon(name: str) -> Image.Image:
    return Image.open(ICON_DIR / f"icon-mascot-{name}.png").convert("RGBA")


def rounded(im: Image.Image) -> Image.Image:
    """정사각 아이콘의 모서리를 타일 비율(22%)로 깎아 투명하게 만든다. 마스크는 4배로 그려 줄인다(계단 방지)."""
    px = im.width
    big = px * SS
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, big - 1, big - 1], radius=big * GEOMETRY["tile_radius"] / GEOMETRY["size"], fill=255)
    out = im.copy()
    out.putalpha(mask.resize((px, px), Image.LANCZOS))
    return out


def image_svg(uri: str, scale=1.0, offset=(0, 0), fill: float = 1.0, filter_id: str | None = None) -> str:
    side = GEOMETRY["size"] * scale
    f = side * fill
    ox, oy = offset
    flt = f' filter="url(#{filter_id})"' if filter_id else ""
    return f'<image x="{ox + (side - f) / 2:g}" y="{oy + (side - f) / 2:g}" width="{f:g}" height="{f:g}" href="{uri}"{flt}/>'


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
    uri = png_data_uri(rounded(icon("512")), EMBED_PX)
    face_uri = png_data_uri(load_face(), EMBED_PX)
    write("logo-mark.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-label="Ttakkari">
  {image_svg(uri)}
</svg>''')
    # 단색: 얼굴 실루엣 하나(currentColor). 타일 없음. 이미지의 알파로 색을 채운다
    write("logo-mark-mono.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-label="Ttakkari" color="{INK}">
  <defs>
    <filter id="mono" color-interpolation-filters="sRGB">
      <feFlood flood-color="currentColor" result="color"/>
      <feComposite in="color" in2="SourceAlpha" operator="in"/>
    </filter>
  </defs>
  {image_svg(face_uri, fill=0.96, filter_id="mono")}
</svg>''')
    write("favicon.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">
  {image_svg(uri)}
</svg>''')
    # 락업: 64 높이. 심볼 64 + 간격 14 + 워드마크
    shapes, right = word_shapes(64 + 14)
    width = math.ceil(right + 2)
    s = 64 / size
    write("logo-lockup.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 64" role="img" aria-label="Ttakkari">
  {image_svg(uri, scale=s)}
  {shapes_svg(shapes, INK, INK)}
</svg>''')
    # 어두운 면: Blue 타일은 어둠에서도 보이므로 그대로 두고 워드마크만 Paper + Mint 점으로 바꾼다
    write("logo-lockup-inverse.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 64" role="img" aria-label="Ttakkari">
  {image_svg(uri, scale=s)}
  {shapes_svg(shapes, PAPER, MINT)}
</svg>''')


# ---------- PNG ----------
SS = 4  # 슈퍼샘플


def build_pngs():
    rounded(icon("512")).save(HERE / "logo-mark.png")
    rounded(icon("512")).save(HERE / "app-icon-512.png")
    rounded(icon("192")).save(HERE / "app-icon-192.png")
    favicons = {px: rounded(icon(str(px))) for px in (16, 32, 48)}
    for px, im in favicons.items():
        im.save(HERE / f"favicon-{px}.png")
    # ICO 는 크기별 손질본(16·32·48)을 그대로 담는다. 한 장을 줄이면 16px 에서 귀가 뭉개진다
    favicons[48].save(HERE / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[favicons[16], favicons[32]])
    # maskable: 바깥까지 Blue 로 채우고 얼굴·귀는 안전 영역(가운데 80% 원) 안에. OS 가 모서리를 깎는다.
    # 생성 세션 원본은 귀 끝이 80% 원을 약 2% 넘어서(원형 마스크에서 잘림), 가장자리 색을 늘려 바깥을 채우며 한 번 더 줄인다.
    src = icon("maskable-1024").convert("RGB")
    pad = round(src.width * MASKABLE_ZOOM_OUT)
    padded = Image.fromarray(np.pad(np.asarray(src), ((pad, pad), (pad, pad), (0, 0)), mode="edge"))
    padded.resize((512, 512), Image.LANCZOS).save(HERE / "app-icon-maskable-512.png")
    # apple-touch: 불투명 정사각형(iOS 가 모서리를 깎는다)
    icon("180").convert("RGB").save(HERE / "apple-touch-icon-180.png")


def build_hero():
    """1600×900: Ink 바탕 + 점 격자 + 오른쪽 큰 마스코트(타일 없음) + 지시 → 결과물 흐름 조각. 왼쪽 45% 는 제목 자리(HTML)."""
    W, H = 1600 * 2, 900 * 2
    img = Image.new("RGB", (W, H), INK)
    d = ImageDraw.Draw(img)
    step = 48
    for y in range(step // 2, H, step):
        for x in range(step // 2, W, step):
            d.ellipse([x - 2, y - 2, x + 2, y + 2], fill="#1C2122")
    # 큰 마스코트(전신, Paper 띠). 타일이 없는 어두운 면이라 외곽선이 묻히지 않게 띠를 두른다
    hero = with_halo(_crop_square(Image.open(MASTER_SRC)))
    side = round(H * 0.68)
    hero = hero.resize((side, side), Image.LANCZOS)
    img.paste(hero, (round(W * 0.62), round(H * 0.04)), hero)
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
    print("ok · svg 5 · png 10 · ico 1 · hero 2")
