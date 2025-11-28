import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryWorkoutTemplatesRepo } from '../MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { Id } from '@/domain/value-objects/Id/Id';
import * as vp from '@/../tests/createProps';

describe('MemoryWorkoutTemplatesRepo', () => {
  let repo: MemoryWorkoutTemplatesRepo;
  let workoutTemplate: WorkoutTemplate;

  beforeEach(async () => {
    repo = new MemoryWorkoutTemplatesRepo();
    workoutTemplate = WorkoutTemplate.create(vp.validWorkoutTemplateProps);
    await repo.saveWorkoutTemplate(workoutTemplate);
  });

  it('should save a workout template', async () => {
    const newWorkoutTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      id: Id.create('2'),
      name: 'Pull Template',
      exercises: [
        { exerciseId: 'ex3', sets: 3 },
        { exerciseId: 'ex4', sets: 5 },
      ],
    });
    await repo.saveWorkoutTemplate(newWorkoutTemplate);

    const allWorkoutTemplates = await repo.getAllWorkoutTemplates();
    expect(allWorkoutTemplates.length).toBe(2);
    expect(allWorkoutTemplates[1].name).toBe('Pull Template');
  });

  it('should update an existing workout template', async () => {
    const updatedWorkoutTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps,
      name: 'Updated Push Template',
    });
    await repo.saveWorkoutTemplate(updatedWorkoutTemplate);

    const allWorkoutTemplates = await repo.getAllWorkoutTemplates();
    expect(allWorkoutTemplates.length).toBe(1);
    expect(allWorkoutTemplates[0].name).toBe('Updated Push Template');
  });

  it('should retrieve a workout template by ID', async () => {
    const fetchedWorkoutTemplate = await repo.getWorkoutTemplateById(
      vp.validWorkoutTemplateProps.id.value
    );
    expect(fetchedWorkoutTemplate).not.toBeNull();
    expect(fetchedWorkoutTemplate?.name).toBe(
      vp.validWorkoutTemplateProps.name
    );
  });

  it('should return null for non-existent workout template ID', async () => {
    const fetchedWorkoutTemplate = await repo.getWorkoutTemplateById(
      'non-existent-id'
    );
    expect(fetchedWorkoutTemplate).toBeNull();
  });
});
