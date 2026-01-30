import * as vp from '@/../tests/createProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/repos/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetWorkoutByIdForUserUsecase } from '../GetWorkoutByIdForUser.usecase';

describe('GetWorkoutByIdUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let getWorkoutByIdUsecase: GetWorkoutByIdForUserUsecase;
  let user: User;

  beforeEach(async () => {
    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();
    getWorkoutByIdUsecase = new GetWorkoutByIdForUserUsecase(
      workoutsRepo,
      usersRepo,
    );

    user = User.create({
      ...userTestProps.validUserProps,
    });
    await usersRepo.saveUser(user);
  });

  describe('Execution', () => {
    it('should return workout when it exists', async () => {
      const workout = Workout.create({
        ...vp.validWorkoutProps,
        exercises: [],
      });

      await workoutsRepo.saveWorkout(workout);

      const result = await getWorkoutByIdUsecase.execute({
        id: vp.validWorkoutProps.id,
        userId: userTestProps.userId,
      });

      expect(result).toEqual(toWorkoutDTO(workout));
    });

    it('should return WorkoutDTO', async () => {
      const workout = Workout.create({
        ...vp.validWorkoutProps,
        name: 'Push Day',
        exercises: [],
      });

      await workoutsRepo.saveWorkout(workout);

      const result = await getWorkoutByIdUsecase.execute({
        id: vp.validWorkoutProps.id,
        userId: userTestProps.userId,
      });

      expect(result).not.toBeInstanceOf(Workout);

      for (const prop of dto.workoutDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should return null when workout does not exist', async () => {
      const result = await getWorkoutByIdUsecase.execute({
        id: 'non-existent',
        userId: userTestProps.userId,
      });

      expect(result).toBeNull();
    });

    it('should return null when trying to get workout from another user', async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const workout = Workout.create({
        ...vp.validWorkoutProps,
        exercises: [],
      });

      await workoutsRepo.saveWorkout(workout);

      const result = await getWorkoutByIdUsecase.execute({
        id: vp.validWorkoutProps.id,
        userId: anotherUser.id,
      });

      expect(result).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      await expect(
        getWorkoutByIdUsecase.execute({
          id: vp.validWorkoutProps.id,
          userId: 'non-existent',
        }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        getWorkoutByIdUsecase.execute({
          id: vp.validWorkoutProps.id,
          userId: 'non-existent',
        }),
      ).rejects.toThrow(/GetWorkoutByIdForUserUsecase.*User.*not.*found/);
    });
  });
});
