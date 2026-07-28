/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CmsProvider, useCms } from "./components/CmsContext";
import { LandingView } from "./components/LandingView";
import { DashboardView } from "./components/DashboardView";
import { OnboardingView } from "./components/OnboardingView";

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

export default function App() {
  return (
    <CmsProvider>
      <NavigationRouter />
    </CmsProvider>
  );
}
