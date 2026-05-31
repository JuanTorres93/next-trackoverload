"use client";

import Link from "next/link";

import { useState } from "react";

import { CgClose, CgMenuRight } from "react-icons/cg";
import { twMerge } from "tailwind-merge";

import TextEnormous from "@/app/_ui/typography/TextEnormous";
import TextRegular from "@/app/_ui/typography/TextRegular";

import Logo from "../../../_ui/Logo";
import ButtonPrimary from "../../../_ui/buttons/ButtonPrimary";
import ButtonCTA from "../ButtonCTA";
import { NavLinkType } from "./NavLinkType";

function NavBar({
  items = navItems,
  ...props
}: {
  items?: NavLinkType[];
} & React.HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = false;

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  return (
    <nav
      className={twMerge(
        `grid relative grid-rows-1 grid-cols-[max-content_1fr_max-content] px-8 items-center gap-24 py-4 z-20 max-bp-landing-navbar:grid-cols-[min-content_1fr]`,
        className,
      )}
      {...rest}
    >
      <ButtonMenu toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

      <Menu isOpen={isMenuOpen} items={items} toggleMenu={toggleMenu} />

      <Link
        href="/"
        className="z-10 flex items-center justify-center gap-2 max-bp-landing-navbar:pr-24"
      >
        <Logo size={40} />

        <TextEnormous as="span" className="mt-1 font-medium">
          Cimientos
        </TextEnormous>
      </Link>

      <ul className="flex items-center justify-center max-bp-landing-navbar:hidden ">
        {items.map((item) => (
          <li key={item.name}>
            <NavItem navItem={item} />
          </li>
        ))}
      </ul>

      {isLoggedIn && (
        <ButtonPrimary className="max-bp-landing-navbar:hidden" href="/app">
          Ir a la app
        </ButtonPrimary>
      )}

      {!isLoggedIn && (
        <ButtonCTA
          href="/auth/register"
          className="py-3! border-none bg-text text-text-light hover:bg-text/80 max-bp-landing-navbar:hidden"
          showIcon={false}
        >
          Start Your Journey
        </ButtonCTA>
      )}
    </nav>
  );
}

function Menu({
  isOpen,
  items = navItems,
  toggleMenu,
}: {
  isOpen: boolean;
  items: NavLinkType[];
  toggleMenu: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-5">
      <ul className="flex flex-col items-center justify-start h-full gap-8 pt-35">
        {items.map((item) => (
          <li key={item.name} onClick={toggleMenu}>
            <NavItem navItem={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

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

function ButtonMenu({
  toggleMenu,
  isMenuOpen,
}: {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}) {
  return (
    <button className="hidden p-1 z-10 cursor-pointer transform-[rotateY(180deg)] max-bp-landing-navbar:block">
      {isMenuOpen ? (
        <CgClose size={24} onClick={toggleMenu} />
      ) : (
        <CgMenuRight size={24} onClick={toggleMenu} />
      )}
    </button>
  );
}

const navItems: NavLinkType[] = [
  { name: "About", href: "/#about" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Features", href: "/#features" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Pricing", href: "/#pricing" },
];

export default NavBar;
