import cors from 'cors';

import { env } from '../config/env.js';

export const corsMiddleware = cors({
  origin:
    env.NODE_ENV === 'production'
      ? [
          "https://mozakra.com",
          "https://www.mozakra.com",
        ]
      : true,

  credentials: true,
});