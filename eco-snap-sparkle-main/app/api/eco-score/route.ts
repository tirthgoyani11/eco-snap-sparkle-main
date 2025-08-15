import { NextRequest, NextResponse } from 'next/server';
import { computeEcoScore } from '@/lib/ecoScore';
import type { EcoScoreResp, ProductMeta } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { product } = await req.json() as { product: ProductMeta };
    if (!product?.name) return NextResponse.json({ score: 50, indicators: [] } satisfies EcoScoreResp);
    const res = computeEcoScore(product);
    return NextResponse.json(res);
  } catch (err: any) {
    const resp: EcoScoreResp = { score: 50, indicators: [] };
    return NextResponse.json(resp);
  }
}


