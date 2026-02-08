import mongoose from 'mongoose';

import {
  WorkoutTemplateLineCreateProps,
  setsIntegerOptions,
} from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';

export type WorkoutTemplateLineMongoProps = Omit<
  WorkoutTemplateLineCreateProps,
  'exercise'
> & {
  exerciseId: string;
};

const workoutTemplateLineSchema =
  new mongoose.Schema<WorkoutTemplateLineMongoProps>({
    id: {
      type: String,
      required: true,
      unique: true,
    },
    templateId: {
      type: String,
      required: true,
    },
    exerciseId: {
      type: String,
      required: true,
      ref: 'Exercise',
    },
    sets: {
      type: Number,
      required: true,
      min: setsIntegerOptions.canBeZero ? 0 : 1,
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

// Index for efficient queries by templateId
workoutTemplateLineSchema.index({ templateId: 1 });

// Virtual populate for exercise
workoutTemplateLineSchema.virtual('exercise', {
  ref: 'Exercise',
  localField: 'exerciseId',
  foreignField: 'id',
  justOne: true,
});

const WorkoutTemplateLineMongo =
  mongoose.models.WorkoutTemplateLine ||
  mongoose.model<WorkoutTemplateLineMongoProps>(
    'WorkoutTemplateLine',
    workoutTemplateLineSchema,
  );

export default WorkoutTemplateLineMongo;
