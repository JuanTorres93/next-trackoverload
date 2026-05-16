"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
} from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import { extractCssVariable } from "../_common/extractCssVariableFromGlobalsCssFile";
import LogoutButton from "../_features/auth/LogoutButton";
import { useScreenResize } from "../_hooks/useScreenResize";
import Logo from "./Logo";
import SpinnerMini from "./SpinnerMini";

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
    const raw = extractCssVariable("--breakpoint-bp-navbar-mobile");

    return raw ? parseInt(raw, 10) : 0;
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
  const { navbarShown, isMobileLayout, setNavbarShown } = useSideNavContext();

  const links: NavbarLink[] = [
    { href: "/app", label: "Inicio", icon: <HiHome /> },
    { href: "/app/recipes", label: "Recetas", icon: <HiBookOpen /> },
    {
      href: "/app/meals",
      label: "Planificación comidas",
      icon: <HiCalendarDays />,
    },
    { href: "/app/subscription", label: "Suscripción", icon: <HiCreditCard /> },
  ];

  // TODO IMPORTANT: Move unimplemented links to links once they are implemented
  const unimplementedLinks: NavbarLink[] = [
    { href: "/app/templates", label: "Plantillas", icon: <HiSquares2X2 /> },
    { href: "/app/workouts", label: "Entrenos", icon: <HiFire /> },
    {
      href: "/app/exercises",
      label: "Ejercicios",
      icon: <HiClipboardDocumentList />,
    },
    { href: "/app/profile", label: "Perfil", icon: <HiUserCircle /> },
  ];

  if (process.env.NODE_ENV !== "production") {
    links.push(...unimplementedLinks);
  }

  if (!navbarShown) return null;

  return (
    <>
      {/* Dark backdrop — mobile only, closes nav on click */}
      {isMobileLayout && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setNavbarShown(false)}
        />
      )}

      {/* Sidebar panel */}
      <nav
        className={twMerge(
          "flex flex-col h-full bg-surface-card border-r border-border/30",
          "max-bp-navbar-mobile:fixed max-bp-navbar-mobile:inset-y-0 max-bp-navbar-mobile:left-0",
          "max-bp-navbar-mobile:w-64 max-bp-navbar-mobile:z-40",
          "max-bp-navbar-mobile:animate-slide-in-from-left",
        )}
      >
        {/* Header: logo + brand */}
        <div className="flex items-center gap-3 px-5 py-6 shrink-0">
          <Logo size={34} />
          <div className="leading-none">
            <p className="text-sm font-semibold tracking-wide text-text">
              Cimientos
            </p>
            <p className="text-[10px] text-text-minor-emphasis uppercase tracking-[0.1em] mt-0.5">
              Dashboard
            </p>
          </div>
        </div>

        <div className="h-px mx-4 bg-border/30 shrink-0" />

        {/* Navigation links */}
        <ul className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink link={link} />
            </li>
          ))}
        </ul>

        <div className="h-px mx-4 bg-border/30 shrink-0" />

        {/* Footer: logout */}
        <div className="p-3 shrink-0">
          <LogoutButton />
        </div>
      </nav>
    </>
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
      className={twMerge(
        "z-40 hidden max-bp-navbar-mobile:flex items-center justify-center",
        "w-10 h-10 rounded-xl cursor-pointer transition-all duration-200",
        "bg-surface-card text-text-minor-emphasis hover:text-text shadow-md border border-border/40",
        className,
      )}
      onClick={toggleNavBar}
    >
      {navbarShown ? <HiMiniXMark size={22} /> : <HiBars3 size={22} />}
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
    <div
      {...rest}
      className={twMerge(
        "relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium",
        "transition-colors duration-150 cursor-pointer",
        "text-text-minor-emphasis hover:text-text hover:bg-surface-light",
        isCurrentItem && "text-primary bg-surface-hover font-semibold",
        className,
      )}
    >
      {/* Active indicator pill */}
      {isCurrentItem && (
        <span className="absolute left-0 inset-y-2 w-0.5 rounded-r-full bg-primary" />
      )}
      <span className="flex-shrink-0 text-base">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function useSideNavContext() {
  const contextValue = useContext(SideNavContext);

  if (!contextValue) {
    throw new Error("useSideNavContext must be used within a SideNavProvider");
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
