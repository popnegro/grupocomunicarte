import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { Globe, Shield, ArrowRight } from "lucide-react";

export const LoginView: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Login error:", err);
      if (err?.code === "auth/unauthorized-domain") {
        setError(`El dominio actual ("${window.location.hostname}") no está autorizado por Firebase Authentication.`);
      } else if (err?.code === "auth/internal-error") {
        setError("Firebase Authentication devolvió un error interno. Verificá la configuración del proyecto y del dominio de QA.");
      } else if (err?.code === "auth/popup-closed-by-user") {
        setError("Se cerró el proceso de inicio de sesión antes de completarlo.");
      } else if (err?.code === "auth/popup-blocked") {
        setError("El navegador bloqueó el proceso de autenticación. Abrí el sitio directamente y volvé a intentarlo.");
      } else {
        setError(err?.message || "No se pudo iniciar sesión. La cuenta debe estar autorizada para acceder a la plataforma.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-3 text-[#06434a] select-none">
          <div className="h-10 w-10 rounded-xl bg-[#06434a] flex items-center justify-center text-white font-black text-lg shadow-md">C</div>
          <div className="text-left">
            <h2 className="text-lg font-black tracking-tight leading-none text-stone-900 uppercase">Grupo Comunicarte</h2>
            <p className="text-[10px] font-bold text-stone-400 mt-1 leading-none uppercase tracking-widest">SaaS DOOH Platform</p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-sm border border-stone-150 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs font-semibold space-y-2">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => window.open(window.location.href, "_blank")}
                className="mt-1.5 w-full py-2 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-center font-bold text-[11px] transition-colors cursor-pointer block"
              >
                Abrir el acceso en una nueva pestaña
              </button>
            </div>
          )}

          <div className="space-y-4">
            <button
              id="google-signin-btn"
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 border border-stone-200 rounded-full text-xs font-extrabold text-stone-700 bg-white hover:bg-stone-50 active:scale-[0.98] transition-all cursor-pointer shadow-xs uppercase tracking-wider leading-none disabled:opacity-60 disabled:cursor-wait"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3c.9-2.7 3.42-4.46 6.64-4.46z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.57l3.73 2.9c2.18-2 3.7-4.98 3.7-8.62z" />
                <path fill="#FBBC05" d="M5.36 14.17c-.24-.72-.38-1.49-.38-2.3 0-.81.14-1.59.38-2.3L1.5 6.57C.54 8.5.01 10.68.01 13s.53 4.5 1.49 6.43l3.86-3.26z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.9c-1.1.74-2.51 1.18-4.23 1.18-3.22 0-5.74-1.76-6.64-4.46l-3.86 3C3.4 20.35 7.35 23 12 23z" />
              </svg>
              <span>{loading ? "Iniciando..." : "Iniciar Sesión con Google"}</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-stone-150" />
              <span className="flex-shrink mx-4 text-stone-400 text-[10px] font-bold uppercase tracking-wider">Acceso Restringido</span>
              <div className="flex-grow border-t border-stone-150" />
            </div>

            <div className="space-y-4 text-xs text-stone-500 leading-relaxed">
              <div className="flex gap-3">
                <Shield className="h-4 w-4 text-[#06434a] shrink-0" />
                <span>Solo cuentas registradas y autorizadas tienen acceso a los módulos transaccionales.</span>
              </div>
              <div className="flex gap-3">
                <Globe className="h-4 w-4 text-[#06434a] shrink-0" />
                <span>El portal público permanece disponible sin autenticación.</span>
              </div>
            </div>

            <div className="pt-2">
              <a href="/" className="w-full flex items-center justify-center gap-1.5 text-xs font-black text-[#06434a] hover:text-[#0b5e67] transition-colors uppercase tracking-wider py-1.5">
                <span>Volver al Sitio Público</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
