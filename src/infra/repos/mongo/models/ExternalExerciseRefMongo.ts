import mongoose from "mongoose";

import { ExternalExerciseRefCreateProps } from "@/domain/entities/externalexerciseref/ExternalExerciseRef";
import { VALID_SOURCES } from "@/domain/value-objects/ExternalExerciseRefSource/ExternalExerciseRefSource";

const externalExerciseRefSchema =
  new mongoose.Schema<ExternalExerciseRefCreateProps>({
    externalId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: [...VALID_SOURCES],
    },
    exerciseId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  });

// Compound index for efficient queries
externalExerciseRefSchema.index({ externalId: 1, source: 1 }, { unique: true });

const ExternalExerciseRefMongo =
  mongoose.models.ExternalExerciseRef ||
  mongoose.model<ExternalExerciseRefCreateProps>(
    "ExternalExerciseRef",
    externalExerciseRefSchema,
  );

export default ExternalExerciseRefMongo;
