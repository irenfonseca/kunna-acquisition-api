import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import routes from './routes/index.js';
import { rateLimit } from './middlewares/rateLimit.js';
import { errorHandler } from './middlewares/error.js';
import { mountSwagger } from './docs/swagger.js';
import { register } from './metrics.js';


export function buildApp() {                                  // Exporta una función que construye y devuelve la app Express
    const app = express();                                     // Crea la instancia de servidor Express

    // Middlewares generales
    app.use(helmet());                                         // Seguridad: añade cabeceras HTTP (XSS, HSTS, etc.)
    app.use(cors());                                           // Habilita CORS (permite peticiones desde otros orígenes)
    app.use(express.json());                                   // Parsea cuerpos JSON en req.body
    app.use(pinoHttp());                                       // Logging HTTP con pino (método, url, estado, latencia)

    // Swagger primero (antes de 404) -> /docs y /openapi.json
    mountSwagger(app);                                         // Monta la UI y el JSON de OpenAPI para documentar la API

    // MÉTRICAS (antes de 404 y no rate-limited)
    app.get('/metrics', async (_req, res) => {                 // Endpoint para Prometheus: expone métricas del proceso
        res.set('Content-Type', register.contentType);         // Content-Type correcto para texto de métricas
        res.end(await register.metrics());                     // Devuelve todas las métricas recolectadas
    });

    // API v1 (aquí sí aplicamos rate limit)
    app.use('/api/v1', rateLimit, routes);                     // Prefijo de la API; aplica rate limit y luego enruta

    // 404 sencillo
    app.use((_, res) => res.status(404).json({                 // Handler para rutas no encontradas (después de montar rutas)
        error: { message: 'Not Found' } 
    }));
    app.use(errorHandler);                                     // Middleware centralizado de errores (formatea y responde)

    return app;                                                // Devuelve la app lista para usar en index.ts
}

