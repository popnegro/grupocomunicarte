import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, MailWarning } from "lucide-react";

interface Props {
  children?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface StructuredErrorLog {
  component: string;
  error: string;
  stack: string;
  timestamp: string;
  environment: string;
}

export class ModuleErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const componentName = this.props.moduleName || "ModuleComponent";
    const structuredLog: StructuredErrorLog = {
      component: componentName,
      error: error.message || String(error),
      stack: error.stack || "",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "production"
    };

    // Output exact requested structured JSON logging
    console.error(`🛑 [MODULE EXCEPTION] [${componentName}]`, JSON.stringify(structuredLog, null, 2));

    // Save in historical logs for debugging assistance
    try {
      const historicalLogs = JSON.parse(localStorage.getItem("platform_error_logs") || "[]");
      historicalLogs.unshift(structuredLog);
      localStorage.setItem("platform_error_logs", JSON.stringify(historicalLogs.slice(0, 10)));
    } catch (e) {
      // Ignore storage limitations
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-2xl mx-auto space-y-6 font-sans">
          <div className="bg-white border border-stone-200/80 rounded-2xl p-8 shadow-2xs text-center space-y-5">
            <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <MailWarning className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-black text-stone-900 uppercase tracking-tight">
                Módulo temporalmente no disponible
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
                El módulo de {this.props.moduleName || "comunicación"} experimentó una excepción interna al comunicarse con los servicios de Google. El resto de las funciones de la consola comercial continuúan operativas.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl text-left max-h-32 overflow-auto">
                <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1">
                  Detalle del Error:
                </p>
                <code className="text-[11px] font-mono text-rose-700 break-words block leading-snug">
                  {this.state.error.message || String(this.state.error)}
                </code>
              </div>
            )}

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#06434a] hover:bg-[#05353b] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reintentar Carga
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
