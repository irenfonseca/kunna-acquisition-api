import { Router } from 'express';
import { collect, page, health } from '../controllers/ingestController.js';


const r = Router();
r.get('/health', health);
r.post('/collect', collect);
r.get('/page', page);
export default r;