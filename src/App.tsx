import React, { useEffect } from "react";
import { CmsProvider } from "./components/CmsContext";
import { LandingView } from "./components/LandingView";
import { DashboardView } from "./components/DashboardView";
import { DashboardHome } from "./components/dashboard/DashboardHome";

import { DataHubView } from "./components/DataHubView";
import { CampaignPlannerView } from "./components/CampaignPlannerView";
import { B2BMarketplaceView } from "./components/B2BMarketplaceView";
import { OperationsNocView } from "./components/OperationsNocView";
import { SitemapSeoView } from "./components/SitemapSeoView";
import { DesignSystemAuditView } from "./components/DesignSystemAuditView";
import { motion } from "motion/react";
import { LayoutDashboard, Globe, Sparkles } from "lucide-react";
import { BrowserRouter, Routes, Route, Link, useLocation, Outlet } from "react-router-dom";
import { findSitemapItemBySlug } from "./lib/sitemap";
import { SubpageLayout } from "./components/SubpageLayout";

function FloatingViewSwitcher() {
  const { pathname } = useLocation();

  const isLandingActive = pathname === "/";
  const isDashboardActive = pathname.startsWith("/dashboard");

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7493/ingest/f8c8e631-57b0-4152-abc1-83ff85c4f09b", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "8483d9" },
      body: JSON.stringify({
        sessionId: "8483d9",
        runId: "pre-fix",
        hypothesisId: "C",
        location: "App.tsx:FloatingViewSwitcher",
        message: "View switcher state",
        data: { pathname, isLandingActive, isDashboardActive },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [pathname, isLandingActive, isDashboardActive]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, type: "spring" }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-800 px-2 py-1.5 rounded-full shadow-2xl shadow-slate-950/40 text-xs font-bold text-white selection:bg-transparent"
    >
      <div className="flex items-center gap-1.5 px-3 border-r border-slate-800 mr-1">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] text-slate-400 tracking-wider uppercase font-extrabold font-mono">Modo Demo</span>
      </div>

      <Link
        to="/"
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer text-[11px] uppercase tracking-wider ${
          isLandingActive
            ? "bg-white text-slate-950 shadow-sm font-black"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Globe className="h-3.5 w-3.5" />
        <span>Landing Pública</span>
      </Link>

      <Link
        to="/dashboard"
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer text-[11px] uppercase tracking-wider ${
          isDashboardActive
            ? "bg-white text-slate-950 shadow-sm font-black"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        <span>Consola B2B</span>
      </Link>
    </motion.div>
  );
}

import { SeoUpdater } from "./components/SeoUpdater";

function RouteDebugLogger() {
  const { pathname } = useLocation();

  useEffect(() => {
    const sitemapMatch = findSitemapItemBySlug(pathname);
    const matchedComponent =
      pathname === "/"
        ? "LandingView"
        : pathname.startsWith("/dashboard")
          ? "DashboardView"
          : "LandingView(catch-all)";

    // #region agent log
    fetch("http://127.0.0.1:7493/ingest/f8c8e631-57b0-4152-abc1-83ff85c4f09b", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "8483d9" },
      body: JSON.stringify({
        sessionId: "8483d9",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "App.tsx:RouteDebugLogger",
        message: "Route resolved",
        data: {
          pathname,
          matchedComponent,
          sitemapMatch: sitemapMatch?.slug ?? null,
          sitemapMismatch: Boolean(sitemapMatch && matchedComponent === "LandingView(catch-all)"),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [pathname]);

  return null;
}

// Layouts
function AppLayout() {
  return <Outlet />; // For now, just renders the child route
}

export default function App() {
  return (
    <CmsProvider>
      <BrowserRouter>
        <SeoUpdater />
        <RouteDebugLogger />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingView />} />
            <Route path="/dashboard" element={<DashboardView />}>
              <Route index element={<DashboardHome />} />
              
              <Route path="data-hub" element={<DataHubView />} />
              <Route path="planner" element={<CampaignPlannerView />} />
              <Route path="marketplace" element={<B2BMarketplaceView />} />
              <Route path="noc" element={<OperationsNocView />} />
              <Route path="sitemap" element={<SitemapSeoView />} />
              <Route path="design-system" element={<DesignSystemAuditView />} />
            </Route>
            {/* Ruta para las subpáginas dinámicas */}
            <Route path="/:slug" element={<SubpageLayout />} />
            <Route path="/:slug/:subslug" element={<SubpageLayout />} />
          </Route>
        </Routes>
        <FloatingViewSwitcher />
      </BrowserRouter>
    </CmsProvider>
  );
}
