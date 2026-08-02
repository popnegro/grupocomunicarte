/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CmsProvider, useCms } from "./components/CmsContext";
import { LandingView } from "./components/LandingView";
import { DashboardView } from "./components/DashboardView";
import { motion } from "motion/react";
import { LayoutDashboard, Globe, Sparkles } from "lucide-react";

function NavigationRouter() {
  const { activeView } = useCms();

  switch (activeView) {
    case "landing":
      return <LandingView />;
    case "dashboard":
      return <DashboardView />;
    default:
      return <LandingView />;
  }
}

export default function App() {
  return (
    <CmsProvider>
      <NavigationRouter />
    </CmsProvider>
  );
}

