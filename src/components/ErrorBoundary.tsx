import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by boundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-view" className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white border border-stone-200 p-8 rounded-2xl shadow-sm space-y-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertOctagon className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-lg font-extrabold text-stone-900 uppercase tracking-wide">Algo salió mal</h1>
              <p className="text-xs text-stone-500 leading-relaxed">
                Se ha producido un error inesperado en la aplicación. Por favor, intenta restablecer la sesión.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-stone-50 border border-stone-150 rounded-xl p-3 text-[11px] font-mono text-left text-stone-600 break-all max-h-32 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-[#06434a] rounded-full text-xs font-bold text-white bg-[#06434a] hover:bg-[#0b5e67] active:scale-[0.98] transition-all cursor-pointer shadow-xs uppercase tracking-wider"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restablecer Aplicación</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
