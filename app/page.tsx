import Markdown from '@/components/Markdown';
import db from '@/helpers/db';

export default async function Home() {
  const posts = await db.getPosts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Markdown markdown={posts[0].body} />
    </main>
  );
}
