import postgres from 'postgres';
import dotenv from 'dotenv';
import { parse } from 'pg-connection-string';

dotenv.config({ path: '.env.local' });

const options = parse(process.env.DATABASE_URL || '');
const sql = postgres({
  host: options.host!,
  port: Number.parseInt(options.port!),
  database: options.database!,
  username: options.user!,
  password: options.password!,
});

type Post = {
  id: number;
  title: string;
  body: string;
  created_at: Date;
  updated_at: Date;
};

async function getPosts(): Promise<Post[]> {
  return sql`SELECT * from posts`;
}

export default { getPosts };
