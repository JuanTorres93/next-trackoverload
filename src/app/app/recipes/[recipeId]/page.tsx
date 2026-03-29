import { getRecipeByIdForLoggedInUser } from '@/app/_features/recipe/actions';
import PageWrapper from '@/app/_ui/PageWrapper';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { AppGetRecipeByIdForUserUsecase } from '@/interface-adapters/app/use-cases/recipe';
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

  if (!recipe) return { title: 'Receta no encontrada' };

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

  const calories = formatToInteger(recipe.calories);
  const protein = formatToInteger(recipe.protein);

  return (
    <PageWrapper className="max-w-5xl">
      <div className="flex flex-col gap-6">
        {/* ── Hero card ─────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden border border-border/40 shadow-md bg-surface-card">
          {/* Full-bleed image + gradient + editable title overlay */}
          <div className="relative h-72 max-bp-recipe-page-second:h-52">
            <UpdateRecipeImage recipe={recipe} />

            {/* Gradient from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

            {/* Title overlaid at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              <UpdateRecipeTitle
                originalTitle={recipe.name}
                recipeId={recipe.id}
              />
            </div>
          </div>

          {/* Macro bar */}
          <div className="flex divide-x divide-border/30 bg-surface-card">
            <RecipeMacroStat value={calories} label="Calorías" />
            <RecipeMacroStat value={`${protein} g`} label="Proteínas" />
          </div>
        </div>

        {/* ── Actions + Ingredients (client) ───────────────────────── */}
        <RecipeDisplay recipe={recipe} />
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
