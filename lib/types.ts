export type VisionSource = 'gemini' | 'fallback';

export interface VisionResp {
  ok: boolean;
  product?: {
    name?: string;
    brand?: string;
    category?: string;
    confidence?: number;
  };
  labels?: string[];
  ocrText?: string;
  source: VisionSource;
  error?: string;
}

export interface ProductMeta {
  name: string;
  brand?: string;
  image?: string;
  ingredients?: string[];
  packaging?: string;
  categories?: string[];
  labels?: string[];
  countries?: string[];
  manufacturingPlace?: string;
}

export interface BarcodeResp {
  status: 'ok' | 'not_found' | 'error';
  product?: ProductMeta;
  error?: string;
}

export interface EcoScoreIndicator {
  key: string;
  ok: boolean;
  reason: string;
}

export interface EcoScoreResp {
  score: number; // 0-100
  indicators: EcoScoreIndicator[];
}

export interface AlternativeItem {
  name: string;
  brand?: string;
  image?: string;
  reason: string;
  estScore: number;
}

export interface AlternativesResp {
  alternatives: AlternativeItem[];
}

export interface ScanRecord {
  id: string;
  name: string;
  score: number;
  date: string; // ISO
  productMeta: ProductMeta;
}

export type TipResp = { tip: string };


