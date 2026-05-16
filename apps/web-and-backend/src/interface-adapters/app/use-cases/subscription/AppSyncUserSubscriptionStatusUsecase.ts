import { SyncUserSubscriptionStatusUsecase } from '../../../../application-layer/use-cases/subscription/SyncUserSubscriptionStatus/SyncUserSubscriptionStatusUsecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';

export const AppSyncUserSubscriptionStatusUsecase =
  new SyncUserSubscriptionStatusUsecase(AppUsersRepo);
