import { Post } from '@/helpers/db';

export default function PostedDate({
  post,
  showUpdated = true,
}: {
  post: Post;
  showUpdated?: boolean;
}) {
  const updated = post.updated_at
    ? new Date(post.updated_at).toISOString().substring(0, 10)
    : '';
  const created = new Date(post.created_at).toISOString().substring(0, 10);

  if (showUpdated && post.updated_at) {
    return <time dateTime={updated}>Updated {updated}</time>;
  }

  return <time dateTime={created}>Written {created}</time>;
}
