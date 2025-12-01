import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveExerciseFromWorkoutTemplateUsecase } from '../RemoveExerciseFromWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('RemoveExerciseFromWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: RemoveExerciseFromWorkoutTemplateUsecase;
  let user: User;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new RemoveExerciseFromWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      usersRepo
    );

    user = User.create({ ...vp.validUserProps });
    await usersRepo.saveUser(user);
  });

  it('should remove exercise from workout template', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      userId: vp.userId,
      exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
    };

    const result = await usecase.execute(request);

    expect(result.exercises).toHaveLength(1);
    expect(result.exercises[0].id).toEqual(
      vp.validWorkoutTemplateProps().exercises[1].id
    );
    expect(result.exercises[0].sets).toEqual(
      vp.validWorkoutTemplateProps().exercises[1].sets
    );

    // Verify template was saved
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.exercises).toHaveLength(1);
  });

  it('should return WorkoutTemplateDTO', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      userId: vp.userId,
      exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
    };

    const result = await usecase.execute(request);

    expect(result).not.toBeInstanceOf(WorkoutTemplate);
    for (const prop of dto.workoutTemplateDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    const request = {
      workoutTemplateId: 'non-existent',
      userId: vp.userId,
      exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

    // Verify no template was modified
    const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();
    expect(allTemplates).toHaveLength(0);
  });

  it('should handle removing non-existent exercise gracefully', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      userId: vp.userId,
      exerciseId: 'non-existent-exercise',
    };

    const result = await usecase.execute(request);

    expect(result.exercises).toHaveLength(
      vp.validWorkoutTemplateProps().exercises.length
    );

    // Verify template was not modified
    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.exercises).toHaveLength(
      vp.validWorkoutTemplateProps().exercises.length
    );
  });

  it('should throw error if template is deleted', async () => {
    const existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    existingTemplate.markAsDeleted();

    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
      userId: vp.userId,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      usecase.execute({
        workoutTemplateId: vp.validWorkoutTemplateProps().id,
        userId: 'non-existent',
        exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      usecase.execute({
        workoutTemplateId: vp.validWorkoutTemplateProps().id,
        userId: 'non-existent',
        exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
      })
    ).rejects.toThrow(
      /RemoveExerciseFromWorkoutTemplateUsecase.*User.*not.*found/
    );
  });
});
