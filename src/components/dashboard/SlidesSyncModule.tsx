import React, { useState, useEffect } from "react";
import { 
  Play, RefreshCw, AlertCircle, CheckCircle2, Clock, 
  FileText, ArrowDownToLine, ExternalLink, 
  ChevronDown, ChevronUp, Database, AlertTriangle, ArrowRight,
  FolderOpen
} from "lucide-react";
import { useToast } from "../ui/Toast";
import { API_ROUTES } from "../../lib/apiRoutes";
import { GooglePickerButton } from "./GooglePickerButton";
import { safeFetchJson } from "../../lib/apiClient";

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

interface SlidesSyncModuleProps {
  token: string | null;
  onRefreshInventory: () => void;
}

export const SlidesSyncModule: React.FC<SlidesSyncModuleProps> = ({ token, onRefreshInventory }) => {
  const { toast } = useToast();
  const [presentationId, setPresentationId] = useState<string>(() => {
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

  // Check Google account connection status
  const checkGoogleConnection = async () => {
    if (!token) return;
    try { // Use API_ROUTES.auth.googleStatus
      const res = await safeFetchJson<{ success: boolean; connected?: boolean }>(API_ROUTES.auth.googleStatus, {
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
  };

  // Fetch Google OAuth auth url
  const fetchAuthUrl = async () => {
    if (!token) return;
    try { // Use API_ROUTES.auth.googleUrl
      const res = await safeFetchJson<{ success: boolean; url?: string }>(API_ROUTES.auth.googleUrl, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.data?.success && res.data?.url) {
        setAuthUrl(res.data.url);
      }
    } catch (err) {
      // Ignored gracefully
    }
  };

  // Load history from DB
  const fetchSyncHistory = async () => {
    if (!token) return;
    setLoadingHistory(true);
    try { // Use API_ROUTES.syncHistory
      const res = await safeFetchJson<{ success: boolean; data: SyncRun[] }>(API_ROUTES.syncHistory, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSyncHistory(res.data.data);
      }
    } catch (err) {
      // Ignored gracefully
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchSyncHistory();
    checkGoogleConnection();
  }, [token]);

  // Persist presentationId choice in browser
  const handlePresentationIdChange = (val: string) => {
    setPresentationId(val);
    localStorage.setItem("grupocomunicarte_presentation_id", val);
  };

  // Timer counter during active sync
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (syncing) {
      interval = setInterval(() => {
        setSyncTime((t) => t + 1);
      }, 1000);
    } else {
      setSyncTime(0);
    }
    return () => clearInterval(interval);
  }, [syncing]);

  // Launch synchronization run
  const handleStartSync = async () => {
    if (!token) return;
    if (!presentationId || presentationId.trim().length < 15 || presentationId.includes("XXXX")) {
      toast.error("Por favor ingresa un ID válido de presentación de Google Slides.", "Error de Parámetro");
      return;
    }

    setSyncing(true);
    toast.info("Conectando con Google Slides API y extrayendo metadatos...", "Sincronización Iniciada");

    try {
      const res = await safeFetchJson<{ success: boolean; data?: any; error?: string }>(API_ROUTES.sync, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ presentationId: presentationId.trim() })
      });

      if (res.data?.success) {
        // Calculate skipped slides
        const total = res.data.data?.totalSlides || 0;
        const imp = res.data.data?.importedCount || 0;
        const upd = res.data.data?.updatedCount || 0;
        const errs = res.data.data?.errorCount || 0;
        const skipped = Math.max(0, total - imp - upd - errs);

        toast.success(
          `Procesado con éxito: ${imp} creados, ${upd} actualizados, ${skipped} sin cambios (omitidos), ${errs} errores.`,
          "Sincronización Completa"
        );
        onRefreshInventory(); // Refresh parent screen state
        fetchSyncHistory(); // Reload history logs
      } else {
        toast.error(res.data?.error || res.error || "Ocurrió un error en el canal de sincronización.", "Fallo de Importación");
        fetchSyncHistory();
      }
    } catch (err: any) {
      toast.error(err.message || "No se pudo contactar al servidor de sincronización.", "Error de Conexión");
    } finally {
      setSyncing(false);
    }
  };

  // Rollback database to a specific snapshot
  const handleRollback = async (syncId: number) => {
    if (!token) return;
    const confirmRollback = window.confirm(
      "¿Estás seguro de que deseas realizar el rollback? Esto revertirá el catálogo completo de soportes al estado exacto previo a esta sincronización."
    );
    if (!confirmRollback) return;

    setRollingBackId(syncId);
    toast.info("Restaurando snapshot de base de datos...", "Rollback en Proceso");

    try {
      const res = await safeFetchJson<{ success: boolean; data?: { restoredCount: number }; error?: string }>(API_ROUTES.syncRollback, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ syncId })
      });

      if (res.data?.success) {
        toast.success(
          `La base de datos se ha revertido con éxito. Se restauraron ${res.data.data?.restoredCount ?? 0} soportes publicitarios.`,
          "Rollback Exitoso"
        );
        onRefreshInventory(); // Refresh parent UI state
        fetchSyncHistory(); // Reload history logs
        setSelectedRun(null); // Close expanded details
      } else {
        toast.error(res.data?.error || res.error || "No se pudo realizar el rollback.", "Error de Rollback");
      }
    } catch (err: any) {
      toast.error(err.message || "Fallo al conectar con el servidor para ejecutar rollback.", "Error de Conexión");
    } finally {
      setRollingBackId(null);
    }
  };

  // Load run errors on expand
  const handleToggleRun = async (runId: number) => {
    if (selectedRun === runId) {
      setSelectedRun(null);
      setSelectedRunErrors([]);
      return;
    }

    setSelectedRun(runId);
    setSelectedRunErrors([]);
    try {
      const res = await safeFetchJson<{ success: boolean; data: SyncError[] }>(API_ROUTES.syncErrors(runId), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSelectedRunErrors(res.data.data);
      }
    } catch (err) {
      // Ignored
    }
  };

  const activePresentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 font-sans" id="slides-sync-container">
      
      {/* 1. Header Card */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row gap-6 justify-between items-start md:items-center" id="sync-header-card">
        <div className="space-y-1.5 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-amber-800 bg-amber-50 uppercase tracking-widest border border-amber-200/50">
            <Database className="h-3 w-3" /> Origen de Datos: Google Slides
          </span>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Importador Automatizado de Catálogo</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Sincroniza y normaliza de forma bidireccional los espacios publicitarios (Soportes Tradicionales, Pantallas LED, LED Móviles) modificados por el equipo comercial en la presentación de diapositivas patrón.
          </p>
        </div>

        {googleConnected === false ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-amber-50 border border-amber-200/50 rounded-2xl p-4 w-full md:w-auto">
            <div className="text-left">
              <p className="text-[11px] font-black uppercase text-amber-800 tracking-wider">Conexión con Google Requerida</p>
              <p className="text-[10px] text-amber-600 font-medium">Vincula tu cuenta para sincronizar con Google Slides</p>
            </div>
            {authUrl ? (
              <a
                href={authUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  toast.info("Esperando autorización en nueva pestaña...");
                  let attempts = 0;
                  const interval = setInterval(async () => {
                    attempts++;
                    if (attempts > 20) {
                      clearInterval(interval);
                      return; // Stop trying after 20 attempts
                    }
                    try {
                      const res = await safeFetchJson<{ success: boolean; connected?: boolean }>(API_ROUTES.auth.googleStatus, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      if (res.data?.success && res.data?.connected) {
                        setGoogleConnected(true);
                        clearInterval(interval);
                        toast.success("¡Cuenta de Google vinculada correctamente!");
                        fetchSyncHistory();
                      }
                    } catch (e) {}
                  }, 5000);
                }}
                className="px-4 py-2 bg-[#06434a] hover:bg-[#05353b] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Vincular Google
              </a>
            ) : (
              <span className="text-[10px] text-stone-400 font-bold">Cargando enlace...</span>
            )}
          </div>
        ) : (
          <button
            onClick={handleStartSync}
            disabled={syncing || googleConnected === null}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 ${
              syncing || googleConnected === null
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-[#06434a] text-white hover:bg-[#05353b] hover:shadow-sm"
            }`}
          >
            {syncing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Sincronizando ({syncTime}s)
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                Iniciar Sincronización
              </>
            )}
          </button>
        )}
      </div>

      {/* 2. Connection Settings */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs">
        <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-4">Configuración de Vinculación</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8 space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">ID de la Presentación de Google Slides</label>
              <GooglePickerButton
                onSelect={(id) => handlePresentationIdChange(id)}
                disabled={googleConnected === false}
                title={googleConnected === false ? "Primero debes vincular tu cuenta de Google arriba" : "Buscar presentación en tu Drive"}
              />
            </div>
            <input
              type="text"
              value={presentationId}
              onChange={(e) => handlePresentationIdChange(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#06434a]/10 focus:border-[#06434a] transition-all font-mono text-stone-700"
              placeholder="Ej: 1A0z-76v9D_SIn70HwX8a0WzH..."
            />
          </div>
          <div className="md:col-span-4 h-full flex items-center">
            <a
              href={activePresentationUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#06434a] hover:text-[#042a2f] hover:bg-stone-50 rounded-xl transition-colors cursor-pointer w-full justify-center md:justify-start border border-stone-200/50 border-dashed"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Abrir Documento de Trabajo
            </a>
          </div>
        </div>
      </div>

      {/* 3. Latest Sync Run Status Overview */}
      {syncHistory.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
            <div className={`p-3 rounded-xl ${syncHistory[0].status === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              {syncHistory[0].status === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            </div>
            <div>
              <span className="block text-[9px] font-extrabold uppercase text-stone-400 tracking-wider">Último Estado</span>
              <span className="block text-xs font-bold text-stone-800 capitalize mt-0.5">{syncHistory[0].status === "success" ? "Completado" : "Fallido"}</span>
            </div>
          </div>

          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#06434a]/5 text-[#06434a]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[9px] font-extrabold uppercase text-stone-400 tracking-wider">Slides Analizadas</span>
              <span className="block text-sm font-black text-stone-800 mt-0.5">{syncHistory[0].totalSlides}</span>
            </div>
          </div>

          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[9px] font-extrabold uppercase text-stone-400 tracking-wider">Creadas / Actualizadas</span>
              <span className="block text-sm font-black text-stone-800 mt-0.5">
                {syncHistory[0].importedCount} / {syncHistory[0].updatedCount}
              </span>
            </div>
          </div>

          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
            <div className={`p-3 rounded-xl ${syncHistory[0].errorCount > 0 ? "bg-amber-50 text-amber-600" : "bg-stone-50 text-stone-400"}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[9px] font-extrabold uppercase text-stone-400 tracking-wider">Alertas / Errores</span>
              <span className="block text-sm font-black text-stone-800 mt-0.5">{syncHistory[0].errorCount}</span>
            </div>
          </div>

          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-stone-50 text-stone-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[9px] font-extrabold uppercase text-stone-400 tracking-wider">Duración Total</span>
              <span className="block text-xs font-bold text-stone-800 mt-0.5">{(syncHistory[0].durationMs / 1000).toFixed(1)} segundos</span>
            </div>
          </div>

        </div>
      )}

      {/* 4. Sync History Logs List */}
      <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 bg-stone-50/30">
          <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider">Historial de Sincronizaciones</h3>
        </div>

        {loadingHistory ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-stone-400" />
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mt-3">Consultando base de datos...</p>
          </div>
        ) : syncHistory.length === 0 ? (
          <div className="p-12 text-center">
            <Database className="h-8 w-8 text-stone-300 mx-auto" />
            <p className="text-xs text-stone-500 mt-2">Aún no se han ejecutado corridas de sincronización para este tenant.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {syncHistory.map((run) => {
              const isOpen = selectedRun === run.id;
              return (
                <div key={run.id} className="transition-all hover:bg-stone-50/30">
                  {/* Summary Bar */}
                  <div
                    onClick={() => handleToggleRun(run.id)}
                    className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          run.status === "success" 
                            ? "bg-emerald-500 shadow-xs shadow-emerald-500/20" 
                            : run.status === "running"
                            ? "bg-amber-500 animate-pulse"
                            : "bg-rose-500 shadow-xs"
                        }`} />
                        <span className="text-xs font-bold text-stone-800">{run.presentationTitle || "Google Slides Run"}</span>
                        <span className="text-[10px] text-stone-400 font-mono">({run.presentationId.slice(0, 8)}...)</span>
                      </div>
                      <div className="text-[10px] text-stone-400 font-medium">
                        Ejecutado por <span className="font-bold text-stone-600">{run.userName}</span> el {new Date(run.createdAt).toLocaleString("es-AR")}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4 text-stone-500 text-[11px] font-semibold">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-100">
                          +{run.importedCount} Creadas
                        </span>
                        <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-lg border border-blue-100">
                          ~{run.updatedCount} Modificadas
                        </span>
                        <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-lg border border-stone-200">
                          {Math.max(0, run.totalSlides - run.importedCount - run.updatedCount - run.errorCount)} Omitidas
                        </span>
                        {run.errorCount > 0 && (
                          <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded-lg border border-rose-100 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-rose-600" />
                            {run.errorCount} Errores
                          </span>
                        )}
                      </div>

                      <div className="text-stone-400">
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Errors/Logs Box */}
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-stone-50 bg-stone-50/50">
                      
                      {/* Rollback Restoration Operations Console */}
                      <div className="mt-4 mb-4 bg-white border border-stone-200/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold text-teal-800 bg-teal-50 border border-teal-200/40 uppercase tracking-widest">
                            <Database className="h-3 w-3" /> Snapshot de Respaldo de Seguridad
                          </span>
                          <h5 className="text-xs font-black text-stone-800">Copia de Seguridad Lista</h5>
                          <p className="text-[10px] text-stone-500 leading-relaxed max-w-xl">
                            Antes de ejecutar esta sincronización, el sistema realizó una copia de seguridad automática del catálogo de soportes comerciales. Puedes restablecer el inventario completo a este snapshot.
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRollback(run.id);
                          }}
                          disabled={rollingBackId !== null}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/50 rounded-xl transition-all disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 cursor-pointer shadow-3xs shrink-0"
                        >
                          {rollingBackId === run.id ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              Restaurando...
                            </>
                          ) : (
                            <>
                              <Clock className="h-3.5 w-3.5" />
                              Ejecutar Rollback
                            </>
                          )}
                        </button>
                      </div>

                      <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-wider pt-2 pb-2">Logs de Errores y Validaciones Técnicas</h4>
                      
                      {selectedRunErrors.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center bg-white">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                          <p className="text-xs text-emerald-700 font-semibold mt-1.5">¡Ejecución Perfecta!</p>
                          <p className="text-[10px] text-stone-400">No se detectaron advertencias de sintaxis, coordenadas faltantes ni errores en el origen de datos.</p>
                        </div>
                      ) : (
                        <div className="border border-stone-200/60 rounded-xl overflow-hidden bg-white shadow-xs">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-stone-100/60 border-b border-stone-200 text-[9px] font-extrabold uppercase tracking-widest text-stone-400">
                                <th className="p-3">Diapositiva</th>
                                <th className="p-3">Categoría de Error</th>
                                <th className="p-3">Detalle del Mensaje de Error</th>
                                <th className="p-3">Severidad</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              {selectedRunErrors.map((err) => (
                                <tr key={err.id} className="hover:bg-stone-50/20">
                                  <td className="p-3 font-mono font-bold text-stone-700 text-[11px]">
                                    Slide {err.slideIndex + 1}
                                  </td>
                                  <td className="p-3">
                                    <span className="capitalize font-semibold text-stone-600">{err.errorType}</span>
                                  </td>
                                  <td className="p-3 text-stone-600 font-medium">
                                    {err.errorMessage}
                                  </td>
                                  <td className="p-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                      err.severity === "error"
                                        ? "bg-rose-50 text-rose-700 border border-rose-200/50"
                                        : "bg-amber-50 text-amber-700 border border-amber-200/50"
                                    }`}>
                                      {err.severity}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
