import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllWorkoutsForUserUsecase } from '../GetAllWorkoutsForUser.usecase';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { Workout } from '@/domain/entities/workout/Workout';
import * as vp from '@/../tests/createProps';
import { ValidationError } from '@/domain/common/errors';

describe('GetAllWorkoutsUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let getAllWorkoutsUsecase: GetAllWorkoutsForUserUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    getAllWorkoutsUsecase = new GetAllWorkoutsForUserUsecase(workoutsRepo);
  });

  it('should return all workouts', async () => {
    const workout1 = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      name: 'Push Day',
      exercises: [],
    });
    const workout2 = Workout.create({
      ...vp.validWorkoutProps,
      id: '2',
      name: 'Pull Day',
      workoutTemplateId: 'template-2',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout1);
    await workoutsRepo.saveWorkout(workout2);

    const workouts = await getAllWorkoutsUsecase.execute({ userId: vp.userId });

    expect(workouts).toHaveLength(2);
    expect(workouts).toContain(workout1);
    expect(workouts).toContain(workout2);
  });

  it('should return empty array when no workouts exist', async () => {
    const workouts = await getAllWorkoutsUsecase.execute({ userId: vp.userId });
    expect(workouts).toHaveLength(0);
  });

  it('should throw error when userId is invalid', async () => {
    const invalidUserIds = [
      null,
      undefined,
      '',
      '   ',
      123,
      {},
      [],
      true,
      false,
      () => {},
      NaN,
    ];

    for (const invalidUserId of invalidUserIds) {
      await expect(async () => {
        // @ts-expect-error testing invalid inputs
        await getAllWorkoutsUsecase.execute({ userId: invalidUserId });
      }).rejects.toThrow(ValidationError);
    }
  });
});
