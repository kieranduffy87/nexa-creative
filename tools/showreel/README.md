# Showreel

The 42s reel in `public/showreel/` is an HTML/GSAP composition rendered frame
by frame, with an original score synthesised to the same grid, so the two can
be re-cut together when projects change.

Everything sits on 120 BPM: a beat every 0.5s, a bar every 2s, 21 bars. Every
picture cut lands on a beat or an 8th note, each project gets exactly four
bars, and the score puts its hits at the same times, so sync is built in
rather than detected.

Text only ever sits over shots with no type or logo in them; shots that carry
a logo or a website play with nothing on top.

1. `python3 tools/showreel/extract.py` pulls each shot's segment out of
   `public/projects/` (list in `shots.json`).
2. `python3 tools/showreel/music.py tools/showreel/score.wav` writes the score
   (pure Python, ~30s).
3. Copy `node_modules/gsap/dist/gsap.min.js` next to `index.html`, then serve
   this folder: `python3 -m http.server 8790`.
4. Start headless Chrome with `--remote-debugging-port=9243`, then
   `node tools/showreel/render.mjs frames/` renders all 1260 frames
   (`window.renderAt(t)` seeks the paused timeline and swaps each video layer
   to its exact frame, so the render is deterministic).
5. Encode with the score:
   `ffmpeg -framerate 30 -i frames/f%04d.jpg -i score.wav -t 42 -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -crf 21 -c:a aac -b:a 192k -movflags +faststart nexa-showreel.mp4`
