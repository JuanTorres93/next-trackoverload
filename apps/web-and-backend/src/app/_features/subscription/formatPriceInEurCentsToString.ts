export function formatPriceInEurCentsToString(priceInEurCents: number): string {
  const priceInEuros = priceInEurCents / 100;
  return `${priceInEuros.toFixed(2)} €`;
}
