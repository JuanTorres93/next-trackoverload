import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import PageWrapper from '@/app/_ui/PageWrapper';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { AppGetRecipeByIdForUserUsecase } from '@/interface-adapters/app/use-cases/recipe';
import RecipeDisplay from './RecipeDisplay';
import UpdateRecipeImage from './UpdateRecipeImage';
import UpdateRecipeTitle from './UpdateRecipeTitle';
import SectionHeading from '@/app/_ui/typography/SectionHeading';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';

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
  const recipe: RecipeDTO | null = await AppGetRecipeByIdForUserUsecase.execute(
    {
      id: recipeId,
      userId: await getCurrentUserId(),
    },
  );

  if (!recipe) return <PageWrapper>No se encontró la receta</PageWrapper>;

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 gap-20">
        <header className="grid items-center w-full rounded-2xl gap-8 p-2 pr-6 grid-cols-[max-content_minmax(1rem,1fr)] grid-rows-[max-content_min-content] bg-surface-dark text-text-light">
          <UpdateRecipeImage recipe={recipe} className="row-span-2 " />

          <UpdateRecipeTitle originalTitle={recipe.name} recipeId={recipe.id} />

          <div className="flex justify-center gap-28">
            <NutritionalInfoValue
              styleNumber="text-3xl text-text-light"
              styleLabel="text-lg text-text-light!"
              number={formatToInteger(recipe.calories)}
              label="Calorías"
            />
            <NutritionalInfoValue
              styleNumber="text-3xl text-text-light"
              styleLabel="text-lg text-text-light!"
              number={formatToInteger(recipe.protein)}
              label="Proteínas"
            />
          </div>
        </header>

        <div>
          <SectionHeading>
            <h2>Ingredientes</h2>
          </SectionHeading>

          {/* Needs to be a separate component for interactivity through event handlers */}
          <RecipeDisplay recipe={recipe} />
        </div>
      </div>
    </PageWrapper>
  );
}
