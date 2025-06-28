import { Queue } from 'bullmq';
import { redisOptions } from './redis';

export const orderQueue = new Queue('orderQueue', {
  connection: redisOptions,
});