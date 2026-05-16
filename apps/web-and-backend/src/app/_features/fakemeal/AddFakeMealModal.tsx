import AddFakeMealForm from './AddFakeMealForm';

function AddFakeMealModal({
  dayId,
  onCloseModal,
}: {
  dayId: string;
  onCloseModal?: () => void;
}) {
  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <AddFakeMealForm dayId={dayId} onSuccess={onCloseModal} />
    </div>
  );
}

export default AddFakeMealModal;
