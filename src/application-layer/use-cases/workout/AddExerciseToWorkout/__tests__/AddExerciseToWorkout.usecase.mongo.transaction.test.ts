import { beforeEach, describe } from "vitest";

import { Exercise } from "@/domain/entities/exercise/Exercise";
import { User } from "@/domain/entities/user/User";
import { Workout } from "@/domain/entities/workout/Workout";
import { MemoryExternalExercisesRefRepo } from "@/infra/repos/memory/MemoryExternalExercisesRefRepo";
import { MongoExercisesRepo } from "@/infra/repos/mongo/MongoExercisesRepo";
import { MongoUsersRepo } from "@/infra/repos/mongo/MongoUsersRepo";
import { MongoWorkoutsRepo } from "@/infra/repos/mongo/MongoWorkoutsRepo";
import { mockForThrowingError } from "@/infra/repos/mongo/__tests__/mockForThrowingError";
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from "@/infra/repos/mongo/__tests__/setupMongoTestDB";
import WorkoutLineMongo from "@/infra/repos/mongo/models/WorkoutLineMongo";
import { Uuidv4IdGenerator } from "@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator";
import { MongoTransactionContext } from "@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext";

import * as exerciseTestProps from "../../../../../../tests/createProps/exerciseTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import * as workoutTestProps from "../../../../../../tests/createProps/workoutTestProps";
import { AddExerciseToWorkoutUsecase } from "../AddExerciseToWorkout.usecase";

describe("AddExerciseToWorkoutUsecase", () => {
  let workoutsRepo: MongoWorkoutsRepo;
  let exercisesRepo: MongoExercisesRepo;
  let externalExercisesRefRepo: MemoryExternalExercisesRefRepo;
  let usersRepo: MongoUsersRepo;
  let usecase: AddExerciseToWorkoutUsecase;
  let user: User;
  let existingWorkout: Workout;
  let preSeededExercises: Exercise[];

  const newExerciseRequest = {
    externalExerciseId: "ext-ex-new",
    source: "wger",
    name: "Deadlift",
    setNumber: 1,
    reps: 5,
    weightInKg: 100,
  };

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    workoutsRepo = new MongoWorkoutsRepo();
    exercisesRepo = new MongoExercisesRepo();
    externalExercisesRefRepo = new MemoryExternalExercisesRefRepo();
    usersRepo = new MongoUsersRepo();

    usecase = new AddExerciseToWorkoutUsecase(
      workoutsRepo,
      exercisesRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
      externalExercisesRefRepo,
      new MongoTransactionContext(),
    );

    user = userTestProps.createTestUser();

    preSeededExercises = [
      exerciseTestProps.createTestExercise({ id: "ex1" }),
      exerciseTestProps.createTestExercise({ id: "ex2" }),
    ];
    for (const exercise of preSeededExercises) {
      await exercisesRepo.saveExercise(exercise);
    }

    // MongoWorkoutsRepo returns null for workouts without exercises (population join).
    // Use a workout with the pre-seeded exercises so getWorkoutByIdAndUserId works.
    existingWorkout = workoutTestProps.createTestWorkout();

    await usersRepo.saveUser(user);
    await workoutsRepo.saveWorkout(existingWorkout);

    initialExpectations = async () => {
      // Workout lines count verifies no new exercise was added to the workout
      const workoutLineCount = await WorkoutLineMongo.countDocuments({
        workoutId: existingWorkout.id,
      });
      expect(workoutLineCount).toBe(existingWorkout.exercises.length);

      const allExercises = await exercisesRepo.getAllExercises();
      expect(allExercises).toHaveLength(preSeededExercises.length);
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
          workoutId: existingWorkout.id,
          ...newExerciseRequest,
        }),
      ).rejects.toThrow("Mocked error in saveExercise");

      await initialExpectations();
    });

    it("should rollback if error in save on external exercises", async () => {
      await initialExpectations();

      mockForThrowingError(externalExercisesRefRepo, "save");

      await expect(
        usecase.execute({
          userId: userTestProps.userId,
          workoutId: existingWorkout.id,
          ...newExerciseRequest,
        }),
      ).rejects.toThrow("Mocked error in save");

      await initialExpectations();
    });

    it("should rollback if error in saveWorkout", async () => {
      await initialExpectations();

      mockForThrowingError(workoutsRepo, "saveWorkout");

      await expect(
        usecase.execute({
          userId: userTestProps.userId,
          workoutId: existingWorkout.id,
          ...newExerciseRequest,
        }),
      ).rejects.toThrow("Mocked error in saveWorkout");

      await initialExpectations();
    });
  });
});
