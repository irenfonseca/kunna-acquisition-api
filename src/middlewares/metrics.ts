import type { RequestHandler } from 'express';

import {
    httpRequestsTotal,
    httpRequestDuration
} from '../metrics.js';

export const metricsMiddleware: RequestHandler = (
    req, res, next
) => {

    const end = httpRequestDuration.startTimer();

    res.on('finish', () => {

        const labels = {
            method: req.method,
            route: req.route
                ? req.baseUrl + req.route.path
                : 'unmatched',
            status: String(res.statusCode)
        };

        httpRequestsTotal.inc(labels);

        end(labels);
    });

    next();
};