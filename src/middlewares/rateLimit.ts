import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { RequestHandler } from 'express';


const limiter = new RateLimiterMemory({ points: 100, duration: 60 });
export const rateLimit: RequestHandler = async (req, res, next) => {
    try { await limiter.consume(req.ip); next(); }
    catch { res.status(429).json({ error: { message: 'Too many requests' } }); }
};