import * as vp from '@/../tests/createProps';
import * as exerciseTestProps from '../../../../../../tests/createProps/exerciseTestProps';
import * as dto from '@/../tests/dtoProperties';
import { toExerciseDTO } from '@/application-layer/dtos/ExerciseDTO';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { MemoryExercisesRepo } from '@/infra/repos/memory/MemoryExercisesRepo';
import { CreateExerciseUsecase } from '../CreateExercise.usecase';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';

describe('CreateExerciseUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let createExerciseUsecase: CreateExerciseUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    createExerciseUsecase = new CreateExerciseUsecase(
      exercisesRepo,
      new Uuidv4IdGenerator(),
    );
  });

  describe('Creation', () => {
    it('should create and save a new exercise', async () => {
      const request = { name: exerciseTestProps.validExerciseProps.name };

      const exercise = await createExerciseUsecase.execute(request);

      expect(exercise).toHaveProperty('id');
      expect(exercise.name).toBe(request.name);
      expect(exercise).toHaveProperty('createdAt');
      expect(exercise).toHaveProperty('updatedAt');

      const savedExercise = await exercisesRepo.getExerciseById(exercise.id);

      // @ts-expect-error savedExercise is not null here
      expect(toExerciseDTO(savedExercise)).toEqual(exercise);
    });

    it('should return ExerciseDTO', async () => {
      const request = { name: exerciseTestProps.validExerciseProps.name };

      const exercise = await createExerciseUsecase.execute(request);

      expect(exercise).not.toBeInstanceOf(Exercise);
      for (const prop of dto.exerciseDTOProperties) {
        expect(exercise).toHaveProperty(prop);
      }
    });
  });
});
