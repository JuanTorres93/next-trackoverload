"use client";

import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import FormLabelInput from "@/app/_ui/form/redesign/FormLabelInput";
import TextLink from "@/app/_ui/typography/TextLink";
import EmailInput from "@/app/_ui/user-input/EmailInput";
import PasswordInput from "@/app/_ui/user-input/PasswordInput";

function LoginForm({ ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  const { className, ...rest } = props;

  return (
    <form className={twMerge("flex flex-col gap-4.5", className)} {...rest}>
      <FormLabelInput htmlFor="email" label="Correo electrónico">
        <EmailInput id="email" />
      </FormLabelInput>

      <div className="flex flex-col gap-1.5">
        <FormLabelInput htmlFor="password" label="Contraseña">
          <PasswordInput id="password" />
        </FormLabelInput>

        {/* TODO IMPORTANT: uncomment when implementing password recovery */}
        {/* <TextLink className="ml-auto">Forgot password?</TextLink> */}
      </div>

      <div></div>

      <ButtonAction>Iniciar sesión</ButtonAction>
    </form>
  );
}

export default LoginForm;
