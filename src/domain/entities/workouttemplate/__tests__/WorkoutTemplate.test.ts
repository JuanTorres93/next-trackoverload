import { beforeEach, describe, expect, it } from 'vitest';

import * as workoutTemplateTestProps from '../../../../../tests/createProps/workoutTemplateTestProps';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import {
  WorkoutTemplate,
  WorkoutTemplateCreateProps,
} from '../WorkoutTemplate';
import { WorkoutTemplateLine } from '../../workouttemplateline/WorkoutTemplateLine';

describe('WorkoutTemplate', () => {
  let workoutTemplate: WorkoutTemplate;
  let validWorkoutTemplateProps: WorkoutTemplateCreateProps;

  beforeEach(() => {
    validWorkoutTemplateProps = {
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
    };

    workoutTemplate = WorkoutTemplate.create(validWorkoutTemplateProps);
  });

  describe('Behavior', () => {
    it('should create a valid workoutTemplate', () => {
      expect(workoutTemplate).toBeInstanceOf(WorkoutTemplate);
    });

    it('should create a workoutTemplate if no createdAt or updatedAt is provided', async () => {
      // eslint-disable-next-line
      const { createdAt, updatedAt, ...propsWithoutDates } =
        validWorkoutTemplateProps;

      const workoutTemplateWithoutDates =
        WorkoutTemplate.create(propsWithoutDates);

      expect(workoutTemplateWithoutDates).toBeInstanceOf(WorkoutTemplate);

      const now = new Date();

      expect(
        workoutTemplateWithoutDates.createdAt.getTime(),
      ).toBeLessThanOrEqual(now.getTime());
      expect(
        workoutTemplateWithoutDates.updatedAt.getTime(),
      ).toBeLessThanOrEqual(now.getTime());
    });

    it('should have a list of WorkoutTemplateLine objects as exercises', async () => {
      const exercises = workoutTemplate.exercises;

      expect(Array.isArray(exercises)).toBe(true);
      expect(exercises).toHaveLength(2);
      exercises.forEach((exercise) => {
        expect(exercise).toBeInstanceOf(WorkoutTemplateLine);
      });
    });

    it('each exercise should have an id and a number of sets greater than 0', async () => {
      const exercises = workoutTemplate.exercises;
      exercises.forEach((exercise) => {
        expect(exercise.exerciseId).toBeDefined();
        expect(exercise.sets).toBeGreaterThan(0);
      });
    });

    it('should add exercise', async () => {
      const newExercise = WorkoutTemplateLine.create({
        id: 'line3',
        templateId: workoutTemplate.id,
        exerciseId: 'ex3',
        sets: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(workoutTemplate.exercises).toHaveLength(2);
      workoutTemplate.addExercise(newExercise);
      expect(workoutTemplate.exercises).toHaveLength(3);
      const exercises = workoutTemplate.exercises;

      const lastExercise = exercises[exercises.length - 1];
      expect(lastExercise.exerciseId).toBe('ex3');
    });

    it('should remove exercise', async () => {
      expect(workoutTemplate.exercises).toHaveLength(2);
      workoutTemplate.removeExercise(
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
          .exerciseId,
      );
      expect(workoutTemplate.exercises).toHaveLength(1);

      const remainingExercise = workoutTemplate.exercises[0];
      expect(remainingExercise.exerciseId).toBe(
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[1]
          .exerciseId,
      );
    });

    it('should reorder exercises', async () => {
      workoutTemplate.reorderExercise(
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
          .exerciseId,
        1,
      );

      const exercisesIds = workoutTemplate.exercises.map(
        (line) => line.exerciseId,
      );
      expect(exercisesIds).toEqual([
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[1]
          .exerciseId,
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
          .exerciseId,
      ]);
    });

    it('should reorder exercises in a longer list', async () => {
      workoutTemplate.addExercise(
        WorkoutTemplateLine.create({
          id: 'line3',
          templateId: workoutTemplate.id,
          exerciseId: 'ex3',
          sets: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
      workoutTemplate.addExercise(
        WorkoutTemplateLine.create({
          id: 'line4',
          templateId: workoutTemplate.id,
          exerciseId: 'ex4',
          sets: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
      workoutTemplate.addExercise(
        WorkoutTemplateLine.create({
          id: 'line5',
          templateId: workoutTemplate.id,
          exerciseId: 'ex5',
          sets: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
      workoutTemplate.reorderExercise(
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
          .exerciseId,
        3,
      );

      const exercisesIds = workoutTemplate.exercises.map(
        (line) => line.exerciseId,
      );
      expect(exercisesIds).toEqual([
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[1]
          .exerciseId,
        'ex3',
        'ex4',
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
          .exerciseId,
        'ex5',
      ]);

      // Another reorder
      workoutTemplate.reorderExercise('ex4', 0);

      const exercisesIds2 = workoutTemplate.exercises.map(
        (line) => line.exerciseId,
      );
      expect(exercisesIds2).toEqual([
        'ex4',
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[1]
          .exerciseId,
        'ex3',
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
          .exerciseId,
        'ex5',
      ]);
    });

    it('should update reps of an exercise', async () => {
      workoutTemplate.updateExercise(
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
          .exerciseId,
        { sets: 66 },
      );
      const exercises = workoutTemplate.exercises;
      const updatedExercise = exercises.find(
        (line) =>
          line.exerciseId ===
          workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
            .exerciseId,
      );
      expect(updatedExercise).toBeDefined();
      expect(updatedExercise!.sets).toBe(66);
    });

    it('should set createdAt and updatedAt if not provided', () => {
      const templateProps = { ...validWorkoutTemplateProps };
      templateProps.createdAt = null as unknown as Date;
      templateProps.updatedAt = null as unknown as Date;
      const newTemplate = WorkoutTemplate.create(templateProps);
      expect(newTemplate.createdAt).toBeInstanceOf(Date);
      expect(newTemplate.updatedAt).toBeInstanceOf(Date);
    });

    it('should not be deleted by default', () => {
      expect(workoutTemplate.isDeleted).toBe(false);
      expect(workoutTemplate.deletedAt).toBeUndefined();
    });

    it('should mark template as deleted', () => {
      const beforeDelete = new Date();
      workoutTemplate.markAsDeleted();
      const afterDelete = new Date();

      expect(workoutTemplate.isDeleted).toBe(true);
      expect(workoutTemplate.deletedAt).toBeDefined();
      expect(workoutTemplate.deletedAt!.getTime()).toBeGreaterThanOrEqual(
        beforeDelete.getTime(),
      );
      expect(workoutTemplate.deletedAt!.getTime()).toBeLessThanOrEqual(
        afterDelete.getTime(),
      );
    });

    it('should update updatedAt when marking as deleted', () => {
      const originalUpdatedAt = workoutTemplate.updatedAt;
      // Wait a bit to ensure different timestamps
      setTimeout(() => {
        workoutTemplate.markAsDeleted();
        expect(workoutTemplate.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      }, 2);
    });

    it('should update name', async () => {
      const newName = 'Updated Template Name';
      workoutTemplate.update({ name: newName });
      expect(workoutTemplate.name).toBe(newName);
    });
  });

  describe('Errors', () => {
    it('should throw error if exercise already exists', async () => {
      const newExercise = WorkoutTemplateLine.create({
        id: 'line1-dup',
        templateId: workoutTemplate.id,
        exerciseId: workoutTemplate.exercises[0].exerciseId,
        sets: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(() => workoutTemplate.addExercise(newExercise)).toThrow(
        ValidationError,
      );
    });

    it('should throw ValidationError if exercises is not an array', () => {
      const templateProps = { ...validWorkoutTemplateProps };
      // @ts-expect-error exercises is not an array
      templateProps.exercises = null;
      expect(() => WorkoutTemplate.create(templateProps)).toThrow(
        ValidationError,
      );
    });

    it('should throw error if name is greater than 100 chars', async () => {
      const longName = 'a'.repeat(101);
      expect(() => {
        WorkoutTemplate.create({
          ...validWorkoutTemplateProps,
          name: longName,
        });
      }).toThrow(ValidationError);

      expect(() => {
        WorkoutTemplate.create({
          ...validWorkoutTemplateProps,
          name: longName,
        });
      }).toThrow(/Text.*not exceed/);
    });

    it('should throw error if name is empty', async () => {
      expect(() => {
        WorkoutTemplate.create({
          ...validWorkoutTemplateProps,
          name: '',
        });
      }).toThrow(ValidationError);

      expect(() => {
        WorkoutTemplate.create({
          ...validWorkoutTemplateProps,
          name: '',
        });
      }).toThrow(/Text.*empty/);
    });

    it('should throw error if reordering to a negative index', async () => {
      expect(() => {
        workoutTemplate.reorderExercise(
          workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
            .exerciseId,
          -1,
        );
      }).toThrow(ValidationError);

      expect(() => {
        workoutTemplate.reorderExercise(
          workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
            .exerciseId,
          -1,
        );
      }).toThrow(/Integer.*positive/);
    });

    it('should throw error if no patch is provided when updating', async () => {
      expect(() => {
        // @ts-expect-error no patch provided
        workoutTemplate.update();
      }).toThrow(ValidationError);
      expect(() => {
        // @ts-expect-error no patch provided
        workoutTemplate.update();
      }).toThrow(/WorkoutTemplate.*patch/);
    });

    it('should throw error if trying to remove a non-existent exercise', async () => {
      expect(() => {
        workoutTemplate.removeExercise('non-existent-exercise');
      }).toThrow(NotFoundError);

      expect(() => {
        workoutTemplate.removeExercise('non-existent-exercise');
      }).toThrow(/WorkoutTemplate: Exercise to remove not found/);
    });

    it('should throw error if trying to reorder an exercise that is not contained in the template', async () => {
      expect(() => {
        workoutTemplate.reorderExercise('non-existent-exercise', 0);
      }).toThrow(NotFoundError);

      expect(() => {
        workoutTemplate.reorderExercise('non-existent-exercise', 0);
      }).toThrow(/WorkoutTemplate.*Exercise.*not found/);
    });
  });
});
