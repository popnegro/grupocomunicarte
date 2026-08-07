import * as LucideIcons from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType; // Lucide icon component
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

export interface NavCategory {
  title: string;
  items: NavItem[];
}

export const dashboardNavItems: NavCategory[] = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LucideIcons.LayoutDashboard,
      },
      {
        title: "Leads",
        href: "/dashboard/leads",
        icon: LucideIcons.Users,
      },
      {
        title: "Contactos",
        href: "/dashboard/contacts",
        icon: LucideIcons.Mail,
      },
    ],
  },
  {
    title: "Operación",
    items: [
      {
        title: "Campañas",
        href: "/dashboard/campaigns",
        icon: LucideIcons.Megaphone,
      },
      {
        title: "Clientes",
        href: "/dashboard/clients",
        icon: LucideIcons.Briefcase,
      },
      {
        title: "Inventario",
        href: "/dashboard/inventory",
        icon: LucideIcons.Tv,
      },
      {
        title: "Sincronización",
        href: "/dashboard/sync",
        icon: LucideIcons.RefreshCw,
      },
    ],
  },
  {
    title: "Configuración",
    items: [
      { title: "Ajustes", href: "/dashboard/settings", icon: LucideIcons.Settings },
      { title: "Usuarios", href: "/dashboard/users", icon: LucideIcons.UserCog },
    ],
  },
];

export const publicNavItems: NavItem[] = [
  {
    title: "Inicio",
    href: "/",
    icon: LucideIcons.Home, // Placeholder icon
  },
  {
    title: "Soportes",
    href: "/soportes",
    icon: LucideIcons.Tv, // Placeholder icon
  },
  {
    title: "Espacios",
    href: "/espacios-publicitarios",
    icon: LucideIcons.LayoutGrid, // Placeholder icon
  },
  {
    title: "Soluciones",
    href: "/soluciones",
    icon: LucideIcons.Lightbulb, // Placeholder icon
  },
  {
    title: "Nosotros",
    href: "/nosotros",
    icon: LucideIcons.Users, // Placeholder icon
  },
  {
    title: "Contacto",
    href: "/contacto",
    icon: LucideIcons.Mail, // Placeholder icon
  },
];