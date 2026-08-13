import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const navigation = [
  { name: 'Nosotros', href: '/nosotros' },
  {
    name: 'Soportes',
    href: '/soportes',
    dropdown: [
      { name: 'LED', href: '/soportes/led' },
      { name: 'Tradicional', href: '/soportes/tradicional' },
      { name: 'LED Móvil', href: '/soportes/led-movil' },
    ],
  },
  { name: 'Soluciones', href: '/soluciones' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Navegación principal">
        <div className="flex lg:flex-1">
          <Link to="/" onClick={closeMenus} className="-m-1.5 p-1.5">
            <span className="sr-only">Grupo Comunicarte</span>
            <span className="font-bold text-xl text-slate-800">Grupo Comunicarte</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú principal"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) =>
            item.dropdown ? (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                >
                  {item.name}
                  <ChevronDown className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                </Link>
                {dropdownOpen && (
                  <div className="absolute -left-8 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        onClick={closeMenus}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </Link>
            ),
          )}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            to="/mediakit"
            className="text-sm font-semibold leading-6 text-white bg-[#049A41] hover:bg-[#038537] px-4 py-2 rounded-md"
          >
            Solicitar Media Kit <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-10 bg-black/20" onClick={closeMenus} aria-hidden="true" />
          <div className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" onClick={closeMenus} className="-m-1.5 p-1.5">
                <span className="sr-only">Grupo Comunicarte</span>
                <span className="font-bold text-xl text-slate-800">Grupo Comunicarte</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={closeMenus}
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        to={item.href}
                        onClick={closeMenus}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                      {item.dropdown && (
                        <div className="ml-3 mt-1 space-y-1 border-l border-gray-200 pl-3">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              onClick={closeMenus}
                              className="block rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    to="/mediakit"
                    onClick={closeMenus}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Solicitar Media Kit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
