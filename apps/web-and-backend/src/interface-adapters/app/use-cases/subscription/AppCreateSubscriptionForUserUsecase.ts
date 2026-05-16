import { CreateSubscriptionForUserUsecase } from '../../../../application-layer/use-cases/subscription/CreateSubscriptionForUser/CreateSubscriptionForUserUsecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppPaymentsService } from '../../services/AppPaymentsService';

export const AppCreateSubscriptionForUserUsecase =
  new CreateSubscriptionForUserUsecase(AppUsersRepo, AppPaymentsService);
