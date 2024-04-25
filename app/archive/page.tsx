import db from '@/helpers/db';
import PostCard from '@/app/archive/components/PostCard';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'Archive | Teamclerks',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Archive() {
  const session = await getServerSession();
  const posts = await db.getAllPosts(!session || !session.user);

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
}
