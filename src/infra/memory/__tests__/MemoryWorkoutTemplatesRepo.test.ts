import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryWorkoutTemplatesRepo } from '../MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';

const validWorkoutTemplateProps = {
  id: '1',
  name: 'Push Template',
  exercises: [
    { exerciseId: 'ex1', sets: 3 },
    { exerciseId: 'ex2', sets: 4 },
  ],
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

describe('MemoryWorkoutTemplatesRepo', () => {
  let repo: MemoryWorkoutTemplatesRepo;
  let workoutTemplate: WorkoutTemplate;

  beforeEach(async () => {
    repo = new MemoryWorkoutTemplatesRepo();
    workoutTemplate = WorkoutTemplate.create(validWorkoutTemplateProps);
    await repo.saveWorkoutTemplate(workoutTemplate);
  });

  it('should save a workout template', async () => {
    const newWorkoutTemplate = WorkoutTemplate.create({
      id: '2',
      name: 'Pull Template',
      exercises: [
        { exerciseId: 'ex3', sets: 3 },
        { exerciseId: 'ex4', sets: 5 },
      ],
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveWorkoutTemplate(newWorkoutTemplate);

    const allWorkoutTemplates = await repo.getAllWorkoutTemplates();
    expect(allWorkoutTemplates.length).toBe(2);
    expect(allWorkoutTemplates[1].name).toBe('Pull Template');
  });

  it('should update an existing workout template', async () => {
    const updatedWorkoutTemplate = WorkoutTemplate.create({
      ...validWorkoutTemplateProps,
      name: 'Updated Push Template',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveWorkoutTemplate(updatedWorkoutTemplate);

    const allWorkoutTemplates = await repo.getAllWorkoutTemplates();
    expect(allWorkoutTemplates.length).toBe(1);
    expect(allWorkoutTemplates[0].name).toBe('Updated Push Template');
  });

  it('should retrieve a workout template by ID', async () => {
    const fetchedWorkoutTemplate = await repo.getWorkoutTemplateById('1');
    expect(fetchedWorkoutTemplate).not.toBeNull();
    expect(fetchedWorkoutTemplate?.name).toBe('Push Template');
  });

  it('should return null for non-existent workout template ID', async () => {
    const fetchedWorkoutTemplate = await repo.getWorkoutTemplateById(
      'non-existent-id'
    );
    expect(fetchedWorkoutTemplate).toBeNull();
  });

  it('should soft delete a workout template by ID', async () => {
    const allWorkoutTemplates = await repo.getAllWorkoutTemplates();
    expect(allWorkoutTemplates.length).toBe(1);

    await repo.deleteWorkoutTemplate('1');

    const allWorkoutTemplatesAfterDeletion = (
      await repo.getAllWorkoutTemplates()
    ).filter((t) => !t.isDeleted);
    expect(allWorkoutTemplatesAfterDeletion.length).toBe(0);
  });

  it('should filter out deleted templates from getWorkoutTemplateById', async () => {
    await repo.deleteWorkoutTemplate('1');

    const fetchedWorkoutTemplate = await repo.getWorkoutTemplateById('1');
    expect(fetchedWorkoutTemplate).toBeNull();
  });

  it('should mark template as deleted instead of removing it', async () => {
    await repo.deleteWorkoutTemplate('1');

    // Template should still exist in internal storage but marked as deleted
    const templateIncludingDeleted = repo.workoutTemplatesForTesting.find(
      (t) => t.id === '1'
    );
    expect(templateIncludingDeleted).not.toBeNull();
    expect(templateIncludingDeleted?.isDeleted).toBe(true);
  });

  it('should update updatedAt when soft deleting', async () => {
    const originalUpdatedAt = workoutTemplate.updatedAt;
    await new Promise((resolve) => setTimeout(resolve, 1)); // Ensure different timestamp

    await repo.deleteWorkoutTemplate('1');

    const deletedTemplate = await repo.workoutTemplatesForTesting.find(
      (t) => t.id === '1'
    );
    expect(deletedTemplate).not.toBeNull();
    expect(deletedTemplate?.isDeleted).toBe(true);
    expect(deletedTemplate?.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });

  it('should handle deletion of non-existent template', async () => {
    await expect(repo.deleteWorkoutTemplate('non-existent')).rejects.toBe(null);
  });
});
