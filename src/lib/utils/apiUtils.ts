import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.CREATOR_AI_API_URL || 'http://127.0.0.1:8000';

export interface ApiError {
  error: string;
  status: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}/tiktok/${endpoint}`;
}

export function validateApiKey(): ApiError | null {
  if (!process.env.CREATOR_AI_API_KEY) {
    console.error('CREATOR_AI_API_KEY is not set');
    return {
      error: 'API key configuration error',
      status: 500
    };
  }
  return null;
}

export async function handleApiError(error: any, context: string): Promise<NextResponse> {
  console.error(`Error in ${context}:`, error);
  return NextResponse.json(
    { error: `Failed to ${context}` },
    { status: 500 }
  );
}

export function getDefaultHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-Key': process.env.CREATOR_AI_API_KEY || ''
  };
}

export async function makeApiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  const apiKeyError = validateApiKey();
  if (apiKeyError) {
    return { error: apiKeyError };
  }

  const url = getApiUrl(endpoint);
  console.log(`Making ${method} request to: ${url}`);

  try {
    const response = await fetch(url, {
      method,
      headers: getDefaultHeaders(),
      ...(body && { body: JSON.stringify(body) })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      
      return {
        error: {
          error: `Request failed: ${response.statusText}`,
          status: response.status
        }
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    return {
      error: {
        error: 'Internal server error',
        status: 500
      }
    };
  }
} 