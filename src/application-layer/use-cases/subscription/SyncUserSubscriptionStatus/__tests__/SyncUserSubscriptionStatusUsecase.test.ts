import { NotFoundError } from '@/domain/common/errors';
import { SyncUserSubscriptionStatusUsecase } from '../SyncUserSubscriptionStatusUsecase';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { createTestUser } from '../../../../../../tests/createProps/userTestProps';

describe('SyncUserSubscriptionStatusUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let usecase: SyncUserSubscriptionStatusUsecase;

  const customerId = 'cus-stripe-123';

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    usecase = new SyncUserSubscriptionStatusUsecase(usersRepo);

    const user = createTestUser({ customerId });
    await usersRepo.saveUser(user);
  });

  describe('Execution', () => {
    it.each(['active', 'canceled', 'expired', 'free_trial', 'free'])(
      'should update subscriptionStatus to "%s"',
      async (status) => {
        await usecase.execute({ customerId, subscriptionStatus: status });

        const updatedUser = await usersRepo.getUserByCustomerId(customerId);
        expect(updatedUser!.subscriptionStatus).toBe(status);
      },
    );
  });

  describe('Errors', () => {
    it('should throw NotFoundError if no user has the given customerId', async () => {
      await expect(
        usecase.execute({
          customerId: 'non-existent-customer',
          subscriptionStatus: 'active',
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
