"use client";
import { useRouter } from "next/navigation";

import AuthCard from "@/app/_features/auth/AuthCard";
import AuthLink from "@/app/_features/auth/AuthLink";
import { useFormSetup } from "@/app/_hooks/useFormSetup";
import Input from "@/app/_ui/Input";
import PasswordInput from "@/app/_ui/PasswordInput";
import SpinnerMini from "@/app/_ui/SpinnerMini";
import ButtonPrimary from "@/app/_ui/buttons/ButtonPrimary";
import FormEntry from "@/app/_ui/form/FormEntry";
import { showErrorToast } from "@/app/_ui/showErrorToast";

export type LoginFormState = {
  email: string;
  plainPassword: string;
};

const INITIAL_FORM_STATE: LoginFormState = {
  email: "",
  plainPassword: "",
};

function LoginForm() {
  const router = useRouter();
  const { formState, setField, isLoading, setIsLoading } =
    useFormSetup<LoginFormState>(INITIAL_FORM_STATE);

  const isFormInvalid =
    !formState.email || !formState.plainPassword || isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const jsonResponse = await response.json();

        const errorMessage =
          jsonResponse.status === "fail"
            ? Object.values(jsonResponse.data).join(" ")
            : jsonResponse.message || "Error al iniciar sesión.";

        showErrorToast(errorMessage);
        return;
      }

      // Wait for the new session cookie to be set before refreshing and redirecting
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.refresh();
      router.push("/app");
    } catch {
      showErrorToast("Error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Inicia sesión"
      subtitle={
        <>
          ¿No tienes una cuenta?{" "}
          <AuthLink className="inline" href="/auth/register">
            Regístrate
          </AuthLink>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormEntry labelText="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={formState.email}
            disabled={isLoading}
            placeholder="Email"
            onChange={(e) => setField("email", e.target.value)}
            required
          />
        </FormEntry>

        <FormEntry labelText="Contraseña" htmlFor="password">
          <PasswordInput
            id="password"
            type="password"
            placeholder="Contr@s3ña"
            disabled={isLoading}
            value={formState.plainPassword}
            onChange={(e) => setField("plainPassword", e.target.value)}
            required
          />
        </FormEntry>

        <ButtonPrimary
          className="mt-2 w-full justify-center bg-primary text-text-light hover:bg-primary-light hover:border-primary-light"
          type="submit"
          disabled={isFormInvalid}
        >
          {isLoading && <SpinnerMini className="mx-auto" />}
          {!isLoading && "Iniciar sesión"}
        </ButtonPrimary>
      </form>
    </AuthCard>
  );
}

export default LoginForm;
