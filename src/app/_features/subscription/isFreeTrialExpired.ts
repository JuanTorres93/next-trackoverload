import { FREE_TRIAL_DAYS } from '@/domain/common/constants';

export function isFreeTrialExpired(createdAt: string): boolean {
  const trialEnd = new Date(createdAt);

  trialEnd.setDate(trialEnd.getDate() + FREE_TRIAL_DAYS);

  return trialEnd <= new Date();
}
