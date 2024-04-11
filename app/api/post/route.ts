import { NextRequest } from 'next/server';
import db from '@/helpers/db';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { fq } from '@/helpers/fetch';
import slugs from '@/helpers/slugs';

export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, body, synopsis, tags, hero_url } = await request.json();

  if (!title || !body) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    if (!id) {
      await db.createPost(title, body, synopsis, tags, hero_url);
    } else {
      await db.editPost(
        parseInt(id, 10),
        title,
        body,
        synopsis,
        tags,
        hero_url,
      );
    }
    // This tells Next.js to revalidate the post page.
    revalidatePath(fq`/post/${slugs.slugify(title)}`);
  } catch (e) {
    return Response.json({ error: 'Failed to edit post' }, { status: 500 });
  }

  return Response.json({ success: true });
}
