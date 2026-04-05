import * as dto from "@/../tests/dtoProperties";
import { NotFoundError } from "@/domain/common/errors";
import { User } from "@/domain/entities/user/User";
import { Workout } from "@/domain/entities/workout/Workout";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { MemoryExternalExercisesRefRepo } from "@/infra/repos/memory/MemoryExternalExercisesRefRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { MemoryWorkoutsRepo } from "@/infra/repos/memory/MemoryWorkoutsRepo";
import { Uuidv4IdGenerator } from "@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator";
import { MemoryTransactionContext } from "@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext";

import * as exerciseTestProps from "../../../../../../tests/createProps/exerciseTestProps";
import * as externalExerciseRefTestProps from "../../../../../../tests/createProps/externalExerciseRefTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import * as workoutTestProps from "../../../../../../tests/createProps/workoutTestProps";
import { AddExerciseToWorkoutUsecase } from "../AddExerciseToWorkout.usecase";

describe("AddExerciseToWorkoutUsecase", () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let exercisesRepo: MemoryExercisesRepo;
  let externalExercisesRefRepo: MemoryExternalExercisesRefRepo;
  let usersRepo: MemoryUsersRepo;

  let addExerciseToWorkoutUsecase: AddExerciseToWorkoutUsecase;

  let user: User;
  let workout: Workout;

  const newExerciseRequest = {
    externalExerciseId: "ext-ex-new",
    source: "wger",
    name: "Squat",
    setNumber: 1,
    reps: 10,
    weightInKg: 0,
  };

  beforeEach(async () => {
    workoutsRepo = new MemoryWorkoutsRepo();
    exercisesRepo = new MemoryExercisesRepo();
    externalExercisesRefRepo = new MemoryExternalExercisesRefRepo();
    usersRepo = new MemoryUsersRepo();
    addExerciseToWorkoutUsecase = new AddExerciseToWorkoutUsecase(
      workoutsRepo,
      exercisesRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
      externalExercisesRefRepo,
      new MemoryTransactionContext(),
    );

    user = userTestProps.createTestUser();
    workout = workoutTestProps.createTestWorkout({ exercises: [] });

    await usersRepo.saveUser(user);
    await workoutsRepo.saveWorkout(workout);
  });

  describe("Execute", () => {
    it("should add exercise to workout", async () => {
      const updatedWorkout = await addExerciseToWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        ...newExerciseRequest,
      });

      expect(updatedWorkout.exercises).toHaveLength(1);
      expect(updatedWorkout.exercises[0]).toEqual({
        id: updatedWorkout.exercises[0].id,
        workoutId: workout.id,
        exerciseId: updatedWorkout.exercises[0].exerciseId,
        setNumber: newExerciseRequest.setNumber,
        reps: newExerciseRequest.reps,
        weightInKg: newExerciseRequest.weightInKg,
        createdAt: updatedWorkout.exercises[0].createdAt,
        updatedAt: updatedWorkout.exercises[0].updatedAt,
      });
    });

    it("should return WorkoutDTO", async () => {
      const updatedWorkout = await addExerciseToWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        ...newExerciseRequest,
      });

      for (const prop of dto.workoutDTOProperties) {
        expect(updatedWorkout).not.toBeInstanceOf(Workout);
        expect(updatedWorkout).toHaveProperty(prop);
      }
    });

    it("should add exercise with different set number", async () => {
      // First set
      await addExerciseToWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        ...newExerciseRequest,
        setNumber: 1,
      });

      // Second set (same external exercise = reuses existing exercise)
      const updatedWorkout = await addExerciseToWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        ...newExerciseRequest,
        setNumber: 2,
      });

      expect(updatedWorkout.exercises).toHaveLength(2);
      expect(updatedWorkout.exercises[1].setNumber).toBe(2);
    });
  });

  describe("Side effects", () => {
    it("should create and save a new exercise when it does not exist", async () => {
      const exercisesBefore = exercisesRepo.countForTesting();

      await addExerciseToWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        ...newExerciseRequest,
      });

      expect(exercisesRepo.countForTesting()).toBe(exercisesBefore + 1);
    });

    it("should create and save a new external exercise ref when it does not exist", async () => {
      const refsBefore = externalExercisesRefRepo.countForTesting();

      await addExerciseToWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        ...newExerciseRequest,
      });

      expect(externalExercisesRefRepo.countForTesting()).toBe(refsBefore + 1);

      const savedRef = await externalExercisesRefRepo.getByExternalIdAndSource(
        newExerciseRequest.externalExerciseId,
        newExerciseRequest.source,
      );
      expect(savedRef).not.toBeNull();
    });

    it("should reuse existing exercise and not create duplicates", async () => {
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

      const exercisesBefore = exercisesRepo.countForTesting();
      const refsBefore = externalExercisesRefRepo.countForTesting();

      await addExerciseToWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        externalExerciseId: "ext-ex-already-known",
        source:
          externalExerciseRefTestProps.validExternalExerciseRefProps.source,
        name: "Does not matter",
        setNumber: 1,
        reps: 10,
        weightInKg: 0,
      });

      expect(exercisesRepo.countForTesting()).toBe(exercisesBefore);
      expect(externalExercisesRefRepo.countForTesting()).toBe(refsBefore);
    });
  });

  describe("Errors", () => {
    it("should throw NotFoundError when workout does not exist", async () => {
      const request = {
        userId: userTestProps.userId,
        workoutId: "non-existent",
        ...newExerciseRequest,
      };

      await expect(
        addExerciseToWorkoutUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        addExerciseToWorkoutUsecase.execute(request),
      ).rejects.toThrow(/AddExerciseToWorkoutUsecase.*Workout.*not found/);
    });

    it("should throw error if user does not exist", async () => {
      const anotherWorkout = workoutTestProps.createTestWorkout({
        exercises: [],
      });
      await workoutsRepo.saveWorkout(anotherWorkout);

      const request = {
        userId: "non-existent",
        workoutId: anotherWorkout.id,
        ...newExerciseRequest,
      };

      await expect(
        addExerciseToWorkoutUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);
      await expect(
        addExerciseToWorkoutUsecase.execute(request),
      ).rejects.toThrow(/AddExerciseToWorkoutUsecase.*user.*not.*found/);
    });

    it("should throw error when trying to add exercise to another user's workout", async () => {
      const anotherUser = userTestProps.createTestUser({
        id: "another-user-id",
        email: "another-user@example.com",
      });

      await usersRepo.saveUser(anotherUser);

      const request = {
        userId: anotherUser.id,
        workoutId: workout.id,
        ...newExerciseRequest,
      };

      await expect(
        addExerciseToWorkoutUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        addExerciseToWorkoutUsecase.execute(request),
      ).rejects.toThrow(/AddExerciseToWorkoutUsecase.*Workout.*not found/);
    });
  });
});
