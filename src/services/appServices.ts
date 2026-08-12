import { SpacesRepository, CampaignsRepository, MediaKitsRepository, TenantsRepository, ClientsRepository } from "../repositories/index.ts";
import { db } from "../db/index.ts";
import { screens, campaigns, leads, metrics, clientes } from "../db/schema.ts";
import { eq, sql, and } from "drizzle-orm";
import { PaginationQueryDTO } from "../validation/validator.ts";

export const SpacesService = {
  async getSpaces(dto: PaginationQueryDTO) {
    return SpacesRepository.findAndCount(dto);
  },

  async getSpaceDetails(id: string) {
    const space = await SpacesRepository.findById(id);
    if (!space) throw new Error("Advertising space not found");
    return space;
  },

  async createSpace(data: any) {
    return SpacesRepository.create(data);
  },

  async updateSpace(id: string, data: any) {
    await this.getSpaceDetails(id); // checks existence
    return SpacesRepository.update(id, data);
  },

  async deleteSpace(id: string) {
    await this.getSpaceDetails(id); // checks existence
    return SpacesRepository.delete(id);
  }
};

export const CampaignsService = {
  async getCampaigns(dto: PaginationQueryDTO) {
    return CampaignsRepository.findAndCount(dto);
  },

  async getCampaignDetails(id: string) {
    const campaign = await CampaignsRepository.findById(id);
    if (!campaign) throw new Error("Campaign not found");
    return campaign;
  },

  async createCampaign(data: any, screenSelections?: any[]) {
    return CampaignsRepository.create(data, screenSelections);
  },

  async updateCampaign(id: string, data: any, screenSelections?: any[]) {
    await this.getCampaignDetails(id); // checks existence
    return CampaignsRepository.update(id, data, screenSelections);
  },

  async deleteCampaign(id: string) {
    await this.getCampaignDetails(id); // checks existence
    return CampaignsRepository.delete(id);
  }
};

export const MediaKitsService = {
  async getMediaKits(dto: PaginationQueryDTO) {
    return MediaKitsRepository.findAndCount(dto);
  },

  async getMediaKitDetails(id: string) {
    const mediakit = await MediaKitsRepository.findById(id);
    if (!mediakit) throw new Error("Media kit not found");
    return mediakit;
  },

  async createMediaKit(data: any) {
    return MediaKitsRepository.create(data);
  },

  async updateMediaKit(id: string, data: any) {
    await this.getMediaKitDetails(id); // checks existence
    return MediaKitsRepository.update(id, data);
  },

  async deleteMediaKit(id: string) {
    await this.getMediaKitDetails(id); // checks existence
    return MediaKitsRepository.delete(id);
  }
};

export const ClientsService = {
  async getClients(dto: PaginationQueryDTO) {
    return ClientsRepository.findAndCount(dto);
  },

  async getClientDetails(id: string) {
    const client = await ClientsRepository.findById(id);
    if (!client) throw new Error("Client not found");
    return client;
  },

  async createClient(data: any) {
    return ClientsRepository.create(data);
  },

  async updateClient(id: string, data: any) {
    await this.getClientDetails(id); // checks existence
    return ClientsRepository.update(id, data);
  },

  async deleteClient(id: string) {
    await this.getClientDetails(id); // checks existence
    return ClientsRepository.delete(id);
  }
};

export const DashboardService = {
  async getKPIMetrics(tenantId: string = "tenant-default") {
    // 1. Screens count
    const [screensCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(screens)
      .where(eq(screens.tenantId, tenantId));

    // 2. Active campaigns count & total budget
    const [campaignsStats] = await db
      .select({
        count: sql<number>`count(*)`,
        totalBudget: sql<number>`sum(${campaigns.presupuesto})`
      })
      .from(campaigns)
      .where(and(eq(campaigns.tenantId, tenantId), eq(campaigns.estado, "activa")));

    // 3. Leads converted / total
    const [leadsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads);

    // 4. Sum of weekly impacts across all screens
    const [impactsSum] = await db
      .select({ total: sql<number>`sum(${screens.impactos})` })
      .from(screens)
      .where(eq(screens.tenantId, tenantId));

    // 5. Query average occupancy rates or impressions from metrics
    const impressionsMetrics = await db
      .select({
        avgVal: sql<number>`avg(${metrics.value})`
      })
      .from(metrics)
      .innerJoin(screens, eq(metrics.screenId, screens.id))
      .where(and(eq(screens.tenantId, tenantId), eq(metrics.metricType, "impressions")));

    const occupancyMetrics = await db
      .select({
        avgVal: sql<number>`avg(${metrics.value})`
      })
      .from(metrics)
      .innerJoin(screens, eq(metrics.screenId, screens.id))
      .where(and(eq(screens.tenantId, tenantId), eq(metrics.metricType, "occupancy_rate")));

    return {
      screensCount: Number(screensCount?.count || 0),
      activeCampaignsCount: Number(campaignsStats?.count || 0),
      totalActiveBudget: Number(campaignsStats?.totalBudget || 0),
      totalLeadsCount: Number(leadsCount?.count || 0),
      totalWeeklyImpacts: Number(impactsSum?.total || 0),
      averageImpressions: Math.round(Number(impressionsMetrics[0]?.avgVal || 0)),
      averageOccupancyRate: parseFloat(Number(occupancyMetrics[0]?.avgVal || 0).toFixed(2))
    };
  }
};

export const SearchService = {
  async unifiedSearch(query: string, tenantId: string = "tenant-default") {
    const searchPattern = `%${query}%`;

    // 1. Search screens
    const matchedScreens = await db
      .select()
      .from(screens)
      .where(
        and(
          eq(screens.tenantId, tenantId),
          sql`${screens.nombre} ILIKE ${searchPattern} OR ${screens.zona} ILIKE ${searchPattern}`
        )
      )
      .limit(5);

    // 2. Search campaigns
    const matchedCampaigns = await db
      .select()
      .from(campaigns)
      .where(
        and(
          eq(campaigns.tenantId, tenantId),
          sql`${campaigns.nombre} ILIKE ${searchPattern}`
        )
      )
      .limit(5);

    // 3. Search clients
    const matchedClients = await db
      .select()
      .from(clientes)
      .where(
        and(
          eq(clientes.tenantId, tenantId),
          sql`${clientes.nombre} ILIKE ${searchPattern} OR ${clientes.empresa} ILIKE ${searchPattern}`
        )
      )
      .limit(5);

    return {
      screens: matchedScreens,
      campaigns: matchedCampaigns,
      clients: matchedClients
    };
  }
};
