import { exerciseDTOProperties } from "../../../../../../tests/dtoProperties";
import ExerciseMongo from "../ExerciseMongo";
import { assertMongooseModelMatchesDTOProperties } from "./assertMongooseSchemaMatchesProperties";

describe("ExerciseMongo", () => {
  it("should have (at least) same properties as DTO", () => {
    assertMongooseModelMatchesDTOProperties(
      ExerciseMongo,
      exerciseDTOProperties,
    );
  });
});
