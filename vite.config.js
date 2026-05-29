import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Fams/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        // Rewrite /api → /gestion_casques/index.php
        rewrite: (path) => path.replace(/^\/api/, '/gestion_casques/index.php'),
        // Forward cookies back to the browser correctly
        cookieDomainRewrite: 'localhost',
        // Preserve the session cookie
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Force SameSite=Lax so cookies work over HTTP proxy
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                cookie
                  .replace(/SameSite=None/gi, 'SameSite=Lax')
                  .replace(/;\s*Secure/gi, '')
              );
            }
          });
        },
      },
    },
  },
});
