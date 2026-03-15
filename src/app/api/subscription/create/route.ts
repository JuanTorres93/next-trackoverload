import { AppCreateSubscriptionForUserUsecase } from '@/interface-adapters/app/use-cases/subscription';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { NextResponse } from 'next/server';
import { JSENDResponse } from '@/app/_types/JSEND';

export async function POST(): Promise<
  NextResponse<JSENDResponse<{ redirectUrl: string }>>
> {
  try {
    const planId = process.env.STRIPE_PRICE_ID;

    if (!planId) {
      return NextResponse.json(
        {
          status: 'fail',
          data: { message: 'STRIPE_PRICE_ID is not configured' },
        },
        { status: 500 },
      );
    }

    const userId = await getCurrentUserId();

    const { redirectUrl } = await AppCreateSubscriptionForUserUsecase.execute({
      userId,
      planId,
    });

    return NextResponse.json(
      { status: 'success', data: { redirectUrl } },
      { status: 200 },
    );
  } catch (error) {
    console.log('api/subscription/create: Error creating subscription:', error);

    return NextResponse.json(
      { status: 'fail', data: { message: 'Failed to create subscription' } },
      { status: 500 },
    );
  }
}
