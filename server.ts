import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServerApp } from './backend/index';
import { config } from './backend/config';

async function startServer() {
  const app = createServerApp();
  const PORT = config.port || 3000;

  // Development: Vite middleware / Production: Static bundle
  if (!config.isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CRM MVP] Full-Stack Backend Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
