import mongoose from 'mongoose';

import { MealCreateProps, nameTextOptions } from '@/domain/entities/meal/Meal';

const mealSchema = new mongoose.Schema<MealCreateProps>({
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
  createdFromRecipeId: {
    type: String,
    required: true,
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
mealSchema.index({ userId: 1 });

// Virtual populate for meal lines
mealSchema.virtual('mealLines', {
  ref: 'MealLine',
  localField: 'id',
  foreignField: 'parentId',
});

const MealMongo = mongoose.model<MealCreateProps>('Meal', mealSchema);

export default MealMongo;
