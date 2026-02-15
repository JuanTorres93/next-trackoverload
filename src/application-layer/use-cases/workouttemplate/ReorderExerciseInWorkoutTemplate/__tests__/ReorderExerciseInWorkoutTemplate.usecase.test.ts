import { beforeEach, describe, expect, it } from 'vitest';
import { ReorderExerciseInWorkoutTemplateUsecase } from '../ReorderExerciseInWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import * as workoutTemplateTestProps from '../../../../../../tests/createProps/workoutTemplateTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';

describe('ReorderExerciseInWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: ReorderExerciseInWorkoutTemplateUsecase;
  let testTemplate: WorkoutTemplate;
  let additionalWorkoutTemplateLine: WorkoutTemplateLine;
  let user: User;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new ReorderExerciseInWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      usersRepo,
    );

    user = userTestProps.createTestUser();
    await usersRepo.saveUser(user);

    testTemplate = workoutTemplateTestProps.createTestWorkoutTemplate();

    // testTemplate already has two exercises
    additionalWorkoutTemplateLine = WorkoutTemplateLine.create({
      ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
      id: 'line3',
      exerciseId: 'ex3',
      sets: 3,
    });

    // Add another exercise to have three in total for reordering tests
    testTemplate.addExercise(additionalWorkoutTemplateLine);

    await workoutTemplatesRepo.saveWorkoutTemplate(testTemplate);
  });

  describe('Execution', () => {
    it('should reorder exercise in workout template', async () => {
      const request = {
        workoutTemplateId: testTemplate.id,
        exerciseId: 'ex3',
        userId: userTestProps.userId,
        newIndex: 0,
      };

      const result = await usecase.execute(request);

      expect(result.exercises).toHaveLength(3);
      expect(result.exercises[0].exerciseId).toBe('ex3');
      expect(result.exercises[1].exerciseId).toBe('ex1');
      expect(result.exercises[2].exerciseId).toBe('ex2');

      // Verify template was saved
      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        result.id,
      );
      expect(savedTemplate).not.toBeNull();
      expect(savedTemplate!.exercises[0].exerciseId).toBe('ex3');
    });

    it('should return WorkoutTemplateDTO', async () => {
      const request = {
        workoutTemplateId: testTemplate.id,
        exerciseId: 'ex3',
        newIndex: 0,
        userId: userTestProps.userId,
      };

      const result = await usecase.execute(request);

      expect(result).not.toBeInstanceOf(WorkoutTemplate);
      for (const prop of dto.workoutTemplateDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should reorder exercise to middle position', async () => {
      const request = {
        workoutTemplateId: testTemplate.id,
        exerciseId: 'ex1',
        newIndex: 1,
        userId: userTestProps.userId,
      };

      const result = await usecase.execute(request);

      expect(result.exercises).toHaveLength(3);
      expect(result.exercises[0].exerciseId).toBe('ex2');
      expect(result.exercises[1].exerciseId).toBe('ex1');
      expect(result.exercises[2].exerciseId).toBe('ex3');
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when workout template does not exist', async () => {
      const request = {
        workoutTemplateId: 'non-existent',
        exerciseId: 'ex1',
        userId: userTestProps.userId,
        newIndex: 0,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /ReorderExerciseInWorkoutTemplate.*WorkoutTemplate.*not.*found/,
      );
    });

    it('should throw error if template is deleted', async () => {
      testTemplate.markAsDeleted();

      await workoutTemplatesRepo.saveWorkoutTemplate(testTemplate);

      const request = {
        workoutTemplateId: testTemplate.id,
        userId: userTestProps.userId,
        exerciseId: 'ex3',
        newIndex: 0,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /ReorderExerciseInWorkoutTemplate.*WorkoutTemplate.*not.*found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        workoutTemplateId: testTemplate.id,
        exerciseId: 'ex1',
        userId: 'non-existent',
        newIndex: 0,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /ReorderExerciseInWorkoutTemplateUsecase.*User.*not.*found/,
      );
    });

    it("should throw error when trying to reorder exercise in another user's workout template", async () => {
      const anotherUser = userTestProps.createTestUser({
        id: 'user-2',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        workoutTemplateId: testTemplate.id,
        userId: anotherUser.id,
        exerciseId: 'ex1',
        newIndex: 0,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReorderExerciseInWorkoutTemplateUsecase.*WorkoutTemplate.*not.*found/,
      );
    });
  });
});
