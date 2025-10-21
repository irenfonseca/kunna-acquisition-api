import { Measurement } from '../models/Measurement.js';


export async function upsertMany(rows: any[], columns: string[]) {
    const idx = Object.fromEntries(columns.map((c, i) => [c, i]));
    let inserted = 0, skipped = 0;
    for (const row of rows) {
        const doc = {
            deviceId: row[idx['uid']] ?? 'unknown',
            metric: row[idx['metric']] ?? 'unknown',
            value: Number(row[idx['value']] ?? 0),
            unit: row[idx['unit']] ?? undefined,
            ts: new Date(row[idx['time']] ?? Date.now()),
            source: 'kunna' as const
        };
        try {
            await Measurement.updateOne(
                { deviceId: doc.deviceId, metric: doc.metric, ts: doc.ts },
                { $setOnInsert: { ...doc, ingestedAt: new Date() } },
                { upsert: true }
            );
            inserted++;
        } catch (e: any) {
            if (e?.code === 11000) skipped++; else throw e;
        }
    }
    return { inserted, skipped };
}


export async function listPage(page: number, pageSize: number, filter: any = {}) {
    const total = await Measurement.countDocuments(filter);
    const data = await Measurement.find(filter)
        .sort({ ts: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();
    return { total, page, pageSize, data };
}