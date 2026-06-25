import os
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
FONT_URL = 'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Bold.ttf'
FONT_PATH = ROOT / 'NotoSansDevanagari-Bold.ttf'


def download_font():
    if not FONT_PATH.exists():
        print(f'Downloading font to {FONT_PATH.name}...')
        urllib.request.urlretrieve(FONT_URL, FONT_PATH)
    else:
        print(f'Font already exists at {FONT_PATH.name}')


def load_font(size):
    return ImageFont.truetype(str(FONT_PATH), size=size)


def sample_background(img, x1, y1, x2, y2):
    crop = img.crop((x1, y1, x2, y2))
    return crop


def tile_region(src, dst, x1, y1, x2, y2):
    sw, sh = src.size
    for y in range(y1, y2):
        for x in range(x1, x2):
            sx = (x - x1) % sw
            sy = (y - y1) % sh
            dst.putpixel((x, y), src.getpixel((sx, sy)))


def fix_bg_preload():
    path = ROOT / 'sprites' / 'bg_preload.png'
    img = Image.open(path).convert('RGBA')
    draw = ImageDraw.Draw(img)

    text_x1, text_y1, text_x2, text_y2 = 75, 45, 475, 210
    sample_x1, sample_y1, sample_x2, sample_y2 = 500, 300, 650, 450

    sample = sample_background(img, sample_x1, sample_y1, sample_x2, sample_y2)
    tile_region(sample, img, text_x1, text_y1, text_x2, text_y2)

    font = load_font(62)
    draw.text((81, 53), 'हामी जे हेर्छौं,', font=font, fill=(255, 255, 255, 255))
    draw.text((81, 125), 'त्यही बन्छौं।', font=font, fill=(255, 255, 255, 255))

    img.save(path)
    print('Updated sprites/bg_preload.png')


def fix_preload_play():
    path = ROOT / 'sprites' / 'misc' / 'preload_play.png'
    img = Image.open(path).convert('RGBA')
    draw = ImageDraw.Draw(img)

    red = (204, 39, 39, 255)
    white = (255, 255, 255, 255)

    for y1, y2 in ((86, 172), (173, 259)):
        for y in range(y1, y2):
            for x in range(4, 390):
                r, g, b, a = img.getpixel((x, y))
                if r > 200 and g > 200 and b > 200:
                    img.putpixel((x, y), red)

    font = load_font(38)
    for y1, y2 in ((86, 172), (173, 259)):
        frame_h = y2 - y1
        cy = y1 + frame_h // 2
        text = 'खेलौं!'
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        x = 4 + (390 - 4 - text_w) // 2
        y = cy - 18
        draw.text((x, y), text, font=font, fill=white)

    img.save(path)
    print('Updated sprites/misc/preload_play.png')


def main():
    download_font()
    fix_bg_preload()
    fix_preload_play()


if __name__ == '__main__':
    main()
