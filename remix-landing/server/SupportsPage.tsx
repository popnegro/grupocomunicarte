import { useNavigate } from 'react-router-dom';

const supportTypes = [
  {
    name: 'Pantallas LED',
    description: 'Impacto dinámico en alta definición.',
    href: '/soportes/led',
    imageUrl: 'https://images.unsplash.com/photo-1572945281861-68b291979922?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'Soportes Tradicionales',
    description: 'Cobertura masiva y presencia constante.',
    href: '/soportes/tradicional',
    imageUrl: 'https://images.unsplash.com/photo-1540340561127-14e9f52f4aa1?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'LED Móvil',
    description: 'Flexibilidad para campañas tácticas.',
    href: '/soportes/led-movil',
    imageUrl: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&auto=format&fit=crop&q=60',
  },
];

export function SupportsPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Nuestro Inventario</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Un abanico de posibilidades para tu marca
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Selecciona el tipo de soporte que mejor se adapte a tu estrategia de comunicación y descubre las opciones disponibles.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {supportTypes.map((type) => (
            <div key={type.name} className="flex flex-col items-start justify-between rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 overflow-hidden">
              <img src={type.imageUrl} alt="" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">{type.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">{type.description}</p>
                <button onClick={() => navigate(type.href)} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800">Explorar <span aria-hidden="true">&rarr;</span></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
