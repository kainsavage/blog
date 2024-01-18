import { HTMLAttributes } from 'react';

export default function PostBody({
  html,
  className,
}: {
  html: string;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}) {
  return (
    <div
      className={className || 'm-2'}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
