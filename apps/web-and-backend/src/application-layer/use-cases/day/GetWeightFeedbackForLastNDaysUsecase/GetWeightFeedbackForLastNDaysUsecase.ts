import { Day } from "@/domain/entities/day/Day";
import { DaysRepo } from "@/domain/repos/DaysRepo.port";
import { dateToDayId } from "@/domain/value-objects/DayId/DayId";

export type GetWeightFeedbackForLastNDaysUsecaseRequest = {
  userId: string;
  lastNDays: number;
};

export class GetWeightFeedbackForLastNDaysUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(
    request: GetWeightFeedbackForLastNDaysUsecaseRequest,
  ): Promise<WeightFeedback> {
    const endDayId = dateToDayId(new Date()).value;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (request.lastNDays - 1));

    const startDayId = dateToDayId(startDate).value;

    const days = await this.daysRepo.getDaysByDateRangeAndUserId(
      startDayId,
      endDayId,
      request.userId,
    );

    const weights = forwardFillWeights(days);

    return analyzeWeightTrend(weights);
  }
}

export type WeightFeedback =
  | "decreasing"
  | "DECREASING"
  | "stable"
  | "increasing"
  | "INCREASING";

export const VALID_FEEDBACK_VALUES: WeightFeedback[] = [
  "decreasing",
  "DECREASING",
  "stable",
  "increasing",
  "INCREASING",
];

// For days with no weight recorded, carry forward the last known weight.
// This preserves the temporal spacing between measurements in the trend analysis.
function forwardFillWeights(days: Day[]): number[] {
  const result: number[] = [];
  let lastWeight: number | undefined;

  for (const day of days) {
    if (day.userWeightInKg !== undefined) {
      lastWeight = day.userWeightInKg;
    }
    if (lastWeight !== undefined) {
      result.push(lastWeight);
    }
  }

  return result;
}

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

export const MIN_DATA_POINTS = 3;

type TrendDirection = "up" | "down";
type TrendStrength = "significant" | "meaningful" | "stable";

// TODO IMPORTANT: this is the function that is being used in the front, change it to use the use case
export function analyzeWeightTrend(weights: number[]): WeightFeedback {
  if (weights.length < MIN_DATA_POINTS) return "stable";

  const points = toIndexedPoints(weights);
  const slope = theilSenSlope(points);
  const referenceWeight = medianOf(weights);
  const dailyRate = slope / referenceWeight;

  const direction: TrendDirection = dailyRate >= 0 ? "up" : "down";
  const strength = getStrength(direction, Math.abs(dailyRate));

  return toWeightFeedback(direction, strength);
}

function toWeightFeedback(
  direction: TrendDirection,
  strength: TrendStrength,
): WeightFeedback {
  if (strength === "stable") return "stable";

  if (direction === "down")
    return strength === "significant" ? "DECREASING" : "decreasing";

  return strength === "significant" ? "INCREASING" : "increasing";
}

function getStrength(
  direction: TrendDirection,
  absoluteRate: number,
): TrendStrength {
  const { significant, meaningful } =
    direction === "down" ? THRESHOLDS.loss : THRESHOLDS.gain;

  if (absoluteRate >= significant) return "significant";

  if (absoluteRate >= meaningful) return "meaningful";

  return "stable";
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
