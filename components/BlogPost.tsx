import { Post } from '@/helpers/db';
import Markdown from '@/components/Markdown';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

export default async function BlogPost({ post }: { post?: Post }) {
  if (!post) {
    return <>Blog Post not found!</>;
  }
  const session = await getServerSession();
  const canEdit = !!session && !!session.user;

  return (
    <>
      <h1 className="text-xl md:text-3xl text-center py-4 px-2">
        {post.title}
      </h1>
      {canEdit && (
        <div className="p-2">
          <Link href={`/post/edit?id=${post.id}`}>Edit Post</Link>
        </div>
      )}
      <div className="p-2 italic text-sm">
        <PostedDate post={post} />
      </div>
      <Markdown className="p-2" markdown={post.body} />
    </>
  );
}

function PostedDate({ post }: { post: Post }) {
  const updated = new Date(post.updated_at).toISOString().substring(0, 10);
  const created = new Date(post.created_at).toISOString().substring(0, 10);

  if (post.updated_at) {
    return <time dateTime={updated}>Updated {updated}</time>;
  }

  return <time dateTime={created}>Written {created}</time>;
}
