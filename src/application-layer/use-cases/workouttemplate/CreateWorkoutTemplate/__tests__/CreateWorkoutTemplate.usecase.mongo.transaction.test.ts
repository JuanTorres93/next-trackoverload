import { beforeEach, describe } from "vitest";

import { User } from "@/domain/entities/user/User";
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

import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import { CreateWorkoutTemplateLineData } from "../../common/createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo";
import { CreateWorkoutTemplateUsecase } from "../CreateWorkoutTemplate.usecase";

describe("CreateWorkoutTemplateUsecase", () => {
  let workoutTemplatesRepo: MongoWorkoutTemplatesRepo;
  let exercisesRepo: MongoExercisesRepo;
  let externalExercisesRefRepo: MongoExternalExercisesRefRepo;
  let usersRepo: MongoUsersRepo;
  let usecase: CreateWorkoutTemplateUsecase;
  let user: User;
  let testTemplateLine: CreateWorkoutTemplateLineData;

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

    usecase = new CreateWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
      exercisesRepo,
      externalExercisesRefRepo,
      new MongoTransactionContext(),
    );

    user = userTestProps.createTestUser();
    await usersRepo.saveUser(user);

    testTemplateLine = {
      externalExerciseId: "ext-ex-1",
      source: "wger",
      name: "Bench Press",
      sets: 3,
    };

    initialExpectations = async () => {
      const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
      expect(allTemplates).toHaveLength(0);

      const allExercises = await exercisesRepo.getAllExercises();
      expect(allExercises).toHaveLength(0);

      const externalRefCount = await ExternalExerciseRefMongo.countDocuments();
      expect(externalRefCount).toBe(0);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe("Transactions", () => {
    it("should rollback if save external exercise ref fails", async () => {
      await initialExpectations();

      mockForThrowingError(externalExercisesRefRepo, "save");

      await expect(
        usecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
          name: "Push Day",
          templateLines: [testTemplateLine],
        }),
      ).rejects.toThrow("Mocked error in save");

      await initialExpectations();
    });

    it("should rollback if saveExercise fails", async () => {
      await initialExpectations();

      mockForThrowingError(exercisesRepo, "saveExercise");

      await expect(
        usecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
          name: "Push Day",
          templateLines: [testTemplateLine],
        }),
      ).rejects.toThrow("Mocked error in saveExercise");

      await initialExpectations();
    });

    it("should rollback if saveWorkoutTemplate fails", async () => {
      await initialExpectations();

      mockForThrowingError(workoutTemplatesRepo, "saveWorkoutTemplate");

      await expect(
        usecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
          name: "Push Day",
          templateLines: [testTemplateLine],
        }),
      ).rejects.toThrow("Mocked error in saveWorkoutTemplate");

      await initialExpectations();
    });
  });
});
