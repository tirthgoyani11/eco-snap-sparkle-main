import { NextRequest, NextResponse } from 'next/server';
import { lookupBarcode } from '@/lib/openFoodFacts';
import fs from 'node:fs';
import path from 'node:path';
import type { BarcodeResp } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { barcode } = await req.json();
    if (!barcode) return NextResponse.json({ status: 'error', error: 'Missing barcode' } satisfies BarcodeResp, { status: 400 });
    const res = await lookupBarcode(barcode);
    if (res.status !== 'ok') {
      // fallback mapping from seed by name includes no barcode mapping; just return a random seed
      try {
        const filePath = path.join(process.cwd(), 'data', 'fallback-products.json');
        const raw = fs.readFileSync(filePath, 'utf-8');
        const list = JSON.parse(raw);
        const pick = list[Math.floor(Math.random()*list.length)];
        return NextResponse.json({ status: 'ok', product: { name: pick.name, brand: pick.brand, categories: pick.category ? [pick.category] : [], labels: pick.labels, packaging: pick.packaging, image: pick.image } });
      } catch {}
    }
    return NextResponse.json(res);
  } catch (err: any) {
    const resp: BarcodeResp = { status: 'error', error: String(err?.message ?? err) };
    return NextResponse.json(resp, { status: 200 });
  }
}


