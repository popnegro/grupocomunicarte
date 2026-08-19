import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { PublicLayout } from './public/Layout';
import { PageTransition } from './public/PageTransition';
import Home from '../pages/public/Home';
import Soportes from '../pages/public/Soportes';
import Nosotros from '../pages/public/Nosotros';
import Soluciones from '../pages/public/Soluciones';

export function PublicSite() {
  const location = useLocation();
  return <PublicLayout><AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>
    <Route path="/" element={<PageTransition><Home /></PageTransition>} />
    <Route path="/soportes/*" element={<PageTransition><Soportes /></PageTransition>} />
    <Route path="/nosotros/*" element={<PageTransition><Nosotros /></PageTransition>} />
    <Route path="/soluciones/*" element={<PageTransition><Soluciones /></PageTransition>} />
  </Routes></AnimatePresence></PublicLayout>;
}
