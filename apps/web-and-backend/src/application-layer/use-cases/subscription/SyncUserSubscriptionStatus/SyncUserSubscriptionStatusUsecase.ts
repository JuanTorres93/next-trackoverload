import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { SubscriptionStatus } from "../../../../domain/value-objects/SubscriptionStatus/SubscriptionStatus";

export type SyncUserSubscriptionStatusUsecaseRequest = {
  customerId: string;
  subscriptionStatus: string;
  subscriptionEndsAt?: Date;
};

export class SyncUserSubscriptionStatusUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(
    request: SyncUserSubscriptionStatusUsecaseRequest,
  ): Promise<void> {
    const user = await this.usersRepo.getUserByCustomerId(request.customerId);

    if (!user) {
      logNoTest(
        `SyncUserSubscriptionStatusUsecase: User with customerId ${request.customerId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    const validatedNewStatus = SubscriptionStatus.create(
      request.subscriptionStatus,
    );

    user.update({
      subscriptionStatus: validatedNewStatus.value,
      subscriptionEndsAt: request.subscriptionEndsAt,
    });

    await this.usersRepo.saveUser(user);
  }
}
