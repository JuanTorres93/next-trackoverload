import mongoose from 'mongoose';

import {
  WorkoutCreateProps,
  nameTextOptions,
} from '@/domain/entities/workout/Workout';

const workoutSchema = new mongoose.Schema<WorkoutCreateProps>({
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
  workoutTemplateId: {
    type: String,
    required: true,
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
workoutSchema.index({ userId: 1 });
workoutSchema.index({ workoutTemplateId: 1 });

// Virtual populate for workout lines
workoutSchema.virtual('workoutLines', {
  ref: 'WorkoutLine',
  localField: 'id',
  foreignField: 'workoutId',
});

const WorkoutMongo = mongoose.model<WorkoutCreateProps>(
  'Workout',
  workoutSchema,
);

export default WorkoutMongo;
