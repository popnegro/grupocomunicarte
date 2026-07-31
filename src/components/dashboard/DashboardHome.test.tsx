import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardHome } from './DashboardHome';
import { DashboardHomeProps } from './home/types';
import { MediaKit, Cotizacion, Reserva, Campaña, Lead, Role } from './types';

const mockProps: DashboardHomeProps = {
  mediaKits: [
    { id: 'mk-1', estado: 'Nuevo', clienteNombre: 'Client A' } as MediaKit,
  ],
  cotizaciones: [
    { id: 'qt-1', estado: 'Enviada', clienteNombre: 'Client B', total: 1000, validez: '1 day', descuentoPercent: 0 } as Cotizacion,
  ],
  reservas: [
    { id: 'rv-1', conflictiva: true, clienteNombre: 'Client C', screenNombre: 'Screen 1', fechaInicio: '2024-01-01', fechaFin: '2024-01-05' } as Reserva,
  ],
  campañas: [
    { id: 'cp-1', estado: 'Activa' } as Campaña,
  ],
  leads: [
      {id: 'l-1'} as Lead,
      {id: 'l-2'} as Lead,
  ],
  userRole: 'admin' as Role,
  loading: false,
  error: null,
  onNavigateToTab: vi.fn(),
  onApproveReserva: vi.fn(),
  onApproveCotizacion: vi.fn(),
};

describe('DashboardHome', () => {
  it('renders the main sections and hero banner', () => {
    render(<DashboardHome {...mockProps} />);
    expect(screen.getByText('¿Qué tenemos que resolver hoy?')).toBeInTheDocument();
    expect(screen.getByText('Acciones Urgentes e Impactos del Día')).toBeInTheDocument();
    expect(screen.getByText('Métricas de Operación')).toBeInTheDocument();
  });

  it('displays the correct number of conflicts and pending quotes in the hero banner', () => {
    render(<DashboardHome {...mockProps} />);
    const heroText = screen.getByText(/La plataforma ha detectado/);
    expect(heroText).toHaveTextContent('1 conflicto de disponibilidad');
    expect(heroText).toHaveTextContent('1 cotizaciones listas para envío');
  });

  it('renders the MediaKitCard for new media kits', () => {
    render(<DashboardHome {...mockProps} />);
    expect(screen.getByText('Lanzamiento Toyota Hilux 2026 (Mendoza)')).toBeInTheDocument();
  });

  it('shows EmptyState when there are no new media kits', () => {
    render(<DashboardHome {...mockProps} mediaKits={[]} />);
    expect(screen.getByText('No hay nuevos MediaKits.')).toBeInTheDocument();
  });

  it('renders the PendingQuoteCard for pending quotes', () => {
    render(<DashboardHome {...mockProps} />);
    expect(screen.getByText(/#qt-101 para Toyota Mendoza/)).toBeInTheDocument();
  });

  it('shows EmptyState when there are no pending quotes', () => {
    render(<DashboardHome {...mockProps} cotizaciones={[]} />);
    expect(screen.getByText('No hay cotizaciones pendientes.')).toBeInTheDocument();
  });

  it('renders the ConflictCard for conflicting reservations', () => {
    render(<DashboardHome {...mockProps} />);
    expect(screen.getByText(/Overbooking detectado en/)).toBeInTheDocument();
  });

  it('shows EmptyState when there are no conflicts', () => {
    render(<DashboardHome {...mockProps} reservas={[]} />);
    expect(screen.getByText('No hay conflictos de reservas.')).toBeInTheDocument();
  });
  
  it('displays the correct operation metrics', () => {
    render(<DashboardHome {...mockProps} />);
    expect(screen.getByTestId('metric-row-Ocupación Global')).toHaveTextContent('81.4%');
    expect(screen.getByTestId('metric-row-Campañas Activas')).toHaveTextContent('1');
    expect(screen.getByTestId('metric-row-Tasa Conversión')).toHaveTextContent('0.0%');
    // For the last metric, which is not a MetricRow
    const projectedRevenueElement = screen.getByText('Ingresos Proyectados');
    const parentElement = projectedRevenueElement.parentElement?.parentElement;
    expect(parentElement).toHaveTextContent('$0.00M');
  });

  it('calls onNavigateToTab and shows a toast when "Generar Cotización" is clicked', async () => {
    render(<DashboardHome {...mockProps} />);
    fireEvent.click(screen.getByText('Generar Cotización'));
    expect(mockProps.onNavigateToTab).toHaveBeenCalledWith('mediakit');
    expect(await screen.findByText('Abriendo editor de MediaKit...')).toBeInTheDocument();
  });

  it('calls onApproveCotizacion and shows a toast when "Aprobar desde Cliente" is clicked', async () => {
    render(<DashboardHome {...mockProps} />);
    fireEvent.click(screen.getByText('Aprobar desde Cliente'));
    expect(mockProps.onApproveCotizacion).toHaveBeenCalledWith('qt-101');
    expect(await screen.findByText(/Cotización aprobada por cliente/)).toBeInTheDocument();
  });
  
  it('calls onNavigateToTab and shows a toast when "Resolver Conflicto" is clicked', async () => {
    render(<DashboardHome {...mockProps} />);
    fireEvent.click(screen.getByText('Resolver Conflicto'));
    expect(mockProps.onNavigateToTab).toHaveBeenCalledWith('reservas');
    expect(await screen.findByText(/Redirigiendo a resolución de reservas/)).toBeInTheDocument();
  });

  it('renders AI suggestions', () => {
    render(<DashboardHome {...mockProps} />);
    expect(screen.getByText('Sugerencias de Revenue IA')).toBeInTheDocument();
    expect(screen.getByText(/Mendoza centro registra/)).toBeInTheDocument();
  });
  
});
