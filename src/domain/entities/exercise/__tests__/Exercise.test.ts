import { describe, expect, it } from 'vitest';
import { Exercise } from '../Exercise';
import * as exerciseTestProps from '../../../../../tests/createProps/exerciseTestProps';
import { ValidationError } from '@/domain/common/errors';

describe('Exercise', () => {
  it('should create a valid exercise', () => {
    const exercise = Exercise.create(exerciseTestProps.validExerciseProps);

    expect(exercise).toBeInstanceOf(Exercise);
    expect(exercise.id).toBe(exerciseTestProps.validExerciseProps.id);
    expect(exercise.name).toBe(exerciseTestProps.validExerciseProps.name);
  });

  it('should update name', async () => {
    const exercise = Exercise.create(exerciseTestProps.validExerciseProps);
    const newName = 'Updated Exercise Name';

    exercise.update({ name: newName });

    expect(exercise.name).toBe(newName);
  });

  it('should create an exercise if no createdAt or updatedAt is provided', async () => {
    // eslint-disable-next-line
    const { createdAt, updatedAt, ...propsWithoutDates } =
      exerciseTestProps.validExerciseProps;
    const exercise = Exercise.create(propsWithoutDates);

    expect(exercise).toBeInstanceOf(Exercise);
    expect(exercise.createdAt instanceof Date).toBe(true);
    expect(exercise.updatedAt instanceof Date).toBe(true);
  });

  it('should throw error if id is not instance of Id', async () => {
    expect(() => {
      Exercise.create({
        ...exerciseTestProps.validExerciseProps,
        // @ts-expect-error testing invalid type
        id: 123,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      Exercise.create({
        ...exerciseTestProps.validExerciseProps,
        // @ts-expect-error testing invalid type
        id: 123,
      });
    }).toThrowError(/Id/);
  });

  it('should throw error if name is empty', async () => {
    expect(() => {
      Exercise.create({
        ...exerciseTestProps.validExerciseProps,
        name: '',
      });
    }).toThrowError(ValidationError);

    expect(() => {
      Exercise.create({
        ...exerciseTestProps.validExerciseProps,
        name: '',
      });
    }).toThrowError(/Text.*empty/);
  });

  it('should throw error if name is greater that 100 characters', async () => {
    const longName = 'a'.repeat(101);

    expect(() => {
      Exercise.create({
        ...exerciseTestProps.validExerciseProps,
        name: longName,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      Exercise.create({
        ...exerciseTestProps.validExerciseProps,
        name: longName,
      });
    }).toThrowError(/Text.*not exceed/);
  });
});
