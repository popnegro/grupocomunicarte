import { useState, useCallback } from "react";
import { useAuth } from "../components/AuthContext";
import { safeFetchJson } from "../lib/apiClient";

export interface GooglePickerSelectedFile {
  id: string;
  name: string;
  description?: string;
  mimeType: string;
  url?: string;
  iconUrl?: string;
}

export interface UseGooglePickerOptions {
  mimeTypes?: string[];
  viewId?: "PRESENTATIONS" | "DOCS" | "SPREADSHEETS" | "FOLDERS" | "ALL";
  multiselect?: boolean;
  onSelect?: (files: GooglePickerSelectedFile[]) => void;
}

export function useGooglePicker(defaultOptions: UseGooglePickerOptions = {}) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGapi = useCallback(async (): Promise<any> => {
    if ((window as any).gapi) {
      return (window as any).gapi;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if ((window as any).gapi) {
          resolve((window as any).gapi);
        } else {
          reject(new Error("GAPI no disponible tras cargar script."));
        }
      };
      script.onerror = () => reject(new Error("Error al cargar la librería de Google API (apis.google.com)."));
      document.body.appendChild(script);
    });
  }, []);

  const openPicker = useCallback(
    async (overrideOptions?: UseGooglePickerOptions) => {
      const opts = { ...defaultOptions, ...overrideOptions };
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          throw new Error("Debes iniciar sesión para acceder a Google Drive.");
        }

        // 1. Fetch Google Access Token from server
        const res = await safeFetchJson<{ success: boolean; accessToken?: string; clientId?: string; error?: string }>("/api/auth/google/token", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok || !res.data?.success || !res.data?.accessToken) {
          // Check if we can get an OAuth authorization URL to assist the user directly
          const urlRes = await safeFetchJson<{ success: boolean; url?: string }>("/api/auth/google/url", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (urlRes.data?.success && urlRes.data?.url) {
            const authWin = window.open(urlRes.data.url, "google_oauth_popup", "width=600,height=700");
            if (!authWin) {
              throw new Error("Por favor habilita las ventanas emergentes (popups) para conectar tu cuenta de Google.");
            }
            throw new Error("Se ha abierto una ventana para autorizar el acceso a Google Drive. Por favor completa la autorización y vuelve a intentar.");
          }

          throw new Error(
            res.data?.error || res.error || "No se pudo obtener el token de acceso de Google. Asegúrate de haber vinculado tu cuenta de Google."
          );
        }

        const accessToken = res.data.accessToken;
        const clientId = res.data.clientId;

        // 2. Load gapi client
        const gapi = await loadGapi();

        // 3. Load the picker module
        await new Promise<void>((resolve) => {
          gapi.load("picker", {
            callback: () => resolve(),
          });
        });

        const google = (window as any).google;
        if (!google || !google.picker) {
          throw new Error("Google Picker API no se pudo inicializar.");
        }

        // 4. Resolve picker view
        let viewId = google.picker.ViewId.DOCS;
        if (opts.viewId === "PRESENTATIONS") {
          viewId = google.picker.ViewId.PRESENTATIONS;
        } else if (opts.viewId === "SPREADSHEETS") {
          viewId = google.picker.ViewId.SPREADSHEETS;
        } else if (opts.viewId === "FOLDERS") {
          viewId = google.picker.ViewId.FOLDERS;
        }

        const view = new google.picker.DocsView(viewId);
        if (opts.mimeTypes && opts.mimeTypes.length > 0) {
          view.setMimeTypes(opts.mimeTypes.join(","));
        } else if (opts.viewId === "PRESENTATIONS") {
          view.setMimeTypes("application/vnd.google-apps.presentation");
        }

        // 5. Origin resolution for safe iframe / cross-origin handling
        const pickerOrigin =
          window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
            ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
            : window.location.origin;

        const builder = new google.picker.PickerBuilder()
          .addView(view)
          .setOAuthToken(accessToken)
          .setOrigin(pickerOrigin);

        if (clientId) {
          builder.setAppId(clientId);
        }

        builder.setCallback((pickerData: any) => {
            if (
              pickerData &&
              pickerData.action === google.picker.Action.PICKED
            ) {
              const docs: GooglePickerSelectedFile[] = (pickerData.docs || []).map(
                (doc: any) => ({
                  id: doc.id,
                  name: doc.name || doc.title,
                  description: doc.description,
                  mimeType: doc.mimeType,
                  url: doc.url,
                  iconUrl: doc.iconUrl,
                })
              );

              if (docs.length > 0 && opts.onSelect) {
                opts.onSelect(docs);
              }
            }
          });

        if (opts.multiselect) {
          builder.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
        }

        const picker = builder.build();
        picker.setVisible(true);
      } catch (err: any) {
        const msg = err.message || "Error al abrir el selector de Google Drive.";
        setError(msg);
        console.error("useGooglePicker Error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, defaultOptions, loadGapi]
  );

  return {
    openPicker,
    loading,
    error,
  };
}
