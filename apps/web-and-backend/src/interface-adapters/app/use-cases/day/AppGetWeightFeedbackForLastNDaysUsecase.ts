import { GetWeightFeedbackForLastNDaysUsecase } from "@/application-layer/use-cases/day/GetWeightFeedbackForLastNDaysUsecase/GetWeightFeedbackForLastNDaysUsecase";

import { AppDaysRepo } from "../../repos/AppDaysRepo";

export const AppGetWeightFeedbackForLastNDaysUsecase =
  new GetWeightFeedbackForLastNDaysUsecase(AppDaysRepo);
