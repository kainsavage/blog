import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { id, title, body } = await request.json();
  console.log(id);
  console.log(title);

  return Response.json('');
}
