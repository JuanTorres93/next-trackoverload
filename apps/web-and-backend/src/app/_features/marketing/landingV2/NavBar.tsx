"use server";

import Link from "next/link";

import { twMerge } from "tailwind-merge";

import TextEnormous from "@/app/_ui/typography/TextEnormous";
import TextRegular from "@/app/_ui/typography/TextRegular";

import Logo from "../../../_ui/Logo";
import ButtonPrimary from "../../../_ui/buttons/ButtonPrimary";
import { getCurrentUserId } from "../../../_utils/auth/getCurrentUserId";
import ButtonCTA from "../landing/ButtonCTA";
import { NavLinkType } from "./NavLinkType";

async function NavBar({
  items = navItems,
  ...props
}: {
  items?: NavLinkType[];
} & React.HTMLAttributes<HTMLElement>) {
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
      className={twMerge(
        `grid grid-rows-1 grid-cols-[max-content_1fr_max-content] px-8 items-center gap-24 py-4 z-20`,
        className,
      )}
      {...rest}
    >
      <Link href="/" className="flex items-center justify-center gap-2">
        <Logo size={40} />

        <TextEnormous as="span" className="mt-1 font-medium">
          Cimientos
        </TextEnormous>
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

const navItems: NavLinkType[] = [
  { name: "About", href: "/#about" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Features", href: "/#features" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Pricing", href: "/#pricing" },
];

function NavItem({ navItem }: { navItem: NavLinkType }) {
  return (
    <TextRegular
      as={Link}
      href={navItem.href}
      className="px-4 py-2 transition rounded-full hover:bg-neutral"
    >
      {navItem.name}
    </TextRegular>
  );
}

export default NavBar;
