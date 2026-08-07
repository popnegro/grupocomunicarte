// src/db/schema.ts
import { pgTable, text, timestamp, integer, doublePrecision, boolean } from 'drizzle-orm/pg-core';

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

// 2.3. Estructura de Inventario y Soportes (Advertising Spaces)
// Minimal definition for screens based on SCHEMA_DOCUMENTATION.md
// Only including fields directly relevant to the public screens endpoint or essential for the table structure.
export const screens = pgTable('screens', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }), // Assuming screens are tenant-specific
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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. TABLA LEADS
export const leads = pgTable('leads', {
  id: text('id').primaryKey(), // Using text for UUID or similar string ID
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }), // Optional: if leads are tenant-specific
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Minimal users table for foreign key reference if needed in the future,
// based on SCHEMA_DOCUMENTATION.md (TENANTS ||--o{ USERS)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  email: text('email').unique().notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Other tables from SCHEMA_DOCUMENTATION.md would go here if needed for other endpoints.
// For this task, only leads, screens, tenants, and a minimal users are defined.