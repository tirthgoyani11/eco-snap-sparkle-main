import { NextRequest, NextResponse } from 'next/server';
import { suggestAlternatives } from '@/lib/alternatives';
import type { AlternativesResp, ProductMeta } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { product } = await req.json() as { product: ProductMeta };
    const res: AlternativesResp = suggestAlternatives(product || { name: 'Unknown' });
    return NextResponse.json(res);
  } catch (err: any) {
    const resp: AlternativesResp = { alternatives: [] };
    return NextResponse.json(resp);
  }
}


