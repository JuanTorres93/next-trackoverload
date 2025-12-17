import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllWorkoutTemplatesForUserUsecase } from '../GetAllWorkoutTemplatesForUser.usecase';

describe('GetAllWorkoutTemplatesForUserUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: GetAllWorkoutTemplatesForUserUsecase;
  let user: User;
  let template1: WorkoutTemplate;
  let template2: WorkoutTemplate;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new GetAllWorkoutTemplatesForUserUsecase(
      workoutTemplatesRepo,
      usersRepo
    );

    user = User.create({ ...vp.validUserProps });

    template1 = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      id: 'user1-template1-id',
      exercises: [],
    });

    template2 = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      id: 'user1-template2-id',
      exercises: [],
    });

    await usersRepo.saveUser(user);
    await workoutTemplatesRepo.saveWorkoutTemplate(template1);
    await workoutTemplatesRepo.saveWorkoutTemplate(template2);
  });

  describe('Execution', () => {
    it('should return all workout templates for a specific user', async () => {
      const user2Template = WorkoutTemplate.create({
        ...vp.validWorkoutTemplateProps(),
        id: 'user2-template-id',
        userId: 'user2-id',
        name: 'Leg Day',
        exercises: [],
      });

      await workoutTemplatesRepo.saveWorkoutTemplate(user2Template);

      const result = await usecase.execute({ userId: vp.userId });

      expect(result).toHaveLength(2);
      expect(result.map((t) => t.id)).toEqual([
        'user1-template1-id',
        'user1-template2-id',
      ]);
      expect(result.every((t) => t.userId === vp.userId)).toBe(true);
    });

    it('should return array of WorkoutTemplateDTO', async () => {
      const result = await usecase.execute({ userId: vp.userId });

      expect(result).toHaveLength(2);

      expect(result[0]).not.toBeInstanceOf(WorkoutTemplate);
      for (const prop of dto.workoutTemplateDTOProperties) {
        expect(result[0]).toHaveProperty(prop);
      }
    });

    it('should return empty array if user has no templates', async () => {
      const anotherUser = User.create({
        ...vp.validUserProps,
        id: 'another-user-id',
        email: 'another-user@example.com',
      });
      await usersRepo.saveUser(anotherUser);

      const result = await usecase.execute({ userId: anotherUser.id });

      expect(result).toEqual([]);
    });

    it('should not return deleted templates', async () => {
      template1.markAsDeleted();
      await workoutTemplatesRepo.saveWorkoutTemplate(template1);

      const result = await usecase.execute({ userId: vp.userId });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(template2.id);
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      await expect(
        usecase.execute({
          userId: 'non-existent',
        })
      ).rejects.toThrow(NotFoundError);

      await expect(
        usecase.execute({
          userId: 'non-existent',
        })
      ).rejects.toThrow(
        /GetAllWorkoutTemplatesForUserUsecase.*User.*not.*found/
      );
    });
  });
});
