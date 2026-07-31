import React, { useState, useMemo, useCallback } from "react";
import {
  DashboardHomeProps,
} from "./home/types";
import {
  AIRevenueSuggestions,
  ConflictCard,
  HeroBanner,
  MediaKitCard,
  OperationMetrics,
  PendingQuoteCard,
  SidePanel,
  ToastNotification,
  UpcomingAvailabilityCard,
  UrgentTasksSection
} from "./home";
import { EmptyState } from "./shared/StateIndicators";

// Mock data that should be received as props.
// This is just for making the component render without errors.
const MOCK_DATA = {
  RESERVAS: [
    {
      id: "rv-402",
      mediakitId: "mk-101",
      clienteNombre: "Toyota Mendoza",
      screenId: "sc-01",
      screenNombre: "Sarmiento y 9 de Julio (sc-01)",
      fechaInicio: "5 de agosto",
      fechaFin: "10 de agosto",
      estado: "Pendiente",
      conflictiva: true,
    },
  ],
  CAMPAIGN: {
    name: "Cencosud S.A.",
    period: "cp-502",
  },
  QUOTES: [
    {
      id: "qt-101",
      mediakitId: "mk-101",
      mediakitNombre: "Lanzamiento Toyota Hilux 2026",
      clienteNombre: "Toyota Mendoza",
      descuentoPercent: 10,
      validez: "5 días",
      condiciones: "Pago a 30 días",
      total: 1440000,
      estado: "Enviada",
    },
  ],
  SUGGESTIONS: [
    {
      type: "Sugerencia de Precios",
      details: `Mendoza centro registra <strong class="text-stone-900 font-bold">92% de ocupación</strong> sostenida en LED Peatonal. Sugerimos incrementar tarifas un <strong class="text-stone-900 font-bold">12% global</strong> para nuevos contratos.`,
    },
    {
      type: "Soporte Ocioso",
      details: `La pantalla <strong class="text-stone-900 font-bold">Las Heras y Mitre (sc-03)</strong> tiene disponibilidad ociosa las próximas 3 semanas. Generar descuento relámpago del <strong class="text-stone-900 font-bold">25%</strong> para retail.`,
    },
  ],
};


export const DashboardHome: React.FC<DashboardHomeProps> = ({
  mediaKits,
  cotizaciones,
  reservas,
  campañas,
  leads,
  userRole,
  loading,
  error,
  onNavigateToTab,
  onApproveReserva,
  onApproveCotizacion,
}) => {
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  }, []);

  const metrics = useMemo(() => {
    const acceptedQuotes = cotizaciones.filter(c => c.estado === "Aceptada").length;
    const conversionRate = leads.length > 0 ? ((acceptedQuotes / leads.length) * 100).toFixed(1) : "0.0";
    const projectedRevenue = cotizaciones.reduce((acc, q) => acc + q.total, 0);
    return {
      activeCampaigns: campañas.filter(c => c.estado === "Activa").length,
      totalLeads: leads.length,
      pendingQuotes: cotizaciones.filter(q => q.estado === "Enviada").length,
      conversionRate,
      projectedRevenue,
      occupation: 81.4, // This should be calculated from props
    };
  }, [leads, cotizaciones, campañas]);

  const conflicts = useMemo(() => reservas.filter(r => r.conflictiva).length, [reservas]);

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto font-sans">
      <ToastNotification message={showToast} />

      <HeroBanner
        conflicts={conflicts}
        pendingQuotes={metrics.pendingQuotes}
        topLocation={{ name: "Mendoza", occupation: 92 }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <UrgentTasksSection>
          {mediaKits.filter(mk => mk.estado === 'Nuevo').length > 0 ?
            mediaKits.filter(mk => mk.estado === 'Nuevo').map(mk => (
              <MediaKitCard
                key={mk.id}
                loading={loading}
                onNavigateToTab={onNavigateToTab}
                triggerToast={triggerToast}
              />
            )) : <EmptyState message="No hay nuevos MediaKits." />
          }

          {cotizaciones.filter(c => c.estado === 'Enviada').length > 0 ?
            cotizaciones.filter(c => c.estado === 'Enviada').map(quote => (
              <PendingQuoteCard
                key={quote.id}
                loading={loading}
                quote={MOCK_DATA.QUOTES[0]} // Using mock data here
                onApproveCotizacion={onApproveCotizacion}
                triggerToast={triggerToast}
              />
            )) : <EmptyState message="No hay cotizaciones pendientes." />
          }
          
          {reservas.filter(r => r.conflictiva).length > 0 ?
            reservas.filter(r => r.conflictiva).map(reservation => (
              <ConflictCard
                key={reservation.id}
                loading={loading}
                reservation={MOCK_DATA.RESERVAS[0]} // Using mock data here
                conflictingCampaign={MOCK_DATA.CAMPAIGN}
                onNavigateToTab={onNavigateToTab}
                triggerToast={triggerToast}
              />
            )) : <EmptyState message="No hay conflictos de reservas." />
          }

          <UpcomingAvailabilityCard
            loading={loading}
            screenName="Obelisco Pantalla Monumental (ba-01)"
            daysToRelease={3}
            currentCampaign="Telecom"
            suggestion="Se sugiere contactar a Agencia JWT para ofrecer continuidad o habilitar preventa."
          />
        </UrgentTasksSection>

        <SidePanel>
          <AIRevenueSuggestions loading={loading} suggestions={MOCK_DATA.SUGGESTIONS} />
          <OperationMetrics loading={loading} metrics={metrics} error={error} />
        </SidePanel>
      </div>
    </div>
  );
};
