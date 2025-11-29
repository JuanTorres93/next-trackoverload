import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateExerciseInWorkoutTemplateUsecase } from '../UpdateExerciseInWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { Exercise } from '@/domain/entities/exercise/Exercise';

describe('UpdateExerciseInWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: UpdateExerciseInWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new UpdateExerciseInWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should update exercise sets in workout template', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      userId: vp.userId,
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: existingTemplate.exercises[0].exerciseId,
      sets: 55,
    };

    const unchangedExerciseBeforeDelete = existingTemplate.exercises[1];

    const result = await usecase.execute(request);

    const updatedExercise = result.exercises.find(
      (ex) => ex.exerciseId === existingTemplate.exercises[0].exerciseId
    );
    expect(updatedExercise?.sets).toBe(55);

    const unchangedExercise = result.exercises.find(
      (ex) => ex.exerciseId === unchangedExerciseBeforeDelete.exerciseId
    );
    expect(unchangedExercise?.sets).toBe(unchangedExerciseBeforeDelete.sets);

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );

    expect(savedTemplate).not.toBeNull();

    const savedUpdatedExercise = savedTemplate!.exercises.find(
      (ex) => ex.exerciseId === unchangedExerciseBeforeDelete.exerciseId
    );
    expect(savedUpdatedExercise?.sets).toBe(unchangedExerciseBeforeDelete.sets);
  });

  it('should return WorkoutTemplateDTO', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      userId: vp.userId,
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: existingTemplate.exercises[0].exerciseId,
      sets: 5,
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
      workoutTemplateId: 'non-existent-template-id',
      exerciseId: 'bench-press',
      sets: 5,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
    await expect(usecase.execute(request)).rejects.toThrow(
      /UpdateExerciseInWorkoutTemplate.*WorkoutTemplate.*not found/
    );

    // Verify no template was modified
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should not change existing exercises when trying to update non-existent one', async () => {
    const exerciseNotInRepo = Exercise.create({
      ...vp.validExerciseProps,
      id: 'non-existent-exercise',
      name: 'Non Existent Exercise',
    });

    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);
    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: exerciseNotInRepo.id,
      sets: 555,
      userId: vp.userId,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

    await expect(usecase.execute(request)).rejects.toThrow(
      /WorkoutTemplate: Exercise to update not found/
    );
  });

  it('should throw NotFoundError when trying to update exercise in deleted workout template', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    existingTemplate.markAsDeleted();

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      userId: vp.userId,
      exerciseId: 'bench-press',
      sets: 5,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });
});
