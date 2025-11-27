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
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    // Verify workout exists
    const existingWorkout = await workoutsRepo.getWorkoutById(
      vp.validWorkoutProps.id.value
    );
    expect(existingWorkout).toBe(workout);

    await deleteWorkoutUsecase.execute({
      id: vp.validWorkoutProps.id.value,
      userId: vp.validWorkoutProps.userId.value,
    });

    // Verify workout is deleted
    const deletedWorkout = await workoutsRepo.getWorkoutById(
      vp.validWorkoutProps.id.value
    );
    expect(deletedWorkout).toBeNull();
  });

  it('should throw NotFoundError when workout does not exist', async () => {
    await expect(
      deleteWorkoutUsecase.execute({
        id: 'non-existent',
        userId: vp.validWorkoutProps.userId.value,
      })
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

  it('should throw error if userId is invalid', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    const invalidUserIds = [
      '',
      '   ',
      null,
      undefined,
      123,
      {},
      [],
      true,
      false,
    ];

    for (const invalidUserId of invalidUserIds) {
      await expect(
        deleteWorkoutUsecase.execute({
          id: vp.validWorkoutProps.id.value,
          // @ts-expect-error testing invalid types
          userId: invalidUserId,
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
