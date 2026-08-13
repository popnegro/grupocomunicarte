import { useNavigate } from 'react-router-dom';
import { Zap, Rocket, MapPin } from 'lucide-react';

const solutions = [
  {
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    title: 'Lanzamiento de Marca y Producto',
    description: 'Genera notoriedad masiva y posicionamiento inmediato utilizando nuestros circuitos de pantallas LED en ubicaciones premium.',
  },
  {
    icon: <Rocket className="h-8 w-8 text-green-500" />,
    title: 'Campañas de Cobertura Geográfica',
    description: 'Asegura una presencia constante en áreas clave con una combinación estratégica de soportes tradicionales y digitales.',
  },
  {
    icon: <MapPin className="h-8 w-8 text-red-500" />,
    title: 'Activaciones de Alto Impacto',
    description: 'Lleva tu marca directamente al consumidor con nuestras unidades de LED Móvil, perfectas para eventos, promociones y campañas tácticas.',
  },
];

export function SolutionsPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Soluciones a tu Medida</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Potenciamos tu mensaje para alcanzar cualquier objetivo
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Diseñamos estrategias de comunicación exterior que se adaptan a tus necesidades, desde lanzamientos masivos hasta campañas hiper-localizadas.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {solutions.map((solution) => (
              <div key={solution.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  {solution.icon}
                  {solution.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{solution.description}</p>
                  <p className="mt-6">
                    <button onClick={() => navigate('/explorer')} className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-800">
                      Ver soportes <span aria-hidden="true">→</span>
                    </button>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
