export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch('http://127.0.0.1:8000/tiktok/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.CREATOR_AI_API_KEY || ''
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch recommendations' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in recommendations API route:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 