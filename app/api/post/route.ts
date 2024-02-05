import { NextRequest } from 'next/server';
import db from '@/helpers/db';
import { getServerSession } from 'next-auth';

export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, body } = await request.json();

  if (!title || !body) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    if (!id) {
      await db.createPost(title, body);
    } else {
      await db.editPost(parseInt(id, 10), title, body);
    }
  } catch (e) {
    return Response.json({ error: 'Failed to edit post' }, { status: 500 });
  }

  return Response.json({ success: true });
}
