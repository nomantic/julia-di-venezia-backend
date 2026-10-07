import { bootstrap, bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

console.log(`Starting Vendure server on PORT=${process.env.PORT || 3000}...`);

bootstrap(config)
    .then(async app => {
        console.log(`Vendure server successfully started and listening on 0.0.0.0:${process.env.PORT || 3000}`);
        
        // Exclude DefaultSchedulerPlugin from the in-process worker to prevent duplicate cron jobs (e.g. 'clean-sessions')
        const workerConfig = {
            ...config,
            plugins: (config.plugins || []).filter(p => {
                const name = (p as any)?.name || (p as any)?.plugin?.name || (p as any)?.constructor?.name;
                return name !== 'DefaultSchedulerPlugin' && !(p as any)?.plugin?.name?.includes('DefaultScheduler');
            }),
        };

        const worker = await bootstrapWorker(workerConfig);
        await worker.startJobQueue();
        console.log('Vendure JobQueue worker successfully started.');
    })
    .catch(err => {
        console.error('Fatal error during Vendure bootstrap:', err);
        process.exit(1);
    });


