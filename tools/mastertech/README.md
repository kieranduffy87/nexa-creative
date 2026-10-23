# Mastertech films

Same pipeline as `tools/star-blinds` (screens.py, devfilm.py live there).

- `mt-rec.mjs` is `sb-rec.mjs` plus per-frame control of moving parts: carousels stop on slide one, CSS animations are seeked to film time, and background videos ping-pong so the loop point matches.
- `webreel.html` is the 12s website film: a tilted wall of the real pages (each column moves exactly one period per loop), a browser and two phones, then the logo. Needs the full-page captures in `../site/` and `gsap.min.js`.
- `web.html` lays out the website stills.
