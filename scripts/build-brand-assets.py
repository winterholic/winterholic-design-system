"""Build deterministic brand raster/SVG derivatives for stock-gosu and memoir."""

from __future__ import annotations

import base64
import io
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
RESAMPLING = Image.Resampling.LANCZOS


def png_data_uri(image: Image.Image, size: int, alpha_threshold: int = 1) -> str:
    canvas = fit_mark(image, size, 0, alpha_threshold)
    output = io.BytesIO()
    canvas.save(output, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(output.getvalue()).decode("ascii")


def fit_mark(image: Image.Image, size: int, padding: int, alpha_threshold: int = 1) -> Image.Image:
    source = image.convert("RGBA")
    alpha = source.getchannel("A").point(lambda value: 255 if value >= alpha_threshold else 0)
    alpha_box = alpha.getbbox()
    if alpha_box:
        source = source.crop(alpha_box)
    target = max(1, size - padding * 2)
    scale = min(target / source.width, target / source.height)
    source = source.resize(
        (max(1, round(source.width * scale)), max(1, round(source.height * scale))),
        RESAMPLING,
    )
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(source, ((size - source.width) // 2, (size - source.height) // 2))
    return canvas


def tile_icon(
    source: Image.Image,
    size: int,
    background: tuple[int, int, int, int],
    padding_ratio: float,
    alpha_threshold: int,
) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), background)
    mark = fit_mark(source, size, max(1, round(size * padding_ratio)), alpha_threshold)
    canvas.alpha_composite(mark)
    return canvas


def save_icon_set(
    source: Image.Image,
    directory: Path,
    padding_ratio: float,
    background: tuple[int, int, int, int],
    alpha_threshold: int = 1,
) -> None:
    mark = fit_mark(source, 1024, round(1024 * padding_ratio), alpha_threshold)
    mark.save(directory / "logo-mark.png", optimize=True)
    for size in (16, 32, 48):
        icon = tile_icon(source, size, background, padding_ratio, alpha_threshold)
        icon.save(directory / f"favicon-{size}.png", optimize=True)
    app = tile_icon(source, 512, background, padding_ratio, alpha_threshold)
    app.save(directory / "app-icon-512.png", optimize=True)
    app.save(directory / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


def svg_document(body: str, view_box: str, title: str, width: int | None = None, height: int | None = None) -> str:
    dimensions = f' width="{width}" height="{height}"' if width and height else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}"{dimensions} role="img" aria-labelledby="title">\n'
        f'  <title id="title">{title}</title>\n{body}\n</svg>\n'
    )


def stock_svgs(source: Image.Image, directory: Path) -> None:
    mark_uri = png_data_uri(source, 512, 4)
    favicon_uri = png_data_uri(source, 128, 4)
    mark = svg_document(f'  <image width="512" height="512" href="{mark_uri}"/>', "0 0 512 512", "stock-gosu 파랑새 심볼")
    favicon_body = f'''  <rect width="64" height="64" rx="14" fill="#E8F3FF"/>
  <image x="4" y="4" width="56" height="56" href="{favicon_uri}"/>'''
    favicon = svg_document(favicon_body, "0 0 64 64", "stock-gosu 파비콘", 64, 64)
    mono_body = '''  <path fill="currentColor" d="M14 36c-4-14 4-26 18-28 11-2 21 3 26 12l6 1-6 5c0 17-12 30-29 30-10 0-19-4-25-11 8 0 15-3 20-8-4 1-7 1-10-1Z"/>
  <path fill="currentColor" d="M20 17c4 8 11 13 22 17-7 7-15 11-25 12 5-7 6-17 3-29Z" opacity=".72"/>
  <circle cx="45" cy="20" r="2.4" fill="white"/>'''
    mono = svg_document(mono_body, "0 0 64 64", "stock-gosu 단색 파랑새 심볼")
    for inverse, filename in ((False, "logo-lockup.svg"), (True, "logo-lockup-inverse.svg")):
        word = "#FFFFFF" if inverse else "#191F28"
        body = f'''  <image x="0" y="0" width="64" height="64" href="{favicon_uri}"/>
  <text x="76" y="43" fill="{word}" font-family="Pretendard, Inter, system-ui, sans-serif" font-size="31" font-weight="700" letter-spacing="-0.8">stock-gosu</text>'''
        (directory / filename).write_text(svg_document(body, "0 0 258 64", "stock-gosu 로고"), encoding="utf-8")
    (directory / "logo-mark.svg").write_text(mark, encoding="utf-8")
    (directory / "logo-mark-mono.svg").write_text(mono, encoding="utf-8")
    (directory / "favicon.svg").write_text(favicon, encoding="utf-8")
    shutil.copyfile(directory / "logo-mark.svg", directory / "stock-gosu.svg")


MEMOIR_MARK = '''  <defs>
    <linearGradient id="petal" x1="8" y1="3" x2="58" y2="61" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFC1D1"/><stop offset=".5" stop-color="#FF82A9"/><stop offset="1" stop-color="#F45E93"/>
    </linearGradient>
  </defs>
  <path d="M32 27.1C24.6 17.5 30.1 7.8 38.3 9.5C44.7 10.8 46.1 18.8 41.1 24.7C49.4 20.7 57.2 25.4 55.2 32.8C53.5 39.3 45.7 40.5 39.8 35.4C43.8 43.8 39.1 51.6 31.6 49.6C25.2 47.9 24 40.2 29.1 34.2C20.8 38.2 13 33.5 15 26C16.7 19.7 24.5 18.3 30.5 23.4C26.9 16.5 28.6 10.8 33.5 8.5" fill="url(#petal)"/>
  <path d="M10.7 51.8C11.8 43.9 15 37.6 21.5 32.2" stroke="#A1385E" stroke-width="4" stroke-linecap="round"/>'''


def memoir_svgs(directory: Path) -> None:
    mark = svg_document(MEMOIR_MARK, "0 0 64 64", "memoir 꽃잎 심볼", 64, 64)
    mono_body = '''  <path fill="currentColor" d="M32 27.1C24.6 17.5 30.1 7.8 38.3 9.5C44.7 10.8 46.1 18.8 41.1 24.7C49.4 20.7 57.2 25.4 55.2 32.8C53.5 39.3 45.7 40.5 39.8 35.4C43.8 43.8 39.1 51.6 31.6 49.6C25.2 47.9 24 40.2 29.1 34.2C20.8 38.2 13 33.5 15 26C16.7 19.7 24.5 18.3 30.5 23.4C26.9 16.5 28.6 10.8 33.5 8.5"/>
  <path d="M10.7 51.8C11.8 43.9 15 37.6 21.5 32.2" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'''
    mono = svg_document(mono_body, "0 0 64 64", "memoir 단색 꽃잎 심볼", 64, 64)
    for inverse, filename in ((False, "logo-lockup.svg"), (True, "logo-lockup-inverse.svg")):
        first = "#FF9DBB" if inverse else "#A1385E"
        rest = "#FFF9F8" if inverse else "#231917"
        body = f'''  <g transform="translate(0 0)">{MEMOIR_MARK}</g>
  <text x="76" y="43" font-family="Plus Jakarta Sans, Pretendard, system-ui, sans-serif" font-size="32" font-weight="800" letter-spacing="-1"><tspan fill="{first}">m</tspan><tspan fill="{rest}">emoir</tspan></text>'''
        (directory / filename).write_text(svg_document(body, "0 0 198 64", "memoir 로고"), encoding="utf-8")
    (directory / "logo-mark.svg").write_text(mark, encoding="utf-8")
    (directory / "logo-mark-mono.svg").write_text(mono, encoding="utf-8")
    favicon_body = f'''  <rect width="64" height="64" rx="14" fill="#FFF0F3"/>
  <g transform="translate(3 3) scale(.90625)">{MEMOIR_MARK}</g>'''
    (directory / "favicon.svg").write_text(svg_document(favicon_body, "0 0 64 64", "memoir 파비콘", 64, 64), encoding="utf-8")
    shutil.copyfile(directory / "logo-mark.svg", directory / "icon.svg")


def vertical_gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    width, height = size
    image = Image.new("RGB", size)
    draw = ImageDraw.Draw(image)
    for y in range(height):
        ratio = y / max(1, height - 1)
        color = tuple(round(a + (b - a) * ratio) for a, b in zip(top, bottom))
        draw.line((0, y, width, y), fill=color)
    return image.convert("RGBA")


def stock_hero(source: Image.Image) -> Image.Image:
    hero = vertical_gradient((1600, 900), (18, 48, 113), (33, 111, 232))
    grid = Image.new("RGBA", hero.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(grid)
    for x in range(0, 1601, 80):
        draw.line((x, 0, x, 900), fill=(255, 255, 255, 16), width=1)
    for y in range(20, 901, 80):
        draw.line((0, y, 1600, y), fill=(255, 255, 255, 16), width=1)
    draw.line([(0, 690), (180, 610), (340, 650), (510, 500), (690, 530), (860, 360), (1030, 420), (1200, 245), (1420, 300), (1600, 170)], fill=(99, 210, 255, 82), width=8, joint="curve")
    hero.alpha_composite(grid)
    glow = Image.new("RGBA", hero.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((850, 60, 1680, 890), fill=(89, 185, 255, 92))
    glow = glow.filter(ImageFilter.GaussianBlur(110))
    hero.alpha_composite(glow)
    bird = fit_mark(source, 720, 20)
    hero.alpha_composite(bird, (830, 90))
    return hero.convert("RGB")


def memoir_hero(mascot: Image.Image) -> Image.Image:
    hero = vertical_gradient((1600, 900), (255, 249, 248), (255, 235, 231))
    blobs = Image.new("RGBA", hero.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(blobs)
    draw.ellipse((-260, 480, 520, 1170), fill=(255, 130, 169, 42))
    draw.ellipse((920, -260, 1740, 550), fill=(127, 149, 209, 45))
    draw.ellipse((1080, 410, 1710, 1040), fill=(161, 56, 94, 24))
    blobs = blobs.filter(ImageFilter.GaussianBlur(80))
    hero.alpha_composite(blobs)
    card = Image.new("RGBA", hero.size, (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.ellipse((885, 80, 1535, 730), fill=(255, 255, 255, 210))
    hero.alpha_composite(card)
    character = mascot.convert("RGB").resize((590, 590), RESAMPLING)
    mask = Image.new("L", character.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 590, 590), fill=255)
    hero.paste(character, (915, 110), mask)
    return hero.convert("RGB")


def save_hero(image: Image.Image, directory: Path) -> None:
    image.save(directory / "brand-hero.png", optimize=True)
    image.save(directory / "brand-hero.webp", "WEBP", quality=88, method=6)


def main() -> None:
    stock_dir = ROOT / "stock-gosu" / "assets" / "brand"
    stock_source = Image.open(stock_dir / "stock-gosu.png").convert("RGBA")
    save_icon_set(stock_source, stock_dir, 0.06, (232, 243, 255, 255), 4)
    stock_svgs(stock_source, stock_dir)
    save_hero(stock_hero(stock_source), stock_dir)
    shutil.copyfile(stock_dir / "favicon.ico", stock_dir / "stock-gosu.ico")

    memoir_dir = ROOT / "memoir" / "assets" / "brand"
    memoir_source = Image.open(memoir_dir / "apple-icon.png").convert("RGBA")
    save_icon_set(memoir_source, memoir_dir, 0.08, (255, 240, 243, 255))
    memoir_svgs(memoir_dir)
    mascot = Image.open(memoir_dir / "mascot.png")
    save_hero(memoir_hero(mascot), memoir_dir)


if __name__ == "__main__":
    main()
