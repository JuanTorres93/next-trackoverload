import * as dto from "@/../tests/dtoProperties";
import { NotFoundError } from "@/domain/common/errors";
import { User } from "@/domain/entities/user/User";
import { WorkoutTemplate } from "@/domain/entities/workouttemplate/WorkoutTemplate";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { MemoryExternalExercisesRefRepo } from "@/infra/repos/memory/MemoryExternalExercisesRefRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { MemoryWorkoutTemplatesRepo } from "@/infra/repos/memory/MemoryWorkoutTemplatesRepo";
import { Uuidv4IdGenerator } from "@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator";
import { MemoryTransactionContext } from "@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext";

import * as exerciseTestProps from "../../../../../../tests/createProps/exerciseTestProps";
import * as externalExerciseRefTestProps from "../../../../../../tests/createProps/externalExerciseRefTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import * as workoutTemplateTestProps from "../../../../../../tests/createProps/workoutTemplateTestProps";
import { AddExerciseToWorkoutTemplateUsecase } from "../AddExerciseToWorkoutTemplate.usecase";

describe("AddExerciseToWorkoutTemplateUsecase", () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let exercisesRepo: MemoryExercisesRepo;
  let externalExercisesRefRepo: MemoryExternalExercisesRefRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: AddExerciseToWorkoutTemplateUsecase;
  let existingTemplate: WorkoutTemplate;
  let user: User;

  const newExerciseRequest = {
    externalExerciseId: "ext-ex-new",
    source: "wger",
    name: "Shoulder Press",
    sets: 4,
  };

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    exercisesRepo = new MemoryExercisesRepo();
    externalExercisesRefRepo = new MemoryExternalExercisesRefRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new AddExerciseToWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      exercisesRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
      externalExercisesRefRepo,
      new MemoryTransactionContext(),
    );

    user = userTestProps.createTestUser();
    existingTemplate = workoutTemplateTestProps.createTestWorkoutTemplate();

    await usersRepo.saveUser(user);
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);
  });

  describe("Execution", () => {
    it("should add exercise to workout template", async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId:
          workoutTemplateTestProps.validWorkoutTemplateProps().id,
        ...newExerciseRequest,
      };

      const result = await usecase.execute(request);

      expect(result.exercises).toHaveLength(
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises.length +
          1,
      );
    });

    it("should return WorkoutTemplateDTO", async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: existingTemplate.id,
        ...newExerciseRequest,
      };

      const result = await usecase.execute(request);

      expect(result).not.toBeInstanceOf(WorkoutTemplate);
      for (const prop of dto.workoutTemplateDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it("should persist the updated template", async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: existingTemplate.id,
        ...newExerciseRequest,
      };

      await usecase.execute(request);

      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        existingTemplate.id,
      );
      expect(savedTemplate!.exercises).toHaveLength(
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises.length +
          1,
      );
    });
  });

  describe("Side effects", () => {
    it("should create and save a new exercise when it does not exist", async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: existingTemplate.id,
        ...newExerciseRequest,
      };

      const exercisesBefore = exercisesRepo.countForTesting();

      await usecase.execute(request);

      expect(exercisesRepo.countForTesting()).toBe(exercisesBefore + 1);
    });

    it("should create and save a new external exercise ref when it does not exist", async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: existingTemplate.id,
        ...newExerciseRequest,
      };

      const refsBefore = externalExercisesRefRepo.countForTesting();

      await usecase.execute(request);

      expect(externalExercisesRefRepo.countForTesting()).toBe(refsBefore + 1);

      const savedRef = await externalExercisesRefRepo.getByExternalIdAndSource(
        newExerciseRequest.externalExerciseId,
        newExerciseRequest.source,
      );
      expect(savedRef).not.toBeNull();
    });

    it("should reuse existing exercise and not create duplicates", async () => {
      // Use an exercise not already present in the template (template has ex1 and ex2)
      const existingExercise = exerciseTestProps.createTestExercise({
        id: "ex-already-known",
      });
      const existingExternalRef =
        externalExerciseRefTestProps.createTestExternalExerciseRef({
          externalId: "ext-ex-already-known",
          exerciseId: existingExercise.id,
        });

      await exercisesRepo.saveExercise(existingExercise);
      await externalExercisesRefRepo.save(existingExternalRef);

      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: existingTemplate.id,
        externalExerciseId: "ext-ex-already-known",
        source:
          externalExerciseRefTestProps.validExternalExerciseRefProps.source,
        name: "Does not matter",
        sets: 3,
      };

      const exercisesBefore = exercisesRepo.countForTesting();
      const refsBefore = externalExercisesRefRepo.countForTesting();

      await usecase.execute(request);

      expect(exercisesRepo.countForTesting()).toBe(exercisesBefore);
      expect(externalExercisesRefRepo.countForTesting()).toBe(refsBefore);
    });
  });

  describe("Errors", () => {
    it("should throw NotFoundError when workout template does not exist", async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: "non-existent",
        ...newExerciseRequest,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /AddExerciseToWorkoutTemplateUsecase.*WorkoutTemplate.*not found/,
      );
    });

    it("should throw NotFoundError when trying to add exercise to deleted template", async () => {
      existingTemplate.markAsDeleted();
      await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: existingTemplate.id,
        ...newExerciseRequest,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /AddExerciseToWorkoutTemplateUsecase.*WorkoutTemplate.*not found/,
      );
    });

    it("should throw NotFoundError when user does not exist", async () => {
      const request = {
        userId: "non-existent",
        workoutTemplateId: existingTemplate.id,
        ...newExerciseRequest,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /AddExerciseToWorkoutTemplateUsecase.*User.*not.*found/,
      );
    });

    it("should throw NotFoundError when trying to add exercise to another user's template", async () => {
      const anotherUser = userTestProps.createTestUser({ id: "user-2" });
      await usersRepo.saveUser(anotherUser);

      const request = {
        userId: anotherUser.id,
        workoutTemplateId: existingTemplate.id,
        ...newExerciseRequest,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /AddExerciseToWorkoutTemplateUsecase.*WorkoutTemplate.*not found/,
      );
    });
  });
});
