// TODO IMPORTANT: Ensure this module is not used and delete it
import { JSENDResponse } from '@/app/_types/JSEND';
import { AppAddMealToDayUsecase } from '@/interface-adapters/app/use-cases/day';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<JSENDResponse<{ message: string }>>> {
  try {
    const body = await request.json();
    const { dayId, userId, recipeId } = body;

    await AppAddMealToDayUsecase.execute({
      dayId,
      userId,
      recipeId,
    });

    return NextResponse.json(
      {
        status: 'success',
        data: {
          message: 'Meal added to day successfully',
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log('app/api/day/addMeal: Error adding meal to day:', error);

    return NextResponse.json(
      { status: 'fail', data: { message: 'Failed to add meal to day' } },
      { status: 500 },
    );
  }
}
