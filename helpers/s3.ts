import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

async function uploadPublicImage(file: File) {
  const client = new S3Client({
    region: 'us-east-1',
    credentials: fromEnv(),
  });
  const command = new PutObjectCommand({
    Bucket: 'blog-teamclerks-net-images',
    Key: file.name,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  });

  await client.send(command);
}

export { uploadPublicImage };
