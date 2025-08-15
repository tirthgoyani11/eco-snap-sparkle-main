import { NextResponse } from 'next/server';
import { randomTip } from '@/lib/tip';

export async function GET() {
  return NextResponse.json({ tip: randomTip() });
}


