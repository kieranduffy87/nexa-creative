"""
Put real print artwork onto chroma-green surfaces in a generated still.

    python3 place2.py job.json

job: {"plate": png, "work": width, "floor": 190, "out": jpg,
      "items": [{"art": png, "grow": 1.006}, ...]   (left to right),
      "edge": [r, g, b]   colour for leftover green (card thickness, spine),
      "light": 1.0, "gamma": 0.9}
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageChops, ImageDraw, ImageFilter
from screens import load_plate, find_screens, orient, grow, warp_into, matte

job = json.load(open(sys.argv[1]))
plate = load_plate(job["plate"], job["work"])
W, H = plate.size
quads = find_screens(plate, floor=job.get("floor", 90))
assert len(quads) == len(job["items"]), f"found {len(quads)} surfaces"
r, g, b = plate.split()
excess = ImageChops.subtract(g, ImageChops.lighter(r, b))
green = excess.point(lambda v: 255 if v > 30 else 0)
out = plate.copy()
faces = Image.new("L", (W, H), 0)
for q, it in zip(quads, job["items"]):
    art = Image.open(it["art"]).convert("RGB")
    o = grow(orient(q, art.width >= art.height), it.get("grow", 1.006))
    print("corners", [tuple(round(v) for v in p) for p in o])
    poly = Image.new("L", (W, H), 0); ImageDraw.Draw(poly).polygon(o, fill=255)
    face = ImageChops.multiply(poly, green.filter(ImageFilter.MaxFilter(5)))
    face = face.filter(ImageFilter.GaussianBlur(0.7))
    # light: the face's own green level, smoothed and normalised
    gl = ImageChops.multiply(g, ImageChops.multiply(poly, green))
    vals = sorted(v for v in gl.resize((W // 6, H // 6)).getdata() if v)
    ref = vals[int(len(vals) * 0.92)]
    LIGHT, GAM = job.get("light", 1.0), job.get("gamma", 0.9)
    lm = gl.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(14)).point(
        lambda v: 255 if v == 0 else max(0, min(255, int(255 * min(1.0, (v / ref) ** GAM * LIGHT)))))
    w = ImageChops.multiply(warp_into((W, H), art, o), Image.merge("RGB", (lm, lm, lm)))
    out.paste(w, (0, 0), face)
    faces = ImageChops.lighter(faces, face)
# leftover green (edges, spine): recolour, keeping its shading
er, eg, eb = job.get("edge", [40, 40, 40])
left = ImageChops.subtract(green.filter(ImageFilter.MaxFilter(3)), faces.point(lambda v: 255 if v > 200 else 0))
lum = g.point(lambda v: v / 255)
rec = Image.merge("RGB", tuple(g.point(lambda v, c=c: int(c * min(1.2, v / 200))) for c in (er, eg, eb)))
out.paste(rec, (0, 0), left.filter(ImageFilter.GaussianBlur(0.8)))
# gentle spill pass on anything still leaning green
o2 = out.load()
for y in range(H):
    for x in range(W):
        R, G, B = o2[x, y]
        e = G - max(R, B)
        if e > 14:
            o2[x, y] = (R, max(R, B) + 4, B)
out.save(job["out"], quality=92)
print("wrote", job["out"])
