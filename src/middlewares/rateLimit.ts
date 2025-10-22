// src/middlewares/rateLimit.ts
import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { RequestHandler } from 'express';

const limiter = new RateLimiterMemory({ points: 100, duration: 60 });

export const rateLimit: RequestHandler = async (req, res, next) => {
  try {
    // Siempre forzamos un string;
    const key =
      req.ip ??
      req.socket.remoteAddress ??
      (Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : req.headers['x-forwarded-for']?.toString()) ??
      'unknown';

    await limiter.consume(String(key)); // <- forzamos string aquí también
    next();
  } catch {
    res.status(429).json({ error: { message: 'Too many requests' } });
  }
};
