import LoginForm from '@/app/_features/auth/LoginForm';

export const metadata = {
  title: 'Iniciar sesión',
  description: 'Página de inicio de sesión',
};

export default function LoginPage() {
  return (
    <div className="">
      <main className="flex items-center justify-center w-dvw h-dvh">
        <LoginForm />
      </main>
    </div>
  );
}
