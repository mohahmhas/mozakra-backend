import { Router } from 'express';

const healthRouter = Router();
console.log("Incoming:");
healthRouter.get('/health', (_req, res) => {
 
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  });
});

export default healthRouter;