import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { NavCategory, NavItem, dashboardNavItems } from "./navigation";

interface SidebarProps {
  activeView: "landing" | "dashboard";
  isCollapsed?: boolean; // For future collapse functionality
  onToggleCollapse?: () => void; // For future collapse functionality
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView }) => {
  const location = useLocation();

  // Only show dashboard navigation for the dashboard view
  if (activeView !== "dashboard") {
    return null;
  }

  const renderNavItems = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              to={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className="hidden md:flex flex-col h-full border-r bg-card text-card-foreground p-4 w-64 shrink-0">
      <div className="flex items-center justify-center h-16 border-b px-4">
        {/* Placeholder for Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-foreground">
          <LucideIcons.Tv className="h-6 w-6 text-primary" />
          <span className="font-display">LeadMóvil</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 space-y-6">
        {dashboardNavItems.map((category: NavCategory, index: number) => (
          <div key={index} className="space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {category.title}
            </h3>
            {renderNavItems(category.items)}
          </div>
        ))}

        {/* Placeholder for User/Settings at the bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-4 border-t pt-4">
          <Link
            to="/dashboard/settings"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname === "/dashboard/settings"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <LucideIcons.Settings className="h-5 w-5" />
            <span>Ajustes</span>
          </Link>
          <Link
            to="/dashboard/profile" // Assuming a profile page
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname === "/dashboard/profile"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <LucideIcons.User className="h-5 w-5" />
            <span>Perfil</span>
          </Link>
          <button
            // onClick={handleLogout} // Future logout functionality
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full text-left"
          >
            <LucideIcons.LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};