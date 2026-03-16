import { AppResumeSubscriptionForUserUsecase } from '@/interface-adapters/app/use-cases/subscription';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { NextResponse } from 'next/server';
import { JSENDResponse } from '@/app/_types/JSEND';

export async function POST(): Promise<
  NextResponse<JSENDResponse<{ redirectUrl: string }>>
> {
  try {
    const userId = await getCurrentUserId();

    const { redirectUrl } = await AppResumeSubscriptionForUserUsecase.execute({
      userId,
    });

    return NextResponse.json(
      { status: 'success', data: { redirectUrl } },
      { status: 200 },
    );
  } catch (error) {
    console.log('api/subscription/resume: Error resuming subscription:', error);

    return NextResponse.json(
      { status: 'fail', data: { message: 'Failed to resume subscription' } },
      { status: 500 },
    );
  }
}
