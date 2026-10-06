import {
    bootstrap,
    ChannelService,
    DefaultLogger,
    LanguageCode,
    LogLevel,
    PaymentMethodService,
    RequestContextService,
} from '@vendure/core';
import { config } from './vendure-config';

async function setupStripePaymentMethod() {
    console.log('--- Initializing Vendure to setup Stripe Payment Method ---');
    const app = await bootstrap({
        ...config,
        apiOptions: {
            ...config.apiOptions,
            port: 3099,
        },
        logger: new DefaultLogger({ level: LogLevel.Info }),
    });

    const paymentMethodService = app.get(PaymentMethodService);
    const channelService = app.get(ChannelService);
    const requestContextService = app.get(RequestContextService);

    const defaultChannel = await channelService.getDefaultChannel();
    const ctx = await requestContextService.create({
        apiType: 'admin',
        channelOrToken: defaultChannel,
    });

    const paymentMethods = await paymentMethodService.findAll(ctx);
    const existingStripe = paymentMethods.items.find(m => m.code === 'stripe');

    const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

    if (existingStripe) {
        console.log('Stripe payment method already exists. Updating configuration...');
        await paymentMethodService.update(ctx, {
            id: existingStripe.id,
            enabled: true,
            handler: {
                code: 'stripe',
                arguments: [
                    { name: 'apiKey', value: apiKey },
                    { name: 'webhookSecret', value: webhookSecret },
                ],
            },
        });
        console.log('Stripe payment method updated successfully.');
    } else {
        console.log('Creating Stripe payment method...');
        await paymentMethodService.create(ctx, {
            code: 'stripe',
            enabled: true,
            translations: [
                {
                    languageCode: LanguageCode.en,
                    name: 'Credit Card / Debit / Apple Pay (Stripe)',
                    description: 'Pay securely with Credit Card, Debit Card, Apple Pay or Google Pay via Stripe',
                },
            ],
            handler: {
                code: 'stripe',
                arguments: [
                    { name: 'apiKey', value: apiKey },
                    { name: 'webhookSecret', value: webhookSecret },
                ],
            },
        });
        console.log('Stripe payment method created successfully.');
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    await app.close();
    console.log('Done!');
    process.exit(0);
}

setupStripePaymentMethod().catch(err => {
    console.error('Error setting up Stripe:', err);
    process.exit(1);
});
