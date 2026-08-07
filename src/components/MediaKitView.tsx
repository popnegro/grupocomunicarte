import React, { useState } from "react";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";

interface MediaKitViewProps {
  slug: string;
}

export const MediaKitView: React.FC<MediaKitViewProps> = ({ slug }) => {
  const [mediaKitDownloading, setMediaKitDownloading] = useState(false);
  const [mediaKitSuccess, setMediaKitSuccess] = useState(false);

  const handleDownloadMediaKit = () => {
    setMediaKitDownloading(true);
    setTimeout(() => {
      setMediaKitDownloading(false);
      setMediaKitSuccess(true);
      setTimeout(() => setMediaKitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.slate.800)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.800)_1px,transparent_1px)] bg-size-[3rem_3rem] opacity-20" />
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] bg-white/10 text-white border border-white/20 font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Centro de Descargas Oficial
          </span>
          <h2 className="text-2xl font-black text-white">MediaKit Comercial 2026 PDF</h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
            Consigue las tarifas actualizadas, los perfiles socioeconómicos de las audiencias auditadas, regulaciones municipales vigentes, y especificaciones técnicas para diseñadores en un solo documento.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={handleDownloadMediaKit}
              disabled={mediaKitDownloading}
              className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              {mediaKitDownloading ? (
                <>
                  <LucideIcons.RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Preparando descarga...</span>
                </>
              ) : (
                <>
                  <LucideIcons.FileDown className="h-4 w-4 text-slate-950" />
                  <span>Descargar MediaKit Completo (PDF)</span>
                </>
              )}
            </button>
          </div>

          {mediaKitSuccess && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-emerald-400 font-bold flex items-center gap-2 pt-2">
              <LucideIcons.CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>¡Descarga simulada iniciada con éxito! Archivo procesado correctamente.</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Technical specifications checklist */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="border-b border-slate-150 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm">Especificaciones Técnicas para Creativos</h3>
          <p className="text-slate-500 text-[11px] mt-0.5">Asegura la mejor fidelidad en nuestras pantallas LED gigantes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-150 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <LucideIcons.Monitor className="h-4.5 w-4.5 text-slate-600" />
              <span>Pantallas LED Digitales (DOOH)</span>
            </div>
            <ul className="space-y-1.5 text-slate-500 font-medium">
              <li>• Formato recomendado: MP4 (H.264), JPG</li>
              <li>• Aspect Ratio nativo: 16:9 y 4:3</li>
              <li>• Resolución: 1920x1080px (mínimo)</li>
              <li>• Duración estándar del Spot: 5 a 10 segundos</li>
            </ul>
          </div>

          <div className="border border-slate-150 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <LucideIcons.Layers className="h-4.5 w-4.5 text-slate-600" />
              <span>Soportes Físicos (Vallas / Monopostes)</span>
            </div>
            <ul className="space-y-1.5 text-slate-500 font-medium">
              <li>• Formato requerido: PDF editable, TIFF</li>
              <li>• Espacio de Color: CMYK únicamente</li>
              <li>• Escala recomendada de diseño: 1:10</li>
              <li>• Sangría de corte: 5cm perimetrales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};