import { beforeEach, describe, expect, it } from 'vitest';
import { GetWorkoutTemplateByIdForUserUsecase } from '../GetWorkoutTemplateByIdForUser.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import * as vp from '@/../tests/createProps';

describe('GetWorkoutTemplateByIdForUserUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: GetWorkoutTemplateByIdForUserUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new GetWorkoutTemplateByIdForUserUsecase(workoutTemplatesRepo);
  });

  it('should return workout template by id for the correct user', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      userId: vp.userId,
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

  it('should return null if template belongs to different user', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      id: '1',
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const result = await usecase.execute({ id: '1', userId: 'user2' });

    expect(result).toBeNull();
  });

  it('should return null if template does not exist', async () => {
    const result = await usecase.execute({ id: '999', userId: vp.userId });

    expect(result).toBeNull();
  });

  it('should return null if template is deleted', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      id: '1',
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);
    template.markAsDeleted();
    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const result = await usecase.execute({ id: '1', userId: vp.userId });

    expect(result).toBeNull();
  });

  it('should throw error if id is invalid', async () => {
    const invalidIds = [
      '',
      '   ',
      null,
      undefined,
      123,
      {},
      [],
      true,
      false,
      NaN,
      Infinity,
    ];

    for (const id of invalidIds) {
      await expect(
        // @ts-expect-error testing invalid inputs
        usecase.execute({ id, userId: vp.userId })
      ).rejects.toThrowError();
    }
  });

  it('should throw error if userId is invalid', async () => {
    const invalidUserIds = [
      '',
      '   ',
      null,
      undefined,
      123,
      {},
      [],
      true,
      false,
      NaN,
      Infinity,
    ];

    for (const userId of invalidUserIds) {
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute({ id: '1', userId })).rejects.toThrowError();
    }
  });
});
