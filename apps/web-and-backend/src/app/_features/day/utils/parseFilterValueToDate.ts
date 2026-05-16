import { parse, isValid, format } from 'date-fns';

export function parseFilterValueToDate(filterValue: string) {
  const parsed = parse(filterValue, 'yyyy_M_d', new Date());
  return isValid(parsed) ? parsed : new Date();
}
export function defaultFilterValue() {
  return formatDateToFilterValue(new Date());
}
export function formatDateToFilterValue(date: Date) {
  return format(date, 'yyyy_M_d');
}
