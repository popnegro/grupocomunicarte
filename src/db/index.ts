// src/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { SEED_SCREENS, INITIAL_CLIENTES, INITIAL_MEDIAKITS } from './seedData';

// Maintain in-memory state for development fallback when database is not connected
const mockScreens = [...SEED_SCREENS];
const mockClientes = [...INITIAL_CLIENTES];
const mockMediaKits = [...INITIAL_MEDIAKITS];
const mockCampaigns: any[] = [];
const mockLeads: any[] = [];
const mockMetrics: any[] = [];
const mockUsers: any[] = [];
const mockTenants = [{ id: 'tenant-default', name: 'Tenant Default', slug: 'default', plan: 'basic', status: 'active' }];

function getTableName(table: any): string {
  if (!table) return "";
  if (table._ && typeof table._.name === "string") {
    return table._.name;
  }
  if (typeof table.name === "string") {
    return table.name;
  }
  const symbolKey = Object.getOwnPropertySymbols(table).find(sym => sym.toString().includes("drizzle:Name"));
  if (symbolKey) {
    return table[symbolKey];
  }
  return "";
}

const mockData: Record<string, any[]> = {
  screens: mockScreens,
  clientes: mockClientes,
  mediakits: mockMediaKits,
  campaigns: mockCampaigns,
  leads: mockLeads,
  metrics: mockMetrics,
  users: mockUsers,
  tenants: mockTenants,
};

class MockQueryBuilder {
  private tableName: string = "";
  private isCount: boolean = false;
  private isSum: boolean = false;
  private isAvg: boolean = false;
  private sumField: string = "";
  private operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private insertData: any = null;

  constructor(selectFields?: any) {
    if (selectFields) {
      if (selectFields.count) {
        this.isCount = true;
      }
      if (selectFields.total || selectFields.totalBudget) {
        this.isSum = true;
        this.sumField = selectFields.totalBudget ? "precio" : "impactos";
      }
      if (selectFields.avgVal) {
        this.isAvg = true;
      }
    }
  }

  select(fields?: any) {
    this.operation = 'select';
    if (fields) {
      if (fields.count) this.isCount = true;
      if (fields.total || fields.totalBudget) {
        this.isSum = true;
        this.sumField = fields.totalBudget ? "presupuesto" : "impactos";
      }
      if (fields.avgVal) this.isAvg = true;
    }
    return this;
  }

  from(table: any) {
    this.tableName = getTableName(table);
    return this;
  }

  where() {
    return this;
  }

  orderBy() {
    return this;
  }

  limit() {
    return this;
  }

  offset() {
    return this;
  }

  innerJoin() {
    return this;
  }

  insert(table: any) {
    this.operation = 'insert';
    this.tableName = getTableName(table);
    return this;
  }

  values(data: any) {
    this.insertData = data;
    return this;
  }

  update(table: any) {
    this.operation = 'update';
    this.tableName = getTableName(table);
    return this;
  }

  set(data: any) {
    this.insertData = data;
    return this;
  }

  delete(table: any) {
    this.operation = 'delete';
    this.tableName = getTableName(table);
    return this;
  }

  returning() {
    return this;
  }

  async execute() {
    const list = mockData[this.tableName] || [];
    if (this.operation === 'select') {
      if (this.isCount) {
        return [{ count: list.length }];
      }
      if (this.isSum) {
        const sum = list.reduce((acc, item) => acc + (Number(item[this.sumField]) || 0), 0);
        return [{ count: list.length, total: sum, totalBudget: sum }];
      }
      if (this.isAvg) {
        return [{ avgVal: 75 }];
      }
      return list;
    } else if (this.operation === 'insert') {
      const itemsToInsert = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
      const inserted = itemsToInsert.map(item => {
        const newItem = { id: Math.random().toString(36).substr(2, 9), createdAt: new Date(), updatedAt: new Date(), ...item };
        list.push(newItem);
        return newItem;
      });
      return inserted;
    } else if (this.operation === 'update') {
      const updated = list.map(item => ({ ...item, ...this.insertData }));
      return updated;
    } else if (this.operation === 'delete') {
      return list;
    }
    return list;
  }

  then(resolve: any, reject: any) {
    this.execute().then(resolve, reject);
  }
}

let _db: any = null;

function getDb() {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.warn('DATABASE_URL is not set. Database client is running in MOCK fallback mode.');
      return null;
    }
    const sql = neon(databaseUrl);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// Export the Drizzle client with the schema lazily via a Proxy
export const db = new Proxy({} as any, {
  get(target, prop, receiver) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      // Mock mode
      if (prop === 'select') {
        return (fields?: any) => new MockQueryBuilder(fields);
      }
      if (prop === 'insert') {
        return (table: any) => new MockQueryBuilder().insert(table);
      }
      if (prop === 'update') {
        return (table: any) => new MockQueryBuilder().update(table);
      }
      if (prop === 'delete') {
        return (table: any) => new MockQueryBuilder().delete(table);
      }
      // Return a blank function or self for other properties
      return () => new MockQueryBuilder();
    }

    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
  set(target, prop, value, receiver) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return true;
    }
    const instance = getDb();
    return Reflect.set(instance, prop, value, receiver);
  },
  has(target, prop) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return true;
    }
    const instance = getDb();
    return Reflect.has(instance, prop);
  },
  ownKeys(target) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return [];
    }
    const instance = getDb();
    return Reflect.ownKeys(instance);
  },
  getOwnPropertyDescriptor(target, prop) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return undefined;
    }
    const instance = getDb();
    return Reflect.getOwnPropertyDescriptor(instance, prop);
  }
});
