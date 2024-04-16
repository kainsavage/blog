import { Post } from '@/helpers/db';
import Markdown from '@/components/Markdown';
import PostBody from '@/components/PostBody';
import PostedDate from '@/components/PostedDate';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import CopyPopover from '@/components/CopyPopover';
import slugs from '@/helpers/slugs';

interface BlogPostProps {
  post: Post;
  canEdit?: boolean;
  hydratedHtml?: string;
  showImage?: boolean;
}

export default function BlogPost({
  post,
  canEdit = false,
  hydratedHtml,
  showImage = false,
}: BlogPostProps) {
  return (
    <div className="flex-col flex-grow">
      {showImage && (
        <div
          className="flex-col flex-grow bg-cover bg-center"
          style={{
            backgroundImage: `url(${post.blurred_hero_data_url})`,
          }}
        >
          <img
            src={post.hero_url}
            height={576}
            width={1008}
            alt={post.synopsis}
            fetchPriority="low"
            loading="lazy"
            decoding="async"
            className="object-center object-cover"
          />
        </div>
      )}
      <div className="flex flex-row justify-between">
        <CopyPopover
          post={post}
          toCopy={`${process.env.NEXT_PUBLIC_API_URL}/post/${slugs.slugify(
            post.title,
          )}`}
        >
          <h3 className="text-[2rem] font-extrabold text-left cursor-pointer">
            {post.title}
          </h3>
        </CopyPopover>
        {canEdit && (
          <Link href={`/post/edit?id=${post.id}`} className="ml-3">
            <FontAwesomeIcon icon={faPenToSquare} />
          </Link>
        )}
      </div>
      <div className="italic text-sm">
        <PostedDate post={post} />
      </div>
      {hydratedHtml ? (
        <PostBody html={hydratedHtml} />
      ) : (
        <Markdown markdown={post.body} />
      )}
    </div>
  );
}
