import { NotFoundError } from "@/domain/common/errors";
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

    // TODO DELETE THESE DEBUG LOGS
    console.log("days USE CASE");
    console.log(days);

    return "stable";
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
