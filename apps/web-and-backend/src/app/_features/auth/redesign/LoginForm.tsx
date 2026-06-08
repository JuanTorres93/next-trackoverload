"use client";

import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import FormLabelInput from "@/app/_ui/form/redesign/FormLabelInput";
import TextLink from "@/app/_ui/typography/TextLink";
import EmailInput from "@/app/_ui/user-input/EmailInput";
import PasswordInput from "@/app/_ui/user-input/PasswordInput";

function LoginForm({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("flex flex-col gap-4.5", className)} {...rest}>
      <FormLabelInput htmlFor="email" label="Correo electrónico">
        <EmailInput id="email" />
      </FormLabelInput>

      <div className="flex flex-col gap-1.5">
        <FormLabelInput htmlFor="password" label="Contraseña">
          <PasswordInput id="password" />
        </FormLabelInput>

        <TextLink className="ml-auto">Forgot password?</TextLink>
      </div>

      <div></div>

      <ButtonAction>Iniciar sesión</ButtonAction>
    </div>
  );
}

export default LoginForm;
