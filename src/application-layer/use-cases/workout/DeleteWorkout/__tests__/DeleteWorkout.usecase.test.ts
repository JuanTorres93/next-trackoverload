import * as vp from '@/../tests/createProps';
import * as workoutTestProps from '../../../../../../tests/createProps/workoutTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/repos/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteWorkoutUsecase } from '../DeleteWorkout.usecase';

describe('DeleteWorkoutUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let deleteWorkoutUsecase: DeleteWorkoutUsecase;
  let user: User;
  let workout: Workout;

  beforeEach(async () => {
    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();
    deleteWorkoutUsecase = new DeleteWorkoutUsecase(workoutsRepo, usersRepo);

    user = User.create({
      ...userTestProps.validUserProps,
    });

    workout = Workout.create({
      ...workoutTestProps.validWorkoutProps,
      exercises: [],
    });

    await usersRepo.saveUser(user);
    await workoutsRepo.saveWorkout(workout);
  });

  describe('Execute', () => {
    it('should delete workout when it exists', async () => {
      // Verify workout exists
      const existingWorkout = await workoutsRepo.getWorkoutById(
        workoutTestProps.validWorkoutProps.id,
      );
      expect(existingWorkout).toBe(workout);

      await deleteWorkoutUsecase.execute({
        id: workoutTestProps.validWorkoutProps.id,
        userId: workoutTestProps.validWorkoutProps.userId,
      });

      // Verify workout is deleted
      const deletedWorkout = await workoutsRepo.getWorkoutById(
        workoutTestProps.validWorkoutProps.id,
      );
      expect(deletedWorkout).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when workout does not exist', async () => {
      const request = {
        id: 'non-existent',
        userId: workoutTestProps.validWorkoutProps.userId,
      };

      await expect(deleteWorkoutUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(deleteWorkoutUsecase.execute(request)).rejects.toThrow(
        /DeleteWorkoutUsecase.*Workout.*not found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        id: workoutTestProps.validWorkoutProps.id,
        userId: 'non-existent',
      };

      await expect(deleteWorkoutUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(deleteWorkoutUsecase.execute(request)).rejects.toThrow(
        /DeleteWorkoutUsecase.*user.*not.*found/,
      );
    });

    it("should throw error when trying to remove another user's workout", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
        email: 'another-user@example.com',
      });

      await usersRepo.saveUser(anotherUser);

      const request = {
        id: workoutTestProps.validWorkoutProps.id,
        userId: anotherUser.id,
      };

      await expect(deleteWorkoutUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(deleteWorkoutUsecase.execute(request)).rejects.toThrow(
        /DeleteWorkoutUsecase.*Workout.*not found/,
      );
    });
  });
});
