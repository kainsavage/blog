import { NextRequest } from 'next/server';
import db from '@/helpers/db';
import { getServerSession } from 'next-auth';

export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    await db.publishPost(id);
  } catch (e) {
    return Response.json({ error: 'Failed to edit post' }, { status: 500 });
  }

  return Response.json({ success: true });
}
