import { buildApp } from './app.js';
import { connectDB } from './db.js';
import { config } from './config.js';
import { logger } from './logger.js';


async function main() {
    await connectDB();
    const app = buildApp();
    app.listen(config.port, () => logger.info(`acquisition-api :${config.port}`));
}


main().catch((e) => { console.error(e); process.exit(1); });