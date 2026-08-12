import { Request, Response } from "express";

export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "LeadMóvil Smart OOH REST API",
    version: "1.0.0",
    description: "API REST v1 con soporte Multi-Tenant y RBAC para gestión publicitaria exterior inteligente"
  },
  servers: [
    {
      url: "/api/v1",
      description: "Servidor Principal API v1"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Ingrese su Firebase ID Token (Bearer token)"
      }
    },
    schemas: {
      AdvertisingSpace: {
        type: "object",
        required: ["nombre"],
        properties: {
          id: { type: "string", example: "sc-01" },
          nombre: { type: "string", example: "Pantalla LED Peatonal Km 0" },
          zona: { type: "string", example: "Microcentro" },
          tipo: { type: "string", example: "Peatonal" },
          categoria: { type: "string", example: "pantallas-led" },
          ciudad: { type: "string", example: "mendoza" },
          impactos: { type: "integer", example: 14200 },
          precio: { type: "integer", example: 95000 },
          status: { type: "string", enum: ["Activo", "Mantenimiento", "Inactivo"], example: "Activo" },
          dimensiones: { type: "string", example: "4m x 3m" },
          brillo: { type: "string", example: "7500 nits" },
          refreshRate: { type: "string", example: "3840 Hz" },
          formato: { type: "string", example: "16:9" },
          cobertura: { type: "string", example: "Alta densidad peatonal y turística" },
          tenantId: { type: "string", example: "tenant-default" }
        }
      },
      Campaign: {
        type: "object",
        required: ["nombre", "clienteId"],
        properties: {
          id: { type: "string", example: "camp-01" },
          nombre: { type: "string", example: "Hilux Summer Mendoza 2026" },
          clienteId: { type: "string", example: "cl-01" },
          mediaKitId: { type: "string", example: "mk-201" },
          presupuesto: { type: "integer", example: 1500000 },
          estado: { type: "string", enum: ["planificacion", "activa", "finalizada", "pausada"], example: "activa" },
          fechaInicio: { type: "string", example: "2026-01-01" },
          fechaFin: { type: "string", example: "2026-03-31" },
          tenantId: { type: "string", example: "tenant-default" }
        }
      },
      MediaAsset: {
        type: "object",
        required: ["screenId", "type", "url"],
        properties: {
          id: { type: "string", example: "m-01" },
          screenId: { type: "string", example: "sc-01" },
          type: { type: "string", enum: ["image", "video", "drone"], example: "image" },
          url: { type: "string", example: "https://images.unsplash.com/photo-1540575467063-178a50c2df87" },
          title: { type: "string", example: "Vista Peatonal Diurna" },
          sizeBytes: { type: "integer", example: 154000 },
          isHero: { type: "boolean", example: true }
        }
      },
      MediaKit: {
        type: "object",
        required: ["nombre", "clienteNombre"],
        properties: {
          id: { type: "string", example: "mk-201" },
          nombre: { type: "string", example: "Propuesta Verano Mendoza" },
          clienteNombre: { type: "string", example: "Toyota Yacopini" },
          ciudad: { type: "string", example: "Mendoza" },
          totalPresupuesto: { type: "integer", example: 1200000 },
          objetivo: { type: "string", example: "Lanzamiento Hilux 2026" },
          observaciones: { type: "string", example: "Pauta premium de alta frecuencia" },
          googleSlidesUrl: { type: "string", example: "https://docs.google.com/presentation/d/.../edit" },
          screenIds: { type: "string", example: "[\"sc-01\", \"sc-02\"]" },
          tenantId: { type: "string", example: "tenant-default" }
        }
      }
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ],
  paths: {
    "/spaces": {
      get: {
        summary: "Obtener todos los soportes / pantallas",
        description: "Soporta paginación, filtros de búsqueda, estado y ciudad.",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "ciudad", in: "query", schema: { type: "string" } },
          { name: "categoria", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string" } }
        ],
        responses: {
          200: {
            description: "Lista de pantallas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/AdvertisingSpace" } },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Crear un nuevo soporte publicitario (Pantalla)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AdvertisingSpace" }
            }
          }
        },
        responses: {
          201: {
            description: "Creado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/AdvertisingSpace" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/spaces/{id}": {
      get: {
        summary: "Obtener un soporte por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            description: "Detalle del soporte",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/AdvertisingSpace" }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        summary: "Actualizar un soporte por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AdvertisingSpace" }
            }
          }
        },
        responses: {
          200: {
            description: "Soporte actualizado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/AdvertisingSpace" }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        summary: "Eliminar un soporte",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            description: "Soporte eliminado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/campaigns": {
      get: {
        summary: "Listar campañas de publicidad",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "estado", in: "query", schema: { type: "string" } }
        ],
        responses: {
          200: {
            description: "Colección de campañas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/Campaign" } },
                    total: { type: "integer" }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Crear una nueva campaña publicitaria",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Campaign" }
            }
          }
        },
        responses: {
          201: {
            description: "Campaña creada con éxito"
          }
        }
      }
    },
    "/dashboard/stats": {
      get: {
        summary: "Obtener métricas consolidadas del Dashboard",
        description: "Retorna presupuesto activo, impresiones semanales, porcentajes de ocupación e impactos.",
        responses: {
          200: {
            description: "Métricas gerenciales",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        screensCount: { type: "integer" },
                        activeCampaignsCount: { type: "integer" },
                        totalActiveBudget: { type: "integer" },
                        totalWeeklyImpacts: { type: "integer" },
                        averageOccupancyRate: { type: "number" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/search": {
      get: {
        summary: "Búsqueda unificada global",
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            description: "Resultados organizados por entidad",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        screens: { type: "array", items: { $ref: "#/components/schemas/AdvertisingSpace" } },
                        campaigns: { type: "array", items: { $ref: "#/components/schemas/Campaign" } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const SwaggerController = {
  getJson(req: Request, res: Response) {
    res.json(openApiSpec);
  },

  getHtml(req: Request, res: Response) {
    const html = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Swagger UI - LeadMóvil REST API</title>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui.css" />
          <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin: 0; background: #fafafa; font-family: sans-serif; }
            .topbar { background-color: #1b1b1b; padding: 12px; color: white; font-weight: bold; font-size: 18px; display: flex; align-items: center; justify-content: center; }
          </style>
        </head>
        <body>
          <div class="topbar">LeadMóvil Smart OOH - Interactive API Console</div>
          <div id="swagger-ui"></div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-bundle.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
              const ui = SwaggerUIBundle({
                url: "/api/v1/swagger.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "BaseLayout"
              });
              window.ui = ui;
            };
          </script>
        </body>
      </html>
    `;
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  }
};
