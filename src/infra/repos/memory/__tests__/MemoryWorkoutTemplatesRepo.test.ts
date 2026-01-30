import * as vp from '@/../tests/createProps';
import * as workoutTemplateTestProps from '../../../../../tests/createProps/workoutTemplateTestProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryWorkoutTemplatesRepo } from '../MemoryWorkoutTemplatesRepo';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';

describe('MemoryWorkoutTemplatesRepo', () => {
  let repo: MemoryWorkoutTemplatesRepo;
  let workoutTemplate: WorkoutTemplate;

  beforeEach(async () => {
    repo = new MemoryWorkoutTemplatesRepo();
    workoutTemplate = WorkoutTemplate.create(
      workoutTemplateTestProps.validWorkoutTemplateProps(),
    );
    await repo.saveWorkoutTemplate(workoutTemplate);
  });

  it('should save a workout template', async () => {
    const newWorkoutTemplate = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
      id: 'another-template-id',
      name: 'Pull Template',
      exercises: [
        WorkoutTemplateLine.create({
          ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
          id: 'line3',
          exerciseId: 'ex3',
        }),
        WorkoutTemplateLine.create({
          ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
          id: 'line4',
          exerciseId: 'ex4',
        }),
      ],
    });
    await repo.saveWorkoutTemplate(newWorkoutTemplate);

    const allWorkoutTemplates = await repo.getAllWorkoutTemplates();
    expect(allWorkoutTemplates.length).toBe(2);
    expect(allWorkoutTemplates[1].name).toBe('Pull Template');
  });

  it('should update an existing workout template', async () => {
    const updatedWorkoutTemplate = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
      name: 'Updated Push Template',
    });
    await repo.saveWorkoutTemplate(updatedWorkoutTemplate);

    const allWorkoutTemplates = await repo.getAllWorkoutTemplates();
    expect(allWorkoutTemplates.length).toBe(1);
    expect(allWorkoutTemplates[0].name).toBe('Updated Push Template');
  });

  it('should retrieve a workout template by ID', async () => {
    const fetchedWorkoutTemplate = await repo.getWorkoutTemplateById(
      workoutTemplateTestProps.validWorkoutTemplateProps().id,
    );
    expect(fetchedWorkoutTemplate).not.toBeNull();
    expect(fetchedWorkoutTemplate?.name).toBe(
      workoutTemplateTestProps.validWorkoutTemplateProps().name,
    );
  });

  it('should return null for non-existent workout template ID', async () => {
    const fetchedWorkoutTemplate =
      await repo.getWorkoutTemplateById('non-existent-id');
    expect(fetchedWorkoutTemplate).toBeNull();
  });

  it('should delete all workout templates for a user', async () => {
    const workoutTemplate2 = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
      id: 'template-2',
      name: 'Pull Template',
    });
    await repo.saveWorkoutTemplate(workoutTemplate2);

    const workoutTemplate3 = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
      id: 'template-3',
      userId: 'user-2',
      name: 'Leg Template',
    });
    await repo.saveWorkoutTemplate(workoutTemplate3);

    const allTemplatesBefore = await repo.getAllWorkoutTemplates();
    expect(allTemplatesBefore.length).toBe(3);

    await repo.deleteAllWorkoutTemplatesForUser(userTestProps.userId);

    const allTemplatesAfter = await repo.getAllWorkoutTemplates();
    expect(allTemplatesAfter.length).toBe(1);
    expect(allTemplatesAfter[0].userId).toBe('user-2');
  });
});
