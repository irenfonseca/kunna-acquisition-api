import 'dotenv/config';

const must = (k: string) => {
    const v = process.env[k];
    if (!v) throw new Error(`Missing env ${k}`);
    return v;
};


export const config = {
    port: Number(process.env.PORT || 5001),
    mongoUri: must('MONGO_URI'),
    kunnaUrl: must('KUNNA_URL'),
    defaults: {
        time_start: must('TIME_START'),
        time_end: must('TIME_END'),
        limit: 100,
        order: 'DESC' as const,
        count: false
    },
    logLevel: process.env.LOG_LEVEL || 'info'
} as const;