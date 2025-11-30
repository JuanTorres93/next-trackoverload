import { beforeEach, describe, expect, it } from 'vitest';
import { AddExerciseToWorkoutTemplateUsecase } from '../AddExerciseToWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { NotFoundError } from '@/domain/common/errors';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

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
      ...vp.validExerciseProps,
      id: 'bench-press',
    });

    const shoulderPressExercise = Exercise.create({
      ...vp.validExerciseProps,
      id: 'shoulder-press',
    });

    await exercisesRepo.saveExercise(benchPressExercise);
    await exercisesRepo.saveExercise(shoulderPressExercise);

    // Create a template with one existing exercise
    existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);
  });

  it('should add exercise to workout template', async () => {
    const request = {
      userId: vp.userId,
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: 'shoulder-press',
      sets: 4,
    };

    const result = await usecase.execute(request);

    expect(result.exercises).toHaveLength(
      vp.validWorkoutTemplateProps().exercises.length + 1
    );

    const exercisesIds = result.exercises.map((ex) => ex.exerciseId);
    expect(exercisesIds).toContain('shoulder-press');

    // Verify it was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      vp.validWorkoutTemplateProps().id
    );
    expect(savedTemplate!.exercises).toHaveLength(
      vp.validWorkoutTemplateProps().exercises.length + 1
    );
  });

  it('should return WorkoutTemplateDTO', async () => {
    const request = {
      userId: vp.userId,
      workoutTemplateId: '1',
      exerciseId: 'shoulder-press',
      sets: 4,
    };

    const result = await usecase.execute(request);

    expect(result).not.toBeInstanceOf(WorkoutTemplate);
    for (const prop of dto.workoutTemplateDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    const request = {
      userId: vp.userId,
      workoutTemplateId: 'non-existent',
      exerciseId: 'bench-press',
      sets: 3,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when adding duplicate exercise', async () => {
    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
    });
    await exercisesRepo.saveExercise(exercise);

    const request = {
      userId: vp.userId,
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
      sets: 4,
    };

    await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
  });

  it('should throw error if exercise does not exist', async () => {
    const request = {
      userId: vp.userId,
      workoutTemplateId: '1',
      exerciseId: 'non-existent-exercise',
      sets: 3,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

    await expect(usecase.execute(request)).rejects.toThrow(/Exercise not/i);
  });

  it('should throw NotFoundError when trying to add exercise to deleted template', async () => {
    // Delete the template
    existingTemplate.markAsDeleted();

    const request = {
      userId: vp.userId,
      workoutTemplateId: '1',
      exerciseId: 'shoulder-press',
      sets: 3,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
    await expect(usecase.execute(request)).rejects.toThrow(
      'WorkoutTemplate not found'
    );
  });

  it('should throw error when trying to add exercise to a template marked as deleted', async () => {
    // Mark the template as deleted without removing it from repo
    existingTemplate.markAsDeleted();
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      userId: vp.userId,
      workoutTemplateId: '1',
      exerciseId: 'shoulder-press',
      sets: 3,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });
});
