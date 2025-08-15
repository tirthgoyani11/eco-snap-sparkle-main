const TIPS = [
  'Bring a reusable bag and bottle to cut single-use plastics.',
  'Choose products with recyclable or minimal packaging.',
  'Buy local and seasonal to reduce shipping emissions.',
  'Refill and reuse containers where possible.',
  'Look for eco labels like organic, FSC, or fair-trade.'
];

export function randomTip(): string {
  const idx = Math.floor(Math.random() * TIPS.length);
  return TIPS[idx];
}


