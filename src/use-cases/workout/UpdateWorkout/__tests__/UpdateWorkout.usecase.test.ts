import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateWorkoutUsecase } from '../UpdateWorkout.usecase';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { Workout } from '@/domain/entities/workout/Workout';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('UpdateWorkoutUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let updateWorkoutUsecase: UpdateWorkoutUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    updateWorkoutUsecase = new UpdateWorkoutUsecase(workoutsRepo);
  });

  it('should update workout name', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateWorkoutUsecase.execute({
      id: '1',
      userId: vp.userId,
      name: 'Updated Push Day',
    });

    expect(updatedWorkout.name).toBe('Updated Push Day');
    expect(updatedWorkout.id).toBe('1');
    expect(updatedWorkout.workoutTemplateId).toBe('template-1');
    expect(updatedWorkout.exercises).toEqual([]);
  });

  it('should keep existing name when not provided', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      name: 'Push Day',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateWorkoutUsecase.execute({
      id: '1',
      userId: vp.userId,
    });

    expect(updatedWorkout.name).toBe('Push Day');
  });

  it('should throw NotFoundError when workout does not exist', async () => {
    await expect(
      updateWorkoutUsecase.execute({
        id: 'non-existent',
        userId: vp.userId,
        name: 'New Name',
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when id is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 123, {}, [], true, false];

    for (const invalidId of invalidIds) {
      await expect(
        updateWorkoutUsecase.execute({
          userId: vp.userId,
          // @ts-expect-error Testing invalid inputs
          id: invalidId,
          name: 'New Name',
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when name is invalid', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      name: 'Push Day',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);
    const invalidNames = ['', '   ', null, 123, {}, [], true, false];

    for (const invalidName of invalidNames) {
      await expect(
        updateWorkoutUsecase.execute({
          userId: vp.userId,
          id: '1',
          // @ts-expect-error Testing invalid inputs
          name: invalidName,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when userId is invalid', async () => {
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
        updateWorkoutUsecase.execute({
          id: '1',
          // @ts-expect-error Testing invalid inputs
          userId: invalidUserId,
          name: 'New Name',
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
