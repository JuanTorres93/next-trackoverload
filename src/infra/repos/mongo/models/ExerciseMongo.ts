import mongoose from 'mongoose';
import {
  ExerciseCreateProps,
  nameTextOptions,
} from '@/domain/entities/exercise/Exercise';

const exerciseSchema = new mongoose.Schema<ExerciseCreateProps>({
  id: {
    type: String,
    required: true,
    unique: true,
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
});

const ExerciseMongo = mongoose.model<ExerciseCreateProps>(
  'Exercise',
  exerciseSchema,
);

export default ExerciseMongo;
