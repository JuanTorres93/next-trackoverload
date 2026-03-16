import { vi } from 'vitest';
import { ConflictError, NotFoundError } from '@/domain/common/errors';
import { ResumeSubscriptionForUserUsecase } from '../ResumeSubscriptionForUserUsecase';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryPaymentsService } from '@/infra/services/PaymentsService/MemoryPaymentsService/MemoryPaymentsService';
import {
  createTestUser,
  validUserProps,
} from '../../../../../../tests/createProps/userTestProps';

describe('ResumeSubscriptionForUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let paymentsService: MemoryPaymentsService;
  let usecase: ResumeSubscriptionForUserUsecase;
  let user: User;

  const customerId = 'cus-stripe-123';

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    paymentsService = new MemoryPaymentsService();

    usecase = new ResumeSubscriptionForUserUsecase(usersRepo, paymentsService);

    user = createTestUser({ customerId });

    await usersRepo.saveUser(user);
  });

  describe('Execution', () => {
    it('should return a redirectUrl', async () => {
      const result = await usecase.execute({ userId: user.id });

      expect(result).toHaveProperty('redirectUrl');
      expect(typeof result.redirectUrl).toBe('string');
      expect(result.redirectUrl.length).toBeGreaterThan(0);
    });

    it('should call resumeSubscription with the user customerId', async () => {
      const spy = vi.spyOn(paymentsService, 'resumeSubscription');

      await usecase.execute({ userId: user.id });

      expect(spy).toHaveBeenCalledWith(customerId);
    });

    it('should return the redirectUrl containing the customerId', async () => {
      const result = await usecase.execute({ userId: user.id });

      expect(result.redirectUrl).toContain(customerId);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if user does not exist', async () => {
      await expect(
        usecase.execute({ userId: 'non-existent-id' }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        usecase.execute({ userId: 'non-existent-id' }),
      ).rejects.toThrow(
        /ResumeSubscriptionForUserUsecase: User with id non-existent-id not found/i,
      );
    });

    it('should throw ConflictError if user has no customerId', async () => {
      const userWithoutCustomer = User.create({
        ...validUserProps,
        id: 'user-no-customer',
        customerId: undefined,
      });
      await usersRepo.saveUser(userWithoutCustomer);

      await expect(
        usecase.execute({ userId: userWithoutCustomer.id }),
      ).rejects.toThrow(ConflictError);

      await expect(
        usecase.execute({ userId: userWithoutCustomer.id }),
      ).rejects.toThrow(
        /ResumeSubscriptionForUserUsecase: User with id user-no-customer has no customerId/i,
      );
    });
  });
});
