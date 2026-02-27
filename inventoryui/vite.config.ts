import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        secure: false,
         configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxy - Original URL:', req.url);
            console.log(' Proxy - Headers:', req.headers);

            if (req.headers['x-api-key']) {
              proxyReq.setHeader('X-API-Key', req.headers['x-api-key']);
              console.log(' X-API-Key header forwarded');
            }
          } );
           proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(' Proxy Response Status:', proxyRes.statusCode);
            console.log(' Final URL hit:', req.url);
          });
        }
      },
    },
  },
})