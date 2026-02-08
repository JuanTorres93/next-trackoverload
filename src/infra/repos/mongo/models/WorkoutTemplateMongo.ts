import mongoose from 'mongoose';

import {
  WorkoutTemplateCreateProps,
  nameTextOptions,
} from '@/domain/entities/workouttemplate/WorkoutTemplate';

const workoutTemplateSchema = new mongoose.Schema<WorkoutTemplateCreateProps>({
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
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  deletedAt: {
    type: Date,
    required: false,
  },
});

// Index for efficient queries
workoutTemplateSchema.index({ userId: 1 });

// Virtual populate for template lines
workoutTemplateSchema.virtual('templateLines', {
  ref: 'WorkoutTemplateLine',
  localField: 'id',
  foreignField: 'templateId',
});

const WorkoutTemplateMongo = mongoose.model<WorkoutTemplateCreateProps>(
  'WorkoutTemplate',
  workoutTemplateSchema,
);

export default WorkoutTemplateMongo;
