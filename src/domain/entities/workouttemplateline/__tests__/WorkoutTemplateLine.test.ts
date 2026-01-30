import {
  WorkoutTemplateLine,
  WorkoutTemplateLineCreateProps,
} from '../WorkoutTemplateLine';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
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
