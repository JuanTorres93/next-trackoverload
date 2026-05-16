function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex items-center justify-center w-dvw min-h-dvh overflow-hidden bg-surface-light px-4 py-20">
      {/* Decorative gradient blobs */}
      <div
        aria-hidden
        className="absolute -top-48 -left-48 w-[450px] h-[450px] rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-48 -right-48 w-[450px] h-[450px] rounded-full bg-primary/8 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-primary-light/6 blur-3xl pointer-events-none"
      />
      {children}
    </main>
  );
}

export default AuthPageLayout;
