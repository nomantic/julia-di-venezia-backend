import { bootstrap, bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

console.log(`Starting Vendure server on PORT=${process.env.PORT || 3000}...`);

bootstrap(config)
    .then(async app => {
        console.log(`Vendure server successfully started and listening on 0.0.0.0:${process.env.PORT || 3000}`);
        const worker = await bootstrapWorker(config);
        await worker.startJobQueue();
        console.log('Vendure JobQueue worker successfully started.');
    })
    .catch(err => {
        console.error('Fatal error during Vendure bootstrap:', err);
        process.exit(1);
    });


