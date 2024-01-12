import db from '@/helpers/db';
import BlogPost from '@/components/BlostPost';

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await db.getPostBySlug(params.slug);

  return <BlogPost post={post} />;
}
