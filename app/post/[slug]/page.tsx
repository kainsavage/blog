import db from '@/helpers/db';
import BlogPost from '@/components/BlogPost';
import { Metadata } from 'next';
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
      authors: ['kain'],
      title: title,
      type: 'article',
      url: `https://blog.teamclerks.net/post/${params.slug}`,
      description: post?.synopsis || '',
      images: [
        {
          url: post?.hero_url || '',
          alt: post?.title || '',
          secureUrl: post?.hero_url || '',
          // TODO - implement this because stuff's borken.
          // type: post?.hero_type || '',
          // width: post?.hero_width || 1000,
          // height: post?.hero_height || 500,
        },
      ],
      tags: post?.tags || [],
      publishedTime: post?.created_at.toISOString(),
      modifiedTime:
        post?.updated_at?.toISOString() || post?.created_at.toISOString(),
    },
    robots: {
      'max-image-preview': 'large',
    },
  };
}

interface PostProps {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Post({ params }: PostProps) {
  const post = await db.getPostBySlug(params.slug);
  const session = await getServerSession();
  // TODO - not the way to do this. This really SHOULD be a 404 render.
  if (!post || (post.is_draft && !session?.user)) {
    // This is an attempt to at least fix the redirect loop.
    return <h1>Not found!</h1>;
  }
  const html = await md2html(post.body);

  return (
    <BlogPost
      post={post}
      hydratedHtml={html}
      canEdit={!!session?.user}
      showImage
    />
  );
}
