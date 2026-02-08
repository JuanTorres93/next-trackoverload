import mongoose from 'mongoose';

import {
  WorkoutLineCreateProps,
  setNumberIntegerOptions,
} from '@/domain/entities/workoutline/WorkoutLine';

export type WorkoutLineMongoProps = Omit<WorkoutLineCreateProps, 'exercise'> & {
  exerciseId: string;
};

const workoutLineSchema = new mongoose.Schema<WorkoutLineMongoProps>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  workoutId: {
    type: String,
    required: true,
  },
  exerciseId: {
    type: String,
    required: true,
    ref: 'Exercise',
  },
  setNumber: {
    type: Number,
    required: true,
    min: setNumberIntegerOptions.canBeZero ? 0 : 1,
  },
  reps: {
    type: Number,
    required: true,
    min: 0,
  },
  weightInKg: {
    type: Number,
    required: true,
    min: 0,
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

// Index for efficient queries by workoutId
workoutLineSchema.index({ workoutId: 1 });

// Virtual populate for exercise
workoutLineSchema.virtual('exercise', {
  ref: 'Exercise',
  localField: 'exerciseId',
  foreignField: 'id',
  justOne: true,
});

const WorkoutLineMongo =
  mongoose.models.WorkoutLine ||
  mongoose.model<WorkoutLineMongoProps>('WorkoutLine', workoutLineSchema);

export default WorkoutLineMongo;
