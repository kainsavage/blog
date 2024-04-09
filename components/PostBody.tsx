import styles from './PostBody.module.css';

interface PostBodyProps {
  html: string;
}

export default function PostBody({ html }: PostBodyProps) {
  return (
    <div className={styles.postBody}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
