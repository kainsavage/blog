'use client';

import { Post } from '@/helpers/db';
import { useForm } from '@mantine/form';
import { Button, Textarea, TextInput } from '@mantine/core';
import { md2html } from '@/helpers/markdown';
import { useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import BlogPost from '@/components/BlogPost';

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
  if (!post) {
    post = {
      id: -1,
      title: '',
      body: '',
      created_at: new Date(),
    };
  }
  const debounced = useDebounce(form.values.body, 1000);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    async function getPreview() {
      setPreview(await md2html(debounced!));
    }
    void getPreview();
  }, [debounced]);

  function savePost() {
    // TODO
    console.log(form.values.title, form.values.body);
  }

  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center py-4 px-2">Edit Post</h1>
      <div className="grid grid-cols-2 h-full">
        <form className="m-3" onSubmit={form.onSubmit(savePost)}>
          <TextInput label="Title" mt="sm" {...form.getInputProps('title')} />
          <Textarea
            label="Body"
            mt="sm"
            {...form.getInputProps('body')}
            className="flex flex-col"
            autosize
          />
          <Button fullWidth mt="xl">
            Save
          </Button>
        </form>
        <BlogPost
          post={{ ...post, title: form.values.title! }}
          hydratedHtml={preview}
        />
      </div>
    </div>
  );
}
