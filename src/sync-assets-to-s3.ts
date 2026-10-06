import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';
import fs from 'fs';
import mime from 'mime-types';
import path from 'path';

dotenv.config();

const endpoint = process.env.S3_ENDPOINT || 'https://queahwwpaohxjwrkuijx.storage.supabase.co/storage/v1/s3';
const region = process.env.S3_REGION || 'eu-west-1';
const bucket = process.env.S3_BUCKET || 'vendure_julia_store';
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
    console.error('Error: S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be set in .env to sync assets.');
    process.exit(1);
}

const s3Client = new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

function getAllFiles(dir: string, fileList: string[] = []): string[] {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, fileList);
        } else {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

async function syncAssets() {
    const assetsDir = path.join(__dirname, '../static/assets');
    const allFiles = getAllFiles(assetsDir);

    console.log(`Found ${allFiles.length} files in ${assetsDir} to sync to Supabase S3 bucket "${bucket}"...`);

    let uploaded = 0;
    for (const filePath of allFiles) {
        const relativeKey = path.relative(assetsDir, filePath).replace(/\\/g, '/');
        const contentType = mime.lookup(filePath) || 'application/octet-stream';
        const fileStream = fs.createReadStream(filePath);

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: bucket,
                Key: relativeKey,
                Body: fileStream,
                ContentType: contentType,
            },
        });

        await upload.done();
        uploaded++;
        console.log(`[${uploaded}/${allFiles.length}] Uploaded: ${relativeKey}`);
    }

    console.log(`\nSuccessfully synced ${uploaded} assets to Supabase S3!`);
}

syncAssets().catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
});
