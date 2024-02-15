import db from '@/helpers/db';
import PostCard from '@/app/archive/components/PostCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archive | Teamclerks',
};

export default async function Archive() {
  const posts = await db.getAllPosts();

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
}
