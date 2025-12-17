import { beforeEach, describe, expect, it } from 'vitest';
import { CreateWorkoutTemplateUsecase } from '../CreateWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import * as dto from '@/../tests/dtoProperties';
import * as vp from '@/../tests/createProps';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';

describe('CreateWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: CreateWorkoutTemplateUsecase;
  let user: User;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new CreateWorkoutTemplateUsecase(workoutTemplatesRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });
    await usersRepo.saveUser(user);
  });

  describe('Execution', () => {
    it('should create a new workout template with the given name', async () => {
      const request = {
        userId: vp.userId,
        name: 'Push Day',
      };

      const result = await usecase.execute(request);

      expect(result.userId).toBe(vp.userId);
      expect(result.name).toBe('Push Day');
      expect(result.exercises).toEqual([]);
      expect(result.id).toBeDefined();
    });

    it('should return a WorkoutTemplateDTO', async () => {
      const request = {
        userId: vp.userId,
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
        userId: vp.userId,
        name: 'Pull Day',
      };

      const result = await usecase.execute(request);

      const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
        result.id
      );
      expect(savedTemplate).not.toBeNull();
      expect(savedTemplate!.userId).toBe(vp.userId);
      expect(savedTemplate!.name).toBe('Pull Day');
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        userId: 'non-existent',
        name: 'Push Day',
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutTemplateUsecase.*User.*not.*found/
      );
    });
  });
});
