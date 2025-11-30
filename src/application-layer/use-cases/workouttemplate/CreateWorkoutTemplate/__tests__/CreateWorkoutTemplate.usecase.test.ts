import { beforeEach, describe, expect, it } from 'vitest';
import { CreateWorkoutTemplateUsecase } from '../CreateWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import * as dto from '@/../tests/dtoProperties';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';

describe('CreateWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: CreateWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new CreateWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should create a new workout template with the given name', async () => {
    const request = {
      userId: 'user1',
      name: 'Push Day',
    };

    const result = await usecase.execute(request);

    expect(result.userId).toBe('user1');
    expect(result.name).toBe('Push Day');
    expect(result.exercises).toEqual([]);
    expect(result.id).toBeDefined();
  });

  it('should return a WorkoutTemplateDTO', async () => {
    const request = {
      userId: 'user1',
      name: 'Leg Day',
    };

    const result = await usecase.execute(request);

    expect(result).not.toBeInstanceOf(WorkoutTemplate);
    for (const prop of dto.workoutTemplateDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should save the workout template in the repository', async () => {
    const request = {
      userId: 'user1',
      name: 'Pull Day',
    };

    const result = await usecase.execute(request);

    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.userId).toBe('user1');
    expect(savedTemplate!.name).toBe('Pull Day');
  });
});
