import { safeFetchJson } from "./apiClient";

export interface GooglePickerDocument {
  id: string;
  name: string;
  description?: string;
  mimeType: string;
  url?: string;
  iconUrl?: string;
  lastEditedUtc?: number;
}

export interface GooglePickerConfig {
  accessToken: string;
  clientId?: string;
  viewId?: "PRESENTATIONS" | "DOCS" | "SPREADSHEETS" | "FOLDERS" | "ALL";
  mimeTypes?: string[];
  multiselect?: boolean;
  title?: string;
  onSelect?: (documents: GooglePickerDocument[]) => void;
  onCancel?: () => void;
}

export interface PresentationTemplateOptions {
  authToken?: string;
  title?: string;
  multiselect?: boolean;
  onSelect?: (templates: GooglePickerDocument[]) => void;
  onCancel?: () => void;
}

/**
 * Ensures Google API JS script (https://apis.google.com/js/api.js) is loaded
 * and initializes the google.picker library.
 */
export async function loadGooglePickerScript(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("Google Picker solo se puede ejecutar en un entorno de navegador.");
  }

  // If gapi and picker are already present
  if ((window as any).google && (window as any).google.picker) {
    return (window as any).google;
  }

  // Load gapi script if not present
  if (!(window as any).gapi) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Error al cargar la librería de Google API (apis.google.com)."));
      document.body.appendChild(script);
    });
  }

  const gapi = (window as any).gapi;
  if (!gapi) {
    throw new Error("No se pudo instanciar Google API client.");
  }

  // Load the picker module
  await new Promise<void>((resolve) => {
    gapi.load("picker", {
      callback: () => resolve(),
    });
  });

  const google = (window as any).google;
  if (!google || !google.picker) {
    throw new Error("No se pudo cargar la librería Google Picker.");
  }

  return google;
}

/**
 * Fetches Google OAuth Access Token for Google Drive scopes from server endpoint.
 */
export async function fetchGoogleDriveToken(authToken?: string): Promise<{ accessToken: string; clientId?: string }> {
  const headers: Record<string, string> = {};
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await safeFetchJson<{ success: boolean; accessToken?: string; clientId?: string; error?: string }>(
    "/api/auth/google/token",
    { headers }
  );

  if (!res.ok || !res.data?.success || !res.data?.accessToken) {
    // Attempt to retrieve authorization URL for user consent
    const urlRes = await safeFetchJson<{ success: boolean; url?: string }>("/api/auth/google/url", { headers });

    if (urlRes.data?.success && urlRes.data?.url) {
      const authWin = window.open(urlRes.data.url, "google_oauth_popup", "width=600,height=700");
      if (!authWin) {
        throw new Error("Por favor habilita las ventanas emergentes (popups) para conectar tu cuenta de Google Drive.");
      }
      throw new Error(
        "Se ha abierto una ventana emergente para autorizar el acceso a Google Drive. Por favor completa la autorización y vuelve a intentar."
      );
    }

    throw new Error(
      res.data?.error || res.error || "No se pudo obtener el token de acceso de Google. Asegúrate de conectar tu cuenta de Google Workspace."
    );
  }

  return {
    accessToken: res.data.accessToken,
    clientId: res.data.clientId,
  };
}

/**
 * Opens Google Picker configured for selecting files from Google Drive.
 */
export async function openGooglePicker(config: GooglePickerConfig): Promise<void> {
  const google = await loadGooglePickerScript();

  let viewId = google.picker.ViewId.DOCS;
  if (config.viewId === "PRESENTATIONS") {
    viewId = google.picker.ViewId.PRESENTATIONS;
  } else if (config.viewId === "SPREADSHEETS") {
    viewId = google.picker.ViewId.SPREADSHEETS;
  } else if (config.viewId === "FOLDERS") {
    viewId = google.picker.ViewId.FOLDERS;
  }

  const view = new google.picker.DocsView(viewId);

  if (config.mimeTypes && config.mimeTypes.length > 0) {
    view.setMimeTypes(config.mimeTypes.join(","));
  } else if (config.viewId === "PRESENTATIONS") {
    view.setMimeTypes("application/vnd.google-apps.presentation");
  }

  const pickerOrigin =
    typeof window !== "undefined" && window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
      ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
      : window.location.origin;

  const builder = new google.picker.PickerBuilder()
    .addView(view)
    .setOAuthToken(config.accessToken)
    .setOrigin(pickerOrigin);

  if (config.clientId) {
    builder.setAppId(config.clientId);
  }

  if (config.title) {
    builder.setTitle(config.title);
  }

  if (config.multiselect) {
    builder.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
  }

  builder.setCallback((data: any) => {
    if (data.action === google.picker.Action.PICKED) {
      const documents: GooglePickerDocument[] = (data.docs || []).map((doc: any) => ({
        id: doc.id,
        name: doc.name || doc.title,
        description: doc.description,
        mimeType: doc.mimeType,
        url: doc.url,
        iconUrl: doc.iconUrl,
        lastEditedUtc: doc.lastEditedUtc,
      }));

      if (config.onSelect) {
        config.onSelect(documents);
      }
    } else if (data.action === google.picker.Action.CANCEL) {
      if (config.onCancel) {
        config.onCancel();
      }
    }
  });

  const picker = builder.build();
  picker.setVisible(true);
}

/**
 * Primary export helper requested for loading and triggering Google Picker
 * in the Dashboard for proposal templates and media kits.
 */
export async function loadPicker(options: PresentationTemplateOptions = {}): Promise<GooglePickerDocument[]> {
  return selectPresentationTemplate(options);
}

/**
 * High-level helper for selecting Google Slides presentation templates
 * in the Dashboard proposal and media kit generation flow.
 */
export async function selectPresentationTemplate(options: PresentationTemplateOptions = {}): Promise<GooglePickerDocument[]> {
  const { accessToken, clientId } = await fetchGoogleDriveToken(options.authToken);

  return new Promise((resolve, reject) => {
    openGooglePicker({
      accessToken,
      clientId,
      viewId: "PRESENTATIONS",
      mimeTypes: ["application/vnd.google-apps.presentation"],
      multiselect: options.multiselect ?? false,
      title: options.title || "Seleccionar Plantilla de Presentación (Google Slides)",
      onSelect: (documents) => {
        if (options.onSelect) {
          options.onSelect(documents);
        }
        resolve(documents);
      },
      onCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
        resolve([]);
      },
    }).catch(reject);
  });
}
