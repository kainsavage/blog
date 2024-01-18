import db from '@/helpers/db';
import BlogPost from '@/components/BlogPost';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await db.getPostBySlug(params.slug);

  return {
    title: post?.title + ' | Teamclerks' || 'Blog Post Not Found | Teamclerks',
  };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await db.getPostBySlug(params.slug);

  return <BlogPost post={post} />;
}
