import db from '@/helpers/db';
import BlogPost from '@/components/BlogPost';
import { getServerSession } from 'next-auth';

export default async function Post({ params }: { params: { slug: string } }) {
  const session = await getServerSession();

  const post = await db.getPostBySlug(params.slug);

  return <BlogPost post={post} canEdit={!!session && !!session.user} />;
}
