import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "instant" as any });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};
