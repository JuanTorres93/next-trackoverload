import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteWorkoutUsecase } from '../DeleteWorkout.usecase';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { Workout } from '@/domain/entities/workout/Workout';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('DeleteWorkoutUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let deleteWorkoutUsecase: DeleteWorkoutUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    deleteWorkoutUsecase = new DeleteWorkoutUsecase(workoutsRepo);
  });

  it('should delete workout when it exists', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    // Verify workout exists
    const existingWorkout = await workoutsRepo.getWorkoutById('1');
    expect(existingWorkout).toBe(workout);

    await deleteWorkoutUsecase.execute({ id: '1' });

    // Verify workout is deleted
    const deletedWorkout = await workoutsRepo.getWorkoutById('1');
    expect(deletedWorkout).toBeNull();
  });

  it('should throw NotFoundError when workout does not exist', async () => {
    await expect(
      deleteWorkoutUsecase.execute({ id: 'non-existent' })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error when id is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 123, {}, [], true, false];

    for (const invalidId of invalidIds) {
      await expect(
        deleteWorkoutUsecase.execute({
          // @ts-expect-error testing invalid types
          id: invalidId,
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
