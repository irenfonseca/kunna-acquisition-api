# kunna-acquisition-api


Servicio de **adquisición de datos** desde el API de KUNNA, con buenas prácticas.

- Node.js 22 + TypeScript
- Express por capas (controllers/services/clients/models)
- Axios (+ reintentos), Zod (validación), Pino (logging)
- MongoDB (Mongoose) con índice idempotente
- Endpoints: `/health`, `/collect`, `/page`



API de adquisición desde KUNNA con Express + TypeScript + MongoDB.


## Endpoints
- `GET /api/v1/health` – estado
- `POST /api/v1/collect` – ingesta desde KUNNA → guarda en Mongo
- `GET /api/v1/page?page=1&pageSize=5&metric=&deviceId=` – lectura paginada lista para BFF/SSR/CSR


## Puesta en marcha
```bash
cp .env.sample .env # rellena MONGO_URI y KUNNA_URL (con token en URL)
npm install
npm run dev # o: docker compose up --build
```


## Notas
- El esquema guarda mediciones idempotentes con índice único `(deviceId, metric, ts)`.
- `KUNNA_URL` exige el token en la URL (según el endpoint de demo). En producción, preferible cabecera Authorization si el proveedor lo soporta.
- `collect` usa `TIME_START/TIME_END` por defecto y acepta overrides vía body.