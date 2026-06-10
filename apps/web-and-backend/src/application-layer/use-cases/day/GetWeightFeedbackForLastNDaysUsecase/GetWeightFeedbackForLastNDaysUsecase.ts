import { NotFoundError } from "@/domain/common/errors";
import { DaysRepo } from "@/domain/repos/DaysRepo.port";

export type GetWeightFeedbackForLastNDaysUsecaseRequest = {
  dayId: string;
  userId: string;
  lastNDays: number;
};

export class GetWeightFeedbackForLastNDaysUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(
    request: GetWeightFeedbackForLastNDaysUsecaseRequest,
  ): Promise<WeightFeedback> {
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
