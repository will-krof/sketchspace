"""Create the checked-in Windows icon from the Sketchspace brand mark."""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
out = root / "assets"
out.mkdir(exist_ok=True)
scale = 4
size = 512
image = Image.new("RGBA", (size * scale, size * scale), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)
def box(coords):
    return tuple(round(value * scale) for value in coords)

navy = "#17212b"
lime = "#e4f47a"
draw.rounded_rectangle(box((0, 0, size, size)), radius=108 * scale, fill=navy)
draw.rounded_rectangle(box((91, 94, 421, 418)), radius=34 * scale, outline=lime, width=27 * scale)
draw.rounded_rectangle(box((117, 182, 395, 207)), radius=11 * scale, fill=lime)
draw.rounded_rectangle(box((198, 202, 224, 390)), radius=11 * scale, fill=lime)
draw.rounded_rectangle(box((310, 352, 392, 377)), radius=11 * scale, fill=lime)
image = image.resize((size, size), Image.Resampling.LANCZOS)
image.save(out / "icon.png")
image.save(out / "icon.ico", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
