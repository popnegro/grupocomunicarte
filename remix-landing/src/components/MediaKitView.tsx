import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderOpen, ArrowLeft, Download, Send, MapPin, Printer, Trash2
} from 'lucide-react';
import { motion } from 'motion/react';
import { SupportImage } from './SupportImage';

interface MediaKitViewProps {
  onClose: () => void;
  onNavigateToQuote: () => void;
}

export function MediaKitView({ onClose, onNavigateToQuote }: MediaKitViewProps) {
  const { selectedSupports, currentPlaza, campaignStartDate, campaignEndDate, toggleSupportSelection, clearSelection } = useApp();
  const [clientName, setClientName] = useState('Cliente Corporativo');
  const [proposalTitle, setProposalTitle] = useState(`Plan de Medios Exterior - ${currentPlaza}`);
  const [layoutStyle, setLayoutStyle] = useState<'pitch' | 'onepager' | 'map'>('pitch');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const formatDateShort = (d: string | null) => {
    if (!d) return 'Por definir';
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const periodString = campaignStartDate && campaignEndDate 
    ? `${formatDateShort(campaignStartDate)} - ${formatDateShort(campaignEndDate)}`
    : 'Por definir con ejecutivo';

  const totalReach = selectedSupports.reduce((acc, s) => {
    if (!s.contactsCount) return acc;
    const match = s.contactsCount.match(/([\d.]+)\s*M/i);
    if (match) return acc + parseFloat(match[1]);
    return acc;
  }, 0);

  const handleExportJSON = () => {
    const slidesPresentation = {
      presentationTitle: proposalTitle,
      clientTarget: clientName,
      campaignPeriod: periodString,
      createdDate: new Date().toLocaleDateString('es-AR'),
      marketRegion: currentPlaza,
      slidesStyle: layoutStyle,
      integrationPlatform: 'Google Slides API Presentation Structure',
      slidesCount: selectedSupports.length + 2,
      slides: [
        {
          slideIndex: 1,
          type: 'TITLE_SLIDE',
          title: proposalTitle.toUpperCase(),
          subtitle: `Preparado exclusivamente para: ${clientName}\nPlaza comercial: ${currentPlaza}\nPeríodo de Campaña: ${periodString}\nGrupo Comunicarte S.A.`,
          backgroundHex: '#082028',
          accentHex: '#049A41'
        },
        ...selectedSupports.map((screen, index) => ({
          slideIndex: index + 2,
          type: 'SUPPORT_DETAIL',
          screenId: screen.id,
          screenName: screen.name,
          category: screen.type,
          address: screen.address,
          dimensions: screen.size,
          reachEstimate: screen.contactsCount || 'Consultar',
          keyPoints: screen.refPoints || [],
          visualSource: screen.imageUrl,
          pricingPolicy: 'Tarifa bajo cotización'
        })),
        {
          slideIndex: selectedSupports.length + 2,
          type: 'CONTACT_OUTRO',
          header: 'Grupo Comunicarte S.A.',
          ctaText: 'Solicite el tarifario formal a su ejecutivo comercial.',
          contactInfo: 'comercial@grupocomunicarte.com | Mendoza - Buenos Aires'
        }
      ]
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(slidesPresentation, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `comunicarte_mediakit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-[#082028]/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#DCE4DF]"
      >
        {/* Top Header */}
        <div className="bg-[#082028] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#049A41]/30">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#049A41]/20 rounded-xl transition-colors text-slate-300 hover:text-white"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-[#049A41] text-[#082028] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Media Kit Interactivo
                </span>
                <span className="text-slate-400 text-xs font-mono">{currentPlaza}</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white mt-0.5">
                {proposalTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPDF}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
              title="Imprimir / Exportar PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-[#049A41] hover:bg-[#038537] text-[#082028] text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              title="Descargar estructura compatible con Google Slides"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar JSON Slides</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#F7F9F7]">
          {/* Customization Bar */}
          <div className="bg-white p-4 rounded-xl border border-[#DCE4DF] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-extrabold text-[#40515A] tracking-wider mb-1">
                Título de la Propuesta
              </label>
              <input
                type="text"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                className="w-full bg-[#F7F9F7] border border-[#DCE4DF] px-3 py-1.5 rounded-lg text-xs font-bold text-[#082028] outline-none focus:border-[#049A41]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-extrabold text-[#40515A] tracking-wider mb-1">
                Cliente / Marca
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#F7F9F7] border border-[#DCE4DF] px-3 py-1.5 rounded-lg text-xs font-bold text-[#082028] outline-none focus:border-[#049A41]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-extrabold text-[#40515A] tracking-wider mb-1">
                Estilo de Presentación
              </label>
              <div className="flex p-0.5 bg-[#F7F9F7] border border-[#DCE4DF] rounded-lg">
                <button
                  onClick={() => setLayoutStyle('pitch')}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${
                    layoutStyle === 'pitch' ? 'bg-[#082028] text-white' : 'text-[#40515A]'
                  }`}
                >
                  Pitch Deck
                </button>
                <button
                  onClick={() => setLayoutStyle('onepager')}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${
                    layoutStyle === 'onepager' ? 'bg-[#082028] text-white' : 'text-[#40515A]'
                  }`}
                >
                  One-Pager
                </button>
              </div>
            </div>
          </div>

          {/* Selected Screens Inventory Preview */}
          {selectedSupports.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#DCE4DF] rounded-2xl p-12 text-center space-y-3">
              <FolderOpen className="w-12 h-12 text-[#64748B] mx-auto animate-bounce" />
              <h3 className="text-sm font-extrabold text-[#082028]">No hay soportes seleccionados para el Media Kit</h3>
              <p className="text-xs text-[#40515A] max-w-md mx-auto">
                Explore el mapa o el listado de soportes y haga clic en "Seleccionar" en las pantallas que desee incluir en su propuesta comercial.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#082028] hover:bg-[#06181f] text-white text-xs font-bold rounded-xl transition-all"
              >
                Volver al Explorador
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Executive Metrics Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-[#DCE4DF] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Soportes y Período</span>
                  <p className="text-xl font-extrabold text-[#082028] mt-1">{selectedSupports.length} Ubicaciones</p>
                  <p className="text-[11px] text-[#049A41] font-extrabold mt-0.5">
                    Período: {periodString}
                  </p>
                </div>

                <div className="bg-white border border-[#DCE4DF] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Impacto Estimado</span>
                  <p className="text-2xl font-extrabold text-[#049A41] mt-1">
                    {totalReach > 0 ? `+${totalReach.toFixed(1)}M` : 'Alto Alcance'}
                  </p>
                  <p className="text-[11px] text-[#40515A] mt-0.5">Contactos visuales / mes</p>
                </div>

                <div className="bg-white border border-[#DCE4DF] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Condición Comercial</span>
                  <p className="text-2xl font-extrabold text-[#082028] mt-1">Bajo Cotización</p>
                  <p className="text-[11px] text-[#049A41] font-bold mt-0.5">Propuesta Personalizada</p>
                </div>
              </div>

              {/* Pitch Deck Slide View */}
              <div className="bg-white border border-[#DCE4DF] rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-[#DCE4DF] pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#049A41] uppercase tracking-wider">
                      Ficha {activeSlideIndex + 1} de {selectedSupports.length}
                    </span>
                    <h3 className="text-base font-extrabold text-[#082028]">
                      {selectedSupports[activeSlideIndex]?.name}
                    </h3>
                  </div>

                  {/* Navigation Slide Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={activeSlideIndex === 0}
                      onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                      className="px-3 py-1.5 bg-[#F7F9F7] border border-[#DCE4DF] rounded-lg text-xs font-bold text-[#082028] disabled:opacity-40"
                    >
                      Anterior
                    </button>
                    <button
                      disabled={activeSlideIndex === selectedSupports.length - 1}
                      onClick={() => setActiveSlideIndex(prev => Math.min(selectedSupports.length - 1, prev + 1))}
                      className="px-3 py-1.5 bg-[#F7F9F7] border border-[#DCE4DF] rounded-lg text-xs font-bold text-[#082028] disabled:opacity-40"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>

                {/* Active Slide Details */}
                {selectedSupports[activeSlideIndex] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="relative h-64 sm:h-80 bg-[#082028] rounded-xl overflow-hidden shadow-inner">
                      <SupportImage
                        src={selectedSupports[activeSlideIndex].imageUrl}
                        alt={selectedSupports[activeSlideIndex].name}
                        supportName={selectedSupports[activeSlideIndex].name}
                        supportType={selectedSupports[activeSlideIndex].type}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-[#082028]/90 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold backdrop-blur-xs">
                        {selectedSupports[activeSlideIndex].size}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-[#049A41] uppercase tracking-widest">
                          {selectedSupports[activeSlideIndex].type}
                        </span>
                        <h4 className="text-lg font-extrabold text-[#082028] mt-0.5">
                          {selectedSupports[activeSlideIndex].name}
                        </h4>
                        <p className="text-xs text-[#40515A] mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#049A41]" />
                          {selectedSupports[activeSlideIndex].address}
                        </p>
                      </div>

                      <p className="text-xs text-[#40515A] leading-relaxed bg-[#F7F9F7] p-3 rounded-xl border border-[#DCE4DF]">
                        {selectedSupports[activeSlideIndex].description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#E8F0E4] p-3 rounded-xl border border-[#049A41]/20">
                          <span className="text-[9px] uppercase font-extrabold text-[#082028]">Tráfico / Alcance</span>
                          <p className="font-bold text-[#049A41] mt-0.5">
                            {selectedSupports[activeSlideIndex].contactsCount || 'Consultar'}
                          </p>
                        </div>

                        <div className="bg-[#E8F0E4] p-3 rounded-xl border border-[#049A41]/20">
                          <span className="text-[9px] uppercase font-extrabold text-[#082028]">Geolocalización</span>
                          <p className="font-mono text-[10px] font-bold text-[#082028] mt-0.5">
                            {selectedSupports[activeSlideIndex].latitude.toFixed(4)}, {selectedSupports[activeSlideIndex].longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      {selectedSupports[activeSlideIndex].refPoints && (
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-[#64748B] tracking-wider block mb-1.5">
                            Puntos de Referencia Clave
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedSupports[activeSlideIndex].refPoints?.map((ref, idx) => (
                              <span key={idx} className="bg-[#F7F9F7] border border-[#DCE4DF] text-[#082028] text-[10px] font-medium px-2.5 py-1 rounded-lg">
                                {ref}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Full Selected List Overview */}
              <div className="bg-white border border-[#DCE4DF] p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-extrabold text-[#082028]">
                    Resumen de Cobertura Seleccionada ({selectedSupports.length})
                  </h4>
                  <button
                    onClick={clearSelection}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    Vaciar Selección
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedSupports.map((sup, idx) => {
                    const safeIdx = Math.min(activeSlideIndex, selectedSupports.length - 1);
                    const isSelectedCard = safeIdx === idx;
                    return (
                      <div
                        key={sup.id}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 relative group ${
                          isSelectedCard
                            ? 'bg-[#E8F0E4] border-[#049A41] shadow-xs'
                            : 'bg-[#F7F9F7] border-[#DCE4DF] hover:border-[#B9C7BF]'
                        }`}
                      >
                        <img
                          src={sup.imageUrl}
                          alt={sup.name}
                          className="w-12 h-12 object-cover rounded-lg shrink-0 border border-[#DCE4DF]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1 pr-6">
                          <p className="text-xs font-bold text-[#082028] truncate">{sup.name}</p>
                          <p className="text-[10px] text-[#40515A] truncate">{sup.address}</p>
                          <span className="text-[9px] text-[#049A41] font-bold uppercase mt-1 block">
                            {sup.type} • {sup.size}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSupportSelection(sup);
                            if (activeSlideIndex >= selectedSupports.length - 1 && activeSlideIndex > 0) {
                              setActiveSlideIndex(prev => prev - 1);
                            }
                          }}
                          className="absolute right-2 top-2 p-1 text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Quitar del Media Kit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action Footer CTA */}
              <div className="bg-[#082028] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#049A41]/40">
                <div>
                  <h4 className="text-sm font-extrabold text-white">¿Listo para presentar esta campaña?</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Envíe su selección de {selectedSupports.length} soportes directamente a nuestro departamento comercial para recibir el presupuesto oficial.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToQuote();
                  }}
                  className="px-6 py-3 bg-[#049A41] hover:bg-[#038537] text-[#082028] text-xs font-extrabold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Solicitar Cotización de este Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
