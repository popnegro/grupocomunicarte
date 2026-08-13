import { useNavigate } from 'react-router-dom';

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 text-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Líderes en comunicación exterior
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            En Grupo Comunicarte, transformamos espacios urbanos en poderosas plataformas de comunicación. Con más de 20 años de experiencia, conectamos marcas con audiencias a través de soportes publicitarios de alto impacto en Mendoza y Buenos Aires.
          </p>
        </div>

        <div className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="prose prose-lg text-slate-600">
            <h2>Nuestra Propuesta de Valor</h2>
            <p>
              Combinamos ubicaciones estratégicas con tecnología de vanguardia para garantizar la máxima visibilidad y retorno de inversión. Nuestro inventario incluye desde soportes tradicionales hasta pantallas LED de última generación y unidades móviles que llevan tu mensaje a donde está la acción.
            </p>
            <h2>Cobertura Real, Impacto Medible</h2>
            <p>
              Operamos en los puntos de mayor tráfico y visibilidad de las plazas más importantes, asegurando millones de contactos mensuales. Nuestro equipo de planificación te asesora para crear campañas efectivas y memorables.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate('/explorer')}
              className="w-full bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors duration-300 text-lg"
            >
              Explorar Soportes
            </button>
            <button
              onClick={() => navigate('/mediakit')}
              className="w-full bg-white text-slate-900 font-semibold py-3 px-6 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors duration-300 text-lg"
            >
              Solicitar MediaKit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
