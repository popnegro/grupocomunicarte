import { Router } from "express";
import { requireAuth } from "../../middleware/auth.ts";
import { defaultRateLimiter } from "../../middleware/rateLimiter.ts";
import { cacheMiddleware } from "../../middleware/cache.ts";
import { requirePermission } from "../../middleware/rbac.ts";
import {
  SpacesController, CampaignsController, MediaKitsController, CitiesController,
  CategoriesController, MediaController, UsersController, DashboardController,
  SearchController, TenantsController
} from "../../controllers/index.ts";
import { SwaggerController } from "../../controllers/swaggerController.ts";

const router = Router();

// --- PUBLIC ENDPOINTS ---
// OpenAPI Swagger documentation JSON & Interactive Console HTML
router.get("/swagger.json", SwaggerController.getJson);
router.get("/docs", SwaggerController.getHtml);


// --- SECURE ENDPOINTS (Requires Firebase JWT Authentication & Rate Limiting) ---
router.use(requireAuth);
router.use(defaultRateLimiter);


// --- DASHBOARD METRICS ---
// Serves consolidated stats for the dashboard home, optimized with cache (5-second window)
router.get("/dashboard/stats", cacheMiddleware(5000), DashboardController.getStats);


// --- SEARCH ENGINE ---
// Unified global index search
router.get("/search", SearchController.search);


// --- ADVERTISING SPACES (SCREENS) ---
// Custom query caching applied to GET requests (10-second TTL)
router.get("/spaces", cacheMiddleware(10000), SpacesController.getAll);
router.get("/spaces/:id", cacheMiddleware(10000), SpacesController.getById);
router.post("/spaces", requirePermission("sync_slides"), SpacesController.create);
router.put("/spaces/:id", requirePermission("sync_slides"), SpacesController.update);
router.delete("/spaces/:id", requirePermission("sync_slides"), SpacesController.delete);


// --- CAMPAIGNS & PAUTAS ---
router.get("/campaigns", cacheMiddleware(10000), CampaignsController.getAll);
router.get("/campaigns/:id", cacheMiddleware(10000), CampaignsController.getById);
router.post("/campaigns", requirePermission("edit_campaigns"), CampaignsController.create);
router.put("/campaigns/:id", requirePermission("edit_campaigns"), CampaignsController.update);
router.delete("/campaigns/:id", requirePermission("edit_campaigns"), CampaignsController.delete);


// --- MEDIAKITS & COTIZACIONES ---
router.get("/mediakits", cacheMiddleware(10000), MediaKitsController.getAll);
router.get("/mediakits/:id", cacheMiddleware(10000), MediaKitsController.getById);
router.post("/mediakits", requirePermission("edit_campaigns"), MediaKitsController.create);
router.put("/mediakits/:id", requirePermission("edit_campaigns"), MediaKitsController.update);
router.delete("/mediakits/:id", requirePermission("edit_campaigns"), MediaKitsController.delete);


// --- MEDIA ASSETS ---
router.get("/spaces/:screenId/media", cacheMiddleware(10000), MediaController.getByScreen);
router.post("/media", requirePermission("sync_slides"), MediaController.create);
router.delete("/media/:id", requirePermission("sync_slides"), MediaController.delete);


// --- CITIES & CATEGORIES ---
router.get("/cities", cacheMiddleware(60000), CitiesController.getAll);
router.get("/cities/:id", cacheMiddleware(60000), CitiesController.getById);

router.get("/categories", cacheMiddleware(60000), CategoriesController.getAll);
router.get("/categories/:id", cacheMiddleware(60000), CategoriesController.getById);


// --- RBAC & USER MANAGEMENT ---
router.get("/users", requirePermission("manage_users"), UsersController.getAll);
router.get("/users/:id", requirePermission("manage_users"), UsersController.getById);
router.post("/users/:id/roles", requirePermission("manage_users"), UsersController.assignRole);
router.delete("/users/:id/roles", requirePermission("manage_users"), UsersController.removeRole);
router.put("/users/:id/tenant", requirePermission("manage_users"), UsersController.updateTenant);

router.get("/roles", requirePermission("manage_users"), UsersController.getRoles);
router.get("/permissions", requirePermission("manage_users"), UsersController.getPermissions);


// --- MULTI-TENANTS MANAGEMENT ---
router.get("/tenants", requirePermission("manage_users"), TenantsController.getAll);
router.get("/tenants/:id", requirePermission("manage_users"), TenantsController.getById);
router.post("/tenants", requirePermission("manage_users"), TenantsController.create);

export { router as apiV1Router };
export default router;
