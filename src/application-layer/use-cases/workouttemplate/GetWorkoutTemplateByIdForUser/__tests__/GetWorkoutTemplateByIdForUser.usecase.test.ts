import * as vp from '@/../tests/createProps';
import * as workoutTemplateTestProps from '../../../../../../tests/createProps/workoutTemplateTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetWorkoutTemplateByIdForUserUsecase } from '../GetWorkoutTemplateByIdForUser.usecase';

describe('GetWorkoutTemplateByIdForUserUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: GetWorkoutTemplateByIdForUserUsecase;
  let user: User;
  let template: WorkoutTemplate;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new GetWorkoutTemplateByIdForUserUsecase(
      workoutTemplatesRepo,
      usersRepo,
    );

    user = User.create({ ...userTestProps.validUserProps });

    template = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
      name: 'Push Day',
    });

    await usersRepo.saveUser(user);
    await workoutTemplatesRepo.saveWorkoutTemplate(template);
  });

  describe('Execution', () => {
    it('should return workout template by id for the correct user', async () => {
      const result = await usecase.execute({
        id: template.id,
        userId: userTestProps.userId,
      });

      expect(result).not.toBeNull();
      expect(result!.id).toBe(template.id);
      expect(result!.userId).toBe(userTestProps.userId);
      expect(result!.name).toBe('Push Day');
    });

    it('should return WorkoutTemplateDTO', async () => {
      const result = await usecase.execute({
        id: template.id,
        userId: userTestProps.userId,
      });

      expect(result).not.toBeInstanceOf(WorkoutTemplate);
      for (const prop of dto.workoutTemplateDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should return null if template belongs to different user', async () => {
      const user2 = User.create({
        ...userTestProps.validUserProps,
        id: 'user2',
      });
      await usersRepo.saveUser(user2);

      const result = await usecase.execute({
        id: workoutTemplateTestProps.validWorkoutTemplateProps().id,
        userId: 'user2',
      });
      expect(result).toBeNull();
    });

    it('should return null if template does not exist', async () => {
      const result = await usecase.execute({
        id: '999',
        userId: userTestProps.userId,
      });

      expect(result).toBeNull();
    });

    it('should return null if template is deleted', async () => {
      template.markAsDeleted();
      await workoutTemplatesRepo.saveWorkoutTemplate(template);

      const result = await usecase.execute({
        id: 'to-be-deleted-id',
        userId: userTestProps.userId,
      });

      expect(result).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      await expect(
        usecase.execute({
          id: workoutTemplateTestProps.validWorkoutTemplateProps().id,
          userId: 'non-existent',
        }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        usecase.execute({
          id: workoutTemplateTestProps.validWorkoutTemplateProps().id,
          userId: 'non-existent',
        }),
      ).rejects.toThrow(
        /GetWorkoutTemplateByIdForUserUsecase.*User.*not.*found/,
      );
    });
  });
});
