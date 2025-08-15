import sharp from 'sharp';
import type { VisionResp } from './types';

function isDataUrl(input: string): boolean {
  return input.startsWith('data:');
}

function dataUrlToBuffer(dataUrl: string): Buffer {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Buffer.from(base64, 'base64');
}

export async function visionIdentify(buffer: Buffer): Promise<VisionResp> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false, source: 'fallback', error: 'Missing GEMINI_API_KEY' };
    }

    // Resize to ~640px width, compress JPEG ~80
    const processed = await sharp(buffer)
      .rotate()
      .resize({ width: 640, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // TODO: Replace with Gemini 2.0 Flash Vision endpoint and exact payload
    // Example placeholder structure (not actual endpoint):
    // const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:multiModal', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-goog-api-key': apiKey,
    //   },
    //   body: JSON.stringify({
    //     contents: [
    //       { role: 'user', parts: [ { inline_data: { mime_type: 'image/jpeg', data: processed.toString('base64') } }, { text: 'Identify the product name, brand, category. Return JSON.' } ] }
    //     ]
    //   })
    // });
    // const json = await resp.json();
    // Parse json → VisionResp

    // For now, return a safe fallback indicator
    return { ok: false, source: 'fallback', error: 'Gemini call not implemented' };
  } catch (err: any) {
    return { ok: false, source: 'fallback', error: String(err?.message ?? err) };
  }
}

export async function parseIncomingImage(input: string): Promise<Buffer> {
  if (isDataUrl(input)) return dataUrlToBuffer(input);
  // assume base64 jpeg string
  return Buffer.from(input, 'base64');
}


