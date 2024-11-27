export function splitNumber(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function convertPriceToString(price: number): string {
  if (price >= 1e6) {
    return (price / 1e6).toFixed(2) + 'M';
  } else if (price >= 1e3) {
    return (price / 1e3).toFixed(2) + 'K';
  } else {
    return price.toString();
  }
}

export function roundToNDecimal(value: number, decimal = 2, toFixed = true): number {
  const result = Math.round(value * 10 ** decimal) / 10 ** decimal;
  return toFixed ? +result.toFixed(decimal) : result;
}

export function removeNullishValues(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object') {
        return [key, removeNullishValues(value)];
      }
      return [key, value];
    }),
  );
}

export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s/g, '');
  // .trim()
  // .replace(/\s+/g, ' ');
}
