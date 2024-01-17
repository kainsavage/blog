'use client';

import { Post } from '@/helpers/db';
import { useForm } from '@mantine/form';

/**
 * Technically, this component is create/edit post based on whether you pass an existing post to
 * it or not.
 */
export default function EditPost({ post }: { post?: Post }) {
  const form = useForm({
    initialValues: {
      title: post?.title,
      body: post?.body,
    },
  });

  function savePost() {
    // TODO
    console.log(form.values.title, form.values.body);
  }

  return (
    <form onSubmit={form.onSubmit(savePost)}>
      <h1>Edit Post</h1>
      <div>{form.values.title}</div>
      <div>{form.values.body}</div>
    </form>
  );
}
