import {
    CreateBucketCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    HeadBucketCommand,
    HeadObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Logger } from '@vendure/core';
import {
    AssetServerOptions,
    S3AssetStorageStrategy,
} from '@vendure/asset-server-plugin';
import { Request } from 'express';
import mime from 'mime-types';
import { Readable } from 'node:stream';

const loggerCtx = 'SupabaseS3Storage';

export interface SupabaseS3Config {
    bucket: string;
    endpoint: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    forcePathStyle?: boolean;
}

export class SupabaseS3AssetStorageStrategy extends S3AssetStorageStrategy {
    private client!: S3Client;

    constructor(
        private readonly supabaseConfig: SupabaseS3Config,
        toAbsoluteUrl?: (request: Request, identifier: string) => string,
    ) {
        super(
            {
                bucket: supabaseConfig.bucket,
                credentials: {
                    accessKeyId: supabaseConfig.accessKeyId,
                    secretAccessKey: supabaseConfig.secretAccessKey,
                },
                nativeS3Configuration: {
                    endpoint: supabaseConfig.endpoint,
                    region: supabaseConfig.region,
                    forcePathStyle: supabaseConfig.forcePathStyle ?? true,
                },
            },
            toAbsoluteUrl as any,
        );
    }

    override async init() {
        this.client = new S3Client({
            endpoint: this.supabaseConfig.endpoint,
            region: this.supabaseConfig.region,
            forcePathStyle: this.supabaseConfig.forcePathStyle ?? true,
            credentials: {
                accessKeyId: this.supabaseConfig.accessKeyId,
                secretAccessKey: this.supabaseConfig.secretAccessKey,
            },
        });

        try {
            await this.client.send(new HeadBucketCommand({ Bucket: this.supabaseConfig.bucket }));
            Logger.info(`Found Supabase S3 bucket "${this.supabaseConfig.bucket}"`, loggerCtx);
        } catch {
            try {
                await this.client.send(new CreateBucketCommand({ Bucket: this.supabaseConfig.bucket }));
                Logger.info(`Created Supabase S3 bucket "${this.supabaseConfig.bucket}"`, loggerCtx);
            } catch (err: any) {
                Logger.warn(`Bucket verification completed: ${err.message}`, loggerCtx);
            }
        }
    }

    private normalizeKey(identifier: string): string {
        return identifier.replace(/^\/+/, '').replace(/\\/g, '/');
    }

    override async readFileToBuffer(identifier: string): Promise<Buffer> {
        const key = this.normalizeKey(identifier);
        const result = await this.client.send(
            new GetObjectCommand({
                Bucket: this.supabaseConfig.bucket,
                Key: key,
            })
        );
        const byteArray = await (result.Body as any).transformToByteArray();
        return Buffer.from(byteArray);
    }

    override async readFileToStream(identifier: string): Promise<Readable> {
        const key = this.normalizeKey(identifier);
        const result = await this.client.send(
            new GetObjectCommand({
                Bucket: this.supabaseConfig.bucket,
                Key: key,
            })
        );
        return result.Body as Readable;
    }

    override async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
        return this.uploadFile(fileName, data);
    }

    override async writeFileFromStream(fileName: string, data: Readable): Promise<string> {
        return this.uploadFile(fileName, data);
    }

    private async uploadFile(fileName: string, data: Buffer | Readable): Promise<string> {
        const key = this.normalizeKey(fileName);
        const contentType = mime.lookup(key) || 'application/octet-stream';

        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: this.supabaseConfig.bucket,
                Key: key,
                Body: data,
                ContentType: contentType,
            },
        });

        const res = await upload.done();
        return res.Key || key;
    }

    override async deleteFile(identifier: string): Promise<void> {
        const key = this.normalizeKey(identifier);
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.supabaseConfig.bucket,
                Key: key,
            })
        );
    }

    override async fileExists(fileName: string): Promise<boolean> {
        try {
            const key = this.normalizeKey(fileName);
            await this.client.send(
                new HeadObjectCommand({
                    Bucket: this.supabaseConfig.bucket,
                    Key: key,
                })
            );
            return true;
        } catch {
            return false;
        }
    }
}

export function configureSupabaseS3Storage(config: SupabaseS3Config) {
    return (options: AssetServerOptions) => {
        const toAbsoluteUrlFn = (request: Request, identifier: string) => {
            if (!identifier) {
                return '';
            }
            const normalizedIdentifier = identifier.replace(/\\/g, '/');
            if (options.assetUrlPrefix) {
                const prefix = typeof options.assetUrlPrefix === 'function'
                    ? (options.assetUrlPrefix as any)(request, identifier)
                    : options.assetUrlPrefix;
                return normalizedIdentifier.startsWith(prefix) ? normalizedIdentifier : `${prefix}${normalizedIdentifier}`;
            }
            const protocol = request.headers['x-forwarded-proto'] || request.protocol;
            const host = request.headers['x-forwarded-host'] || request.get('host');
            const prefix = `${protocol}://${host}/${options.route}/`;
            return normalizedIdentifier.startsWith(prefix) ? normalizedIdentifier : `${prefix}${normalizedIdentifier}`;
        };

        return new SupabaseS3AssetStorageStrategy(config, toAbsoluteUrlFn);
    };
}
