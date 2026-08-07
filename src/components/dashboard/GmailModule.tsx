import React, { useState, useEffect } from "react";
import { 
  Mail, Send, Search, RefreshCw, User, Calendar, 
  ArrowLeft, ExternalLink, Lock, AlertCircle, CheckCircle,
  Loader, Inbox, ArrowUpRight, MessageSquare, Plus, Check, Trash
} from "lucide-react";
import { useToast } from "../ui/Toast";
import { safeFetchJson } from "../../lib/apiClient";

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  labelIds: string[];
}

interface DetailedMessage extends GmailMessage {
  html?: string;
  text?: string;
}

interface GmailModuleProps {
  token: string | null;
}

export const GmailModule: React.FC<GmailModuleProps> = ({ token }) => {
  const { toast } = useToast();
  
  // Connection state
  const [connected, setConnected] = useState<boolean | null>(null);
  const [authUrl, setAuthUrl] = useState<string>("");
  const [connecting, setConnecting] = useState(false);

  // Email state
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Detailed view
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<DetailedMessage | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Compose / Send modal state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Check connection status
  const checkConnection = async () => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; connected?: boolean; }>("/api/auth/google/status", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && res.data?.connected) {
        setConnected(true);
        fetchMessages();
      } else {
        setConnected(false);
        fetchAuthUrl();
      }
    } catch (err) {
      setConnected(false);
    }
  };

  // Fetch Google OAuth URL
  const fetchAuthUrl = async () => {
    if (!token) return;
    try {
      const res = await safeFetchJson<{ success: boolean; url?: string }>("/api/auth/google/url", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && res.data?.url) {
        setAuthUrl(res.data.url);
      }
    } catch (err) {
      // Ignored gracefully
    }
  };

  // Fetch inbox messages
  const fetchMessages = async (query = "") => {
    if (!token) return;
    setLoadingInbox(true);
    try {
      const url = query 
        ? `/api/gmail/messages?q=${encodeURIComponent(query)}` 
        : "/api/gmail/messages";

      const res = await safeFetchJson<{ success: boolean; data?: GmailMessage[]; needsAuth?: boolean; error?: string | { message: string }; isRateLimited?: boolean }>(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setMessages(res.data.data || []);
      } else {
        if (res.data?.needsAuth || res.status === 401) {
          setConnected(false);
          fetchAuthUrl();
        } else if (res.isRateLimited) { // Access directly from ApiResponse
          toast.error("Límite de peticiones alcanzado. Reintentando en unos segundos.");
        } else if (res.error) { // Access directly from ApiResponse
          const errorMessage = typeof res.error === 'object' 
            ? res.error.message 
            : res.error;

          toast.error(errorMessage || "No se pudieron obtener los correos.", "Error de Bandeja");
        }
      }
    } catch (err) {
      toast.error("Error de red al cargar la bandeja de entrada.");
    } finally {
      setLoadingInbox(false);
    }
  };

  // Fetch individual message details
  const fetchMessageDetail = async (id: string) => {
    if (!token) return;
    setLoadingDetail(true);
    setSelectedMessageId(id);
    setSelectedMessage(null);
    try { // Corrected type for error
      const res = await safeFetchJson<{ success: boolean; data?: DetailedMessage; error?: string | { message: string } }>(`/api/gmail/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && res.data.data) {
        setSelectedMessage(res.data.data);
      } else {
        const errorMessage = typeof res.error === 'object' ? res.error.message : res.error // Access directly from ApiResponse
        toast.error(errorMessage || "No se pudo cargar el detalle del correo.", "Error de Lectura");
      }
    } catch (err) {
      toast.error("Error al cargar el contenido del correo.");
    } finally {
      setLoadingDetail(false);
    }
  };

  // Send email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!composeTo || !composeSubject || !composeBody) {
      toast.error("Por favor completa el destinatario, asunto y cuerpo del mensaje.");
      return;
    }

    setSendingEmail(true);
    try {
      const res = await safeFetchJson<{ success: boolean; error?: string | { message: string } }>("/api/gmail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          body: composeBody.replace(/\n/g, "<br/>") // simple linebreaks replacement for html email
        })
      });

      if (res.data?.success) {
        toast.success(`Correo enviado con éxito a ${composeTo}`);
        setIsComposeOpen(false);
        setComposeTo("");
        setComposeSubject("");
        setComposeBody("");
        // Reload messages after brief delay
        setTimeout(() => fetchMessages(searchQuery), 1000);
      } else {
        const errorMessage = typeof res.error === 'object' ? res.error.message : res.error // Access directly from ApiResponse
        toast.error(errorMessage || "Error al enviar el correo.", "Fallo de Envío");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      toast.error("Error de red al intentar enviar el correo.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Handle reply setup
  const setupReply = (original: DetailedMessage) => {
    // Extract reply recipient
    let replyTo = original.from;
    const match = original.from.match(/<([^>]+)>/);
    if (match && match[1]) {
      replyTo = match[1];
    }

    setComposeTo(replyTo);
    setComposeSubject(original.subject.startsWith("Re:") ? original.subject : `Re: ${original.subject}`);
    setComposeBody(`\n\n--- El ${original.date}, ${original.from} escribió:\n> ${original.snippet || ""}`);
    setIsComposeOpen(true);
  };

  useEffect(() => {
    checkConnection();
  }, [token]);

  // Render connection screen
  if (connected === null) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center font-sans">
        <Loader className="h-8 w-8 animate-spin text-[#06434a]" />
        <p className="mt-3 text-xs font-bold text-stone-500 uppercase tracking-widest">Sincronizando estado de Gmail...</p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-8 shadow-xs text-center space-y-5 max-w-2xl mx-auto">
          <div className="mx-auto h-12 w-12 rounded-full bg-stone-50 border border-stone-150 flex items-center justify-center text-[#06434a]">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">Vincular Bandeja de Entrada Gmail</h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
              Para ver tus correos, responder a anunciantes y enviar propuestas MediaKit directamente a través de tu cuenta de Gmail, necesitas autorizar la vinculación segura de Google.
            </p>
          </div>
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl text-left text-xs text-stone-600 space-y-2">
            <p className="font-extrabold text-stone-800 uppercase text-[9px] tracking-wider">Permisos Requeridos:</p>
            <ul className="list-disc pl-5 space-y-1 text-stone-500 font-medium">
              <li>Lectura de hilos de correo y mensajes (para listar y mostrar consultas de clientes).</li>
              <li>Envío de correos desde tu dirección asociada (para despachar propuestas).</li>
            </ul>
          </div>
          {authUrl ? (
            <a
              href={authUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                setConnecting(true);
                // Poll connection status every 3 seconds to auto-refresh once they log in
                let checkCount = 0;
                const interval = setInterval(async () => {
                  checkCount++;
                  if (checkCount > 20) {
                    clearInterval(interval);
                    setConnecting(false);
                    return;
                  }
                  try {
                    const res = await safeFetchJson<{ success: boolean; connected?: boolean; }>("/api/auth/google/status", {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data?.success && res.data?.connected) {
                      setConnected(true);
                      setConnecting(false);
                      clearInterval(interval);
                      fetchMessages();
                    }
                  } catch (e) {}
                }, 5000);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider text-white bg-[#06434a] hover:bg-[#05353b] rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              {connecting ? "Esperando Autorización..." : "Vincular Cuenta de Google"}
            </a>
          ) : (
            <div className="text-xs text-rose-600 font-bold">
              Configurando parámetros de red... Por favor, reintenta en un momento.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* 1. Module Header */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1.5 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-emerald-800 bg-emerald-50 uppercase tracking-widest border border-emerald-200/50">
            <CheckCircle className="h-3 w-3 text-emerald-600" /> Cuenta Gmail Vinculada
          </span>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Bandeja de Correo Integrada</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Administra tus comunicaciones comerciales, responde propuestas y gestiona leads directamente desde la consola oficial utilizando la API segura de Gmail.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchMessages(searchQuery)}
            disabled={loadingInbox}
            className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors text-stone-500 hover:text-stone-800 cursor-pointer"
            title="Refrescar bandeja"
          >
            <RefreshCw className={`h-4 w-4 ${loadingInbox ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setComposeTo("");
              setComposeSubject("");
              setComposeBody("");
              setIsComposeOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#06434a] hover:bg-[#05353b] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Redactar Correo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Message List */}
        <div className="lg:col-span-5 bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs flex flex-col min-h-[500px]">
          
          {/* Search Box */}
          <div className="p-4 border-b border-stone-150">
            <form onSubmit={(e) => { e.preventDefault(); fetchMessages(searchQuery); }} className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar correos (ej: lead, cotización)..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#06434a]/10 focus:border-[#06434a] transition-all"
              />
            </form>
          </div>

          {/* Messages list body */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 max-h-[600px]">
            {loadingInbox ? (
              <div className="p-12 text-center space-y-3">
                <Loader className="h-6 w-6 animate-spin text-stone-400 mx-auto" />
                <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Cargando bandeja de entrada...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center text-stone-400 space-y-2">
                <Inbox className="h-8 w-8 text-stone-300 mx-auto" />
                <p className="text-xs font-bold text-stone-600">No hay correos para mostrar</p>
                <p className="text-[10px] leading-relaxed max-w-[200px] mx-auto">Prueba refrescando o ingresando otro término de búsqueda.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessageId === msg.id;
                // Parse date string (often RFC 2822 header format like "Wed, 5 Aug 2026 14:15:22 -0300")
                const displayDate = () => {
                  try {
                    const parsed = new Date(msg.date);
                    if (isNaN(parsed.getTime())) return msg.date.split(",")[1]?.trim() || msg.date;
                    return parsed.toLocaleDateString("es-AR", { day: "numeric", month: "short" }) + " " + parsed.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
                  } catch (e) {
                    return msg.date;
                  }
                };

                return (
                  <div
                    key={msg.id}
                    onClick={() => fetchMessageDetail(msg.id)}
                    className={`p-4 text-left transition-all cursor-pointer space-y-1.5 ${
                      isSelected 
                        ? "bg-[#06434a]/5 border-l-4 border-[#06434a] pl-3" 
                        : "hover:bg-stone-50/50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-extrabold text-[#06434a] truncate max-w-[70%]">
                        {msg.from.split("<")[0].trim() || msg.from}
                      </span>
                      <span className="text-[9px] font-bold text-stone-400 whitespace-nowrap">
                        {displayDate()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-800 truncate leading-snug">
                      {msg.subject}
                    </h4>

                    <p className="text-[10px] text-stone-500 font-medium line-clamp-2 leading-relaxed">
                      {msg.snippet}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Reader Pane */}
        <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden min-h-[500px] flex flex-col justify-between">
          {selectedMessageId ? (
            loadingDetail ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <Loader className="h-7 w-7 animate-spin text-[#06434a] mb-2" />
                <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Descargando contenido del correo...</p>
              </div>
            ) : selectedMessage ? (
              <div className="flex-1 flex flex-col justify-between h-full">
                
                {/* Header Information Pane */}
                <div className="p-5 border-b border-stone-150 bg-stone-50/40 text-left space-y-3 shrink-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-extrabold text-stone-900 leading-snug">
                      {selectedMessage.subject}
                    </h3>
                    <button
                      onClick={() => setupReply(selectedMessage)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Responder
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-stone-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                      <span>De: <strong className="text-stone-700">{selectedMessage.from}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium md:justify-end">
                      <Calendar className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                      <span>Fecha: <strong className="text-stone-700">{selectedMessage.date}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Body Content - Renders HTML or falls back to text securely */}
                <div className="flex-1 p-6 overflow-y-auto max-h-[500px] text-left">
                  {selectedMessage.html ? (
                    // Secure preview inside shadow box or clean sandboxed iframe style, but for simplicity we render inside parsed div
                    <div 
                      className="text-stone-700 text-xs leading-relaxed space-y-3 prose max-w-none break-words"
                      dangerouslySetInnerHTML={{ 
                        __html: selectedMessage.html
                          // strip malicious script elements for safety (basic sanitize)
                          .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
                      }} 
                    />
                  ) : (
                    <div className="text-stone-700 text-xs font-medium leading-relaxed whitespace-pre-wrap font-mono bg-stone-50 p-4 rounded-xl border border-stone-200/50">
                      {selectedMessage.text}
                    </div>
                  )}
                </div>

                {/* Footer Pane */}
                <div className="p-4 border-t border-stone-100 bg-stone-50/20 flex justify-between items-center text-[10px] text-stone-400 font-medium shrink-0">
                  <span>ID de Mensaje: {selectedMessage.id.slice(0, 16)}...</span>
                  <div className="flex gap-2 font-bold uppercase tracking-wider text-[9px]">
                    {selectedMessage.labelIds.slice(0, 3).map(lbl => (
                      <span key={lbl} className="bg-stone-150 text-stone-600 px-1.5 py-0.5 rounded">
                        {lbl}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-stone-400">
                <AlertCircle className="h-8 w-8 text-rose-400 mb-2" />
                <p className="text-xs font-bold text-stone-700">Error de Sincronización</p>
                <p className="text-[10px]">No se pudo cargar el mensaje. Reintente más tarde.</p>
              </div>
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-stone-400 text-center">
              <Mail className="h-10 w-10 text-stone-300 mb-2" />
              <p className="text-xs font-bold text-stone-600 uppercase tracking-wide">Visor de Correo</p>
              <p className="text-[10px] max-w-[250px] mx-auto mt-1 leading-relaxed">Selecciona un mensaje de la bandeja para leer el contenido detallado y responder directamente.</p>
            </div>
          )}
        </div>

      </div>

      {/* 2. Compose New Email / Reply Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-100 p-4 animate-fade-in text-left">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl animate-scale-up">
            
            {/* Modal Title Bar */}
            <div className="p-5 border-b border-stone-150 bg-stone-50/60 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Send className="h-4.5 w-4.5 text-[#06434a]" />
                <h3 className="text-xs font-black uppercase text-stone-800 tracking-wider">
                  Enviar Correo Gmail
                </h3>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 hover:bg-stone-150 rounded text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSendEmail} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">Destinatario (Email)</label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="ejemplo@cliente.com"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06434a]/10 focus:border-[#06434a]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">Asunto</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Asunto del correo..."
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06434a]/10 focus:border-[#06434a]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">Cuerpo del Mensaje (HTML Soportado)</label>
                <textarea
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Redacta tu propuesta o respuesta comercial aquí..."
                  rows={8}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06434a]/10 focus:border-[#06434a] font-sans"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-xs font-bold hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#06434a] hover:bg-[#05353b] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:bg-stone-300"
                >
                  {sendingEmail ? (
                    <>
                      <Loader className="h-3.5 w-3.5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Enviar
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
