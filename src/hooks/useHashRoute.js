import { useEffect, useState, useCallback } from "react";
import { scrollToTop } from "../lib/scroll.js";

// 極簡 hash 路由：#/、#/map、#/level/:id
export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || "#/");

  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash || "#/");
      scrollToTop();
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((to) => {
    if (window.location.hash === to) scrollToTop();
    else window.location.hash = to;
  }, []);

  return { hash, navigate };
}
