import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import EditPost from '@/components/EditPost';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Blog Post | Teamclerks',
};

export default async function NewPostPage() {
  const session = await getServerSession();
  if (!session || !session.user) redirect('/api/auth/signin');

  return <EditPost />;
}
