'use client';
import { twMerge } from 'tailwind-merge';

import { HiArrowPath } from 'react-icons/hi2';
import Modal from '@/app/_ui/Modal';
import SelectRecipeForm from '@/app/_features/recipe/SelectRecipeForm';
import AddFakeMealForm from '@/app/_features/fakemeal/AddFakeMealForm';
import { MealTypeSelectionModal } from './MealTypeModal';

export type ReplacementConfig = {
  replaceMealRequest: (recipeId: string) => Promise<void>;

  replaceFakeMealRequest: (
    name: string,
    calories: number,
    protein: number,
  ) => Promise<void>;
};

function FoodReminderContainer({
  children,
  isEaten,
  replacement,
  ...props
}: {
  isEaten?: boolean;
  replacement?: ReplacementConfig;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <Modal>
      <div
        {...rest}
        className={twMerge(
          'bg-surface-card relative grid grid-cols-[1fr_min-content] gap-4 grid-rows-1! shadow-sm p-2 rounded-xl overflow-hidden hover:scale-[1.02] cursor-pointer transition',
          isEaten && 'bg-primary! text-text-light shadow-xs! scale-[0.97]!',
          className,
        )}
      >
        {children}

        {replacement && (
          <Modal.Open opens="replacement-selection">
            <button
              type="button"
              aria-label="Cambiar comida"
              data-testid="replace-food-button"
              className={twMerge(
                'flex items-center gap-1 text-xs opacity-60 hover:text-primary! transition-colors',
                isEaten && 'hover:opacity-80 hover:text-text-light!',
              )}
            >
              <HiArrowPath className="w-6 h-6" />
            </button>
          </Modal.Open>
        )}
      </div>

      <Modal.Window name="replacement-selection">
        <MealTypeSelectionModal />
      </Modal.Window>

      {replacement && (
        <>
          <Modal.Window name="select-recipe">
            <ReplacementRecipeModal replacement={replacement} />
          </Modal.Window>

          <Modal.Window name="add-fake-meal">
            <ReplacementFakeMealModal replacement={replacement} />
          </Modal.Window>
        </>
      )}
    </Modal>
  );
}

function ReplacementRecipeModal({
  replacement,
  onCloseModal,
}: {
  replacement: ReplacementConfig;
  onCloseModal?: () => void;
}) {
  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <SelectRecipeForm
        addMealsRequest={(recipeIds) =>
          replacement.replaceMealRequest(recipeIds[0])
        }
        onSuccess={onCloseModal}
      />
    </div>
  );
}

function ReplacementFakeMealModal({
  replacement,
  onCloseModal,
}: {
  replacement: ReplacementConfig;
  onCloseModal?: () => void;
}) {
  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <AddFakeMealForm
        submitAction={(name, calories, protein) =>
          replacement.replaceFakeMealRequest(name, calories, protein)
        }
        submitLabel="Reemplazar"
        onSuccess={onCloseModal}
      />
    </div>
  );
}

export default FoodReminderContainer;
