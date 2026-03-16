import { CancelSubscriptionForUserUsecase } from '@/application-layer/use-cases/subscription/CancelSubscriptionForUser/CancelSubscriptionForUserUsecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppPaymentsService } from '@/interface-adapters/app/services/AppPaymentsService';

export const AppCancelSubscriptionForUserUsecase =
  new CancelSubscriptionForUserUsecase(AppUsersRepo, AppPaymentsService);
