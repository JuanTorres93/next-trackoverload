'use server';

import ButtonPrimary from '@/app/_ui/ButtonPrimary';
import Logo from '@/app/_ui/Logo';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import ButtonCTA from './ButtonCTA';
import Link from 'next/link';

async function NavBar({ ...props }: React.HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;

  let isLoggedIn;

  try {
    await getCurrentUserId();
    isLoggedIn = true;
  } catch {
    isLoggedIn = false;
  }

  return (
    <nav
      className={`grid grid-rows-1 grid-cols-[min-content_1fr_max-content] px-8 py-4 backdrop-blur-xs shadow-sm bg-surface-card/90 ${className}`}
      {...rest}
    >
      <div className="w-[45px]">
        <Link href="/">
          <Logo size={45} />
        </Link>
      </div>

      <div></div>

      {/* TODO IMPORTANT: change to /app once dashboard is implemented */}
      {isLoggedIn && (
        <ButtonPrimary href="/app/recipes">Ir a la app</ButtonPrimary>
      )}
      {!isLoggedIn && (
        <div className="grid gap-4 grid-cols-[max-content_min-content]">
          <ButtonPrimary href="/auth/login">Inicia sesión</ButtonPrimary>

          <ButtonCTA
            href="/auth/register"
            className="bg-primary text-text-light hover:bg-primary-light hover:border-primary-light"
          >
            Regístrate
          </ButtonCTA>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
