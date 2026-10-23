"""
Find chroma-green screens in a generated plate and fit true corners.

    from screens import load_plate, find_screens, matte, warp_into

- Detection runs on the plate at working size; each connected green region
  big enough to be a screen gets four corners from straight-run edge fits
  (rounded device corners would otherwise pull the hull inward).
- The matte is the green excess (g - max(r, b)), so anything drawn over the
  screen by the generator (a camera island, a reflection edge) stays on top.
"""
import math
from PIL import Image, ImageChops, ImageFilter, ImageDraw

def load_plate(path, width):
    im = Image.open(path).convert("RGB")
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)

def _green(r, g, b, floor=90):
    return g > floor and g > r * 1.35 and g > b * 1.35

def find_screens(plate, min_frac=0.004, step=2, floor=90):
    """floor: minimum green level; raise it to separate a lit face from its
    darker edge (a book's spine, a card's thickness)"""
    W, H = plate.size
    px = plate.load()
    pts = [(x, y) for y in range(0, H, step) for x in range(0, W, step) if _green(*px[x, y], floor)]
    S = set(pts); seen = set(); comps = []
    for p in pts:
        if p in seen: continue
        comp, stack = [], [p]; seen.add(p)
        while stack:
            x, y = stack.pop(); comp.append((x, y))
            for q in ((x+step, y), (x-step, y), (x, y+step), (x, y-step)):
                if q in S and q not in seen:
                    seen.add(q); stack.append(q)
        if len(comp) * step * step > min_frac * W * H:
            comps.append(comp)
    quads = [_corners(c, step) for c in comps]
    quads.sort(key=lambda q: sum(p[0] for p in q))
    return quads

def _corners(best, step):
    Sb = set(best)
    boundary = [(x, y) for (x, y) in best
                if any(q not in Sb for q in ((x+step, y), (x-step, y), (x, y+step), (x, y-step)))]
    # principal axes from the region's covariance
    cx = sum(p[0] for p in best) / len(best); cy = sum(p[1] for p in best) / len(best)
    sxx = sum((p[0]-cx)**2 for p in best); syy = sum((p[1]-cy)**2 for p in best)
    sxy = sum((p[0]-cx)*(p[1]-cy) for p in best)
    ang = 0.5 * math.atan2(2*sxy, sxx - syy)
    ux, uy = math.cos(ang), math.sin(ang); vx, vy = -uy, ux
    proj = [(p, p[0]*ux + p[1]*uy, p[0]*vx + p[1]*vy) for p in boundary]
    s0 = min(q[1] for q in proj); s1 = max(q[1] for q in proj)
    t0 = min(q[2] for q in proj); t1 = max(q[2] for q in proj)
    pick = lambda c: [p for (p, sv, tv) in proj if c(sv, tv)]
    ms = lambda sv: s0 + .25*(s1-s0) < sv < s0 + .75*(s1-s0)
    mt = lambda tv: t0 + .25*(t1-t0) < tv < t0 + .75*(t1-t0)
    # each side: the outermost boundary point in every column along it, from
    # the middle stretch only. Holes in the green near an edge (a phone's
    # camera island) never win a column, so they cannot drag the edge in.
    def side(along, across, lo, hi, outer):
        best = {}
        for (p, sv, tv) in proj:
            a, c = (sv, tv) if along == "s" else (tv, sv)
            if not (lo < a < hi): continue
            if (c < (t0 + t1) / 2 if along == "s" else c < (s0 + s1) / 2) != (outer == "min"): continue
            k = round(a / step)
            if k not in best or (c < best[k][1] if outer == "min" else c > best[k][1]):
                best[k] = (p, c)
        return [v[0] for v in best.values()]
    sides = [side("s", "t", s0 + .2*(s1-s0), s0 + .8*(s1-s0), "min"),
             side("t", "s", t0 + .12*(t1-t0), t0 + .88*(t1-t0), "max"),
             side("s", "t", s0 + .2*(s1-s0), s0 + .8*(s1-s0), "max"),
             side("t", "s", t0 + .12*(t1-t0), t0 + .88*(t1-t0), "min")]
    def fit(pts):
        mx = sum(p[0] for p in pts)/len(pts); my = sum(p[1] for p in pts)/len(pts)
        a = sum((p[0]-mx)**2 for p in pts); b = sum((p[1]-my)**2 for p in pts)
        c = sum((p[0]-mx)*(p[1]-my) for p in pts)
        t = 0.5 * math.atan2(2*c, a - b)
        return ((mx, my), (mx + math.cos(t), my + math.sin(t)))
    def inter(l1, l2):
        (x1, y1), (x2, y2) = l1; (x3, y3), (x4, y4) = l2
        d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4)
        a = x1*y2 - y1*x2; b = x3*y4 - y3*x4
        return ((a*(x3-x4) - (x1-x2)*b)/d, (a*(y3-y4) - (y1-y2)*b)/d)
    L = [fit(s) if len(s) > 8 else None for s in sides]
    hull4 = _hull4(best)
    if None in L:
        cs = hull4
    else:
        cs = [inter(L[(i-1) % 4], L[i]) for i in range(4)]
        # an occluded side gives a wild fit; fall back to the hull corner there
        diag = math.dist((s0, t0), (s1, t1))
        if any(min(math.dist(c, h) for h in hull4) > 0.08 * diag for c in cs):
            cs = hull4
    # order TL, TR, BR, BL in image space
    cs.sort(key=lambda p: p[1])
    top = sorted(cs[:2], key=lambda p: p[0]); bot = sorted(cs[2:], key=lambda p: p[0])
    return [top[0], top[1], bot[1], bot[0]]

def _hull4(points):
    pts = sorted(set(points))
    def half(ps):
        out = []
        for p in ps:
            while len(out) > 1 and (out[-1][0]-out[-2][0])*(p[1]-out[-2][1]) - (out[-1][1]-out[-2][1])*(p[0]-out[-2][0]) <= 0:
                out.pop()
            out.append(p)
        return out
    h = half(pts)[:-1] + half(pts[::-1])[:-1]
    area = lambda P: abs(sum(P[i][0]*P[(i+1)%len(P)][1] - P[(i+1)%len(P)][0]*P[i][1] for i in range(len(P)))) / 2
    while len(h) > 4:
        h.pop(min((area(h) - area(h[:i] + h[i+1:]), i) for i in range(len(h)))[1])
    return [tuple(map(float, p)) for p in h]

def orient(q, landscape=True):
    """Order corners TL, TR, BR, BL for an artwork: its top edge is the long
    edge (landscape art) or short edge (portrait art) farther up the image."""
    mx = sum(p[0] for p in q)/4; my = sum(p[1] for p in q)/4
    c = sorted(q, key=lambda p: math.atan2(p[1]-my, p[0]-mx))
    el = lambda i: math.dist(c[i], c[(i+1) % 4])
    long_pair = (0, 2) if el(0) + el(2) >= el(1) + el(3) else (1, 3)
    cand = long_pair if landscape else ((1, 3) if long_pair == (0, 2) else (0, 2))
    mid = lambda i: (c[i][1] + c[(i+1) % 4][1]) / 2
    ti = min(cand, key=mid)
    o = [c[(ti + k) % 4] for k in range(4)]
    if o[0][0] > o[1][0]:
        o = [o[1], o[0], o[3], o[2]]
    return o

def matte(plate, gain=6, blur=0.6):
    r, g, b = plate.split()
    ex = ImageChops.subtract(g, ImageChops.lighter(r, b))
    a = ex.point(lambda v: 0 if v < 18 else min(255, (v - 18) * gain))
    return a.filter(ImageFilter.GaussianBlur(blur)) if blur else a

def despill(plate, region):
    """pull green spill out of the bezel edges, only near the screens"""
    r, g, b = plate.split()
    g2 = ImageChops.darker(g, ImageChops.lighter(r, b).point(lambda v: min(255, v + 6)))
    fixed = Image.merge("RGB", (r, g2, b))
    out = plate.copy(); out.paste(fixed, (0, 0), region)
    return out

def _solve(A, bb):
    n = len(A); M = [row[:] + [bb[i]] for i, row in enumerate(A)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c])); M[c], M[p] = M[p], M[c]
        pv = M[c][c]
        for j in range(c, n+1): M[c][j] /= pv
        for r in range(n):
            if r != c and M[r][c]:
                f = M[r][c]
                for j in range(c, n+1): M[r][j] -= f * M[c][j]
    return [M[i][n] for i in range(n)]

def coeffs(dst, src):
    A, bb = [], []
    for (dx, dy), (sx, sy) in zip(dst, src):
        A.append([dx, dy, 1, 0, 0, 0, -sx*dx, -sx*dy]); bb.append(sx)
        A.append([0, 0, 0, dx, dy, 1, -sy*dx, -sy*dy]); bb.append(sy)
    return _solve(A, bb)

def grow(q, K):
    cx = sum(p[0] for p in q)/4; cy = sum(p[1] for p in q)/4
    return [(cx + (x-cx)*K, cy + (y-cy)*K) for x, y in q]

def warp_into(size, content, quad):
    return content.transform(size, Image.PERSPECTIVE,
        coeffs(quad, [(0, 0), (content.width, 0), (content.width, content.height), (0, content.height)]),
        Image.BICUBIC)

def quad_size(q):
    w = (math.dist(q[0], q[1]) + math.dist(q[3], q[2])) / 2
    h = (math.dist(q[0], q[3]) + math.dist(q[1], q[2])) / 2
    return w, h
