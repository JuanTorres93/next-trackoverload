import mongoose from 'mongoose';
import { DayCreateProps } from '@/domain/entities/day/Day';

export type DayMongoProps = DayCreateProps & {
  mealIds: string[];
  fakeMealIds: string[];
};

const daySchema = new mongoose.Schema<DayMongoProps>({
  day: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  mealIds: {
    type: [String],
    required: true,
    default: [],
  },
  fakeMealIds: {
    type: [String],
    required: true,
    default: [],
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
daySchema.index({ userId: 1 });
daySchema.index({ userId: 1, year: 1, month: 1, day: 1 });

const DayMongo = mongoose.model<DayMongoProps>('Day', daySchema);

export default DayMongo;
