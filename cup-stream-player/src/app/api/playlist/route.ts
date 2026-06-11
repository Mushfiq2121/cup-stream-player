import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const text = await response.text();
    return NextResponse.json({ contents: text });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch external resource' }, { status: 500 });
  }
}