# Star Blinds films and mockups

Device films (laptop, phones, tablet, portrait phone):
1. `sb-rec.mjs URL OUTDIR W H DPR MOBILE SECONDS END` records a live page scrolling, one screenshot per frame (headless Chrome, CDP on 9243). Cookie banner hidden, homepage slider frozen on its first slide so the loop is seamless.
2. `devfilm.py lap.json` composites those frames onto the green screen of a generated plate (`screens.py` finds the screen and fits its true corners; the green matte keeps a phone's camera island on top; `status` adds an iOS status bar).
3. Encode with ffmpeg at 30fps.

Print mockups: `art.html#card-front|card-back|fascia|book` renders the artwork from the brand's own SVGs and Nexa type; `place2.py job-*.json` places it on the green surfaces of generated scenes and recolours leftover green edges.

`identity.html` is the 10s identity film: every transition is a venetian blind closing and tilting open. `web.html` lays out the website stills.

Generated plates, recordings, fonts and frames are not committed.
