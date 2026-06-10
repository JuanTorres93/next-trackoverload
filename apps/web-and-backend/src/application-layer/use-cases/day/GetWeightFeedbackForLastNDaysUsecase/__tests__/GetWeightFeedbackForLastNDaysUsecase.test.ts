import { Day } from "@/domain/entities/day/Day";
import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";

import "../../../../../../tests/createProps/dayTestProps";
import { createEmptyTestDay } from "../../../../../../tests/createProps/dayTestProps";
import { userId } from "../../../../../../tests/createProps/userTestProps";
import { createAndPersistMultipleTestDaysWithWeights } from "../../../../../../tests/mocks/days";
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

    day = createEmptyTestDay();
    await daysRepo.saveDay(day);

    validRequest = {
      dayId: day.id,
      userId,
      lastNDays: 7,
    };
  });

  describe("Execution", () => {
    it("should return WeightFeedback string", async () => {
      const response = await usecase.execute(validRequest);

      expect(VALID_FEEDBACK_VALUES).toContain(response);
    });
  });

  //describe('Errors', () => {

  //})
});
