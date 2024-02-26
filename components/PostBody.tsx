import styles from './PostBody.module.css';

export default function PostBody({ html }: { html: string }) {
  return (
    <div className={styles.postBody}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
