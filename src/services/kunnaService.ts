import { z } from 'zod';
import { postKunna } from '../clients/kunnaClient.js';

export const QueryZ = z.object({
    time_start: z.string().datetime(),
    time_end: z.string().datetime(),
    magnitude: z.string().min(1),
    device_id: z.string().min(1),
    limit: z.number().int().min(1).max(4000).default(100)
}).refine(
    q => Date.parse(q.time_start) < Date.parse(q.time_end),
    {
        message: 'time_start must be before time_end',
        path: ['time_end']
    }
);

export type Query = z.infer<typeof QueryZ>;

export async function fetchRecords(query: Query) {

    const body = {
        time_range: {
            start: query.time_start,
            end: query.time_end
        },
        filters: [
            {
                field: 'magnitude',
                values: [query.magnitude]
            },
            {
                field: 'device_id',
                values: [query.device_id]
            }
        ],
        options: {
            limit: query.limit
        }
    };

    const response = await postKunna(body);

    if (!Array.isArray(response?.data?.records)) {
        throw new Error('Invalid KUNNA response');
    }

    return response.data.records;
}