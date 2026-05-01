import { CreateSubscriptionForUserUsecase } from '@/application-layer/use-cases/subscription/CreateSubscriptionForUser/CreateSubscriptionForUserUsecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppPaymentsService } from '@/interface-adapters/app/services/AppPaymentsService';

export const AppCreateSubscriptionForUserUsecase =
  new CreateSubscriptionForUserUsecase(AppUsersRepo, AppPaymentsService);
