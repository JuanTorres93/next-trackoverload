import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { ImagesRepo } from '@/domain/repos/ImagesRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';

export type CreateMealFromRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
};

export class CreateMealFromRecipeUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private recipesRepo: RecipesRepo,
    private mealsRepo: MealsRepo,
    private imagesRepo: ImagesRepo,
    private idGenerator: IdGenerator
  ) {}

  async execute(request: CreateMealFromRecipeUsecaseRequest): Promise<MealDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `CreateMealFromRecipeUsecase: User with id ${request.userId} not found`
      );
    }

    const recipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.recipeId,
      request.userId
    );

    if (!recipe) {
      throw new NotFoundError(
        `CreateMealFromRecipeUsecase: Recipe with id ${request.recipeId} not found`
      );
    }

    const newMealId = this.idGenerator.generateId();

    // Create copy of ingredient lines
    const newMealIngredientLines = recipe.ingredientLines.map(
      (recipeLine: IngredientLine) => {
        return IngredientLine.create({
          id: this.idGenerator.generateId(),
          parentId: newMealId,
          parentType: 'meal',
          ingredient: recipeLine.ingredient,
          quantityInGrams: recipeLine.quantityInGrams,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    );

    let imageUrl: string | undefined = undefined;

    if (recipe.imageUrl) {
      // Check if any meal has been created from this recipe
      const existingMeals = await this.mealsRepo.getMealsByRecipeIdAndUserId(
        recipe.id,
        request.userId
      );

      // If so, reuse the image URL
      if (existingMeals.length > 0) {
        imageUrl = existingMeals[0].imageUrl;
      }
      // Otherwise, duplicate recipe image for the meal
      else {
        const originalImageMetadata = await this.imagesRepo.getByUrl(
          recipe.imageUrl
        );

        if (originalImageMetadata) {
          const newFilename = `meal-image-${newMealId}${Date.now()}`;

          const newImageUrl = this.imagesRepo.generateUrl(newFilename);

          const duplicatedImageMetadata = await this.imagesRepo.duplicateByUrl(
            recipe.imageUrl,
            newFilename,
            newImageUrl
          );

          imageUrl = duplicatedImageMetadata.url;
        }
      }
    }

    const newMeal = Meal.create({
      id: newMealId,
      userId: request.userId,
      name: recipe.name,
      createdFromRecipeId: recipe.id,
      ingredientLines: newMealIngredientLines,
      imageUrl: imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.mealsRepo.saveMeal(newMeal);

    return toMealDTO(newMeal);
  }
}
