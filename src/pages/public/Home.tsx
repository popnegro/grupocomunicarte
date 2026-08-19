import { Link } from 'react-router-dom';
import { Button, buttonStyles } from '../../components/ui/Button';
import { ArrowRight, MapPin, MonitorPlay, MoveRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative overflow-hidden border-b border-gray-100 min-h-[620px] flex items-center">
        <div className="absolute inset-0 bg-white" aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]" aria-hidden="true">
          <img src="/images/home.webp" alt="" className="h-full w-full object-cover object-center lg:object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10 lg:from-white lg:via-white/55 lg:to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 mb-8 rounded-full bg-gray-100 border border-gray-200">
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-600">Espacios Publicitarios Premium</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black max-w-4xl leading-[1.1] mb-8">Tu marca, en los lugares que todos ven.</h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">Espacios publicitarios estratégicos en Mendoza y Buenos Aires.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a href="mailto:ventas@grupocomunicarte.com" className={buttonStyles({ size: 'lg', className: 'text-lg' })}>Hablar con el equipo<ArrowRight className="w-5 h-5" /></a>
              <Link to="/inventario" className={buttonStyles({ variant: 'outline', size: 'lg', className: 'text-lg' })}>Explorar inventario</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="plazas" className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16"><h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Elegí dónde querés estar</h2><p className="text-gray-600 text-lg">Explorá nuestra cobertura geográfica en puntos clave del país.</p></div>
          <div className="grid md:grid-cols-2 gap-8">
            {[['Mendoza','18 soportes estratégicos incluyendo tradicionales y LED.','mendoza'],['Buenos Aires','10 soportes en ubicaciones de alto tránsito vehicular y peatonal.','buenos-aires']].map(([name,description,city]) => <Link key={city} to={`/inventario?plaza=${city}`} className="group flex flex-col items-start text-left bg-white p-10 rounded-2xl border border-gray-200 hover:border-black transition-colors shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"><div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors"><MapPin className="w-6 h-6" /></div><h3 className="text-2xl font-bold mb-2">{name}</h3><p className="text-gray-500 mb-8">{description}</p><span className="flex items-center text-sm font-semibold tracking-wide uppercase mt-auto gap-2 group-hover:gap-3 transition-all">Ver plaza <MoveRight className="w-4 h-4" /></span></Link>)}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-black text-white rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/10 border border-white/20"><MonitorPlay className="w-4 h-4" /><span className="text-xs font-semibold tracking-widest uppercase">Innovación Dinámica</span></div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">Tu mensaje también puede moverse.</h2>
            <div className="space-y-4 mb-10 text-gray-300"><p><span className="font-semibold text-white">LED Móvil Mendoza</span></p><p>• Lunes a Viernes</p><p>• 09:00–20:00</p><p>• Duración del recorrido: 4 horas</p></div>
            <Link to="/inventario?tipo=led_movil"><Button variant="secondary" className="bg-white text-black hover:bg-gray-100">Ver recorrido<ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative"><div className="absolute inset-0 flex items-center justify-center opacity-20" aria-hidden="true"><svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none" strokeWidth="1" strokeDasharray="4 4"><path d="M10,90 Q30,10 50,50 T90,10" /></svg></div><MonitorPlay className="w-24 h-24 text-white/50" aria-hidden="true" /></div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100 text-center bg-[url('/brand/pattern-light.webp')] bg-repeat"><div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl px-6 py-12"><h2 className="text-3xl font-bold tracking-tight mb-4">Encontrá el soporte adecuado para tu marca</h2><p className="text-gray-600 mb-8 max-w-2xl mx-auto">Explorá nuestra cobertura geográfica y descubrí dónde están nuestros soportes.</p><Link to="/inventario" className={buttonStyles({ size: 'lg', className: 'text-lg inline-flex' })}>Explorar mapa</Link></div></section>
    </div>
  );
}
