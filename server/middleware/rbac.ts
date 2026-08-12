import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.ts";
import { db } from "../../src/db/index";
import { users, userRoles, roles, rolePermissions, permissions } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import { ForbiddenError, UnauthorizedError } from "./errorHandler.ts";
import { logger } from "./logger.ts";

export interface SecureAuthRequest extends AuthRequest {
  dbUser?: any;
  userPermissions?: string[];
  userRoles?: string[];
}

// Loads dbUser and their permissions/roles into the request object
export const populateUserIdentity = async (
  req: SecureAuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.uid) {
    return next(new UnauthorizedError("User is not authenticated via Firebase Admin"));
  }

  try {
    // 1. Fetch DB User
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.uid, req.user.uid))
      .limit(1);

    if (!dbUser) {
      return next(new UnauthorizedError("No user record found in the database. Please complete registration."));
    }

    req.dbUser = dbUser;

    // 2. Fetch User's Roles
    const userRolesList = await db
      .select({
        roleSlug: roles.slug,
        roleId: roles.id
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, dbUser.id));

    req.userRoles = userRolesList.map(r => r.roleSlug);

    // 3. Fetch User's Permissions
    if (userRolesList.length > 0) {
      const permsList = await db
        .select({
          permSlug: permissions.slug
        })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(
          // Match any of the roleIds this user possesses
          eq(rolePermissions.roleId, userRolesList[0].roleId) // Support multiple roles in future or check them in a loop
        );

      // Support multi-role aggregation
      const aggregatedPermsSet = new Set<string>();
      for (const r of userRolesList) {
        const rolePerms = await db
          .select({ permSlug: permissions.slug })
          .from(rolePermissions)
          .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
          .where(eq(rolePermissions.roleId, r.roleId));
        rolePerms.forEach(p => aggregatedPermsSet.add(p.permSlug));
      }

      req.userPermissions = Array.from(aggregatedPermsSet);
    } else {
      req.userPermissions = [];
    }

    logger.info(`User identity populated: ${dbUser.email} | Roles: ${req.userRoles.join(",")} | Perms: ${req.userPermissions.join(",")}`);
    next();
  } catch (error) {
    logger.error("Error populating user identity in RBAC middleware", error);
    next(error);
  }
};

// Check if user has a specific permission
export const requirePermission = (permissionSlug: string) => {
  return [
    populateUserIdentity,
    (req: SecureAuthRequest, res: Response, next: NextFunction) => {
      if (!req.userPermissions || !req.userPermissions.includes(permissionSlug)) {
        logger.warn(`User ${req.dbUser?.email} attempted to perform action requiring '${permissionSlug}' but lacked authorization.`);
        return next(new ForbiddenError(`Required permission '${permissionSlug}' was not found for this user account.`));
      }
      next();
    }
  ];
};

// Check if user has a specific role
export const requireRole = (roleSlug: string) => {
  return [
    populateUserIdentity,
    (req: SecureAuthRequest, res: Response, next: NextFunction) => {
      if (!req.userRoles || !req.userRoles.includes(roleSlug)) {
        logger.warn(`User ${req.dbUser?.email} attempted to perform action requiring role '${roleSlug}' but lacked authorization.`);
        return next(new ForbiddenError(`Required role '${roleSlug}' was not found for this user account.`));
      }
      next();
    }
  ];
};
