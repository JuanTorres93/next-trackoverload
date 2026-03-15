'use server';

import {
  AppCreateSubscriptionForUserUsecase,
  AppGetPlanInfoUsecase,
} from '@/interface-adapters/app/use-cases/subscription';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { redirect } from 'next/navigation';

export async function createSubscriptionForUser(planId: string) {
  const userId = await getCurrentUserId();

  const { redirectUrl } = await AppCreateSubscriptionForUserUsecase.execute({
    userId,
    planId,
  });

  redirect(redirectUrl);
}

export async function getPlanInfo() {
  return AppGetPlanInfoUsecase.execute();
}
