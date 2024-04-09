import { Post } from '@/helpers/db';

interface PostedDateProps {
  post: Post;
  showUpdated?: boolean;
}
export default function PostedDate(props: PostedDateProps) {
  const updated = props.post.updated_at
    ? new Date(props.post.updated_at).toISOString().substring(0, 10)
    : '';
  const created = new Date(props.post.published_at ?? props.post.created_at)
    .toISOString()
    .substring(0, 10);

  if (props.showUpdated && props.post.updated_at) {
    return <time dateTime={updated}>Updated {updated}</time>;
  }

  return <time dateTime={created}>Published {created}</time>;
}
