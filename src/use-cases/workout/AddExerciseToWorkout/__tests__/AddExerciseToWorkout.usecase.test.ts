import { beforeEach, describe, expect, it } from 'vitest';
import { AddExerciseToWorkoutUsecase } from '../AddExerciseToWorkout.usecase';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { Workout } from '@/domain/entities/workout/Workout';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('AddExerciseToWorkoutUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let exercisesRepo: MemoryExercisesRepo;
  let addExerciseToWorkoutUsecase: AddExerciseToWorkoutUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    exercisesRepo = new MemoryExercisesRepo();
    addExerciseToWorkoutUsecase = new AddExerciseToWorkoutUsecase(
      workoutsRepo,
      exercisesRepo
    );
  });

  it('should add exercise to workout', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [],
    });

    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: 'exercise-1',
      name: 'Push Up',
    });

    await workoutsRepo.saveWorkout(workout);
    await exercisesRepo.saveExercise(exercise);

    const updatedWorkout = await addExerciseToWorkoutUsecase.execute({
      workoutId: '1',
      exerciseId: 'exercise-1',
      setNumber: 1,
      reps: 10,
      weight: 0,
    });

    expect(updatedWorkout.exercises).toHaveLength(1);
    expect(updatedWorkout.exercises[0]).toEqual({
      exerciseId: 'exercise-1',
      setNumber: 1,
      reps: 10,
      weight: 0,
    });
  });

  it('should throw NotFoundError when workout does not exist', async () => {
    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: 'exercise-1',
      name: 'Push Up',
    });

    await exercisesRepo.saveExercise(exercise);

    await expect(
      addExerciseToWorkoutUsecase.execute({
        workoutId: 'non-existent',
        exerciseId: 'exercise-1',
        setNumber: 1,
        reps: 10,
        weight: 0,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when exercise does not exist', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    await expect(
      addExerciseToWorkoutUsecase.execute({
        workoutId: '1',
        exerciseId: 'non-existent',
        setNumber: 1,
        reps: 10,
        weight: 0,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when trying to add duplicate exercise with same set number', async () => {
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

    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: 'exercise-1',
      name: 'Push Up',
    });

    await workoutsRepo.saveWorkout(workout);
    await exercisesRepo.saveExercise(exercise);

    await expect(
      addExerciseToWorkoutUsecase.execute({
        workoutId: '1',
        exerciseId: 'exercise-1',
        setNumber: 1,
        reps: 12,
        weight: 5,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should add exercise with different set number', async () => {
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

    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: 'exercise-1',
      name: 'Push Up',
    });

    await workoutsRepo.saveWorkout(workout);
    await exercisesRepo.saveExercise(exercise);

    const updatedWorkout = await addExerciseToWorkoutUsecase.execute({
      workoutId: '1',
      exerciseId: 'exercise-1',
      setNumber: 2,
      reps: 12,
      weight: 5,
    });

    expect(updatedWorkout.exercises).toHaveLength(2);
    expect(updatedWorkout.exercises[1]).toEqual({
      exerciseId: 'exercise-1',
      setNumber: 2,
      reps: 12,
      weight: 5,
    });
  });

  it('should throw error if workoutId is invalid', async () => {
    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: 'exercise-1',
      name: 'Push Up',
    });

    await exercisesRepo.saveExercise(exercise);

    const invalidIds = ['', '   ', null, undefined, 123, {}, [], true, false];

    for (const invalidId of invalidIds) {
      await expect(
        addExerciseToWorkoutUsecase.execute({
          // @ts-expect-error testing invalid types
          workoutId: invalidId,
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          weight: 0,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if exerciseId is invalid', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    const invalidIds = ['', '   ', null, undefined, 123, {}, [], true, false];

    for (const invalidId of invalidIds) {
      await expect(
        addExerciseToWorkoutUsecase.execute({
          workoutId: '1',
          // @ts-expect-error testing invalid types
          exerciseId: invalidId,
          setNumber: 1,
          reps: 10,
          weight: 0,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if setNumber is invalid', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [],
    });

    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: 'exercise-1',
      name: 'Push Up',
    });

    await workoutsRepo.saveWorkout(workout);
    await exercisesRepo.saveExercise(exercise);

    const invalidSetNumbers = [
      -1,
      0,
      1.5,
      null,
      undefined,
      'string',
      {},
      [],
      true,
      false,
    ];

    for (const invalidSetNumber of invalidSetNumbers) {
      await expect(
        addExerciseToWorkoutUsecase.execute({
          workoutId: '1',
          exerciseId: 'exercise-1',
          // @ts-expect-error testing invalid types
          setNumber: invalidSetNumber,
          reps: 10,
          weight: 0,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if reps is invalid', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [],
    });

    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: 'exercise-1',
      name: 'Push Up',
    });

    await workoutsRepo.saveWorkout(workout);
    await exercisesRepo.saveExercise(exercise);

    const invalidReps = [
      -1,
      1.5,
      null,
      undefined,
      'string',
      {},
      [],
      true,
      false,
    ];

    for (const invalidRep of invalidReps) {
      await expect(
        addExerciseToWorkoutUsecase.execute({
          workoutId: '1',
          exerciseId: 'exercise-1',
          setNumber: 1,
          // @ts-expect-error testing invalid types
          reps: invalidRep,
          weight: 0,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if weight is invalid', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      exercises: [],
    });

    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: 'exercise-1',
      name: 'Push Up',
    });

    await workoutsRepo.saveWorkout(workout);
    await exercisesRepo.saveExercise(exercise);

    const invalidWeights = [-1, null, undefined, 'string', {}, [], true, false];

    for (const invalidWeight of invalidWeights) {
      await expect(
        addExerciseToWorkoutUsecase.execute({
          workoutId: '1',
          exerciseId: 'exercise-1',
          setNumber: 1,
          reps: 10,
          // @ts-expect-error testing invalid types
          weight: invalidWeight,
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
