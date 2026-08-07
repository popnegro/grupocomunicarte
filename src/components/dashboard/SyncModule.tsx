import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useToast } from "../ui/Toast";
import { safeFetchJson } from "../../lib/apiClient";
import { RefreshCw, CheckCircle, AlertTriangle, Loader, ExternalLink, Lock, Info, History } from "lucide-react";

interface SyncResult {
  syncId: number;
  status: string;
  totalSlides: number;
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
  durationMs: number;
}

interface SyncHistoryEntry {
  id: number;
  userName: string;
  status: 'success' | 'failed' | 'running';
  presentationTitle: string;
  totalSlides: number;
  importedCount: number;
  updatedCount: number;
  errorCount: number;
  durationMs: number;
  createdAt: string;
}

export const SyncModule: React.FC = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  const [connected, setConnected] = useState<boolean | null>(null);
  const [authUrl, setAuthUrl] = useState<string>("");
  const [connecting, setConnecting] = useState(false);

  const [presentationId, setPresentationId] = useState(process.env.GOOGLE_SLIDES_TEMPLATE_ID || "");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [history, setHistory] = useState<SyncHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const checkConnection = async () => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; connected?: boolean }>("/api/auth/google/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && res.data.connected) {
        setConnected(true);
      } else {
        setConnected(false);
        fetchAuthUrl();
      }
    } catch (err) {
      setConnected(false);
    }
  };

  const fetchAuthUrl = async () => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; url?: string }>("/api/auth/google/url", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && res.data.url) {
        setAuthUrl(res.data.url);
      }
    } catch (err) {
      toast.error("No se pudo obtener la URL de autorización de Google.");
    }
  };

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!presentationId || !token) {
      toast.error("Por favor, introduce un ID de presentación de Google Slides.");
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);
    fetchHistory(); // Refresh history after sync

    try {
      const res = await safeFetchJson<{ success: boolean; data?: SyncResult; error?: { message: string } }>("/api/sync/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ presentationId }),
      });

      if (res.data?.success && res.data.data) {
        setSyncResult(res.data.data);
        toast.success("Sincronización completada con éxito.");
      } else {
        throw new Error(res.data?.error?.message || "Ocurrió un error durante la sincronización.");
      }
    } catch (err: any) {
      toast.error(err.message || "Fallo en la sincronización.");
      setSyncResult({ status: 'failed' } as SyncResult);
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchHistory = async () => {
    if (!token) return;
    setLoadingHistory(true);
    try {
      const res = await safeFetchJson<{ success: boolean; data?: SyncHistoryEntry[] }>("/api/sync/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && res.data.data) {
        setHistory(res.data.data);
      }
    } catch (err) {
      toast.error("No se pudo cargar el historial de sincronizaciones.");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (token) {
      checkConnection();
      fetchHistory();
    }
  }, [token]);

  if (connected === null) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center font-sans">
        <Loader className="h-8 w-8 animate-spin text-[#06434a]" />
        <p className="mt-3 text-xs font-bold text-stone-500 uppercase tracking-widest">Verificando conexión con Google...</p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6 font-sans text-center">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-8 shadow-xs space-y-5">
          <div className="mx-auto h-12 w-12 rounded-full bg-stone-50 border border-stone-150 flex items-center justify-center text-[#06434a]">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">Vincular Cuenta de Google</h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
              Para sincronizar el inventario desde Google Slides, primero debes autorizar el acceso seguro a tu cuenta de Google.
            </p>
          </div>
          {authUrl && (
            <a
              href={authUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setConnecting(true)}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider text-white bg-[#06434a] hover:bg-[#05353b] rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              {connecting ? "Esperando Autorización..." : "Conectar con Google"}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 font-sans">
      <div className="bg-white border border-stone-200/80 rounded-2xl p-8 shadow-xs space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Sincronizar Inventario desde Google Slides</h2>
          <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
            Introduce el ID de tu presentación de Google Slides para importar o actualizar el catálogo de soportes publicitarios.
          </p>
        </div>

        <form onSubmit={handleSync} className="space-y-4">
          <div>
            <label htmlFor="presentationId" className="block text-xs font-bold text-stone-600 mb-1">ID de la Presentación de Google Slides</label>
            <input
              id="presentationId"
              type="text"
              value={presentationId}
              onChange={(e) => setPresentationId(e.target.value)}
              placeholder="Ej: 1gA...yZ0"
              className="w-full px-4 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06434a]/20"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#06434a] hover:bg-[#05353b] rounded-lg transition-all shadow-sm disabled:bg-stone-400"
          >
            {isSyncing ? <Loader className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
            {isSyncing ? "Sincronizando..." : "Iniciar Sincronización"}
          </button>
        </form>

        {syncResult && (
          <div className="mt-6 p-4 border-t border-stone-200 space-y-3 text-xs">
            <h4 className="font-bold text-sm text-stone-800">Resultado de la Sincronización</h4>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${syncResult.status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
              {syncResult.status === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              <span className="font-bold">Estado: {syncResult.status === 'success' ? 'Completada' : 'Fallida'}</span>
            </div>
            <ul className="space-y-1">
              <li><strong>Diapositivas Totales:</strong> {syncResult.totalSlides}</li>
              <li><strong>Nuevos Soportes Importados:</strong> {syncResult.importedCount}</li>
              <li><strong>Soportes Actualizados:</strong> {syncResult.updatedCount}</li>
              <li><strong>Soportes sin Cambios (Omitidos):</strong> {syncResult.skippedCount}</li>
              <li><strong>Errores Encontrados:</strong> {syncResult.errorCount}</li>
              <li><strong>Duración:</strong> {(syncResult.durationMs / 1000).toFixed(2)} segundos</li>
            </ul>
          </div>
        )}

        {/* Sync History Table */}
        <div className="mt-8 pt-6 border-t border-stone-200 space-y-4">
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <History className="h-4 w-4" />
            Historial de Sincronizaciones
          </h3>
          <div className="overflow-x-auto border border-stone-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-[9px]">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Usuario</th>
                  <th className="p-3">Presentación</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-center">Registros</th>
                  <th className="p-3 text-center">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loadingHistory ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400">
                      <Loader className="h-6 w-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400 font-medium">
                      No hay sincronizaciones registradas.
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-medium text-stone-600">{new Date(item.createdAt).toLocaleString('es-AR')}</td>
                      <td className="p-3 font-bold text-stone-800">{item.userName}</td>
                      <td className="p-3 text-stone-600 truncate max-w-xs">{item.presentationTitle}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                          item.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status === 'success' ? 'Éxito' : item.status === 'failed' ? 'Fallida' : 'En Curso'}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono text-stone-700">{item.importedCount + item.updatedCount} / {item.totalSlides}</td>
                      <td className="p-3 text-center font-mono text-stone-500">{(item.durationMs / 1000).toFixed(1)}s</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};