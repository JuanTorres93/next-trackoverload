'use client';
import { twMerge } from 'tailwind-merge';

import {
  HiArrowPath,
  HiOutlineClipboardDocumentList,
  HiOutlinePencilSquare,
} from 'react-icons/hi2';
import Modal from '@/app/_ui/Modal';
import ButtonSecondary from '@/app/_ui/buttons/ButtonSecondary';

function FoodReminderContainer({
  children,
  isEaten,
  ...props
}: { isEaten?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  async function handleReplace(e: React.MouseEvent<HTMLSpanElement>) {
    e.stopPropagation();
  }

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

        <Modal.Open opens="replacement-selection">
          <span
            onClick={(e) => handleReplace(e)}
            className={twMerge(
              'flex items-center gap-1 text-xs opacity-60 hover:text-primary! transition-colors',
              isEaten && 'hover:opacity-80 hover:text-text-light!',
            )}
          >
            <HiArrowPath className="w-6 h-6" />
          </span>
        </Modal.Open>
      </div>

      <Modal.Window name="replacement-selection">
        <MealTypeSelectionModal />
      </Modal.Window>
    </Modal>
  );
}

function MealTypeSelectionModal({
  onCloseModal,
  onSelectMeal,
  onSelectFakeMeal,
}: {
  onCloseModal?: () => void;
  onSelectMeal?: () => void;
  onSelectFakeMeal?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center max-w-96">
      <h3 className="text-xl text-text">Elige una opción para reemplazar</h3>

      <p className="text-sm text-text-minor-emphasis">
        Elige si quieres registrar una comida desde tus recetas o añadir una
        entrada rápida personalizada.
      </p>

      <div className="flex flex-col w-full gap-3">
        <MealTypeOption
          icon={<HiOutlineClipboardDocumentList className="w-6 h-6" />}
          label="Comida"
          description="Registra una comida a partir de tus recetas guardadas."
          onClick={() => {
            onSelectMeal?.();
            onCloseModal?.();
          }}
        />
        <MealTypeOption
          icon={<HiOutlinePencilSquare className="w-6 h-6" />}
          label="Entrada rápida"
          description="Añade una comida personalizada sin usar una receta."
          onClick={() => {
            onSelectFakeMeal?.();
            onCloseModal?.();
          }}
        />
      </div>

      <ButtonSecondary onClick={onCloseModal}>Cancelar</ButtonSecondary>
    </div>
  );
}

export default FoodReminderContainer;

function MealTypeOption({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 p-4 text-left transition border-2 cursor-pointer rounded-xl border-border hover:border-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="p-3 transition rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20">
        {icon}
      </div>
      <div>
        <p className="font-medium transition text-text group-hover:text-primary">
          {label}
        </p>
        <p className="text-xs text-text-minor-emphasis">{description}</p>
      </div>
    </button>
  );
}
