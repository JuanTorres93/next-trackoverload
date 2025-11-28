import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveSetFromWorkoutUsecase } from '../RemoveSetFromWorkout.usecase';

describe('RemoveSetFromWorkoutUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let removeSetFromWorkoutUsecase: RemoveSetFromWorkoutUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    removeSetFromWorkoutUsecase = new RemoveSetFromWorkoutUsecase(workoutsRepo);
  });

  it('should remove specific set from workout', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [
        {
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 50,
        },
        {
          exerciseId: 'exercise-1',
          setNumber: 2,
          reps: 8,
          weight: 60,
        },
        {
          exerciseId: 'exercise-2',
          setNumber: 1,
          reps: 15,
          weight: 20,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await removeSetFromWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: 'exercise-1',
      setNumber: 1,
    });

    expect(updatedWorkout.exercises).toHaveLength(2);
    // Should remove set 1 of exercise-1, and set 2 should be reordered to set 1
    const exercise1Sets = updatedWorkout.exercises.filter(
      (e) => e.exerciseId === 'exercise-1'
    );
    expect(exercise1Sets).toHaveLength(1);
    expect(exercise1Sets[0].setNumber).toBe(1); // Original set 2 reordered to set 1
    expect(exercise1Sets[0].reps).toBe(8); // Original set 2 data
    expect(exercise1Sets[0].weight).toBe(60); // Original set 2 data
    expect(
      updatedWorkout.exercises.find((e) => e.exerciseId === 'exercise-2')
    ).toBeDefined();
  });

  it('should return WorkoutDTO', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [
        {
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 50,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await removeSetFromWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: 'exercise-1',
      setNumber: 1,
    });

    expect(updatedWorkout).not.toBeInstanceOf(Workout);

    for (const prop of dto.workoutDTOProperties) {
      expect(updatedWorkout).toHaveProperty(prop);
    }
  });

  it('should remove only the specified set number', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [
        {
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 50,
        },
        {
          exerciseId: 'exercise-1',
          setNumber: 2,
          reps: 8,
          weight: 60,
        },
        {
          exerciseId: 'exercise-1',
          setNumber: 3,
          reps: 6,
          weight: 70,
        },
      ],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await removeSetFromWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: 'exercise-1',
      setNumber: 2,
    });

    expect(updatedWorkout.exercises).toHaveLength(2);
    // After removing set 2, sets should be reordered: set 1 stays, set 3 becomes set 2
    const exercise1Sets = updatedWorkout.exercises
      .filter((e) => e.exerciseId === 'exercise-1')
      .sort((a, b) => a.setNumber - b.setNumber);
    expect(exercise1Sets).toHaveLength(2);
    expect(exercise1Sets[0].setNumber).toBe(1); // Original set 1
    expect(exercise1Sets[0].reps).toBe(10);
    expect(exercise1Sets[1].setNumber).toBe(2); // Original set 3 reordered to set 2
    expect(exercise1Sets[1].reps).toBe(6); // Original set 3 data
    expect(exercise1Sets[1].weight).toBe(70); // Original set 3 data
  });

  it('should not modify workout when set does not exist', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [
        {
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 50,
        },
      ],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await removeSetFromWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: 'exercise-1',
      setNumber: 99, // Non-existent set number
    });

    expect(updatedWorkout.exercises).toHaveLength(1);
    expect(updatedWorkout.exercises[0].exerciseId).toBe('exercise-1');
    expect(updatedWorkout.exercises[0].setNumber).toBe(1);
  });

  it('should not modify workout when exercise does not exist', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [
        {
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 50,
        },
      ],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await removeSetFromWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: 'non-existent-exercise',
      setNumber: 1,
    });

    expect(updatedWorkout.exercises).toHaveLength(1);
    expect(updatedWorkout.exercises[0].exerciseId).toBe('exercise-1');
  });

  it('should throw NotFoundError when workout does not exist', async () => {
    await expect(
      removeSetFromWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: 'non-existent',
        exerciseId: 'exercise-1',
        setNumber: 1,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when workoutId is invalid', async () => {
    const invalidIds = ['', '   ', 3, null, undefined, {}, [], true, false];

    for (const id of invalidIds) {
      await expect(
        removeSetFromWorkoutUsecase.execute({
          // @ts-expect-error Testing invalid types
          workoutId: id,
          exerciseId: 'exercise-1',
          setNumber: 1,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when exerciseId is invalid', async () => {
    const invalidIds = ['', '   ', 3, null, undefined, {}, [], true, false];

    for (const id of invalidIds) {
      await expect(
        removeSetFromWorkoutUsecase.execute({
          userId: vp.userId,
          workoutId: vp.validWorkoutProps.id,
          // @ts-expect-error Testing invalid types
          exerciseId: id,
          setNumber: 1,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when setNumber is invalid', async () => {
    const invalidSetNumbers = [
      0,
      -1,
      1.5,
      null,
      undefined,
      'two',
      {},
      [],
      true,
      false,
    ];

    for (const setNumber of invalidSetNumbers) {
      await expect(
        removeSetFromWorkoutUsecase.execute({
          userId: vp.userId,
          workoutId: vp.validWorkoutProps.id,
          exerciseId: 'exercise-1',
          // @ts-expect-error Testing invalid types
          setNumber,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should reorder sets correctly after removal', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [
        {
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 50,
        },
        {
          exerciseId: 'exercise-1',
          setNumber: 2,
          reps: 8,
          weight: 60,
        },
        {
          exerciseId: 'exercise-1',
          setNumber: 3,
          reps: 6,
          weight: 70,
        },
      ],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await removeSetFromWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: 'exercise-1',
      setNumber: 2,
    });

    expect(updatedWorkout.exercises).toHaveLength(2);
    expect(updatedWorkout.exercises[0].setNumber).toBe(1);
    expect(updatedWorkout.exercises[1].setNumber).toBe(2); // Set 3 should be renumbered to 2
  });

  it('should throw ValidationError when userId is invalid', async () => {
    const invalidIds = ['', '   ', 3, null, undefined, {}, [], true, false];

    for (const userId of invalidIds) {
      await expect(
        removeSetFromWorkoutUsecase.execute({
          // @ts-expect-error Testing invalid types
          userId,
          workoutId: vp.validWorkoutProps.id,
          exerciseId: 'exercise-1',
          setNumber: 1,
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
