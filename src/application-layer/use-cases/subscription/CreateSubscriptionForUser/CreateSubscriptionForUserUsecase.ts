import { NotFoundError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { PaymentsService } from '@/domain/services/PaymentsService.port';

export type CreateSubscriptionForUserUsecaseRequest = {
  userId: string;
  planId: string;
};

export type CreateSubscriptionForUserUsecaseResponse = {
  redirectUrl: string;
};

export class CreateSubscriptionForUserUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private paymentsService: PaymentsService,
  ) {}

  async execute(
    request: CreateSubscriptionForUserUsecaseRequest,
  ): Promise<CreateSubscriptionForUserUsecaseResponse> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `CreateSubscriptionForUserUsecase: User with id ${request.userId} not found`,
      );
    }

    const { redirectUrl, customerId } =
      await this.paymentsService.createSubscription(
        user.email,
        user.name,
        request.planId,
      );

    user.update({ customerId });
    await this.usersRepo.saveUser(user);

    return { redirectUrl };
  }
}
