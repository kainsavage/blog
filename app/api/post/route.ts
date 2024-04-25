import { NextRequest } from 'next/server';
import db from '@/helpers/db';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let id;
  try {
    id = await db.createPost();
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }

  return Response.json({ id });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const {
    id,
    draft_title,
    draft_body,
    draft_synopsis,
    draft_tags,
    draft_hero_url,
    draft_blurred_hero_data_url,
  } = await request.json();

  try {
    await db.editPost(
      parseInt(id, 10),
      draft_title,
      draft_body,
      draft_synopsis,
      draft_tags,
      draft_hero_url,
      draft_blurred_hero_data_url,
    );
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to edit post' }, { status: 500 });
  }

  return Response.json({ success: true });
}
