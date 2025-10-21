import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../src/app.js';
import { connectDB } from '../src/db.js';

let app: ReturnType<typeof buildApp>;

beforeAll(async () => {
  // Opcional: si tu app requiere Mongo sí o sí, conecta a una instancia local.
  // Para smoke de endpoints estáticos (health/docs) no haría falta.
  try { await connectDB(); } catch { /* ignore for smoke */ }
  app = buildApp();
});

describe('smoke', () => {
  it('GET /api/v1/health -> 200', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });

  it('GET /openapi.json -> 200 & has info', async () => {
    const res = await request(app).get('/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('openapi');
    expect(res.body).toHaveProperty('paths');
  });

  it('GET /api/v1/page -> 200', async () => {
    // No requiere datos previos: debería responder con estructura válida
    const res = await request(app).get('/api/v1/page?page=1&pageSize=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok');
    expect(res.body).toHaveProperty('columns');
    expect(res.body).toHaveProperty('values');
  });
});
