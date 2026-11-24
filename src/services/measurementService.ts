import { Measurement } from '../models/Measurement.js';
import type { KunnaRecord } from '../clients/kunnaClient.js';

export async function upsertMany(records: KunnaRecord[]) {

    let inserted = 0;
    let skipped = 0;

    for (const record of records) {

        const doc = {
            deviceId: record.device_id,
            metric: record.magnitude,
            value: record.value,
            unit: record.metric,
            ts: new Date(record.timestamp),
            source: 'kunna' as const
        };

        try {

            const result = await Measurement.updateOne(
                {
                    deviceId: doc.deviceId,
                    metric: doc.metric,
                    ts: doc.ts
                },
                {
                    $setOnInsert: {
                        ...doc,
                        ingestedAt: new Date()
                    }
                },
                { upsert: true }
            );

            if (result.upsertedCount > 0) {
                inserted++;
            } else {
                skipped++;
            }

        } catch (e: any) {
            if (e?.code === 11000) {
                skipped++;
            } else {
                throw e;
            }
        }
    }

    return { inserted, skipped };
}

export async function listPage(
    page: number,
    pageSize: number,
    filter: any = {}
) {

    const total = await Measurement.countDocuments(filter);

    const data = await Measurement.find(filter)
        .sort({ ts: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

    return { total, page, pageSize, data };
}