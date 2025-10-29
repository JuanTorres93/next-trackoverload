import RecipeCard from '@/app/_features/recipe/RecipeCard';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { AppGetAllRecipesForUserUsecase } from '@/interface-adapters/app/use-cases/recipe/GetAllRecipesForUser/getAllRecipesForUser';

export const metadata = {
  title: 'Recetas',
  description: 'Crear una nueva receta',
};

export default async function RecipesPage() {
  const recipes: RecipeDTO[] = await AppGetAllRecipesForUserUsecase.execute({
    userId: 'dev-user',
  }); // TODO IMPORTANT get user id from session

  return (
    <div className="p-6">
      {recipes.length === 0 ? (
        <p className="text-center text-zinc-500">No hay recetas</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> */}
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
