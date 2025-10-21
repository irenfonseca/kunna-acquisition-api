import { z } from 'zod';
import { postKunna } from '../clients/kunnaClient.js';


export const QueryZ = z.object({
    time_start: z.string().datetime(),
    time_end: z.string().datetime(),
    limit: z.number().int().min(1).max(1000).default(100),
    count: z.boolean().default(false),
    order: z.enum(['ASC', 'DESC']).default('DESC'),
    metric: z.string().optional(),
    uid: z.string().optional()
});


export type Query = z.infer<typeof QueryZ>;


export async function fetchMatrix(query: Query) {
    const data = await postKunna(query);
    const columns = data?.result?.columns ?? [];
    const values = data?.result?.values ?? [];
    return { columns, values };
}