import { HiOutlineTrash } from 'react-icons/hi';

import ButtonDanger from './ButtonDanger';
import ButtonSecondary from './ButtonSecondary';

function ConfirmDelete({
  resourceType,
  onConfirm,
  disabled,
  onCloseModal,
  resourceName,
}: {
  resourceType: string;
  resourceName: string;
  onConfirm: () => void;
  onCloseModal: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4 text-center max-w-96 text-text-minor-emphasis ">
      <div className="p-4 rounded-2xl text-error bg-error/10">
        <HiOutlineTrash size={50} strokeWidth={1.5} />
      </div>

      <h3 className="text-xl text-text">Borrar {resourceType}</h3>

      <p className="text-base">
        ¿Estás seguro de que deseas eliminar permanentemente{' '}
        <em>{resourceName}</em>?
      </p>

      <div></div>

      <div className="flex justify-end gap-4">
        <ButtonSecondary disabled={disabled} onClick={onCloseModal}>
          Cancelar
        </ButtonSecondary>

        <ButtonDanger disabled={disabled} onClick={onConfirm}>
          Eliminar
        </ButtonDanger>
      </div>
    </div>
  );
}

export default ConfirmDelete;
