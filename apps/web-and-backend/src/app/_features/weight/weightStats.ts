// Daily rate thresholds as a fraction of body weight, direction-specific.
// Loss and gain have different meaningful ranges because the goals are asymmetric:
//   healthy cut = losing up to 1.3%/week, healthy bulk = gaining up to 1.4%/month.
const THRESHOLDS = {
  loss: {
    meaningful: 0.01 / 30, // 1% per month — start of meaningful cut pace
    significant: 0.013 / 7, // 1.3% per week — losing too fast
  },
  gain: {
    meaningful: 0.003 / 30, // 0.3% per month — start of meaningful bulk pace
    significant: 0.014 / 30, // 1.4% per month — gaining too fast
  },
} as const;

const MIN_DATA_POINTS = 3;

type TrendDirection = 'up' | 'down';
type TrendStrength = 'significant' | 'meaningful' | 'stable';

interface TrendAnalysis {
  direction: TrendDirection;
  strength: TrendStrength;
}

export function getWeightFeedback(weights: number[]): string {
  if (weights.length < MIN_DATA_POINTS) {
    return 'No hay suficientes datos todavía';
  }

  const analysis = analyzeTrend(weights);
  return buildMessage(analysis);
}

function analyzeTrend(weights: number[]): TrendAnalysis {
  const points = toIndexedPoints(weights);
  const slope = theilSenSlope(points);
  const referenceWeight = medianOf(weights);
  const dailyRate = slope / referenceWeight;

  const direction: TrendDirection = dailyRate >= 0 ? 'up' : 'down';
  return {
    direction,
    strength: getStrength(direction, Math.abs(dailyRate)),
  };
}

function getStrength(
  direction: TrendDirection,
  absoluteRate: number,
): TrendStrength {
  const { significant, meaningful } =
    direction === 'down' ? THRESHOLDS.loss : THRESHOLDS.gain;
  if (absoluteRate >= significant) return 'significant';
  if (absoluteRate >= meaningful) return 'meaningful';
  return 'stable';
}

function buildMessage({ direction, strength }: TrendAnalysis): string {
  if (strength === 'stable') return 'Tu peso se mantiene estable';

  if (direction === 'down') {
    return strength === 'significant'
      ? 'Estás bajando peso demasiado rápido'
      : 'Estás bajando de peso a un ritmo saludable';
  }

  return strength === 'significant'
    ? 'Estás subiendo peso demasiado rápido'
    : 'Estás subiendo de peso a un ritmo saludable';
}

function toIndexedPoints(weights: number[]): [number, number][] {
  return weights.map((w, i) => [i, w]);
}

// Theil-Sen estimator: median of all pairwise slopes.
// Much more resistant to outlier spikes than linear regression.
function theilSenSlope(points: [number, number][]): number {
  const slopes: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const [xi, yi] = points[i];
      const [xj, yj] = points[j];
      slopes.push((yj - yi) / (xj - xi));
    }
  }
  return medianOf(slopes);
}

function medianOf(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}
