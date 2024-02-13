'use client';

import { Post } from '@/helpers/db';
import { useForm } from '@mantine/form';
import { Button, Switch, Textarea, TextInput } from '@mantine/core';
import { md2html } from '@/helpers/markdown';
import { ChangeEvent, useRef, useState } from 'react';
import BlogPost from '@/components/BlogPost';
import { fq } from '@/helpers/fetch';
import { notifications } from '@mantine/notifications';
import slugs from '@/helpers/slugs';
import { useRouter } from 'next/navigation';

/**
 * Technically, this component is create/edit post based on whether you pass an existing post to
 * it or not.
 */
export default function EditPost({ post }: { post?: Post }) {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      title: post ? post.title : '',
      body: post ? post.body : '',
      synopsis: post ? post.synopsis : '',
      tags: post ? post.tags : '',
      hero_url: post ? post.hero_url : '',
    },
  });
  if (!post) {
    post = {
      id: -1,
      title: '',
      body: '',
      synopsis: '',
      tags: '',
      hero_url: '',
      created_at: new Date(),
    };
  }
  const [preview, setPreview] = useState('');
  const [checked, setChecked] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  async function savePost() {
    if (!post) return; // Impossible.

    const loading = notifications.show({
      title: 'Saving post',
      message: 'Please wait...',
      autoClose: false,
      loading: true,
    });

    const resp = await fetch(fq`/api/post`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: post.id === -1 ? undefined : post.id,
        title: form.values.title,
        body: form.values.body,
        synopsis: form.values.synopsis,
        tags: form.values.tags,
        hero_url: form.values.hero_url,
      }),
    });
    notifications.hide(loading);

    if (!resp.ok) {
      console.error('Failed to save post', await resp.text());
      notifications.show({
        title: 'Failed to save post',
        message: 'Please try again later.',
        color: 'red',
      });
      return;
    }

    notifications.show({
      title: 'Post saved',
      message: 'Redirecting to edited post...',
      autoClose: 1000,
      onClose: () => {
        router.push(fq`/post/${slugs.slugify(form.values.title)}`);
      },
    });
  }

  async function uploadHeroImage(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target?.files?.length) return;

    const loading = notifications.show({
      title: 'Uploading image',
      message: 'Please wait...',
      autoClose: false,
      loading: true,
    });

    const file = event.target.files[0];
    const resp = await fetch(fq`/api/image`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    notifications.hide(loading);

    if (!resp.ok) {
      console.error('Failed to upload hero image', await resp.text());
      notifications.show({
        title: 'Failed to upload hero image',
        message: 'Please try again later.',
        color: 'red',
      });
      return;
    }

    const url = (await resp.json()).url;
    form.setFieldValue('hero_url', url);
    notifications.show({
      title: 'Hero uploaded successfully',
      message: 'Click again to upload different hero image.',
      autoClose: 1000,
    });
  }

  function togglePreview() {
    void md2html(form.values.body)
      .then((html) => setPreview(html))
      .then(() => setChecked(!checked));
  }

  // TODO - Change these posts to allow for metadata, hero images, etc.

  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center py-4 px-2">Edit Post</h1>
      <Switch checked={checked} onChange={togglePreview} label="Preview" />
      {!checked ? (
        <>
          <input type="file" hidden ref={imageRef} onChange={uploadHeroImage} />
          <form className="md:w-[1024px]" onSubmit={form.onSubmit(savePost)}>
            <TextInput
              label="Hero Image"
              {...form.getInputProps('hero_url')}
              readOnly
              onClick={() => imageRef?.current?.click()}
            />
            <TextInput
              label="Title (slug)"
              mt="sm"
              {...form.getInputProps('title')}
            />
            <TextInput
              label="Synopsis"
              mt="sm"
              {...form.getInputProps('synopsis')}
            />
            <TextInput label="Tags" mt="sm" {...form.getInputProps('tags')} />
            <Textarea
              label="Body"
              mt="sm"
              {...form.getInputProps('body')}
              className="flex flex-col"
              rows={40}
            />
          </form>
        </>
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
