import { WorkoutLine, WorkoutLineCreateProps } from '../WorkoutLine';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as workoutTestProps from '../../../../../tests/createProps/workoutTestProps';

describe('WorkoutLine', () => {
  let workoutLine: WorkoutLine;
  let validWorkoutLineProps: WorkoutLineCreateProps;

  beforeEach(() => {
    validWorkoutLineProps = {
      ...workoutTestProps.validWorkoutLineProps,
    };
    workoutLine = WorkoutLine.create(validWorkoutLineProps);
  });

  it('should create a valid workoutLine', () => {
    expect(workoutLine).toBeInstanceOf(WorkoutLine);
  });

  it('should throw error if id is empty', async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        id: '',
      });
    }).toThrowError(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        id: '',
      });
    }).toThrowError(/Id.*empty/);
  });

  it('should throw error if exerciseId is empty', async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        exerciseId: '',
      });
    }).toThrowError(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        exerciseId: '',
      });
    }).toThrowError(/Id.*empty/);
  });

  it('should throw error if setNumber is not integer', async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: 2.5,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: 2.5,
      });
    }).toThrowError(/Integer.*integer/);
  });

  it('should throw error if setNumber is zero', async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: 0,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: 0,
      });
    }).toThrowError(/Integer.*zero/);
  });

  it('should throw error if setNumber is negative', async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: -1,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: -1,
      });
    }).toThrowError(/Integer.*be positive/);
  });

  it('should throw error if reps is negative', async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        reps: -5,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        reps: -5,
      });
    }).toThrowError(/Integer.*be positive/);
  });

  it('should throw error if reps has decimals', async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        reps: 8.2,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        reps: 8.2,
      });
    }).toThrowError(/Integer.*integer/);
  });

  it('should throw error if weight is negative', async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        weight: -20,
      });
    }).toThrowError(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        weight: -20,
      });
    }).toThrowError(/Float.*be positive/);
  });

  it('can update setNumber', async () => {
    const newSetNumber = 5;
    workoutLine.update({
      setNumber: newSetNumber,
    });

    expect(workoutLine.setNumber).toBe(newSetNumber);
  });

  it('can update reps', async () => {
    const newReps = 12;
    workoutLine.update({
      reps: newReps,
    });

    expect(workoutLine.reps).toBe(newReps);
  });

  it('can update weight', async () => {
    const newWeight = 75.5;
    workoutLine.update({
      weight: newWeight,
    });

    expect(workoutLine.weight).toBe(newWeight);
  });
});
