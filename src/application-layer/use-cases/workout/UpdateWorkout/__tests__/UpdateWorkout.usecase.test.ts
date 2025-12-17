import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
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
      ...vp.validUserProps,
    });

    workout = Workout.create({
      ...vp.validWorkoutProps,
      exercises: [],
    });

    await usersRepo.saveUser(user);
    await workoutsRepo.saveWorkout(workout);
  });

  describe('Execution', () => {
    it('should update workout name', async () => {
      const updatedWorkout = await updateWorkoutUsecase.execute({
        id: vp.validWorkoutProps.id,
        userId: vp.userId,
        name: 'Updated Push Day',
      });

      expect(updatedWorkout.name).toBe('Updated Push Day');
      expect(updatedWorkout.id).toBe(vp.validWorkoutProps.id);
      expect(updatedWorkout.workoutTemplateId).toBe('template-1');
      expect(updatedWorkout.exercises).toEqual([]);
    });

    it('should return WorkoutDTO', async () => {
      const updatedWorkout = await updateWorkoutUsecase.execute({
        id: vp.validWorkoutProps.id,
        userId: vp.userId,
        name: 'Updated Push Day',
      });

      expect(updatedWorkout).not.toBeInstanceOf(Workout);
      for (const prop of dto.workoutDTOProperties) {
        expect(updatedWorkout).toHaveProperty(prop);
      }
    });

    it('should keep existing name when not provided', async () => {
      const updatedWorkout = await updateWorkoutUsecase.execute({
        id: vp.validWorkoutProps.id,
        userId: vp.userId,
      });

      expect(updatedWorkout.name).toBe(vp.validWorkoutProps.name);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when workout does not exist', async () => {
      const request = {
        id: 'non-existent',
        userId: vp.userId,
        name: 'New Name',
      };

      await expect(updateWorkoutUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );

      await expect(updateWorkoutUsecase.execute(request)).rejects.toThrow(
        /UpdateWorkoutUsecase.*Workout.*not.*found/
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        id: vp.validWorkoutProps.id,
        userId: 'non-existent',
        name: 'New Name',
      };

      await expect(updateWorkoutUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );

      await expect(updateWorkoutUsecase.execute(request)).rejects.toThrow(
        /UpdateWorkoutUsecase.*User.*not.*found/
      );
    });
  });
});
