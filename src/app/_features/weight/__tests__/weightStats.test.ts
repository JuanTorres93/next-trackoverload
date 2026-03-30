import { getWeightFeedback } from '../weightStats';

const linearWeights = (
  start: number,
  stepPerDay: number,
  days: number,
): number[] =>
  Array.from(
    { length: days },
    (_, i) => Math.round((start + i * stepPerDay) * 100) / 100,
  );

describe('getWeightFeedback', () => {
  describe('insufficient data', () => {
    it('returns not enough data message for 0, 1, or 2 measurements', () => {
      expect(getWeightFeedback([])).toBe('No hay suficientes datos todavía');
      expect(getWeightFeedback([76])).toBe('No hay suficientes datos todavía');
      expect(getWeightFeedback([76, 75])).toBe(
        'No hay suficientes datos todavía',
      );
    });
  });

  describe('stable weight', () => {
    it('returns stable message when weight does not change', () => {
      expect(getWeightFeedback(Array(14).fill(76))).toBe(
        'Tu peso se mantiene estable',
      );
    });

    it('returns stable message when gain rate is below 0.3% per month', () => {
      // 0.005 kg/day on 76 kg → rate ≈ 0.0000658/day < 0.0001 (0.3%/month gain threshold)
      const weights = linearWeights(76, 0.005, 14);
      expect(getWeightFeedback(weights)).toBe('Tu peso se mantiene estable');
    });
  });

  describe('meaningful downward trend (losing between 1%/month and 1%/week)', () => {
    it('returns meaningful down message', () => {
      // 0.038 kg/day on 76 kg → rate ≈ 0.0005/day: above 1%/month, below 1%/week
      const weights = linearWeights(76, -0.038, 14);
      expect(getWeightFeedback(weights)).toBe(
        'Estás bajando de peso a un ritmo saludable',
      );
    });
  });

  describe('significant downward trend (losing ≥1.3%/week)', () => {
    it('returns too fast warning for loss', () => {
      // 0.15 kg/day on 76 kg → rate ≈ 0.00197/day > 0.001857 (1.3%/week threshold)
      const weights = linearWeights(76, -0.15, 14);
      expect(getWeightFeedback(weights)).toBe(
        'Estás bajando peso demasiado rápido',
      );
    });
  });

  describe('meaningful upward trend (gaining between 0.3% and 1.4% per month)', () => {
    it('returns healthy pace message for bulk', () => {
      // 0.018 kg/day on 76 kg → rate ≈ 0.000237/day: above 0.0001 (0.3%/month), below 0.000467 (1.4%/month)
      const weights = linearWeights(76, 0.018, 14);
      expect(getWeightFeedback(weights)).toBe(
        'Estás subiendo de peso a un ritmo saludable',
      );
    });
  });

  describe('significant upward trend (gaining ≥1.4% per month)', () => {
    it('returns too fast warning', () => {
      // 0.13 kg/day on 76 kg → rate ≈ 0.00171/day >> 0.000467 (1.4%/month threshold for gain)
      const weights = linearWeights(76, 0.13, 14);
      expect(getWeightFeedback(weights)).toBe(
        'Estás subiendo peso demasiado rápido',
      );
    });
  });

  describe('noisy data with outlier spike', () => {
    it('detects meaningful upward trend in the 0.3–1.4%/month range despite a large single-day spike', () => {
      // Clean linear base (slope 0.02 kg/day) plus spike on day 4.
      // Most of the 91 pairwise slopes = 0.02, so Theil-Sen median ≈ 0.02 regardless of spike.
      // 0.02 / 75.15 (median weight) ≈ 0.000266/day: between 0.0001 (0.3%/month) and 0.000467 (1.4%/month) → meaningful gain.
      const weights = [
        75.0, 75.02, 75.04, 75.06, 78.08, 75.1, 75.12, 75.14, 75.16, 75.18,
        75.2, 75.22, 75.24, 75.26,
      ];
      expect(getWeightFeedback(weights)).toBe(
        'Estás subiendo de peso a un ritmo saludable',
      );
    });
  });
});
