import { JSENDResponse } from "@/app/_types/JSEND";
import { DayDTO } from "@/application-layer/dtos/DayDTO";

import { AssembledDayDTO } from "../../../application-layer/dtos/AssembledDayDTO";
import { DayEntry } from "../../../application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase";
import {
  AppGetAssembledDayById,
  AppGetLastDayWithCaloriesGoalForUserUsecase,
  AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays,
  AppGetMultipleAssembledDaysByIds,
} from "../../../interface-adapters/app/use-cases/day";
import { getCurrentUserId } from "../../_utils/auth/getCurrentUserId";
import { handleActionErrors } from "../common/handleActionErrors";

export type AssembledDayResult = {
  dayId: string;
  assembledDay: AssembledDayDTO | null;
};

export async function getAssembledDayById(
  dayId: string,
): Promise<JSENDResponse<AssembledDayResult>> {
  try {
    const assembledDay = await AppGetAssembledDayById.execute({
      dayId,
      userId: await getCurrentUserId(),
    });

    return {
      status: "success",
      data: {
        dayId,
        assembledDay,
      },
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function getAssembledDaysByIds(
  dayIds: string[],
): Promise<JSENDResponse<AssembledDayResult[]>> {
  try {
    const assembledDays = await AppGetMultipleAssembledDaysByIds.execute({
      dayIds,
      userId: await getCurrentUserId(),
    });

    const assembledDaysMap = new Map<string, AssembledDayDTO>();
    assembledDays.forEach((day) => assembledDaysMap.set(day.id, day));

    const assembledDaysResults: AssembledDayResult[] = dayIds.map((dayId) => ({
      dayId,
      assembledDay: assembledDaysMap.get(dayId) || null,
    }));

    return {
      status: "success",
      data: assembledDaysResults,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function getLastNumberOfDaysIncludingToday(
  numberOfDays: number,
): Promise<JSENDResponse<DayEntry[]>> {
  try {
    const dayEntries =
      await AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays.execute(
        {
          numberOfDays,
          userId: await getCurrentUserId(),
        },
      );

    return {
      status: "success",
      data: dayEntries,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function getLastDayWithCaloriesGoalForUser(): Promise<
  JSENDResponse<DayDTO | null>
> {
  try {
    const lastDay = await AppGetLastDayWithCaloriesGoalForUserUsecase.execute({
      userId: await getCurrentUserId(),
    });

    return {
      status: "success",
      data: lastDay,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}
