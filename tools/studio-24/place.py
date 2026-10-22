"""
Place real print artwork onto a chroma-green surface in a generated still.

    python3 place.py scene.png art.png out.jpg [K] [lightness]

- Corners: convex hull of the green, reduced to its four strongest vertices,
  so rounded corners on the generated card resolve to the true sharp corners
  the real (square-cornered) artwork has.
- Lighting: the green carries the scene's light falloff. Its brightness,
  smoothed, is multiplied into the artwork so the print sits in the room's
  light rather than glowing on top of it.
- Spill: green cast left on surrounding surfaces is moved into red/blue,
  compressed, the same way as the device scenes.
"""
import math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops

scene_p, art_p, out_p = sys.argv[1:4]
K = float(sys.argv[4]) if len(sys.argv) > 4 else 1.006
LIGHT = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0

scene = Image.open(scene_p).convert("RGB")
W, H = scene.size
px = scene.load()
green = lambda r, g, b: g > 90 and g > r * 1.35 and g > b * 1.35
loose = lambda r, g, b: g > 60 and g > r * 1.2 and g > b * 1.2

# largest connected green region, on a 1/2 scale grid for speed
step = 2
pts = [(x, y) for y in range(0, H, step) for x in range(0, W, step) if green(*px[x, y])]
S = set(pts); seen = set(); best = []
for p in pts:
    if p in seen:
        continue
    comp, stack = [], [p]; seen.add(p)
    while stack:
        x, y = stack.pop(); comp.append((x, y))
        for q in ((x + step, y), (x - step, y), (x, y + step), (x, y - step)):
            if q in S and q not in seen:
                seen.add(q); stack.append(q)
    if len(comp) > len(best):
        best = comp

def hull(points):
    pts = sorted(set(points))
    def half(ps):
        out = []
        for p in ps:
            while len(out) > 1 and (out[-1][0] - out[-2][0]) * (p[1] - out[-2][1]) - (out[-1][1] - out[-2][1]) * (p[0] - out[-2][0]) <= 0:
                out.pop()
            out.append(p)
        return out
    return half(pts)[:-1] + half(pts[::-1])[:-1]

def area(poly):
    return abs(sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))) / 2

h = hull(best)
while len(h) > 4:
    h.pop(min((area(h) - area(h[:i] + h[i + 1:]), i) for i in range(len(h)))[1])

# Rounded corners pull hull vertices inward. Rebuild each true corner as the
# intersection of the two long straight edges either side of it.
mx = sum(p[0] for p in h) / 4; my = sum(p[1] for p in h) / 4
h.sort(key=lambda p: math.atan2(p[1] - my, p[0] - mx))
def edge_line(a, b):
    # fit a line to the green boundary points lying near segment a-b (middle 60% of it)
    ax, ay = a; bx, by = b
    L2 = (bx - ax) ** 2 + (by - ay) ** 2
    near = []
    for (x, y) in best:
        t = ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / L2
        if 0.2 < t < 0.8:
            d = abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / math.sqrt(L2)
            if d < 4:
                near.append((x, y))
    if len(near) < 10:
        return (a, b)
    # principal direction via covariance
    cx = sum(p[0] for p in near) / len(near); cy = sum(p[1] for p in near) / len(near)
    sxx = sum((p[0] - cx) ** 2 for p in near); syy = sum((p[1] - cy) ** 2 for p in near)
    sxy = sum((p[0] - cx) * (p[1] - cy) for p in near)
    ang = 0.5 * math.atan2(2 * sxy, sxx - syy)
    return ((cx, cy), (cx + math.cos(ang), cy + math.sin(ang)))
def intersect(l1, l2):
    (x1, y1), (x2, y2) = l1; (x3, y3), (x4, y4) = l2
    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if abs(d) < 1e-9:
        return l1[0]
    a = x1 * y2 - y1 * x2; b = x3 * y4 - y3 * x4
    return ((a * (x3 - x4) - (x1 - x2) * b) / d, (a * (y3 - y4) - (y1 - y2) * b) / d)
# Fit all four edges from straight runs only. Rounded corners can take up a
# large share of a short side, which skews any fit that uses hull vertices as
# its anchors, so instead: find the card's own axes, then take boundary pixels
# from the middle stretch of each side and fit a line through each set.
Sb = set(best)
boundary = [(x, y) for (x, y) in best
            if any(q not in Sb for q in ((x + step, y), (x - step, y), (x, y + step), (x, y - step)))]
# long axis from the longest hull edge
def hl(i):
    a, b = h[i], h[(i + 1) % 4]
    return math.hypot(b[0] - a[0], b[1] - a[1])
li = max(range(4), key=hl)
ux, uy = h[(li + 1) % 4][0] - h[li][0], h[(li + 1) % 4][1] - h[li][1]
n = math.hypot(ux, uy); ux, uy = ux / n, uy / n
vx, vy = -uy, ux
proj = [(p, p[0] * ux + p[1] * uy, p[0] * vx + p[1] * vy) for p in boundary]
s0 = min(q[1] for q in proj); s1 = max(q[1] for q in proj)
t0 = min(q[2] for q in proj); t1 = max(q[2] for q in proj)
def pick(cond):
    return [p for (p, sv, tv) in proj if cond(sv, tv)]
mid_s = lambda sv: s0 + 0.25 * (s1 - s0) < sv < s0 + 0.75 * (s1 - s0)
mid_t = lambda tv: t0 + 0.3 * (t1 - t0) < tv < t0 + 0.7 * (t1 - t0)
sides = [
    pick(lambda sv, tv: mid_s(sv) and tv < t0 + 0.5 * (t1 - t0)),   # one long side
    pick(lambda sv, tv: mid_t(tv) and sv > s0 + 0.5 * (s1 - s0)),   # one short side
    pick(lambda sv, tv: mid_s(sv) and tv > t0 + 0.5 * (t1 - t0)),   # other long side
    pick(lambda sv, tv: mid_t(tv) and sv < s0 + 0.5 * (s1 - s0)),   # other short side
]
def fit(pts):
    cx = sum(p[0] for p in pts) / len(pts); cy = sum(p[1] for p in pts) / len(pts)
    sxx = sum((p[0] - cx) ** 2 for p in pts); syy = sum((p[1] - cy) ** 2 for p in pts)
    sxy = sum((p[0] - cx) * (p[1] - cy) for p in pts)
    ang = 0.5 * math.atan2(2 * sxy, sxx - syy)
    return ((cx, cy), (cx + math.cos(ang), cy + math.sin(ang)))
lines = [fit(pts) for pts in sides]
corners = [intersect(lines[(i - 1) % 4], lines[i]) for i in range(4)]
# put them in angular order round the centre for the edge logic below
mx = sum(c[0] for c in corners) / 4; my = sum(c[1] for c in corners) / 4
corners.sort(key=lambda c: math.atan2(c[1] - my, c[0] - mx))

# order: the artwork's top edge is the long edge farther from the camera for a
# flat card, or the top edge for a wall poster; take the edge pair by length
def elen(i):
    a, b = corners[i], corners[(i + 1) % 4]
    return math.hypot(b[0] - a[0], b[1] - a[1])
art = Image.open(art_p).convert("RGB")
landscape = art.width > art.height
long_pair = (0, 2) if elen(0) + elen(2) >= elen(1) + elen(3) else (1, 3)
if landscape:
    top_candidates = long_pair
else:
    top_candidates = (1, 3) if long_pair == (0, 2) else (0, 2)
emid = lambda i: (corners[i][1] + corners[(i + 1) % 4][1]) / 2
ti = min(top_candidates, key=emid)
q = [corners[(ti + k) % 4] for k in range(4)]
if q[0][0] > q[1][0]:
    q = [q[1], q[0], q[3], q[2]]
cx = sum(p[0] for p in q) / 4; cy = sum(p[1] for p in q) / 4
q = [(cx + (x - cx) * K, cy + (y - cy) * K) for x, y in q]
print("corners TL TR BR BL:", [tuple(round(v) for v in p) for p in q])

def solve(A, b):
    n = len(A); M = [r[:] + [b[i]] for i, r in enumerate(A)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c])); M[c], M[p] = M[p], M[c]
        pv = M[c][c]
        for j in range(c, n + 1): M[c][j] /= pv
        for r in range(n):
            if r != c and M[r][c]:
                f = M[r][c]
                for j in range(c, n + 1): M[r][j] -= f * M[c][j]
    return [M[i][n] for i in range(n)]
def coeffs(dst, src):
    A, b = [], []
    for (dx, dy), (sx, sy) in zip(dst, src):
        A.append([dx, dy, 1, 0, 0, 0, -sx * dx, -sx * dy]); b.append(sx)
        A.append([0, 0, 0, dx, dy, 1, -sy * dx, -sy * dy]); b.append(sy)
    return solve(A, b)

warped = art.transform((W, H), Image.PERSPECTIVE,
                       coeffs(q, [(0, 0), (art.width, 0), (art.width, art.height), (0, art.height)]), Image.BICUBIC)
mask = Image.new("L", (W, H), 0)
ImageDraw.Draw(mask).polygon(q, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(0.8))

# lighting from the green's own brightness
gl = Image.new("L", (W, H), 0); glp = gl.load()
for y in range(H):
    for x in range(W):
        r, g, b = px[x, y]
        if green(r, g, b):
            glp[x, y] = g
inside = [glp[x, y] for y in range(0, H, 4) for x in range(0, W, 4) if glp[x, y]]
inside.sort(); ref = inside[int(len(inside) * 0.9)]
# fill holes and smooth: dilate the measured light outwards so the whole quad has a value
light = gl.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(18))
lp = light.load()
shade = Image.new("L", (W, H), 255); sp = shade.load()
for y in range(H):
    for x in range(W):
        v = lp[x, y]
        if v:
            sp[x, y] = max(0, min(255, int(255 * min(1.0, (v / ref) ** 0.9 * LIGHT))))
warped = ImageChops.multiply(warped, Image.merge("RGB", (shade, shade, shade)))

out = scene.copy()
out.paste(warped, (0, 0), mask)

# spill outside the card
op = out.load(); mp = mask.load()
for y in range(H):
    for x in range(W):
        if mp[x, y] > 128:
            continue
        r, g, b = op[x, y]
        e = g - max(r, b)
        if e > 0 and loose(r, g, b) or e > 12:
            amp = min(e, e ** 0.6 * 2.2)
            op[x, y] = (min(255, int(r + amp * 0.95)), max(0, int(g - e + amp * 0.62)), min(255, int(b + amp * 0.38)))
# The card's own thickness, just outside its face, was green in the plate and
# comes out olive after the spill pass. A black card has a dark edge, so in a
# thin band around the face, anything still leaning green goes to dark grey.
EDGE = int(sys.argv[6]) if len(sys.argv) > 6 else 0
if EDGE:
    band = mask.point(lambda v: 255 if v > 20 else 0).filter(ImageFilter.MaxFilter(EDGE * 2 + 1))
    bp = band.load()
    for y in range(H):
        for x in range(W):
            if bp[x, y] and mp[x, y] < 128:
                r, g, b = op[x, y]
                if g > b * 1.12 and g >= r * 0.9:
                    lum = 0.3 * r + 0.59 * g + 0.11 * b
                    op[x, y] = (int(lum * 0.36), int(lum * 0.35), int(lum * 0.34))
out.save(out_p, quality=92)
left = sum(1 for y in range(0, H, 2) for x in range(0, W, 2) if green(*op[x, y]))
print("wrote", out_p, "| remaining green (sampled):", left)
