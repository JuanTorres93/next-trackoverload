import AuthFooter from "@/app/_features/auth/redesign/AuthFooter";
import RegisterForm from "@/app/_features/auth/redesign/RegisterForm";

import AuthPageWrapper from "../../redesign/AuthPageWrapper";

export const metadata = {
  title: "Registrarse",
  description: "Página de registro",
};

export default function RegisterPage() {
  return (
    <AuthPageWrapper
      title="Bienvenido a Cimientos"
      subtitle="Introduce tu email y contraseña para continuar."
    >
      <RegisterForm />

      <AuthFooter
        className="mt-auto"
        text="¿Ya tienes una cuenta? "
        linkText="Inicia sesión"
        linkHref="/auth/login"
      />
    </AuthPageWrapper>
  );
}
