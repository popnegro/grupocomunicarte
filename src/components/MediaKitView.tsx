import React, { useState } from "react";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { useCms } from "./CmsContext";
import { isScreenAvailableForWeeks } from "../utils/availability";

interface MediaKitViewProps {
  slug: string;
  addLead: (lead: { name: string; email: string; company: string; source: string; status: "new" | "contacted" | "qualified" | "closed"; value?: number; message?: string }) => Promise<unknown>;
}

export const MediaKitView: React.FC<MediaKitViewProps> = ({ slug, addLead }) => {
  const { screens, cart, toggleCart, clearCart, weeks, setWeeks, occupancyMatrix } = useCms();
  const [mediaKitDownloading, setMediaKitDownloading] = useState(false);
  const [mediaKitSuccess, setMediaKitSuccess] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestClient, setRequestClient] = useState({ name: "", email: "", company: "", whatsapp: "", startDate: "", endDate: "", message: "" });
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [generalRequest, setGeneralRequest] = useState({ name: "", company: "", whatsapp: "", email: "", message: "" });
  const [generalSubmitting, setGeneralSubmitting] = useState(false);
  const [generalSubmitted, setGeneralSubmitted] = useState(false);

  const selectedScreens = cart
    .map((id) => screens.find((screen) => screen.id === id))
    .filter((screen): screen is NonNullable<typeof screen> => Boolean(screen));

  const selectedIdsNotFound = cart.filter((id) => !screens.some((screen) => screen.id === id));
  const selectedUnavailable = selectedScreens.filter((screen) => !isScreenAvailableForWeeks(screen, occupancyMatrix, weeks));
  const selectedAvailable = selectedScreens.filter((screen) => isScreenAvailableForWeeks(screen, occupancyMatrix, weeks));
  const totalWeekly = selectedAvailable.reduce((total, screen) => total + screen.precio, 0);
  const estimatedTotal = totalWeekly * weeks;
  const hasCommercialBlockers = selectedUnavailable.length > 0 || selectedIdsNotFound.length > 0;

  const handleGeneralRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !generalRequest.name.trim() ||
      !generalRequest.company.trim() ||
      !generalRequest.whatsapp.trim() ||
      !generalRequest.email.trim() ||
      !generalRequest.message.trim()
    ) return;

    setGeneralSubmitting(true);
    setRequestError(null);
    try {
      await addLead({
        name: generalRequest.name.trim(),
        email: generalRequest.email.trim(),
        company: generalRequest.company.trim(),
        source: "Media Kit general - Stitch",
        status: "new",
        value: 0,
        message: JSON.stringify({
          type: "media_kit_general_request",
          whatsapp: generalRequest.whatsapp.trim(),
          message: generalRequest.message.trim(),
        }),
      });
      setGeneralSubmitted(true);
    } catch (error) {
      console.error("[MediaKitView] General Media Kit request failed:", error);
      setRequestError("No pudimos enviar la solicitud. Intenta nuevamente.");
    } finally {
      setGeneralSubmitting(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !requestClient.name.trim() ||
      !requestClient.email.trim() ||
      !requestClient.company.trim() ||
      !requestClient.whatsapp.trim() ||
      !requestClient.startDate ||
      !requestClient.endDate ||
      cart.length === 0
    ) return;

    if (requestClient.endDate < requestClient.startDate) {
      setRequestError("La fecha hasta no puede ser anterior a la fecha desde.");
      return;
    }

    setRequestSubmitting(true);
    setRequestError(null);
    try {
      const campaignDetails = selectedAvailable.map((screen) => ({
        id: screen.id,
        nombre: screen.nombre,
        zona: screen.zona,
        ciudad: screen.ciudad || "Mendoza",
        tipo: screen.tipo,
        precioSemanal: screen.precio,
      }));

      await addLead({
        name: requestClient.name.trim(),
        email: requestClient.email.trim(),
        company: requestClient.company.trim(),
        source: `Media Kit - ${cart.length} soporte(s) - ${weeks} semana(s)`,
        status: "qualified",
        value: estimatedTotal,
        message: JSON.stringify({
          type: "media_kit_request",
          whatsapp: requestClient.whatsapp.trim(),
          startDate: requestClient.startDate,
          endDate: requestClient.endDate,
          message: requestClient.message.trim(),
          weeks,
          totalWeekly,
          estimatedTotal,
          screens: campaignDetails,
        }),
      });
      setRequestSubmitted(true);
      setShowRequestForm(false);
    } catch (error) {
      console.error("[MediaKitView] Request submission failed:", error);
      setRequestError("No pudimos enviar la solicitud. Intenta nuevamente.");
    } finally {
      setRequestSubmitting(false);
    }
  };


  const handleDownloadMediaKit = () => {
    setMediaKitDownloading(true);
    setTimeout(() => {
      setMediaKitDownloading(false);
      setMediaKitSuccess(true);
      setTimeout(() => setMediaKitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Selected supports */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 border-b border-slate-150 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tu selección</span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Media Kit de campaña</h2>
            <p className="text-slate-500 text-xs mt-1">
              Los soportes que agregues desde el Explorador, el mapa o las Ubicaciones Destacadas aparecen aquí automáticamente.
            </p>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Vaciar selección
            </button>
          )}
        </div>

        {selectedScreens.length === 0 ? (
          <div className="bg-[#f3fcef] -mx-4 sm:-mx-5 md:-mx-6 -mb-4 sm:-mb-5 md:-mb-6 px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-10">
            <div className="mx-auto w-full max-w-2xl rounded-xl border border-[#bccbb9] bg-white p-4 sm:p-6 md:p-8 shadow-sm">
              <div className="mb-8 text-center">
                <h3 className="font-['Geist'] text-[28px] leading-9 font-semibold text-[#161d16]">
                  Solicitar Media Kit
                </h3>
                <p className="mt-2 font-['Inter'] text-sm md:text-base leading-6 text-[#3d4a3d]">
                  Completa el formulario para recibir nuestra propuesta comercial y catálogo completo.
                </p>
              </div>

              {generalSubmitted ? (
                <div className="rounded-lg border border-[#6bff8f] bg-[#edf6ea] px-5 py-6 text-center">
                  <LucideIcons.CheckCircle className="mx-auto h-8 w-8 text-[#006e2f]" />
                  <h4 className="mt-3 font-['Geist'] text-lg font-semibold text-[#004b1e]">
                    Solicitud enviada
                  </h4>
                  <p className="mt-1 font-['Inter'] text-sm text-[#3d4a3d]">
                    Recibimos tus datos. Nuestro equipo comercial se pondrá en contacto contigo.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleGeneralRequestSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="media-kit-general-name" className="mb-1 block font-['Inter'] text-sm font-medium text-[#161d16]">
                      Nombre completo
                    </label>
                    <input
                      id="media-kit-general-name"
                      required
                      type="text"
                      placeholder="Tu nombre y apellido"
                      value={generalRequest.name}
                      onChange={(e) => setGeneralRequest({ ...generalRequest, name: e.target.value })}
                      className="w-full rounded-md border-[#bccbb9] bg-white px-4 py-2.5 font-['Inter'] text-sm text-[#161d16] shadow-sm outline-none transition-colors focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>

                  <div>
                    <label htmlFor="media-kit-general-company" className="mb-1 block font-['Inter'] text-sm font-medium text-[#161d16]">
                      Empresa
                    </label>
                    <input
                      id="media-kit-general-company"
                      required
                      type="text"
                      placeholder="Nombre de tu empresa"
                      value={generalRequest.company}
                      onChange={(e) => setGeneralRequest({ ...generalRequest, company: e.target.value })}
                      className="w-full rounded-md border-[#bccbb9] bg-white px-4 py-2.5 font-['Inter'] text-sm text-[#161d16] shadow-sm outline-none transition-colors focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>

                  <div>
                    <label htmlFor="media-kit-general-whatsapp" className="mb-1 block font-['Inter'] text-sm font-medium text-[#161d16]">
                      WhatsApp
                    </label>
                    <input
                      id="media-kit-general-whatsapp"
                      required
                      type="tel"
                      placeholder="+54 9..."
                      value={generalRequest.whatsapp}
                      onChange={(e) => setGeneralRequest({ ...generalRequest, whatsapp: e.target.value })}
                      className="w-full rounded-md border-[#bccbb9] bg-white px-4 py-2.5 font-['Inter'] text-sm text-[#161d16] shadow-sm outline-none transition-colors focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>

                  <div>
                    <label htmlFor="media-kit-general-email" className="mb-1 block font-['Inter'] text-sm font-medium text-[#161d16]">
                      Email
                    </label>
                    <input
                      id="media-kit-general-email"
                      required
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={generalRequest.email}
                      onChange={(e) => setGeneralRequest({ ...generalRequest, email: e.target.value })}
                      className="w-full rounded-md border-[#bccbb9] bg-white px-4 py-2.5 font-['Inter'] text-sm text-[#161d16] shadow-sm outline-none transition-colors focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>

                  <div>
                    <label htmlFor="media-kit-general-message" className="mb-1 block font-['Inter'] text-sm font-medium text-[#161d16]">
                      Mensaje
                    </label>
                    <textarea
                      id="media-kit-general-message"
                      required
                      rows={4}
                      placeholder="Cuéntanos sobre tu campaña o consulta específica"
                      value={generalRequest.message}
                      onChange={(e) => setGeneralRequest({ ...generalRequest, message: e.target.value })}
                      className="w-full resize-none rounded-md border-[#bccbb9] bg-white px-4 py-2.5 font-['Inter'] text-sm leading-5 text-[#161d16] shadow-sm outline-none transition-colors focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>

                  {requestError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {requestError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={generalSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#006e2f] px-6 py-3 font-['Inter'] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#004b1e] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {generalSubmitting ? "Enviando..." : "Enviar"}
                      {!generalSubmitting && <LucideIcons.Send className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#f3fcef] -mx-4 sm:-mx-5 md:-mx-6 -mb-4 sm:-mb-5 md:-mb-6 px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-10">
            <div className="mx-auto w-full max-w-[620px] rounded-2xl border border-[#bccbb9] bg-[#f3fcef] p-4 sm:p-5 md:p-8 shadow-none">
              <div className="mb-6 sm:mb-7 md:mb-8 text-left md:text-center">
                <h3 className="font-['Geist'] text-[28px] sm:text-[30px] md:text-[32px] leading-[1.08] font-semibold tracking-tight text-[#161d16]">
                  Solicitud de Media Kit
                </h3>
                <p className="mt-2 sm:mt-3 font-['Inter'] text-sm sm:text-base md:text-sm leading-6 text-[#3d4a3d]">
                  Completa el formulario para recibir nuestra propuesta comercial y catálogo completo.
                </p>
              </div>

              {requestSubmitted ? (
                <div className="rounded-xl border border-[#6bff8f] bg-[#edf6ea] px-5 py-7 text-center">
                  <LucideIcons.CheckCircle className="mx-auto h-9 w-9 text-[#006e2f]" />
                  <h4 className="mt-3 font-['Geist'] text-xl font-semibold text-[#004b1e]">
                    Solicitud enviada
                  </h4>
                  <p className="mt-2 font-['Inter'] text-sm leading-6 text-[#3d4a3d]">
                    Recibimos tus datos y la selección de soportes. Nuestro equipo comercial se pondrá en contacto contigo.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="media-kit-name" className="mb-1.5 block font-['Inter'] text-sm font-medium text-[#161d16]">
                      Nombre completo <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="media-kit-name"
                      required
                      type="text"
                      placeholder="Tu nombre y apellido"
                      value={requestClient.name}
                      onChange={(e) => setRequestClient({ ...requestClient, name: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#bccbb9] bg-white px-4 font-['Inter'] text-sm text-[#161d16] shadow-sm outline-none transition-colors focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>

                  <div>
                    <label htmlFor="media-kit-company" className="mb-1.5 block font-['Inter'] text-sm font-medium text-[#161d16]">
                      Empresa <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="media-kit-company"
                      required
                      type="text"
                      placeholder="Nombre de tu empresa"
                      value={requestClient.company}
                      onChange={(e) => setRequestClient({ ...requestClient, company: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#bccbb9] bg-white px-4 font-['Inter'] text-sm text-[#161d16] shadow-sm outline-none transition-colors focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>

                  <div>
                    <label htmlFor="media-kit-whatsapp" className="mb-1.5 block font-['Inter'] text-sm font-medium text-[#161d16]">
                      WhatsApp <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="media-kit-whatsapp"
                      required
                      type="tel"
                      placeholder="+54 9 11 1234-5678"
                      value={requestClient.whatsapp}
                      onChange={(e) => setRequestClient({ ...requestClient, whatsapp: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#bccbb9] bg-white px-4 font-['Inter'] text-sm text-[#161d16] shadow-sm outline-none transition-colors focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>

                  <div>
                    <label htmlFor="media-kit-email" className="mb-1.5 block font-['Inter'] text-sm font-medium text-[#161d16]">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="media-kit-email"
                      required
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={requestClient.email}
                      onChange={(e) => setRequestClient({ ...requestClient, email: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#bccbb9] bg-white px-4 font-['Inter'] text-sm text-[#161d16] shadow-sm outline-none transition-colors focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="font-['Inter'] text-sm font-medium text-[#161d16]">
                        Pantallas seleccionadas
                      </label>
                      <span className="font-['Inter'] text-xs font-semibold text-[#006e2f]">{selectedScreens.length}</span>
                    </div>
                    <div className="space-y-2 rounded-md border border-[#bccbb9] bg-[#edf6ea] p-2.5 sm:p-3">
                      {selectedScreens.map((screen) => (
                        <div key={screen.id} className="flex items-center gap-3">
                          <LucideIcons.CircleCheck className="h-5 w-5 shrink-0 text-[#008a3a]" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-['Inter'] text-sm font-medium text-[#161d16]">{screen.nombre}</p>
                            <p className="truncate font-['Inter'] text-xs text-[#536053]">{screen.zona} · {screen.ciudad || "Mendoza"}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleCart(screen.id)}
                            aria-label={`Quitar ${screen.nombre} del Media Kit`}
                            className="shrink-0 p-1 text-[#3d4a3d] transition-colors hover:text-red-600"
                          >
                            <LucideIcons.X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 font-['Inter'] text-sm font-medium text-[#161d16]">
                      Fechas de interés <span className="text-red-600">*</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="media-kit-start" className="mb-1 block font-['Inter'] text-[11px] font-semibold uppercase tracking-wider text-[#637063]">Desde</label>
                        <input
                          id="media-kit-start"
                          required
                          type="date"
                          value={requestClient.startDate}
                          onChange={(e) => setRequestClient({ ...requestClient, startDate: e.target.value })}
                          className="h-11 w-full rounded-md border border-[#657165] bg-white px-3 font-['Inter'] text-sm text-[#161d16] outline-none focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                        />
                      </div>
                      <div>
                        <label htmlFor="media-kit-end" className="mb-1 block font-['Inter'] text-[11px] font-semibold uppercase tracking-wider text-[#637063]">Hasta</label>
                        <input
                          id="media-kit-end"
                          required
                          type="date"
                          min={requestClient.startDate || undefined}
                          value={requestClient.endDate}
                          onChange={(e) => setRequestClient({ ...requestClient, endDate: e.target.value })}
                          className="h-11 w-full rounded-md border border-[#657165] bg-white px-3 font-['Inter'] text-sm text-[#161d16] outline-none focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="block">
                    <label htmlFor="media-kit-message" className="mb-1.5 block font-['Inter'] text-sm font-medium text-[#161d16]">Mensaje</label>
                    <textarea
                      id="media-kit-message"
                      rows={4}
                      placeholder="¿En qué podemos ayudarte?"
                      value={requestClient.message}
                      onChange={(e) => setRequestClient({ ...requestClient, message: e.target.value })}
                      className="w-full resize-none rounded-md border border-[#bccbb9] bg-white px-4 py-3 font-['Inter'] text-sm leading-5 text-[#161d16] shadow-sm outline-none transition-colors focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f]"
                    />
                  </div>

                  {requestError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {requestError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={requestSubmitting || hasCommercialBlockers || selectedAvailable.length === 0}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#006e2f] px-6 font-['Inter'] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#004b1e] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {requestSubmitting ? "Enviando..." : "Enviar"}
                    {!requestSubmitting && <LucideIcons.Send className="h-[18px] w-[18px]" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Official media kit */}
      <div className="bg-slate-950 text-white rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 relative overflow-hidden">
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
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 space-y-5 md:space-y-6 shadow-xs">
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
