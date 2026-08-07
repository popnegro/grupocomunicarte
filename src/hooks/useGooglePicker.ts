import { useState, useCallback } from "react";
import { useAuth } from "../components/AuthContext";
import {
  fetchGoogleDriveToken,
  openGooglePicker,
  GooglePickerDocument,
} from "../lib/google-picker";

export type GooglePickerSelectedFile = GooglePickerDocument;

export interface UseGooglePickerOptions {
  mimeTypes?: string[];
  viewId?: "PRESENTATIONS" | "DOCS" | "SPREADSHEETS" | "FOLDERS" | "ALL";
  multiselect?: boolean;
  title?: string;
  onSelect?: (files: GooglePickerSelectedFile[]) => void;
}

export function useGooglePicker(defaultOptions: UseGooglePickerOptions = {}) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPicker = useCallback(
    async (overrideOptions?: UseGooglePickerOptions) => {
      const opts = { ...defaultOptions, ...overrideOptions };
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          throw new Error("Debes iniciar sesión para acceder a Google Drive.");
        }

        const { accessToken, clientId } = await fetchGoogleDriveToken(token || undefined);

        await openGooglePicker({
          accessToken,
          clientId,
          viewId: opts.viewId,
          mimeTypes: opts.mimeTypes,
          multiselect: opts.multiselect,
          title: opts.title,
          onSelect: (docs) => {
            if (opts.onSelect) {
              opts.onSelect(docs);
            }
          },
        });
      } catch (err: any) {
        const msg = err.message || "Error al abrir el selector de Google Drive.";
        setError(msg);
        console.error("useGooglePicker Error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, defaultOptions]
  );

  return {
    openPicker,
    loading,
    error,
  };
}

