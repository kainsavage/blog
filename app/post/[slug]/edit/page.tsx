import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function EditPost() {
  const session = await getServerSession();
  if (!session || !session.user) redirect('/api/auth/signin');

  return (
    <div>
      <h1>Edit Post</h1>
    </div>
  );
}
