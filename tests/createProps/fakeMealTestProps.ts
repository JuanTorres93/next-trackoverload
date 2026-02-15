import { FakeMealCreateProps } from '@/domain/entities/fakemeal/FakeMeal';
import { userId } from './userTestProps';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';

export const validFakeMealProps = {
  id: 'fakeMeal1',
  userId: userId,
  name: 'Fake Chicken Breast',
  protein: 30,
  calories: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestFakeMeal(props?: Partial<FakeMealCreateProps>) {
  return FakeMeal.create({
    id: props?.id || validFakeMealProps.id,
    userId: props?.userId || validFakeMealProps.userId,
    name: props?.name || validFakeMealProps.name,
    protein: props?.protein || validFakeMealProps.protein,
    calories: props?.calories || validFakeMealProps.calories,
    createdAt: props?.createdAt || validFakeMealProps.createdAt,
    updatedAt: props?.updatedAt || validFakeMealProps.updatedAt,
  });
}
