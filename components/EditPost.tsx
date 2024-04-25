'use client';

import { Post } from '@/helpers/db';
import { useForm } from '@mantine/form';
import { Button, Container, Switch, Textarea, TextInput } from '@mantine/core';
import { md2html } from '@/helpers/markdown';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import BlogPost from '@/components/BlogPost';
import { fq } from '@/helpers/fetch';
import { notifications } from '@mantine/notifications';
import slugs from '@/helpers/slugs';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { convertUrlStringToFile, drawThumbnail } from '@/helpers/images';
import { useDebounceCallback } from '@mantine/hooks';
import { getPostState, getPostStateColor } from '@/helpers/post';

interface EditPostProps {
  post: Post;
}

/**
 * Edit post page.
 *
 * This component also handles whether the post is published or not. 'Published' is sort of a
 * tri-state situation. If the post is published, it will be visible to everyone. If the post is
 * saved but not published, then it is a draft and will only be visible to the author. If the post
 * is published and then unpublished, it will be visible to the author but not to anyone else.
 * Edits to a published post will not be visible until the post is published again. So, a post can
 * exist the published state, but have unpublished edits.
 */
export default function EditPost({ post }: EditPostProps) {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      title: post ? post.draft_title : '',
      body: post ? post.draft_body : '',
      synopsis: post ? post.draft_synopsis : '',
      tags: post ? post.draft_tags : '',
      hero_url: post ? post.draft_hero_url : '',
      blurred_hero_data_url: post ? post.draft_blurred_hero_data_url : '',
    },
  });
  const [canPublish, setCanPublish] = useState(false);
  const [border, setBorder] = useState(
    getPostStateColor(post, form.isDirty(), true),
  );
  const [preview, setPreview] = useState('');
  const [checked, setChecked] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const onDrop = useCallback(
    async (acceptedFiles: Blob[]) => {
      // In practice, I will only support uploading one image at a time.
      const url = await upload_image(acceptedFiles[0]);
      if (bodyRef.current) {
        const start = form.values.body.slice(0, bodyRef.current.selectionStart);
        const end = form.values.body.slice(bodyRef.current.selectionEnd);
        form.setFieldValue('body', `${start}![](${url})${end}`);
      }
    },
    [form.values.body],
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  useEffect(() => {
    const state = getPostState(post, form.isDirty());
    setCanPublish(state !== 'Dirty');
    setBorder(getPostStateColor(post, form.isDirty(), true));
  }, [form.isDirty()]);

  // Add debounced auto-save feature to every input that has a draft associated with it.
  const debouncedSavePost = useDebounceCallback(savePost, 5000);
  useEffect(() => {
    if (form.values.hero_url === post.hero_url) return;
    // Note: this should, in theory, also save for the blurred hero data URL.
    debouncedSavePost();
  }, [form.values.title]);
  useEffect(() => {
    if (form.values.title === post.draft_title) return;
    debouncedSavePost();
  }, [form.values.title]);
  useEffect(() => {
    if (form.values.synopsis === post.draft_synopsis) return;
    debouncedSavePost();
  }, [form.values.synopsis]);
  useEffect(() => {
    if (form.values.tags === post.draft_tags) return;
    debouncedSavePost();
  }, [form.values.tags]);
  useEffect(() => {
    if (form.values.body === post.draft_body) return;
    debouncedSavePost();
  }, [form.values.body]);

  async function publishPost() {
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
    const loading = notifications.show({
      message: 'Saving post...',
      autoClose: false,
      loading: true,
    });

    const resp = await fetch(fq`/api/post`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: post.id,
        draft_title: form.values.title,
        draft_body: form.values.body,
        draft_synopsis: form.values.synopsis,
        draft_tags: form.values.tags,
        draft_hero_url: form.values.hero_url,
        draft_blurred_hero_data_url: form.values.blurred_hero_data_url,
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
      message: 'Post saved!',
      autoClose: 1000,
    });
    form.resetDirty();
  }

  async function upload_image(file: Blob): Promise<string> {
    const loading = notifications.show({
      title: 'Uploading image',
      message: 'Please wait...',
      autoClose: false,
      loading: true,
    });

    // Create the thumbnail
    const thumbDataUrl = await drawThumbnail(file, 320);
    const thumbnail = await convertUrlStringToFile(thumbDataUrl);

    // Upload the hero image
    const resp = await fetch(fq`/api/image`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!resp.ok) {
      console.error('Failed to upload image', await resp.text());
      notifications.show({
        title: 'Failed to upload image',
        message: 'Please try again later.',
        color: 'red',
      });
      notifications.hide(loading);
      throw new Error('Failed to upload image');
    }

    const heroUrl = (await resp.json()).url;

    // Upload hero was successful - upload the thumbnail.
    await fetch(fq`/api/image`, {
      method: 'POST',
      headers: {
        'Content-Type': thumbnail.type,
        'X-Thumbnail-Of': heroUrl,
      },
      body: thumbnail,
    });

    // Create the blurry image
    const blurryDataUrl = await drawThumbnail(file, 32);
    form.setFieldValue('blurred_hero_data_url', blurryDataUrl);

    notifications.hide(loading);
    return heroUrl;
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
    <div className={`md:w-[1008px] md:p-4 border-2 ${border}`}>
      <div className="border-red-500 border-yellow-500 border-green-500 border-transparent">
        {/* This is required so that these border rules actually get compiled into the final CSS. */}
      </div>
      <h1 className="text-xl md:text-3xl text-center py-4 px-2">Edit Post</h1>
      <Switch checked={checked} onChange={togglePreview} label="Preview" />
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
            <Button fullWidth onClick={publishPost} disabled={!canPublish}>
              Publish
            </Button>
          </Container>
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
