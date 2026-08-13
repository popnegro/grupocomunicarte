import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DashboardView } from './DashboardView';

/**
 * Keeps the legacy Media Kit tab out of DashboardView.
 * The old JSON exporter is intentionally bypassed in favor of MediaKitStudio.
 */
export function DashboardRoute() {
  const { currentDashboardTab, setDashboardTab } = useApp();

  const isLegacyMediaKitTab = currentDashboardTab === 'mediakits';

  useEffect(() => {
    if (isLegacyMediaKitTab) {
      setDashboardTab('metrics');
    }
  }, [isLegacyMediaKitTab, setDashboardTab]);

  if (isLegacyMediaKitTab) {
    return <Navigate to="/dashboard/mediakits" replace />;
  }

  return <DashboardView />;
}
