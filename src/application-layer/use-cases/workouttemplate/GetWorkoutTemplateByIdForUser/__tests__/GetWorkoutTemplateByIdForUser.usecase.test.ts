import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetWorkoutTemplateByIdForUserUsecase } from '../GetWorkoutTemplateByIdForUser.usecase';

describe('GetWorkoutTemplateByIdForUserUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: GetWorkoutTemplateByIdForUserUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new GetWorkoutTemplateByIdForUserUsecase(workoutTemplatesRepo);
  });

  it('should return workout template by id for the correct user', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      name: 'Push Day',
      exercises: [{ exerciseId: 'ex1', sets: 3 }],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const result = await usecase.execute({ id: '1', userId: vp.userId });

    expect(result).not.toBeNull();
    expect(result!.id).toBe('1');
    expect(result!.userId).toBe(vp.userId);
    expect(result!.name).toBe('Push Day');
  });

  it('should return WorkoutTemplateDTO', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      name: 'Leg Day',
      exercises: [{ exerciseId: 'ex2', sets: 4 }],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const result = await usecase.execute({
      id: vp.validWorkoutTemplateProps().id,
      userId: vp.userId,
    });

    expect(result).not.toBeInstanceOf(WorkoutTemplate);
    for (const prop of dto.workoutTemplateDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should return null if template belongs to different user', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const result = await usecase.execute({
      id: vp.validWorkoutTemplateProps().id,
      userId: 'user2',
    });
    expect(result).toBeNull();
  });

  it('should return null if template does not exist', async () => {
    const result = await usecase.execute({ id: '999', userId: vp.userId });

    expect(result).toBeNull();
  });

  it('should return null if template is deleted', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      id: 'to-be-deleted-id',
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);
    template.markAsDeleted();
    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const result = await usecase.execute({
      id: 'to-be-deleted-id',
      userId: vp.userId,
    });

    expect(result).toBeNull();
  });
});
