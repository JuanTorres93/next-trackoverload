import * as vp from '@/../tests/createProps';
import * as workoutTemplateTestProps from '../../../../../tests/createProps/workoutTemplateTestProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemWorkoutTemplatesRepo } from '../FileSystemWorkoutTemplatesRepo';
import fs from 'fs/promises';
import path from 'path';

describe('FileSystemWorkoutTemplatesRepo', () => {
  let repo: FileSystemWorkoutTemplatesRepo;
  let workoutTemplate: WorkoutTemplate;
  const testTemplatesDir = './__test_data__/workouttemplates';
  const testTemplateLinesDir = './__test_data__/workouttemplatelines';

  beforeEach(async () => {
    repo = new FileSystemWorkoutTemplatesRepo(
      testTemplatesDir,
      testTemplateLinesDir,
    );
    workoutTemplate = WorkoutTemplate.create(
      workoutTemplateTestProps.validWorkoutTemplateProps(),
    );
    await repo.saveWorkoutTemplate(workoutTemplate);
  });

  afterEach(async () => {
    try {
      await fs.rm(testTemplatesDir, { recursive: true, force: true });
      await fs.rm(testTemplateLinesDir, { recursive: true, force: true });
    } catch {
      // Directories might not exist
    }
  });

  it('should save a workout template', async () => {
    const line1 = WorkoutTemplateLine.create({
      id: 'line3',
      templateId: workoutTemplateTestProps.validWorkoutTemplateProps().id,
      exerciseId: 'ex3',
      sets: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const line2 = WorkoutTemplateLine.create({
      id: 'line4',
      templateId: workoutTemplateTestProps.validWorkoutTemplateProps().id,
      exerciseId: 'ex4',
      sets: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newWorkoutTemplate = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
      id: 'another-template-id',
      name: 'Pull Template',
      exercises: [line1, line2],
    });
    await repo.saveWorkoutTemplate(newWorkoutTemplate);

    const allWorkoutTemplates = await repo.getAllWorkoutTemplates();
    expect(allWorkoutTemplates.length).toBe(2);

    const savedTemplate = allWorkoutTemplates.find(
      (t) => t.id === 'another-template-id',
    );
    expect(savedTemplate).toBeDefined();
    expect(savedTemplate?.name).toBe('Pull Template');
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

  it('should retrieve workout templates by user ID', async () => {
    const userTemplates = await repo.getAllWorkoutTemplatesByUserId(
      userTestProps.userId,
    );
    expect(userTemplates.length).toBe(1);
    expect(userTemplates[0].userId).toBe(userTestProps.userId);
  });

  it('should retrieve a workout template by ID and user ID', async () => {
    const fetchedTemplate = await repo.getWorkoutTemplateByIdAndUserId(
      workoutTemplateTestProps.validWorkoutTemplateProps().id,
      userTestProps.userId,
    );
    expect(fetchedTemplate).not.toBeNull();
    expect(fetchedTemplate?.name).toBe(
      workoutTemplateTestProps.validWorkoutTemplateProps().name,
    );
  });

  it('should return null for non-existent workout template ID', async () => {
    const fetchedWorkoutTemplate =
      await repo.getWorkoutTemplateById('non-existent-id');
    expect(fetchedWorkoutTemplate).toBeNull();
  });

  it('should persist template and template lines to filesystem', async () => {
    // Verify template file exists
    const templateFilePath = path.join(
      testTemplatesDir,
      `${workoutTemplate.id}.json`,
    );
    const templateFileExists = await fs
      .access(templateFilePath)
      .then(() => true)
      .catch(() => false);
    expect(templateFileExists).toBe(true);

    // Verify template line files exist
    for (const line of workoutTemplate.exercises) {
      const lineFilePath = path.join(testTemplateLinesDir, `${line.id}.json`);
      const lineFileExists = await fs
        .access(lineFilePath)
        .then(() => true)
        .catch(() => false);
      expect(lineFileExists).toBe(true);
    }
  });

  it('should handle soft-deleted templates', async () => {
    workoutTemplate.markAsDeleted();
    await repo.saveWorkoutTemplate(workoutTemplate);

    const fetchedTemplate = await repo.getWorkoutTemplateById(
      workoutTemplate.id,
    );
    expect(fetchedTemplate).not.toBeNull();
    expect(fetchedTemplate?.isDeleted).toBe(true);
    expect(fetchedTemplate?.deletedAt).toBeDefined();
  });

  it('should delete all workout templates for a user', async () => {
    const workoutTemplate2 = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
      id: 'template-2',
      name: 'Pull Template',
    });
    const workoutTemplate3 = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
      id: 'template-3',
      userId: 'user-2',
      name: 'Leg Template',
    });
    await repo.saveWorkoutTemplate(workoutTemplate2);
    await repo.saveWorkoutTemplate(workoutTemplate3);

    const allTemplatesBefore = await repo.getAllWorkoutTemplates();
    expect(allTemplatesBefore.length).toBe(3);

    await repo.deleteAllWorkoutTemplatesForUser(userTestProps.userId);

    const allTemplatesAfter = await repo.getAllWorkoutTemplates();
    expect(allTemplatesAfter.length).toBe(1);
    expect(allTemplatesAfter[0].userId).toBe('user-2');
  });
});
