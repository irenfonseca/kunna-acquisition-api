import type { RequestHandler } from 'express';
import { config } from '../config.js';
import { QueryZ, fetchMatrix } from '../services/kunnaService.js';
import { upsertMany, listPage } from '../services/measurementService.js';


export const health: RequestHandler = (_req, res) => res.json({ ok: true });


export const collect: RequestHandler = async (req, res, next) => {
    try {
        const input = QueryZ.parse({ ...config.defaults, ...req.body });
        const { columns, values } = await fetchMatrix(input);
        const r = await upsertMany(values, columns);
        res.json({ ok: true, ...r });
    } catch (e) { next(e); }
};


export const page: RequestHandler = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
        const pageSize = Math.max(1, Math.min(50, parseInt(String(req.query.pageSize || '5'), 10)));
        const q: any = {};
        if (req.query.metric) q.metric = String(req.query.metric);
        if (req.query.deviceId) q.deviceId = String(req.query.deviceId);


        const result = await listPage(page, pageSize, q);
        res.json({
            ok: true,
            columns: ['time','deviceId','metric','value','unit'],
            values: result.data.map(d => [d.ts.toISOString(), d.deviceId, d.metric, d.value, d.unit ?? null]),
            page: result.page,
            pageSize: result.pageSize,
            total: result.total
        });
    } catch (e) { next(e); }
};