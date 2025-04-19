import { NextResponse } from 'next/server';
import { makeApiRequest } from '@/lib/utils/apiUtils';
import { TikTokVideo } from '@/lib/utils/tiktokUtils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching TikTok videos for username: ${username}`);
    const result = await makeApiRequest<TikTokVideo[]>(`videos/${username}`);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error.error },
        { status: result.error.status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in TikTok videos API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 