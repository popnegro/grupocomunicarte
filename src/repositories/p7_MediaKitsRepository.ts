
import { db } from "../db/index.ts";
import { 
    mediaKits, 
    mediaKitPages, 
    mediaKitSections, 
    mediaKitAssets,
    mediaKitVersions,
    mediaKitComments,
    mediaKitShares,
    users
} from "../db/p7_schema_proposal.ts"; // Using the new proposed schema
import { eq, and, desc, asc, like, or, sql } from "drizzle-orm";
import { PaginationQueryDTO } from "../validation/validator.ts";
import { alias } from 'drizzle-orm/pg-core';

// Re-defining for clarity in this file. In a real scenario, this would be imported.
const tenants = alias(mediaKits, 'tenants');
const clientes = alias(mediaKits, 'clientes');


export const P7_MediaKitsRepository = {
    /**
     * Finds a single Media Kit by its ID, deep-loading all its nested relations:
     * pages > sections > assets.
     * This is the core query for the Media Kit Builder.
     */
    async findByIdDeep(id: string) {
        const [row] = await db.query.mediaKits.findMany({
            where: eq(mediaKits.id, id),
            with: {
                pages: {
                    orderBy: [asc(mediaKitPages.pageNumber)],
                    with: {
                        sections: {
                            orderBy: [asc(mediaKitSections.order)],
                            with: {
                                assets: {
                                    orderBy: [asc(mediaKitAssets.order)],
                                }
                            }
                        }
                    }
                },
                template: true,
                cliente: true,
                createdByUser: {
                    columns: {
                        id: true,
                        email: true
                    }
                }
            }
        });

        if (!row) return null;

        // Here you could further process the result, for example, to fetch the actual asset data 
        // for each item in mediaKitAssets based on assetType and assetId.
        // This is where the polymorphic relation is handled in the repository layer.
        
        return row;
    },

    /**
     * Basic findById for listing purposes, without deep-loading.
     */
    async findById(id: string) {
        const [row] = await db.select().from(mediaKits).where(eq(mediaKits.id, id)).limit(1);
        return row || null;
    },

    /**
     * Paginates Media Kits, similar to the original repository but using the new schema.
     */
    async findAndCount(dto: PaginationQueryDTO) {
        let conditions = [];

        if (dto.search) {
            conditions.push(like(mediaKits.name, `%${dto.search}%`));
        }
    
        if (dto.filters?.tenantId) {
            conditions.push(eq(mediaKits.tenantId, dto.filters.tenantId));
        }
    
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
        let query = db.select().from(mediaKits);
        if (whereClause) {
          query = query.where(whereClause) as any;
        }
    
        query = query.orderBy(desc(mediaKits.createdAt)) as any;
    
        const data = await query.limit(dto.limit).offset(dto.offset);
    
        let countQuery = db.select({ count: sql<number>`count(*)` }).from(mediaKits);
        if (whereClause) {
          countQuery = countQuery.where(whereClause) as any;
        }
        const [countResult] = await countQuery;
        const total = Number(countResult?.count || 0);
    
        return { data, total, page: dto.page, limit: dto.limit };
    },

    /**
     * Creates a new Media Kit.
     * This would be a transactional operation in a real implementation.
     */
    async create(data: Partial<typeof mediaKits.$inferInsert>, userId: number) {
        const id = data.id || `mk-${Date.now()}`;
        const [newRow] = await db.insert(mediaKits).values({ 
            ...data, 
            id,
            createdBy: userId,
            updatedBy: userId,
        }).returning();
        return newRow;
    },

    /**
     * Updates a Media Kit.
     */
    async update(id: string, data: Partial<typeof mediaKits.$inferInsert>, userId: number) {
        const [updatedRow] = await db
          .update(mediaKits)
          .set({ ...data, updatedAt: new Date(), updatedBy: userId })
          .where(eq(mediaKits.id, id))
          .returning();
        return updatedRow;
    },

    /**
     * Soft-deletes a Media Kit by setting the deletedAt timestamp.
     */
    async softDelete(id: string, userId: number) {
        const [deletedRow] = await db
            .update(mediaKits)
            .set({ deletedAt: new Date(), updatedBy: userId })
            .where(eq(mediaKits.id, id))
            .returning();
        return deletedRow || null;
    },

    /**
     * Restores a soft-deleted Media Kit.
     */
    async restore(id: string, userId: number) {
        const [restoredRow] = await db
            .update(mediaKits)
            .set({ deletedAt: null, updatedBy: userId })
            .where(eq(mediaKits.id, id))
            .returning();
        return restoredRow || null;
    },

    /**
     * Creates a new version of a Media Kit.
     */
    async createVersion(mediaKitId: string, data: any, versionNumber: number, userId: number, notes?: string) {
        const [newVersion] = await db.insert(mediaKitVersions).values({
            id: `mkv-${mediaKitId}-${versionNumber}`,
            mediaKitId,
            versionNumber,
            data,
            createdBy: userId,
            notes,
        }).returning();
        
        // Also update the main mediakit to point to the new version
        await this.update(mediaKitId, { version: versionNumber }, userId);

        return newVersion;
    },

    /**
     * Creates a shareable link for a Media Kit.
     */
    async createShareLink(mediaKitId: string, token: string, expiresAt: Date | null, userId: number) {
        const [newShare] = await db.insert(mediaKitShares).values({
            id: `mks-${Date.now()}`,
            mediaKitId,
            token,
            expiresAt,
            createdBy: userId,
        }).returning();
        return newShare;
    },

    /**
     * Finds a shared Media Kit by its token.
     */
    async findByShareToken(token: string) {
        const [share] = await db.select().from(mediaKitShares).where(eq(mediaKitShares.token, token)).limit(1);
        if (!share) return null;
        
        // Check for expiration
        if (share.expiresAt && share.expiresAt < new Date()) {
            return { error: "expired" };
        }

        return this.findByIdDeep(share.mediaKitId);
    }
};
