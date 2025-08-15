"use client";
import { useCallback, useMemo, useRef, useState } from 'react';
import { ScoreRing } from '@/components/ScoreRing';
import { EcoBadge } from '@/components/EcoBadge';
import { AlternativeCard } from '@/components/AlternativeCard';
import type { AlternativesResp, EcoScoreResp, ProductMeta, VisionResp } from '@/lib/types';
import { Button } from '@/src/components/ui/button';
import dynamic from 'next/dynamic';
import fallbackPool from '@/data/fallback-products.json';
import { addScan } from '@/lib/storage';

const CameraInput = dynamic(() => import('@/components/CameraInput').then(mod => mod.default), { ssr: false });
const BarcodeInput = dynamic(() => import('@/components/BarcodeInput').then(mod => mod.default), { ssr: false });

export default function ScannerPage() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductMeta | null>(null);
  const [eco, setEco] = useState<EcoScoreResp | null>(null);
  const [alts, setAlts] = useState<AlternativesResp | null>(null);
  const lastCallRef = useRef<number>(0);

  const canCall = useCallback(() => {
    const now = Date.now();
    if (now - lastCallRef.current < 1000) return false;
    lastCallRef.current = now;
    return true;
  }, []);

  const onImage = useCallback(async (dataUrl: string) => {
    if (!canCall()) return;
    setLoading(true);
    try {
      const r1 = await fetch('/api/vision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: dataUrl }) });
      const v: VisionResp = await r1.json();
      if (v.ok && v.product?.name) {
        const meta: ProductMeta = { name: v.product.name!, brand: v.product.brand, categories: v.product.category ? [v.product.category] : [] };
        setProduct(meta);
        const r2 = await fetch('/api/eco-score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product: meta }) });
        const e: EcoScoreResp = await r2.json();
        setEco(e);
        const r3 = await fetch('/api/alternatives', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product: meta }) });
        const a: AlternativesResp = await r3.json();
        setAlts(a);
        addScan({ id: crypto.randomUUID(), name: meta.name, score: e.score, date: new Date().toISOString(), productMeta: meta });
      } else {
        // Fallback: pick a random curated item
        const pick = (fallbackPool as any[])[Math.floor(Math.random() * (fallbackPool as any[]).length)];
        const meta: ProductMeta = { name: pick.name, brand: pick.brand, categories: pick.category ? [pick.category] : [], labels: pick.labels, packaging: pick.packaging, image: pick.image };
        setProduct(meta);
        const r2 = await fetch('/api/eco-score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product: meta }) });
        const e: EcoScoreResp = await r2.json();
        setEco(e);
        const r3 = await fetch('/api/alternatives', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product: meta }) });
        const a: AlternativesResp = await r3.json();
        setAlts(a);
        addScan({ id: crypto.randomUUID(), name: meta.name, score: e.score, date: new Date().toISOString(), productMeta: meta });
      }
    } finally {
      setLoading(false);
    }
  }, [canCall]);

  const onBarcode = useCallback(async (barcode: string) => {
    if (!canCall()) return;
    setLoading(true);
    try {
      const r1 = await fetch('/api/barcode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ barcode }) });
      const b = await r1.json();
      if (b.status === 'ok' && b.product) {
        setProduct(b.product);
        const r2 = await fetch('/api/eco-score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product: b.product }) });
        const e: EcoScoreResp = await r2.json();
        setEco(e);
        const r3 = await fetch('/api/alternatives', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product: b.product }) });
        const a: AlternativesResp = await r3.json();
        setAlts(a);
      }
    } finally {
      setLoading(false);
    }
  }, [canCall]);

  return (
    <main className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Scanner</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <CameraInput onCapture={onImage} />
          <BarcodeInput onDetect={onBarcode} />
        </div>
        <div className="space-y-4">
          {loading && <div className="text-muted-foreground">Processing...</div>}
          {product && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ScoreRing score={eco?.score ?? 0} />
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.brand}</div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(eco?.indicators || []).map(ind => (
                  <EcoBadge key={ind.key} type={ind.ok ? 'sustainable' : 'recyclable'} size="sm" animated={false} />
                ))}
              </div>
            </div>
          )}
          {alts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alts.alternatives.map((a) => (
                <AlternativeCard key={a.name} alternative={{
                  name: a.name,
                  brand: a.brand || '',
                  image: a.image || '/placeholder.svg',
                  ecoScore: a.estScore,
                  badges: ['🌱','♻️'],
                  savings: Math.max(0, (a.estScore - (eco?.score ?? 50))),
                  price: (Math.random() * 5 + 3).toFixed(2)
                }} />
              ))}
            </div>
          )}
          {!product && !loading && (
            <div className="text-sm text-muted-foreground">Capture or scan a barcode to begin. Or <Button variant="link" onClick={() => onImage('')}>upload</Button></div>
          )}
        </div>
      </div>
    </main>
  );
}


