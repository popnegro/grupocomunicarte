import { ValidationError } from "../middleware/errorHandler.ts";

export interface PaginationQueryDTO {
  page: number;
  limit: number;
  offset: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string>;
}

export function validatePaginationQuery(query: any): PaginationQueryDTO {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || "10", 10)));
  const offset = (page - 1) * limit;
  const search = query.search ? String(query.search).trim() : undefined;
  const sortBy = query.sortBy ? String(query.sortBy).trim() : undefined;
  const sortOrder = query.sortOrder === "desc" ? "desc" : "asc";

  // Parse filters (any other query parameters not page, limit, search, sortBy, sortOrder)
  const filters: Record<string, string> = {};
  const reserved = ["page", "limit", "search", "sortBy", "sortOrder"];
  Object.keys(query).forEach((key) => {
    if (!reserved.includes(key) && query[key] !== undefined) {
      filters[key] = String(query[key]).trim();
    }
  });

  return { page, limit, offset, search, sortBy, sortOrder, filters };
}

export function validateSpaceDTO(body: any) {
  const errors: Record<string, string> = {};

  if (!body.nombre || typeof body.nombre !== "string" || body.nombre.trim() === "") {
    errors.nombre = "Name (nombre) is required and must be a non-empty string";
  }

  if (body.precio !== undefined) {
    const val = Number(body.precio);
    if (isNaN(val) || val < 0) {
      errors.precio = "Price (precio) must be a non-negative number";
    }
  }

  if (body.impactos !== undefined) {
    const val = Number(body.impactos);
    if (isNaN(val) || val < 0) {
      errors.impactos = "Weekly impressions (impactos) must be a non-negative integer";
    }
  }

  if (body.status && !["Activo", "Mantenimiento", "Inactivo"].includes(body.status)) {
    errors.status = "Status must be either 'Activo', 'Mantenimiento' or 'Inactivo'";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors, "Invalid advertising space (screen) details");
  }

  return {
    nombre: String(body.nombre).trim(),
    zona: body.zona ? String(body.zona).trim() : null,
    tipo: body.tipo ? String(body.tipo).trim() : null,
    categoria: body.categoria ? String(body.categoria).trim() : null,
    ciudad: body.ciudad ? String(body.ciudad).trim() : null,
    impactos: body.impactos ? Number(body.impactos) : 0,
    precio: body.precio ? Number(body.precio) : 0,
    status: body.status || "Activo",
    dimensiones: body.dimensiones ? String(body.dimensiones).trim() : null,
    brillo: body.brillo ? String(body.brillo).trim() : null,
    refreshRate: body.refreshRate ? String(body.refreshRate).trim() : null,
    formato: body.formato ? String(body.formato).trim() : null,
    cobertura: body.cobertura ? String(body.cobertura).trim() : null,
    ruta: body.ruta ? String(body.ruta).trim() : null,
    tenantId: body.tenantId ? String(body.tenantId).trim() : "tenant-default"
  };
}

export function validateCampaignDTO(body: any) {
  const errors: Record<string, string> = {};

  if (!body.nombre || typeof body.nombre !== "string" || body.nombre.trim() === "") {
    errors.nombre = "Campaign name (nombre) is required and must be a non-empty string";
  }

  if (!body.clienteId || typeof body.clienteId !== "string" || body.clienteId.trim() === "") {
    errors.clienteId = "Client ID (clienteId) is required";
  }

  if (body.presupuesto !== undefined) {
    const val = Number(body.presupuesto);
    if (isNaN(val) || val < 0) {
      errors.presupuesto = "Budget (presupuesto) must be a non-negative number";
    }
  }

  if (body.estado && !["planificacion", "activa", "finalizada", "pausada"].includes(body.estado)) {
    errors.estado = "Campaign status (estado) must be 'planificacion', 'activa', 'finalizada', or 'pausada'";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors, "Invalid campaign details");
  }

  return {
    nombre: String(body.nombre).trim(),
    clienteId: String(body.clienteId).trim(),
    mediaKitId: body.mediaKitId ? String(body.mediaKitId).trim() : null,
    presupuesto: body.presupuesto ? Number(body.presupuesto) : 0,
    estado: body.estado || "planificacion",
    fechaInicio: body.fechaInicio ? String(body.fechaInicio).trim() : null,
    fechaFin: body.fechaFin ? String(body.fechaFin).trim() : null,
    tenantId: body.tenantId ? String(body.tenantId).trim() : "tenant-default"
  };
}

export function validateMediaDTO(body: any) {
  const errors: Record<string, string> = {};

  if (!body.screenId || typeof body.screenId !== "string" || body.screenId.trim() === "") {
    errors.screenId = "Screen ID (screenId) is required";
  }

  if (!body.type || !["image", "video", "drone"].includes(body.type)) {
    errors.type = "Type must be either 'image', 'video' or 'drone'";
  }

  if (!body.url || typeof body.url !== "string" || !body.url.startsWith("http")) {
    errors.url = "Valid absolute URL is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors, "Invalid media asset details");
  }

  return {
    screenId: String(body.screenId).trim(),
    type: String(body.type).trim(),
    url: String(body.url).trim(),
    title: body.title ? String(body.title).trim() : null,
    sizeBytes: body.sizeBytes ? Number(body.sizeBytes) : null,
    isHero: body.isHero === true || body.isHero === "true"
  };
}

export function validateMediaKitDTO(body: any) {
  const errors: Record<string, string> = {};

  if (!body.nombre || typeof body.nombre !== "string" || body.nombre.trim() === "") {
    errors.nombre = "Media kit name (nombre) is required";
  }

  if (!body.clienteNombre || typeof body.clienteNombre !== "string" || body.clienteNombre.trim() === "") {
    errors.clienteNombre = "Client Name (clienteNombre) is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors, "Invalid mediakit details");
  }

  return {
    nombre: String(body.nombre).trim(),
    clienteNombre: String(body.clienteNombre).trim(),
    ciudad: body.ciudad ? String(body.ciudad).trim() : null,
    totalPresupuesto: body.totalPresupuesto ? Number(body.totalPresupuesto) : 0,
    objetivo: body.objetivo ? String(body.objetivo).trim() : null,
    observaciones: body.observaciones ? String(body.observaciones).trim() : null,
    googleSlidesUrl: body.googleSlidesUrl ? String(body.googleSlidesUrl).trim() : null,
    screenIds: body.screenIds ? (typeof body.screenIds === "string" ? body.screenIds : JSON.stringify(body.screenIds)) : "[]",
    tenantId: body.tenantId ? String(body.tenantId).trim() : "tenant-default"
  };
}
