import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { AddExerciseToWorkoutUsecase } from '../AddExerciseToWorkout.usecase';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';

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
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
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

  it('should return WorkoutDTO', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      exercises: [],
    });

    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      name: 'Push Up',
    });

    await exercisesRepo.saveExercise(exercise);

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await addExerciseToWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: vp.validExerciseProps.id,
      setNumber: 1,
      reps: 10,
      weight: 0,
    });

    for (const prop of dto.workoutDTOProperties) {
      expect(updatedWorkout).not.toBeInstanceOf(Workout);
      expect(updatedWorkout).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when workout does not exist', async () => {
    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      name: 'Push Up',
    });

    await exercisesRepo.saveExercise(exercise);

    await expect(
      addExerciseToWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: 'non-existent',
        exerciseId: vp.validExerciseProps.id,
        setNumber: 1,
        reps: 10,
        weight: 0,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when exercise does not exist', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    await expect(
      addExerciseToWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: vp.validWorkoutProps.id,
        exerciseId: 'non-existent',
        setNumber: 1,
        reps: 10,
        weight: 0,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when trying to add duplicate exercise with same set number', async () => {
    const duplicateExercise = WorkoutLine.create({
      ...vp.validWorkoutLineProps,
      exerciseId: 'duplicate-exercise-id',
      setNumber: 1,
      reps: 10,
      weight: 0,
    });

    const workout = Workout.create({
      ...vp.validWorkoutProps,
      exercises: [duplicateExercise],
    });

    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: 'duplicate-exercise-id',
      name: 'Push Up',
    });

    await workoutsRepo.saveWorkout(workout);
    await exercisesRepo.saveExercise(exercise);

    await expect(
      addExerciseToWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: vp.validWorkoutProps.id,
        exerciseId: 'duplicate-exercise-id',
        setNumber: 1,
        reps: 12,
        weight: 5,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should add exercise with different set number', async () => {
    const workoutLine = WorkoutLine.create({
      ...vp.validWorkoutLineProps,
      exerciseId: 'exercise-1',
      setNumber: 1,
      reps: 10,
      weight: 0,
    });
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      exercises: [workoutLine],
    });

    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      name: 'Push Up',
    });

    await workoutsRepo.saveWorkout(workout);
    await exercisesRepo.saveExercise(exercise);

    const updatedWorkout = await addExerciseToWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: vp.validExerciseProps.id,
      setNumber: 2,
      reps: 12,
      weight: 5,
    });

    expect(updatedWorkout.exercises).toHaveLength(2);
    expect(updatedWorkout.exercises[1]).toEqual({
      exerciseId: vp.validExerciseProps.id,
      setNumber: 2,
      reps: 12,
      weight: 5,
    });
  });
});
