import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import '../refact/globals.css';
import { CmsProvider } from './components/CmsContext.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter is now inside App.tsx */}
    <QueryClientProvider client={queryClient}>
      {/* CmsProvider is now inside App.tsx, but for react-query to work
          it should wrap the provider that uses it. Let's assume App
          is the right place for CmsProvider for now.
          Actually, App wraps everything in CmsProvider, which is correct. */}
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
