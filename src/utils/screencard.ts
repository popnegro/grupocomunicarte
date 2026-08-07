import { DoohScreen } from "../types";

/**
 * Dynamically generate location-specific benefits based on screen metadata.
 * This logic is brittle and should ideally be replaced with a more robust
 * tagging system in the CMS.
 */
export const getScreenLocationBenefits = (screen: DoohScreen) => {
  const benefits: { label: string; icon: string; description: string }[] = [];

  // 1. Pedestrian and Vehicle Traffic
  if (screen.tipo === "Peatonal") {
    benefits.push({ label: "Alto Flujo Peatonal", icon: "Users", description: "Zona comercial de alta densidad con tránsito peatonal continuo e intenso." });
  } else if (screen.tipo === "Vehicular") {
    benefits.push({ label: "Alto Impacto Vehicular", icon: "Car", description: "Avenida de velocidad controlada con flujo constante y gran alcance de visualización." });
  } else if (screen.tipo === "Mixto") {
    benefits.push({ label: "Impacto Sinérgico Mixto", icon: "Layers", description: "Excelente visibilidad y alcance estratégico para conductores y peatones." });
  }

  const nameLower = screen.nombre.toLowerCase();
  const zoneLower = screen.zona.toLowerCase();

  // 2. Specific landmark highlights
  if (nameLower.includes("palmares") || zoneLower.includes("palmares")) {
    benefits.push({
      label: "Centro Comercial Palmares",
      icon: "ShoppingBag",
      description: "Ubicación estratégica junto al principal polo de consumo premium y retail.",
    });
    benefits.push({
      label: "Cafeterías y Gastronomía",
      icon: "Coffee",
      description: "Rodeado de reconocidas cadenas gastronómicas, cafés de especialidad y cines.",
    });
  } else if (nameLower.includes("sarmiento") || nameLower.includes("9 de julio") || zoneLower.includes("centro")) {
    benefits.push({ label: "Centro Comercial & Bancario", icon: "Coins", description: "Cercanía inmediata a bancos principales, oficinas corporativas y administrativas." });
    benefits.push({ label: "Transporte Público Próximo", icon: "Bus", description: "Conexión directa con paradas de autobuses metropolitanos de alta frecuencia." });
  } else if (nameLower.includes("arístides") || zoneLower.includes("arístides") || nameLower.includes("mitre")) {
    benefits.push({ label: "Polo Gastronómico y Nocturno", icon: "Utensils", description: "Área de gran afluencia de público los 7 días de la semana por restaurantes y bares." });
    benefits.push({ label: "Esquina Semafórica", icon: "Timer", description: "Dwell Time prolongado que garantiza una lectura completa del spot publicitario." });
  } else {
    if (screen.tipo === "LeadMóvil" || screen.tipo === "Móvil") {
      benefits.push({
        label: "Cobertura Itinerante",
        icon: "Truck",
        description: "Recorrido dinámico por los principales centros comerciales y avenidas neurálgicas.",
      });
    } else {
      benefits.push({
        label: "Área Comercial Activa",
        icon: "TrendingUp",
        description: "Zona comercial con actividad económica de consumo y tránsito continuo.",
      });
    }
  }

  if (nameLower.includes("parque") || nameLower.includes("universidad") || zoneLower.includes("universitaria")) {
    benefits.push({
      label: "Zona Universitaria",
      icon: "GraduationCap",
      description: "Paso obligado de estudiantes, docentes y profesionales universitarios de la región.",
    });
  }

  return benefits;
};
