import { db } from "../db/index.ts";
import { googleCredentials } from "../db/schema.ts";
import { eq } from "drizzle-orm";

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}

export class GoogleSlidesBackendService {
  private static clientId = process.env.GOOGLE_CLIENT_ID || "";
  private static clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  private static redirectUri = process.env.GOOGLE_REDIRECT_URI || "";

  /**
   * Checks if backend OAuth environment variables are properly configured.
   */
  public static isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret && this.redirectUri);
  }

  /**
   * Generates Google OAuth authorization URL for offline access (refresh tokens).
   */
  public static getAuthUrl(userId: number): string {
    const scopes = encodeURIComponent(
      "https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets"
    );
    const redirect = encodeURIComponent(this.redirectUri);
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${redirect}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent&state=${userId}`;
  }

  /**
   * Exchanges authorization code for access and refresh tokens, saving them to DB.
   */
  public static async exchangeCodeAndSave(userId: number, code: string): Promise<void> {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google token exchange failed: ${res.statusText} - ${errorText}`);
    }

    const data = (await res.json()) as GoogleTokenResponse;
    const expiryDate = new Date(Date.now() + data.expires_in * 1000);

    // Prepare credentials record
    const creds = {
      userId,
      accessToken: data.access_token,
      refreshToken: data.refresh_token || "", // Keep existing if not returned (Google only sends on first consent)
      expiryDate,
      scopes: data.scope,
      updatedAt: new Date(),
    };

    const existing = await db
      .select()
      .from(googleCredentials)
      .where(eq(googleCredentials.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      // If refresh token wasn't sent this time (re-auth), preserve the old one
      if (!creds.refreshToken && existing[0].refreshToken) {
        creds.refreshToken = existing[0].refreshToken;
      }
      await db
        .update(googleCredentials)
        .set(creds)
        .where(eq(googleCredentials.userId, userId));
    } else {
      if (!creds.refreshToken) {
        throw new Error(
          "First-time Google Auth requires a refresh token. Please revoke access first or try incognito."
        );
      }
      await db.insert(googleCredentials).values({
        ...creds,
        createdAt: new Date(),
      });
    }
  }

  /**
   * Gets an active, non-expired access token for the given user, automatically refreshing if needed.
   */
  public static async getAccessToken(userId: number): Promise<string> {
    const existing = await db
      .select()
      .from(googleCredentials)
      .where(eq(googleCredentials.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      throw new Error(`No Google credentials found for user ID: ${userId}`);
    }

    const cred = existing[0];
    const now = new Date();
    // Refresh 5 minutes before actual expiry to be safe
    const bufferTime = 5 * 60 * 1000;
    const isExpired = cred.expiryDate.getTime() - bufferTime < now.getTime();

    if (!isExpired) {
      return cred.accessToken;
    }

    // Refresh token
    if (!cred.refreshToken) {
      throw new Error(`Refresh token missing for user ID: ${userId}. Please re-authenticate.`);
    }

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: cred.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google token refresh failed: ${res.statusText} - ${errorText}`);
    }

    const data = (await res.json()) as GoogleTokenResponse;
    const newExpiryDate = new Date(Date.now() + data.expires_in * 1000);

    const updatePayload: Partial<typeof googleCredentials.$inferInsert> = {
      accessToken: data.access_token,
      expiryDate: newExpiryDate,
      updatedAt: new Date(),
    };
    if (data.refresh_token) {
      updatePayload.refreshToken = data.refresh_token;
    }

    await db
      .update(googleCredentials)
      .set(updatePayload)
      .where(eq(googleCredentials.userId, userId));

    return data.access_token;
  }

  /**
   * Copies a template presentation in Google Drive.
   */
  public static async cloneTemplate(
    accessToken: string,
    templateId: string,
    name: string
  ): Promise<string> {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${templateId}/copy`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to copy Google Slides template: ${res.statusText} - ${errorText}`);
    }

    const file = (await res.json()) as { id: string };
    return file.id;
  }

  /**
   * Shares the Google Slides presentation to anyone with the link and/or a specific user email.
   */
  public static async sharePresentation(
    accessToken: string,
    fileId: string,
    emailAddress?: string
  ): Promise<void> {
    // 1. Share read-only to anyone with the link so the generated URL is viewable instantly
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "reader",
        type: "anyone",
      }),
    });

    // 2. Share with specific client/manager email if provided
    if (emailAddress && emailAddress.includes("@")) {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "writer",
          type: "user",
          emailAddress,
        }),
      });
    }
  }

  /**
   * Performs high-fidelity batch updates on the slides presentation:
   * Replaces placeholders, inserts screens inventory tables, and dynamic visual items.
   */
  public static async populatePresentation(
    accessToken: string,
    presentationId: string,
    data: {
      title: string;
      clientName: string;
      city: string;
      screens: any[];
      metaId?: string;
      version?: number;
      notes?: string;
    }
  ): Promise<void> {
    const totalWeeklyPrice = data.screens.reduce((sum, s) => sum + (s.precio || 0), 0);
    const totalMonthlyPrice = totalWeeklyPrice * 4;
    const totalImpacts = data.screens.reduce((sum, s) => sum + (s.impactos || 0), 0);
    const dateStr = new Date().toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Global placeholder replacements
    const requests: any[] = [
      {
        replaceAllText: {
          containsText: { text: "{{TITLE}}", matchCase: true },
          replaceText: data.title || "Propuesta Comercial",
        },
      },
      {
        replaceAllText: {
          containsText: { text: "{{CLIENT}}", matchCase: true },
          replaceText: data.clientName || "Cliente",
        },
      },
      {
        replaceAllText: {
          containsText: { text: "{{CITY}}", matchCase: true },
          replaceText: data.city || "Mendoza",
        },
      },
      {
        replaceAllText: {
          containsText: { text: "{{DATE}}", matchCase: true },
          replaceText: dateStr,
        },
      },
      {
        replaceAllText: {
          containsText: { text: "{{TOTAL_SCREENS}}", matchCase: true },
          replaceText: String(data.screens.length),
        },
      },
      {
        replaceAllText: {
          containsText: { text: "{{TOTAL_IMPACTS}}", matchCase: true },
          replaceText: `${(totalImpacts / 1000).toFixed(1)}k / día`,
        },
      },
      {
        replaceAllText: {
          containsText: { text: "{{MONTHLY_PRICE}}", matchCase: true },
          replaceText: `$${totalMonthlyPrice.toLocaleString()}`,
        },
      },
      {
        replaceAllText: {
          containsText: { text: "{{WEEKLY_PRICE}}", matchCase: true },
          replaceText: `$${totalWeeklyPrice.toLocaleString()}`,
        },
      },
      {
        replaceAllText: {
          containsText: { text: "{{PROPOSAL_ID}}", matchCase: true },
          replaceText: data.metaId || `MK-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      },
      {
        replaceAllText: {
          containsText: { text: "{{STRATEGIC_NOTES}}", matchCase: true },
          replaceText: data.notes || "Propuesta comercial adaptada según requerimientos.",
        },
      },
    ];

    // For each screen in the MediaKit, let's programmatically append a beautiful showcase slide!
    data.screens.forEach((screen, index) => {
      const slideId = `slide_screen_${index}_${Math.floor(Math.random() * 100000)}`;
      const titleBoxId = `title_${slideId}`;
      const descBoxId = `desc_${slideId}`;
      const statsBoxId = `stats_${slideId}`;

      // 1. Create a slide at the end
      requests.push({
        createSlide: {
          objectId: slideId,
          insertionIndex: 2 + index, // Insert after intro slide (index 1)
          slideLayoutReference: {
            predefinedLayout: "BLANK",
          },
        },
      });

      // 2. Add Screen Name Title (Dark teal block style)
      requests.push({
        createShape: {
          objectId: titleBoxId,
          shapeType: "RECTANGLE",
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: 650, unit: "PT" },
              height: { magnitude: 60, unit: "PT" },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 35,
              translateY: 30,
              unit: "PT",
            },
          },
        },
      });
      // Set background color of shape (Teal #06434a)
      requests.push({
        updateShapeProperties: {
          objectId: titleBoxId,
          shapeProperties: {
            shapeBackgroundFill: {
              solidFill: { color: { rgbColor: { red: 0.02, green: 0.26, blue: 0.29 } } },
            },
            outline: {
              propertyState: "NOT_RENDERED",
            },
          },
          fields: "shapeBackgroundFill.solidFill.color,outline",
        },
      });
      // Insert title text
      requests.push({
        insertText: {
          objectId: titleBoxId,
          text: `  ${index + 1}. ${screen.nombre || screen.name || "Soporte OOH"}`,
        },
      });
      // Format title text
      requests.push({
        updateTextStyle: {
          objectId: titleBoxId,
          style: {
            fontFamily: "Arial",
            fontSize: { magnitude: 18, unit: "PT" },
            foregroundColor: { solidFill: { color: { rgbColor: { red: 1, green: 1, blue: 1 } } } },
            bold: true,
          },
          textRange: { type: "ALL" },
          fields: "fontFamily,fontSize,foregroundColor,bold",
        },
      });

      // 3. Add Screen Details Sidebar Box (Left side of the slide)
      requests.push({
        createShape: {
          objectId: descBoxId,
          shapeType: "RECTANGLE",
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: 300, unit: "PT" },
              height: { magnitude: 250, unit: "PT" },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 35,
              translateY: 110,
              unit: "PT",
            },
          },
        },
      });
      // Gray background box
      requests.push({
        updateShapeProperties: {
          objectId: descBoxId,
          shapeProperties: {
            shapeBackgroundFill: {
              solidFill: { color: { rgbColor: { red: 0.96, green: 0.96, blue: 0.95 } } },
            },
            outline: {
              solidFill: { color: { rgbColor: { red: 0.91, green: 0.90, blue: 0.89 } } },
              width: { magnitude: 1, unit: "PT" },
            },
          },
          fields: "shapeBackgroundFill.solidFill.color,outline",
        },
      });
      // Insert details text
      const detailsText = 
        `ESPECIFICACIONES TÉCNICAS\n\n` +
        `• Categoría: ${screen.categoria || "OOH/DOOH"}\n` +
        `• Ubicación: ${screen.ciudad || "Mendoza"}, ${screen.zona || "Área Urbana"}\n` +
        `• Formato: ${screen.formato || "Pantalla LED de Gran Formato"}\n` +
        `• Dimensiones: ${screen.dimensiones || "Estándar"}\n` +
        `• Tipo de Tránsito: ${screen.tipo || "Alto Tránsito Mixto"}\n` +
        `• Brillo / Refresh: ${screen.brillo || "Alta Luminosidad"} / ${screen.refreshRate || "60Hz"}\n` +
        `• Cobertura horaria: ${screen.horarios || "Regular (06hs a 24hs)"}`;

      requests.push({
        insertText: {
          objectId: descBoxId,
          text: detailsText,
        },
      });
      // Format details text
      requests.push({
        updateTextStyle: {
          objectId: descBoxId,
          style: {
            fontFamily: "Arial",
            fontSize: { magnitude: 10, unit: "PT" },
            foregroundColor: { solidFill: { color: { rgbColor: { red: 0.1, green: 0.1, blue: 0.1 } } } },
          },
          textRange: { type: "ALL" },
          fields: "fontFamily,fontSize,foregroundColor",
        },
      });

      // 4. Add Screen Performance metrics Box (Right side of the slide)
      requests.push({
        createShape: {
          objectId: statsBoxId,
          shapeType: "RECTANGLE",
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: 320, unit: "PT" },
              height: { magnitude: 250, unit: "PT" },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 365,
              translateY: 110,
              unit: "PT",
            },
          },
        },
      });
      // Teal accent background box
      requests.push({
        updateShapeProperties: {
          objectId: statsBoxId,
          shapeProperties: {
            shapeBackgroundFill: {
              solidFill: { color: { rgbColor: { red: 0.94, green: 0.98, blue: 0.98 } } },
            },
            outline: {
              solidFill: { color: { rgbColor: { red: 0.80, green: 0.88, blue: 0.88 } } },
              width: { magnitude: 1, unit: "PT" },
            },
          },
          fields: "shapeBackgroundFill.solidFill.color,outline",
        },
      });
      // Insert metrics text
      const statsText = 
        `MÉTRICAS Y COMPROMISO DE AUDIENCIA\n\n` +
        `• Impactos Estimados: \n  ${((screen.impactos || 0) / 1000).toFixed(1)}k visualizaciones / día\n\n` +
        `• Impactos Semanales: \n  ${(((screen.impactos || 0) * 7) / 1000).toFixed(1)}k visualizaciones / semana\n\n` +
        `• Tarifa Semanal Cotizada: \n  $${(screen.precio || 0).toLocaleString()} ARS\n\n` +
        `• Nota / Orientación:\n  ${screen.nota || "Ubicación Premium de alto impacto geocatalizado para recordación de marca directa."}`;

      requests.push({
        insertText: {
          objectId: statsBoxId,
          text: statsText,
        },
      });
      // Format metrics text
      requests.push({
        updateTextStyle: {
          objectId: statsBoxId,
          style: {
            fontFamily: "Arial",
            fontSize: { magnitude: 10, unit: "PT" },
            foregroundColor: { solidFill: { color: { rgbColor: { red: 0.05, green: 0.2, blue: 0.22 } } } },
          },
          textRange: { type: "ALL" },
          fields: "fontFamily,fontSize,foregroundColor",
        },
      });
    });

    const res = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google Slides batchUpdate failed: ${res.statusText} - ${errorText}`);
    }
  }
}
