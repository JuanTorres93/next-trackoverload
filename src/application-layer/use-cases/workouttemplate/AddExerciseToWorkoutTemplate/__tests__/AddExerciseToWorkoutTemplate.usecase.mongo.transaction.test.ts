import { beforeEach, describe } from "vitest";

import { Exercise } from "@/domain/entities/exercise/Exercise";
import { User } from "@/domain/entities/user/User";
import { WorkoutTemplate } from "@/domain/entities/workouttemplate/WorkoutTemplate";
import { MongoExercisesRepo } from "@/infra/repos/mongo/MongoExercisesRepo";
import { MongoExternalExercisesRefRepo } from "@/infra/repos/mongo/MongoExternalExercisesRefRepo";
import { MongoUsersRepo } from "@/infra/repos/mongo/MongoUsersRepo";
import { MongoWorkoutTemplatesRepo } from "@/infra/repos/mongo/MongoWorkoutTemplatesRepo";
import { mockForThrowingError } from "@/infra/repos/mongo/__tests__/mockForThrowingError";
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from "@/infra/repos/mongo/__tests__/setupMongoTestDB";
import ExternalExerciseRefMongo from "@/infra/repos/mongo/models/ExternalExerciseRefMongo";
import { Uuidv4IdGenerator } from "@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator";
import { MongoTransactionContext } from "@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext";

import * as exerciseTestProps from "../../../../../../tests/createProps/exerciseTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import * as workoutTemplateTestProps from "../../../../../../tests/createProps/workoutTemplateTestProps";
import { AddExerciseToWorkoutTemplateUsecase } from "../AddExerciseToWorkoutTemplate.usecase";

describe("AddExerciseToWorkoutTemplateUsecase", () => {
  let workoutTemplatesRepo: MongoWorkoutTemplatesRepo;
  let exercisesRepo: MongoExercisesRepo;
  let externalExercisesRefRepo: MongoExternalExercisesRefRepo;
  let usersRepo: MongoUsersRepo;
  let usecase: AddExerciseToWorkoutTemplateUsecase;
  let user: User;
  let existingTemplate: WorkoutTemplate;
  // Exercises that are pre-seeded in the template (ex1, ex2)
  let preSeededExercises: Exercise[];

  const newExerciseRequest = {
    externalExerciseId: "ext-ex-new",
    source: "wger",
    name: "Bench Press",
    sets: 3,
  };

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    workoutTemplatesRepo = new MongoWorkoutTemplatesRepo();
    exercisesRepo = new MongoExercisesRepo();
    externalExercisesRefRepo = new MongoExternalExercisesRefRepo();
    usersRepo = new MongoUsersRepo();

    usecase = new AddExerciseToWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      exercisesRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
      externalExercisesRefRepo,
      new MongoTransactionContext(),
    );

    user = userTestProps.createTestUser();
    existingTemplate = workoutTemplateTestProps.createTestWorkoutTemplate();

    // MongoWorkoutTemplatesRepo populates template lines via join with exercises.
    // Exercises must exist in the DB before saving the template so that
    // getAllWorkoutTemplates() can reconstruct the template correctly.
    preSeededExercises = [
      exerciseTestProps.createTestExercise({ id: "ex1" }),
      exerciseTestProps.createTestExercise({ id: "ex2" }),
    ];
    for (const exercise of preSeededExercises) {
      await exercisesRepo.saveExercise(exercise);
    }

    await usersRepo.saveUser(user);
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    initialExpectations = async () => {
      const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
      expect(allTemplates).toHaveLength(1);
      const template = allTemplates[0];
      expect(template.exercises).toHaveLength(
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises.length,
      );

      const allExercises = await exercisesRepo.getAllExercises();
      expect(allExercises).toHaveLength(preSeededExercises.length);

      const externalRefCount = await ExternalExerciseRefMongo.countDocuments();
      expect(externalRefCount).toBe(0);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe("Transactions", () => {
    it("should rollback if error in saveExercise", async () => {
      await initialExpectations();

      mockForThrowingError(exercisesRepo, "saveExercise");

      await expect(
        usecase.execute({
          userId: userTestProps.userId,
          workoutTemplateId: existingTemplate.id,
          ...newExerciseRequest,
        }),
      ).rejects.toThrow("Mocked error in saveExercise");

      await initialExpectations();
    });

    it("should rollback if error in save external exercise ref", async () => {
      await initialExpectations();

      mockForThrowingError(externalExercisesRefRepo, "save");

      await expect(
        usecase.execute({
          userId: userTestProps.userId,
          workoutTemplateId: existingTemplate.id,
          ...newExerciseRequest,
        }),
      ).rejects.toThrow("Mocked error in save");

      await initialExpectations();
    });

    it("should rollback if error in saveWorkoutTemplate", async () => {
      await initialExpectations();

      mockForThrowingError(workoutTemplatesRepo, "saveWorkoutTemplate");

      await expect(
        usecase.execute({
          userId: userTestProps.userId,
          workoutTemplateId: existingTemplate.id,
          ...newExerciseRequest,
        }),
      ).rejects.toThrow("Mocked error in saveWorkoutTemplate");

      await initialExpectations();
    });
  });
});
