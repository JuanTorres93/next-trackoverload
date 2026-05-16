import { validExternalExerciseRefProps } from "../../../../../tests/createProps/externalExerciseRefTestProps";
import { ExternalExerciseRef } from "../ExternalExerciseRef";

describe("ExternalExerciseRef", () => {
  let externalExerciseRef: ExternalExerciseRef;

  beforeEach(() => {
    externalExerciseRef = ExternalExerciseRef.create(
      validExternalExerciseRefProps,
    );
  });

  describe("Creation", () => {
    it("should create a valid externalExerciseRef", () => {
      expect(externalExerciseRef).toBeInstanceOf(ExternalExerciseRef);
    });

    it("should create externalExerciseRef if no createdAt date is provided", async () => {
      // eslint-disable-next-line
      const { createdAt, ...propsWithoutCreatedAt } =
        validExternalExerciseRefProps;

      const externalExerciseRefWithoutCreatedAt = ExternalExerciseRef.create(
        propsWithoutCreatedAt,
      );

      expect(externalExerciseRefWithoutCreatedAt).toBeInstanceOf(
        ExternalExerciseRef,
      );

      const now = new Date();

      expect(
        externalExerciseRefWithoutCreatedAt.createdAt.getTime(),
      ).toBeLessThanOrEqual(now.getTime());
    });
  });
});
