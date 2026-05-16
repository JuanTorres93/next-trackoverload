export function formatToInteger(value: string | number): number {
  if (typeof value === 'number') {
    return Math.round(value);
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}
