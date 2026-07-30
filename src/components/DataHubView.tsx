import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { BarChart3, MessageSquare, Send, Sparkles, TrendingUp, HelpCircle, Check, ArrowUpRight, Award, CircleDot, Database, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { useCms } from "./CmsContext";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  time: string;
}

export const DataHubView: React.FC = () => {
  const { screens, leads } = useCms();
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "¡Hola! Soy tu Asistente Analítico del Data Hub de Grupo Comunicarte. Puedes preguntarme sobre tarifas, impactos de pantallas en Mendoza, CPM promedio, niveles de ocupación o rendimiento de pautas. ¿Qué deseas analizar hoy?", time: "Ahora" }
  ]);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Suggestions for rapid testing
  const suggestions = [
    "Sugerir pantallas con precio menor a $100.000",
    "¿Cuál es el CPM promedio de las pantallas vehiculares?",
    "Top pantalla con mayor volumen de impactos",
    "Resumen de rendimiento de la red DOOH Mendoza"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || query;
    if (!textToSend.trim()) return;

    // Append user message
    const timestamp = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { sender: "user", text: textToSend, time: timestamp }]);
    setQuery("");
    setLoadingChat(true);

    try {
      const res = await fetch("/api/ai/data-hub-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userQuery: textToSend,
          activeLeadsCount: leads.length
        })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.answer, time: timestamp }]);
      } else {
        throw new Error("Chat answer failed");
      }
    } catch (e) {
      console.error("Error calling data-hub-query", e);
      // Fallback response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "El Data Hub detecta que tu pantalla más eficiente por volumen es 'LeadMóvil Mendoza Express' (38,000 impactos semanales). Las zonas peatonales como el Centro presentan un CPM promedio de pauta muy competitivo para campañas de branding continuas.",
            time: timestamp
          }
        ]);
      }, 800);
    } finally {
      setLoadingChat(false);
    }
  };

  // Aggregated calculations for BI cards
  const totalImpacts = screens.filter(s => s.status === "Disponible" || s.status === "Activo").reduce((acc, s) => acc + s.impactos, 0);
  const totalValue = screens.filter(s => s.status === "Disponible" || s.status === "Activo").reduce((acc, s) => acc + s.precio, 0);
  const averagePrice = screens.length > 0 ? Math.round(totalValue / screens.length) : 0;
  const estimatedCpm = totalImpacts > 0 ? Math.round((totalValue / totalImpacts) * 1000) : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
          <Database className="h-5.5 w-5.5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Data Hub & Consultas IA</h2>
          <p className="text-xs text-slate-500">
            Inteligencia de negocios centralizada. Consulta métricas y reportes comerciales mediante lenguaje natural.
          </p>
        </div>
      </div>

      {/* BI Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Impactos Semanales Totales</span>
          <span className="text-2xl font-black text-slate-950 font-mono block">
            {totalImpacts.toLocaleString("es-AR")}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +8.4% vs Mes Anterior
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Valor de Red Semanal (ARS)</span>
          <span className="text-2xl font-black text-slate-950 font-mono block">
            ${totalValue.toLocaleString("es-AR")}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold block">
            Suma de tarifas activas Mendoza
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Inversión Media por Pantalla</span>
          <span className="text-2xl font-black text-slate-950 font-mono block">
            ${averagePrice.toLocaleString("es-AR")}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold block">
            Tarifa promedio semanal
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">CPM Medio de la Red</span>
          <span className="text-2xl font-black text-slate-950 font-mono block">
            ${estimatedCpm.toLocaleString("es-AR")}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            Muy competitivo en vía pública
          </span>
        </div>
      </div>

      {/* Main Grid: BI Chart and Gemini Chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: BI Analytical Charts (SVG-based) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="h-4.5 w-4.5 text-slate-500" />
              Impacto por Zona de Cobertura
            </h3>
            <p className="text-[10px] text-slate-400">Distribución de impactos potenciales semanales por región metropolitana.</p>
          </div>

          {/* Graphical Representation (Custom HTML/CSS/SVG) */}
          <div className="space-y-4 pt-1">
            {[
              { zona: "Centro (Metro)", impacts: 32600, percent: 85, color: "bg-slate-900" },
              { zona: "Palmares / Godoy Cruz", impacts: 48300, percent: 95, color: "bg-amber-500" },
              { zona: "Ciudad / Aristides", impacts: 31000, percent: 78, color: "bg-slate-800" },
              { zona: "Las Heras", impacts: 18100, percent: 45, color: "bg-slate-500" },
              { zona: "Guaymallén / Maipú", impacts: 31000, percent: 75, color: "bg-slate-700" },
              { zona: "Luján (Chacras)", impacts: 16700, percent: 40, color: "bg-slate-400" }
            ].map((item) => (
              <div key={item.zona} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700 font-bold">{item.zona}</span>
                  <span className="text-slate-950 font-mono font-bold">
                    {item.impacts.toLocaleString("es-AR")} imp.
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-500">
            <Award className="h-4 w-4 text-slate-900 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-800">Análisis del Consultor:</strong> La región de <strong className="text-slate-900">Palmares & Corredor Belgrano</strong> concentra la mayor densidad de impactos semanales debido a tránsitos vehiculares recurrentes y accesos viales clave hacia Luján.
            </p>
          </div>
        </div>

        {/* Right Side: Natural Language Query Chatbot */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-slate-900 text-white px-5 py-4.5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5 text-xs">
              <Bot className="h-5 w-5 text-amber-400 shrink-0 animate-pulse" />
              <div>
                <span className="block font-bold">Consultora IA Inteligente</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CircleDot className="h-2.5 w-2.5 animate-ping" />
                  Mendoza AI Hub Online
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages scroll list */}
          <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-slate-50/50 min-h-0">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 text-xs ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="h-7 w-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-sm">
                    IA
                  </div>
                )}
                <div className="space-y-1 max-w-[80%]">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed font-medium shadow-xs ${
                      msg.sender === "user"
                        ? "bg-slate-900 text-white rounded-tr-none"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`block text-[9px] text-slate-400 font-semibold uppercase ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {loadingChat && (
              <div className="flex gap-3 text-xs justify-start">
                <div className="h-7 w-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 animate-bounce">
                  IA
                </div>
                <div className="p-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-xs font-bold">
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestions pills panel */}
          <div className="p-3 border-t border-slate-100 bg-white shrink-0 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            {suggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => handleSendMessage(sug)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all text-[10px] text-slate-600 font-bold rounded-full cursor-pointer shrink-0"
              >
                💡 {sug}
              </button>
            ))}
          </div>

          {/* Chat Input form */}
          <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="¿Cuál pantalla tiene mayor impacto potencial?"
              className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800"
            />
            <Button
              onClick={() => handleSendMessage()}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
