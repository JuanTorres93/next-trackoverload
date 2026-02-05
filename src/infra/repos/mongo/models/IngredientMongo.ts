import mongoose from 'mongoose';
import { IngredientCreateProps } from '@/domain/entities/ingredient/Ingredient';

import {
  nameTextOptions,
  caloriesFloatOptions,
  proteinFloatOptions,
} from '@/domain/entities/ingredient/Ingredient';

const ingredientSchema = new mongoose.Schema<IngredientCreateProps>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: nameTextOptions.maxLength.value,
  },
  calories: {
    type: Number,
    required: true,
    min: caloriesFloatOptions.onlyPositive ? 0 : undefined,
  },
  protein: {
    type: Number,
    required: true,
    min: proteinFloatOptions.onlyPositive ? 0 : undefined,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const IngredientMongo = mongoose.model<IngredientCreateProps>(
  'Ingredient',
  ingredientSchema,
);

export default IngredientMongo;
