import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught application error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleClearStorageAndReset = () => {
    try {
      localStorage.removeItem("smartweb_cms_content");
      localStorage.removeItem("smartweb_onboarding");
      localStorage.removeItem("smartweb_dooh_screens");
      localStorage.removeItem("smartweb_dooh_cart");
      localStorage.removeItem("smartweb_dooh_occupancy_matrix");
      sessionStorage.clear();
    } catch (e) {
      console.error("Error clearing storage:", e);
    }
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 font-sans text-stone-800">
          <div className="max-w-lg w-full bg-white border border-stone-200 rounded-3xl p-8 shadow-sm text-center">
            <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h1 className="text-xl font-bold text-stone-900 mb-2">
              Se ha producido un inconveniente en la aplicación
            </h1>
            <p className="text-xs text-stone-600 mb-6 leading-relaxed">
              La interfaz ha detectado un error inesperado durante el renderizado. Puedes reintentar la carga o restablecer la configuración local.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 bg-stone-50 border border-stone-200 rounded-xl text-left text-[11px] font-mono text-stone-700 max-h-32 overflow-y-auto">
                <p className="font-bold text-red-600 mb-1">{this.state.error.name}: {this.state.error.message}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[10px] text-stone-500 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack.slice(0, 300)}...
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#06434a] hover:bg-[#0a545d] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Recargar Aplicación
              </button>
              <button
                onClick={this.handleClearStorageAndReset}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-stone-500" />
                Limpiar Datos Locales
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
