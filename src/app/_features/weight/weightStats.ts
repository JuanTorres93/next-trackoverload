import {
  linearRegression,
  linearRegressionLine,
  rSquared,
} from 'simple-statistics';

type TrendDirection = 'up' | 'down' | 'stable';
type ConfidenceLevel = 'low' | 'medium' | 'high';

interface TrendAnalysis {
  direction: TrendDirection;
  confidence: ConfidenceLevel;
}

// Minimum slope (kg/day) to consider a trend as "up" or "down". Below this, it's "stable".
// TODO: configure according user weight
const SLOPE_THRESHOLD = 0.05; // kg/day

// ---------- Public API ----------

export function getWeightFeedback(data: number[]): string {
  if (data.length < 2) {
    return 'Not enough data to determine a trend';
  }

  const analysis = analyzeTrend(data);

  return buildMessage(analysis);
}

// ---------- Core logic ----------

function analyzeTrend(data: number[]): TrendAnalysis {
  const points = toPoints(data);

  const regression = linearRegression(points);
  const slope = regression.m;

  const predict = linearRegressionLine(regression);
  const confidenceScore = rSquared(points, predict);

  return {
    direction: getDirection(slope),
    confidence: getConfidence(confidenceScore),
  };
}

// ---------- Helpers ----------

function toPoints(data: number[]): [number, number][] {
  return data.map((value, index) => [index, value]);
}

function getDirection(slope: number): TrendDirection {
  if (slope > SLOPE_THRESHOLD) return 'up';
  if (slope < -SLOPE_THRESHOLD) return 'down';
  return 'stable';
}

function getConfidence(r2: number): ConfidenceLevel {
  if (r2 > 0.6) return 'high';
  if (r2 > 0.3) return 'medium';
  return 'low';
}

function buildMessage({ direction, confidence }: TrendAnalysis): string {
  if (confidence === 'low') {
    return 'No hay una tendencia clara todavía';
  }

  if (direction === 'down') {
    return confidence === 'high'
      ? 'Estás bajando peso de forma consistente'
      : 'Tendencia a la baja, pero con variaciones';
  }

  if (direction === 'up') {
    return confidence === 'high'
      ? 'Estás subiendo peso de forma consistente'
      : 'Ligera subida reciente';
  }

  return 'Tu peso se mantiene estable';
}
