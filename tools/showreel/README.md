# Showreel

The 37s reel in `public/showreel/` is an HTML/GSAP composition rendered frame
by frame, so it can be re-cut when projects change.

1. `python3 tools/showreel/extract.py` pulls each shot's segment out of
   `public/projects/` (list in `shots.json`).
2. Copy `node_modules/gsap/dist/gsap.min.js` next to `index.html`, then serve
   this folder: `python3 -m http.server 8790`.
3. Start headless Chrome with `--remote-debugging-port=9243`, then
   `node tools/showreel/render.mjs frames/` renders all 1110 frames
   (`window.renderAt(t)` seeks the paused timeline and swaps each video
   layer to its exact frame, so the render is deterministic).
4. Encode: `ffmpeg -framerate 30 -i frames/f%04d.jpg -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -crf 21 -movflags +faststart nexa-showreel.mp4`

It is silent; there was no licensed track to cut it to.
