/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CmsProvider, useCms } from "./components/CmsContext";
import { LandingView } from "./components/LandingView";
import { DashboardView } from "./components/DashboardView";
import { OnboardingView } from "./components/OnboardingView"; // NEW
import { motion } from "motion/react";
import { LayoutDashboard, Globe, Sparkles } from "lucide-react";

function NavigationRouter() {
  const { activeView, onboardingDone } = useCms(); // Get onboardingDone

  if (!onboardingDone) {
    return <OnboardingView />;
  }

  switch (activeView) {
    case "landing":
      return <LandingView />;
    case "dashboard":
      return <DashboardView />;
    case "onboarding": // New case to handle direct navigation to onboarding
        return <OnboardingView />;
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

