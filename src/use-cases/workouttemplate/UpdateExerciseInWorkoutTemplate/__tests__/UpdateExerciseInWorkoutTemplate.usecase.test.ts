import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateExerciseInWorkoutTemplateUsecase } from '../UpdateExerciseInWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';

describe('UpdateExerciseInWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: UpdateExerciseInWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new UpdateExerciseInWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should update exercise sets in workout template', async () => {
    const existingTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 3 },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: '1',
      exerciseId: 'bench-press',
      sets: 5,
    };

    const result = await usecase.execute(request);

    const updatedExercise = result.exercises.find(
      (ex) => ex.exerciseId === 'bench-press'
    );
    expect(updatedExercise?.sets).toBe(5);

    const unchangedExercise = result.exercises.find(
      (ex) => ex.exerciseId === 'shoulder-press'
    );
    expect(unchangedExercise?.sets).toBe(3);

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    const savedUpdatedExercise = savedTemplate!.exercises.find(
      (ex) => ex.exerciseId === 'bench-press'
    );
    expect(savedUpdatedExercise?.sets).toBe(5);
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    const request = {
      workoutTemplateId: 'non-existent',
      exerciseId: 'bench-press',
      sets: 5,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

    // Verify no template was modified
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should handle updating non-existent exercise gracefully', async () => {
    const existingTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: '1',
      exerciseId: 'non-existent-exercise',
      sets: 5,
    };

    const result = await usecase.execute(request);

    // Should not change existing exercises when trying to update non-existent one
    expect(result.exercises).toHaveLength(1);
    expect(result.exercises[0]).toEqual({
      exerciseId: 'bench-press',
      sets: 3,
    });

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.exercises).toHaveLength(1);
  });

  it('should throw error if workoutTemplateId is invalid', async () => {
    const invalidIds = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidId of invalidIds) {
      const request = {
        workoutTemplateId: invalidId,
        exerciseId: 'bench-press',
        sets: 0,
      };

      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow();
    }
  });

  it('should throw error if exerciseId is invalid', async () => {
    const invalidIds = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidId of invalidIds) {
      const request = {
        workoutTemplateId: '1',
        exerciseId: invalidId,
        sets: 0,
      };

      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow();
    }
  });

  it('should throw error if sets is invalid', async () => {
    const invalidSets = [null, undefined, -1, 'string', {}, [], true, false];

    for (const invalidSet of invalidSets) {
      const request = {
        workoutTemplateId: '1',
        exerciseId: 'bench-press',
        sets: invalidSet,
      };

      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow();
    }
  });

  it('should throw NotFoundError when trying to update exercise in deleted workout template', async () => {
    const existingTemplate = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    existingTemplate.markAsDeleted();

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: '1',
      exerciseId: 'bench-press',
      sets: 5,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });
});
