# Studio 24 films and mockups

- `identity.html` — 10s identity film from the brand's own vectors (`icon.svg`, `circle-*.svg`).
- `hero.html` — 12s looping hero; `?fmt=p` renders the 9:16 phone cut. Expects `img/` crops and `seq/clip/` frames (not committed).
- `render.mjs URL OUTDIR` — seeks `window.renderAt(t)` frame by frame in headless Chrome (CDP on 9243) and writes JPEGs; encode with ffmpeg at 30fps.
- `place.py scene art out [K] [lightness] [edge]` — puts real print artwork onto a chroma-green card or poster in a generated scene (price list and voucher mockups).

Both compositions need `gsap.min.js` next to them.
