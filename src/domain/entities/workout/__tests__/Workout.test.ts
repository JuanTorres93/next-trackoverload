import { beforeEach, describe, expect, it } from 'vitest';

import * as vp from '@/../tests/createProps';
import { ValidationError } from '@/domain/common/errors';
import { Workout, WorkoutCreateProps } from '../Workout';

describe('Workout', () => {
  let workout: Workout;
  let validWorkoutProps: WorkoutCreateProps;

  beforeEach(() => {
    validWorkoutProps = {
      ...vp.validWorkoutProps,
      exercises: [...vp.validWorkoutProps.exercises],
    };
    workout = Workout.create(validWorkoutProps);
  });

  it('should create a valid workout', () => {
    expect(workout).toBeInstanceOf(Workout);
  });

  it('should add exercise', async () => {
    const newExercise = {
      exerciseId: 'ex2',
      setNumber: 1,
      reps: 12,
      weight: 60,
    };
    workout.addExercise(newExercise);
    expect(workout.exercises).toHaveLength(2);
    expect(workout.exercises[1]).toEqual(newExercise);
  });

  it('should throw error if exercise already exists', async () => {
    // NOTE: maybe allow duplicates in the future?
    const newExercise = {
      exerciseId: 'ex1',
      setNumber: 1,
      reps: 12,
      weight: 60,
    };
    expect(() => workout.addExercise(newExercise)).toThrow(ValidationError);
  });

  it('should remove exercise', async () => {
    const newExercise = {
      exerciseId: 'ex2',
      setNumber: 2,
      reps: 12,
      weight: 60,
    };
    workout.addExercise(newExercise);
    workout.removeExercise('ex1');
    expect(workout.exercises).toHaveLength(1);
    expect(workout.exercises[0].exerciseId).toEqual('ex2');
  });

  it('should update exercise', async () => {
    const updateProps = {
      setNumber: 9,
      reps: 99,
      weight: 88,
    };
    workout.updateExercise('ex1', updateProps);
    expect(workout.exercises[0]).toEqual({
      exerciseId: 'ex1',
      setNumber: 9,
      reps: 99,
      weight: 88,
    });
  });

  it('should throw error if workoutTemplateId is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 3, [], {}, true];

    for (const id of invalidIds) {
      const props = { ...validWorkoutProps, workoutTemplateId: id };
      // @ts-expect-error testing invalid inputs
      expect(() => Workout.create(props)).toThrow(ValidationError);
    }
  });

  it('should throw error if userId is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 3, [], {}, true];

    for (const id of invalidIds) {
      const props = { ...validWorkoutProps, userId: id };
      // @ts-expect-error testing invalid inputs
      expect(() => Workout.create(props)).toThrow(ValidationError);
    }
  });

  it('should throw error if id is not instance of Id', async () => {
    expect(() => {
      Workout.create({
        ...validWorkoutProps,
        // @ts-expect-error testing invalid inputs
        id: 123,
      });
    }).toThrow(ValidationError);

    expect(() => {
      Workout.create({
        ...validWorkoutProps,
        // @ts-expect-error testing invalid inputs
        id: 123,
      });
    }).toThrow(/Id.*string/);
  });

  it('should throw error if userId is not instance of Id', async () => {
    expect(() => {
      Workout.create({
        ...validWorkoutProps,
        // @ts-expect-error testing invalid inputs
        userId: 123,
      });
    }).toThrow(ValidationError);

    expect(() => {
      Workout.create({
        ...validWorkoutProps,
        // @ts-expect-error testing invalid inputs
        userId: 123,
      });
    }).toThrow(/Id.*string/);
  });

  it('should throw error if workoutTemplateId is not instance of Id', async () => {
    expect(() => {
      Workout.create({
        ...validWorkoutProps,
        // @ts-expect-error testing invalid inputs
        workoutTemplateId: 123,
      });
    }).toThrow(ValidationError);

    expect(() => {
      Workout.create({
        ...validWorkoutProps,
        // @ts-expect-error testing invalid inputs
        workoutTemplateId: 123,
      });
    }).toThrow(/Id.*string/);
  });
});
