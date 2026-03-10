import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import RecipeCard from './RecipeCard';
import GridAutoCols from '@/app/_ui/GridAutoCols';

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
    <GridAutoCols
      className={`gap-4 ${className}`}
      fitOrFill="fit"
      min="15rem"
      max="2rem"
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
    </GridAutoCols>
  );
}

export default RecipesGrid;
