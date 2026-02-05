import { toWorkoutDTO, WorkoutDTO } from '../WorkoutDTO';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import * as workoutTestProps from '../../../../tests/createProps/workoutTestProps';
import * as dto from '@/../tests/dtoProperties';

describe('WorkoutDTO', () => {
  let workout: Workout;
  let workoutLine: WorkoutLine;
  let workoutDTO: WorkoutDTO;

  beforeEach(() => {
    workoutLine = WorkoutLine.create(workoutTestProps.validWorkoutLineProps);
    workout = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      exercises: [workoutLine],
    });
  });

  describe('toWorkoutDTO', () => {
    beforeEach(() => {
      workoutDTO = toWorkoutDTO(workout);
    });

    it('should have a prop for each workout getter', () => {
      for (const getter of dto.workoutDTOProperties) {
        expect(workoutDTO).toHaveProperty(getter);
      }
    });

    it('should convert Workout to WorkoutDTO', () => {
      expect(workoutDTO).toEqual({
        id: workout.id,
        userId: workout.userId,
        name: workout.name,
        workoutTemplateId: workout.workoutTemplateId,
        exercises: workout.exercises.map((line) => ({
          id: line.id,
          workoutId: line.workoutId,
          exerciseId: line.exerciseId,
          setNumber: line.setNumber,
          reps: line.reps,
          weightInKg: line.weightInKg,
          createdAt: line.createdAt.toISOString(),
          updatedAt: line.updatedAt.toISOString(),
        })),
        createdAt: workout.createdAt.toISOString(),
        updatedAt: workout.updatedAt.toISOString(),
      });
    });

    it('should convert dates to ISO strings', () => {
      expect(typeof workoutDTO.createdAt).toBe('string');
      expect(typeof workoutDTO.updatedAt).toBe('string');
      expect(workoutDTO.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(workoutDTO.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should include nested exercise line DTOs', () => {
      expect(workoutDTO.exercises).toHaveLength(1);
      const workoutLineDTO = workoutDTO.exercises[0];

      for (const getter of dto.workoutLineDTOProperties) {
        expect(workoutLineDTO).toHaveProperty(getter);
      }
    });
  });
});
