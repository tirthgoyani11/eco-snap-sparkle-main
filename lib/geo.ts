export function getUserCountry(): string {
  try {
    if (typeof Intl !== 'undefined' && (Intl as any).Locale) {
      const locale = new (Intl as any).Locale(navigator.language);
      return (locale?.region || 'US') as string;
    }
  } catch {}
  return 'US';
}


