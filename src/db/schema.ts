// src/db/schema.ts
import { pgTable, text, timestamp, integer, doublePrecision, boolean, serial, primaryKey } from 'drizzle-orm/pg-core';

// 2.1. Gestión Multi-Inquilino (Multi-Tenant)
export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  plan: text('plan').default('basic').notNull(),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// 2.2. Seguridad y Control de Acceso (RBAC)
export const roles = pgTable('roles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
});

export const permissions = pgTable('permissions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').unique().notNull(),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  email: text('email').unique().notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRoles = pgTable('user_roles', {
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  roleId: text('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.roleId] })
]);

export const rolePermissions = pgTable('role_permissions', {
  roleId: text('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  permissionId: text('permission_id').references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
}, (t) => [
  primaryKey({ columns: [t.roleId, t.permissionId] })
]);

// 2.3. Estructura de Inventario y Soportes (Advertising Spaces)
export const cities = pgTable('cities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const locations = pgTable('locations', {
  id: text('id').primaryKey(),
  cityId: text('city_id').references(() => cities.id),
  name: text('name').notNull(),
  address: text('address'),
  lat: doublePrecision('lat'),
  lng: doublePrecision('lng'),
});

export const screens = pgTable('screens', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  zona: text('zona'),
  tipo: text('tipo'), // Peatonal, Vehicular, Mixto o Móvil
  categoria: text('categoria'), // Pantallas LED, Tradicionales, LED Móvil
  ciudad: text('ciudad').notNull(),
  impactos: integer('impactos'), // Cantidad promedio de impresiones semanales
  precio: integer('precio'), // Tarifa semanal sugerida
  status: text('status').default('Activo').notNull(), // Activo, Mantenimiento, etc.
  dimensiones: text('dimensiones'),
  brillo: text('brillo'),
  refreshRate: text('refresh_rate'),
  formato: text('formato'),
  cobertura: text('cobertura'),
  ruta: text('ruta'), // Polígono de recorrido (en caso de soportes móviles)
  lat: doublePrecision('lat'), // Coordenadas GPS
  lng: doublePrecision('lng'), // Coordenadas GPS
  nota: text('nota'),
  video: text('video'),
  horarios: text('horarios'),
  syncId: text('sync_id'),
  hash: text('hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  featuredOrder: integer("featured_order"),
});

// 2.4. Clientes y Campañas Publicitarias
export const clientes = pgTable('clientes', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  empresa: text('empresa').notNull(),
  email: text('email').notNull(),
  telefono: text('telefono'),
  categoria: text('categoria'), // Corporativo, Agencia o Directo
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mediakits = pgTable('mediakits', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  clienteId: text('cliente_id').references(() => clientes.id, { onDelete: 'cascade' }),
  clienteNombre: text('cliente_nombre'),
  ciudad: text('ciudad'),
  screenIds: text('screen_ids'), // JSON stringified array of screen ids
  version: integer('version').default(1),
  estado: text('estado').default('Borrador'), // Borrador, Cotizando, Aprobado
  fecha: text('fecha'),
  presupuesto: integer('presupuesto'),
  objetivo: text('objetivo'),
  comentarios: text('comentarios'), // JSON stringified comments
  historial: text('historial'), // JSON stringified history
  soportesEdicionInline: text('soportes_edicion_inline'), // JSON stringified inline support info
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const campaigns = pgTable('campaigns', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  clienteId: text('cliente_id').references(() => clientes.id, { onDelete: 'cascade' }),
  mediaKitId: text('media_kit_id').references(() => mediakits.id),
  nombre: text('nombre').notNull(),
  presupuesto: integer('presupuesto'),
  estado: text('estado'), // Planificación, Activa, Finalizada, Pausada
  fechaInicio: text('fecha_inicio'),
  fechaFin: text('fecha_fin'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const campaignScreens = pgTable('campaign_screens', {
  campaignId: text('campaign_id').references(() => campaigns.id, { onDelete: 'cascade' }).notNull(),
  screenId: text('screen_id').references(() => screens.id, { onDelete: 'cascade' }).notNull(),
  precioAcordado: integer('precio_acordado'),
  fechaInicioSoporte: text('fecha_inicio_soporte'),
  fechaFinSoporte: text('fecha_fin_soporte'),
}, (t) => [
  primaryKey({ columns: [t.campaignId, t.screenId] })
]);

// 2.5. Recursos Multimedia, Etiquetas y Métricas de Rendimiento
export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  company: text('company'),
  source: text('source').notNull().default('Formulario Web'),
  status: text('status').notNull().default('new'),
  value: integer('value').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tags = pgTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
});

export const screenTags = pgTable('screen_tags', {
  screenId: text('screen_id').references(() => screens.id, { onDelete: 'cascade' }).notNull(),
  tagId: text('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
}, (t) => [
  primaryKey({ columns: [t.screenId, t.tagId] })
]);

export const media = pgTable('media', {
  id: text('id').primaryKey(),
  screenId: text('screen_id').references(() => screens.id, { onDelete: 'cascade' }),
  type: text('type'), // "image", "video", "drone"
  url: text('url').notNull(),
  title: text('title'),
  sizeBytes: integer('size_bytes'),
  isHero: boolean('is_hero').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const metrics = pgTable('metrics', {
  id: text('id').primaryKey(),
  screenId: text('screen_id').references(() => screens.id, { onDelete: 'cascade' }),
  metricType: text('metric_type'), // "impressions", "occupancy_rate", "ctr", "views"
  value: doublePrecision('value').notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});

// Google Integration Tables
export const googleCredentials = pgTable('google_credentials', {
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).primaryKey(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiryDate: timestamp('expiry_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const syncHistory = pgTable('sync_history', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  userName: text('user_name'),
  status: text('status'), // "running", "success", "failed"
  presentationId: text('presentation_id'),
  presentationTitle: text('presentation_title'),
  durationMs: integer('duration_ms'),
  totalSlides: integer('total_slides'),
  importedCount: integer('imported_count'),
  updatedCount: integer('updated_count'),
  errorCount: integer('error_count'),
  backupData: text('backup_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const syncErrors = pgTable('sync_errors', {
  id: serial('id').primaryKey(),
  syncId: text('sync_id').references(() => syncHistory.id, { onDelete: 'cascade' }),
  slideIndex: integer('slide_index'),
  slideId: text('slide_id'),
  errorType: text('error_type'), // "validation", "parser", "api"
  errorMessage: text('error_message'),
  severity: text('severity'), // "warning", "error"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const changelogs = pgTable('changelogs', {
  id: text('id').primaryKey(),
  user: text('user').notNull(),
  action: text('action').notNull(),
  date: text('date').notNull(),
});
