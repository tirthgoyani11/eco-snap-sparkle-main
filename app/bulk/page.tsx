"use client";
import { useCallback, useState } from 'react';
import fallbackPool from '@/data/fallback-products.json';
import type { EcoScoreResp, ProductMeta, VisionResp } from '@/lib/types';

export default function BulkPage() {
  const [items, setItems] = useState<{ name: string; score: number }[]>([]);
  const [drag, setDrag] = useState(false);

  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const next: { name: string; score: number }[] = [];
    for (const f of Array.from(files)) {
      const dataUrl = await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f); });
      const r1 = await fetch('/api/vision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: dataUrl }) });
      const v: VisionResp = await r1.json();
      const meta: ProductMeta = v.ok && v.product?.name
        ? { name: v.product.name!, brand: v.product.brand, categories: v.product.category ? [v.product.category] : [] }
        : { name: (fallbackPool as any[])[Math.floor(Math.random()*(fallbackPool as any[]).length)].name };
      const r2 = await fetch('/api/eco-score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product: meta }) });
      const e: EcoScoreResp = await r2.json();
      next.push({ name: meta.name, score: e.score });
    }
    setItems(next);
  }, []);

  const avg = items.length ? Math.round(items.reduce((a,b)=>a+b.score,0)/items.length) : 0;
  const estCO2Saved = items.reduce((a,b)=> a + (100 - b.score) * 0.05, 0).toFixed(2);

  return (
    <main className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Bulk Scan</h1>
      <div className={`border-2 border-dashed rounded-lg p-8 text-center ${drag ? 'border-primary' : 'border-muted'}`}
        onDragOver={(e)=>{e.preventDefault(); setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={(e)=>{e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files);}}
      >
        Drop images here or
        <input type="file" multiple accept="image/*" className="block mx-auto mt-2" onChange={(e)=>onFiles(e.target.files)} />
      </div>
      {items.length>0 && (
        <div className="space-y-2">
          <div>Items: {items.length} • Avg score: {avg} • Est CO₂ saved: {estCO2Saved} kg</div>
          <ul className="list-disc pl-5 text-sm">
            {items.map((it)=> (<li key={it.name}>{it.name}: {it.score}</li>))}
          </ul>
        </div>
      )}
    </main>
  );
}


