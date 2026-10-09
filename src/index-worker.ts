import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

console.log('Starting Vendure worker...');

bootstrapWorker(config)
    .then(worker => worker.startJobQueue())
    .then(() => {
        console.log('Vendure JobQueue worker successfully started and listening for jobs.');
    })
    .catch(err => {
        console.error('Fatal error during Vendure worker bootstrap:', err);
        process.exit(1);
    });
