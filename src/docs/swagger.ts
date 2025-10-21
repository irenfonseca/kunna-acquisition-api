import path from 'node:path';
import fs from 'node:fs';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

export function mountSwagger(app: Express) {
  const file = path.join(process.cwd(), 'src', 'docs', 'openapi.yaml');
  const doc = yaml.parse(fs.readFileSync(file, 'utf8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
  app.get('/openapi.json', (_req, res) => res.json(doc));
}
