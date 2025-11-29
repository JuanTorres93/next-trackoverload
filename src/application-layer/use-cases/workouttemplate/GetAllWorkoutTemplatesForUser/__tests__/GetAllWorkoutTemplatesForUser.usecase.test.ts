import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllWorkoutTemplatesForUserUsecase } from '../GetAllWorkoutTemplatesForUser.usecase';

describe('GetAllWorkoutTemplatesForUserUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: GetAllWorkoutTemplatesForUserUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new GetAllWorkoutTemplatesForUserUsecase(workoutTemplatesRepo);
  });

  it('should return all workout templates for a specific user', async () => {
    const user1Template1 = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      id: 'user1-template1-id',
      exercises: [],
    });

    const user1Template2 = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      id: 'user1-template2-id',
      exercises: [],
    });

    const user2Template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      id: 'user2-template-id',
      userId: 'user2-id',
      name: 'Leg Day',
      exercises: [],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(user1Template1);
    await workoutTemplatesRepo.saveWorkoutTemplate(user1Template2);
    await workoutTemplatesRepo.saveWorkoutTemplate(user2Template);

    const result = await usecase.execute({ userId: vp.userId });

    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id)).toEqual([
      'user1-template1-id',
      'user1-template2-id',
    ]);
    expect(result.every((t) => t.userId === vp.userId)).toBe(true);
  });

  it('should return array of WorkoutTemplateDTO', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const result = await usecase.execute({ userId: vp.userId });

    expect(result).toHaveLength(1);

    expect(result[0]).not.toBeInstanceOf(WorkoutTemplate);
    for (const prop of dto.workoutTemplateDTOProperties) {
      expect(result[0]).toHaveProperty(prop);
    }
  });

  it('should return empty array if user has no templates', async () => {
    const result = await usecase.execute({ userId: vp.userId });

    expect(result).toEqual([]);
  });

  it('should not return deleted templates', async () => {
    const template1 = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    const template2 = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      id: 'another-template-id',
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template1);
    await workoutTemplatesRepo.saveWorkoutTemplate(template2);

    template1.markAsDeleted();
    await workoutTemplatesRepo.saveWorkoutTemplate(template1);

    const result = await usecase.execute({ userId: vp.userId });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('another-template-id');
  });
});
