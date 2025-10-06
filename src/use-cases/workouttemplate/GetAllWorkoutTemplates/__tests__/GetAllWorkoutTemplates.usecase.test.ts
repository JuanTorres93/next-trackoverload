import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllWorkoutTemplatesUsecase } from '../GetAllWorkoutTemplates.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';

describe('GetAllWorkoutTemplatesUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: GetAllWorkoutTemplatesUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new GetAllWorkoutTemplatesUsecase(workoutTemplatesRepo);
  });

  it('should return all workout templates from the repository', async () => {
    const template1 = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const template2 = WorkoutTemplate.create({
      id: '2',
      name: 'Pull Day',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template1);
    await workoutTemplatesRepo.saveWorkoutTemplate(template2);

    const result = await usecase.execute();

    expect(result).toHaveLength(2);
    expect(result.find((t) => t.id === '1')?.name).toBe('Push Day');
    expect(result.find((t) => t.id === '2')?.name).toBe('Pull Day');
  });

  it('should return empty array when no templates exist', async () => {
    const result = await usecase.execute();

    expect(result).toEqual([]);
  });
});
