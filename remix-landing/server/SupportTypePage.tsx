import { useNavigate } from 'react-router-dom';

const supportDetails = {
  led: {
    title: 'Pantallas LED',
    description: 'La vanguardia de la publicidad exterior. Ofrece contenido dinámico y de alta definición en los puntos más estratégicos de la ciudad, capturando la atención del público las 24 horas del día.',
    imageUrl: 'https://images.unsplash.com/photo-1572945281861-68b291979922?w=800&auto=format&fit=crop&q=60',
    filter: 'Pantallas LED',
  },
  tradicional: {
    title: 'Soportes Tradicionales',
    description: 'La base de una comunicación exterior efectiva. Carteleras de gran formato y monoestructuras ubicadas en las arterias de mayor tráfico para una visibilidad constante y masiva.',
    imageUrl: 'https://images.unsplash.com/photo-1540340561127-14e9f52f4aa1?w=800&auto=format&fit=crop&q=60',
    filter: 'Soportes Tradicionales',
  },
  'led-movil': {
    title: 'LED Móvil',
    description: 'La flexibilidad de llevar tu campaña a cualquier lugar. Nuestros camiones tecnológicos recorren circuitos comerciales, eventos y zonas de interés, generando un impacto directo y memorable.',
    imageUrl: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&auto=format&fit=crop&q=60',
    filter: 'LED Móvil',
  },
} as const;

type SupportType = keyof typeof supportDetails;

export function SupportTypePage({ type }: { type: SupportType }) {
  const navigate = useNavigate();
  const details = supportDetails[type];

  const handleExplore = () => {
    navigate('/explorer', {
      state: {
        filters: { type: details.filter },
      },
    });
  };

  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl lg:flex lg:justify-between lg:px-8 xl:justify-end">
        <div className="lg:shrink-0 lg:w-1/2 xl:pr-16">
          <div className="px-6 py-12 lg:pt-32 lg:pl-0 xl:pl-16">
            <div className="mx-auto max-w-lg lg:mx-0">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7C3AED]">Tipo de soporte</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{details.title}</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">{details.description}</p>
              <div className="mt-10">
                <button
                  onClick={handleExplore}
                  className="rounded-md bg-[#049A41] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#038537] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41]"
                >
                  Explorar {details.title}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-80 lg:h-auto lg:w-1/2 lg:shrink-0 xl:pr-16 xl:w-1/2">
          <img className="absolute inset-0 h-full w-full bg-gray-50 object-cover" src={details.imageUrl} alt={`Imagen de ${details.title}`} />
        </div>
      </div>
    </div>
  );
}
