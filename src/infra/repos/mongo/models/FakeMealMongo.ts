import mongoose from 'mongoose';
import {
  FakeMealCreateProps,
  nameTextOptions,
  caloriesFloatOptions,
  proteinFloatOptions,
} from '@/domain/entities/fakemeal/FakeMeal';

const fakeMealSchema = new mongoose.Schema<FakeMealCreateProps>({
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
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const FakeMealMongo = mongoose.model<FakeMealCreateProps>(
  'FakeMeal',
  fakeMealSchema,
);

export default FakeMealMongo;
