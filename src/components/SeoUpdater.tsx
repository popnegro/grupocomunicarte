import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCms } from "./CmsContext";

export function SeoUpdater() {
  const { pathname } = useLocation();
  const { currentDashboardTab } = useCms();

  useEffect(() => {
    if (pathname === "/") {
      const baseTitle = "Grupo Comunicarte | Publicidad Exterior y DOOH";
      const title = baseTitle; // For now, only base title for landing
      const description = "Líderes en publicidad exterior (OOH) y pantallas LED de gran formato en Argentina.";
      const keywords = "publicidad exterior, via publica, pantallas led, mendoza, buenos aires";

      // Update document title
      document.title = title;

      // Update Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Update Meta Keywords
      let metaKey = document.querySelector('meta[name="keywords"]');
      if (!metaKey) {
        metaKey = document.createElement('meta');
        metaKey.setAttribute('name', 'keywords');
        document.head.appendChild(metaKey);
      }
      metaKey.setAttribute('content', keywords);
    } else if (pathname.startsWith("/dashboard")) {
      // Dashboard SEO Title
      const tabLabel = currentDashboardTab.charAt(0).toUpperCase() + currentDashboardTab.slice(1);
      document.title = `Consola B2B | Grupo Comunicarte | ${tabLabel}`;
    }
  }, [pathname, currentDashboardTab]);

  return null; // This component does not render anything
}
