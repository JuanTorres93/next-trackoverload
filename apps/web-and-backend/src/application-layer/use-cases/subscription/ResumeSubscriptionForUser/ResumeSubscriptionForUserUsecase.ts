import { logNoTest } from "@/utils/logNoTest";

import { ConflictError, NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { PaymentsService } from "../../../../domain/services/PaymentsService.port";

export type ResumeSubscriptionForUserUsecaseRequest = {
  userId: string;
};

export type ResumeSubscriptionForUserUsecaseResponse = {
  redirectUrl: string;
};

export class ResumeSubscriptionForUserUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private paymentsService: PaymentsService,
  ) {}

  async execute(
    request: ResumeSubscriptionForUserUsecaseRequest,
  ): Promise<ResumeSubscriptionForUserUsecaseResponse> {
    const user = await this.usersRepo.getUserById(request.userId);

    if (!user) {
      logNoTest(
        `ResumeSubscriptionForUserUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!user.customerId) {
      logNoTest(
        `ResumeSubscriptionForUserUsecase: User with id ${request.userId} has no customerId`,
      );

      throw new ConflictError("No tienes ninguna suscripción para reanudar.");
    }

    const { redirectUrl } = await this.paymentsService.resumeSubscription(
      user.customerId,
    );

    return { redirectUrl };
  }
}
