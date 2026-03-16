import { ConflictError, NotFoundError } from '@/domain/common/errors';
import { CancelSubscriptionForUserUsecase } from '../CancelSubscriptionForUserUsecase';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryPaymentsService } from '@/infra/services/PaymentsService/MemoryPaymentsService/MemoryPaymentsService';
import {
  createTestUser,
  validUserProps,
} from '../../../../../../tests/createProps/userTestProps';

describe('CancelSubscriptionForUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let paymentsService: MemoryPaymentsService;
  let usecase: CancelSubscriptionForUserUsecase;
  let user: User;

  const customerId = 'cus-stripe-123';

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    paymentsService = new MemoryPaymentsService();

    usecase = new CancelSubscriptionForUserUsecase(usersRepo, paymentsService);

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

    it('should call cancelSubscription with the user customerId', async () => {
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
        /CancelSubscriptionForUserUsecase: User with id non-existent-id not found/i,
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
      ).rejects.toThrow(ConflictError);
      await expect(
        usecase.execute({ userId: userWithoutCustomer.id }),
      ).rejects.toThrow(
        /CancelSubscriptionForUserUsecase: User with id user-no-customer has no customerId/i,
      );
    });
  });
});
