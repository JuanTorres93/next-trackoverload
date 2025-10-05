import { beforeEach, describe, expect, it } from 'vitest';
import { AddExerciseToWorkoutTemplateUsecase } from '../AddExerciseToWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { NotFoundError } from '@/domain/common/errors';
import { ValidationError } from '@/domain/common/errors';

describe('AddExerciseToWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let exercisesRepo: MemoryExercisesRepo;
  let usecase: AddExerciseToWorkoutTemplateUsecase;
  let existingTemplate: WorkoutTemplate;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    exercisesRepo = new MemoryExercisesRepo();
    usecase = new AddExerciseToWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      exercisesRepo
    );

    // Create the exercises that will be used in tests
    const benchPressExercise = Exercise.create({
      id: 'bench-press',
      name: 'Bench Press',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const shoulderPressExercise = Exercise.create({
      id: 'shoulder-press',
      name: 'Shoulder Press',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await exercisesRepo.saveExercise(benchPressExercise);
    await exercisesRepo.saveExercise(shoulderPressExercise);

    // Create a template with one existing exercise
    existingTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);
  });

  it('should add exercise to workout template', async () => {
    const request = {
      workoutTemplateId: '1',
      exerciseId: 'shoulder-press',
      sets: 4,
    };

    const result = await usecase.execute(request);

    expect(result.exercises).toHaveLength(2);
    expect(result.exercises[0]).toEqual({
      exerciseId: 'bench-press',
      sets: 3,
    });
    expect(result.exercises[1]).toEqual({
      exerciseId: 'shoulder-press',
      sets: 4,
    });

    // Verify it was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      '1'
    );
    expect(savedTemplate!.exercises).toHaveLength(2);
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    const request = {
      workoutTemplateId: 'non-existent',
      exerciseId: 'bench-press',
      sets: 3,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when adding duplicate exercise', async () => {
    const request = {
      workoutTemplateId: '1',
      exerciseId: 'bench-press',
      sets: 4,
    };

    await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
  });

  it('should throw error if workoutTemplateId is invalid', async () => {
    const invalidIds = [null, undefined, '', '   ', 4, {}, [], true];

    for (const invalidId of invalidIds) {
      const request = {
        workoutTemplateId: invalidId,
        exerciseId: 'shoulder-press',
        sets: 3,
      };

      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if exerciseId is invalid', async () => {
    const invalidIds = [null, undefined, '', '   ', 4, {}, [], true];

    for (const invalidId of invalidIds) {
      const request = {
        workoutTemplateId: '1',
        exerciseId: invalidId,
        sets: 3,
      };

      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if sets is invalid', async () => {
    const invalidSets = [0, -1, 2.5, 'three', null, undefined, {}, [], true];

    for (const sets of invalidSets) {
      const request = {
        workoutTemplateId: '1',
        exerciseId: 'shoulder-press',
        sets,
      };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if exercise does not exist', async () => {
    const request = {
      workoutTemplateId: '1',
      exerciseId: 'non-existent-exercise',
      sets: 3,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

    await expect(usecase.execute(request)).rejects.toThrow(/Exercise not/i);
  });
});
