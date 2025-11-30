import * as vp from '@/../tests/createProps';
import { NotFoundError } from '@/domain/common/errors';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteWorkoutUsecase } from '../DeleteWorkout.usecase';

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
      vp.validWorkoutProps.id
    );
    expect(existingWorkout).toBe(workout);

    await deleteWorkoutUsecase.execute({
      id: vp.validWorkoutProps.id,
      userId: vp.validWorkoutProps.userId,
    });

    // Verify workout is deleted
    const deletedWorkout = await workoutsRepo.getWorkoutById(
      vp.validWorkoutProps.id
    );
    expect(deletedWorkout).toBeNull();
  });

  it('should throw NotFoundError when workout does not exist', async () => {
    await expect(
      deleteWorkoutUsecase.execute({
        id: 'non-existent',
        userId: vp.validWorkoutProps.userId,
      })
    ).rejects.toThrow(NotFoundError);
  });
});
