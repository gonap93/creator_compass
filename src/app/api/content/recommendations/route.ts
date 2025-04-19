import { NextResponse } from 'next/server';

interface ContentIdea {
  title: string;
  description: string;
  hashtags: string[];
}

interface ApiResponse {
  username: string;
  ideas: ContentIdea[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Call the external API
    const response = await fetch('http://127.0.0.1:8000/tiktok/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.CREATOR_AI_API_KEY || ''
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch recommendations' },
        { status: response.status }
      );
    }

    const data: ApiResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 