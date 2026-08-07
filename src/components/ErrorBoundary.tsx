import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Copy, Check, ChevronDown, ChevronUp, History, Trash2 } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  showHistory: boolean;
  copied: boolean;
}

interface StructuredErrorLog {
  component: string;
  error: string;
  stack: string;
  timestamp: string;
  environment: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    showHistory: false,
    copied: false,
  };

  private extractComponentName(componentStack?: string): string {
    if (!componentStack) return "GlobalErrorBoundary";
    const match = componentStack.match(/^\s*in\s+([A-Z_a-z0-9]+)/m);
    return match ? match[1] : "Componente de Interfaz";
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    const componentName = this.extractComponentName(errorInfo?.componentStack);
    const structuredLog: StructuredErrorLog = {
      component: componentName,
      error: error.message || String(error),
      stack: error.stack || "",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "production"
    };

    // Console output in the requested JSON structure
    console.error("🛑 [CRITICAL RUNTIME ERROR]", JSON.stringify(structuredLog, null, 2));

    // Save in localStorage history (up to 10 entries) for developers to inspect across reloads
    try {
      const historicalLogs = JSON.parse(localStorage.getItem("platform_error_logs") || "[]");
      historicalLogs.unshift(structuredLog);
      localStorage.setItem("platform_error_logs", JSON.stringify(historicalLogs.slice(0, 10)));
    } catch (e) {
      // Ignore storage limitations
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false, showHistory: false, copied: false });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false, showHistory: false, copied: false });
    window.location.href = "/";
  };

  private handleCopyError = () => {
    const errorDetails = `Error: ${this.state.error?.message || "Desconocido"}\nStack: ${this.state.error?.stack || ""}\nComponent Stack: ${this.state.errorInfo?.componentStack || ""}`;
    navigator.clipboard.writeText(errorDetails).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    }).catch(() => {
      // Fallback
    });
  };

  private handleClearHistory = () => {
    try {
      localStorage.removeItem("platform_error_logs");
      this.setState({ showHistory: false });
    } catch (e) {
      // Fallback
    }
  };

  public render() {
    if (this.state.hasError) {
      let historicalLogs: StructuredErrorLog[] = [];
      try {
        historicalLogs = JSON.parse(localStorage.getItem("platform_error_logs") || "[]");
      } catch (e) {
        // Fallback
      }

      return (
        <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full bg-white border border-stone-200 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-600">
                <AlertTriangle className="w-7 h-7" />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-stone-900 font-display">
                  Ocurrió un inconveniente temporal
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto font-medium">
                  La plataforma comercial encontró una excepción inesperada. Puedes recargar la página o volver al panel principal.
                </p>
              </div>
            </div>

            {/* Diagnosis Details Dropdown */}
            {this.state.error && (
              <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="w-full px-4 py-2.5 bg-stone-100/70 hover:bg-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-700 transition-colors cursor-pointer border-b border-stone-200/50"
                >
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Detalles del Diagnóstico Técnico
                  </span>
                  {this.state.showDetails ? (
                    <ChevronUp className="w-4 h-4 text-stone-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500" />
                  )}
                </button>

                {this.state.showDetails && (
                  <div className="p-3.5 space-y-3 text-left border-t border-stone-200">
                    <div className="bg-white border border-stone-200 rounded-xl p-3 max-h-48 overflow-auto space-y-2">
                      <div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Excepción</span>
                        <code className="text-[11px] font-mono text-rose-700 break-words leading-tight block font-semibold">
                          {this.state.error.message || String(this.state.error)}
                        </code>
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block border-t border-stone-100 pt-1.5 mt-1.5">Traza de Pila</span>
                          <pre className="mt-1 text-[10px] font-mono text-stone-500 whitespace-pre-wrap break-words leading-normal">
                            {this.state.error.stack.split("\n").slice(0, 5).join("\n")}
                          </pre>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={this.handleCopyError}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold text-[#06434a] bg-teal-50 hover:bg-teal-100 border border-teal-200/60 rounded-lg transition-colors cursor-pointer"
                    >
                      {this.state.copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>¡Reporte copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar reporte de error</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Historical Logs List */}
            {historicalLogs.length > 1 && (
              <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showHistory: !prev.showHistory }))}
                  className="w-full px-4 py-2.5 bg-stone-100/70 hover:bg-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-700 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-stone-500" />
                    Historial de Errores Persistidos ({historicalLogs.length})
                  </span>
                  {this.state.showHistory ? (
                    <ChevronUp className="w-4 h-4 text-stone-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500" />
                  )}
                </button>

                {this.state.showHistory && (
                  <div className="p-3.5 space-y-3 text-left border-t border-stone-200">
                    <div className="space-y-2 max-h-36 overflow-auto">
                      {historicalLogs.map((log, idx) => (
                        <div key={idx} className="bg-white border border-stone-200 rounded-lg p-2.5 text-[10px] font-medium text-stone-600 space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-stone-400">
                            <span>Módulo: {log.component}</span>
                            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-rose-600 font-semibold truncate font-mono">{log.error}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={this.handleClearHistory}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Limpiar Historial</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 px-4 bg-[#06434a] hover:bg-[#0a545d] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Recargar Aplicación
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 text-[#06434a]" />
                Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

