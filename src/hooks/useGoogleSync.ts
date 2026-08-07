import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { safeFetchJson } from "../lib/apiClient";

interface SyncRun {
  id: number;
  userName: string;
  status: "success" | "failed" | "running";
  durationMs: number;
  totalSlides: number;
  importedCount: number;
  updatedCount: number;
  errorCount: number;
  presentationId: string;
  presentationTitle: string;
  backupData?: string | null;
  createdAt: string;
}

interface SyncError {
  id: number;
  syncId: number;
  slideIndex: number;
  slideId: string;
  errorType: "validation" | "api" | "parser";
  errorMessage: string;
  severity: "error" | "warning";
  createdAt: string;
}

export const useGoogleSync = (token: string | null) => {
  const { toast } = useToast();
  const [presentationId, setPresentationIdState] = useState<string>(() => {
    return localStorage.getItem("grupocomunicarte_presentation_id") || "1A0z-76v9D_SIn70HwX8a0WzH1Gv8eK4O3xM9_XXXX";
  });
  const [googleConnected, setGoogleConnected] = useState<boolean | null>(null);
  const [authUrl, setAuthUrl] = useState<string>("");
  const [syncHistory, setSyncHistory] = useState<SyncRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<number | null>(null);
  const [selectedRunErrors, setSelectedRunErrors] = useState<SyncError[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState(0);
  const [rollingBackId, setRollingBackId] = useState<number | null>(null);

  const fetchAuthUrl = useCallback(async () => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; url?: string }>("/api/auth/google/url", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.data?.success && res.data?.url) {
        setAuthUrl(res.data.url);
      }
    } catch (err) { /* Ignored gracefully */ }
  }, [token]);

  const checkGoogleConnection = useCallback(async () => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; connected?: boolean }>("/api/auth/google/status", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.data?.success && res.data?.connected) {
        setGoogleConnected(true);
      } else {
        setGoogleConnected(false);
        fetchAuthUrl();
      }
    } catch (err) {
      setGoogleConnected(false);
    }
  }, [token, fetchAuthUrl]);

  const fetchSyncHistory = useCallback(async () => {
    if (!token) return;
    setLoadingHistory(true);
    try {
      const res = await safeFetchJson<{ success: boolean; data: SyncRun[] }>("/api/sync/history", {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSyncHistory(res.data.data);
      }
    } catch (err) { /* Ignored gracefully */ } 
    finally {
      setLoadingHistory(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSyncHistory();
    if (token) {
      checkGoogleConnection();
    }
  }, [token, fetchSyncHistory, checkGoogleConnection]);

  const setPresentationId = (val: string) => {
    setPresentationIdState(val);
    localStorage.setItem("grupocomunicarte_presentation_id", val);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (syncing) {
      interval = setInterval(() => setSyncTime((t) => t + 1), 1000);
    } else {
      setSyncTime(0);
    }
    return () => clearInterval(interval);
  }, [syncing]);

  const handleStartSync = useCallback(async (onSuccess: () => void) => {
    if (!token || !presentationId || presentationId.trim().length < 15 || presentationId.includes("XXXX")) {
      toast.error("Por favor ingresa un ID válido de presentación de Google Slides.", "Error de Parámetro");
      return;
    }
    setSyncing(true);
    toast.info("Conectando con Google Slides API y extrayendo metadatos...", "Sincronización Iniciada");
    try {
      const res = await safeFetchJson<{ success: boolean; data?: any; error?: string }>("/api/sync", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ presentationId: presentationId.trim() })
      });
      if (res.data?.success) {
        const { totalSlides = 0, importedCount = 0, updatedCount = 0, errorCount = 0 } = res.data.data || {};
        const skipped = Math.max(0, totalSlides - importedCount - updatedCount - errorCount);
        toast.success(`Procesado: ${importedCount} creados, ${updatedCount} actualizados, ${skipped} omitidos, ${errorCount} errores.`, "Sincronización Completa");
        onSuccess();
        fetchSyncHistory();
      } else {
        toast.error(res.data?.error || res.error || "Ocurrió un error en el canal de sincronización.", "Fallo de Importación");
        fetchSyncHistory();
      }
    } catch (err: any) {
      toast.error(err.message || "No se pudo contactar al servidor de sincronización.", "Error de Conexión");
    } finally {
      setSyncing(false);
    }
  }, [token, presentationId, toast, fetchSyncHistory]);

  const handleRollback = useCallback(async (syncId: number, onSuccess: () => void) => {
    if (!token) return;
    setRollingBackId(syncId);
    toast.info("Restaurando snapshot de base de datos...", "Rollback en Proceso");
    try {
      const res = await safeFetchJson<{ success: boolean; data?: { restoredCount: number }; error?: string }>("/api/sync/rollback", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ syncId })
      });
      if (res.data?.success) {
        toast.success(`Rollback exitoso. Se restauraron ${res.data.data?.restoredCount ?? 0} soportes.`, "Rollback Exitoso");
        onSuccess();
        fetchSyncHistory();
        setSelectedRun(null);
      } else {
        toast.error(res.data?.error || res.error || "No se pudo realizar el rollback.", "Error de Rollback");
      }
    } catch (err: any) {
      toast.error(err.message || "Fallo al conectar con el servidor para ejecutar rollback.", "Error de Conexión");
    } finally {
      setRollingBackId(null);
    }
  }, [token, toast, fetchSyncHistory]);

  const handleToggleRun = useCallback(async (runId: number) => {
    if (selectedRun === runId) {
      setSelectedRun(null);
      setSelectedRunErrors([]);
      return;
    }
    setSelectedRun(runId);
    setSelectedRunErrors([]);
    try {
      const res = await safeFetchJson<{ success: boolean; data: SyncError[] }>(`/api/sync/errors/${runId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSelectedRunErrors(res.data.data);
      }
    } catch (err) { /* Ignored */ }
  }, [token, selectedRun]);

  return {
    presentationId, setPresentationId, googleConnected, authUrl, syncHistory, selectedRun,
    selectedRunErrors, loadingHistory, syncing, syncTime, rollingBackId,
    handleStartSync, handleRollback, handleToggleRun, checkGoogleConnection, fetchSyncHistory
  };
};