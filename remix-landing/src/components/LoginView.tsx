import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';

export function LoginView() {
  const { login, setView } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor complete todos los campos.');
      return;
    }

    setIsLoggingIn(true);
    setErrorMsg(null);

    const result = await login(email, password);
    setIsLoggingIn(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Credenciales inválidas.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F7F9F7]" id="login-container">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#DCE4DF] rounded-2xl shadow-xs overflow-hidden"
      >
        {/* Header decoration */}
        <div className="p-6 bg-[#082028] text-white flex flex-col items-center text-center relative border-b border-[#049A41]/30">
          <button
            onClick={() => setView('landing')}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-all text-slate-300"
            title="Volver a la Landing"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="mb-3">
            <BrandLogo size="md" variant="icon" />
          </div>
          <h2 className="text-base font-extrabold text-white">Portal Administrativo</h2>
          <p className="text-xs text-slate-300 mt-0.5">Grupo Comunicarte S.A.</p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <label className="block text-[10px] uppercase font-extrabold text-[#40515A] mb-1 tracking-wider">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@grupocomunicarte.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F7] focus:bg-white border border-[#DCE4DF] focus:border-[#049A41] rounded-xl text-xs font-bold text-[#082028] outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-[10px] uppercase font-extrabold text-[#40515A] mb-1 tracking-wider">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F7F9F7] focus:bg-white border border-[#DCE4DF] focus:border-[#049A41] rounded-xl text-xs font-bold text-[#082028] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#082028] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full py-3 px-4 bg-[#049A41] hover:bg-[#038537] text-[#082028] text-xs font-extrabold rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all ${
                isLoggingIn ? 'cursor-wait opacity-80' : ''
              }`}
            >
              {isLoggingIn ? 'Iniciando Sesión...' : 'Ingresar al Dashboard'}
            </button>
          </form>

          {/* Help box detailing the default demo credentials */}
          <div className="bg-[#F7F9F7] border border-[#DCE4DF] p-4 rounded-xl space-y-2">
            <h4 className="text-[10px] font-extrabold text-[#40515A] uppercase tracking-wider">Acceso de Demostración</h4>
            <div className="space-y-1.5 text-[11px] text-[#082028]">
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-[10px] text-[#049A41] uppercase">SúperAdmin:</span>
                <span className="text-[#082028] font-mono text-[10.5px]">superadmin@grupocomunicarte.com</span>
                <span className="text-[#40515A] text-[9.5px]">Clave: supercomunicarte2026!</span>
              </div>
              <div className="flex flex-col gap-0.5 border-t border-[#DCE4DF] pt-1.5 mt-1">
                <span className="font-extrabold text-[10px] text-[#049A41] uppercase">Admin:</span>
                <span className="text-[#082028] font-mono text-[10.5px]">admin@grupocomunicarte.com</span>
                <span className="text-[#40515A] text-[9.5px]">Clave: admincomunicarte2026!</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
