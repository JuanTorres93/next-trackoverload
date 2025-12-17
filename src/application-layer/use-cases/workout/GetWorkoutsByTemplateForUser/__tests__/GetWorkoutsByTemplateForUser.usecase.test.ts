import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetWorkoutsByTemplateForUserUsecase } from '../GetWorkoutsByTemplateForUser.usecase';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('GetWorkoutsByTemplateUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let getWorkoutsByTemplateUsecase: GetWorkoutsByTemplateForUserUsecase;
  let user: User;
  let workout1: Workout;
  let workout2: Workout;
  let workout3: Workout;

  beforeEach(async () => {
    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();
    getWorkoutsByTemplateUsecase = new GetWorkoutsByTemplateForUserUsecase(
      workoutsRepo,
      usersRepo
    );

    user = User.create({
      ...vp.validUserProps,
    });

    workout1 = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      name: 'Push Day #1',
      exercises: [],
    });

    workout2 = Workout.create({
      ...vp.validWorkoutProps,
      id: '2',
      name: 'Pull Day #1',
      workoutTemplateId: 'template-2',
      exercises: [],
    });

    workout3 = Workout.create({
      ...vp.validWorkoutProps,
      id: '3',
      name: 'Push Day #2',
      exercises: [],
    });

    await usersRepo.saveUser(user);
    await workoutsRepo.saveWorkout(workout1);
    await workoutsRepo.saveWorkout(workout2);
    await workoutsRepo.saveWorkout(workout3);
  });

  describe('Execution', () => {
    it('should return workouts filtered by template id', async () => {
      const workouts = await getWorkoutsByTemplateUsecase.execute({
        templateId: 'template-1',
        userId: vp.userId,
      });

      const workoutIds = workouts.map((w) => w.id);

      expect(workouts).toHaveLength(2);
      expect(workoutIds).toContain(workout1.id);
      expect(workoutIds).toContain(workout3.id);
      expect(workoutIds).not.toContain(workout2.id);
    });

    it('should return array of WorkoutDTO', async () => {
      const workouts = await getWorkoutsByTemplateUsecase.execute({
        templateId: 'template-1',
        userId: vp.userId,
      });

      for (const workout of workouts) {
        expect(workout).not.toBeInstanceOf(Workout);

        for (const prop of dto.workoutDTOProperties) {
          expect(workout).toHaveProperty(prop);
        }
      }
    });

    it('should return empty array when no workouts exist for template', async () => {
      const workouts = await getWorkoutsByTemplateUsecase.execute({
        templateId: 'non-existent-template',
        userId: vp.userId,
      });

      expect(workouts).toHaveLength(0);
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        templateId: 'template-1',
        userId: 'non-existent',
      };

      await expect(
        getWorkoutsByTemplateUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);

      await expect(
        getWorkoutsByTemplateUsecase.execute(request)
      ).rejects.toThrow(
        /GetWorkoutsByTemplateForUserUsecase.*User.*not.*found/
      );
    });
  });
});
