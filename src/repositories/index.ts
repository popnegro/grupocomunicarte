import { db } from "../db/index.ts";
import {
  screens, cities, categories, media, mediakits, campaigns, campaignScreens,
  users, roles, permissions, userRoles, rolePermissions, tenants, clientes
} from "../db/schema.ts";
import { eq, like, and, or, desc, asc, sql } from "drizzle-orm";
import { PaginationQueryDTO } from "../validation/validator.ts";

export const SpacesRepository = {
  async findAndCount(dto: PaginationQueryDTO) {
    let conditions = [];

    if (dto.search) {
      conditions.push(
        or(
          like(screens.nombre, `%${dto.search}%`),
          like(screens.zona, `%${dto.search}%`)
        )
      );
    }

    if (dto.filters) {
      if (dto.filters.ciudad) {
        conditions.push(eq(screens.ciudad, dto.filters.ciudad));
      }
      if (dto.filters.categoria) {
        conditions.push(eq(screens.categoria, dto.filters.categoria));
      }
      if (dto.filters.status) {
        conditions.push(eq(screens.status, dto.filters.status));
      }
      if (dto.filters.tenantId) {
        conditions.push(eq(screens.tenantId, dto.filters.tenantId));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let query = db.select().from(screens);
    if (whereClause) {
      query = query.where(whereClause) as any;
    }

    // Sorting
    if (dto.sortBy) {
      const orderFn = dto.sortOrder === "desc" ? desc : asc;
      const field = (screens as any)[dto.sortBy];
      if (field) {
        query = query.orderBy(orderFn(field)) as any;
      }
    } else {
      query = query.orderBy(desc(screens.createdAt || screens.id)) as any;
    }

    // Execute with pagination
    const paginatedQuery = query.limit(dto.limit).offset(dto.offset);
    const data = await paginatedQuery;

    // Count total
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(screens);
    if (whereClause) {
      countQuery = countQuery.where(whereClause) as any;
    }
    const [countResult] = await countQuery;
    const total = Number(countResult?.count || 0);

    return { data, total, page: dto.page, limit: dto.limit };
  },

  async findById(id: string) {
    const [row] = await db.select().from(screens).where(eq(screens.id, id)).limit(1);
    return row || null;
  },

  async create(data: any) {
    const [newRow] = await db.insert(screens).values(data).returning();
    return newRow;
  },

  async update(id: string, data: any) {
    const [updatedRow] = await db
      .update(screens)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(screens.id, id))
      .returning();
    return updatedRow;
  },

  async delete(id: string) {
    const [deletedRow] = await db.delete(screens).where(eq(screens.id, id)).returning();
    return deletedRow || null;
  }
};

export const CitiesRepository = {
  async findAll() {
    return db.select().from(cities).orderBy(asc(cities.name));
  },

  async findById(id: string) {
    const [row] = await db.select().from(cities).where(eq(cities.id, id)).limit(1);
    return row || null;
  }
};

export const CategoriesRepository = {
  async findAll() {
    return db.select().from(categories).orderBy(asc(categories.name));
  },

  async findById(id: string) {
    const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return row || null;
  }
};

export const MediaRepository = {
  async findByScreenId(screenId: string) {
    return db.select().from(media).where(eq(media.screenId, screenId)).orderBy(desc(media.createdAt));
  },

  async findById(id: string) {
    const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
    return row || null;
  },

  async create(data: any) {
    const id = data.id || `media-${Date.now()}`;
    const [newRow] = await db.insert(media).values({ ...data, id }).returning();
    return newRow;
  },

  async delete(id: string) {
    const [deletedRow] = await db.delete(media).where(eq(media.id, id)).returning();
    return deletedRow || null;
  }
};

export const MediaKitsRepository = {
  async findAndCount(dto: PaginationQueryDTO) {
    let conditions = [];

    if (dto.search) {
      conditions.push(
        or(
          like(mediakits.nombre, `%${dto.search}%`),
          like(mediakits.clienteNombre, `%${dto.search}%`)
        )
      );
    }

    if (dto.filters?.tenantId) {
      conditions.push(eq(mediakits.tenantId, dto.filters.tenantId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let query = db.select().from(mediakits);
    if (whereClause) {
      query = query.where(whereClause) as any;
    }

    query = query.orderBy(desc(mediakits.createdAt)) as any;

    const data = await query.limit(dto.limit).offset(dto.offset);

    let countQuery = db.select({ count: sql<number>`count(*)` }).from(mediakits);
    if (whereClause) {
      countQuery = countQuery.where(whereClause) as any;
    }
    const [countResult] = await countQuery;
    const total = Number(countResult?.count || 0);

    return { data, total, page: dto.page, limit: dto.limit };
  },

  async findById(id: string) {
    const [row] = await db.select().from(mediakits).where(eq(mediakits.id, id)).limit(1);
    return row || null;
  },

  async create(data: any) {
    const id = data.id || `mk-${Date.now()}`;
    const [newRow] = await db.insert(mediakits).values({ ...data, id }).returning();
    return newRow;
  },

  async update(id: string, data: any) {
    const [updatedRow] = await db
      .update(mediakits)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(mediakits.id, id))
      .returning();
    return updatedRow;
  },

  async delete(id: string) {
    const [deletedRow] = await db.delete(mediakits).where(eq(mediakits.id, id)).returning();
    return deletedRow || null;
  }
};

export const ClientsRepository = {
  async findAndCount(dto: PaginationQueryDTO) {
    let conditions = [];

    if (dto.search) {
      conditions.push(
        or(
          like(clientes.nombre, `%${dto.search}%`),
          like(clientes.empresa, `%${dto.search}%`)
        )
      );
    }

    if (dto.filters?.tenantId) {
      conditions.push(eq(clientes.tenantId, dto.filters.tenantId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let query = db.select().from(clientes);
    if (whereClause) {
      query = query.where(whereClause) as any;
    }

    query = query.orderBy(desc(clientes.createdAt)) as any;

    const data = await query.limit(dto.limit).offset(dto.offset);

    let countQuery = db.select({ count: sql<number>`count(*)` }).from(clientes);
    if (whereClause) {
      countQuery = countQuery.where(whereClause) as any;
    }
    const [countResult] = await countQuery;
    const total = Number(countResult?.count || 0);

    return { data, total, page: dto.page, limit: dto.limit };
  },

  async findById(id: string) {
    const [row] = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
    return row || null;
  },

  async create(data: any) {
    const [newRow] = await db.insert(clientes).values(data).returning();
    return newRow;
  },

  async update(id: string, data: any) {
    const [updatedRow] = await db
      .update(clientes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(clientes.id, id))
      .returning();
    return updatedRow;
  },

  async delete(id: string) {
    const [deletedRow] = await db.delete(clientes).where(eq(clientes.id, id)).returning();
    return deletedRow || null;
  }
};

export const CampaignsRepository = {
  async findAndCount(dto: PaginationQueryDTO) {
    let conditions = [];

    if (dto.search) {
      conditions.push(like(campaigns.nombre, `%${dto.search}%`));
    }

    if (dto.filters) {
      if (dto.filters.clienteId) {
        conditions.push(eq(campaigns.clienteId, dto.filters.clienteId));
      }
      if (dto.filters.estado) {
        conditions.push(eq(campaigns.estado, dto.filters.estado));
      }
      if (dto.filters.tenantId) {
        conditions.push(eq(campaigns.tenantId, dto.filters.tenantId));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let query = db.select().from(campaigns);
    if (whereClause) {
      query = query.where(whereClause) as any;
    }

    // Sorting
    if (dto.sortBy) {
      const orderFn = dto.sortOrder === "desc" ? desc : asc;
      const field = (campaigns as any)[dto.sortBy];
      if (field) {
        query = query.orderBy(orderFn(field)) as any;
      }
    } else {
      query = query.orderBy(desc(campaigns.createdAt)) as any;
    }

    const data = await query.limit(dto.limit).offset(dto.offset);

    let countQuery = db.select({ count: sql<number>`count(*)` }).from(campaigns);
    if (whereClause) {
      countQuery = countQuery.where(whereClause) as any;
    }
    const [countResult] = await countQuery;
    const total = Number(countResult?.count || 0);

    return { data, total, page: dto.page, limit: dto.limit };
  },

  async findById(id: string) {
    const [row] = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    if (!row) return null;

    // Get screens associated with this campaign
    const associatedScreens = await db
      .select({
        screen: screens,
        precioAcordado: campaignScreens.precioAcordado,
        fechaInicioSoporte: campaignScreens.fechaInicioSoporte,
        fechaFinSoporte: campaignScreens.fechaFinSoporte
      })
      .from(campaignScreens)
      .innerJoin(screens, eq(campaignScreens.screenId, screens.id))
      .where(eq(campaignScreens.campaignId, id));

    return { ...row, screens: associatedScreens };
  },

  async create(data: any, screenSelections?: any[]) {
    const id = data.id || `camp-${Date.now()}`;
    const [newRow] = await db.insert(campaigns).values({ ...data, id }).returning();

    if (screenSelections && screenSelections.length > 0) {
      const pvtRows = screenSelections.map(s => ({
        campaignId: id,
        screenId: s.screenId,
        precioAcordado: s.precioAcordado || null,
        fechaInicioSoporte: s.fechaInicioSoporte || null,
        fechaFinSoporte: s.fechaFinSoporte || null
      }));
      await db.insert(campaignScreens).values(pvtRows);
    }

    return this.findById(id);
  },

  async update(id: string, data: any, screenSelections?: any[]) {
    const [updatedRow] = await db
      .update(campaigns)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();

    if (!updatedRow) return null;

    if (screenSelections) {
      // Re-populate association table
      await db.delete(campaignScreens).where(eq(campaignScreens.campaignId, id));
      if (screenSelections.length > 0) {
        const pvtRows = screenSelections.map(s => ({
          campaignId: id,
          screenId: s.screenId,
          precioAcordado: s.precioAcordado || null,
          fechaInicioSoporte: s.fechaInicioSoporte || null,
          fechaFinSoporte: s.fechaFinSoporte || null
        }));
        await db.insert(campaignScreens).values(pvtRows);
      }
    }

    return this.findById(id);
  },

  async delete(id: string) {
    const [deletedRow] = await db.delete(campaigns).where(eq(campaigns.id, id)).returning();
    return deletedRow || null;
  }
};

export const UsersRepository = {
  async findAndCount(dto: PaginationQueryDTO) {
    let conditions = [];

    if (dto.search) {
      conditions.push(like(users.email, `%${dto.search}%`));
    }

    if (dto.filters?.tenantId) {
      conditions.push(eq(users.tenantId, dto.filters.tenantId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let query = db.select().from(users);
    if (whereClause) {
      query = query.where(whereClause) as any;
    }

    const data = await query.limit(dto.limit).offset(dto.offset);

    let countQuery = db.select({ count: sql<number>`count(*)` }).from(users);
    if (whereClause) {
      countQuery = countQuery.where(whereClause) as any;
    }
    const [countResult] = await countQuery;
    const total = Number(countResult?.count || 0);

    return { data, total, page: dto.page, limit: dto.limit };
  },

  async findById(id: number) {
    const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!row) return null;

    // Get roles
    const assignedRoles = await db
      .select({
        id: roles.id,
        name: roles.name,
        slug: roles.slug
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, id));

    return { ...row, roles: assignedRoles };
  },

  async assignRole(userId: number, roleId: string) {
    await db.insert(userRoles).values({ userId, roleId }).onConflictDoNothing();
    return this.findById(userId);
  },

  async removeRole(userId: number, roleId: string) {
    await db.delete(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
    return this.findById(userId);
  },

  async updateTenant(userId: number, tenantId: string) {
    await db.update(users).set({ tenantId }).where(eq(users.id, userId));
    return this.findById(userId);
  }
};

export const RolesRepository = {
  async findAll() {
    return db.select().from(roles).orderBy(asc(roles.name));
  },

  async findPermissionsByRole(roleId: string) {
    return db
      .select({
        id: permissions.id,
        name: permissions.name,
        slug: permissions.slug
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));
  }
};

export const PermissionsRepository = {
  async findAll() {
    return db.select().from(permissions).orderBy(asc(permissions.name));
  }
};

export const TenantsRepository = {
  async findAll() {
    return db.select().from(tenants).where(sql`deleted_at is null`).orderBy(asc(tenants.name));
  },

  async findById(id: string) {
    const [row] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
    return row || null;
  },

  async create(data: any) {
    const [newRow] = await db.insert(tenants).values(data).returning();
    return newRow;
  }
};
