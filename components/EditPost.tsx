'use client';

import { Post } from '@/helpers/db';
import { useForm } from '@mantine/form';
import { Button, Textarea, TextInput } from '@mantine/core';
import { md2html } from '@/helpers/markdown';
import { useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';

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
  const debounced = useDebounce(form.values.body, 500);
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
    <div className="flex-grow">
      <h1>Edit Post</h1>
      <div className="grid grid-cols-2 h-full">
        <form
          className="flex-col flex-grow p-2 h-full"
          onSubmit={form.onSubmit(savePost)}
        >
          <TextInput label="Title" mt="sm" {...form.getInputProps('title')} />
          <Textarea
            label="Body"
            mt="sm"
            {...form.getInputProps('body')}
            className="flex flex-col"
            autosize
            maxRows={30}
          />
          <Button fullWidth mt="xl">
            Save
          </Button>
        </form>
        <div
          className="flew-col p-2"
          dangerouslySetInnerHTML={{
            __html: preview,
          }}
        ></div>
      </div>
    </div>
  );
}
