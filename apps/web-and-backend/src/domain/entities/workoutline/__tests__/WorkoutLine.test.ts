import * as workoutTestProps from "../../../../../tests/createProps/workoutTestProps";
import { ValidationError } from "../../../common/errors";
import { WorkoutLine, WorkoutLineCreateProps } from "../WorkoutLine";

describe("WorkoutLine", () => {
  let workoutLine: WorkoutLine;
  let validWorkoutLineProps: WorkoutLineCreateProps;

  beforeEach(() => {
    validWorkoutLineProps = {
      ...workoutTestProps.validWorkoutLineProps,
    };
    workoutLine = WorkoutLine.create(validWorkoutLineProps);
  });

  it("should create a valid workoutLine", () => {
    expect(workoutLine).toBeInstanceOf(WorkoutLine);
  });

  it("should create a workoutLine if no createdAt or updatedAt is provided", async () => {
    // eslint-disable-next-line
    const { createdAt, updatedAt, ...propsWithoutDates } =
      validWorkoutLineProps;

    const workoutLineWithoutDates = WorkoutLine.create(propsWithoutDates);

    expect(workoutLineWithoutDates).toBeInstanceOf(WorkoutLine);

    const now = new Date();

    expect(workoutLineWithoutDates.createdAt.getTime()).toBeLessThanOrEqual(
      now.getTime(),
    );
    expect(workoutLineWithoutDates.updatedAt.getTime()).toBeLessThanOrEqual(
      now.getTime(),
    );
  });

  it("should throw error if id is empty", async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        id: "",
      });
    }).toThrow(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        id: "",
      });
    }).toThrow(/(Id.*empty|identificador.*vac.)/i);
  });

  it("should throw error if exerciseId is empty", async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        exerciseId: "",
      });
    }).toThrow(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        exerciseId: "",
      });
    }).toThrow(/(Id.*empty|identificador.*vac.)/i);
  });

  it("should throw error if setNumber is not integer", async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: 2.5,
      });
    }).toThrow(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: 2.5,
      });
    }).toThrow(/(Integer.*integer|entero)/i);
  });

  it("should throw error if setNumber is zero", async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: 0,
      });
    }).toThrow(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: 0,
      });
    }).toThrow(/(Integer.*zero|cero)/i);
  });

  it("should throw error if setNumber is negative", async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: -1,
      });
    }).toThrow(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        setNumber: -1,
      });
    }).toThrow(/(Integer.*positive|positiv)/i);
  });

  it("should throw error if reps is negative", async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        reps: -5,
      });
    }).toThrow(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        reps: -5,
      });
    }).toThrow(/(Integer.*positive|positiv)/i);
  });

  it("should throw error if reps has decimals", async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        reps: 8.2,
      });
    }).toThrow(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        reps: 8.2,
      });
    }).toThrow(/(Integer.*integer|entero)/i);
  });

  it("should throw error if weight is negative", async () => {
    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        weightInKg: -20,
      });
    }).toThrow(ValidationError);

    expect(() => {
      WorkoutLine.create({
        ...validWorkoutLineProps,
        weightInKg: -20,
      });
    }).toThrow(/(Float.*positive|positiv)/i);
  });

  it("can update setNumber", async () => {
    const newSetNumber = 5;
    workoutLine.update({
      setNumber: newSetNumber,
    });

    expect(workoutLine.setNumber).toBe(newSetNumber);
  });

  it("can update reps", async () => {
    const newReps = 12;
    workoutLine.update({
      reps: newReps,
    });

    expect(workoutLine.reps).toBe(newReps);
  });

  it("can update weight", async () => {
    const newWeightInKg = 75.5;
    workoutLine.update({
      weightInKg: newWeightInKg,
    });

    expect(workoutLine.weightInKg).toBe(newWeightInKg);
  });
});
