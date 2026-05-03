import * as dto from "@/../tests/dtoProperties";
import {
  NotFoundError,
  PermissionError,
  ValidationError,
} from "@/domain/common/errors";
import { User } from "@/domain/entities/user/User";
import { WorkoutTemplate } from "@/domain/entities/workouttemplate/WorkoutTemplate";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { MemoryWorkoutTemplatesRepo } from "@/infra/repos/memory/MemoryWorkoutTemplatesRepo";
import { Uuidv4IdGenerator } from "@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator";

import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import { CreateWorkoutTemplateUsecase } from "../CreateWorkoutTemplate.usecase";

const validRequest = {
  actorUserId: userTestProps.userId,
  targetUserId: userTestProps.userId,
  name: "Push Day",
  templateLines: [
    {
      exerciseId: "exercise-1",
      sets: 3,
    },
  ],
};

describe("CreateWorkoutTemplateUsecase", () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: CreateWorkoutTemplateUsecase;
  let user: User;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new CreateWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
    );

    user = userTestProps.createTestUser();
    await usersRepo.saveUser(user);
  });

  describe("Execution", () => {
    it("should create a new workout template with the given name", async () => {
      const request = {
        ...validRequest,
      };

      const result = await usecase.execute(request);

      expect(result.userId).toBe(userTestProps.userId);
      expect(result.name).toBe("Push Day");
    });

    it("should return a WorkoutTemplateDTO", async () => {
      const request = {
        ...validRequest,
      };

      const result = await usecase.execute(request);

      expect(result).not.toBeInstanceOf(WorkoutTemplate);
      for (const prop of dto.workoutTemplateDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it("should include exercises in created template", async () => {
      const request = {
        ...validRequest,
        templateLines: [
          {
            exerciseId: "exercise-1",
            sets: 3,
          },
          {
            exerciseId: "exercise-2",
            sets: 4,
          },
        ],
      };

      const result = await usecase.execute(request);

      expect(result.exercises).toHaveLength(2);
      expect(result.exercises[0].exerciseId).toBe("exercise-1");
      expect(result.exercises[0].sets).toBe(3);
      expect(result.exercises[1].exerciseId).toBe("exercise-2");
      expect(result.exercises[1].sets).toBe(4);
    });
  });

  describe("Side effects", () => {
    it("should save the workout template in the repository", async () => {
      const request = {
        ...validRequest,
        name: "Test template persistence",
      };

      const result = await usecase.execute(request);

      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        result.id,
      );
      expect(savedTemplate).not.toBeNull();
      expect(savedTemplate!.userId).toBe(userTestProps.userId);
      expect(savedTemplate!.name).toBe("Test template persistence");
    });

    it("should persist template lines in repo", async () => {
      const request = {
        ...validRequest,
        templateLines: [
          {
            exerciseId: "persisted-exercise",
            sets: 99,
          },
        ],
      };

      const result = await usecase.execute(request);

      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        result.id,
      );

      expect(savedTemplate).not.toBeNull();
      expect(savedTemplate!.exercises).toHaveLength(1);
      expect(savedTemplate!.exercises[0].exerciseId).toBe("persisted-exercise");
      expect(savedTemplate!.exercises[0].sets).toBe(99);
    });
  });

  describe("Errors", () => {
    it("should throw error if user does not exist", async () => {
      const request = {
        ...validRequest,
        actorUserId: "non-existent",
        targetUserId: "non-existent",
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutTemplateUsecase.*User.*not.*found/,
      );
    });

    it("should throw error when trying to create a workout template for another user", async () => {
      const request = {
        ...validRequest,
        targetUserId: "another-user-id",
      };

      await expect(usecase.execute(request)).rejects.toThrow(PermissionError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutTemplateUsecase.*cannot create.*template for.*another user/,
      );
    });

    it("should throw error if no template lines are provided", async () => {
      const request = {
        ...validRequest,
        templateLines: [],
      };

      // Assuming that the use case should throw an error if no template lines are provided
      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutTemplateUsecase.*at least one.*must/,
      );
    });
  });
});
