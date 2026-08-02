import { ChevronRight, Home } from "lucide-react";
import { useCms } from "../CmsContext";

interface BreadcrumbProps {
  module: string;
  subPath?: string;
}

export const DashboardBreadcrumb: React.FC<BreadcrumbProps> = ({ 
  module, 
  subPath 
}) => {
  const { setCurrentDashboardTab } = useCms();

  const breadcrumbs = [
    { label: "Dashboard", action: () => setCurrentDashboardTab("home") },
    ...(module !== "home" ? [{ label: module, action: null }] : []),
    ...(subPath ? [{ label: subPath, action: null }] : []),
  ];

  return (
    <nav 
      className="flex items-center gap-2 px-6 py-3 bg-stone-50 border-b border-stone-200"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-stone-400" />}
          {item.action ? (
            <button
              onClick={item.action}
              className="text-xs font-semibold text-[#06434a] hover:underline cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-xs font-semibold text-stone-500">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
