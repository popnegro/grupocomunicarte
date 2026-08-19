import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { buttonStyles } from '../ui/Button';
import { useSelection } from '../../context/SelectionContext';

export function PublicLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { selectedCount } = useSelection();
  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Soportes', path: '/soportes' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Soluciones', path: '/soluciones' },
    { name: 'Inventario', path: '/inventario' },
  ];
  const mediakitLabel = selectedCount > 0 ? `Mediakit (${selectedCount})` : 'Mediakit';

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden bg-white text-gray-900">
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center" aria-label="Grupo Comunicarte">
              <img src="/brand/brand-dark.svg" alt="Grupo Comunicarte" className="h-9 w-auto max-w-[210px] object-contain" />
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return <Link key={link.path} to={link.path} className={cn('text-sm font-medium transition-colors hover:text-black', isActive ? 'text-black' : 'text-gray-500')}>{link.name}</Link>;
              })}
              <Link to="/inventario?mediakit=1" className={buttonStyles({ size: 'sm', className: 'inline-flex items-center gap-2' })}>
                <FileText className="w-4 h-4" />{mediakitLabel}
              </Link>
            </nav>

            <button className="md:hidden p-2 -mr-2 text-gray-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 space-y-4 shadow-lg absolute w-full left-0">
          {navLinks.map((link) => <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={cn('block px-2 py-2 text-base font-medium', location.pathname === link.path ? 'text-black bg-gray-50 rounded' : 'text-gray-500')}>{link.name}</Link>)}
          <Link to="/inventario?mediakit=1" onClick={() => setIsMobileMenuOpen(false)} className={buttonStyles({ className: 'w-full mt-4 inline-flex items-center justify-center gap-2' })}><FileText className="w-4 h-4" />{mediakitLabel}</Link>
        </div>}
      </header>

      <main className="flex-grow flex flex-col">{children}</main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <img src="/brand/brand-dark.svg" alt="Grupo Comunicarte" className="h-7 w-auto max-w-[180px] object-contain mb-4" />
            <p className="text-gray-500 text-sm">Mendoza • Buenos Aires</p>
          </div>
          <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8">{navLinks.map((link) => <Link key={link.path} to={link.path} className="text-sm font-medium text-gray-500 hover:text-black">{link.name}</Link>)}<Link to="/inventario?mediakit=1" className="text-sm font-medium text-gray-500 hover:text-black">{mediakitLabel}</Link></nav>
        </div>
      </footer>
    </div>
  );
}
