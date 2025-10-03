import { describe, expect, it } from 'vitest';
import { Exercise } from '../Exercise';

const validExerciseProps = {
  id: '1',
  name: 'Push Up',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Exercise', () => {
  it('should create a valid exercise', () => {
    const exercise = Exercise.create(validExerciseProps);

    expect(exercise).toBeInstanceOf(Exercise);
    expect(exercise.id).toBe(validExerciseProps.id);
    expect(exercise.name).toBe(validExerciseProps.name);
  });

  it('should create an exercise if no createdAt or updatedAt is provided', async () => {
    // eslint-disable-next-line
    const { createdAt, updatedAt, ...propsWithoutDates } = validExerciseProps;
    // @ts-expect-error .create actually expects createdAt and updatedAt
    const exercise = Exercise.create(propsWithoutDates);

    expect(exercise).toBeInstanceOf(Exercise);
    expect(exercise.createdAt instanceof Date).toBe(true);
    expect(exercise.updatedAt instanceof Date).toBe(true);
  });

  it('should not create an exercise with invalid props', async () => {
    const invalidProps = [
      { id: '' },
      { id: 3 },
      { name: '' },
      { name: 3 },
      { createdAt: 'invalid date' },
      { updatedAt: 'invalid date' },
    ];

    for (const invalidProp of invalidProps) {
      const props = { ...validExerciseProps, ...invalidProp };
      // @ts-expect-error the error comes precisely because it should not be created
      expect(() => Exercise.create(props)).toThrowError();
    }
  });
});
