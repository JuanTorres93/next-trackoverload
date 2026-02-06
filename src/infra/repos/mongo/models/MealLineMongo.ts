import mongoose from 'mongoose';
import {
  IngredientLineCreateProps,
  quantityFloatOptions,
} from '@/domain/entities/ingredientline/IngredientLine';

export type MealLineMongoProps = Omit<
  IngredientLineCreateProps,
  'ingredient'
> & {
  ingredientId: string;
};

const mealLineSchema = new mongoose.Schema<MealLineMongoProps>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  parentId: {
    type: String,
    required: true,
  },
  ingredientId: {
    type: String,
    required: true,
    ref: 'Ingredient',
  },
  quantityInGrams: {
    type: Number,
    required: true,
    min: quantityFloatOptions.canBeZero ? 0 : 0.000001,
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

// Index for efficient queries by parentId
mealLineSchema.index({ parentId: 1 });

// Virtual populate for ingredient
mealLineSchema.virtual('ingredient', {
  ref: 'Ingredient',
  localField: 'ingredientId',
  foreignField: 'id',
  justOne: true,
});

const MealLineMongo = mongoose.model<MealLineMongoProps>(
  'MealLine',
  mealLineSchema,
);

export default MealLineMongo;
