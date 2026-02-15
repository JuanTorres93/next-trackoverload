import * as workoutTemplateTestProps from '../../../../../../tests/createProps/workoutTemplateTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { MemoryWorkoutsRepo } from '@/infra/repos/memory/MemoryWorkoutsRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { CreateWorkoutFromTemplateUsecase } from '../CreateWorkoutFromTemplate.usecase';

describe('CreateWorkoutFromTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: CreateWorkoutFromTemplateUsecase;
  let user: User;
  let template: WorkoutTemplate;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new CreateWorkoutFromTemplateUsecase(
      workoutTemplatesRepo,
      workoutsRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
    );

    user = userTestProps.createTestUser();

    template = workoutTemplateTestProps.createTestWorkoutTemplate();

    await usersRepo.saveUser(user);
    await workoutTemplatesRepo.saveWorkoutTemplate(template);
  });

  describe('Execution', () => {
    it('should create workout from template ', async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: template.id,
      };

      const result = await usecase.execute(request);

      expect(result.name).toContain(template.name);
      expect(result.workoutTemplateId).toBe(template.id);
      expect(result.exercises).toHaveLength(
        template.exercises.reduce((acc, ex) => acc + ex.sets, 0),
      ); // Sum of all sets of each exercise in template

      // Check exercise 1 sets
      const exercise1Sets = result.exercises.filter(
        (ex) => ex.exerciseId === template.exercises[0].exerciseId,
      );
      expect(exercise1Sets).toHaveLength(template.exercises[0].sets);
      expect(exercise1Sets[0]).toEqual({
        id: exercise1Sets[0].id,
        workoutId: result.id,
        exerciseId: template.exercises[0].exerciseId,
        setNumber: 1,
        reps: 0,
        weightInKg: 0,
        createdAt: exercise1Sets[0].createdAt,
        updatedAt: exercise1Sets[0].updatedAt,
      });
      expect(exercise1Sets[1].setNumber).toBe(2);
      expect(exercise1Sets[2].setNumber).toBe(3);

      // Check exercise 2 sets
      const exercise2Sets = result.exercises.filter(
        (ex) => ex.exerciseId === template.exercises[1].exerciseId,
      );
      expect(exercise2Sets).toHaveLength(template.exercises[1].sets);
      expect(exercise2Sets[0].setNumber).toBe(1);
      expect(exercise2Sets[1].setNumber).toBe(2);

      // Verify workout was saved
      const savedWorkout = await workoutsRepo.getWorkoutById(result.id);
      expect(savedWorkout).not.toBeNull();
      expect(savedWorkout!.name).toContain(template.name);
    });

    it('should return a WorkoutDTO', async () => {
      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: template.id,
      };

      const result = await usecase.execute(request);

      expect(result).not.toBeInstanceOf(WorkoutTemplate);
      expect(result).not.toBeInstanceOf(Workout);
      for (const prop of dto.workoutDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should create workout with custom name', async () => {
      const request = {
        workoutTemplateId: template.id,
        userId: userTestProps.userId,
        workoutName: 'My Custom Workout',
      };

      const result = await usecase.execute(request);

      expect(result.name).toBe('My Custom Workout');
      expect(result.workoutTemplateId).toBe(template.id);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when template does not exist', async () => {
      const request = {
        workoutTemplateId: 'non-existent',
        userId: userTestProps.userId,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutFromTemplateUsecase:.*WorkoutTemplate not found/,
      );
    });

    it('should throw error when template has no exercises', async () => {
      const template = workoutTemplateTestProps.createTestWorkoutTemplate({
        exercises: [],
      });

      await workoutTemplatesRepo.saveWorkoutTemplate(template);

      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: template.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutFromTemplateUsecase.*Cannot.*from.*empty template/,
      );
    });

    it('should throw error when trying to create workout from deleted template', async () => {
      template.markAsDeleted();
      await workoutTemplatesRepo.saveWorkoutTemplate(template);

      const request = {
        userId: userTestProps.userId,
        workoutTemplateId: template.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutFromTemplateUsecase:.*WorkoutTemplate.*not found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        userId: 'non-existent',
        workoutTemplateId: template.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutFromTemplateUsecase.*User.*not.*found/,
      );
    });

    it("should throw error when trying to create workout from another user's workout template", async () => {
      const anotherUser = userTestProps.createTestUser({
        id: 'user-2',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        userId: anotherUser.id,
        workoutTemplateId: template.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateWorkoutFromTemplateUsecase:.*WorkoutTemplate not found/,
      );
    });
  });
});
