function LandingSubhead({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { className, ...rest } = props;

  return (
    <h2
      {...rest}
      className={`text-primary-shade text-5xl font-semibold tracking-wide ${className}`}
    >
      {children}
    </h2>
  );
}

export default LandingSubhead;
