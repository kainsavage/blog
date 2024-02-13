import db from '@/helpers/db';
import BlogPost from '@/components/BlogPost';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { md2html } from '@/helpers/markdown';
import { getServerSession } from 'next-auth';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await db.getPostBySlug(params.slug);
  const title = `${post?.title || 'Blog Post Not Found'} | TeamClerks`;

  return {
    title: title,
    openGraph: {
      title: title,
      type: 'article',
      url: `https://blog.teamclerks.net/post/${params.slug}`,
      description: post?.synopsis || '',
      images: [
        {
          url: post?.hero_url || '',
          width: 800,
          height: 600,
          alt: post?.title || '',
        },
      ],
    },
  };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await db.getPostBySlug(params.slug);
  const session = await getServerSession();
  // TODO - not the way to do this.
  if (!post) redirect('/');
  const html = await md2html(post.body);

  return (
    <BlogPost
      post={post}
      hydratedHtml={html}
      canEdit={!!session && !!session.user}
    />
  );
}
