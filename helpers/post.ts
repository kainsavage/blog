import { Post } from '@/helpers/db';

enum PostState {
  Draft = 'Draft',
  Published = 'Published',
  Dirty = 'Dirty',
}

function getPostState(post: Post, dirty = false) {
  if (!post.is_draft && !dirty) {
    if (
      post.title === post.draft_title &&
      post.body === post.draft_body &&
      post.synopsis === post.draft_synopsis &&
      post.tags === post.draft_tags &&
      post.hero_url === post.draft_hero_url &&
      post.blurred_hero_data_url === post.draft_blurred_hero_data_url
    ) {
      return PostState.Published;
    }
  } else if (post.is_draft && !dirty) {
    return PostState.Draft;
  }
  // Else
  return PostState.Dirty;
}

function getPostStateColor(post: Post, dirty = false, showPublished = false) {
  switch (getPostState(post, dirty)) {
    case PostState.Published:
      return showPublished ? 'border-green-500' : 'border-transparent';
    case PostState.Draft:
      return 'border-yellow-500';
    case PostState.Dirty:
      return 'border-red-500';
  }
}

export { PostState, getPostStateColor, getPostState };
