import BaseAppLayout from "../baseAppLayout";

export default function NoNavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BaseAppLayout id="sidebar-layout">{children}</BaseAppLayout>;
}
