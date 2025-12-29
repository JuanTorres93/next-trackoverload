import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator';
import { DuplicateWorkoutTemplateUsecase } from '../DuplicateWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('DuplicateWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: DuplicateWorkoutTemplateUsecase;
  let user: User;
  let originalTemplate: WorkoutTemplate;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new DuplicateWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      usersRepo,
      new Uuidv4IdGenerator()
    );

    user = User.create({ ...vp.validUserProps });

    originalTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      name: 'Push Day',
    });

    await usersRepo.saveUser(user);
    await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);
  });

  describe('Execution', () => {
    it('should duplicate workout template with default copy name', async () => {
      const request = {
        userId: vp.userId,
        originalTemplateId: originalTemplate.id,
      };

      const result = await usecase.execute(request);

      expect(result.userId).toBe(vp.userId);
      expect(result.name).toBe('Push Day (Copy)');
      expect(result.id).not.toBe(originalTemplate.id);
      expect(result.createdAt).not.toEqual(originalTemplate.createdAt);
      expect(result.updatedAt).not.toEqual(originalTemplate.updatedAt);

      // Verify template was saved
      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        result.id
      );
      expect(savedTemplate).not.toBeNull();
      expect(savedTemplate!.name).toBe('Push Day (Copy)');
    });

    it('should have different id than original template', async () => {
      const request = {
        userId: vp.userId,
        originalTemplateId: vp.validWorkoutTemplateProps().id,
      };

      const result = await usecase.execute(request);

      expect(result.id).not.toBe(originalTemplate.id);
    });

    it('should create new template lines (exercises) for duplicated template', async () => {
      const request = {
        userId: vp.userId,
        originalTemplateId: vp.validWorkoutTemplateProps().id,
      };

      const result = await usecase.execute(request);

      const originalExercisesIds = originalTemplate.exercises.map((e) => e.id);
      const resultExercisesIds = result.exercises.map((e) => e.id);

      for (const id of resultExercisesIds) {
        expect(originalExercisesIds).not.toContain(id);
      }
    });

    it('should return WorkoutTemplateDTO', async () => {
      const request = {
        userId: vp.userId,
        originalTemplateId: vp.validWorkoutTemplateProps().id,
      };

      const result = await usecase.execute(request);

      expect(result).not.toBeInstanceOf(WorkoutTemplate);
      for (const prop of dto.workoutTemplateDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should duplicate workout template with custom name', async () => {
      const request = {
        userId: vp.userId,
        originalTemplateId: vp.validWorkoutTemplateProps().id,
        newTemplateName: 'Push Day CUSTOM',
      };

      const result = await usecase.execute(request);

      expect(result.name).toBe('Push Day CUSTOM');
      expect(result.id).not.toBe(originalTemplate.id);

      // Verify template was saved
      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        result.id
      );
      expect(savedTemplate).not.toBeNull();
      expect(savedTemplate!.name).toBe('Push Day CUSTOM');
    });

    it('should correctly assign parent template to all template lines', async () => {
      const request = {
        userId: vp.userId,
        originalTemplateId: vp.validWorkoutTemplateProps().id,
      };

      const result = await usecase.execute(request);

      for (const exercise of result!.exercises) {
        expect(exercise.templateId).toBe(result.id);
      }
    });

    it('should duplicate template with empty exercises', async () => {
      const templateWithNoExercises = WorkoutTemplate.create({
        ...vp.validWorkoutTemplateProps(),
        name: 'Empty Template',
        exercises: [],
      });

      await workoutTemplatesRepo.saveWorkoutTemplate(templateWithNoExercises);

      const request = {
        userId: vp.userId,
        originalTemplateId: vp.validWorkoutTemplateProps().id,
      };

      const result = await usecase.execute(request);

      expect(result.name).toBe('Empty Template (Copy)');
      expect(result.exercises).toEqual([]);

      // Verify template was saved
      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        result.id
      );
      expect(savedTemplate).not.toBeNull();
      expect(savedTemplate!.name).toBe('Empty Template (Copy)');
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when template to duplicate does not exist', async () => {
      const request = {
        userId: vp.userId,
        originalTemplateId: 'non-existent',
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /DuplicateWorkoutTemplateUsecase.*WorkoutTemplate.*not found/
      );

      // Verify no template was saved
      const allTemplates = await workoutTemplatesRepo.getAllWorkoutTemplates();

      // It should only have the original template
      expect(allTemplates).toHaveLength(1);
    });

    it('should throw NotFoundError when trying to duplicate deleted template', async () => {
      originalTemplate.markAsDeleted();
      await workoutTemplatesRepo.saveWorkoutTemplate(originalTemplate);

      const request = {
        userId: vp.userId,
        originalTemplateId: vp.validWorkoutTemplateProps().id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /DuplicateWorkoutTemplateUsecase.*WorkoutTemplate.*not found/
      );
    });

    it('should throw NotFoundError when trying to duplicate template from different user', async () => {
      const anotherUser = User.create({
        ...vp.validUserProps,
        id: 'other-user',
        email: 'other@test.com',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        userId: 'other-user',
        originalTemplateId: vp.validWorkoutTemplateProps().id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /DuplicateWorkoutTemplateUsecase.*WorkoutTemplate.*not found/
      );
    });

    it('should throw error if user does not exist', async () => {
      await expect(
        usecase.execute({
          userId: 'non-existent',
          originalTemplateId: vp.validWorkoutTemplateProps().id,
        })
      ).rejects.toThrow(NotFoundError);

      await expect(
        usecase.execute({
          userId: 'non-existent',
          originalTemplateId: vp.validWorkoutTemplateProps().id,
        })
      ).rejects.toThrow(/DuplicateWorkoutTemplateUsecase.*User.*not.*found/);
    });
  });
});
