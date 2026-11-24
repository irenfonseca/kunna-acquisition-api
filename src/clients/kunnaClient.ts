import axios from 'axios';
import axiosRetry from 'axios-retry';
import { config } from '../config.js';

export interface KunnaRecord {
    timestamp: string;
    device_id: string;
    magnitude: string;
    metric: string;
    description?: string;
    value: number;
}

export interface KunnaResponse {
    data: {
        records: KunnaRecord[];
    };
}

const api = axios.create({
    timeout: 10000
});

axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay
});

export async function postKunna(body: any) {

    const { data } = await api.post<KunnaResponse>(
        config.kunnaUrl,
        body,
        {
            headers: {
                'Content-Type': 'application/json',
                'x-token-open-api': config.kunnaToken
            }
        }
    );

    return data;
}