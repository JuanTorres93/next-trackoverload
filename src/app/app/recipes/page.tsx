import RecipeCard from '@/app/_features/recipe/RecipeCard';

export const metadata = {
  title: 'Recetas',
  description: 'Crear una nueva receta',
};

export default function RecipesPage() {
  const recipes = [4, 3, 3, 3, 3, 3, 3, 3, 3, 3]; // TODO fetch recipes from the server

  return (
    <div>
      {recipes.length === 0 ? (
        <p className="text-center text-zinc-500">No hay recetas</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> */}
          {recipes.map((recipe, index) => (
            // <RecipeCard key={recipe.id} recipe={recipe} />
            <RecipeCard key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
