
import { pgTable, serial, text, integer, doublePrecision, timestamp, index, primaryKey, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- EXISTING TABLES (for context) ---

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


// --- NEW & REFACTORED TABLES FOR MEDIKIT BUILDER ---

export const mediaKitTemplates = pgTable("media_kit_templates", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    previewImageUrl: text("preview_image_url"),
    isPublic: boolean("is_public").default(true).notNull(),
    tenantId: text("tenant_id").references(() => tenants.id, { onDelete: "cascade" }), // Can be null for public templates
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mediaKits = pgTable("media_kits", {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    clienteId: text("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
    status: text("status").default("draft").notNull(), // "draft" | "published" | "archived"
    version: integer("version").default(1).notNull(),
    templateId: text("template_id").references(() => mediaKitTemplates.id, { onDelete: "set null" }),
    customization: jsonb("customization"), // JSON for storing custom colors, logo, typography etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: integer("updated_by").references(() => users.id, { onDelete: "set null" }),
    deletedAt: timestamp("deleted_at"),
  }, (table) => ({
    clienteIdIdx: index("media_kits_cliente_id_idx").on(table.clienteId),
    statusIdx: index("media_kits_status_idx").on(table.status),
    tenantIdIdx: index("media_kits_tenant_id_idx").on(table.tenantId),
}));

export const mediaKitPages = pgTable("media_kit_pages", {
    id: text("id").primaryKey(),
    mediaKitId: text("media_kit_id").notNull().references(() => mediaKits.id, { onDelete: "cascade" }),
    pageNumber: integer("page_number").notNull(),
    title: text("title"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }, (table) => ({
    mediaKitIdIdx: index("media_kit_pages_media_kit_id_idx").on(table.mediaKitId),
}));

export const mediaKitSections = pgTable("media_kit_sections", {
    id: text("id").primaryKey(),
    mediaKitPageId: text("media_kit_page_id").notNull().references(() => mediaKitPages.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // e.g., 'CoverBlock', 'GalleryBlock', 'MapBlock'
    order: integer("order").notNull(),
    settings: jsonb("settings"), // JSON for block-specific settings like text content, titles, etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }, (table) => ({
    mediaKitPageIdIdx: index("media_kit_sections_media_kit_page_id_idx").on(table.mediaKitPageId),
}));

export const mediaKitAssets = pgTable("media_kit_assets", {
    id: text("id").primaryKey(),
    sectionId: text("section_id").notNull().references(() => mediaKitSections.id, { onDelete: "cascade" }),
    assetId: text("asset_id").notNull(), // ID of the asset (e.g., screen.id, media.id)
    assetType: text("asset_type").notNull(), // 'screen', 'media_image', 'media_video'
    order: integer("order").default(0).notNull(),
  }, (table) => ({
    sectionIdIdx: index("media_kit_assets_section_id_idx").on(table.sectionId),
}));

export const mediaKitVersions = pgTable("media_kit_versions", {
    id: text("id").primaryKey(),
    mediaKitId: text("media_kit_id").notNull().references(() => mediaKits.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    data: jsonb("data").notNull(), // Snapshot of the mediakit state at the time of versioning
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
  }, (table) => ({
    mediaKitIdIdx: index("media_kit_versions_media_kit_id_idx").on(table.mediaKitId),
}));

// This table already existed and was well-structured. Keeping it.
export const mediaKitComments = pgTable("media_kit_comments", {
  id: serial("id").primaryKey(),
  mediaKitId: text("media_kit_id").notNull().references(() => mediaKits.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  userName: text("user_name").notNull(),
  commentText: text("comment_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // For threaded comments or replies
  parentId: integer("parent_id").references(() => mediaKitComments.id, { onDelete: "cascade" }),
}, (table) => ({
  mediaKitIdIdx: index("media_kit_comments_media_kit_id_idx").on(table.mediaKitId),
  userIdIdx: index("media_kit_comments_user_id_idx").on(table.userId),
}));

export const mediaKitShares = pgTable("media_kit_shares", {
    id: text("id").primaryKey(),
    mediaKitId: text("media_kit_id").notNull().references(() => mediaKits.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at"),
    isReadOnly: boolean("is_read_only").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
  }, (table) => ({
    mediaKitIdIdx: index("media_kit_shares_media_kit_id_idx").on(table.mediaKitId),
}));

// --- RELATIONS ---
// Define relations for the new tables

// ... (relations for existing tables would be here)

export const mediaKitTemplatesRelations = relations(mediaKitTemplates, ({ many, one }) => ({
    mediaKits: many(mediaKits),
    tenant: one(tenants, {
        fields: [mediaKitTemplates.tenantId],
        references: [tenants.id],
    }),
}));

export const mediaKitsRelations = relations(mediaKits, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [mediaKits.tenantId],
        references: [tenants.id],
    }),
    cliente: one(clientes, {
        fields: [mediaKits.clienteId],
        references: [clientes.id],
    }),
    template: one(mediaKitTemplates, {
        fields: [mediaKits.templateId],
        references: [mediaKitTemplates.id],
    }),
    createdByUser: one(users, {
        fields: [mediaKits.createdBy],
        references: [users.id],
    }),
    updatedByUser: one(users, {
        fields: [mediaKits.updatedBy],
        references: [users.id],
    }),
    pages: many(mediaKitPages),
    versions: many(mediaKitVersions),
    comments: many(mediaKitComments),
    shares: many(mediaKitShares),
}));

export const mediaKitPagesRelations = relations(mediaKitPages, ({ one, many }) => ({
    mediaKit: one(mediaKits, {
        fields: [mediaKitPages.mediaKitId],
        references: [mediaKits.id],
    }),
    sections: many(mediaKitSections),
}));

export const mediaKitSectionsRelations = relations(mediaKitSections, ({ one, many }) => ({
    page: one(mediaKitPages, {
        fields: [mediaKitSections.mediaKitPageId],
        references: [mediaKitPages.id],
    }),
    assets: many(mediaKitAssets),
}));

export const mediaKitAssetsRelations = relations(mediaKitAssets, ({ one }) => ({
    section: one(mediaKitSections, {
        fields: [mediaKitAssets.sectionId],
        references: [mediaKitSections.id],
    }),
    // Note: Polymorphic relation to asset cannot be defined here directly.
    // This will be handled in the repository/service layer.
}));

export const mediaKitVersionsRelations = relations(mediaKitVersions, ({ one }) => ({
    mediaKit: one(mediaKits, {
        fields: [mediaKitVersions.mediaKitId],
        references: [mediaKits.id],
    }),
    createdByUser: one(users, {
        fields: [mediaKitVersions.createdBy],
        references: [users.id],
    }),
}));

export const mediaKitCommentsRelations = relations(mediaKitComments, ({ one, many }) => ({
    mediaKit: one(mediaKits, {
        fields: [mediaKitComments.mediaKitId],
        references: [mediaKits.id],
    }),
    user: one(users, {
        fields: [mediaKitComments.userId],
        references: [users.id],
    }),
    parent: one(mediaKitComments, {
        fields: [mediaKitComments.parentId],
        references: [mediaKitComments.id]
    }),
    replies: many(mediaKitComments, { relationName: 'replies' })
}));

export const mediaKitSharesRelations = relations(mediaKitShares, ({ one }) => ({
    mediaKit: one(mediaKits, {
        fields: [mediaKitShares.mediaKitId],
        references: [mediaKits.id],
    }),
    createdByUser: one(users, {
        fields: [mediaKitShares.createdBy],
        references: [users.id],
    }),
}));

