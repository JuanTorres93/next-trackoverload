import {
  Exercise,
  ExerciseCreateProps,
} from '@/domain/entities/exercise/Exercise';

export const validExerciseProps = {
  id: 'ex1',
  name: 'Test Exercise',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestExercise(
  props?: Partial<ExerciseCreateProps>,
): Exercise {
  return Exercise.create({
    id: props?.id || validExerciseProps.id,
    name: props?.name || validExerciseProps.name,
    createdAt: props?.createdAt || validExerciseProps.createdAt,
    updatedAt: props?.updatedAt || validExerciseProps.updatedAt,
  });
}
