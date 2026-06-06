import type { Metadata } from "next";

import SideNav, {
  NavBar as SideNavNavBar,
  ToggleButton as SideNavToggle,
} from "../_ui/SideNav";

export const metadata: Metadata = {
  title: "Cimientos",
};

// TODO remove async?
export default async function BaseAppLayout({
  children,
  navbar,
  ...props
}: { navbar?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="grid grid-cols-[16rem_1fr] h-screen max-bp-navbar-mobile:flex max-bp-navbar-mobile:flex-col font-app bg-background-app relative"
      {...props}
    >
      <aside className="max-bp-navbar-mobile:absolute">
        <SideNav>
          <SideNavNavBar />
          <SideNavToggle className="fixed top-2 right-4" />
        </SideNav>
      </aside>

      <main className="h-full overflow-y-auto">{children}</main>

      {navbar}
    </div>
  );
}
