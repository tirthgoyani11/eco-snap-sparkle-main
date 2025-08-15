import type { BarcodeResp, ProductMeta } from './types';

function mapOFFProduct(p: any): ProductMeta {
  const ingredients: string[] = Array.isArray(p.ingredients) ? p.ingredients.map((i: any) => i.text || '').filter(Boolean) : [];
  const categories: string[] = (p.categories_tags || p.categories?.split(',') || []).map((c: string) => c.replace('en:', '')).filter(Boolean);
  const labels: string[] = (p.labels_tags || p.labels?.split(',') || []).map((l: string) => l.replace('en:', '')).filter(Boolean);
  const countries: string[] = (p.countries_tags || p.countries?.split(',') || []).map((c: string) => c.replace('en:', '')).filter(Boolean);
  return {
    name: p.product_name || p.generic_name || 'Unknown product',
    brand: p.brands || p.brand_owner,
    image: p.image_front_small_url || p.image_url,
    ingredients,
    packaging: p.packaging || p.packaging_text,
    categories,
    labels,
    countries,
    manufacturingPlace: p.manufacturing_places || p.origins
  };
}

export async function lookupBarcode(barcode: string): Promise<BarcodeResp> {
  try {
    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;
    const resp = await fetch(url, { next: { revalidate: 60 } });
    if (!resp.ok) return { status: 'error', error: `OFF error ${resp.status}` };
    const json = await resp.json();
    if (json.status !== 1 || !json.product) return { status: 'not_found' };
    const product: ProductMeta = mapOFFProduct(json.product);
    return { status: 'ok', product };
  } catch (err: any) {
    return { status: 'error', error: String(err?.message ?? err) };
  }
}


