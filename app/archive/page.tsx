import db from '@/helpers/db';
import PostChip from '@/app/archive/components/PostChip';

export default async function Archive() {
  const posts = await db.getAllPosts();

  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <PostChip post={post} key={post.id} />
      ))}
    </div>
  );
}
