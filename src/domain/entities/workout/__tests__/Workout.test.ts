import { beforeEach, describe, expect, it } from 'vitest';

import * as vp from '@/../tests/createProps';
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
      ...vp.validWorkoutLineProps,
    };
    workoutLine = WorkoutLine.create(validWorkoutLineProps);

    validWorkoutProps = {
      ...vp.validWorkoutProps,
      exercises: [workoutLine],
    };
    workout = Workout.create(validWorkoutProps);
  });

  describe('Behaviour', () => {
    it('should create a valid workout', () => {
      expect(workout).toBeInstanceOf(Workout);
    });

    it('should add exercise', async () => {
      const newWorkoutLine = WorkoutLine.create({
        ...vp.validWorkoutLineProps,
        exerciseId: 'ex2',
        setNumber: 1,
        reps: 12,
        weight: 60,
      });

      workout.addExercise(newWorkoutLine);
      expect(workout.exercises).toHaveLength(2);
      expect(workout.exercises[1]).toEqual(newWorkoutLine);
    });

    it('should remove exercise', async () => {
      const newWorkoutLine = WorkoutLine.create({
        ...vp.validWorkoutLineProps,
        exerciseId: 'ex2',
        setNumber: 2,
        reps: 12,
        weight: 60,
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
        weight: 88,
      };

      workout.updateExercise(workoutLine.exerciseId, updateProps);
      expect(workout.exercises[0].setNumber).toBe(9);
      expect(workout.exercises[0].reps).toBe(99);
      expect(workout.exercises[0].weight).toBe(88);
    });

    it('should update workout name', async () => {
      const newName = 'Updated Workout Name';
      workout.update({ name: newName });
      expect(workout.name).toBe(newName);
    });
  });

  describe('Errors', () => {
    it('should throw error if exercise already exists for a given set number on addition', async () => {
      const newWorkoutLine = WorkoutLine.create({
        ...vp.validWorkoutLineProps,
        setNumber: 1,
        reps: 12,
        weight: 60,
      });
      expect(() => workout.addExercise(newWorkoutLine)).toThrow(
        ValidationError
      );
    });

    it('should throw error if name is larger that 100 chars', async () => {
      const longName = 'a'.repeat(101);
      expect(() => {
        Workout.create({
          ...validWorkoutProps,
          name: longName,
        });
      }).toThrow(ValidationError);

      expect(() => {
        Workout.create({
          ...validWorkoutProps,
          name: longName,
        });
      }).toThrow(/Text.*not exceed/);
    });

    it('should throw error if name is empty', async () => {
      expect(() => {
        Workout.create({
          ...validWorkoutProps,
          name: '',
        });
      }).toThrow(ValidationError);

      expect(() => {
        Workout.create({
          ...validWorkoutProps,
          name: '',
        });
      }).toThrow(/Text.*empty/);
    });

    it('should throw error if removing set from exercise that does not exist in workout', async () => {
      expect(() => {
        workout.removeSet('non-existent-exercise', 1);
      }).toThrow(ValidationError);
      expect(() => {
        workout.removeSet('non-existent-exercise', 1);
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
