import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { MemoryExercisesRepo } from '@/infra/repos/memory/MemoryExercisesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import * as exerciseTestProps from '../../../../../../tests/createProps/exerciseTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as workoutTemplateTestProps from '../../../../../../tests/createProps/workoutTemplateTestProps';
import { AddExerciseToWorkoutTemplateUsecase } from '../AddExerciseToWorkoutTemplate.usecase';

describe('AddExerciseToWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let exercisesRepo: MemoryExercisesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: AddExerciseToWorkoutTemplateUsecase;
  let existingTemplate: WorkoutTemplate;
  let user: User;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    exercisesRepo = new MemoryExercisesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new AddExerciseToWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      exercisesRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
    );

    user = userTestProps.createTestUser();

    // Create the exercises that will be used in tests
    const benchPressExercise = exerciseTestProps.createTestExercise();

    const shoulderPressExercise = exerciseTestProps.createTestExercise({
      id: 'shoulder-press',
    });

    // Create a template with one existing exercise
    existingTemplate = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
    });

    await usersRepo.saveUser(user);
    await exercisesRepo.saveExercise(benchPressExercise);
    await exercisesRepo.saveExercise(shoulderPressExercise);
    await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);
  });

  describe('Execution', () => {
    it('should add exercise to workout template', async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId:
          workoutTemplateTestProps.validWorkoutTemplateProps().id,
        exerciseId: 'shoulder-press',
        sets: 4,
      };

      const result = await usecase.execute(request);

      expect(result.exercises).toHaveLength(
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises.length +
          1,
      );

      const exercisesIds = result.exercises.map((ex) => ex.exerciseId);
      expect(exercisesIds).toContain('shoulder-press');

      // Verify it was saved
      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        workoutTemplateTestProps.validWorkoutTemplateProps().id,
      );
      expect(savedTemplate!.exercises).toHaveLength(
        workoutTemplateTestProps.validWorkoutTemplateProps().exercises.length +
          1,
      );
    });

    it('should return WorkoutTemplateDTO', async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: '1',
        exerciseId: 'shoulder-press',
        sets: 4,
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
        workoutTemplateId: 'non-existent',
        exerciseId: 'bench-press',
        sets: 3,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /AddExerciseToWorkoutTemplateUsecase.*WorkoutTemplate.*not found/,
      );
    });

    it('should throw error if exercise does not exist', async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: '1',
        exerciseId: 'non-existent-exercise',
        sets: 3,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /AddExerciseToWorkoutTemplateUsecase.*Exercise.*not found/,
      );
    });

    it('should throw NotFoundError when trying to add exercise to deleted template', async () => {
      // Delete the template
      existingTemplate.markAsDeleted();

      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: '1',
        exerciseId: 'shoulder-press',
        sets: 3,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /AddExerciseToWorkoutTemplateUsecase.*WorkoutTemplate.*not found/,
      );
    });

    it('should throw error when trying to add exercise to a template marked as deleted', async () => {
      // Mark the template as deleted without removing it from repo
      existingTemplate.markAsDeleted();
      await workoutTemplatesRepo.saveWorkoutTemplate(existingTemplate);

      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: '1',
        exerciseId: 'shoulder-press',
        sets: 3,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /AddExerciseToWorkoutTemplateUsecase.*WorkoutTemplate.*not found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        userId: 'non-existent',
        workoutTemplateId:
          workoutTemplateTestProps.validWorkoutTemplateProps().id,
        exerciseId: 'bench-press',
        sets: 3,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /AddExerciseToWorkoutTemplateUsecase.*User.*not.*found/,
      );
    });

    it("should throw error when trying to add exercise to another user's workout template", async () => {
      const anotherUser = userTestProps.createTestUser({
        id: 'user-2',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        userId: anotherUser.id,
        workoutTemplateId: existingTemplate.id,
        exerciseId: 'bench-press',
        sets: 3,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /AddExerciseToWorkoutTemplateUsecase.*WorkoutTemplate.*not found/,
      );
    });
  });
});
