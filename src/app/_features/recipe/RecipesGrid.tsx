import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import RecipeCard from './RecipeCard';

function RecipesGrid({
  recipes,
  selectedRecipesIds,
  asLink = true,
  onClick,
  ...props
}: {
  recipes: RecipeDTO[];
  selectedRecipesIds?: string[];
  asLink?: boolean;
  onClick?: (recipeId: string) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>) {
  const { className, ...rest } = props;

  return (
    <div
      className={`grid grid-cols-[repeat(auto-fit,minmax(15rem,2rem))] gap-4 ${className}`}
      {...rest}
    >
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          asLink={asLink}
          onClick={onClick ? () => onClick(recipe.id) : undefined}
          isSelected={selectedRecipesIds?.includes(recipe.id) ?? false}
        />
      ))}
    </div>
  );
}

export default RecipesGrid;
