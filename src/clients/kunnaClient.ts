import axios from 'axios';
import axiosRetry from 'axios-retry';
import { config } from '../config.js';


export interface KunnaResponse {
    code: string;
    msg: string | null;
    result?: { columns: string[]; values: any[][] };
}


const api = axios.create({ timeout: 10000 });
axiosRetry(api, { retries: 3, retryDelay: axiosRetry.exponentialDelay });


export async function postKunna(body: any) {
    // KUNNA_URL ya incluye el token en la propia URL
    const { data } = await api.post<KunnaResponse>(config.kunnaUrl, body, {
        headers: { 'Content-Type': 'application/json' }
    });
    return data;
}