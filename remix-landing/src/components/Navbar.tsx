import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useApp } from '../context/AppContext';

const navigation = [
  { name: 'Nosotros', href: '/nosotros' },
  {
    name: 'Soportes',
    href: '/soportes-publicitarios',
    dropdown: [
      { name: 'Pantallas LED', href: '/soportes-publicitarios/pantallas-led' },
      { name: 'Tradicional', href: '/soportes-publicitarios/tradicional' },
      { name: 'LED Móvil', href: '/soportes-publicitarios/led-movil' },
    ],
  },
  { name: 'Soluciones', href: '/soluciones' },
];

const isActiveRoute = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

function QuoteCount({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span
      aria-label={`${count} ${count === 1 ? 'soporte seleccionado' : 'soportes seleccionados'}`}
      className="inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-[#049A41]"
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const { selectedSupports } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const quoteCount = selectedSupports.length;

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
        <Link to="/" onClick={closeMenus} className="shrink-0 rounded-lg p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41]">
          <span className="sr-only">Grupo Comunicarte</span>
          <BrandLogo size="sm" variant="full" />
        </Link>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700 hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú principal"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden items-center gap-x-8 lg:flex">
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
                  className={`flex items-center gap-x-1 rounded-lg px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41] ${
                    isActiveRoute(pathname, item.href) ? 'text-[#049A41]' : 'text-slate-800 hover:text-[#049A41]'
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                >
                  {item.name}
                  <ChevronDown className="h-4 w-4 flex-none text-slate-400" aria-hidden="true" />
                </Link>
                {dropdownOpen && (
                  <div className="absolute left-0 top-full z-10 mt-1 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        onClick={closeMenus}
                        className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41] ${
                          isActiveRoute(pathname, subItem.href) ? 'bg-[#E8F0E4] text-[#082028]' : 'text-slate-700 hover:bg-slate-50 hover:text-[#082028]'
                        }`}
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
                className={`rounded-lg px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41] ${
                  isActiveRoute(pathname, item.href) ? 'text-[#049A41]' : 'text-slate-800 hover:text-[#049A41]'
                }`}
              >
                {item.name}
              </Link>
            ),
          )}
        </div>

        <div className="hidden items-center gap-2 lg:flex lg:justify-end">
          <Link
            to="/explorer"
            className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41] ${
              isActiveRoute(pathname, '/explorer')
                ? 'bg-[#E8F0E4] text-[#082028]'
                : 'text-slate-700 hover:bg-[#E8F0E4] hover:text-[#082028]'
            }`}
          >
            Explorar ubicaciones
          </Link>
          <Link
            to="/mediakit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#049A41] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#038537] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41]"
          >
            Solicitar cotización
            <QuoteCount count={quoteCount} />
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-slate-950/20" onClick={closeMenus} aria-hidden="true" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-slate-200 bg-white px-6 py-6 shadow-2xl sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link to="/" onClick={closeMenus} className="rounded-lg p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41]">
                <span className="sr-only">Grupo Comunicarte</span>
                <BrandLogo size="sm" variant="full" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-slate-700 hover:bg-slate-50"
                onClick={closeMenus}
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={closeMenus}
                      className={`block rounded-xl px-3 py-2.5 text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41] ${
                        isActiveRoute(pathname, item.href) ? 'bg-[#E8F0E4] text-[#082028]' : 'text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                    {item.dropdown && (
                      <div className="ml-3 mt-1 space-y-1 border-l border-slate-200 pl-3">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={closeMenus}
                            className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41] ${
                              isActiveRoute(pathname, subItem.href) ? 'text-[#049A41]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-200 pt-6 space-y-2">
                <Link
                  to="/explorer"
                  onClick={closeMenus}
                  className={`block rounded-xl px-4 py-3 text-center text-base font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41] ${
                    isActiveRoute(pathname, '/explorer') ? 'bg-[#E8F0E4] text-[#082028]' : 'bg-slate-50 text-slate-900 hover:bg-[#E8F0E4]'
                  }`}
                >
                  Explorar ubicaciones
                </Link>
                <Link
                  to="/mediakit"
                  onClick={closeMenus}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#049A41] px-4 py-3 text-center text-base font-extrabold text-white shadow-sm hover:bg-[#038537] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#049A41]"
                >
                  Solicitar cotización
                  <QuoteCount count={quoteCount} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
