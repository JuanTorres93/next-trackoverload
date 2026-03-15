import { NotFoundError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { SubscriptionStatus } from '@/domain/value-objects/SubscriptionStatus/SubscriptionStatus';

export type SyncUserSubscriptionStatusUsecaseRequest = {
  customerId: string;
  subscriptionStatus: string;
};

export class SyncUserSubscriptionStatusUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(
    request: SyncUserSubscriptionStatusUsecaseRequest,
  ): Promise<void> {
    const user = await this.usersRepo.getUserByCustomerId(request.customerId);

    if (!user) {
      throw new NotFoundError(
        `SyncUserSubscriptionStatusUsecase: User with customerId ${request.customerId} not found`,
      );
    }

    const validatedNewStatus = SubscriptionStatus.create(
      request.subscriptionStatus,
    );

    user.update({ subscriptionStatus: validatedNewStatus.value });

    await this.usersRepo.saveUser(user);
  }
}
