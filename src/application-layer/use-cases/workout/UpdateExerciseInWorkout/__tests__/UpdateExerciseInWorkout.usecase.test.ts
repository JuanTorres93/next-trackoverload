import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { UpdateExerciseInWorkoutUsecase } from '../UpdateExerciseInWorkout.usecase';
import {
  WorkoutLine,
  WorkoutLineCreateProps,
} from '@/domain/entities/workoutline/WorkoutLine';

describe('UpdateExerciseInWorkoutUsecase', () => {
  let workoutLineValidProps: WorkoutLineCreateProps;
  let workoutLine: WorkoutLine;
  let workoutsRepo: MemoryWorkoutsRepo;
  let updateExerciseInWorkoutUsecase: UpdateExerciseInWorkoutUsecase;

  beforeEach(() => {
    workoutLineValidProps = {
      ...vp.validWorkoutLineProps,
    };
    workoutLine = WorkoutLine.create(workoutLineValidProps);

    workoutsRepo = new MemoryWorkoutsRepo();
    updateExerciseInWorkoutUsecase = new UpdateExerciseInWorkoutUsecase(
      workoutsRepo
    );
  });

  it('should update exercise reps in workout', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutPropsNoExercises,
      exercises: [workoutLine],
    });

    await workoutsRepo.saveWorkout(workout);

    // TODO DELETE THESE DEBUG LOGS
    console.log('ANTES workout.exercises[0]');
    console.log(workout.exercises[0]);
    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: workoutLine.exerciseId,
      reps: 15,
    });

    expect(updatedWorkout.exercises[0].reps).toBe(15);
    expect(updatedWorkout.exercises[0].setNumber).toBe(1);
    expect(updatedWorkout.exercises[0].weight).toBe(0);
  });

  it('should return WorkoutDTO', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutPropsNoExercises,
      exercises: [workoutLine],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: 'exercise-1',
      reps: 15,
    });

    expect(updatedWorkout).not.toBeInstanceOf(Workout);
    for (const prop of dto.workoutDTOProperties) {
      expect(updatedWorkout).toHaveProperty(prop);
    }
  });

  it('should update exercise weight in workout', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutPropsNoExercises,
      exercises: [workoutLine],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: 'exercise-1',
      weight: 25.5,
    });

    expect(updatedWorkout.exercises[0].weight).toBe(25.5);
    expect(updatedWorkout.exercises[0].reps).toBe(10);
    expect(updatedWorkout.exercises[0].setNumber).toBe(1);
  });

  it('should update exercise set number in workout', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutPropsNoExercises,
      exercises: [workoutLine],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: 'exercise-1',
      setNumber: 2,
    });

    expect(updatedWorkout.exercises[0].setNumber).toBe(2);
    expect(updatedWorkout.exercises[0].reps).toBe(10);
    expect(updatedWorkout.exercises[0].weight).toBe(0);
  });

  it('should update multiple properties at once', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutPropsNoExercises,
      exercises: [workoutLine],
    });

    await workoutsRepo.saveWorkout(workout);

    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
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
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    await expect(
      updateExerciseInWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: vp.validWorkoutProps.id,
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
});
