// src/lib/apiRoutes.ts

export const API_ROUTES = {
  leads: "/api/leads",
  publicScreens: "/api/public/screens",
  ai: {
    generate: "/api/ai/generate",
    seoAudit: "/api/ai/seo-audit",
    recommendations: "/api/ai/recommendations",
  },
  sync: "/api/sync",
  syncHistory: "/api/sync/history",
  syncErrors: (syncId: number) => `/api/sync/errors/${syncId}`,
  syncRollback: "/api/sync/rollback",
  auth: {
    googleStatus: "/api/auth/google/status",
    googleUrl: "/api/auth/google/url",
  },
};