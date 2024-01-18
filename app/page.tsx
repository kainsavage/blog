import db from '@/helpers/db';
import BlogPost from '@/components/BlogPost';
import { md2html } from '@/helpers/markdown';
import { getServerSession } from 'next-auth';

/**
 * For now, the homepage is just the most recent blog post.
 */
export default async function Home() {
  const post = await db.getMostRecentPost();
  const session = await getServerSession();
  const html = await md2html(post.body);

  return (
    <BlogPost
      post={post}
      hydratedHtml={html}
      canEdit={!!session && !!session.user}
    />
  );
}
