import cards from '@/data/cards.json';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    return NextResponse.json(cards, { status: 200 });
}
