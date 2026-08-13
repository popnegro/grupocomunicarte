import { useState } from 'react';
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

export function Navbar({ setRoute }: { setRoute: (route: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNavigate = (href: string) => {
    setRoute(href);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a onClick={() => handleNavigate('/')} className="-m-1.5 p-1.5 cursor-pointer">
            <span className="sr-only">Grupo Comunicarte</span>
            {/* Placeholder for LOGO */}
            <div className="h-8 w-auto font-bold text-xl text-slate-800 flex items-center">GC</div>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menú principal</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) =>
            item.dropdown ? (
              <div key={item.name} className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <button onClick={() => handleNavigate(item.href)} className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                  {item.name}
                  <ChevronDown className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                </button>
                {dropdownOpen && (
                  <div className="absolute -left-8 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
                    {item.dropdown.map((subItem) => (
                      <a key={subItem.name} onClick={() => handleNavigate(subItem.href)} className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 cursor-pointer">
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={item.name} onClick={() => handleNavigate(item.href)} className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                {item.name}
              </a>
            )
          )}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button onClick={() => handleNavigate('/mediakit')} className="text-sm font-semibold leading-6 text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-md">
            Solicitar MediaKit <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-10" />
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a onClick={() => handleNavigate('/')} className="-m-1.5 p-1.5 cursor-pointer">
                 <span className="sr-only">Grupo Comunicarte</span>
                 <div className="h-8 w-auto font-bold text-xl text-slate-800 flex items-center">GC</div>
              </a>
              <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Cerrar menú</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a key={item.name} onClick={() => handleNavigate(item.href)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer">
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a onClick={() => handleNavigate('/mediakit')} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer">
                    Solicitar MediaKit
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
