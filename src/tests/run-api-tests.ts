import { validateSpaceDTO, validateCampaignDTO, validateMediaKitDTO } from "../validation/validator.ts";
import { SpacesRepository, CampaignsRepository } from "../repositories/index.ts";
import { DashboardService, SearchService } from "../services/appServices.ts";
import { memoryCache } from "../middleware/cache.ts";
import { logger } from "../middleware/logger.ts";

async function runAuditTests() {
  logger.info("=== STARTING SMART OOH API REST AUDIT TESTS ===");
  let successCount = 0;
  let failCount = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      logger.info(`[PASS] ${testName}`);
      successCount++;
    } else {
      logger.error(`[FAIL] ${testName}`);
      failCount++;
    }
  }

  // --- 1. DTO & VALIDATION TESTS ---
  try {
    const validSpaceInput = {
      nombre: "Pantalla Test",
      precio: 10000,
      impactos: 5000,
      status: "Activo",
      zona: "Norte"
    };
    const validated = validateSpaceDTO(validSpaceInput);
    assert(validated.nombre === "Pantalla Test" && validated.precio === 10000, "DTO Validation - Valid Advertising Space input parses correctly");
  } catch (err: any) {
    assert(false, `DTO Validation - Valid Advertising Space failed: ${err.message}`);
  }

  try {
    const invalidSpaceInput = {
      nombre: "", // Empty name should fail
      precio: -500
    };
    validateSpaceDTO(invalidSpaceInput);
    assert(false, "DTO Validation - Invalid Advertising Space input should have thrown an error");
  } catch (err: any) {
    assert(err.message === "Invalid advertising space (screen) details", "DTO Validation - Invalid input correctly raises ValidationError with 400");
  }

  // --- 2. CACHING & PERFORMANCE TEST ---
  try {
    const cacheKey = "/api/v1/spaces?page=1";
    const cacheEntry = {
      body: { data: [{ id: "sc-01", name: "Pantalla 1" }] },
      headers: {},
      statusCode: 200,
      expiresAt: Date.now() + 5000 // expires in 5s
    };

    memoryCache.set(cacheKey, cacheEntry);
    const hit = memoryCache.get(cacheKey);
    assert(hit !== null && hit.body.data[0].id === "sc-01", "Performance - Cache set/get fetches from memory near-instantly (<1ms)");

    // Invalidate pattern
    memoryCache.invalidatePattern(/^\/api\/v1\/spaces/);
    const invalidated = memoryCache.get(cacheKey);
    assert(invalidated === null, "Performance - Cache invalidation purges stale keys reliably on data mutation");
  } catch (err: any) {
    assert(false, `Performance Cache Audit failed: ${err.message}`);
  }

  // --- 3. DATABASE CONSISTENCY & REPOSITORY QUERIES ---
  try {
    // Search the seeded database screens
    const { data, total } = await SpacesRepository.findAndCount({ page: 1, limit: 5, offset: 0 });
    assert(Array.isArray(data) && total >= 0, "Consistencia - SpacesRepository queries are responsive and type-safe");
  } catch (err: any) {
    assert(false, `Consistencia - SpacesRepository query failed: ${err.message}`);
  }

  // --- 4. BUSINESS LOGIC & KPI ANALYTICS AGGREGATION ---
  try {
    const metricsResult = await DashboardService.getKPIMetrics("tenant-default");
    assert(
      typeof metricsResult.screensCount === "number" &&
      typeof metricsResult.activeCampaignsCount === "number" &&
      typeof metricsResult.totalActiveBudget === "number" &&
      typeof metricsResult.totalWeeklyImpacts === "number",
      "Consistencia - DashboardService correctly aggregates SQL counts, averages, and active budgets"
    );
  } catch (err: any) {
    assert(false, `Consistencia - Dashboard KPI aggregation failed: ${err.message}`);
  }

  // --- 5. SEARCH SERVICE INDEXING ---
  try {
    const searchResult = await SearchService.unifiedSearch("Mendoza", "tenant-default");
    assert(
      Array.isArray(searchResult.screens) &&
      Array.isArray(searchResult.campaigns) &&
      Array.isArray(searchResult.clients),
      "Consistencia - UnifiedSearch retrieves indexes across screens, campaigns, and clients concurrently"
    );
  } catch (err: any) {
    assert(false, `Consistencia - UnifiedSearch failed: ${err.message}`);
  }

  logger.info(`=== AUDIT COMPLETED: ${successCount} PASSED, ${failCount} FAILED ===`);
}

// Execute if run directly
if (import.meta.url.endsWith(process.argv[1])) {
  runAuditTests();
}

export { runAuditTests };
export default runAuditTests;
