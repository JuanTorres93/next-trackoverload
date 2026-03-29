'use client';
import ConfirmDelete from '@/app/_ui/ConfirmDeleteModal';
import Modal from '@/app/_ui/Modal';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { HiCheck, HiTrash } from 'react-icons/hi';
import LoadingOverlay from '../common/LoadingOverlay';
import { isNextRedirectError } from '../common/handleNextRedirectError';
import { deleteRecipe } from './actions';

function RecipeCard({
  recipe,
  asLink = true,
  onClick,
  isSelected = false,
}: {
  recipe: RecipeDTO;
  asLink?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const Wrapper = asLink ? Link : 'div';
  const calories = formatToInteger(recipe.calories);
  const protein = formatToInteger(recipe.protein);

  function handleNavigationClick() {
    setIsNavigating(true);
  }

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await deleteRecipe(recipe.id);
    } catch (error) {
      if (isNextRedirectError(error)) return;

      showErrorToast('Error al eliminar la receta.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal>
      <div
        className={`relative rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all bg-surface-card ${
          isSelected
            ? 'border-primary ring-2 ring-primary/30'
            : 'border-border/40'
        }`}
      >
        {(isNavigating || isDeleting) && (
          <LoadingOverlay className="z-20 rounded-2xl" />
        )}

        {/* Delete button: absolutely positioned OUTSIDE the Link to avoid triggering navigation */}
        {asLink && (
          <Modal.Open opens="confirm-delete-recipe-modal">
            <button className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white/90 hover:text-white hover:bg-black/70 transition cursor-pointer">
              <HiTrash size={14} />
            </button>
          </Modal.Open>
        )}

        {isSelected && (
          <div className="absolute z-10 flex items-center justify-center w-5 h-5 rounded-full pointer-events-none top-3 left-3 bg-primary">
            <HiCheck className="text-xs text-white" />
          </div>
        )}

        {/* Clickable content area — Link or div */}
        <Wrapper
          href={`/app/recipes/${recipe.id}`}
          className="block cursor-pointer"
          onClick={asLink ? handleNavigationClick : onClick}
        >
          {/* Image + gradient + overlaid title */}
          <div className="relative h-44">
            <Image
              src={recipe.imageUrl ?? '/recipe-no-picture.webp'}
              alt={recipe.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
              <h2 className="text-sm font-semibold leading-snug text-white drop-shadow-md line-clamp-2">
                {recipe.name}
              </h2>
            </div>
          </div>

          {/* Macro bar */}
          <div className="flex divide-x divide-border/30">
            <MacroStat value={calories} label="Calorías" />
            <MacroStat value={protein} label="Proteínas" />
          </div>
        </Wrapper>

        <Modal.Window name="confirm-delete-recipe-modal">
          <ConfirmDelete
            onConfirm={handleDelete}
            onCloseModal={() => {}}
            resourceName={recipe.name}
            resourceType="receta"
            disabled={isDeleting}
          />
        </Modal.Window>
      </div>
    </Modal>
  );
}

function MacroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center flex-1 py-3">
      <span className="text-base font-bold text-primary-shade">{value}</span>
      <span className="text-xs text-text-minor-emphasis">{label}</span>
    </div>
  );
}

export default RecipeCard;
