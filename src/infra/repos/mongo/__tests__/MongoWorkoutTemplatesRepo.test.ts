import { Exercise } from '@/domain/entities/exercise/Exercise';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import * as exerciseTestProps from '../../../../../tests/createProps/exerciseTestProps';
import * as workoutTemplateTestProps from '../../../../../tests/createProps/workoutTemplateTestProps';
import { MongoExercisesRepo } from '../MongoExercisesRepo';
import { MongoWorkoutTemplatesRepo } from '../MongoWorkoutTemplatesRepo';
import WorkoutTemplateLineMongo from '../models/WorkoutTemplateLineMongo';
import WorkoutTemplateMongo from '../models/WorkoutTemplateMongo';
import { mockForThrowingError } from './mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from './setupMongoTestDB';

describe('MongoWorkoutTemplatesRepo', () => {
  let repo: MongoWorkoutTemplatesRepo;
  let exercisesRepo: MongoExercisesRepo;
  let template: WorkoutTemplate;
  let exercise: Exercise;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    exercisesRepo = new MongoExercisesRepo();
    repo = new MongoWorkoutTemplatesRepo();

    exercise = exerciseTestProps.createTestExercise();
    await exercisesRepo.saveExercise(exercise);

    template = workoutTemplateTestProps.createTestWorkoutTemplate();

    await repo.saveWorkoutTemplate(template);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('saveWorkoutTemplate', () => {
    it('should save a workout template with its template lines', async () => {
      const newExercise = exerciseTestProps.createTestExercise({
        id: 'exercise-2',
      });
      await exercisesRepo.saveExercise(newExercise);

      const templateLine = WorkoutTemplateLine.create({
        ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
        id: 'line-2',
        templateId: 'template-2',
        exerciseId: newExercise.id,
        sets: 4,
      });

      const newTemplate = workoutTemplateTestProps.createTestWorkoutTemplate({
        id: 'template-2',
        name: 'Leg Day Template',
        exercises: [templateLine],
      });
      await repo.saveWorkoutTemplate(newTemplate);

      const allTemplates = await repo.getAllWorkoutTemplates();
      expect(allTemplates.length).toBe(2);
      expect(allTemplates[1].name).toBe('Leg Day Template');
      expect(allTemplates[1].exercises).toHaveLength(1);
      expect(allTemplates[1].exercises[0].exerciseId).toBe(newExercise.id);
    });

    it('should update an existing workout template', async () => {
      const existingTemplate = await repo.getWorkoutTemplateById('1');
      existingTemplate!.update({
        name: 'Updated Template Name',
      });
      await repo.saveWorkoutTemplate(existingTemplate!);

      const allTemplates = await repo.getAllWorkoutTemplates();
      expect(allTemplates.length).toBe(1);
      expect(allTemplates[0].name).toBe('Updated Template Name');
    });

    it('should update template lines when saving', async () => {
      const existingTemplate = await repo.getWorkoutTemplateById('1');
      expect(existingTemplate!.exercises).toHaveLength(1);

      const newExercise = exerciseTestProps.createTestExercise({
        id: 'exercise-3',
      });
      await exercisesRepo.saveExercise(newExercise);

      const newLine = WorkoutTemplateLine.create({
        ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
        id: 'line-new',
        templateId: existingTemplate!.id,
        exerciseId: newExercise.id,
        sets: 3,
      });

      existingTemplate!.addExercise(newLine);
      await repo.saveWorkoutTemplate(existingTemplate!);

      const updatedTemplate = await repo.getWorkoutTemplateById(
        existingTemplate!.id,
      );
      expect(updatedTemplate!.exercises).toHaveLength(2);
      expect(updatedTemplate!.exercises.map((l) => l.exerciseId)).toContain(
        newExercise.id,
      );
    });
  });

  describe('getAllWorkoutTemplates', () => {
    it('should retrieve all workout templates', async () => {
      const template2 = workoutTemplateTestProps.createTestWorkoutTemplate({
        id: 'template-2',
        exercises: [
          WorkoutTemplateLine.create({
            ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
            id: 'line-2',
            templateId: 'template-2',
            exerciseId: exercise.id,
            sets: 4,
          }),
        ],
      });
      const template3 = workoutTemplateTestProps.createTestWorkoutTemplate({
        id: 'template-3',
        exercises: [
          WorkoutTemplateLine.create({
            ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
            id: 'line-3',
            templateId: 'template-3',
            exerciseId: exercise.id,
            sets: 5,
          }),
        ],
      });

      await repo.saveWorkoutTemplate(template2);
      await repo.saveWorkoutTemplate(template3);

      const allTemplates = await repo.getAllWorkoutTemplates();
      expect(allTemplates).toHaveLength(3);
    });

    it('should return empty array if no templates', async () => {
      await clearMongoTestDB();

      const allTemplates = await repo.getAllWorkoutTemplates();
      expect(allTemplates).toHaveLength(0);
    });
  });

  describe('getAllWorkoutTemplatesByUserId', () => {
    it('should retrieve all workout templates for a specific user', async () => {
      const template2 = workoutTemplateTestProps.createTestWorkoutTemplate({
        id: 'template-2',
        exercises: [
          WorkoutTemplateLine.create({
            ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
            id: 'line-t2',
            templateId: 'template-2',
            exerciseId: exercise.id,
            sets: 4,
          }),
        ],
      });

      const templateOtherUser =
        workoutTemplateTestProps.createTestWorkoutTemplate({
          id: 'template-3',
          userId: 'other-user',
          name: 'Other User Template',
          exercises: [
            WorkoutTemplateLine.create({
              ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
              id: 'line-t3',
              templateId: 'template-3',
              exerciseId: exercise.id,
              sets: 5,
            }),
          ],
        });

      await repo.saveWorkoutTemplate(template2);
      await repo.saveWorkoutTemplate(templateOtherUser);

      const userTemplates = await repo.getAllWorkoutTemplatesByUserId(
        template.userId,
      );

      expect(userTemplates).toHaveLength(2);
      expect(userTemplates.every((t) => t.userId === template.userId)).toBe(
        true,
      );
    });

    it('should return empty array if user has no templates', async () => {
      const userTemplates =
        await repo.getAllWorkoutTemplatesByUserId('non-existent-user');

      expect(userTemplates).toHaveLength(0);
    });

    it('should not include templates from other users', async () => {
      const templateOtherUser =
        workoutTemplateTestProps.createTestWorkoutTemplate({
          id: 'template-other',
          userId: 'other-user',
          exercises: [
            WorkoutTemplateLine.create({
              ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
              id: 'line-other',
              templateId: 'template-other',
              exerciseId: exercise.id,
              sets: 3,
            }),
          ],
        });

      await repo.saveWorkoutTemplate(templateOtherUser);

      const userTemplates = await repo.getAllWorkoutTemplatesByUserId(
        template.userId,
      );

      expect(userTemplates).toHaveLength(1);
      expect(userTemplates[0].id).toBe('1');
    });
  });

  describe('getWorkoutTemplateById', () => {
    it('should retrieve a workout template by ID with its template lines', async () => {
      const fetchedTemplate = await repo.getWorkoutTemplateById('1');

      expect(fetchedTemplate!.id).toBe('1');
      expect(fetchedTemplate!.name).toBe('Test workout template');
      expect(fetchedTemplate!.exercises).toHaveLength(1);
      expect(fetchedTemplate!.exercises[0].exerciseId).toBe(exercise.id);
    });

    it('should return null for non-existent template ID', async () => {
      const fetchedTemplate =
        await repo.getWorkoutTemplateById('non-existent-id');

      expect(fetchedTemplate).toBeNull();
    });
  });

  describe('getWorkoutTemplateByIdAndUserId', () => {
    it('should retrieve a workout template by ID and user ID', async () => {
      const fetchedTemplate = await repo.getWorkoutTemplateByIdAndUserId(
        '1',
        template.userId,
      );

      expect(fetchedTemplate).not.toBeNull();
      expect(fetchedTemplate!.id).toBe('1');
      expect(fetchedTemplate!.userId).toBe(template.userId);
    });

    it('should return null when template ID and user ID do not match', async () => {
      const fetchedTemplate = await repo.getWorkoutTemplateByIdAndUserId(
        '1',
        'wrong-user-id',
      );

      expect(fetchedTemplate).toBeNull();
    });

    it('should return null for non-existent template ID', async () => {
      const fetchedTemplate = await repo.getWorkoutTemplateByIdAndUserId(
        'non-existent-id',
        template.userId,
      );

      expect(fetchedTemplate).toBeNull();
    });
  });

  describe('deleteAllWorkoutTemplatesForUser', () => {
    it('should delete all workout templates and their template lines for a user', async () => {
      const template2 = workoutTemplateTestProps.createTestWorkoutTemplate({
        id: 'template-2',
        exercises: [
          WorkoutTemplateLine.create({
            ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
            id: 'line-2',
            templateId: 'template-2',
            exerciseId: exercise.id,
            sets: 4,
          }),
        ],
      });
      const templateOtherUser =
        workoutTemplateTestProps.createTestWorkoutTemplate({
          id: 'template-3',
          userId: 'other-user',
          exercises: [
            WorkoutTemplateLine.create({
              ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
              id: 'line-3',
              templateId: 'template-3',
              exerciseId: exercise.id,
              sets: 5,
            }),
          ],
        });

      await repo.saveWorkoutTemplate(template2);
      await repo.saveWorkoutTemplate(templateOtherUser);

      const templateLinesBeforeDeletion = await WorkoutTemplateLineMongo.find({
        templateId: '1',
      });
      expect(templateLinesBeforeDeletion).toHaveLength(2);

      await repo.deleteAllWorkoutTemplatesForUser(template.userId);

      const allTemplates = await repo.getAllWorkoutTemplates();
      expect(allTemplates).toHaveLength(1);
      expect(allTemplates[0].userId).toBe('other-user');

      const templateLinesAfterDeletion = await WorkoutTemplateLineMongo.find({
        templateId: '1',
      });
      expect(templateLinesAfterDeletion).toHaveLength(0);
    });

    it('should not affect templates from other users', async () => {
      const templateOtherUser =
        workoutTemplateTestProps.createTestWorkoutTemplate({
          id: 'template-other',
          userId: 'other-user',
          exercises: [
            WorkoutTemplateLine.create({
              ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
              id: 'line-other',
              templateId: 'template-other',
              exerciseId: exercise.id,
              sets: 3,
            }),
          ],
        });

      await repo.saveWorkoutTemplate(templateOtherUser);

      const allTemplatesBefore = await repo.getAllWorkoutTemplates();
      expect(allTemplatesBefore).toHaveLength(2);

      await repo.deleteAllWorkoutTemplatesForUser(template.userId);

      const allTemplatesAfter = await repo.getAllWorkoutTemplates();
      expect(allTemplatesAfter).toHaveLength(1);
      expect(allTemplatesAfter[0].userId).toBe('other-user');
    });
  });

  describe('transactions', () => {
    describe('saveWorkoutTemplate', () => {
      it('should rollback changes if error in template find and update', async () => {
        mockForThrowingError(WorkoutTemplateMongo, 'findOneAndUpdate');

        const existingTemplate = await repo.getWorkoutTemplateById('1');
        existingTemplate!.update({
          name: 'Updated Template Name',
        });

        // Try to save template - should throw error
        await expect(
          repo.saveWorkoutTemplate(existingTemplate!),
        ).rejects.toThrow(/Mocked error.*findOneAndUpdate/i);

        const notUpdatedTemplate = await repo.getWorkoutTemplateById('1');
        expect(notUpdatedTemplate!.name).toBe('Test workout template');
      });

      it('should rollback changes if error in deleteMany template lines', async () => {
        mockForThrowingError(WorkoutTemplateLineMongo, 'deleteMany');

        const existingTemplate = await repo.getWorkoutTemplateById('1');
        existingTemplate!.update({
          name: 'Updated Template Name',
        });

        const anotherExercise = exerciseTestProps.createTestExercise({
          id: 'exercise-2',
        });
        await exercisesRepo.saveExercise(anotherExercise);

        const newLine = WorkoutTemplateLine.create({
          ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
          id: 'line-new',
          templateId: existingTemplate!.id,
          exerciseId: anotherExercise.id,
          sets: 5,
        });

        existingTemplate!.addExercise(newLine);

        // Try to save template
        await expect(
          repo.saveWorkoutTemplate(existingTemplate!),
        ).rejects.toThrow(/Mocked error.*deleteMany/i);

        const notUpdatedTemplate = await repo.getWorkoutTemplateById('1');
        expect(notUpdatedTemplate!.name).toBe('Test workout template');
        expect(notUpdatedTemplate!.exercises).toHaveLength(1);
        expect(notUpdatedTemplate!.exercises[0].exerciseId).toBe(exercise.id);
      });

      it('should rollback changes if error in insertMany template lines', async () => {
        mockForThrowingError(WorkoutTemplateLineMongo, 'insertMany');

        const existingTemplate = await repo.getWorkoutTemplateById('1');
        existingTemplate!.update({
          name: 'Updated Template Name',
        });

        const anotherExercise = exerciseTestProps.createTestExercise({
          id: 'exercise-2',
        });
        await exercisesRepo.saveExercise(anotherExercise);

        const newLine = WorkoutTemplateLine.create({
          ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
          id: 'line-new',
          templateId: existingTemplate!.id,
          exerciseId: anotherExercise.id,
          sets: 5,
        });

        existingTemplate!.addExercise(newLine);

        // Try to save template
        await expect(
          repo.saveWorkoutTemplate(existingTemplate!),
        ).rejects.toThrow(/Mocked error.*insertMany/i);

        const notUpdatedTemplate = await repo.getWorkoutTemplateById('1');
        expect(notUpdatedTemplate!.name).toBe('Test workout template');
        expect(notUpdatedTemplate!.exercises).toHaveLength(1);
        expect(notUpdatedTemplate!.exercises[0].exerciseId).toBe(exercise.id);
      });
    });

    describe('deleteAllWorkoutTemplatesForUser', () => {
      it('should rollback changes if error occurs when deleting template lines', async () => {
        mockForThrowingError(WorkoutTemplateLineMongo, 'deleteMany');

        const userId = template.userId;

        const initialTemplates =
          await repo.getAllWorkoutTemplatesByUserId(userId);
        expect(initialTemplates).toHaveLength(1);

        const initialTemplateLineId = initialTemplates[0].exercises[0].id;

        // Try to delete templates for user
        await expect(
          repo.deleteAllWorkoutTemplatesForUser(userId),
        ).rejects.toThrow(/Mocked error.*deleteMany/i);

        // Verify that rollback worked: the template still exists
        const templatesAfterFailedDelete =
          await repo.getAllWorkoutTemplatesByUserId(userId);
        expect(templatesAfterFailedDelete).toHaveLength(1);

        const templateAfterFailedDelete = templatesAfterFailedDelete[0];
        expect(templateAfterFailedDelete.id).toBe('1');

        // Verify that the template lines still exist
        expect(templateAfterFailedDelete.exercises).toHaveLength(1);
        expect(templateAfterFailedDelete.exercises[0].id).toBe(
          initialTemplateLineId,
        );
      });

      it('should rollback changes if error occurs when deleting templates', async () => {
        mockForThrowingError(WorkoutTemplateMongo, 'deleteMany');

        const userId = template.userId;

        const initialTemplates =
          await repo.getAllWorkoutTemplatesByUserId(userId);
        expect(initialTemplates).toHaveLength(1);

        const initialTemplateLineId = initialTemplates[0].exercises[0].id;

        // Try to delete templates for user
        await expect(
          repo.deleteAllWorkoutTemplatesForUser(userId),
        ).rejects.toThrow(/Mocked error.*deleteMany/i);

        // Verify that rollback worked: the template still exists
        const templatesAfterFailedDelete =
          await repo.getAllWorkoutTemplatesByUserId(userId);
        expect(templatesAfterFailedDelete).toHaveLength(1);

        const templateAfterFailedDelete = templatesAfterFailedDelete[0];
        expect(templateAfterFailedDelete.id).toBe('1');

        // Verify that the template lines still exist
        expect(templateAfterFailedDelete.exercises).toHaveLength(1);
        expect(templateAfterFailedDelete.exercises[0].id).toBe(
          initialTemplateLineId,
        );
      });
    });
  });
});
