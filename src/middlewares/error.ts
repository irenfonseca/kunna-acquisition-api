import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import axios from 'axios';
import { logger } from '../logger.js';

export const errorHandler: ErrorRequestHandler = (
    err, req, res, next
) => {

    if (res.headersSent) {
        return next(err);
    }

    // Error de validación de entrada
    if (err instanceof ZodError) {
        res.status(400).json({
            error: {
                message: 'Invalid request parameters',
                status: 400,
                details: err.issues
            }
        });
        return;
    }

    // Error de comunicación con una API externa
    if (axios.isAxiosError(err)) {

        const status =
            err.code === 'ECONNABORTED' ||
            err.code === 'ETIMEDOUT' ? 504 : 502;

        logger.error({
            upstreamStatus: err.response?.status,
            code: err.code
        }, 'External API error');

        res.status(status).json({
            error: {
                message: status === 504
                    ? 'External API timeout'
                    : 'External API error',
                status
            }
        });
        return;
    }

    // Otros errores
    const status = err.status || 500;

    logger.error({ err }, 'Request error');

    res.status(status).json({
        error: {
            message: status >= 500
                ? 'Internal Server Error'
                : err.message,
            status
        }
    });
};