import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useSmoothScroll, scrollToTop, ScrollTrigger } from "../lib/motion";

export function Layout() {
  const { pathname } = useLocation();

  useSmoothScroll();

  useEffect(() => {
    scrollToTop();
    // Triggers were measured against the previous page's height
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-bg">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
