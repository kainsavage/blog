import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

async function uploadPublicImage(file: File) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const command = new PutObjectCommand({
    Bucket: 'blog-teamclerks-net-images',
    Key: file.name,
    Body: Buffer.from(await file.arrayBuffer()),
  });

  await client.send(command);
}

export { uploadPublicImage };
