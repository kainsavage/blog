import styles from './Logo.module.css';
import Link from 'next/link';
import { Text } from '@mantine/core';

export default function Logo() {
  return (
    <Link
      href={{ pathname: '/' }}
      className={`${styles.logo} no-underline flex flex-row`}
    >
      <Text
        className={`${styles.team} border-2 border-r-0 border-l-0`}
        px={4}
        fw={100}
      >
        TEAM
      </Text>
      <Text
        className={`${styles.clerks} border-2 border-r-0 border-l-0 border-transparent`}
        fw={500}
        px={4}
      >
        CLERKS
      </Text>
    </Link>
  );
}
