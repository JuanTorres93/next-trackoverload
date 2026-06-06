import type { Metadata } from "next";

import Navbar from "../_ui/Navbar/Navbar";
import SideNav, {
  NavBar as SideNavNavBar,
  ToggleButton as SideNavToggle,
} from "../_ui/SideNav";

export const metadata: Metadata = {
  title: "Cimientos",
};

export default async function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      id="sidebar-layout"
      className="grid grid-cols-[16rem_1fr] h-screen max-bp-navbar-mobile:flex max-bp-navbar-mobile:flex-col font-app bg-background-app relative"
    >
      <aside className="max-bp-navbar-mobile:absolute">
        <SideNav>
          <SideNavNavBar />
          <SideNavToggle className="fixed top-2 right-4" />
        </SideNav>
      </aside>

      <main className="h-full overflow-y-auto">{children}</main>

      <Navbar className="fixed bottom-0 w-full" />
    </div>
  );
}
