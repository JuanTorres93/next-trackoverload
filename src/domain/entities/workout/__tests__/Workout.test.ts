import { beforeEach, describe, expect, it } from 'vitest';

import * as workoutTestProps from '../../../../../tests/createProps/workoutTestProps';
import { ValidationError } from '@/domain/common/errors';
import { Workout, WorkoutCreateProps } from '../Workout';
import {
  WorkoutLine,
  WorkoutLineCreateProps,
} from '../../workoutline/WorkoutLine';

describe('Workout', () => {
  let workout: Workout;
  let validWorkoutLineProps: WorkoutLineCreateProps;
  let validWorkoutProps: WorkoutCreateProps;
  let workoutLine: WorkoutLine;

  beforeEach(() => {
    validWorkoutLineProps = {
      ...workoutTestProps.validWorkoutLineProps,
    };
    workoutLine = WorkoutLine.create(validWorkoutLineProps);

    validWorkoutProps = {
      ...workoutTestProps.validWorkoutProps,
      exercises: [workoutLine],
    };
    workout = Workout.create(validWorkoutProps);
  });

  describe('Behaviour', () => {
    it('should create a valid workout', () => {
      expect(workout).toBeInstanceOf(Workout);
    });

    it('should create a workout if no createdAt or updatedAt is provided', async () => {
      // eslint-disable-next-line
      const { createdAt, updatedAt, ...propsWithoutDates } = validWorkoutProps;

      const workoutWithoutDates = Workout.create(propsWithoutDates);

      expect(workoutWithoutDates).toBeInstanceOf(Workout);

      const now = new Date();

      expect(workoutWithoutDates.createdAt.getTime()).toBeLessThanOrEqual(
        now.getTime(),
      );
      expect(workoutWithoutDates.updatedAt.getTime()).toBeLessThanOrEqual(
        now.getTime(),
      );
    });

    it('should add exercise', async () => {
      const newWorkoutLine = WorkoutLine.create({
        ...workoutTestProps.validWorkoutLineProps,
        exerciseId: 'ex2',
        setNumber: 1,
        reps: 12,
        weightInKg: 60,
      });

      workout.addExercise(newWorkoutLine);
      expect(workout.exercises).toHaveLength(2);
      expect(workout.exercises[1]).toEqual(newWorkoutLine);
    });

    it('should remove exercise', async () => {
      const newWorkoutLine = WorkoutLine.create({
        ...workoutTestProps.validWorkoutLineProps,
        exerciseId: 'ex2',
        setNumber: 2,
        reps: 12,
        weightInKg: 60,
      });
      workout.addExercise(newWorkoutLine);
      workout.removeExercise(workoutLine.exerciseId);
      expect(workout.exercises).toHaveLength(1);
      expect(workout.exercises[0].exerciseId).toEqual('ex2');
    });

    it('should update exercise', async () => {
      const updateProps = {
        setNumber: 9,
        reps: 99,
        weightInKg: 88,
      };

      workout.updateExercise(workoutLine.exerciseId, updateProps);
      expect(workout.exercises[0].setNumber).toBe(9);
      expect(workout.exercises[0].reps).toBe(99);
      expect(workout.exercises[0].weightInKg).toBe(88);
    });

    it('should update workout name', async () => {
      const newName = 'Updated Workout Name';
      workout.update({ name: newName });
      expect(workout.name).toBe(newName);
    });

    it('should reorder exercises after a set removal', async () => {
      // Second set of the same exercise
      workout.addExercise(
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutPropsNoExercises(),
          workoutId: workout.id,
          exerciseId: workoutLine.exerciseId,
          setNumber: 2,
          reps: 8,
          weightInKg: 80,
        }),
      );

      // Third set of the same exercise
      workout.addExercise(
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutPropsNoExercises(),
          workoutId: workout.id,
          exerciseId: workoutLine.exerciseId,
          setNumber: 3,
          reps: 6,
          weightInKg: 70,
        }),
      );

      // Remove the second set (the one first added in this test)
      workout.removeSet(workoutLine.exerciseId, 2);

      const remainingSets = workout.exercises.filter(
        (line) => line.exerciseId === workoutLine.exerciseId,
      );

      // Defined in beforeEach block
      const originalWorkoutLine = remainingSets[0];
      // Newly added third set, which should now be the second set
      const lastWorkoutLine = remainingSets[1];

      expect(remainingSets).toHaveLength(2);
      expect(originalWorkoutLine.setNumber).toBe(1);
      expect(lastWorkoutLine.setNumber).toBe(2);

      expect(originalWorkoutLine.reps).toBe(workoutLine.reps);
      expect(originalWorkoutLine.weightInKg).toBe(workoutLine.weightInKg);

      expect(lastWorkoutLine.reps).toBe(6);
      expect(lastWorkoutLine.weightInKg).toBe(70);
    });
  });

  describe('Errors', () => {
    it('should throw error if exercise already exists for a given set number on addition', async () => {
      const newWorkoutLine = WorkoutLine.create({
        ...workoutTestProps.validWorkoutLineProps,
        setNumber: 1,
        reps: 12,
        weightInKg: 60,
      });

      expect(() => workout.addExercise(newWorkoutLine)).toThrow(
        ValidationError,
      );

      expect(() => workout.addExercise(newWorkoutLine)).toThrow(
        /Workout.*Exercise.*already.*exists/,
      );
    });

    it('should throw error if exercise to update does not exist in workout', async () => {
      const updateProps = {
        setNumber: 9,
        reps: 99,
        weightInKg: 88,
      };

      expect(() =>
        workout.updateExercise('non-existent-exercise', updateProps),
      ).toThrow(ValidationError);

      expect(() =>
        workout.updateExercise('non-existent-exercise', updateProps),
      ).toThrow(/Workout.*Exercise.*not.*found/);
    });

    it('should throw error if name is larger that 100 chars', async () => {
      const longName = 'a'.repeat(101);
      const props = {
        ...validWorkoutProps,
        name: longName,
      };

      expect(() => {
        Workout.create(props);
      }).toThrow(ValidationError);

      expect(() => {
        Workout.create(props);
      }).toThrow(/Text.*not exceed/);
    });

    it('should throw error if removing set from exercise that does not exist in workout', async () => {
      const args = ['non-existent-exercise', 1] as const;

      expect(() => {
        workout.removeSet(...args);
      }).toThrow(ValidationError);
      expect(() => {
        workout.removeSet(...args);
      }).toThrow(/Workout.*remove.*not.*exist/);
    });

    it('should throw error if no patch is provided when updating', async () => {
      expect(() => {
        workout.update({});
      }).toThrow(ValidationError);

      expect(() => {
        workout.update({});
      }).toThrow(/Workout.*No.*patch/);
    });
  });
});
