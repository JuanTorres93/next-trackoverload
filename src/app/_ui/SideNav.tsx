'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HiBookOpen,
  HiCalendarDays,
  HiClipboardDocumentList,
  HiCreditCard,
  HiFire,
  HiHome,
  HiSquares2X2,
  HiUserCircle,
} from 'react-icons/hi2';
import { FiLogOut } from 'react-icons/fi';

import TextRegular from './typography/TextRegular';
import { useState } from 'react';
import AuthSpinner from '../auth/common/AuthSpinner';

function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const links = [
    { href: '/app', label: 'Inicio', icon: <HiHome /> },
    // { href: '/app/ingredients', label: 'Ingredientes', icon: <HiBeaker /> },
    { href: '/app/recipes', label: 'Recetas', icon: <HiBookOpen /> },
    { href: '/app/meals', label: 'Comidas', icon: <HiCalendarDays /> },
    { href: '/app/templates', label: 'Plantillas', icon: <HiSquares2X2 /> },
    { href: '/app/workouts', label: 'Entrenos', icon: <HiFire /> },
    {
      href: '/app/exercises',
      label: 'Ejercicios',
      icon: <HiClipboardDocumentList />,
    },
    { href: '/app/profile', label: 'Perfil', icon: <HiUserCircle /> },
    { href: '/subscription', label: 'Suscripción', icon: <HiCreditCard /> },
  ];

  async function handleLogout() {
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <nav>
      <ul className="flex flex-col w-full gap-1 p-4">
        {/* TODO: PONER EL LOGO Arriba de la navbar */}
        <li>LOGO</li>

        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <NavItem icon={link.icon} isActive={pathname === link.href}>
                {link.label}
              </NavItem>
            </Link>
          </li>
        ))}

        <li className="mt-40">
          <NavItem
            icon={isLoading ? <AuthSpinner /> : <FiLogOut />}
            isActive={false}
            onClick={handleLogout}
          >
            Cerrar sesión
          </NavItem>
        </li>
      </ul>
    </nav>
  );
}

function NavItem({
  icon,
  isActive,
  children,
  ...props
}: {
  icon: React.ReactNode;
  isActive: boolean;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <TextRegular
      {...rest}
      className={`flex rounded-lg p-2 w-full items-center text-text-minor-emphasis hover:text-text hover:bg-surface-light cursor-pointer transition ${
        isActive ? 'bg-surface-dark! text-text-light!' : ''
      } ${className}`}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </TextRegular>
  );
}

export default SideNav;
