import { bootstrap, ChannelService, CurrencyCode, DefaultLogger, JobQueueService, LanguageCode, LogLevel, PaymentMethodService, RequestContextService } from '@vendure/core';
import { populate } from '@vendure/core/cli/populate';
import path from 'path';
import fs from 'fs';
import { config } from './vendure-config';

async function run() {
    const dataDir = path.join(__dirname, '../data');
    const initialDataPath = path.join(dataDir, 'initial-data-art.json');
    const productsCsvPath = path.join(dataDir, 'products-art.csv');

    console.log('--- Initializing Julia di venezia Handmade Art Store Population ---');

    const bootstrapFn = async () => {
        const _app = await bootstrap({
            ...config,
            dbConnectionOptions: {
                ...config.dbConnectionOptions,
                synchronize: true,
            },
            logger: new DefaultLogger({ level: LogLevel.Info }),
        });
        await _app.get(JobQueueService).start();
        return _app;
    };

    const app = await populate(bootstrapFn, initialDataPath, productsCsvPath);

    // Now configure the default Channel for Julia di venezia
    const channelService = app.get(ChannelService);
    const requestContextService = app.get(RequestContextService);
    const paymentMethodService = app.get(PaymentMethodService);

    const defaultChannel = await channelService.getDefaultChannel();
    const ctx = await requestContextService.create({
        apiType: 'admin',
        channelOrToken: defaultChannel,
    });

    console.log('Configuring default channel for Julia di venezia...');
    await channelService.update(ctx, {
        id: defaultChannel.id,
        code: '__default_channel__',
        token: defaultChannel.token,
        defaultCurrencyCode: CurrencyCode.EUR,
        availableCurrencyCodes: [CurrencyCode.EUR, CurrencyCode.USD, CurrencyCode.GBP],
        pricesIncludeTax: true,
        customFields: {},
    });

    console.log('Channel updated with EUR currency and prices including tax!');

    // Automatically configure Stripe payment method if keys exist
    if (process.env.STRIPE_SECRET_KEY) {
        const existingMethods = await paymentMethodService.findAll(ctx);
        const hasStripe = existingMethods.items.some(m => m.code === 'stripe');
        if (!hasStripe) {
            await paymentMethodService.create(ctx, {
                code: 'stripe',
                enabled: true,
                translations: [{
                    languageCode: LanguageCode.en,
                    name: 'Credit Card / Debit / Apple Pay (Stripe)',
                    description: 'Pay securely with your credit card or debit card via Stripe.',
                }],
                handler: {
                    code: 'stripe',
                    arguments: [
                        { name: 'apiKey', value: process.env.STRIPE_SECRET_KEY },
                        { name: 'webhookSecret', value: process.env.STRIPE_WEBHOOK_SECRET || '' },
                    ],
                },
            });
            console.log('Stripe payment method successfully registered and enabled!');
        }
    }

    console.log('Julia di venezia store successfully populated with handmade art catalog!');

    await new Promise(resolve => setTimeout(resolve, 3000));
    await app.close();
    process.exit(0);
}

run().catch(err => {
    console.error('Population error:', err);
    process.exit(1);
});
