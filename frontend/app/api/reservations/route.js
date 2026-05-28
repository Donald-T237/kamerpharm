import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

export async function GET() {
  try {
    await dbConnect();
    
    // Récupère toutes les réservations triées de la plus récente à la plus ancienne
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur de chargement des réservations" }, { status: 500 });
  }
}