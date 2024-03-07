'use client';

import { Post } from '@/helpers/db';
import { useForm } from '@mantine/form';
import { Button, Container, Switch, Textarea, TextInput } from '@mantine/core';
import { md2html } from '@/helpers/markdown';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import BlogPost from '@/components/BlogPost';
import { fq } from '@/helpers/fetch';
import { notifications } from '@mantine/notifications';
import slugs from '@/helpers/slugs';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useDisclosure } from '@mantine/hooks';
import Confirm from '@/components/Confirm';

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
      is_draft: false,
      created_at: new Date(),
    };
  }
  const [preview, setPreview] = useState('');
  const [checked, setChecked] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const onDrop = useCallback(async (acceptedFiles: Blob[]) => {
    // In practice, I will only support uploading one image at a time.
    const url = await upload_image(acceptedFiles[0]);
    if (bodyRef.current) {
      const start = bodyRef.current.selectionStart;
      const end = bodyRef.current.selectionEnd;
      form.setFieldValue(
        'body',
        form.values.body.slice(0, start) +
          `![](${url})` +
          form.values.body.slice(end),
      );
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });
  const [opened, { close, open }] = useDisclosure(false);

  async function publishPost() {
    if (!post) return; // Impossible.

    const loading = notifications.show({
      title: 'Publishing post',
      message: 'Please wait...',
      autoClose: false,
      loading: true,
    });

    const resp = await fetch(fq`/api/post/publish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: post.id,
      }),
    });
    notifications.hide(loading);

    if (!resp.ok) {
      console.error('Failed to publish post', await resp.text());
      notifications.show({
        title: 'Failed to publish post',
        message: 'Please try again later.',
        color: 'red',
      });
      return;
    }

    notifications.show({
      title: 'Post published',
      message: 'Redirecting to post...',
      autoClose: 1000,
      onClose: () => {
        router.push(fq`/post/${slugs.slugify(form.values.title)}`);
      },
    });
  }

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

  async function upload_image(file: Blob): Promise<string> {
    const loading = notifications.show({
      title: 'Uploading image',
      message: 'Please wait...',
      autoClose: false,
      loading: true,
    });

    const resp = await fetch(fq`/api/image`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    notifications.hide(loading);

    if (!resp.ok) {
      console.error('Failed to upload image', await resp.text());
      notifications.show({
        title: 'Failed to upload image',
        message: 'Please try again later.',
        color: 'red',
      });
      throw new Error('Failed to upload image');
    }

    return (await resp.json()).url;
  }

  async function uploadHeroImage(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target?.files?.length) return;

    const file = event.target.files[0];
    const url = await upload_image(file);
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

  return (
    <div className="md:w-[1008px]">
      <h1 className="text-xl md:text-3xl text-center py-4 px-2">Edit Post</h1>
      <Switch checked={checked} onChange={togglePreview} label="Preview" />
      {post.is_draft && <Button onClick={publishPost}>Publish</Button>}
      {!checked ? (
        <>
          <input type="file" hidden ref={imageRef} onChange={uploadHeroImage} />
          <form onSubmit={form.onSubmit(savePost)} {...getRootProps()}>
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
            {/* Used by react-dropzone */}
            <input {...getInputProps()} />
            <Textarea
              label="Body"
              mt="sm"
              {...form.getInputProps('body')}
              className="flex flex-col"
              rows={40}
              ref={bodyRef}
            />
          </form>
          <Container mt="xl" className="flex flex-row gap-8">
            <Button fullWidth onClick={open} variant="light">
              Cancel
            </Button>
            <Button fullWidth onClick={savePost}>
              Save
            </Button>
          </Container>
          <Confirm
            title="Cancel?"
            message="Are you sure you want to cancel editing? Unsaved changes will be lost."
            cancelLabel="No, continue editing"
            confirmLabel="Yes, cancel"
            opened={opened}
            close={close}
            onConfirm={() =>
              router.push(fq`/post/${slugs.slugify(post!.title)}`)
            }
          />
        </>
      ) : (
        <BlogPost
          post={{
            ...post,
            title: form.values.title!,
            synopsis: form.values.synopsis!,
            tags: form.values.tags!,
            body: form.values.body!,
            hero_url: form.values.hero_url!,
          }}
          hydratedHtml={preview}
          showImage
        />
      )}
    </div>
  );
}
