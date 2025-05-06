import { NextResponse } from 'next/server';
import { makeApiRequest } from '@/lib/utils/apiUtils';
import { InstagramProfile } from '@/lib/utils/instagramUtils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  console.log(`Fetching Instagram profile for username: ${username}`);
  const result = await makeApiRequest<InstagramProfile>(`instagram/profile/${username}`);
  
  if (result.error) {
    return NextResponse.json(
      { error: result.error.error },
      { status: result.error.status }
    );
  }

  return NextResponse.json(result.data);
} 