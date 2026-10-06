import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    DefaultOrderByCodeAccessStrategy,
    RequestContext,
    Order,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import { StripePlugin } from '@vendure-community/stripe-plugin';
import { configureSupabaseS3Storage } from './config/supabase-s3-storage';
import 'dotenv/config';
import path from 'path';

class PermissiveOrderByCodeAccessStrategy extends DefaultOrderByCodeAccessStrategy {
    canAccessOrder(ctx: RequestContext, order: Order): boolean {
        // If order was updated recently (within 2h), allow access via unique order code
        // This avoids race condition where Stripe webhook takes a moment to set orderPlacedAt
        const orderUpdated = order.updatedAt ? +new Date(order.updatedAt) : 0;
        const now = Date.now();
        if (now - orderUpdated < 2 * 60 * 60 * 1000) {
            return true;
        }
        return super.canAccessOrder(ctx, order);
    }
}

const IS_DEV = process.env.APP_ENV === 'dev';
// PORT wins because hosting platforms inject it into the environment at runtime, and that
// must take precedence over any value baked into the .env file at scaffold time.
const serverPort = +process.env.PORT || +process.env.VENDURE_SERVER_PORT || 3000;
const storefrontUrl = (process.env.STOREFRONT_URL || 'http://localhost:3001').replace(/\/+$/, '');

const s3Config = (process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY)
    ? {
        bucket: process.env.S3_BUCKET || 'vendure_julia_store',
        endpoint: process.env.S3_ENDPOINT || 'https://queahwwpaohxjwrkuijx.storage.supabase.co/storage/v1/s3',
        region: process.env.S3_REGION || 'eu-west-1',
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'false' ? false : true,
    }
    : null;

export const config: VendureConfig = {
    apiOptions: {
        hostname: '0.0.0.0',
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,
        // Which browser origins may make credentialed requests to the Shop and Admin APIs.
        // In dev any origin is reflected, so a storefront on any port works. In production set
        // CORS_ORIGINS to a comma-separated list of the origins you serve, for example
        // "https://example.com,https://admin.example.com". An unset value blocks all
        // cross-origin browser requests, which is the safe default.
        cors: {
            origin: IS_DEV ? true : (process.env.CORS_ORIGINS?.split(',').map(o => o.trim()).filter(Boolean) ?? []),
            credentials: true,
        },
        // The following options are useful in development mode,
        // but are best turned off for production for security
        // reasons.
        ...(IS_DEV ? {
            adminApiDebug: true,
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME || 'superadmin',
            password: process.env.SUPERADMIN_PASSWORD || (IS_DEV ? 'superadmin' : 'JuliaVenice2026!SecureAdminPass'),
        },
        cookieOptions: {
          secret: process.env.COOKIE_SECRET || 'JuliaVenice2026!SecretKeyForAuthCookies',
        },
    },
    dbConnectionOptions: (process.env.DB_TYPE === 'postgres' || process.env.DATABASE_URL)
        ? {
            type: 'postgres',
            synchronize: false,
            migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
            logging: false,
            extra: {
                max: 4,
            },
            ...(process.env.DATABASE_URL
                ? {
                    url: process.env.DATABASE_URL,
                    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
                }
                : {
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT) || 5432,
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME || 'postgres',
                    schema: process.env.DB_SCHEMA || 'public',
                    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
                }),
        }
        : {
            type: 'better-sqlite3',
            synchronize: false,
            migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
            logging: false,
            database: path.join(__dirname, '../vendure.sqlite'),
        },
    orderOptions: {
        orderByCodeAccessStrategy: new PermissiveOrderByCodeAccessStrategy('2h'),
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {},
    plugins: [
        GraphiqlPlugin.init(),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            // For local dev, the correct value for assetUrlPrefix should
            // be guessed correctly, but for production it will usually need
            // to be set manually to match your production url.
            assetUrlPrefix: IS_DEV ? undefined : 'https://www.juliadivenezia.com/assets/',
            ...(s3Config ? {
                storageStrategyFactory: configureSupabaseS3Storage(s3Config),
            } : {}),
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        ...(process.env.SMTP_HOST
            ? [
                EmailPlugin.init({
                    transport: {
                        type: 'smtp',
                        host: process.env.SMTP_HOST,
                        port: Number(process.env.SMTP_PORT) || 587,
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS,
                        },
                    },
                    handlers: defaultEmailHandlers,
                    templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
                    globalTemplateVars: {
                        fromAddress: process.env.EMAIL_FROM_ADDRESS || '"Julia di venezia" <orders@juliadivenezia.com>',
                        verifyEmailAddressUrl: `${storefrontUrl}/verify`,
                        passwordResetUrl: `${storefrontUrl}/reset-password`,
                        changeEmailAddressUrl: `${storefrontUrl}/account/verify-email`,
                    },
                }),
            ]
            : [
                EmailPlugin.init({
                    devMode: true,
                    outputPath: path.join(__dirname, '../static/email/test-emails'),
                    route: 'mailbox',
                    handlers: defaultEmailHandlers,
                    templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
                    globalTemplateVars: {
                        fromAddress: process.env.EMAIL_FROM_ADDRESS || '"Julia di venezia" <orders@juliadivenezia.com>',
                        verifyEmailAddressUrl: `${storefrontUrl}/verify`,
                        passwordResetUrl: `${storefrontUrl}/reset-password`,
                        changeEmailAddressUrl: `${storefrontUrl}/account/verify-email`,
                    },
                }),
            ]),
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: path.join(__dirname, '../dist/dashboard'),
        }),
        StripePlugin.init({
            storeCustomersInStripe: false,
        }),
    ],
};
