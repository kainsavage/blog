import db from '@/helpers/db';

export async function GET() {
  const recentPosts = await db.getRecentPosts();

  return Response.json(recentPosts);
}
