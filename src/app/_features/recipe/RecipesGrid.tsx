import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import RecipeCard from './RecipeCard';

function RecipesGrid({
  recipes,
  asLink = true,
  ...props
}: {
  recipes: RecipeDTO[];
  asLink?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={`grid grid-cols-[repeat(auto-fit,minmax(15rem,2rem))] gap-4 ${className}`}
      {...rest}
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} asLink={asLink} />
      ))}
    </div>
  );
}

export default RecipesGrid;
