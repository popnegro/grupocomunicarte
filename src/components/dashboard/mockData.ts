import { MediaKit, Cotizacion, Reserva, Campaña, Cliente, ChangeLog, LedVehicle } from "./types";

export const INITIAL_CLIENTES: Cliente[] = [
  {
    id: "cl-01",
    nombre: "Ana de la Cruz",
    empresa: "Toyota Mendoza",
    email: "ana.cruz@toyotamendoza.com.ar",
    telefono: "+54 261 455-1212",
    categoria: "Corporativo",
    campañasActivas: 2,
    totalInversión: 1450000,
  },
  {
    id: "cl-02",
    nombre: "Carlos Bianchi",
    empresa: "Agencia JWT Argentina",
    email: "carlos.bianchi@jwt.com",
    telefono: "+54 11 4899-0099",
    categoria: "Agencia",
    campañasActivas: 3,
    totalInversión: 3820000,
  },
  {
    id: "cl-03",
    nombre: "Martín Palermo",
    empresa: "Cencosud S.A.",
    email: "palermo@cencosud.com.ar",
    telefono: "+54 261 511-2233",
    categoria: "Corporativo",
    campañasActivas: 1,
    totalInversión: 980000,
  },
  {
    id: "cl-04",
    nombre: "Sofía Martínez",
    empresa: "Franquicias Café Central",
    email: "sofia@cafecentral.com.ar",
    telefono: "+54 264 422-3344",
    categoria: "Directo",
    campañasActivas: 0,
    totalInversión: 420000,
  }
];

export const INITIAL_MEDIAKITS: MediaKit[] = [
  {
    id: "mk-201",
    nombre: "Lanzamiento Toyota Hilux 2026",
    clienteId: "cl-01",
    clienteNombre: "Toyota Mendoza",
    ciudad: "Mendoza",
    screenIds: ["sc-01", "sc-02", "sc-11"],
    version: 2,
    estado: "Cotizando",
    fecha: "2026-07-28",
    presupuesto: 4000000,
    objetivo: "Branding de alta densidad vehicular y peatonal",
    comentarios: [
      { id: "c-1", user: "Director Comercial", text: "Cliente solicita priorizar Palmares por flujo ABC1.", date: "2026-07-28 15:30" }
    ],
    historial: [
      { id: "h-1", action: "Creado por Comercial Ejec.", date: "2026-07-28 10:00", user: "Comercial Ejec." },
      { id: "h-2", action: "Agregada pantalla LeadMóvil Mendoza Express (sc-11)", date: "2026-07-28 14:15", user: "Director Comercial" }
    ],
    soportesEdicionInline: [
      { id: "sc-01", notas: "Pautado central de spots 15s cada 120s.", prioridad: "Alta", duracionSem: 4 },
      { id: "sc-02", notas: "Esquina premium Palmares, máxima nitidez.", prioridad: "Alta", duracionSem: 4 },
      { id: "sc-11", notas: "Recorrido dinámico por Arístides de 17h a 21h.", prioridad: "Media", duracionSem: 2 }
    ]
  },
  {
    id: "mk-202",
    nombre: "Campaña Institucional Cencosud - CABA",
    clienteId: "cl-03",
    clienteNombre: "Cencosud S.A.",
    ciudad: "Buenos Aires",
    screenIds: ["ba-01", "ba-02"],
    version: 1,
    estado: "Borrador",
    fecha: "2026-07-29",
    presupuesto: 6500000,
    objetivo: "Visibilidad extrema en el casco metropolitano",
    comentarios: [],
    historial: [
      { id: "h-3", action: "Creado borrador preliminar", date: "2026-07-29 09:30", user: "Comercial Ejec." }
    ],
    soportesEdicionInline: [
      { id: "ba-01", notas: "Frente al Obelisco, pautado premium nocturno.", prioridad: "Alta", duracionSem: 2 },
      { id: "ba-02", notas: "Corredor Callao y Libertador para target ejecutivo.", prioridad: "Alta", duracionSem: 2 }
    ]
  },

];

export const INITIAL_COTIZACIONES: Cotizacion[] = [
  {
    id: "qt-101",
    mediakitId: "mk-201",
    mediakitNombre: "Lanzamiento Toyota Hilux 2026",
    clienteNombre: "Toyota Mendoza",
    descuentoPercent: 10,
    validez: "2026-08-15",
    condiciones: "Pago 50% al reservar y 50% al iniciar pauta.",
    total: 1440000,
    estado: "Enviada"
  },

];

export const INITIAL_RESERVAS: Reserva[] = [

  // Overlapping booking to simulate AI conflict detection
  {
    id: "rv-402",
    mediakitId: "mk-201",
    clienteNombre: "Toyota Mendoza",
    screenId: "sc-01",
    screenNombre: "Sarmiento y 9 de Julio",
    fechaInicio: "2026-08-05",
    fechaFin: "2026-08-19",
    estado: "Pendiente",
    conflictiva: true // overbooked with another campaign starting on sc-01
  }
];

export const INITIAL_CAMPAÑAS: Campaña[] = [

  {
    id: "cp-502",
    reservaId: "rv-400", // pre-existing campaign
    clienteNombre: "Agencia JWT (Cencosud)",
    nombre: "Retail Sale Cencosud - Mendoza Centro",
    screenId: "sc-01",
    screenNombre: "Sarmiento y 9 de Julio",
    fechaInicio: "2026-07-20",
    fechaFin: "2026-08-10",
    progreso: 60,
    estado: "Activa"
  }
];

export const INITIAL_LOGS: ChangeLog[] = [
  { id: "lg-1", user: "Director Comercial", action: "Aprobó Cotización #QT-102 para Café Central", date: "Hoy, 12:45" },
  { id: "lg-2", user: "Comercial Ejec.", action: "Duplicó MediaKit #MK-201 (Hilux 2026)", date: "Hoy, 10:20" },
  { id: "lg-3", user: "Operaciones", action: "Bloqueó Pantalla sc-03 (Las Heras y Mitre) por limpieza LED", date: "Ayer, 16:30" },
  { id: "lg-4", user: "Administrador", action: "Actualizó tarifa base de Plaza Buenos Aires (+10% global)", date: "Hace 2 días" }
];

export const INITIAL_VEHICLES: LedVehicle[] = [
  {
    id: "vh-01",
    patente: "AF-492-MK",
    chofer: "Eduardo Pérez",
    rutaActiva: "Circuito Centro-Arístides (Mendoza)",
    bateria: "82%",
    velocidad: "22 km/h",
    gpsStatus: "Online",
    estado: "En ruta"
  },

  {
    id: "vh-03",
    patente: "AG-889-AA",
    chofer: "Sandro Bustos",
    rutaActiva: "Palermo - Recoleta Premium (CABA)",
    bateria: "12%",
    velocidad: "0 km/h",
    gpsStatus: "Offline",
    estado: "En mantenimiento"
  }
];
