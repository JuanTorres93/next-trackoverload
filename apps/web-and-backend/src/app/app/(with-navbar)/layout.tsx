import Navbar from "@/app/_ui/Navbar/Navbar";

import BaseAppLayout from "../baseAppLayout";

// TODO remove async?
export default async function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseAppLayout
      id="sidebar-layout"
      navbar={<Navbar className="fixed bottom-0 w-full" />}
    >
      {children}
    </BaseAppLayout>
  );
}
