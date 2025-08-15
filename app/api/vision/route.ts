import { NextRequest, NextResponse } from 'next/server';
import { parseIncomingImage, visionIdentify } from '@/lib/gemini';
import fs from 'node:fs';
import path from 'node:path';
import type { VisionResp } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ ok: false, source: 'fallback', error: 'Missing image' } satisfies VisionResp, { status: 400 });
    const buf = await parseIncomingImage(image);
    const res = await visionIdentify(buf);
    if (res.ok) return NextResponse.json(res);
    // fallback minimal guess using seed data: return a random item name
    try {
      const filePath = path.join(process.cwd(), 'data', 'fallback-products.json');
      const raw = fs.readFileSync(filePath, 'utf-8');
      const list = JSON.parse(raw);
      const pick = list[Math.floor(Math.random()*list.length)];
      const fallback: VisionResp = { ok: true, source: 'fallback', product: { name: pick.name, brand: pick.brand, category: pick.category, confidence: 0.1 } };
      return NextResponse.json(fallback);
    } catch {
      return NextResponse.json(res);
    }
  } catch (err: any) {
    const resp: VisionResp = { ok: false, source: 'fallback', error: String(err?.message ?? err) };
    return NextResponse.json(resp, { status: 200 });
  }
}


