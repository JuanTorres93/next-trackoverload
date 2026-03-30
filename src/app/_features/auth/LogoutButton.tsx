'use client';

import SpinnerMini from '@/app/_ui/SpinnerMini';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';

function LogoutButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Wait for the session cookie to be cleared before refreshing and redirecting
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.refresh();
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      {...rest}
      className={twMerge(
        'flex rounded-lg p-2 w-full items-center text-text-minor-emphasis hover:text-text hover:bg-surface-light cursor-pointer transition',
        className,
      )}
      onClick={handleLogout}
      data-testid="logout-button"
    >
      <span className="mr-2">
        {isLoading && <SpinnerMini />}
        {!isLoading && <FiLogOut />}
      </span>
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;
