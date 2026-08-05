
import { P7_MediaKitsRepository } from '../repositories/p7_MediaKitsRepository.ts';
import { PaginationQueryDTO } from '../validation/validator.ts';
import { db } from '../db/index.ts';
import { mediaKits, mediaKitPages, mediaKitSections, mediaKitAssets } from '../db/p7_schema_proposal.ts';
import crypto from 'crypto';

export const P7_MediaKitsService = {
    /**
     * Gets a list of mediakits (paginated).
     */
    async getMediaKits(dto: PaginationQueryDTO) {
        return P7_MediaKitsRepository.findAndCount(dto);
    },

    /**
     * Gets the full details of a single mediakit, including all its pages, sections, and assets.
     */
    async getMediaKitDetails(id: string) {
        const mediakit = await P7_MediaKitsRepository.findByIdDeep(id);
        if (!mediakit) {
            throw new Error("Media kit not found");
        }
        return mediakit;
    },

    /**
     * Creates a new mediakit.
     */
    async createMediaKit(data: Partial<typeof mediaKits.$inferInsert>, userId: number) {
        // Here you could add more business logic, like validating the templateId, etc.
        return P7_MediaKitsRepository.create(data, userId);
    },

    /**
     * Updates a mediakit.
     * The data payload here can become complex, representing changes to the nested structure.
     * A real implementation would handle updating, creating, and deleting pages/sections/assets
     * within a transaction.
     */
    async updateMediaKit(id: string, data: any, userId: number) {
        await this.getMediaKitDetails(id); // checks existence
        
        // For now, a simple update on the main table
        const { pages, ...mainData } = data;
        const updated = await P7_MediaKitsRepository.update(id, mainData, userId);
        
        // TODO: Implement logic to sync pages, sections, and assets.
        // This would involve diffing the incoming 'pages' array with the existing one and
        // creating/updating/deleting records in the mediaKitPages, mediaKitSections, and mediaKitAssets tables.
        
        return updated;
    },
    
    /**
     * Soft-deletes a mediakit.
     */
    async deleteMediaKit(id: string, userId: number) {
        await this.getMediaKitDetails(id); // checks existence
        return P7_MediaKitsRepository.softDelete(id, userId);
    },

    /**
     * Restores a soft-deleted mediakit.
     */
    async restoreMediaKit(id: string, userId: number) {
        // We don't use getMediaKitDetails here because it might be soft-deleted.
        // Instead, we check for existence directly in the repository method.
        return P7_MediaKitsRepository.restore(id, userId);
    },

    /**
     * Duplicates a mediakit and all its contents.
     */
    async duplicateMediaKit(id: string, userId: number) {
        const original = await this.getMediaKitDetails(id);
        
        const newId = `mk-${Date.now()}`;
        
        // Use a transaction to ensure all or nothing is created
        return await db.transaction(async (tx) => {
            // 1. Create the new mediakit
            const [newMediaKit] = await tx.insert(mediaKits).values({
                id: newId,
                tenantId: original.tenantId,
                name: `Copy of ${original.name}`,
                clienteId: original.clienteId,
                status: 'draft',
                version: 1,
                templateId: original.templateId,
                customization: original.customization,
                createdBy: userId,
                updatedBy: userId,
            }).returning();

            // 2. Deep copy pages, sections, and assets
            for (const page of original.pages) {
                const newPageId = `mkp-${Date.now()}-${Math.random()}`;
                await tx.insert(mediaKitPages).values({
                    id: newPageId,
                    mediaKitId: newId,
                    pageNumber: page.pageNumber,
                    title: page.title,
                });

                for (const section of page.sections) {
                    const newSectionId = `mks-${Date.now()}-${Math.random()}`;
                    await tx.insert(mediaKitSections).values({
                        id: newSectionId,
                        mediaKitPageId: newPageId,
                        type: section.type,
                        order: section.order,
                        settings: section.settings,
                    });

                    if (section.assets && section.assets.length > 0) {
                        const newAssets = section.assets.map(asset => ({
                            id: `mka-${Date.now()}-${Math.random()}`,
                            sectionId: newSectionId,
                            assetId: asset.assetId,
                            assetType: asset.assetType,
                            order: asset.order,
                        }));
                        await tx.insert(mediaKitAssets).values(newAssets);
                    }
                }
            }
            return newMediaKit;
        });
    },

    /**
     * Creates a new version of the mediakit.
     */
    async createVersion(id: string, userId: number, notes?: string) {
        const mediakit = await this.getMediaKitDetails(id);
        
        const newVersionNumber = mediakit.version + 1;
        
        // The 'data' is a snapshot of the full mediakit object
        return P7_MediaKitsRepository.createVersion(id, mediakit, newVersionNumber, userId, notes);
    },

    /**
     * Generates a unique, secure share token and stores it.
     */
    async shareMediaKit(id: string, userId: number, expirationInDays: number | null) {
        await this.getMediaKitDetails(id); // checks existence

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = expirationInDays ? new Date(Date.now() + expirationInDays * 24 * 60 * 60 * 1000) : null;
        
        return P7_MediaKitsRepository.createShareLink(id, token, expiresAt, userId);
    },

    /**
     * Retrieves a mediakit using a share token.
     */
    async getSharedMediaKit(token: string) {
        const result = await P7_MediaKitsRepository.findByShareToken(token);
        if (result && (result as any).error === "expired") {
            throw new Error("This share link has expired.");
        }
        if (!result) {
            throw new Error("Invalid share link.");
        }
        return result;
    }

    // TODO: Implement export services
    // async exportToPdf(id: string) { ... }
    // async exportToGoogleSlides(id: string, auth: any) { ... }
    // async exportToPowerPoint(id: string) { ... }
};
