import { AppGetRecipeByIdForUserUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import PageWrapper from '@/app/_ui/PageWrapper';
import RecipeDisplay from './RecipeLinesDisplay';
import Image from 'next/image';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';

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

  if (!recipe) return <PageWrapper>No recipe found</PageWrapper>;

  return (
    <PageWrapper>
      <div className="flex flex-col gap-20">
        <header className="grid items-center w-full rounded-2xl  gap-8 p-2 pr-6 grid-cols-[max-content_minmax(min-content,60rem)] grid-rows-[max-content_min-content] bg-green-800 text-zinc-100">
          <Image
            src={recipe.imageUrl || '/recipe-no-picture.png'}
            alt={recipe.name}
            width={300}
            height={200}
            className="row-span-2 rounded-2xl"
          />
          <h1 className="self-center font-bold text-center text-7xl">
            {recipe.name}
          </h1>

          <div className="flex justify-center gap-28">
            <NutritionalInfoValue
              styleNumber="text-3xl text-zinc-300"
              styleLabel="text-lg text-zinc-300!"
              number={recipe.calories}
              label="Calorías"
            />
            <NutritionalInfoValue
              styleNumber="text-3xl text-zinc-300"
              styleLabel="text-lg text-zinc-300!"
              number={recipe.protein}
              label="Proteínas"
            />
          </div>
        </header>

        {/* Needs to be a separate component for interactivity through event handlers */}
        <div>
          <h2 className="pb-3 mb-6 text-4xl font-bold">Ingredientes</h2>

          <RecipeDisplay recipe={recipe} />
        </div>
      </div>
    </PageWrapper>
  );
}
