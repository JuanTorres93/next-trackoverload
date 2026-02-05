import * as workoutTestProps from '../../../../../../tests/createProps/workoutTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/repos/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveSetFromWorkoutUsecase } from '../RemoveSetFromWorkout.usecase';

describe('RemoveSetFromWorkoutUsecase', () => {
  let workout: Workout;
  let workoutLine1: WorkoutLine;
  let workoutLine2: WorkoutLine;
  let workoutLine3: WorkoutLine;

  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let removeSetFromWorkoutUsecase: RemoveSetFromWorkoutUsecase;
  let user: User;

  beforeEach(async () => {
    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();
    removeSetFromWorkoutUsecase = new RemoveSetFromWorkoutUsecase(
      workoutsRepo,
      usersRepo,
    );

    user = User.create({
      ...userTestProps.validUserProps,
    });
    await usersRepo.saveUser(user);

    workout = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      name: 'Push Day',
    });

    workoutLine1 = WorkoutLine.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      workoutId: workout.id,
      exerciseId: 'exercise-1',
      setNumber: 1,
      reps: 10,
      weightInKg: 50,
    });

    workoutLine2 = WorkoutLine.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      workoutId: workout.id,
      exerciseId: 'exercise-1',
      setNumber: 2,
      reps: 8,
      weightInKg: 60,
    });

    workoutLine3 = WorkoutLine.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      workoutId: workout.id,
      exerciseId: 'exercise-2',
      setNumber: 1,
      reps: 15,
      weightInKg: 20,
    });

    workout.addExercise(workoutLine1);
    workout.addExercise(workoutLine2);
    workout.addExercise(workoutLine3);

    workoutsRepo.saveWorkout(workout);
  });

  describe('Execution', () => {
    it('should remove specific set from workout', async () => {
      const updatedWorkout = await removeSetFromWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        exerciseId: 'exercise-1',
        setNumber: 1,
      });

      expect(updatedWorkout.exercises).toHaveLength(2);
      // Should remove set 1 of exercise-1, and set 2 should be reordered to set 1
      const exercise1Sets = updatedWorkout.exercises.filter(
        (e) => e.exerciseId === 'exercise-1',
      );
      expect(exercise1Sets).toHaveLength(1);
      expect(exercise1Sets[0].setNumber).toBe(1); // Original set 2 reordered to set 1
      expect(exercise1Sets[0].reps).toBe(8); // Original set 2 data
      expect(exercise1Sets[0].weightInKg).toBe(60); // Original set 2 data
      expect(
        updatedWorkout.exercises.find((e) => e.exerciseId === 'exercise-2'),
      ).toBeDefined();
    });

    it('should return WorkoutDTO', async () => {
      const updatedWorkout = await removeSetFromWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workoutTestProps.validWorkoutProps.id,
        exerciseId: 'exercise-1',
        setNumber: 1,
      });

      expect(updatedWorkout).not.toBeInstanceOf(Workout);

      for (const prop of dto.workoutDTOProperties) {
        expect(updatedWorkout).toHaveProperty(prop);
      }
    });

    it('should remove only the specified set number', async () => {
      workout.addExercise(
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutPropsNoExercises(),
          workoutId: workout.id,
          exerciseId: 'exercise-1',
          setNumber: 3,
          reps: 6,
          weightInKg: 70,
        }),
      );

      await workoutsRepo.saveWorkout(workout);

      const updatedWorkout = await removeSetFromWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workoutTestProps.validWorkoutProps.id,
        exerciseId: 'exercise-1',
        setNumber: 2,
      });

      expect(updatedWorkout.exercises).toHaveLength(3);
    });

    it('should not modify workout when set does not exist', async () => {
      const workout = Workout.create({
        ...workoutTestProps.validWorkoutProps,
        name: 'Push Day',
        exercises: [workoutLine1],
      });

      await workoutsRepo.saveWorkout(workout);

      const updatedWorkout = await removeSetFromWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workoutTestProps.validWorkoutProps.id,
        exerciseId: 'exercise-1',
        setNumber: 99, // Non-existent set number
      });

      expect(updatedWorkout.exercises).toHaveLength(1);
      expect(updatedWorkout.exercises[0].exerciseId).toBe('exercise-1');
      expect(updatedWorkout.exercises[0].setNumber).toBe(1);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when workout does not exist', async () => {
      const request = {
        userId: userTestProps.userId,
        workoutId: 'non-existent',
        exerciseId: 'exercise-1',
        setNumber: 1,
      };

      await expect(
        removeSetFromWorkoutUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        removeSetFromWorkoutUsecase.execute(request),
      ).rejects.toThrow(/RemoveSetFromWorkoutUsecase.*Workout.*not.*found/);
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        userId: 'non-existent',
        workoutId: workoutTestProps.validWorkoutProps.id,
        exerciseId: 'exercise-1',
        setNumber: 1,
      };

      await expect(
        removeSetFromWorkoutUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        removeSetFromWorkoutUsecase.execute(request),
      ).rejects.toThrow(/RemoveSetFromWorkoutUsecase.*User.*not.*found/);
    });

    it("should throw error when trying to remove a set from another user's workout", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        userId: anotherUser.id,
        workoutId: workout.id,
        exerciseId: 'exercise-1',
        setNumber: 1,
      };

      await expect(
        removeSetFromWorkoutUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        removeSetFromWorkoutUsecase.execute(request),
      ).rejects.toThrow(/RemoveSetFromWorkoutUsecase.*Workout.*not.*found/);
    });
  });
});
