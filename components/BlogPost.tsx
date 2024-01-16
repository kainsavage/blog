import { Post } from '@/helpers/db';
import Markdown from '@/components/Markdown';
import slugs from '@/helpers/slugs';
import Link from 'next/link';

export default function BlogPost({
  post,
  canEdit,
}: {
  post?: Post;
  canEdit?: boolean;
}) {
  if (!post) {
    return <>Blog Post not found!</>;
  }

  const slug = slugs.slugify(post.title);
  const created = new Date(post.created_at).toLocaleDateString();
  const updated = new Date(post.updated_at).toLocaleDateString();

  return (
    <>
      <h1 className="text-xl md:text-3xl text-center py-4 px-2">
        {post.title}
      </h1>
      {canEdit && (
        <div className="p-2">
          <Link href={`/post/${slug}/edit`}>Edit Post</Link>
        </div>
      )}
      <div className="p-2 italic text-sm">
        {post.updated_at ? (
          <time dateTime={updated}>Updated {updated}</time>
        ) : (
          <time dateTime={created}>Written {created}</time>
        )}
      </div>
      <Markdown className="p-2" markdown={post.body} />
    </>
  );
}
