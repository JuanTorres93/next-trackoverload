import { logNoTest } from "@/utils/logNoTest";

import { ConflictError, NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { PaymentsService } from "../../../../domain/services/PaymentsService.port";

export type CancelSubscriptionForUserUsecaseRequest = {
  userId: string;
};

export type CancelSubscriptionForUserUsecaseResponse = {
  redirectUrl: string;
};

export class CancelSubscriptionForUserUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private paymentsService: PaymentsService,
  ) {}

  async execute(
    request: CancelSubscriptionForUserUsecaseRequest,
  ): Promise<CancelSubscriptionForUserUsecaseResponse> {
    const user = await this.usersRepo.getUserById(request.userId);

    if (!user) {
      logNoTest(
        `CancelSubscriptionForUserUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!user.customerId) {
      logNoTest(
        `CancelSubscriptionForUserUsecase: User with id ${request.userId} has no customerId`,
      );

      throw new ConflictError("No tienes ninguna suscripción para cancelar.");
    }

    const { redirectUrl } = await this.paymentsService.cancelSubscription(
      user.customerId,
    );

    return { redirectUrl };
  }
}
