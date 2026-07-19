import { NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    const backendUrl = new URL('/api/patients/search', BACKEND_BASE_URL);
    backendUrl.searchParams.set('q', q);

    const response = await fetch(backendUrl.toString(), { cache: 'no-store' });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Impossible de récupérer les suggestions.' }, { status: 500 });
  }
}
