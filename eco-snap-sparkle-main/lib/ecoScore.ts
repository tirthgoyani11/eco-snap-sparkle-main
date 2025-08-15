import type { EcoScoreIndicator, EcoScoreResp, ProductMeta } from './types';
import { getUserCountry } from './geo';

const CERT_LABELS = new Set(['organic', 'fair-trade', 'fair trade', 'fsc']);
const FLAGGED_INGREDIENTS = new Set(['microplastic', 'bpa', 'paraben', 'phthalate']);

function hasCertifiedLabels(labels?: string[]): boolean {
  if (!labels) return false;
  return labels.some(l => CERT_LABELS.has(l.toLowerCase()));
}

function packagingScore(packaging?: string): { delta: number; reason: string; ok: boolean } {
  if (!packaging) return { delta: 0, reason: 'No packaging info', ok: false };
  const p = packaging.toLowerCase();
  if (/(recyclable|refillable|compostable|biodegradable)/.test(p)) {
    return { delta: 10, reason: 'Recyclable/refillable packaging', ok: true };
  }
  if (/(non\-recyclable|heavy plastic|multi\-layer)/.test(p)) {
    return { delta: -15, reason: 'Non-recyclable or heavy plastic', ok: false };
  }
  return { delta: 0, reason: 'Neutral packaging', ok: true };
}

function hasFlaggedIngredients(ingredients?: string[]): boolean {
  if (!ingredients) return false;
  return ingredients.some(i => Array.from(FLAGGED_INGREDIENTS).some(f => i.toLowerCase().includes(f)));
}

function shippingPenalty(userCountry: string, manufacturingPlace?: string, countries?: string[]): number {
  if (!manufacturingPlace && !countries?.length) return 0;
  const place = [manufacturingPlace, ...(countries ?? [])].filter(Boolean).join(' ').toLowerCase();
  if (!place) return 0;
  const isLocal = place.includes(userCountry.toLowerCase());
  return isLocal ? 0 : 15; // simple heuristic
}

export function computeEcoScore(product: ProductMeta, userCountry?: string): EcoScoreResp {
  let score = 50;
  const indicators: EcoScoreIndicator[] = [];

  const certified = hasCertifiedLabels(product.labels);
  if (certified) {
    score += 15;
    indicators.push({ key: 'certified', ok: true, reason: 'Certified (organic/fair-trade/FSC)' });
  } else {
    indicators.push({ key: 'certified', ok: false, reason: 'No eco certification detected' });
  }

  const p = packagingScore(product.packaging);
  score += p.delta;
  indicators.push({ key: 'packaging', ok: p.ok, reason: p.reason });

  const flagged = hasFlaggedIngredients(product.ingredients);
  if (flagged) {
    score -= 10;
    indicators.push({ key: 'ingredients', ok: false, reason: 'Contains flagged ingredients' });
  } else {
    indicators.push({ key: 'ingredients', ok: true, reason: 'No flagged ingredients found' });
  }

  const userC = userCountry || getUserCountry();
  const ship = shippingPenalty(userC, product.manufacturingPlace, product.countries);
  score -= ship;
  indicators.push({ key: 'shipping', ok: ship === 0, reason: ship === 0 ? 'Local or unknown origin' : 'Likely imported (shipping penalty)' });

  // clamp
  score = Math.max(0, Math.min(100, score));
  return { score, indicators };
}


