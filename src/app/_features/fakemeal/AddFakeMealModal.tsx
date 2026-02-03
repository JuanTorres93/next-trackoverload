import AddFakeMealForm from './AddFakeMealForm';

function AddFakeMealModal({ dayId }: { dayId: string }) {
  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <AddFakeMealForm />
    </div>
  );
}

export default AddFakeMealModal;
