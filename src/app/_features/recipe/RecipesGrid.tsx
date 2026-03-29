import { twMerge } from 'tailwind-merge';
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
      className={twMerge('gap-4', className)}
      fitOrFill="fill"
      min="14rem"
      max="1fr"
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
