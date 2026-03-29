import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import Image from 'next/image';
import { HiCheck } from 'react-icons/hi';

const blurDataURL =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    `
    <svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'>
      <rect width='100%' height='100%' fill='#e5e5e5'/>
    </svg>
  `,
  ).toString('base64');

function IngredientItemMini({
  ingredient,
  isSelected = false,
  ...props
}: {
  ingredient: IngredientDTO;
  isSelected?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const calories = formatToInteger(ingredient.nutritionalInfoPer100g.calories);
  const protein = formatToInteger(ingredient.nutritionalInfoPer100g.protein);

  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer select-none transition-all
        ${
          isSelected
            ? 'bg-primary/8 border border-primary/25'
            : 'bg-surface-card border border-transparent hover:border-border/40 hover:bg-surface-light'
        }`}
      {...props}
    >
      {/* Thumbnail */}
      <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-surface-light">
        <Image
          fill
          src={ingredient.imageUrl || '/ingredient-no-picture.webp'}
          alt="Ingredient Image"
          placeholder="blur"
          blurDataURL={blurDataURL}
          className={`object-cover transition ${isSelected ? 'opacity-50' : ''}`}
        />
      </div>

      {/* Name */}
      <span
        className={`flex-1 font-semibold text-sm leading-tight ${
          isSelected ? 'text-text-minor-emphasis' : 'text-text'
        }`}
      >
        {ingredient.name}
      </span>

      {/* Macros */}
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-xs font-medium text-text-minor-emphasis">
          {calories} kcal
        </span>
        <span className="text-xs font-medium text-primary">{protein}g prot</span>
      </div>

      {/* Selected check */}
      {isSelected ? (
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
          <HiCheck className="text-white text-xs" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full border border-border/50 shrink-0" />
      )}
    </div>
  );
}

export default IngredientItemMini;
