import { pgTable, serial, text, integer, doublePrecision, timestamp, index, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uidIdx: index("users_uid_idx").on(table.uid),
  emailIdx: index("users_email_idx").on(table.email),
}));

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  source: text("source"),
  status: text("status").default("new"),
  date: text("date"),
  value: integer("value").default(0),
}, (table) => ({
  statusIdx: index("leads_status_idx").on(table.status),
  emailIdx: index("leads_email_idx").on(table.email),
}));

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
  video: text("video"),
  ruta: text("ruta"), // Stringified JSON array of route waypoints { lat, lng, nombre }
}, (table) => ({
  categoriaIdx: index("screens_categoria_idx").on(table.categoria),
  ciudadIdx: index("screens_ciudad_idx").on(table.ciudad),
  statusIdx: index("screens_status_idx").on(table.status),
}));

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
}, (table) => ({
  emailIdx: index("clientes_email_idx").on(table.email),
  estadoIdx: index("clientes_estado_idx").on(table.estado),
}));

export const mediakits = pgTable("mediakits", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  clienteId: text("cliente_id").notNull().references(() => clientes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  clienteNombre: text("cliente_nombre").notNull(),
  ciudad: text("ciudad").notNull(), // "Mendoza" | "Buenos Aires"
  screenIds: text("screen_ids").notNull(), // Stringified JSON array of screen IDs (kept for backwards compatibility)
  version: integer("version").default(1).notNull(),
  estado: text("estado").notNull(), // "Borrador" | "Nuevo" | "En revisión" | "Cotizando" ...
  fecha: text("fecha").notNull(),
  presupuesto: integer("presupuesto"),
  objetivo: text("objetivo"),
  comentarios: text("comentarios"), // Stringified JSON array (kept for backwards compatibility)
  historial: text("historial"), // Stringified JSON array (kept for backwards compatibility)
  soportesEdicionInline: text("soportes_edicion_inline"), // Stringified JSON array of MediaKitSupport (kept for backwards compatibility)
}, (table) => ({
  clienteIdIdx: index("mediakits_cliente_id_idx").on(table.clienteId),
  ciudadIdx: index("mediakits_ciudad_idx").on(table.ciudad),
  estadoIdx: index("mediakits_estado_idx").on(table.estado),
}));

// Join table for real relations between MediaKits and Screens (Soportes) - Many-to-Many
export const mediaKitScreens = pgTable("media_kit_screens", {
  mediaKitId: text("media_kit_id").notNull().references(() => mediakits.id, { onDelete: "cascade", onUpdate: "cascade" }),
  screenId: text("screen_id").notNull().references(() => screens.id, { onDelete: "cascade", onUpdate: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.mediaKitId, table.screenId] }),
  screenIdIdx: index("media_kit_screens_screen_id_idx").on(table.screenId),
}));

// Real table for MediaKit comments with cascade relations to MediaKits and Users
export const mediaKitComments = pgTable("media_kit_comments", {
  id: serial("id").primaryKey(),
  mediaKitId: text("media_kit_id").notNull().references(() => mediakits.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userName: text("user_name").notNull(),
  commentText: text("comment_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  mediaKitIdIdx: index("media_kit_comments_media_kit_id_idx").on(table.mediaKitId),
  userIdIdx: index("media_kit_comments_user_id_idx").on(table.userId),
}));

export const changelogs = pgTable("changelogs", {
  id: text("id").primaryKey(),
  user: text("user").notNull(),
  action: text("action").notNull(),
  date: text("date").notNull(),
}, (table) => ({
  userIdx: index("changelogs_user_idx").on(table.user),
  dateIdx: index("changelogs_date_idx").on(table.date),
}));

export const googleCredentials = pgTable("google_credentials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }).unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  scopes: text("scopes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("google_credentials_user_id_idx").on(table.userId),
}));

// Relations setup using Drizzle ORM relations helper
export const usersRelations = relations(users, ({ many, one }) => ({
  comments: many(mediaKitComments),
  googleCredentials: one(googleCredentials, {
    fields: [users.id],
    references: [googleCredentials.userId],
  }),
}));

export const googleCredentialsRelations = relations(googleCredentials, ({ one }) => ({
  user: one(users, {
    fields: [googleCredentials.userId],
    references: [users.id],
  }),
}));

export const screensRelations = relations(screens, ({ many }) => ({
  mediaKitScreens: many(mediaKitScreens),
}));

export const clientesRelations = relations(clientes, ({ many }) => ({
  mediakits: many(mediakits),
}));

export const mediakitsRelations = relations(mediakits, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [mediakits.clienteId],
    references: [clientes.id],
  }),
  mediaKitScreens: many(mediaKitScreens),
  mediaKitComments: many(mediaKitComments),
}));

export const mediaKitScreensRelations = relations(mediaKitScreens, ({ one }) => ({
  mediaKit: one(mediakits, {
    fields: [mediaKitScreens.mediaKitId],
    references: [mediakits.id],
  }),
  screen: one(screens, {
    fields: [mediaKitScreens.screenId],
    references: [screens.id],
  }),
}));

export const mediaKitCommentsRelations = relations(mediaKitComments, ({ one }) => ({
  mediaKit: one(mediakits, {
    fields: [mediaKitComments.mediaKitId],
    references: [mediakits.id],
  }),
  user: one(users, {
    fields: [mediaKitComments.userId],
    references: [users.id],
  }),
}));

