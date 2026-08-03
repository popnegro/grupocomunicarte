import { pgTable, serial, text, integer, doublePrecision, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  source: text("source"),
  status: text("status").default("new"),
  date: text("date"),
  value: integer("value").default(0),
});

export const screens = pgTable("screens", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  zona: text("zona").notNull(),
  tipo: text("tipo").notNull(), // "Peatonal" | "Vehicular" | "Mixto" | "Móvil" | "LeadMóvil"
  categoria: text("categoria"), // "Tradicionales" | "Pantallas LED" | "LED Móvil"
  ciudad: text("ciudad"), // "Mendoza" | "Buenos Aires"
  impactos: integer("impactos").default(0).notNull(),
  precio: integer("precio").default(0).notNull(),
  status: text("status").notNull(), // "Activo" | "Pausado" | "Disponible" | "No disponible"
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  nota: text("nota"),
  dimensiones: text("dimensiones"),
  brillo: text("brillo"),
  refreshRate: text("refresh_rate"),
  formato: text("formato"),
  cobertura: text("cobertura"),
  horarios: text("horarios"),
  ruta: text("ruta"), // Stringified JSON array of route waypoints { lat, lng, nombre }
});

export const clientes = pgTable("clientes", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  empresa: text("empresa").notNull(),
  email: text("email").notNull(),
  telefono: text("telefono").notNull(),
  categoria: text("categoria").notNull(), // "Directo" | "Agencia" | "Corporativo"
  campanasActivas: integer("campanas_activas").default(0).notNull(),
  totalInversion: integer("total_inversion").default(0).notNull(),
  estado: text("estado").default("contactado").notNull(), // "contactado" | "negociando" | "cerrado"
  notas: text("notas"),
  historialInteracciones: text("historial_interacciones"), // Stringified JSON array of interaction history
});

export const mediakits = pgTable("mediakits", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  clienteId: text("cliente_id").notNull(),
  clienteNombre: text("cliente_nombre").notNull(),
  ciudad: text("ciudad").notNull(), // "Mendoza" | "Buenos Aires"
  screenIds: text("screen_ids").notNull(), // Stringified JSON array of screen IDs
  version: integer("version").default(1).notNull(),
  estado: text("estado").notNull(), // "Borrador" | "Nuevo" | "En revisión" | "Cotizando" ...
  fecha: text("fecha").notNull(),
  presupuesto: integer("presupuesto"),
  objetivo: text("objetivo"),
  comentarios: text("comentarios"), // Stringified JSON array of { id, user, text, date }
  historial: text("historial"), // Stringified JSON array of { id, action, date, user }
  soportesEdicionInline: text("soportes_edicion_inline"), // Stringified JSON array of MediaKitSupport
});

export const changelogs = pgTable("changelogs", {
  id: text("id").primaryKey(),
  user: text("user").notNull(),
  action: text("action").notNull(),
  date: text("date").notNull(),
});
