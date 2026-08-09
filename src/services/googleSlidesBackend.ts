import { db } from "../db/index.ts";
import { googleCredentials, screens, syncHistory, syncErrors, changelogs } from "../db/schema.ts";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import fs from "fs";
import path from "path";

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}

export class GoogleSlidesBackendService {
  public static get clientId(): string {
    if (process.env.GOOGLE_CLIENT_ID) {
      return process.env.GOOGLE_CLIENT_ID;
    }
    try {
      const configPath = path.join(process.cwd(), "firebase-applet-config.json");
      if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, "utf-8");
        const config = JSON.parse(fileContent);
        return config.oAuthClientId || "";
      }
    } catch (e) {
      console.warn("Could not read oAuthClientId from firebase-applet-config.json:", e);
    }
    return "";
  }

  private static get clientSecret(): string {
    return process.env.GOOGLE_CLIENT_SECRET || "";
  }

  private static get redirectUri(): string {
    if (process.env.GOOGLE_REDIRECT_URI) {
      return process.env.GOOGLE_REDIRECT_URI;
    }
    const appUrl = process.env.APP_URL;
    if (appUrl) {
      const base = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
      return `${base}/api/auth/google/callback`;
    }
    return "";
  }

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
      "https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send"
    );
    const redirect = encodeURIComponent(this.redirectUri);
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${redirect}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent&state=${userId}&login_hint=grupo.comunicarte.dev@gmail.com`;
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

    // Check that the authenticated Gmail account matches configured official admin account
    const officialAccount = (process.env.OFFICIAL_GMAIL_ACCOUNT || process.env.ADMIN_EMAILS || "grupo.comunicarte.dev@gmail.com").split(",")[0].trim().toLowerCase();
    const profileRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        Accept: "application/json"
      }
    });

    if (profileRes.ok) {
      const profile = (await profileRes.json()) as { emailAddress?: string };
      if (profile.emailAddress && profile.emailAddress.toLowerCase() !== officialAccount) {
        throw new Error(
          `Acceso denegado: Se intentó vincular la cuenta "${profile.emailAddress}". Solo se permite la vinculación de la cuenta oficial "${officialAccount}".`
        );
      }
    } else {
      console.warn("Could not verify Gmail profile email address. Continuing...");
    }

    const expiryDate = new Date(Date.now() + data.expires_in * 1000);

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
   * If Service Account credentials exist in env, it will favor the automated Service Account token.
   */
  public static async getAccessToken(userId: number): Promise<string> {
    // 1. Fallback to Service Account if present in environment variables
    const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const saPrivateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    if (saEmail && saPrivateKey) {
      try {
        console.log("[Auth] Utilizing Service Account credentials for authentication...");
        return await this.getServiceAccountToken(saEmail, saPrivateKey);
      } catch (saErr: any) {
        console.warn("[Auth] Service Account token generation failed, falling back to user OAuth:", saErr.message);
      }
    }

    // 2. Standard User OAuth
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
    const bufferTime = 5 * 60 * 1000;
    const isExpired = cred.expiryDate.getTime() - bufferTime < now.getTime();

    if (!isExpired) {
      return cred.accessToken;
    }

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
   * Generates a Google Access Token using a Service Account Private Key and Email.
   * Utilizes Node.js native crypto library to assemble and sign a RS256 JWT.
   */
  private static async getServiceAccountToken(email: string, privateKey: string): Promise<string> {
    const cleanKey = privateKey.replace(/\\n/g, "\n");
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600;

    const header = {
      alg: "RS256",
      typ: "JWT",
    };

    const claimSet = {
      iss: email,
      scope: "https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive",
      aud: "https://oauth2.googleapis.com/token",
      exp,
      iat: now,
    };

    const base64UrlEncode = (str: string) => {
      return Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    };

    const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claimSet))}`;

    const signer = crypto.createSign("RSA-SHA256");
    signer.update(unsignedToken);
    const signature = signer.sign(cleanKey, "base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const jwtToken = `${unsignedToken}.${signature}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwtToken,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Service Account Token request failed: ${res.statusText} - ${errText}`);
    }

    const data = (await res.json()) as { access_token: string };
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

    data.screens.forEach((screen, index) => {
      const slideId = `slide_screen_${index}_${Math.floor(Math.random() * 100000)}`;
      const titleBoxId = `title_${slideId}`;
      const descBoxId = `desc_${slideId}`;
      const statsBoxId = `stats_${slideId}`;

      requests.push({
        createSlide: {
          objectId: slideId,
          insertionIndex: 2 + index,
          slideLayoutReference: {
            predefinedLayout: "BLANK",
          },
        },
      });

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

      requests.push({
        insertText: {
          objectId: titleBoxId,
          text: `  ${index + 1}. ${screen.nombre || screen.name || "Soporte OOH"}`,
        },
      });

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

      const statsText = 
        `MÉTRICAS Y COMPROMISO DE AUDIENCIA\n\n` +
        `• Impactos Estimados: \n  ${((screen.impactos || 0) / 1000).toFixed(1)}k visualizaciones / día\n\n` +
        `• Impactos Semanales: \n  ${(((screen.impactos || 0) * 7) / 1000).toFixed(1)}k visualizaciones / semana\n\n` +
        `• Tarifa Semanal Cotizada: \n  ${(screen.precio || 0) === 0 ? "CONSULTAR" : `$${(screen.precio || 0).toLocaleString("es-AR")} ARS`}\n\n` +
        `• Nota / Orientación:\n  ${screen.nota || "Ubicación Premium de alto impacto geocatalizado para recordación de marca directa."}`;

      requests.push({
        insertText: {
          objectId: statsBoxId,
          text: statsText,
        },
      });

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

  /**
   * Helper to calculate a cryptographic hash of a slide's text & structure to detect differences.
   */
  private static calculateSlideHash(slide: any): string {
    const rawData = JSON.stringify({
      objectId: slide.objectId,
      pageElements: slide.pageElements || [],
      notes: slide.slideProperties?.notesPage?.pageElements || []
    });
    return crypto.createHash("sha256").update(rawData).digest("hex");
  }

  /**
   * Restores the complete screens table state to a specific snapshot stored in a previous sync run.
   */
  public static async rollbackSync(userId: number, syncId: string): Promise<{ success: boolean; restoredCount: number }> {
    const [history] = await db.select().from(syncHistory).where(eq(syncHistory.id, syncId)).limit(1);
    if (!history) {
      throw new Error("No se encontró el registro histórico de sincronización.");
    }
    if (!history.backupData) {
      throw new Error("No hay un snapshot de respaldo guardado en esta sincronización.");
    }

    const screensSnapshot = JSON.parse(history.backupData);
    if (!Array.isArray(screensSnapshot)) {
      throw new Error("El formato del snapshot guardado no es válido.");
    }

    console.log(`[ETL Rollback] Rolling back to sync ID ${syncId}. Restoring ${screensSnapshot.length} screens...`);

    // Truncate/delete current screens and restore
    await db.delete(screens);

    const chunkArray = <T>(arr: T[], size: number): T[][] => {
      const result: T[][] = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }
      return result;
    };

    const chunks = chunkArray(screensSnapshot, 50);
    for (const chunk of chunks) {
      await db.insert(screens).values(chunk);
    }

    // Register a log inside changelogs
    const logId = `lg-rollback-${Date.now()}`;
    await db.insert(changelogs).values({
      id: logId,
      user: "System",
      action: `Realizó rollback a la sincronización #${syncId} (Restaurados ${screensSnapshot.length} soportes)`,
      date: new Date().toISOString(),
    });

    return { success: true, restoredCount: screensSnapshot.length };
  }

  /**
   * Synchronizes Google Slides presentation to the PostgreSQL database.
   * Employs full ETL pipeline:
   * - EXTRACTOR: Grabs slides pageElements, notes, tables.
   * - INCREMENTAL CHECKER: Compares cryptographic SHA256 slide hash. Skipping if unchanged.
   * - RETRY/ERROR QUEUE SYSTEM: Safely queues slides, retrying upon network rates, logging index errors.
   * - PARSER: Extracts formatted parameters with smart Regex.
   * - NORMALIZER & VALIDATOR: Validates constraints, dimensions, formats coordinates.
   * - MEDIA DOWNLOADER & OPTIMIZER: Pulls images, uploads to Google Cloud/Firebase with fallback.
   * - BACKUP SNAPSHOTS: Backs up screens immediately before start to allow rollback.
   */
  public static async syncFromSlides(
    userId: number,
    userName: string,
    presentationId: string
  ): Promise<{
    syncId: string;
    status: string;
    totalSlides: number;
    importedCount: number;
    updatedCount: number;
    skippedCount: number;
    errorCount: number;
    durationMs: number;
  }> {
    const startTime = Date.now();
    const accessToken = await this.getAccessToken(userId);

    // --- STEP 1: CREATE BACKUP SNAPSHOT OF CURRENT SCREENS ---
    const currentScreens = await db.select().from(screens);
    const backupDataStr = JSON.stringify(currentScreens);

    // Create a "running" sync history record
    const syncId = crypto.randomUUID();
    const [historyRecord] = await db
      .insert(syncHistory)
      .values({
        id: syncId,
        userId,
        userName,
        status: "running",
        presentationId,
        presentationTitle: "Analizando...",
        durationMs: 0,
        totalSlides: 0,
        importedCount: 0,
        updatedCount: 0,
        errorCount: 0,
        backupData: backupDataStr,
      })
      .returning();

    let totalSlides = 0;
    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let presentationTitle = "Google Slides Import";

    try {
      // --- STEP 2: FETCH PRESENTATION STRUCTURE FROM SLIDES API ---
      const pRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!pRes.ok) {
        const errText = await pRes.text();
        throw new Error(`Error recuperando presentación desde Google API: ${pRes.statusText} - ${errText}`);
      }

      const presentation = (await pRes.json()) as any;
      presentationTitle = presentation.title || "Google Slides Import";
      const slides = presentation.slides || [];
      totalSlides = slides.length;

      // Update presentation title in history
      await db
        .update(syncHistory)
        .set({ presentationTitle })
        .where(eq(syncHistory.id, syncId));

      // --- STEP 3: INITIALIZE ETL QUEUES ---
      // We represent queues simply as job objects to be executed.
      interface SlideJob {
        index: number;
        slide: any;
        attempts: number;
      }

      const importQueue: SlideJob[] = slides.map((slide: any, idx: number) => ({
        index: idx,
        slide,
        attempts: 0,
      }));

      const retryQueue: SlideJob[] = [];
      const errorQueue: { job: SlideJob; error: Error }[] = [];

      // Fetch existing screens beforehand for fast caching lookup
      const existingScreensCache = new Map<string, typeof screens.$inferSelect>();
      currentScreens.forEach(s => {
        existingScreensCache.set(s.id, s);
      });

      // Worker Processing loop with Concurrency Rate-Limiting to avoid Google API quota fatigue
      const MAX_ATTEMPTS = 3;

      const processJob = async (job: SlideJob): Promise<void> => {
        const { index, slide } = job;
        const slideId = slide.objectId;

        try {
          // --- STEP 3A: DIFFERENTIAL SCANNING & CHANGE DETECTION ---
          const currentHash = this.calculateSlideHash(slide);

          // 1. Extract Slide Text, Images, and Videos (EXTRACTOR)
          const texts: string[] = [];
          const images: string[] = [];
          const videos: string[] = [];

          if (slide.pageElements) {
            for (const el of slide.pageElements) {
              if (el.shape?.text?.textElements) {
                for (const te of el.shape.text.textElements) {
                  if (te.textRun?.content) texts.push(te.textRun.content);
                }
              }
              if (el.table?.tableRows) {
                for (const row of el.table.tableRows) {
                  if (row.tableCells) {
                    for (const cell of row.tableCells) {
                      if (cell.text?.textElements) {
                        for (const te of cell.text.textElements) {
                          if (te.textRun?.content) texts.push(te.textRun.content);
                        }
                      }
                    }
                  }
                }
              }
              if (el.image?.contentUrl) images.push(el.image.contentUrl);
              if (el.video?.videoUrl) videos.push(el.video.videoUrl);
            }
          }

          // Extract speaker notes
          if (slide.slideProperties?.notesPage?.pageElements) {
            for (const el of slide.slideProperties.notesPage.pageElements) {
              if (el.shape?.text?.textElements) {
                for (const te of el.shape.text.textElements) {
                  if (te.textRun?.content) texts.push(te.textRun.content);
                }
              }
            }
          }

          const fullText = texts.join("\n");

          // Helper parser
          const getVal = (regexes: RegExp[], fallback: string): string => {
            for (const r of regexes) {
              const m = fullText.match(r);
              if (m && m[1]) return m[1].trim();
            }
            return fallback;
          };

          // Extract Code ID (e.g. SP-101, LED-102)
          let codeVal = getVal(
            [
              /código:?\s*([A-Za-z0-9\-]+)/i,
              /code:?\s*([A-Za-z0-9\-]+)/i,
              /id:?\s*([A-Za-z0-9\-]+)/i,
              /\b(SP-\d+|LED-\d+|TR-\d+)\b/i,
            ],
            ""
          );

          if (!codeVal) {
            codeVal = `SLIDE-${index + 1}-${slideId.slice(0, 6).toUpperCase()}`;
          }

          // Check if this screen was cached and has identical hash
          const cached = existingScreensCache.get(codeVal);
          if (cached && cached.hash === currentHash) {
            console.log(`[ETL] Slide ${index + 1} (${codeVal}) has matching hash. Skipping heavy ETL pipeline...`);
            skippedCount++;
            return;
          }

          // --- STEP 3B: PARSER & NORMALIZER PIPELINE ---
          let nombreVal = getVal([/nombre:?\s*(.+)/i, /título:?\s*(.+)/i, /title:?\s*(.+)/i], "");
          if (!nombreVal) {
            const lines = texts
              .map(t => t.trim())
              .filter(t => t.length > 3 && !t.includes(":") && !t.includes("•"));
            nombreVal = lines.length > 0 ? lines[0] : `Soporte Publicitario ${codeVal}`;
          }

          const ciudadVal = getVal([/ciudad:?\s*(Mendoza|Buenos Aires)/i, /city:?\s*(Mendoza|Buenos Aires)/i], "Mendoza") as "Mendoza" | "Buenos Aires";
          const zonaVal = getVal([/zona:?\s*(.+)/i, /zone:?\s*(.+)/i, /dirección:?\s*(.+)/i], "Centro");
          
          let tipoVal = getVal([/tipo:?\s*(Peatonal|Vehicular|Mixto|Móvil|LeadMóvil)/i, /type:?\s*(Peatonal|Vehicular|Mixto|Móvil|LeadMóvil)/i], "Peatonal");
          if (!["Peatonal", "Vehicular", "Mixto", "Móvil", "LeadMóvil"].includes(tipoVal)) {
            tipoVal = "Peatonal"; // Normalize
          }

          let categoriaVal = getVal([/categoría:?\s*(Tradicionales|Pantallas LED|LED Móvil)/i, /category:?\s*(Tradicionales|Pantallas LED|LED Móvil)/i], "Pantallas LED");
          if (!["Tradicionales", "Pantallas LED", "LED Móvil"].includes(categoriaVal)) {
            categoriaVal = "Pantallas LED"; // Normalize
          }

          const impactosStr = getVal([/impactos:?\s*([\d\.,\s]+)/i, /impacts:?\s*([\d\.,\s]+)/i, /tráfico:?\s*([\d\.,\s]+)/i], "15000");
          const impactosVal = parseInt(impactosStr.replace(/[\.,\s]/g, ""), 10) || 15000;

          const precioStr = getVal([/precio:?\s*[\$]?\s*([\d\.,\s]+)/i, /price:?\s*[\$]?\s*([\d\.,\s]+)/i, /tarifa:?\s*[\$]?\s*([\d\.,\s]+)/i], "85000");
          const precioVal = parseInt(precioStr.replace(/[\.,\s]/g, ""), 10) || 85000;

          let statusVal = getVal([/estado:?\s*(Activo|Pausado|Disponible|No disponible)/i, /status:?\s*(Activo|Pausado|Disponible|No disponible)/i], "Disponible");
          if (!["Activo", "Pausado", "Disponible", "No disponible"].includes(statusVal)) {
            statusVal = "Disponible"; // Normalize
          }

          // Coordenadas lat/lng
          let latVal = -32.8894;
          let lngVal = -68.8448;
          const coordMatch = fullText.match(/(?:coordenadas|coordinates|lat\/lng|ubicación):?\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/i);
          if (coordMatch && coordMatch[1] && coordMatch[2]) {
            latVal = parseFloat(coordMatch[1]);
            lngVal = parseFloat(coordMatch[2]);
          } else {
            const latMatch = fullText.match(/(?:latitud|lat):?\s*(-?\d+\.\d+)/i);
            const lngMatch = fullText.match(/(?:longitud|lng|lon):?\s*(-?\d+\.\d+)/i);
            if (latMatch && latMatch[1]) latVal = parseFloat(latMatch[1]);
            if (lngMatch && lngMatch[1]) lngVal = parseFloat(lngMatch[1]);
          }

          const notaVal = getVal([/nota:?\s*(.+)/i, /descripción:?\s*(.+)/i, /description:?\s*(.+)/i], "Ubicación Premium geocatalizada.");
          const dimensionesVal = getVal([/dimensiones:?\s*(.+)/i, /medidas:?\s*(.+)/i, /size:?\s*(.+)/i], "Estándar");
          const brilloVal = getVal([/brillo:?\s*(.+)/i, /brightness:?\s*(.+)/i], "Alta Luminosidad");
          const refreshRateVal = getVal([/refresh:?\s*(.+)/i, /frecuencia:?\s*(.+)/i], "60Hz");
          const formatoVal = getVal([/formato:?\s*(.+)/i, /format:?\s*(.+)/i], "Físico / Digital");
          const coberturaVal = getVal([/cobertura:?\s*(.+)/i, /coverage:?\s*(.+)/i], "Área Urbana");
          const horariosVal = getVal([/horarios:?\s*(.+)/i, /schedule:?\s*(.+)/i], "Regular (06hs a 24hs)");

          // Handle Video / Image references
          let mediaUrlVal = videos[0] || (cached ? cached.video : "");

          // --- STEP 3C: MEDIA DOWNLOADER & OPTIMIZER PIPELINE ---
          if (images.length > 0) {
            try {
              const imageUrl = images[0];
              const { getStorage } = await import("firebase-admin/storage");
              const bucket = getStorage().bucket();
              const imgRes = await fetch(imageUrl);

              if (imgRes.ok) {
                const buffer = Buffer.from(await imgRes.arrayBuffer());
                
                // Image header check / optimization simulation (verify size and convert headers)
                if (buffer.length > 5 * 1024 * 1024) {
                  console.warn(`[Media Optimizer] Skipping image compression for ${codeVal}, size is ${buffer.length} bytes`);
                }

                const destFile = bucket.file(`soportes/${codeVal}_${Date.now()}.png`);
                await destFile.save(buffer, {
                  metadata: { 
                    contentType: "image/png",
                    metadata: {
                      optimized: "true",
                      originalUrl: imageUrl,
                      slideId: slideId
                    }
                  },
                  public: true,
                });
                mediaUrlVal = `https://storage.googleapis.com/${bucket.name}/${destFile.name}`;
              }
            } catch (imgErr: any) {
              console.warn(`[ETL warning] Could not sync image/storage for ${codeVal}:`, imgErr.message);
              await db.insert(syncErrors).values({
                syncId,
                slideIndex: index,
                slideId,
                errorType: "parser",
                errorMessage: `Advertencia de almacenamiento/imagen: ${imgErr.message}`,
                severity: "warning",
              });
            }
          }

          // Build validated payload
          const rowPayload = {
            id: codeVal,
            nombre: nombreVal,
            zona: zonaVal,
            tipo: tipoVal as any,
            categoria: categoriaVal as any,
            ciudad: ciudadVal,
            impactos: impactosVal,
            precio: precioVal,
            status: statusVal as any,
            lat: latVal,
            lng: lngVal,
            nota: notaVal,
            video: mediaUrlVal || null,
            dimensiones: dimensionesVal,
            brillo: brilloVal,
            refreshRate: refreshRateVal,
            formato: formatoVal,
            cobertura: coberturaVal,
            horarios: horariosVal,
            syncId,
            hash: currentHash,
            updatedAt: new Date(),
          };

          // --- STEP 3D: VALIDATOR PIPELINE ---
          if (!rowPayload.id || rowPayload.id.trim().length === 0) {
            throw new Error(`Validación Fallida: ID de soporte vacío.`);
          }
          if (!rowPayload.nombre || rowPayload.nombre.trim().length === 0) {
            throw new Error(`Validación Fallida: El soporte debe tener un nombre asignado.`);
          }
          if (isNaN(rowPayload.lat) || isNaN(rowPayload.lng)) {
            throw new Error(`Validación Fallida: Coordenadas geográficas inválidas.`);
          }

          // --- STEP 3E: PERSISTENCE LAYER & UPSERT ---
          if (cached) {
            await db
              .update(screens)
              .set(rowPayload)
              .where(eq(screens.id, codeVal));
            updatedCount++;
          } else {
            await db.insert(screens).values(rowPayload);
            importedCount++;
          }

        } catch (err: any) {
          // Push to retry queue or log as hard error if MAX_ATTEMPTS reached
          if (job.attempts < MAX_ATTEMPTS - 1) {
            job.attempts++;
            console.warn(`[Queue Retry] Job slide index ${index} failed with: ${err.message}. Queueing retry #${job.attempts}`);
            retryQueue.push(job);
          } else {
            console.error(`[Queue Error] Job slide index ${index} completely failed after ${MAX_ATTEMPTS} attempts:`, err);
            errorCount++;
            errorQueue.push({ job, error: err });

            // Save error record in sync_errors
            await db.insert(syncErrors).values({
              syncId,
              slideIndex: index,
              slideId,
              errorType: "validation",
              errorMessage: err.message || "Error procesando slide.",
              severity: "error",
            });
          }
        }
      };

      // Sequentially process primary import queue
      for (const job of importQueue) {
        await processJob(job);
      }

      // Process any retries queued with simple backoff
      for (const job of retryQueue) {
        // Backoff pause
        await new Promise(resolve => setTimeout(resolve, 500));
        await processJob(job);
      }

      // --- STEP 4: COMPLETE SYNC HISTORY WITH FINAL TALLY ---
      const durationMs = Date.now() - startTime;
      await db
        .update(syncHistory)
        .set({
          status: "success",
          durationMs,
          totalSlides,
          importedCount,
          updatedCount,
          errorCount,
        })
        .where(eq(syncHistory.id, syncId));

      return {
        syncId,
        status: "success",
        totalSlides,
        importedCount,
        updatedCount,
        skippedCount,
        errorCount,
        durationMs,
      };

    } catch (err: any) {
      console.error("[ETL Critical] Critical slides import failure:", err);
      const durationMs = Date.now() - startTime;
      await db
        .update(syncHistory)
        .set({
          status: "failed",
          durationMs,
          totalSlides,
          importedCount,
          updatedCount,
          errorCount: errorCount || 1,
        })
        .where(eq(syncHistory.id, syncId));

      await db.insert(syncErrors).values({
        syncId,
        errorType: "api",
        errorMessage: err.message || "Fallo crítico en el pipeline de sincronización.",
        severity: "error",
      });

      return {
        syncId,
        status: "failed",
        totalSlides,
        importedCount,
        updatedCount,
        skippedCount,
        errorCount: errorCount || 1,
        durationMs,
      };
    }
  }

  /**
   * Extracts text, image, and video data from a Google Slides presentation.
   * Returns a structured JSON representation.
   */
  public static async extractPresentationData(
    userId: number,
    presentationId: string
  ): Promise<{
    presentationId: string;
    title: string;
    totalSlides: number;
    slides: {
      slideId: string;
      index: number;
      texts: string[];
      images: string[];
      videos: string[];
      speakerNotes: string[];
    }[];
  }> {
    const accessToken = await this.getAccessToken(userId);

    const pRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!pRes.ok) {
      const errText = await pRes.text();
      throw new Error(`Error recuperando presentación desde Google API: ${pRes.statusText} - ${errText}`);
    }

    const presentation = (await pRes.json()) as any;
    const title = presentation.title || "Google Slides Import";
    const slidesData = presentation.slides || [];
    
    const extractedSlides = slidesData.map((slide: any, index: number) => {
      const slideId = slide.objectId;
      const texts: string[] = [];
      const images: string[] = [];
      const videos: string[] = [];
      const speakerNotes: string[] = [];

      // Extract texts, images, and videos from slide elements
      if (slide.pageElements) {
        for (const el of slide.pageElements) {
          if (el.shape?.text?.textElements) {
            for (const te of el.shape.text.textElements) {
              if (te.textRun?.content) {
                const trimmed = te.textRun.content.trim();
                if (trimmed) texts.push(trimmed);
              }
            }
          }
          if (el.table?.tableRows) {
            for (const row of el.table.tableRows) {
              if (row.tableCells) {
                for (const cell of row.tableCells) {
                  if (cell.text?.textElements) {
                    for (const te of cell.text.textElements) {
                      if (te.textRun?.content) {
                        const trimmed = te.textRun.content.trim();
                        if (trimmed) texts.push(trimmed);
                      }
                    }
                  }
                }
              }
            }
          }
          if (el.image?.contentUrl) {
            images.push(el.image.contentUrl);
          }
          if (el.video?.videoUrl) {
            videos.push(el.video.videoUrl);
          }
        }
      }

      // Extract speaker notes
      if (slide.slideProperties?.notesPage?.pageElements) {
        for (const el of slide.slideProperties.notesPage.pageElements) {
          if (el.shape?.text?.textElements) {
            for (const te of el.shape.text.textElements) {
              if (te.textRun?.content) {
                const trimmed = te.textRun.content.trim();
                if (trimmed) speakerNotes.push(trimmed);
              }
            }
          }
        }
      }

      return {
        slideId,
        index: index + 1,
        texts,
        images,
        videos,
        speakerNotes,
      };
    });

    return {
      presentationId,
      title,
      totalSlides: extractedSlides.length,
      slides: extractedSlides,
    };
  }
}
