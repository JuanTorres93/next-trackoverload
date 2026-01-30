import * as vp from '@/../tests/createProps';
import * as workoutTestProps from '../../../../../../tests/createProps/workoutTestProps';
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

  describe('Execution', () => {
    it('should update workout name', async () => {
      const updatedWorkout = await updateWorkoutUsecase.execute({
        id: workoutTestProps.validWorkoutProps.id,
        userId: userTestProps.userId,
        name: 'Updated Push Day',
      });

      expect(updatedWorkout.name).toBe('Updated Push Day');
      expect(updatedWorkout.id).toBe(workoutTestProps.validWorkoutProps.id);
      expect(updatedWorkout.workoutTemplateId).toBe('template-1');
      expect(updatedWorkout.exercises).toEqual([]);
    });

    it('should return WorkoutDTO', async () => {
      const updatedWorkout = await updateWorkoutUsecase.execute({
        id: workoutTestProps.validWorkoutProps.id,
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
        id: workoutTestProps.validWorkoutProps.id,
        userId: userTestProps.userId,
      });

      expect(updatedWorkout.name).toBe(workoutTestProps.validWorkoutProps.name);
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
        id: workoutTestProps.validWorkoutProps.id,
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
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
      });

      await usersRepo.saveUser(anotherUser);

      const request = {
        id: workoutTestProps.validWorkoutProps.id,
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
