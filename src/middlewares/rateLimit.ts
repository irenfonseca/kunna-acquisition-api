import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { RequestHandler } from 'express';

const limiter = new RateLimiterMemory({
    points: 100,
    duration: 60
});

export const rateLimit: RequestHandler = async (
    req, res, next
) => {

    const key =
        req.ip ??
        req.socket.remoteAddress ??
        'unknown';

    try {

        await limiter.consume(key);

        next();

    } catch {

        res.status(429).json({
            error: {
                message: 'Too many requests',
                status: 429
            }
        });
    }
};