import { ConflictError, NotFoundError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { PaymentsService } from '@/domain/services/PaymentsService.port';

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
      throw new NotFoundError(
        `CancelSubscriptionForUserUsecase: User with id ${request.userId} not found`,
      );
    }

    if (!user.customerId) {
      throw new ConflictError(
        `CancelSubscriptionForUserUsecase: User with id ${request.userId} has no customerId`,
      );
    }

    const { redirectUrl } = await this.paymentsService.cancelSubscription(
      user.customerId,
    );

    return { redirectUrl };
  }
}
