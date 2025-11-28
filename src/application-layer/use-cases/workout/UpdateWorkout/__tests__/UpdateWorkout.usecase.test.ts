import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateWorkoutUsecase } from '../UpdateWorkout.usecase';

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
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

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
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

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
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateWorkoutUsecase.execute({
      id: vp.validWorkoutProps.id,
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
      name: 'Push Day',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);
    const invalidNames = ['', '   ', null, 123, {}, [], true, false];

    for (const invalidName of invalidNames) {
      await expect(
        updateWorkoutUsecase.execute({
          userId: vp.userId,
          id: vp.validWorkoutProps.id,
          // @ts-expect-error Testing invalid inputs
          name: invalidName,
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
