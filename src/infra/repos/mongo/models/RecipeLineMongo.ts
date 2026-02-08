import mongoose from 'mongoose';
import {
  IngredientLineCreateProps,
  quantityFloatOptions,
} from '@/domain/entities/ingredientline/IngredientLine';

export type RecipeLineMongoProps = Omit<
  IngredientLineCreateProps,
  'ingredient'
> & {
  ingredientId: string;
};

const recipeLineSchema = new mongoose.Schema<RecipeLineMongoProps>({
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
recipeLineSchema.index({ parentId: 1 });

// Virtual populate for ingredient
recipeLineSchema.virtual('ingredient', {
  ref: 'Ingredient',
  localField: 'ingredientId',
  foreignField: 'id',
  justOne: true,
});

const RecipeLineMongo =
  mongoose.models.RecipeLine ||
  mongoose.model<RecipeLineMongoProps>('RecipeLine', recipeLineSchema);

export default RecipeLineMongo;
