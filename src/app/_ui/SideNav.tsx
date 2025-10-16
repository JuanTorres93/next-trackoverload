'use client';

import Link from 'next/link';
// import { HiCreditCard } from 'react-icons/hi2';
import { usePathname } from 'next/navigation';
import {
  HiHome,
  HiBeaker,
  HiBookOpen,
  HiSquares2X2,
  HiFire,
  HiUserCircle,
  HiCreditCard,
  HiPresentationChartBar,
  HiClipboardDocumentList,
  HiCalendarDays,
} from 'react-icons/hi2';
function NavItem({
  icon,
  isActive,
  children,
}: {
  icon: React.ReactNode;
  isActive: boolean;
  children?: React.ReactNode;
}) {
  return (
    <li
      className={`flex rounded-lg text-base p-2 w-full items-center text-zinc-500 hover:text-zinc-800 text-md  cursor-pointer transition ${
        isActive ? 'bg-neutral-100 text-zinc-800' : ''
      }`}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </li>
  );
}

function SideNav() {
  const pathname = usePathname();

  const links = [
    { href: '/app', label: 'Inicio', icon: <HiHome /> },
    { href: '/app/ingredients', label: 'Ingredientes', icon: <HiBeaker /> },
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

  return (
    <nav>
      <ul className="flex flex-col gap-1 p-4 w-full">
        {/* TODO: PONER EL LOGO Arriba de la navbar */}

        {links.map((link) => (
          <Link key={link.href} href={link.href} passHref>
            <NavItem icon={link.icon} isActive={pathname === link.href}>
              {link.label}
            </NavItem>
          </Link>
        ))}

        {/* TODO: Poner abajo menú de usuario */}
      </ul>
    </nav>
  );
}

export default SideNav;
