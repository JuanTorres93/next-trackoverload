export function formatWeight(weight: number | undefined | null): string {
  if (weight === null || weight === undefined) return "- kg";

  return `${weight.toFixed(1)} kg`;
}
