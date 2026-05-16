import { CancelSubscriptionForUserUsecase } from '../../../../application-layer/use-cases/subscription/CancelSubscriptionForUser/CancelSubscriptionForUserUsecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppPaymentsService } from '../../services/AppPaymentsService';

export const AppCancelSubscriptionForUserUsecase =
  new CancelSubscriptionForUserUsecase(AppUsersRepo, AppPaymentsService);
