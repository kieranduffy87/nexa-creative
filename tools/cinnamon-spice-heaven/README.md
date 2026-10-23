# Cinnamon Spice Heaven films and mockups

Device films and print placement use `tools/star-blinds` (screens.py, devfilm.py, place2.py).

- The live site is in maintenance mode, so the website films are recorded from a restored copy of the June 2023 Wayback Machine capture:
  `cs-restore.mjs` loads the archived page, waits for every lazy image, saves the DOM; `patch.py` points it at a local copy of the archived combined stylesheet, the hero image and logos from the brand folder, strips srcset and scripts, and blanks the one product image the archive never captured. Serve the folder locally and record with `tools/mastertech/mt-rec.mjs`.
- `identity.html` (10s): the anise star blooms, settles into the stacked lockup, then curved waves carry the stamp, the landscape lockup and the website's category icons.
- `screen.html` (9:16, 12s): the in-store screen loop, composited onto the generated store display for the mobile hero.
- `bag.html`: stamp artwork multiplied onto a plain kraft bag (the green label was removed with an image edit first, so the paper texture shows through the ink).
- `sheets.html`: signage, social and website stills.
- Hero film: the placed shopfront animated with Seedance image2video, start and end frame the same so it loops.
