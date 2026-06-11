import { dateToDayId } from "@/domain/value-objects/DayId/DayId";

export function getTodayDayId(): string {
  const today = new Date();
  const todayId = dateToDayId(today).value;

  return todayId;
}
