import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import db from '@/helpers/db';
import EditPost from '@/app/post/edit/EditPost';

export default async function EditPostPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const session = await getServerSession();
  if (!session || !session.user) redirect('/api/auth/signin');

  // This is technically a 404, but I'm the admin and don't care.
  if (!searchParams) redirect('/');
  const id = searchParams?.id;
  // Again, dgaf.
  if (!id) redirect('/');
  const post = await db.getPost(Number.parseInt(id));
  // Again, dgaf.
  if (!post) redirect('/');

  return <EditPost post={post} />;
}
