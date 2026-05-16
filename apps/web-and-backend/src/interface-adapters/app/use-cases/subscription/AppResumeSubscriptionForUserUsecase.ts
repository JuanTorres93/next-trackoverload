import { ResumeSubscriptionForUserUsecase } from '../../../../application-layer/use-cases/subscription/ResumeSubscriptionForUser/ResumeSubscriptionForUserUsecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppPaymentsService } from '../../services/AppPaymentsService';

export const AppResumeSubscriptionForUserUsecase =
  new ResumeSubscriptionForUserUsecase(AppUsersRepo, AppPaymentsService);
