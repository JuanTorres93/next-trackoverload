import {
  HiOutlineClipboardDocumentList,
  HiOutlinePencilSquare,
} from 'react-icons/hi2';
import Modal from '@/app/_ui/Modal';
import ButtonSecondary from '@/app/_ui/buttons/ButtonSecondary';

export function MealTypeSelectionModal({
  onCloseModal,
  title = 'Elige una opción para reemplazar',
}: {
  onCloseModal?: () => void;
  title?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center max-w-96">
      <h3 className="text-xl text-text">{title}</h3>

      <p className="text-sm text-text-minor-emphasis">
        Elige si quieres registrar una comida desde tus recetas o añadir una
        entrada rápida personalizada.
      </p>

      <div className="flex flex-col w-full gap-3">
        <Modal.Open opens="select-recipe">
          <MealTypeOption
            icon={<HiOutlineClipboardDocumentList className="w-6 h-6" />}
            label="Comida"
            description="Registra una comida a partir de tus recetas guardadas."
            onClick={() => {}}
          />
        </Modal.Open>

        <Modal.Open opens="add-fake-meal">
          <MealTypeOption
            icon={<HiOutlinePencilSquare className="w-6 h-6" />}
            label="Entrada rápida"
            description="Añade una comida personalizada sin usar una receta."
            onClick={() => {}}
          />
        </Modal.Open>
      </div>

      <ButtonSecondary onClick={onCloseModal}>Cancelar</ButtonSecondary>
    </div>
  );
}

export function MealTypeOption({
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
