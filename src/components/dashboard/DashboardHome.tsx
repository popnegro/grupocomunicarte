import React, { useMemo } from "react";
import { useCms } from "../CmsContext";
import { MediaKit, Cliente, Role } from "./types";
import {
  ArrowRight,
  FileText,
  Inbox,
  Monitor,
  Users,
  Activity,
  CheckCircle2,
  Clock3,
} from "lucide-react";

interface DashboardHomeProps {
  mediaKits: MediaKit[];
  clientes: Cliente[];
  userRole: Role;
  onNavigateToTab: (tab: string) => void;
  addLog?: (action: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  mediaKits,
  clientes,
  onNavigateToTab,
}) => {
  const { screens } = useCms();

  const screenMetrics = useMemo(() => {
    const total = screens.length;

    const available = screens.filter(
      (screen) =>
        screen.status === "Disponible" || screen.status === "Activo"
    ).length;

    const occupied = screens.filter(
      (screen) =>
        screen.status === "Activo" ||
        screen.status === "No disponible"
    ).length;

    const paused = screens.filter(
      (screen) =>
        screen.status === "Pausado" ||
        screen.status === "No disponible"
    ).length;

    const availabilityRate =
      total > 0 ? Math.round((available / total) * 100) : 0;

    return {
      total,
      available,
      occupied,
      paused,
      availabilityRate,
    };
  }, [screens]);

  const mediaKitMetrics = useMemo(() => {
    const total = mediaKits.length;

    const active = mediaKits.filter(
      (mediaKit) =>
        mediaKit.estado !== "Archivado" &&
        mediaKit.estado !== "Rechazado"
    ).length;

    return {
      total,
      active,
    };
  }, [mediaKits]);

 const recentMediaKits = useMemo(() => {
  return mediaKits.slice(0, 5);
}, [mediaKits]);

  const recentScreens = useMemo(() => {
    return screens.slice(0, 5);
  }, [screens]);

  const navigateTo = (tab: string) => {
    onNavigateToTab(tab);
  };

  return (
    <div className="min-h-full bg-[#FAF9F5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Intro */}
        <section className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">
            Centro de operación comercial
          </span>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-500">
                Vista operativa de soportes, leads y Media Kits.
                Los indicadores se derivan de los datos disponibles
                en el sistema.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-500 shadow-sm">
              <Activity className="h-3.5 w-3.5 text-[#06434a]" />
              Datos operativos
            </div>
          </div>
        </section>

        {/* Primary metrics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            icon={<Monitor className="h-4 w-4" />}
            label="Soportes"
            value={screenMetrics.total}
            detail={`${screenMetrics.available} disponibles`}
            onClick={() => navigateTo("inventario")}
          />

          <MetricCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Disponibilidad"
            value={`${screenMetrics.availabilityRate}%`}
            detail={`${screenMetrics.paused} pausados`}
            onClick={() => navigateTo("inventario")}
          />

          <MetricCard
            icon={<Inbox className="h-4 w-4" />}
            label="Leads"
            value="Ver"
            detail="Solicitudes comerciales"
            onClick={() => navigateTo("leads")}
          />

          <MetricCard
            icon={<FileText className="h-4 w-4" />}
            label="Media Kits"
            value={mediaKitMetrics.total}
            detail={`${mediaKitMetrics.active} activos`}
            onClick={() => navigateTo("mediakit")}
          />

        </section>

        {/* Operational grid */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">

          {/* Recent Media Kits */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 p-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">
                  Actividad comercial
                </p>

                <h2 className="mt-1 text-sm font-black text-stone-900">
                  Media Kits recientes
                </h2>
              </div>

              <button
                type="button"
                onClick={() => navigateTo("mediakit")}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-black uppercase tracking-wider text-[#06434a] transition-colors hover:bg-stone-50"
              >
                Ver todos
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {recentMediaKits.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-5 w-5" />}
                title="No hay Media Kits"
                description="Las propuestas comerciales aparecerán aquí cuando existan."
              />
            ) : (
              <div className="divide-y divide-stone-100">
                {recentMediaKits.map((mediaKit) => (
                  <div
                    key={mediaKit.id}
                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-stone-50/70"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-stone-900">
                        {mediaKit.nombre || "Media Kit sin nombre"}
                      </p>

                      <p className="mt-1 truncate text-[11px] text-stone-500">
                        {mediaKit.clienteNombre || "Sin cliente asociado"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge estado={mediaKit.estado} />

                      <button
                        type="button"
                        onClick={() => navigateTo("mediakit")}
                        className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-white hover:text-[#06434a]"
                        aria-label={`Abrir ${mediaKit.nombre || "Media Kit"}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inventory summary */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">
                Inventario
              </p>

              <h2 className="mt-1 text-sm font-black text-stone-900">
                Estado de soportes
              </h2>
            </div>

            <div className="space-y-4 p-5">

              <InventoryRow
                label="Total"
                value={screenMetrics.total}
                icon={<Monitor className="h-4 w-4" />}
              />

              <InventoryRow
                label="Disponibles"
                value={screenMetrics.available}
                icon={<CheckCircle2 className="h-4 w-4" />}
              />

              <InventoryRow
                label="Ocupados / activos"
                value={screenMetrics.occupied}
                icon={<Activity className="h-4 w-4" />}
              />

              <InventoryRow
                label="Pausados / no disponibles"
                value={screenMetrics.paused}
                icon={<Clock3 className="h-4 w-4" />}
              />

              <button
                type="button"
                onClick={() => navigateTo("inventario")}
                className="mt-2 flex w-full items-center justify-between rounded-xl border border-stone-200 px-4 py-3 text-left transition-all hover:border-[#06434a]/20 hover:bg-stone-50"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-600">
                  Gestionar soportes
                </span>

                <ArrowRight className="h-4 w-4 text-[#06434a]" />
              </button>
            </div>
          </div>
        </section>

        {/* Inventory preview */}
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 p-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">
                Catálogo
              </p>

              <h2 className="mt-1 text-sm font-black text-stone-900">
                Soportes recientes
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigateTo("inventario")}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-black uppercase tracking-wider text-[#06434a] transition-colors hover:bg-stone-50"
            >
              Abrir soportes
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {recentScreens.length === 0 ? (
            <EmptyState
              icon={<Monitor className="h-5 w-5" />}
              title="No hay soportes disponibles"
              description="El catálogo se mostrará cuando existan registros."
            />
          ) : (
            <div className="grid grid-cols-1 divide-y divide-stone-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-5">
              {recentScreens.map((screen) => (
                <div
                  key={screen.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Monitor className="h-4 w-4 shrink-0 text-[#06434a]" />
                    <StatusBadge estado={screen.status} />
                  </div>

                  <p className="mt-3 truncate text-xs font-bold text-stone-900">
                    {screen.nombre}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-stone-500">
                    {screen.ciudad} · {screen.categoria}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick navigation */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">

          <QuickAction
            icon={<Monitor className="h-4 w-4" />}
            title="Gestionar soportes"
            description="Inventario y disponibilidad."
            onClick={() => navigateTo("inventario")}
          />

          <QuickAction
            icon={<Inbox className="h-4 w-4" />}
            title="Revisar leads"
            description="Solicitudes comerciales."
            onClick={() => navigateTo("leads")}
          />

          <QuickAction
            icon={<FileText className="h-4 w-4" />}
            title="Abrir Media Kits"
            description="Propuestas comerciales."
            onClick={() => navigateTo("mediakit")}
          />

        </section>

        {/* Clients are kept as a contextual signal, not as a new workflow */}
        <section className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-50 text-stone-500">
            <Users className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              Contactos registrados
            </p>

            <p className="mt-0.5 text-sm font-black text-stone-900">
              {clientes.length}
            </p>
          </div>

          <span className="ml-auto text-[10px] text-stone-400">
            Gestión disponible desde Clientes
          </span>
        </section>

      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  detail: string;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  detail,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#06434a]/20 hover:shadow-md"
  >
    <div className="flex items-center justify-between">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#06434a]/5 text-[#06434a]">
        {icon}
      </div>

      <ArrowRight className="h-4 w-4 text-stone-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#06434a]" />
    </div>

    <p className="mt-5 text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">
      {label}
    </p>

    <p className="mt-1 text-2xl font-black tracking-tight text-stone-900">
      {value}
    </p>

    <p className="mt-1 text-[11px] text-stone-500">
      {detail}
    </p>
  </button>
);

const InventoryRow: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-50 text-stone-500">
      {icon}
    </div>

    <span className="flex-1 text-xs font-medium text-stone-600">
      {label}
    </span>

    <strong className="text-sm font-black text-stone-900">
      {value}
    </strong>
  </div>
);

const QuickAction: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition-all hover:border-[#06434a]/20 hover:bg-stone-50"
  >
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#06434a]/5 text-[#06434a]">
      {icon}
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-xs font-black text-stone-900">
        {title}
      </p>

      <p className="mt-0.5 text-[10px] text-stone-500">
        {description}
      </p>
    </div>

    <ArrowRight className="h-4 w-4 shrink-0 text-stone-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#06434a]" />
  </button>
);

const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-50 text-stone-400">
      {icon}
    </div>

    <p className="mt-3 text-xs font-bold text-stone-700">
      {title}
    </p>

    <p className="mt-1 max-w-sm text-[11px] leading-5 text-stone-400">
      {description}
    </p>
  </div>
);

const StatusBadge: React.FC<{ estado?: string }> = ({ estado }) => {
  const normalized = String(estado || "").toLowerCase();

  const tone =
    normalized.includes("activo") ||
    normalized.includes("disponible") ||
    normalized.includes("acept")
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : normalized.includes("paus") ||
        normalized.includes("rechaz") ||
        normalized.includes("no disponible")
      ? "bg-rose-50 text-rose-700 border-rose-100"
      : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <span
      className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${tone}`}
    >
      {estado || "Sin estado"}
    </span>
  );
};