import {
  WorkoutTemplateLine,
  WorkoutTemplateLineCreateProps,
} from '../WorkoutTemplateLine';
import { ValidationError } from '@/domain/common/errors';
import * as workoutTemplateTestProps from '../../../../../tests/createProps/workoutTemplateTestProps';

describe('WorkoutTemplateLine', () => {
  let workoutTemplateLine: WorkoutTemplateLine;
  let validWorkoutTemplateLineProps: WorkoutTemplateLineCreateProps;

  beforeEach(() => {
    validWorkoutTemplateLineProps = {
      ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
    };
    workoutTemplateLine = WorkoutTemplateLine.create(
      validWorkoutTemplateLineProps,
    );
  });

  it('should create a valid workoutTemplateLine', () => {
    expect(workoutTemplateLine).toBeInstanceOf(WorkoutTemplateLine);
  });

  it('should create a workoutTemplateLine if no createdAt or updatedAt is provided', async () => {
    // eslint-disable-next-line
    const { createdAt, updatedAt, ...propsWithoutDates } =
      validWorkoutTemplateLineProps;

    const workoutTemplateLineWithoutDates =
      WorkoutTemplateLine.create(propsWithoutDates);

    expect(workoutTemplateLineWithoutDates).toBeInstanceOf(WorkoutTemplateLine);

    const now = new Date();

    expect(
      workoutTemplateLineWithoutDates.createdAt.getTime(),
    ).toBeLessThanOrEqual(now.getTime());
    expect(
      workoutTemplateLineWithoutDates.updatedAt.getTime(),
    ).toBeLessThanOrEqual(now.getTime());
  });

  it('should throw error if sets is zero', async () => {
    expect(() =>
      WorkoutTemplateLine.create({
        ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
        sets: 0,
      }),
    ).toThrow(ValidationError);

    expect(() =>
      WorkoutTemplateLine.create({
        ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
        sets: 0,
      }),
    ).toThrow(/Integer.*cannot be zero/);
  });

  it('should throw error if sets is negative', async () => {
    expect(() =>
      WorkoutTemplateLine.create({
        ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
        sets: -3,
      }),
    ).toThrow(ValidationError);

    expect(() =>
      WorkoutTemplateLine.create({
        ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
        sets: -3,
      }),
    ).toThrow(/Integer.*be positive/);
  });

  it('can update sets', async () => {
    const newSets = 99;

    workoutTemplateLine.update({ sets: newSets });
    expect(workoutTemplateLine.sets).toBe(newSets);
  });

  it('can update exerciseId', async () => {
    const newExerciseId = 'new-exercise-id';

    workoutTemplateLine.update({ exerciseId: newExerciseId });
    expect(workoutTemplateLine.exerciseId).toBe(newExerciseId);
  });
});
