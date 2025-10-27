import RecipeCard from '@/app/_features/recipe/RecipeCard';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';

export const metadata = {
  title: 'Recetas',
  description: 'Crear una nueva receta',
};

const fakeRecipes: RecipeDTO[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Ensalada César',
    imageUrl:
      'https://newmansown.com/wp-content/uploads/2022/03/Caesar-salad-with-croutons.jpg',
    ingredientLines: [],
    calories: 250,
    protein: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Pasta al Pesto',
    imageUrl:
      'https://rana-cdn.thron.com/delivery/public/image/rana/c8561593-a8dd-4404-96ea-451d7af2f4c3/gg3i3t/std/0x0/ES-ricetta0-T_3T1A4388.jpg',
    ingredientLines: [],
    calories: 400,
    protein: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Tacos de Pollo',
    imageUrl: '',
    ingredientLines: [],
    calories: 300,
    protein: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function RecipesPage() {
  const recipes = fakeRecipes; // TODO fetch recipes from the server

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
