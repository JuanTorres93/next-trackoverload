import { ValidationError } from "@/domain/common/errors";

import { ExternalExerciseRefSource } from "../ExternalExerciseRefSource";

describe("ExternalExerciseRefSource", () => {
  it("should create a valid ExternalExerciseRefSource with 'wger'", () => {
    const source = ExternalExerciseRefSource.create("wger");

    expect(source).toBeInstanceOf(ExternalExerciseRefSource);
    expect(source.value).toBe("wger");
  });

  it("should be case insensitive and trim spaces", () => {
    const source = ExternalExerciseRefSource.create("  Wger  ");

    expect(source).toBeInstanceOf(ExternalExerciseRefSource);
    expect(source.value).toBe("wger");
  });

  it("should throw ValidationError for invalid source", () => {
    expect(() => ExternalExerciseRefSource.create("invalidsource")).toThrow(
      ValidationError,
    );
    expect(() => ExternalExerciseRefSource.create("invalidsource")).toThrow(
      /ExternalExerciseRefSource: value must be one of \[wger\]/,
    );
  });

  it("should throw ValidationError for empty source", () => {
    expect(() => ExternalExerciseRefSource.create("   ")).toThrow(
      ValidationError,
    );
  });
});
