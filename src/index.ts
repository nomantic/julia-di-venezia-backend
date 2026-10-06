import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config)
    .catch(err => {
        console.error('Fatal error during Vendure bootstrap:', err);
        process.exit(1);
    });


