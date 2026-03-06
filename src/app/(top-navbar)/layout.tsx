import NavBar from '@/app/_features/marketing/landing/NavBar';

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id="marketing-layout">
      <main className="h-full overflow-y-auto">
        <NavBar className="fixed top-0 left-0 z-10 w-full" />

        {children}
      </main>
    </div>
  );
}
