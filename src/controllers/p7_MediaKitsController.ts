
import { Response, NextFunction } from "express";
import { SecureAuthRequest } from "../middleware/rbac.ts";
import { P7_MediaKitsService } from "../services/p7_MediaKitsService.ts";
import { validatePaginationQuery, validateMediaKitDTO } from "../validation/validator.ts";

export const P7_MediaKitsController = {
    async getAll(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            const queryDto = validatePaginationQuery(req.query);
            if (req.dbUser?.tenantId) {
                queryDto.filters = { ...queryDto.filters, tenantId: req.dbUser.tenantId };
            }
            const results = await P7_MediaKitsService.getMediaKits(queryDto);
            res.json({ success: true, ...results });
        } catch (err) {
            next(err);
        }
    },

    async getById(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            // This method now returns the deep-loaded object for the builder
            const mediakit = await P7_MediaKitsService.getMediaKitDetails(req.params.id);
            res.json({ success: true, data: mediakit });
        } catch (err) {
            next(err);
        }
    },

    async create(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            const bodyDto = validateMediaKitDTO(req.body); // Assuming this validator can be adapted
            const newMediakit = await P7_MediaKitsService.createMediaKit(bodyDto, req.dbUser.id);
            res.status(201).json({ success: true, data: newMediakit });
        } catch (err) {
            next(err);
        }
    },

    async update(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            // The body can contain the whole nested structure of pages and sections
            const bodyDto = req.body; 
            const updatedMediakit = await P7_MediaKitsService.updateMediaKit(req.params.id, bodyDto, req.dbUser.id);
            res.json({ success: true, data: updatedMediakit });
        } catch (err) {
            next(err);
        }
    },

    async delete(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            const deletedMediakit = await P7_MediaKitsService.deleteMediaKit(req.params.id, req.dbUser.id);
            res.json({ success: true, data: deletedMediakit });
        } catch (err) {
            next(err);
        }
    },
    
    async restore(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            const restoredMediakit = await P7_MediaKitsService.restoreMediaKit(req.params.id, req.dbUser.id);
            res.json({ success: true, data: restoredMediakit });
        } catch (err) {
            next(err);
        }
    },
    
    async duplicate(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            const newMediakit = await P7_MediaKitsService.duplicateMediaKit(req.params.id, req.dbUser.id);
            res.status(201).json({ success: true, data: newMediakit });
        } catch (err) {
            next(err);
        }
    },

    async createVersion(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            const { notes } = req.body;
            const newVersion = await P7_MediaKitsService.createVersion(req.params.id, req.dbUser.id, notes);
            res.status(201).json({ success: true, data: newVersion });
        } catch (err) {
            next(err);
        }
    },

    async share(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            const { expirationInDays } = req.body;
            const shareLink = await P7_MediaKitsService.shareMediaKit(req.params.id, req.dbU ser.id, expirationInDays);
            res.json({ success: true, data: shareLink });
        } catch (err) {
            next(err);
        }
    },

    // This is a public endpoint, so it doesn't use the SecureAuthRequest
    async getShared(req: Request, res: Response, next: NextFunction) {
        try {
            const mediakit = await P7_MediaKitsService.getSharedMediaKit(req.params.token);
            res.json({ success: true, data: mediakit });
        } catch (err) {
            next(err);
        }
    },

    // --- EXPORT ENDPOINTS ---

    async exportPdf(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            // const pdfBuffer = await P7_MediaKitsService.exportToPdf(req.params.id);
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', `attachment; filename=mediakit-${req.params.id}.pdf`);
            // res.send(pdfBuffer);
            res.status(501).json({ success: false, message: "PDF export not implemented yet." });
        } catch (err) {
            next(err);
        }
    },

    async exportSlides(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            // const result = await P7_MediaKitsService.exportToGoogleSlides(req.params.id, req.googleAuth); // Assuming auth is handled
            // res.json({ success: true, data: result });
             res.status(501).json({ success: false, message: "Google Slides export not implemented yet." });
        } catch (err) {
            next(err);
        }
    },

    async exportPptx(req: SecureAuthRequest, res: Response, next: NextFunction) {
        try {
            // const pptxBuffer = await P7_MediaKitsService.exportToPowerPoint(req.params.id);
            // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
            // res.setHeader('Content-Disposition', `attachment; filename=mediakit-${req.params.id}.pptx`);
            // res.send(pptxBuffer);
            res.status(501).json({ success: false, message: "PowerPoint export not implemented yet." });
        } catch (err) {
            next(err);
        }
    }
};
