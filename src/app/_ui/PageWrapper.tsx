function PageWrapper({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={`p-6 max-w-7xl ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default PageWrapper;
