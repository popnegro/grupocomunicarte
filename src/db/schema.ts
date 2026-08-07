import { pgTable, serial, text, integer, doublePrecision, timestamp, index, primaryKey, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(), // UUID or slug
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan").default("basic").notNull(), // "basic" | "premium" | "enterprise"
  status: text("status").default("active").notNull(), // "active" | "suspended" | "cancelled"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  slugIdx: index("tenants_slug_idx").on(table.slug),
}));

export const roles = pgTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("roles_slug_idx").on(table.slug),
}));

export const permissions = pgTable("permissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("permissions_slug_idx").on(table.slug),
}));

export const cities = pgTable("cities", {
  id: text("id").primaryKey(), // UUID or Slug ID
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  slugIdx: index("cities_slug_idx").on(table.slug),
}));

export const categories = pgTable("categories", {
  id: text("id").primaryKey(), // UUID or Slug ID
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  slugIdx: index("categories_slug_idx").on(table.slug),
}));

export const locations = pgTable("locations", {
  id: text("id").primaryKey(), // UUID or Slug ID
  cityId: text("city_id").references(() => cities.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: text("name").notNull(),
  address: text("address"),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  cityIdIdx: index("locations_city_id_idx").on(table.cityId),
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  tenantId: text("tenant_id").references(() => tenants.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uidIdx: index("users_uid_idx").on(table.uid),
  emailIdx: index("users_email_idx").on(table.email),
  tenantIdIdx: index("users_tenant_id_idx").on(table.tenantId),
}));

export const userRoles = pgTable("user_roles", {
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.roleId] }),
}));

export const rolePermissions = pgTable("role_permissions", {
  roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  permissionId: text("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
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
  tenantId: text("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
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
  video: text("video"), // Reference photo or video Drone URL
  dimensiones: text("dimensiones"),
  brillo: text("brillo"),
  refreshRate: text("refresh_rate"),
  formato: text("formato"),
  cobertura: text("cobertura"),
  horarios: text("horarios"),
  ruta: text("ruta"), // Stringified JSON array of route waypoints { lat, lng, nombre }
  syncId: integer("sync_id"), // Reference to the sync run that touched this screen
  hash: text("hash"), // Hash of slide contents for change-detection/ETL differential comparison
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  categoriaIdx: index("screens_categoria_idx").on(table.categoria),
  ciudadIdx: index("screens_ciudad_idx").on(table.ciudad),
  statusIdx: index("screens_status_idx").on(table.status),
  tenantIdIdx: index("screens_tenant_id_idx").on(table.tenantId),
}));

export const clientes = pgTable("clientes", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("clientes_email_idx").on(table.email),
  estadoIdx: index("clientes_estado_idx").on(table.estado),
  tenantIdIdx: index("clientes_tenant_id_idx").on(table.tenantId),
}));

export const mediakits = pgTable("mediakits", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  clienteIdIdx: index("mediakits_cliente_id_idx").on(table.clienteId),
  ciudadIdx: index("mediakits_ciudad_idx").on(table.ciudad),
  estadoIdx: index("mediakits_estado_idx").on(table.estado),
  tenantIdIdx: index("mediakits_tenant_id_idx").on(table.tenantId),
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

export const syncHistory = pgTable("sync_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userName: text("user_name").notNull(),
  status: text("status").notNull(), // "success" | "failed" | "running"
  durationMs: integer("duration_ms").default(0),
  totalSlides: integer("total_slides").default(0),
  importedCount: integer("imported_count").default(0),
  updatedCount: integer("updated_count").default(0),
  errorCount: integer("error_count").default(0),
  presentationId: text("presentation_id").notNull(),
  presentationTitle: text("presentation_title"),
  backupData: text("backup_data"), // Stringified JSON snapshot of screens before the sync run for rollback
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("sync_history_user_id_idx").on(table.userId),
  statusIdx: index("sync_history_status_idx").on(table.status),
}));

export const syncErrors = pgTable("sync_errors", {
  id: serial("id").primaryKey(),
  syncId: integer("sync_id").references(() => syncHistory.id, { onDelete: "cascade", onUpdate: "cascade" }),
  slideIndex: integer("slide_index"),
  slideId: text("slide_id"),
  errorType: text("error_type").notNull(), // "validation" | "api" | "parser"
  errorMessage: text("error_message").notNull(),
  severity: text("severity").notNull(), // "error" | "warning"
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  syncIdIdx: index("sync_errors_sync_id_idx").on(table.syncId),
}));

export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("tags_slug_idx").on(table.slug),
}));

export const screenTags = pgTable("screen_tags", {
  screenId: text("screen_id").notNull().references(() => screens.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.screenId, table.tagId] }),
}));

export const media = pgTable("media", {
  id: text("id").primaryKey(),
  screenId: text("screen_id").notNull().references(() => screens.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "image" | "video" | "drone"
  url: text("url").notNull(),
  title: text("title"),
  sizeBytes: integer("size_bytes"),
  isHero: boolean("is_hero").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  screenIdIdx: index("media_screen_id_idx").on(table.screenId),
}));

export const metrics = pgTable("metrics", {
  id: text("id").primaryKey(),
  screenId: text("screen_id").notNull().references(() => screens.id, { onDelete: "cascade" }),
  metricType: text("metric_type").notNull(), // "impressions" | "occupancy_rate" | "ctr" | "views"
  value: doublePrecision("value").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  screenIdIdx: index("metrics_screen_id_idx").on(table.screenId),
}));

export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  clienteId: text("cliente_id").notNull().references(() => clientes.id, { onDelete: "cascade" }),
  mediaKitId: text("media_kit_id").references(() => mediakits.id, { onDelete: "set null" }),
  nombre: text("nombre").notNull(),
  presupuesto: integer("presupuesto").default(0).notNull(),
  estado: text("estado").default("planificacion").notNull(), // "planificacion" | "activa" | "finalizada" | "pausada"
  fechaInicio: text("fecha_inicio"),
  fechaFin: text("fecha_fin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  tenantIdIdx: index("campaigns_tenant_id_idx").on(table.tenantId),
  clienteIdIdx: index("campaigns_cliente_id_idx").on(table.clienteId),
  estadoIdx: index("campaigns_estado_idx").on(table.estado),
}));

export const campaignScreens = pgTable("campaign_screens", {
  campaignId: text("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  screenId: text("screen_id").notNull().references(() => screens.id, { onDelete: "cascade" }),
  precioAcordado: integer("precio_acordado"),
  fechaInicioSoporte: text("fecha_inicio_soporte"),
  fechaFinSoporte: text("fecha_fin_soporte"),
}, (table) => ({
  pk: primaryKey({ columns: [table.campaignId, table.screenId] }),
}));

// Relations setup using Drizzle ORM relations helper
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  campaigns: many(campaigns),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  comments: many(mediaKitComments),
  googleCredentials: one(googleCredentials, {
    fields: [users.id],
    references: [googleCredentials.userId],
  }),
  syncHistories: many(syncHistory),
  userRoles: many(userRoles),
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
}));

export const googleCredentialsRelations = relations(googleCredentials, ({ one }) => ({
  user: one(users, {
    fields: [googleCredentials.userId],
    references: [users.id],
  }),
}));

export const syncHistoryRelations = relations(syncHistory, ({ one, many }) => ({
  user: one(users, {
    fields: [syncHistory.userId],
    references: [users.id],
  }),
  errors: many(syncErrors),
}));

export const syncErrorsRelations = relations(syncErrors, ({ one }) => ({
  syncHistory: one(syncHistory, {
    fields: [syncErrors.syncId],
    references: [syncHistory.id],
  }),
}));

export const screensRelations = relations(screens, ({ many }) => ({
  mediaKitScreens: many(mediaKitScreens),
  screenTags: many(screenTags),
  media: many(media),
  metrics: many(metrics),
  campaignScreens: many(campaignScreens),
}));

export const clientesRelations = relations(clientes, ({ many }) => ({
  mediakits: many(mediakits),
  campaigns: many(campaigns),
}));

export const mediakitsRelations = relations(mediakits, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [mediakits.clienteId],
    references: [clientes.id],
  }),
  mediaKitScreens: many(mediaKitScreens),
  mediaKitComments: many(mediaKitComments),
  campaigns: many(campaigns),
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

export const citiesRelations = relations(cities, ({ many }) => ({
  locations: many(locations),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  // Expandable for custom category-related spaces
}));

export const locationsRelations = relations(locations, ({ one }) => ({
  city: one(cities, {
    fields: [locations.cityId],
    references: [cities.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  screenTags: many(screenTags),
}));

export const screenTagsRelations = relations(screenTags, ({ one }) => ({
  screen: one(screens, {
    fields: [screenTags.screenId],
    references: [screens.id],
  }),
  tag: one(tags, {
    fields: [screenTags.tagId],
    references: [tags.id],
  }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  screen: one(screens, {
    fields: [media.screenId],
    references: [screens.id],
  }),
}));

export const metricsRelations = relations(metrics, ({ one }) => ({
  screen: one(screens, {
    fields: [metrics.screenId],
    references: [screens.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [campaigns.tenantId],
    references: [tenants.id],
  }),
  cliente: one(clientes, {
    fields: [campaigns.clienteId],
    references: [clientes.id],
  }),
  mediaKit: one(mediakits, {
    fields: [campaigns.mediaKitId],
    references: [mediakits.id],
  }),
  campaignScreens: many(campaignScreens),
}));

export const campaignScreensRelations = relations(campaignScreens, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignScreens.campaignId],
    references: [campaigns.id],
  }),
  screen: one(screens, {
    fields: [campaignScreens.screenId],
    references: [screens.id],
  }),
}));

