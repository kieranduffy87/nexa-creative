import { createContext, useContext, useMemo, useState } from "react";

/**
 * The dock sits in the layout, the reel sits in the homepage, and the dock has
 * to show whichever project the reel is on. This is the only thing they share:
 * the reel publishes its current slide here, and clears it when it unmounts so
 * the dock falls back to its page-level behaviour everywhere else.
 */
const DockContext = createContext({ reel: null, setReel: () => {} });

export function DockProvider({ children }) {
  const [reel, setReel] = useState(null);
  const value = useMemo(() => ({ reel, setReel }), [reel]);
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

export const useDock = () => useContext(DockContext);
