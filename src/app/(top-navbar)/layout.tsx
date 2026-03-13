import { Suspense } from 'react';
import NavBar from '@/app/_features/marketing/landing/NavBar';

// Shown instantly while NavBar is resolving its async work (reading the auth cookie).
// Matches NavBar's height so the layout doesn't shift when it streams in.
function NavBarFallback() {
  return (
    <div className="fixed top-0 left-0 z-10 w-full h-[65px] bg-surface-card shadow-sm" />
  );
}

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id="marketing-layout">
      <main className="h-full overflow-y-auto">
        {/*
          NavBar is an async Server Component: it awaits the cookie store to check
          whether the user is logged in. Without Suspense, Next.js would wait for
          that async work to finish before sending *any* HTML to the browser —
          blocking the First Contentful Paint.

          Wrapping it in <Suspense> tells Next.js to stream the page in two chunks:
            1. Everything outside NavBar (Hero, sections…) is sent immediately.
            2. NavBar HTML is sent as a second chunk once the cookie check resolves.

          The fallback is rendered in the first chunk so the user sees a navbar
          placeholder right away instead of a blank header area.
        */}
        <Suspense fallback={<NavBarFallback />}>
          <NavBar className="fixed top-0 left-0 z-10 w-full" />
        </Suspense>

        {children}
      </main>
    </div>
  );
}
