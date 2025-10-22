import { beforeEach, describe, expect, it } from 'vitest';
import { GetWorkoutByIdForUserUsecase } from '../GetWorkoutByIdForUser.usecase';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { Workout } from '@/domain/entities/workout/Workout';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('GetWorkoutByIdUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let getWorkoutByIdUsecase: GetWorkoutByIdForUserUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    getWorkoutByIdUsecase = new GetWorkoutByIdForUserUsecase(workoutsRepo);
  });

  it('should return workout when it exists', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    const result = await getWorkoutByIdUsecase.execute({
      id: '1',
      userId: vp.userId,
    });

    expect(result).toBe(workout);
  });

  it('should return null when workout does not exist', async () => {
    const result = await getWorkoutByIdUsecase.execute({
      id: 'non-existent',
      userId: vp.userId,
    });

    expect(result).toBeNull();
  });

  it('should throw ValidationError when id is invalid', async () => {
    const invalidIds = ['', '   ', 3, null, undefined, {}, [], true, false];

    for (const id of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid types
        getWorkoutByIdUsecase.execute({ id })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when invalid userId', async () => {
    const invalidIds = ['', '   ', 3, null, undefined, {}, [], true, false];

    for (const userId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid types
        getWorkoutByIdUsecase.execute({ id: '1', userId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
