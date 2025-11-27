import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateWorkoutTemplateUsecase } from '../UpdateWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('UpdateWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: UpdateWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new UpdateWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should update the workout template name', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [{ exerciseId: 'ex1', sets: 3 }],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      id: vp.validWorkoutTemplateProps.id.value,
      userId: vp.userId,
      name: 'New Name',
    };

    const result = await usecase.execute(request);

    expect(result.name).toBe('New Name');
    expect(result.id).toBe(vp.validWorkoutTemplateProps.id.value);
    expect(result.exercises).toEqual([{ exerciseId: 'ex1', sets: 3 }]);
    expect(new Date(result.createdAt)).toEqual(existingTemplate.createdAt);
    expect(new Date(result.updatedAt)).not.toEqual(existingTemplate.updatedAt);

    // Verify it was saved in the repo
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      vp.validWorkoutTemplateProps.id.value
    );
    expect(savedTemplate!.name).toBe('New Name');
  });

  it('should return WorkoutTemplateDTO', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [{ exerciseId: 'ex1', sets: 3 }],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      id: vp.validWorkoutTemplateProps.id.value,
      userId: vp.userId,
      name: 'Updated Name',
    };

    const result = await usecase.execute(request);

    expect(result).not.toBeInstanceOf(WorkoutTemplate);
    for (const prop of dto.workoutTemplateDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    const request = {
      id: 'non-existent',
      name: 'New Name',
      userId: vp.userId,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw error if name is invalid', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [{ exerciseId: 'ex1', sets: 3 }],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const invalidNames = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidName of invalidNames) {
      const request = {
        id: vp.validWorkoutTemplateProps.id,
        name: invalidName,
        userId: vp.userId,
      };

      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if id is invalid', async () => {
    const invalidIds = [null, undefined, '', '   ', 3, {}, [], true, false];

    for (const invalidId of invalidIds) {
      const request = {
        id: invalidId,
        name: 'Valid Name',
      };

      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
    }
  });

  it('should throw NotFoundError when trying to update deleted template', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [{ exerciseId: 'ex1', sets: 3 }],
    });

    existingTemplate.markAsDeleted();
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      id: vp.validWorkoutTemplateProps.id.value,
      name: 'Updated Name',
      userId: vp.userId,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when trying to update deleted template', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      exercises: [{ exerciseId: 'ex1', sets: 3 }],
    });

    existingTemplate.markAsDeleted();
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      id: vp.validWorkoutTemplateProps.id.value,
      name: 'Updated Name',
      userId: vp.userId,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });
});
