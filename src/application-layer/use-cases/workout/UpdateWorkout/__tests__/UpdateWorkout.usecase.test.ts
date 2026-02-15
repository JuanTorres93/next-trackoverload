import * as workoutTestProps from '../../../../../../tests/createProps/workoutTestProps';
import * as workoutTemplateTestProps from '../../../../../../tests/createProps/workoutTemplateTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/repos/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateWorkoutUsecase } from '../UpdateWorkout.usecase';

describe('UpdateWorkoutUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let updateWorkoutUsecase: UpdateWorkoutUsecase;
  let user: User;
  let workout: Workout;

  beforeEach(async () => {
    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();
    updateWorkoutUsecase = new UpdateWorkoutUsecase(workoutsRepo, usersRepo);

    user = userTestProps.createTestUser();

    workout = workoutTestProps.createTestWorkout({
      exercises: [],
    });

    await usersRepo.saveUser(user);
    await workoutsRepo.saveWorkout(workout);
  });

  describe('Execution', () => {
    it('should update workout name', async () => {
      const updatedWorkout = await updateWorkoutUsecase.execute({
        id: workout.id,
        userId: userTestProps.userId,
        name: 'Updated Push Day',
      });

      expect(updatedWorkout.name).toBe('Updated Push Day');
      expect(updatedWorkout.id).toBe(workout.id);
      expect(updatedWorkout.workoutTemplateId).toBe(
        workoutTemplateTestProps.validWorkoutTemplateProps().id,
      );
      expect(updatedWorkout.exercises).toEqual([]);
    });

    it('should return WorkoutDTO', async () => {
      const updatedWorkout = await updateWorkoutUsecase.execute({
        id: workout.id,
        userId: userTestProps.userId,
        name: 'Updated Push Day',
      });

      expect(updatedWorkout).not.toBeInstanceOf(Workout);
      for (const prop of dto.workoutDTOProperties) {
        expect(updatedWorkout).toHaveProperty(prop);
      }
    });

    it('should keep existing name when not provided', async () => {
      const updatedWorkout = await updateWorkoutUsecase.execute({
        id: workout.id,
        userId: userTestProps.userId,
      });

      expect(updatedWorkout.name).toBe(workout.name);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when workout does not exist', async () => {
      const request = {
        id: 'non-existent',
        userId: userTestProps.userId,
        name: 'New Name',
      };

      await expect(updateWorkoutUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(updateWorkoutUsecase.execute(request)).rejects.toThrow(
        /UpdateWorkoutUsecase.*Workout.*not.*found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        id: workout.id,
        userId: 'non-existent',
        name: 'New Name',
      };

      await expect(updateWorkoutUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(updateWorkoutUsecase.execute(request)).rejects.toThrow(
        /UpdateWorkoutUsecase.*User.*not.*found/,
      );
    });

    it("should throw error when trying to update another user's workout", async () => {
      const anotherUser = userTestProps.createTestUser({
        id: 'another-user-id',
      });

      await usersRepo.saveUser(anotherUser);

      const request = {
        id: workout.id,
        userId: anotherUser.id,
        name: 'New Name',
      };

      await expect(updateWorkoutUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(updateWorkoutUsecase.execute(request)).rejects.toThrow(
        /UpdateWorkoutUsecase.*Workout.*not.*found/,
      );
    });
  });
});
