import RegisterForm from '@/app/_features/auth/RegisterForm';

export const metadata = {
  title: 'Registrarse',
  description: 'Página de registro',
};

export default function RegisterPage() {
  return (
    <div className="">
      <main className="flex items-center justify-center w-dvw h-dvh">
        <RegisterForm />
      </main>
    </div>
  );
}
