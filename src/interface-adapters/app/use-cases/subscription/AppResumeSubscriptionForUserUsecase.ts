import { ResumeSubscriptionForUserUsecase } from '@/application-layer/use-cases/subscription/ResumeSubscriptionForUser/ResumeSubscriptionForUserUsecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppPaymentsService } from '@/interface-adapters/app/services/AppPaymentsService';

export const AppResumeSubscriptionForUserUsecase =
  new ResumeSubscriptionForUserUsecase(AppUsersRepo, AppPaymentsService);
