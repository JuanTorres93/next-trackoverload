import { SyncUserSubscriptionStatusUsecase } from '@/application-layer/use-cases/subscription/SyncUserSubscriptionStatus/SyncUserSubscriptionStatusUsecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const AppSyncUserSubscriptionStatusUsecase =
  new SyncUserSubscriptionStatusUsecase(AppUsersRepo);
