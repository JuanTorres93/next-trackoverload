import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllWorkoutsForUserUsecase } from '../GetAllWorkoutsForUser.usecase';

describe('GetAllWorkoutsUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let getAllWorkoutsUsecase: GetAllWorkoutsForUserUsecase;
  let user: User;

  beforeEach(async () => {
    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();
    getAllWorkoutsUsecase = new GetAllWorkoutsForUserUsecase(
      workoutsRepo,
      usersRepo
    );

    user = User.create({
      ...vp.validUserProps,
    });
    await usersRepo.saveUser(user);
  });

  describe('Execution', () => {
    it('should return all workouts', async () => {
      const workout1 = Workout.create({
        ...vp.validWorkoutProps,
        name: 'Push Day',
        exercises: [],
      });
      const workout2 = Workout.create({
        ...vp.validWorkoutProps,
        id: 'another-workout-id',
        name: 'Pull Day',
        exercises: [],
      });

      await workoutsRepo.saveWorkout(workout1);
      await workoutsRepo.saveWorkout(workout2);

      const workouts = await getAllWorkoutsUsecase.execute({
        userId: vp.userId,
      });

      const workoutIds = workouts.map((w) => w.id);

      expect(workouts).toHaveLength(2);
      expect(workoutIds).toContain(workout1.id);
      expect(workoutIds).toContain(workout2.id);
    });

    it('should return an array of WorkoutDTO', async () => {
      const workout1 = Workout.create({
        ...vp.validWorkoutProps,
        name: 'Push Day',
        exercises: [],
      });
      const workout2 = Workout.create({
        ...vp.validWorkoutProps,
        id: 'another-workout-id',
        name: 'Pull Day',
        exercises: [],
      });

      await workoutsRepo.saveWorkout(workout1);
      await workoutsRepo.saveWorkout(workout2);

      const workouts = await getAllWorkoutsUsecase.execute({
        userId: vp.userId,
      });

      for (const workout of workouts) {
        expect(workout).not.toBeInstanceOf(Workout);

        for (const prop of dto.workoutDTOProperties) {
          expect(workout).toHaveProperty(prop);
        }
      }
    });

    it('should return empty array when no workouts exist', async () => {
      const workouts = await getAllWorkoutsUsecase.execute({
        userId: vp.userId,
      });
      expect(workouts).toHaveLength(0);
    });

    it('should return empty array when trying to get workouts from another user', async () => {
      const anotherUser = User.create({
        ...vp.validUserProps,
        id: 'another-user-id',
        email: 'another-user@example.com',
      });

      await usersRepo.saveUser(anotherUser);

      const request = {
        userId: anotherUser.id,
      };

      const workouts = await getAllWorkoutsUsecase.execute(request);
      expect(workouts).toHaveLength(0);
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        userId: 'non-existent',
      };

      await expect(getAllWorkoutsUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );

      await expect(getAllWorkoutsUsecase.execute(request)).rejects.toThrow(
        /GetAllWorkoutsForUserUsecase.*User.*not.*found/
      );
    });
  });
});
