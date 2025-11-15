import { AppGetRecipeByIdForUserUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import PageWrapper from '@/app/_ui/PageWrapper';
import RecipeDisplay from './RecipeDisplay';
import Image from 'next/image';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import UpdateRecipeTitle from './UpdateRecipeTitle';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;
  const recipe = await AppGetRecipeByIdForUserUsecase.execute({
    id: recipeId,
    userId: 'dev-user', // TODO IMPORTANT: Replace with actual user ID from authenticated user
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
      userId: 'dev-user', // TODO IMPORTANT: Replace with actual user ID from authenticated user
    }
  );

  if (!recipe) return <PageWrapper>No se encontró la receta</PageWrapper>;

  return (
    <PageWrapper>
      <div className="flex flex-col gap-20">
        <header className="grid items-center w-full rounded-2xl gap-8 p-2 pr-6 grid-cols-[max-content_minmax(1rem,1fr)] grid-rows-[max-content_min-content] bg-green-800 text-zinc-100">
          <Image
            src={recipe.imageUrl || '/recipe-no-picture.png'}
            alt={recipe.name}
            width={300}
            height={200}
            className="row-span-2 rounded-2xl"
          />

          <UpdateRecipeTitle originalTitle={recipe.name} recipeId={recipe.id} />

          <div className="flex justify-center gap-28">
            <NutritionalInfoValue
              styleNumber="text-3xl text-zinc-300"
              styleLabel="text-lg text-zinc-300!"
              number={formatToInteger(recipe.calories)}
              label="Calorías"
            />
            <NutritionalInfoValue
              styleNumber="text-3xl text-zinc-300"
              styleLabel="text-lg text-zinc-300!"
              number={formatToInteger(recipe.protein)}
              label="Proteínas"
            />
          </div>
        </header>

        <div>
          <h2 className="pb-3 mb-6 text-4xl font-bold">Ingredientes</h2>

          {/* Needs to be a separate component for interactivity through event handlers */}
          <RecipeDisplay recipe={recipe} />
        </div>
      </div>
    </PageWrapper>
  );
}
