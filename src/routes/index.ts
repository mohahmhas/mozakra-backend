import type { Express } from 'express';

import apiRouter from './api.js';

import healthRouter from './health.route.js';

export const registerRoutes = (app: Express): void => {
  
  app.use(healthRouter);

  app.use('/api/v1', apiRouter);
  app.use('/api/v1', apiRouter);
};