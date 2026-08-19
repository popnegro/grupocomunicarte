import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { buttonStyles } from '../ui/Button';

export function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Soportes', path: '/soportes' },
    { name: 'Soluciones', path: '/soluciones' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Inventario', path: '/inventario' }
  ];

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <img src="/brand/brand-dark.svg" alt="Grupo Comunicarte" className="h-8 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-black", 
                      isActive ? "text-black" : "text-gray-500"
                    )}
                  >
                    {link.name}
                  </Link>
                )
              })}
              <a href="mailto:ventas@grupocomunicarte.com" className={buttonStyles({ size: "sm" })}>
                Contacto
              </a>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 -mr-2 text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 space-y-4 shadow-lg absolute w-full left-0">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-2 py-2 text-base font-medium", 
                    isActive ? "text-black bg-gray-50 rounded" : "text-gray-500"
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
            <a href="mailto:ventas@grupocomunicarte.com" className={buttonStyles({ className: "w-full mt-4" })}>
              Contacto
            </a>
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/brand/brand-dark.svg" alt="Grupo Comunicarte" className="h-6 w-auto opacity-75" />
            </div>
            <p className="text-gray-500 text-sm">
              Mendoza • Buenos Aires
            </p>
          </div>
          
          <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="text-sm font-medium text-gray-500 hover:text-black">
                {link.name}
              </Link>
            ))}
            <a href="mailto:ventas@grupocomunicarte.com" className="text-sm font-medium text-gray-500 hover:text-black">
              Contacto
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
