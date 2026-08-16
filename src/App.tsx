/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AnimatePresence } from 'motion/react';
import { PageTransition } from './components/layout/PageTransition';
import Home from './pages/Home';
import Inventario from './pages/Inventario';
import Soportes from './pages/Soportes';
import Nosotros from './pages/Nosotros';
import Dashboard from './pages/Dashboard';
import DashboardSoportes from './pages/DashboardSoportes';
import { SelectionProvider } from './context/SelectionContext';

function PublicRoutes() {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/soportes" element={<PageTransition><Soportes /></PageTransition>} />
          <Route path="/nosotros" element={<PageTransition><Nosotros /></PageTransition>} />
          <Route path="/inventario" element={<PageTransition><Inventario /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function AppRoutes() {
  const location = useLocation();

  if (location.pathname.startsWith('/dashboard')) {
    return (
      <Routes location={location}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/soportes" element={<DashboardSoportes />} />
      </Routes>
    );
  }

  return <PublicRoutes />;
}

export default function App() {
  return (
    <Router>
      <SelectionProvider>
        <AppRoutes />
      </SelectionProvider>
    </Router>
  );
}
