function PageWrapper({ children }: { children: React.ReactNode }) {
  return <div className="p-6 max-w-7xl">{children}</div>;
}

export default PageWrapper;
