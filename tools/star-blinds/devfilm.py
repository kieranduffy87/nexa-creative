"""
Composite recorded web frames onto the green screens of a generated plate.

    python3 devfilm.py config.json [frame ...]

config: {"plate": png, "work": width the plate is processed at,
         "screens": [rec dir per screen, left to right],
         "out": dir, "size": [w, h] of the output frames,
         "crop": [x, y, w, h] of the work plate that frames the shot,
         "push": 1.04  (slow push-in to the middle of the loop and back out),
         "light": 0.35 (how much of the green's own falloff shades the screen),
         "grow": 1.012}
"""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageChops, ImageDraw, ImageFilter
from screens import load_plate, find_screens, matte, despill, warp_into, grow

cfg = json.load(open(sys.argv[1]))
plate = load_plate(cfg["plate"], cfg["work"])
W, H = plate.size
quads = find_screens(plate)
assert len(quads) == len(cfg["screens"]), f"found {len(quads)} screens"
K = cfg.get("grow", 1.012)

# keep the matte to the screens only (and their bezel edge)
region = Image.new("L", (W, H), 0)
for q in quads:
    ImageDraw.Draw(region).polygon(grow(q, 1.03), fill=255)
a = ImageChops.multiply(matte(plate), region)
base = despill(plate, region.filter(ImageFilter.MaxFilter(9)))
# extra boxes where the generator let the green leak (a laptop's keys, say)
for bx in cfg.get("despill_boxes", []):
    m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).rectangle(bx, fill=255)
    br, bg, bb = base.split()
    # hard: green no higher than the mean of red and blue, so grey stays grey
    g2 = ImageChops.darker(bg, Image.blend(br, bb, 0.5).point(lambda v: min(255, v + 2)))
    base.paste(Image.merge("RGB", (br, g2, bb)), (0, 0), m)

# the green's own brightness, normalised, as a gentle shade over the content
r, g, b = plate.split()
gl = ImageChops.multiply(g, a.point(lambda v: 255 if v > 200 else 0))
vals = sorted(v for v in gl.resize((W // 8, H // 8)).getdata() if v)
ref = vals[int(len(vals) * 0.95)] if vals else 255
LIGHT = cfg.get("light", 0.35)
shade = gl.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(24)).point(
    lambda v: 255 if v == 0 else int(255 * ((1 - LIGHT) + LIGHT * min(1.0, v / ref))))
shade = Image.merge("RGB", (shade, shade, shade))

srcs = [sorted(os.listdir(d)) for d in cfg["screens"]]

# an iOS status bar above phone captures, so the camera island sits over the
# clock and battery as it would, not over the site's own header
ST = cfg.get("status")
def status_bar(w):
    from PIL import ImageFont
    d = ST["dpr"]; h = round(ST["h"] * d)
    im = Image.new("RGB", (w, h), tuple(ST.get("bg", [255, 255, 255])))
    dr = ImageDraw.Draw(im); fg = tuple(ST.get("fg", [0, 0, 0]))
    try:
        f = ImageFont.truetype("/System/Library/Fonts/SFNS.ttf", round(17 * d))
        f.set_variation_by_axes([600]) if hasattr(f, "set_variation_by_axes") else None
    except Exception:
        f = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", round(17 * d))
    cy = h * 0.56
    dr.text((w * 0.155, cy), "9:41", font=f, fill=fg, anchor="mm")
    x = w * 0.70
    for k in range(4):                       # signal
        bh = (4 + k * 2.6) * d
        dr.rounded_rectangle((x + k * 5 * d, cy + 5 * d - bh, x + k * 5 * d + 3.2 * d, cy + 5 * d), 1 * d, fill=fg)
    x += 27 * d                              # wifi
    for k, rr in enumerate((11, 7.4, 3.8)):
        dr.arc((x - rr * d + 8 * d, cy - rr * d + 3 * d, x + rr * d + 8 * d, cy + rr * d + 3 * d), 225, 315, fill=fg, width=round(2.2 * d)) if k < 2 else \
            dr.pieslice((x - rr * d + 8 * d, cy - rr * d + 3 * d, x + rr * d + 8 * d, cy + rr * d + 3 * d), 225, 315, fill=fg)
    x += 25 * d                              # battery
    dr.rounded_rectangle((x, cy - 6 * d, x + 25 * d, cy + 6 * d), 3.5 * d, outline=fg, width=round(1.1 * d))
    dr.rounded_rectangle((x + 2 * d, cy - 4 * d, x + 20 * d, cy + 4 * d), 2 * d, fill=fg)
    dr.rounded_rectangle((x + 26.5 * d, cy - 2.2 * d, x + 28 * d, cy + 2.2 * d), 1 * d, fill=fg)
    return im
_bar = {}
def with_status(c):
    if not ST: return c
    if c.width not in _bar: _bar[c.width] = status_bar(c.width)
    b = _bar[c.width]
    out = Image.new("RGB", (c.width, c.height + b.height)); out.paste(b, (0, 0)); out.paste(c, (0, b.height))
    return out
N = min(len(s) for s in srcs)
cx, cy, cw, ch = cfg.get("crop", [0, 0, W, H])
OW, OH = cfg["size"]
PUSH = cfg.get("push", 1.0)
os.makedirs(cfg["out"], exist_ok=True)

def frame(f):
    layer = Image.new("RGB", (W, H))
    for q, d, files in zip(quads, cfg["screens"], srcs):
        c = with_status(Image.open(os.path.join(d, files[f])).convert("RGB"))
        w = warp_into((W, H), c, grow(q, K))
        m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).polygon(grow(q, K), fill=255)
        layer.paste(w, (0, 0), m)
    layer = ImageChops.multiply(layer, shade)
    out = base.copy(); out.paste(layer, (0, 0), a)
    # push in towards the middle of the loop and back, eased
    t = f / N
    s = 1 + (PUSH - 1) * (0.5 - 0.5 * math.cos(2 * math.pi * t))
    w2, h2 = cw / s, ch / s
    box = (max(0, cx + (cw - w2) / 2), max(0, cy + (ch - h2) / 2), min(W, cx + (cw + w2) / 2), min(H, cy + (ch + h2) / 2))
    out.resize((OW, OH), Image.LANCZOS, box=box).save(os.path.join(cfg["out"], f"f{f:04d}.jpg"), quality=93)

todo = [int(x) for x in sys.argv[2:]] or range(N)
for f in todo:
    frame(f)
print("screens", [[tuple(round(v) for v in p) for p in q] for q in quads], "frames", len(todo))
