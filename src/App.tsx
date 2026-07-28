/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CmsProvider, useCms } from "./components/CmsContext";
import { LandingView } from "./components/LandingView";
import { DashboardView } from "./components/DashboardView";
import { OnboardingView } from "./components/OnboardingView";
import { motion } from "motion/react";
import { LayoutDashboard, Globe, ClipboardList, Sparkles } from "lucide-react";

function NavigationRouter() {
  const { activeView } = useCms();

  switch (activeView) {
    case "landing":
      return <LandingView />;
    case "dashboard":
      return <DashboardView />;
    case "onboarding":
      return <OnboardingView />;
    default:
      return <LandingView />;
  }
}

function FloatingViewSwitcher() {
  const { activeView, setActiveView } = useCms();

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

      <button
        onClick={() => setActiveView("landing")}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer text-[11px] uppercase tracking-wider ${
          activeView === "landing"
            ? "bg-white text-slate-950 shadow-sm font-black"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Globe className="h-3.5 w-3.5" />
        <span>Landing Pública</span>
      </button>

      <button
        onClick={() => setActiveView("dashboard")}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer text-[11px] uppercase tracking-wider ${
          activeView === "dashboard"
            ? "bg-white text-slate-950 shadow-sm font-black"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        <span>Consola B2B</span>
      </button>

      <button
        onClick={() => setActiveView("onboarding")}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer text-[11px] uppercase tracking-wider ${
          activeView === "onboarding"
            ? "bg-white text-slate-950 shadow-sm font-black"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <ClipboardList className="h-3.5 w-3.5" />
        <span>Quiz Onboarding</span>
      </button>
    </motion.div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <NavigationRouter />
      <FloatingViewSwitcher />
    </CmsProvider>
  );
}

