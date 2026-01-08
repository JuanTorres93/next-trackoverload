import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveExerciseFromWorkoutTemplateUsecase } from '../RemoveExerciseFromWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('RemoveExerciseFromWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: RemoveExerciseFromWorkoutTemplateUsecase;
  let user: User;
  let existingTemplate: WorkoutTemplate;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new RemoveExerciseFromWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      usersRepo
    );

    user = User.create({ ...vp.validUserProps });
    existingTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await usersRepo.saveUser(user);
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);
  });

  describe('Execution', () => {
    it('should remove exercise from workout template', async () => {
      const request = {
        workoutTemplateId: vp.validWorkoutTemplateProps().id,
        userId: vp.userId,
        exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
      };

      const result = await usecase.execute(request);

      expect(result.exercises).toHaveLength(1);
      expect(result.exercises[0].id).toEqual(
        vp.validWorkoutTemplateProps().exercises[1].id
      );
      expect(result.exercises[0].sets).toEqual(
        vp.validWorkoutTemplateProps().exercises[1].sets
      );

      // Verify template was saved
      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        result.id
      );
      expect(savedTemplate).not.toBeNull();
      expect(savedTemplate!.exercises).toHaveLength(1);
    });

    it('should return WorkoutTemplateDTO', async () => {
      const request = {
        workoutTemplateId: vp.validWorkoutTemplateProps().id,
        userId: vp.userId,
        exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
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
        workoutTemplateId: 'non-existent',
        userId: vp.userId,
        exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /RemoveExerciseFromWorkoutTemplateUsecase.*WorkoutTemplate.*not.*found/
      );
    });

    it('should throw error if template is deleted', async () => {
      existingTemplate.markAsDeleted();

      await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

      const request = {
        workoutTemplateId: vp.validWorkoutTemplateProps().id,
        exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
        userId: vp.userId,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /RemoveExerciseFromWorkoutTemplateUsecase.*WorkoutTemplate.*not.*found/
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        workoutTemplateId: vp.validWorkoutTemplateProps().id,
        userId: 'non-existent',
        exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /RemoveExerciseFromWorkoutTemplateUsecase.*User.*not.*found/
      );
    });

    it("should throw error when trying to remove exercise from another user's template", async () => {
      const anotherUser = User.create({ ...vp.validUserProps, id: 'user-2' });
      await usersRepo.saveUser(anotherUser);

      const request = {
        workoutTemplateId: vp.validWorkoutTemplateProps().id,
        userId: anotherUser.id,
        exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /RemoveExerciseFromWorkoutTemplateUsecase.*WorkoutTemplate.*not.*found/
      );
    });
  });
});
