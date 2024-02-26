import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { uploadPublicImage } from '@/helpers/s3';

/**
 * Uploads an image to the public S3 bucket, assigns it a randomly UUID filename, and returns the
 * URL to the object.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const blob = await request.blob();
  if (!blob) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const filename = `${uuidv4()}.${blob.type.split('/')[1]}`;
    const file = new File([blob], filename, { type: blob.type });
    await uploadPublicImage(file);

    return Response.json({
      success: true,
      url: `https://blog-teamclerks-net-images.s3.amazonaws.com/${filename}`,
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
