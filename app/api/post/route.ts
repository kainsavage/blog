import { NextRequest } from 'next/server';
import db from '@/helpers/db';
import { getServerSession } from 'next-auth';

export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, body, synopsis, tags } = await request.json();
  console.log(synopsis, tags);

  if (!title || !body) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    if (!id) {
      await db.createPost(title, body, synopsis, tags);
    } else {
      await db.editPost(parseInt(id, 10), title, body, synopsis, tags);
    }
  } catch (e) {
    return Response.json({ error: 'Failed to edit post' }, { status: 500 });
  }

  return Response.json({ success: true });
}
