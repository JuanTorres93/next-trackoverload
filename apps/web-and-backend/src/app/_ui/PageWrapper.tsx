function PageWrapper({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={`p-1.5 relative h-screen ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default PageWrapper;
