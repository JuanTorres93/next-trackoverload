"use client";

import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import EmailInput from "@/app/_ui/user-input/EmailInput";
import PasswordInput from "@/app/_ui/user-input/PasswordInput";

function RegisterForm({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("", className)} {...rest}>
      <EmailInput />

      <PasswordInput />
      <PasswordInput />

      <ButtonAction>Registrarse</ButtonAction>
    </div>
  );
}

export default RegisterForm;
