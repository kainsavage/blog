import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import db from '@/helpers/db';
import EditPost from '@/components/EditPost';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Blog Post | Teamclerks',
};

export default async function EditPostPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const session = await getServerSession();
  if (!session || !session.user) redirect('/api/auth/signin');

  // TODO - this should be an actual component to render a 404 page.
  if (!searchParams?.id) return <h1>Not Found</h1>;

  const id = Number.parseInt(searchParams.id);
  const post = await db.getPost(id);

  // TODO - this should be an actual component to render a 404 page.
  if (!post) return <h1>Not Found</h1>;

  return <EditPost post={post} />;
}
