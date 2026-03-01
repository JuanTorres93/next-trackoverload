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
      <div className="grid grid-cols-1 gap-20">
        <header className="grid relative items-center w-full bg-gradient-to-l border border-border from-surface-dark to-surface-dark/60 rounded-2xl grid-cols-[20rem_1fr] grid-rows-[15rem] gap-6 text-text-light">
          <UpdateRecipeImage
            className="overflow-hidden rounded-tl-2xl rounded-bl-2xl"
            recipe={recipe}
          />

          <UpdateRecipeTitle originalTitle={recipe.name} recipeId={recipe.id} />

          <div className="absolute flex justify-center gap-4 -bottom-4 right-1/6 z-5">
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
