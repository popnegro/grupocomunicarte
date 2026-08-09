import { DoohScreen } from "../types";

/**
 * Calculates days remaining between a target reservation end date and today.
 */
export const getDaysRemaining = (endDateStr: string): number => {
  // Ensure we parse the date cleanly in local time to avoid timezone offsets
  const parts = endDateStr.split("-");
  let endDate: Date;
  if (parts.length === 3) {
    endDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else {
    endDate = new Date(endDateStr);
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Formats the availability date into DD/MM/YYYY
 */
export const formatAvailabilityDate = (endDateStr: string): string => {
  const parts = endDateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const dateObj = new Date(endDateStr);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Dynamically determines the reservation end date based on the occupancy matrix
 * if it is not explicitly configured on the screen object.
 */
export const getDynamicReservationEndDate = (
  screen: DoohScreen,
  occupancyMatrix: Record<string, string[]>
): string => {
  // If explicitly configured, use it
  if (screen.reservationEndDate) {
    return screen.reservationEndDate;
  }

  const screenWeeks = occupancyMatrix[screen.id] || ["available", "available", "available", "available"];
  
  // Find the last consecutive occupied week from week 1 (index 0)
  let lastOccupiedWeekIdx = -1;
  for (let i = 0; i < screenWeeks.length; i++) {
    const status = screenWeeks[i];
    if (status === "reserved" || status === "campaign" || status === "maintenance") {
      lastOccupiedWeekIdx = i;
    } else {
      // Break on the first available week to find consecutive reservation end
      break;
    }
  }

  // Weeks of August 2026
  const weekEndDates = [
    "2026-08-07", // Week 1 end
    "2026-08-14", // Week 2 end
    "2026-08-21", // Week 3 end
    "2026-08-31", // Week 4 end
  ];

  if (lastOccupiedWeekIdx !== -1) {
    return weekEndDates[lastOccupiedWeekIdx];
  }

  // If the screen status is reserved but no weeks are marked, default to end of week 2
  const normalizedStatus = (screen.status || "").toLowerCase();
  if (normalizedStatus === "reserved" || normalizedStatus === "no disponible" || normalizedStatus === "pausado") {
    return "2026-08-14";
  }

  return "2026-08-01"; // Already available
};

/**
 * Core interface for calculated screen availability status.
 */
export interface ScreenAvailability {
  isAvailable: boolean;
  status: "available" | "reserved" | "upcoming";
  badgeLabel: string;
  badgeStyle: string;
  toastMessage: string;
  ctaLabel: string;
  daysRemaining: number | null;
}

/**
 * Unified getter for screen availability status and text formatting.
 * Keeps the badge, toast, calendar, and CTA 100% in sync.
 */
export const getScreenAvailability = (
  screen: DoohScreen,
  occupancyMatrix: Record<string, string[]>
): ScreenAvailability => {
  const normStatus = (screen.status || "").toLowerCase();
  const screenWeeks = occupancyMatrix[screen.id] || ["available", "available", "available", "available"];
  const currentWeekStatus = screenWeeks[0] || "available";

  // Check if reserved either via explicit screen status OR current week status
  const isExplicitlyReserved = normStatus === "reserved" || normStatus === "no disponible" || normStatus === "pausado";
  const isCurrentlyOccupied = currentWeekStatus === "reserved" || currentWeekStatus === "campaign" || currentWeekStatus === "maintenance";

  const isReserved = isExplicitlyReserved || isCurrentlyOccupied;
  const isUpcoming = normStatus === "upcoming";

  let status: "available" | "reserved" | "upcoming" = "available";
  if (isReserved) status = "reserved";
  else if (isUpcoming) status = "upcoming";

  const endDateStr = getDynamicReservationEndDate(screen, occupancyMatrix);
  const days = getDaysRemaining(endDateStr);
  const formattedDate = formatAvailabilityDate(endDateStr);

  // Calculate user-friendly relative toast messages
  let toastMessage = "Disponible ya";
  if (days < 0) {
    toastMessage = "Disponible ya";
  } else if (days === 0) {
    toastMessage = "Disponible hoy";
  } else if (days === 1) {
    toastMessage = "Disponible mañana";
  } else if (days <= 14) {
    toastMessage = `Disponible nuevamente en ${days} días`;
  } else {
    toastMessage = `Disponible a partir del ${formattedDate}`;
  }

  // Visual badges and colors matching requirements
  let badgeLabel = "Disponible";
  let badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-150";
  let ctaLabel = "Agregar al Media Kit";

  if (status === "reserved") {
    badgeLabel = "Reservado";
    badgeStyle = "bg-stone-100 text-stone-500 border-stone-200";
    ctaLabel = "Consultar disponibilidad";
  } else if (status === "upcoming") {
    badgeLabel = "Próximamente";
    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
    ctaLabel = "Reservar para próxima fecha";
  }

  return {
    isAvailable: status === "available",
    status,
    badgeLabel,
    badgeStyle,
    toastMessage,
    ctaLabel,
    daysRemaining: status !== "available" ? days : null,
  };
};
