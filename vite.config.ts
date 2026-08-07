import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Agrupar todas las dependencias de node_modules en chunks específicos
            if (id.includes('node_modules')) {
              // Chunk para el core de React
              if (id.includes('react-dom') || id.includes('react-router') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              // Chunk para Firebase SDK
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              // Chunk para librerías de mapas
              if (id.includes('leaflet')) {
                return 'vendor-maps';
              }
              // Chunk para librerías de UI y animaciones
              if (id.includes('motion') || id.includes('lucide-react') || id.includes('tailwind')) {
                return 'vendor-ui';
              }
              // Resto de dependencias
              return 'vendor-others';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
