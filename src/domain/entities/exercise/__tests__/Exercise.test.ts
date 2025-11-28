import { describe, expect, it } from 'vitest';
import { Exercise } from '../Exercise';
import * as vp from '@/../tests/createProps';
import { ValidationError } from '@/domain/common/errors';

describe('Exercise', () => {
  it('should create a valid exercise', () => {
    const exercise = Exercise.create(vp.validExerciseProps);

    expect(exercise).toBeInstanceOf(Exercise);
    expect(exercise.id).toBe(vp.validExerciseProps.id);
    expect(exercise.name).toBe(vp.validExerciseProps.name);
  });

  it('should create an exercise if no createdAt or updatedAt is provided', async () => {
    // eslint-disable-next-line
    const { createdAt, updatedAt, ...propsWithoutDates } =
      vp.validExerciseProps;
    // @ts-expect-error .create actually expects createdAt and updatedAt
    const exercise = Exercise.create(propsWithoutDates);

    expect(exercise).toBeInstanceOf(Exercise);
    expect(exercise.createdAt instanceof Date).toBe(true);
    expect(exercise.updatedAt instanceof Date).toBe(true);
  });

  it('should throw error if id is not instance of Id', async () => {
    expect(() => {
      Exercise.create({
        ...vp.validExerciseProps,
        // @ts-expect-error testing invalid type
        id: 123,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      Exercise.create({
        ...vp.validExerciseProps,
        // @ts-expect-error testing invalid type
        id: 123,
      });
    }).toThrowError(/Id/);
  });
});
