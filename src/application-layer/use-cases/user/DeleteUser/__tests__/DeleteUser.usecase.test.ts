import * as vp from '@/../tests/createProps';
import { NotFoundError, PermissionError } from '@/domain/common/errors';

// Import entities
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Meal } from '@/domain/entities/meal/Meal';
import { Recipe } from '@/domain/entities/recipe/Recipe';
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
      workoutTemplatesRepo
    );

    // Create user
    const user = User.create({
      ...vp.validUserProps,
      name: 'Test User',
    });
    await usersRepo.saveUser(user);

    // Create associated resources
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      userId: vp.userId,
    });

    const meal = Meal.create({
      ...vp.validMealWithIngredientLines(),
      userId: vp.userId,
    });

    const recipe = Recipe.create({
      ...vp.validRecipePropsWithIngredientLines(),
      userId: vp.userId,
    });

    const workout = Workout.create({
      ...vp.validWorkoutPropsWithExercises(),
      userId: vp.userId,
    });

    const workoutTemplate = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      userId: vp.userId,
    });

    const day = Day.create({
      ...vp.validDayProps(),
      userId: vp.userId,
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
      const existingUser = await usersRepo.getUserById(vp.userId);
      expect(existingUser).not.toBeNull();

      await deleteUserUsecase.execute({
        actorUserId: vp.userId,
        targetUserId: vp.userId,
      });

      // Verify user was deleted
      const deletedUser = await usersRepo.getUserById(vp.userId);
      expect(deletedUser).toBeNull();
    });

    describe('should delete all resources owned by user', () => {
      it('FakeMeals', async () => {
        const fakeMealsBefore = await fakeMealsRepo.getAllFakeMealsByUserId(
          vp.userId
        );
        expect(fakeMealsBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: vp.userId,
          targetUserId: vp.userId,
        });

        const fakeMealsAfter = await fakeMealsRepo.getAllFakeMealsByUserId(
          vp.userId
        );
        expect(fakeMealsAfter.length).toBe(0);
      });

      it('Meals', async () => {
        const mealsBefore = await mealsRepo.getAllMealsForUser(vp.userId);
        expect(mealsBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: vp.userId,
          targetUserId: vp.userId,
        });

        const mealsAfter = await mealsRepo.getAllMealsForUser(vp.userId);
        expect(mealsAfter.length).toBe(0);
      });

      it('Recipes', async () => {
        const recipesBefore = await recipesRepo.getAllRecipesByUserId(
          vp.userId
        );
        expect(recipesBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: vp.userId,
          targetUserId: vp.userId,
        });

        const recipesAfter = await recipesRepo.getAllRecipesByUserId(vp.userId);
        expect(recipesAfter.length).toBe(0);
      });

      it('Workouts', async () => {
        const workoutsBefore = await workoutsRepo.getAllWorkoutsByUserId(
          vp.userId
        );
        expect(workoutsBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: vp.userId,
          targetUserId: vp.userId,
        });

        const workoutsAfter = await workoutsRepo.getAllWorkoutsByUserId(
          vp.userId
        );
        expect(workoutsAfter.length).toBe(0);
      });

      it('WorkoutTemplates', async () => {
        const workoutTemplatesBefore =
          await workoutTemplatesRepo.getAllWorkoutTemplatesByUserId(vp.userId);
        expect(workoutTemplatesBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: vp.userId,
          targetUserId: vp.userId,
        });

        const workoutTemplatesAfter =
          await workoutTemplatesRepo.getAllWorkoutTemplatesByUserId(vp.userId);
        expect(workoutTemplatesAfter.length).toBe(0);
      });

      it('Days', async () => {
        const daysBefore = await daysRepo.getAllDaysByUserId(vp.userId);
        expect(daysBefore.length).toBeGreaterThan(0);

        await deleteUserUsecase.execute({
          actorUserId: vp.userId,
          targetUserId: vp.userId,
        });

        const daysAfter = await daysRepo.getAllDaysByUserId(vp.userId);
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
        NotFoundError
      );

      await expect(deleteUserUsecase.execute(request)).rejects.toThrow(
        /DeleteUserUsecase.*User.*not found/
      );
    });

    it('should throw error if a user is trying to delete another user', async () => {
      const anotherUser = User.create({
        ...vp.validUserProps,
        id: 'another-user-id',
        name: 'Another User',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        actorUserId: anotherUser.id,
        targetUserId: vp.userId,
      };

      await expect(deleteUserUsecase.execute(request)).rejects.toThrow(
        PermissionError
      );

      await expect(deleteUserUsecase.execute(request)).rejects.toThrow(
        /DeleteUserUsecase.*delete.*another.*user/
      );
    });
  });
});
