'use server';
import { AssembledDayDTO } from '@/application-layer/dtos/DayDTO';
import { AppGetAssembledDayById } from '@/interface-adapters/app/use-cases/day';

type AssembledDayResult = {
  dayId: string;
  assembledDay: AssembledDayDTO | null;
};

export async function getAssembledDayById(
  dayId: string,
): Promise<AssembledDayResult> {
  // TODO handle errors
  const assembledDay = await AppGetAssembledDayById.execute({
    dayId,
    userId: 'dev-user', // TODO: Replace with auth userId
  });

  return {
    dayId,
    assembledDay,
  };
}

export async function getAssembledDaysByIds(
  dayIds: string[],
): Promise<AssembledDayResult[]> {
  // TODO IMPORTANT: Create a new usecase to fetch a list of assembled days for better performance
  const assembledDaysPromises = dayIds.map(getAssembledDayById);

  return Promise.all(assembledDaysPromises);
}
