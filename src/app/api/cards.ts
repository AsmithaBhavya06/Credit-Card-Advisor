import cards from '@/data/cards.json';
import { NextRequest, NextResponse } from 'next/server';

export default function handler(req: NextRequest, res: NextResponse) {
    res.status(200).json(cards);
}
