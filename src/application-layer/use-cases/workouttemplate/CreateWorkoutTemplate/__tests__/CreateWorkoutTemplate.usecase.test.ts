import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { CreateWorkoutTemplateUsecase } from '../CreateWorkoutTemplate.usecase';

describe('CreateWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: CreateWorkoutTemplateUsecase;
  let user: User;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new CreateWorkoutTemplateUsecase(
      workoutTemplatesRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
    );

    user = userTestProps.createTestUser();
    await usersRepo.saveUser(user);
  });

  describe('Execution', () => {
    it('should create a new workout template with the given name', async () => {
      const request = {
        actorUserId: userTestProps.userId,
        targetUserId: userTestProps.userId,
        name: 'Push Day',
      };

      const result = await usecase.execute(request);

      expect(result.userId).toBe(userTestProps.userId);
      expect(result.name).toBe('Push Day');
      expect(result.exercises).toEqual([]);
      expect(result.id).toBeDefined();
    });

    it('should return a WorkoutTemplateDTO', async () => {
      const request = {
        actorUserId: userTestProps.userId,
        targetUserId: userTestProps.userId,
        name: 'Leg Day',
      };

      const result = await usecase.execute(request);

      expect(result).not.toBeInstanceOf(WorkoutTemplate);
      for (const prop of dto.workoutTemplateDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should save the workout template in the repository', async () => {
      const request = {
        actorUserId: userTestProps.userId,
        targetUserId: userTestProps.userId,
        name: 'Pull Day',
      };

      const result = await usecase.execute(request);

      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        result.id,
      );
      expect(savedTemplate).not.toBeNull();
      expect(savedTemplate!.userId).toBe(userTestProps.userId);
      expect(savedTemplate!.name).toBe('Pull Day');
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        actorUserId: 'non-existent',
        targetUserId: 'non-existent',
        name: 'Push Day',
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutTemplateUsecase.*User.*not.*found/,
      );
    });

    it('should throw error when trying to create a workout template for another user', async () => {
      const request = {
        actorUserId: userTestProps.userId,
        targetUserId: 'another-user-id',
        name: 'Core Day',
      };

      await expect(usecase.execute(request)).rejects.toThrow(PermissionError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutTemplateUsecase.*cannot create.*template for.*another user/,
      );
    });
  });
});
