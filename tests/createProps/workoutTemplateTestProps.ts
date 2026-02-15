import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import { userId } from './userTestProps';
import {
  WorkoutTemplate,
  WorkoutTemplateCreateProps,
} from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { validExerciseProps } from './exerciseTestProps';

const templateId = '1';
const exerciseId = validExerciseProps.id;

export function validWorkoutTemplateProps() {
  const templateLine1 = WorkoutTemplateLine.create({
    id: 'line1',
    templateId,
    exerciseId: exerciseId,
    sets: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const templateLine2 = WorkoutTemplateLine.create({
    id: 'line2',
    templateId,
    exerciseId: 'ex2',
    sets: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id: templateId,
    userId: userId,
    name: 'Test workout template',
    exercises: [templateLine1, templateLine2],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export const validWorkoutTemplateLineProps = {
  id: 'workouttemplateline-1',
  templateId: templateId,
  exerciseId: exerciseId,
  sets: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestWorkoutTemplate(
  props?: Partial<WorkoutTemplateCreateProps>,
): WorkoutTemplate {
  const validProps = validWorkoutTemplateProps();

  return WorkoutTemplate.create({
    id: props?.id || validProps.id,
    userId: props?.userId || validProps.userId,
    name: props?.name || validProps.name,
    exercises: props?.exercises || validProps.exercises,
    createdAt: props?.createdAt || validProps.createdAt,
    updatedAt: props?.updatedAt || validProps.updatedAt,
    deletedAt: props?.deletedAt || undefined,
  });
}
