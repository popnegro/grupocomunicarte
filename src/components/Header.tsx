import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { useCms } from "./CmsContext";
import { publicNavItems, NavItem } from "./navigation";

// Assuming shadcn/ui components are available or will be added
// import { Button } from "../ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

interface HeaderProps {
  activeView: "landing" | "dashboard";
}

export const Header: React.FC<HeaderProps> = ({ activeView }) => {
  const location = useLocation();
  const { activeSlug } = useCms();

  const renderPublicNav = () => (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {publicNavItems.map((item: NavItem) => (
        <Link
          key={item.href}
          to={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            activeSlug === item.href ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );

  const renderDashboardHeader = () => (
    <div className="flex items-center gap-4">
      {/* Mobile sidebar toggle */}
      {/* <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <LucideIcons.Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar activeView="dashboard" />
        </SheetContent>
      </Sheet> */}
      <h1 className="text-xl font-bold text-foreground font-display">Dashboard</h1> {/* Dynamic title later */}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background px-4 py-3 shadow-sm">
      <div className="flex h-10 items-center justify-between">
        <div className="flex items-center space-x-4">
          {activeView === "landing" ? (
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
              <LucideIcons.Tv className="h-6 w-6 text-primary" />
              <span className="font-display">Grupo Comunicarte</span>
            </Link>
          ) : (
            // For dashboard, logo is in sidebar, header can have breadcrumbs or title
            renderDashboardHeader()
          )}
        </div>

        {activeView === "landing" && renderPublicNav()}

        <div className="flex items-center space-x-4">
          {/* Search, Notifications, User Avatar - placeholders for now */}
          <LucideIcons.Search className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" />
          <LucideIcons.Bell className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" />
          <LucideIcons.UserCircle className="h-8 w-8 text-muted-foreground cursor-pointer hover:text-foreground" />
          {/* Theme switcher placeholder */}
          {/* <Button variant="ghost" size="icon">
            <LucideIcons.Sun className="h-5 w-5" />
          </Button> */}
        </div>
      </div>
    </header>
  );
};