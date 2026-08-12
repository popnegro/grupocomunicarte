import { Response, NextFunction } from "express";
import { SecureAuthRequest } from "../../server/middleware/rbac.ts";
import {
  SpacesService, CampaignsService, MediaKitsService, DashboardService, SearchService
} from "../../server/services/appServices.ts";
import {
  validatePaginationQuery, validateSpaceDTO, validateCampaignDTO, validateMediaDTO, validateMediaKitDTO
} from "../../server/validation/validator.ts";
import {
  CitiesRepository, CategoriesRepository, MediaRepository, UsersRepository, RolesRepository, PermissionsRepository, TenantsRepository
} from "../../server/repositories/index.ts";
import { logger } from "../../server/middleware/logger.ts";
import { quotesController } from './quotes.controller.ts';

export const SpacesController = {
  async getAll(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const queryDto = validatePaginationQuery(req.query);
      // Scope to user's tenant if specified
      if (req.dbUser?.tenantId) {
        queryDto.filters = { ...queryDto.filters, tenantId: req.dbUser.tenantId };
      }
      const results = await SpacesService.getSpaces(queryDto);
      res.json({ success: true, ...results });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const space = await SpacesService.getSpaceDetails(req.params.id);
      res.json({ success: true, data: space });
    } catch (err) {
      next(err);
    }
  },

  async create(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const bodyDto = validateSpaceDTO(req.body);
      if (req.dbUser?.tenantId) {
        bodyDto.tenantId = req.dbUser.tenantId;
      }
      const newSpace = await SpacesService.createSpace(bodyDto);
      res.status(201).json({ success: true, data: newSpace });
    } catch (err) {
      next(err);
    }
  },

  async update(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const bodyDto = validateSpaceDTO(req.body);
      const updatedSpace = await SpacesService.updateSpace(req.params.id, bodyDto);
      res.json({ success: true, data: updatedSpace });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const deletedSpace = await SpacesService.deleteSpace(req.params.id);
      res.json({ success: true, data: deletedSpace });
    } catch (err) {
      next(err);
    }
  }
};

export const QuotesController = quotesController;

export const CampaignsController = {
  async getAll(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const queryDto = validatePaginationQuery(req.query);
      if (req.dbUser?.tenantId) {
        queryDto.filters = { ...queryDto.filters, tenantId: req.dbUser.tenantId };
      }
      const results = await CampaignsService.getCampaigns(queryDto);
      res.json({ success: true, ...results });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const campaign = await CampaignsService.getCampaignDetails(req.params.id);
      res.json({ success: true, data: campaign });
    } catch (err) {
      next(err);
    }
  },

  async create(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const bodyDto = validateCampaignDTO(req.body);
      if (req.dbUser?.tenantId) {
        bodyDto.tenantId = req.dbUser.tenantId;
      }
      const newCampaign = await CampaignsService.createCampaign(bodyDto, req.body.screens);
      res.status(201).json({ success: true, data: newCampaign });
    } catch (err) {
      next(err);
    }
  },

  async update(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const bodyDto = validateCampaignDTO(req.body);
      const updatedCampaign = await CampaignsService.updateCampaign(req.params.id, bodyDto, req.body.screens);
      res.json({ success: true, data: updatedCampaign });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const deletedCampaign = await CampaignsService.deleteCampaign(req.params.id);
      res.json({ success: true, data: deletedCampaign });
    } catch (err) {
      next(err);
    }
  }
};

export const MediaKitsController = {
  async getAll(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const queryDto = validatePaginationQuery(req.query);
      if (req.dbUser?.tenantId) {
        queryDto.filters = { ...queryDto.filters, tenantId: req.dbUser.tenantId };
      }
      const results = await MediaKitsService.getMediaKits(queryDto);
      res.json({ success: true, ...results });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const mediakit = await MediaKitsService.getMediaKitDetails(req.params.id);
      res.json({ success: true, data: mediakit });
    } catch (err) {
      next(err);
    }
  },

  async create(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const bodyDto = validateMediaKitDTO(req.body);
      if (req.dbUser?.tenantId) {
        bodyDto.tenantId = req.dbUser.tenantId;
      }
      const newMediakit = await MediaKitsService.createMediaKit(bodyDto);
      res.status(201).json({ success: true, data: newMediakit });
    } catch (err) {
      next(err);
    }
  },

  async update(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const bodyDto = validateMediaKitDTO(req.body);
      const updatedMediakit = await MediaKitsService.updateMediaKit(req.params.id, bodyDto);
      res.json({ success: true, data: updatedMediakit });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const deletedMediakit = await MediaKitsService.deleteMediaKit(req.params.id);
      res.json({ success: true, data: deletedMediakit });
    } catch (err) {
      next(err);
    }
  }
};

export const CitiesController = {
  async getAll(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await CitiesRepository.findAll();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await CitiesRepository.findById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
};

export const CategoriesController = {
  async getAll(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await CategoriesRepository.findAll();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await CategoriesRepository.findById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
};

export const MediaController = {
  async getByScreen(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await MediaRepository.findByScreenId(req.params.screenId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async create(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const bodyDto = validateMediaDTO(req.body);
      const newMedia = await MediaRepository.create(bodyDto);
      res.status(201).json({ success: true, data: newMedia });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const deleted = await MediaRepository.delete(req.params.id);
      res.json({ success: true, data: deleted });
    } catch (err) {
      next(err);
    }
  }
};

export const UsersController = {
  async getAll(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const queryDto = validatePaginationQuery(req.query);
      if (req.dbUser?.tenantId) {
        queryDto.filters = { ...queryDto.filters, tenantId: req.dbUser.tenantId };
      }
      const results = await UsersRepository.findAndCount(queryDto);
      res.json({ success: true, ...results });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const dbUser = await UsersRepository.findById(Number(req.params.id));
      res.json({ success: true, data: dbUser });
    } catch (err) {
      next(err);
    }
  },

  async assignRole(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const { roleId } = req.body;
      const dbUser = await UsersRepository.assignRole(Number(req.params.id), roleId);
      res.json({ success: true, data: dbUser });
    } catch (err) {
      next(err);
    }
  },

  async removeRole(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const { roleId } = req.body;
      const dbUser = await UsersRepository.removeRole(Number(req.params.id), roleId);
      res.json({ success: true, data: dbUser });
    } catch (err) {
      next(err);
    }
  },

  async updateTenant(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const { tenantId } = req.body;
      const dbUser = await UsersRepository.updateTenant(Number(req.params.id), tenantId);
      res.json({ success: true, data: dbUser });
    } catch (err) {
      next(err);
    }
  },

  async getRoles(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await RolesRepository.findAll();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getPermissions(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await PermissionsRepository.findAll();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
};

export const DashboardController = {
  async getStats(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.dbUser?.tenantId || "tenant-default";
      const stats = await DashboardService.getKPIMetrics(tenantId);
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }
};

export const SearchController = {
  async search(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const query = String(req.query.q || "").trim();
      const tenantId = req.dbUser?.tenantId || "tenant-default";
      const results = await SearchService.unifiedSearch(query, tenantId);
      res.json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }
};

export const TenantsController = {
  async getAll(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await TenantsRepository.findAll();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await TenantsRepository.findById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async create(req: SecureAuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await TenantsRepository.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
};
