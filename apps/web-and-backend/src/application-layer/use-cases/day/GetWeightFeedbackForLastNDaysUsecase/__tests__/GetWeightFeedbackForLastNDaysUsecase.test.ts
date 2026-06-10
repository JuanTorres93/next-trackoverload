import { Day } from "@/domain/entities/day/Day";
import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";

import "../../../../../../tests/createProps/dayTestProps";
import { createEmptyTestDay } from "../../../../../../tests/createProps/dayTestProps";
import { userId } from "../../../../../../tests/createProps/userTestProps";
import {
  GetWeightFeedbackForLastNDaysUsecase,
  GetWeightFeedbackForLastNDaysUsecaseRequest,
  VALID_FEEDBACK_VALUES,
} from "../GetWeightFeedbackForLastNDaysUsecase";

describe("GetWeightFeedbackForLastNDaysUsecase", () => {
  let daysRepo: MemoryDaysRepo;
  let usecase: GetWeightFeedbackForLastNDaysUsecase;
  let day: Day;

  let validRequest: GetWeightFeedbackForLastNDaysUsecaseRequest;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usecase = new GetWeightFeedbackForLastNDaysUsecase(daysRepo);

    validRequest = {
      userId,
      lastNDays: 7,
    };
  });

  describe("Execution", () => {
    it("should return WeightFeedback string", async () => {
      await createDaysWithWeightsForLastNDays([70, undefined], daysRepo);

      const response = await usecase.execute(validRequest);

      expect(VALID_FEEDBACK_VALUES).toContain(response);
    });
  });

  //describe('Errors', () => {

  //})
});

async function createDaysWithWeightsForLastNDays(
  weights: (number | undefined)[],
  daysRepo: MemoryDaysRepo,
): Promise<Day[]> {
  const numberOfDays = weights.length;

  const dates = Array.from({ length: numberOfDays }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (numberOfDays - 1 - i));

    return date;
  });

  const createdDays: Day[] = [];

  for (let i = 0; i < numberOfDays; i++) {
    const day = createEmptyTestDay({
      userId,
      day: dates[i].getDate(),
      month: dates[i].getMonth() + 1,
      year: dates[i].getFullYear(),
    });

    const weightForDay = weights[i];
    if (weightForDay !== undefined) day.updateUserWeightInKg(weightForDay);

    createdDays.push(day);
    await daysRepo.saveDay(day);
  }

  return createdDays;
}
