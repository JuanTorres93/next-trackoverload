import { NotFoundError } from '@/domain/common/errors';
import { CreateSubscriptionForUserUsecase } from '../CreateSubscriptionForUserUsecase';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryPaymentsService } from '@/infra/services/PaymentsService/MemoryPaymentsService/MemoryPaymentsService';
import { createTestUser } from '../../../../../../tests/createProps/userTestProps';

describe('CreateSubscriptionForUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let paymentsService: MemoryPaymentsService;
  let usecase: CreateSubscriptionForUserUsecase;
  let user: User;

  const planId = 'plan-pro-monthly';

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    paymentsService = new MemoryPaymentsService();

    usecase = new CreateSubscriptionForUserUsecase(usersRepo, paymentsService);

    user = createTestUser();

    await usersRepo.saveUser(user);
  });

  describe('Execution', () => {
    it('should return a redirectUrl', async () => {
      const result = await usecase.execute({
        userId: user.id,
        planId,
      });

      expect(result).toHaveProperty('redirectUrl');
      expect(typeof result.redirectUrl).toBe('string');
      expect(result.redirectUrl.length).toBeGreaterThan(0);
    });

    it('should save the customerId returned by paymentsService onto the user', async () => {
      await usecase.execute({ userId: user.id, planId });

      const savedUser = await usersRepo.getUserById(user.id);

      expect(savedUser!.customerId).toBe(`mem-customer-${planId}`);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if user does not exist', async () => {
      await expect(
        usecase.execute({ userId: 'non-existent-id', planId }),
      ).rejects.toThrow(NotFoundError);
      await expect(
        usecase.execute({ userId: 'non-existent-id', planId }),
      ).rejects.toThrow(
        /CreateSubscriptionForUserUsecase: User with id non-existent-id not found/i,
      );
    });
  });
});
