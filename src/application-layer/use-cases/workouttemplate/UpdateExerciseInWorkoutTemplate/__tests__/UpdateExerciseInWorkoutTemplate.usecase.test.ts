import * as workoutTemplateTestProps from '../../../../../../tests/createProps/workoutTemplateTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateExerciseInWorkoutTemplateUsecase } from '../UpdateExerciseInWorkoutTemplate.usecase';

describe('UpdateExerciseInWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: UpdateExerciseInWorkoutTemplateUsecase;
  let user: User;
  let existingTemplate: WorkoutTemplate;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new UpdateExerciseInWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      usersRepo,
    );

    user = User.create({ ...userTestProps.validUserProps });
    existingTemplate = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
    });

    await usersRepo.saveUser(user);
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);
  });

  describe('Execution', () => {
    it('should update exercise sets in workout template', async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId:
          workoutTemplateTestProps.validWorkoutTemplateProps().id,
        exerciseId: existingTemplate.exercises[0].exerciseId,
        sets: 55,
      };

      const unchangedExerciseBeforeDelete = existingTemplate.exercises[1];

      const result = await usecase.execute(request);

      const updatedExercise = result.exercises.find(
        (ex) => ex.exerciseId === existingTemplate.exercises[0].exerciseId,
      );
      expect(updatedExercise?.sets).toBe(55);

      const unchangedExercise = result.exercises.find(
        (ex) => ex.exerciseId === unchangedExerciseBeforeDelete.exerciseId,
      );
      expect(unchangedExercise?.sets).toBe(unchangedExerciseBeforeDelete.sets);

      // Verify template was saved
      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        result.id,
      );

      expect(savedTemplate).not.toBeNull();

      const savedUpdatedExercise = savedTemplate!.exercises.find(
        (ex) => ex.exerciseId === unchangedExerciseBeforeDelete.exerciseId,
      );
      expect(savedUpdatedExercise?.sets).toBe(
        unchangedExerciseBeforeDelete.sets,
      );
    });

    it('should return WorkoutTemplateDTO', async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId:
          workoutTemplateTestProps.validWorkoutTemplateProps().id,
        exerciseId: existingTemplate.exercises[0].exerciseId,
        sets: 5,
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
        userId: userTestProps.userId,
        workoutTemplateId: 'non-existent-template-id',
        exerciseId: 'bench-press',
        sets: 5,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /UpdateExerciseInWorkoutTemplate.*WorkoutTemplate.*not found/,
      );
    });

    it('should throw NotFoundError when trying to update exercise in deleted workout template', async () => {
      existingTemplate.markAsDeleted();

      await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

      const request = {
        workoutTemplateId:
          workoutTemplateTestProps.validWorkoutTemplateProps().id,
        userId: userTestProps.userId,
        exerciseId: 'bench-press',
        sets: 5,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /UpdateExerciseInWorkoutTemplate.*WorkoutTemplate.*not found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        userId: 'non-existent',
        workoutTemplateId:
          workoutTemplateTestProps.validWorkoutTemplateProps().id,
        exerciseId:
          workoutTemplateTestProps.validWorkoutTemplateProps().exercises[0]
            .exerciseId,
        sets: 5,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /UpdateExerciseInWorkoutTemplateUsecase.*User.*not.*found/,
      );
    });

    it("should throw error when trying to update exercise in another user's workout template", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'user-2',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        workoutTemplateId:
          workoutTemplateTestProps.validWorkoutTemplateProps().id,
        userId: anotherUser.id,
        exerciseId: existingTemplate.exercises[0].exerciseId,
        sets: 5,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /UpdateExerciseInWorkoutTemplateUsecase.*WorkoutTemplate.*not.*found/,
      );
    });
  });
});
