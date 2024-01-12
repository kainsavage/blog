import { Post } from '@/helpers/db';
import Markdown from '@/components/Markdown';

export default function BlogPost({ post }: { post?: Post }) {
  if (!post) {
    return <>Blog Post not found!</>;
  }

  const created = new Date(post.created_at).toLocaleDateString();
  const updated = new Date(post.updated_at).toLocaleDateString();

  return (
    <>
      <h1 className="text-xl md:text-3xl text-center py-4 px-2">
        {post.title}
      </h1>
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
