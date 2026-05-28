"use server";

import Link from "next/link";

import { twMerge } from "tailwind-merge";

import Logo from "../../../_ui/Logo";
import ButtonPrimary from "../../../_ui/buttons/ButtonPrimary";
import { getCurrentUserId } from "../../../_utils/auth/getCurrentUserId";
import ButtonCTA from "../landing/ButtonCTA";

async function NavBar({
  items = navItems,
  ...props
}: {
  items?: NavItemType[];
} & React.HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;

  let isLoggedIn;

  try {
    await getCurrentUserId();
    isLoggedIn = true;
  } catch {
    isLoggedIn = false;
  }

  // TODO IMPORTANT: Finish styling when design is finished
  return (
    <nav
      className={twMerge(
        `grid grid-rows-1 grid-cols-[max-content_1fr_max-content] px-8 items-center gap-24 py-4 z-20`,
        className,
      )}
      {...rest}
    >
      <Link href="/" className="flex items-center gap-2">
        <Logo size={40} />

        <span className="text-2xl font-medium">Cimientos</span>
      </Link>

      <ul className="flex items-center justify-center ">
        {items.map((item) => (
          <li key={item.name}>
            <NavItem navItem={item} />
          </li>
        ))}
      </ul>

      {isLoggedIn && <ButtonPrimary href="/app">Ir a la app</ButtonPrimary>}

      {!isLoggedIn && (
        <ButtonCTA
          href="/auth/register"
          className="border-none bg-text text-text-light hover:bg-text/80"
          showIcon={false}
        >
          Start Your Journey
        </ButtonCTA>
      )}
    </nav>
  );
}

type NavItemType = {
  name: string;
  href: string;
};

const navItems: NavItemType[] = [
  { name: "About", href: "/#about" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Features", href: "/#features" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Pricing", href: "/#pricing" },
];

function NavItem({ navItem }: { navItem: NavItemType }) {
  return (
    <Link
      href={navItem.href}
      className="px-4 py-2 text-base transition rounded-full hover:bg-neutral"
    >
      {navItem.name}
    </Link>
  );
}

export default NavBar;
