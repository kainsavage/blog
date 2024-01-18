'use client';

import { Post } from '@/helpers/db';
import Link from 'next/link';
import Markdown from '@/components/Markdown';
import PostBody from '@/components/PostBody';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import slugs from '@/helpers/slugs';

export default function BlogPost({
  post,
  canEdit = false,
  hydratedHtml,
}: {
  post: Post;
  canEdit?: boolean;
  hydratedHtml?: string;
}) {
  return (
    <div className="flex-col">
      <div className="flex-row text-center p-4">
        <h1 className="text-xl md:text-4xl py-4 px-2 inline">{post.title}</h1>
        <Link
          href={`/post/${slugs.slugify(post.title)}`}
          className="ml-3 text-black hover:text-blue-500 cursor-pointer"
        >
          <FontAwesomeIcon icon={faLink} />
        </Link>
        {canEdit && (
          <Link
            href={`/post/edit?id=${post.id}`}
            className="ml-3 text-black hover:text-blue-500 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Link>
        )}
      </div>
      <div className="p-2 italic text-sm">
        <PostedDate post={post} />
      </div>
      {hydratedHtml ? (
        <PostBody html={hydratedHtml} />
      ) : (
        <Markdown markdown={post.body} />
      )}
    </div>
  );
}

function PostedDate({ post }: { post: Post }) {
  const updated = post.updated_at
    ? new Date(post.updated_at).toISOString().substring(0, 10)
    : '';
  const created = new Date(post.created_at).toISOString().substring(0, 10);

  if (post.updated_at) {
    return <time dateTime={updated}>Updated {updated}</time>;
  }

  return <time dateTime={created}>Written {created}</time>;
}
