import { userId } from './userTestProps';

export const dateId = new Date('2023-10-01');

export function validDayProps() {
  return {
    day: 1,
    month: 10,
    year: 2023,
    userId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
