import { beforeEach, describe, expect, it } from 'vitest';
import { CreateExerciseUsecase } from '../CreateExercise.usecase';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { ValidationError } from '@/domain/common/errors';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { toExerciseDTO } from '@/application-layer/dtos/ExerciseDTO';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('CreateExerciseUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let createExerciseUsecase: CreateExerciseUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    createExerciseUsecase = new CreateExerciseUsecase(exercisesRepo);
  });

  it('should create and save a new exercise', async () => {
    const request = { name: vp.validExerciseProps.name };

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
    const request = { name: vp.validExerciseProps.name };

    const exercise = await createExerciseUsecase.execute(request);

    expect(exercise).not.toBeInstanceOf(Exercise);
    for (const prop of dto.exerciseDTOProperties) {
      expect(exercise).toHaveProperty(prop);
    }
  });

  it('should throw an error if name is empty', async () => {
    const request = { name: '' };

    await expect(createExerciseUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw an error if name is not a string', async () => {
    const request = { name: 123 };

    // @ts-expect-error testing invalid input
    await expect(createExerciseUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });
});
