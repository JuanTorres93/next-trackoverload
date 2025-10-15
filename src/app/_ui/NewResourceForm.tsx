function Form({
  children,
  submitText,
}: {
  children: React.ReactNode;
  submitText?: string;
}) {
  return (
    <form className="flex flex-col gap-4">
      {children}

      <button
        type="submit"
        className="mt-4 font-medium bg-gradient-to-b from-green-400 to-green-500 text-white py-2 px-4 rounded-lg hover:cursor-pointer hover:from-green-500 transition"
      >
        {submitText || 'Enviar'}
      </button>
    </form>
  );
}

function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-zinc-600">{label}</label>
      {children}
    </div>
  );
}

Form.FormRow = FormRow;

export default Form;
