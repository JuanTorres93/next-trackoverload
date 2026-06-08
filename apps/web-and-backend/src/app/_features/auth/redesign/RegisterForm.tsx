"use client";

import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import FormLabelInput from "@/app/_ui/form/redesign/FormLabelInput";
import EmailInput from "@/app/_ui/user-input/EmailInput";
import PasswordInput from "@/app/_ui/user-input/PasswordInput";

function RegisterForm({ ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  const { className, ...rest } = props;

  return (
    <form className={twMerge("flex flex-col gap-4.5", className)} {...rest}>
      <FormLabelInput htmlFor="email" label="Correo electrónico">
        <EmailInput id="email" />
      </FormLabelInput>

      <FormLabelInput htmlFor="password" label="Contraseña">
        <PasswordInput id="password" />
      </FormLabelInput>

      <FormLabelInput htmlFor="confirm-password" label="Confirmar contraseña">
        <PasswordInput id="confirm-password" />
      </FormLabelInput>

      <div></div>

      <ButtonAction>Registrarse</ButtonAction>
    </form>
  );
}

export default RegisterForm;
