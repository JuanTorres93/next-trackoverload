import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateExerciseInWorkoutUsecase } from '../UpdateExerciseInWorkout.usecase';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { Workout } from '@/domain/entities/workout/Workout';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('UpdateExerciseInWorkoutUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let updateExerciseInWorkoutUsecase: UpdateExerciseInWorkoutUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    updateExerciseInWorkoutUsecase = new UpdateExerciseInWorkoutUsecase(
      workoutsRepo
    );
  });

  it('should update exercise reps in workout', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [
        {
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 0,
        },
      ],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: '1',
      exerciseId: 'exercise-1',
      reps: 15,
    });

    expect(updatedWorkout.exercises[0].reps).toBe(15);
    expect(updatedWorkout.exercises[0].setNumber).toBe(1);
    expect(updatedWorkout.exercises[0].weight).toBe(0);
  });

  it('should update exercise weight in workout', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [
        {
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 0,
        },
      ],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: '1',
      exerciseId: 'exercise-1',
      weight: 25.5,
    });

    expect(updatedWorkout.exercises[0].weight).toBe(25.5);
    expect(updatedWorkout.exercises[0].reps).toBe(10);
    expect(updatedWorkout.exercises[0].setNumber).toBe(1);
  });

  it('should update exercise set number in workout', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [
        {
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 0,
        },
      ],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: '1',
      exerciseId: 'exercise-1',
      setNumber: 2,
    });

    expect(updatedWorkout.exercises[0].setNumber).toBe(2);
    expect(updatedWorkout.exercises[0].reps).toBe(10);
    expect(updatedWorkout.exercises[0].weight).toBe(0);
  });

  it('should update multiple properties at once', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [
        {
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 0,
        },
      ],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: '1',
      exerciseId: 'exercise-1',
      setNumber: 3,
      reps: 12,
      weight: 30,
    });

    expect(updatedWorkout.exercises[0].setNumber).toBe(3);
    expect(updatedWorkout.exercises[0].reps).toBe(12);
    expect(updatedWorkout.exercises[0].weight).toBe(30);
  });

  it('should throw NotFoundError when workout does not exist', async () => {
    await expect(
      updateExerciseInWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: 'non-existent',
        exerciseId: 'exercise-1',
        reps: 15,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when exercise does not exist in workout', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    await expect(
      updateExerciseInWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: '1',
        exerciseId: 'non-existent-exercise',
        reps: 15,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when workoutId is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 123, {}, [], true, false];

    for (const invalidId of invalidIds) {
      await expect(
        updateExerciseInWorkoutUsecase.execute({
          userId: vp.userId,
          // @ts-expect-error Testing invalid inputs
          workoutId: invalidId,
          exerciseId: 'exercise-1',
          reps: 15,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when exerciseId is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 123, {}, [], true, false];

    for (const invalidId of invalidIds) {
      await expect(
        updateExerciseInWorkoutUsecase.execute({
          userId: vp.userId,
          workoutId: '1',
          // @ts-expect-error Testing invalid inputs
          exerciseId: invalidId,
          reps: 15,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when userId is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 123, {}, [], true, false];

    for (const invalidId of invalidIds) {
      await expect(
        updateExerciseInWorkoutUsecase.execute({
          // @ts-expect-error Testing invalid inputs
          userId: invalidId,
          workoutId: '1',
          exerciseId: 'exercise-1',
          reps: 15,
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
