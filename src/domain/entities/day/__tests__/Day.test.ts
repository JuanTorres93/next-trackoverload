import { beforeEach, describe, expect, it } from 'vitest';

import { ValidationError } from '@/domain/common/errors';
import { Day } from '../Day';

import * as dayTestProps from '../../../../../tests/createProps/dayTestProps';

describe('Day', () => {
  let day: Day;

  beforeEach(() => {
    day = Day.create({
      ...dayTestProps.validDayProps(),
    });
  });

  describe('creation', () => {
    it('should create a valid day', () => {
      expect(day).toBeInstanceOf(Day);
    });

    it('should create Day if no dates are provided', async () => {
      // eslint-disable-next-line
      const { createdAt, updatedAt, ...propsWithoutDates } =
        dayTestProps.validDayProps();

      const dayWithoutDates = Day.create(propsWithoutDates);

      expect(dayWithoutDates).toBeInstanceOf(Day);

      const now = new Date();

      expect(dayWithoutDates.createdAt.getTime()).toBeLessThanOrEqual(
        now.getTime(),
      );
      expect(dayWithoutDates.updatedAt.getTime()).toBeLessThanOrEqual(
        now.getTime(),
      );
    });
  });

  describe('meal management', () => {
    const newMealId = 'new-meal-id';

    it('should add meal', async () => {
      const initialLength = day.mealIds.length;

      day.addMeal(newMealId);
      expect(day.mealIds).toHaveLength(initialLength + 1);
      expect(day.mealIds[day.mealIds.length - 1]).toEqual(newMealId);
    });

    it('should have an array of meal ids that belong to the day', async () => {
      expect(day).toHaveProperty('mealIds');
      expect(Array.isArray(day.mealIds)).toBe(true);

      day.addMeal(newMealId);
      expect(day.mealIds).toContain(newMealId);
    });

    it('should not add already added meal', async () => {
      day.addMeal(newMealId); // First addition
      const initialLength = day.mealIds.length;

      expect(() => day.addMeal(newMealId)).toThrow(ValidationError);
      expect(() => day.addMeal(newMealId)).toThrow(
        /Day.*Meal.*id.*already.*exists/,
      );
      expect(day.mealIds).toHaveLength(initialLength);
    });

    it('should remove meal', async () => {
      day.addMeal(newMealId); // First addition to ensure it exists

      const initialLength = day.mealIds.length;
      day.removeMealById(newMealId);

      expect(day.mealIds).toHaveLength(initialLength - 1);
      expect(day.mealIds).not.toContain(newMealId);
    });

    it('should throw error if removing meal that is not contained in day', async () => {
      expect(() => day.removeMealById('non-existent')).toThrow(ValidationError);
      expect(() => day.removeMealById('non-existent')).toThrow(
        /Day.*No.*meal.*found.*id/,
      );
    });
  });

  describe('fake meal management', () => {
    const fakeMealId = 'fake-meal-id';

    it('should have an array of fakeMeal ids that belong to the day', async () => {
      expect(day).toHaveProperty('fakeMealIds');
      expect(Array.isArray(day.fakeMealIds)).toBe(true);

      day.addFakeMeal(fakeMealId);
      expect(day.fakeMealIds).toContain(fakeMealId);
    });

    it('should add fake meal', async () => {
      const initialLength = day.fakeMealIds.length;

      const newFakeMealId = 'new-fake-meal-id';

      day.addFakeMeal(newFakeMealId);
      expect(day.fakeMealIds).toHaveLength(initialLength + 1);
      expect(day.fakeMealIds[day.fakeMealIds.length - 1]).toEqual(
        newFakeMealId,
      );
    });

    it('should not add already added fake meal', async () => {
      day.addFakeMeal(fakeMealId); // First addition
      const initialLength = day.fakeMealIds.length;

      expect(() => day.addFakeMeal(fakeMealId)).toThrow(ValidationError);
      expect(() => day.addFakeMeal(fakeMealId)).toThrow(
        /Day.*FakeMeal.*id.*already.*exists/,
      );
      expect(day.fakeMealIds).toHaveLength(initialLength);
    });

    it('should remove fake meal', async () => {
      day.addFakeMeal(fakeMealId); // First addition to ensure it exists
      const initialLength = day.fakeMealIds.length;

      day.removeFakeMealById(fakeMealId);

      expect(day.fakeMealIds).toHaveLength(initialLength - 1);
      expect(day.fakeMealIds).not.toContain(fakeMealId);
    });

    it('should throw error if removing fake meal that is not contained in day', async () => {
      expect(() => day.removeFakeMealById('non-existent')).toThrow(
        ValidationError,
      );
      expect(() => day.removeFakeMealById('non-existent')).toThrow(
        /Day.*No.*fake meal.*found.*id/,
      );
    });
  });
});
