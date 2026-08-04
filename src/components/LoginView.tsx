import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { LogIn, Globe, Shield, ArrowRight, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { usePageMetadata } from "../hooks/usePageMetadata";

export const LoginView: React.FC = () => {
  usePageMetadata({
    title: "Iniciar Sesión | Panel de Gestión",
    description: "Inicie sesión de forma segura para acceder al panel administrativo de Grupo Comunicarte. Administre campañas, clientes e inventario comercial."
  });

  const { loginWithGoogle, loginAsDemoUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentDomain = typeof window !== "undefined" ? window.location.hostname : "localhost";

  const handleLogin = async () => {
    setError(null);
    setIsUnauthorizedDomain(false);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn("Auth exception caught:", err);
      const errMsg = err?.message || "";
      const errCode = err?.code || "";
      if (errCode === "auth/unauthorized-domain" || errMsg.includes("auth/unauthorized-domain")) {
        setIsUnauthorizedDomain(true);
        setError("Error: Dominio no autorizado en la consola de Firebase.");
      } else if (errCode === "auth/popup-closed-by-user") {
        setError("La ventana de autenticación de Google fue cerrada antes de completar el inicio de sesión.");
      } else if (errCode === "auth/network-request-failed") {
        setError("Error de red. Por favor, revisa tu conexión a Internet e inténtalo de nuevo.");
      } else if (errCode === "auth/user-token-expired") {
        setError("Tu credencial o sesión ha expirado. Por favor, vuelve a iniciar sesión.");
      } else {
        setError("No se pudo iniciar sesión con Google. Puedes ingresar usando el Acceso de Prueba / Modo Demo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="bg-white py-10 px-6 shadow-sm border border-stone-150 rounded-2xl sm:px-10 space-y-6">
          
          {isUnauthorizedDomain ? (
            <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl text-left space-y-4 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">!</span>
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">Dominio no Autorizado en Firebase</h4>
                  <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                    Firebase Auth bloquea solicitudes provenientes de dominios no autorizados en la consola del proyecto.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-amber-200 rounded-xl p-3 space-y-1.5 shadow-2xs">
                <span className="text-[9px] uppercase font-extrabold text-stone-400 tracking-wider block">Tu dominio actual:</span>
                <div className="flex items-center justify-between gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 font-mono text-[11px] text-stone-800">
                  <span className="break-all font-bold">{currentDomain}</span>
                  <button 
                    onClick={handleCopyDomain}
                    className="text-[9px] uppercase font-bold text-[#06434a] hover:underline cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-amber-900 space-y-2 leading-relaxed">
                <p className="font-bold">Pasos para autorizar este dominio en Firebase:</p>
                <ol className="list-decimal pl-4 space-y-1 text-[10.5px]">
                  <li>Abre la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="font-extrabold underline text-[#06434a] hover:text-[#0b5e67] inline-flex items-center gap-0.5">Consola de Firebase <ExternalLink className="h-2.5 w-2.5" /></a>.</li>
                  <li>Selecciona el proyecto <strong className="font-mono bg-white px-1 border rounded">light-case-dn56p</strong>.</li>
                  <li>Ve a **Authentication** &gt; pestaña **Settings** (Configuración).</li>
                  <li>En **Authorized Domains** (Dominios autorizados), haz clic en **Add Domain** y pega <code className="bg-white px-1 font-bold">{currentDomain}</code>.</li>
                </ol>
              </div>

              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-[10px] text-amber-900 font-medium">¿Deseas probar la app de inmediato?</span>
                <button
                  onClick={loginAsDemoUser}
                  className="px-3 py-1.5 bg-[#06434a] hover:bg-[#0b5e67] text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span>Acceso Modo Demo</span>
                </button>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold space-y-2">
              <div>{error}</div>
              <button
                onClick={loginAsDemoUser}
                className="w-full py-2 bg-[#06434a] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span>Ingresar en Modo Demo</span>
              </button>
            </div>
          ) : null}

          <div className="space-y-4">
            <button
              id="google-signin-btn"
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border border-stone-200 rounded-full text-xs font-extrabold text-stone-700 bg-white hover:bg-stone-50 active:scale-[0.98] transition-all cursor-pointer shadow-xs uppercase tracking-wider leading-none"
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

            {/* Direct Demo Login Option */}
            <button
              onClick={loginAsDemoUser}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-stone-200/80 rounded-full text-xs font-bold text-[#06434a] bg-stone-50 hover:bg-stone-100 active:scale-[0.98] transition-all cursor-pointer shadow-2xs uppercase tracking-wider"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Acceso de Prueba / Modo Demo</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-stone-150"></div>
              <span className="flex-shrink mx-4 text-stone-400 text-[10px] font-bold uppercase tracking-wider">Acceso Restringido</span>
              <div className="flex-grow border-t border-stone-150"></div>
            </div>

            <div className="space-y-3 text-xs text-stone-500 leading-relaxed">
              <div className="flex gap-3 items-start">
                <Shield className="h-4 w-4 text-[#06434a] shrink-0 mt-0.5" />
                <span>Las cuentas autorizadas acceden al panel completo de ventas, cotizaciones e inventario.</span>
              </div>
              <div className="flex gap-3 items-start">
                <Globe className="h-4 w-4 text-[#06434a] shrink-0 mt-0.5" />
                <span>Para explorar la portada comercial pública, haz clic en el enlace a continuación.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100">
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
