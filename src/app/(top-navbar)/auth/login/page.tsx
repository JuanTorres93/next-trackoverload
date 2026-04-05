import AuthPageLayout from "@/app/_features/auth/AuthPageLayout";
import LoginForm from "@/app/_features/auth/LoginForm";

export const metadata = {
  title: "Iniciar sesión",
  description: "Página de inicio de sesión",
};

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <LoginForm />
    </AuthPageLayout>
  );
}
