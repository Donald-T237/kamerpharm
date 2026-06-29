import { NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function GET(request) {
  try {
    
    // Récupération des paramètres de recherche dans l'URL
    const { searchParams } = new URL(request.url);
    const produit = searchParams.get('produit');
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));

    const backendUrl = new URL('/api/pharmacy/search', BACKEND_BASE_URL);
    if (produit) backendUrl.searchParams.set('produit', produit);
    if (lat) backendUrl.searchParams.set('lat', lat);
    if (lng) backendUrl.searchParams.set('lng', lng);
    if (searchParams.get('maxDistance')) backendUrl.searchParams.set('maxDistance', searchParams.get('maxDistance'));

    const response = await fetch(backendUrl.toString(), { cache: 'no-store' });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erreur API Recherche:", error);
    return NextResponse.json({ error: "Une erreur interne est survenue." }, { status: 500 });
  }
}