import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { mockForThrowingError } from '@/infra/repos/mongo/__tests__/mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from '@/infra/repos/mongo/__tests__/setupMongoTestDB';
import { MongoDaysRepo } from '@/infra/repos/mongo/MongoDaysRepo';
import { MongoExercisesRepo } from '@/infra/repos/mongo/MongoExercisesRepo';
import { MongoFakeMealsRepo } from '@/infra/repos/mongo/MongoFakeMealsRepo';
import { MongoIngredientsRepo } from '@/infra/repos/mongo/MongoIngredientsRepo';
import { MongoMealsRepo } from '@/infra/repos/mongo/MongoMealsRepo';
import { MongoRecipesRepo } from '@/infra/repos/mongo/MongoRecipesRepo';
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { MongoWorkoutsRepo } from '@/infra/repos/mongo/MongoWorkoutsRepo';
import { MongoWorkoutTemplatesRepo } from '@/infra/repos/mongo/MongoWorkoutTemplatesRepo';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import { beforeEach, describe } from 'vitest';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import { createTestExercise } from '../../../../../../tests/createProps/exerciseTestProps';
import * as fakeMealTestProps from '../../../../../../tests/createProps/fakeMealTestProps';
import { createTestMeal } from '../../../../../../tests/createProps/mealTestProps';
import { createTestRecipe } from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { createTestWorkoutTemplate } from '../../../../../../tests/createProps/workoutTemplateTestProps';
import { validWorkoutPropsWithExercises } from '../../../../../../tests/createProps/workoutTestProps';
import { DeleteUserUsecase } from '../DeleteUser.usecase';

describe('DeleteUserUsecase', () => {
  let usersRepo: MongoUsersRepo;
  let daysRepo: MongoDaysRepo;
  let fakeMealsRepo: MongoFakeMealsRepo;
  let mealsRepo: MongoMealsRepo;
  let recipesRepo: MongoRecipesRepo;
  let workoutsRepo: MongoWorkoutsRepo;
  let workoutTemplatesRepo: MongoWorkoutTemplatesRepo;
  let ingredientsRepo: MongoIngredientsRepo;
  let exercisesRepo: MongoExercisesRepo;

  let deleteUserUsecase: DeleteUserUsecase;
  let user: User;

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    usersRepo = new MongoUsersRepo();
    daysRepo = new MongoDaysRepo();
    fakeMealsRepo = new MongoFakeMealsRepo();
    mealsRepo = new MongoMealsRepo();
    recipesRepo = new MongoRecipesRepo();
    workoutsRepo = new MongoWorkoutsRepo();
    workoutTemplatesRepo = new MongoWorkoutTemplatesRepo();
    ingredientsRepo = new MongoIngredientsRepo();
    exercisesRepo = new MongoExercisesRepo();

    deleteUserUsecase = new DeleteUserUsecase(
      usersRepo,
      daysRepo,
      fakeMealsRepo,
      mealsRepo,
      recipesRepo,
      workoutsRepo,
      workoutTemplatesRepo,
      new MongoTransactionContext(),
    );

    user = userTestProps.createTestUser();

    // Create associated resources
    const fakeMeal = fakeMealTestProps.createTestFakeMeal();
    const meal = createTestMeal();

    // Save ingredients for meal
    for (const line of meal.ingredientLines) {
      await ingredientsRepo.saveIngredient(line.ingredient);
    }

    const recipe = createTestRecipe();

    // Save ingredients for recipe
    for (const line of recipe.ingredientLines) {
      await ingredientsRepo.saveIngredient(line.ingredient);
    }

    const day = dayTestProps.createEmptyTestDay();

    // Create exercises needed for workouts and templates
    const exercise1 = createTestExercise();
    const exercise2 = createTestExercise({
      id: 'ex2',
    });
    const workoutTemplate = createTestWorkoutTemplate();

    const workout = Workout.create({
      ...validWorkoutPropsWithExercises(),
      userId: user.id,
    });

    await usersRepo.saveUser(user);
    await exercisesRepo.saveExercise(exercise1);
    await exercisesRepo.saveExercise(exercise2);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
    await mealsRepo.saveMeal(meal);
    await recipesRepo.saveRecipe(recipe);
    await daysRepo.saveDay(day);
    await workoutsRepo.saveWorkout(workout);
    await workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    initialExpectations = async () => {
      const allFakeMeals = await fakeMealsRepo.getAllFakeMeals();
      expect(allFakeMeals).toHaveLength(1);

      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals).toHaveLength(1);

      const allRecipes = await recipesRepo.getAllRecipes();
      expect(allRecipes).toHaveLength(1);

      const allWorkouts = await workoutsRepo.getAllWorkouts();
      expect(allWorkouts).toHaveLength(1);

      const allWorkoutTemplates =
        await workoutTemplatesRepo.getAllWorkoutTemplates();
      expect(allWorkoutTemplates).toHaveLength(1);

      const allDays = await daysRepo.getAllDays();
      expect(allDays).toHaveLength(1);

      const allUsers = await usersRepo.getAllUsers();
      expect(allUsers).toHaveLength(1);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('Transactions', () => {
    it('should rollback if deleteAllFakeMealsForUser fails', async () => {
      await initialExpectations();

      mockForThrowingError(fakeMealsRepo, 'deleteAllFakeMealsForUser');

      await expect(
        deleteUserUsecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
        }),
      ).rejects.toThrow('Mocked error in deleteAllFakeMealsForUser');

      await initialExpectations();
    });

    it('should rollback if deleteAllMealsForUser fails', async () => {
      await initialExpectations();

      mockForThrowingError(mealsRepo, 'deleteAllMealsForUser');

      await expect(
        deleteUserUsecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
        }),
      ).rejects.toThrow('Mocked error in deleteAllMealsForUser');

      await initialExpectations();
    });

    it('should rollback if deleteAllRecipesForUser fails', async () => {
      await initialExpectations();

      mockForThrowingError(recipesRepo, 'deleteAllRecipesForUser');

      await expect(
        deleteUserUsecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
        }),
      ).rejects.toThrow('Mocked error in deleteAllRecipesForUser');

      await initialExpectations();
    });

    it('should rollback if deleteAllWorkoutsForUser fails', async () => {
      await initialExpectations();

      mockForThrowingError(workoutsRepo, 'deleteAllWorkoutsForUser');

      await expect(
        deleteUserUsecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
        }),
      ).rejects.toThrow('Mocked error in deleteAllWorkoutsForUser');

      await initialExpectations();
    });

    it('should rollback if deleteAllWorkoutTemplatesForUser fails', async () => {
      await initialExpectations();

      mockForThrowingError(
        workoutTemplatesRepo,
        'deleteAllWorkoutTemplatesForUser',
      );

      await expect(
        deleteUserUsecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
        }),
      ).rejects.toThrow('Mocked error in deleteAllWorkoutTemplatesForUser');

      await initialExpectations();
    });

    it('should rollback if deleteAllDaysForUser fails', async () => {
      await initialExpectations();

      mockForThrowingError(daysRepo, 'deleteAllDaysForUser');

      await expect(
        deleteUserUsecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
        }),
      ).rejects.toThrow('Mocked error in deleteAllDaysForUser');

      await initialExpectations();
    });

    it('should rollback if deleteUser fails', async () => {
      await initialExpectations();

      mockForThrowingError(usersRepo, 'deleteUser');

      await expect(
        deleteUserUsecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
        }),
      ).rejects.toThrow('Mocked error in deleteUser');

      await initialExpectations();
    });
  });
});
