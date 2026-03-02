import { getRecipeByIdForLoggedInUser } from '@/app/_features/recipe/actions';
import PageWrapper from '@/app/_ui/PageWrapper';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { AppGetRecipeByIdForUserUsecase } from '@/interface-adapters/app/use-cases/recipe';
import MacroData from './MacroData';
import RecipeDisplay from './RecipeDisplay';
import UpdateRecipeImage from './UpdateRecipeImage';
import UpdateRecipeTitle from './UpdateRecipeTitle';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;
  const recipe = await AppGetRecipeByIdForUserUsecase.execute({
    id: recipeId,
    userId: await getCurrentUserId(),
  });

  if (!recipe) {
    return {
      title: 'Receta no encontrada',
    };
  }

  return {
    title: recipe.name,
    description: `Detalles de la receta: ${recipe.name}`,
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;

  const recipe: RecipeDTO | null = await getRecipeByIdForLoggedInUser(recipeId);

  if (!recipe) return <PageWrapper>No se encontró la receta</PageWrapper>;

  return (
    <PageWrapper className="max-w-7xl ">
      <div className="grid grid-cols-1 gap-10 max-bp-recipe-page:gap-16 max-bp-recipe-page-second:gap-6">
        <header className="grid relative items-center w-full bg-gradient-to-l border border-border from-surface-dark to-surface-dark/60 rounded-2xl grid-cols-[20rem_1fr] grid-rows-[15rem] gap-6 text-text-light max-bp-recipe-page:grid-cols-1 max-bp-recipe-page:grid-rows-[12rem_1fr]">
          <UpdateRecipeImage
            className="overflow-hidden rounded-tl-2xl rounded-bl-2xl max-bp-recipe-page:rounded-tr-2xl max-bp-recipe-page:rounded-bl-none"
            recipe={recipe}
          />

          <UpdateRecipeTitle
            className="mr-6 max-bp-recipe-page:mr-0 max-bp-recipe-page:text-center max-bp-recipe-page:mx-2 max-bp-recipe-page:mb-12 max-bp-recipe-page-second:mb-0"
            originalTitle={recipe.name}
            recipeId={recipe.id}
          />

          <div className="absolute flex justify-center gap-4 -bottom-4 right-1/6 z-5 max-bp-recipe-page:left-1/2 max-bp-recipe-page:-translate-x-1/2 max-bp-recipe-page:-bottom-8 max-bp-recipe-page-second:static max-bp-recipe-page-second:translate-x-0  max-bp-recipe-page-second:grid max-bp-recipe-page-second:grid-cols-[min-content] max-bp-recipe-page-second:gap-2 max-bp-recipe-page-second:mb-2">
            <MacroData
              value={formatToInteger(recipe.calories)}
              label="Calorías"
            />
            <MacroData
              value={`${formatToInteger(recipe.protein)} g`}
              label="Proteínas"
            />
          </div>
        </header>

        {/* Needs to be a separate component for interactivity through event handlers */}
        <RecipeDisplay recipe={recipe} />
      </div>
    </PageWrapper>
  );
}
