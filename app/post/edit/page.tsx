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

  const id = searchParams?.id;
  let post;
  if (id) {
    post = await db.getPost(Number.parseInt(id));
  }

  return <EditPost post={post} />;
}
