import db from '@/helpers/db';
import BlogPost from '@/components/BlogPost';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { md2html } from '@/helpers/markdown';
import { getServerSession } from 'next-auth';
import Image from 'next/image';

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
          width: 1008,
          height: 567,
          alt: post?.title || '',
        },
      ],
      tags: post?.tags || [],
      publishedTime: post?.created_at.toISOString(),
      modifiedTime:
        post?.updated_at?.toISOString() || post?.created_at.toISOString(),
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
    <>
      <Image
        src={post.hero_url}
        alt={post.synopsis}
        width={1008}
        height={567}
      />
      <BlogPost
        post={post}
        hydratedHtml={html}
        canEdit={!!session && !!session.user}
      />
    </>
  );
}
