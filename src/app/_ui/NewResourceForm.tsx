'use client';

import React from 'react';
import ButtonNew from './ButtonNew';

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  children: React.ReactNode;
  submitText?: string;
  isPending?: boolean;
  disableSubmit?: boolean;
  ref?: React.Ref<HTMLFormElement>;
  errorMessage?: string;
};

export function Form({
  children,
  submitText,
  isPending,
  disableSubmit,
  errorMessage,
  ...props
}: FormProps) {
  return (
    <form className="flex flex-col gap-4" {...props}>
      {children}

      <ButtonNew type="submit" disabled={isPending || disableSubmit}>
        {submitText || 'Enviar'}
      </ButtonNew>
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
