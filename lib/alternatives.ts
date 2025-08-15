import fs from 'node:fs';
import path from 'node:path';
import type { AlternativesResp, ProductMeta } from './types';

type SeedItem = {
  name: string;
  brand?: string;
  category?: string;
  image?: string;
  packaging?: string;
  labels?: string[];
  estScore: number;
};

let seedPool: SeedItem[] | null = null;

function loadSeed(): SeedItem[] {
  if (seedPool) return seedPool;
  try {
    const filePath = path.join(process.cwd(), 'data', 'fallback-products.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    seedPool = JSON.parse(raw);
  } catch {
    seedPool = [];
  }
  return seedPool!;
}

export function suggestAlternatives(product: ProductMeta): AlternativesResp {
  const pool = loadSeed();
  const category = product.categories?.[0]?.toLowerCase() ?? '';
  const matches = pool
    .filter((p) => !product.name || p.name.toLowerCase() !== product.name.toLowerCase())
    .map((p) => {
      const sameCategory = category && (p.category?.toLowerCase() === category || (p.labels || []).some(l => l.toLowerCase().includes(category)));
      const reasonParts: string[] = [];
      if (sameCategory) reasonParts.push('same category');
      if ((p.packaging || '').toLowerCase().includes('recyclable') || (p.packaging || '').toLowerCase().includes('biodegradable')) {
        reasonParts.push('eco packaging');
      }
      if ((p.labels || []).some(l => ['organic','fair-trade','fsc','cruelty-free'].includes(l.toLowerCase()))) {
        reasonParts.push('eco certified');
      }
      const reason = reasonParts.length ? reasonParts.join(', ') : 'better eco profile';
      return { ...p, reason };
    })
    .sort((a, b) => b.estScore - a.estScore);

  return {
    alternatives: matches.slice(0, 3).map((m) => ({
      name: m.name,
      brand: m.brand,
      image: m.image,
      reason: m.reason,
      estScore: m.estScore,
    }))
  };
}


