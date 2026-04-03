import { HiOutlineEmojiSad } from "react-icons/hi";

import { getRecipeByIdForLoggedInUser } from "@/app/_features/recipe/actions";
import PageWrapper from "@/app/_ui/PageWrapper";
import ButtonPrimary from "@/app/_ui/buttons/ButtonPrimary";
import { getCurrentUserId } from "@/app/_utils/auth/getCurrentUserId";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";
import { AppGetRecipeByIdForUserUsecase } from "@/interface-adapters/app/use-cases/recipe";

import RecipeActions from "./RecipeActions";
import UpdateRecipeImage from "./UpdateRecipeImage";
import UpdateRecipeTitle from "./UpdateRecipeTitle";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;
  const recipe: RecipeDTO | null = await getRecipeByIdForLoggedInUser(recipeId);

  if (!recipe) return <RecipeNotFound />;

  return (
    <PageWrapper className="max-w-5xl">
      <div className="flex flex-col gap-6">
        <HeroCard recipe={recipe} />

        <RecipeActions recipe={recipe} />
      </div>
    </PageWrapper>
  );
}

function HeroCard({ recipe }: { recipe: RecipeDTO }) {
  const calories = formatToInteger(recipe.calories);
  const protein = formatToInteger(recipe.protein);

  return (
    <div className="overflow-hidden border shadow-md rounded-2xl border-border/40 bg-surface-card">
      <div className="relative h-72 max-bp-recipe-page-second:h-52">
        <UpdateRecipeImage recipe={recipe} />

        {/* Gradient from bottom */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Title overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
          <UpdateRecipeTitle originalTitle={recipe.name} recipeId={recipe.id} />
        </div>
      </div>

      {/* Macro bar */}
      <div className="flex divide-x divide-border/30 bg-surface-card">
        <RecipeMacroStat value={calories} label="Calorías" />
        <RecipeMacroStat value={`${protein} g`} label="Proteínas" />
      </div>
    </div>
  );
}

function RecipeNotFound() {
  return (
    <PageWrapper className="max-w-5xl">
      <div className="flex flex-col items-center gap-4 py-20 border border-dashed border-border/40 rounded-2xl text-text-minor-emphasis">
        <HiOutlineEmojiSad className="text-5xl opacity-30" />
        <div className="text-center">
          <p className="font-semibold">Receta no encontrada</p>
          <p className="mt-1 text-sm opacity-60">
            Puede que la receta haya sido eliminada o que el enlace no sea
            correcto.
          </p>
        </div>
        <ButtonPrimary href="/app/recipes">Ver mis recetas</ButtonPrimary>
      </div>
    </PageWrapper>
  );
}

function RecipeMacroStat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
      <span className="text-2xl font-bold text-primary-shade">{value}</span>
      <span className="text-xs tracking-widest uppercase text-text-minor-emphasis/70">
        {label}
      </span>
    </div>
  );
}

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

  if (!recipe) return { title: "Receta no encontrada" };

  return {
    title: recipe.name,
    description: `Detalles de la receta: ${recipe.name}`,
  };
}
