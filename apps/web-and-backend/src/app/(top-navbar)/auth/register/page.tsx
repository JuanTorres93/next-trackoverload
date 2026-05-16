import AuthPageLayout from "../../../_features/auth/AuthPageLayout";
import RegisterForm from "../../../_features/auth/RegisterForm";

export const metadata = {
  title: "Registrarse",
  description: "Página de registro",
};

export default function RegisterPage() {
  return (
    <AuthPageLayout>
      <RegisterForm />
    </AuthPageLayout>
  );
}
