import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Menu, MonitorPlay, MoveRight, X, FileText } from "lucide-react";

const navLinks = [
  { name: "Inicio", path: "/" },
  { name: "Soportes", path: "/soportes" },
  { name: "Nosotros", path: "/nosotros" },
  { name: "Inventario", path: "/soportes" },
];

export const PmvVisualHome: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden bg-white text-black">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2" aria-label="Grupo Comunicarte - Inicio">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <MapPin className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">GRUPO COMUNICARTE</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                  {link.name}
                </Link>
              ))}
              <Link to="/mediakit" className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-semibold transition-colors">
                <FileText className="w-4 h-4" />
                Mediakit
              </Link>
            </nav>

            <button
              className="md:hidden p-2 -mr-2 text-gray-900"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 space-y-2 shadow-lg absolute w-full left-0">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-base font-medium text-gray-600 hover:text-black">
                {link.name}
              </Link>
            ))}
            <Link to="/mediakit" onClick={() => setMenuOpen(false)} className="w-full mt-3 inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-md text-sm font-semibold">
              <FileText className="w-4 h-4" />
              Mediakit
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col">
        <section className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-32 max-w-7xl mx-auto w-full flex flex-col items-start justify-center">
          <div className="inline-block px-3 py-1 mb-8 rounded-full bg-gray-100 border border-gray-200">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-600">Espacios Publicitarios Premium</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black max-w-4xl leading-[1.1] mb-8">
            Tu marca, en los lugares que todos ven.
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
            Espacios publicitarios estratégicos en Mendoza y Buenos Aires.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/contacto" className="inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-md text-lg font-semibold transition-colors">
              Hablar con el equipo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/soportes" className="inline-flex items-center justify-center gap-2 bg-white text-black border border-gray-300 hover:border-black px-6 py-3 rounded-md text-lg font-semibold transition-colors">
              Explorar inventario
            </Link>
          </div>
        </section>

        <section id="plazas" className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Elegí dónde querés estar</h2>
              <p className="text-gray-600 text-lg">Explorá nuestra cobertura geográfica en puntos clave del país.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[{ name: "Mendoza", detail: "18 soportes estratégicos incluyendo tradicionales y LED." }, { name: "Buenos Aires", detail: "10 soportes en ubicaciones de alto tránsito vehicular y peatonal." }].map((plaza) => (
                <Link key={plaza.name} to="/soportes" className="group flex flex-col items-start text-left bg-white p-10 rounded-2xl border border-gray-200 hover:border-black transition-colors shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plaza.name}</h3>
                  <p className="text-gray-500 mb-8">{plaza.detail}</p>
                  <span className="flex items-center text-sm font-semibold tracking-wide uppercase mt-auto gap-2 group-hover:gap-3 transition-all">Ver plaza <MoveRight className="w-4 h-4" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="bg-black text-white rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/10 border border-white/20">
                <MonitorPlay className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-widest uppercase">Innovación Dinámica</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">Tu mensaje también puede moverse.</h2>
              <div className="space-y-4 mb-10 text-gray-300">
                <p><span className="font-semibold text-white">LED Móvil Mendoza</span></p>
                <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-gray-500 rounded-full" />Lunes a Viernes</p>
                <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-gray-500 rounded-full" />09:00–20:00</p>
                <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-gray-500 rounded-full" />Duración del recorrido: 4 horas</p>
              </div>
              <Link to="/soportes" className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 px-5 py-3 rounded-md font-semibold transition-colors">
                Ver recorrido
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="w-full md:w-1/3 aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-20" aria-hidden="true">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none" strokeWidth="1" strokeDasharray="4 4">
                  <path d="M10,90 Q30,10 50,50 T90,10" />
                </svg>
              </div>
              <MonitorPlay className="w-24 h-24 text-white/50" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Encontrá el soporte adecuado para tu marca</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Explorá nuestra cobertura geográfica y descubrí dónde están nuestros soportes.</p>
          <Link to="/soportes" className="inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-md text-lg font-semibold transition-colors">
            Explorar mapa
          </Link>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4"><div className="w-6 h-6 bg-black rounded flex items-center justify-center"><MapPin className="text-white w-3.5 h-3.5" /></div><span className="font-bold text-lg tracking-tight">GRUPO COMUNICARTE</span></div>
            <p className="text-gray-500 text-sm">Mendoza • Buenos Aires</p>
          </div>
          <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            {navLinks.map((link) => <Link key={link.name} to={link.path} className="text-sm font-medium text-gray-500 hover:text-black">{link.name}</Link>)}
            <Link to="/mediakit" className="text-sm font-medium text-gray-500 hover:text-black">Mediakit</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};
