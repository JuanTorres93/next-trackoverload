'use server';

import { AppGetUserByIdUsecase } from '@/interface-adapters/app/use-cases/user';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';

export async function getLoggedInUser() {
  const userId = await getCurrentUserId();

  return AppGetUserByIdUsecase.execute({
    actorUserId: userId,
    targetUserId: userId,
  });
}
