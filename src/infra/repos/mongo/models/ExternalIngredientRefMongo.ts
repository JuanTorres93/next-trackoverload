import mongoose from 'mongoose';
import { ExternalIngredientRefCreateProps } from '@/domain/entities/externalingredientref/ExternalIngredientRef';

import { VALID_SOURCES } from '@/domain/value-objects/ExternalIngredientRefSource/ExternalIngredientRefSource';

const externalIngredientRefSchema =
  new mongoose.Schema<ExternalIngredientRefCreateProps>({
    externalId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: [...VALID_SOURCES],
    },
    ingredientId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  });

// Compound index for efficient queries
externalIngredientRefSchema.index(
  { externalId: 1, source: 1 },
  { unique: true },
);

const ExternalIngredientRefMongo =
  mongoose.model<ExternalIngredientRefCreateProps>(
    'ExternalIngredientRef',
    externalIngredientRefSchema,
  );

export default ExternalIngredientRefMongo;
