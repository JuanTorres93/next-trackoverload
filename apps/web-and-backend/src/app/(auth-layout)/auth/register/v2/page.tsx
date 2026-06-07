import AuthPageWrapper from "../../redesign/AuthPageWrapper";

export const metadata = {
  title: "Iniciar sesión",
  description: "Página de inicio de sesión",
};

export default function RegisterPage() {
  return (
    <AuthPageWrapper
      title="Bienvenido a Cimientos"
      subtitle="Introduce tu email y contraseña para continuar."
    >
      REGISTER
    </AuthPageWrapper>
  );
}
