import { useCallback, useEffect, useState } from "react";

const KEY = "nexa-theme";

/** Read whatever the inline boot script already resolved onto <html>. */
const current = () =>
  document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";

export function useTheme() {
  const [theme, setTheme] = useState(current);

  // Follow the OS while the visitor has not made an explicit choice
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (localStorage.getItem(KEY)) return;
      const next = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      setTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // Private browsing; the theme just will not persist
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
