import { Schema, model } from 'mongoose';

export interface MeasurementDoc {
    deviceId: string;
    metric: string;
    value: number;
    unit?: string;
    ts: Date;
    ingestedAt: Date;
    source: 'kunna';
}


const schema = new Schema<MeasurementDoc>({
    deviceId: { type: String, index: true, required: true },
    metric: { type: String, index: true, required: true },
    value: { type: Number, required: true },
    unit: { type: String },
    ts: { type: Date, index: true, required: true },
    ingestedAt: { type: Date, default: () => new Date() },
    source: { type: String, default: 'kunna' }
}, { versionKey: false });


schema.index({ deviceId: 1, metric: 1, ts: 1 }, { unique: true });


export const Measurement = model<MeasurementDoc>('Measurement', schema);