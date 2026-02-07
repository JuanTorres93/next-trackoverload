import mongoose from 'mongoose';

import {
  RecipeCreateProps,
  nameTextOptions,
} from '@/domain/entities/recipe/Recipe';

const recipeSchema = new mongoose.Schema<RecipeCreateProps>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: nameTextOptions.maxLength.value,
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

// Indexes for efficient queries
recipeSchema.index({ userId: 1 });

// Virtual populate for recipe lines
recipeSchema.virtual('recipeLines', {
  ref: 'RecipeLine',
  localField: 'id',
  foreignField: 'parentId',
});

const RecipeMongo = mongoose.model<RecipeCreateProps>('Recipe', recipeSchema);

export default RecipeMongo;
