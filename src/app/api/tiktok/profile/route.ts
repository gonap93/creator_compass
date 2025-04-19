import { NextResponse } from 'next/server';
import { makeApiRequest } from '@/lib/utils/apiUtils';
import { TikTokProfile } from '@/lib/utils/tiktokUtils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  console.log(`Fetching TikTok profile for username: ${username}`);
  const result = await makeApiRequest<TikTokProfile>(`profile/${username}`);
  
  if (result.error) {
    return NextResponse.json(
      { error: result.error.error },
      { status: result.error.status }
    );
  }

  return NextResponse.json(result.data);
} 