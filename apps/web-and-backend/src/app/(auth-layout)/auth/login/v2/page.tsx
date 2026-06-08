import AuthFooter from "@/app/_features/auth/redesign/AuthFooter";
import LoginForm from "@/app/_features/auth/redesign/LoginForm";

import AuthPageWrapper from "../../redesign/AuthPageWrapper";

export const metadata = {
  title: "Iniciar sesión",
  description: "Página de inicio de sesión",
};

export default function LoginPage() {
  return (
    <AuthPageWrapper
      title="Bienvenido de nuevo!"
      subtitle="Introduce tu email y contraseña para continuar."
    >
      <LoginForm />

      <AuthFooter
        className="mt-auto"
        text="¿No tienes una cuenta? "
        linkText="Regístrate"
        linkHref="/auth/register"
      />
    </AuthPageWrapper>
  );
}
