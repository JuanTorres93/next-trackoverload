import { NotFoundError, PermissionError } from '@/domain/common/errors';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '../../../../../../tests/createProps/fakeMealTestProps';
import * as mealTestProps from '../../../../../../tests/createProps/mealTestProps';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as workoutTemplateTestProps from '../../../../../../tests/createProps/workoutTemplateTestProps';
import * as workoutTestProps from '../../../../../../tests/createProps/workoutTestProps';

// Import entities
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';

// Import in-memory repositories
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/repos/memory/MemoryWorkoutsRepo';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { MemoryTransactionContext } from '@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext';

// Import use case
import { DeleteUserUsecase } from '../DeleteUser.usecase';

describe('DeleteUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let daysRepo: MemoryDaysRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let mealsRepo: MemoryMealsRepo;
  let recipesRepo: MemoryRecipesRepo;
  let workoutsRepo: MemoryWorkoutsRepo;
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;

  let deleteUserUsecase: DeleteUserUsecase;

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    daysRepo = new MemoryDaysRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();
    mealsRepo = new MemoryMealsRepo();
    recipesRepo = new MemoryRecipesRepo();
    workoutsRepo = new MemoryWorkoutsRepo();
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();

    deleteUserUsecase = new DeleteUserUsecase(
      usersRepo,
      daysRepo,
      fakeMealsRepo,
      mealsRepo,
      recipesRepo,
      workoutsRepo,
      workoutTemplatesRepo,
      new MemoryTransactionContext(),
    );

    // Create user
    const user = User.create({
      ...userTestProps.validUserProps,
      name: 'Test User',
    });
    await usersRepo.saveUser(user);

    // Create associated resources
    const fakeMeal = fakeMealTestProps.createTestFakeMeal();
    const meal = mealTestProps.createTestMeal();
    const recipe = recipeTestProps.createTestRecipe();

    const workout = Workout.create({
      ...workoutTestProps.validWorkoutPropsWithExercises(),
      userId: userTestProps.userId,
    });

    const workoutTemplate = WorkoutTemplate.create({
      ...workoutTemplateTestProps.validWorkoutTemplateProps(),
      userId: userTestProps.userId,
    });

    const day = Day.create({
      ...dayTestProps.validDayProps(),
      userId: userTestProps.userId,
    });

    // Save all to their respective repos
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
    await mealsRepo.saveMeal(meal);
    await recipesRepo.saveRecipe(recipe);
    await workoutsRepo.saveWorkout(workout);
    await workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);
    await daysRepo.saveDay(day);
  });

  describe('Execute', () => {
    it('should delete user successfully', async () => {
      // Verify user exists before deletion
      const existingUser = await usersRepo.getUserById(userTestProps.userId);
      expect(existingUser).not.toBeNull();

      await deleteUserUsecase.execute({
        actorUserId: userTestProps.userId,
        targetUserId: userTestProps.userId,
      });

      // Verify user was deleted
      const deletedUser = await usersRepo.getUserById(userTestProps.userId);
      expect(deletedUser).toBeNull();
    });

    describe('should delete all resources owned by user', () => {
      it('FakeMeals', async () => {
        const fakeMealsBefore = await fakeMealsRepo.getAllFakeMealsByUserId(
          userTestProps.userId,
        );
        expect(fakeMealsBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: userTestProps.userId,
          targetUserId: userTestProps.userId,
        });

        const fakeMealsAfter = await fakeMealsRepo.getAllFakeMealsByUserId(
          userTestProps.userId,
        );
        expect(fakeMealsAfter.length).toBe(0);
      });

      it('Meals', async () => {
        const mealsBefore = await mealsRepo.getAllMealsForUser(
          userTestProps.userId,
        );
        expect(mealsBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: userTestProps.userId,
          targetUserId: userTestProps.userId,
        });

        const mealsAfter = await mealsRepo.getAllMealsForUser(
          userTestProps.userId,
        );
        expect(mealsAfter.length).toBe(0);
      });

      it('Recipes', async () => {
        const recipesBefore = await recipesRepo.getAllRecipesByUserId(
          userTestProps.userId,
        );
        expect(recipesBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: userTestProps.userId,
          targetUserId: userTestProps.userId,
        });

        const recipesAfter = await recipesRepo.getAllRecipesByUserId(
          userTestProps.userId,
        );
        expect(recipesAfter.length).toBe(0);
      });

      it('Workouts', async () => {
        const workoutsBefore = await workoutsRepo.getAllWorkoutsByUserId(
          userTestProps.userId,
        );
        expect(workoutsBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: userTestProps.userId,
          targetUserId: userTestProps.userId,
        });

        const workoutsAfter = await workoutsRepo.getAllWorkoutsByUserId(
          userTestProps.userId,
        );
        expect(workoutsAfter.length).toBe(0);
      });

      it('WorkoutTemplates', async () => {
        const workoutTemplatesBefore =
          await workoutTemplatesRepo.getAllWorkoutTemplatesByUserId(
            userTestProps.userId,
          );
        expect(workoutTemplatesBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: userTestProps.userId,
          targetUserId: userTestProps.userId,
        });

        const workoutTemplatesAfter =
          await workoutTemplatesRepo.getAllWorkoutTemplatesByUserId(
            userTestProps.userId,
          );
        expect(workoutTemplatesAfter.length).toBe(0);
      });

      it('Days', async () => {
        const daysBefore = await daysRepo.getAllDaysByUserId(
          userTestProps.userId,
        );
        expect(daysBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: userTestProps.userId,
          targetUserId: userTestProps.userId,
        });

        const daysAfter = await daysRepo.getAllDaysByUserId(
          userTestProps.userId,
        );
        expect(daysAfter.length).toBe(0);
      });
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when user does not exist', async () => {
      const request = {
        actorUserId: 'non-existent',
        targetUserId: 'non-existent',
      };

      await expect(deleteUserUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(deleteUserUsecase.execute(request)).rejects.toThrow(
        /DeleteUserUsecase.*User.*not found/,
      );
    });

    it('should throw error if a user is trying to delete another user', async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
        name: 'Another User',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        actorUserId: anotherUser.id,
        targetUserId: userTestProps.userId,
      };

      await expect(deleteUserUsecase.execute(request)).rejects.toThrow(
        PermissionError,
      );

      await expect(deleteUserUsecase.execute(request)).rejects.toThrow(
        /DeleteUserUsecase.*delete.*another.*user/,
      );
    });
  });
});
