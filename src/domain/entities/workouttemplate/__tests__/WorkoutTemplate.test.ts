import { beforeEach, describe, expect, it } from 'vitest';

import * as vp from '@/../tests/createProps';
import { ValidationError } from '@/domain/common/errors';
import {
  WorkoutTemplate,
  WorkoutTemplateCreateProps,
} from '../WorkoutTemplate';

describe('WorkoutTemplate', () => {
  let workoutTemplate: WorkoutTemplate;
  let validWorkoutTemplateProps: WorkoutTemplateCreateProps;

  beforeEach(() => {
    validWorkoutTemplateProps = {
      ...vp.validWorkoutTemplateProps,
    };

    workoutTemplate = WorkoutTemplate.create(validWorkoutTemplateProps);
  });

  it('should create a valid workoutTemplate', () => {
    expect(workoutTemplate).toBeInstanceOf(WorkoutTemplate);
  });

  it('should have and ordered list of exercises', async () => {
    const exercises = workoutTemplate.exercises;
    expect(exercises).toEqual([
      { exerciseId: 'ex1', sets: 3 },
      { exerciseId: 'ex2', sets: 4 },
    ]);
  });

  it('each exercise should have an id and a number of sets greater than 0', async () => {
    const exercises = workoutTemplate.exercises;
    exercises.forEach((exercise) => {
      expect(exercise.exerciseId).toBeDefined();
      expect(exercise.sets).toBeGreaterThan(0);
    });
  });

  it('should add exercise', async () => {
    const newExercise = { exerciseId: 'ex3', sets: 5 };
    workoutTemplate.addExercise(newExercise);
    const exercises = workoutTemplate.exercises;
    expect(exercises).toEqual([
      { exerciseId: 'ex1', sets: 3 },
      { exerciseId: 'ex2', sets: 4 },
      { exerciseId: 'ex3', sets: 5 },
    ]);
  });

  // NOTE: maybe in the future we want to allow duplicates
  it('should throw error if exercise already exists', async () => {
    const newExercise = { exerciseId: 'ex1', sets: 5 };
    expect(() => workoutTemplate.addExercise(newExercise)).toThrow(
      ValidationError
    );
  });

  it('should remove exercise', async () => {
    workoutTemplate.removeExercise('ex1');
    const exercises = workoutTemplate.exercises;
    expect(exercises).toEqual([{ exerciseId: 'ex2', sets: 4 }]);
  });

  it('should reorder exercises', async () => {
    workoutTemplate.reorderExercise('ex1', 1);
    const exercises = workoutTemplate.exercises;
    expect(exercises).toEqual([
      { exerciseId: 'ex2', sets: 4 },
      { exerciseId: 'ex1', sets: 3 },
    ]);
  });

  it('should reorder exercises in a longer list', async () => {
    workoutTemplate.addExercise({ exerciseId: 'ex3', sets: 5 });
    workoutTemplate.addExercise({ exerciseId: 'ex4', sets: 2 });
    workoutTemplate.addExercise({ exerciseId: 'ex5', sets: 6 });
    workoutTemplate.reorderExercise('ex1', 3);

    const exercises = workoutTemplate.exercises;
    expect(exercises).toEqual([
      { exerciseId: 'ex2', sets: 4 },
      { exerciseId: 'ex3', sets: 5 },
      { exerciseId: 'ex4', sets: 2 },
      { exerciseId: 'ex1', sets: 3 },
      { exerciseId: 'ex5', sets: 6 },
    ]);

    // Another reorder
    workoutTemplate.reorderExercise('ex4', 0);
    const exercises2 = workoutTemplate.exercises;
    expect(exercises2).toEqual([
      { exerciseId: 'ex4', sets: 2 },
      { exerciseId: 'ex2', sets: 4 },
      { exerciseId: 'ex3', sets: 5 },
      { exerciseId: 'ex1', sets: 3 },
      { exerciseId: 'ex5', sets: 6 },
    ]);
  });

  it('should update reps of an exercise', async () => {
    workoutTemplate.updateExercise('ex1', { sets: 6 });
    const exercises = workoutTemplate.exercises;
    expect(exercises).toEqual([
      { exerciseId: 'ex1', sets: 6 },
      { exerciseId: 'ex2', sets: 4 },
    ]);
  });

  it('should throw ValidationError if userId is invalid', () => {
    const invalidUserIds = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidUserId of invalidUserIds) {
      const templateProps = { ...validWorkoutTemplateProps };

      // @ts-expect-error userId is invalid
      templateProps.userId = invalidUserId;
      expect(() => WorkoutTemplate.create(templateProps)).toThrow(
        ValidationError
      );
    }
  });

  it('should throw ValidationError if name is invalid', () => {
    const invalidNames = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidName of invalidNames) {
      const templateProps = { ...validWorkoutTemplateProps };

      // @ts-expect-error name is invalid
      templateProps.name = invalidName;
      expect(() => WorkoutTemplate.create(templateProps)).toThrow(
        ValidationError
      );
    }
  });

  it('should throw ValidationError if exercises is not an array', () => {
    const templateProps = { ...validWorkoutTemplateProps };
    // @ts-expect-error exercises is not an array
    templateProps.exercises = null;
    expect(() => WorkoutTemplate.create(templateProps)).toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError if any exercise line is invalid', () => {
    const templateProps = { ...validWorkoutTemplateProps };
    templateProps.exercises = [{ exerciseId: '', sets: 3 }];
    expect(() => WorkoutTemplate.create(templateProps)).toThrow(
      ValidationError
    );

    templateProps.exercises = [{ exerciseId: 'ex1', sets: 0 }];
    expect(() => WorkoutTemplate.create(templateProps)).toThrow(
      ValidationError
    );

    templateProps.exercises = [{ exerciseId: 'ex1', sets: -1 }];
    expect(() => WorkoutTemplate.create(templateProps)).toThrow(
      ValidationError
    );

    // @ts-expect-error sets is not a number
    templateProps.exercises = [{ exerciseId: 'ex1', sets: '3' }];
    expect(() => WorkoutTemplate.create(templateProps)).toThrow(
      ValidationError
    );
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
      beforeDelete.getTime()
    );
    expect(workoutTemplate.deletedAt!.getTime()).toBeLessThanOrEqual(
      afterDelete.getTime()
    );
  });

  it('should update updatedAt when marking as deleted', () => {
    const originalUpdatedAt = workoutTemplate.updatedAt;
    // Wait a bit to ensure different timestamps
    setTimeout(() => {
      workoutTemplate.markAsDeleted();
      expect(workoutTemplate.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    }, 2);
  });

  it('should throw error if id is not instance of Id', async () => {
    expect(() => {
      WorkoutTemplate.create({
        ...validWorkoutTemplateProps,
        // @ts-expect-error id is not Id
        id: 123,
      });
    }).toThrow(ValidationError);

    expect(() => {
      WorkoutTemplate.create({
        ...validWorkoutTemplateProps,
        // @ts-expect-error id is not Id
        id: 123,
      });
    }).toThrow(/Id.*string/);
  });

  it('should throw error if userId is not instance of Id', async () => {
    expect(() => {
      WorkoutTemplate.create({
        ...validWorkoutTemplateProps,
        // @ts-expect-error userId is not Id
        userId: 123,
      });
    }).toThrow(ValidationError);

    expect(() => {
      WorkoutTemplate.create({
        ...validWorkoutTemplateProps,
        // @ts-expect-error userId is not Id
        userId: 123,
      });
    }).toThrow(/Id.*string/);
  });
});
