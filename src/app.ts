import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import routes from './routes/index.js';
import { rateLimit } from './middlewares/rateLimit.js';
import { errorHandler } from './middlewares/error.js';


export function buildApp() {
    const app = express();
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(pinoHttp());
    app.use(rateLimit);
    app.use('/api/v1', routes);
    // 404 sencillo
    app.use((_, res) => res.status(404).json({ error: { message: 'Not Found' } }));
    app.use(errorHandler);
    return app;
}
