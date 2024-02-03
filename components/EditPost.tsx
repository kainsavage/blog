'use client';

import { Post } from '@/helpers/db';
import { useForm } from '@mantine/form';
import { Button, Switch, Textarea, TextInput } from '@mantine/core';
import { md2html } from '@/helpers/markdown';
import { useState } from 'react';
import BlogPost from '@/components/BlogPost';
import { fq } from '@/helpers/fetch';

/**
 * Technically, this component is create/edit post based on whether you pass an existing post to
 * it or not.
 */
export default function EditPost({ post }: { post?: Post }) {
  const form = useForm({
    initialValues: {
      title: post ? post.title : '',
      body: post ? post.body : '',
    },
  });
  if (!post) {
    post = {
      id: -1,
      title: '',
      body: '',
      created_at: new Date(),
    };
  }
  const [preview, setPreview] = useState('');
  const [checked, setChecked] = useState(false);

  async function savePost() {
    if (!post) return; // Impossible.

    await fetch(fq`/api/posts/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: post.id,
        title: form.values.title,
        body: form.values.body,
      }),
    });
  }

  function togglePreview() {
    void md2html(form.values.body)
      .then((html) => setPreview(html))
      .then(() => setChecked(!checked));
  }

  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center py-4 px-2">Edit Post</h1>
      <Switch checked={checked} onChange={togglePreview} label="Preview" />
      {!checked ? (
        <form className="md:w-[1024px]" onSubmit={form.onSubmit(savePost)}>
          <TextInput label="Title" mt="sm" {...form.getInputProps('title')} />
          <Textarea
            label="Body"
            mt="sm"
            {...form.getInputProps('body')}
            className="flex flex-col"
            rows={40}
          />
        </form>
      ) : (
        <BlogPost
          post={{ ...post, title: form.values.title! }}
          hydratedHtml={preview}
        />
      )}
      <Button fullWidth mt="xl" onClick={savePost}>
        Save
      </Button>
    </div>
  );
}
