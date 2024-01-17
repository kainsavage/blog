'use client';

import { Post } from '@/helpers/db';
import { useForm } from '@mantine/form';

export default function EditPost({ post }: { post: Post }) {
  const form = useForm({
    initialValues: {
      title: post.title,
      body: post.body,
    },
  });

  return (
    <div>
      <h1>Edit Post</h1>
      <div>{form.values.title}</div>
      <div>{form.values.body}</div>
    </div>
  );
}
