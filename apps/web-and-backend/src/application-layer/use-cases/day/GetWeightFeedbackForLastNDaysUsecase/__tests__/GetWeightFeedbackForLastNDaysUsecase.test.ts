import { Day } from "@/domain/entities/day/Day";
import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";

import { createEmptyTestDay } from "../../../../../../tests/createProps/dayTestProps";
import { userId } from "../../../../../../tests/createProps/userTestProps";
import {
  GetWeightFeedbackForLastNDaysUsecase,
  GetWeightFeedbackForLastNDaysUsecaseRequest,
} from "../GetWeightFeedbackForLastNDaysUsecase";

describe("GetWeightFeedbackForLastNDaysUsecase", () => {
  let daysRepo: MemoryDaysRepo;
  let usecase: GetWeightFeedbackForLastNDaysUsecase;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usecase = new GetWeightFeedbackForLastNDaysUsecase(daysRepo);
  });

  const usecaseRequest = (
    lastNDays: number,
  ): GetWeightFeedbackForLastNDaysUsecaseRequest => ({
    userId,
    lastNDays,
  });

  describe("stable", () => {
    it("returns 'stable' when weight does not change", async () => {
      await seedWeights(Array(14).fill(76), daysRepo);

      expect(await usecase.execute(usecaseRequest(14))).toBe("stable");
    });

    it("returns 'stable' when gain rate is below 0.3%/month", async () => {
      // 0.005 kg/day on 76 kg → rate ≈ 0.0000658/day, below the 0.0001/day threshold
      await seedWeights(linearWeights(76, 0.005, 14), daysRepo);

      expect(await usecase.execute(usecaseRequest(14))).toBe("stable");
    });

    it("returns 'stable' when only one weight measurement exists (all days forward-filled to the same value)", async () => {
      // One recording → every day gets forward-filled to 76 → slope = 0 → stable
      await seedWeights(
        [76, undefined, undefined, undefined, undefined],
        daysRepo,
      );

      expect(await usecase.execute(usecaseRequest(5))).toBe("stable");
    });

    it("returns 'stable' when no days have weight recorded", async () => {
      await seedWeights([undefined, undefined, undefined], daysRepo);

      expect(await usecase.execute(usecaseRequest(3))).toBe("stable");
    });
  });

  describe("decreasing (healthy cut pace)", () => {
    it("returns 'decreasing' when losing between 1%/month and 1.3%/week", async () => {
      // -0.038 kg/day on 76 kg → rate ≈ 0.0005/day: above 1%/month (0.000333), below 1.3%/week (0.001857)
      await seedWeights(linearWeights(76, -0.038, 14), daysRepo);

      expect(await usecase.execute(usecaseRequest(14))).toBe("decreasing");
    });
  });

  describe("DECREASING (losing too fast)", () => {
    it("returns 'DECREASING' when losing ≥1.3%/week", async () => {
      // -0.15 kg/day on 76 kg → rate ≈ 0.00197/day > 0.001857 (1.3%/week threshold)
      await seedWeights(linearWeights(76, -0.15, 14), daysRepo);

      expect(await usecase.execute(usecaseRequest(14))).toBe("DECREASING");
    });
  });

  describe("increasing (healthy bulk pace)", () => {
    it("returns 'increasing' when gaining between 0.3%/month and 1.4%/month", async () => {
      // 0.018 kg/day on 76 kg → rate ≈ 0.000237/day: above 0.0001, below 0.000467 (1.4%/month)
      await seedWeights(linearWeights(76, 0.018, 14), daysRepo);

      expect(await usecase.execute(usecaseRequest(14))).toBe("increasing");
    });
  });

  describe("INCREASING (gaining too fast)", () => {
    it("returns 'INCREASING' when gaining ≥1.4%/month", async () => {
      // 0.13 kg/day on 76 kg → rate ≈ 0.00171/day >> 0.000467 (1.4%/month threshold)
      await seedWeights(linearWeights(76, 0.13, 14), daysRepo);

      expect(await usecase.execute(usecaseRequest(14))).toBe("INCREASING");
    });
  });

  describe("data filtering", () => {
    it("ignores days outside the requested date range", async () => {
      // Days 15-30 ago have a strong downward trend; last 14 days are stable.
      // The use case with lastNDays=14 should only see the stable recent data.
      await seedWeights(
        [...linearWeights(76, -0.15, 16), ...Array(14).fill(76)],
        daysRepo,
        30,
      );
      expect(await usecase.execute(usecaseRequest(14))).toBe("stable");
    });

    it("fills days with no weight using the last recorded weight", async () => {
      // Days 1-7: weight stable at 76. Day 8: drops to 75.5. Days 9-14: no weight recorded.
      // Forward-fill produces [76×7, 75.5×7], preserving the temporal drop.
      // Theil-Sen on this block-step pattern → meaningful downward trend → 'decreasing'.
      // With plain filtering the 14-day context would be lost, making the result unreliable.
      const weights: (number | undefined)[] = [
        ...Array(7).fill(76),
        75.5,
        ...Array(6).fill(undefined),
      ];
      await seedWeights(weights, daysRepo);

      expect(await usecase.execute(usecaseRequest(weights.length))).toBe(
        "decreasing",
      );
    });
  });

  describe("robustness", () => {
    it("is resistant to a single outlier spike (Theil-Sen estimator)", async () => {
      // Clean linear base with a large spike on day 4.
      // Theil-Sen median slope should still reflect the underlying trend.
      const weights = [
        76.0, 76.02, 76.04, 76.06, 79.08, 76.1, 76.12, 76.14, 76.16, 76.18,
        76.2, 76.22, 76.24, 76.26,
      ];
      await seedWeights(weights, daysRepo);
      expect(await usecase.execute(usecaseRequest(14))).toBe("increasing");
    });
  });
});

// --- Helpers ---

async function seedWeights(
  weights: (number | undefined)[],
  daysRepo: MemoryDaysRepo,
  totalDaysAgo = weights.length,
): Promise<Day[]> {
  return seedWeightsForUser(weights, daysRepo, userId, totalDaysAgo);
}

async function seedWeightsForUser(
  weights: (number | undefined)[],
  daysRepo: MemoryDaysRepo,
  targetUserId: string,
  totalDaysAgo = weights.length,
): Promise<Day[]> {
  const createdDays: Day[] = [];

  for (let i = 0; i < weights.length; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (totalDaysAgo - 1 - i));

    const day = createEmptyTestDay({
      userId: targetUserId,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });

    if (weights[i] !== undefined) day.updateUserWeightInKg(weights[i]!);

    createdDays.push(day);
    await daysRepo.saveDay(day);
  }

  return createdDays;
}

// Builds a linear weight series: start + stepPerDay * i for each day
const linearWeights = (
  start: number,
  stepPerDay: number,
  days: number,
): (number | undefined)[] =>
  Array.from(
    { length: days },
    (_, i) => Math.round((start + i * stepPerDay) * 100) / 100,
  );
