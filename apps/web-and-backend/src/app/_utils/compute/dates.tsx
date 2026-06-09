import { addDays, differenceInDays as differenceInDaysDateFns } from "date-fns";

export function differenceInDays(dateA: Date, dateB: Date) {
  return differenceInDaysDateFns(dateA, dateB);
}

export function addDaysToDate(date: Date, days: number) {
  return addDays(date, days);
}
