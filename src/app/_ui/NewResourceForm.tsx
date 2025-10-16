'use client';

import React from 'react';

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  children: React.ReactNode;
  submitText?: string;
  isPending?: boolean;
  ref?: React.Ref<HTMLFormElement>;
  errorMessage?: string;
};

export function Form({
  children,
  submitText,
  isPending,
  errorMessage,
  ...props
}: FormProps) {
  return (
    <form className="flex flex-col gap-4" {...props}>
      {children}

      <button
        type="submit"
        className="mt-4 font-medium bg-gradient-to-b from-green-400 to-green-500 text-white py-2 px-4 rounded-lg hover:cursor-pointer hover:from-green-500 transition"
        disabled={isPending}
      >
        {submitText || 'Enviar'}
      </button>
      {errorMessage && (
        <div className="text-sm text-red-400">{errorMessage}</div>
      )}
    </form>
  );
}

function FormRow({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-zinc-600">{label}</label>
      {children}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

Form.FormRow = FormRow;

export default Form;
