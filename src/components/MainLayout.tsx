import React from "react";
import { Sidebar } from "./Sidebar"; // Corrected path
import { Header } from "./Header"; // Corrected path
import { useCms } from "./CmsContext"; // Corrected path

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { activeView } = useCms();

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* Sidebar for dashboard view */}
      {activeView === "dashboard" && <Sidebar activeView={activeView} />}

      <div className="flex flex-col flex-1">
        {/* Header for both views */}
        <Header activeView={activeView} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};