import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { GoogleAuthProvider } from "firebase/auth";
import { ChangeLog } from "./types";
import { 
  Shield, 
  FileSpreadsheet, 
  Search, 
  RefreshCw, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  HelpCircle,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuditModuleProps {
  logs: ChangeLog[];
  userRole: string;
  addLog: (action: string) => Promise<void>;
  onRefreshLogs: () => Promise<void>;
}

interface AiAuditResult {
  summary: string;
  anomalies: string[];
  recommendations: string[];
  riskLevel: "Bajo" | "Medio" | "Alto";
}

export const AuditModule: React.FC<AuditModuleProps> = ({ 
  logs, 
  userRole, 
  addLog,
  onRefreshLogs
}) => {
  const { token, googleAccessToken, setGoogleAccessToken } = useAuth();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Google Sheets export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [errorExport, setErrorExport] = useState<string | null>(null);

  // AI Audit states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<AiAuditResult | null>(null);
  const [errorAnalysis, setErrorAnalysis] = useState<string | null>(null);

  // Get distinct log users for filtering
  const distinctUsers = useMemo(() => {
    const usersSet = new Set<string>();
    logs.forEach(log => {
      if (log.user) usersSet.add(log.user);
    });
    return Array.from(usersSet);
  }, [logs]);

  // Filter logs based on search and user dropdown
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchUser = filterUser === "all" || log.user === filterUser;
      
      return matchSearch && matchUser;
    });
  }, [logs, searchTerm, filterUser]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportToSheets = async (forceToken?: string) => {
    setIsExporting(true);
    setErrorExport(null);
    setExportUrl(null);

    const activeToken = forceToken || googleAccessToken || "";

    try {
      const response = await fetch("/api/changelogs/export-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-Google-Access-Token": activeToken,
        }
      });

      if (response.status === 401) {
        const resData = await response.json();
        if (resData.needsAuth) {
          // Open popup window to connect with Google
          const authUrlRes = await fetch("/api/auth/google/url", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const authUrlData = await authUrlRes.json();
          
          if (authUrlData.success && authUrlData.url) {
            const width = 500, height = 650;
            const left = (window.innerWidth - width) / 2;
            const top = (window.innerHeight - height) / 2;
            const authWindow = window.open(
              authUrlData.url,
              "GoogleAuth",
              `width=${width},height=${height},left=${left},top=${top}`
            );

            const timer = setInterval(async () => {
              if (!authWindow || authWindow.closed) {
                clearInterval(timer);
                
                // Retry sending export request
                const retryResponse = await fetch("/api/changelogs/export-sheets", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                  }
                });

                if (retryResponse.ok) {
                  const retryData = await retryResponse.json();
                  if (retryData.success) {
                    setExportUrl(retryData.spreadsheetUrl);
                    await onRefreshLogs();
                    return;
                  }
                }

                // Interactive popup fallback
                const { googleAuthProvider, signInWithPopup, auth } = await import("../../lib/firebase");
                const loginRes = await signInWithPopup(auth, googleAuthProvider);
                const credential = GoogleAuthProvider.credentialFromResult(loginRes);
                if (credential?.accessToken) {
                  setGoogleAccessToken(credential.accessToken);
                  handleExportToSheets(credential.accessToken);
                } else {
                  throw new Error("No se pudo completar la conexión con Google.");
                }
              }
            }, 1000);
            setIsExporting(false);
            return;
          } else {
            // Popup fallback
            const { googleAuthProvider, signInWithPopup, auth } = await import("../../lib/firebase");
            const loginRes = await signInWithPopup(auth, googleAuthProvider);
            const credential = GoogleAuthProvider.credentialFromResult(loginRes);
            if (credential?.accessToken) {
              setGoogleAccessToken(credential.accessToken);
              handleExportToSheets(credential.accessToken);
            } else {
              throw new Error("No se pudo completar la conexión con Google.");
            }
          }
        }
      }

      const data = await response.json();
      if (data.success) {
        setExportUrl(data.spreadsheetUrl);
        await onRefreshLogs();
      } else {
        throw new Error(data.error || "Ocurrió un error inesperado al exportar.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorExport(err.message || "Error al conectar con Google Sheets.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRunAiAudit = async () => {
    setIsAnalyzing(true);
    setErrorAnalysis(null);
    setAiReport(null);

    try {
      const response = await fetch("/api/ai/audit-analyse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (data.success) {
        setAiReport(data.data);
        await addLog("Ejecutó un diagnóstico de auditoría inteligente con Gemini AI");
      } else {
        throw new Error(data.error || "No se pudo generar la auditoría.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorAnalysis(err.message || "Error de red al invocar el análisis inteligente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: "Bajo" | "Medio" | "Alto") => {
    switch (level) {
      case "Bajo":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Medio":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Alto":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-left">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-stone-900 flex items-center gap-2 font-display">
            <Shield className="h-5 w-5 text-[#06434a]" />
            Auditoría de Operaciones
          </h2>
          <p className="text-xs text-stone-500">
            Monitorea el registro cronológico del sistema, detecta anomalías de seguridad y sincroniza bitácoras oficiales con Google Workspace.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-white border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Refrescar registro"
          >
            <RefreshCw className={`h-4 w-4 text-stone-500 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refrescar</span>
          </button>

          <button
            onClick={() => handleExportToSheets()}
            disabled={isExporting}
            className="p-2.5 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>{isExporting ? "Exportando..." : "Exportar a Google Sheets"}</span>
          </button>
        </div>
      </div>

      {/* Notifications and successes */}
      {exportUrl && (
        <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-left">
              <h4 className="text-xs font-bold text-emerald-900">¡Hoja de cálculo generada con éxito!</h4>
              <p className="text-[11px] text-emerald-700">El historial de operaciones se ha cargado como un registro formal protegido en Google Drive.</p>
            </div>
          </div>
          <a
            href={exportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <span>Ver Google Sheet</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {errorExport && (
        <div className="p-4 bg-rose-50 border border-rose-150 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-left">
            <h4 className="text-xs font-bold text-rose-900">Error de Exportación</h4>
            <p className="text-[11px] text-rose-700">{errorExport}</p>
          </div>
        </div>
      )}

      {/* Diagnostic & Analytics Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Audit Table (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-2xs">
            
            {/* Search and drop-down filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar por acción, usuario o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#06434a] focus:border-[#06434a] bg-stone-50/20"
                />
              </div>

              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="px-3 py-2 text-xs border border-stone-200 rounded-xl bg-white text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Todos los Usuarios</option>
                {distinctUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            {/* Change logs Table */}
            <div className="overflow-x-auto border border-stone-100 rounded-xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-20">ID</th>
                    <th className="py-3 px-4 w-36">Usuario</th>
                    <th className="py-3 px-4">Acción Realizada</th>
                    <th className="py-3 px-4 w-40">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-400 text-[11px]">{log.id}</td>
                      <td className="py-3.5 px-4 font-bold text-stone-900 truncate max-w-[150px]">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                          <span>{log.user}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] font-normal leading-relaxed text-stone-600">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px] font-semibold whitespace-nowrap">
                        {log.date && log.date.includes("T") ? (
                          new Date(log.date).toLocaleString("es-AR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        ) : log.date || "Justo ahora"}
                      </td>
                    </tr>
                  ))}

                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-stone-400">
                        <Clock className="h-8 w-8 text-stone-300 mx-auto mb-2" />
                        <p className="font-bold">No se encontraron registros de auditoría.</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">Ajusta los filtros de búsqueda e intenta nuevamente.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-bold">
              <span>Registros filtrados: {filteredLogs.length}</span>
              <span>Total histórico: {logs.length}</span>
            </div>

          </div>
        </div>

        {/* Right Column: AI Audit Diagnostician (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#06434a]/5 border border-[#06434a]/15 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                <h3 className="text-xs font-black text-[#06434a] uppercase tracking-wider font-display">
                  Auditoría Inteligente IA
                </h3>
              </div>
              <p className="text-[11px] text-[#06434a]/80 leading-relaxed">
                Ejecuta diagnósticos heurísticos automáticos sobre la bitácora para detectar patrones sospechosos o brechas en la asignación de permisos organizacionales.
              </p>
            </div>

            <button
              onClick={handleRunAiAudit}
              disabled={isAnalyzing}
              className="w-full bg-[#06434a] hover:bg-[#0b5e67] disabled:bg-stone-200 disabled:text-stone-400 text-white text-xs font-extrabold uppercase py-3 px-4 rounded-xl shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>{isAnalyzing ? "Analizando bitácora..." : "Analizar con Gemini AI"}</span>
            </button>

            {errorAnalysis && (
              <div className="p-3.5 bg-rose-50 border border-rose-150 rounded-xl text-[11px] text-rose-700 font-medium">
                {errorAnalysis}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {aiReport ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 text-left shadow-2xs"
              >
                {/* Risk assessment and title */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest font-mono">
                    Resultado del Análisis
                  </span>
                  <div className={`px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase ${getRiskColor(aiReport.riskLevel)}`}>
                    Riesgo: {aiReport.riskLevel}
                  </div>
                </div>

                {/* Executive summary block */}
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-stone-900 uppercase">Resumen Ejecutivo</h4>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {aiReport.summary}
                  </p>
                </div>

                {/* Anomalies listed */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-stone-900 uppercase flex items-center gap-1">
                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                    <span>Anomalías Detectadas</span>
                  </h4>
                  {aiReport.anomalies.length > 0 ? (
                    <ul className="space-y-1.5">
                      {aiReport.anomalies.map((anom, idx) => (
                        <li key={idx} className="text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100/50 flex items-start gap-2">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{anom}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-stone-400 italic">No se identificaron desviaciones sospechosas en el registro analizado.</p>
                  )}
                </div>

                {/* Strategic recommendations list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-stone-900 uppercase flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Recomendaciones Técnicas</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {aiReport.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-[11px] text-stone-600 bg-emerald-50/20 p-2.5 rounded-lg border border-emerald-100/50 flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </motion.div>
            ) : (
              !isAnalyzing && (
                <div className="border border-dashed border-stone-200 rounded-2xl p-6 text-center text-stone-400 space-y-1.5">
                  <HelpCircle className="h-6 w-6 text-stone-300 mx-auto" />
                  <p className="text-xs font-bold text-stone-700">Bitácora no diagnosticada</p>
                  <p className="text-[10px] text-stone-500">Ejecuta el análisis inteligente para escanear de forma exhaustiva las operaciones registradas.</p>
                </div>
              )
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
