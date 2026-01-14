import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateWorkoutTemplateUsecase } from '../UpdateWorkoutTemplate.usecase';

describe('UpdateWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: UpdateWorkoutTemplateUsecase;
  let user: User;
  let existingTemplate: WorkoutTemplate;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new UpdateWorkoutTemplateUsecase(workoutTemplatesRepo, usersRepo);

    user = User.create({ ...vp.validUserProps });
    existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await usersRepo.saveUser(user);
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);
  });

  describe('Execution', () => {
    it('should update the workout template name', async () => {
      const request = {
        id: vp.validWorkoutTemplateProps().id,
        userId: vp.userId,
        name: 'New Name',
      };

      // Wait just a bit to ensure updatedAt will be different
      await new Promise((resolve) => setTimeout(resolve, 20));
      const result = await usecase.execute(request);

      expect(result.name).toBe('New Name');
      expect(result.id).toBe(vp.validWorkoutTemplateProps().id);
      expect(new Date(result.createdAt)).toEqual(existingTemplate.createdAt);
      expect(new Date(result.updatedAt)).not.toEqual(
        vp.validWorkoutTemplateProps().updatedAt
      );

      const exercisesIds = existingTemplate.exercises.map(
        (ex) => ex.exerciseId
      );
      const resultExercisesIds = result.exercises.map((ex) => ex.exerciseId);
      expect(resultExercisesIds).toEqual(exercisesIds);

      // Verify it was saved in the repo
      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        vp.validWorkoutTemplateProps().id
      );
      expect(savedTemplate!.name).toBe('New Name');
    });

    it('should return WorkoutTemplateDTO', async () => {
      const request = {
        id: vp.validWorkoutTemplateProps().id,
        userId: vp.userId,
        name: 'Updated Name',
      };

      const result = await usecase.execute(request);

      expect(result).not.toBeInstanceOf(WorkoutTemplate);
      for (const prop of dto.workoutTemplateDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when workout template does not exist', async () => {
      const request = {
        id: 'non-existent',
        name: 'New Name',
        userId: vp.userId,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /UpdateWorkoutTemplate.*WorkoutTemplate.*not found/
      );
    });

    it('should throw NotFoundError when trying to update deleted template', async () => {
      existingTemplate.markAsDeleted();
      await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

      const request = {
        id: vp.validWorkoutTemplateProps().id,
        name: 'Updated Name',
        userId: vp.userId,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        id: vp.validWorkoutTemplateProps().id,
        userId: 'non-existent',
        name: 'New Name',
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /UpdateWorkoutTemplateUsecase.*User.*not.*found/
      );
    });

    it("should throw error when trying to update another user's workout template", async () => {
      const anotherUser = User.create({ ...vp.validUserProps, id: 'user-2' });
      await usersRepo.saveUser(anotherUser);

      const request = {
        id: vp.validWorkoutTemplateProps().id,
        userId: anotherUser.id,
        name: 'Updated Name',
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /UpdateWorkoutTemplateUsecase.*WorkoutTemplate.*not found/
      );
    });
  });
});
