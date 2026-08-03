import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { LogIn, Globe, Shield, ArrowRight } from "lucide-react";

export const LoginView: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsUnauthorizedDomain(false);
    setLoading(true);
    try {
      await loginWithGoogle();
      // Redirect or state update will trigger automatically through AuthProvider
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.message || "";
      const errCode = err?.code || "";
      if (errCode === "auth/unauthorized-domain" || errMsg.includes("auth/unauthorized-domain")) {
        setIsUnauthorizedDomain(true);
        setError("Error: Dominio no autorizado en Firebase.");
      } else {
        setError("No se pudo iniciar sesión. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 text-[#06434a] select-none">
          <div className="h-10 w-10 rounded-xl bg-[#06434a] flex items-center justify-center text-white font-black text-lg shadow-md">
            C
          </div>
          <div className="text-left">
            <h2 className="text-lg font-black tracking-tight leading-none text-stone-900 uppercase">Grupo Comunicarte</h2>
            <p className="text-[10px] font-bold text-stone-400 mt-1 leading-none uppercase tracking-widest">SaaS DOOH Platform</p>
          </div>
        </div>

        <h3 className="mt-8 text-center text-2xl font-black text-stone-900 tracking-tight font-display">
          Consola de Administración
        </h3>
        <p className="mt-2 text-center text-xs text-stone-500 max-w">
          Accede de forma segura para gestionar el inventario comercial DOOH, presupuestos y clientes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-sm border border-stone-150 rounded-2xl sm:px-10">
          
          {isUnauthorizedDomain ? (
            <div className="mb-6 bg-red-50/70 border border-red-200 p-5 rounded-2xl text-left space-y-4">
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-extrabold text-xs shrink-0 mt-0.5">!</span>
                <div>
                  <h4 className="text-xs font-extrabold text-red-950 uppercase tracking-wide">Dominio no autorizado en Firebase</h4>
                  <p className="text-[11px] text-red-700 mt-1 leading-relaxed">
                    Firebase Auth bloquea el inicio de sesión desde dominios no registrados. Para autorizar este entorno de desarrollo/vista previa:
                  </p>
                </div>
              </div>

              <div className="bg-white border border-red-100 rounded-xl p-3 space-y-1.5 shadow-2xs">
                <span className="text-[9px] uppercase font-extrabold text-stone-400 tracking-wider block">Copia este dominio actual:</span>
                <div className="flex items-center justify-between gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 font-mono text-[11px] text-stone-700 select-all">
                  <span className="break-all">{window.location.hostname}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.hostname);
                    }}
                    className="text-[9px] uppercase font-bold text-[#06434a] hover:underline cursor-pointer shrink-0"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-red-700 space-y-1.5 leading-relaxed">
                <p className="font-bold">Instrucciones para autorizarlo:</p>
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>Inicia sesión en tu <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="font-extrabold underline text-[#06434a] hover:text-[#0b5e67]">Consola de Firebase</a>.</li>
                  <li>Selecciona tu proyecto (<strong className="font-mono text-stone-900 bg-white px-1.5 py-0.5 border border-stone-200 rounded">light-case-dn56p</strong>).</li>
                  <li>Ve a la pestaña **Authentication** en el menú de la izquierda.</li>
                  <li>Ingresa a la pestaña **Sign-in method** en la parte superior.</li>
                  <li>Desplázate hacia abajo hasta **Dominios autorizados** (Authorized domains).</li>
                  <li>Haz clic en **Agregar dominio** (Add domain) y pega el valor copiado arriba.</li>
                </ol>
              </div>
            </div>
          ) : error ? (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold">
              {error}
            </div>
          ) : null}

          <div className="space-y-6">
            <button
              id="google-signin-btn"
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 border border-stone-200 rounded-full text-xs font-extrabold text-stone-700 bg-white hover:bg-stone-50 active:scale-[0.98] transition-all cursor-pointer shadow-xs uppercase tracking-wider leading-none"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3c.9-2.7 3.42-4.46 6.64-4.46z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.57l3.73 2.9c2.18-2 3.7-4.98 3.7-8.62z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.36 14.17c-.24-.72-.38-1.49-.38-2.3c0-.81.14-1.59.38-2.3L1.5 6.57C.54 8.5.01 10.68.01 13s.53 4.5 1.49 6.43l3.86-3.26z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.9c-1.1.74-2.51 1.18-4.23 1.18-3.22 0-5.74-1.76-6.64-4.46l-3.86 3C3.4 20.35 7.35 23 12 23z"
                />
              </svg>
              <span>{loading ? "Iniciando sesión..." : "Iniciar Sesión con Google"}</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-stone-150"></div>
              <span className="flex-shrink mx-4 text-stone-400 text-[10px] font-bold uppercase tracking-wider">Acceso Restringido</span>
              <div className="flex-grow border-t border-stone-150"></div>
            </div>

            <div className="space-y-4 text-xs text-stone-500 leading-relaxed">
              <div className="flex gap-3">
                <Shield className="h-4 w-4 text-[#06434a] shrink-0" />
                <span>Solo cuentas registradas y autorizadas tienen acceso a los módulos transaccionales.</span>
              </div>
              <div className="flex gap-3">
                <Globe className="h-4 w-4 text-[#06434a] shrink-0" />
                <span>Para ver el portal de ventas público libremente, haz clic abajo.</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/"
                className="w-full flex items-center justify-center gap-1.5 text-xs font-black text-[#06434a] hover:text-[#0b5e67] transition-colors uppercase tracking-wider py-1.5"
              >
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
