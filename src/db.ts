import mongoose from 'mongoose';
import { config } from './config.js';
import { logger } from './logger.js';


export async function connectDB() {
    await mongoose.connect(config.mongoUri);
    logger.info('Mongo connected');
}