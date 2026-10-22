import { createContext, useContext, useMemo, useState } from "react";

/**
 * The dock sits in the layout, the reel sits in the homepage, and each needs a
 * little of the other: the reel publishes its current slide (and clears it when
 * it unmounts, so the dock falls back to its page-level behaviour everywhere
 * else), and the dock says when its menu is open so the reel can hold still.
 *
 * The reel's countdown to the next slide is not in here: it changes every
 * frame, so it goes straight to a CSS variable (--reel-progress) instead of
 * re-rendering React sixty times a second.
 */
const DockContext = createContext({
  reel: null,
  setReel: () => {},
  menuOpen: false,
  setMenuOpen: () => {},
  playerOpen: false,
  setPlayerOpen: () => {},
});

export function DockProvider({ children }) {
  const [reel, setReel] = useState(null);
  // The menu (or the showreel playing over everything) is up, so the reel
  // underneath should hold still rather than advance unseen
  const [menuOpen, setMenuOpen] = useState(false);
  // The showreel player lives in the nav, but the homepage opens it too
  const [playerOpen, setPlayerOpen] = useState(false);
  const value = useMemo(
    () => ({ reel, setReel, menuOpen, setMenuOpen, playerOpen, setPlayerOpen }),
    [reel, menuOpen, playerOpen],
  );
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

export const useDock = () => useContext(DockContext);
