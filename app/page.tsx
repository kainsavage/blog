import Markdown from '@/components/Markdown';
import db from '@/helpers/db';

export default async function Home() {
  const posts = await db.getPosts();

  return <Markdown markdown={posts[0].body} />;
}
