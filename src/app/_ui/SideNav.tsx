'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import {
  HiBars3,
  HiBookOpen,
  HiCalendarDays,
  HiClipboardDocumentList,
  HiCreditCard,
  HiFire,
  HiHome,
  HiMiniXMark,
  HiSquares2X2,
  HiUserCircle,
} from 'react-icons/hi2';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import SpinnerMini from './SpinnerMini';
import { useScreenResize } from '../_hooks/useScreenResize';
import Logo from './Logo';
import TextRegular from './typography/TextRegular';

type SideNavContextType = {
  navbarShown: boolean;
  setNavbarShown: React.Dispatch<React.SetStateAction<boolean>>;
  toggleNavBar: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileLayout: boolean;
  pathname: string;
  isNavigating: boolean;
  setIsNavigating: React.Dispatch<React.SetStateAction<boolean>>;
  nextRoute: string | null;
  setNextRoute: React.Dispatch<React.SetStateAction<string | null>>;
};

const SideNavContext = createContext<SideNavContextType | null>(null);

function SideNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [navbarShown, setNavbarShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const toggleNavBar = () => {
    setNavbarShown((prev) => !prev);
  };

  // Read from the single source of truth: --breakpoint-bp-navbar-mobile in globals.css
  const getNavbarMobileBreakpoint = useCallback((): number => {
    if (typeof window === 'undefined') return 0;

    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--breakpoint-bp-navbar-mobile')
      .trim();

    return parseInt(raw, 10);
  }, []);

  useScreenResize(getNavbarMobileBreakpoint(), (width) => {
    // Automatically hide navbar if we go above the mobile breakpoint, and show it if we go below
    if (width >= getNavbarMobileBreakpoint()) {
      setNavbarShown(true);
      setIsMobileLayout(false);
    } else {
      setNavbarShown(false);
      setIsMobileLayout(true);
    }
  });

  const value = {
    navbarShown,
    setNavbarShown,
    toggleNavBar,
    isLoading,
    setIsLoading,
    isMobileLayout,
    pathname,
    isNavigating,
    setIsNavigating,
    nextRoute,
    setNextRoute,
  };

  return (
    <SideNavContext.Provider value={value}>{children}</SideNavContext.Provider>
  );
}

function NavBar() {
  const router = useRouter();
  const {
    isLoading,
    setIsLoading,
    navbarShown: showNavBar,
    toggleNavBar,
  } = useSideNavContext();

  const links: NavbarLink[] = [
    { href: '/app', label: 'Inicio', icon: <HiHome /> },
    { href: '/app/recipes', label: 'Recetas', icon: <HiBookOpen /> },
    { href: '/app/meals', label: 'Comidas', icon: <HiCalendarDays /> },
  ];

  // TODO IMPORTANT: Move unimplemented links to links once they are implemented
  const unimplementedLinks: NavbarLink[] = [
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

  if (process.env.NODE_ENV !== 'production') {
    links.push(...unimplementedLinks);
  }

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

  if (!showNavBar) {
    return null;
  }

  return (
    <nav className="h-full max-bp-navbar-mobile:fixed max-bp-navbar-mobile:inset-0 max-bp-navbar-mobile:z-30 max-bp-navbar-mobile:backdrop-blur-md max-bp-navbar-mobile:h-dvh max-bp-navbar-mobile:bg-background/80">
      <ul className="flex flex-col w-full h-full gap-1 p-4">
        <li className="flex items-center justify-center mb-4">
          {/* <Link href="/app"> */}
          <Logo />
          {/* </Link> */}
        </li>

        {links.map((link) => (
          <li key={link.href}>
            <NavLink link={link} />
          </li>
        ))}

        <li className="mt-auto">
          <NavItem
            icon={isLoading ? <SpinnerMini /> : <FiLogOut />}
            isCurrentItem={false}
            onClick={() => {
              // Logout user
              handleLogout();
              // Keep the navbar open on mobile so the user can see the spinner and that the logout is processing (NavItem onClick will close automatically the navbar)
              toggleNavBar();
            }}
            data-testid="logout-button"
          >
            Cerrar sesión
          </NavItem>
        </li>
      </ul>
    </nav>
  );
}

function ToggleButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const { toggleNavBar, navbarShown } = useSideNavContext();

  return (
    <button
      {...rest}
      className={`z-40 hidden p-2 rounded-full shadow-sm cursor-pointer bg-surface-light text-surface-dark max-bp-navbar-mobile:block transition duration-200 ${
        navbarShown && 'bg-surface-dark! text-surface-light!'
      } ${className}`}
      onClick={toggleNavBar}
    >
      {!navbarShown && <HiBars3 size={30} />}
      {navbarShown && <HiMiniXMark size={30} strokeWidth={0.1} />}
    </button>
  );
}

function NavLink({
  link,
  onClick,
}: {
  link: NavbarLink;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const {
    pathname,
    toggleNavBar,
    isMobileLayout,
    isNavigating,
    setIsNavigating,
    nextRoute,
    setNextRoute,
  } = useSideNavContext();
  const [queueToggleNavBar, setQueueToggleNavBar] = useState(false);

  const wantsToNavigateToCurrentRoute = nextRoute === link.href;

  useEffect(() => {
    if (queueToggleNavBar && isMobileLayout && !isNavigating) {
      toggleNavBar();
      setQueueToggleNavBar(false);
    }
  }, [queueToggleNavBar, toggleNavBar, isMobileLayout, isNavigating]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wantsToNavigateToCurrentRoute) {
      setIsNavigating(true);
      setNextRoute(link.href);
    }

    if (isMobileLayout) {
      setQueueToggleNavBar(true);
    }

    onClick?.(e);
  };

  const icon =
    isNavigating && nextRoute === link.href ? <SpinnerMini /> : link.icon;

  return (
    <Link href={link.href}>
      <NavItem
        icon={icon}
        isCurrentItem={pathname === link.href}
        onClick={handleClick}
      >
        {link.label}
      </NavItem>
    </Link>
  );
}

function NavItem({
  icon,
  isCurrentItem,
  children,
  ...props
}: {
  icon: React.ReactNode;
  isCurrentItem: boolean;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <TextRegular
      {...rest}
      className={`flex rounded-lg p-2 w-full items-center text-text-minor-emphasis hover:text-text hover:bg-surface-light cursor-pointer transition ${
        isCurrentItem ? 'bg-surface-dark! text-text-light!' : ''
      }
       ${className}`}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </TextRegular>
  );
}

function useSideNavContext() {
  const contextValue = useContext(SideNavContext);

  if (!contextValue) {
    throw new Error('useSideNavContext must be used within a SideNavProvider');
  }

  return contextValue;
}

type NavbarLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

SideNav.NavBar = NavBar;
SideNav.ToggleButton = ToggleButton;

export { NavBar, ToggleButton };
export default SideNav;
