import { Router } from "express";
import { eq } from "drizzle-orm";
import { requireAuth } from "../../middleware/auth.ts";
import { defaultRateLimiter } from "../../middleware/rateLimiter.ts";
import { cacheMiddleware } from "../../middleware/cache.ts";
import { requirePermission } from "../../middleware/rbac.ts";
import { getAdminAuth } from "../../lib/firebase-admin.ts";
import { db } from "../../db/index.ts";
import { roles, userRoles, users } from "../../db/schema.ts";
import {
  SpacesController, CampaignsController, MediaKitsController, CitiesController,
  CategoriesController, MediaController, UsersController, DashboardController,
  SearchController, TenantsController
} from "../../controllers/index.ts";
import { SwaggerController } from "../../controllers/swaggerController.ts";

const router = Router();

router.get("/swagger.json", SwaggerController.getJson);
router.get("/docs", SwaggerController.getHtml);

// Firebase proves identity; PostgreSQL remains the source of tenant/RBAC authority.
router.post("/auth/sync", async (req, res) => {
  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    return res.status(503).json({ success: false, error: { code: "FIREBASE_NOT_INITIALIZED", message: "El servicio de autenticación no está disponible." } });
  }

  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Token de autenticación no proporcionado." } });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(authorization.slice("Bearer ".length));
    const email = decoded.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, error: { code: "EMAIL_REQUIRED", message: "La cuenta de Firebase no tiene un correo válido." } });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    const isBootstrapAdmin = adminEmails.includes(email);
    const defaultTenantId = process.env.DEFAULT_TENANT_ID || null;

    let [dbUser] = await db.select().from(users).where(eq(users.uid, decoded.uid)).limit(1);

    // Only explicitly configured admin accounts may bootstrap themselves.
    if (!dbUser) {
      if (!isBootstrapAdmin || !defaultTenantId) {
        return res.status(403).json({ success: false, error: { code: "USER_NOT_PROVISIONED", message: "La cuenta no está provisionada para esta plataforma." } });
      }
      const inserted = await db.insert(users).values({
        uid: decoded.uid,
        tenantId: defaultTenantId,
        email,
        displayName: decoded.name || null,
      }).returning();
      dbUser = inserted[0];
    }

    if (!dbUser) {
      return res.status(500).json({ success: false, error: { code: "USER_SYNC_FAILED", message: "No se pudo sincronizar el usuario." } });
    }

    let assignedRoles = await db
      .select({ roleSlug: roles.slug, roleId: roles.id })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, dbUser.id));

    if (isBootstrapAdmin && !assignedRoles.some((role) => role.roleSlug === "admin")) {
      let [adminRole] = await db.select().from(roles).where(eq(roles.slug, "admin")).limit(1);
      if (!adminRole) {
        const created = await db.insert(roles).values({
          id: "role-admin",
          name: "Admin",
          slug: "admin",
          description: "Administrador de la plataforma",
        }).returning();
        adminRole = created[0];
      }
      if (adminRole) {
        await db.insert(userRoles).values({ userId: dbUser.id, roleId: adminRole.id }).onConflictDoNothing();
        assignedRoles = [...assignedRoles, { roleSlug: adminRole.slug, roleId: adminRole.id }];
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        uid: dbUser.uid,
        email: dbUser.email,
        displayName: dbUser.displayName,
        tenantId: dbUser.tenantId,
        roles: assignedRoles.map((role) => role.roleSlug),
        isAdmin: assignedRoles.some((role) => role.roleSlug === "admin"),
      },
    });
  } catch (error) {
    console.error("[API POST /api/auth/sync]", error);
    return res.status(401).json({ success: false, error: { code: "INVALID_TOKEN", message: "Token de autenticación inválido o expirado." } });
  }
});

router.use(requireAuth);
router.use(defaultRateLimiter);

router.get("/dashboard/stats", cacheMiddleware(5000), DashboardController.getStats);
router.get("/search", SearchController.search);

router.get("/spaces", cacheMiddleware(10000), SpacesController.getAll);
router.get("/spaces/:id", cacheMiddleware(10000), SpacesController.getSpaceDetails);
router.post("/spaces", requirePermission("sync_slides"), SpacesController.create);
router.put("/spaces/:id", requirePermission("sync_slides"), SpacesController.update);
router.delete("/spaces/:id", requirePermission("sync_slides"), SpacesController.delete);

router.get("/screens", cacheMiddleware(10000), SpacesController.getAll);
router.get("/screens/:id", cacheMiddleware(10000), SpacesController.getSpaceDetails);
router.post("/screens", requirePermission("sync_slides"), SpacesController.create);
router.put("/screens/:id", requirePermission("sync_slides"), SpacesController.update);
router.delete("/screens/:id", requirePermission("sync_slides"), SpacesController.delete);

router.get("/campaigns", cacheMiddleware(10000), CampaignsController.getAll);
router.get("/campaigns/:id", cacheMiddleware(10000), CampaignsController.getCampaignDetails);
router.post("/campaigns", requirePermission("edit_campaigns"), CampaignsController.create);
router.put("/campaigns/:id", requirePermission("edit_campaigns"), CampaignsController.update);
router.delete("/campaigns/:id", requirePermission("edit_campaigns"), CampaignsController.delete);

router.get("/mediakits", cacheMiddleware(10000), MediaKitsController.getAll);
router.get("/mediakits/:id", cacheMiddleware(10000), MediaKitsController.getMediaKitDetails);
router.post("/mediakits", requirePermission("edit_campaigns"), MediaKitsController.create);
router.put("/mediakits/:id", requirePermission("edit_campaigns"), MediaKitsController.update);
router.delete("/mediakits/:id", requirePermission("edit_campaigns"), MediaKitsController.delete);

router.get("/spaces/:screenId/media", cacheMiddleware(10000), MediaController.getByScreen);
router.post("/media", requirePermission("sync_slides"), MediaController.create);
router.delete("/media/:id", requirePermission("sync_slides"), MediaController.delete);

router.get("/cities", cacheMiddleware(60000), CitiesController.getAll);
router.get("/cities/:id", cacheMiddleware(60000), CitiesController.getById);
router.get("/categories", cacheMiddleware(60000), CategoriesController.getAll);
router.get("/categories/:id", cacheMiddleware(60000), CategoriesController.getById);

router.get("/users", requirePermission("manage_users"), UsersController.getAll);
router.get("/users/:id", requirePermission("manage_users"), UsersController.getById);
router.post("/users/:id/roles", requirePermission("manage_users"), UsersController.assignRole);
router.delete("/users/:id/roles", requirePermission("manage_users"), UsersController.removeRole);
router.put("/users/:id/tenant", requirePermission("manage_users"), UsersController.updateTenant);
router.get("/roles", requirePermission("manage_users"), UsersController.getRoles);
router.get("/permissions", requirePermission("manage_users"), UsersController.getPermissions);

router.get("/tenants", requirePermission("manage_users"), TenantsController.getAll);
router.get("/tenants/:id", requirePermission("manage_users"), TenantsController.getById);
router.post("/tenants", requirePermission("manage_users"), TenantsController.create);

export { router as apiV1Router };
export default router;
